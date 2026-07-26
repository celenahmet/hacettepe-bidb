# Güvenlik İncelemesi — Hacettepe Üniversitesi BİDB Web Sitesi

**Tarih:** 26 Temmuz 2026
**Kapsam:** Depo içindeki tüm uygulama kodu, yapılandırma ve yerel Docker dağıtımı
**Yöntem:** Manuel kod incelemesi + veri akışı takibi + yerel ortamda kontrollü doğrulama testleri

---

## Yönetici özeti

Bu inceleme sırasında **doğrulanmış 9 güvenlik bulgusu** tespit edildi ve tamamı
kapatıldı. Bunlardan üçü, sömürüsü fiilen kanıtlanmış (kavram ispatı çalıştırılmış)
kimlik doğrulama/oran sınırlama atlatmalarıydı.

En ağır bulgu, sahte bir `X-Forwarded-For` başlığıyla **yönetici hesabına yönelik
kaba kuvvet korumasının tümüyle atlatılabilmesiydi**: sınır 5 dakikada 8 başarısız
denemeyken, başlık her istekte değiştirilerek 15 ardışık deneme hiç engellenmeden
geçirildi. Aynı kusur iletişim formu sınırını da etkisizleştiriyordu (8/8 talep kabul).

Tüm bulgular kapatıldıktan sonra yeniden test edildi ve kapandıkları doğrulandı.

> **Bu rapor "site tamamen güvenlidir" demez.** Doğrulanamayan ve test ortamı
> gerektiren alanlar aşağıda "İncelenemeyen alanlar" başlığında açıkça listelenmiştir.

---

## Doğrulanan teknoloji yığını

Varsayımla değil, hem yapılandırma dosyalarından hem **çalışan sistemden** doğrulandı.

| Katman | Gerçek sürüm | Doğrulama |
|---|---|---|
| JDK | OpenJDK 21.0.11 LTS (Temurin) | `java -version` (kap içinde) |
| Framework | Spring Boot **3.5.16** | `pom.xml` + çalışan jar |
| Güvenlik | Spring Security **6.5.11** | jar içeriği |
| Servlet | Tomcat embed **10.1.55** | jar içeriği |
| ORM | Hibernate ORM 6.6.49 | başlangıç kaydı |
| Veritabanı | PostgreSQL **16.14** | `SELECT version()` |
| JDBC | pgjdbc **42.7.13** | jar içeriği |
| JSON | Jackson **2.21.5** | jar içeriği |
| Frontend | Angular **20.3**, `@angular/ssr` 20.3.32 | `package.json` |
| SSR sunucusu | Express **5.1** (Node 22) | `package.json`, Dockerfile |
| Göç | Flyway 11.7.2 (V1–V64) | jar + `flyway_schema_history` |
| Derleme | Maven (backend), Angular CLI (frontend) | `pom.xml`, `angular.json` |

**Kimlik doğrulama modeli:** HTTP Basic, `SessionCreationPolicy.STATELESS`,
tek paylaşılan yönetici hesabı, BCrypt. JWT/OAuth2/LDAP/SSO **kullanılmıyor**
(arandı, bulunmadı). Oturum çerezi yok — tarayıcı tarafında `sessionStorage`.

---

## Mimari ve güven sınırları

```
Tarayıcı
   │  HTTPS (üretimde), CSP + nonce, HSTS, X-Content-Type-Options
   ▼
Angular SSR / Express  (:4000, tek dışa açık yüzey)
   │  • güvenlik başlıkları burada üretilir
   │  • /api vekili: yol doğrulaması + zaman aşımı + devre kesici
   │  • X-Bidb-Vekil-Anahtari ile kimliğini kanıtlar
   ▼
Spring Boot  (:8080, yalnızca 127.0.0.1:8081'e bağlı)
   │  • SecurityFilterChain: denyAll varsayılan
   │  • kaba kuvvet sınırı, işlem günlüğü, giriş kaydı
   ▼
PostgreSQL  (yalnızca 127.0.0.1:5432, özel Docker ağı)

Dışa giden: ipapi.co (yönetici giriş IP'si — KVKK notu aşağıda)
```

**Güven sınırlarında taşınan veri ve kontroller**

| Sınır | Taşınan | Kontrol |
|---|---|---|
| Tarayıcı → SSR | Form girdileri, Basic kimlik | CSP nonce, boyut sınırı (5 MB), metot kısıtı (GET/HEAD) |
| SSR → Backend | Kimlik başlığı, gerçek istemci IP'si | Paylaşılan vekil anahtarı; yol `/api` önekine hapsedilir |
| Backend → PG | Parametreli sorgular | Tümü bağlama (`:param`), string birleştirme yok |
| Backend → dış | Yönetici IP'si | Yapılandırmayla kapatılabilir; IP değişmezi doğrulaması |

---

## Bulgu özeti

| Severity | Adet | Durum |
|---|---|---|
| Critical | 0 | — |
| **High** | **3** | **3 kapatıldı** |
| **Medium** | **5** | **5 kapatıldı** |
| Low | 1 | 1 kapatıldı |
| Informational / Kararınıza bırakılan | 4 | Raporlandı |

**Yayın engelleyici kalmadı** (kapsam dâhilinde).

---

## Doğrulanmış bulgular

### BULGU-01 — Sahte `X-Forwarded-For` ile yönetici kaba kuvvet korumasının atlatılması
- **Durum:** Confirmed · **Severity:** High · **Confidence:** High
- **Bileşen:** `security/HizSinirlayici.java`, `security/IstekBilgisi.java`, `YoneticiGirisSinirlayici.java`
- **CWE:** CWE-290 (Authentication Bypass by Spoofing), CWE-307 (Improper Restriction of Excessive Authentication Attempts)
- **OWASP Top 10:** A07 Identification and Authentication Failures
- **ASVS bölümü:** V2 Authentication (kontrol numarası doğrulanmadığı için verilmedi)
- **Ön koşul:** Yok — kimliksiz, internetten erişilebilir
- **Saldırı senaryosu:** İstemci adresi `X-Forwarded-For` zincirinin İLK adımından okunuyordu. O adım her zaman istemcinin kendi yazdığı, doğrulanmamış değerdir. Saldırgan her istekte başlığı değiştirerek her denemeyi "yeni bir IP" gibi gösterir.
- **Teknik kanıt:** Sınır 5 dk / 8 başarısız denemedir.
  ```
  XFF yokken     : 401 ×8, sonra 429 429 429      (koruma çalışıyor)
  XFF döndürülünce: 401 ×15                        (hiç engellenmedi)
  ```
- **Etki:** Tek paylaşılan yönetici hesabına sınırsız parola denemesi → site içeriğinin tamamının ele geçirilmesi.
- **Uygulanan çözüm:** Adres çözümü `security/IstemciAdresi.java` sınıfında toplandı; zincirin **sondan sabit sayıda** adımı okunur (ara sunucular zincire kendi gördüklerini EKLER, dolayısıyla gerçek istemci sondadır; dolgu eklemek seçimi kaydıramaz). `server.forward-headers-strategy` `none` yapıldı. Ön yüz–backend arasına paylaşılan sır (`BIDB_VEKIL_ANAHTARI`) eklendi.
  - "Özel ağ adreslerini atla" kuralı **bilinçli kullanılmadı**: kampüs NAT'ı arkasındaki gerçek kullanıcının adresi de özeldir; o atlanınca sıra saldırganın uydurduğu değere gelirdi.
- **Doğrulama:** Aynı sınama artık 8 denemeden sonra 429 veriyor; hem SSR üzerinden hem backend'e doğrudan.
- **Kalan risk:** `BIDB_VEKIL_ANAHTARI` tanımlanmazsa güven ağ konumuna dayanır; backend'e erişebilen yerel bir süreç hâlâ adres bildirebilir. `.env` ile anahtar üretildi.
- **Commit:** `1cc6939`

### BULGU-02 — Aynı kusur iletişim formu oran sınırında
- **Durum:** Confirmed · **Severity:** High · **Confidence:** High
- **Bileşen:** `web/ContactTicketController.java` (kendi XFF kopyasını taşıyordu)
- **CWE:** CWE-770 (Allocation Without Limits) · **OWASP API:** API4 Unrestricted Resource Consumption
- **Kanıt:** Sınır 10 dakikada 5 talepken **8/8 talep 201 ile kabul edildi**.
- **Etki:** Talep tablosu ve disk doldurulabilir (ek dosya sınırı 10 MB).
- **Çözüm/Doğrulama:** `IstemciAdresi` üzerinden çözülüyor; sınama artık 5 talepten sonra 429 veriyor.
- **Commit:** `0deb80f`

### BULGU-03 — SSR `/api` vekilinde yol kaçışı (vekil hapsinin delinmesi)
- **Durum:** Confirmed · **Severity:** High · **Confidence:** High
- **Bileşen:** `frontend/src/server.ts`
- **CWE:** CWE-22 (Path Traversal) · **OWASP Top 10:** A01 Broken Access Control
- **Kanıt:** `GET /api/%2e%2e/actuator/health` → **HTTP 200**, backend'in `/api` dışına ulaşıldı.
- **Etki:** "Backend'e yalnızca bu vekil üzerinden erişilir" sınırı delinir; `/api` dışında `permitAll` bırakılan her uç kamuya açılır.
- **Çözüm:** Hedef `new URL()` ile çözümlenip doğrulanıyor — köken sabit tabanla aynı olmalı ve yol `/api` önekinde kalmalı.
- **Doğrulama:** `%2e%2e`, `.%2e`, `..` biçimlerinin tümü artık 400; meşru yollar etkilenmedi.
- **Commit:** `1a059bc`

### BULGU-04 — Denetim kaydına sahte adres yazdırılabilmesi
- **Durum:** Confirmed · **Severity:** Medium · **Confidence:** High
- **CWE:** CWE-117 (Improper Output Neutralization for Logs) · **OWASP:** A09 Security Logging and Monitoring Failures
- **Kanıt:** `X-Bidb-Yerel-Adres: SAHTE-KAYIT-9.9.9.9` gönderildi; değer olduğu gibi güvenlik kaydına geçti.
- **Etki:** Olay incelemesinin yanlış yöne çekilmesi; denetim kaydının bütünlüğünün bozulması.
- **Çözüm/Doğrulama:** Başlık yalnızca vekil kimliği doğrulanabildiğinde okunuyor; sahte değer artık yok sayılıyor.
- **Commit:** `1c80c10`

### BULGU-05 — Yönetim panelinin önbelleğe alınabilmesi
- **Durum:** Confirmed · **Severity:** Medium · **CWE:** CWE-525
- `/yonetim` yanıtında hiç `Cache-Control` yoktu → tarayıcı sezgisel önbellekleme uygular, araya giren vekil/CDN paneli saklayabilir.
- **Çözüm:** Yönetim yolları `no-store` dönüyor. **Commit:** `9980969`

### BULGU-06 — Tüm HTTP metotlarının sayfa çizimine girmesi / `TRACE` 500
- **Durum:** Confirmed · **Severity:** Low · **CWE:** CWE-16, CWE-248
- `PUT/DELETE/PATCH/POST` sayfayı 200 döndürüyor, `TRACE` işlenmemiş istisnayla 500 veriyordu.
- **Çözüm:** Sayfalar salt okunur; GET/HEAD dışı `Allow` başlığıyla 405. **Commit:** `28764e7`

### BULGU-07 — Bot tuzağının stil dosyasına bağımlı olması
- **Durum:** Confirmed · **Severity:** Medium · **CWE:** CWE-1173
- Bal küpü alanı yalnızca **ertelenmiş** bir CSS paketiyle gizleniyordu. Paket yüklenmediğinde alan görünür oluyor ve **dolduran gerçek kullanıcının talebi sunucuda bot sayılıp reddediliyordu** (fiilen yaşandı).
- **Çözüm:** Kural her sayfada çizimden önce yüklenen kritik pakete taşındı. **Commit:** `ae2a556`

### BULGU-08 — Sütun sınırını aşan girdinin 500 üretmesi
- **Durum:** Confirmed · **Severity:** Medium · **CWE:** CWE-209 (bilgi sızıntısı sınırında)
- **Kanıt:** 600 karakterlik başlık → **500 Internal Server Error** (yığın izi sızmıyor, ancak hata sınıfı yanlış ve neden gizli).
- **Çözüm:** Ortak `VeriHatasiIsleyici` — kısıt ihlalleri anlaşılır 400 döner; ayrıntı yalnızca sunucu kaydına. **Commit:** `4cc9912`

### BULGU-09 — Yönetici IP'sinin üçüncü tarafa denetimsiz aktarımı (KVKK)
- **Durum:** Confirmed · **Severity:** Medium · **Confidence:** High
- **Bileşen:** `service/GirisKayitServisi.java`
- **CWE:** CWE-359 (Exposure of Private Personal Information)
- Giriş kaydındaki şehir/ülke bilgisi için **giriş yapan kişinin IP adresi** `ipapi.co` adresine (yurt dışı) gönderiliyordu. Aktarım yapılandırmadan kapatılamıyordu ve yapılandırmada görünmüyordu. Ayrıca IP, giden URL'ye **doğrulanmadan** konuyordu.
- **Çözüm:** `BIDB_KONUM_SERVISI` ile kapatılabilir oldu (varsayılan bilinçli olarak AÇIK — çalışan özellik sessizce kapatılmaz, karar kurumundur); IP artık yalnızca sayısal değişmez olarak kabul ediliyor.
- **Kalan risk:** Varsayılan açık olduğu için aktarım sürüyor. **Kurumun aydınlatma metnine eklemesi ya da kapatması gerekir.**
- **Commit:** `3731b02`

---

## Temiz çıkan kontroller (kanıtla)

| Alan | Sonuç | Kanıt |
|---|---|---|
| SQL enjeksiyonu | Bulunmadı | Tüm native sorgular `:param` bağlaması; string birleştirme yok |
| Mass assignment | Bulunmadı | Hiçbir uç entity'yi doğrudan `@RequestBody` almıyor — 18 uçta DTO |
| Yetkilendirme kapsamı | Sağlam | `denyAll` varsayılan; tüm `/api/admin/**` 401; `tr`/`en` dışı diller 401 |
| Yanıt sızıntısı | Bulunmadı | 7 uçta `password/hash/secret/token` alanı aranmadı-bulunmadı |
| Actuator | Sıkı | Yalnızca `health` açık ve asgari; `env/beans/heapdump/loggers` 401 |
| CORS | Sıkı | Yalnızca GET, açık origin listesi, credential yok |
| Dosya yükleme | Sağlam | Uzantı beyaz listesi (SVG **bilinçli** dışarıda), boyut sınırı, yol kaçışı denetimi; `svg/html/js/php/pdf.exe` reddedildi |
| Açık yönlendirme | Bulunmadı | `//evil`, `/\evil`, `https://evil` denendi — hepsi iç hata sayfasına |
| Host başlığı enjeksiyonu | Engelleniyor | Bilinmeyen Host → 400 (`ALLOWED_HOSTS`) |
| ReDoS | Bulunmadı | İçerik regexleri saldırgan girdiyle **ölçüldü**: 24.000 karakterde <0,2 ms |
| Yarış durumu (sayaç) | Bulunmadı | Görüntülenme sayacı veritabanında atomik (`SET x = x + 1`) |
| Gizli bilgi (depo + geçmiş) | Bulunmadı | `git log --all -p` desen taraması; izlenen `.env`/anahtar dosyası yok |
| Bağımlılık (Node, üretim) | 0 zafiyet | `npm audit --omit=dev` |
| Bağımlılık (Java) | 22 → **0** kayıt | OSV toplu sorgusu; yükseltme sonrası tekrar sorguldu |
| Kap ayrıcalığı | Düşürülüyor | Java süreci PID 1 `bidb` kullanıcısı (`su-exec`), root değil |
| Yığın izi sızıntısı | Bulunmadı | Boş bayt, `' OR 1=1--`, 5000 karakter, bozuk JSON denendi |

### Bağımlılık analizi — otomatik çıktı körlemesine kabul edilmedi

OSV'nin döndürdüğü 22 kaydın **her biri** uygulamanın gerçek yapılandırmasına
karşı değerlendirildi:

- **Tomcat (7 kayıt):** Digest kimlik doğrulama, AJP, WebDAV, WebSocket ve HTTP/2 gerektiriyor → hiçbiri kullanılmıyor (HTTP/2 varsayılan kapalı, doğrulandı).
- **Jackson (10 kayıt):** `@JsonView` / `@JsonIgnore` / polimorfik tip gerektiriyor → kod tabanında **hiçbiri geçmiyor** (arandı).
- **Spring Security (1):** X.509 istemci sertifikası gerektiriyor → kimlik doğrulama HTTP Basic.
- **logback (2):** soket/sunucu alıcısı gerektiriyor → özel logback yapılandırması yok.
- **pgjdbc (2):** kötü niyetli/araya giren PostgreSQL sunucusu gerektiriyor → veritabanı özel ağda kendi kabımız.

**Sonuç: doğrulanmış, sömürülebilir bağımlılık açığı bulunmadı.** Yine de tümü
yamalandı (yama düzeyi yükseltmeler, uygulanabilirlik analizi eksik kalabilir).

---

## İncelenemeyen alanlar (Not Verified)

Bunlar **denetlenmemiştir**; güvenli oldukları varsayılmamalıdır.

1. **Üretim altyapısı** — Gerçek reverse proxy (nginx/Apache), TLS sertifikası ve protokol yapılandırması, HTTP→HTTPS yönlendirmesi, güvenlik duvarı kuralları depoda yok. HSTS başlığı üretilir ama TLS sonlandırması görülemedi.
2. **PostgreSQL sunucu yapılandırması** — `pg_hba.conf`, `listen_addresses`, TLS zorunluluğu, rol yetkileri, `SECURITY DEFINER` fonksiyonları, `PUBLIC` yetkileri incelenmedi. Yerel kapta varsayılan imaj çalışıyor; üretim örneği farklı olabilir. Aşağıda kontrol komutları verildi.
3. **Yedekleme ve saklama** — Yedek dosyalarının konumu, erişim yetkileri ve şifrelemesi görülemedi.
4. **CI/CD** — Depoda pipeline tanımı yok; derleme ve dağıtım elle yapılıyor görünüyor. SBOM üretimi, secret taraması, imza/artefakt bütünlüğü yok.
5. **Gerçek tarayıcı davranışı** — CSP ihlalleri, hydration/event-replay, klavye gezinmesi ve odak yönetimi gerçek tarayıcıda test edilemedi (bu ortamda tarayıcı yok). SSR HTML'i üzerinden statik denetim yapıldı.
6. **Kimlik doğrulama modelinin kendisi** — Aşağıdaki "Kalan risk" başlığına bakınız.
7. **Yük altında davranış** — Eşzamanlılık, bağlantı havuzu tükenmesi ve uzun süren işlemler test edilmedi (DoS testi kapsam dışı bırakıldı).

---

## Kalan riskler ve kararınıza bırakılanlar

### R-1 — Yönetici parolası tarayıcıda geri çevrilebilir biçimde duruyor (Medium)
`sessionStorage`'da `Basic base64(kullanıcı:parola)` tutuluyor. Base64 şifreleme
değildir; panelde bir XSS oluşursa oturum belirteci değil **doğrudan hesap parolası**
ele geçer ve iptal edilemez.

Doğru çözüm iptal edilebilir bir oturum belirtecidir; ancak backend bilinçli olarak
`STATELESS` kurgulanmış, bu **kimlik doğrulama mimarisini değiştirmek** demektir.
Direktifiniz gereği mimariyi bozmadım — kararı size bırakıyorum.

*Hafifletici etkenler:* panelin XSS yüzeyi dar (talep alanları `{{ }}` ile kaçışlı,
`bypassSecurityTrustHtml` yalnızca yöneticinin kendi yazdığı içerikte), `sessionStorage`
sekme kapanınca silinir, 30 dakikalık hareketsizlik zaman aşımı eklendi (`cb17412`).

### R-2 — Tek paylaşılan yönetici hesabı (Medium)
Kişi bazlı hesap yok; denetim kaydında "kim" sorusuna sekme başına üretilen bir
kimlikle cevap veriliyor. İşlemler kişilere atfedilemez. Çok kullanıcılı yetkilendirme
modeli mimari bir değişikliktir.

### R-3 — `BIDB_VEKIL_ANAHTARI` üretimde mutlaka tanımlanmalı
Tanımsızsa backend, ara sunucuya **ağ konumuna göre** güvenir; backend'e erişebilen
yerel bir süreç sahte istemci adresi bildirebilir. Yerel `.env` için rastgele anahtar
üretildi, **üretim ortamı için ayrıca tanımlanmalıdır**.

### R-4 — KVKK: yönetici IP'sinin yurt dışına aktarımı
BULGU-09'a bakınız. Varsayılan açık bırakıldı; aydınlatma metnine eklenmeli ya da
`BIDB_KONUM_SERVISI=false` yapılmalıdır.

### R-5 — Varsayılan kimlik bilgileri
`docker-compose.yml` geliştirme varsayılanları taşır (`admin/admin`, `bidb/bidb`).
Backend, yönetici parolası tanımsızsa **hiç başlamaz** (iyi), ancak üretimde
`BIDB_YONETICI_PAROLA` ve `BIDB_DB_PAROLA` mutlaka verilmelidir (`.env.example`).

---

## Manuel olarak yapılması gereken kontroller

```bash
# PostgreSQL — üretim örneğinde çalıştırılmalı
psql -c "SHOW listen_addresses;"
psql -c "SHOW ssl;"
psql -c "\du"                                   # rol yetkileri, superuser var mı
psql -c "SELECT nspname, nspacl FROM pg_namespace WHERE nspname='public';"
psql -c "SELECT proname FROM pg_proc WHERE prosecdef;"   # SECURITY DEFINER
psql -c "SELECT extname FROM pg_extension;"     # gereksiz eklenti
grep -vE '^\s*#|^\s*$' /etc/postgresql/*/main/pg_hba.conf

# TLS / reverse proxy
curl -sI https://bidb.hacettepe.edu.tr | grep -iE 'strict-transport|content-security'
nmap --script ssl-enum-ciphers -p 443 bidb.hacettepe.edu.tr

# Dışa açık yüzey
ss -tlnp        # 8081 ve 5432 dışarı açık OLMAMALI
```

---

## Kullanılan araçlar ve çalıştırılan komutlar

| Araç | Amaç | Sonuç |
|---|---|---|
| `npm audit --omit=dev` | Node üretim bağımlılıkları | 0 zafiyet |
| OSV.dev API (`querybatch`, `query`) | Java bağımlılıkları | 22 → 0 |
| `curl` (kontrollü, yerel) | Kimlik doğrulama/oran sınırı/yol kaçışı/başlık testleri | 9 bulgu |
| `psql` (yerel kap) | Şema, indeks, veri bütünlüğü, gizlilik uyumu | — |
| `docker exec` / `docker compose` | Kap ayrıcalığı, port, jar içeriği | — |
| Node betikleri (yazıldı) | Varlık/bağlantı/belge tarayıcı, ReDoS ölçümü, kontrast hesabı | 4 kırık bağlantı |
| `git log --all -p` | Geçmişte gizli bilgi | Bulunmadı |
| `tsc --noEmit` | Tip güvenliği | Hatasız (tam sıkı mod) |

**Kurulmayan araçlar:** OWASP Dependency-Check, Semgrep, CodeQL, Trivy, ZAP.
Bunlar kurulmadı; yerine OSV API'si (gerçek CVE verisi) ve manuel kod analizi
kullanıldı. Kurulmadıkları hâlde çalıştırılmış gibi gösterilmemiştir.

---

## Sonraki taramada nereden devam edilmeli

1. Üretim altyapısı erişimi sağlandığında yukarıdaki PostgreSQL/TLS komutları.
2. Gerçek tarayıcıda CSP ihlal raporu toplanarak `unsafe-inline`'ın kaldırılabilirliği (nonce zaten üretiliyor).
3. R-1 ve R-2 için kimlik doğrulama mimarisi kararı alındıktan sonra yeniden inceleme.
4. Yük/eşzamanlılık testleri (bu incelemede kapsam dışı bırakıldı).
5. CI/CD kurulduğunda: SBOM (CycloneDX), secret taraması, imza doğrulama.

---

## Yayına çıkış değerlendirmesi

**CONDITIONAL APPROVAL**

Kapsam dâhilindeki tüm doğrulanmış High ve Medium bulgular kapatıldı; derleme ve
işlevsel doğrulamalar başarılı. Ancak "APPROVED" verilmiyor, çünkü:

- Üretim altyapısı (TLS, reverse proxy, PostgreSQL sunucu yapılandırması, yedekler) **incelenemedi**;
- Kimlik doğrulama modeliyle ilgili iki kalan risk (R-1, R-2) mimari karar bekliyor;
- `BIDB_VEKIL_ANAHTARI` ve üretim parolalarının tanımlanması (R-3, R-5) dağıtım anında doğrulanmalıdır.

**Yayın öncesi zorunlu:** R-3 ve R-5'in üretimde karşılanması, R-4 için KVKK kararı.
