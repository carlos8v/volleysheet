import { z } from "zod";

import { asc, eq, schema, sql } from "@volleysheet/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

const selectScoreMap = new Map([
  ["ALL", 0],
  ["E", 5],
  ["D", 10],
  ["C", 15],
  ["B", 20],
  ["A", 25],
  ["S", 30],
]);

export const playersRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        rank: z.enum(["E", "D", "C", "B", "A", "S", "ALL"]).default("ALL"),
        order: z.enum(["name", "jersey"]).default("name"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const selectScore = selectScoreMap.get(input.rank);

      return await ctx.db
        .select({
          id: schema.players.id,
          name: schema.players.name,
          score: schema.stats.score,
          position: schema.players.position,
          jerseyNumber: schema.players.jerseyNumber,
        })
        .from(schema.players)
        .innerJoin(schema.stats, eq(schema.stats.playerId, schema.players.id))
        .where(
          ({ score }) =>
            sql`${score} >= ${selectScore} and ${score} <= ${
              selectScore ? selectScore + 4 : 30
            }`,
        )
        .orderBy(() => {
          if (input.order === "jersey") return asc(schema.players.jerseyNumber);
          return asc(schema.players.name);
        });
    }),
  getById: publicProcedure
    .input(z.object({ playerId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [player] = await ctx.db
        .select({
          id: schema.players.id,
          name: schema.players.name,
          photoUrl: schema.players.photoUrl,
          country: schema.players.country,
          handedness: schema.players.handedness,
          age: schema.players.age,
          height: schema.players.height,
          jerseyNumber: schema.players.jerseyNumber,
          position: schema.players.position,
          stats: {
            stamina: schema.stats.stamina,
            attack: schema.stats.attack,
            defence: schema.stats.defence,
            block: schema.stats.block,
            set: schema.stats.set,
            serve: schema.stats.serve,
            score: schema.stats.score,
          },
        })
        .from(schema.players)
        .innerJoin(schema.stats, eq(schema.stats.playerId, schema.players.id))
        .where(eq(schema.players.id, input.playerId))
        .limit(1);

      if (!player?.id) {
        throw new Error("Jogador não encontrado");
      }

      return player;
    }),
});
