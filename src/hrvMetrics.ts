import webfft from "webfft";


// Constants for frequency bands
const VLF_BAND = [0.0033, 0.04];
const LF_BAND = [0.04, 0.15];
const HF_BAND = [0.15, 0.4];


// Time domain metrics

// SDNN: Standard Deviation of NN intervals
export function calculateSDNN(rrIntervals: number[]) {
    const mean = rrIntervals.reduce((acc, val) => acc + val, 0) / rrIntervals.length;
    const squaredDiffs = rrIntervals.map(val => (val - mean) ** 2);
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / rrIntervals.length;
    return Math.sqrt(variance);
}

// RMSSD: Root Mean Square of Successive Differences
export function calculateRMSSD(rrIntervals: number[]) {
    const squaredDiffs = [];
    for (let i = 1; i < rrIntervals.length; i++) {
        const diff = rrIntervals[i] - rrIntervals[i - 1];
        squaredDiffs.push(diff * diff);
    }
    return Math.sqrt(squaredDiffs.reduce((acc, val) => acc + val, 0) / squaredDiffs.length);
}

// NN50 and pNN50
export function calculateNN50(rrIntervals: number[]) {
    let count = 0;
    for (let i = 1; i < rrIntervals.length; i++) {
        if (Math.abs(rrIntervals[i] - rrIntervals[i - 1]) > 50) count++;
    }
    return count;
}

export function calculatepNN50(rrIntervals: number[]) {
    const nn50 = calculateNN50(rrIntervals);
    return (nn50 / rrIntervals.length) * 100;
}

// Average Heart Rate
export function calculateAverageHR(rrIntervals: number[]) {
    const totalTime = rrIntervals.reduce((acc, val) => acc + val, 0);
    return (60000 / (totalTime / rrIntervals.length));
}
function isPowerOfTwo(n: number): boolean {
    return !!n && (n & (n - 1)) === 0;
}


//Calculate Frequency Domain metrics

export function calculateFrequencyDomainMetrics(rrIntervals: number[]) {
    const n = rrIntervals.length;
    
    // Log the size of rrIntervals for diagnostics.
    console.log(`Processing rrIntervals of size: ${n}`);

    // Ensure that the size is a power of 2 and within the allowed range.
    if (!isPowerOfTwo(n)) {
        console.error(`Invalid size: ${n}. Size is not a power of 2.`);
    }
    if (n < 4 || n > 131072) {
        console.error(`Invalid size: ${n}. Size is out of the allowed range (4 to 131072).`);
    }

    const sampleRate = 1 / (rrIntervals.reduce((a, b) => a + b, 0) / n / 1000);  // in Hz

    // Create FFT object
    const fft = new webfft(n);

    // Convert RR intervals to time series
    const timeSeriesArray = Array.from({ length: n }, (_, i) => {
        return (60000 / rrIntervals[i]) - (60000 / (rrIntervals.reduce((a, b) => a + b, 0) / n));
    });

    const timeSeries = new Float32Array(timeSeriesArray);


    // Compute the power spectral density (PSD)
    const spectrum = fft.fft(timeSeries);
    const psd = [];
    for (let i = 0; i < spectrum.length; i += 2) {
        const real = spectrum[i];
        const imag = spectrum[i + 1];
        psd.push((real * real + imag * imag) / n);
    }

    // Calculate power in each frequency band
    const totalPower = integratePSD(psd, sampleRate, VLF_BAND[0], HF_BAND[1]);
    const vlf = integratePSD(psd, sampleRate, VLF_BAND[0], VLF_BAND[1]);
    const lf = integratePSD(psd, sampleRate, LF_BAND[0], LF_BAND[1]);
    const hf = integratePSD(psd, sampleRate, HF_BAND[0], HF_BAND[1]);

    // Clean up
    fft.dispose();

    return {
        totalPower,
        vlf,
        lf,
        hf,
        lf_hf_ratio: lf / hf
    };
}


function integratePSD(psd: number[], sampleRate: number, fStart: number, fEnd: number): number {
    const df = sampleRate / psd.length;  // frequency resolution
    const startIndex = Math.round(fStart / df);
    const endIndex = Math.round(fEnd / df);

    let sum = 0;
    for (let i = startIndex; i <= endIndex; i++) {
        sum += psd[i];
    }
    return sum * df;
}
// Template for calculateSlidingWindowMetrics function
export function calculateSlidingWindowMetrics(rrIntervals: number[]) {
    // TODO: Implement the logic for sliding window metrics calculation
    // Placeholder return
    return {};
}

// Template for getLatestMetrics function
export function getLatestMetrics(rrIntervals: number[]) {
    // TODO: Implement the logic for getting the latest metrics
    // Placeholder return
    return {};
}
