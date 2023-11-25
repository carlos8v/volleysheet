import { Page } from "@/components/Page";
import { PlayerStats } from "@/components/PlayerStats";
import { api } from "@/utils/api";

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
  ["WING_SPIKER", "Ponta"],
  ["MIDDLE_BLOCKER", "Central"],
]);

export default function Home() {
  const { data, isLoading, error } = api.teams.getPlayer.useQuery({
    playerId: "56b59060-b200-441a-a911-e27bcf63c5ca",
    teamId: "6a8748d0-b5a8-4833-86cc-de0370d49c62",
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
              <h3 className="text-lg font-bold">Time 1</h3>
              <p className="text-sm text-zinc-400">
                Contrato até 25 de nov. de 2023
              </p>
            </div>
            <div className="flex h-full flex-col md:flex-row">
              <section className="mb-4 w-full border-b border-zinc-800 pb-4 md:mb-0 md:border-b-0 md:border-r md:pb-0">
                <div className="mb-4 flex w-full flex-col items-center justify-center pt-4">
                  <img
                    src="https://avatars.githubusercontent.com/u/53836455?v=4"
                    className="mb-2 h-32 w-32 rounded-full"
                  />
                  <strong className="text-lg">Carlos Souza</strong>
                </div>
                <div className="grid grid-cols-3 gap-4 py-4">
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
                      {data?.player?.height ? `${data.player.age}` : "N/A"}
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
