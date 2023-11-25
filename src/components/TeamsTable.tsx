import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { api } from "@/utils/api";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface TeamTableItem {
  id: string;
  name: string;
  matches: number;
  wins: number;
  losses: number;
}

const skeletonData: TeamTableItem[] = [
  {
    id: "",
    name: "",
    matches: 0,
    wins: 0,
    losses: 0,
  },
];

export const TeamsTable = () => {
  const { data, isLoading } = api.teams.getAll.useQuery();

  const columns: ColumnDef<TeamTableItem>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Time",
        cell: ({ row }) =>
          isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <p>{row.original.name}</p>
          ),
      },
      {
        id: "matches",
        accessorKey: "matches",
        header: "Jogos",
        cell: () =>
          isLoading ? <Skeleton className="h-4 w-full" /> : <p>0</p>,
      },
      {
        id: "wins",
        accessorKey: "wins",
        header: "Vitórias",
        cell: () =>
          isLoading ? <Skeleton className="h-4 w-full" /> : <p>0</p>,
      },
      {
        id: "losses",
        accessorKey: "losses",
        header: "Derrotas",
        cell: () =>
          isLoading ? <Skeleton className="h-4 w-full" /> : <p>0</p>,
      },
    ],
    [data, isLoading],
  );

  const table = useReactTable({
    data: isLoading ? skeletonData : data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-bl rounded-br">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem times salvos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
