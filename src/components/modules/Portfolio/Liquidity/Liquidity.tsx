import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';
import useGetPortfolioLiquidity from '../useGetPortfolioLiquidity';

const Liquidity = () => {
  const { data, isLoading, isFetching, refetch } = useGetPortfolioLiquidity();

  console.log(data);

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio Liquidity
      </PageHeading>
      {isLoading ? <Loader /> : null}
    </>
  );
};

export default Liquidity;
