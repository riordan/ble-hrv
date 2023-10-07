# BLE-HRV

Biofeedback in the browser

## How's this thing work?
Using the Bluetooth WebAPI to get heart rate variability data from a chest strap, in a browser.

## Getting started
So much wet paint. Instructions tk. Testing with a Polar H9 chest strap. Should hopefully work with others.

## Prior Art
This project couldn't have been done without the work of those who came before:
- [Elite HRV](https://elitehrv.com/) - One of the best HRV tracking tools, who for years have been evangelizing the practice of HRV biofeedback. They've been superheroes in making HRV accessible and actionable.
- [OpenHRV](https://github.com/JanCBrammer/OpenHRV) built one of the most robust and friendliest HRV apps in Python. Their work made it really easy to go beyond counting BPM data with the BLE heart rate sensors.
- [ble-heart-rate-demo](https://github.com/yossi-eynav/ble-heart-rate-demo) which showed how straightforward it was to read from the bluetooth webapi and start working with raw heart rate data.
- [roaders/ble-hrm](https://github.com/roaders/ble-hrm) which showed how cleanly the heart rate datastream could cleanly be wrapped up in a module with the core HRV inputs captured.