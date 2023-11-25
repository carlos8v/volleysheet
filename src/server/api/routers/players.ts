import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contracts, players, stats, teams } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const playersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: players.id,
        name: players.name,
        contract: {
          jerseyNumber: contracts.jerseyNumber,
        },
      })
      .from(players)
      .orderBy(desc(players.createdAt))
      .innerJoin(contracts, eq(contracts.playerId, players.id));
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
