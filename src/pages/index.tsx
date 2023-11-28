import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { Page } from "@/components/Page";
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
          <Page.Content className="h-fit rounded bg-zinc-900 p-4">
            <p className="font-medium">Jogadores</p>
            <PlayersList rank={rank} />
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
