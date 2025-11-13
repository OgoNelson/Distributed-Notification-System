import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { NotificationsModule } from "./modules/notifications/notifications.module"
import { RabbitMQProvider } from "./modules/queues/rabbitmq.provider"
import { UsersModule } from "./modules/users/users.module"
import { SwaggerModule } from "./swagger/swaggerModule"
import { ConsulService } from "./consul/consul.service"
import { HealthController } from "./health/health.controller"

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    NotificationsModule,
    UsersModule,
    SwaggerModule,
  ],
  controllers: [HealthController],
  providers: [RabbitMQProvider, ConsulService],
  exports: [RabbitMQProvider],
})
export class AppModule {}
