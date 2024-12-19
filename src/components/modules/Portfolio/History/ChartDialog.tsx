import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Chart from './Chart';

import type { ChartProps } from './Chart';

type Props = {
  open: boolean;
  title: string;
  data: ChartProps['data'];
  onOpenChange: (open: boolean) => void;
};

const ChartDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  data,
}: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[70vw] max-h-[60vh]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <Chart portfolio={title} data={data} />
    </DialogContent>
  </Dialog>
);

export default ChartDialog;
