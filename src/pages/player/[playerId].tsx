import z from "zod";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { api } from "@/utils/api";

import { Page } from "@/components/Page";
import { PlayerStats } from "@/components/PlayerStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName } from "@/lib/formatName";

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

const handednessMap = new Map([
  [null, "N/A"],
  ["UNKNOWN", "N/A"],
  ["LEFT", "Canhoto"],
  ["RIGHT", "Destro"],
]);

const positionsMap = new Map([
  [null, "N/A"],
  ["UNKNOWN", "N/A"],
  ["LIBERO", "Líbero"],
  ["OPPOSITE", "Oposto"],
  ["SETTER", "Levantador"],
  ["WING_SPIKER", "Ponteiro"],
  ["MIDDLE_BLOCKER", "Central"],
]);

export default function PlayerPage({
  playerId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading, error } = api.players.getById.useQuery({
    playerId,
  });

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
          <Page.Content className="h-fit max-w-4xl rounded bg-zinc-900">
            <div className="border-b border-zinc-800 p-4">
              <h3 className="text-lg font-bold">{data?.contract?.team}</h3>
              {data?.contract?.expiresDate ? (
                <p className="text-sm text-zinc-400">
                  Contrato até{" "}
                  {new Date(data.contract.expiresDate).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>
              ) : null}
            </div>
            <div className="flex h-full flex-col md:flex-row">
              <section className="mb-4 w-full border-b border-zinc-800 pb-4 md:mb-0 md:border-b-0 md:border-r md:pb-0">
                <div className="mb-4 flex w-full flex-col items-center justify-center pt-4">
                  <Avatar className="mb-2 h-32 w-32">
                    <AvatarImage
                      src={data?.player?.photoUrl ?? ""}
                      alt={data?.player?.name ?? ""}
                    />
                    <AvatarFallback className="bg-zinc-800">
                      {formatName(data?.player?.name ?? "Desconhecido")}
                    </AvatarFallback>
                  </Avatar>
                  <strong className="text-lg">{data?.player?.name}</strong>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">
                      Nacionalidade
                    </p>
                    <p className="flex items-center font-medium">
                      <img
                        className="mr-0.5"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/22px-Flag_of_Brazil.svg.png"
                      />
                      {data?.player?.country ?? "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Idade</p>
                    <p className="font-medium">
                      {data?.player?.age ? `${data.player.age} anos` : "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Altura</p>
                    <p className="font-medium">
                      {data?.player?.height ? `${data.player.height}cm` : "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Mão</p>
                    <p className="font-medium">
                      {data?.player?.handedness
                        ? `${handednessMap.get(data.player.handedness)}`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Posição</p>
                    <p className="font-medium">
                      {data?.contract?.position
                        ? positionsMap.get(data.contract.position)
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">
                      Nº da camisa
                    </p>
                    <p className="font-medium">
                      {data?.contract?.jerseyNumber
                        ? data.contract.jerseyNumber
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </section>
              <PlayerStats
                attack={data?.player?.stats?.attack ?? 0}
                block={data?.player?.stats?.block ?? 0}
                defence={data?.player?.stats?.defence ?? 0}
                serve={data?.player?.stats?.serve ?? 0}
                set={data?.player?.stats?.set ?? 0}
                stamina={data?.player?.stats?.stamina ?? 0}
              />
            </div>
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
