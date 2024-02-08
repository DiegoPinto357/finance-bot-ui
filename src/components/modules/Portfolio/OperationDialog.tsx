import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

type Operation = 'transfer' | 'swap' | 'deposit' | 'withdrawn';

type Props = {
  open: boolean;
  operations: Operation[];
  onOpenChange: (open: boolean) => void;
};

const OperationDialog = ({ open, operations, onOpenChange }: Props) => {
  const renderTabs = operations.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Operation</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>

        {renderTabs ? (
          <Tabs defaultValue={operations[0]}>
            <TabsList className="grid w-full grid-cols-2">
              {operations.map(operation => (
                <TabsTrigger key={`${operation}-tab`} value={operation}>
                  {operation}
                </TabsTrigger>
              ))}
            </TabsList>
            {operations.map(operation => (
              <TabsContent key={`${operation}-content`} value={operation}>
                {operation}
              </TabsContent>
            ))}
          </Tabs>
        ) : null}

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
