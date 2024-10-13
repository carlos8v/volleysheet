import { z } from "zod";

import { and, count, eq, isNotNull, sql } from "@volleysheet/db";
import * as schema from "@volleysheet/db/schema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const MAX_WEEKS = 4;

function getLastSaturday() {
  const lastSaturday = new Date();
  while (lastSaturday.getDay() !== 6) {
    lastSaturday.setDate(lastSaturday.getDate() - 1);
  }

  return lastSaturday;
}

function getISODateString(referenceDate: Date) {
  const year = referenceDate.getFullYear();
  const month = (referenceDate.getMonth() + 1).toString().padStart(2, "0");
  const day = referenceDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const pointsRouter = createTRPCRouter({
  score: protectedProcedure
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
  getWeekendPoints: publicProcedure
    .input(
      z.object({
        playerId: z.string().uuid(),
        maxWeeks: z.number().optional().default(MAX_WEEKS),
      }),
    )
    .query(async ({ ctx, input }) => {
      const lastSaturday = getLastSaturday();
      const lastSaturdays: Date[] = [];
      const points = [];

      for (let i = 0; i < input.maxWeeks; i += 1) {
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
              eq(schema.points.playerId, input.playerId),
              sql`date(${schema.points.createdAt}) = date(${dateStr})`,
            ),
          );

        points.unshift({ date: `${day}/${month}`, points: result?.count ?? 0 });
      }

      return points;
    }),
  getPlayerHighscore: publicProcedure
    .input(
      z.object({
        playerId: z.string().uuid(),
        maxWeeks: z.number().optional().default(MAX_WEEKS),
      }),
    )
    .query(async ({ ctx, input }) => {
      const referenceDate = new Date();
      const lastSaturday = getLastSaturday();
      referenceDate.setDate(lastSaturday.getDate() - (input.maxWeeks - 1) * 7);

      const dateStr = getISODateString(referenceDate);

      const points = await ctx.db
        .select({
          type: schema.points.type,
          count: count(),
        })
        .from(schema.points)
        .where(sql`date(${schema.points.createdAt}) >= date(${dateStr})`)
        .groupBy(schema.points.type, schema.points.playerId)
        .having(sql`playerId = ${input.playerId}`);

      return {
        attack: points.find(({ type }) => type === "ATTACK")?.count ?? 0,
        serve: points.find(({ type }) => type === "SERVE")?.count ?? 0,
        block: points.find(({ type }) => type === "BLOCK")?.count ?? 0,
      };
    }),
});
