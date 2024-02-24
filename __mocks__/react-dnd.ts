import { vi } from 'vitest';

export const useDrag = vi
  .fn()
  .mockImplementation(() => [vi.fn(), vi.fn(), vi.fn()]);

export const useDrop = vi
  .fn()
  .mockImplementation(() => [vi.fn(), vi.fn(), vi.fn()]);
