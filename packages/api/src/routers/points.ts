import { z } from "zod";

import { and, count, eq, isNotNull, sql } from "@volleysheet/db";
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
    .input(
      z.object({
        playerId: z.string().uuid(),
        type: z.enum(["ALL", "ATTACK", "SERVE", "BLOCK"]).default("ALL"),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: schema.points.id,
          type: schema.points.type,
          positionX: schema.points.positionX,
          positionY: schema.points.positionY,
        })
        .from(schema.points)
        .where(
          and(
            ...(input.type !== "ALL"
              ? [eq(schema.points.type, input.type)]
              : []),
            eq(schema.points.playerId, input.playerId),
            isNotNull(schema.points.positionX),
            isNotNull(schema.points.positionY),
          ),
        );
    }),
  getLastWeekendPoints: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const today = new Date();

      const lastSaturdays: Date[] = [];
      const points = [];

      let lastSaturday = new Date(today);
      while (lastSaturday.getDay() !== 6) {
        lastSaturday.setDate(lastSaturday.getDate() - 1);
      }

      for (let i = 0; i < 4; i += 1) {
        const d = new Date(lastSaturday);
        d.setDate(lastSaturday.getDate() - 7 * i);
        lastSaturdays.push(d);
      }

      for (const d of lastSaturdays) {
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");

        const dateStr = `${year}-${month}-${day}`;

        const [result] = await ctx.db
          .select({
            count: count(),
          })
          .from(schema.points)
          .where(
            and(
              eq(schema.points.playerId, input),
              sql`date(${schema.points.createdAt}) = date(${dateStr})`,
            ),
          );

        points.push(result?.count ?? 0);
      }

      return points;
    }),
  getPlayerHighscore: publicProcedure
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
