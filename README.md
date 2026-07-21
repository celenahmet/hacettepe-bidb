# Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı — Web Sitesi

Mevcut `bidb.hacettepe.edu.tr` sitesinin yenilenmesi projesi.

## Mimari

| Katman | Teknoloji |
|---|---|
| Backend | Spring Boot (REST API) |
| Veritabanı | PostgreSQL |
| Frontend | Angular |

Yönetilebilir alanlar: sayfa içerikleri, menüler, slider, sosyal medya hesapları,
sayfa başına SEO bilgileri (title, description, keywords).

## Adres yapısı

```
/tr/<slug>      Türkçe sayfalar     örn. /tr/geneltanitim
/en/<slug>      İngilizce sayfalar  örn. /en/overview
```

## Proje düzeni

```
content/           Mevcut siteden aktarılan içerik (JSON)
  tr/<slug>.json   Türkçe sayfalar: başlık, SEO, paragraflar, bağlantılar, belgeler
  en/<slug>.json   İngilizce sayfalar
  _kabuk.json      Sol menü ve sosyal medya hesapları
  _menu.json       Menü yapısı (bölüm → sayfa)
  _ozet.json       Aktarım özeti (sayfa başına karakter ve belge sayısı)

tools/             İçerik aktarım araçları
  crawl.js         Kaynak siteden sayfaları indirir
  extract.js       HTML'den içerik ayıklama
  crawl-home.js    Ana sayfa bileşenleri (slider, hızlı erişim, duyurular)
```

## İçerik aktarımını yeniden çalıştırma

```bash
node tools/crawl.js        # tüm sayfaları yeniden indirir
node tools/crawl-home.js   # ana sayfa bileşenlerini çıkarır
```

## Aktarım durumu

- **33 Türkçe sayfa** — yaklaşık 58.000 karakter metin
- **5 İngilizce sayfa** — kaynak sitede İngilizce içerik sınırlı
- **63 belge bağlantısı** (form, yönerge, kılavuz)
- Sol menü, sosyal medya hesapları ve iletişim bilgileri ayrıca çıkarıldı
