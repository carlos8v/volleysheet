import Link from "next/link";
import { useState } from "react";

import { api } from "@/utils/api";

import { formatName } from "@/lib/formatName";
import { classnames } from "@/lib/classnames";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AvaliableRanks = "UNKNOWN" | "S" | "A" | "B" | "C" | "D" | "E";
const avaliableRanks: { label: string; value: AvaliableRanks }[] = [
  {
    value: "UNKNOWN",
    label: "Todos",
  },
  {
    value: "S",
    label: "Rank S",
  },
  {
    value: "A",
    label: "Rank A",
  },
  {
    value: "B",
    label: "Rank B",
  },
  {
    value: "C",
    label: "Rank C",
  },
  {
    value: "D",
    label: "Rank D",
  },
  {
    value: "E",
    label: "Rank E",
  },
];

export const PlayersList = () => {
  const [rank, setRank] = useState<AvaliableRanks>("UNKNOWN");
  const { data, isLoading } = api.players.getAll.useQuery(rank);

  return (
    <>
      <Tabs
        className="my-4 flex gap-2 overflow-x-scroll md:overflow-x-hidden"
        defaultValue="UNKNOWN"
      >
        <TabsList>
          {avaliableRanks.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={classnames({
                "cursor-pointer px-4 py-2 text-sm transition": true,
                "font-medium text-zinc-100": rank === value,
                "text-zinc-500 hover:text-white": rank !== value,
              })}
              onClick={() => setRank(value)}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data?.map(({ id, name, jerseyNumber }) => (
          <Link href={`/player/${id}`} key={id}>
            <div className="flex h-full flex-col items-center justify-start rounded bg-zinc-950 p-4">
              <Avatar className="relative mb-4 h-16 w-16 overflow-visible">
                <AvatarFallback>{formatName(name)}</AvatarFallback>
                <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-sm">
                  {jerseyNumber}
                </div>
              </Avatar>
              <p className="h-full text-center text-sm font-medium">{name}</p>
            </div>
          </Link>
        ))}
      </div>
      {isLoading ? (
        <p className="my-4 animate-pulse text-center font-medium text-zinc-400">
          Carregando
        </p>
      ) : null}
      {!data?.length && !isLoading ? (
        <p className="my-4 text-center font-medium text-zinc-400">
          Sem jogadores nesse rank
        </p>
      ) : null}
    </>
  );
};
