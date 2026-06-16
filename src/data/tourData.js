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
          yaw: '-62deg',
          pitch: '-8deg',
          exhibit: {
            label: 'Здание',
            title:
              'Национальный центр декоративно-прикладного искусства и ремёсел',
            description:
              'Центр расположен в двухэтажном здании — купеческом доме Жерехова, построенном около 200 лет назад. С 1992 года здесь размещается Национальный центр декоративно-прикладного искусства и ремёсел.',
            image: '/images/museum-building.jpg',
            link: 'https://decorudm.ru/page73805897.html',
          },
        },
      ],
    },

    // ── 2. Салон (начало) ──
    {
      id: 'salon',
      order: 2,
      name: 'Салон',
      description: 'Главный зал — начало экспозиции.',
      url: '/panoramas/salon.jpg',
      hotspots: [
        {
          id: 'salon-case-left',
          type: 'exhibit',
          name: 'Наряды',
          yaw: '-50deg',
          pitch: '-5deg',
          exhibit: {
            title: 'Русские народные наряды',
            description:
              'Коллекция русских народных костюмов в стеклянной витрине.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-tapestry',
          type: 'exhibit',
          name: 'Гобелен',
          yaw: '-88deg',
          pitch: '-2deg',
          exhibit: {
            title: 'Настенный гобелен',
            description:
              'Тканый гобелен с геометрическим орнаментом — образец народного декоративно-прикладного искусства Удмуртии.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-figurines',
          type: 'exhibit',
          name: 'Фигурки',
          yaw: '-98deg',
          pitch: '-2deg',
          exhibit: {
            title: 'Традиционные удмуртские фигурки',
            description:
              'Фигурки в тематических удмуртских нарядах — миниатюрные скульптурные образы.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-cases-center',
          type: 'exhibit',
          name: 'Керамика',
          yaw: '22deg',
          pitch: '-11deg',
          exhibit: {
            title: 'Керамика и дерево',
            description:
              'Сборная экспозиция в центральных витринах: керамика, деревянные поделки и текстиль.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-cases-right',
          type: 'exhibit',
          name: 'Витрины',
          yaw: '132deg',
          pitch: '-10deg',
          exhibit: {
            title: 'Экспозиция вдоль стены',
            description:
              'Длинный ряд витрин с подарочными изделиями из удмуртской керамики и дерева.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-forward',
          type: 'nav',
          name: 'Вперёд',
          yaw: '12deg',
          pitch: '-12deg',
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
      ],
    },

    // ── 3. Салон (глубже) ──
    {
      id: 'salon-2',
      order: 3,
      name: 'Салон',
      description: 'Витрины и народные костюмы.',
      url: '/panoramas/salon-2.jpg',
      hotspots: [
        {
          id: 'salon2-dresses-rack',
          type: 'exhibit',
          name: 'Костюмы',
          yaw: '-120deg',
          pitch: '-6deg',
          exhibit: {
            title: 'Народные костюмы',
            description:
              'Стойка с традиционными костюмами и платьями — образцы народного текстиля.',
            image: '/panoramas/salon-2.jpg',
          },
        },
        {
          id: 'salon2-tapestry',
          type: 'exhibit',
          name: 'Гобелен',
          yaw: '95deg',
          pitch: '2deg',
          exhibit: {
            title: 'Настенный гобелен',
            description:
              'Крупный тканый гобелен с ромбовидным орнаментом на правой стене зала.',
            image: '/panoramas/salon-2.jpg',
          },
        },
        {
          id: 'salon2-cases',
          type: 'exhibit',
          name: 'Витрины',
          yaw: '-20deg',
          pitch: '-10deg',
          exhibit: {
            title: 'Центральные витрины',
            description:
              'Стеклянные витрины с керамикой, деревянными изделиями и сувенирами.',
            image: '/panoramas/salon-2.jpg',
          },
        },
        {
          id: 'salon2-forward',
          type: 'nav',
          name: 'Вперёд',
          yaw: '5deg',
          pitch: '-14deg',
          targetId: 'salon-3',
        },
        {
          id: 'salon2-back',
          type: 'nav',
          name: 'Назад',
          yaw: '175deg',
          pitch: '-14deg',
          targetId: 'salon',
        },
        {
          id: 'salon2-to-dresses',
          type: 'nav',
          name: 'К платьям',
          yaw: '-90deg',
          pitch: '-12deg',
          targetId: 'dresses',
        },
      ],
    },

    // ── 4. Салон (дальше) ──
    {
      id: 'salon-3',
      order: 4,
      name: 'Салон',
      description: 'Глубина зала — витрины и переходы.',
      url: '/panoramas/salon-3.jpg',
      hotspots: [
        {
          id: 'salon3-vitrines',
          type: 'exhibit',
          name: 'Витрины',
          yaw: '-30deg',
          pitch: '-10deg',
          exhibit: {
            title: 'Витрины в глубине зала',
            description:
              'Ряд стеклянных витрин с народными промыслами и сувенирной продукцией.',
            image: '/panoramas/salon-3.jpg',
          },
        },
        {
          id: 'salon3-tapestry',
          type: 'exhibit',
          name: 'Гобелен',
          yaw: '110deg',
          pitch: '0deg',
          exhibit: {
            title: 'Гобелен и текстиль',
            description:
              'Настенный гобелен и традиционные тканые полотна вдоль стены.',
            image: '/panoramas/salon-3.jpg',
          },
        },
        {
          id: 'salon3-back',
          type: 'nav',
          name: 'Назад',
          yaw: '178deg',
          pitch: '-14deg',
          targetId: 'salon-2',
        },
        {
          id: 'salon3-to-dresses',
          type: 'nav',
          name: 'К платьям',
          yaw: '88deg',
          pitch: '-12deg',
          targetId: 'dresses',
        },
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
          name: 'Костюмы',
          yaw: '-100deg',
          pitch: '-7deg',
          exhibit: {
            title: 'Парные костюмы',
            description:
              'Мужской и женский праздничные костюмы с серебряными украшениями.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-center',
          type: 'exhibit',
          name: 'Платье',
          yaw: '-45deg',
          pitch: '-6deg',
          exhibit: {
            title: 'Женский костюм',
            description:
              'Традиционное удмуртское платье с красно-белым орнаментом.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-pair-right',
          type: 'exhibit',
          name: 'Манекены',
          yaw: '42deg',
          pitch: '-7deg',
          exhibit: {
            title: 'Праздничные наряды',
            description:
              'Комплект костюмов с дендорами и серебряными нагрудными украшениями.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-case-right',
          type: 'exhibit',
          name: 'Витрина',
          yaw: '85deg',
          pitch: '-15deg',
          exhibit: {
            title: 'Текстиль и украшения',
            description: 'Витрина с текстильными изделиями и бижутерией.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-to-weaving',
          type: 'nav',
          name: 'Ткачество',
          yaw: '0deg',
          pitch: '-14deg',
          targetId: 'weaving',
        },
        {
          id: 'dresses-to-painting',
          type: 'nav',
          name: 'Роспись',
          yaw: '130deg',
          pitch: '-12deg',
          targetId: 'painting',
        },
        {
          id: 'dresses-to-salon',
          type: 'nav',
          name: 'В салон',
          yaw: '178deg',
          pitch: '-15deg',
          targetId: 'salon-3',
        },
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
          yaw: '-30deg',
          pitch: '-8deg',
          exhibit: {
            title: 'Ткацкие станки',
            description:
              'Деревянные ткацкие станки — традиционное оборудование для ручного ткачества.',
            image: '/panoramas/weaving.jpg',
          },
        },
        {
          id: 'weaving-tapestry',
          type: 'exhibit',
          name: 'Гобелен',
          yaw: '-110deg',
          pitch: '-3deg',
          exhibit: {
            title: 'Настенный гобелен',
            description:
              'Тканый гобелен с геометрическим орнаментом на стене мастерской.',
            image: '/panoramas/weaving.jpg',
          },
        },
        {
          id: 'weaving-yarn',
          type: 'exhibit',
          name: 'Пряжа',
          yaw: '75deg',
          pitch: '-5deg',
          exhibit: {
            title: 'Пряжа и материалы',
            description:
              'Полки с катушками пряжи разных цветов для ткачества.',
            image: '/panoramas/weaving.jpg',
          },
        },
        {
          id: 'weaving-to-dresses',
          type: 'nav',
          name: 'К платьям',
          yaw: '92deg',
          pitch: '-14deg',
          targetId: 'dresses',
        },
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
          yaw: '-75deg',
          pitch: '-6deg',
          exhibit: {
            title: 'Роспись матрёшек',
            description:
              'Мастерская росписи деревянных матрёшек — традиционный народный промысел.',
            image: '/panoramas/painting.jpg',
          },
        },
        {
          id: 'painting-desk',
          type: 'exhibit',
          name: 'Мольберт',
          yaw: '15deg',
          pitch: '-10deg',
          exhibit: {
            title: 'Рабочее место художника',
            description:
              'Стол с красками, кистями и образцами орнаментов для росписи.',
            image: '/panoramas/painting.jpg',
          },
        },
        {
          id: 'painting-tapestry',
          type: 'exhibit',
          name: 'Панно',
          yaw: '40deg',
          pitch: '5deg',
          exhibit: {
            title: 'Настенное панно',
            description:
              'Тканый орнамент на стене мастерской — образец для росписи.',
            image: '/panoramas/painting.jpg',
          },
        },
        {
          id: 'painting-to-dresses',
          type: 'nav',
          name: 'К платьям',
          yaw: '95deg',
          pitch: '-14deg',
          targetId: 'dresses',
        },
      ],
    },
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
