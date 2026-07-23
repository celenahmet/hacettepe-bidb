# Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı — Web Sitesi

Mevcut `bidb.hacettepe.edu.tr` sitesinin yenilenmesi projesi.
İçerikler kaynak siteden **birebir** aktarılmıştır; hiçbir metin değiştirilmemiştir.

> **Projeyi devralıyorsanız önce [docs/devir-notu.md](docs/devir-notu.md) okuyun.**
> Kararların gerekçeleri, ihlal edilemez kurallar ve pahalıya mal olan hatalar orada.

## Mimari

| Katman | Teknoloji |
|---|---|
| Backend | Spring Boot 3.3 (Java 21) — REST API |
| Veritabanı | PostgreSQL 16 (şema Flyway ile yönetilir) |
| Frontend | Angular 20 + SSR (sunucu tarafı render) |

Yönetilebilir alanlar: sayfa içerikleri, menüler, slider, sosyal medya hesapları,
sayfa başına SEO bilgileri (title, description, keywords).

## Adres yapısı

```
/tr/<slug>      Türkçe sayfalar     örn. /tr/geneltanitim
/en/<slug>      İngilizce sayfalar  örn. /en/overview
```

## Çalıştırma

Makineye Java, Maven, Node veya PostgreSQL kurmaya gerek yoktur; hepsi kap içinde çalışır.
Tek gereksinim **Docker**'dır. Aynı komutlar Windows ve macOS'ta çalışır.

```bash
docker compose up -d db        # yalnızca veritabanı
docker compose up -d backend   # veritabanı + REST servisi
docker compose up -d           # tümü: veritabanı + servis + site
docker compose down            # durdur (veriler kalır)
docker compose down -v         # durdur ve veritabanını sıfırla
```

| Servis | Adres |
|---|---|
| REST API | http://localhost:8081 |
| PostgreSQL | localhost:5432 (kullanıcı/parola/veritabanı: `bidb`) |
| Site (SSR) | http://localhost:4000 |

> API dışarıya **8081** portundan açılır; 8080 birçok geliştirme makinesinde
> başka bir servis tarafından kullanıldığı için tercih edilmemiştir.
> Kaplar kendi aralarında `backend:8080` üzerinden haberleşir.

### Frontend'i ayrı çalıştırma

```bash
cd frontend
npm install
npm start          # http://localhost:4200
npm run build      # SSR dahil üretim derlemesi
```

> **Önemli:** Veritabanı göç dosyaları backend imajının içine kopyalanır.
> İçerik veya şema değiştiğinde imajı yeniden derlemek gerekir
> (`docker compose up -d --build backend`); yalnızca yeniden başlatmak
> eski verilerle çalışır.

## REST uçları

| Uç | Açıklama |
|---|---|
| `GET /api/{dil}/sayfa/{slug}` | Sayfa içeriği, SEO alanları ve bağlı belgeler |
| `GET /api/{dil}/sayfalar` | Sayfa listesi (içerik olmadan) |
| `GET /api/{dil}/menu?konum=sol` | Menü ve alt bağlantıları |
| `GET /api/{dil}/slider` | Ana sayfa slider görselleri |
| `GET /api/{dil}/sosyal` | Sosyal medya hesapları |
| `GET /actuator/health` | Servis sağlık durumu |

## Proje düzeni

```
backend/                     Spring Boot uygulaması
  src/main/java/.../model    JPA varlıkları (Sayfa, Menu, Slider, Belge…)
  src/main/java/.../repo     Veri erişimi
  src/main/java/.../web      REST denetleyicileri
  src/main/java/.../dto      Ön yüze gönderilen veri yapıları
  src/main/resources/db/migration
    V1__sema.sql             Tablolar
    V2__tohum.sql            Aktarılan içerik (üretilmiş dosya, elle düzenlenmez)

frontend/                    Angular 20 + SSR

content/                     Kaynak siteden aktarılan içerik (JSON)
  tr/<slug>.json             Başlık, SEO, paragraflar, bağlantılar, belgeler
  en/<slug>.json
  _kabuk.json                Sol menü ve sosyal medya hesapları
  _menu.json                 Menü yapısı

tools/
  crawl.js                   Kaynak siteden içerik indirir
  extract.js                 HTML'den içerik ayıklama
  seed.js                    content/*.json → V2__tohum.sql
  verify-content.js          Veritabanı ile canlı siteyi karşılaştırır
```

## İçerik doğrulama

İçeriğin değişmediği iddiası ölçülerek kanıtlanır: `verify-content.js`, veritabanındaki
her sayfanın metnini kaynak sitedeki canlı sayfayla karakter karakter karşılaştırır.

```bash
node tools/verify-content.js
```

Son çalıştırma sonucu:

```
38 sayfa birebir aynı, 0 sayfa farklı.
```

İçerik yeniden aktarılacaksa sıra şudur:

```bash
node tools/crawl.js          # kaynaktan indir
node tools/seed.js           # V2__tohum.sql üret
docker compose down -v       # veritabanını sıfırla
docker compose up -d backend # Flyway şemayı ve içeriği yeniden yükler
node tools/verify-content.js # doğrula
```

## İki makinede çalışma

Depo Windows ve macOS arasında paylaşılmaktadır. `.gitattributes` dosyası satır
sonlarını depoda LF olarak sabitler; bu olmadan dosyalar karşı makinede
"değişmiş" görünür ve kabuk betikleri bozulur.

## Aktarım durumu

- **33 Türkçe sayfa** — yaklaşık 58.000 karakter metin
- **5 İngilizce sayfa** — kaynak sitede İngilizce içerik sınırlıdır
- **50 belge bağlantısı** (form, yönerge, kılavuz)
- **38 menü öğesi**, 8 menü başlığı, 3 sosyal medya hesabı
