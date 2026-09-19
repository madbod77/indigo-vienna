import { useEffect, useRef, useState, type FormEvent } from "react";
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
  const preview = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setDestination(countries[country].name);
    setDraft("");
    setCopied(false);
    setCopyError(false);
  }, [country]);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      nameInput.current?.setCustomValidity("Будь ласка, введіть ваше ім’я.");
      nameInput.current?.reportValidity();
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
            Великий крок.
            <br />
            <em>Почнімо з розмови.</em>
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
            <form onSubmit={prepare}>
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
                onChange={(e) => {
                  e.currentTarget.setCustomValidity("");
                  setName(e.target.value);
                }}
                placeholder="Як до вас звертатися?"
              />
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
                    id="stage"
                    name="stage"
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
        <section className="hero wrap">
          <div className="hero-title">
            <p className="eyebrow">INDIGO · ОСВІТА ЗА КОРДОНОМ</p>
            <h1>
              Ваш наступний розділ.
              <br />
              <em>Австрія та Німеччина.</em>
            </h1>
          </div>
          <div className="hero-note">
            <p>
              Великий вибір стає простішим, коли є ясний план. Дізнайтеся про
              вступ, вимоги та бюджет — і знайдіть свій перший крок.
            </p>
            <a className="text-link" href="#consultation">
              Почнімо з консультації <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section
          className="directions wrap"
          id="directions"
          aria-label="Оберіть країну навчання"
        >
          {(Object.keys(countries) as Country[]).map((id, i) => (
            <a
              key={id}
              className={"country-card country-" + id}
              href={"?country=" + id + "#guide"}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                choose(id, true);
              }}
            >
              <div className="country-photo">
                <img
                  src={basePath + "/images/" + countries[id].image}
                  alt={countries[id].alt}
                  width="1600"
                  height={id === "at" ? 1241 : 1200}
                  fetchPriority={id === "at" ? "high" : "auto"}
                />
                <span className="photo-caption">{countries[id].city}</span>
              </div>
              <div className="country-label">
                <div>
                  <span className="eyebrow">
                    0{i + 1} / {countries[id].local}
                  </span>
                  <h2>{countries[id].name}</h2>
                  <p>{countries[id].caption}</p>
                </div>
                <span className="circle-arrow">
                  <ArrowUpRight size={24} />
                </span>
              </div>
            </a>
          ))}
        </section>
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
            <div
              className="country-switch"
              role="group"
              aria-label="Оберіть країну для інформації"
            >
              <button
                type="button"
                aria-pressed={country === "at"}
                onClick={() => choose("at")}
              >
                Австрія
              </button>
              <button
                type="button"
                aria-pressed={country === "de"}
                onClick={() => choose("de")}
              >
                Німеччина
              </button>
            </div>
          </div>
          <p className="lead">{info.intro}</p>
          <div className="path-grid">
            {info.paths.map((path, i) => (
              <article key={path.title}>
                <span className="path-number">0{i + 1}</span>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
                <SourceLink source={path.source} />
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
              <h2 id="budget-title">Поговорімо про бюджет.</h2>
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
            <h2 id="steps-title">Крок за кроком.</h2>
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
              Те, що хочеться
              <br />
              <em>з’ясувати спочатку.</em>
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
