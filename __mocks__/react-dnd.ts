import { vi } from 'vitest';

type DragFunc = () => void;

let dragFunc: () => void;

export const useDrag = vi.fn().mockImplementation((func: DragFunc) => {
  dragFunc = func;
  return [vi.fn(), vi.fn(), vi.fn()];
});

export const useDrop = vi
  .fn()
  .mockImplementation(() => [vi.fn(), vi.fn(), vi.fn()]);

export const triggerDrag = () => {
  if (dragFunc) {
    const dragData = dragFunc();
    console.log({ dragData });
  }
};
