import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export * from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = mysql.createPool(process.env.DATABASE_URL);
export const db = mysqlDrizzle(pool);
