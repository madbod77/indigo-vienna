import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { basePath } from "@/site.config";
import { countries, type Country, type Source } from "./admissions";

function readCountry(): Country {
  return new URLSearchParams(window.location.search).get("country") === "de"
    ? "de"
    : "at";
}
function SourceLink({ source }: { source: Source }) {
  return (
    <a
      className="source-link"
      href={source.url}
      target="_blank"
      rel="noreferrer"
    >
      {source.label} <ArrowUpRight size={13} />
    </a>
  );
}
function Brand() {
  return (
    <a className="brand" href={basePath + "/"} aria-label="Indigo — головна">
      <svg viewBox="0 0 480 276" role="img" aria-label="Indigo">
        <defs>
          <filter
            id="ink-key"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 .19 0 0 0 0 .14 0 0 0 0 .42 -.8 -.8 -.8 0 2.15"
            />
          </filter>
        </defs>
        <image
          href={basePath + "/images/indigo-wordmark.webp"}
          width="480"
          height="276"
          filter="url(#ink-key)"
        />
      </svg>
    </a>
  );
}
function Consultation({ country }: { country: Country }) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState<string>(
    countries[country].name,
  );
  const [stage, setStage] = useState("");
  const [question, setQuestion] = useState("");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [touched, setTouched] = useState({ name: false, stage: false });
  const nameError = touched.name && !name.trim();
  const stageError = touched.stage && !stage;
  const preview = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const stageInput = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    setDestination(countries[country].name);
    setDraft("");
    setCopied(false);
    setCopyError(false);
  }, [country]);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ name: true, stage: true });
    if (!name.trim() || !stage) {
      if (!name.trim()) nameInput.current?.focus();
      else stageInput.current?.focus();
      return;
    }
    setDraft(
      `Вітаю, Indigo! Хочу записатися на безкоштовну консультацію щодо вступу.\n\nІм’я: ${name.trim()}\nКраїна: ${destination}\nМій етап: ${stage}${question.trim() ? `\nЗапитання: ${question.trim()}` : ""}`,
    );
    setCopied(false);
    setCopyError(false);
    requestAnimationFrame(() => preview.current?.focus());
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <section
      className="consultation"
      id="consultation"
      aria-labelledby="consultation-title"
    >
      <div className="wrap consultation-grid">
        <div className="consultation-copy">
          <p className="eyebrow">ВАШ ПЕРШИЙ КРОК</p>
          <h2 id="consultation-title">
            Спочатку —
            <br />
            <em>просто розмова.</em>
          </h2>
          <p className="lead">
            Запишіться на безкоштовну консультацію. Обговоримо ваш напрям,
            рівень мови, бюджет і питання, з яких варто почати.
          </p>
          <div className="consult-topics">
            <span>Вибір країни та програми</span>
            <span>Вимоги й документи</span>
            <span>Терміни та наступні кроки</span>
          </div>
          <p className="contact-alternative">
            Зручніше поговорити?
            <br />
            <a href="tel:+380506093398">+380 50 609 33 98</a>
          </p>
        </div>
        <div className="form-panel">
          {!draft ? (
            <form onSubmit={prepare} noValidate>
              <h3>Заявка на консультацію</h3>
              <p className="form-help">
                Кілька деталей — і ви зможете надіслати заявку в Telegram.
              </p>
              <label htmlFor="applicant-name">Ваше ім’я</label>
              <input
                ref={nameInput}
                id="applicant-name"
                name="name"
                autoComplete="given-name"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((value) => ({ ...value, name: true }))}
                aria-invalid={nameError || undefined}
                aria-describedby={nameError ? "name-error" : undefined}
                placeholder="Як до вас звертатися?"
              />
              {nameError && (
                <p className="field-error" id="name-error" role="alert">
                  Вкажіть, будь ласка, ваше ім’я.
                </p>
              )}
              <div className="form-row">
                <div>
                  <label htmlFor="destination">Країна навчання</label>
                  <select
                    id="destination"
                    name="country"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    <option>Австрія</option>
                    <option>Німеччина</option>
                    <option>Ще обираю</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="stage">Ваш етап</label>
                  <select
                    ref={stageInput}
                    id="stage"
                    name="stage"
                    onBlur={() =>
                      setTouched((value) => ({ ...value, stage: true }))
                    }
                    aria-invalid={stageError || undefined}
                    aria-describedby={stageError ? "stage-error" : undefined}
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Оберіть етап
                    </option>
                    <option>Ще навчаюся у школі</option>
                    <option>Маю атестат</option>
                    <option>Навчаюся у виші</option>
                    <option>Планую магістратуру</option>
                    <option>Звертаюся як мама / тато</option>
                    <option>Інша ситуація</option>
                  </select>
                  {stageError && (
                    <p className="field-error" id="stage-error" role="alert">
                      Оберіть ваш етап навчання.
                    </p>
                  )}
                </div>
              </div>
              <label htmlFor="question">
                Що вас цікавить? <span>Необов’язково</span>
              </label>
              <textarea
                id="question"
                name="question"
                rows={3}
                maxLength={600}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Напрям, бажаний рік вступу або ваше запитання"
              />
              <Button type="submit" className="form-submit">
                Підготувати заявку <ArrowRight size={18} />
              </Button>
              <p className="privacy-note">
                Спочатку перевірте текст, потім надішліть його в Telegram
                @Natalia_Indigo. Форма сама повідомлень не надсилає.
              </p>
            </form>
          ) : (
            <div ref={preview} className="draft-panel" tabIndex={-1}>
              <p className="eyebrow">ЗАЯВКУ ПІДГОТОВЛЕНО</p>
              <h3>Залишилося надіслати</h3>
              <p className="form-help">
                Перевірте текст. У чаті Telegram натисніть «Надіслати», щоб
                Indigo отримав вашу заявку.
              </p>
              <label className="sr-only" htmlFor="request-preview">
                Текст заявки
              </label>
              <textarea id="request-preview" readOnly rows={9} value={draft} />
              <a
                className="button form-submit"
                href={
                  "https://t.me/Natalia_Indigo?text=" +
                  encodeURIComponent(draft)
                }
                target="_blank"
                rel="noreferrer"
              >
                Відкрити Telegram <ArrowUpRight size={18} />
              </a>
              <div className="draft-actions">
                <button
                  type="button"
                  onClick={() => {
                    setDraft("");
                    requestAnimationFrame(() => nameInput.current?.focus());
                  }}
                >
                  Змінити дані
                </button>
                <button type="button" onClick={copy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Скопійовано" : "Скопіювати текст"}
                </button>
              </div>
              <p role="status" className="privacy-note">
                {copyError
                  ? "Виділіть текст заявки вище та скопіюйте вручну."
                  : copied
                    ? "Текст скопійовано. Його можна вставити в чат @Natalia_Indigo."
                    : "Якщо текст не з’явиться в Telegram, скопіюйте його та вставте в чат."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function CountrySwitch({
  country,
  onChange,
  scene = false,
}: {
  country: Country;
  onChange: (value: Country) => void;
  scene?: boolean;
}) {
  const indicator = useRef<HTMLSpanElement>(null);
  const spring = useRef({ value: country === "de" ? 1 : 0, velocity: 0 });
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = country === "de" ? 1 : 0;
    let frame = 0;
    let last = 0;
    const geometry = { x: 0, y: 0 };
    const container = indicator.current?.parentElement;
    if (!container) return;
    const paint = () => {
      if (indicator.current)
        indicator.current.style.transform = `translate(${geometry.x * spring.current.value}px, ${geometry.y * spring.current.value}px)`;
    };
    const measure = () => {
      const buttons = container.querySelectorAll("button");
      if (!indicator.current || buttons.length !== 2) return;
      geometry.x = buttons[1].offsetLeft - buttons[0].offsetLeft;
      geometry.y = buttons[1].offsetTop - buttons[0].offsetTop;
      Object.assign(indicator.current.style, {
        left: `${buttons[0].offsetLeft}px`,
        top: `${buttons[0].offsetTop}px`,
        width: `${buttons[0].offsetWidth}px`,
        height: `${buttons[0].offsetHeight}px`,
        bottom: "auto",
      });
      paint();
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    function step(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.032) : 1 / 60;
      last = now;
      const state = spring.current;
      const acceleration = 300 * (target - state.value) - 35 * state.velocity;
      state.velocity += acceleration * dt;
      state.value += state.velocity * dt;
      paint();
      if (
        Math.abs(target - state.value) > 0.0005 ||
        Math.abs(state.velocity) > 0.001
      )
        frame = requestAnimationFrame(step);
      else {
        state.value = target;
        state.velocity = 0;
        paint();
      }
    }
    function start() {
      cancelAnimationFrame(frame);
      if (media.matches) {
        spring.current = { value: target, velocity: 0 };
        paint();
      } else {
        last = 0;
        frame = requestAnimationFrame(step);
      }
    }
    start();
    media.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      media.removeEventListener("change", start);
    };
  }, [country]);
  return (
    <div
      className={"country-switch" + (scene ? " scene-switch" : "")}
      role="group"
      aria-label="Оберіть країну навчання"
    >
      <span className="switch-indicator" aria-hidden="true" ref={indicator} />
      <button
        type="button"
        aria-pressed={country === "at"}
        onClick={() => onChange("at")}
      >
        Австрія
      </button>
      <button
        type="button"
        aria-pressed={country === "de"}
        onClick={() => onChange("de")}
      >
        Німеччина
      </button>
    </div>
  );
}

export default function Home() {
  const [country, setCountry] = useState<Country>(readCountry);
  const [allQuestions, setAllQuestions] = useState(false);
  const info = countries[country];
  useEffect(() => {
    const sync = () => {
      setCountry(readCountry());
      setAllQuestions(false);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function choose(value: Country, scroll = false) {
    if (value === country) {
      if (scroll) document.getElementById("guide")?.scrollIntoView();
      return;
    }
    setCountry(value);
    setAllQuestions(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("film");
    url.searchParams.set("country", value);
    if (scroll) url.hash = "guide";
    window.history.pushState({}, "", url);
    if (scroll) document.getElementById("guide")?.scrollIntoView();
  }
  return (
    <>
      <a className="skip-link" href="#main">
        До основного змісту
      </a>
      <header className="header wrap">
        <Brand />
        <nav aria-label="Головна навігація">
          <a href="#directions">Напрями</a>
          <a href="#steps">Як вступити</a>
          <a href="#faq">Питання</a>
        </nav>
        <a className="button header-cta" href="#consultation">
          Безкоштовна консультація <ArrowUpRight size={17} />
        </a>
      </header>
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <p className="eyebrow">Вступ до Австрії та Німеччини</p>
          <h1 id="hero-title">
            Ваша освіта.
            <br />
            <span>Без кордонів.</span>
          </h1>
          <p className="hero-description">
            Від першого «куди?» до ясного плану вступу.
            <br /> Знайдіть свій напрям разом з Indigo.
          </p>
          <a className="button hero-cta" href="#consultation">
            Безкоштовна консультація <ArrowUpRight size={18} />
          </a>
        </section>
        <section
          className="destination-stage"
          id="directions"
          aria-label="Оберіть країну навчання"
          data-country={country}
        >
          <div className="destination-visuals">
            {(Object.keys(countries) as Country[]).map((id) => (
              <img
                key={id}
                className={"destination-image image-" + id}
                src={basePath + "/images/" + countries[id].image}
                alt={id === country ? countries[id].alt : ""}
                aria-hidden={id !== country}
                data-active={id === country}
                width="1600"
                height={id === "at" ? 1241 : 1200}
                fetchPriority={id === country ? "high" : "auto"}
              />
            ))}
          </div>
          <div className="scene-controls">
            <CountrySwitch
              country={country}
              onChange={(value) => choose(value)}
              scene
            />
          </div>
          <div className="destination-caption">
            <div>
              <p className="destination-kicker">ВАШ НАПРЯМ</p>
              <h2>
                {info.name}
                <span>.</span>
              </h2>
              <p className="destination-location">{info.city}</p>
            </div>
            <a className="scene-link" href="#guide">
              Про вступ <ArrowUpRight size={21} />
            </a>
          </div>
        </section>
        <div
          className="intro-facts wrap"
          role="group"
          aria-label="Освітні можливості"
        >
          <span>Бакалаврат</span>
          <span>Магістратура</span>
          <span>Підготовчі програми</span>
        </div>
        <section
          className="section wrap guide"
          id="guide"
          aria-labelledby="guide-title"
        >
          <div className="guide-head">
            <div className="section-heading">
              <p className="eyebrow">МОЖЛИВОСТІ ТА ВИМОГИ</p>
              <h2 id="guide-title">{info.title}</h2>
            </div>
            <CountrySwitch
              country={country}
              onChange={(value) => choose(value)}
            />
          </div>
          <p className="lead">{info.intro}</p>
          <div className="path-grid">
            {info.paths.map((path) => (
              <article key={path.title}>
                <h3>{path.title}</h3>
                <div className="path-description">
                  <p>{path.text}</p>
                  <SourceLink source={path.source} />
                </div>
              </article>
            ))}
          </div>
          <div className="catalogue">
            <p>{info.catalogueNote}</p>
            <a
              className="text-link"
              href={info.catalogue.url}
              target="_blank"
              rel="noreferrer"
            >
              {info.catalogue.label}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <section className="budget" aria-labelledby="budget-title">
          <div className="wrap">
            <div className="section-heading">
              <p className="eyebrow">{info.name.toUpperCase()} · ФІНАНСИ</p>
              <h2 id="budget-title">Великі плани. Ясний бюджет.</h2>
            </div>
            <div className="budget-grid">
              <div className="living-cost">
                <span className="budget-label">ЖИТТЯ НА МІСЯЦЬ</span>
                <p className="cost-number">{info.living}</p>
                <p>{info.livingNote}</p>
                <SourceLink source={info.livingSource} />
              </div>
              <div className="tuition">
                <h3>{info.tuition}</h3>
                <p>{info.tuitionNote}</p>
                <SourceLink source={info.tuitionSource} />
              </div>
              <div className="extra-cost">
                <h3>Що додати до бюджету</h3>
                <p>
                  Переклади та засвідчення документів, подання заяв, мовні
                  іспити чи підготовка, дорога та депозит за житло.
                </p>
                <a href="#consultation" className="text-link">
                  Обговорити свою ситуацію
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
            <p className="data-date">
              Орієнтири перевірено 19 вересня 2026. Остаточні суми й пільги
              звіряйте для свого закладу, набору та статусу.
            </p>
          </div>
        </section>
        <section
          className="section wrap"
          id="steps"
          aria-labelledby="steps-title"
        >
          <div className="section-heading">
            <p className="eyebrow">
              {info.name.toUpperCase()} · ШЛЯХ ДО НАВЧАННЯ
            </p>
            <h2 id="steps-title">Вступ стає зрозумілим.</h2>
          </div>
          <ol className="steps">
            {info.steps.map((step, i) => (
              <li key={step.title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="steps-footer">
            <p>
              Ще не визначилися з країною чи спеціальністю?
              <br />
              Це теж хороша точка для першої розмови.
            </p>
            <a className="button" href="#consultation">
              Безкоштовна консультація
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section
          className="faq section wrap"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="faq-heading">
            <p className="eyebrow">
              {info.name.toUpperCase()} · ПИТАННЯ Й ВІДПОВІДІ
            </p>
            <h2 id="faq-title">
              Важливі питання.
              <br />
              <em>Прості відповіді.</em>
            </h2>
            <p>Короткі відповіді та офіційні джерела для вашого рішення.</p>
            <a className="text-link" href="#guide">
              Змінити країну
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="faq-list" key={country}>
            {info.faq.slice(0, allQuestions ? undefined : 6).map((item) => (
              <details key={item.question} name="admissions-faq">
                <summary>
                  {item.question}
                  <Plus size={19} />
                </summary>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                  <SourceLink source={item.source} />
                </div>
              </details>
            ))}
            <button
              className="more-questions"
              type="button"
              aria-expanded={allQuestions}
              onClick={() => setAllQuestions(!allQuestions)}
            >
              {allQuestions
                ? "Показати менше"
                : "Ще питання: робота, стипендії та майбутнє"}
              <ChevronDown
                size={17}
                style={{
                  transform: allQuestions ? "rotate(180deg)" : undefined,
                }}
              />
            </button>
          </div>
        </section>
        <Consultation country={country} />
      </main>
      <footer className="wrap">
        <div className="footer">
          <span>Indigo · Австрія та Німеччина</span>
          <a href="tel:+380506093398">+380 50 609 33 98</a>
          <a
            href="https://www.instagram.com/indigo_education_centre/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
            <ArrowUpRight size={14} />
          </a>
          <a href="#main">
            Нагору
            <ArrowRight size={14} />
          </a>
        </div>
        <div className="footer-meta">
          <p>
            Вимоги залежать від програми та вашої ситуації. Рішення про
            зарахування приймає навчальний заклад.
          </p>
          <details className="photo-credits">
            <summary>Автори фотографій</summary>
            <p>
              <a
                href="https://commons.wikimedia.org/wiki/File:Exterior_of_Vienna_State_Opera_House,_August_2019.jpg"
                target="_blank"
                rel="noreferrer"
              >
                Відень: Benoît Prieur / Wikimedia Commons
              </a>{" "}
              ·{" "}
              <a
                href="https://creativecommons.org/publicdomain/zero/1.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC0
              </a>
              . Зменшено.
            </p>
            <p>
              <a
                href="https://commons.wikimedia.org/wiki/File:Berliner_Dom_from_Humboldtforum_rooftop.jpg"
                target="_blank"
                rel="noreferrer"
              >
                Берлін: Gerda Arendt / Wikimedia Commons
              </a>{" "}
              ·{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY-SA 4.0
              </a>
              . Зменшено, кадровано у відображенні.
            </p>
          </details>
        </div>
      </footer>
    </>
  );
}
