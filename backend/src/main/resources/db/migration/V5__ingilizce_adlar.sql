-- Tablo ve sütun adları İngilizceye taşınır.
--
-- Yalnızca ADLAR değişir: veri, ilişkiler ve kısıtlar olduğu gibi kalır.
-- PostgreSQL sütun yeniden adlandırmada indeksleri ve yabancı anahtarları
-- kendiliğinden korur.

-- ---------- sütunlar ----------

-- ayar
ALTER TABLE ayar RENAME COLUMN anahtar TO name;
ALTER TABLE ayar RENAME COLUMN dil TO language;
ALTER TABLE ayar RENAME COLUMN deger TO value;

-- belge
ALTER TABLE belge RENAME COLUMN sayfa_id TO page_id;
ALTER TABLE belge RENAME COLUMN ad TO name;
ALTER TABLE belge RENAME COLUMN adres TO url;
ALTER TABLE belge RENAME COLUMN tur TO file_type;
ALTER TABLE belge RENAME COLUMN sira TO sort_order;

-- duyuru
ALTER TABLE duyuru RENAME COLUMN dil TO language;
ALTER TABLE duyuru RENAME COLUMN baslik TO title;
ALTER TABLE duyuru RENAME COLUMN ozet TO summary;
ALTER TABLE duyuru RENAME COLUMN icerik_html TO content_html;
ALTER TABLE duyuru RENAME COLUMN yayin_tarihi TO published_on;
ALTER TABLE duyuru RENAME COLUMN one_cikan TO featured;
ALTER TABLE duyuru RENAME COLUMN yayinda TO published;
ALTER TABLE duyuru RENAME COLUMN dis_adres TO external_url;
ALTER TABLE duyuru RENAME COLUMN gorsel_url TO image_url;
ALTER TABLE duyuru RENAME COLUMN gorsel_alt TO image_alt;

-- hizli_erisim
ALTER TABLE hizli_erisim RENAME COLUMN dil TO language;
ALTER TABLE hizli_erisim RENAME COLUMN ad TO name;
ALTER TABLE hizli_erisim RENAME COLUMN ikon_url TO icon_url;
ALTER TABLE hizli_erisim RENAME COLUMN adres TO url;
ALTER TABLE hizli_erisim RENAME COLUMN yeni_sekme TO new_tab;
ALTER TABLE hizli_erisim RENAME COLUMN sira TO sort_order;
ALTER TABLE hizli_erisim RENAME COLUMN yayinda TO published;

-- menu
ALTER TABLE menu RENAME COLUMN dil TO language;
ALTER TABLE menu RENAME COLUMN konum TO position;
ALTER TABLE menu RENAME COLUMN baslik TO title;
ALTER TABLE menu RENAME COLUMN sira TO sort_order;

-- menu_oge
ALTER TABLE menu_oge RENAME COLUMN ust_oge_id TO parent_item_id;
ALTER TABLE menu_oge RENAME COLUMN etiket TO label;
ALTER TABLE menu_oge RENAME COLUMN sayfa_id TO page_id;
ALTER TABLE menu_oge RENAME COLUMN dis_adres TO external_url;
ALTER TABLE menu_oge RENAME COLUMN yeni_sekme TO new_tab;
ALTER TABLE menu_oge RENAME COLUMN sira TO sort_order;

-- sayfa
ALTER TABLE sayfa RENAME COLUMN dil TO language;
ALTER TABLE sayfa RENAME COLUMN baslik TO title;
ALTER TABLE sayfa RENAME COLUMN icerik_html TO content_html;
ALTER TABLE sayfa RENAME COLUMN yayinda TO published;
ALTER TABLE sayfa RENAME COLUMN sira TO sort_order;
ALTER TABLE sayfa RENAME COLUMN olusturulma TO created_at;
ALTER TABLE sayfa RENAME COLUMN guncelleme TO updated_at;

-- sayfa_surum
ALTER TABLE sayfa_surum RENAME COLUMN sayfa_id TO page_id;
ALTER TABLE sayfa_surum RENAME COLUMN baslik TO title;
ALTER TABLE sayfa_surum RENAME COLUMN icerik_html TO content_html;
ALTER TABLE sayfa_surum RENAME COLUMN aciklama TO note;
ALTER TABLE sayfa_surum RENAME COLUMN kaydeden TO saved_by;
ALTER TABLE sayfa_surum RENAME COLUMN kayit_zamani TO saved_at;

-- slider
ALTER TABLE slider RENAME COLUMN dil TO language;
ALTER TABLE slider RENAME COLUMN baslik TO title;
ALTER TABLE slider RENAME COLUMN alt_baslik TO subtitle;
ALTER TABLE slider RENAME COLUMN gorsel_url TO image_url;
ALTER TABLE slider RENAME COLUMN gorsel_alt TO image_alt;
ALTER TABLE slider RENAME COLUMN baglanti TO link_url;
ALTER TABLE slider RENAME COLUMN sira TO sort_order;
ALTER TABLE slider RENAME COLUMN yayinda TO published;
ALTER TABLE slider RENAME COLUMN baslangic TO starts_on;
ALTER TABLE slider RENAME COLUMN bitis TO ends_on;

-- sosyal_hesap
ALTER TABLE sosyal_hesap RENAME COLUMN ag TO network;
ALTER TABLE sosyal_hesap RENAME COLUMN adres TO url;
ALTER TABLE sosyal_hesap RENAME COLUMN sira TO sort_order;
ALTER TABLE sosyal_hesap RENAME COLUMN yayinda TO published;

-- yonlendirme
ALTER TABLE yonlendirme RENAME COLUMN eski_yol TO old_path;
ALTER TABLE yonlendirme RENAME COLUMN yeni_yol TO new_path;
ALTER TABLE yonlendirme RENAME COLUMN olusturma TO created_at;

-- yuklenen_dosya
ALTER TABLE yuklenen_dosya RENAME COLUMN dosya_adi TO file_name;
ALTER TABLE yuklenen_dosya RENAME COLUMN ozgun_ad TO original_name;
ALTER TABLE yuklenen_dosya RENAME COLUMN boyut TO size_bytes;
ALTER TABLE yuklenen_dosya RENAME COLUMN yukleyen TO uploaded_by;
ALTER TABLE yuklenen_dosya RENAME COLUMN yukleme TO uploaded_at;

-- ---------- tablolar ----------

ALTER TABLE ayar RENAME TO setting;
ALTER TABLE belge RENAME TO document;
ALTER TABLE duyuru RENAME TO news;
ALTER TABLE hizli_erisim RENAME TO shortcut;
ALTER TABLE menu_oge RENAME TO menu_item;
ALTER TABLE sayfa RENAME TO page;
ALTER TABLE sayfa_surum RENAME TO page_revision;
ALTER TABLE slider RENAME TO slide;
ALTER TABLE sosyal_hesap RENAME TO social_account;
ALTER TABLE yonlendirme RENAME TO redirect;
ALTER TABLE yuklenen_dosya RENAME TO uploaded_file;
