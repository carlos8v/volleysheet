// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
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
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (player) => ({
    playerUniqueId: unique().on(player.id),
    nameIndex: index("name_idx").on(player.name),
  }),
);

export const playersRelations = relations(players, ({ many }) => ({
  contracts: many(contracts),
}));

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

export const teams = mysqlTable(
  "teams",
  {
    id: varchar("id", { length: 256 })
      .$defaultFn(() => randomUUID())
      .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    operational: boolean("operational").default(true),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (team) => ({
    teamUniqueId: unique().on(team.id),
  }),
);

export const teamsRelations = relations(teams, ({ many }) => ({
  contracts: many(contracts),
}));

export const contracts = mysqlTable(
  "contracts",
  {
    id: varchar("id", { length: 256 })
      .$defaultFn(() => randomUUID())
      .notNull(),
    jerseyNumber: int("jerseyNumber").notNull(),
    position: mysqlEnum("position", [
      "UNKNOWN",
      "LIBERO",
      "OPPOSITE",
      "SETTER",
      "WING_SPIKER",
      "MIDDLE_BLOCKER",
    ]),
    teamId: varchar("teamId", { length: 256 }).notNull(),
    operational: boolean("operational").default(true),
    expiresDate: timestamp("expiresDate"),
    playerId: varchar("playerId", { length: 256 }).notNull(),
  },
  (contract) => ({
    contractUniqueId: unique().on(contract.id),
  }),
);

export const contractsRelations = relations(contracts, ({ one }) => ({
  team: one(teams, {
    fields: [contracts.teamId],
    references: [teams.id],
  }),
  player: one(players, {
    fields: [contracts.playerId],
    references: [players.id],
  }),
}));
