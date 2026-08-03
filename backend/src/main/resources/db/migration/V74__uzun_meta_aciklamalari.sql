-- Arama sonuçlarında kırpılan üç meta açıklaması kısaltıldı.
--
-- Arama motorları açıklamayı yaklaşık 160 karakterde kesiyor. Aşağıdaki üç
-- kayıt 167-173 karakterdi; cümlenin sonu (birim listesinin son öğeleri,
-- "bilgi güvenliği yönetimi") sonuçlarda hiç görünmüyordu.
--
-- BU METİNLER KAYNAK İÇERİĞİ DEĞİL. Denetlendi: kaynak sitedeki karşılık
-- gelen sayfaların hiçbirinde meta açıklaması YOK
-- (/tr/personel, /tr/e_liste, /tr/posta_kural — üçünde de description
-- etiketi bulunmuyor). Bu açıklamalar yeniden kurulum sırasında bizim
-- yazdıklarımız; kısaltmak "kaynak metin birebir korunur" kuralına
-- dokunmuyor.
--
-- Kısaltma yöntemi: kurum adının başlıkta zaten geçtiği yerde açıklamadan
-- çıkarıldı, anlam ve kapsam korundu. Sayfa metinlerine dokunulmadı.
--
--   tr/staff  167 -> 144
--   en/staff  173 -> 146
--   en/about  173 -> 137
--
-- tr/about (155) ve iki mailing-lists kaydı (149/151) sınırın altında;
-- onlara dokunulmuyor. Not: bu kayıtlar bir ara "çok uzun" görünmüştü,
-- sebebi ölçüm aracının &quot; gibi HTML varlıklarını altı karakter
-- sayması ve uzunluğu şişirmesiydi. Araç düzeltildi.

UPDATE page
   SET seo_description = 'Bilgi İşlem Daire Başkanlığı birim ve personel listesi: yönetim, ağ, sistem, yazılım geliştirme, insan kaynakları ve kullanıcı destek birimleri.'
 WHERE slug = 'staff' AND language = 'tr';

UPDATE page
   SET seo_description = 'Staff directory of the Department of Information Technology: management, network, systems, software development, human resources and user support.'
 WHERE slug = 'staff' AND language = 'en';

UPDATE page
   SET seo_description = 'Hacettepe University Department of Information Technology: establishment, legal basis, activities, organisational structure and campuses.'
 WHERE slug = 'about' AND language = 'en';
