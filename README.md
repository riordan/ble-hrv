# BLE-HRV

Biofeedback in the browser

## How's this thing work?
Using the Bluetooth WebAPI to get heart rate variability data from a chest strap, in a browser.

## Getting started
This project uses the WebBluetooth API, which requires specific browser configurations to function correctly. Below are instructions for enabling WebBluetooth in different browsers:

- **Chrome**: WebBluetooth should be enabled by default in Chrome. If it's not working, make sure you are using a recent version of Chrome and that the site has been granted the necessary permissions to use Bluetooth devices.
- **Firefox**: WebBluetooth is not supported by default. You can enable it by navigating to `about:config`, searching for `dom.webbluetooth.enabled`, and setting it to `true`. Note that this is an experimental feature and might not be as stable as in other browsers.
- **Safari**: As of the last update to this document, Safari does not support the WebBluetooth API.

Testing with a Polar H9 chest strap. Should hopefully work with others.

## Frequency Domain Metrics Calculation Approach

To calculate frequency domain metrics, our approach will be to:
1. Calculate them in real-time via a sliding window.
2. Introduce the concept of a logged session and be able to fully compute the frequency domain metrics for a whole session or across windows of that session.

## Prior Art
This project couldn't have been done without the work of those who came before:
- [Elite HRV](https://elitehrv.com/) - One of the best HRV tracking tools, who for years have been evangelizing the practice of HRV biofeedback. They've been superheroes in making HRV accessible and actionable.
- [OpenHRV](https://github.com/JanCBrammer/OpenHRV) built one of the most robust and friendliest HRV apps in Python. Their work made it really easy to go beyond counting BPM data with the BLE heart rate sensors.
- [ble-heart-rate-demo](https://github.com/yossi-eynav/ble-heart-rate-demo) which showed how straightforward it was to read from the bluetooth webapi and start working with raw heart rate data.
- [roaders/ble-hrm](https://github.com/roaders/ble-hrm) which showed how cleanly the heart rate datastream could cleanly be wrapped up in a module with the core HRV inputs captured.
