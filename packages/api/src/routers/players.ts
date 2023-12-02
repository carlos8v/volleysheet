import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq, sql, schema } from "@volleysheet/db";

const orderMap = new Map([
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
    .input(z.enum(["E", "D", "C", "B", "A", "S", "ALL"]).default("ALL"))
    .query(async ({ ctx, input }) => {
      const orderByScore = orderMap.get(input);

      return await ctx.db
        .select({
          id: schema.players.id,
          name: schema.players.name,
          score: schema.stats.score,
          jerseyNumber: schema.players.jerseyNumber,
        })
        .from(schema.players)
        .innerJoin(schema.stats, eq(schema.stats.playerId, schema.players.id))
        .where(
          ({ score }) =>
            sql`${score} >= ${orderByScore} and ${score} <= ${
              orderByScore ? orderByScore + 4 : 30
            }`,
        )
        .orderBy(schema.players.name);
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
