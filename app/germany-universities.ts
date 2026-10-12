export type CampusUniversity = {
  name: string;
  city: string;
  category: string;
  description: string;
  url: string;
  image: string;
  imageFile?: string;
  imageWidths: number[];
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  photo?: { source?: string; author?: string; publisher?: string; credit?: string; license?: string; licenseUrl?: string };
};

// Nine owner-selected institutions. Exact Sonya reference photos recovered 2026-10-11.
export const germanUniversities: CampusUniversity[] = [
  {
    "name": "Freie Universität Berlin",
    "city": "Берлін",
    "category": "Класичний університет",
    "description": "Гуманітарні, соціальні та природничі науки",
    "url": "https://www.fu-berlin.de/en/studium/bewerbung/index.html",
    "image": "de-01-freie-universitaet-berlin",
    "imageWidths": [],
    "imageWidth": 4256,
    "imageHeight": 2832,
    "imageAlt": "Філологічна бібліотека Freie Universität Berlin",
    "photo": {
      "source": "https://www.fu-berlin.de/en/presse/service/bildarchiv/index.html",
      "author": "David Ausserhofer",
      "publisher": "Freie Universität Berlin"
    },
    "imageFile": "de-01-freie-universitaet-berlin-reference.jpg"
  },
  {
    "name": "Technische Universität München",
    "city": "Мюнхен",
    "category": "Технології та інженерія",
    "description": "Інженерія, інформатика та природничі науки",
    "url": "https://www.tum.de/en/studies/application",
    "image": "de-02-technische-universitaet-muenchen",
    "imageWidths": [],
    "imageWidth": 3000,
    "imageHeight": 2143,
    "imageAlt": "LABCAMPUS — місце роботи TUM Convergence Center, Мюнхен",
    "photo": {
      "source": "https://www.kcap.eu/media/uploads/LAB48_LAB52_North.jpg",
      "author": "Aldo Amoretti",
      "publisher": "KCAP"
    },
    "imageFile": "de-02-technische-universitaet-muenchen-reference.jpg"
  },
  {
    "name": "Universität Hamburg",
    "city": "Гамбург",
    "category": "Класичний університет",
    "description": "Природничі й гуманітарні науки, економіка та право",
    "url": "https://www.uni-hamburg.de/en/campuscenter/bewerbung.html",
    "image": "de-03-universitaet-hamburg",
    "imageWidths": [],
    "imageWidth": 768,
    "imageHeight": 512,
    "imageAlt": "Головна будівля Universität Hamburg",
    "photo": {
      "source": "https://www.uni-assist.de/fileadmin/_processed_/3/e/csm_uni-hamburg_Julian_Denstorf_9cc5038034.jpg",
      "author": "Julian Denstorf",
      "publisher": "uni-assist"
    },
    "imageFile": "de-03-universitaet-hamburg-reference.jpg"
  },
  {
    "name": "Universität Leipzig",
    "city": "Лейпциг",
    "category": "Класичний університет",
    "description": "Мови, соціальні й природничі науки та медицина",
    "url": "https://www.uni-leipzig.de/en/international/studying-at-leipzig-university/application-and-preparing-to-study",
    "image": "de-04-universitaet-leipzig",
    "imageWidths": [],
    "imageWidth": 1280,
    "imageHeight": 854,
    "imageAlt": "Augusteum і Paulinum Universität Leipzig",
    "photo": {
      "source": "https://www.wifa.uni-leipzig.de/fileadmin/ul/Fotos/2017_Campus-AP_OO3A3835_UL.jpg",
      "author": "Swen Reichhold",
      "publisher": "Universität Leipzig"
    },
    "imageFile": "de-04-universitaet-leipzig-reference.jpg"
  },
  {
    "name": "Technische Universität Dresden",
    "city": "Дрезден",
    "category": "Технології та інженерія",
    "description": "Інженерія, інформатика та природничі науки",
    "url": "https://tu-dresden.de/studium/vor-dem-studium/bewerbung/online-bewerbung?set_language=en",
    "image": "de-05-technische-universitaet-dresden",
    "imageWidths": [],
    "imageWidth": 3000,
    "imageHeight": 2001,
    "imageAlt": "Двір Fritz-Foerster-Bau, Technische Universität Dresden",
    "photo": {
      "source": "https://www.jaeger-ausbau.de/highlights/foerster-bau_referenzprojekt_tischlerei-dresden",
      "author": "Siegfried Michael Wagner",
      "publisher": "Jaeger"
    },
    "imageFile": "de-05-technische-universitaet-dresden-reference.jpg"
  },
  {
    "name": "Universität Bonn",
    "city": "Бонн",
    "category": "Класичний університет",
    "description": "Природничі, гуманітарні та соціальні науки",
    "url": "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/application-admission-and-enrollment",
    "image": "de-06-universitaet-bonn",
    "imageWidths": [],
    "imageWidth": 2126,
    "imageHeight": 1548,
    "imageAlt": "Головна будівля Universität Bonn у вечірній час",
    "photo": {
      "source": "https://www.uni-bonn.de/en/news/university-of-bonn-improves-further-in-shanghai-ranking",
      "author": "Volker Lannert",
      "publisher": "University of Bonn"
    },
    "imageFile": "de-06-universitaet-bonn-reference.webp"
  },
  {
    "name": "Universität Heidelberg",
    "city": "Гайдельберг",
    "category": "Класичний університет",
    "description": "Медицина, природничі та гуманітарні науки",
    "url": "https://www.uni-heidelberg.de/en/study/application-enrolment",
    "image": "de-07-universitaet-heidelberg",
    "imageWidths": [],
    "imageWidth": 2068,
    "imageHeight": 1680,
    "imageAlt": "Університетська бібліотека Universität Heidelberg",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Heidelberg_Universit%C3%A4tsbibliothek_2003_b.jpg",
      "author": "Jan Beckendorf; Georgfotoart (експозиція та контраст)",
      "publisher": "Wikimedia Commons",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
    },
    "imageFile": "de-07-universitaet-heidelberg-reference.jpg"
  },
  {
    "name": "Humboldt-Universität zu Berlin",
    "city": "Берлін",
    "category": "Класичний університет",
    "description": "Гуманітарні, соціальні та природничі науки",
    "url": "https://www.studienplatz.hu-berlin.de/bewerbungscheck/index.xhtml",
    "image": "de-08-humboldt-universitaet-berlin",
    "imageWidths": [],
    "imageWidth": 1000,
    "imageHeight": 667,
    "imageAlt": "Alte Bibliothek — юридичний факультет Humboldt-Universität zu Berlin на Бебельплац",
    "photo": {
      "credit": "Фото надане власником"
    },
    "imageFile": "de-08-humboldt-universitaet-berlin-reference.jpg"
  },
  {
    "name": "RWTH Aachen University",
    "city": "Аахен",
    "category": "Технології та інженерія",
    "description": "Інженерія, інформатика та природничі науки",
    "url": "https://www.rwth-aachen.de/cms/root/studium/Vor-dem-Studium/~egg/Bewerbung-um-einen-Studienplatz/lidx/1/",
    "image": "de-09-rwth-aachen",
    "imageWidths": [],
    "imageWidth": 1200,
    "imageHeight": 1600,
    "imageAlt": "Будівля SuperC, RWTH Aachen University",
    "photo": {
      "credit": "Фото надане власником"
    },
    "imageFile": "de-09-rwth-aachen-reference.jpg"
  }
];
