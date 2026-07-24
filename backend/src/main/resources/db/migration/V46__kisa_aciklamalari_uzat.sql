-- Kapsamlı SEO çalışması, son adım: önceden özel açıklaması olduğu için
-- V42'de dokunulmayan 13 sayfanın açıklaması 70 karakterin altındaydı
-- (e-imza rehberi sayfaları hep aynı kısa kalıbı kullanıyordu: "Hacettepe
-- Üniversitesi e-imza kullanma rehberi: {Konu}."). Var olan metin
-- değiştirilmedi, yalnızca aynı üslupta kısa bir tamamlayıcı cümleyle
-- uzatıldı.

UPDATE page SET seo_description = seo_description || ' Adım adım bilgilendirme.'
WHERE language = 'tr' AND slug IN (
  'e-signature-about', 'e-signature-application', 'e-signature-cancellation',
  'e-signature-java', 'e-signature-legislation', 'e-signature-password',
  'e-signature-remote-desktop', 'e-signature-renewal', 'e-signature-security-word',
  'e-signature-update', 'e-signature-workflow'
);

UPDATE page SET seo_description = seo_description || ' — step-by-step guide.'
WHERE language = 'en' AND slug = 'email-backup-video';
