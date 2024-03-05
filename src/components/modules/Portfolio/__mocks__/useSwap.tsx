export const mockedSwap = vi.fn();

const useSwap = () => ({ swap: mockedSwap });

export default useSwap;
