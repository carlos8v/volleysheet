import { teamsRouter } from "@/server/api/routers/teams";
import { createTRPCRouter } from "@/server/api/trpc";
import { playersRouter } from './routers/players';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  players: playersRouter,
  teams: teamsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
