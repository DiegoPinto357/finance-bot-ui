import { RotateCw } from 'lucide-react';
import Typography from '@/components/lib/Typography';
import { Button } from '@/components/ui/button';
import { PropsWithChildren } from 'react';

type Props = {
  isRefreshing: boolean;
  onRefreshClick: () => void;
};

const PageHeading = ({
  isRefreshing,
  onRefreshClick,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div className="flex items-baseline gap-2">
      <Typography variant="h1">{children}</Typography>
      <Button
        variant="link"
        disabled={isRefreshing}
        onClick={() => onRefreshClick()}
      >
        <RotateCw className={isRefreshing ? 'animate-spin' : ''} />
      </Button>
    </div>
  );
};

export default PageHeading;
