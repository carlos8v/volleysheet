import { z } from "zod";

import { schema } from "@volleysheet/db";

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
});
