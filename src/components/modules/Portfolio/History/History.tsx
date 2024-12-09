import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';
import useGetPortfolioHistory from '../useGetPortfolioHistory';

const History = () => {
  const { data, isLoading, isFetching, refetch } = useGetPortfolioHistory();
  // const { header, rows: mappedData } = useMemo(() => mapData(data), [data]);

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio Diff
      </PageHeading>
      {isLoading ? (
        <Loader />
      ) : (
        JSON.stringify(data, null, 2)
        // <DataTable
        //   className="mb-4"
        //   columns={TableColumns(header, mappedData)}
        //   data={mappedData}
        //   columnPinning={{ left: ['portfolio'], right: ['total'] }}
        // />
      )}
    </>
  );
};

export default History;
