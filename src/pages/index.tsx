import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { Page } from "@/components/Page";
import { FutureMatches } from "@/components/FutureMatches";
import { TeamsTable } from "@/components/TeamsTable";
import { type AvaliableRanks, PlayersList } from "@/components/PlayersList";

export const getServerSideProps: GetServerSideProps<{
  rank: AvaliableRanks;
}> = async (ctx: GetServerSidePropsContext) => {
  const { rank } = ctx.query ?? {};

  return {
    props: {
      rank: (rank as AvaliableRanks) ?? "ALL",
    },
  };
};

export default function Home({
  rank,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <Page.Content className="h-fit gap-6">
            <div className="max-w-5xl rounded bg-zinc-900">
              <div className="p-4">
                <p className="font-medium">Classificação</p>
              </div>
              <TeamsTable />
            </div>
            <div className="max-w-5xl rounded bg-zinc-900 p-4">
              <p className="font-medium">Jogadores</p>
              <PlayersList rank={rank} />
            </div>
          </Page.Content>
          <Page.Sidebar className="h-fit rounded bg-zinc-900">
            <FutureMatches />
          </Page.Sidebar>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
