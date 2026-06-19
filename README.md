# НЦДПИиР — виртуальный тур 360°

Интерактивный панорамный тур по залам Национального центра декоративно-прикладного искусства и ремёсел (Удмуртия).

**Демо:** https://nyrokume.github.io/ncdpir-virtual-tour-360/

---

## Требования

| Компонент | Версия |
|-----------|--------|
| [Node.js](https://nodejs.org/) | 20 LTS или новее |
| npm | идёт вместе с Node.js |
| Git | для клонирования репозитория |

Проверка:

```bash
node -v    # v20.x.x или выше
npm -v
git --version
```

---

## Развёртывание на другом ПК

### 1. Клонировать репозиторий

```bash
git clone https://github.com/Nyrokume/ncdpir-virtual-tour-360.git
cd ncdpir-virtual-tour-360
```

Либо скопируйте папку проекта целиком (включая `public/`, `src/`, `package.json`).

### 2. Установить зависимости

```bash
npm install
```

> **Windows:** для сжатия изображений при сборке используется пакет `sharp`. Если `npm install` завершился с ошибкой по `sharp`, установите [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) или запустите сборку без оптимизации: `npx vite build`.

### 3. Запустить в режиме разработки

**Windows (PowerShell):**

```powershell
.\scripts\start-tour.ps1
```

Скрипт проверит Node.js, установит зависимости и откроет dev-сервер.

| Команда | Действие |
|---------|----------|
| `.\scripts\start-tour.ps1` | Dev-сервер (по умолчанию) |
| `.\scripts\start-tour.ps1 dev -MarkerEdit` | Dev + редактор маркеров |
| `.\scripts\start-tour.ps1 build` | Production-сборка |
| `.\scripts\start-tour.ps1 preview` | Просмотр `dist/` |
| `.\scripts\start-tour.ps1 install` | Только `npm install` |

> Если PowerShell блокирует скрипт:  
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

**Вручную:**

```bash
npm run dev
```

Откроется браузер на **http://localhost:3000/** (порт задан в `vite.config.js`).

### 4. Проверить production-сборку локально

```bash
npm run build
npm run preview
```

`npm run build` собирает проект в `dist/` и сжимает панорамы и картинки (скрипт `scripts/optimizeDistAssets.mjs`).

`npm run preview` поднимает локальный сервер для проверки собранной версии.

---

## Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с hot-reload |
| `npm run build` | Production-сборка + сжатие ассетов |
| `npm run preview` | Просмотр содержимого `dist/` |

Дополнительно (вручную):

```bash
node scripts/syncTourData.mjs
```

Синхронизирует позиции маркеров из `src/dev/marker-editor-state.json` в `src/data/tourData.js`.

---

## Структура проекта

```
├── public/
│   ├── panoramas/       # Панорамы залов (JPG)
│   ├── audio/           # Фоновая музыка залов
│   ├── assets/scenario/ # Иллюстрации для экспонатов и викторин
│   └── images/
├── src/
│   ├── components/      # UI: панорама, карта, модалки, викторины
│   ├── data/            # tourData.js, scenarioData.js, обогащение контента
│   ├── dev/             # Редактор маркеров (только dev)
│   ├── hooks/
│   ├── lib/
│   └── pages/TourPage.jsx
├── scripts/
│   ├── optimizeDistAssets.mjs  # Сжатие при сборке
│   └── syncTourData.mjs        # Экспорт маркеров в tourData
└── vite.config.js
```

---

## Редактор маркеров (dev)

Доступен **только** при `npm run dev` (в production-сборке отключён).

### Как открыть

1. Запустите `npm run dev`.
2. Пройдите приветственный экран.
3. В **верхнем меню** (HUD) справа нажмите иконку **гаечного ключа** — откроется панель «Маркеры».
4. Автооткрытие при загрузке: `http://localhost:3000/?markerEdit`

### Сохранение правок

- Позиции сохраняются в `localStorage` и в `src/dev/marker-editor-state.json` (через dev API Vite).
- Чтобы зафиксировать в основных данных тура:

```bash
node scripts/syncTourData.mjs
git add src/data/tourData.js src/dev/marker-editor-state.json
git commit -m "Update hotspot positions"
```

---

## Публикация на GitHub Pages

Репозиторий настроен на автодеплой при push в ветку `main` (workflow `.github/workflows/deploy.yml`).

```bash
git push origin main
```

Сайт: `https://<username>.github.io/ncdpir-virtual-tour-360/`

Базовый путь задаётся в `vite.config.js` (`base: '/ncdpir-virtual-tour-360/'` для production).

### Свой хостинг / другой путь

1. Измените `repoName` в `vite.config.js` (или `base` на `'/'` для корня домена).
2. Выполните `npm run build`.
3. Загрузите содержимое папки `dist/` на сервер.
4. Для SPA настройте fallback на `index.html` (аналог `404.html` в GitHub Actions).

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Пустая страница на GitHub Pages | Проверьте `base` в `vite.config.js` — должен совпадать с именем репозитория |
| Панорамы не грузятся | Убедитесь, что JPG лежат в `public/panoramas/` |
| Ошибка `sharp` при сборке | `npm install --include=optional` или `npx vite build` без шага optimize |
| Редактор не сохраняет в файл | Работает только в `npm run dev`, не в `preview`/`build` |
| Порт 3000 занят | Измените `server.port` в `vite.config.js` |

---

## Технологии

- React 18 + Vite 6
- [Photo Sphere Viewer](https://photo-sphere-viewer.js.org/) — панорамы 360°
- Tailwind CSS
- GitHub Pages + GitHub Actions
