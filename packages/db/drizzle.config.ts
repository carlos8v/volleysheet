import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
  tablesFilter: ["volleysheet_*"],
} satisfies Config;
