import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contracts, players, stats, teams } from "@/server/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

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
          score: sql<number>`sum(
            ${stats.stamina} +
            ${stats.attack} +
            ${stats.defence} +
            ${stats.block} +
            ${stats.set} +
            ${stats.serve}
          )`.mapWith(Number),
          jerseyNumber: contracts.jerseyNumber,
        })
        .from(players)
        .innerJoin(stats, eq(stats.playerId, players.id))
        .innerJoin(contracts, eq(contracts.playerId, players.id))
        .groupBy(players.id, players.name, contracts.jerseyNumber)
        .having(
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
          stats: {
            stamina: stats.stamina,
            attack: stats.attack,
            defence: stats.defence,
            block: stats.block,
            set: stats.set,
            serve: stats.serve,
          },
        })
        .from(players)
        .where(eq(players.id, input.playerId))
        .innerJoin(stats, eq(stats.playerId, players.id))
        .limit(1);

      if (!player?.id) {
        throw new Error("Jogador não encontrado");
      }

      const [contract] = await ctx.db
        .select({
          team: teams.name,
          jerseyNumber: contracts.jerseyNumber,
          position: contracts.position,
          expiresDate: contracts.expiresDate,
        })
        .from(contracts)
        .where(and(eq(contracts.playerId, input.playerId)))
        .innerJoin(teams, eq(contracts.teamId, teams.id))
        .orderBy(desc(contracts.operational))
        .limit(1);

      if (!contract) {
        throw new Error("Jogador não tem contrato nesse time");
      }

      return {
        player,
        contract,
      };
    }),
});
