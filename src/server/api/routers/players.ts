import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { players, stats } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

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
          id: players.id,
          name: players.name,
          score: stats.score,
          jerseyNumber: players.jerseyNumber,
        })
        .from(players)
        .innerJoin(stats, eq(stats.playerId, players.id))
        .where(
          ({ score }) =>
            sql`${score} >= ${orderByScore} and ${score} <= ${
              orderByScore ? orderByScore + 4 : 30
            }`,
        )
        .orderBy(players.name);
    }),
  getById: publicProcedure
    .input(z.object({ playerId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [player] = await ctx.db
        .select({
          id: players.id,
          name: players.name,
          photoUrl: players.photoUrl,
          country: players.country,
          handedness: players.handedness,
          age: players.age,
          height: players.height,
          jerseyNumber: players.jerseyNumber,
          position: players.position,
          stats: {
            stamina: stats.stamina,
            attack: stats.attack,
            defence: stats.defence,
            block: stats.block,
            set: stats.set,
            serve: stats.serve,
            score: stats.score,
          },
        })
        .from(players)
        .innerJoin(stats, eq(stats.playerId, players.id))
        .where(eq(players.id, input.playerId))
        .limit(1);

      if (!player?.id) {
        throw new Error("Jogador não encontrado");
      }

      return player;
    }),
});
