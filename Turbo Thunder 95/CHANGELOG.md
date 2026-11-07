# CHANGELOG: LIGHTNING RACING

All notable changes and architectural updates will be documented in this file.

## [1.0.0] - 2026-11-07
### Added
- **Full 3D WebGL Arcade Game**: Implemented complete, playable Three.js racing game in `artifacts/file_generation/ttl=63d/output/lightning_racing.html`.
- **"Thunder Red #95" Hero Vehicle**: Custom stock car mesh featuring animated windshield eyes, bumper smirk smile, decals, Lightyear-lettered rubber tires, suspension roll/pitch, and deploying side rocket thruster pods.
- **3 Diverse AI Competitors**: Boulder #12 (Yellow Buggy), Venom #24 (Green GT), and Blaze #77 (Blue Hot Rod) with spline path navigation, obstacle avoidance, and dynamic rubber-banding.
- **Radiator Canyon Circuit**: 1.2km continuous 3D loop featuring grandstand pit straight with spectator crowd cars, natural red-sandstone rock arch bridging overhead, animated glowing purple neon chevron arrows, and red/white kerbs.
- **Arcade Driving & Drift Mechanics**: Responsive speed-sensitive steering, controlled drifting with counter-steer assist, tire smoke particles, and drift-charged nitro boost.
- **Web Audio API Engine**: 100% procedural synthesized audio including speed/RPM-modulated engine drone, bandpass drift squeal, nitro rocket roar, collision impact thuds, countdown chimes, and victory fanfare.
- **Broadcast Arcade HUD & Menus**: Real-time position leaderboard, digital speedometer, nitro arc gauge, lap/timer, vector radar mini-map, 3-2-1-GO! countdown, pause menu, and victory podium results screen.
- **Mobile Touch Controls**: Integrated responsive on-screen buttons for steering, gas, brake, drift, and nitro.
- **Modular TypeScript Architecture**: Full source code in `src/` and automated test suite in `tests/run_tests.js`.

## [1.0.1] - 2026-11-07
### Fixed
- **Player Movement & Track Progression**: Replaced discrete 3D sample point distance checks with continuous CatmullRom track segment projection (300 segments). Eliminated false boundary collision drag that previously pulled the car backward into discrete sample points.
- **Pure Lateral Boundary Collision**: Track barrier collisions now push strictly along the perpendicular horizontal binormal vector ($B_{lat}$), preserving 100% of forward momentum down the track with zero backward drag.
- **Responsive Arcade Steering**: Increased `steerSpeed` from 2.8 to 6.2 and `maxSteer` to 0.68 rad (~39°). Implemented low-speed steering authority (minimum 0.48 factor), allowing nimble, instant turning at any speed.
- **Track Width Expansion**: Widened racing surface from 14m to 18m, providing ample passing room for pack racing, drift lines, and high-speed maneuvers through the red-rock canyon.
- **Robust Sequential Checkpoint Verification**: Added loop progression verification requiring racers to sequentially visit checkpoints before completing laps, preventing premature lap triggers.

## [1.0.2] - 2026-11-07
### Changed & Enhanced
- **Game Title Update**: Rebranded to **⚡ TURBO THUNDER 95: RADIATOR GRAND PRIX** with upgraded arcade visual identity.
- **Steering Sensitivity User Option**: Added live Steering Sensitivity slider (50% to 150%) on both the Main Menu and Pause Menu with persistent `localStorage` saving. Default set to a comfortable, balanced 85%.
- **Countdown "GO!" Disappearance Fix**: Fixed bug where "GO!" remained on screen by adding an automated smooth fade-out timer (1.1s duration) that completely hides the element once the race starts.
- **Expanded Grand 2.4km Circuit**: Doubled track length to a 2.4km circuit with high-speed straights, sweeping curves, and elevation changes.
- **Clean Drivable Roadway**: Ensured the 18m asphalt surface is 100% clean and unobstructed, with all scenery (grandstands, trees, rock arches, chevrons) positioned safely outside the track borders with generous buffer zones.
- **Daylight Sunny Sky Atmosphere**: Implemented a daytime sky dome with gradient azure-to-sunny horizon, soft aerial perspective fog, distant mountain silhouettes, and 3D white cumulus clouds.

## [1.0.3] - 2026-11-07
### Changed & Enhanced
- **Track Width Expansion to 26 Meters**: Expanded the asphalt surface from 18m to an expansive 26-meter arcade super-highway (half-width: 13.0m, safe boundary: 11.4m), allowing up to 6 cars abreast, wide-angle drifting slides, and seamless high-speed overtaking.
- **Scaled Scenery & Landmarks**:
  - Sandstone Rock Arch increased to a 22-meter radius with 14m overhead clearance, spanning the widened road majestically.
  - Flanking mesas pushed out to 32 meters from the centerline.
  - Grandstands recessed to 26 meters from the centerline.
  - Desert flora and trees given an expanded 8.5-meter safety buffer from outer road kerbs.
- **Re-spaced Starting Grid**: Grid rows widened to $\pm 4.2\text{m}$ lateral spacing for clean starts into Turn 1.
