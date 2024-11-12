import Typography from '@/components/lib/Typography';
import Loader from '@/components/lib/Loader';
import useGetPortfolioShares from '../useGetPortfolioShares';

const Diff = () => {
  const { data, isLoading } = useGetPortfolioShares();

  return (
    <>
      <Typography variant="h1">Portfolio Diff</Typography>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {JSON.stringify(data)}
          {/* <DataTable
            className="mb-4"
            columns={TableColumns(header, {
              onPortfolioClick: handlePortfolioClick,
            })}
            data={mappedData}
            columnPinning={{ left: ['portfolio'], right: ['total'] }}
            onCellDrop={handleCellDrop}
          />
          <Typography variant="h3">
            Total: {formatCurrency(data?.total)}
          </Typography> */}
        </>
      )}
    </>
  );
};

export default Diff;
