/** Сценарий «Тайны дома Жерехова: секреты мастеров» */

export const SCENARIO_META = {
  tourTitle: 'Тайны дома Жерехова: секреты мастеров',
  tourSubtitle: 'Виртуальный тур 360°',
  schoolFullName:
    'Национальный центр декоративно-прикладного искусства и ремёсел Удмуртской Республики',
};

export const BONUS_PANORAMA_IDS = ['salon-2', 'salon-3', 'music'];

export const VK_MASTERCLASS_URL = 'https://vk.com/wall-63098578_9408';
export const VK_SEWING_URL = 'https://vk.com/album-63098578_303174350';

export const ENTRY_OVERLAY = {
  title:
    'Национальный центр декоративно-прикладного искусства и ремёсел Удмуртской Республики',
  description:
    'Памятник архитектуры XIX века – дом купца Степана Жерехова, архитектором которого является Семён Емельянович Дудин. С 1991 года здесь работает головной центр по сохранению и возрождению традиционных ремёсел Удмуртии. В центре оборудовано 10 мастерских и выставочных залов: ткачество, береста, соломка, роспись, национальный костюм, музыкальные инструменты и другие. Для посетителей проводятся мастер-классы, выставки и этнографические праздники.',
  ctaLabel: 'Начать путешествие',
};

export const TOUR_COMPLETION_OVERLAY = {
  title: 'Поздравляем! Вы успешно прошли виртуальный тур!',
  description:
    'Приезжайте в Национальный центр декоративно-прикладного искусства и ремёсел (НЦДПИиР) в Ижевске!\n\nЗдесь вы сможете поближе познакомиться с Центром и удмуртским ремеслом, своими руками сделать тканый браслет или сережку, попробовать удмуртскую кухню или научиться играть на удмуртских музыкальных инструментах.\n\nЖдём вас по адресу: г. Ижевск, ул. Вадима Сивкова, 173.',
  ctaLabel: 'Закрыть',
};

export const POST_DUKES_TRACKS = {
  yatsaz: {
    audio: '/audio/yatsaz.mp3',
    audioTitle: 'Post-dukes — Ятцаз',
  },
  kunoPumitan: {
    audio: '/audio/kuno-pumitan.mp3',
    audioTitle: 'Post-dukes — Куно пумитан',
  },
  nylKelyanGur: {
    audio: '/audio/nyl-kelyan-gur.mp3',
    audioTitle: 'Post-dukes — Ныл келян гур',
  },
};

/** Фоновая музыка залов и викторин */
export const PANORAMA_AUDIO = {
  salon: POST_DUKES_TRACKS.yatsaz,
  dresses: POST_DUKES_TRACKS.nylKelyanGur,
  'art-processing': POST_DUKES_TRACKS.kunoPumitan,
  painting: POST_DUKES_TRACKS.yatsaz,
  weaving: POST_DUKES_TRACKS.nylKelyanGur,
  sewing: POST_DUKES_TRACKS.kunoPumitan,
  'art-textile': POST_DUKES_TRACKS.yatsaz,
  music: POST_DUKES_TRACKS.kunoPumitan,
};

export const MUSIC_HALL_AUDIO = PANORAMA_AUDIO.music;

/** Линейные шаги сценария */
export const SCENARIO_STEPS = [
  {
    id: 'street',
    panoramaId: 'street',
    activity: { type: 'intro' },
    nextPanoramaId: 'salon',
  },
  {
    id: 'salon',
    panoramaId: 'salon',
    activity: { type: 'quiz', quizId: 'match-craft' },
    nextPanoramaId: 'dresses',
  },
  {
    id: 'dresses',
    panoramaId: 'dresses',
    activity: {
      type: 'explore-quiz',
      quizId: 'costume-elements',
      quizHotspotId: 'dresses-quiz-trigger',
    },
    nextPanoramaId: 'art-processing',
  },
  {
    id: 'art-processing',
    panoramaId: 'art-processing',
    activity: { type: 'quiz', quizId: 'art-processing-tf' },
    nextPanoramaId: 'painting',
  },
  {
    id: 'painting',
    panoramaId: 'painting',
    activity: { type: 'quiz', quizId: 'painting-tf' },
    nextPanoramaId: 'weaving',
  },
  {
    id: 'weaving',
    panoramaId: 'weaving',
    activity: { type: 'quiz', quizId: 'weaving-ms' },
    nextPanoramaId: 'sewing',
  },
  {
    id: 'sewing',
    panoramaId: 'sewing',
    activity: { type: 'info-only' },
    nextPanoramaId: 'art-textile',
  },
  {
    id: 'art-textile',
    panoramaId: 'art-textile',
    activity: { type: 'quiz', quizId: 'art-textile-tf' },
    nextPanoramaId: null,
  },
];

export const ZONE_LABELS = {
  exhibition: 'ВЫСТАВОЧНАЯ ЗОНА',
  souvenir: 'СУВЕНИРНАЯ ПРОДУКЦИЯ',
};

/** Hotspot id → zone для salon */
export const SALON_ZONE_MAP = {
  'salon-case-left': 'exhibition',
  'salon-tapestry': 'exhibition',
  'salon-figurines': 'exhibition',
  'salon-cases-center': 'souvenir',
  'salon-cases-right': 'souvenir',
  'salon-exhibit-mqh3dca9': 'souvenir',
};

export const CRAFTS = [
  { id: 'weaving', name: 'Узорное ткачество', image: '/assets/scenario/image1.png' },
  {
    id: 'birch-straw',
    name: 'Художественная обработка бересты и соломы',
    image: '/assets/scenario/image2.png',
  },
  { id: 'embroidery', name: 'Художественная вышивка', image: '/assets/scenario/image3.png' },
  { id: 'woodcarving', name: 'Резьба по дереву', image: '/assets/scenario/image4.png' },
  { id: 'pottery', name: 'Гончарное дело', image: '/assets/scenario/image5.png' },
];

export const QUIZZES = {
  'match-craft': {
    type: 'match',
    title: 'Соотнеси ремесло и описание',
    successMessage: 'Молодец! Ты познакомился с главными ремёслами Удмуртии',
    crafts: CRAFTS,
    questions: [
      {
        id: 'q1',
        description:
          'Традиционное женское ремесло создания домотканых ковров, скатертей, половиков и поясов.',
        correctCraftId: 'weaving',
        explanation:
          'В Удмуртии ткачество было основным женским занятием – ткали полотно, ковры, пояса, скатерти.',
      },
      {
        id: 'q2',
        description:
          'Создание плетеных и тисненых туесов, коробов, лукошек, аппликаций и объёмных фигур из соломы.',
        correctCraftId: 'birch-straw',
      },
      {
        id: 'q3',
        description:
          'Древнейший вид искусства украшения одежды и предметов быта цветными нитями.',
        correctCraftId: 'embroidery',
      },
      {
        id: 'q4',
        description:
          'Украшение утвари, прялок, посуды и элементов дома геометрической, трехгранно-выемчатой или прорезной резьбой.',
        correctCraftId: 'woodcarving',
      },
      {
        id: 'q5',
        description:
          'Процесс обработки глины и превращения её в прочные, долговечные изделия — керамику.',
        correctCraftId: 'pottery',
      },
    ],
  },

  'costume-elements': {
    type: 'single-choice',
    title: 'Угадай элемент костюма',
    successMessage:
      'Отлично! Вы различаете традиционные костюмы удмуртов и бесермян',
    questions: [
      {
        id: 'c1',
        prompt: 'Как называется этот головной убор?',
        image: '/assets/scenario/image6.png',
        options: ['Айшон', 'Кашпу', 'Чалма', 'Йыршет'],
        correctIndex: 0,
      },
      {
        id: 'c2',
        prompt: 'Как называется это украшение?',
        image: '/assets/scenario/image7.png',
        options: ['Чыртывесь', 'Камали', 'Путо', 'Янчик'],
        correctIndex: 0,
      },
      {
        id: 'c3',
        prompt: 'Как называется это чересплечное монисто из монет?',
        image: '/assets/scenario/image8.png',
        options: ['Камали (камалё)', 'Залык', 'Путо', 'Янчик'],
        correctIndex: 0,
      },
      {
        id: 'c4',
        prompt: 'Как называется шлемообразная шапочка с монетами и бисером?',
        image: '/assets/scenario/image9.png',
        options: ['Кашпу', 'Айшон', 'Кучкышет', 'Манлай'],
        correctIndex: 0,
      },
      {
        id: 'c5',
        prompt: 'Как называется этот элемент?',
        image: '/assets/scenario/image10.png',
        options: ['Шортдэрем', 'Ашет', 'Дэрем', 'Сюлык'],
        correctIndex: 0,
      },
    ],
  },

  'art-processing-tf': {
    type: 'true-false',
    title: 'Верно / Неверно',
    successMessage:
      'Отлично! Теперь вы знаете, как удмуртские мастера работают с берестой и соломкой.',
    questions: [
      {
        id: 'ap1',
        statement:
          'Туес из бересты использовали для хранения молока, масла и мёда – продукты оставались свежими длительное время.',
        correct: true,
        explanation:
          'Верно! Береста водонепроницаема и обладает антисептическими свойствами благодаря веществу битулин, которое подавляет рост бактерий. В берестяных туесах молоко долго не скисало, а мёд и масло сохраняли свежесть.',
      },
      {
        id: 'ap2',
        statement:
          'Соломку для плетения заготавливают зимой, когда она наиболее крепкая и не ломается.',
        correct: false,
        explanation:
          'Неверно. Солому заготавливают в конце июля — начале августа, во время созревания ржи и пшеницы. Именно в этот период соломка достигает нужной длины, прочности и золотистого оттенка.',
      },
      {
        id: 'ap3',
        statement:
          'Из ржаной соломы плетут шляпы, танцующих кукол, шкатулки и даже делают декоративные панно.',
        correct: true,
        explanation:
          'Верно! Ржаная соломка – длинная, прочная и пластичная. Её используют для плетения ажурных изделий: кукол, шкатулок, панно.',
      },
    ],
  },

  'painting-tf': {
    type: 'true-false',
    title: 'Верно / Неверно',
    successMessage: 'Замечательно!',
    questions: [
      {
        id: 'p1',
        statement: 'Роспись по дереву в Удмуртии возникла в XVIII веке.',
        correct: false,
        explanation:
          'Роспись по дереву как возрождённое ремесло активно развивается в Удмуртии с конца XX века.',
      },
      {
        id: 'p2',
        statement:
          'В удмуртской росписи используются только чёрный и белый цвета.',
        correct: false,
        explanation:
          'Используются красный, белый, чёрный (символика флага УР), а также зелёный, синий, жёлтый.',
      },
      {
        id: 'p3',
        statement:
          'Удмуртский геометрический орнамент включает восьмиконечную звезду (толъзь пужы).',
        correct: true,
        explanation:
          'Восьмиконечная звезда – популярный символ в финно-угорской культуре, элемент женских нагрудников и росписи.',
      },
    ],
  },

  'weaving-ms': {
    type: 'multi-select',
    title: 'Вопрос-ответ',
    successMessage:
      'Поздравляем! Теперь переходим в мастерскую по шитью удмуртских костюмов.',
    questions: [
      {
        id: 'w1',
        prompt: 'Из какого сырья ткали удмуртские мастерицы? (выберите все верные)',
        options: [
          { id: 'linen', label: 'Лён', correct: true },
          { id: 'wool', label: 'Шерсть', correct: true },
          { id: 'cotton', label: 'Хлопок', correct: false },
          { id: 'hemp', label: 'Конопля', correct: true },
          { id: 'nettle', label: 'Крапива', correct: true },
          { id: 'silk', label: 'Шёлк', correct: false },
        ],
        explanation:
          'Традиционными материалами для удмуртского ткачества были лён, конопля, крапива и шерсть. Лён и коноплю выращивали на полях, крапиву собирали в лесу, шерсть получали от овец. Хлопок и шёлк появились в обиходе значительно позже и не использовались в традиционном крестьянском ткачестве.',
      },
      {
        id: 'w2',
        prompt:
          'Как называется ткачиха из Удмуртии, чьи ковры и полотенца хранятся в Третьяковской галерее?',
        options: [
          { id: 'mazitova', label: 'Зоя Мазитова', correct: true },
          { id: 'izmailova', label: 'Надежда Измайлова', correct: false },
          { id: 'fofanova', label: 'Анна Фофанова', correct: false },
        ],
        explanation:
          'Зоя Мазитова (1920–2001) — легендарная удмуртская ткачиха. Несмотря на инвалидность после войны, она создала более 1000 изделий. Её ковры экспонировались на выставках в Москве, а часть работ была приобретена Государственной Третьяковской галереей.',
      },
      {
        id: 'w3',
        prompt: 'Какие техники ткачества были распространены у удмуртов? (выберите все верные)',
        options: [
          { id: 'branoe', label: 'Браное', correct: true },
          { id: 'zakladnoe', label: 'Закладное', correct: true },
          { id: 'azurnoe', label: 'Ажурное', correct: true },
          { id: 'vybornoe', label: 'Выборное', correct: true },
          { id: 'mnogorem', label: 'Многоремизное', correct: true },
          { id: 'uzelkovoe', label: 'Узелковое', correct: false },
        ],
        explanation:
          'Удмуртские мастерицы владели множеством техник: переборное, выборное, браное, закладное, ажурное переплетение, многоремизное ткачество. На выставке 1937 года большинство скатертей было выполнено именно в многоремизной технике.',
      },
    ],
  },

  'art-textile-tf': {
    type: 'true-false',
    title: 'Верно / Неверно',
    successMessage: 'Прекрасно! Вы узнали немножко о художественном текстиле Удмуртии',
    questions: [
      {
        id: 'at1',
        statement:
          'Для окрашивания шерсти удмуртские мастерицы использовали только покупные химические красители.',
        correct: false,
        explanation:
          'Неверно. Традиционно удмуртки использовали натуральные красители – корни растений, кору деревьев, травы и цветы. Например, для получения жёлтого цвета использовали кору берёзы и цветы пижмы, для зелёного – листья крапивы и щавеля, для коричневого – кору ольхи и луковую шелуху.',
      },
      {
        id: 'at2',
        statement:
          'Куколка-замужница выставлялась на окно как знак того, что девушка из богатой семьи готова к замужеству.',
        correct: true,
        explanation:
          'Верно! Выставленная на окно куколка, сшитая из дорогих тканей, служила своеобразным «брачным объявлением». Она сообщала соседям и прохожим, что в доме есть девушка на выданье из состоятельной семьи.',
      },
    ],
  },
};

export function getStepByPanoramaId(panoramaId) {
  return SCENARIO_STEPS.find((s) => s.panoramaId === panoramaId);
}

export function getStepIndex(panoramaId) {
  return SCENARIO_STEPS.findIndex((s) => s.panoramaId === panoramaId);
}

export function activityKey(panoramaId, quizId) {
  return quizId ? `${panoramaId}:${quizId}` : `${panoramaId}:intro`;
}

export function getQuiz(quizId) {
  return QUIZZES[quizId] ?? null;
}

export function getPanoramaAudio(panoramaId) {
  return PANORAMA_AUDIO[panoramaId] ?? null;
}

export function getQuizAudio(quizId) {
  const step = SCENARIO_STEPS.find((s) => s.activity?.quizId === quizId);
  return step ? getPanoramaAudio(step.panoramaId) : null;
}
