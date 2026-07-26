# Tasarım kaynak dosyaları

Buradaki dosyalar **web'de sunulmaz**. Yalnızca `frontend/public/` altındaki
üretilmiş görselleri yeniden oluşturmak için saklanırlar.

`frontend/public/` içine konan her şey derleme çıktısına kopyalanır ve
internetten indirilebilir hâle gelir. Kaynak dosyalar oraya konduğunda,
hiçbir yerden referans verilmese bile dağıtılan imaja girer ve boşuna yer
kaplar — bu klasör o yüzden var.

## Dosyalar

### `serit-zemin-kaynak.png` (2172x724, 1,4 MB)

İçerik sayfalarındaki konum şeridinin (bkz. `styles/sayfa-seridi.css`) ve ana
sayfa slaytlarından birinin arka planı bu görselden türetildi.

**Üretilen dosyalar:**

| Dosya | Ölçü | Nasıl üretildi |
|---|---|---|
| `public/images/slider/sayfa-seridi-zemin.webp` | 6432x536 | Yükseklik 536'ya ölçeklendi, sol boşluk **en sol piksel sütunu yatayda gerilerek** dolduruldu (12:1) |
| `public/images/slider/kurumsal-{640,800,960,1440,1920}.webp` | slider oranı | `fit: cover`, `position: right` |

**Şerit zemininin neden 12:1 olduğu:** `background-size: cover`, görselin oranı
kaptan darsa yükseklikten kırpar. Kaynağın oranı (3:1) şeritten (yaklaşık 7:1)
dar olduğu için amblem sürekli tepesinden kesiliyordu. 12:1, gerçekçi her ekran
genişliğinden geniş olduğundan kırpma hep yatayda kalır.

**Sol boşluğun neden gerdirilerek doldurulduğu:** Düz bir renkle doldurmak
denendi ve görünür bir çizgi bıraktı — görselin sol kenarı tek renk değil,
kendi içinde koyulaşan bir geçiş taşıyor. Kenar sütununu germek, pikselleri
aynen devam ettirdiği için birleşme yerini görünmez kılar.

Yeniden üretmek gerekirse `sharp` ile aynı adımlar uygulanmalıdır.

### `public/og-gorsel.jpg` (1200x630, ~128 KB)

Bağlantı paylaşıldığında görünen kart görseli (`og:image`). Kaynağı
`public/images/slider/slide1-1920.webp`; `fit: cover`, `position: center`,
JPEG kalite 86, mozjpeg, `4:4:4`.

**Neden ayrı bir dosya:**

*Biçim* — LinkedIn desteklediği biçimler arasında WebP'yi saymıyor, Facebook'un
davranışı sürümden sürüme değişiyor. Sitenin kendi görselleri WebP olduğu için
paylaşılan bağlantı kartsız, yalnız başlıktan ibaret çıkıyordu. JPEG her
platformda çalışır.

*Oran* — slider görselleri 2.31:1, kartların beklediği oran 1.91:1. Kaynak
daha geniş olduğundan kırpma yanlardan olur ve bina tabelası çerçevede kalır;
bu yüzden dikey kırpma sorunu yaşanmaz.

Boyutu `og:image:width`/`height` ile bildirilir; bu yüzden dosya yeniden
üretilirse ölçü değişmemeli, değişecekse `seo.service.ts` içindeki sabitler de
güncellenmelidir.

### `public/icon-{192,512}.png`, `public/icon-maskable-512.png`

Uygulama olarak kurulum ikonları (`manifest.webmanifest`). Kaynağı
`public/hu-logo.svg`; beyaz zemin, amblem kendi oranı (34.5:50) korunarak
ortalanmış. Standart ikonlarda %14, maskelenebilir olanda %24 boşluk —
Android maskelenebilir ikonu kendi şekline göre kenarlardan kırptığı için
amblemin güvenli bölgede kalması gerekir.
