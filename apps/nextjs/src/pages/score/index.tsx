import { useState } from "react";
import { CourtCanvas } from "@/components/CourtCanvas";
import { Page } from "@/components/Page";
import { PlayerCard } from "@/components/PlayerCard";
import { PlayerOrderBy, PlayerOrderList } from "@/components/PlayerOrderList";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import useDebounce from "@/hooks/useDebounce";
import { api } from "@/utils/api";
import { classnames } from "@/utils/classnames";

type ScoreMode = "ATTACK" | "SERVE" | "BLOCK";

export default function Score() {
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);

  const [hasPinnedBall, setHasPinnedBall] = useState(false);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectedMode, setSelectedMode] = useState<ScoreMode | undefined>(
    undefined,
  );
  const [order, setOrder] = useState<PlayerOrderBy>("name");

  const { data, isLoading } = api.players.getAll.useQuery(
    {
      name: debounceQuery,
      rank: "ALL",
      order,
    },
    {
      keepPreviousData: true,
      queryKey: [
        "players.getAll",
        {
          order,
          name: debounceQuery,
        },
      ],
    },
  );
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
        position: ballPosition,
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
                    "cursor-pointer rounded px-6 py-8 text-sm font-bold transition lg:font-medium":
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
                      setBallPosition={setBallPosition}
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
                        <PlayerOrderList order={order} setOrder={setOrder} />
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Nome do jogador"
                        className="w-full rounded border border-zinc-800 bg-zinc-950 p-2 placeholder:text-zinc-600 md:w-fit"
                        value={query}
                        onChange={({ target }) => setQuery(target.value)}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                      {data?.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => handlePoint(player.id)}
                          className={classnames({
                            "cursor-pointer": hasPinnedBall,
                            "cursor-not-allowed": !hasPinnedBall,
                          })}
                        >
                          <PlayerCard {...player} />
                        </button>
                      ))}
                      {!data?.length ? (
                        <p className="my-4 font-medium text-zinc-400">
                          Jogador não encontrado
                        </p>
                      ) : null}
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
