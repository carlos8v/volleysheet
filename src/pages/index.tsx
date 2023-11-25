import { Page } from "@/components/Page";
import { FutureMatches } from "@/components/FutureMatches";
import { TeamsTable } from "@/components/TeamsTable";

export default function Home() {
  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <Page.Content className="h-fit max-w-5xl rounded bg-zinc-900">
            <div className="p-4">
              <p className="font-medium">Classificação</p>
            </div>
            <TeamsTable />
          </Page.Content>
          <Page.Sidebar className="h-fit rounded bg-zinc-900">
            <FutureMatches />
          </Page.Sidebar>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
