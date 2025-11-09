import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import path from "path";

// Manually load your root .env file
dotenv.config({ path: path.resolve("../.env") });

export default defineConfig({
  // Where your Prisma schema lives
  schema: "prisma/schema.prisma",

  // Migration folder (optional)
  migrations: {
    path: "prisma/migrations",
  },

  // Classic engine (safe)
  engine: "classic",

  // Datasource connection
  datasource: {
    url: env("DATABASE_URL"),
  },
});
