import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

import { env } from "@/env";

const connection = await mysql.createConnection(env.DATABASE_URL);

export const db = drizzle(connection);
