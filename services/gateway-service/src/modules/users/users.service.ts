import { Injectable, Logger } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import * as CircuitBreaker from "opossum"
import { ConsulService } from "../../consul/consul.service"

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  private breaker: CircuitBreaker<[string, string, any?], any>

  constructor(
    private http: HttpService,
    private readonly consulService: ConsulService,
  ) {
    // Circuit breaker options
    const options = {
      timeout: 3000, // 3s request timeout
      errorThresholdPercentage: 50, // Trip after 50% failures
      resetTimeout: 10000, // Retry after 10s
    }

    this.breaker = new CircuitBreaker(this.callUserService.bind(this), options)

    this.breaker.on("open", () =>
      this.logger.warn("⚠️ Circuit breaker opened for User Service"),
    )
    this.breaker.on("halfOpen", () =>
      this.logger.log("🟡 Circuit breaker half-open, retrying..."),
    )
    this.breaker.on("close", () =>
      this.logger.log("✅ Circuit breaker closed, User Service healthy again"),
    )
  }

  // Public method called by controllers or other services
  async forwardToUserService(method: string, path: string, data?: any) {
    try {
      return await this.breaker.fire(method, path, data)
    } catch (error: any) {
      this.logger.error("❌ User Service unavailable:", error.message)
      return {
        success: false,
        message: "User Service temporarily unavailable",
        error: error.message,
      }
    }
  }

  // Circuit breaker calls this method
  private async callUserService(method: string, path: string, data?: any) {
    // Dynamically get base URL from Consul
    const baseUrl = await this.consulService.getServiceAddress("user-service")
    if (!baseUrl) throw new Error("User service not found in Consul")

    const url = `${baseUrl}${path}`
    const res = await lastValueFrom(
      this.http.request({
        method,
        url,
        data,
        timeout: 3000, // Request timeout
      }),
    )

    return res.data
  }
}
