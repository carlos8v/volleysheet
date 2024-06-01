import { useCallback, useState } from "react";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Page } from "@/components/Page";
import { PlayerCard } from "@/components/PlayerCard";
import { PlayerOrderBy, PlayerOrderList } from "@/components/PlayerOrderList";
import { AvaliableRank, RankTabs } from "@/components/RankTabs";
import { ViewList, ViewOptions } from "@/components/ViewList";
import { api } from "@/utils/api";
import { positionsMap } from "@/utils/positions";

export const getServerSideProps: GetServerSideProps<{
  rank: AvaliableRank;
}> = async (ctx: GetServerSidePropsContext) => {
  const { rank } = ctx.query ?? {};

  return {
    props: {
      rank: (rank as AvaliableRank) ?? "ALL",
    },
  };
};

export default function Home({
  rank,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [view, setView] = useState<ViewOptions>("list");
  const [order, setOrder] = useState<PlayerOrderBy>("name");

  const allPlayers = api.players.getAll.useQuery(
    { rank, order },
    {
      enabled: view === "list",
      queryKey: [
        "players.getAll",
        {
          order,
        },
      ],
    },
  );
  const allPlayersByPosition = api.players.getAllByPosition.useQuery(
    {
      rank,
      order,
    },
    {
      enabled: view === "grid",
      queryKey: [
        "players.getAllByPosition",
        {
          order,
        },
      ],
    },
  );

  const isLoading =
    (view === "list" && allPlayers.isLoading) ||
    (view === "grid" && allPlayersByPosition.isLoading);
  const hasNoData =
    (view === "list" && !allPlayers.data?.length) ||
    (view === "grid" && !allPlayersByPosition.data?.length);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams ?? undefined);

      params.set(name, value);
      return `?${params.toString()}`;
    },
    [searchParams],
  );

  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <Page.Content className="h-fit rounded bg-zinc-900 p-4">
            <p className="font-medium">Jogadores</p>
            <div className="flex w-full flex-col lg:mb-0 lg:flex-row lg:justify-between">
              <RankTabs
                rank={rank}
                handleClick={(newRank) =>
                  router.push(
                    `${pathname}${createQueryString("rank", newRank)}`,
                  )
                }
              />
              <div className="flex items-center gap-2 self-end lg:self-auto">
                <PlayerOrderList order={order} setOrder={setOrder} />
                <span className="mx-2 h-4 w-px bg-zinc-600" />
                <ViewList view={view} setView={setView} />
              </div>
            </div>
            {view === "list" ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {allPlayers.data?.map((player) => (
                  <Link href={`/player/${player.id}`} key={player.id}>
                    <PlayerCard {...player} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                {allPlayersByPosition.data?.map(({ name, rows }) => (
                  <div key={name}>
                    <p className="text-sm font-medium text-zinc-400">
                      {positionsMap.get(name as string)}
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {rows?.map((player) => (
                        <Link href={`/player/${player.id}`} key={player.id}>
                          <PlayerCard {...player} />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isLoading ? (
              <p className="my-4 animate-pulse text-center font-medium text-zinc-400">
                Carregando
              </p>
            ) : null}

            {hasNoData && !isLoading ? (
              <p className="my-4 text-center font-medium text-zinc-400">
                Sem jogadores nesse rank
              </p>
            ) : null}
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
