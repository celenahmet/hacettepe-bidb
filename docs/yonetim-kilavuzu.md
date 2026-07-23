# Yönetim Paneli Kılavuzu

Panel adresi: **`/yonetim`** (örneğin `http://localhost:4000/yonetim`)

Giriş bilgileri sunucu ortam değişkenlerinde tanımlıdır:
`BIDB_YONETICI_KULLANICI` ve `BIDB_YONETICI_PAROLA`.

> **Yayına almadan önce parolayı mutlaka değiştirin.** Parola tanımlanmamışsa
> uygulama hiç başlamaz; bu, varsayılan parolayla yayına çıkmayı engeller.

---

## Sayfalar

Sitedeki tüm sayfalar listelenir. Her sayfa için düzenlenebilenler:

| Alan | Nerede görünür |
|---|---|
| Başlık (title) | Tarayıcı sekmesi ve arama sonucu başlığı |
| Açıklama (description) | Arama sonucundaki açıklama satırı |
| Anahtar kelimeler | Sayfa üst bilgisi |
| Yayında | Kapatılırsa sayfa ziyaretçilere görünmez |

**Düzenle** düğmesi sayfanın dört yönünü açar:

| Bölüm | Ne yapılır |
|---|---|
| Metin | Sayfa içeriği. Yayınlamadan önce önizleme zorunludur. |
| Başlık ve adres | Sayfa adı ve adresi; sayfayı silme |
| Belgeler | Sayfaya bağlı PDF/Word dosyaları, yeni dosya yükleme |
| Sürüm geçmişi | Eski hâlleri görme ve geri dönme |

### Metin düzenleme

Metin HTML olarak saklanır. **Önizle** düğmesine basmadan yayınlayamazsınız;
bu, yanlışlıkla bozuk bir sayfa yayınlamayı engeller.

Her kayıtta sayfanın önceki hâli sürüm geçmişine eklenir. Yanlış bir
değişiklik yaptıysanız **Sürüm geçmişi** bölümünden tek tıkla geri
dönebilirsiniz — geri almadan önce mevcut hâl de saklandığı için geri alma
işlemi de geri alınabilir.

Kaynak sitedeki ilk hâl "Kaynak sitedeki ilk hâli" açıklamasıyla kalıcı
olarak korunur; her zaman o noktaya dönebilirsiniz.

### Adres değiştirme

Bir sayfanın adresini değiştirdiğinizde eski adres yenisine yönlendirilir.
Dışarıdan verilmiş bağlantılar ve arama sonuçları kırılmaz.

Adres kısa ve İngilizce olmalıdır. Türkçe karakterler otomatik dönüştürülür
(*Deneme Sayfası* → `deneme-sayfasi`).

### Belge yükleme

PDF, Word, Excel, sunum ve görsel dosyaları yüklenebilir; en fazla 25 MB.
Web sayfası ve betik dosyalarına güvenlik gereği izin verilmez.

Yüklenen dosya listeye eklenir; **satırı kaydetmeyi unutmayın**.

Başlık alanı boş bırakılırsa site otomatik olarak
`Sayfa Adı — Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı`
biçiminde bir başlık üretir.

---

## Duyurular

Ana sayfadaki "Haber ve Duyurular" listesini yönetir.

Bir duyuru iki biçimde yayımlanabilir:

**1. Kısa duyuru** — yalnızca başlık ve bir bağlantı. Listeden tıklanınca
belgeye veya dış adrese gider.

**2. Görselli haber** — görsel, özet ve metin içerir; kendi sayfasında açılır.
Bunun için **Haber adresi** alanını doldurun; adres şu biçimde oluşur:

    bidb.hacettepe.edu.tr/tr/duyuru/yeni-eposta-sistemi

| Alan | Açıklama |
|---|---|
| Başlık | Listede ve haber sayfasında görünür |
| Özet | Liste görünümünde başlığın altında |
| Görsel | Yükleyin; listede küçük, haberde büyük görünür |
| Görsel açıklaması | Görme engelliler ve arama motorları için |
| Haber adresi | Doldurulursa haber kendi sayfasında açılır |
| Haber metni | HTML |
| Bağlantı | Haber sayfası yoksa tıklandığında buraya gider |
| Yayın tarihi | Liste bu tarihe göre sıralanır, en yeni en üstte |
| Dil | Duyuru yalnızca seçilen dildeki sitede görünür |

**Önizle** düğmesiyle haberin nasıl görüneceğini kaydetmeden görebilirsiniz.

Ana sayfada en yeni 12 duyuru gösterilir; eskiler kayıtta kalır.

---

## Slider

Ana sayfanın üst görsel alanı.

- **Görsel adresi**: `/images/r1.jpg` gibi site içi bir yol
- **Görsel açıklaması**: görme engelli kullanıcılar ve arama motorları için;
  görselde ne olduğunu kısaca yazın
- **Sıra**: küçük numara önce gösterilir

Yeni görsel eklerken dosyanın önce sunucuya yüklenmiş olması gerekir.

---

## Kısayollar

Ana sayfadaki ikonlu bağlantı ızgarası ve servis karuseli aynı listeden yönetilir:

| Sıra değeri | Nerede görünür |
|---|---|
| 0 – 99 | Üstteki ikon ızgarası |
| 100 ve üzeri | "Servisler ve Uygulamalar" bölümü |

- **Adres**: site içi (`/tr/faq`) veya dış adres (`https://portal.hacettepe.edu.tr/`)
- **Yeni sekmede açılsın**: dış bağlantılar için işaretleyin

---

## Menüler

Sol menüdeki bölümler ve bağlantılar.

- **Bölüm**: "Kurumsal", "Servislerimiz" gibi başlıklar. Dil ve sıra bilgisi taşır.
- **Bağlantı**: ya bir sayfaya ya da dış adrese işaret eder.
  Sayfa seçildiğinde dış adres alanı yok sayılır — böylece iki hedefli,
  tutarsız bir kayıt oluşamaz.

Bölüm silindiğinde içindeki bağlantılar da silinir.

---

## İletişim Bilgileri

Sayfa altında görünen kurum bilgileri: adres, telefon, e-posta, faks.
Bu bilgiler koda gömülü değildir; buradan değiştirdiğinizde sitenin
tamamında güncellenir.

Birden çok telefon veya e-posta için aralarına ` · ` koyun.

---

## Sosyal Medya

Üst şeritte görünen hesaplar.

- **Ağ**: `instagram`, `facebook`, `twitter`, `youtube`, `linkedin`
- **Adres**: hesabın tam adresi

Bu bilgiler ayrıca arama motorlarına kurumun resmî hesapları olarak bildirilir;
yanlış adres girilmesi kurum eşleştirmesini bozabilir.

---

## Adres yapısı

Sayfa adresleri İngilizcedir ve iki dilde aynıdır; yalnızca ön ek değişir:

    /tr/about      ·      /en/about

Eski Türkçe adresler (`/tr/geneltanitim` gibi) kalıcı yönlendirme ile yeni
adreslere taşınmıştır; arama motorlarındaki ve dış sitelerdeki bağlantılar
kırılmaz. Eşleme tek bir dosyada tutulur: `tools/slug-map.js`.

Yeni bir sayfanın adresi de İngilizce ve kısa olmalıdır.

---

## Değişiklikler ne zaman görünür?

Kaydettiğiniz anda. Sayfayı yenilemek yeterlidir; önbellek temizliği gerekmez.

## Güvenlik

- Panel yalnızca tarayıcıda çalışır; giriş bilgileri sunucuya kaydedilmez.
- Oturum, tarayıcı sekmesi kapatıldığında sona erer.
- Yayın (ziyaretçi) tarafı herkese açıktır; tüm düzenleme uçları kimlik doğrulaması ister.
- Panel yalnızca HTTPS üzerinden kullanılmalıdır.
## Sayfa ve duyuru SEO yönetimi

Sayfalar sekmesindeki **SEO** düğmesi başlık, açıklama ve anahtar kelimelere
ek olarak sosyal paylaşım görseli, robots yönergesi ve Schema.org sayfa türünü
yönetir. Ana sayfa için listede bulunan `home` kaydı düzenlenir; değişiklik
SSR çıktısına ve sosyal paylaşım etiketlerine doğrudan yansır.

Kendi detay sayfası bulunan duyurularda SEO başlığı ve açıklaması boş
bırakılırsa duyuru başlığı ile özeti güvenli varsayılan olarak kullanılır.
Fotoğraf varsa Open Graph ve `NewsArticle` görseli olarak da yayınlanır.
