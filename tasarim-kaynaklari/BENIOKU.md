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
