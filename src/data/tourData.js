export const TOUR_DATA = {
  schoolName: 'НЦДПИиР',
  schoolFullName:
    'Национальный центр декоративно-прикладного искусства и ремёсел',
  tourTitle: 'Гид по центру',
  tourSubtitle: 'Виртуальный тур 360°',
  siteUrl: 'https://decorudm.ru/',
  panoramas: [
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
              'Центр расположен в двухэтажном здании — купеческом доме Жерехова, построенном около 200 лет назад. С 1992 года здесь размещается Национальный центр декоративно-прикладного искусства и ремёсел. Здание признано памятником архитектуры местного значения.',
            image: '/images/museum-building.jpg',
            link: 'https://decorudm.ru/page73805897.html',
          },
        },
      ],
    },
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
              'Коллекция русских народных костюмов в стеклянной витрине — образцы традиционного текстиля, вышивки и элементов праздничного убора.',
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
              'Тканый гобелен с геометрическим орнаментом в традиционной цветовой гамме — образец народного декоративно-прикладного искусства Удмуртии.',
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
              'Сборная экспозиция в центральных витринах: керамические изделия, деревянные поделки и текстильные работы.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-wall-art',
          type: 'exhibit',
          name: 'Панно',
          yaw: '110deg',
          pitch: '32deg',
          exhibit: {
            title: 'Настенные панно',
            description:
              'Серия декоративных панно в народном стиле над витринами вдоль правой стены зала.',
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
              'Длинный ряд витрин с подарочными изделиям из удмуртской керамики и дерева.',
            image: '/panoramas/salon.jpg',
          },
        },
        {
          id: 'salon-to-dresses',
          type: 'nav',
          name: 'К платьям',
          yaw: '-135deg',
          pitch: '-10deg',
          targetId: 'dresses',
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
    {
      id: 'dresses',
      order: 3,
      name: 'Удм. платья',
      description: 'Зал традиционных костюмов.',
      url: '/panoramas/dresses.jpg',
      hotspots: [
        {
          id: 'dresses-case-left',
          type: 'exhibit',
          name: 'Витрина',
          yaw: '-135deg',
          pitch: '-24deg',
          exhibit: {
            title: 'Витрина с аксессуарами',
            description:
              'Стеклянная витрина с украшениями и мелкими предметами традиционного быта.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-pair-left',
          type: 'exhibit',
          name: 'Костюмы',
          yaw: '-100deg',
          pitch: '-7deg',
          exhibit: {
            title: 'Парные костюмы',
            description:
              'Мужской и женский праздничные костюмы с серебряными украшениями и вышитыми головными уборами.',
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
              'Традиционное удмуртское платье с красно-белым орнаментом на фоне деревянной стеновой панели.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-chest',
          type: 'exhibit',
          name: 'Сундук',
          yaw: '-55deg',
          pitch: '-22deg',
          exhibit: {
            title: 'Деревянный сундук',
            description:
              'Расписной деревянный сундук — традиционный предмет домашнего обихода удмуртских семей.',
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
              'Комплект костюмов с дендорами и серебряными нагрудными украшениями на фоне коврового панно.',
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
            description:
              'Витрина с текстильными изделиями и бижутерией в правой части зала.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-costume-far',
          type: 'exhibit',
          name: 'Костюм',
          yaw: '135deg',
          pitch: '-8deg',
          exhibit: {
            title: 'Мужской костюм',
            description:
              'Традиционный мужской костюм с красной вышивкой у дверного проёма.',
            image: '/panoramas/dresses.jpg',
          },
        },
        {
          id: 'dresses-to-salon',
          type: 'nav',
          name: 'В салон',
          yaw: '-370deg',
          pitch: '-15deg',
          targetId: 'salon',
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
