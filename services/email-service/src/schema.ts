export const envSchema = {
  type: "object",
  required: [
    "PORT",
    "MAILTRAP_USER",
    "MAILTRAP_PASS",
    "NODE_ENV",
    "SERVICE_NAME",
    "CONSUL_HOST",
    "CONSUL_PORT",
    "RABBITMQ_CONNECTION_URL",
  ],
  properties: {
    PORT: { type: "number", default: 3001 },
    MAILTRAP_USER: { type: "string" },
    MAILTRAP_PASS: { type: "string" },
    DB_URL: { type: "string" },
    SERVICE_NAME: { type: "string" },
    CONSUL_HOST: { type: "string" },
    CONSUL_PORT: { type: "number" },
    NODE_ENV: { type: "string", default: "development" },
  },
};
