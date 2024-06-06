import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName } from "@/utils/formatName";
import { positionsMap } from "@/utils/positions";

export type PlayerDetailsProps = {
  name?: string;
  photoUrl?: string | null;
  country?: string | null;
  age?: number | null;
  handedness?: "UNKNOWN" | "LEFT" | "RIGHT" | null;
  height?: number | null;
  position?: string | null;
  jerseyNumber?: number | null;
};

const handednessMap = new Map([
  [null, "N/A"],
  ["UNKNOWN", "N/A"],
  ["LEFT", "Canhoto"],
  ["RIGHT", "Destro"],
]);

export const PlayerDetails = ({
  photoUrl,
  name,
  country,
  age,
  height,
  position,
  jerseyNumber,
  handedness,
}: PlayerDetailsProps) => {
  return (
    <section className="mb-4 w-full border-b border-zinc-800 pb-4 md:mb-0 md:border-b-0 md:border-r md:pb-0">
      <div className="mb-4 flex w-full flex-col items-center justify-center pt-4">
        <Avatar className="mb-2 h-32 w-32">
          <AvatarImage src={photoUrl ?? ""} alt={name ?? ""} />
          <AvatarFallback className="bg-zinc-800">
            {formatName(name ?? "Desconhecido")}
          </AvatarFallback>
        </Avatar>
        <strong className="text-lg">{name}</strong>
      </div>
      <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-zinc-400">Nacionalidade</p>
          <p className="flex items-center font-medium">
            <img
              className="mr-0.5"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/22px-Flag_of_Brazil.svg.png"
            />
            {country ?? "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-zinc-400">Idade</p>
          <p className="font-medium">{age ? `${age} anos` : "N/A"}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-zinc-400">Altura</p>
          <p className="font-medium">{height ? `${height}cm` : "N/A"}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-zinc-400">Mão</p>
          <p className="font-medium">
            {handedness ? `${handednessMap.get(handedness)}` : "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-zinc-400">Posição</p>
          <p className="font-medium">
            {position ? positionsMap.get(position) : "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-zinc-400">Nº da camisa</p>
          <p className="font-medium">{jerseyNumber ? jerseyNumber : "N/A"}</p>
        </div>
      </div>
    </section>
  );
};
