export async function connectToHeartRateDevice() {
    if (!navigator.bluetooth) {
        throw new Error("Bluetooth is not supported on this device.");
    }

    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            optionalServices: ['battery_service']
        });

        if (device.gatt) {
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService('heart_rate');
            const characteristic = await service.getCharacteristic('heart_rate_measurement');

            return { characteristic, device };
        }
        throw new Error("Device GATT is undefined");
    } catch (error: unknown) {
        console.error("Bluetooth Error:", error);
        throw new Error(`Failed to connect to device: ${(error as Error).message}`);
    }
}
// Ensure all export statements are at the top level
export function parseHeartRate(value: DataView) {
    // This logic is based on the Bluetooth SIG Heart Rate Profile specification

    // Flags
    const flags = value.getUint8(0);
    const heartRate16BitFormat = (flags & 0x01) === 0x01;
    const contactDetected = (flags & 0x06) === 0x06;
    const energyExpendedStatus = (flags & 0x08) === 0x08;
    const rrIntervalPresent = (flags & 0x10) === 0x10;

    let currentOffset = 1;
    const heartRate = heartRate16BitFormat ? value.getUint16(currentOffset, true) : value.getUint8(currentOffset);

    currentOffset += heartRate16BitFormat ? 2 : 1;

    let energyExpended;
    if (energyExpendedStatus) {
        energyExpended = value.getUint16(currentOffset, true);
        currentOffset += 2;
    }

    const rrIntervals = [];
    if (rrIntervalPresent) {
        while (currentOffset + 1 <= value.byteLength) {
            rrIntervals.push(value.getUint16(currentOffset, true));
            currentOffset += 2;
        }
    }

    return {
        timestamp: Date.now(),
        heartRate,
        contactDetected,
        energyExpended,
        rrIntervals: rrIntervals.length > 0 ? rrIntervals : undefined
    };
}
// Ensure all export statements are at the top level
export async function getBatteryLevel(device: BluetoothDevice) {
    if (!device.gatt) {
        throw new Error("'device.gatt' is undefined");
    }
    
    try {
        const server = await device.gatt.connect();
        const batteryService = await server.getPrimaryService('battery_service');
        const batteryLevelChar = await batteryService.getCharacteristic('battery_level');
        const batteryLevel = await batteryLevelChar.readValue();

        return batteryLevel.getUint8(0);  // returns battery percentage
    } catch (error: unknown) {
        console.error("Battery Level Error:", error);
        return null;
    }
}

// Ensure all export statements are at the top level
export function stopHeartRateNotifications(characteristic: BluetoothRemoteGATTCharacteristic, callback: (event: Event) => void) {
    try {
        characteristic.stopNotifications();
        characteristic.removeEventListener('characteristicvaluechanged', callback);
    } catch (error) {
        console.error("Stop Notifications Error:", error);
    }
}


// Ensure all export statements are at the top level
export function getDeviceInfo(device: BluetoothDevice) {
    return {
        name: device.name,
        id: device.id
    };
}
