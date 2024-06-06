import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { Page } from "@/components/Page";
import { PlayerDetails } from "@/components/PlayerDetailts";
import { PlayerStats } from "@/components/PlayerStats";
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

  if (isLoading) {
    return null;
  }

  if (error ?? !data) {
    <p>Não foi possível recupera informações do jogador</p>;
  }

  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <div className="grid h-fit w-full grid-cols-1 grid-rows-4 gap-6 md:grid-rows-3 lg:grid-cols-6 lg:grid-rows-3">
            <section className="row-start-1 row-end-4 md:row-start-1 md:row-end-3 lg:col-start-1 lg:col-end-5 lg:row-start-1 lg:row-end-3">
              <div className="flex flex-col rounded bg-zinc-900 md:flex-row">
                <PlayerDetails
                  name={data?.name}
                  photoUrl={data?.photoUrl}
                  country={data?.country}
                  age={data?.age}
                  handedness={data?.handedness}
                  height={data?.height}
                  position={data?.position}
                  jerseyNumber={data?.jerseyNumber}
                />
                <PlayerStats
                  attack={data?.stats?.attack ?? 0}
                  block={data?.stats?.block ?? 0}
                  defence={data?.stats?.defence ?? 0}
                  serve={data?.stats?.serve ?? 0}
                  set={data?.stats?.set ?? 0}
                  stamina={data?.stats?.stamina ?? 0}
                  score={data?.stats?.score ?? 0}
                />
              </div>
            </section>
            <section className="row-start-4 row-end-5 md:row-span-3 lg:col-start-5 lg:col-end-7 lg:row-start-1 lg:row-end-2">
              <div className="flex h-fit flex-col gap-1 rounded bg-zinc-900 px-4 pb-8 pt-3">
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
              </div>
            </section>
          </div>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
