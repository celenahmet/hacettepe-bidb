# Güvenlik Düzeltme Planı

Öncelikler, bu incelemede **doğrulanmış** bulgulara ve kalan risklere göre
belirlendi. P0'daki işlerin tamamı bu turda tamamlandı; P1 ve sonrası açık.

---

## P0 — Yayın engelleyici · TAMAMLANDI

| # | İş | Dosyalar | Durum |
|---|---|---|---|
| P0-1 | XFF sahteciliğiyle yönetici kaba kuvvet atlatması | `security/IstemciAdresi.java` (yeni), `HizSinirlayici`, `IstekBilgisi`, `YoneticiGirisSinirlayici`, `YoneticiIslemGunlukFiltresi`, `application.yml`, `docker-compose.yml`, `server.ts` | ✅ `1cc6939` |
| P0-2 | Aynı kusur iletişim formu sınırında | `web/ContactTicketController.java` | ✅ `0deb80f` |
| P0-3 | SSR `/api` vekilinde yol kaçışı | `frontend/src/server.ts` | ✅ `1a059bc` |

**Uygulama riski:** Orta — kimlik doğrulama ve yönlendirme yollarına dokunuldu.
**Alınan önlem:** Her düzeltme öncesi sömürü kanıtlandı, sonrasında aynı sınama
tekrarlandı; meşru yolların (SSR üzerinden, doğrudan backend, varlık dosyaları)
bozulmadığı ayrıca doğrulandı.
**Geri dönüş:** Her biri tek commit; `git revert <sha>` yeterli.
**Owner:** Backend + DevOps

---

## P1 — Kısa vadeli (yayın öncesi tamamlanmalı)

| # | İş | Neden | Owner | Not |
|---|---|---|---|---|
| P1-1 | **`BIDB_VEKIL_ANAHTARI` üretimde tanımlansın** | Tanımsızsa backend ara sunucuya ağ konumuna göre güvenir; yerel bir süreç sahte istemci adresi bildirebilir (R-3) | DevOps | `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` · Frontend ve backend'de **aynı** değer |
| P1-2 | **`BIDB_YONETICI_PAROLA` ve `BIDB_DB_PAROLA` üretim değerleri** | Compose varsayılanları geliştirme içindir (R-5) | DevOps | Backend parola tanımsızsa zaten başlamaz; DB parolası için ilk kurulumda `down -v` gerekir |
| P1-3 | **KVKK kararı: yönetici IP'sinin yurt dışına aktarımı** | `ipapi.co` sorgusu kişisel veri aktarımıdır (R-4, BULGU-09) | Hukuk/KVKK + Sistem | Ya aydınlatma metnine eklenir ya `BIDB_KONUM_SERVISI=false` |
| P1-4 | **TLS ve reverse proxy denetimi** | Depoda yok, incelenemedi | Sistem yönetimi | `SECURITY_AUDIT.md` → "Manuel kontroller" |
| P1-5 | **PostgreSQL sunucu sertleştirme denetimi** | `pg_hba.conf`, rol yetkileri, TLS incelenemedi | Veritabanı | Aynı bölümdeki `psql` komutları |

---

## P2 — Orta vadeli (mimari karar gerektirir, doğrudan uygulanmadı)

### P2-1 · Yönetici kimliğinin tarayıcıda saklanma biçimi (R-1)
**Sorun:** `sessionStorage`'da `Basic base64(kullanıcı:parola)` — geri çevrilebilir;
XSS hâlinde iptal edilemeyen hesap parolası ele geçer.

**Neden şimdi yapılmadı:** Backend bilinçli `STATELESS`; çözüm kimlik doğrulama
mimarisini değiştirmek demek. Direktif gereği mimari bozulmadı.

**Önerilen yol (sırayla):**
1. Sunucu tarafında iptal edilebilir, kısa ömürlü bir oturum belirteci (opak, DB/önbellek destekli)
2. Belirteç `HttpOnly` + `Secure` + `SameSite=Strict` çerezde → JS erişemez
3. Çerez tabanlıya geçilirse **CSRF koruması zorunlu hâle gelir** (şu an Basic olduğu için ambient authority yok; bu yüzden CSRF kapalı olması bugün doğru)
4. Çıkış ve parola değişiminde belirtecin sunucuda geçersiz kılınması

**Risk:** Yüksek — tüm yönetim akışını etkiler. Ayrı bir dalda, regresyon testleriyle.
**Owner:** Backend + Frontend

### P2-2 · Kişi bazlı yönetici hesapları (R-2)
Tek paylaşılan hesap; işlemler kişilere atfedilemez. Denetim kaydı sekme kimliğiyle
"kim" sorusuna yaklaşık cevap veriyor. Çok kullanıcılı model + rol ayrımı gerekir.
**Owner:** Backend · **Bağımlılık:** P2-1 ile birlikte yapılması verimli.

### P2-3 · CSP'den `unsafe-inline` kaldırılması
Nonce üretimi **zaten var** ve çalışıyor (`script-src 'self' 'nonce-…' 'unsafe-inline'`).
`unsafe-inline` yalnızca nonce anlamayan eski tarayıcılar için duruyor ve nonce'u
anlayan tarayıcı onu zaten yok sayıyor — yani bugünkü koruma nonce düzeyinde.
Kaldırmadan önce gerçek tarayıcıda CSP ihlal raporu toplanmalı.
**Owner:** Frontend · **Risk:** Orta (hydration/event-replay etkilenebilir)

---

## P3 — Sertleştirme

| # | İş | Owner |
|---|---|---|
| P3-1 | CI/CD kurulumu: SBOM (CycloneDX), secret taraması, bağımlılık taraması, imza | DevOps |
| P3-2 | Bağımlılık güncellemelerinin düzenli hâle getirilmesi (Renovate/Dependabot) | DevOps |
| P3-3 | Güvenlik kayıtlarının uygulama kayıtlarından ayrılması ve merkezî toplama | Sistem |
| P3-4 | Kap sertleştirme: salt-okunur dosya sistemi, `cap_drop: ALL`, `no-new-privileges` | DevOps |
| P3-5 | Yedeklerin şifrelenmesi ve geri yükleme tatbikatı | Sistem |
| P3-6 | Gerçek tarayıcıda erişilebilirlik ve klavye gezinme denetimi | Frontend |

---

## Test ve geri dönüş planı

**Her düzeltmede uygulanan yöntem (bu turda izlendi):**
1. Sömürüyü önce kanıtla (kavram ispatı çalıştır)
2. En küçük düzeltmeyi uygula
3. Aynı sömürüyü tekrarla → kapandığını doğrula
4. Meşru yolları doğrula (site sağlığı, API sözleşmesi, varlık dosyaları)
5. Tek commit + açıklayıcı mesaj

**Geri dönüş:** Her bulgu tek commit'te; `git revert <sha>`.
Veritabanı göçleri (V60–V64) geri alınamaz — geri dönüş gerekirse **yeni** bir göç
yazılmalıdır (bkz. `db/migration/BENIOKU.md`).

**Doğrulama komutları:** `SECURITY_TEST_MATRIX.md`
