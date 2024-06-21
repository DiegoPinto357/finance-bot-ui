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

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockLocalStorage = (() => {
  let store = {} as Storage;

  return {
    getItem: vi.fn((key: string) => {
      return store[key];
    }),

    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),

    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),

    clear: vi.fn(() => {
      store = {} as Storage;
    }),
  };
})();

vi.stubGlobal('localStorage', mockLocalStorage);
