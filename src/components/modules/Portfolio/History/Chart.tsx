import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/formatNumber';

const chartConfig = {
  default: {
    label: 'default',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const processDate = (stringDate: string) => {
  const [year, month, day] = stringDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

type DataPoint = {
  date: string;
} & Record<string, number | string>;

export type ChartProps = {
  portfolio: string;
  data: DataPoint[];
};

const Chart = ({ portfolio, data }: ChartProps) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full max-h-[100%] min-h-0"
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine
          tickMargin={8}
          axisLine
          tickFormatter={value =>
            processDate(value).toLocaleDateString('en-US', {
              month: 'short',
              year: '2-digit',
            })
          }
        />
        <YAxis
          tickLine
          axisLine
          tickCount={8}
          tickMargin={4}
          tickFormatter={value =>
            formatCurrency(value as number, { omitCents: true })
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey={portfolio}
              labelFormatter={value =>
                processDate(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }
              formatter={value => formatCurrency(value as number)}
            />
          }
        />
        <Bar
          dataKey={portfolio}
          fill="var(--color-default)"
          radius={4}
          height={200}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default Chart;
