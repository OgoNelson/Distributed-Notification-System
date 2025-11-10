export const envSchema = {
  type: "object",
  required: [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "SERVICE_NAME",
    "CONSUL_HOST",
    "CONSUL_PORT",
  ],
  properties: {
    PORT: { type: "number", default: 3001 },
    DB_URL: { type: "string" },
    SERVICE_NAME: { type: "string", default: "template-service" },
    CONSUL_HOST: { type: "string", default: "localhost" },
    CONSUL_PORT: { type: "number", default: 8500 },
    NODE_ENV: { type: "string", default: "development" },
  },
};
