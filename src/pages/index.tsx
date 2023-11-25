import { Page } from "@/components/Page";
import { PlayerStats } from "@/components/PlayerStats";

export default function Home() {
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
                      BRA
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Idade</p>
                    <p className="font-medium">23 anos</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Altura</p>
                    <p className="font-medium">165cm</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Mão</p>
                    <p className="font-medium">Destro</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">Posição</p>
                    <p className="font-medium">Oposto</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs uppercase text-zinc-400">
                      Nº da camisa
                    </p>
                    <p className="font-medium">1</p>
                  </div>
                </div>
              </section>
              <PlayerStats
                attack={3}
                block={2}
                defence={4}
                serve={2}
                set={3}
                stamina={3}
              />
            </div>
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
