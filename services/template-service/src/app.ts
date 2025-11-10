import env from "@fastify/env";
import mysql from "@fastify/mysql";
import Fastify from "fastify";

import { template_routes } from "./routes.js";
import { envSchema as schema } from "./schema.js";

const app = Fastify({ logger: true });

await app.register(env, {
  confKey: "config",
  schema,
  dotenv: true,
});

app.register(mysql, {
  promise: true,
  connectionString: app.config.DB_URL,
});

app.register(template_routes, { prefix: "/api/v1/templates" });

app.get("/health", async (_request, reply) => {
  reply.send({ status: "ok" });
});

export default app;
