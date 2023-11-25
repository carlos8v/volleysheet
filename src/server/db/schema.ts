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
  primaryKey,
  timestamp,
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
      .primaryKey()
      .$defaultFn(() => randomUUID())
      .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    position: mysqlEnum("position", [
      "UNKNOWN",
      "LIBERO",
      "OPPOSITE",
      "SETTER",
      "WING_SPIKER",
      "MIDDLE_BLOCKER",
    ]),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const playersRelations = relations(players, ({ many }) => ({
  contracts: many(contracts),
}));

export const stats = mysqlTable("stats", {
  playerId: varchar("id", { length: 256 }).primaryKey().notNull(),
  stamina: int("stamina"),
  attack: int("attack"),
  defence: int("defence"),
  block: int("block"),
  set: int("set"),
  serve: int("serve"),
});

export const statsRelations = relations(stats, ({ one }) => ({
  player: one(players, {
    fields: [stats.playerId],
    references: [players.id],
  }),
}));

export const teams = mysqlTable("teams", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => randomUUID())
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  operational: boolean("operational").default(true),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  contracts: many(contracts),
}));

export const contracts = mysqlTable(
  "contracts",
  {
    teamId: varchar("teamId", { length: 256 }).notNull(),
    playerId: varchar("playerId", { length: 256 }).notNull(),
  },
  (contract) => ({
    pk: primaryKey(contract.playerId, contract.teamId),
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
