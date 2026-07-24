-- Gemini'nin ana sayfa kısayolları için ürettiği "_new.jpg" ikon seti,
-- soyut/parlak yapay-zekâ görselleriydi: küçük boyutta (36-48px) ne
-- işe yaradığı anlaşılmıyordu (ör. "HÜ BİDB Portalı" ikonu soyut bir
-- ışık kürecikleri ağıydı, "portal" kavramıyla hiçbir görsel bağı yoktu).
-- Bu, projenin "otantik, kurumsal, yapay zekâ hissi vermeyen" tasarım
-- ilkesiyle de çelişiyordu.
--
-- Bu iki ikon KORUNDU (kullanıcı isteği): E-Posta Giriş (Exchange logosu,
-- icon_exchange2.jpg) ve Office 365 (office365.png) — zaten tanınır marka
-- simgeleri, "_new" setinde de yoktular.
--
-- Diğer 10 kısayol, siteye önceden yüklenmiş sade/düz ikon setine
-- (aynı ada sahip .png dosyaları) döndürüldü.

UPDATE shortcut
SET icon_url = replace(icon_url, '_new.jpg', '.png')
WHERE icon_url LIKE '%\_new.jpg' ESCAPE '\';
