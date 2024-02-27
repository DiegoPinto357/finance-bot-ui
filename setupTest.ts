import { vi, expect, afterEach } from 'vitest';
import 'vitest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import * as matchers from 'vitest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
