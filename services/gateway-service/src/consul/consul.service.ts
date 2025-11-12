import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common"
import fetch from "node-fetch"

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ConsulService.name)
  private readonly CONSUL_HOST = process.env.CONSUL_HOST || "localhost"
  private readonly CONSUL_PORT = process.env.CONSUL_PORT || 8500
  private readonly SERVICE_NAME = process.env.SERVICE_NAME || "gateway-service"
  private readonly PORT = process.env.PORT || 3000

  async onModuleInit() {
    await this.registerService()
  }

  async onModuleDestroy() {
    await this.deregisterService()
  }

  public async registerService() {
    const serviceAddress =
      this.CONSUL_HOST === "localhost"
        ? "host.docker.internal"
        : this.SERVICE_NAME

    const body = {
      Name: this.SERVICE_NAME,
      ID: `${this.SERVICE_NAME}-${this.PORT}`,
      Address: serviceAddress,
      Port: Number(this.PORT),
      Check: {
        HTTP: `http://${serviceAddress}:${this.PORT}/health`,
        Interval: "10s",
      },
    }

    await fetch(
      `http://${this.CONSUL_HOST}:${this.CONSUL_PORT}/v1/agent/service/register`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    )

    this.logger.log(
      `[${this.SERVICE_NAME}] Registered with Consul at ${serviceAddress}:${this.PORT}`,
    )
  }

  public async deregisterService() {
    const serviceId = `${this.SERVICE_NAME}-${this.PORT}`
    try {
      await fetch(
        `http://${this.CONSUL_HOST}:${this.CONSUL_PORT}/v1/agent/service/deregister/${serviceId}`,
        { method: "PUT" },
      )
      this.logger.log(`[${this.SERVICE_NAME}] Deregistered from Consul`)
    } catch (err) {
      this.logger.error("Failed to deregister from Consul:", err)
    }
  }

  // Get service address dynamically
  async getServiceAddress(serviceName: string): Promise<string | null> {
    try {
      const res = await fetch(
        `http://${this.CONSUL_HOST}:${this.CONSUL_PORT}/v1/catalog/service/${serviceName}`,
      )

      // Tell TypeScript the response is an array of any objects
      const data = (await res.json()) as any[]

      if (!data || data.length === 0) {
        this.logger.warn(`Service [${serviceName}] not found in Consul`)
        return null
      }

      const service = data[0]
      return `http://${service.ServiceAddress}:${service.ServicePort}`
    } catch (err) {
      this.logger.error("Consul query failed:", err)
      return null
    }
  }
}
