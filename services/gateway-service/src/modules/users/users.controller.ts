import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Headers,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { ConsulService } from "../../consul/consul.service"

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly consulService: ConsulService,
  ) {}

  // --- NEW LOGIN ENDPOINT ---
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() body: any) {
    // This forwards the user's credentials (e.g., email and password)
    // to the downstream Laravel service. That service is responsible for
    // validating the credentials and returning a JWT token.

    // IMPORTANT: You MUST confirm the exact login path with the Laravel developer.
    // It might be "/api/v1/login", "/api/v1/auth/token", or something else.
    const loginPath = "/api/v1/auth/login"

    return await this.usersService.forwardToUserService("POST", loginPath, body)
  }
  // --- END OF NEW ENDPOINT ---

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: any) {
    const res = await this.usersService.forwardToUserService(
      "POST",
      "/api/v1/auth/register",
      body,
    )

    return {
      success: res?.success ?? true,
      data: res?.data || null,
      message: res?.message || "User created",
    }
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findUser(@Headers() headers: Record<string, string>) {
    const res = await this.usersService.forwardToUserService(
      "GET",
      "/api/v1/user",
      undefined,
      headers,
    )

    return {
      success: res?.success ?? true,
      data: res?.data || null,
      message: res?.message || "Users retrieved successfully",
    }
  }

  @Patch("/")
  async updateUser(
    @Body() body: any,
    @Headers() headers: Record<string, string>,
  ) {
    const res = await this.usersService.forwardToUserService(
      "PATCH",
      `/api/v1/user`,
      body,
      headers,
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
    await this.usersService.forwardToUserService(
      "DELETE",
      `/api/v1/users/${id}`,
      undefined,
    )
  }
}
