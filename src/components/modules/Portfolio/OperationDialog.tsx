import { useState, useRef, useEffect, forwardRef } from 'react';
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
import { formatAssetName } from '@/lib/formatString';
import useGetAssetBalance from './useGetAssetBalance';
import TransferForm from './TransferForm';
import SwapForm from './SwapForm';

import type { ForwardRefExoticComponent } from 'react';
import type { DragAndDropOperationData } from './types';

type Operation = 'transfer' | 'swap' | 'deposit' | 'withdrawn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormComponents: Record<Operation, ForwardRefExoticComponent<any>> = {
  transfer: TransferForm,
  swap: SwapForm,
  deposit: forwardRef(() => <div>deposit</div>),
  withdrawn: forwardRef(() => <div>withdrawn</div>),
};

type Props = {
  open: boolean;
  operations: Operation[];
  operationData: DragAndDropOperationData;
  portfolios: string[];
  onOpenChange: (open: boolean) => void;
};

const OperationDialog = ({
  open,
  operations,
  operationData,
  portfolios,
  onOpenChange,
}: Props) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { originAsset, destinyAsset } = operationData;
  const assetsBalance = useGetAssetBalance([originAsset, destinyAsset]);

  // TODO remove the node "balance" from useGetAssetBalance result
  const originCurrentValue = assetsBalance?.balance[0].value;
  const destinyCurrentValue = assetsBalance?.balance[1].value;

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
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Operation</DialogTitle>
            <div className="py-2 text-sm text-muted-foreground">
              <Typography variant="p">
                {'Portfolio: '}
                <b>{operationData.portfolio}</b>
              </Typography>

              <Typography variant="p">
                {'Origin Asset: '}
                <b>{formatAssetName(operationData.originAsset)}</b>
              </Typography>

              <Typography variant="p">
                {'Destiny Asset: '}
                <b>{formatAssetName(operationData.destinyAsset)}</b>
              </Typography>
            </div>
          </DialogHeader>

          {renderTabs ? (
            <Tabs defaultValue={operations[0]}>
              <TabsList
                className={`grid w-full grid-cols-${operations.length}`}
                tabIndex={0}
              >
                {operations.map(operation => (
                  <TabsTrigger key={`${operation}-tab`} value={operation}>
                    {operation}
                  </TabsTrigger>
                ))}
              </TabsList>
              {operations.map(operation => {
                const FormComponent = FormComponents[operation];
                return (
                  <TabsContent
                    key={`${operation}-content`}
                    className="py-4"
                    value={operation}
                    tabIndex={-1}
                  >
                    <FormComponent
                      ref={formRef}
                      operationData={operationData}
                      currentAssetValues={{
                        originCurrentValue,
                        destinyCurrentValue,
                      }}
                      portfolios={portfolios}
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
