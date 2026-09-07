'use client';
import { basePath } from '@/site.config';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
const universitySources = [
  [
    'Universität Wien',
    'Класичний університет',
    'Гуманітарні, природничі та соціальні науки',
    '01-universitaet-wien',
    'https://studieren.univie.ac.at/zulassungsverfahren/bachelor-diplomstudien/',
  ],
  [
    'WU Wien',
    'Економіка та бізнес',
    'Економіка, менеджмент і міжнародний бізнес',
    '03-wu-wien',
    'https://www.wu.ac.at/en/programs/application-and-admission',
  ],
  [
    'TU Wien',
    'Технології та інженерія',
    'Інженерія, інформатика й архітектура',
    '02-tu-wien',
    'https://www.tuwien.at/en/studies/admission/bachelors-programmes',
  ],
  [
    'Hochschule Campus Wien',
    'Прикладні науки',
    'Здоров’я, соціальна робота, технології та інші напрями',
    '08-hochschule-campus-wien',
    'https://www.hcw.ac.at/studium-weiterbildung/bewerbung-und-aufnahme',
  ],

  [
    'MedUni Wien',
    'Медицина',
    'Медицина та стоматологія',
    '04-meduni-wien',
    'https://www.meduniwien.ac.at/web/en/studies-further-education/application-admission/medicine-and-dentistry-degree/',
  ],
  [
    'BOKU University',
    'Науки про життя',
    'Довкілля, природні ресурси й біотехнології',
    '05-boku',
    'https://boku.ac.at/en/studienservices/themen/zulassung/',
  ],
  [
    'mdw',
    'Музика та сцена',
    'Музика, виконавське мистецтво та кіно',
    '06-mdw',
    'https://online.mdw.ac.at/mdw_online/webnav.willkommen',
  ],
  [
    'Die Angewandte',
    'Мистецтво та дизайн',
    'Візуальне мистецтво, дизайн і медіамистецтво',
    '07-die-angewandte',
    'https://www.dieangewandte.at/entrance',
  ],
  [
    'FH Technikum Wien',
    'Прикладна інженерія',
    'Технології, інженерія та цифрові системи',
    '09-fh-technikum-wien',
    'https://www.technikum-wien.at/en/student-guide/admissions-process/',
  ],
  [
    'FHWien der WKW',
    'Прикладний бізнес',
    'Менеджмент і комунікації',
    '10-fhwien-der-wkw',
    'https://www.fh-wien.ac.at/en/study/application/',
  ],
];

const universities = [
  universitySources[1],
  universitySources[0],
  ...universitySources.slice(2),
];

export default function Home() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'ended'>('idle');
  const intro = phase !== 'ended';
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const video = useRef<HTMLVideoElement>(null);
  const chooser = useRef<HTMLDivElement>(null);
  const endIntro = useCallback(() => {
    video.current?.pause();
    setPhase('ended');
    requestAnimationFrame(() => chooser.current?.focus());
  }, []);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => {
      setReduced(motion.matches);
    };
    preference();
    motion.addEventListener('change', preference);
    return () => {
      motion.removeEventListener('change', preference);
    };
  }, [endIntro]);

  useEffect(() => {
    if (!api) return;
    const select = () => setSelected(api.selectedScrollSnap());
    select();
    api.on('select', select);
    return () => {
      api.off('select', select);
    };
  }, [api]);
  const skip = () => {
    endIntro();
    requestAnimationFrame(() => chooser.current?.focus());
  };
  const start = () => {
    api?.scrollTo(0, true);
    if (video.current) video.current.currentTime = 0;
    setPhase('playing');
    video.current?.play().catch(() => setPlaying(false));
  };
  const replay = start;
  return (
    <main className={`vienna-experience phase-${phase}`} data-university={selected}>
      <h1 className="sr-only">Університети Відня з Indigo</h1>
      <div className="destination" inert={intro} aria-hidden={intro}>
        <header className="site-header">
          <a
            href="https://www.instagram.com/indigo_education_centre/"
            target="_blank"
            rel="noreferrer"
            className="brand"
            aria-label="Indigo Education Centre в Instagram"
          >
            <svg
              viewBox="0 0 480 276"
              aria-hidden="true"
              className="brand-wordmark"
            >
              <defs>
                <filter
                  id="brand-paper-key"
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  colorInterpolationFilters="sRGB"
                >
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 -2 0 0 1.6"
                  />
                </filter>
              </defs>
              <image
                href={`${basePath}/images/indigo-wordmark.webp`}
                width="480"
                height="276"
                filter="url(#brand-paper-key)"
              />
            </svg>
          </a>
          <div className="header-location">
            <span>Навчання в Австрії</span>
            <span>Wien, Österreich</span>
          </div>
          <nav aria-label="Головна навігація">
            <button
              className="replay-link"
              onClick={replay}
              aria-label="Відтворити вступне відео"
            >
              <RotateCcw size={16} />
              <span>Подорож спочатку</span>
            </button>
            <a
              className="consult-link"
              href="https://t.me/Natalia_Indigo"
              target="_blank"
              rel="noreferrer"
            >
              Обговорити вступ <ArrowUpRight size={17} />
            </a>
          </nav>
        </header>
        <Carousel
          className="university-chooser"
          opts={{ loop: true, duration: reduced ? 0 : 35 }}
          setApi={setApi}
          aria-label="Оберіть університет Відня"
          aria-roledescription="карусель"
          onKeyDownCapture={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              api?.scrollPrev(reduced);
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              api?.scrollNext(reduced);
            }
            if (e.key === 'Home') {
              e.preventDefault();
              api?.scrollTo(0, reduced);
            }
            if (e.key === 'End') {
              e.preventDefault();
              api?.scrollTo(universities.length - 1, reduced);
            }
          }}
        >
          <CarouselContent className="scene-track">
            {universities.map((u, i) => (
              <CarouselItem
                key={u[3]}
                className="university-scene"
                aria-label={`${i + 1} із ${universities.length}: ${u[0]}`}
                aria-hidden={selected !== i}
                inert={selected !== i}
              >
                <img
                  src={
                    i === 0
                      ? `${basePath}/images/wu-trimmed-23-25-terminal.webp`
                      : `${basePath}/images/${u[3]}.webp`
                  }
                  alt={`Архітектурна візуалізація ${u[0]}`}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  loading={i === 0 ? undefined : 'eager'}
                  className={
                    i === 0
                      ? 'scene-image film-terminal'
                      : u[3] === '08-hochschule-campus-wien'
                        ? 'scene-image campus-hcw'
                        : 'scene-image'
                  }
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: i === 0 ? 'contain' : 'cover', objectPosition: 'center' }}
                />
                <div className="scene-shade" aria-hidden="true" />
                <article className="university-story">
                  <p className="scene-eyebrow">Відень · {u[1]}</p>
                  <h2>{u[0]}</h2>
                  <div className="story-bottom">
                    <p className="university-description">{u[2]}.</p>
                    <a
                      className="admission-link"
                      href={u[4]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Умови вступу <ArrowUpRight size={17} />
                    </a>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="chooser-controls" ref={chooser} tabIndex={-1}>
            <div
              className="scene-pagination"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="current-number">
                {String(selected + 1).padStart(2, '0')}
              </span>
              <span className="pagination-line" aria-hidden="true" />
              <span>10</span>
              <span className="sr-only"> · {universities[selected][0]}</span>
            </div>
          </div>
          <div className="scene-arrows">
            <Button
              variant="ghost"
              className="scene-arrow"
              aria-label="Попередній університет"
              onClick={() => api?.scrollPrev(reduced)}
            >
              <ArrowLeft size={23} />
            </Button>
            <Button
              variant="ghost"
              className="scene-arrow"
              aria-label="Наступний університет"
              onClick={() => api?.scrollNext(reduced)}
            >
              <ArrowRight size={23} />
            </Button>
          </div>
        </Carousel>
        <footer className="site-footer">
          <a
            className="footer-brand-link"
            href="https://www.instagram.com/indigo_education_centre/"
            target="_blank"
            rel="noreferrer"
          >
            Indigo Education Centre <ArrowUpRight size={14} />
          </a>
          <span className="visual-note">Архітектурні візуалізації</span>
          <a className="phone-link" href="tel:+380506093398">
            +380 50 609 33 98
          </a>
        </footer>
      </div>
      <section
        className={`intro-film phase-${phase}`}
        hidden={!intro}
        aria-label="Вступна подорож Indigo"
      >
        <video
          ref={video}
          muted
          playsInline
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={endIntro}
          onError={endIntro}
          aria-label="Рукописний Indigo, перетворення глобуса на Землю та політ до WU Wien"
        >
          <source
            src={`${basePath}/video/indigo-trimmed-23.25s.mp4`}
            type="video/mp4"
            onError={endIntro}
          />
        </video>
        {phase === 'idle' && (
          <div className="start-canvas">
            <Button className="start-button" onClick={start}>
              <span className="start-play" aria-hidden="true">
                <Play size={17} fill="currentColor" strokeWidth={1.5} />
              </span>
              <span>Почати відео</span>
            </Button>
          </div>
        )}
        {phase === 'playing' && (
          <div className="intro-controls">
            <Button
              variant="ghost"
              className="intro-toggle"
              aria-label={playing ? 'Призупинити відео' : 'Відтворити відео'}
              onClick={() =>
                playing
                  ? video.current?.pause()
                  : video.current?.play().catch(endIntro)
              }
            >
              {playing ? <Pause size={17} /> : <Play size={17} />}
            </Button>
            <button className="intro-skip" onClick={skip}>
              До університетів <ArrowRight size={20} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
