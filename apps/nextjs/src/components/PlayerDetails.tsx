import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName } from "@/utils/formatName";
import { positionsMap } from "@/utils/positions";

import type { RouterOutputs } from "@volleysheet/api";

import { PlayerStats } from "./PlayerStats";

export interface PlayerDetailsProps {
  player: RouterOutputs["players"]["getById"];
}

const handednessMap = new Map([
  [null, "N/A"],
  ["UNKNOWN", "N/A"],
  ["LEFT", "Canhoto"],
  ["RIGHT", "Destro"],
]);

export const PlayerDetails = ({ player }: PlayerDetailsProps) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="mb-4 w-full border-b border-zinc-800 pb-4 md:mb-0 md:border-b-0 md:border-r md:pb-0">
        <div className="mb-4 flex w-full flex-col items-center justify-center pt-4">
          <Avatar className="mb-2 h-32 w-32">
            <AvatarImage
              src={player?.photoUrl ?? ""}
              alt={player?.name ?? ""}
            />
            <AvatarFallback className="bg-zinc-800">
              {formatName(player?.name ?? "Desconhecido")}
            </AvatarFallback>
          </Avatar>
          <strong className="text-lg">{player?.name}</strong>
        </div>
        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs uppercase text-zinc-400">Nacionalidade</p>
            <p className="flex items-center font-medium">
              <Image
                className="mr-0.5"
                alt={`${player.name} profile photo`}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/22px-Flag_of_Brazil.svg.png"
              />
              {player?.country ?? "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs uppercase text-zinc-400">Idade</p>
            <p className="font-medium">
              {player?.age ? `${player?.age} anos` : "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs uppercase text-zinc-400">Altura</p>
            <p className="font-medium">
              {player?.height ? `${player?.height}cm` : "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs uppercase text-zinc-400">Mão</p>
            <p className="font-medium">
              {player?.handedness
                ? `${handednessMap.get(player?.handedness)}`
                : "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs uppercase text-zinc-400">Posição</p>
            <p className="font-medium">
              {player?.position ? positionsMap.get(player?.position) : "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs uppercase text-zinc-400">Nº da camisa</p>
            <p className="font-medium">
              {player?.jerseyNumber ? player?.jerseyNumber : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <PlayerStats
        attack={player?.stats?.attack ?? 0}
        block={player?.stats?.block ?? 0}
        defence={player?.stats?.defence ?? 0}
        serve={player?.stats?.serve ?? 0}
        set={player?.stats?.set ?? 0}
        stamina={player?.stats?.stamina ?? 0}
        score={player?.stats?.score ?? 0}
      />
    </div>
  );
};
