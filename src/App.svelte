<script lang="ts">
    import {
        connectToHeartRateDevice,
        parseHeartRate,
        getBatteryLevel,
        getDeviceInfo,
    } from "./bleHelper.js";

    let isWebBluetoothAvailable = false;

    // Reactive statement to check for WebBluetooth support
    $: isWebBluetoothAvailable = 'bluetooth' in navigator && navigator.bluetooth != null;
	
    import {
        calculateSDNN,
        calculateRMSSD,
        calculateNN50,
        calculatepNN50,
        calculateAverageHR,
        calculateFrequencyDomainMetrics,
    } from "./hrvMetrics.js";

    type HeartRateData = {
        timestamp: number;
        heartRate: number;
        contactDetected: boolean;
        energyExpended?: number;
        rrIntervals?: number[];
    };

    type FrequencyMetrics = {
        totalPower: number;
        vlf: number;
        lf: number;
        hf: number;
        lf_hf_ratio: number;
    };

    type DeviceInfo = {
        name: string; 
        id: string;
    };

    let heartRateResult: HeartRateData | null = null;
    let batteryLevel: number | null = null;
    let deviceInfo: DeviceInfo | null = null;
    let sdnn: number | null = null;
    let rmssd: number | null = null;
    let nn50: number | null = null;
    let pnn50: number | null = null;
    let averageHR: number | null = null;
    let frequencyMetrics: FrequencyMetrics | null = null;

    async function connect() {
        try {
            const { characteristic, device } = await connectToHeartRateDevice();

            batteryLevel = await getBatteryLevel(device);
            
            // Fix name property to be required string
            deviceInfo = {
                name: device.name!,
                id: device.id
            };

            characteristic.startNotifications();
            characteristic.addEventListener(
                "characteristicvaluechanged",
                handleHeartRateChange
            );
        } catch (error) {
            console.error(error);
            // Display the error to the user
        }
    }

    function handleHeartRateChange(event: Event) {
        // Type assertion for the event target
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        
        // Add check for undefined value
        if (target.value) {
          heartRateResult = parseHeartRate(target.value);
        }

        if (heartRateResult?.rrIntervals && heartRateResult.rrIntervals.length > 1) {
            sdnn = calculateSDNN(heartRateResult.rrIntervals);
            rmssd = calculateRMSSD(heartRateResult.rrIntervals);
            nn50 = calculateNN50(heartRateResult.rrIntervals);
            pnn50 = calculatepNN50(heartRateResult.rrIntervals);
            console.log(`NN50: ${nn50}, pNN50: ${pnn50}`); // Log NN50 and pNN50 values
            averageHR = calculateAverageHR(heartRateResult.rrIntervals);

            // Temporarily disabled frequency domain metrics calculation
            // frequencyMetrics = calculateFrequencyDomainMetrics(heartRateResult.rrIntervals);
        }
    }
</script>

{#if isWebBluetoothAvailable}
    <button on:click={connect}>Connect to Heart Rate Monitor</button>
{:else}
    <p>WebBluetooth is not enabled in your browser. Please enable it to use this application.</p>
{/if}

{#if heartRateResult}
	<div>
		<p>Timestamp: {heartRateResult.timestamp}</p>
		<p>Heart Rate: {heartRateResult.heartRate} bpm</p>
		<p>Contact Detected: {heartRateResult.contactDetected ? 'Yes' : 'No'}</p> <!-- Added line for contact detection -->
		<p>Battery Level: {batteryLevel}%</p>
		{#if deviceInfo}
			<p>Device Name: {deviceInfo.name}</p>
		{/if}

		<h3>HRV Metrics (Time Domain)</h3>
		<p>SDNN: {sdnn}</p>
		<p>RMSSD: {rmssd}</p>
		<p>NN50: {nn50}</p>
		<p>pNN50: {pnn50}%</p>
		<p>Average HR: {averageHR} bpm</p>

		{#if frequencyMetrics}
			<h3>HRV Metrics (Frequency Domain)</h3>
			<p>Total Power: {frequencyMetrics.totalPower}</p>
			<p>VLF: {frequencyMetrics.vlf}</p>
			<p>LF: {frequencyMetrics.lf}</p>
			<p>HF: {frequencyMetrics.hf}</p>
			<p>LF/HF Ratio: {frequencyMetrics.lf_hf_ratio}</p>
		{/if}
	</div>
{/if}
