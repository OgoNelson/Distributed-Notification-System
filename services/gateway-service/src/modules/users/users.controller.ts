import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { ConsulService } from "../../consul/consul.service"

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly consulService: ConsulService,
  ) {}

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: any) {
    const userServiceUrl =
      await this.consulService.getServiceAddress("user-service")
    if (!userServiceUrl)
      throw new BadRequestException("User service unavailable")

    const res = await this.usersService.forwardToUserService(
      "POST",
      "/api/v1/users",
      body,
    )

    return {
      success: res?.success ?? true,
      data: res?.data || null,
      message: res?.message || "User created",
    }
  }

  @Patch("/:id")
  async updateUser(@Param("id") id: string, @Body() body: any) {
    const userServiceUrl =
      await this.consulService.getServiceAddress("user-service")
    if (!userServiceUrl)
      throw new BadRequestException("User service unavailable")

    const res = await this.usersService.forwardToUserService(
      "PATCH",
      `/api/v1/users/${id}`,
      body,
    )

    return {
      success: res?.success ?? true,
      data: res?.data || null,
      message: res?.message || "User updated",
    }
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param("id") id: string) {
    const userServiceUrl =
      await this.consulService.getServiceAddress("user-service")
    if (!userServiceUrl)
      throw new BadRequestException("User service unavailable")

    await this.usersService.forwardToUserService(
      "DELETE",
      `/api/v1/users/${id}`,
      undefined,
    )
  }
}
