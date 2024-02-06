import { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd';

const hideSourceOnDrag = true;

type Props = {
  portfolio: string;
  asset: string;
};

const ValueCell = ({
  portfolio,
  asset,
  children,
}: PropsWithChildren<Props>) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'tableCell',
      item: { rowId: portfolio, colId: asset },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }

  return (
    <div className="text-right" ref={drag}>
      {children}
    </div>
  );
};

export default ValueCell;
