import { z } from "zod";

import { count, schema, sql } from "@volleysheet/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const pointsRouter = createTRPCRouter({
  score: publicProcedure
    .input(
      z.object({
        playerId: z.string().uuid(),
        type: z.enum(["ATTACK", "SERVE", "BLOCK"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(schema.points).values({
        playerId: input.playerId,
        type: input.type,
      });
    }),
  getByPlayerId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const points = await ctx.db
        .select({
          type: schema.points.type,
          count: count(),
        })
        .from(schema.points)
        .groupBy(schema.points.type, schema.points.playerId)
        .having(sql`playerId = ${input}`);

      return {
        attack: points.find(({ type }) => type === "ATTACK")?.count ?? 0,
        serve: points.find(({ type }) => type === "SERVE")?.count ?? 0,
        block: points.find(({ type }) => type === "BLOCK")?.count ?? 0,
      };
    }),
});
