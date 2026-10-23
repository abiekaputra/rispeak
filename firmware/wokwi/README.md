# Rispeak ESP32-S3 Simulation

This Wokwi circuit validates the device-side payment announcement lifecycle without purchasing hardware or exposing payment-provider credentials.

## What it proves

- ESP32-S3 firmware starts and joins Wokwi's simulated Wi-Fi network.
- A verified payment command can enter the device queue.
- The device moves through queued, announcing, acknowledged, and ready states.
- The status LED and Serial Monitor expose the current state.
- Pressing `P` sends another simulated verified-payment command.

The first payment is queued automatically after startup. Its exact audio contract is `Rispeak. Pembayaran diterima sebesar enam puluh satu ribu lima ratus rupiah.` The buzzer represents the audio adapter and acknowledgement boundary; it does not reproduce Indonesian speech. Wokwi currently does not emulate ESP32-S3 I2S, so spoken nominal audio remains covered by the browser product simulator until physical hardware is available.

The virtual button has contact bounce disabled, so the simulator uses edge detection without a physical-switch debounce delay. The physical prototype must restore measured hardware debounce behavior.

## Run in Wokwi

1. Open the [ESP32-S3 Arduino template](https://wokwi.com/projects/new/choose-board/esp32-s3).
2. Replace `sketch.ino` and `diagram.json` with the files in this directory.
3. Start the simulation.
4. Confirm the Serial Monitor reaches `network.connected`, `payment.queued`, `announcement.started`, `announcement.acknowledged`, and `device.ready`.
5. Press `P` and confirm the lifecycle runs again.

No ShopeePay account, credential, real QRIS payment, or paid Wokwi feature is required for this test.
