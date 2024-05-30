import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatName } from "@/utils/formatName";

export type PlayerCardProps = {
  jerseyNumber: number;
  name: string;
};

export const PlayerCard = ({ jerseyNumber, name }: PlayerCardProps) => {
  return (
    <div className="group flex h-full cursor-pointer flex-col items-center justify-start rounded bg-zinc-950 p-4 transition hover:bg-white">
      <Avatar className="relative mb-4 h-16 w-16 overflow-visible">
        <AvatarFallback>{formatName(name)}</AvatarFallback>
        <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-sm transition group-hover:bg-zinc-700">
          {jerseyNumber}
        </div>
      </Avatar>
      <p className="h-full text-center text-sm font-medium transition group-hover:text-zinc-950">
        {name}
      </p>
    </div>
  );
};