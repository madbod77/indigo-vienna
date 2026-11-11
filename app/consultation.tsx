// Консультація: та сама логіка й тексти; бульбашка Telegram стоїть під полями, над кнопкою (не ховається під клавіатуру).
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { countries, type Country } from "./admissions";

export function Consultation({ country }: { country: Country }) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState<string>(countries[country].name);
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
    <section className="consultation day" id="consultation" aria-labelledby="consultation-title">
      <div className="wrap consultation-grid">
        <div className="consultation-copy">
          <p className="label">Ваш перший крок</p>
          <h2 id="consultation-title" className="h2" data-reveal><span className="w" style={{ "--d": "0ms" } as React.CSSProperties}>Спочатку</span> <span className="w" style={{ "--d": "45ms" } as React.CSSProperties}>—</span><br /><span className="h-soft"><span className="w" style={{ "--d": "90ms" } as React.CSSProperties}>просто</span> <span className="w" style={{ "--d": "135ms" } as React.CSSProperties}>розмова.</span></span></h2>
          <p className="lead">
            Запишіться на безкоштовну консультацію. Обговоримо ваш напрям, рівень мови, бюджет і питання, з яких варто почати.
          </p>
          <ul className="consult-topics" data-blur="">
            <li>Вибір країни та програми</li>
            <li>Вимоги й документи</li>
            <li>Терміни та наступні кроки</li>
          </ul>
          <p className="contact-alternative">
            Зручніше поговорити?
            <a href="tel:+380506093398">+380 50 609 33 98</a>
          </p>
        </div>
        <div className="form-panel" id="consultation-form" tabIndex={-1} data-blur="">
          {!draft ? (
            <form onSubmit={prepare} noValidate>
              <h3>Заявка на консультацію</h3>
              <p className="form-help">Кілька деталей — і ви зможете надіслати заявку в Telegram.</p>
              <div className="field">
                <label htmlFor="applicant-name">Ваше ім’я</label>
                <input
                  ref={nameInput}
                  id="applicant-name"
                  name="name"
                  autoComplete="given-name"
                  enterKeyHint="next"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((value) => ({ ...value, name: true }))}
                  aria-invalid={nameError || undefined}
                  aria-describedby={nameError ? "name-error" : undefined}
                  placeholder="Як до вас звертатися?"
                />
                {nameError && <p className="field-error" id="name-error" aria-live="polite">Вкажіть, будь ласка, ваше ім’я.</p>}
              </div>
              <div className="field">
                <label htmlFor="destination">Країна навчання</label>
                <select id="destination" name="country" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option>Австрія</option>
                  <option>Німеччина</option>
                  <option>Нідерланди</option>
                  <option>Ще обираю</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="stage">Ваш етап</label>
                <select
                  ref={stageInput}
                  id="stage"
                  name="stage"
                  onBlur={() => setTouched((value) => ({ ...value, stage: true }))}
                  aria-invalid={stageError || undefined}
                  aria-describedby={stageError ? "stage-error" : undefined}
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  required
                >
                  <option value="" disabled>Оберіть етап</option>
                  <option>Ще навчаюся у школі</option>
                  <option>Маю атестат</option>
                  <option>Навчаюся у виші</option>
                  <option>Планую магістратуру</option>
                  <option>Звертаюся як мама / тато</option>
                  <option>Інша ситуація</option>
                </select>
                {stageError && <p className="field-error" id="stage-error" aria-live="polite">Оберіть ваш етап навчання.</p>}
              </div>
              <div className="field">
                <label htmlFor="question">Що вас цікавить? <span>Необов’язково</span></label>
                <textarea
                  id="question"
                  name="question"
                  enterKeyHint="done"
                  rows={3}
                  maxLength={600}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Напрям, бажаний рік вступу або ваше запитання"
                />
              </div>
              <div className="tg-preview" aria-hidden="true">
                <p className="tg-head">@Natalia_Indigo · так виглядатиме ваша заявка</p>
                <p className="tg-bubble">
                  Вітаю, Indigo! Хочу записатися на безкоштовну консультацію щодо вступу.
                  <br /><br />
                  Ім’я: <mark key={"n" + name.trim()}>{name.trim() || "…"}</mark>
                  <br />
                  Країна: <mark key={"d" + destination}>{destination}</mark>
                  <br />
                  Мій етап: <mark key={"s" + stage}>{stage || "…"}</mark>
                  {question.trim() ? <><br />Запитання: <mark>{question.trim()}</mark></> : null}
                </p>
              </div>
              <div className="submit-dock">
                <button type="submit" className="cta cta-ink form-submit">Підготувати заявку <ArrowRight size={19} /></button>
              </div>
              <p className="privacy-note">
                Спочатку перевірте текст, потім надішліть його в Telegram @Natalia_Indigo. Форма сама повідомлень не надсилає.
              </p>
            </form>
          ) : (
            <div ref={preview} className="draft-panel" tabIndex={-1}>
              <p className="label">Заявку підготовлено</p>
              <h3>Залишилося надіслати</h3>
              <p className="form-help">Перевірте текст. У чаті Telegram натисніть «Надіслати», щоб Indigo отримав вашу заявку.</p>
              <label className="sr-only" htmlFor="request-preview">Текст заявки</label>
              <textarea id="request-preview" className="tg-bubble draft-text" readOnly rows={9} value={draft} />
              <a className="cta cta-ink form-submit" href={"https://t.me/Natalia_Indigo?text=" + encodeURIComponent(draft)} target="_blank" rel="noreferrer">Відкрити Telegram <ArrowUpRight size={19} /></a>
              <div className="draft-actions">
                <button type="button" onClick={() => { setDraft(""); requestAnimationFrame(() => nameInput.current?.focus()); }}>
                  Змінити дані
                </button>
                <button type="button" onClick={copy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span key={copied ? "c" : "n"}>{copied ? "Скопійовано" : "Скопіювати текст"}</span>
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
