import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroupBy } from "@/hooks/useGroupBy";
import { api } from "@/utils/api";
import { classnames } from "@/utils/classnames";
import { formatName } from "@/utils/formatName";
import { positionsMap } from "@/utils/positions";
import { ArrowDownUp, LayoutGrid, List } from "lucide-react";

export type AvaliableRanks = "ALL" | "S" | "A" | "B" | "C" | "D" | "E";
const avaliableRanks: { label: string; value: AvaliableRanks }[] = [
  {
    value: "ALL",
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

const PlayerCard = ({
  name,
  jerseyNumber,
}: {
  name: string;
  jerseyNumber: number;
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-start rounded bg-zinc-950 p-4">
      <Avatar className="relative mb-4 h-16 w-16 overflow-visible">
        <AvatarFallback>{formatName(name)}</AvatarFallback>
        <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-sm">
          {jerseyNumber}
        </div>
      </Avatar>
      <p className="h-full text-center text-sm font-medium">{name}</p>
    </div>
  );
};

export const PlayersList = ({ rank }: { rank: AvaliableRanks }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [view, setView] = useState<"list" | "grid">("list");
  const [order, setOrder] = useState<"name" | "jersey">("name");

  const { data, isLoading } = api.players.getAll.useQuery({ rank, order });
  const groupedData = useGroupBy({
    data: data ?? [],
    field: "position",
    order: ["SETTER", "WING_SPIKER", "MIDDLE_BLOCKER", "OPPOSITE", "LIBERO"],
  });
  console.log(groupedData);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);

      params.set(name, value);
      return `?${params.toString()}`;
    },
    [searchParams],
  );

  return (
    <>
      <div className="flex w-full flex-col lg:mb-0 lg:flex-row lg:justify-between">
        <Tabs
          className="my-4 flex w-full gap-2 overflow-x-scroll md:overflow-x-hidden"
          defaultValue="ALL"
          value={rank}
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
                onClick={() =>
                  router.push(`${pathname}${createQueryString("rank", value)}`)
                }
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 self-end lg:self-auto">
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
          <span className="mx-2 h-4 w-px bg-zinc-600" />
          <button
            className={classnames({
              "text-zinc-400": view !== "list",
              "text-zinc-200": view === "list",
            })}
            onClick={() => setView("list")}
          >
            <List className="h-5 w-5 transition" />
          </button>
          <button
            className={classnames({
              "text-zinc-400": view !== "grid",
              "text-zinc-200": view === "grid",
            })}
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-[18px] w-[18px] transition" />
          </button>
        </div>
      </div>
      {view === "list" ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data?.map((player) => (
            <Link href={`/player/${player.id}`} key={player.id}>
              <PlayerCard {...player} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {groupedData.map(({ name, data: rows }) => (
            <div key={name}>
              <p className="text-sm font-medium text-zinc-400">
                {positionsMap.get(name as string)}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {rows?.map((player) => (
                  <Link href={`/player/${player.id}`} key={player.id}>
                    <PlayerCard {...player} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
