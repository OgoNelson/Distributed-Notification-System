import { Provider, Logger } from "@nestjs/common"
import * as amqp from "amqplib"
import { ConsulService } from "../../consul/consul.service"

export const RabbitMQProvider: Provider = {
  provide: "RABBITMQ_CONNECTION",
  inject: [ConsulService],
  useFactory: async (consulService: ConsulService) => {
    const logger = new Logger("RabbitMQProvider")

    // Fetch RabbitMQ URL from Consul or fallback to env
    let url = process.env.RABBITMQ_URL
    if (!url) {
      try {
        const serviceAddress = await consulService.getServiceAddress("rabbitmq")
        if (!serviceAddress)
          throw new Error("RabbitMQ service not found in Consul")
        url = `amqp://${serviceAddress}` // ensure proper protocol
      } catch (err) {
        logger.error("Failed to fetch RabbitMQ URL from Consul", err.message)
        throw err
      }
    }

    if (!url) throw new Error("RABBITMQ URL not available")

    try {
      const conn = await amqp.connect(url)

      // Handle connection close events
      conn.on("error", err =>
        logger.error("RabbitMQ connection error:", err.message),
      )
      conn.on("close", () => logger.warn("RabbitMQ connection closed"))

      const channel = await conn.createChannel()

      const exchange = process.env.RABBITMQ_EXCHANGE || "notifications.direct"

      await channel.assertExchange(exchange, "direct", {
        durable: true,
        autoDelete: false,
      })

      // Optional prefetch
      await channel.prefetch(10)

      logger.log(`RabbitMQ connected, exchange: ${exchange}`)
      return { channel, exchange, connection: conn }
    } catch (err) {
      logger.error("Failed to establish RabbitMQ connection", err.message)
      throw err
    }
  },
}
