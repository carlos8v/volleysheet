// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `volleysheet_${name}`);

export const players = mysqlTable(
  "players",
  {
    id: varchar("id", { length: 256 })
      .$defaultFn(() => randomUUID())
      .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    photoUrl: varchar("photoUrl", { length: 256 }),
    country: varchar("country", { length: 3 }).default("BRA"),
    handedness: mysqlEnum("handedness", ["UNKNOWN", "LEFT", "RIGHT"]).default(
      "RIGHT",
    ),
    age: int("age"),
    height: int("height"),
    jerseyNumber: int("jerseyNumber").notNull(),
    position: mysqlEnum("position", [
      "UNKNOWN",
      "LIBERO",
      "OPPOSITE",
      "SETTER",
      "WING_SPIKER",
      "MIDDLE_BLOCKER",
    ]),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (player) => ({
    playerUniqueId: unique().on(player.id),
    nameIndex: index("name_idx").on(player.name),
  }),
);

export const stats = mysqlTable(
  "stats",
  {
    playerId: varchar("playerId", { length: 256 }).notNull(),
    stamina: int("stamina"),
    attack: int("attack"),
    defence: int("defence"),
    block: int("block"),
    set: int("set"),
    serve: int("serve"),
    score: int("score"),
  },
  (stat) => ({
    statUniqueId: unique().on(stat.playerId),
  }),
);

export const statsRelations = relations(stats, ({ one }) => ({
  player: one(players, {
    fields: [stats.playerId],
    references: [players.id],
  }),
}));
