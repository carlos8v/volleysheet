import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { Page } from "@/components/Page";
import { PlayerDetails } from "@/components/PlayerDetailts";
import { PlayerScoreChart } from "@/components/PlayerScoreChart";
import { api } from "@/utils/api";
import z from "zod";

export const getServerSideProps: GetServerSideProps<{
  playerId: string;
}> = async (ctx: GetServerSidePropsContext) => {
  const schema = z.object({ playerId: z.string().uuid() });
  const params = schema.safeParse(ctx.params);

  if (params.success) {
    return {
      props: {
        playerId: params.data.playerId,
      },
    };
  }

  return {
    notFound: true,
    props: {},
  };
};

export default function PlayerPage({
  playerId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading, error } = api.players.getById.useQuery({
    playerId,
  });

  const highscore = api.points.getPlayerHighscore.useQuery(playerId);
  const lastWeekendsPoints = api.points.getLastWeekendPoints.useQuery(playerId);

  if (isLoading) {
    return null;
  }

  if (error || !data) {
    <p>Não foi possível recupera informações do jogador</p>;
  }

  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <div className="flex h-fit w-full flex-col lg:flex-row lg:flex-wrap">
            <div className="pb-3 lg:w-4/6 lg:pr-3">
              <div className="rounded bg-zinc-900">
                {data && <PlayerDetails player={data} />}
              </div>
            </div>
            <div className="py-3 lg:w-2/6 lg:pb-3 lg:pl-3 lg:pt-0">
              <div className="flex h-fit flex-col gap-1 rounded bg-zinc-900 px-4 py-3">
                <p className="font-medium">Pontuações</p>
                <hr className="my-2" />
                <fieldset className="flex justify-between">
                  <p className="text-sm text-zinc-400">Ataques</p>
                  <p className="font-medium">{highscore.data?.attack ?? 0}</p>
                </fieldset>
                <fieldset className="flex justify-between">
                  <p className="text-sm text-zinc-400">Saques</p>
                  <p className="font-medium">{highscore.data?.serve ?? 0}</p>
                </fieldset>
                <fieldset className="flex justify-between">
                  <p className="text-sm text-zinc-400">Bloqueios</p>
                  <p className="font-medium">{highscore.data?.block ?? 0}</p>
                </fieldset>
                <hr className="my-2" />
                <PlayerScoreChart data={lastWeekendsPoints?.data ?? []} />
              </div>
            </div>
          </div>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
