-- Kaynak sayfaya sonradan eklenen VPN kılavuzu bizde eksikti.
--
-- BULGU
-- İçerik denetimi (node tools/verify-content.js) tr/vpn için fark bildirdi:
-- kaynak 501 karakter, bizde 450. Aradaki 51 karakter tek bir bağlantı:
--
--     Android ve Ios Cihazlar İçin VPN Bağlantı Kılavuzu
--
-- Kaynak sayfa (/tr/VPN) bu paragrafı aktarımdan SONRA eklemiş. Sonucu:
-- Android ve iOS kullanan ziyaretçi, kendi cihazına ait kurulum kılavuzuna
-- bizim sitemizden ulaşamıyordu. Sayfada yalnızca masaüstü kılavuzu vardı.
--
-- BELGE YERELE ALINDI
-- Bağlantı kaynak sunucuya bırakılmadı; PDF indirilip frontend/public/dosyalar
-- altına kondu (221.585 bayt, PDF 1.7, tek sayfa — doğrulandı). Projenin
-- kuralı bu: eksik-denetim.js "kaynak sunucuya bağımlılık" sayısını sıfırda
-- tutuyor. Kaynak sunucu erişilemez olduğunda bağlantının kırılmaması için.
--
-- Dosya adı kaynaktakiyle aynı bırakıldı; kaynakta bu adresi paylaşmış
-- olabilecek başka sayfa ya da belgelerin de çalışması için.
--
-- İşaretleme, hemen üstündeki kurulum dökümanı bağlantısının biçimiyle
-- birebir aynı: <p><a href="…" target="_blank">…</a></p>
--
-- İki yere yazılır:
--   1. page.content_html — sayfa metninde görünen bağlantı
--   2. document          — sayfanın belge listesi (panelden yönetilen kayıt)
-- İkisi ayrı tutulur; biri diğerinden üretilmiyor.

UPDATE page
   SET content_html = replace(
         content_html,
         '<p>Herhangi bir sorun ile karşılaşmanız durumunda',
         '<p><a href="/dosyalar/ANDROIDveIOSCIHAZLARICINVPNBAGLANTIKILAVUZU.pdf" target="_blank">'
         || 'Android ve Ios Cihazlar İçin VPN Bağlantı Kılavuzu</a></p>'
         || '<p>Herhangi bir sorun ile karşılaşmanız durumunda')
 WHERE language = 'tr'
   AND slug = 'vpn'
   AND content_html LIKE '%<p>Herhangi bir sorun ile karşılaşmanız durumunda%'
   AND content_html NOT LIKE '%ANDROIDveIOSCIHAZLARICINVPNBAGLANTIKILAVUZU%';

INSERT INTO document (page_id, name, url, file_type, sort_order)
SELECT p.id,
       'Android ve Ios Cihazlar İçin VPN Bağlantı Kılavuzu',
       '/dosyalar/ANDROIDveIOSCIHAZLARICINVPNBAGLANTIKILAVUZU.pdf',
       'PDF',
       1
  FROM page p
 WHERE p.language = 'tr'
   AND p.slug = 'vpn'
   AND NOT EXISTS (
         SELECT 1 FROM document d
          WHERE d.page_id = p.id
            AND d.url = '/dosyalar/ANDROIDveIOSCIHAZLARICINVPNBAGLANTIKILAVUZU.pdf');
