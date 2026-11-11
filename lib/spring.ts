// Critically damped spring (ζ = 1), sampled into WAAPI keyframes.
// x(t) is the remaining distance (1 → 0). With initial offset x0 (fraction of the trip still to go)
// and initial velocity v0 (fractions per second, positive = towards the target):
//   x(t) = (x0 + (ω·x0 − v0)·t)·e^(−ωt),   ω = 2π / response
// The same curve drives position and the motion-streak opacity (∝ |velocity|),
// so the blur appears while accelerating and is gone by the time the frame stops.

export type SpringSample = { t: number; progress: number; speed: number };

export function sampleSpring(
  response = 0.8,
  x0 = 1,
  v0 = 0,
  steps = 48,
): { duration: number; samples: SpringSample[] } {
  const w = (2 * Math.PI) / response;
  const remaining = (t: number) => (x0 + (w * x0 - v0) * t) * Math.exp(-w * t);
  const velocity = (t: number) =>
    // d/dt of −remaining → speed towards target
    -((w * x0 - v0) * Math.exp(-w * t) - w * (x0 + (w * x0 - v0) * t) * Math.exp(-w * t));
  // settle when within 0.15 % of the trip and nearly still
  let duration = response * 0.4;
  while (duration < 3 && (Math.abs(remaining(duration)) > 0.0015 || Math.abs(velocity(duration)) > 0.02))
    duration += 0.01;
  const samples: SpringSample[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * duration;
    samples.push({ t, progress: 1 - remaining(t), speed: Math.abs(velocity(t)) });
  }
  samples[samples.length - 1] = { t: duration, progress: 1, speed: 0 };
  return { duration, samples };
}
