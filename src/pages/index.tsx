import { Page } from "@/components/Page";
import { PlayerStats } from "@/components/PlayerStats";

export default function Home() {
  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <Page.Content className="rounded bg-zinc-900">
            <PlayerStats
              attack={3}
              block={2}
              defence={4}
              serve={2}
              set={3}
              stamina={3}
            />
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
