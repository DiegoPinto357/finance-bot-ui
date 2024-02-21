// import React from 'react';
import { useState, useRef, useEffect } from 'react';
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
import ConfirmDialog from '@/components/ConfirmDialog';
import Typography from '@/components/Typography';
import TransferForm from './TransferForm';

import type { TransferFormSchema } from './TransferForm';

type Operation = 'transfer' | 'swap' | 'deposit' | 'withdrawn';

// const FormComponents: Record<Operation, React.FC> = {
//   transfer: TransferForm,
//   swap: () => <div>swap</div>,
//   deposit: () => <div>deposit</div>,
//   withdrawn: () => <div>withdrawn</div>,
// };

type Props = {
  open: boolean;
  operations: Operation[];
  operationData: TransferFormSchema; // TODO support multiple operations
  onOpenChange: (open: boolean) => void;
};

const OperationDialog = ({
  open,
  operations,
  operationData,
  onOpenChange,
}: Props) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const renderTabs = operations.length > 1;

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
    }
  }, [open]);

  return (
    <>
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
              {operations.map(operation => {
                // const FormComponent = FormComponents[operation];
                return (
                  <TabsContent
                    key={`${operation}-content`}
                    className="py-4"
                    value={operation}
                  >
                    {/* <FormComponent data={{ username: 'Diego' }} /> */}
                    <TransferForm
                      ref={formRef}
                      data={operationData}
                      onSubmmit={() => onOpenChange(false)}
                      onError={setErrorMessage}
                    />
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : null}

          <DialogFooter>
            <Button
              onClick={async () => {
                if (formRef.current && (await formRef.current.validate())) {
                  setConfirmDialogOpen(true);
                }
              }}
            >
              Submit
            </Button>
          </DialogFooter>

          {errorMessage ? (
            <Typography variant="p" className="text-red-600">
              {errorMessage}
            </Typography>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDialogOpen}
        form="operation-form"
        onOpenChange={setConfirmDialogOpen}
      />
    </>
  );
};

export default OperationDialog;
