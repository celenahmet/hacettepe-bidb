import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { LEGACY_ROUTES } from './legacy-routes';

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
 * Yanıtlar sıkıştırılarak gönderilir. Sayfa metinleri uzun olduğu için
 * (Sık Sorulan Sorular sayfası ~115 KB) bu, indirilen veriyi belirgin
 * biçimde azaltır ve yavaş bağlantılarda açılışı hızlandırır.
 */
app.use(compression());

/* ---------- güvenlik başlıkları ---------- */

// Sunucu yazılımını tanıtan başlık kaldırılır: saldırgana bilgi vermez.
app.disable('x-powered-by');

/**
 * İçerik güvenliği politikası.
 *
 * Sayfa metinlerinde satır içi stil (style="…") bulunuyor ve Angular
 * sunucu tarafı çizimde durum aktarımı için satır içi betik üretiyor;
 * bu ikisine izin verilir. Satır içi olay işleyicisi (onclick vb.) ve
 * <script> etiketi içerikte hiç yok — denetlendi.
 *
 * Gömülü videolar yalnızca YouTube'dan gelir.
 */
const GUVENLIK_POLITIKASI = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "frame-src https://www.youtube.com https://youtube.com",
  "connect-src 'self'",
  "object-src 'none'",          // eklenti içeriği yok
  "base-uri 'self'",            // <base> ile url kaçırma engellenir
  "form-action 'self'",
  "frame-ancestors 'self'"      // başka sitede çerçevelenemez (tıklama hırsızlığı)
].join('; ');

app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', GUVENLIK_POLITIKASI);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // Yalnızca HTTPS üzerinden anlamlıdır; tarayıcı düz HTTP'de yok sayar.
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

/**
 * Panelden yapılan adres değişikliklerinden doğan yönlendirmeler.
 *
 * ESKI_YOLLAR aktarımdan gelen sabit eşlemedir; bu tablo ise sonradan
 * yönetim panelinden bir sayfanın adresi değiştirildiğinde oluşur.
 * Dakikada bir tazelenir.
 */
const panelYonlendirmeleri = new Map<string, string>();
let yonlendirmeZamani = 0;

/** Tabloyu en fazla dakikada bir tazeler. */
async function yonlendirmeleriHazirla(): Promise<void> {
  if (Date.now() - yonlendirmeZamani < 60_000) return;
  yonlendirmeZamani = Date.now();
  await yonlendirmeleriTazele();
}

async function yonlendirmeleriTazele(): Promise<void> {
  try {
    const y = await fetch(`${API_TABAN}/api/tr/redirects`);
    if (!y.ok) return;
    const veri = (await y.json()) as Record<string, string>;
    panelYonlendirmeleri.clear();
    for (const [eski, yeni] of Object.entries(veri)) {
      panelYonlendirmeleri.set(eski.toLowerCase(), yeni);
    }
  } catch {
    // Backend erişilemezse eldeki tablo korunur; site çalışmaya devam eder.
  }
}

/**
 * Eski adresler kalıcı olarak (301) yeni İngilizce adreslere taşınır.
 * Mevcut sitenin adresleri arama motorlarında ve dış bağlantılarda kayıtlı
 * olduğu için, /tr/geneltanitim gibi bir istek /tr/about adresine yönlendirilir.
 * Böylece hiçbir bağlantı kırılmaz.
 */
app.use(async (req, res, next) => {
  const yol = req.path.replace(/\/+$/, '') || req.path;

  // Yalnızca içerik sayfaları yönlendirilir. Varlık dosyalarının adında
  // büyük harf bulunur (styles-CYIGEJUB.css gibi); onlara dokunulmazsa
  // tarayıcı CSS ve JavaScript dosyalarını alamaz.
  if (!/^\/(tr|en)(\/|$)/i.test(yol)) return next();

  await yonlendirmeleriHazirla();

  // Kaynak sitede bazı adresler büyük harfliydi (/tr/VPN). Sayfa adresleri
  // küçük harfe indirgenir; tek bir sayfanın tek bir adresi olur.
  const kucuk = yol.toLowerCase();
  // Ana sayfa içeriği hem /tr hem /tr/home adresinden erişilebilirdi.
  // Aynı içeriğin iki adresi olması arama motorlarında bölünmeye yol açar;
  // tek geçerli adres /tr olsun.
  const anaSayfa = kucuk.match(/^\/(tr|en)\/home$/);
  const hedef = anaSayfa
    ? '/' + anaSayfa[1]
    : LEGACY_ROUTES[kucuk] ?? panelYonlendirmeleri.get(kucuk) ?? (kucuk !== yol ? kucuk : undefined);
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
    const fileType = yanit.headers.get('content-type');
    if (fileType) res.type(fileType);
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

let yolOnbellek: { yollar: Set<string>; savedAt: number } | null = null;

/** Kaynakta hata metni dönen pages; site haritasında ilan edilmezler. */
const hataliSayfalar = new Set<string>();

/**
 * Yayındaki sayfaların adreslerini döndürür. Liste her istekte değil,
 * dakikada bir tazelenir; panelden yapılan değişiklik en geç bir dakika
 * içinde yansır.
 */
async function yayindakiYollar(): Promise<Set<string>> {
  if (yolOnbellek && Date.now() - yolOnbellek.savedAt < 60_000) return yolOnbellek.yollar;
  const yollar = new Set<string>();
  for (const language of ['tr', 'en']) {
    try {
      const y = await fetch(`${API_TABAN}/api/${language}/pages`);
      if (!y.ok) continue;
      for (const s of (await y.json()) as { slug: string; brokenContent?: boolean }[]) {
        // Kaynakta hata metni dönen sayfalar erişilebilir kalır, ancak
        // site haritasına girmez (bkz. hataliSayfalar)
        if (s.brokenContent) hataliSayfalar.add(`/${language}/${s.slug}`);
        yollar.add(`/${language}/${s.slug}`);
      }
    } catch {
      // Sayfa listesi alınamazsa doğrulama yapılmaz; site yine de çalışır.
      return yolOnbellek?.yollar ?? new Set<string>();
    }
  }
  yolOnbellek = { yollar, savedAt: Date.now() };
  return yollar;
}

/** İstenen url bir içerik sayfası mı, ve böyle bir sayfa var mı? */
async function sayfaYok(yol: string): Promise<boolean> {
  const p = yol.replace(/\/+$/, '');

  // Haber sayfası: /tr/duyuru/<slug>. Yayından kaldırılmış bir haberin adresi
  // "bulunamadı" ekranını 200 durumuyla döndürüyordu.
  const haber = p.match(/^\/(tr|en)\/newsItem\/([^/]+)$/);
  if (haber) {
    try {
      const y = await fetch(`${API_TABAN}/api/${haber[1]}/newsItem/${encodeURIComponent(haber[2])}`);
      return y.status === 404;
    } catch {
      return false;
    }
  }

  if (!/^\/(tr|en)\/[^/]+$/.test(p)) return false;   // ana sayfa, panel, dosyalar

  const yollar = await yayindakiYollar();
  if (yollar.size === 0) return false;
  if (yollar.has(p.toLowerCase())) return false;

  // Listede yok: panelden yeni eklenmiş olabilir. "Sayfa yok" demeden önce
  // liste bir kez tazelenir; aksi hâlde yeni sayfa bir dakika boyunca
  // bulunamadı görünürdü.
  yolOnbellek = null;
  const tazelenmis = await yayindakiYollar();
  return tazelenmis.size > 0 && !tazelenmis.has(p.toLowerCase());
}

/* ---------- site haritası ve robots ---------- */

app.get('/sitemap.xml', async (_req, res) => {
  const yollar = [...(await yayindakiYollar())]
    .filter((y) => !/^\/(tr|en)\/home$/.test(y))   // ana sayfanın ikinci adresi
    .filter((y) => !hataliSayfalar.has(y))         // kaynakta içeriği olmayan pages
    .sort();
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
 * Varlık dosyaları için büyük/küçük harf toleransı.
 *
 * Daha önce sunucu, büyük harf içeren tüm adresleri küçük harfe kalıcı (301)
 * yönlendiriyordu. Angular'ın ürettiği dosya adlarında büyük harf bulunduğu
 * için (styles-CYIGEJUB.css) bu dosyalar da yönlendiriliyordu. Yönlendirme
 * kuralı düzeltildi, ancak "kalıcı" yönlendirmeyi görmüş tarayıcılar bunu
 * diskte saklar ve düzeltmeden sonra da küçük harfli adresi istemeyi sürdürür.
 *
 * Bu yüzden küçük harfli istek doğru dosyaya eşlenir; kullanıcıların önbellek
 * temizlemesi gerekmez.
 */
const varlikEsleme = new Map<string, string>();
try {
  for (const name of readdirSync(browserDistFolder)) {
    if (/\.(js|css)$/i.test(name)) varlikEsleme.set(name.toLowerCase(), name);
  }
} catch {
  // Derleme çıktısı yoksa (geliştirme sunucusu) eşleme boş kalır
}

app.use((req, res, next) => {
  const name = req.path.slice(1);
  if (!/^[^/]+\.(js|css)$/i.test(name)) return next();
  const gercek = varlikEsleme.get(name.toLowerCase());
  if (!gercek || gercek === name) return next();
  res.sendFile(join(browserDistFolder, gercek));
});

/**
 * Panelden yüklenen belgeler. Backend bu dizine yazar, ön yüz sunar;
 * ikisi aynı Docker birimini paylaşır. Aktarımdan gelen belgeler ise
 * uygulama imajındaki public/dosyalar altındadır ve aşağıdaki genel
 * statik sunum tarafından karşılanır.
 */
app.use(
  '/dosyalar',
  express.static(process.env['BIDB_DOSYA_DIZINI'] ?? '/veri/dosyalar', {
    maxAge: '1d',
    index: false,
    redirect: false,
    fallthrough: true
  }),
);

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

    // Durum kodu ve başlıklar yanıtın kendisinden okunur; bu yüzden
    // değiştirilecekse yeni bir yanıt oluşturulmalıdır.
    //
    // Content-Length mutlaka düşürülür: gövde sıkıştırıldığında bu değer
    // yanlış kalır ve tarayıcı sayfayı yarıda keser.
    const basliklar = new Headers(yanit.headers);
    basliklar.delete('content-length');

    return writeResponseToNodeResponse(
      new Response(yanit.body, { status: bulunamadi ? 404 : yanit.status, headers: basliklar }),
      res,
    );
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
