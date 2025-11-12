import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { HttpModule } from "@nestjs/axios"
import { ConsulModule } from "../../consul/consul.module"

@Module({
  imports: [HttpModule, ConsulModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
