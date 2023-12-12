<script lang="ts">
    import { onMount } from "svelte";
    import { readable } from "svelte/store";
    import {
        calculateSDNN,
        calculateRMSSD,
        calculateNN50,
        calculatepNN50,
        calculateAverageHR,
        calculateFrequencyDomainMetrics,
        calculateSlidingWindowMetrics,
        getLatestMetrics,
    } from "./hrvMetrics";

    let device: BluetoothDevice;
    let server: BluetoothRemoteGATTServer;
    let service: BluetoothRemoteGATTService;
    let characteristic: BluetoothRemoteGATTCharacteristic;
    let rrIntervals: number[] = [];
    let heartRate: number;

    let sdnn: number | null = null;
    let rmssd: number | null = null;
    let nn50: number | null = null;
    let pnn50: number | null = null;
    let averageHR: number | null = null;
    let latest_metrics: any = null; // Define the type according to your needs

    async function connect() {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ["heart_rate"] }],
        });
        server = await device.gatt.connect();
        service = await server.getPrimaryService("heart_rate");
        characteristic = await service.getCharacteristic(
            "heart_rate_measurement"
        );
        characteristic.addEventListener(
            "characteristicvaluechanged",
            handleHeartRateChange
        );
        await characteristic.startNotifications();
    }

    function handleHeartRateChange(event: Event) {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        const rr_interval = value?.getUint16(1, /*littleEndian=*/ true);
        rrIntervals.push(rr_interval);

        calculateSlidingWindowMetrics(rr_interval);

        if (latest_metrics) {
            // Code to update the UI with the latest metrics
        }

        sdnn = calculateSDNN(rrIntervals);
        rmssd = calculateRMSSD(rrIntervals);
        nn50 = calculateNN50(rrIntervals);
        pnn50 = calculatepNN50(rrIntervals);
        averageHR = calculateAverageHR(rrIntervals);

        latest_metrics = getLatestMetrics();

        // Update the UI
        // ...
    }

    onMount(() => {
        connect();
    });
</script>

<main>
    <!-- Svelte template code for the UI -->
    <!-- Existing Svelte template code to display heart rate and other metrics -->
</main>
