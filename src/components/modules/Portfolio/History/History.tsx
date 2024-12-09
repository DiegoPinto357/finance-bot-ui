import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';

const History = () => {
  // const { data, isLoading, isFetching, refetch } = useGetPortfolioShares();
  // const { header, rows: mappedData } = useMemo(() => mapData(data), [data]);
  const isFetching = true;
  const isLoading = false;
  const refetch = () => {};

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio Diff
      </PageHeading>
      {isLoading ? (
        <Loader />
      ) : (
        'data'
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
