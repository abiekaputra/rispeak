#include <WiFi.h>

namespace Pins {
constexpr uint8_t kPaymentButton = 4;
constexpr uint8_t kBuzzer = 5;
constexpr uint8_t kStatusLed = 6;
}  // namespace Pins

namespace Timing {
constexpr unsigned long kQueueDelayMs = 650;
constexpr unsigned long kAnnouncementMs = 1350;
constexpr unsigned long kAutoDemoDelayMs = 900;
}  // namespace Timing

enum class DeviceState { kConnecting, kReady, kQueued, kAnnouncing };

DeviceState state = DeviceState::kConnecting;
unsigned long stateStartedAt = 0;
bool lastButtonReading = HIGH;
bool autoDemoQueued = false;
uint32_t nextPaymentSequence = 1;

void printEvent(const char* event, const char* detail) {
  Serial.printf("{\"event\":\"%s\",\"detail\":\"%s\"}\n", event, detail);
}

void setState(DeviceState nextState) {
  state = nextState;
  stateStartedAt = millis();
}

void showReady() {
  digitalWrite(Pins::kStatusLed, HIGH);
  noTone(Pins::kBuzzer);
  setState(DeviceState::kReady);
  printEvent("device.ready", "Press P to simulate a verified payment");
}

void queuePayment() {
  if (state != DeviceState::kReady) {
    printEvent("payment.ignored", "The speaker is busy");
    return;
  }

  digitalWrite(Pins::kStatusLed, LOW);
  setState(DeviceState::kQueued);
  Serial.printf(
      "{\"event\":\"payment.queued\",\"paymentId\":\"demo-%lu\","
      "\"amount\":61500}\n",
      static_cast<unsigned long>(nextPaymentSequence++));
}

void beginAnnouncement() {
  setState(DeviceState::kAnnouncing);
  digitalWrite(Pins::kStatusLed, HIGH);
  tone(Pins::kBuzzer, 880);
  printEvent(
      "announcement.started",
      "Rispeak. Pembayaran diterima sebesar enam puluh satu ribu lima ratus rupiah.");
}

void finishAnnouncement() {
  noTone(Pins::kBuzzer);
  printEvent("announcement.acknowledged", "The device completed playback");
  showReady();
}

void connectToSimulationNetwork() {
  WiFi.mode(WIFI_STA);
  WiFi.begin("Wokwi-GUEST", "", 6);
  printEvent("network.connecting", "Wokwi-GUEST");

  const unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < 12000) {
    digitalWrite(Pins::kStatusLed, !digitalRead(Pins::kStatusLed));
    delay(200);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf(
        "{\"event\":\"network.connected\",\"ip\":\"%s\"}\n",
        WiFi.localIP().toString().c_str());
  } else {
    printEvent("network.offline", "Continuing with local simulation");
  }
}

void readPaymentButton() {
  const bool reading = digitalRead(Pins::kPaymentButton);
  if (lastButtonReading == HIGH && reading == LOW) {
    queuePayment();
  }
  lastButtonReading = reading;
}

void advanceStateMachine() {
  const unsigned long elapsed = millis() - stateStartedAt;

  if (state == DeviceState::kReady && !autoDemoQueued &&
      elapsed >= Timing::kAutoDemoDelayMs) {
    autoDemoQueued = true;
    queuePayment();
  } else if (state == DeviceState::kQueued &&
             elapsed >= Timing::kQueueDelayMs) {
    beginAnnouncement();
  } else if (state == DeviceState::kAnnouncing &&
             elapsed >= Timing::kAnnouncementMs) {
    finishAnnouncement();
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(Pins::kPaymentButton, INPUT_PULLUP);
  pinMode(Pins::kBuzzer, OUTPUT);
  pinMode(Pins::kStatusLed, OUTPUT);

  connectToSimulationNetwork();
  showReady();
}

void loop() {
  readPaymentButton();
  advanceStateMachine();
  delay(10);
}
