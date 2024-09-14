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
import { Separator } from '@/components/ui/separator';
import ConfirmDialog from '@/components/lib/ConfirmDialog';
import Typography from '@/components/lib/Typography';
import { formatAssetName, capitalizeString } from '@/lib/formatString';
import useGetAssetBalance from './useGetAssetBalance';
import TransferForm from './TransferForm';
import SwapForm from './SwapForm';

import type { Asset } from '@/types';
import type { ForwardRefExoticComponent } from 'react';
import type { DragAndDropOperationData } from './types';

type Operation = 'transfer' | 'swap' | 'deposit' | 'withdrawn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormComponent = ForwardRefExoticComponent<any>;

const FormComponents: Record<Operation, FormComponent> = {
  transfer: TransferForm,
  swap: SwapForm,
  deposit: forwardRef(() => <div>deposit</div>),
  withdrawn: forwardRef(() => <div>withdrawn</div>),
};

const allowedAssetsForTransfer = [
  { class: 'fixed' },
  { class: 'stock', name: 'float' },
  { class: 'crypto', name: 'hodl' },
  { class: 'crypto', name: 'binanceBuffer' },
  { class: 'crypto', name: 'backed' },
];

const isAssetAllowedForTransfer = (asset: Asset) =>
  allowedAssetsForTransfer.some(
    allowedAsset =>
      allowedAsset.class === asset.class &&
      (allowedAsset.name === undefined || allowedAsset.name === asset.name)
  );

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
  const [originCurrentValue, destinyCurrentValue] = useGetAssetBalance([
    originAsset,
    destinyAsset,
  ]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
    }
  }, [open]);

  const allowedOperations = operations.filter(
    operation =>
      operation !== 'transfer' ||
      (isAssetAllowedForTransfer(operationData.originAsset) &&
        isAssetAllowedForTransfer(operationData.destinyAsset))
  );

  const renderTabs = allowedOperations.length > 1;

  const renderForm = (FormComponent: FormComponent) => {
    return (
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
    );
  };

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
            <Tabs defaultValue={allowedOperations[0]}>
              <TabsList
                className={`grid w-full grid-cols-${
                  allowedOperations.length || 2
                }`}
                tabIndex={0}
              >
                {allowedOperations.map(operation => (
                  <TabsTrigger key={`${operation}-tab`} value={operation}>
                    {capitalizeString(operation)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {allowedOperations.map(operation => {
                return (
                  <TabsContent
                    key={`${operation}-content`}
                    className="py-4"
                    value={operation}
                    tabIndex={-1}
                  >
                    {renderForm(FormComponents[operation])}
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : (
            <div>
              <Separator className="mb-4" />
              <Typography variant="h3">
                {capitalizeString(allowedOperations[0])}
              </Typography>
              {renderForm(FormComponents[allowedOperations[0]])}
            </div>
          )}

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
