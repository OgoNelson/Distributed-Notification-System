// consul.module.ts
import { Module } from "@nestjs/common"
import { ConsulService } from "./consul.service"

@Module({
  providers: [ConsulService],
  exports: [ConsulService], // <--- important
})
export class ConsulModule {}
