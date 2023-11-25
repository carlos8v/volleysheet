import mysql from "mysql2/promise";
import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import { drizzle as planetscaleDrizzle } from "drizzle-orm/planetscale-serverless";

import { Client } from "@planetscale/database";

import { env } from "@/env";
import * as schema from "./schema";

const connection = await mysql.createConnection(env.DATABASE_URL);

export const db =
  env.NODE_ENV === "production"
    ? planetscaleDrizzle(
        new Client({
          url: env.DATABASE_URL,
        }).connection(),
        {
          schema,
        },
      )
    : mysqlDrizzle(connection);
