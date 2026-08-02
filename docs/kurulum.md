# Kurulum ve Yayına Alma

Bu belge, siteyi yeni bir makinede çalıştırmak ve sunucuya almak içindir.

---

## Gereken tek şey

**Docker** (Docker Desktop veya Docker Engine + Compose eklentisi).

Java, Node.js, PostgreSQL ayrıca kurulmaz; hepsi kapların içindedir.

---

## Geliştirme makinesinde çalıştırma

```bash
git clone https://github.com/celenahmet/hacettepe-bidb
cd hacettepe-bidb
docker compose up -d --build
```

İlk açılışta veritabanı boştur; uygulama Flyway geçişlerini sırayla
çalıştırarak şemayı kurar ve **72 sayfalık içeriği yükler**. Bu yaklaşık
bir dakika sürer.

| Adres | Açıklama |
|---|---|
| http://localhost:4000 | Site |
| http://localhost:4000/yonetim | Yönetim paneli |
| http://localhost:8081 | Backend (doğrudan) |
| localhost:5432 | PostgreSQL |

Giriş bilgileri, ortam değişkeni verilmediyse `yonetici` / `degistir-beni`.

### Aynı makinede ikinci kopya

Kap adları ve portlar çakışmasın diye:

```bash
BIDB_ONEK=test COMPOSE_PROJECT_NAME=bidbtest docker compose up -d
```

Portları da `docker-compose.yml` içinde değiştirmek gerekir.

---

## Yayına alma

### 1. Zorunlu ayarlar

Sunucuda bir `.env` dosyası oluşturun (bu dosya depoya girmez):

```bash
BIDB_YONETICI_KULLANICI=<kullanıcı>
BIDB_YONETICI_PAROLA=<güçlü bir parola>
ALLOWED_HOSTS=bidb.hacettepe.edu.tr
SITE_ADRESI=https://bidb.hacettepe.edu.tr
SPRING_DATASOURCE_PASSWORD=<veritabanı parolası>
# Kurumsal e-posta sunucusunun parolası. Diğer e-posta ayarları (sunucu,
# kapı, gönderen, güvenlik kipi) panelden yönetilir; parola bilinçli olarak
# yalnızca burada durur, veritabanına yazılmaz.
BIDB_MAIL_PAROLA=<smtp parolası>
```

> **Parola tanımlanmazsa uygulama başlamaz.** Bu kasıtlıdır: varsayılan
> parolayla yanlışlıkla yayına çıkmak mümkün olmasın diye.

#### Yönetici parolası nerede tutulur

`BIDB_YONETICI_PAROLA` yalnızca **ilk kurulumda kullanılan tohumdur**.
`admin_account` tablosu boşsa uygulama açılışta bu değerlerle bir hesap
oluşturur. Hesap oluştuktan sonra parola veritabanındaki BCrypt karmasıdır;
ortam değişkenini değiştirmek giriş parolasını **değiştirmez**.

Bu bilinçlidir: parola sıfırlama akışının çalışabilmesi için parolanın
çalışma sırasında değiştirilebilir bir yerde durması gerekiyor. Ortam
değişkeni geçerli kalsaydı, sıfırlanan parolanın yanında eskisi de
çalışmaya devam ederdi.

**Parola unutulursa** (ve e-posta ile sıfırlama da yapılandırılmamışsa),
veritabanına erişimi olan bir işletmen hesabı silip servisi yeniden
başlatarak ortam değişkenindeki değerlerle yeniden oluşturabilir:

```bash
docker exec -i bidb-db psql -U bidb -d bidb -c "DELETE FROM admin_account;"
docker compose up -d --force-recreate backend
```

Bu, bilerek bırakılmış acil durum kapısıdır; veritabanı erişimi zaten en
yüksek yetki seviyesi olduğu için yeni bir zayıflık açmaz. Yordam
denendi ve çalıştığı doğrulandı.

### 2. HTTPS

Uygulama düz HTTP dinler; sertifika bir ters vekil sunucuda (nginx, Apache
veya kurumun yük dengeleyicisi) sonlandırılmalıdır. Vekil sunucu 4000
portuna yönlendirir ve şu başlıkları iletmelidir:

```
X-Forwarded-For     $remote_addr
X-Forwarded-Proto   $scheme
X-Forwarded-Host    $host
```

Uygulama bu başlıkları dikkate alacak şekilde yapılandırılmıştır
(`server.forward-headers-strategy: framework`).

`Strict-Transport-Security` başlığı zaten gönderilir; HTTPS olmadan
tarayıcılar bunu yok sayar.

### 3. Alan adı geçişi

Site, mevcut sitenin **aynı alan adında** yayına girecek şekilde
hazırlanmıştır:

- Eski Türkçe adresler (`/tr/geneltanitim`) kalıcı yönlendirmeyle
  yenilerine (`/tr/about`) taşınır — 65 adres
- Tüm belgeler ve görseller kendi sunucumuzdan verilir; eski sunucuya
  hiçbir bağımlılık kalmamıştır

Geçiş öncesi doğrulama:

```bash
node tools/eksik-denetim.js https://bidb.hacettepe.edu.tr
```

### 4. Yedekleme

**Bu adım atlanamaz.** Depodaki geçişler yalnızca kaynaktan aktarılan ilk
hâli kurar; panelden yapılan her değişiklik yalnızca veritabanında yaşar.

```bash
tools/yedek.sh al
```

Günlük çalışacak biçimde zamanlanmalıdır:

```
# Linux/macOS — her gece 03:00
0 3 * * * cd /opt/hacettepe-bidb && tools/yedek.sh al
```

Yedekler **sunucu dışına** kopyalanmalıdır; aynı diskteki yedek, disk
arızasında işe yaramaz.

---

## Güncelleme

```bash
git pull
docker compose up -d --build
```

Yeni veritabanı geçişleri varsa açılışta kendiliğinden uygulanır.

> `--build` gerekir: imaj yeniden üretilmezse eski kod ve eski geçişler
> çalışmaya devam eder.

---

## Sorun giderme

| Belirti | Nedeni ve çözümü |
|---|---|
| Backend başlamıyor, "Schema-validation" hatası | Kod ile veritabanı şeması uyuşmuyor. Geçiş eklenmemiş olabilir. |
| Backend başlamıyor, parola hatası | `BIDB_YONETICI_PAROLA` tanımlı değil |
| Sayfalar açılıyor ama stil yok | CSS dosyası yanlış içerik türüyle dönüyor olabilir; `node tools/eksik-denetim.js` bunu denetler |
| Panel beyaz ekran | Tarayıcı konsolunu açın (F12). Genellikle JavaScript dosyası yüklenememiştir |
| Yeni sayfa 404 veriyor | Sayfa listesi önbelleği; en geç bir dakikada düzelir |

Kapların günlüğü:

```bash
docker compose logs backend --tail=50
docker compose logs frontend --tail=50
```

---

## Doğrulama araçları

Yapısal her değişiklikten sonra çalıştırılmalıdır:

```bash
node tools/verify-content.js     # içerik kaynakla birebir mi (70/70)
node tools/eksik-denetim.js      # sayfa, bağlantı, belge, görsel
node tools/menu-denetim.js       # menü kaynakla uyumlu mu
node tools/son-kontrol.js        # 30 maddelik yayın kontrolü
```

`verify-content.js` canlı kaynak siteye bağlanır; kaynak site kapandıktan
sonra bu araç çalışmaz (beklenen davranıştır).
