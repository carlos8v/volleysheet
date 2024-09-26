import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { classnames } from "@/utils/classnames";

export interface RankTabsProps {
  rank: AvaliableRank;
  handleClick: (rank: AvaliableRank) => void;
}

export type AvaliableRank = "ALL" | "S" | "A" | "B" | "C" | "D" | "E";

const avaliableRanks: { label: string; value: AvaliableRank }[] = [
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

export const RankTabs = ({ rank, handleClick }: RankTabsProps) => {
  return (
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
            onClick={() => handleClick(value)}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
