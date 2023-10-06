import FFT from 'fft-js';


// Time domain metrics

// SDNN: Standard Deviation of NN intervals
export function calculateSDNN(rrIntervals) {
    const mean = rrIntervals.reduce((acc, val) => acc + val, 0) / rrIntervals.length;
    const squaredDiffs = rrIntervals.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / rrIntervals.length;
    return Math.sqrt(variance);
}

// RMSSD: Root Mean Square of Successive Differences
export function calculateRMSSD(rrIntervals) {
    const squaredDiffs = [];
    for (let i = 1; i < rrIntervals.length; i++) {
        const diff = rrIntervals[i] - rrIntervals[i - 1];
        squaredDiffs.push(diff * diff);
    }
    return Math.sqrt(squaredDiffs.reduce((acc, val) => acc + val, 0) / squaredDiffs.length);
}

// NN50 and pNN50
export function calculateNN50(rrIntervals) {
    let count = 0;
    for (let i = 1; i < rrIntervals.length; i++) {
        if (Math.abs(rrIntervals[i] - rrIntervals[i - 1]) > 50) count++;
    }
    return count;
}

export function calculatepNN50(rrIntervals) {
    const nn50 = calculateNN50(rrIntervals);
    return (nn50 / rrIntervals.length) * 100;
}

// Average Heart Rate
export function calculateAverageHR(rrIntervals) {
    const totalTime = rrIntervals.reduce((acc, val) => acc + val, 0);
    return (60000 / (totalTime / rrIntervals.length));
}

// Frequency domain metrics

// Helper to compute power spectral density
function powerSpectralDensity(fftOutput) {
    return fftOutput.map(value => (value[0] ** 2 + value[1] ** 2));
}

// Calculate frequency domain metrics
export function calculateFrequencyDomainMetrics(rrIntervals) {
    const fftOutput = FFT.fft(FFT.util.fftResult(rrIntervals));
    const psd = powerSpectralDensity(fftOutput);

    let totalPower = 0;
    let vlf = 0;
    let lf = 0;
    let hf = 0;

    // Assuming a sampling rate of one value per second (this might need adjustment)
    const freqResolution = 1 / rrIntervals.length;

    for (let i = 0; i < psd.length; i++) {
        const freq = freqResolution * i;

        totalPower += psd[i];

        if (freq >= 0.0033 && freq < 0.04) {
            vlf += psd[i];
        } else if (freq >= 0.04 && freq < 0.15) {
            lf += psd[i];
        } else if (freq >= 0.15 && freq < 0.4) {
            hf += psd[i];
        }
    }

    return {
        totalPower,
        vlf,
        lf,
        hf,
        lf_hf_ratio: lf / hf
    };
}
