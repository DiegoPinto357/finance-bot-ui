import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
};

const ChartDialog: React.FC<Props> = ({ open, onOpenChange, title }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[420px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      Content
      <DialogFooter>Footer</DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ChartDialog;
