# Güvenlik Test Matrisi

Tüm testler **yerel Docker ortamında** çalıştırıldı. Üretime hiçbir test yapılmadı.
Veri değiştiren testlerde oluşturulan kayıtlar test sonunda silindi ve gerçek
kayıtların korunduğu doğrulandı.

Kısaltmalar: **✅** doğrulandı · **⬜** çalıştırılamadı (gerekçe belirtildi)

---

## 1. Yetkilendirme matrisi

| Uç | Metot | Kimliksiz | Yetkili (admin) | Beklenen | Durum |
|---|---|---|---|---|---|
| `/api/tr/**`, `/api/en/**` | GET | 200 | 200 | Herkese açık okuma | ✅ |
| `/api/de/**`, `/api/xx/**` | GET | **401** | — | Yalnızca tr/en | ✅ |
| `/api/admin/pages` | GET | **401** | 200 | Kimlik ister | ✅ |
| `/api/admin/quality` | GET | **401** | 200 | Kimlik ister | ✅ |
| `/api/admin/files` | GET/POST | **401** | 200 | Kimlik ister | ✅ |
| `/api/admin/contact-tickets` | GET | **401** | 200 | Kimlik ister | ✅ |
| `/api/admin/login-events` | GET | **401** | 200 | Kimlik ister | ✅ |
| `/api/admin/audit-log` | GET | **401** | 200 | Kimlik ister | ✅ |
| `/api/admin/news` | POST | **401** | — | Kimlik ister | ✅ |
| `/api/admin/staff` | GET | **401** | 200 | Kimlik ister | ✅ |
| `/api/contact/tickets` | POST | 201 | — | Kimliksiz kabul (oran sınırlı) | ✅ |
| `/api/metrics/vitals` | POST | 204 | — | Kimliksiz kabul (oran sınırlı) | ✅ |
| `/api/gizli` (tanımsız) | GET | **401** | — | `denyAll` varsayılan | ✅ |
| `/actuator/health` | GET | 200 | 200 | Asgari bilgi | ✅ |
| `/actuator/env,beans,heapdump,loggers,metrics,configprops,threaddump,shutdown` | GET | **401** | — | Kapalı | ✅ |

**Not — nesne düzeyi yetkilendirme (IDOR/BOLA):** Bu uygulamada **kullanıcıya ait
kaynak kavramı yoktur**. Tek paylaşılan yönetici hesabı vardır ve tüm yönetim
verisi o hesaba açıktır; ziyaretçi tarafında kişiye özel kayıt yoktur. Dolayısıyla
"başka kullanıcının kaydını okuma" senaryosu **uygulanamaz**. Bunun yerine
geçersiz/negatif kimlik davranışı test edildi:

| Test | Sonuç | Durum |
|---|---|---|
| `DELETE /api/admin/news/-1` | 404 | ✅ |
| `DELETE /api/admin/news/0` | 404 | ✅ |
| `DELETE /api/admin/news/999999999` | 404 | ✅ |
| `DELETE /api/admin/news/abc` | 400 | ✅ |

---

## 2. Kimlik doğrulama ve oran sınırlama

| Test | Beklenen | Ölçülen (düzeltme öncesi) | Ölçülen (sonrası) | Durum |
|---|---|---|---|---|
| Yönetici: 11 başarısız deneme, XFF yok | 8×401, sonra 429 | 401×8 → 429×3 | aynı | ✅ |
| **Yönetici: XFF döndürülerek 15 deneme** | 8×401, sonra 429 | **401×15 (ATLATILDI)** | 401×8 → 429×7 | ✅ |
| Yönetici: backend'e doğrudan, sahte XFF | Başlık yok sayılmalı | 401×15 | 401×8 → 429 | ✅ |
| **İletişim formu: XFF döndürülerek 8 talep** | 5 kabul, sonra 429 | **201×8 (ATLATILDI)** | 201×5 → 429×3 | ✅ |
| Sahte `X-Bidb-Yerel-Adres` kayda geçiyor mu | Yok sayılmalı | **Geçti** | Yok sayıldı | ✅ |
| Hareketsizlik zaman aşımı (30 dk) | Oturum kapanmalı | yoktu | eklendi (`cb17412`) | ⬜ süre gerektirdiği için uçtan uca beklenmedi; mantık ve derleme doğrulandı |

---

## 3. Girdi doğrulama ve enjeksiyon

| Test | Girdi | Beklenen | Sonuç | Durum |
|---|---|---|---|---|
| SQL enjeksiyonu | `/api/tr/pages/' OR 1=1--` | Sızıntı yok | 404, yığın izi yok | ✅ |
| Boş bayt / yol kaçışı | `%00%2e%2e%2f%2e%2e%2fetc%2fpasswd` | Reddedilmeli | 400 | ✅ |
| Tamsayı taşması | `/api/tr/news/-999999999999999999999` | Temiz hata | 404 | ✅ |
| Aşırı uzun yol | 5000 karakter | Temiz hata | 404 | ✅ |
| Bozuk JSON | `BOZUK-JSON{{{` | Temiz 400 | 400, yığın izi yok | ✅ |
| Tip uyuşmazlığı | `"value":"BOZUK"` (sayı beklenirken) | Temiz 400 | 400 | ✅ |
| **Sütun sınırı aşımı** | 600 karakterlik başlık | Temiz 400 | **500 → düzeltildi → 400 + açıklama** | ✅ |
| Bal küpü dolu | `website=doldurulmus` | Reddedilmeli | 400 | ✅ |
| ReDoS | 24.000 karakter saldırgan desen | <1 sn | **0,2 ms** (ölçüldü) | ✅ |

---

## 4. Dosya yükleme

| Test | Beklenen | Sonuç | Durum |
|---|---|---|---|
| `kotu.svg` | Reddedilmeli (gömülü script riski) | 400 "izin verilmiyor: svg" | ✅ |
| `kotu.html` | Reddedilmeli | 400 | ✅ |
| `kotu.js` | Reddedilmeli | 400 | ✅ |
| `kotu.php` | Reddedilmeli | 400 | ✅ |
| `kotu.pdf.exe` (çift uzantı) | Reddedilmeli | 400 "exe" — doğru çözümlendi | ✅ |
| `gecerli.pdf` | Kabul | 200 | ✅ (test dosyası silindi) |
| Yol kaçışı (dosya adında) | Dizin dışına yazamamalı | `normalize()` + `startsWith()` denetimi | ✅ kod incelemesi |
| Boyut sınırı | 25 MB üstü red | Kod düzeyinde doğrulandı | ✅ |
| 6 MB gövde (SSR sınırı 5 MB) | 413 | 413 | ✅ |

---

## 5. HTTP, başlıklar ve yönlendirme

| Test | Beklenen | Sonuç | Durum |
|---|---|---|---|
| CSP başlığı + istek başına nonce | Var, her istekte farklı | Var, tekil nonce, yer tutucu sızıntısı yok | ✅ |
| HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy | Var | Tümü var | ✅ |
| `frame-ancestors 'self'` | Var | Var (clickjacking) | ✅ |
| `/yonetim` önbelleklenebilirliği | `no-store` | **yoktu → eklendi** | ✅ |
| Kimlikli API yanıtı | `no-store` | Var | ✅ |
| `TRACE /tr/about` | 405 | **500 → düzeltildi → 405** | ✅ |
| `PUT/DELETE/PATCH/POST /tr/about` | 405 | **200 → düzeltildi → 405** | ✅ |
| `GET/HEAD /tr/about` | 200 | 200 | ✅ |
| Açık yönlendirme (`//evil`, `/\evil`, `https://evil`) | Dışarı çıkmamalı | Tümü iç hata sayfası | ✅ |
| Host başlığı enjeksiyonu | Reddedilmeli | 400 (`ALLOWED_HOSTS`) | ✅ |
| **Vekil yol kaçışı** `/api/%2e%2e/actuator/health` | Reddedilmeli | **200 → düzeltildi → 400** | ✅ |
| Vekil yol kaçışı `.%2e`, `..` | Reddedilmeli | 400 | ✅ |
| Meşru `/api/tr/home`, `/api/tr/pages/about` | 200 | 200 | ✅ |
| CORS | Yalnızca GET + açık liste | Kod düzeyinde doğrulandı | ✅ |

---

## 6. Bilgi sızıntısı

| Test | Sonuç | Durum |
|---|---|---|
| Yığın izi (6 farklı düşmanca girdi) | Hiçbirinde sızmadı | ✅ |
| Yanıtta `password/hash/secret/token` alanı (7 uç) | Bulunmadı | ✅ |
| Actuator `env/heapdump/beans/mappings` | 401 | ✅ |
| `/actuator/health` içeriği | Yalnızca `status` + `groups` | ✅ |
| Depoda gizli bilgi | Bulunmadı | ✅ |
| Git geçmişinde gizli bilgi | Bulunmadı (`git log --all -p` desen taraması) | ✅ |

---

## 7. Bağımlılık

| Test | Sonuç | Durum |
|---|---|---|
| `npm audit --omit=dev` | 0 zafiyet | ✅ |
| `npm audit` (dev dâhil) | 12 (yalnızca test araçlarında, üretime girmiyor) | ✅ değerlendirildi |
| OSV toplu sorgu (22 Java paketi) — önce | **22 kayıt** | ✅ |
| Uygulanabilirlik analizi | Hiçbiri bu yapılandırmada sömürülebilir değil | ✅ |
| OSV — yükseltme sonrası | **0 kayıt** | ✅ |

---

## 8. Regresyon / işlevsel doğrulama

Her güvenlik düzeltmesinden sonra çalıştırıldı:

| Kontrol | Sonuç | Durum |
|---|---|---|
| Tüm sayfa tipleri (TR/EN, 11 sayfa) | 200 (0,09–0,37 sn) | ✅ |
| `/error/404` | 404 (yumuşak 404 değil) | ✅ |
| Hata kodları 400/401/403/404/500/503 | Doğru HTTP durumu | ✅ |
| `sitemap.xml` — 161 adres | Hepsi 200, robots ile çelişki yok | ✅ |
| Sayfa belgeleri — 80 adet | 0 kırık (2 kırık bulundu, düzeltildi) | ✅ |
| Duyuru hedefleri — 34 adet | 0 kırık | ✅ |
| Varlıklar (görsel/CSS/JS) — 71 adet | 0 kırık | ✅ |
| İletişim formu uçtan uca | 201 + talep ve CREATED olayı birlikte | ✅ (test kaydı silindi) |
| Yönetim paneli yükleniyor | 200 | ✅ |
| API sözleşmesi (bağımlılık yükseltmesi sonrası) | Genel 200, yetkisiz 401, yetkili 200 | ✅ |
| TypeScript tam sıkı derleme | Hatasız | ✅ |
| Backend derleme + açılış | Sağlıklı (healthcheck) | ✅ |

---

## Otomatik regresyon testi durumu

⬜ **Eklenemedi.** Depoda çalışan bir test altyapısı bulunmuyor (backend'de
`src/test` yok, frontend testleri karma/jasmine bağımlılıklarıyla tanımlı ama
koşulmuyor). Güvenlik düzeltmeleri **çalıştırılmış kavram ispatlarıyla**
doğrulandı; bunlar `SECURITY_AUDIT.md` içinde komut ve ölçümleriyle kayıtlı.

**Öneri (P3):** Aşağıdakiler için MockMvc/Testcontainers tabanlı regresyon testi
yazılmalı — her biri bu turda elle doğrulandı:

1. Sahte XFF ile oran sınırının atlatılamaması
2. Yetkisiz isteğin `/api/admin/**` üzerinde 401 alması
3. `/api/%2e%2e/...` biçimindeki vekil kaçışının 400 alması
4. Yasaklı uzantılı dosya yüklemenin 400 alması
5. Sütun sınırını aşan girdinin 400 (500 değil) alması
6. Hata yanıtlarında yığın izi bulunmaması
7. GET/HEAD dışı metotların sayfa yollarında 405 alması
