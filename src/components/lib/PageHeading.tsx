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
    <div className="flex items-baseline gap-3">
      <Typography variant="h1">{children}</Typography>
      <Button
        className="h-12 p-0"
        variant="link"
        disabled={isRefreshing}
        onClick={() => onRefreshClick()}
      >
        <RotateCw
          style={{ height: '1.5rem', width: '1.5rem' }}
          className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`}
        />
      </Button>
    </div>
  );
};

export default PageHeading;
