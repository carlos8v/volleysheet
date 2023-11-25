import { api } from "@/utils/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

import { formatName } from "@/lib/formatName";

export const PlayersList = () => {
  const { data } = api.players.getAll.useQuery();

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {data?.map(({ id, name, contract }) => (
        <Link href={`/player/${id}`} key={id}>
          <div className="flex h-full flex-col items-center justify-center rounded bg-zinc-950 p-4">
            <Avatar className="relative mb-4 h-16 w-16 overflow-visible">
              <AvatarFallback>{formatName(name)}</AvatarFallback>
              <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-sm ">
                {contract.jerseyNumber}
              </div>
            </Avatar>
            <p className="text-center text-sm font-medium">{name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
