// Перший екран «Прибуття»: заголовок стоїть, під ним приїжджає місто (runs/indigo-premium-mobile/motion.md §5.2).
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { basePath } from "@/site.config";
import { countries, type Country } from "./admissions";
import { stopTravel, travel } from "@/lib/travel";

export const order: Country[] = ["at", "de", "nl"];

const portrait: Record<Country, string> = {
  at: "vienna-opera",
  de: "berlin-cathedral",
  nl: "amsterdam-canal",
};
// Focus points for the landscape frame (desktop) — what must stay in view when cropped.
const focus: Record<Country, string> = { at: "62% 40%", de: "86% 40%", nl: "50% 45%" };

export type TravelIntent = { x0: number; v0: number } | null;

function CityLayer({ id, current, warm }: { id: Country; current: boolean; warm: boolean }) {
  const name = portrait[id];
  const img = (file: string) => `${basePath}/images/${file}`;
  const landscape = countries[id].imageWidths ?? [480, 800, 1200, 1600];
  const load = current || warm;
  return (
    <div className={"city" + (current ? " is-current" : "")} data-city={id} aria-hidden="true">
      <picture>
        <source
          media="(max-width: 760px)"
          srcSet={load ? `${img(name + "-portrait-480.webp")} 480w, ${img(name + "-portrait.webp")} 745w` : undefined}
          sizes="100vw"
        />
        <img
          className="city-sharp"
          src={load ? img(countries[id].image.replace(".jpg", `-${Math.min(1200, Math.max(...landscape))}.webp`)) : undefined}
          srcSet={load ? landscape.map((w) => `${img(countries[id].image.replace(".jpg", `-${w}.webp`))} ${w}w`).join(", ") : undefined}
          sizes="100vw"
          alt=""
          style={{ objectPosition: focus[id] }}
          fetchPriority={current ? "high" : "low"}
          decoding="async"
          data-hero-sharp={current ? "" : undefined}
        />
      </picture>
      <picture>
        <source media="(max-width: 760px)" srcSet={load ? img(name + "-portrait-blur.webp") : undefined} />
        <img className="city-blur" src={load ? img(name + "-blur.webp") : undefined} alt="" style={{ objectPosition: focus[id] }} />
      </picture>
      <picture>
        <source media="(max-width: 760px)" srcSet={load ? img(name + "-portrait-streak.webp") : undefined} />
        <img className="city-streak" src={load ? img(name + "-streak.webp") : undefined} alt="" style={{ objectPosition: focus[id] }} />
      </picture>
    </div>
  );
}

export function CountryTabs({
  country,
  onChange,
  withPrices = false,
  className = "",
}: {
  country: Country;
  onChange: (value: Country) => void;
  withPrices?: boolean;
  className?: string;
}) {
  // iOS segmented control: equal segments, the thumb moves with transform only.
  return (
    <div className={"segmented " + className} role="group" aria-label="Оберіть країну навчання" style={{ "--seg": order.indexOf(country) } as React.CSSProperties}>
      <span className="seg-thumb" aria-hidden="true" />
      {order.map((id) => (
        <button key={id} type="button" aria-pressed={country === id} onClick={() => onChange(id)}>
          <span className="tab-name">{countries[id].name}</span>
          {withPrices && <span className="tab-price">{countries[id].living}</span>}
        </button>
      ))}
    </div>
  );
}

export function Arrival({
  country,
  choose,
  intent,
  universitiesCount,
}: {
  country: Country;
  choose: (value: Country, opts?: { swipe?: TravelIntent }) => void;
  intent: React.MutableRefObject<TravelIntent>;
  universitiesCount: number;
}) {
  const info = countries[country];
  const stage = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const previous = useRef<Country>(country);
  const [warm, setWarm] = useState(false);

  // Other cities load after the page has loaded, at low priority.
  useEffect(() => {
    const go = () => setWarm(true);
    if (document.readyState === "complete") {
      const t = window.setTimeout(go, 400);
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  // Each change of country is the same trip between cities.
  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = country;
    if (from === country) return;
    const root = stage.current;
    if (!root) return;
    setWarm(true);
    document.documentElement.classList.add("arrived");
    const incoming = root.querySelector<HTMLElement>(`.city[data-city="${country}"]`);
    const outgoing = root.querySelector<HTMLElement>(`.city[data-city="${from}"]`);
    if (!incoming) return;
    const swipe = intent.current;
    intent.current = null;
    const rect = root.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    incoming.style.transform = "";
    if (outgoing) outgoing.style.transform = "";
    if (!visible) return;
    const dir = (order.indexOf(country) > order.indexOf(from) ? 1 : -1) as 1 | -1;
    if (outgoing) outgoing.dataset.leaving = "";
    const steps = Math.abs(order.indexOf(country) - order.indexOf(from));
    travel({
      incoming,
      outgoing,
      dir,
      x0: swipe?.x0 ?? 1,
      v0: swipe?.v0 ?? 0,
      response: steps > 1 ? 0.95 : 0.8,
      reduced,
    }).then(() => {
      if (outgoing && previous.current !== from) delete outgoing.dataset.leaving;
    });
  }, [country, intent]);

  // Swipe the city: the frame follows the finger 1:1, inertia picks the city (Apple: decelerationRate .99).
  useEffect(() => {
    const el = screen.current;
    const root = stage.current;
    if (!el || !root) return;
    let startX = 0, startY = 0, lastX = 0, lastT = 0, vx = 0, dx = 0;
    let mode: "idle" | "pending" | "drag" | "scroll" = "idle";
    let neighbour: HTMLElement | null = null;
    let current: HTMLElement | null = null;
    let pointer = -1;
    const width = () => root.clientWidth || window.innerWidth;
    const idx = () => order.indexOf(previous.current);
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if ((e.target as HTMLElement).closest("a,button,input,select,textarea")) return;
      if (e.clientX < 24 || e.clientX > window.innerWidth - 24) return;
      startX = lastX = e.clientX;
      startY = e.clientY;
      lastT = e.timeStamp;
      vx = dx = 0;
      mode = "pending";
      pointer = e.pointerId;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointer || mode === "idle" || mode === "scroll") return;
      const mx = e.clientX - startX;
      const my = e.clientY - startY;
      if (mode === "pending") {
        if (Math.hypot(mx, my) < 10) return;
        if (Math.abs(my) > Math.abs(mx)) { mode = "scroll"; return; }
        mode = "drag";
        stopTravel();
        document.documentElement.classList.add("arrived");
        el.setPointerCapture(pointer);
        current = root.querySelector<HTMLElement>(".city.is-current");
        setWarm(true);
      }
      const dt = Math.max(1, e.timeStamp - lastT);
      vx = 0.8 * ((e.clientX - lastX) / dt) * 1000 + 0.2 * vx;
      lastX = e.clientX;
      lastT = e.timeStamp;
      const w = width();
      const wantDir = mx < 0 ? 1 : -1;
      const nextIndex = idx() + wantDir;
      const exists = nextIndex >= 0 && nextIndex < order.length;
      dx = exists ? mx : mx * 0.55 * Math.min(1, 80 / (Math.abs(mx) + 80)); // rubber band at the ends
      const n = exists ? root.querySelector<HTMLElement>(`.city[data-city="${order[nextIndex]}"]`) : null;
      if (neighbour && neighbour !== n) { neighbour.style.transform = ""; delete neighbour.dataset.leaving; }
      neighbour = n;
      if (current) current.style.transform = `translate3d(${dx}px,0,0)`;
      if (neighbour) {
        neighbour.dataset.leaving = "";
        neighbour.style.transform = `translate3d(${dx + wantDir * w}px,0,0)`;
      }
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      const wasDrag = mode === "drag";
      mode = "idle";
      pointer = -1;
      if (!wasDrag) return;
      const w = width();
      const projected = dx + vx * 0.099; // x + v·d/(1−d), d = .99 per ms
      const dir = (dx < 0 ? 1 : -1) as 1 | -1;
      const nextIndex = idx() + dir;
      const commit = nextIndex >= 0 && nextIndex < order.length &&
        (Math.abs(vx) > 300 ? Math.sign(vx) === -dir : Math.abs(projected) > w * 0.5);
      if (commit) {
        const x0 = Math.max(0.02, 1 - Math.abs(dx) / w);
        const v0 = Math.max(0, (-dir * vx) / w);
        if (neighbour) delete neighbour.dataset.leaving;
        choose(order[nextIndex], { swipe: { x0, v0 } });
      } else if (current) {
        // Return to the current city with the same spring.
        const back = travelBack(current, neighbour, dx, w, vx);
        back.then(() => { if (neighbour) { neighbour.style.transform = ""; delete neighbour.dataset.leaving; } });
      }
      current = null;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [choose]);

  return (
    <section className="arrival" id="top" aria-labelledby="hero-title" data-scrub="dusk">
      <div className="stage" ref={stage}>
        {order.map((id) => (
          <CityLayer key={id} id={id} current={id === country} warm={warm} />
        ))}
        <div className="stage-shade" aria-hidden="true" />
        <div className="stage-dusk" aria-hidden="true" />
        <div className="stage-glow" aria-hidden="true" />
      </div>
      <div className="arrival-one" ref={screen}>
        <div className="wrap arrival-copy">
          <p className="city-line" aria-live="polite"><span key={country}>{info.city}</span></p>
          <h1 id="hero-title"><span className="h1-line">Ваша освіта.</span><br /><span className="h1-line h1-soft">Без кордонів.</span></h1>
          <p className="arrival-lead">Від першого «куди?» до ясного плану вступу. Знайдіть свій напрям разом з Indigo.</p>
          <div className="arrival-choice">
            <CountryTabs country={country} onChange={(value) => choose(value)} withPrices className="tabs-night" />
            <a className="text-link link-night arrival-directions" href="#directions">Обрати напрям <ArrowRight size={17} /></a>
          </div>
          <div className="arrival-actions">
            <a className="cta cta-light arrival-cta" href="#consultation-form">Обговорити план вступу <ArrowUpRight size={19} /></a>
            <p className="arrival-note"><span className="note-dot" aria-hidden="true" />Консультація безкоштовна</p>
          </div>
        </div>
      </div>
      <div className="arrival-two">
        <div className="wrap arrival-two-grid">
          <div className="arrival-facts-wrap">
            <p className="label label-night" data-blur="">Ваш новий горизонт</p>
            <dl className="arrival-facts" key={"facts-" + country} aria-label={`${info.name} коротко`} data-blur="">
              <div className="widget widget-wide"><dt>Життя на місяць · орієнтир по країні</dt><dd className="num">{info.living}</dd></div>
              <div className="widget"><dt>Навчання</dt><dd className="fact-text">{info.tuition.replace(/-/g, "‑")}</dd></div>
              <div className="widget"><dt>{country === "nl" ? "Програми" : `${info.name}: у довіднику`}</dt><dd className="num num-s">{country === "nl" ? "Studyfinder" : `${universitiesCount} університетів`}</dd></div>
            </dl>
          </div>
          <div className="arrival-next">
            <p className="arrival-quote" data-blur="">Великі зміни починаються з одного зрозумілого кроку.</p>
            <nav className="row-links glass-list" aria-label="Швидкі розділи" data-blur="">
              <a href="#guide"><span>Умови вступу<small>Освіта, мова, документи</small></span><ArrowUpRight size={20} /></a>
              <a href="#budget"><span>Планування бюджету<small>Навчання та життя</small></span><ArrowUpRight size={20} /></a>
              <a href="#steps"><span>Ваш наступний крок<small>Від вибору до подання</small></span><ArrowUpRight size={20} /></a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

function travelBack(current: HTMLElement, neighbour: HTMLElement | null, dx: number, w: number, vx: number) {
  const dir = (dx < 0 ? -1 : 1) as 1 | -1; // current layer returns from dx to 0
  const x0 = Math.min(1, Math.abs(dx) / w);
  current.style.transform = "";
  if (neighbour) neighbour.style.transform = "";
  if (x0 < 0.002) return Promise.resolve();
  // Re-use the trip with the "current" city as the incoming layer.
  return travel({ incoming: current, outgoing: neighbour, dir, x0, v0: Math.max(0, (-Math.sign(dx) * vx) / w), response: 0.6 });
}
