// import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/lib/ConfirmDialog';
import Typography from '@/components/lib/Typography';
import useGetFixedBalance from '../Fixed/useGetFixedBalance';
import TransferForm from './TransferForm';

import { DragAndDropOperationData } from './types';

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
  operationData: DragAndDropOperationData;
  onOpenChange: (open: boolean) => void;
};

const OperationDialog = ({
  open,
  operations,
  operationData,
  onOpenChange,
}: Props) => {
  console.log('OperationDialog');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { originAsset, destinyAsset } = operationData;
  const { data: fixedBalance } = useGetFixedBalance([
    originAsset,
    destinyAsset,
  ]);

  const originCurrentValue =
    fixedBalance?.balance.find(({ asset }) => asset === originAsset)?.value ||
    0;
  const destinyCurrentValue =
    fixedBalance?.balance.find(({ asset }) => asset === destinyAsset)?.value ||
    0;

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
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Operation</DialogTitle>
            <div className="py-2 text-sm text-muted-foreground">
              <Typography variant="p">
                {'Portfolio: '}
                <b>{operationData.portfolio}</b>
              </Typography>

              <Typography variant="p">
                {'Origin Asset: '}
                <b>{operationData.originAsset}</b>
              </Typography>

              <Typography variant="p">
                {'Destiny Asset: '}
                <b>{operationData.destinyAsset}</b>
              </Typography>
            </div>
          </DialogHeader>

          {renderTabs ? (
            <Tabs defaultValue={operations[0]}>
              <TabsList className="grid w-full grid-cols-2" tabIndex={0}>
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
                    tabIndex={-1}
                  >
                    {/* <FormComponent data={{ username: 'Diego' }} /> */}
                    <TransferForm
                      ref={formRef}
                      operationData={operationData}
                      currentAssetValues={{
                        originCurrentValue,
                        destinyCurrentValue,
                      }}
                      onSubmmit={() => onOpenChange(false)}
                      onError={setErrorMessage}
                    />
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : null}

          <DialogFooter>
            {/* TODO adjst button label based on selected operation */}
            <Button
              className="w-full"
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
