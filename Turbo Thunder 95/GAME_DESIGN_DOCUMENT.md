# GAME DESIGN DOCUMENT (GDD)
## Project: Lightning Racing — 3D Browser Arcade Game
**Version:** 1.0.0 (Phase 1: Discovery & Planning)  
**Date:** November 2026  
**Target Platform:** Modern Desktop & Mobile Web Browsers (WebGL 2.0 / Three.js)  
**Lead Roles:** Senior Game Developer, Technical Game Director, 3D Game Designer, QA Lead  

---

## 1. Executive Summary & Vision Statement

### 1.1 Game Concept
**Lightning Racing** is a fast-paced, vibrant, browser-based 3D arcade racing game inspired by the characterful universe of Disney-Pixar's *Cars*. Players take the wheel of an expressive, red stock-car racer ("Thunder Red #95") competing against three distinct AI opponents across a scenic circuit that transitions between high-banked stadium chicanes and rugged desert red-rock canyon arches (reminiscent of Radiator Springs and the World Grand Prix).

### 1.2 Core Pillars
1. **Immediate Arcade Fun**: Responsive, forgiving steering, instant acceleration, tight drifting mechanics, and exhilarating nitro boosts with visual speed warp.
2. **Character & Personality**: Vehicles that feel alive—featuring expressive facial eyes and smirks, dynamic body roll and pitch during cornering and braking, rotating wheels, and deploying booster thrusters during nitro.
3. **Immersive 3D Track**: A rich circuit combining stadium grandstands, neon chevron turn indicators, red-and-white curb kerbs, natural red-rock arch landmarks, and lush foliage.
4. **Zero-Friction Web Accessibility**: Instant loading in any modern browser at a steady 60 FPS, with intuitive keyboard and touch controls, no installs, and a complete single-race championship loop.

---

## 2. Reference Image Analysis

Four official reference screenshots were inspected to establish the artistic and gameplay benchmark:

| Reference Asset | Key Scene & Elements | Visual & Technical Insights |
| :--- | :--- | :--- |
| **Photo 3** (`photo_3_...jpg`) | **Stadium Pit Straight / Grandstand**<br>Rear 3/4 view of #95 with "Rally Race 200" livery, Lightyear tires, dual chrome exhaust, grandstands packed with spectator cars, asphalt start/finish checkerboard. | • **Camera**: Close 3rd-person chase camera angled slightly downward.<br>• **UI**: Radial drift/speed meter underneath the rear chassis labeled with keyboard prompt (`"Espaço"` / Spacebar) and cyan position badge overhead.<br>• **Lighting**: Bright golden-hour sunlight casting crisp shadows. |
| **Photo 4** (`photo_4_...jpg`) | **Desert Canyon Arch Circuit**<br>Third-person view behind #95 Rust-eze rear bumper; 3 AI opponents ahead navigating an uphill road under a massive natural red sandstone arch, pine and cypress trees, glowing magenta neon directional arrows, branded trackside barricades. | • **Environment**: Iconic western red-rock canyon geography contrasting with vibrant greenery and purple neon signage.<br>• **AI Field**: 3 diverse opponent vehicle archetypes (an off-road buggy, a custom hot rod, an open-wheel racer) maintaining competitive racing lines.<br>• **Track**: Two-lane asphalt with dashed yellow centerlines and red/white safety barriers. |
| **Photo 2** (`photo_2_...jpg`) | **Vehicle Hero Profile (#95)**<br>Low 3/4 front view showcasing the expressive character styling: windshield eyes with animated eyelids, confident front-bumper smile, aerodynamic stock-car contours, side lightning bolt #95 graphics, deep dish wheels. | • **Character Expression**: The vehicle is not just a machine; the eyes and mouth communicate determination.<br>• **Materials**: Glossy automotive clearcoat paint, matte rubber tires with raised white lettering, chrome wheel rims with red hubcaps. |
| **Photo 1** (`photo_1_...jpg`) | **High-Speed Cornering & Turbo Boost**<br>Action chase camera tracking car through a banked curve with side booster rockets deployed shooting fire/smoke, black tire skid marks on green track asphalt, opponent kart ahead. | • **Special Effects**: Deploying twin side-mounted thrusters with flame and smoke trails during nitro boost; dual skid mark ribbons during hard drifts.<br>• **HUD Layout**: Top-left vertical position leaderboard (1st, 2nd, 3rd with driver portrait badges); top-right race clock (Current Time, Best Lap, Lap 1/3); bottom-center circular gear/turbo gauge. |

### 2.1 What to Reproduce
- The iconic red stock-car silhouette with lightning bolt #95 livery, expressive animated eyes on the windshield, and chrome dual exhaust.
- The dual-biome aesthetic: transitioning seamlessly between a polished stadium race track and a sun-drenched canyon with an arch landmark.
- Dynamic nitro boost with side rocket thrusters, flame particles, speed lines, and FOV camera warp.
- The satisfying arcade drift mechanic where braking or pressing Space initiates controlled oversteer with tire smoke and skid marks.
- The full broadcast-style arcade HUD: vertical position leaderboard stack, lap/time tracker, speedometer/nitro gauge, and start countdown lights.

### 2.2 What to Improve & Modernize
- **Lighting & Post-Processing**: Enhance depth with soft ambient occlusion, directional sun shadows, and Bloom on neon chevron arrows and booster flames.
- **Physics Stability**: Combine Three.js scene hierarchy with a dedicated arcade kinematic physics integrator to eliminate ground clipping or jitter while guaranteeing high-speed corner stability.
- **Sound Synthesis**: Implement a full Web Audio engine providing procedural dynamic engine revs (pitch linked to RPM/speed), tire squeal on drift, nitro whoosh, collision impacts, and countdown beeps without relying on external audio files that might fail to load.

### 2.3 Intellectual Property & Asset Compliance
- For public distribution, homage styling will be utilized: "Thunder Red #95", inspired by classic stock car racing, avoiding direct trademarked Disney/Pixar logos while capturing the unmistakable aesthetic spirit.

---

## 3. Core Gameplay Systems

### 3.1 Arcade Vehicle Controller
The vehicle physics prioritize fun, predictability, and responsiveness over realistic rigid-body simulation:
- **Acceleration & Top Speed**: Base cruising speed of 180 km/h; nitro boost accelerates vehicle up to 260 km/h.
- **Speed-Sensitive Steering**: Steering lock angle scales inversely with speed to prevent erratic twitching at high speeds while allowing agile low-speed maneuvering.
- **Drift Mechanics**: Holding `Space` (or sharp braking while steering) initiates a drift state:
  - Lateral traction is reduced by 60%, allowing the rear of the car to kick outward.
  - Counter-steering stabilizes the drift angle.
  - Successful drifting charges the **Nitro Meter**.
  - Dual skid-mark ribbons and tire smoke particles emit from the rear wheels.
- **Nitro Boost System**:
  - Activated via `Shift` or `N`.
  - Consumes the nitro tank; deploys side thruster pods with fiery particle jets.
  - Temporarily increases acceleration by 2.5x and camera FOV from 65° to 78° for intense speed sensation.
- **Collision Reaction**: Forgiving bounce impulses against track barriers and opponent cars that impart haptic visual shake without grinding the player to a dead halt.
- **Chassis Body Roll & Pitch**: Procedural spring-damper suspension simulation tilting the car body forward under braking, backward under acceleration, and rolling laterally during hard turns.

### 3.2 Dynamic Third-Person Chase Camera
- **Positioning**: Fixed anchor behind (offset: `[0, 2.8, -6.2]`) looking at target look-ahead point (`[0, 1.2, 3.0]`).
- **Smooth Interpolation**: Dual-rate spherical linear / damping interpolation (`lerp` factors of 0.10 for position, 0.15 for look-at).
- **Speed-Dependent FOV**: Dynamically scales between 60° (stationary) and 80° (full nitro boost).
- **Drift Cam Offset**: Camera gently swings outward opposite to the drift direction, enhancing the feeling of momentum.

### 3.3 AI Opponent System
Three AI-driven racing opponents with distinct personalities and vehicle geometries:
1. **Racer A — "Boulder" (Off-Road Dune Buggy)**: High acceleration, aggressive cornering, heavy chassis.
2. **Racer B — "Venom" (Sleek Green Tuner / Formula)**: High top speed, smooth racing lines, disciplined braking.
3. **Racer C — "Blaze" (Blue Hot Rod)**: Balanced rival, tactical drifting, competitive draft overtaking.
- **Waypoint Navigation**: Spline-based path nodes along the center and racing grooves of the track.
- **Dynamic Rubber-Banding**: Subtle velocity scaling (±10%) to keep the race tightly contested and exciting from start to finish without feeling rigged.
- **Obstacle Avoidance**: Raycast sensing for track walls and player proximity.

### 3.4 Track & Environmental Design ("Radiator Canyon Circuit")
- **Track Layout**: Closed-circuit 1.2 km lap featuring:
  - Start/Finish straight with grandstands and crowd cars.
  - S-bend chicane bordered with red-and-white kerbs.
  - High-speed sweeper turn lined with animated neon chevron signs.
  - Red-rock canyon gorge passing beneath a natural sandstone arch.
  - Gentle hill crest with a mild jump crest before returning to the stadium straight.
- **Checkpoint & Lap Manager**: 8 sequential invisible gate triggers ensuring no cut-corner cheating, measuring sector times, lap counts (3 laps standard), and absolute race position.

---

## 4. User Interface & User Experience (HUD & Menus)

### 4.1 Interface Flow
```
[ Main Menu ] ---> [ Vehicle / Difficulty Select ] ---> [ 3-2-1-GO! Countdown ]
       ^                                                        |
       |                                                        v
 [ Results Screen ] <--- [ Victory / Defeat ] <--- [ In-Race Gameplay HUD ]
 (Restart / Menu)                                       | (ESC Key)
                                                        v
                                                 [ Pause Menu ]
```

### 4.2 In-Race HUD Elements
- **Position Badge**: Top-left dynamic leaderboard card showing live positions (1st, 2nd, 3rd, 4th) with player highlight.
- **Speedometer & Nitro Tank**: Bottom-right digital/analog gauge with speed in km/h, gear indicator, and a glowing cyan-to-orange Nitro charge bar.
- **Race Timing**: Top-right timer showing Current Lap Time, Best Lap Time, and Total Elapsed Time.
- **Lap Counter**: Prominent "LAP 1 / 3" indicator with flashing notification on final lap ("FINAL LAP!").
- **Track Mini-Map**: Top-center/corner stylized vector radar map showing track outline, player blip (yellow/red), and AI opponent blips (blue/green/purple).
- **Countdown Overlay**: Massive 3D/animated "3... 2... 1... GO!" at race start.

### 4.3 Controls Matrix
| Action | Primary Keyboard | Secondary / Arrow | Touch / Gamepad |
| :--- | :--- | :--- | :--- |
| **Accelerate** | `W` | `Up Arrow` | On-screen Gas Button / Right Trigger |
| **Brake / Reverse** | `S` | `Down Arrow` | On-screen Brake Button / Left Trigger |
| **Steer Left** | `A` | `Left Arrow` | Virtual Joystick / D-Pad Left |
| **Steer Right** | `D` | `Right Arrow` | Virtual Joystick / D-Pad Right |
| **Drift** | `Space` | `Space` | On-screen Drift Button / B Button |
| **Nitro Boost** | `Shift` / `N` | `Shift` | On-screen Boost Button / A Button |
| **Pause / Resume** | `Escape` / `P` | `Escape` | Pause Icon |
| **Restart Race** | `R` | `R` | Restart Button on Pause/Results |

---

## 5. Technical Architecture & Technology Stack

### 5.1 Technology Decisions & Justifications
- **Three.js (r128+)**: Industry standard for WebGL rendering; robust material system, geometry pipelines, shadow mapping, and particle support.
- **Arcade Physics Engine (Custom Rapier-compatible model)**: Ensures 100% stable 60 FPS gameplay without physics glitches, tunneling, or unpredictable flips.
- **Web Audio API**: 100% self-contained procedural audio generation (synthesized engine harmonics, tire skid squeals, nitro whoosh, crash impacts) guaranteeing zero asset network failures or CORS bugs.
- **Canvas Single-File Preview + Modular TS Codebase**: Formatted for both immediate interactive preview in browser Canvas and modular export/distribution for itch.io or standalone hosting.

---

## 6. Performance Targets & Quality Assurance

### 6.1 Performance Goals
- **Framerate**: Rock-solid 60 FPS on standard modern desktop browsers (Chrome, Firefox, Safari, Edge).
- **Draw Calls**: Maintained under 120 draw calls via instanced trackside props (trees, barriers, light poles) and merged track geometry.
- **Memory Footprint**: Heap memory kept below 80MB. Zero runtime allocations inside the `tick(delta)` render loop.
- **Asset Loading**: Instant (<1.5s) startup time with procedural high-fidelity models and textures.

### 6.2 QA Verification Plan
1. **Physics & Control Verification**: Drift initiation, counter-steer recovery, nitro velocity boost, wall bouncing.
2. **Race Logic Verification**: Starting grid lineup, 3-2-1 countdown lock, sequential checkpoint triggers, lap counting, winner determination.
3. **AI Pathfinding Verification**: Competitors staying on track, avoiding head-on blockages, maintaining competitive pack racing.
4. **Resilience Verification**: Handling window blur/unfocus, rapid key presses, window resizing without visual distortion.
