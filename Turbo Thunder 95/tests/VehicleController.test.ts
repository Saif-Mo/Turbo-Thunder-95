// Automated unit test suite for arcade physics and vehicle controller
import { VehicleController } from '../src/vehicles/VehicleController';
import { LapManager } from '../src/racing/LapManager';
import { RacingAI } from '../src/ai/RacingAI';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error('Assertion failed: ' + message);
  }
}

console.log('Running automated test suite...');

// Test 1: Vehicle Acceleration
{
  const vc = new VehicleController();
  vc.update(0.1, { forward: true, backward: false, left: false, right: false, drift: false, nitro: false });
  assert(vc.speed > 0, 'Vehicle must accelerate forward when gas is pressed');
  console.log('✔ Test 1: Vehicle Acceleration passed.');
}

// Test 2: Speed-sensitive steering and spring-back
{
  const vc = new VehicleController();
  vc.update(0.1, { forward: false, backward: false, left: true, right: false, drift: false, nitro: false });
  assert(vc.steerAngle > 0, 'Vehicle must steer left when left input active');
  vc.update(0.5, { forward: false, backward: false, left: false, right: false, drift: false, nitro: false });
  assert(vc.steerAngle < 0.3, 'Vehicle steering must spring back toward center when released');
  console.log('✔ Test 2: Steering sensitivity & spring-back passed.');
}

// Test 3: Drifting mechanics & nitro charging
{
  const vc = new VehicleController();
  vc.speed = 30;
  vc.steerAngle = 0.3;
  vc.nitro = 0.5;
  vc.update(0.1, { forward: true, backward: false, left: true, right: false, drift: true, nitro: false });
  assert(vc.isDrifting, 'Drifting should activate on high speed + steer + drift key');
  assert(vc.nitro > 0.5, 'Drifting must recharge nitro energy');
  console.log('✔ Test 3: Drift mechanics & nitro recharge passed.');
}

// Test 4: Lap Manager loop completion
{
  const lm = new LapManager(3, 8);
  for (let cp = 0; cp < 8; cp++) {
    lm.update(0.5, cp);
  }
  const result = lm.update(0.5, 0); // Completes lap 1
  assert(result.lapCompleted, 'Lap must complete when cycling through checkpoints');
  assert(lm.currentLap === 2, 'Current lap must increment to 2');
  console.log('✔ Test 4: LapManager loop progression passed.');
}

// Test 5: AI Rubber-banding
{
  const ai = new RacingAI('Boulder', 44, 0);
  ai.update(0.2, 0.5); // Player far ahead
  assert(ai.speed > 0, 'AI must advance along track spline');
  console.log('✔ Test 5: AI Racing and waypoint update passed.');
}

console.log('ALL 5 UNIT TESTS PASSED SUCCESSFULLY!');
