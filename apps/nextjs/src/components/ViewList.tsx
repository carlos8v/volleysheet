import { classnames } from "@/utils/classnames";
import { LayoutGrid, List } from "lucide-react";

export type ViewOptions = "list" | "grid";

export interface ViewListProps {
  view: ViewOptions;
  setView: (view: ViewOptions) => void;
}

export const ViewList = ({ view, setView }: ViewListProps) => {
  return (
    <>
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
    </>
  );
};
