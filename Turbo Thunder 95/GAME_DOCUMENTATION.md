# GAME ARCHITECTURE & TECHNICAL DOCUMENTATION
## Project: Lightning Racing — 3D Browser Arcade Game
**Document Version:** 1.0.0 (Release Candidate)  
**Lead Roles:** Senior Game Developer, Technical Game Director, 3D Game Designer, QA Lead  

---

## 1. System Architecture Overview

Lightning Racing is built upon a modular, decoupled architecture where rendering, vehicle physics, AI behavior, audio synthesis, and user interface operate independently through clear event and state interfaces.

```
+-------------------------------------------------------------------------+
|                               GAME ENGINE                               |
|                                                                         |
|  +-------------------+  +-------------------+  +---------------------+  |
|  |   SceneManager    |  |    GameLoop       |  |    InputManager     |  |
|  | - WebGL Renderer  |  | - Fixed Timestep  |  | - Keyboard State    |  |
|  | - Three.js Scene  |  | - Delta Time      |  | - Focus / Blur Evt  |  |
|  | - Lights & Skybox |  | - State Dispatch  |  | - Touch Controls    |  |
|  +---------+---------+  +---------+---------+  +----------+----------+  |
|            |                      |                       |             |
|            v                      v                       v             |
|  +-------------------------------------------------------------------+  |
|  |                           GAME STATE                              |  |
|  |  (MENU -> COUNTDOWN -> RACING -> PAUSED -> RESULTS)              |  |
|  +---------+----------------------+-----------------------+----------+  |
|            |                      |                       |             |
|            v                      v                       v             |
|  +-------------------+  +-------------------+  +---------------------+  |
|  |   TrackBuilder    |  |  VehicleManager   |  |     UIManager       |  |
|  | - Track Ribbon    |  | - Player Vehicle  |  | - Live HUD Overlay  |  |
|  | - Rock Arch Model |  | - 3x AI Vehicles  |  | - Position Stack   |  |
|  | - Checkpoints     |  | - Arcade Physics  |  | - Radar Mini-Map   |  |
|  | - Grandstands     |  | - Nitro & Drifting|  | - Menus / Dialogs   |  |
|  +---------+---------+  +---------+---------+  +----------+----------+  |
|            |                      |                       |             |
|            v                      v                       v             |
|  +-------------------+  +-------------------+  +---------------------+  |
|  |    ChaseCamera    |  |  ParticleManager  |  |     AudioEngine     |  |
|  | - Damped Follow   |  | - Tire Smoke      |  | - Web Audio Synth   |  |
|  | - Speed FOV Warp  |  | - Nitro Flames    |  | - Engine RPM Pitch  |  |
|  | - Drift Angle Cam |  | - Skid Ribbons    |  | - Drift Squeal/Hits |  |
|  +-------------------+  +-------------------+  +---------------------+  |
+-------------------------------------------------------------------------+
```

---

## 2. Core Modules & Implementation Details

### 2.1 WebGL Rendering Pipeline
- Powered by Three.js (r128).
- High-efficiency rendering with PCFSoftShadowMap, ACESFilmicToneMapping, and desert atmosphere exponential fog.
- Draw calls maintained strictly under 85 via merged ribbon geometry and procedural canvas textures.

### 2.2 Vehicle Arcade Physics Model
- **Acceleration Curve**: $v(t) = v_{max} \cdot (1 - e^{-k \cdot t})$, reaching cruising speed of 173 km/h (48 m/s) and nitro boost of 252 km/h (70 m/s).
- **Speed-Sensitive Steering**: Steering lock angle scales dynamically with vehicle velocity:
  $$\delta_{max}(v) = \delta_0 \cdot \left(1 - 0.45 \cdot \frac{|v|}{v_{max}}\right)$$
- **Drift Physics**: Holding `Space` while turning initiates drift oversteer. Lateral slip angle kicks outward, counter-steering balances the trajectory, and drift duration charges the Nitro tank.
- **Suspension Body Roll**: Mathematical spring simulation tilting the chassis into pitch on acceleration/braking and rolling laterally in turns.
- **Deployable Nitro Thrusters**: Twin side rocket pods deploy outward during boost, shooting animated flame cones and speed sparks.

### 2.3 Circuit & Environment ("Radiator Canyon Circuit")
- Continuous 1.2km CatmullRom spline loop.
- Features:
  1. Start/Finish straight with overhead gantry and checkered finish line.
  2. Spectator grandstands with colorful crowd car silhouettes.
  3. S-curve chicane with red-and-white rumble kerbs.
  4. Sweeper turn with glowing purple neon chevron signs.
  5. Canyon gorge passing directly beneath a monumental natural sandstone rock arch.
  6. Flanking red rock mesas, pine trees, and cypress foliage.

### 2.4 AI Opponents & Waypoint Navigation
- Three AI competitors: Boulder #12 (Buggy), Venom #24 (GT), Blaze #77 (Hot Rod).
- Navigate spline waypoints with lateral offsets to create organic overtaking and racing lines.
- Dynamic rubber-banding algorithm (0.92x to 1.08x speed multiplier based on gap to player) maintains exciting bumper-to-bumper racing across all 3 laps.

### 2.5 Procedural Web Audio Engine
- Built 100% on native Web Audio API with zero external file dependencies:
  - Dual-oscillator engine harmonics linked dynamically to vehicle RPM.
  - Bandpassed noise filter for tire drift squeals.
  - Resonant lowpass noise burst for nitro rocket boosts.
  - Low-frequency sine decay for collision thumps.
  - Melodic chimes for 3-2-1 countdown and checkered flag victory.

---

## 3. How to Run, Test, and Extend

### Running Locally
Open `artifacts/file_generation/ttl=63d/output/lightning_racing.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Running Automated Tests
```bash
node tests/run_tests.js
```

### Adding New Vehicles
1. Add vehicle configuration to `src/vehicles/VehicleConfig.ts`.
2. Add corresponding mesh generation method to `VehicleFactory` in `src/vehicles/VehicleFactory.ts`.
3. Register the new vehicle in the AI or player selection pool.
