export type Country = "at" | "de";
export type Source = { label: string; url: string };
export type Answer = { question: string; answer: string; source: Source };
export type CountryInfo = {
  name: string;
  local: string;
  caption: string;
  image: string;
  alt: string;
  city: string;
  title: string;
  intro: string;
  paths: { title: string; text: string; source: Source }[];
  living: string;
  livingNote: string;
  livingSource: Source;
  tuition: string;
  tuitionNote: string;
  tuitionSource: Source;
  catalogue: Source;
  catalogueNote: string;
  steps: { title: string; text: string }[];
  faq: Answer[];
};
const atAdmission = {
  label: "OeAD · вступ",
  url: "https://studyinaustria.at/en/plan-your-studies/application-and-admission",
};
const univieLanguage = {
  label: "Universität Wien · мова",
  url: "https://studieren.univie.ac.at/en/admission/german-language-proficiency/",
};
const atResidence = {
  label: "OeAD · перебування",
  url: "https://oead.at/en/to-austria/entry-and-residence/residence-permit-student-no-mobility-programme",
};
const deAdmission = {
  label: "DAAD · освіта з України",
  url: "https://www.daad-ukraine.org/en/studying-in-germany/starting-your-studies-in-germany/university-entrance-qualification/",
};
const deLanguage = {
  label: "uni-assist · мова",
  url: "https://www.uni-assist.de/en/how-to-apply/assemble-your-documents/language-certificates/",
};
const deResidence = {
  label: "Make it in Germany · навчання",
  url: "https://www.make-it-in-germany.com/en/visa-residence/types/studying",
};
export const countries: Record<Country, CountryInfo> = {
  at: {
    name: "Австрія",
    local: "Österreich",
    caption: "Університети, прикладна освіта та підготовчі програми.",
    image: "vienna-opera.jpg",
    alt: "Віденська державна опера, Австрія",
    city: "Відень, Австрія",
    title: "Ваш вступ до Австрії",
    intro:
      "Від економіки та інженерії до мистецтва. Почніть із програми, яка вам цікава, — і перевірте умови саме цього університету.",
    paths: [
      {
        title: "Після школи",
        text: "Вступ можливий на основі повної середньої освіти. Університет оцінює документи, визначає додаткові іспити та умови зарахування.",
        source: atAdmission,
      },
      {
        title: "На магістратуру",
        text: "Потрібен попередній ступінь відповідного напряму. Важливі зміст навчання, академічні документи та мова обраної програми.",
        source: atAdmission,
      },
      {
        title: "Мова та підготовка",
        text: "Вимоги різняться. Наприклад, Universität Wien просить німецьку A2 для подання на німецькомовний бакалаврат і C1 для початку основного навчання.",
        source: univieLanguage,
      },
    ],
    living: "≈ €1 300",
    livingNote:
      "На місяць за орієнтиром OeAD. У Відні та інших великих містах витрати можуть бути вищими.",
    livingSource: {
      label: "OeAD · витрати на життя",
      url: "https://studyinaustria.at/en/live-and-work/living-costs",
    },
    tuition: "Залежить від закладу та статусу",
    tuitionNote:
      "Приклад Universität Wien: €726,72 за семестр + €26,20 студентського внеску ÖH для стандартного non-EU тарифу. Для громадян України навчальна плата на зимовий семестр 2026/27 скасована; ÖH залишається. Плату за підготовчі курси перевіряйте окремо.",
    tuitionSource: {
      label: "Universität Wien · плата й пільги",
      url: "https://studieren.univie.ac.at/en/tuition-fee/amount-tuition-fee/",
    },
    catalogue: {
      label: "Знайти програму в Австрії",
      url: "https://studyinaustria.at/en/plan-your-studies/find-your-programme",
    },
    catalogueNote:
      "Економіка та бізнес, технології, природничі й соціальні науки, мистецтво — порівняйте напрями в офіційному каталозі.",
    steps: [
      {
        title: "Оберіть програму",
        text: "Напрям, мова, місто й бюджет. Порівняйте зміст програм, а не лише назви університетів.",
      },
      {
        title: "Перевірте вимоги",
        text: "Освіта, мовний сертифікат, НМТ, вступні або додаткові іспити — за правилами конкретного набору.",
      },
      {
        title: "Підготуйте заяву",
        text: "Освітні документи, переклади та потрібне засвідчення. Строк подання й реєстрація на іспит можуть відрізнятися.",
      },
      {
        title: "Сплануйте переїзд",
        text: "Після рішення закладу уточніть підставу перебування, житло, страхування та фінансовий резерв.",
      },
    ],
    faq: [
      {
        question: "Чи потрібен НМТ для вступу?",
        answer:
          "Залежить від університету й набору. Universität Wien вводить вимогу НМТ для визначених категорій випускників українських шкіл із подання на літній семестр 2027. Рік випуску, предмети та чинність результатів перевірте за офіційними умовами.",
        source: {
          label: "Universität Wien · вимоги для України",
          url: "https://studieren.univie.ac.at/zulassung/infos-drittstaaten/",
        },
      },
      {
        question: "Чи можна навчатися англійською?",
        answer:
          "Так. Наприклад, WU має англомовний бакалаврат Business and Economics. Мовний сертифікат і процедура відбору залежать від програми; англійська не скасовує інших вимог до вступу.",
        source: {
          label: "WU · Business and Economics",
          url: "https://www.wu.ac.at/en/programs/bachelors-programs/business-and-economics/overview",
        },
      },
      {
        question: "Що таке підготовче відділення VWU?",
        answer:
          "Це підготовка до додаткових мовних або предметних іспитів, визначених у рішенні університету. Перехід на основне навчання відбувається після виконання всіх установлених умов.",
        source: {
          label: "Universität Wien · вступ і підготовка",
          url: "https://studieren.univie.ac.at/en/admission/bachelordiploma-programmes/zulassung/non-eueea-with-german/",
        },
      },
      {
        question: "Які документи та коли подавати?",
        answer:
          "Зазвичай потрібні паспорт, документ про освіту з додатком і підтвердження мови. Переклад, апостиль та додаткові матеріали залежать від процедури. Єдиного дедлайну для Австрії немає: окремо перевіряйте подання й реєстрацію на вступні випробування.",
        source: atAdmission,
      },
      {
        question: "Як знайти житло й підготуватися до переїзду?",
        answer:
          "Порівняйте гуртожитки, кімнату у спільній квартирі та окреме житло. Закладіть депозит і перші платежі, перевірте договір та почніть пошук завчасно. Вартість і доступність суттєво залежать від міста.",
        source: {
          label: "OeAD · житло",
          url: "https://studyinaustria.at/en/live-and-work/accomodation",
        },
      },
      {
        question: "Чи потрібна студентська віза або дозвіл?",
        answer:
          "Це залежить від громадянства та чинного статусу. Для студентського дозволу перевіряють зарахування, фінансування, житло та страхування. Тимчасовий захист — окрема підстава перебування зі своїми правилами.",
        source: atResidence,
      },
      {
        question: "Чи можна працювати під час навчання?",
        answer:
          "Для власників студентського дозволу роботодавець оформлює дозвіл через AMS. Робота до 20 годин на тиждень можлива без перевірки ринку праці. Якщо у вас інший статус перебування, правила можуть відрізнятися.",
        source: atResidence,
      },
      {
        question: "Чи є стипендії?",
        answer:
          "Так, але повне фінансування всієї програми трапляється рідко. Окремо перевіряйте критерії, дедлайни та покриття стипендії. Бюджет варто планувати без припущення, що її обов’язково нададуть.",
        source: {
          label: "OeAD · стипендії",
          url: "https://studyinaustria.at/en/plan-your-studies/scholarships-funding",
        },
      },
      {
        question: "Що потрібно для вступу на медицину?",
        answer:
          "Для першого вступу на медицину або стоматологію в державних медичних університетах потрібен MedAT. Для навчання необхідна німецька C1. Реєстрація та відбір мають окремі строки.",
        source: {
          label: "MedAT · офіційні умови",
          url: "https://www.medizinstudieren.at/allgemeine-informationen/information-in-english/",
        },
      },
      {
        question: "Що після закінчення університету?",
        answer:
          "Випускники зі студентським дозволом можуть подати заяву на продовження перебування на 12 місяців для пошуку роботи або започаткування бізнесу. Це окрема процедура з умовами, а не автоматичне працевлаштування.",
        source: atResidence,
      },
    ],
  },
  de: {
    name: "Німеччина",
    local: "Deutschland",
    caption: "Бакалаврат, магістратура та шлях через Studienkolleg.",
    image: "berlin-cathedral.jpg",
    alt: "Берлінський собор і Музейний острів, Німеччина",
    city: "Берлін, Німеччина",
    title: "Ваш вступ до Німеччини",
    intro:
      "Університети й виші прикладних наук, великі міста та студентські містечка. Ваш шлях починається з перевірки попередньої освіти та вимог програми.",
    paths: [
      {
        title: "Після школи",
        text: "Документ про освіту та попереднє навчання визначають право на вступ. Можливий прямий шлях або підготовка у Studienkolleg; рішення приймає університет.",
        source: deAdmission,
      },
      {
        title: "На магістратуру",
        text: "Перевіряють визнання попереднього ступеня, спорідненість спеціальності, предмети, оцінки й мову. Деякі програми мають додаткові вимоги.",
        source: {
          label: "uni-assist · магістратура",
          url: "https://www.uni-assist.de/en/how-to-apply/get-information/master/",
        },
      },
      {
        title: "Мова та підготовка",
        text: "Німецька чи англійська — за обраною програмою. Для Studienkolleg зазвичай потрібна німецька, навіть перед англомовним бакалавратом.",
        source: {
          label: "uni-assist · Studienkolleg",
          url: "https://www.uni-assist.de/en/how-to-apply/get-information/studienkolleg-preparatory-course/",
        },
      },
    ],
    living: "€900–1 200",
    livingNote:
      "На місяць за орієнтиром DAAD. Реальна сума залежить від міста й житла; в дорогих містах потрібно більше.",
    livingSource: {
      label: "DAAD · витрати",
      url: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/",
    },
    tuition: "Часто без навчальної плати",
    tuitionNote:
      "У багатьох державних закладах бакалаврат і більшість магістерських програм не мають навчальної плати. Семестровий внесок залишається. Окремі землі, заклади й програми стягують плату; приватні виші мають власні тарифи.",
    tuitionSource: {
      label: "DAAD · внески та винятки",
      url: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/",
    },
    catalogue: {
      label: "Знайти програму в Німеччині",
      url: "https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/",
    },
    catalogueNote:
      "Порівняйте університети й виші прикладних наук за спеціальністю, мовою та містом в офіційному каталозі DAAD.",
    steps: [
      {
        title: "Визначте свій шлях",
        text: "Перевірте документ про освіту: прямий вступ, Studienkolleg або магістратура після попереднього ступеня.",
      },
      {
        title: "Оберіть програму",
        text: "Звірте предмети, оцінки, мовні сертифікати та можливі вступні випробування.",
      },
      {
        title: "Подайте документи",
        text: "Напряму до закладу або через uni-assist — як указано на сайті університету. Починайте завчасно.",
      },
      {
        title: "Підготуйте переїзд",
        text: "Після зарахування перевірте житло, медичне страхування, фінансування й правила вашого статусу перебування.",
      },
    ],
    faq: [
      {
        question: "Чи достатньо українського атестата?",
        answer:
          "Єдиного правила для всіх документів немає. Враховують тип і рік отримання документа та попереднє навчання. Якщо прямий вступ недоступний, можливий шлях через Studienkolleg. Остаточне рішення приймає заклад.",
        source: deAdmission,
      },
      {
        question: "Що таке Studienkolleg?",
        answer:
          "Це підготовка за профілем майбутнього навчання, зазвичай на один рік, із підсумковим іспитом Feststellungsprüfung. Вступ часто передбачає німецьку та випробування; рівень і процедуру визначає заклад.",
        source: {
          label: "uni-assist · Studienkolleg",
          url: "https://www.uni-assist.de/en/how-to-apply/get-information/studienkolleg-preparatory-course/",
        },
      },
      {
        question: "Чи можна навчатися англійською?",
        answer:
          "Так, якщо обрана програма англомовна. Перевірте прийнятні сертифікати, бали й можливі додаткові вимоги до німецької. Для німецькомовних програм перевірте прийнятні сертифікати та потрібні результати саме вашої програми.",
        source: deLanguage,
      },
      {
        question: "Які документи готувати?",
        answer:
          "Документ про освіту, додаток з оцінками, підтвердження мови та академічні документи, якщо вже навчалися у виші. Для українських документів uni-assist вимагає оригінальну мову та переклад німецькою або англійською; звірте правила засвідчення.",
        source: {
          label: "uni-assist · документи з України",
          url: "https://www.uni-assist.de/tools/laenderhinweise/laenderdetails/country/ua/",
        },
      },
      {
        question: "Коли подаватися?",
        answer:
          "Часті дедлайни — 15 липня й 15 січня, але вони не універсальні: магістратура, Studienkolleg та окремі програми можуть мати інші строки. uni-assist радить подаватися щонайменше за вісім тижнів до дедлайну.",
        source: {
          label: "uni-assist · строки подання",
          url: "https://www.uni-assist.de/en/how-to-apply/plan-your-application/deadlines-processing-time/",
        },
      },
      {
        question: "Де шукати житло?",
        answer:
          "Гуртожиток, кімната у спільній квартирі або окрема квартира — основні варіанти. Житло не надається автоматично разом зі вступом. Почніть пошук завчасно та врахуйте депозит і попит у вашому місті.",
        source: {
          label: "DAAD · пошук житла",
          url: "https://www.daad.de/en/studying-in-germany/living-in-germany/renting/",
        },
      },
      {
        question: "Які правила перебування та роботи?",
        answer:
          "Студентський дозвіл і тимчасовий захист мають різні умови. Для студентського шляху потрібні підтвердження зарахування, фінансування та медичне страхування; робота дозволена в установлених межах. Перевірте вимоги саме вашого статусу.",
        source: deResidence,
      },
      {
        question: "Як бути, якщо вже маю тимчасовий захист?",
        answer:
          "Не переносіть автоматично правила студентської візи на свій статус. Перевірте чинність дозволу та умови навчання і праці за §24 на державному порталі й у відповідному відомстві.",
        source: {
          label: "Germany4Ukraine · перебування",
          url: "https://www.germany4ukraine.de/EN/einreise-aufenthalt-und-rueckkehr/ukraine-aufenthaltserlaubnis/seite_node.html",
        },
      },
      {
        question: "Чи є стипендії?",
        answer:
          "Так, із власними критеріями й строками. Багато програм DAAD орієнтовані на випускників, магістрантів і дослідників. Повне фінансування бакалаврату з першого семестру не варто вважати гарантованою частиною бюджету.",
        source: {
          label: "DAAD · стипендії",
          url: "https://www.daad.de/en/studying-in-germany/scholarships/daad-scholarships/",
        },
      },
      {
        question: "Чи можна залишитися після випуску?",
        answer:
          "За студентським маршрутом після успішного завершення навчання в Німеччині можна податися на дозвіл до 18 місяців для пошуку кваліфікованої роботи. Потрібно виконати чинні умови; сам диплом не є гарантією роботи.",
        source: deResidence,
      },
    ],
  },
};
