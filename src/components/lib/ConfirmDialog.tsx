import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

type Props = {
  open: boolean;
  form?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
};

const ConfirmDialog = ({ open, form, onOpenChange, onConfirm }: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[280px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            No
          </AlertDialogCancel>
          <AlertDialogAction
            type={form ? 'submit' : 'button'}
            form={form}
            onClick={() => {
              onOpenChange(false);
              if (onConfirm) onConfirm();
            }}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
