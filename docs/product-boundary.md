# Public Product Boundary

Rispeak was evaluated as a potential commercial product. This repository exposes enough material to evaluate the product thinking, interaction quality, responsive behavior, and engineering discipline without publishing the operational core.

## Feasibility decision

Development was paused on 23 October 2026 before any hardware purchase. The available merchant account does not expose an approved payment-success webhook or equivalent verification interface, so the product cannot reliably distinguish a completed payment from an unverified client-side notification.

The project does not use notification scraping, screen reading, private-application automation, or merchant login credentials as substitutes. Those approaches would create unacceptable false-announcement, reliability, maintenance, and account-security risks. The existing software and virtual-device work is retained as a validated portfolio prototype.

## Included here

- Interactive merchant console using deterministic simulated data.
- Payment-to-announcement user journey.
- Device profile and reliability states.
- Responsive interface and automated checks.
- High-level system context.
- ESP32-S3 Wokwi simulation for the device lifecycle and indicators.

## Kept private

- Merchant and payment-provider connectors.
- Event verification and reconciliation rules.
- Device provisioning and credential lifecycle.
- Fleet command transport and recovery implementation.
- Commercial configuration and operational runbooks.

The public demo makes no real payment claim and never requests merchant credentials.

The browser speaker uses the operating system's installed text-to-speech voices. Payment text stays on the device from the application's perspective; voice availability and processing behavior depend on the selected browser and operating system.

The Wokwi circuit uses a buzzer as an audio-completion surrogate. It does not prove voice quality or a production payment-provider connection. Physical implementation resumes only if an approved provider interface becomes available.
