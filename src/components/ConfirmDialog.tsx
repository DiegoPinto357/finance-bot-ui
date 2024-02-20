import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  form?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({ open, form, onOpenChange, onConfirm }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[240px]">
        <DialogHeader>
          <DialogTitle>Confirm?</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>No</Button>
          <Button
            type={form ? 'submit' : 'button'}
            form={form}
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
