const Match = ({ team1, team2, date }: MatchItem) => {
  return (
    <div className="my-3.5 flex items-center gap-2">
      <div className="h-full w-fit">
        <p className="text-sm text-zinc-400">
          {new Date(date).toLocaleDateString("pt-BR")}
        </p>
      </div>
      <div className="h-10 w-[1px] bg-zinc-800" />
      <div className="w-full">
        <p className="text-sm">{team1}</p>
        <p className="text-sm">{team2}</p>
      </div>
      <div className="w-fit w-full">
        <p className="text-sm text-zinc-400">0</p>
        <p className="text-sm text-zinc-400">0</p>
      </div>
    </div>
  );
};

interface MatchItem {
  id: string;
  team1: string;
  team2: string;
  date: Date;
}

const mockedMatches: MatchItem[] = [
  {
    id: "1",
    team1: "Time 1",
    team2: "Time 2",
    date: new Date("2023-11-25"),
  },
  {
    id: "2",
    team1: "Time 2",
    team2: "Time 3",
    date: new Date("2023-11-25"),
  },
  {
    id: "3",
    team1: "Time 3",
    team2: "Time 4",
    date: new Date("2023-11-25"),
  },
  {
    id: "4",
    team1: "Time 4",
    team2: "Time 1",
    date: new Date("2023-11-25"),
  },
];

export const FutureMatches = () => {
  return (
    <div className="w-full p-4">
      <p className="mb-2 font-medium">Partidas</p>
      <p className="mb-2 text-zinc-400">Amapázão</p>
      <div>
        {mockedMatches.map((item) => (
          <Match key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
