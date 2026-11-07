# ⚡ TURBO THUNDER 95: RADIATOR GRAND PRIX
> A fast-paced, high-octane 3D browser arcade racing game inspired by the characterful universe of *Cars*, built with Three.js, WebGL 2.0, and the Web Audio API.

[[https://img.shields.io/badge/Platform-Web%20%2F%20WebGL%202.0-blue.svg]](https://threejs.org/)
[[https://img.shields.io/badge/License-MIT-green.svg]](LICENSE)
[[https://img.shields.io/badge/Engine-Three.js%20r128-orange.svg]](https://threejs.org/)
[[https://img.shields.io/badge/Audio-Procedural%20Web%20Audio%20API-brightgreen.svg]]()
[[https://img.shields.io/badge/Built%20With-AI--Assisted%20Engineering-purple.svg]]()

---

## 🏎️ Game Overview
**Turbo Thunder 95** puts players behind the wheel of **"Thunder Red #95"**, a spirited stock-car racer equipped with animated windshield eyes, responsive arcade handling, and deployable rocket thrusters. Race across the sweeping **Radiator Canyon Circuit** against three distinct AI competitors through wide desert chicanes, high-speed straights, and under a monumental red sandstone arch.

---

## 🤖 AI-Assisted Development Disclosure
This project was designed, architected, and engineered through an **AI-Assisted Collaboration**:
- **Human Direction & Game Design:** Creative vision, art direction, track flow requirements, handling tuning feedback, and gameplay verification led by the project creator.
- **AI Engineering & Implementation:** Core math formulations (continuous Catmull-Rom spline projection, lateral binormal collision resolution $B_{\text{lat}}$, drift slip angle integration), procedural WebGL geometry/material generation, Web Audio API synthesis, and automated test suite authoring executed in collaboration with **Gemini**.

The result is a zero-dependency, 100% self-contained web game that loads in under 1.5 seconds and maintains a steady 60 FPS in modern browsers.

---

## 🎮 Key Features
- **Arcade Vehicle Physics:** Instant acceleration, progressive braking, speed-sensitive steering authority, and active suspension roll/pitch.
- **Expressive Character Car:** Animated windshield eyes, bumper smirk, Lightyear-branded rubber tires, active wheel steering, and deployable side Nitro thruster rockets.
- **Drift & Boost Mechanics:** Hold `Space` through corners to initiate a controlled powerslide that generates tire smoke, leaves skid ribbons, and recharges your Nitro tank.
- **Grand 2.4 km Circuit:** A super-wide 26-meter asphalt highway featuring high-speed stadium straights, spectator grandstands, neon chevron turn arrows, and an expansive natural sandstone rock arch with zero track obstructions.
- **Competitive AI Field:** Three rival racers (Boulder #12 Buggy, Venom #24 GT, Blaze #77 Hot Rod) with spline-based racing lines, obstacle avoidance, and dynamic rubber-banding pacing.
- **100% Procedural Web Audio Engine:** Zero external audio files; all engine harmonics (RPM-pitch modulation), tire squeals, nitro roars, collision impacts, and countdown chimes are synthesized on the fly via the native Web Audio API.
- **Broadcast HUD & Radar:** Real-time 4-car position leaderboard stack, digital speedometer, nitro arc gauge, lap timer, and an interactive vector radar mini-map.
- **Accessibility & Customization:** In-game steering sensitivity slider (50%–150%) saved to `localStorage`, difficulty selector, and mobile touch-screen controls overlay.

---

## 🕹️ Controls

### Keyboard (Desktop)
| Action | Key |
| :--- | :--- |
| **Accelerate** | `W` or `Up Arrow (↑)` |
| **Brake / Reverse** | `S` or `Down Arrow (↓)` |
| **Steer Left / Right** | `A` / `D` or `Left (←)` / `Right (→)` |
| **Drift (Powerslide)** | `Spacebar` (Hold through turns) |
| **Nitro Boost** | `Shift` or `N` |
| **Pause / Settings** | `Escape` or `P` |
| **Quick Restart** | `R` |

### Touch (Mobile / Tablet)
On-screen touch controls appear automatically on mobile devices:
- **Left Side:** `◀` (Steer Left) / `▶` (Steer Right)
- **Right Side:** `GAS`, `BRK`, `DRFT`, and `NITRO`

---

## 🚀 Quickstart & Playing Locally

1. Clone or download this repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/turbo-thunder-95.git](https://github.com/YOUR_USERNAME/turbo-thunder-95.git)
