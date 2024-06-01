import { z } from "zod";

import { and, asc, eq, gte, like, lte } from "@volleysheet/db";
import * as schema from "@volleysheet/db/schema";

import { createTRPCRouter, publicProcedure } from "../trpc";

const selectScoreMap = new Map([
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
    .input(
      z.object({
        name: z.string().nullish(),
        rank: z.enum(["E", "D", "C", "B", "A", "S", "ALL"]).default("ALL"),
        order: z.enum(["name", "jersey"]).default("name"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const selectScore = selectScoreMap.get(input.rank);

      return await ctx.db
        .select({
          id: schema.players.id,
          name: schema.players.name,
          score: schema.stats.score,
          position: schema.players.position,
          jerseyNumber: schema.players.jerseyNumber,
        })
        .from(schema.players)
        .innerJoin(schema.stats, eq(schema.stats.playerId, schema.players.id))
        .where(
          and(
            ...(input.rank !== "ALL"
              ? [
                  lte(schema.stats.score, selectScore ? selectScore + 4 : 30),
                  gte(schema.stats.score, selectScore ?? 0),
                ]
              : []),
            ...(input.name
              ? [like(schema.players.name, `%${input.name}%`)]
              : []),
          ),
        )
        .orderBy(() => {
          if (input.order === "jersey") return asc(schema.players.jerseyNumber);
          return asc(schema.players.name);
        });
    }),
  getAllByPosition: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        rank: z.enum(["E", "D", "C", "B", "A", "S", "ALL"]).default("ALL"),
        order: z.enum(["name", "jersey"]).default("name"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const selectScore = selectScoreMap.get(input.rank);

      const positions = [
        "SETTER",
        "WING_SPIKER",
        "MIDDLE_BLOCKER",
        "OPPOSITE",
        "LIBERO",
      ] as schema.Player["position"][];

      const players = [];
      for (const position of positions) {
        const playersByPosition = await ctx.db
          .select({
            id: schema.players.id,
            name: schema.players.name,
            score: schema.stats.score,
            position: schema.players.position,
            jerseyNumber: schema.players.jerseyNumber,
          })
          .from(schema.players)
          .innerJoin(schema.stats, eq(schema.stats.playerId, schema.players.id))
          .where(
            and(
              eq(schema.players.position, position),
              ...(input.rank !== "ALL"
                ? [
                    lte(schema.stats.score, selectScore ? selectScore + 4 : 30),
                    gte(schema.stats.score, selectScore ?? 0),
                  ]
                : []),
              ...(input.name
                ? [like(schema.players.name, `%${input.name}%`)]
                : []),
            ),
          )
          .orderBy(() => {
            if (input.order === "jersey")
              return asc(schema.players.jerseyNumber);
            return asc(schema.players.name);
          });

        if (playersByPosition.length) {
          players.push({
            name: position,
            rows: playersByPosition,
          });
        }
      }

      return players;
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
