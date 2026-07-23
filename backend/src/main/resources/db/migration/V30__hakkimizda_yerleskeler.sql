-- Hakkımızda sayfasındaki yerleşke kapsamı genişletilir.
-- Uygulanmış eski migration değiştirilmez; böylece Flyway checksum bütünlüğü korunur.

UPDATE page
SET content_html = replace(
        content_html,
        '<p>Üniversitemiz iki ana yerleşkeye sahiptir. Başkanlığın ana binası Beytepe Yerleşkesinde, buraya bağlı Bilgi İşlem Merkezi ise Sıhhiye Yerleşkesinde bulunur. Her iki yerleşke UlakNet üzerinden yüksek hızda internet hizmeti alır ve birbirine Metro Ethernet hattıyla bağlıdır.</p>',
        '<p>Üniversitemiz iki ana yerleşkeye ve meslek yüksekokullarına sahiptir. Başkanlığın ana binası Beytepe Yerleşkesinde, buraya bağlı Bilgi İşlem Merkezi ise Sıhhiye Yerleşkesinde bulunur. Başkanlığımız ayrıca Sağlık, Kültür ve Spor Daire Başkanlığına bağlı üniversite işletmelerine bilgi işlem desteği sağlar. Her iki yerleşke UlakNet üzerinden yüksek hızda internet hizmeti alır ve birbirine Metro Ethernet hattıyla bağlıdır.</p>'
    ),
    updated_at = now()
WHERE slug = 'about'
  AND language = 'tr'
  AND content_html LIKE '%Üniversitemiz iki ana yerleşkeye sahiptir.%';
