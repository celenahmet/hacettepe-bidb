-- Yazılım Geliştirme Biriminde Şahin Kaan Aytaç, birim sorumlusunun
-- hemen ardından gösterilir. Diğer personelin kendi aralarındaki sırası korunur.
UPDATE staff_member AS personel
SET sort_order = CASE
    WHEN personel.full_name = 'Şahin Kaan Aytaç' THEN 2
    WHEN personel.sort_order BETWEEN 2 AND 10 THEN personel.sort_order + 1
    ELSE personel.sort_order
END
FROM staff_unit AS birim
WHERE personel.unit_id = birim.id
  AND birim.language = 'tr'
  AND birim.name = 'Yazılım Geliştirme Birimi'
  AND (
      personel.full_name = 'Şahin Kaan Aytaç'
      OR personel.sort_order BETWEEN 2 AND 10
  );
