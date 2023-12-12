import { describe, it, expect } from 'vitest';
import { calculateSDNN } from './hrvMetrics';

describe('calculateSDNN', () => {
  it('should calculate the standard deviation of NN intervals', () => {
    // Example RR intervals in milliseconds
    const rrIntervals = [800, 810, 790, 830, 780];
    // Corrected expected SDNN (rounded to two decimal places for the test)
    const expectedSDNN = 17.20;
    // Calculate SDNN using the function
    const sdnn = calculateSDNN(rrIntervals);
    // Check if the calculated SDNN matches the expected value (with a tolerance for floating-point comparisons)
    expect(sdnn).toBeCloseTo(expectedSDNN, 2);
  });
});
