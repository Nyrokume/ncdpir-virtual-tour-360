import {
  SALON_ZONE_MAP,
  VK_MASTERCLASS_URL,
  VK_SEWING_URL,
  SCENARIO_META,
  SCENARIO_STEPS,
} from './scenarioData';
import { COSTUME_DETAILS, COSTUME_EXHIBITS } from './costumeDetails';

const HALL_INFO = {
  'art-processing': {
    'art-table': {
      title: 'Обработка бересты',
      description:
        'Береста – ключевой природный материал удмуртских ремёсел. Из неё делают туеса, шкатулки, короба, солонки, лапти и современные аксессуары. Главное изделие – туес (круглый сосуд с деревянным дном и крышкой). В мастерской применяют тиснение по орнаментам, плетение из лент, замковые соединения, а также сочетают с ткачеством, вышивкой и росписью по дереву. Здесь проводятся мастер-классы, в том числе «Массажер из бересты» и «Шаркунок».',
      image: '/assets/scenario/image11.png',
      link: VK_MASTERCLASS_URL,
    },
    'art-straw': {
      title: 'Стол с соломой',
      description:
        'Один из развиваемых в Удмуртии видов ремёсел. Сегодня мастера создают из неё панно, подвесные украшения и сувениры. Заготовка сырья в Удмуртии проходит в конце июля – начале августа: стебли срезают серпом и сушат в снопиках. Среди мастер-классов по соломке особое место занимает изготовление «Соломенной куклы «Берегиня», «Соломенная лошадка» и других традиционных изделий.',
      image: '/assets/scenario/image13.png',
      link: VK_MASTERCLASS_URL,
    },
  },
  painting: {
    'painting-desk': {
      title: 'Роспись',
      description:
        'РОСПИСЬ – один из ключевых видов декоративно-прикладного искусства Удмуртии. Она применяется в росписи по дереву (прялки, подголовники, сундуки, куклы в национальных костюмах), в керамике и фарфоре (пасхальные яйца, сервизы, глиняная игрушка), а также в росписи по ткани. Мастера опираются на аутентичные образцы завятской, урало-сибирской и мезенской росписи, сочетая традиционные мотивы с современным дизайном.',
      image: '/assets/scenario/image15.png',
    },
  },
  weaving: {
    'weaving-looms': {
      title: 'Ткачество',
      description:
        'Ткачество – древнейшее ремесло удмуртов, известное с глубокой древности. Археологи находят фрагменты тканей в могильниках IX–XII вв. Для ткачества использовали лён, коноплю, крапиву, шерсть. Техники ткачества включают браное, выборное, закладное, ажурное переплетение, а также многоремизное. Цветовая гамма традиционных изделий различалась в зависимости от региона: северные удмурты ткали красные узоры на белом фоне, южные – яркие цветные орнаменты. Благодаря таким мастерицам, как Зоя Мазитова, ткачество возродилось в 1990-е годы и продолжает развиваться сегодня. Среди мастер-классов по ткачеству особое место занимает изготовление «Тканые серёжки», «Мини-гобелен» и других традиционных изделий.',
      image: '/assets/scenario/image19.png',
      link: VK_MASTERCLASS_URL,
    },
  },
  sewing: {
    'sewing-machine': {
      title: 'Мастерская по шитью удмуртских костюмов',
      description:
        'В этом отделе мастера шьют традиционные и современные интерпретации удмуртской одежды. Используют аутентичные технологии кроя, вышивки, украшения монистами и монетами. Восстанавливают забытые элементы костюма по этнографическим образцам.',
      image: '/panoramas/sewing.jpg',
      link: VK_SEWING_URL,
    },
  },
  'art-textile': {
    'textile-loom': {
      title: 'Художественный текстиль',
      description:
        'В зале представлены уникальные образцы художественного текстиля – одно из самых ярких направлений декоративно-прикладного искусства Удмуртии:\n\n– Традиционные куклы-замужницы – особый вид обрядовых кукол, которые хранили в сундуках. Куколка, сделанная из дорогих тканей и выставленная на окно, была знаком, что девушка из богатой семьи и готова к замужеству.\n\n– Образцы окрашивания шерсти натуральными красителями – мастерицы использовали корни растений, кору деревьев, травы и цветы для получения природных оттенков: жёлтого, зелёного, коричневого, синего.\n\nСреди мастер-классов по текстилю особое место занимает изготовление «Открашивание ткани природными красителями», «Обвес на сумку» и других традиционных изделий.',
      image: '/assets/scenario/image23.png',
      link: VK_MASTERCLASS_URL,
    },
  },
};

function enrichHotspot(panoramaId, hotspot) {
  let next = { ...hotspot };

  if (panoramaId === 'salon' && next.type === 'exhibit' && next.exhibit) {
    const zone = SALON_ZONE_MAP[next.id];
    if (zone) {
      next = {
        ...next,
        exhibit: { ...next.exhibit, zoneLabel: zone },
      };
    }
  }

  if (panoramaId === 'dresses' && next.type === 'exhibit') {
    const costumeInfo = COSTUME_EXHIBITS[next.id];
    if (costumeInfo && next.exhibit) {
      next = {
        ...next,
        name: costumeInfo.title,
        exhibit: {
          ...next.exhibit,
          title: costumeInfo.title,
          description: costumeInfo.description,
        },
      };
    }
  }

  if (panoramaId === 'dresses' && next.type === 'exhibit' && COSTUME_DETAILS[next.id]) {
    next = {
      ...next,
      exhibit: {
        ...next.exhibit,
        details: COSTUME_DETAILS[next.id],
      },
    };
  }

  const hallInfo = HALL_INFO[panoramaId]?.[next.id];
  if (hallInfo && next.exhibit) {
    next = {
      ...next,
      exhibit: { ...next.exhibit, ...hallInfo },
    };
  }

  return next;
}

const QUIZ_HOTSPOT_DEFAULTS = {
  salon: { yaw: '56deg', pitch: '-10deg' },
  dresses: { yaw: '159.9deg', pitch: '-2.9deg' },
  'art-processing': { yaw: '15deg', pitch: '-5deg' },
  painting: { yaw: '340deg', pitch: '-4deg' },
  weaving: { yaw: '234deg', pitch: '-6deg' },
  'art-textile': { yaw: '300deg', pitch: '-2deg' },
};

function normalizeQuizHotspot(hotspot) {
  if (hotspot.type === 'quiz-trigger' || hotspot.id?.includes('quiz-trigger')) {
    const { exhibit: _exhibit, ...rest } = hotspot;
    return {
      ...rest,
      type: 'quiz-trigger',
      name: rest.name?.includes('маршрут') ? rest.name : 'Викторина · маршрут',
    };
  }
  return hotspot;
}

function injectQuizHotspots(panoramaId, hotspots) {
  const step = SCENARIO_STEPS.find((s) => s.panoramaId === panoramaId);
  if (!step) return hotspots;

  const { activity } = step;
  if (activity.type !== 'quiz' && activity.type !== 'explore-quiz') {
    return hotspots;
  }

  const hotspotId = activity.quizHotspotId || `${panoramaId}-quiz-trigger`;
  const defaults = QUIZ_HOTSPOT_DEFAULTS[panoramaId] || { yaw: '0deg', pitch: '0deg' };

  let result = hotspots.map((h) => {
    const normalized = normalizeQuizHotspot(h);
    if (h.id === hotspotId) {
      return { ...normalized, ...defaults };
    }
    return normalized;
  });

  if (!result.some((h) => h.id === hotspotId)) {
    result = [
      ...result,
      {
        id: hotspotId,
        type: 'quiz-trigger',
        name: 'Викторина · маршрут',
        ...defaults,
      },
    ];
  }

  return result;
}

export function enrichTourData(tourData) {
  const panoramas = tourData.panoramas.map((p) => {
    let hotspots = (p.hotspots || []).map((h) => enrichHotspot(p.id, h));
    hotspots = injectQuizHotspots(p.id, hotspots);

    return { ...p, hotspots };
  });

  return {
    ...tourData,
    tourTitle: SCENARIO_META.tourTitle,
    tourSubtitle: SCENARIO_META.tourSubtitle,
    schoolFullName: SCENARIO_META.schoolFullName,
    panoramas,
  };
}
