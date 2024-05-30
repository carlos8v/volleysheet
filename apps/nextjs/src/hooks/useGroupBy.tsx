import { useMemo } from "react";

export type GridProps<T extends Record<string, unknown>> = {
  data: T[];
  field: keyof T;
  exclude?: unknown[];
  order?: unknown[];
};

export function useGroupBy<T extends Record<string, unknown>>({
  data,
  field,
  exclude = undefined,
  order = undefined,
}: GridProps<T>) {
  const groupedData = useMemo(() => {
    const groupedDataMap = data.reduce((acc, curr) => {
      if (exclude && exclude.includes(curr[field])) {
        return acc;
      }

      if (acc.has(curr[field])) {
        const dataByField = acc.get(curr[field])!;
        dataByField.push(curr);
      } else {
        acc.set(curr[field], [curr]);
      }

      return acc;
    }, new Map<T[keyof T], T[]>());

    return [...groupedDataMap.entries()]
      .sort((a, b) => {
        if (!order || !order?.length) return 0;

        const firstPriority = order.find((orderValue) => orderValue === a[0]);
        const secondPriority = order.find((orderValue) => orderValue === b[0]);

        if (!firstPriority || !secondPriority) return 0;

        return order.indexOf(firstPriority) - order.indexOf(secondPriority);
      })
      .map(([fieldName, data]) => ({
        name: fieldName,
        data,
      }));
  }, [data]);

  return groupedData;
}
