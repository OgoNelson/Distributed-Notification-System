import "fastify"
import { MySQLPool } from "@fastify/mysql"
import { JWT } from "@fastify/jwt"
import { UserWithoutPassword } from "../models/user.model.js"

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number
      DB_URL: string
      NODE_ENV: "development" | "production"
      SERVICE_NAME: string
      CONSUL_HOST: string
      CONSUL_PORT: number
      JWT_SECRET: string
    }
    mysql: MySQLPool
    jwt: JWT
  }

  interface FastifyRequest {
    user?: UserWithoutPassword
  }
}
