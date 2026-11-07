# TECHNICAL DEVELOPER GUIDE
## Project: TURBO THUNDER 95: RADIATOR GRAND PRIX
**Document Version:** 1.0.0  
**Target Audience:** Software Engineers, Technical Game Directors, Three.js Developers, and AI Agents  
**Runtime Environment:** Modern Web Browsers (WebGL 2.0 / Three.js r128 / Web Audio API)

---

## 1. System Architecture & Tech Stack

Turbo Thunder 95 is built with an arcade-first, zero-dependency browser architecture designed for instantaneous startup (<1.2s) and 60 FPS performance.

### 1.1 Core Technologies
- **Rendering Engine:** Three.js (r128) WebGLRenderer with `PCFSoftShadowMap`, `ACESFilmicToneMapping` (exposure 1.15), and dynamic exponential atmospheric fog.
- **Physics Integration:** Custom kinematic arcade vehicle controller operating on fixed $\Delta t$ updates with continuous Catmull-Rom spline projection.
- **Audio Synthesis:** 100% procedural Web Audio API engine (no external `.mp3`/`.wav` downloads; zero network failure points).
- **UI & HUD Pipeline:** Hardware-accelerated HTML5/CSS3 flexbox overlays, dynamic vector 2D radar mini-map, and responsive touch controls.
- **Persistence:** Browser `localStorage` (wrapped in `try/catch` safety blocks) for player steering sensitivity and difficulty preferences.

---

## 2. Directory & Codebase Layout

```
├── artifacts/file_generation/ttl=63d/
│   ├── intermediate/
│   │   └── lightning_racing.html      # Primary source build (Canvas & Web App ready)
│   └── output/
│       └── lightning_racing.html      # Production release artifact
├── src/                               # Modular TypeScript codebase
│   ├── config/GameConfig.ts           # Central tuning constants & physics settings
│   ├── vehicles/
│   │   ├── VehicleConfig.ts           # Vehicle registry & archetypes
│   │   └── VehicleController.ts       # Arcade vehicle physics controller
│   ├── racing/LapManager.ts           # Lap progression & checkpoint gate manager
│   └── ai/RacingAI.ts                 # AI opponent navigation & rubber-banding
├── tests/
│   ├── VehicleController.test.ts      # TypeScript unit test specifications
│   └── run_tests.js                   # Node.js automated test runner (5/5 suites)
├── GAME_DESIGN_DOCUMENT.md            # Comprehensive game design documentation
├── GAME_DOCUMENTATION.md              # High-level architecture specification
├── TECHNICAL_DEVELOPER_GUIDE.md       # (This file) Developer implementation manual
├── PLAYER_USER_MANUAL.md              # Non-technical end-user game guide
├── README.md                          # Quickstart & project overview
├── CHANGELOG.md                       # Version history and release notes
└── TODO.md                            # Development milestone tracking
```

---

## 3. Core Gameplay Systems & Implementation Details

### 3.1 Kinematic Vehicle Physics Model
Located inside `Game.prototype.updatePlayerPhysics(delta)`:
- **Acceleration Curve:** Forward velocity accelerates exponentially up to base maximum speed ($v_{\text{base}} = 52\text{ m/s} \approx 187\text{ km/h}$) and nitro maximum speed ($v_{\text{nitro}} = 76\text{ m/s} \approx 274\text{ km/h}$).
- **Arcade Steering:**
  $$\delta_{\text{steer}}(t + \Delta t) = \text{clamp}\left(\delta_{\text{steer}}(t) \pm v_{\text{steerSpeed}} \cdot \Delta t, -\delta_{\text{max}}, \delta_{\text{max}}\right)$$
  - Steering sensitivity multiplier: $S_{\text{sens}} \in [0.5, 1.5]$ (user-tuned from Settings).
  - Effective turn rate:
    $$\omega_{\text{yaw}} = (\delta_{\text{steer}} + 0.45 \cdot \delta_{\text{slip}}) \cdot \max(0.44, \frac{|v|}{18}) \cdot M_{\text{drift}} \cdot \text{sign}(v) \cdot 3.2 \cdot S_{\text{sens}}$$
  - Minimum turn authority floor ($0.44$) ensures the vehicle remains nimble even at low starting speeds.
- **Drifting Mechanics:** Activated when `Space` is held while steering at speed $> 10\text{ m/s}$:
  - Lateral slip angle ($\delta_{\text{slip}}$) interpolates toward $1.5 \cdot \delta_{\text{steer}}$, kicking the rear chassis outward into a slide.
  - Turn rate multiplier ($M_{\text{drift}}$) increases to $1.35\times$ for sharp cornering.
  - Drifting charges the **Nitro meter** at $+0.25/\text{sec}$.
  - Spawns dual tire smoke particle bursts from rear wheel contact points.
- **Nitro Boost:** Activated with `Shift` or `N`:
  - Consumes nitro charge at $-0.35/\text{sec}$.
  - Multiplies acceleration by $2.2\times$ and increases top speed to $76\text{ m/s}$.
  - Deploys side rocket thruster pods with blue flame geometry and spark particles.
  - Smoothly expands camera Field of View from $62^\circ$ to $78^\circ$.

### 3.2 Continuous Track Projection & Zero-Drag Boundary Collision
Located in `Game.prototype.getTrackProjection(pos)` and `updatePlayerPhysics`:
- The track centerline is pre-sampled into $N = 400$ equidistant nodes.
- For any world position $P(x, z)$, the engine locates the nearest segment $[S_i, S_{i+1}]$ and computes the continuous linear projection parameter:
  $$u = \text{clamp}\left(\frac{(P - S_i) \cdot (S_{i+1} - S_i)}{\|S_{i+1} - S_i\|^2}, 0, 1\right)$$
- The projected center point is $C = S_i + u(S_{i+1} - S_i)$.
- The normalized track tangent is $T = \text{normalize}(S_{i+1} - S_i)$.
- The horizontal lateral binormal vector is $B_{\text{lat}} = (-T_z, 0, T_x)$.
- **Lateral Deviation:** $d_{\text{lat}} = (P - C) \cdot B_{\text{lat}}$.
- **Boundary Collision Resolution:** With safe drivable half-width $W_{\text{safe}} = 7.6\text{m}$:
  $$\text{If } |d_{\text{lat}}| > W_{\text{safe}} \implies P \leftarrow P - \text{sign}(d_{\text{lat}}) \cdot (|d_{\text{lat}}| - W_{\text{safe}}) \cdot B_{\text{lat}}$$
  *Key Architectural Guarantee:* Because $B_{\text{lat}}$ is strictly orthogonal to the forward track tangent $T$, the correction vector has zero component along the longitudinal direction. It cannot pull the car backward or stall forward momentum.

### 3.3 Race Progression, Checkpoint Logic & Standings
Located in `Game.prototype.updateRaceProgress(delta)` and `calculateRacerProgress(racer)`:
- **Checkpoints:** 8 sequential gates ($0, 1, \dots, 7$) along the spline.
- **Starting Grid:** All racers initialize on the stadium straight behind the start line ($t = 0.965$ to $0.985$).
- **Anti-Cheat Validation:** A lap is strictly credited only when a racer visits checkpoints in order: $0 \to 1 \to 2 \dots \to 7$, and subsequently crosses into checkpoint $0$.
- **Continuous Progress Metric:**
  $$\text{totalProgress} = \text{completedLaps} + t_{\text{spline}}$$
  *Grid State Handling:* If the vehicle has not yet crossed the start line ($hasStarted = false$), its progress is normalized as $(t - 0.95) \cdot 0.1$, guaranteeing racers behind the start line do not falsely register as being ahead.
- **Finish Order Array:** When a racer finishes 3 full laps, they are appended to `this.finishOrder`. The results screen strictly uses `this.finishOrder` index for 1st, 2nd, 3rd, and 4th place rankings.

### 3.4 AI Navigation & Rubber-Banding
Located in `Game.prototype.updateAIRacers(delta)`:
- AI opponents traverse the Catmull-Rom spline via parameter $t \in [0, 1)$ with designated lateral offsets ($[-3.5\text{m}, +3.2\text{m}]$).
- **Rubber-Banding Curve:** Compares player progress ($P_{\text{player}}$) against AI progress ($P_{\text{ai}}$):
  $$\text{speedFactor} = \begin{cases} 1.06 & \text{if } P_{\text{player}} - P_{\text{ai}} > 0.06\text{ (AI catches up)} \\ 0.94 & \text{if } P_{\text{player}} - P_{\text{ai}} < -0.06\text{ (AI yields lead)} \\ 1.00 & \text{otherwise} \end{cases}$$
- **Post-Race Cooldown:** When an AI racer completes 3 laps, it transitions into a cooldown state (`ai.finished = true`), smoothly decelerating to $22\text{ m/s}$ and continuing along the racing line rather than freezing on the track.

### 3.5 Procedural Web Audio Engine
Located in `AudioEngine`:
- **Engine Sound:** Dual oscillators (Sawtooth at $52\text{ Hz}$ base + Triangle at $1.98\times$ harmonic) routed through a resonant lowpass biquad filter ($Q = 2.2$). Cutoff frequency modulates from $320\text{ Hz}$ to $1720\text{ Hz}$ based on RPM.
- **Drift Squeal:** White noise buffer routed through a bandpass filter ($Q = 5.5$) centered at $1050\text{ Hz} - 1850\text{ Hz}$.
- **Nitro Roar:** Pink noise buffer with lowpass sweep ($850\text{ Hz}, Q = 3.0$).
- **Impacts & Chimes:** Synthesized sine and triangle wave envelopes.

---

## 4. How to Extend the Game

### 4.1 Adding a New Vehicle
1. Open `lightning_racing.html` (or `src/vehicles/VehicleConfig.ts`).
2. Add a new mesh creation method in `VehicleFactory`:
   ```javascript
   static createCustomVehicle() {
     const car = new THREE.Group();
     const chassis = new THREE.Group();
     // Add body geometry, wheels, decals...
     car.add(chassis);
     car.userData.chassis = chassis;
     car.userData.wheels = { fl, fr, rl, rr };
     return car;
   }
   ```
3. Register the car in `initVehicles()` and assign its target top speed, acceleration, and livery colors.

### 4.2 Adding a New Track Layout
1. In `TrackBuilder.createTrackSpline()`, define new 3D control points:
   ```javascript
   const points = [
     new THREE.Vector3(x0, y0, z0),
     new THREE.Vector3(x1, y1, z1),
     // ... closed loop control points
   ];
   return new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.25);
   ```
2. Adjust track elevation ($y$-coordinates) for ramps, hills, or banked curves.
3. Keep all trackside scenery objects at a radial distance $> \text{trackWidth} / 2 + 3.0\text{m}$ to ensure an unobstructed racing surface.

### 4.3 Tuning Handling & Physics
- Vehicle tuning parameters are located in `this.playerState`:
  - `accel`: Forward acceleration rate (default: `34`).
  - `brake`: Braking deceleration rate (default: `52`).
  - `maxSpeed`: Top cruising speed in m/s (default: `52`).
  - `nitroMaxSpeed`: Boost top speed in m/s (default: `76`).
  - `steerSpeed`: Angular yaw velocity per second (default: `5.4`).

---

## 5. Automated Testing & Verification

Run the test suite using Node.js:
```bash
node tests/run_tests.js
```

### Verified Test Suites:
1. `Vehicle Acceleration`: Verifies positive velocity delta when accelerating.
2. `Speed-Sensitive Steering`: Validates dynamic steering limits and exponential centering spring-back.
3. `Drift Mechanics & Nitro`: Asserts drift flag activation and nitro tank recharge during slides.
4. `Checkpoint & Lap Progression`: Verifies sequential gate enforcement and lap completion.
5. `AI Rubber-Banding`: Asserts dynamic velocity adjustment relative to player distance.
