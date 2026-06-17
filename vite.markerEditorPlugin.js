import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncTourDataFromEditorState } from './scripts/syncTourData.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.resolve(__dirname, 'src/dev/marker-editor-state.json');
const API_PATH = '/__dev/marker-editor';
const SYNC_PATH = '/__dev/sync-tour-data';

const EMPTY_STATE = JSON.stringify({ scenes: {}, savedAt: null }, null, 2);

function readStateFile() {
  try {
    return fs.readFileSync(STATE_FILE, 'utf8');
  } catch {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(STATE_FILE, EMPTY_STATE, 'utf8');
    return EMPTY_STATE;
  }
}

function writeStateFile(body) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, body, 'utf8');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export function markerEditorApiPlugin() {
  return {
    name: 'marker-editor-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === SYNC_PATH) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          try {
            if (req.method === 'POST') {
              const result = await syncTourDataFromEditorState();
              res.end(JSON.stringify(result));
              return;
            }
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
          } catch (error) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: error instanceof Error ? error.message : 'Sync failed',
              })
            );
          }
          return;
        }

        if (!url?.startsWith(API_PATH)) {
          next();
          return;
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        try {
          if (req.method === 'GET') {
            res.end(readStateFile());
            return;
          }

          if (req.method === 'PUT' || req.method === 'POST') {
            const body = await readBody(req);
            JSON.parse(body);
            writeStateFile(body.endsWith('\n') ? body : `${body}\n`);
            const sync = await syncTourDataFromEditorState();
            res.end(JSON.stringify({ ok: true, sync }));
            return;
          }

          if (req.method === 'DELETE') {
            writeStateFile(EMPTY_STATE);
            res.end(JSON.stringify({ ok: true }));
            return;
          }

          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        } catch (error) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Write failed',
            })
          );
        }
      });
    },
  };
}
