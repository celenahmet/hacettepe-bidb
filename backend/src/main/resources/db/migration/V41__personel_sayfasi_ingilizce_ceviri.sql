-- Personel sayfası (staff_unit / staff_member) yapısal veriye taşındığı
-- için verify-content.js kapsamı dışındadır (bkz. BILINCLI_SAPMA: tr/staff).
-- EN satırları önceki bir oturumda oluşturulmuş ama gerçek çeviri
-- yapılmamış — birim adlarının sonuna sadece " (EN)" eklenmişti
-- ("Yönetim (EN)" gibi). Bu migration birim adlarını ve unvanları,
-- zaten yayında olan Organisation Chart sayfasıyla (V39) aynı terimlerle
-- (ör. "Head of Department", "EDMS and Individual Transactions Unit")
-- gerçek İngilizceye çeviriyor. Kişi adları özel ad olduğu için değişmedi.

UPDATE staff_unit SET name = 'Management' WHERE id = 21;
UPDATE staff_unit SET name = 'Administrative and Financial Affairs Unit' WHERE id = 22;
UPDATE staff_unit SET name = 'E-mail Services' WHERE id = 23;
UPDATE staff_unit SET name = 'Network Unit' WHERE id = 24;
UPDATE staff_unit SET name = 'Network and System Unit' WHERE id = 25;
UPDATE staff_unit SET name = 'System Unit' WHERE id = 26;
UPDATE staff_unit SET name = 'System Software Unit' WHERE id = 27;
UPDATE staff_unit SET name = 'Software Development Unit' WHERE id = 28;
UPDATE staff_unit SET name = 'EDMS and Individual Transactions Unit' WHERE id = 29;
UPDATE staff_unit SET name = 'EDMS and Individual Transactions Unit' WHERE id = 30;
UPDATE staff_unit SET name = 'Human Resources Unit' WHERE id = 31;
UPDATE staff_unit SET name = 'User Support Unit' WHERE id = 32;
UPDATE staff_unit SET name = 'User Support Unit' WHERE id = 33;
UPDATE staff_unit SET name = 'Web Unit' WHERE id = 34;
UPDATE staff_unit SET name = 'Sıhhiye Computer Laboratory' WHERE id = 35;
UPDATE staff_unit SET name = 'Directorate Administrative Support Staff' WHERE id = 36;

-- Unvanlar — Organisation Chart sayfasındaki tabloyla birebir aynı terim.
UPDATE staff_member SET role_title = 'Head of Department' WHERE id = 58;
UPDATE staff_member SET role_title = 'Department Secretary' WHERE id = 59;

-- Not alanı: "e-imza" kısa etiketi.
UPDATE staff_member SET note = 'e-signature' WHERE id = 89;
