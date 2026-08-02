-- E-posta altyapısı, 2. adım: yönetici hesabı veritabanına taşınıyor.
--
-- NEDEN GEREKLİ
-- Hesap şimdiye kadar bellekteydi ve parola BIDB_YONETICI_PAROLA ortam
-- değişkeninden okunuyordu (SecurityConfig.yoneticiler). Ortam değişkenindeki
-- bir parola çalışma sırasında değiştirilemez; yani "şifremi unuttum" akışı
-- kurulamaz. Parolanın değiştirilebilir bir yerde durması gerekiyor.
--
-- KİLİTLENME RİSKİ VE GERİ DÖNÜŞ YOLU
-- Bu değişiklik yanlış yapılırsa yönetici kendi paneline giremez. Bu yüzden:
--
--   * Tablo BOŞSA uygulama açılışta ortam değişkenindeki bilgilerle bir hesap
--     oluşturur. Yani bu göç uygulandığı anda giriş bilgileri DEĞİŞMEZ;
--     mevcut kullanıcı adı ve parola aynen çalışmaya devam eder.
--
--   * Parola unutulur ve e-posta da yapılandırılmamışsa, veritabanına
--     erişimi olan bir işletmen şunu çalıştırıp servisi yeniden başlatarak
--     hesabı ortam değişkenindeki değerlerle yeniden oluşturabilir:
--
--         DELETE FROM admin_account;
--
--     Bu, bilinçli olarak bırakılmış acil durum kapısıdır. Veritabanına
--     erişim zaten en yüksek yetki seviyesidir; yeni bir zayıflık açmaz.
--
-- ORTAM DEĞİŞKENİ ARTIK YALNIZCA TOHUMDUR
-- Hesap bir kez oluştuktan sonra ortam değişkenindeki parola ARTIK
-- GEÇERLİ DEĞİLDİR. Aksi hâlde parola sıfırlamanın hiçbir anlamı kalmazdı:
-- eski parola çalışmaya devam ederdi.

CREATE TABLE admin_account (
    id                   BIGSERIAL PRIMARY KEY,
    username             VARCHAR(120)  NOT NULL,
    -- BCrypt karması. Düz parola hiçbir yerde saklanmaz.
    password_hash        VARCHAR(200)  NOT NULL,
    -- Parola sıfırlama iletisinin gideceği adres. Tanımlı değilse sıfırlama
    -- akışı çalışmaz; panelde bu durum açıkça belirtilir.
    email                VARCHAR(254),
    password_updated_at  TIMESTAMPTZ,
    created_at           TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT admin_account_username_uq UNIQUE (username)
);

-- Kayıt eklenmiyor: karma üretimi uygulamanın işi (BCrypt). Açılışta
-- tablo boşsa YoneticiHesabiKurulum tohumu ekler.
