import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { playersRouter } from "./routers/players";
import { pointsRouter } from "./routers/points";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  players: playersRouter,
  points: pointsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
