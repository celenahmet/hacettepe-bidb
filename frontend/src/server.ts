import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { ESKI_YOLLAR } from './eski-yollar';

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
 * Eski adresler kalıcı olarak (301) yeni İngilizce adreslere taşınır.
 * Mevcut sitenin adresleri arama motorlarında ve dış bağlantılarda kayıtlı
 * olduğu için, /tr/geneltanitim gibi bir istek /tr/about adresine yönlendirilir.
 * Böylece hiçbir bağlantı kırılmaz.
 */
app.use((req, res, next) => {
  const yol = req.path.replace(/\/+$/, '') || req.path;
  // Kaynak sitede bazı adresler büyük harfliydi (/tr/VPN). Adresler küçük
  // harfe indirgenir; tek bir sayfanın tek bir adresi olur.
  const kucuk = yol.toLowerCase();
  const hedef = ESKI_YOLLAR[kucuk] ?? (kucuk !== yol ? kucuk : undefined);
  if (!hedef) return next();
  const sorgu = req.originalUrl.slice(req.path.length);   // ?a=b kısmı korunur
  res.redirect(301, hedef + sorgu);
});

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

/* ---------- yayındaki sayfa listesi ---------- */

const API_TABAN = process.env['API_TABAN'] ?? 'http://backend:8080';
const SITE_ADRESI = process.env['SITE_ADRESI'] ?? 'https://bidb.hacettepe.edu.tr';

let yolOnbellek: { yollar: Set<string>; zaman: number } | null = null;

/**
 * Yayındaki sayfaların adreslerini döndürür. Liste her istekte değil,
 * dakikada bir tazelenir; panelden yapılan değişiklik en geç bir dakika
 * içinde yansır.
 */
async function yayindakiYollar(): Promise<Set<string>> {
  if (yolOnbellek && Date.now() - yolOnbellek.zaman < 60_000) return yolOnbellek.yollar;
  const yollar = new Set<string>();
  for (const dil of ['tr', 'en']) {
    try {
      const y = await fetch(`${API_TABAN}/api/${dil}/sayfalar`);
      if (!y.ok) continue;
      for (const s of (await y.json()) as { slug: string }[]) yollar.add(`/${dil}/${s.slug}`);
    } catch {
      // Sayfa listesi alınamazsa doğrulama yapılmaz; site yine de çalışır.
      return yolOnbellek?.yollar ?? new Set<string>();
    }
  }
  yolOnbellek = { yollar, zaman: Date.now() };
  return yollar;
}

/** İstenen adres bir içerik sayfası mı, ve böyle bir sayfa var mı? */
async function sayfaYok(yol: string): Promise<boolean> {
  const p = yol.replace(/\/+$/, '');
  if (!/^\/(tr|en)\/[^/]+$/.test(p)) return false;   // ana sayfa, panel, dosyalar
  const yollar = await yayindakiYollar();
  return yollar.size > 0 && !yollar.has(p.toLowerCase());
}

/* ---------- site haritası ve robots ---------- */

app.get('/sitemap.xml', async (_req, res) => {
  const yollar = [...(await yayindakiYollar())].sort();
  const girdiler = ['/tr', '/en', ...yollar]
    .map((y) => `  <url><loc>${SITE_ADRESI}${y}</loc></url>`)
    .join('\n');
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${girdiler}\n</urlset>\n`,
  );
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    ['User-agent: *', 'Disallow: /yonetim', 'Disallow: /api/', '', `Sitemap: ${SITE_ADRESI}/sitemap.xml`, ''].join('\n'),
  );
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
 *
 * Var olmayan bir sayfa istendiğinde Angular "Sayfa bulunamadı" ekranını
 * basar; bu ekranın HTTP durumu da 404 olmalıdır. Aksi hâlde arama motorları
 * hata sayfasını geçerli bir sayfa sanıp dizine ekler ("yumuşak 404").
 */
app.use(async (req, res, next) => {
  try {
    const bulunamadi = await sayfaYok(req.path);
    const yanit = await angularApp.handle(req);
    if (!yanit) return next();
    // Durum kodu yanıtın kendisinden okunduğu için yeni bir yanıt oluşturulur
    const son = bulunamadi
      ? new Response(yanit.body, { status: 404, headers: yanit.headers })
      : yanit;
    return writeResponseToNodeResponse(son, res);
  } catch (e) {
    return next(e);
  }
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
