export const TOUR_DATA = {
  schoolName: 'НЦДПИиР',
  schoolFullName:
    'Национальный центр декоративно-прикладного искусства и ремёсел',
  tourTitle: 'Гид по центру',
  tourSubtitle: 'Виртуальный тур 360°',
  siteUrl: 'https://decorudm.ru/',
  panoramas: [
    // ── 1. Улица ──
    {
      id: 'street',
      order: 1,
      name: 'ул. В. Сивкова, 173',
      description: 'Вход в центр с улицы.',
      url: '/panoramas/street.jpg',
      hotspots: [
        {
          id: 'street-entrance',
          type: 'nav',
          name: 'Вход',
          yaw: '-14deg',
          pitch: '-13deg',
          targetId: 'salon',
        },
        {
          id: 'street-facade',
          type: 'exhibit',
          name: 'Здание',
          yaw: '298.2deg',
          pitch: '-5.8deg',
          exhibit: {
            label: 'Здание',
            title: 'Национальный центр декоративно-прикладного искусства и ремёсел',
            description:
              'Центр расположен в двухэтажном здании — купеческом доме Жерехова, построенном около 200 лет назад. С 1992 года здесь размещается Национальный центр декоративно-прикладного искусства и ремёсел.',
            image: '/images/museum-building.jpg',
            link: 'https://decorudm.ru/page73805897.html',
          },
        }
      ],
    },

    // ── 2. Выставочная зона ──
    {
      id: 'salon',
      order: 2,
      name: 'Салон',
      description: 'Главный зал — начало экспозиции.',
      url: '/panoramas/salon.jpg',
      hotspots: [
        {
          id: 'salon-tapestry',
          type: 'exhibit',
          name: 'Гобелен',
          yaw: '273.9deg',
          pitch: '3deg',
          exhibit: {
            title: 'Настенный гобелен',
            description:
              'Тканый гобелен с геометрическим орнаментом — образец народного декоративно-прикладного искусства Удмуртии.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-forward',
          type: 'nav',
          name: 'Выставочный зал',
          yaw: '319.3deg',
          pitch: '-24deg',
          targetId: 'salon-2',
        },
        {
          id: 'salon-to-street',
          type: 'nav',
          name: 'На улицу',
          yaw: '180deg',
          pitch: '-16deg',
          targetId: 'street',
        },
        {
          id: 'salon-to-dresses',
          type: 'nav',
          name: 'К платьям',
          yaw: '224deg',
          pitch: '-11.1deg',
          targetId: 'dresses',
        },
        {
          id: 'salon-exhibit-mqh3dca9',
          type: 'exhibit',
          name: 'Панно',
          yaw: '94.6deg',
          pitch: '25.9deg',
          exhibit: {
            title: 'Панно',
            description: 'Добавьте описание в редакторе.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-quiz-trigger',
          type: 'exhibit',
          name: 'Викторина',
          yaw: '224.8deg',
          pitch: '0.3deg',
          exhibit: {
            title: '',
            image: '',
          },
        }
      ],
    },

    // ── 3. Выставочный зал ──
    {
      id: 'salon-2',
      order: 3,
      name: 'Выставочный зал',
      description: 'Витрины и народные костюмы.',
      url: '/panoramas/salon-2.jpg',
      hotspots: [
        {
          id: 'salon2-tapestry',
          type: 'exhibit',
          name: 'Гобелен',
          yaw: '145.1deg',
          pitch: '3.6deg',
          exhibit: {
            title: 'Настенный гобелен',
            description: 'Крупный тканый гобелен с ромбовидным орнаментом на правой стене зала.',
            image: '/panoramas/salon-2.jpg',
          },
        },
        {
          id: 'salon2-forward',
          type: 'nav',
          name: 'Вперёд',
          yaw: '258.9deg',
          pitch: '-31deg',
          targetId: 'salon-3',
        },
        {
          id: 'salon2-back',
          type: 'nav',
          name: 'Назад',
          yaw: '52.6deg',
          pitch: '-38.5deg',
          targetId: 'salon',
        },
        {
          id: 'salon-2-exhibit-mqh3dr24',
          type: 'exhibit',
          name: 'Панно',
          yaw: '45.4deg',
          pitch: '12.4deg',
          exhibit: {
            title: 'Панно',
            description: 'Добавьте описание в редакторе.',
            image: '/panoramas/salon-2.jpg',
          },
        },
        {
          id: 'salon2-to-dresses',
          type: 'nav',
          name: 'Переход',
          yaw: '102.6deg',
          pitch: '-12.1deg',
          targetId: 'salon',
        }
      ],
    },

    // ── 4. Гостиная ──
    {
      id: 'salon-3',
      order: 4,
      name: 'Гостиная',
      description: 'Глубина выставочного зала.',
      url: '/panoramas/salon-3.jpg',
      hotspots: [
        {
          id: 'salon3-tapestry',
          type: 'exhibit',
          name: 'Гобелен',
          yaw: '130.5deg',
          pitch: '3.1deg',
          exhibit: {
            title: 'Гобелен и текстиль',
            description: 'Настенный гобелен и традиционные тканые полотна вдоль стены.',
            image: '/panoramas/salon-3.jpg',
          },
        },
        {
          id: 'salon3-back',
          type: 'nav',
          name: 'Назад',
          yaw: '80.5deg',
          pitch: '-28.9deg',
          targetId: 'salon-2',
        },
        {
          id: 'salon3-to-dresses',
          type: 'nav',
          name: 'Переход',
          yaw: '110.2deg',
          pitch: '-8.3deg',
          targetId: 'salon',
        }
      ],
    },

    // ── 5. Удм. платья ──
    {
      id: 'dresses',
      order: 5,
      name: 'Удм. платья',
      description: 'Зал традиционных костюмов.',
      url: '/panoramas/dresses.jpg',
      hotspots: [
        {
          id: 'dresses-pair-left',
          type: 'exhibit',
          name: 'Завятский',
          yaw: '258deg',
          pitch: '-8.7deg',
          exhibit: {
            title: 'Завятский',
            description: 'Мужской и женский праздничные костюмы с серебряными украшениями.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-center',
          type: 'exhibit',
          name: 'Калмезский',
          yaw: '316.3deg',
          pitch: '-5.3deg',
          exhibit: {
            title: 'Калмезский',
            description: 'Традиционное удмуртское платье с красно-белым орнаментом.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-pair-right',
          type: 'exhibit',
          name: 'Бесермянский',
          yaw: '65deg',
          pitch: '-3.2deg',
          exhibit: {
            title: 'Бесермянский',
            description: 'Комплект костюмов с дендорами и серебряными нагрудными украшениями.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-to-art-processing',
          type: 'nav',
          name: 'Береста и солома',
          yaw: '105.6deg',
          pitch: '-9.2deg',
          targetId: 'art-processing',
        },
        {
          id: 'dresses-to-painting',
          type: 'nav',
          name: 'Роспись',
          yaw: '148.6deg',
          pitch: '1.3deg',
          targetId: 'painting',
        },
        {
          id: 'dresses-to-weaving',
          type: 'nav',
          name: 'Ткачество',
          yaw: '148.5deg',
          pitch: '-8.8deg',
          targetId: 'weaving',
        },
        {
          id: 'dresses-to-music',
          type: 'nav',
          name: 'Муз. инструменты',
          yaw: '172.2deg',
          pitch: '-5.3deg',
          targetId: 'music',
        },
        {
          id: 'dresses-nav-mqh3t572',
          type: 'nav',
          name: 'Шитьё удм. платьев',
          yaw: '207.8deg',
          pitch: '-7.7deg',
          targetId: 'sewing',
        },
        {
          id: 'dresses-to-textile',
          type: 'nav',
          name: 'Худ. текстиль',
          yaw: '281.3deg',
          pitch: '-6.1deg',
          targetId: 'art-textile',
        },
        {
          id: 'dresses-to-salon',
          type: 'nav',
          name: 'Выставочный зал',
          yaw: '345.2deg',
          pitch: '-11.4deg',
          targetId: 'salon',
        },
        {
          id: 'dresses-exhibit-mqif2xyp',
          type: 'exhibit',
          name: 'Южноудмуртский',
          yaw: '234.7deg',
          pitch: '-7deg',
          exhibit: {
            title: 'Южноудмуртский',
            description: 'Добавьте описание в редакторе.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-exhibit-mqif344a',
          type: 'exhibit',
          name: 'Бавлинский',
          yaw: '45.8deg',
          pitch: '-1.9deg',
          exhibit: {
            title: 'Бавлинский',
            description: 'Добавьте описание в редакторе.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-exhibit-mqif35pu',
          type: 'exhibit',
          name: 'Шарканско-якшур-бодьинский',
          yaw: '26.9deg',
          pitch: '-4.4deg',
          exhibit: {
            title: 'Шарканско-якшур-бодьинский',
            description: 'Добавьте описание в редакторе.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-exhibit-mqif3dac',
          type: 'exhibit',
          name: 'Закамский',
          yaw: '135.6deg',
          pitch: '-8.1deg',
          exhibit: {
            title: 'Закамский',
            description: 'Добавьте описание в редакторе.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-quiz-trigger',
          type: 'exhibit',
          name: 'Викторина',
          yaw: '159.9deg',
          pitch: '-2.9deg',
          exhibit: {
            title: '',
            image: '',
          },
        }
      ],
    },

    // ── 6. Ткачество ──
    {
      id: 'weaving',
      order: 6,
      name: 'Ткачество',
      description: 'Мастерская ткачества.',
      url: '/panoramas/weaving.jpg',
      hotspots: [
        {
          id: 'weaving-looms',
          type: 'exhibit',
          name: 'Станки',
          yaw: '234.1deg',
          pitch: '-20.4deg',
          exhibit: {
            title: 'Ткацкие станки',
            description:
              'Деревянные ткацкие станки — традиционное оборудование для ручного ткачества.',
            image: '/panoramas/weaving.jpg',
          },
        },
        {
          id: 'weaving-yarn',
          type: 'exhibit',
          name: 'Пряжа',
          yaw: '73.9deg',
          pitch: '7.6deg',
          exhibit: {
            title: 'Пряжа и материалы',
            description: 'Полки с катушками пряжи разных цветов для ткачества.',
            image: '/panoramas/weaving.jpg',
          },
        },
        {
          id: 'weaving-to-dresses',
          type: 'nav',
          name: 'Платья',
          yaw: '98.4deg',
          pitch: '-20.3deg',
          targetId: 'dresses',
        },
        {
          id: 'weaving-quiz-trigger',
          type: 'exhibit',
          name: 'Викторина',
          yaw: '260.5deg',
          pitch: '-12.6deg',
          exhibit: {
            title: '',
            image: '',
          },
        }
      ],
    },

    // ── 7. Роспись ──
    {
      id: 'painting',
      order: 7,
      name: 'Роспись',
      description: 'Мастерская народной росписи.',
      url: '/panoramas/painting.jpg',
      hotspots: [
        {
          id: 'painting-matryoshka',
          type: 'exhibit',
          name: 'Матрёшки',
          yaw: '196.4deg',
          pitch: '-26.8deg',
          exhibit: {
            title: 'Роспись матрёшек',
            description: 'Мастерская росписи деревянных матрёшек — традиционный народный промысел.',
            image: '/panoramas/painting.jpg',
          },
        },
        {
          id: 'painting-desk',
          type: 'exhibit',
          name: 'Мольберт',
          yaw: '315.4deg',
          pitch: '-20.8deg',
          exhibit: {
            title: 'Рабочее место художника',
            description: 'Стол с красками, кистями и образцами орнаментов для росписи.',
            image: '/panoramas/painting.jpg',
          },
        },
        {
          id: 'painting-to-dresses',
          type: 'nav',
          name: 'Платья',
          yaw: '111.7deg',
          pitch: '-5.5deg',
          targetId: 'dresses',
        },
        {
          id: 'painting-quiz-trigger',
          type: 'exhibit',
          name: 'Викторина',
          yaw: '324.1deg',
          pitch: '2.6deg',
          exhibit: {
            title: '',
            image: '',
          },
        }
      ],
    },

    // ── 8. Береста и солома ──
    {
      id: 'art-processing',
      order: 8,
      name: 'Береста и солома',
      description: 'Мастерская художественной обработки бересты и соломы.',
      url: '/panoramas/art-processing.jpg',
      hotspots: [
        {
          id: 'art-straw',
          type: 'exhibit',
          name: 'Соломка',
          yaw: '338deg',
          pitch: '-19.4deg',
          exhibit: {
            title: 'Изделия из соломы',
            description:
              'Соломенные венки и плетёные работы — традиционная художественная обработка природных материалов.',
            image: '/panoramas/art-processing.jpg',
          },
        },
        {
          id: 'art-dolls',
          type: 'exhibit',
          name: 'Куклы',
          yaw: '25.7deg',
          pitch: '-0.8deg',
          exhibit: {
            title: 'Традиционные куклы',
            description: 'Коллекция народных кукол в стеллажах мастерской.',
            image: '/panoramas/art-processing.jpg',
          },
        },
        {
          id: 'art-table',
          type: 'exhibit',
          name: 'Береста',
          yaw: '284.5deg',
          pitch: '-22.7deg',
          exhibit: {
            title: 'Обработка бересты',
            description:
              'Береста – ключевой природный материал удмуртских ремёсел. Из неё делают туеса, шкатулки, короба, солонки, лапти и современные аксессуары. Главное изделие – туес (круглый сосуд с деревянным дном и крышкой). В мастерской применяют тиснение по орнаментам, плетение из лент, замковые соединения, а также сочетают с ткачеством, вышивкой и росписью по дереву. Здесь проводятся мастер-классы, в том числе «Массажер из бересты» и «Шаркунок».',
            image: '/assets/scenario/image11.png',
            link: 'https://vk.com/wall-63098578_9408',
          },
        },
        {
          id: 'art-to-dresses',
          type: 'nav',
          name: 'Платья',
          yaw: '143.7deg',
          pitch: '-13.5deg',
          targetId: 'dresses',
        },
        {
          id: 'art-processing-quiz-trigger',
          type: 'exhibit',
          name: 'Викторина',
          yaw: '306.8deg',
          pitch: '-13deg',
          exhibit: {
            title: '',
            image: '',
          },
        }
      ],
    },

    // ── 9. Шитьё удм. платьев ──
    {
      id: 'sewing',
      order: 9,
      name: 'Шитьё удм. платьев',
      description: 'Мастерская шитья удмуртских платьев.',
      url: '/panoramas/sewing.jpg',
      hotspots: [
        {
          id: 'sewing-machine',
          type: 'exhibit',
          name: 'Шитьё',
          yaw: '66.9deg',
          pitch: '-13.8deg',
          exhibit: {
            title: 'Мастерская по шитью удмуртских костюмов',
            description:
              'В этом отделе мастера шьют традиционные и современные интерпретации удмуртской одежды. Используют аутентичные технологии кроя, вышивки, украшения монистами и монетами. Восстанавливают забытые элементы костюма по этнографическим образцам.',
            image: '/panoramas/sewing.jpg',
            link: 'https://vk.com/album-63098578_303174350',
          },
        },
        {
          id: 'sewing-to-dresses',
          type: 'nav',
          name: 'Платья',
          yaw: '207deg',
          pitch: '-21.8deg',
          targetId: 'dresses',
        }
      ],
    },

    // ── 10. Муз. инструменты ──
    {
      id: 'music',
      order: 10,
      name: 'Муз. инструменты',
      description: 'Мастерская изготовления музыкальных инструментов.',
      url: '/panoramas/music.jpg',
      hotspots: [
        {
          id: 'music-hall-info',
          type: 'exhibit',
          name: 'О зале',
          yaw: '60deg',
          pitch: '-39deg',
          exhibit: {
            title: 'Мастерская музыкальных инструментов',
            description:
              'В этой мастерской восстанавливают и создают традиционные удмуртские музыкальные инструменты. Удмуртская музыкальная культура имеет глубокие корни – первые упоминания о некоторых инструментах встречаются в научных трудах XIX века.',
            image: '/panoramas/music.jpg',
          },
        },
        {
          id: 'music-to-dresses',
          type: 'nav',
          name: 'Платья',
          yaw: '179.4deg',
          pitch: '-10.3deg',
          targetId: 'dresses',
        },
        {
          id: 'music-exhibit-mqld4szg',
          type: 'exhibit',
          name: 'Post-dukes',
          yaw: '260.9deg',
          pitch: '-4.3deg',
          exhibit: {
            title: 'Post-dukes',
            description:
              'Post-dukes – удмуртская музыкальная группа из Ижевска, основанная художником и музыкантом Чудья Жени (Евгением Бикузиным) в 2017 году. Жанр музыки — фолктроника, хотя с 2022 года группа выпускает и аутентичную фолк-музыку на удмуртском языке. Название состоит из двух слов: «после» (англ. post) и отсылает к старинной одежде удмуртов дукес, а также к предыдущему проекту Чудья Жени — группе «Дукес», исполнявшей народные песни под аккомпанемент кубыза.',
            image: '/panoramas/music.jpg',
          },
        }
      ],
    },

    // ── 11. Худ. текстиль ──
    {
      id: 'art-textile',
      order: 11,
      name: 'Худ. текстиль',
      description: 'Мастерская художественного текстиля.',
      url: '/panoramas/art-textile.jpg',
      hotspots: [
        {
          id: 'textile-loom',
          type: 'exhibit',
          name: 'Текстиль',
          yaw: '300.7deg',
          pitch: '-1.6deg',
          exhibit: {
            title: 'Текстиль',
            description:
              'Ткацкие работы и текстильные образцы в мастерской художественного текстиля.',
            image: '/panoramas/art-textile.jpg',
          },
        },
        {
          id: 'textile-to-dresses',
          type: 'nav',
          name: 'Платья',
          yaw: '166.1deg',
          pitch: '-7deg',
          targetId: 'dresses',
        },
        {
          id: 'art-textile-quiz-trigger',
          type: 'exhibit',
          name: 'Викторина',
          yaw: '76.9deg',
          pitch: '-25.8deg',
          exhibit: {
            title: '',
            image: '',
          },
        }
      ],
    }
  ],
};

export function countExhibits(panoramas) {
  return panoramas.reduce(
    (sum, p) =>
      sum + (p.hotspots?.filter((h) => h.type === 'exhibit').length || 0),
    0
  );
}

export function countExhibitsInPanorama(panorama) {
  return panorama.hotspots?.filter((h) => h.type === 'exhibit').length || 0;
}
