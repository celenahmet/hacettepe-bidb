# Güvenlik Değişiklikleri

Bu turda uygulanan tüm güvenlik değişiklikleri, kapattıkları bulgular ve
doğrulama yöntemleri.

---

## Değiştirilen ve eklenen dosyalar

### Backend — kimlik/adres çözümü
| Dosya | Değişiklik | Bulgu |
|---|---|---|
| `security/IstemciAdresi.java` | **YENİ** — sahteciliğe kapalı istemci adresi çözümü: zincirin sondan sabit adımı, güvenilir vekil denetimi, paylaşılan sır doğrulaması, DNS'e gitmeyen IP değişmezi kontrolü | BULGU-01 |
| `security/HizSinirlayici.java` | XFF okuma kaldırıldı, `IstemciAdresi`'ne devredildi | BULGU-01 |
| `security/IstekBilgisi.java` | `genelAdres`/`yerelAdres` doğrulanmış çözüme bağlandı | BULGU-01, 04 |
| `security/YoneticiGirisSinirlayici.java` | `IstemciAdresi` enjekte edildi | BULGU-01 |
| `security/YoneticiIslemGunlukFiltresi.java` | `IstemciAdresi` enjekte edildi | BULGU-01, 04 |
| `web/AnalyticsController.java`, `NewsController.java`, `WebVitalController.java` | Statik çağrı örnek metoda çevrildi | BULGU-01 |
| `web/ContactTicketController.java` | Kendi XFF kopyası kaldırıldı; `@Transactional` eklendi | BULGU-02 |
| `resources/application.yml` | `forward-headers-strategy: none`; `guvenilir-vekiller`, `vekil-adim-sayisi`, `vekil-anahtari`, `konum-servisi.etkin` | BULGU-01, 09 |

### Backend — diğer
| Dosya | Değişiklik | Bulgu |
|---|---|---|
| `web/VeriHatasiIsleyici.java` | **YENİ** — veritabanı kısıt ihlalleri 500 yerine anlaşılır 400; ayrıntı yalnızca sunucu kaydına | BULGU-08 |
| `service/GirisKayitServisi.java` | Konum servisi yapılandırılabilir (`BIDB_KONUM_SERVISI`), IP değişmezi doğrulaması | BULGU-09 |
| `pom.xml` | Spring Boot 3.5.14→**3.5.16**, jackson-bom→**2.21.5**, pgjdbc→**42.7.13** | SCA |
| `db/migration/BENIOKU.md` | **YENİ** — uygulanmış göç dosyasının değiştirilmemesi kuralı | süreç |

### Frontend / SSR
| Dosya | Değişiklik | Bulgu |
|---|---|---|
| `src/server.ts` | Vekil yol doğrulaması (`new URL` + köken/önek denetimi); GET/HEAD dışı 405; `/yonetim` `no-store`; zaman aşımı + devre kesici; vekil anahtarı gönderimi | BULGU-03, 05, 06 |
| `src/styles.css` | Bal küpü gizleme kuralı kritik pakete taşındı | BULGU-07 |
| `src/styles/contact-ticket.css` | Aynı kural buradan kaldırıldı (gerekçe not edildi) | BULGU-07 |
| `src/app/admin/admin-api.service.ts` | 30 dk hareketsizlik zaman aşımı (geçen süre ölçümü, sekme askıya alınsa da doğru) | R-1 hafifletme |
| `src/app/admin/admin-panel.component.ts` | Oturumun neden kapandığını açıklayan mesaj | R-1 hafifletme |
| `src/index.html` | `ngCspNonce` yer tutucusu | CSP nonce |
| `src/eski-kok-yollar.ts` | **YENİ** — dil öneki olmayan eski adres eşlemesi (birebir, desen değil) | kırık bağlantı |

### Yapılandırma / dağıtım
| Dosya | Değişiklik |
|---|---|
| `docker-compose.yml` | `BIDB_VEKIL_ANAHTARI` iki serviste; DB kimlik bilgileri ortam değişkenine bağlandı; healthcheck sabit ad yerine değişken kullanıyor |
| `.env.example` | **YENİ** — vekil anahtarı, yönetici ve DB kimlik bilgileri, gerekçeleriyle |
| `.env` | Yerel geliştirme için rastgele vekil anahtarı üretildi (**sürüm denetimine girmez**) |

---

## Kapatılan bulgular

| ID | Başlık | Severity | Commit |
|---|---|---|---|
| BULGU-01 | Sahte XFF ile yönetici kaba kuvvet atlatması | High | `1cc6939` |
| BULGU-02 | Aynı kusur iletişim formu oran sınırında | High | `0deb80f` |
| BULGU-03 | SSR `/api` vekilinde yol kaçışı | High | `1a059bc` |
| BULGU-04 | Denetim kaydına sahte adres yazdırma | Medium | `1c80c10` |
| BULGU-05 | Yönetim panelinin önbelleğe alınabilmesi | Medium | `9980969` |
| BULGU-06 | Tüm HTTP metotlarının çizime girmesi, TRACE 500 | Low | `28764e7` |
| BULGU-07 | Bot tuzağının stil dosyasına bağımlılığı | Medium | `ae2a556` |
| BULGU-08 | Sütun sınırı aşımının 500 üretmesi | Medium | `4cc9912` |
| BULGU-09 | Yönetici IP'sinin denetimsiz üçüncü taraf aktarımı | Medium | `3731b02` |
| SCA | 22 bağımlılık zafiyet kaydı | — | `477d25f` |

---

## Çalıştırılan doğrulamalar

**Derleme**
- Backend: Maven derleme + kap açılışı — **başarılı** (healthcheck sağlıklı), Spring Boot 3.5.16
- Frontend: Angular üretim derlemesi — **başarılı**
- TypeScript tam sıkı mod (`tsc --noEmit`) — **hatasız**

**Güvenlik doğrulamaları** — her düzeltme için sömürü önce kanıtlandı, sonra
kapandığı gösterildi. Ayrıntılı ölçümler: `SECURITY_TEST_MATRIX.md`

**İşlevsel regresyon** — 11 sayfa tipi 200; 161 sitemap adresi 200; 80 belge ve
34 duyuru hedefi sağlam; 71 varlık sağlam; iletişim formu uçtan uca 201; yönetim
paneli açılıyor; API sözleşmesi korunuyor.

**Test verisi temizliği** — Doğrulama sırasında üretilen tüm kayıtlar silindi:
60 sahte giriş denemesi (`yonetici` kullanıcı adıyla, gerçek `admin` kayıtlarına
dokunulmadı), 14 test talebi, 1 test dosyası yüklemesi. Gerçek veriler korundu
(11 giriş kaydı, 1 gerçek iletişim talebi).

---

## Bilinçli olarak yapılmayanlar

| Konu | Neden |
|---|---|
| Kimlik doğrulamanın belirteç tabanlıya çevrilmesi (R-1) | Mimari değişiklik; direktif gereği mimari bozulmadı. Plan: `SECURITY_FIX_PLAN.md` P2-1 |
| Çok kullanıcılı yönetici modeli (R-2) | Aynı gerekçe. P2-2 |
| CSP'den `unsafe-inline` kaldırılması | Nonce zaten çalışıyor; kaldırma gerçek tarayıcıda ihlal raporu gerektirir. P2-3 |
| Konum servisinin varsayılan kapatılması | Çalışan bir özelliği güvenlik gerekçesiyle sessizce kapatmamak için; karar kurumun. Anahtar eklendi, gerekçe belgelendi |
| Erişilemeyen 5 dış bağlantının kaldırılması | Beşinin de alan adı çözülüyor (ayakta sunucular); büyük olasılıkla kampüs içi erişime açık. Tek noktadan yapılan ağ denemesine dayanarak kurumsal bağlantı silinmez |
| RLS (Row-Level Security) | Uygulamada kullanıcıya ait kaynak kavramı yok; tek paylaşılan yönetici hesabı var. Gerekli değil |

---

## Manuel olarak yapılması gerekenler

1. **`BIDB_VEKIL_ANAHTARI` üretimde tanımlanmalı** (frontend ve backend'de aynı değer).
   Tanımsızsa backend ara sunucuya ağ konumuna göre güvenir.
2. **`BIDB_YONETICI_PAROLA` ve `BIDB_DB_PAROLA`** üretim değerleriyle verilmeli.
3. **KVKK kararı** — yönetici IP'sinin `ipapi.co`'ya aktarımı aydınlatma metnine
   eklenmeli ya da `BIDB_KONUM_SERVISI=false` yapılmalı.
4. **TLS / reverse proxy / PostgreSQL sunucu** denetimi — komutlar
   `SECURITY_AUDIT.md` → "Manuel olarak yapılması gereken kontroller".
5. **`.env` dosyası yedeklenmemeli, paylaşılmamalı**; sürüm denetimine girmiyor.

---

## Kalan açıklar

Kapsam dâhilinde **doğrulanmış açık kalmadı**. Kalan riskler (R-1…R-5) mimari
karar ya da üretim ortamı erişimi gerektiriyor; tamamı `SECURITY_AUDIT.md`
içinde gerekçeleriyle listelendi.
