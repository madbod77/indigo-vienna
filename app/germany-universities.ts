export type CampusUniversity = {
  name: string;
  city: string;
  category: string;
  description: string;
  url: string;
  image: string;
  imageWidths: number[];
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  photo?: { source: string; author: string; license: string; licenseUrl: string };
};

// Nine owner-selected institutions. Official sources and photo licenses checked 2026-10-08.
export const germanUniversities: CampusUniversity[] = [
  {
    "name": "Freie Universität Berlin",
    "city": "Берлін",
    "category": "Класичний університет",
    "description": "Гуманітарні, соціальні та природничі науки",
    "url": "https://www.fu-berlin.de/en/studium/bewerbung/index.html",
    "image": "de-01-freie-universitaet-berlin",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 820,
    "imageAlt": "Кампус Freie Universität Berlin, Берлін",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Henry-Ford-Bau-Freie-Universitaet-Berlin-Dahlem-10-2018a.jpg",
      "author": "Gunnar Klack",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  {
    "name": "Technische Universität München",
    "city": "Мюнхен",
    "category": "Технології та інженерія",
    "description": "Інженерія, інформатика та природничі науки",
    "url": "https://www.tum.de/en/studies/application",
    "image": "de-02-technische-universitaet-muenchen",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 1072,
    "imageAlt": "Кампус Technische Universität München, Мюнхен",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Technische_Universit%C3%A4t_M%C3%BCnchen.jpg",
      "author": "AuHaidhausen",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  {
    "name": "Universität Hamburg",
    "city": "Гамбург",
    "category": "Класичний університет",
    "description": "Природничі й гуманітарні науки, економіка та право",
    "url": "https://www.uni-hamburg.de/en/campuscenter/bewerbung.html",
    "image": "de-03-universitaet-hamburg",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 900,
    "imageAlt": "Кампус Universität Hamburg, Гамбург",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Hauptgeb%C3%A4ude_Uni_Hamburg.jpg",
      "author": "Uwe Barghaan",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
    }
  },
  {
    "name": "Universität Leipzig",
    "city": "Лейпциг",
    "category": "Класичний університет",
    "description": "Мови, соціальні й природничі науки та медицина",
    "url": "https://www.uni-leipzig.de/en/international/studying-at-leipzig-university/application-and-preparing-to-study",
    "image": "de-04-universitaet-leipzig",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 960,
    "imageAlt": "Кампус Universität Leipzig, Лейпциг",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Leipzig_-_Augusteum_%26_Paulinum.jpg",
      "author": "Fred Romero from Paris, France",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
    }
  },
  {
    "name": "Technische Universität Dresden",
    "city": "Дрезден",
    "category": "Технології та інженерія",
    "description": "Інженерія, інформатика та природничі науки",
    "url": "https://tu-dresden.de/studium/vor-dem-studium/bewerbung/online-bewerbung?set_language=en",
    "image": "de-05-technische-universitaet-dresden",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 1128,
    "imageAlt": "Кампус Technische Universität Dresden, Дрезден",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:20090720060DR_Dresden_Beyerbau_TU_Dresden_George-B%C3%A4hr-Str.jpg",
      "author": "Jörg Blobelt",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  {
    "name": "Universität Bonn",
    "city": "Бонн",
    "category": "Класичний університет",
    "description": "Природничі, гуманітарні та соціальні науки",
    "url": "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/application-admission-and-enrollment",
    "image": "de-06-universitaet-bonn",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 518,
    "imageAlt": "Кампус Universität Bonn, Бонн",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Universit%C3%A4t_Bonn.jpg",
      "author": "Thomas Wolf (Der Wolf im Wald)",
      "license": "CC BY-SA 2.5",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
    }
  },
  {
    "name": "Universität Heidelberg",
    "city": "Гайдельберг",
    "category": "Класичний університет",
    "description": "Медицина, природничі та гуманітарні науки",
    "url": "https://www.uni-heidelberg.de/en/study/application-enrolment",
    "image": "de-07-universitaet-heidelberg",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 1080,
    "imageAlt": "Кампус Universität Heidelberg, Гайдельберг",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Neue_Universit%C3%A4t_Heidelberg.JPG",
      "author": "4028mdk09",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  {
    "name": "Humboldt-Universität zu Berlin",
    "city": "Берлін",
    "category": "Класичний університет",
    "description": "Гуманітарні, соціальні та природничі науки",
    "url": "https://www.studienplatz.hu-berlin.de/bewerbungscheck/index.xhtml",
    "image": "de-08-humboldt-universitaet-berlin",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 720,
    "imageAlt": "Кампус Humboldt-Universität zu Berlin, Берлін",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:Berlin-Mitte_Humboldt-Uni_05-2014.jpg",
      "author": "A.Savin",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  {
    "name": "RWTH Aachen University",
    "city": "Аахен",
    "category": "Технології та інженерія",
    "description": "Інженерія, інформатика та природничі науки",
    "url": "https://www.rwth-aachen.de/cms/root/studium/Vor-dem-Studium/~egg/Bewerbung-um-einen-Studienplatz/lidx/1/",
    "image": "de-09-rwth-aachen",
    "imageWidths": [
      480,
      800,
      1440
    ],
    "imageWidth": 1440,
    "imageHeight": 960,
    "imageAlt": "Кампус RWTH Aachen University, Аахен",
    "photo": {
      "source": "https://commons.wikimedia.org/wiki/File:RWTH_Aachen_Hauptgeb%C3%A4ude.jpg",
      "author": "א (Aleph)",
      "license": "CC BY-SA 2.5",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
    }
  }
];
