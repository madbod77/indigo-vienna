// «Прибуття»: a city frame travels in like the view from an arriving train.
// Runs on WAAPI (compositor thread) so a React re-render in the same frame cannot make it stutter.
// Layers: <div class="city"> holds the sharp photo and a pre-blurred streak copy (no animated filter).
import { sampleSpring } from "./spring";

let running: Animation[] = [];

export function stopTravel() {
  for (const a of running) a.finish();
  running = [];
}

const streakOpacity = (speed: number) => Math.min(1, speed / 1.4) * 0.85;

/**
 * dir = 1: the new city enters from the right (forward), −1: from the left (back).
 * x0: share of the trip still to go (1 for a tap; less after a swipe released mid-way).
 * v0: release velocity in screen widths per second, towards the target.
 */
export function travel(opts: {
  incoming: HTMLElement;
  outgoing?: HTMLElement | null;
  dir: 1 | -1;
  x0?: number;
  v0?: number;
  response?: number;
  reduced?: boolean;
}): Promise<void> {
  const { incoming, outgoing, dir, x0 = 1, v0 = 0, response = 0.8, reduced = false } = opts;
  stopTravel();
  if (reduced) {
    const a = incoming.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" });
    running = [a];
    if (outgoing) outgoing.style.transform = "";
    incoming.style.transform = "";
    return a.finished.then(() => undefined, () => undefined);
  }
  const { duration, samples } = sampleSpring(response, x0, v0);
  const ms = duration * 1000;
  const frames = (offset: number) =>
    samples.map((s) => ({
      offset: s.t / duration,
      transform: `translate3d(${(dir * (1 - s.progress) + offset) * 100}%,0,0)`,
    }));
  const streakFrames = samples.map((s) => ({ offset: s.t / duration, opacity: streakOpacity(s.speed) }));
  const opt: KeyframeAnimationOptions = { duration: ms, easing: "linear", fill: "both" };
  const list: Animation[] = [incoming.animate(frames(0), opt)];
  const inStreak = incoming.querySelector<HTMLElement>(".city-streak");
  if (inStreak) list.push(inStreak.animate(streakFrames, opt));
  if (outgoing) {
    // the outgoing frame dissolves over the second half of the trip, so no strip of it lingers at the edge
    const outFrames = frames(-dir).map((f, i) => ({ ...f, opacity: Math.min(1, Math.max(0, (1 - samples[i].progress) * 2)) })); // gone once it has travelled half its width
    list.push(outgoing.animate(outFrames, opt));
    const outStreak = outgoing.querySelector<HTMLElement>(".city-streak");
    if (outStreak) list.push(outStreak.animate(streakFrames, opt));
  }
  running = list;
  return Promise.all(list.map((a) => a.finished)).then(
    () => {
      for (const a of list) a.cancel();
      if (running === list) running = [];
    },
    () => undefined,
  );
}
