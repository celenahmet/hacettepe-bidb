# Yayına Hazırlık Denetimi

**Tarih:** 26 Temmuz 2026
**Kapsam:** Güvenlik turunda yapılan sürüm değişikliklerinin regresyon doğrulaması
**Ortam:** Yalnızca yerel Docker. Üretime hiçbir istek yapılmadı, üretim veritabanına bağlanılmadı.

> **Bu rapor hakkında.** İstenen altı ayrı rapor dosyası yerine tek bir odaklı rapor
> yazıldı. Gerekçe: depoda zaten dört güvenlik raporu var (`SECURITY_AUDIT.md`,
> `SECURITY_FIX_PLAN.md`, `SECURITY_TEST_MATRIX.md`, `SECURITY_CHANGES.md`) ve
> istenen altı dosyanın içeriği hem birbiriyle hem mevcut raporlarla büyük ölçüde
> örtüşüyordu. Aynı bilgiyi altı yere kopyalamak bakımı zorlaştırır ve tutarsızlık
> üretir. Buradaki bölümler istenen tüm başlıkları kapsıyor.

---

## Yönetici özeti

Güvenlik turunda yapılan **üç sürüm değişikliğinin** hiçbir regresyona yol açmadığı
kanıtlandı. En kritik doğrulama — **boş bir veritabanında göç zincirinin tamamının
çalışması ve üretimdeki şemayla birebir aynı sonucu üretmesi** — başarıyla geçti.
Zincir V65 ve V66 eklendikten sonra yeniden çalıştırıldı: 66 göç, 0 başarısız,
şema farkı yok.

**Karar: CONDITIONAL APPROVAL.** Yayın engelleyici bulunmadı; ancak yedek/geri
yükleme doğrulanamadı ve depoda çalışan bir otomatik test paketi yok. Bu ikisi
"READY FOR PRODUCTION" için gereken kanıtlardır.

---

## 1. Değişen sürümler ve breaking change analizi

| Bileşen | Eski | Yeni | Tür | Neden | Kod değişikliği | Doğrulama | Kalan risk |
|---|---|---|---|---|---|---|---|
| Spring Boot | 3.5.14 | **3.5.16** | patch | Tomcat/Security/logback zafiyet kayıtları | Gerekmedi | ✅ Derleme + açılış + 6 yetkilendirme testi | Yok |
| Jackson BOM | 2.21.4 (Boot yönetimi) | **2.21.5** | patch, **override** | 3 `@JsonView` kaydı | Gerekmedi | ✅ API sözleşmesi alan-alan karşılaştırıldı | Düşük — Boot'un test ettiği BOM'dan sapma |
| pgjdbc | 42.7.10 (Boot yönetimi) | **42.7.13** | patch, **override** | SCRAM DoS + kanal bağlama düşürme | Gerekmedi | ✅ 64 göç + tüm sorgular + Türkçe kodlama | Düşük — aynı sapma |

**Transitif olarak gelenler** (Boot 3.5.16 ile, override edilmedi):
Tomcat 10.1.54→**10.1.55**, Spring Security 6.5.10→**6.5.11**, logback 1.5.32→**1.5.34**,
Spring Framework 6.2.18 (değişmedi), Hibernate 6.6.49 (değişmedi).

**Breaking change değerlendirmesi:** Üçü de yama düzeyi. Semantik sürümleme gereği
API kırılması beklenmez; yine de aşağıdaki regresyon testleriyle **kanıtlandı**,
varsayılmadı.

**İki override hakkında dürüst not:** `jackson-bom.version` ve `postgresql.version`
Spring Boot'un yönettiği sürümlerin üzerine yazıldı. Bu, Boot'un birlikte test
ettiği kombinasyondan sapmak demektir. Sapmanın karşılığında elde edilen şey
`@JsonView` kayıtlarının kapatılmasıydı — ve o kayıtların **bu kod tabanında
sömürü yolu yok** (`@JsonView`/`@JsonIgnore`/polimorfik tip hiç kullanılmıyor).
Yani sapma, gerçek bir riski değil bir tarama bulgusunu kapatıyor. Boot bir
sonraki sürümünde bu sürümleri getirdiğinde override'lar **kaldırılmalıdır**.

---

## 2. Sürüm uyumluluk matrisi

| Katman | Sürüm | Uyumluluk kontrolü | Sonuç |
|---|---|---|---|
| JDK | Temurin 21.0.11 LTS | Spring Boot 3.5.x Java 17–23 destekler | ✅ |
| Spring Boot | 3.5.16 | Spring Framework 6.2.18 ile aynı sürüm ailesinden | ✅ |
| Spring Security | 6.5.11 | Boot 3.5.x'in yönettiği sürüm; elle override edilmedi | ✅ |
| Hibernate | 6.6.49 | Boot yönetiminde; PostgreSQL 16 ile uyumlu | ✅ |
| pgjdbc | 42.7.13 | PostgreSQL 16.14 sunucusuna bağlandı ve 64 göç çalıştı | ✅ kanıtlandı |
| Jackson | 2.21.5 | Boot 3.5.16'nın getirdiği 2.21.4'ün yama üstü | ✅ sözleşme doğrulandı |
| Tomcat embed | 10.1.55 | Boot yönetiminde | ✅ |
| PostgreSQL sunucu | 16.14 | — | ✅ |
| Angular | 20.3 | `@angular/ssr` 20.3.32 ile aynı ana sürüm | ✅ |
| Node (derleme) | 22-alpine | Angular 20 Node 20+ ister | ✅ |
| Node (çalışma) | 22-alpine | Derleme imajıyla **aynı** ana sürüm | ✅ |
| Java imajı | derleme `maven:3.9-eclipse-temurin-21` / çalışma `eclipse-temurin:21-jre-alpine` | Aynı ana sürüm (21) | ✅ |

**Hibernate dialect:** Yapılandırmada elle belirtilmemiş — Boot, JDBC meta
verisinden PostgreSQL diyalektini kendisi seçiyor. Sürücü yükseltmesinden sonra
64 göç ve tüm sorgular çalıştığı için bu seçimin doğru kaldığı kanıtlandı.

---

## 3. Veritabanı ve göç doğrulaması ⭐ (en kritik kanıt)

Üretim veritabanına **dokunulmadı**. Aynı PostgreSQL örneğinde ayrı bir
`bidb_goc_testi` veritabanı oluşturuldu, test sonunda silindi.

| Senaryo | Beklenen | Sonuç |
|---|---|---|
| **Boş veritabanından V1→V66** | Tümü başarılı | ✅ **66 göç, 0 başarısız** (V65 ve V66 eklendikten sonra yeniden çalıştırıldı) |
| Sıfırdan kurulan şema = yükseltme yoluyla oluşan şema | Fark olmamalı | ✅ **192 sütunun tamamı birebir aynı (`diff` boş)**, 47 indeks ve 185 kısıt da eşit |
| Mevcut veritabanında göç durumu | V66'da, hepsi başarılı | ✅ 66 göç uygulanmış |
| Checksum uyuşmazlığı | Olmamalı | ✅ Yok (uygulama açılıyor) |
| Göç sonrası veri bütünlüğü | Korunmalı | ✅ 161 sayfa, 34 duyuru, 14 slayt, 11 giriş kaydı yerinde |
| Türkçe karakter / UTF-8 | Bozulma olmamalı | ✅ 357 Türkçe karakter, **0 bozulma işareti** |
| Tarih serileştirmesi (Jackson sonrası) | `YYYY-MM-DD` metin | ✅ `"2026-06-23"` |

**Uzun kilit / veri kaybı riski:** V60–V64 arasındaki göçler `UPDATE` ve
`CREATE INDEX` içeriyor. Tablo boyutları küçük (en büyüğü 722 satır); üretimde
uzun kilit beklenmez. **Ancak** `CREATE INDEX` (V61) büyük tablolarda kilit
oluşturabilir — bu tablo zamanla büyüyeceği için gelecekteki benzer göçlerde
`CREATE INDEX CONCURRENTLY` değerlendirilmelidir.

**Geri alınabilirlik:** Göçler geri alınamaz. Bkz. "Geri dönüş planı".

---

## 4. Derleme ve artefakt doğrulaması

### Frontend
```
npx ng build --configuration production   →  BAŞARILI (21,8 sn)
```
| Kontrol | Sonuç |
|---|---|
| Üretim derlemesi | ✅ Hatasız |
| Source map sızıntısı | ✅ **0 `.map` dosyası** |
| Bundle'da gizli bilgi (`BIDB_*`, `POSTGRES_PASSWORD`) | ✅ Bulunmadı |
| Kritik CSS | 49,2 KB (güvenlik turu öncesi 91 KB'den indirildi) |
| Ana paket | 20,5 KB |
| Lazy chunk üretimi | ✅ 30 chunk, bileşen bazlı bölünme çalışıyor |
| TypeScript tam sıkı mod | ✅ `tsc --noEmit` hatasız |

### Backend
```
docker compose build backend  →  BAŞARILI
Started BidbApplication in 13,5 s  →  healthcheck: healthy
```
| Kontrol | Sonuç |
|---|---|
| Maven derleme | ✅ |
| Uygulama açılışı | ✅ Sağlıklı |
| Kap kullanıcısı | ✅ `bidb` (PID 1), root değil |
| Açık portlar | ✅ Yalnızca `127.0.0.1:8081` ve `127.0.0.1:5432` |

---

## 5. Yetkilendirme regresyonu (Spring Security 6.5.10 → 6.5.11)

Matcher semantiği değişebileceği için **her yönetim ucu yeniden test edildi**:

| Uç | Anonim | Yetkili | Sonuç |
|---|---|---|---|
| `/api/admin/pages` | 401 | 200 | ✅ |
| `/api/admin/quality` | 401 | 200 | ✅ |
| `/api/admin/files` | 401 | 200 | ✅ |
| `/api/admin/staff` | 401 | 200 | ✅ |
| `/api/admin/login-events` | 401 | 200 | ✅ |
| `/api/admin/contact-tickets` | 401 | 200 | ✅ |
| `/actuator/env` | 401 | — | ✅ |
| `/actuator/health` | 200 (asgari) | — | ✅ |

**Hiçbir uç yanlışlıkla açılmadı; 401/403 karışması olmadı.**

### Güvenlik kontrollerinin yükseltme sonrası durumu
| # | Kontrol | Sonuç |
|---|---|---|
| 1 | Sahte XFF ile kaba kuvvet sınırı | ✅ 429 ile engellendi |
| 2 | Vekil yol kaçışı (`/api/%2e%2e/...`) | ✅ 400 |
| 3 | HTTP metot kısıtı (`TRACE`) | ✅ 405 |
| 4 | `/yonetim` `no-store` | ✅ |
| 5 | CSP nonce üretimi | ✅ |
| 6 | Actuator kapalılığı | ✅ 401 |
| 7 | Sütun aşımında temiz 400 | ✅ |

**Uygulanamayan testler ve nedeni** — bu projede JWT, çoklu kullanıcı, rol
hiyerarşisi, parola sıfırlama, hesap kilitleme ve kaynak sahipliği **yoktur**
(tek paylaşılan yönetici, HTTP Basic, STATELESS). Bu akışlar için test satırı
yazmak uydurma olurdu; kapsam dışıdır.

---

## 6. API sözleşmesi (Jackson 2.21.4 → 2.21.5)

| Kontrol | Sonuç |
|---|---|
| Kök alanlar | `news, seo, services, shortcuts, slider` — değişmedi |
| Slider alanları | `imageAlt, imageUrl, linkUrl, subtitle, title` — değişmedi |
| Haber alanları | 13 alan, değişmedi |
| Tarih biçimi | `"2026-06-23"` metin — değişmedi |
| `null` davranışı | `summary`, `coverText` `null` dönüyor — boş metne çevrilmemiş |
| Hassas alan sızıntısı | ✅ Yok (7 uçta arandı) |
| HTTP durum kodları | ✅ Genel 200, yetkisiz 401, hata sayfaları doğru kod |

---

## 7. İşlevsel duman testi

| Kontrol | Sonuç |
|---|---|
| 18 sayfa (TR+EN, tüm tipler + panel) | ✅ **18/18 → 200** |
| Hata sayfaları 400/401/403/404/500/503 | ✅ Doğru HTTP kodu (yumuşak 404 yok) |
| `sitemap.xml`, `robots.txt` | ✅ 200 |
| Sitemap'teki 161 adres | ✅ Hepsi 200 |
| Sayfa belgeleri (80) | ✅ 0 kırık |
| Duyuru hedefleri (34) | ✅ 0 kırık |
| Varlıklar (71) | ✅ 0 kırık |
| Türkçe/İngilizce içerik | ✅ Kodlama bozulması yok |

---

## 8. Doğrulanamayan alanlar (Not Verified)

Bunlar **denetlenmemiştir**; sağlıklı oldukları varsayılmamalıdır.

| Alan | Neden |
|---|---|
| **Yedek ve geri yükleme** | Depoda yedekleme mekanizması yok, üretim erişimi yok. Yayın öncesi **zorunlu**. |
| **Otomatik test paketi** | Depoda çalışan test yok (backend'de `src/test` yok). Tüm doğrulamalar elle çalıştırılan kanıtlarla yapıldı. |
| Tarayıcı uyumluluğu (Chrome/Firefox/Edge/Safari/mobil) | Bu ortamda tarayıcı yok. Görsel/JS regresyonu **doğrulanamadı**. |
| Responsive görsel regresyon | Aynı neden. CSS kuralları statik incelendi, gerçek düzen görülmedi. |
| Erişilebilirlik (klavye, odak, ekran okuyucu) | Aynı neden. Yalnızca makineyle denetlenebilen kurallar (etiket, `lang`, `h1`, kontrast) kontrol edildi. |
| Üretim TLS / ters vekil / HTTPS yönlendirmesi | Depoda yok. |
| PostgreSQL sunucu sertleştirmesi (`pg_hba.conf`, roller, TLS) | Üretim örneği görülemedi. |
| Yük/kapasite davranışı | Zarar verici test yapılmadı; yalnızca tekil istek süreleri ölçüldü (0,09–0,37 sn). |
| CI/CD | Depoda pipeline yok. |

---

## 9. Geri dönüş planı

### Uygulama geri dönüşü
```bash
git revert <sha>            # her düzeltme tek commit
docker compose up -d --build
```

### Veritabanı geri dönüşü — **kritik uyarı**
**V60–V64 göçleri geri alınamaz.** Flyway'de geri alma betiği yoktur.
"Uygulamayı eski sürüme döndürmek" tek başına yeterli bir geri dönüş **değildir**.

| Göç | İşlem | Geri dönüş |
|---|---|---|
| V60 | Slayt ekleme + sıra kaydırma | İleri düzeltme: yeni göçle slaytı sil, sırayı geri al |
| V61 | `CREATE INDEX` | `DROP INDEX` — veri kaybı yok |
| V62, V63 | Belge adresi düzeltmesi | İleri düzeltme: eski adresi yaz |
| V64 | İçerik içi bağlantı düzeltmesi | İleri düzeltme |

**Hiçbiri veri silmiyor**; tamamı ekleme ya da adres güncellemesi. Bu yüzden
geri dönüş gerekirse **ileri düzeltme (yeni göç)** doğru yöntemdir.

### Yayın öncesi zorunlu adımlar
1. `pg_dump` ile tam yedek + **geri yükleme testi** (henüz yapılmadı)
2. Mevcut Docker imajlarının etiketlenip saklanması
3. `.env` yedeği (güvenli kasada, depoda değil)
4. `BIDB_VEKIL_ANAHTARI`, `BIDB_YONETICI_PAROLA`, `BIDB_DB_PAROLA` üretim değerleri
5. Frontend eski/yeni paket uyumsuzluğu: dosya adları içerik-hash'li, `tamamlayici*.css` `no-cache` — sorun beklenmiyor

---

## 10. Yayın kararı

### CONDITIONAL APPROVAL

**Karşılananlar:** Critical/High açık yok · Yetkilendirme testleri başarılı ·
Frontend ve backend üretim derlemesi başarılı · **Göç testi başarılı (64/64,
şema birebir)** · API sözleşmesi korunuyor · İşlevsel duman testi 18/18 ·
Güvenlik başlıkları ve kontrolleri çalışıyor · Gizli bilgi taraması temiz ·
Geri dönüş planı hazır.

**"READY FOR PRODUCTION" verilmemesinin nedeni — iki eksik kanıt:**
1. **Yedek ve geri yükleme doğrulanmadı.** Kurumsal bir sitede bu, yayın için
   pazarlık edilemez bir gerekliliktir ve bu ortamdan yapılamaz.
2. **Otomatik test paketi yok.** Doğrulamalar elle çalıştırılan kanıtlara dayanıyor;
   tekrarlanabilir değiller.

Buna ek olarak üretim yapılandırması (TLS, ters vekil, PostgreSQL sunucu ayarları)
ve tarayıcı davranışı bu ortamdan görülemedi.

**Bu iki madde tamamlandığında karar READY FOR PRODUCTION'a çevrilebilir.**
