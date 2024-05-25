import { useState } from "react";
import { Page } from "@/components/Page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { api } from "@/utils/api";
import { classnames } from "@/utils/classnames";
import { formatName } from "@/utils/formatName";

type ScoreMode = "ATTACK" | "SERVE" | "BLOCK";

export default function Score() {
  const { data, isLoading } = api.players.getAll.useQuery("ALL");
  const scorePoint = api.points.score.useMutation();

  const [selectedMode, setSelectedMode] = useState<ScoreMode | undefined>(
    undefined,
  );

  const buttons: {
    title: string;
    mode: ScoreMode;
  }[] = [
    {
      title: "Saque",
      mode: "SERVE",
    },
    {
      title: "Ataque",
      mode: "ATTACK",
    },
    {
      title: "Bloqueio",
      mode: "BLOCK",
    },
  ];

  function handleSelectMode(mode: ScoreMode) {
    if (selectedMode === mode) {
      setSelectedMode(undefined);
      return;
    }

    setSelectedMode(mode);
  }

  function handlePoint(playerId: string) {
    if (!selectedMode) return;

    scorePoint.mutate(
      {
        playerId,
        type: selectedMode,
      },
      {
        onSettled: () => {
          setSelectedMode(undefined);
        },
      },
    );
  }

  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <Page.Content className="h-fit rounded bg-zinc-900 p-4">
            <p className="font-medium">Placar</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {buttons.map(({ title, mode }) => (
                <button
                  key={mode}
                  className={classnames({
                    "cursor-pointer rounded px-6 py-8 text-sm font-medium transition":
                      true,
                    "bg-zinc-950 text-white": mode !== selectedMode,
                    "bg-white text-zinc-950": mode === selectedMode,
                  })}
                  onClick={() => handleSelectMode(mode)}
                >
                  {title}
                </button>
              ))}
            </div>
            <Collapsible open={Boolean(selectedMode)}>
              <CollapsibleContent>
                <hr className="my-8" />
                <p className="mb-4 font-medium">Selecione jogador</p>
                {isLoading ? (
                  <p className="my-4 animate-pulse text-center font-medium text-zinc-400">
                    Carregando
                  </p>
                ) : null}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {data?.map(({ id, name, jerseyNumber }) => (
                    <button
                      key={id}
                      className="group flex h-full cursor-pointer flex-col items-center justify-start rounded bg-zinc-950 p-4 transition hover:bg-white"
                      onClick={() => handlePoint(id)}
                    >
                      <Avatar className="relative mb-4 h-16 w-16 overflow-visible">
                        <AvatarFallback>{formatName(name)}</AvatarFallback>
                        <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-sm transition group-hover:bg-zinc-700">
                          {jerseyNumber}
                        </div>
                      </Avatar>
                      <p className="h-full text-center text-sm font-medium transition group-hover:text-zinc-950">
                        {name}
                      </p>
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
