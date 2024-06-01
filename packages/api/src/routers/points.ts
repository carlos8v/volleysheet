import { z } from "zod";

import { count, sql } from "@volleysheet/db";
import * as schema from "@volleysheet/db/schema";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const pointsRouter = createTRPCRouter({
  score: publicProcedure
    .input(
      z.object({
        position: z.object({
          x: z.number(),
          y: z.number(),
        }),
        playerId: z.string().uuid(),
        type: z.enum(["ATTACK", "SERVE", "BLOCK"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(schema.points).values({
        positionX: input.position.x,
        positionY: input.position.y,
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
