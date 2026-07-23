# API Belgesi

Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı web sitesi — HTTP arayüzü.

Bu belge, siteye dışarıdan bağlanacak sistemler için yazılmıştır. Tüm uçlar
JSON döndürür; kodlama UTF-8'dir.

**Taban adres:** `https://bidb.hacettepe.edu.tr`

---

## Dil

Ziyaretçi uçlarının tamamı dil kodu içerir:

    /api/{dil}/...        dil = tr | en

Örnek: `/api/tr/pages/about` · `/api/en/pages/about`

Türkçe ve İngilizce içerik ayrı kayıtlardır. Bir sayfanın her iki dilde de
bulunması zorunlu değildir; İngilizce tarafta daha az sayfa vardır.

---

## Ziyaretçi uçları

Kimlik doğrulaması gerekmez, yalnızca okuma yaparlar.

### Sayfalar

| Uç | Açıklama |
|---|---|
| `GET /api/{dil}/pages` | Yayındaki sayfaların listesi (içerik metni olmadan) |
| `GET /api/{dil}/pages/{slug}` | Tek sayfa, içeriğiyle birlikte |

```json
{
  "slug": "about",
  "language": "tr",
  "title": "Genel Tanıtım",
  "contentHtml": "<div class=\"icerik\">…</div>",
  "seoTitle": null,
  "seoDescription": null,
  "seoKeywords": null,
  "documents": [
    { "name": "E-Posta Yönergesi", "url": "/dosyalar/epostayonergesi22.pdf", "fileType": "PDF" }
  ],
  "hasTranslation": true,
  "brokenContent": false
}
```

| Alan | Anlamı |
|---|---|
| `slug` | Adresin son parçası; `/tr/{slug}` sayfayı açar |
| `contentHtml` | Sayfa gövdesi, HTML. Kaynak siteden birebir aktarılmıştır |
| `documents` | Sayfaya bağlı indirilebilir belgeler |
| `hasTranslation` | Aynı slug diğer dilde de var mı (hreflang için) |
| `brokenContent` | Kaynak sitede içeriği olmayan sayfa (hata metni döndürüyor) |

Sayfa bulunamazsa **404** döner.

### Ana sayfa

    GET /api/{dil}/home

Ana sayfanın tüm bileşenleri tek istekte gelir:

```json
{
  "slider":    [ { "title": "…", "subtitle": "…", "imageUrl": "/images/r1.jpg", "imageAlt": "…", "linkUrl": null } ],
  "shortcuts": [ { "name": "E-Posta", "iconUrl": "/images/icon/eposta.png", "url": "…", "newTab": true } ],
  "services":  [ { "name": "…", "iconUrl": "…", "url": "…", "newTab": true } ],
  "news":      [ { "title": "…", "date": "2026-07-22", "url": "…", "summary": "…",
                   "imageUrl": null, "imageAlt": null, "hasOwnPage": false } ]
}
```

`shortcuts` üstteki ikon ızgarasını, `services` alttaki karuseli besler.
Ayrım veritabanındaki `shortcut.type` sütunundadır.

### Haber ve duyurular

| Uç | Açıklama |
|---|---|
| `GET /api/{dil}/news` | Tüm haberler, en yeni önce |
| `GET /api/{dil}/news/{slug}` | Tek haber |

Bir duyuru iki biçimde olabilir:

- **Kısa duyuru** — `slug` boştur, tıklanınca `externalUrl` adresine gidilir
- **Görselli haber** — `slug` doludur, `/{dil}/duyuru/{slug}` adresinde kendi
  sayfasında açılır; `imageUrl` ve `contentHtml` taşır

`news[].hasOwnPage` alanı bu ayrımı bildirir.

### Menü

    GET /api/{dil}/menus?position=sol

```json
[ { "title": "Kurumsal",
    "items": [ { "label": "Genel Tanıtım", "url": "/tr/about", "newTab": false } ] } ]
```

`url` ya site içi bir yol ya da dış adrestir; ikisi ayrı alan değildir çünkü
tüketici için fark yoktur.

### Diğer

| Uç | Döndürdüğü |
|---|---|
| `GET /api/{dil}/slides` | Slider görselleri |
| `GET /api/{dil}/social-accounts` | Kurumun sosyal medya hesapları |
| `GET /api/{dil}/contact-channels` | Adres, telefon, e-posta, faks — her biri ayrı kayıt |
| `GET /api/{dil}/settings` | Site geneli anahtar-değer ayarları |
| `GET /api/{dil}/redirects` | Adres değişikliklerinden doğan yönlendirmeler |

İletişim kaydı:

```json
{ "id": 1, "language": "tr", "type": "phone", "label": null,
  "value": "+90 312 297 62 62", "sortOrder": 0, "published": true }
```

`type`: `address` · `phone` · `email` · `fax`

---

## Yönetim uçları

    /api/admin/...

**Kimlik doğrulaması zorunludur** (HTTP Basic). Kimlik bilgisi olmadan
yapılan istek **401** döner. Yalnızca HTTPS üzerinden kullanılmalıdır.

```
Authorization: Basic <base64(kullanıcı:parola)>
```

### Sayfalar

| Yöntem | Uç | İşlem |
|---|---|---|
| `GET` | `/api/admin/pages` | Tüm sayfalar (yayında olmayanlar dâhil) |
| `POST` | `/api/admin/pages` | Yeni sayfa |
| `PUT` | `/api/admin/pages/{id}/seo` | Başlık, açıklama, anahtar kelimeler, yayın durumu |
| `PUT` | `/api/admin/pages/{id}/content` | Sayfa metni (önceki hâl sürüm olarak saklanır) |
| `PUT` | `/api/admin/pages/{id}/address` | Adres değişikliği (eski adres yönlendirilir) |
| `DELETE` | `/api/admin/pages/{id}` | Sayfayı sil |

### Sürüm geçmişi

| Yöntem | Uç | İşlem |
|---|---|---|
| `GET` | `/api/admin/pages/{id}/revisions` | Sayfanın geçmiş hâlleri |
| `GET` | `/api/admin/pages/revisions/{revisionId}` | Tek sürümün içeriği |
| `POST` | `/api/admin/pages/{id}/restore/{revisionId}` | O sürüme dön |

Her kayıttan önce mevcut hâl saklanır; geri alma işlemi de geri alınabilir.

### Belgeler ve dosya yükleme

| Yöntem | Uç | İşlem |
|---|---|---|
| `GET` | `/api/admin/pages/{id}/documents` | Sayfaya bağlı belgeler |
| `POST` | `/api/admin/pages/{id}/documents` | Belge satırı ekle |
| `PUT` | `/api/admin/pages/documents/{documentId}` | Belgeyi güncelle |
| `DELETE` | `/api/admin/pages/documents/{documentId}` | Belgeyi sil |
| `GET` | `/api/admin/files` | Yüklenen dosyalar |
| `POST` | `/api/admin/files` | Dosya yükle (`multipart/form-data`, alan adı `dosya`) |
| `DELETE` | `/api/admin/files/{id}` | Dosyayı sil |

Yükleme sınırları: en fazla **25 MB**; yalnızca belge ve görsel biçimleri
(`pdf, doc, docx, xls, xlsx, ppt, pptx, odt, ods, zip, rar, jpg, jpeg, png,
gif, webp, svg`). HTML ve betik dosyaları güvenlik gereği reddedilir.

Başarılı yükleme:

```json
{ "url": "/dosyalar/kilavuz.pdf", "fileName": "kilavuz.pdf", "sizeBytes": 245312 }
```

### Diğer yönetim uçları

| Kaynak | Uçlar |
|---|---|
| Haberler | `GET/POST /api/admin/news`, `PUT/DELETE /api/admin/news/{id}` |
| Slider | `GET /api/admin/slides/list`, `POST /api/admin/slides`, `PUT/DELETE /api/admin/slides/{id}` |
| Kısayollar | `GET /api/admin/shortcuts/list`, `POST /api/admin/shortcuts`, `PUT/DELETE /api/admin/shortcuts/{id}` |
| Menüler | `GET /api/admin/menus`, `POST/PUT/DELETE /api/admin/menus[/{id}]`, öğeler için `/api/admin/menus/items` |
| Sosyal medya | `GET/POST /api/admin/social-accounts`, `PUT/DELETE .../{id}` |
| İletişim | `GET/POST /api/admin/contact-channels`, `PUT/DELETE .../{id}` |
| Ayarlar | `GET/PUT /api/admin/settings` |

---

## Durum kodları

| Kod | Anlamı |
|---|---|
| `200` | Başarılı |
| `204` | Başarılı, gövde yok (silme işlemleri) |
| `301` | Adres kalıcı olarak taşındı (eski Türkçe adresler) |
| `400` | Geçersiz istek — gövdede Türkçe açıklama döner |
| `401` | Kimlik doğrulaması gerekli veya hatalı |
| `404` | Kayıt bulunamadı |
| `500` | Sunucu hatası |

---

## Adres yapısı ve yönlendirmeler

Sayfa adresleri İngilizcedir ve iki dilde aynıdır:

    /tr/about        /en/about

Sitenin önceki Türkçe adresleri kalıcı yönlendirmeyle (301) taşınmıştır:

    /tr/geneltanitim  ->  /tr/about
    /tr/sss           ->  /tr/faq

Panelden bir sayfanın adresi değiştirilirse yeni bir yönlendirme kaydı
oluşur; `GET /api/{dil}/redirects` bunları listeler.

---

## Notlar

**Sayfa içeriği HTML'dir ve kaynak siteden birebir aktarılmıştır.** İçindeki
CSS sınıf adları (`icerik`, `kisayol` gibi) kaynak sitenin stil yapısına
aittir; içeriği gösterecek tarafın bunları dikkate alması gerekir.

**Belge ve görsel adresleri görelidir** (`/dosyalar/…`, `/images/…`) ve site
kendi sunucusundan verir; kaynak sunucuya bağımlılık yoktur.

**Sıralama** `sortOrder` alanına göredir; küçük değer önce gelir.

**Yayın durumu** `published` alanı ile denetlenir; ziyaretçi uçları yalnızca
yayındaki kayıtları döndürür.
## SEO ve indeksleme

`GET /api/{language}/pages/{slug}` yanıtı içerikle birlikte `seoTitle`,
`seoDescription`, `seoKeywords`, `seoImage`, `seoRobots`, `seoSchemaType` ve
`updatedAt` alanlarını döndürür. Angular SSR bu alanları ilk HTML yanıtında
title, canonical, Open Graph, Twitter Card ve JSON-LD olarak yayınlar.

Ana sayfanın SEO kaydı `GET /api/{language}/home` yanıtındaki `seo` alanıdır.
Bu değer veritabanındaki `home` sayfasından gelir; slider ve duyurular gibi
panelden değiştirilebilir. Haber detayları kendi SEO alanlarını ve
`NewsArticle` yapılandırılmış verisini kullanır.

`/sitemap.xml` yayınlanan sayfaları ve kendi adresi bulunan haberleri
backend'den dinamik toplar. `/robots.txt`, yönetim, API ve hata rotalarını
indeks dışında bırakır.

## Kalite ölçümü

`POST /api/metrics/vitals` kamusal sayfanın anonim Core Web Vitals örneklerini
kabul eder. İstek yalnızca `path` ile en fazla beş `name/value` metriği taşır:
LCP, INP, CLS, FCP ve TTFB. Backend eşikleri ve değerlendirmeyi kendisi
hesaplar; istemciden gelen bir puana güvenmez. IP, user-agent, referrer, çerez
ve oturum kimliği veri modelinde bulunmaz. Örnekler 90 gün sonra otomatik
silinir.

`GET /api/admin/quality?days=28` yetkili yöneticiye şunları döndürür:

- tüm yayınların alan ve uzunluk kurallarına göre SEO puanı;
- sayfa başına eksik SEO maddeleri;
- rota/metrik bazında 75. yüzdelik gerçek kullanıcı değerleri;
- Google Web Vitals eşiklerinden üretilen performans puanı.

## Anonim kullanım analitiği

`POST /api/metrics/page-view` ziyaret edilen kamusal rotayı, genel cihaz
sınıfını (`mobile`, `tablet`, `desktop`) ve trafik kaynağı kategorisini kabul
eder. Tam referrer adresi, IP, user-agent, çerez, oturum veya ziyaretçi
tanımlayıcısı veri modelinde bulunmaz. Olaylar aylık karşılaştırma için en fazla
24 ay saklanır.

`GET /api/admin/analytics?months=12` kimlik doğrulanmış yöneticiye aylık ve son
30 günlük trafik serisini, cihaz ve kaynak dağılımını, toplamları ve her rota
için bu ay/geçen ay karşılaştırmasını döndürür. `months` değeri 1–24 aralığına
sınırlandırılır.
