import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { teams } from "@/server/db/schema";

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
});
