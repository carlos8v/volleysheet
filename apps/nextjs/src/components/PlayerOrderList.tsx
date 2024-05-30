import { ArrowDownUp } from "lucide-react";
import { classnames } from "@/utils/classnames";

export type PlayerOrderBy = "name" | "jersey";

export type PlayerOrderListProps = {
  order: PlayerOrderBy;
  setOrder: (order: PlayerOrderBy) => void;
};

export const PlayerOrderList = ({ order, setOrder }: PlayerOrderListProps) => {
  return (
    <>
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
    </>
  );
};
