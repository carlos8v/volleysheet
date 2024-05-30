import { useState } from "react";
import { CourtCanvas } from "@/components/CourtCanvas";
import { Page } from "@/components/Page";
import { PlayerCardButton } from "@/components/PlayerCardButton";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { api } from "@/utils/api";
import { classnames } from "@/utils/classnames";
import { ArrowDownUp } from "lucide-react";

type ScoreMode = "ATTACK" | "SERVE" | "BLOCK";

export default function Score() {
  const [order, setOrder] = useState<"name" | "jersey">("name");
  const [hasPinnedBall, setHasPinnedBall] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ScoreMode | undefined>(
    undefined,
  );

  const { data, isLoading } = api.players.getAll.useQuery({
    rank: "ALL",
    order,
  });
  const scorePoint = api.points.score.useMutation();

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
      setHasPinnedBall(false);
      return;
    }

    setSelectedMode(mode);
  }

  function handlePoint(playerId: string) {
    if (!selectedMode || !hasPinnedBall) return;

    scorePoint.mutate(
      {
        playerId,
        type: selectedMode,
      },
      {
        onSettled: () => {
          setHasPinnedBall(false);
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
            <p className="font-medium">Marcar</p>
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
                <div className="flex w-full flex-col gap-8 lg:flex-row">
                  <div className="w-full max-w-sm">
                    <p className="mb-4 font-medium">Posição na quadra</p>
                    <CourtCanvas
                      hasPinnedBall={hasPinnedBall}
                      setHasPinnedBall={setHasPinnedBall}
                    />
                  </div>
                  <div className="w-full">
                    {isLoading ? (
                      <p className="my-4 animate-pulse text-center font-medium text-zinc-400">
                        Carregando
                      </p>
                    ) : null}
                    <div className="mb-4 flex justify-between">
                      <p className="font-medium">Selecione jogador</p>
                      <div className="flex items-center gap-2">
                        <ArrowDownUp className="h-4 w-4 text-zinc-400" />
                        <button
                          className={classnames({
                            "text-sm transition": true,
                            "text-zinc-400": order !== "name",
                            "text-zinc-200": order === "name",
                          })}
                          onClick={() => setOrder("name")}
                        >
                          Nome
                        </button>
                        <button
                          className={classnames({
                            "text-sm transition": true,
                            "text-zinc-400": order !== "jersey",
                            "text-zinc-200": order === "jersey",
                          })}
                          onClick={() => setOrder("jersey")}
                        >
                          Número
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                      {data?.map((player) => (
                        <PlayerCardButton
                          key={player.id}
                          player={player}
                          handleClick={handlePoint}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
