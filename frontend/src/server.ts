import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
/**
 * İzin verilen host başlıkları. Angular SSR, sunucu tarafı istek sahteciliğine
 * (SSRF) karşı bilinmeyen host değerlerini reddeder. Dağıtımda ALLOWED_HOSTS
 * ortam değişkeni ile alan adı verilir.
 */
const izinliHostlar = (process.env['ALLOWED_HOSTS'] ?? 'localhost,127.0.0.1,bidb.hacettepe.edu.tr')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

const angularApp = new AngularNodeAppEngine({ allowedHosts: izinliHostlar } as never);

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * API vekili: tarayıcı ve sunucu tarafı render aynı göreli adresi (/api/...)
 * kullanır; istekler buradan backend servisine iletilir. Böylece ortam
 * fark etmeksizin tek adres yapısı geçerli olur.
 */
const apiTaban = process.env['BIDB_API'] ?? 'http://localhost:8081';

app.use('/api', express.raw({ type: '*/*', limit: '5mb' }), async (req, res) => {
  try {
    const hedef = apiTaban + '/api' + req.url;

    // Kimlik doğrulama ve içerik başlıkları olduğu gibi iletilir
    const basliklar: Record<string, string> = { Accept: 'application/json' };
    if (req.headers.authorization) basliklar['Authorization'] = req.headers.authorization;
    if (req.headers['content-type']) basliklar['Content-Type'] = String(req.headers['content-type']);

    const govdeliMi = req.method !== 'GET' && req.method !== 'HEAD';
    const yanit = await fetch(hedef, {
      method: req.method,
      headers: basliklar,
      body: govdeliMi && Buffer.isBuffer(req.body) && req.body.length ? new Uint8Array(req.body) : undefined
    });

    const govde = Buffer.from(await yanit.arrayBuffer());
    res.status(yanit.status);
    const tur = yanit.headers.get('content-type');
    if (tur) res.type(tur);
    // Yetkisiz isteklerde tarayıcının parola penceresi açılmasın
    res.removeHeader('WWW-Authenticate');
    res.send(govde);
  } catch {
    res.status(502).json({ hata: 'Backend servisine ulaşılamadı' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
