import { vi } from 'vitest';

export const useMutation = vi.fn();

export const useQueryClient = vi.fn(() => ({
  refetchQueries: vi.fn(),
  invalidateQueries: vi.fn(),
}));

export const useQuery = vi.fn();
