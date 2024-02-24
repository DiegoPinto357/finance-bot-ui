export const mockedTransfer = vi.fn();

const useTransfer = () => ({ transfer: mockedTransfer });

export default useTransfer;
