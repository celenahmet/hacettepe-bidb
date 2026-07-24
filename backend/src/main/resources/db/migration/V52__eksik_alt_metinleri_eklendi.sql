-- 5 sayfada (cms, e-signature-faq, e-signature-java, e-signature-workflow,
-- webmail — her ikisi de TR/EN) toplam 13 görsel görüntülenip incelendi,
-- her birine kısa ve doğru (uydurulmamış) bir alt metni eklendi. Metin
-- değişmedi, yalnızca href/src değerinden sonra alt="" eklendi.

-- === cms: HÜ-İYS'nin altı özelliğini gösteren simgeler ===
UPDATE page SET content_html = replace(replace(replace(replace(replace(replace(
    content_html,
    'src="/images/hu-iysicon01.png"', 'src="/images/hu-iysicon01.png" alt="İçerik düzenleme simgesi"'),
    'src="/images/hu-iysicon02.png"', 'src="/images/hu-iysicon02.png" alt="Anahtar simgesi"'),
    'src="/images/hu-iysicon03.png"', 'src="/images/hu-iysicon03.png" alt="Yapboz parçası simgesi"'),
    'src="/images/hu-iysicon04.png"', 'src="/images/hu-iysicon04.png" alt="Şablon düzenleme simgesi"'),
    'src="/images/hu-iysicon05.png"', 'src="/images/hu-iysicon05.png" alt="Dosya eki simgesi"'),
    'src="/images/hu-iysicon06.png"', 'src="/images/hu-iysicon06.png" alt="Sunum sehpası simgesi"'),
  updated_at = now()
WHERE slug = 'cms' AND language = 'tr';

UPDATE page SET content_html = replace(replace(replace(replace(replace(replace(
    content_html,
    'src="/images/hu-iysicon01.png"', 'src="/images/hu-iysicon01.png" alt="Content editing icon"'),
    'src="/images/hu-iysicon02.png"', 'src="/images/hu-iysicon02.png" alt="Key icon"'),
    'src="/images/hu-iysicon03.png"', 'src="/images/hu-iysicon03.png" alt="Puzzle piece icon"'),
    'src="/images/hu-iysicon04.png"', 'src="/images/hu-iysicon04.png" alt="Template editing icon"'),
    'src="/images/hu-iysicon05.png"', 'src="/images/hu-iysicon05.png" alt="File attachment icon"'),
    'src="/images/hu-iysicon06.png"', 'src="/images/hu-iysicon06.png" alt="Presentation easel icon"'),
  updated_at = now()
WHERE slug = 'cms' AND language = 'en';

-- === e-signature-faq: KAMU SM başvuru imzalama yöntemi ekran görüntüsü ===
UPDATE page SET content_html = replace(
    content_html,
    'src="/images/eimza/imzalama_methodu.jpg"',
    'src="/images/eimza/imzalama_methodu.jpg" alt="Kamu Sertifikasyon Merkezi web sitesinde başvuru imzalama yöntemi seçim ekranı"'
  ), updated_at = now()
WHERE slug = 'e-signature-faq' AND language = 'tr';

UPDATE page SET content_html = replace(
    content_html,
    'src="/images/eimza/imzalama_methodu.jpg"',
    'src="/images/eimza/imzalama_methodu.jpg" alt="Screenshot of the Public Certification Authority website showing the application signing method selection screen"'
  ), updated_at = now()
WHERE slug = 'e-signature-faq' AND language = 'en';

-- === e-signature-java: Java denetim masası kurulum adımları ===
UPDATE page SET content_html = replace(replace(
    content_html,
    'src="/images/eimza/basvuru_java.jpg"',
    'src="/images/eimza/basvuru_java.jpg" alt="Windows Denetim Masasında Java (32-bit) simgesinin konumu"'),
    'src="/images/eimza/basvuru_java_security.jpg"',
    'src="/images/eimza/basvuru_java_security.jpg" alt="Java Denetim Masası Güvenlik sekmesinde Orta güvenlik düzeyi seçimi"'
  ), updated_at = now()
WHERE slug = 'e-signature-java' AND language = 'tr';

UPDATE page SET content_html = replace(replace(
    content_html,
    'src="/images/eimza/basvuru_java.jpg"',
    'src="/images/eimza/basvuru_java.jpg" alt="Windows Control Panel showing the location of the Java (32-bit) icon"'),
    'src="/images/eimza/basvuru_java_security.jpg"',
    'src="/images/eimza/basvuru_java_security.jpg" alt="Java Control Panel Security tab with Medium security level selected"'
  ), updated_at = now()
WHERE slug = 'e-signature-java' AND language = 'en';

-- === e-signature-workflow: başvuru iş akışı şeması ===
UPDATE page SET content_html = replace(
    content_html,
    'src="/images/eimza/isakisi_20141120_personel.jpg"',
    'src="/images/eimza/isakisi_20141120_personel.jpg" alt="Hacettepe Üniversitesi personeli için e-imza başvuru iş akışını gösteren şema"'
  ), updated_at = now()
WHERE slug = 'e-signature-workflow' AND language = 'tr';

UPDATE page SET content_html = replace(
    content_html,
    'src="/images/eimza/isakisi_20141120_personel.jpg"',
    'src="/images/eimza/isakisi_20141120_personel.jpg" alt="Diagram showing the e-signature application workflow for Hacettepe University staff"'
  ), updated_at = now()
WHERE slug = 'e-signature-workflow' AND language = 'en';

-- === webmail: hizmet simgeleri ===
UPDATE page SET content_html = replace(replace(replace(
    content_html,
    'src="/images/icon_exchange2.jpg"', 'src="/images/icon_exchange2.jpg" alt="Microsoft Exchange simgesi"'),
    'src="/images/icon_mail2.jpg"', 'src="/images/icon_mail2.jpg" alt="E-posta simgesi"'),
    'src="/images/icon/portal.png"', 'src="/images/icon/portal.png" alt="Portal simgesi"'),
  updated_at = now()
WHERE slug = 'webmail' AND language = 'tr';

UPDATE page SET content_html = replace(replace(replace(
    content_html,
    'src="/images/icon_exchange2.jpg"', 'src="/images/icon_exchange2.jpg" alt="Microsoft Exchange icon"'),
    'src="/images/icon_mail2.jpg"', 'src="/images/icon_mail2.jpg" alt="E-mail icon"'),
    'src="/images/icon/portal.png"', 'src="/images/icon/portal.png" alt="Portal icon"'),
  updated_at = now()
WHERE slug = 'webmail' AND language = 'en';
