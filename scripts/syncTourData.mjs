import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  applyEditorState,
  consolidateEditorState,
  rehydrateEditorState,
} from '../src/dev/markerEditorCore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STATE_FILE = path.join(ROOT, 'src/dev/marker-editor-state.json');
const TOUR_DATA_FILE = path.join(ROOT, 'src/data/tourData.js');

const PANORAMA_COMMENTS = {
  street: '1. Улица',
  salon: '2. Выставочная зона',
  'salon-2': '3. Выставочный зал',
  'salon-3': '4. Гостиная',
  dresses: '5. Удм. платья',
  weaving: '6. Ткачество',
  painting: '7. Роспись',
  'art-processing': '8. Береста и солома',
  sewing: '9. Шитьё удм. платьев',
  music: '10. Муз. инструменты',
  'art-textile': '11. Худ. текстиль',
};

function escapeJsString(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function serializeExhibit(exhibit) {
  const lines = [];

  if (exhibit.label) {
    lines.push(`            label: '${escapeJsString(exhibit.label)}',`);
  }

  lines.push(`            title: '${escapeJsString(exhibit.title)}',`);

  if (exhibit.description) {
    const desc = escapeJsString(exhibit.description);
    if (desc.length > 72) {
      lines.push('            description:');
      lines.push(`              '${desc}',`);
    } else {
      lines.push(`            description: '${desc}',`);
    }
  }

  lines.push(`            image: '${escapeJsString(exhibit.image)}',`);

  if (exhibit.link) {
    lines.push(`            link: '${escapeJsString(exhibit.link)}',`);
  }

  if (exhibit.zoneLabel) {
    lines.push(`            zoneLabel: '${escapeJsString(exhibit.zoneLabel)}',`);
  }

  if (exhibit.details?.length) {
    lines.push('            details: [');
    exhibit.details.forEach((d) => {
      lines.push('              {');
      lines.push(`                id: '${escapeJsString(d.id)}',`);
      lines.push(`                name: '${escapeJsString(d.name)}',`);
      if (d.udmName) {
        lines.push(`                udmName: '${escapeJsString(d.udmName)}',`);
      }
      if (d.description) {
        lines.push(`                description: '${escapeJsString(d.description)}',`);
      }
      lines.push('              },');
    });
    lines.push('            ],');
  }

  return lines.join('\n');
}

function serializeHotspot(hotspot) {
  if (hotspot.type === 'nav') {
    return `        {
          id: '${escapeJsString(hotspot.id)}',
          type: 'nav',
          name: '${escapeJsString(hotspot.name)}',
          yaw: '${escapeJsString(hotspot.yaw)}',
          pitch: '${escapeJsString(hotspot.pitch)}',
          targetId: '${escapeJsString(hotspot.targetId)}',
        }`;
  }

  return `        {
          id: '${escapeJsString(hotspot.id)}',
          type: 'exhibit',
          name: '${escapeJsString(hotspot.name)}',
          yaw: '${escapeJsString(hotspot.yaw)}',
          pitch: '${escapeJsString(hotspot.pitch)}',
          exhibit: {
${serializeExhibit(hotspot.exhibit || {})}
          },
        }`;
}

function serializePanorama(panorama) {
  const comment = PANORAMA_COMMENTS[panorama.id] || `${panorama.order}. ${panorama.name}`;
  const hotspots = (panorama.hotspots || []).map(serializeHotspot).join(',\n');

  return `    // ── ${comment} ──
    {
      id: '${escapeJsString(panorama.id)}',
      order: ${panorama.order},
      name: '${escapeJsString(panorama.name)}',
      description: '${escapeJsString(panorama.description)}',
      url: '${escapeJsString(panorama.url)}',
      hotspots: [
${hotspots}
      ],
    }`;
}

function generateTourDataFile(tourData) {
  const panoramas = tourData.panoramas.map(serializePanorama).join(',\n\n');

  return `export const TOUR_DATA = {
  schoolName: '${escapeJsString(tourData.schoolName)}',
  schoolFullName:
    '${escapeJsString(tourData.schoolFullName)}',
  tourTitle: '${escapeJsString(tourData.tourTitle)}',
  tourSubtitle: '${escapeJsString(tourData.tourSubtitle)}',
  siteUrl: '${escapeJsString(tourData.siteUrl)}',
  panoramas: [
${panoramas}
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
`;
}

async function loadTourData() {
  const mod = await import(pathToFileURL(TOUR_DATA_FILE).href);
  return mod.TOUR_DATA;
}

export async function syncTourDataFromEditorState() {
  const editorState = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  const baseTourData = await loadTourData();
  const hydratedState = rehydrateEditorState(baseTourData.panoramas, editorState);
  const mergedPanoramas = applyEditorState(
    baseTourData.panoramas,
    hydratedState
  );
  const mergedTourData = { ...baseTourData, panoramas: mergedPanoramas };

  fs.writeFileSync(
    TOUR_DATA_FILE,
    generateTourDataFile(mergedTourData),
    'utf8'
  );

  const consolidated = consolidateEditorState(hydratedState, mergedPanoramas);
  fs.writeFileSync(
    STATE_FILE,
    `${JSON.stringify(consolidated, null, 2)}\n`,
    'utf8'
  );

  return { ok: true, file: TOUR_DATA_FILE };
}
