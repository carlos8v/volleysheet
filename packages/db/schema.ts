// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { randomUUID } from "crypto";
import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  double,
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
    ])
      .notNull()
      .default("UNKNOWN"),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (player) => ({
    playerIdIdx: index("id_idx").on(player.id),
    playerIdUnique: unique().on(player.id),
  }),
);

export type Player = InferSelectModel<typeof players>;

export const stats = mysqlTable(
  "stats",
  {
    playerId: varchar("playerId", { length: 256 }).notNull(),
    stamina: int("stamina").notNull().default(0),
    attack: int("attack").notNull().default(0),
    defence: int("defence").notNull().default(0),
    block: int("block").notNull().default(0),
    set: int("set").notNull().default(0),
    serve: int("serve").notNull().default(0),
    score: int("score").notNull().default(0),
  },
  (stat) => ({
    playerIdIdx: index("player_id_idx").on(stat.playerId),
    playerIdUnique: unique().on(stat.playerId),
    score: index("score_idx").on(stat.score),
  }),
);

export type State = InferSelectModel<typeof stats>;

export const statsRelations = relations(stats, ({ one }) => ({
  player: one(players, {
    fields: [stats.playerId],
    references: [players.id],
  }),
}));

export const points = mysqlTable(
  "points",
  {
    id: varchar("id", { length: 256 })
      .$defaultFn(() => randomUUID())
      .notNull(),
    positionX: double("positionX", {
      precision: 5,
      scale: 2,
    }),
    positionY: double("positionY", {
      precision: 5,
      scale: 2,
    }),
    playerId: varchar("playerId", { length: 256 }).notNull(),
    type: mysqlEnum("type", ["ATTACK", "SERVE", "BLOCK"]).notNull(),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deletedAt"),
  },
  (points) => ({
    pointIdUnique: unique().on(points.id),
    playerIdIdx: index("player_id_idx").on(points.playerId),
  }),
);

export type Point = InferSelectModel<typeof points>;
