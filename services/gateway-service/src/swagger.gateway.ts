import { INestApplication, Injectable, Logger } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import merge from "lodash.merge"
import { FastifyInstance } from "fastify"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConsulService } from "./consul/consul.service"

interface MicroserviceSpec {
  name: string
  url: string
}

@Injectable()
export class SwaggerGateway {
  private readonly logger = new Logger(SwaggerGateway.name)
  private cachedSpec: any = null
  private lastFetched: number = 0
  private cacheTtl = 60 * 1000 // 1 minute cache

  constructor(
    private readonly httpService: HttpService,
    private readonly consulService: ConsulService,
  ) {}

  async setup(app: INestApplication) {
    const fastifyApp = app.getHttpAdapter().getInstance() as FastifyInstance

    // Endpoint to serve merged OpenAPI JSON dynamically
    fastifyApp.get("/swagger/api-docs.json", async (request, reply) => {
      try {
        // Use cached spec if not expired
        const now = Date.now()
        if (this.cachedSpec && now - this.lastFetched < this.cacheTtl) {
          return reply.send(this.cachedSpec)
        }

        const serviceNames = [
          "email-service",
          "push-service",
          "template-service",
          "user-service",
        ]
        const MICROSERVICES: MicroserviceSpec[] = []

        for (const name of serviceNames) {
          try {
            const serviceUrl = await this.consulService.getServiceAddress(name)
            if (!serviceUrl) {
              this.logger.warn(`Service ${name} not found in Consul`)
              continue
            }
            let path = "/docs/json"
            if (name === "user-service") path = "/api-docs/openapi.json" // user-service specific path
            MICROSERVICES.push({ name, url: `${serviceUrl}${path}` })
          } catch (err) {
            this.logger.warn(
              `Failed to get ${name} URL from Consul: ${err.message}`,
            )
          }
        }

        const specs = await Promise.all(
          MICROSERVICES.map(async svc => {
            try {
              const res = await lastValueFrom(this.httpService.get(svc.url))
              return res.data
            } catch (err) {
              this.logger.warn(
                `Failed to fetch ${svc.name} spec: ${err.message}`,
              )
              return {}
            }
          }),
        )

        const mergedSpec = specs.reduce((acc, spec) => merge(acc, spec), {
          openapi: "3.0.3",
          info: {
            title: "Unified API Gateway",
            version: "1.0.0",
            description: "Aggregated API documentation for all microservices",
          },
          paths: {},
          components: {},
        })

        this.cachedSpec = mergedSpec
        this.lastFetched = now

        reply.send(mergedSpec)
      } catch (err) {
        this.logger.error("Failed to merge microservice Swagger specs", err)
        reply.status(500).send({ error: "Failed to merge specs" })
      }
    })

    // Serve Swagger UI via NestJS + Fastify
    const config = new DocumentBuilder()
      .setTitle("Unified API Gateway")
      .setDescription("Aggregated API documentation for all microservices")
      .setVersion("1.0.0")
      .build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup("swagger", app, document, {
      swaggerOptions: {
        url: "/swagger/api-docs.json", // points to merged JSON
        explorer: true,
      },
    })
  }
}
