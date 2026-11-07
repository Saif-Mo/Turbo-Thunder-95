# Lightning Racing — 3D Browser Arcade Game

> A colorful, exhilarating 3D browser arcade racing game inspired by the *Cars* universe, powered by Three.js and WebGL.

---

## ⚡ Game Overview
**Lightning Racing** puts you in the driver's seat of "Thunder Red #95", an expressive stock car with big personality, competing against three fierce AI opponents on the **Radiator Canyon Circuit**. Drift around high-banked stadium chicanes, blast through red sandstone canyon arches with twin rocket nitro thrusters, and battle for 1st place!

---

## 🎮 Features
- **Arcade Vehicle Physics**: Responsive acceleration, speed-sensitive steering, intuitive drifting with counter-steer assist, and high-velocity nitro acceleration.
- **Expressive Vehicle Character**: Windshield eyes, bumper smile, suspension body roll, rotating wheels, and deploying side thruster rockets.
- **Dynamic 3rd-Person Camera**: Cinematic chase camera with speed-dependent FOV, smooth damping, and drift compensation.
- **Radiator Canyon Circuit**: A 1.2km circuit featuring grandstand pit straight, neon chevron curves, red sandstone natural rock arches, and desert mesas.
- **Competitive AI Opponents**: Three distinct AI rivals ("Boulder" Dune Buggy, "Venom" GT Racer, "Blaze" Hot Rod) with waypoint navigation and dynamic rubber-banding.
- **Complete Arcade HUD & Audio**: Speedometer, gear/turbo gauge, live 4-car leaderboard stack, mini-map radar, lap/timer display, and synthesized Web Audio sound effects.

---

## 🕹️ Controls
| Key | Action |
| :--- | :--- |
| **W / Up Arrow** | Accelerate |
| **S / Down Arrow** | Brake / Reverse |
| **A / Left Arrow** | Steer Left |
| **D / Right Arrow** | Steer Right |
| **Space** | Drift (Tire smoke & skid marks) |
| **Shift / N** | Nitro Boost (Side thrusters & speed warp) |
| **Escape / P** | Pause / Settings |
| **R** | Quick Restart Race |

---

## 🛠️ Architecture & Tech Stack
- **Engine**: Three.js (WebGL 2.0)
- **Language**: TypeScript / Modern ES6+
- **Physics**: Custom arcade kinematic physics model
- **Audio**: Web Audio API (procedural synthesis for zero asset loading failures)
- **UI / HUD**: High-performance DOM / SVG overlays styled with modern responsive CSS
