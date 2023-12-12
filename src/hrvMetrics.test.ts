import { describe, it, expect } from 'vitest';
import {
    calculateSDNN,
    calculateRMSSD,
    calculateNN50,
    calculatepNN50,
    calculateAverageHR
} from './hrvMetrics';

// Test data
const shortRRIntervals = [521.0, 534.0, 578.0, 613.0, 642.0];
const longRRIntervals = [521.0, 534.0, 578.0, 613.0, 642.0, 644.0, 625.0, 584.0, 545.0, 533.0, 538.0, 563.0, 621.0, 674.0, 712.0, 717.0, 714.0, 701.0, 676.0, 670.0, 669.0, 683.0, 689.0, 671.0, 656.0, 668.0, 646.0, 631.0, 593.0, 567.0, 545.0, 536.0, 537.0, 549.0, 560.0, 544.0, 528.0, 521.0, 525.0, 528.0, 528.0, 520.0, 513.0, 504.0, 505.0, 505.0, 505.0, 507.0, 504.0, 500.0, 497.0, 491.0, 487.0, 487.0, 479.0, 478.0, 477.0, 467.0, 471.0, 469.0, 472.0, 472.0, 469.0, 467.0, 465.0, 464.0, 466.0, 466.0, 469.0, 468.0, 472.0, 475.0, 473.0, 472.0, 468.0, 1402.0, 963.0, 956.0, 476.0, 473.0, 469.0, 470.0, 471.0, 469.0, 466.0, 465.0, 467.0, 470.0, 474.0, 475.0, 474.0, 473.0, 472.0, 474.0, 477.0, 479.0, 480.0, 486.0, 496.0, 518.0, 536.0, 543.0, 550.0, 558.0, 562.0, 565.0, 568.0, 571.0, 575.0, 574.0, 569.0, 560.0, 538.0, 519.0];


describe('calculateSDNN', () => {
    it('should calculate SDNN for a short slice of RR intervals', () => {
        const expectedSDNN = 45.84;
        const sdnn = calculateSDNN(shortRRIntervals);
        expect(sdnn).toBeCloseTo(expectedSDNN, 2);
    });

    it('should calculate SDNN for a long slice of RR intervals', () => {
        const expectedSDNN = 120.32;
        const sdnn = calculateSDNN(longRRIntervals);
        expect(sdnn).toBeCloseTo(expectedSDNN, 2);
    });
});

describe('calculateRMSSD', () => {
    it('should calculate RMSSD for a short slice of RR intervals', () => {
        const expectedRMSSD = 32.29;
        const rmssd = calculateRMSSD(shortRRIntervals);
        expect(rmssd).toBeCloseTo(expectedRMSSD, 2);
    });

    it('should calculate RMSSD for a long slice of RR intervals', () => {
        const expectedRMSSD = 108.10;
        const rmssd = calculateRMSSD(longRRIntervals);
        expect(rmssd).toBeCloseTo(expectedRMSSD, 2);
    });
});

describe('calculateNN50', () => {
    it('should calculate NN50 for a short slice of RR intervals', () => {
        const expectedNN50 = 0;
        const nn50 = calculateNN50(shortRRIntervals);
        expect(nn50).toBe(expectedNN50);
    });

    it('should calculate NN50 for a long slice of RR intervals', () => {
        const expectedNN50 = 5;
        const nn50 = calculateNN50(longRRIntervals);
        expect(nn50).toBe(expectedNN50);
    });
});

describe('calculatepNN50', () => {
    it('should calculate pNN50 for a short slice of RR intervals', () => {
        const expectedpNN50 = 0.0;
        const pnn50 = calculatepNN50(shortRRIntervals);
        expect(pnn50).toBeCloseTo(expectedpNN50, 2);
    });

    it('should calculate pNN50 for a long slice of RR intervals', () => {
        const expectedpNN50 = 4.39;
        const pnn50 = calculatepNN50(longRRIntervals);
        expect(pnn50).toBeCloseTo(expectedpNN50, 2);
    });
});

describe('calculateAverageHR', () => {
    it('should calculate the average heart rate from a short slice of RR intervals', () => {
        const expectedAverageHR = 103.88;
        const averageHR = calculateAverageHR(shortRRIntervals);
        expect(averageHR).toBeCloseTo(expectedAverageHR, 2);
    });

    it('should calculate the average heart rate from a long slice of RR intervals', () => {
        const expectedAverageHR = 108.98;
        const averageHR = calculateAverageHR(longRRIntervals);
        expect(averageHR).toBeCloseTo(expectedAverageHR, 2);
    });
});
