import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';
import DataTable from '@/components/DataTable';
import useGetPortfolioLiquidity from '../useGetPortfolioLiquidity';
import { TableColumns } from './TableColumns';

const Liquidity = () => {
  const { data, isLoading, isFetching, refetch } = useGetPortfolioLiquidity();

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio Liquidity
      </PageHeading>
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable className="mb-4" columns={TableColumns} data={data} />
      )}
    </>
  );
};

export default Liquidity;
