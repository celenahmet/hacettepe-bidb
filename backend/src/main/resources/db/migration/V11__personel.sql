-- Personel bilgisi HTML metninden yapısal veriye taşınır.
--
-- GEREKÇE: Personel sayfası tek bir HTML bloğuydu; birimler <strong>,
-- kişiler <br /> ile ayrılmıştı, birim sorumlusu adın sonundaki yıldızla
-- belirtiliyordu. Bu biçimde:
--   * panelden kişi eklenip silinemez (HTML elle düzenlenmek zorundadır),
--   * bir kişiye fotoğraf eklenemez (bağlanacağı bir kayıt yoktur),
--   * sıralama değiştirilemez,
--   * aynı kişi birden çok yerde geçtiğinde tutarlılık denetlenemez.
--
-- İki tablo yeterlidir: birim ve kişi. Kampüs, telefon ve "birim sorumlusu"
-- bilgisi ayrı alanlara çıkarılır — metnin içine gömülü olduklarında
-- sorgulanamaz ve biçimlendirilemezler.
--
-- İÇERİK KORUNUR: adların yazımı birebir aktarılır. Kaynak metindeki
-- "(Beytepe)" ve "(297 62 62)" gibi parantezli ekler silinmez, yalnızca
-- kendi alanlarına taşınır ve sayfada yeniden gösterilir.

CREATE TABLE staff_unit (
    id         BIGSERIAL PRIMARY KEY,
    language   VARCHAR(2)   NOT NULL DEFAULT 'tr',
    name       VARCHAR(200) NOT NULL,
    -- Beytepe / Sıhhiye. Aynı birimin iki yerleşkedeki ekibi ayrı kayıttır.
    campus     VARCHAR(60),
    phone      VARCHAR(60),
    sort_order INT          NOT NULL DEFAULT 0,
    published  BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE staff_member (
    id         BIGSERIAL PRIMARY KEY,
    unit_id    BIGINT       NOT NULL REFERENCES staff_unit(id) ON DELETE CASCADE,
    full_name  VARCHAR(200) NOT NULL,
    -- Yalnızca yönetim kadrosunda dolu: "Daire Başkanı" gibi.
    role_title VARCHAR(200),
    -- Kaynak metinde adın yanındaki açıklama: "(e-imza)".
    note       VARCHAR(200),
    -- Kaynak sayfadaki yıldız işareti: "* Birim Sorumluları".
    is_lead    BOOLEAN      NOT NULL DEFAULT FALSE,
    photo_url  VARCHAR(300),
    -- Fotoğraf yüklenmediğinde gösterilecek varsayılan ikon tercihi:
    -- 'kadin' | 'erkek' | NULL (nötr). Kişisel bir veri alanı değil,
    -- yalnızca bir görsel tercihtir; boş bırakılabilir.
    avatar     VARCHAR(10),
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_staff_unit_dil ON staff_unit (language, sort_order);
CREATE INDEX idx_staff_member_birim ON staff_member (unit_id, sort_order);


-- ---------------------------------------------------------------------
-- Mevcut sayfadaki personel listesi aktarılır.
-- ---------------------------------------------------------------------

INSERT INTO staff_unit (name, campus, phone, sort_order) VALUES
    ('Yönetim',                            NULL,      NULL,         1),
    ('İdari ve Mali İşler Birimi',         NULL,      NULL,         2),
    ('E-Posta Hizmetleri',                 NULL,      '297 62 62',  3),
    ('Ağ Birimi',                          'Beytepe', NULL,         4),
    ('Ağ ve Sistem Birimi',                'Sıhhiye', NULL,         5),
    ('Sistem Birimi',                      'Beytepe', NULL,         6),
    ('Sistem Yazılımları Birimi',          NULL,      NULL,         7),
    ('Yazılım Geliştirme Birimi',          NULL,      NULL,         8),
    ('EBYS ve Bireysel İşlemler Birimi',   'Beytepe', NULL,         9),
    ('EBYS ve Bireysel İşlemler Birimi',   'Sıhhiye', NULL,        10),
    ('İnsan Kaynakları Birimi',            NULL,      NULL,        11),
    ('Kullanıcı Destek Birimi',            'Beytepe', NULL,        12),
    ('Kullanıcı Destek Birimi',            'Sıhhiye', NULL,        13),
    ('Web Birimi',                         NULL,      NULL,        14),
    ('Sıhhiye Bilgisayar Laboratuvarı',    NULL,      NULL,        15),
    ('Başkanlık İdari Destek Personeli',   NULL,      NULL,        16);

-- Kişiler, birime (ad + yerleşke) göre bağlanır: aynı adı taşıyan iki
-- birim yalnızca yerleşkeyle ayrıldığı için ikisi birlikte aranır.
INSERT INTO staff_member (unit_id, full_name, role_title, note, is_lead, sort_order)
SELECT b.id, g.full_name, g.role_title, g.note, g.is_lead, g.sort_order
FROM (VALUES
    ('Yönetim', NULL, 'Mustafa Gökhan Güzel', 'Daire Başkanı', NULL, FALSE, 1),
    ('Yönetim', NULL, 'Esin Alan', 'Başkanlık Sekreteri', NULL, FALSE, 2),

    ('İdari ve Mali İşler Birimi', NULL, 'Esin Alan', NULL, NULL, TRUE, 1),
    ('İdari ve Mali İşler Birimi', NULL, 'Ertan Güzelcan', NULL, NULL, FALSE, 2),
    ('İdari ve Mali İşler Birimi', NULL, 'Süleyman Alaş', NULL, NULL, FALSE, 3),
    ('İdari ve Mali İşler Birimi', NULL, 'Merve Ak', NULL, NULL, FALSE, 4),

    ('E-Posta Hizmetleri', NULL, 'Aysun Ardıç', NULL, NULL, TRUE, 1),
    ('E-Posta Hizmetleri', NULL, 'Emre Gökmen', NULL, NULL, TRUE, 2),

    ('Ağ Birimi', 'Beytepe', 'Sadık Toklu', NULL, NULL, TRUE, 1),
    ('Ağ Birimi', 'Beytepe', 'Erkan Türkyılmaz', NULL, NULL, FALSE, 2),
    ('Ağ Birimi', 'Beytepe', 'Hasan Türker Sözer', NULL, NULL, FALSE, 3),
    ('Ağ Birimi', 'Beytepe', 'Fatih Kekeç', NULL, NULL, FALSE, 4),

    ('Ağ ve Sistem Birimi', 'Sıhhiye', 'Cefakar İçel', NULL, NULL, TRUE, 1),

    ('Sistem Birimi', 'Beytepe', 'Görkem Çoruh', NULL, NULL, TRUE, 1),
    ('Sistem Birimi', 'Beytepe', 'Esma Özge Pöç', NULL, NULL, FALSE, 2),
    ('Sistem Birimi', 'Beytepe', 'Ramazan Öztürk', NULL, NULL, FALSE, 3),
    ('Sistem Birimi', 'Beytepe', 'Hüseyin Özyurt', NULL, NULL, FALSE, 4),
    ('Sistem Birimi', 'Beytepe', 'Ahmet Emin Baktır', NULL, NULL, FALSE, 5),

    ('Sistem Yazılımları Birimi', NULL, 'İsmail Hakkı Sönmez', NULL, NULL, TRUE, 1),

    ('Yazılım Geliştirme Birimi', NULL, 'Fehime Aydın', NULL, NULL, TRUE, 1),
    ('Yazılım Geliştirme Birimi', NULL, 'Taha Baş', NULL, NULL, FALSE, 2),
    ('Yazılım Geliştirme Birimi', NULL, 'Çağlar Ünal', NULL, NULL, FALSE, 3),
    ('Yazılım Geliştirme Birimi', NULL, 'Hacer Doğan', NULL, NULL, FALSE, 4),
    ('Yazılım Geliştirme Birimi', NULL, 'Ahum Barbaros', NULL, NULL, FALSE, 5),
    ('Yazılım Geliştirme Birimi', NULL, 'Erencan Polat', NULL, NULL, FALSE, 6),
    ('Yazılım Geliştirme Birimi', NULL, 'Özgür Özköse', NULL, NULL, FALSE, 7),
    ('Yazılım Geliştirme Birimi', NULL, 'Abdulkadir Üçme', NULL, NULL, FALSE, 8),
    ('Yazılım Geliştirme Birimi', NULL, 'Şeref Çambaşı', NULL, NULL, FALSE, 9),
    ('Yazılım Geliştirme Birimi', NULL, 'Hasan Avcı', NULL, NULL, FALSE, 10),
    ('Yazılım Geliştirme Birimi', NULL, 'Şahin Kaan Aytaç', NULL, NULL, FALSE, 11),

    ('EBYS ve Bireysel İşlemler Birimi', 'Beytepe', 'Sevgi İpek', NULL, NULL, TRUE, 1),
    ('EBYS ve Bireysel İşlemler Birimi', 'Beytepe', 'Hilal Vural Sicim', NULL, 'e-imza', FALSE, 2),
    ('EBYS ve Bireysel İşlemler Birimi', 'Beytepe', 'Özge Işıl Kulaksız', NULL, NULL, FALSE, 3),
    ('EBYS ve Bireysel İşlemler Birimi', 'Beytepe', 'Özge Taşcı', NULL, NULL, FALSE, 4),

    ('EBYS ve Bireysel İşlemler Birimi', 'Sıhhiye', 'Saliha Kübra Aydın', NULL, NULL, TRUE, 1),
    ('EBYS ve Bireysel İşlemler Birimi', 'Sıhhiye', 'Ali Doğan', NULL, NULL, FALSE, 2),
    ('EBYS ve Bireysel İşlemler Birimi', 'Sıhhiye', 'Kaymak Yıldıztekin', NULL, NULL, FALSE, 3),

    ('İnsan Kaynakları Birimi', NULL, 'Nazlı Özlem Onat', NULL, NULL, TRUE, 1),
    ('İnsan Kaynakları Birimi', NULL, 'Sezai Yılmaz', NULL, NULL, FALSE, 2),

    ('Kullanıcı Destek Birimi', 'Beytepe', 'Kadir Akın Ayhan', NULL, NULL, TRUE, 1),
    ('Kullanıcı Destek Birimi', 'Beytepe', 'Ahmet Serdar Öztürk', NULL, NULL, FALSE, 2),
    ('Kullanıcı Destek Birimi', 'Beytepe', 'Ali Özgan', NULL, NULL, FALSE, 3),
    ('Kullanıcı Destek Birimi', 'Beytepe', 'İbrahim Halil Demir', NULL, NULL, FALSE, 4),

    ('Kullanıcı Destek Birimi', 'Sıhhiye', 'Mehmet Karataş', NULL, NULL, TRUE, 1),
    ('Kullanıcı Destek Birimi', 'Sıhhiye', 'Mevlüt Ediz', NULL, NULL, FALSE, 2),
    ('Kullanıcı Destek Birimi', 'Sıhhiye', 'Osman Çetin', NULL, NULL, FALSE, 3),

    ('Web Birimi', NULL, 'İzgen Solak', NULL, NULL, TRUE, 1),
    ('Web Birimi', NULL, 'Mehtap Sayılgan Toklu', NULL, NULL, FALSE, 2),
    ('Web Birimi', NULL, 'Gülten Özyurt', NULL, NULL, FALSE, 3),

    ('Sıhhiye Bilgisayar Laboratuvarı', NULL, 'Kaymak Yıldıztekin', NULL, NULL, TRUE, 1),

    ('Başkanlık İdari Destek Personeli', NULL, 'Mustafa Kayhan', NULL, NULL, FALSE, 1),
    ('Başkanlık İdari Destek Personeli', NULL, 'Gülay Çitçi', NULL, NULL, FALSE, 2),
    ('Başkanlık İdari Destek Personeli', NULL, 'Mehmet Aslan', NULL, NULL, FALSE, 3)
) AS g(birim, yerleske, full_name, role_title, note, is_lead, sort_order)
JOIN staff_unit b
  ON b.name = g.birim
 AND b.campus IS NOT DISTINCT FROM g.yerleske
 AND b.language = 'tr';


-- Sayfanın gövdesi artık veritabanındaki bu iki tablodan üretilir.
-- Sayfa kaydı başlık, adres, menü bağı ve arama motoru bilgileri için durur.
UPDATE page
SET content_html = '',
    updated_at = now()
WHERE slug = 'staff' AND language = 'tr';
