import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { mysqlTable, players, stats, statsRelations } from "./schema";
export const schema = { mysqlTable, players, stats, statsRelations };

export * from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
export const db = mysqlDrizzle(connection);
