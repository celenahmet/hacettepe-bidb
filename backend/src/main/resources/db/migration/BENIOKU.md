# Veritabanı göçleri (Flyway)

## Uygulanmış bir göç dosyası ASLA değiştirilmez

Flyway her göç dosyasının bir sağlama toplamını `flyway_schema_history`
tablosunda saklar ve her açılışta dosyayla karşılaştırır. Dosya sonradan
değişirse — **yalnızca bir yorum satırı düzeltilse bile** — doğrulama
başarısız olur ve uygulama hiç başlamaz:

```
FlywayValidateException: Validate failed: Migrations have failed validation
Migration checksum mismatch for migration version <N>
```

Bu, geliştirme ortamında da üretimde de aynı şekilde davranır. Bir kez
yaşandı: V61'in yalnızca açıklama satırları düzeltildi, backend açılmayı
reddetti ve site backend'siz kaldı.

## Ne yapmalı

- **Yanlış olan SQL'i düzeltmek için** yeni bir göç yazın (V62, V63…).
  Eskisini düzenlemek yerine üzerine yazan bir göç eklemek, veritabanı
  geçmişini de doğru anlatır.
- **Yalnızca açıklama/yorum düzeltmek için** de aynı kural geçerlidir:
  dosyaya dokunmayın. Açıklama gerçekten gerekliyse yeni göçün başında
  belirtin ya da kod tarafındaki ilgili sınıfa yazın.
- **Kazara değiştirildiyse**, iki seçenek vardır:
  1. Dosyayı eski hâline döndürün (en temizi), ya da
  2. Flyway `repair` çalıştırın. Bu projede ayrı bir Flyway CLI kurulu
     olmadığı için eşdeğeri elle yapılır — SQL gövdesinin değişmediğinden
     emin olduktan sonra:

     ```sql
     UPDATE flyway_schema_history
        SET checksum = <hata mesajındaki "Resolved locally" değeri>
      WHERE version = '<N>';
     ```

     SQL gövdesi de değiştiyse bu YETMEZ: veritabanı ile dosya artık farklı
     şeyler anlatıyordur, düzeltmeyi yeni bir göçle yapın.

## Adlandırma

`V<numara>__kisa_aciklama.sql` — açıklama Türkçe, boşluk yerine alt çizgi.
Numaralar artan sırada ve atlanmadan gider.
