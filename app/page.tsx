// Indigo — довідник вступу. Напрям «Маршрут» (runs/indigo-premium-mobile/direction-A.md):
// ніч (питання «куди?») → світанок (вибір) → день (ясний план) → знову ніч (майбутнє з вашим ім’ям).
import {
  Fragment,
  startTransition,
  useCallback,
  useId,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Pause, Play } from "lucide-react";
import { basePath } from "@/site.config";
import { countries, type Country, type Source } from "./admissions";
import { universities } from "./universities";
import { germanUniversities, type CampusUniversity } from "./germany-universities";
import { Arrival, CountryTabs, order, type TravelIntent } from "./arrival";
import { Consultation } from "./consultation";
import { Sheet } from "./sheet";

const campusImages = [
  "01-universitaet-wien.webp", "wu-trimmed-23-25-terminal.webp", "02-tu-wien.webp",
  "08-hochschule-campus-wien.webp", "04-meduni-wien.webp", "05-boku.webp",
  "06-mdw.webp", "07-die-angewandte.webp", "09-fh-technikum-wien.webp", "10-fhwien-der-wkw.webp",
];

function campusImageSizes(university: CampusUniversity) {
  // object-fit: cover needs pixels for the full image, including the cropped sides.
  const scale = Math.max(1, (university.imageWidth / university.imageHeight) / (4 / 3));
  return `(max-width: 760px) ${Math.ceil(78 * scale)}vw, (max-width: 1100px) ${Math.ceil(40 * scale)}vw, ${Math.ceil(360 * scale)}px`;
}

function readCountry(): Country {
  if (typeof window === "undefined") return "at";
  const value = new URLSearchParams(window.location.search).get("country");
  return value === "de" || value === "nl" ? value : "at";
}

/** «Ваш вступ до Австрії» → «Австрії» (genitive comes from the data, not invented). */
const genitive = (country: Country) => countries[country].title.split(" до ")[1] ?? countries[country].name;

function SourceLink({ source }: { source: Source }) {
  return (
    <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
      <span>{source.label}</span> <ArrowUpRight size={14} />
    </a>
  );
}

/** Heading whose words rise out of blur when it enters the screen (motion.md). Text stays real text; the last line is the softer tone. */
function Title({ id, lines, as: Tag = "h2", className = "h2" }: { id?: string; lines: string[]; as?: "h2" | "h3"; className?: string }) {
  let n = 0;
  return (
    <Tag id={id} className={className} data-reveal="">
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          <span className={li > 0 && li === lines.length - 1 ? "h-soft" : undefined}>
            {line.split(" ").map((word, wi) => (
              <Fragment key={wi}>
                {wi > 0 && " "}
                <span className="w" style={{ "--d": `${(n++) * 45}ms` } as React.CSSProperties}>{word}</span>
              </Fragment>
            ))}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

/** Indigo wordmark recoloured by an SVG filter (the source file is dark ink on white). `swap` adds an ink copy for the paper header. */
function Wordmark({ tone, swap = false }: { tone: "snow" | "ink"; swap?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const snow = "0 0 0 0 .933 0 0 0 0 .925 0 0 0 0 .957 -.8 -.8 -.8 0 2.15";
  const ink = "0 0 0 0 .19 0 0 0 0 .14 0 0 0 0 .42 -.8 -.8 -.8 0 2.15";
  const href = basePath + "/images/indigo-wordmark.webp";
  return (
    <svg viewBox="0 0 480 276" role="img" aria-label="Indigo">
      <defs>
        <filter id={uid + "a"} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={tone === "snow" ? snow : ink} />
        </filter>
        {swap && (
          <filter id={uid + "b"} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={ink} />
          </filter>
        )}
      </defs>
      <image className="wm-main" href={href} width="480" height="276" filter={`url(#${uid}a)`} />
      {swap && <image className="wm-swap" href={href} width="480" height="276" filter={`url(#${uid}b)`} />}
    </svg>
  );
}

const sections = (country: Country) => [
  { href: "#directions", label: "Напрями" },
  { href: "#guide", label: "Умови вступу" },
  ...(country !== "nl" ? [{ href: "#universities", label: "Університети" }] : []),
  { href: "#budget", label: "Бюджет" },
  { href: "#steps", label: "Як вступити" },
  { href: "#faq", label: "Питання" },
  { href: "#consultation-form", label: "Консультація" },
];

function Header({ country, onMenu }: { country: Country; onMenu: () => void }) {
  return (
    <header className="header">
      <div className="wrap header-row">
        <a className="brand" href={basePath + "/"} aria-label="Indigo — головна">
          <Wordmark tone="snow" swap />
        </a>
        <nav className="header-nav" aria-label="Головна навігація">
          <a href="#directions">Напрями</a>
          <a href="#guide">Вступ</a>
          <a href="#budget">Бюджет</a>
          <a href="#faq">Питання</a>
        </nav>
        <button type="button" className="header-guide" onClick={onMenu} aria-haspopup="dialog">
          <span>Довідник:</span> {countries[country].name} <ChevronDown size={16} />
        </button>
        <a className="header-cta cta cta-light cta-s" href="#consultation-form">Консультація</a>
        <button type="button" className="header-menu" onClick={onMenu} aria-haspopup="dialog" aria-label="Меню"><Menu size={19} /></button>
      </div>
    </header>
  );
}

function RouteSheet({ open, onClose, country, choose }: { open: boolean; onClose: () => void; country: Country; choose: (c: Country) => void }) {
  return (
    <Sheet open={open} onClose={onClose} label="Меню" className="route-sheet">
      <p className="sheet-title">Довідник: {countries[country].name}</p>
      <ul className="sheet-countries">
        {order.map((id) => (
          <li key={id}>
            <button type="button" aria-pressed={country === id} onClick={() => { choose(id); onClose(); }}>
              <img src={`${basePath}/images/${countries[id].image.replace(".jpg", "-480.webp")}`} alt="" width="64" height="80" loading="lazy" decoding="async" />
              <span className="sc-name">{countries[id].name}<small>{countries[id].local}</small></span>
              <span className="sc-cost">{countries[id].living}</span>
              {country === id && <span className="sc-on"><Check size={14} /> Обрано</span>}
            </button>
          </li>
        ))}
      </ul>
      <nav className="sheet-sections" aria-label="Мобільна навігація" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) onClose(); }}>
        {sections(country).map((s) => <a key={s.href} href={s.href}>{s.label}</a>)}
      </nav>
      <p className="sheet-contacts">
        <a href="tel:+380506093398">+380 50 609 33 98</a>
        <a href="https://www.instagram.com/indigo_education_centre/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a>
      </p>
    </Sheet>
  );
}

/** Нижня капсула маршруту (телефон): країна + головна дія під великим пальцем; при зміні країни розкривається «острів». */
function RouteBar({ country, onMenu }: { country: Country; onMenu: () => void }) {
  const [visible, setVisible] = useState(false);
  const [flash, setFlash] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    const cta = document.querySelector(".arrival-cta");
    const consultation = document.getElementById("consultation");
    if (!cta || !consultation) return;
    const update = () => setVisible(
      cta.getBoundingClientRect().bottom < 0 && consultation.getBoundingClientRect().top >= window.innerHeight * 0.6,
    );
    const observer = new IntersectionObserver(update, { threshold: [0, 0.4, 1] });
    observer.observe(cta);
    observer.observe(consultation);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); window.removeEventListener("scroll", update); };
  }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 2000);
    return () => window.clearTimeout(t);
  }, [country]);
  const info = countries[country];
  return (
    <nav className={"dock" + (visible ? " is-visible" : "") + (flash ? " is-flash" : "")} aria-label="Швидкі переходи" inert={!visible || undefined}>
      <button type="button" className="dock-country" onClick={onMenu} aria-haspopup="dialog">
        <img className="dock-thumb" src={`${basePath}/images/${info.image.replace(".jpg", "-480.webp")}`} alt="" width="36" height="36" loading="lazy" decoding="async" />
        <span className="dock-text">
          <span className="dock-small">Ваш вступ до</span>
          <span className="dock-name"><span key={country}>{genitive(country)}</span><ChevronDown size={15} /></span>
          <span className="dock-flash" aria-hidden="true">{info.city} · {info.living}</span>
        </span>
      </button>
      <a className="dock-cta" href="#consultation-form">Консультація <ArrowUpRight size={17} /></a>
    </nav>
  );
}

/* Стрічка: університети довідника з офіційними сторінками вступу (не рейтинг і не партнери) */
function UniversityTicker() {
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const resume = useRef(0);
  const list = [...universities, ...germanUniversities].map((u) => ({ name: u.name, url: u.url }));
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const row = (hidden: boolean) => (
    <ul className="ticker-row" aria-hidden={hidden || undefined}>
      {list.map((u) => (
        <li key={u.name}><a href={u.url} target="_blank" rel="noreferrer" tabIndex={hidden ? -1 : undefined}>{u.name}</a></li>
      ))}
    </ul>
  );
  return (
    <section
      ref={root}
      className="ticker night"
      data-paused={paused || held || offscreen || undefined}
      aria-label={`Офіційні сторінки вступу в довіднику: ${list.length} університетів`}
    >
      <div className="wrap ticker-head">
        <p className="ticker-label"><b className="num">{list.length}</b><span>офіційних сторінок вступу<small>добірка довідника — не партнери й не рейтинг</small></span></p>
        <button type="button" className="ticker-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}
          aria-label={paused ? "Продовжити рух стрічки" : "Зупинити рух стрічки"}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
      </div>
      <div className="ticker-view"
        onPointerDown={() => { window.clearTimeout(resume.current); setHeld(true); }}
        onPointerUp={() => { resume.current = window.setTimeout(() => setHeld(false), 2000); }}
        onPointerCancel={() => { resume.current = window.setTimeout(() => setHeld(false), 2000); }}>
        <div className="ticker-track">{row(false)}{row(true)}</div>
      </div>
    </section>
  );
}

function Departures({ country, choose }: { country: Country; choose: (c: Country, opts?: { scroll?: boolean }) => void }) {
  return (
    <section className="departures night" id="directions" aria-labelledby="directions-title">
      <div className="wrap">
        <div className="departures-head">
          <div>
            <p className="label label-night">Три напрями. Ваш вибір.</p>
            <Title id="directions-title" lines={["Три напрями.", "Безліч можливостей."]} />
          </div>
          <div className="departures-lead" data-blur="">
            <p>Оберіть, де почнеться ваша нова історія. Умови вступу, бюджет і наступні кроки — усе зібрано в одному місці.</p>
            <p className="levels" role="group" aria-label="Освітні можливості"><span>Бакалаврат</span><span>Магістратура</span><span>Підготовчі програми</span></p>
          </div>
        </div>
        <ul className="board" data-reveal="">
          {order.map((id, i) => (
            <li key={id} style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <button type="button" className="board-card" aria-pressed={country === id}
                onClick={() => choose(id, { scroll: true })} aria-label={`Обрати напрям: ${countries[id].name}`}>
                <span className="board-thumb" aria-hidden="true" style={{ "--streak": `url(${basePath}/images/${countries[id].image.replace(".jpg", "-streak.webp")})` } as React.CSSProperties}>
                  <img className="thumb-sharp" src={`${basePath}/images/${countries[id].image.replace(".jpg", "-800.webp")}`}
                    srcSet={`${basePath}/images/${countries[id].image.replace(".jpg", "-480.webp")} 480w, ${basePath}/images/${countries[id].image.replace(".jpg", "-800.webp")} 800w`}
                    sizes="(max-width: 760px) 92vw, 33vw" alt="" width="800" height="600" loading="lazy" decoding="async" />
                  <span className="board-cost"><b>{countries[id].living}</b> життя на місяць · орієнтир</span>
                </span>
                <span className="board-body">
                  <span className="board-top">
                    <span className="board-name">{countries[id].name}</span>
                    {country === id ? <span className="chip chip-on"><Check size={13} /> Обрано</span> : <span className="chip">{countries[id].local}</span>}
                  </span>
                  {country === id && <span className="board-local">{countries[id].local}</span>}
                  <span className="board-caption">{countries[id].caption}</span>
                  <span className="board-go">Дослідити напрям <ArrowUpRight size={17} /></span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function UniversityRail({ country, list, expanded, onToggle, toggleRef }: {
  country: Country; list: CampusUniversity[]; expanded: boolean; onToggle: () => void; toggleRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = rail.current;
    if (!el || expanded) return;
    setActive(0);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
    }, { root: el, threshold: 0.6 });
    el.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [country, expanded]);
  return (
    <section key={country} className="universities" id="universities" aria-labelledby="universities-title">
      <div className="universities-head">
        <div>
          <p className="label">{country === "de" ? "Різні міста. Ваш напрям." : "Місто, у якому навчаються"}</p>
          <h3 id="universities-title" className="h3-display">Знайомтесь: університети {country === "de" ? "Німеччини" : "Відня"}</h3>
        </div>
        <span className="university-count">{list.length} закладів</span>
      </div>
      <p className="university-note">Добірка для знайомства з напрямами. Це не рейтинг і не перелік партнерів Indigo. Правила вступу визначає кожен заклад. {country === "de" ? "На фото — кампуси університетів; автори й ліцензії вказані внизу сторінки." : "Зображення кампусів — візуальні ілюстрації."}</p>
      <ul id="university-list" ref={rail} className={"rail" + (expanded ? " is-grid" : "")} data-blur="">
        {list.map((university, index) => (
          <li key={university.name} data-i={index} tabIndex={-1}>
            <div className="uni-image">
              <img src={`${basePath}/images/${university.imageFile ?? `${university.image}-800.webp`}`}
                srcSet={university.imageFile ? undefined : university.imageWidths.map((width) => `${basePath}/images/${university.image}-${width}.webp ${width}w`).join(", ")}
                sizes={campusImageSizes(university)}
                alt={university.imageAlt} width={university.imageWidth} height={university.imageHeight} loading="lazy" decoding="async" />
            </div>
            <p className="uni-kicker">{country === "de" ? university.city : "Відень"} · {university.category}</p>
            <h4>{university.name}</h4>
            <p className="uni-text">{university.description}</p>
            <a href={university.url} className="text-link" target="_blank" rel="noreferrer" aria-label={`Офіційний вступ: ${university.name}`}>Про вступ <ArrowUpRight size={16} /></a>
          </li>
        ))}
      </ul>
      {!expanded && (
        <div className="rail-progress" aria-hidden="true">
          <span style={{ width: `${100 / list.length}%`, transform: `translateX(${active * 100}%)` }} />
        </div>
      )}
      <button ref={toggleRef} type="button" className="row-button pill-button" aria-expanded={expanded} aria-controls="university-list" onClick={onToggle}>
        {expanded ? "Згорнути добірку" : `Переглянути всі ${list.length} університетів`}<ChevronDown size={18} style={{ transform: expanded ? "rotate(180deg)" : undefined }} />
      </button>
    </section>
  );
}

function LivingCompare({ country }: { country: Country }) {
  const parse = (v: string) => {
    const nums = (v.match(/\d[\d\s ]*/g) ?? []).map((x) => Number(x.replace(/[\s ]/g, "")));
    return { min: nums[0] ?? 0, max: nums[1] ?? nums[0] ?? 0 };
  };
  const lo = 800, hi = 1600, pct = (x: number) => ((x - lo) / (hi - lo)) * 100;
  return (
    <div className="compare" data-reveal="">
      <p className="label">Життя на місяць · три країни</p>
      <ul>
        {order.map((id, i) => {
          const r = parse(countries[id].living);
          const single = r.min === r.max;
          return (
            <li key={id} data-active={id === country || undefined}>
              <span className="cmp-name">{countries[id].name}</span>
              <span className="cmp-val">{countries[id].living}</span>
              <span className="cmp-axis" aria-hidden="true">
                <span className={single ? "cmp-dot" : "cmp-bar"}
                  style={{ left: pct(r.min) + "%", width: single ? undefined : pct(r.max) - pct(r.min) + "%", "--d": `${i * 80}ms` } as React.CSSProperties} />
              </span>
            </li>
          );
        })}
      </ul>
      <div className="cmp-scale" aria-hidden="true"><span>€800</span><span>€1 200</span><span>€1 600</span></div>
      <p className="cmp-note">Орієнтири по країні з різних джерел; у великих містах витрати можуть бути вищими.</p>
      <p className="cmp-sources">Джерела: {order.map((id, i) => <span key={id}>{i ? " · " : ""}<a href={countries[id].livingSource.url} target="_blank" rel="noreferrer">{countries[id].livingSource.label}</a></span>)}</p>
    </div>
  );
}

/** Чотири кроки — стос карток (як «Етап 1 з 4» у Velira): картка стоїть, доки її дочитають, наступна насувається, попередня відступає в тінь. */
function Steps({ country }: { country: Country }) {
  const info = countries[country];
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const cards = [...el.querySelectorAll<HTMLElement>(".stack-card")];
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const r = card.getBoundingClientRect();
        const cover = Math.min(1, Math.max(0, (r.top + r.height - next.getBoundingClientRect().top) / r.height));
        card.style.setProperty("--cover", cover.toFixed(3));
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [country]);
  return (
    <section className="steps day" id="steps" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="steps-head">
          <p className="label">{info.name} · шлях до навчання</p>
          <Title id="steps-title" lines={["Від «хочу» —", "до плану дій."]} />
        </div>
        <ol className="stack" ref={list} key={country}>
          {info.steps.map((step, i) => (
            <li key={step.title} className="stack-card" style={{ "--i": i } as React.CSSProperties}>
              <p className="stack-k">Етап {i + 1} з {info.steps.length}</p>
              <h3>{step.title}</h3>
              <p className="stack-text">{step.text}</p>
              <span className="card-shade" aria-hidden="true" />
            </li>
          ))}
        </ol>
        <div className="steps-footer" data-blur="">
          <p>Ще не визначилися з країною чи спеціальністю? Це теж хороша точка для першої розмови.</p>
          <a className="cta cta-ink" href="#consultation-form">Поговорити з Indigo <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

/** Питання: покажчик. Телефон — аркуш відповіді; ПК — відповідь поруч; без JS — <details>. */
function Faq({ country, all, setAll, onMenu }: { country: Country; all: boolean; setAll: (v: boolean) => void; onMenu: () => void }) {
  const info = countries[country];
  const [mode, setMode] = useState<"details" | "sheet" | "panel">("details");
  const [current, setCurrent] = useState<number | null>(null);
  const [panel, setPanel] = useState(0);
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 759px)");
    const wide = window.matchMedia("(min-width: 1100px)");
    const update = () => setMode(phone.matches ? "sheet" : wide.matches ? "panel" : "details");
    update();
    phone.addEventListener("change", update);
    wide.addEventListener("change", update);
    return () => { phone.removeEventListener("change", update); wide.removeEventListener("change", update); };
  }, []);
  useEffect(() => { setPanel(0); setCurrent(null); }, [country]);
  const shown = info.faq.slice(0, all ? undefined : 6);
  const item = current !== null ? info.faq[current] : null;
  return (
    <section className="faq day" id="faq" aria-labelledby="faq-title" data-scrub="sheet">
      <div className="wrap faq-grid" data-mode={mode}>
        <div className="faq-head">
          <p className="label">{info.name} · питання й відповіді</p>
          <Title id="faq-title" lines={["Важливі питання.", "Прості відповіді."]} />
          <p className="faq-sub">Короткі відповіді та офіційні джерела для вашого рішення.</p>
          <button type="button" className="text-link" onClick={onMenu}>Змінити країну <ArrowRight size={16} /></button>
        </div>
        <div className="faq-index" key={country} data-blur="">
          <p className="faq-count">{info.name} <span>{info.faq.length} питань</span></p>
          {shown.map((q, i) => (
            <details key={q.question} name="admissions-faq" data-on={mode === "panel" && panel === i ? "" : undefined}>
              <summary onClick={(e) => {
                if (mode === "sheet") { e.preventDefault(); setCurrent(i); }
                else if (mode === "panel") { e.preventDefault(); setPanel(i); }
              }}>
                <span>{q.question}</span>
                <ArrowRight size={18} />
              </summary>
              <div className="faq-answer">
                <p>{q.answer}</p>
                <SourceLink source={q.source} />
              </div>
            </details>
          ))}
          <button className="row-button faq-more" type="button" aria-expanded={all} onClick={() => setAll(!all)}>
            {all ? "Показати менше" : "Ще 4 питання: робота, стипендії та майбутнє"}
            <ChevronDown size={17} style={{ transform: all ? "rotate(180deg)" : undefined }} />
          </button>
        </div>
        {mode === "panel" && shown[panel] && (
          <div className="faq-panel" aria-live="polite">
            <div key={country + panel} className="faq-panel-inner">
              <h3>{shown[panel].question}</h3>
              <p>{shown[panel].answer}</p>
              <SourceLink source={shown[panel].source} />
            </div>
          </div>
        )}
      </div>
      <Sheet open={mode === "sheet" && item !== null} onClose={() => setCurrent(null)} label="Відповідь" className="answer-sheet">
        {item && current !== null && (
          <div className="answer" key={current}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
            <SourceLink source={item.source} />
            <div className="answer-nav">
              <button type="button" disabled={current === 0} onClick={() => setCurrent(current - 1)}>← Попереднє</button>
              {current < info.faq.length - 1 && (
                <button type="button" onClick={() => { if (current + 1 >= 6) setAll(true); setCurrent(current + 1); }}>
                  Наступне: {info.faq[current + 1].question}
                </button>
              )}
            </div>
          </div>
        )}
      </Sheet>
    </section>
  );
}

export default function Home() {
  const [country, setCountry] = useState<Country>(readCountry);
  const [allQuestions, setAllQuestions] = useState(false);
  const [allUniversities, setAllUniversities] = useState(false);
  const [menu, setMenu] = useState(false);
  const universityToggle = useRef<HTMLButtonElement>(null);
  const intent = useRef<TravelIntent>(null);
  const anchor = useRef<{ el: HTMLElement; top: number } | null>(null);
  const info = countries[country];
  const activeUniversities: CampusUniversity[] = country === "de" ? germanUniversities : universities.map((university, index) => ({
    ...university,
    city: "Відень",
    image: campusImages[index].replace(".webp", ""),
    imageWidths: [480, 800, 1440],
    imageWidth: 1440,
    imageHeight: 810,
    imageAlt: "Архітектурна ілюстрація: " + university.name,
  }));
  const universitiesCount = country === "de" ? germanUniversities.length : universities.length;

  function toggleUniversities() {
    const expanding = !allUniversities;
    setAllUniversities(expanding);
    requestAnimationFrame(() => {
      // Keep the reader at the changed list instead of following the shrinking page.
      const target = expanding
        ? document.querySelector<HTMLElement>("#university-list li:nth-child(4)")
        : universityToggle.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  }

  // The night/day ground drives the header and route-bar material.
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".header");
    let last = window.scrollY;
    let frame = 0;
    const scrubs = [...document.querySelectorAll<HTMLElement>("[data-scrub]")];
    const days = [...document.querySelectorAll<HTMLElement>(".day")];
    const tick = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      // Header hides while reading down, returns on the way up (Flighty: settle ≈ 320 ms).
      if (header) {
        const down = y > last + 4, up = y < last - 4;
        if (y < 80) root.classList.remove("header-hidden");
        else if (down) root.classList.add("header-hidden");
        else if (up) root.classList.remove("header-hidden");
        root.classList.toggle("header-solid", y > 40);
      }
      last = y;
      // Which ground is under the header (night or paper).
      const probe = 28;
      const onDay = days.some((d) => { const r = d.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
      root.dataset.ground = onDay ? "day" : "night";
      // Scroll-linked progress for the few scrubbed moments (dusk on the city, dawn, return of night).
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const kind = el.dataset.scrub;
        let p = 0;
        if (kind === "dusk") p = -r.top / Math.max(1, r.height - vh);
        else if (kind === "dawn") p = (vh * 0.9 - r.top) / (vh * 0.9 + r.height * 0.5); // light rises while the band crosses the screen
        else if (kind === "sheet") p = (vh - r.bottom) / (vh * 0.6); // the consultation sheet edge rises over the questions
        else p = (vh - r.top) / (r.height + vh * 0.25);
        p = Math.min(1, Math.max(0, p));
        el.style.setProperty("--p", p.toFixed(3));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Headings rise once when they reach 80 % of the screen.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]:not(.in), [data-blur]:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [country, allUniversities]);

  useLayoutEffect(() => {
    // A fresh document can resolve its fragment before React has created the section.
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const sync = () => {
      setCountry(readCountry());
      setAllQuestions(false);
      setAllUniversities(false);
    };
    window.addEventListener("popstate", sync);
    (window as unknown as { __indigoReady?: boolean }).__indigoReady = true;
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // Keep the reader's place when the guide changes height (NL has no university rail; Safari has no overflow-anchor).
  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    if (!a || !a.el.isConnected) return;
    const delta = a.el.getBoundingClientRect().top - a.top;
    if (Math.abs(delta) > 1) window.scrollBy(0, delta);
  }, [country]);

  const countryRef = useRef(country);
  countryRef.current = country;
  const choose = useCallback((value: Country, opts: { scroll?: boolean; swipe?: TravelIntent } = {}) => {
    const changed = value !== countryRef.current;
    if (changed) {
      intent.current = opts.swipe ?? null;
      if (!opts.scroll) {
        const marks = [...document.querySelectorAll<HTMLElement>("main > section")];
        const el = marks.find((m) => m.getBoundingClientRect().bottom > 80);
        if (el && el.id !== "top") anchor.current = { el, top: el.getBoundingClientRect().top };
      }
      setCountry(value);
      startTransition(() => {
        setAllQuestions(false);
        setAllUniversities(false);
      });
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("film");
    url.searchParams.set("country", value);
    if (opts.scroll) url.hash = "guide";
    if (url.href !== window.location.href) {
      if (changed) window.history.pushState({}, "", url);
      else window.history.replaceState({}, "", url);
    }
    if (opts.scroll) requestAnimationFrame(() => document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">До основного змісту</a>
      <Header country={country} onMenu={() => setMenu(true)} />
      <main id="main" tabIndex={-1}>
        <Arrival country={country} choose={choose} intent={intent} universitiesCount={universitiesCount} />
        <UniversityTicker />
        <Departures country={country} choose={choose} />
        <div className="dawn" data-scrub="dawn" aria-hidden="true"><span className="dawn-sky" /><span className="dawn-light" /></div>
        <section className="guide day" id="guide" aria-labelledby="guide-title">
          <div className="wrap">
            <div className="guide-head" data-reveal="">
              <p className="label">Можливості та вимоги</p>
              <h2 id="guide-title" className="h2 sentence">
                Ваш вступ до{" "}
                <button type="button" className="sentence-country" onClick={() => setMenu(true)} aria-haspopup="dialog" aria-label={`${info.title}. Змінити країну`}>
                  <span key={country}>{genitive(country)}</span><ChevronDown size={26} />
                </button>
              </h2>
              <CountryTabs country={country} onChange={(value) => choose(value)} className="tabs-day guide-tabs" />
            </div>
            <p className="lead guide-intro" key={"intro-" + country}>{info.intro}</p>
            <div className="paths" key={"paths-" + country} data-blur="">
              {info.paths.map((path, i) => (
                <article key={path.title} style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
                  <h3>{path.title}</h3>
                  <p>{path.text}</p>
                  <SourceLink source={path.source} />
                </article>
              ))}
            </div>
            <div className="catalogue" data-blur="">
              <p>{info.catalogueNote}</p>
              <a className="cta cta-ink catalogue-link" href={info.catalogue.url} target="_blank" rel="noreferrer">
                {info.catalogue.label}<ArrowUpRight size={20} />
              </a>
            </div>
            {country !== "nl" && (
              <UniversityRail country={country} list={activeUniversities} expanded={allUniversities} onToggle={toggleUniversities} toggleRef={universityToggle} />
            )}
          </div>
        </section>
        <section className="budget day" id="budget" aria-labelledby="budget-title">
          <div className="wrap">
            <p className="label">{info.name} · фінанси</p>
            <Title id="budget-title" lines={["Великі плани.", "Ясний бюджет."]} />
            <div className="budget-grid" data-blur="">
              <div className="living-cost">
                <p className="label">Життя на місяць</p>
                <p className="cost-number num" key={"cost-" + country}>{info.living}</p>
                <p>{info.livingNote}</p>
                <SourceLink source={info.livingSource} />
              </div>
              <div className="budget-side">
                <div className="tuition">
                  <h3>{info.tuition}</h3>
                  <p>{info.tuitionNote}</p>
                  <SourceLink source={info.tuitionSource} />
                </div>
                <div className="extra-cost">
                  <h3>Що додати до бюджету</h3>
                  <p>Переклади та засвідчення документів, подання заяв, мовні іспити чи підготовка, дорога та депозит за житло.</p>
                  <a href="#consultation-form" className="text-link">Обговорити свою ситуацію <ArrowUpRight size={16} /></a>
                </div>
              </div>
            </div>
            <LivingCompare country={country} />
            <p className="data-date">
              Орієнтири перевірено {country === "nl" ? "8 жовтня 2026" : "19 вересня 2026"}. Остаточні суми й пільги звіряйте для свого закладу, набору та статусу.
            </p>
          </div>
        </section>
        <Steps country={country} />
        <Faq country={country} all={allQuestions} setAll={setAllQuestions} onMenu={() => setMenu(true)} />
        <Consultation country={country} />
        <div className="nightfall" data-scrub="nightfall" aria-hidden="true" />
      </main>
      <footer className="footer night" data-scrub="footer">
        <div className="wrap">
          <div className="footer-brand">
            <span className="footer-mark"><Wordmark tone="snow" /></span>
            <p>Освіта без кордонів.<br />Майбутнє з вашим ім’ям.</p>
          </div>
          <div className="footer-rows">
            <span>Indigo · Австрія · Німеччина · Нідерланди</span>
            <a href="tel:+380506093398">+380 50 609 33 98</a>
            <a href="https://www.instagram.com/indigo_education_centre/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={15} /></a>
            <a href="#main">Нагору <ArrowRight size={15} /></a>
          </div>
          <div className="footer-meta">
            <p>Вимоги залежать від програми та вашої ситуації. Рішення про зарахування приймає навчальний заклад.</p>
            <details className="photo-credits">
              <summary>Автори фотографій <ChevronDown size={15} /></summary>
              <p>
                <a href="https://commons.wikimedia.org/wiki/File:Exterior_of_Vienna_State_Opera_House,_August_2019.jpg" target="_blank" rel="noreferrer">Відень: Benoît Prieur / Wikimedia Commons</a>{" "}·{" "}
                <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">CC0</a>. Зменшено, кадровано; розмита копія для анімації.
              </p>
              <p>
                <a href="https://commons.wikimedia.org/wiki/File:Berliner_Dom_from_Humboldtforum_rooftop.jpg" target="_blank" rel="noreferrer">Берлін: Gerda Arendt / Wikimedia Commons</a>{" "}·{" "}
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Зменшено, кадровано у відображенні й у вертикальній копії; розмита копія для анімації.
              </p>
              <p>
                <a href="https://commons.wikimedia.org/wiki/File:Amsterdam_Canal.png" target="_blank" rel="noreferrer">Амстердам: Supertrouper33 / Wikimedia Commons</a>{" "}·{" "}
                <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">CC0</a>. Зменшено, перетворено на WebP, кадровано; розмита копія для анімації.
              </p>
              {germanUniversities.map((university) => university.photo && (
                <p key={university.name}>
                  {university.photo.source ? <a href={university.photo.source} target="_blank" rel="noreferrer">{university.name}: {university.photo.author} / {university.photo.publisher ?? "Wikimedia Commons"}</a> : <>{university.name}: {university.photo.credit}</>}
                  {university.photo.license && university.photo.licenseUrl && <>{" "}·{" "}<a href={university.photo.licenseUrl} target="_blank" rel="noreferrer">{university.photo.license}</a></>}
                  . {university.imageFile ? "Кадровано у відображенні." : "Зменшено, перетворено на WebP, кадровано у відображенні."}
                </p>
              ))}
            </details>
          </div>
        </div>
      </footer>
      <RouteBar country={country} onMenu={() => setMenu(true)} />
      <RouteSheet open={menu} onClose={() => setMenu(false)} country={country} choose={(c) => choose(c)} />
    </>
  );
}
