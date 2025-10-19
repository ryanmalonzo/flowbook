import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./sql",
  schema: "./db/schema",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint: use non-null assertion
    url: process.env.DATABASE_URL!,
  },
});
