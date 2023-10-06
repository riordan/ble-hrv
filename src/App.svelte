<script>
	import {
		connectToHeartRateDevice,
		parseHeartRate,
		getBatteryLevel,
		getDeviceInfo,
	} from "./bleHelper.js";
	import {
		calculateSDNN,
		calculateRMSSD,
		calculateNN50,
		calculatepNN50,
		calculateAverageHR,
		calculateFrequencyDomainMetrics,
	} from "./hrvMetrics.js";

	let heartRateResult = null;
	let batteryLevel;
	let deviceInfo;
	let sdnn, rmssd, nn50, pnn50, averageHR;
	let frequencyMetrics;

	async function connect() {
		try {
			const { characteristic, device } = await connectToHeartRateDevice();

			batteryLevel = await getBatteryLevel(device);
			deviceInfo = getDeviceInfo(device);

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

	function handleHeartRateChange(event) {
		heartRateResult = parseHeartRate(event.target.value);

		if (
			heartRateResult.rrIntervals &&
			heartRateResult.rrIntervals.length > 1
		) {
			sdnn = calculateSDNN(heartRateResult.rrIntervals);
			rmssd = calculateRMSSD(heartRateResult.rrIntervals);
			nn50 = calculateNN50(heartRateResult.rrIntervals);
			pnn50 = calculatepNN50(heartRateResult.rrIntervals);
			averageHR = calculateAverageHR(heartRateResult.rrIntervals);

			frequencyMetrics = calculateFrequencyDomainMetrics(
				heartRateResult.rrIntervals
			);
		}
	}
</script>

<button on:click={connect}>Connect to Heart Rate Monitor</button>

{#if heartRateResult}
	<div>
		<p>Timestamp: {heartRateResult.timestamp}</p>
		<p>Heart Rate: {heartRateResult.heartRate} bpm</p>
		<p>Battery Level: {batteryLevel}%</p>
		<p>Device Name: {deviceInfo.name}</p>

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
