import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contracts, players, stats, teams } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const teamsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const teamsList = await ctx.db.select().from(teams).orderBy(teams.name);
    return teamsList.map(({ id, name }) => ({
      id,
      name,
      matches: 0,
      wins: 0,
      losses: 0,
    }));
  }),
  getPlayer: publicProcedure
    .input(z.object({ playerId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [player] = await ctx.db
        .select({
          id: players.id,
          name: players.name,
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
