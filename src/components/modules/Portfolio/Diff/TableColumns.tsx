import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/formatNumber';

const getMinMaxValues = (rows: PortfolioDiffItem[]) => {
  let min = Infinity;
  let max = -Infinity;

  rows.forEach(row => {
    Object.values(row).forEach(value => {
      if (typeof value === 'number') {
        if (value < min) min = value;
        if (value > max) max = value;
      }
    });
  });

  return { min, max };
};

const getBackgroundColor = (value: number, min: number, max: number) => {
  const midpoint = 0;

  if (value < midpoint) {
    const percentage = Math.min(
      Math.max((midpoint - value) / (midpoint - min), 0),
      1
    );
    const opacity = 0.5 + 0.5 * percentage;
    return `rgba(224, 101, 101, ${opacity})`; // Converted #E06565 to RGBA
  } else {
    const percentage = Math.min(
      Math.max((value - midpoint) / (max - midpoint), 0),
      1
    );
    const opacity = 0.5 + 0.5 * percentage;
    return `rgba(147, 196, 125, ${opacity})`; // Converted #93C47D to RGBA
  }
};

export type PortfolioDiffItem = {
  portfolio: string;
} & Record<string, string | number>;

export const TableColumns = (
  header: string[],
  rows: PortfolioDiffItem[]
): ColumnDef<PortfolioDiffItem>[] => {
  const { min, max } = getMinMaxValues(rows);

  return [
    {
      accessorKey: 'portfolio',
      header: 'Portfolio',
    },

    ...header.map(
      headerItem =>
        ({
          header: headerItem,
          accessorKey: headerItem,
          cell: ({ cell }) => {
            const value = cell.getValue<number>();
            const backgroundColor = getBackgroundColor(value, min, max);
            return (
              <div className="p-2" style={{ backgroundColor }}>
                {formatCurrency(value)}
              </div>
            );
          },
        } as ColumnDef<PortfolioDiffItem>)
    ),
  ];
};
