import { describe, it, expect } from 'vitest';

// Dummy function to test (replace with actual utility if available)
const add = (a: number, b: number) => a + b;

describe('add function', () => {
  it('should add two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('should handle zero', () => {
    expect(add(0, 0)).toBe(0);
  });
});
