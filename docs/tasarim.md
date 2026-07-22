# Tasarım Kılavuzu

Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı web sitesi — görsel dil
ve tasarım kararları.

Bu belge, tasarımın **neden** böyle olduğunu anlatır. İleride başka bir ekip
devraldığında kararların gerekçesi kaybolmasın diye yazılmıştır.

---

## Tasarım hedefi

Kurumsal, güvenilir ve ciddi; Hacettepe Üniversitesi kimliğiyle uyumlu;
yenilikçi ancak geçici trendlere bağlı olmayan; kamu kurumu ciddiyetini
korurken eski veya bürokratik görünmeyen bir arayüz.

Hedef, kullanıcıda **"bu tasarım bu kuruma özel hazırlanmış"** hissi
oluşturmaktır. Hazır tema, tipik kurumsal şablon veya birbirine benzeyen
modern arayüz kalıpları bilinçli olarak kullanılmamıştır.

### Kaçınılanlar

Hazır tema hissi · aynı boyutta yuvarlak kart dizileri · gradient, glow,
blur, glassmorphism · büyük ve anlamsız sloganlar · aşırı animasyon ·
rastgele dekoratif şekiller · içeriğin önüne geçen görsel gösteriş ·
**emoji**.

İkon kullanımı serbesttir, ancak sade ve tutarlı bir sistem olmak
koşuluyla.

---

## Renk

Kurumsal kırmızı **Hacettepe paletindendir ve değiştirilmez.**

| Değişken | Değer | Kullanım |
|---|---|---|
| `--hu-kirmizi` | `#b31821` | Vurgu: etkin bölüm işareti, başlık altı çizgisi, birincil eylem |
| `--hu-lacivert` | `#1b3f74` | İkincil kurumsal renk, bölüm başlıkları |
| `--hu-mavi` | `#2f6fb5` | Bağlantılar |
| `--murekkep` | `#141b26` | Yönetim panelinin yüzey rengi |

**Kırmızı yüzey doldurmaz.** İnce bir işaret olarak kullanılır: etkin menü
öğesinin solunda 3px, sayfa başlığının altında 40×2px. Kurumsal renk
vurgudur, dekor değil. Geniş kırmızı alanlar hem kurumsal ciddiyeti zedeler
hem de okunabilirliği düşürür.

Yüzeyler beyaz ve çok açık gri tonlarındadır; derinlik **gölgeyle değil,
yüzey rengi farkı ve ince çizgiyle** kurulur.

---

## Tipografi

Ölçek 1.200 (minor third) oranındadır ve 16px tabanlıdır. Kademeler
`--olcu-xs` … `--olcu-4xl` değişkenlerindedir.

| Kullanım | Biçim |
|---|---|
| Sayfa başlığı | 1.95rem, ağırlık 600, harf aralığı −0.02em |
| Bölüm başlığı | 1.35rem, ağırlık 600 |
| Gövde | 1rem, satır yüksekliği 1.6 |
| Mikro etiket | 11px, büyük harf, harf aralığı 0.08em |
| Teknik veri | Tek boşluklu yazı (adres, kimlik, tarih) |

**Neden büyük harfli mikro etiket:** Form etiketleri ve tablo başlıkları
küçük punto, geniş harf aralığı ve büyük harfle yazılır. Bu, kurumsal
belge dilidir ve içerikten net biçimde ayrışır; kalın punto kullanmaya
gerek kalmaz.

**Neden tek boşluklu yazı:** Adres (`/tr/about`), dosya adı ve tarih gibi
teknik veriler tek boşluklu yazıyla gösterilir. Bu, bir bilgi işlem
biriminin diline uygundur ve veriyi metinden ayırır.

---

## Boşluk ve ızgara

Boşluk ölçeği 4px tabanlıdır (`--bosluk-1` = 4px … `--bosluk-8` = 64px).
Ara değer kullanılmaz; tutarlılık böyle korunur.

İçerik genişliği 1180px ile sınırlıdır. Uzun metinlerde satır uzunluğu
74 karakteri aşmaz — okunabilirliğin temel ölçüsüdür.

---

## Biçim

**Köşe yarıçapı en fazla 2px.** Yuvarlatılmış kutular ve hap biçimli
düğmeler kullanılmaz; keskin köşe kurumsal ciddiyeti taşır ve hazır tema
görünümünden uzaklaştırır.

**Gölge kullanılmaz.** Katman hissi gerektiğinde 1px çizgi veya yüzey
rengi farkı kullanılır. Gölgeli kart yığını, hazır şablon görünümünün en
belirgin işaretidir.

---

## Yönetim paneli: "kayıt defteri"

Panel bir vitrin değil, **çalışma yüzeyidir**. Tasarım, kurumsal bir kayıt
sisteminin dilini temel alır.

**Numaralı bölümler.** Sol raydaki bölümler tek boşluklu yazıyla
numaralandırılır (01 Sayfalar, 02 Duyurular…). Bu, ikon dizisinden daha
ayırt edicidir ve arayüze kimlik verir; ayrıca kullanıcı bölümleri
konumlarıyla hatırlar.

**Koyu ray, açık çalışma alanı.** Sol ray koyu mürekkep rengidir ve tam
yükseklikte bir blok oluşturur. Bu, gezinme ile çalışma alanını ayırır ve
sayfaya kurumsal ağırlık verir. Ray yüzer bir panel değildir; kenara
yaslanır.

**Tablo birincil yüzeydir.** Kayıtlar karta hapsedilmez. Tablo başlığı
2px koyu çizgiyle, satırlar 1px açık çizgiyle ayrılır. Operatörün tek
ekranda çok kayıt görmesi beklenir.

**Yönetim paneli site kabuğunu kullanmaz.** Ziyaretçi sitesinin üst şeridi
ve alt bilgisi panelde gösterilmez; çalışma yüzeyi bölünmez.

---

## Üst şerit

Sol menü sayfa içi ayrıntıyı taşır; üst şerit sitenin ana bölümlerine her
sayfadan erişim verir.

| Öğe | İçeriği |
|---|---|
| Ana Sayfa | — |
| Kurumsal | Sol menünün ilk bölümü (aynı kaynak, ayrı liste tutulmaz) |
| Servis ve Uygulamalar | Ana sayfadaki servis karuselinin kayıtları |
| Hakkımızda · İletişim | Doğrudan bağlantı |
| TR · EN | En sağda, ince çizgiyle ayrılmış |

Her iki açılır başlık da **veriden** gelir; panelden düzenlenince üst menü
de değişir. Sıra sabittir: iki istek hangi sırayla dönerse dönsün başlıklar
aynı yerde durur.

**Sosyal medya üst şeritten kaldırılmıştır.** Yalnızca alt bilgide ve
yalnızca ikonla yer alır; ikonlar kutu veya daire içine alınmaz.

Açılır liste klavyeyle kullanılabilir: `aria-expanded` bildirilir, Esc
kapatır, dışarı tıklamak kapatır. Dar ekranda üst menü panele dönüşür ve
"Menü" düğmesiyle açılır.

---

## İçerik sayfası

**Başlık bloğu.** Sayfa başlığının üstünde, sayfanın ait olduğu menü bölümü
küçük punto ve geniş harf aralığıyla yazılır ("TEKNİK ALTYAPI"). Ziyaretçi
sitenin neresinde olduğunu tek bakışta görür. Bu bilgi menü verisinden
türetilir; uydurulmuş bir etiket değildir.

Blok, altındaki ince çizgiyle içerikten ayrılır. **Başlık kurumsal
kırmızıdır** ve alt çizgi taşımaz.

**Giriş paragrafı** gövdeden bir kademe büyüktür. Klasik bir yayıncılık
aracıdır: metne giriş noktası ve ritim verir, süs değildir.

**Okuma sütunu sınırlıdır (820px).** Geniş ekranda içeriğin sonsuz boşlukta
yüzmesi, sayfanın "bitmemiş" görünmesine yol açıyordu.

**Ölçü kuralı:** okunan metin 72 karakterle sınırlıdır, ancak tablo ve
görsel gibi taranan öğeler sütunun tamamını kullanır. Tabloyu metin
ölçüsüne sıkıştırmak sütunları gereksiz daraltırdı.

**Hizalama:** kaynak içerikte eski `align="justify"` niteliği bulunuyor.
Türkçede tireleme olmadan iki yana yaslama kelime aralarında düzensiz
boşluklar oluşturur ve okumayı yavaşlatır. Nitelik içeriğin parçası olduğu
için silinmez; yalnızca sunum sola hizalanır.

**Sol menünün tasarımı bilinçli olarak değiştirilmemiştir.** Kurumun ve
ziyaretçilerin alışık olduğu gezinme görünümü korunur.

---

## İletişim bağlantıları

Aktarılan içerikte e-postalar eski bir spam korumasıyla yazılmıştı
(`gokhan{at}hacettepe.edu.tr`). Bu yazım günümüzde koruma sağlamıyor,
buna karşılık adresi kopyalamayı ve tıklamayı zorlaştırıyor.

Çizim sırasında düzeltilir: `{at}` işaretine dönüşür, düz yazılmış
e-postalar ve telefon numaraları tıklanabilir hâle gelir. Yalnızca metin
düğümleri işlenir; öznitelikler ve zaten bağlantı içindeki metinler
atlanır, böylece iç içe bağlantı oluşmaz.

Telefon deseni +90 veya 0 ile başlayan numaralarla sınırlıdır; metindeki
yıl, sayı ve IP dizilerinin yanlışlıkla numaraya dönüşmesi engellenir.

**Saklanan içerik değişmez.** Kaynak kopyası bozulmadığı için doğrulama
70/70 geçmeye devam eder; istenirse dönüşüm tek yerden kaldırılabilir.

---

## Birim listesi (Genel Tanıtım)

Sayfa, başkanlığın 11 biriminin tanıtımından oluşuyor. Her paragraf
"**Birim Adı (Yerleşke):** açıklama" kalıbında; düz paragraf yığını olarak
okunduğunda birimler birbirine karışıyordu.

Birim adı kendi satırında başlık gibi okunur, açıklama altında tam ölçüde
akar, birimler ince çizgiyle ayrılır. Sol kenardaki ince işaret üzerine
gelindiğinde kurumsal kırmızıya döner.

**Denenip vazgeçilenler:**

- *Üç sütunlu ızgara* (ad | açıklama): açıklama uzunlukları çok değişken
  olduğu için ad sütununda büyük boşluklar kalıyor, sayfa dengesizleşiyordu.
- *Sıra numarası*: listeye bilgi katmıyor, yalnızca gürültü ekliyordu.

Yalnızca paragrafın **ilk** vurgusu başlığa dönüştürülür. Bazı açıklamaların
içinde de vurgulu terimler var (BYS, Bİ gibi); hepsi blok yapıldığında metin
satır satır bölünüyordu.

Tümü sunum katmanındadır; içerik HTML dosyasına tek bir etiket eklenmez.

---

## Bağlantı dizini kartları

Bazı sayfalar (Bilgi ve Dokümanlar, Formlar, Kişisel Sayfalar) yalnızca
bağlantılardan oluşan madde imli listeler içeriyordu. Bu, bir servis
dizinini göstermenin en zayıf biçimi: her madde aynı ağırlıkta ve taranması
güç.

Bu listeler **hücreleri ortak çizgi paylaşan bir ızgaraya** dönüşür.
Aralarında boşluk bırakılan yüzen kartlar yerine tek bir blok oluşturan
bitişik hücreler — kurumsal bir dizin görünümü. Üzerine gelindiğinde yüzey
tonu değişir ve solda kırmızı bir çubuk belirir.

**İkonlar** bağlantı adresine göre atanır (ağ, kalkan, sunucu, posta,
kablosuz, anahtar, belge, indirme). Çizgi biçiminde, tek renk ve tutarlı;
ikon yazı tipi veya emoji kullanılmaz. SVG maskesi olarak basıldıkları için
renkleri kurumsal kırmızıdan gelir.

**Yalnızca bağlantı içeren listeler** dönüştürülür; yönerge maddeleri gibi
metin listeleri etkilenmez. Ayrım, çizim sırasında eklenen bir sınıfla
yapılır (`core/icerik-bicim.ts`) — saklanan içerik değişmez. CSS ile
yapılamıyor çünkü `:has()` bir `:not()` içinde kullanılamıyor.

---

## Alt bilgi

Dört sütunlu **asimetrik** ızgara: kurum kimliği solda geniş alanda,
gezinme ve iletişim sağda dar sütunlarda. Eşit genişlikte dört kutu yerine
asimetri, hazır şablon görünümünden uzaklaştırır ve okuma sırasını belirler.

Açık yüzey kullanılır; ayrımı renk bloğu değil, üstteki tek çizgi ve boşluk
kurar. Alt şerit hafif zemin farkıyla ayrılır. Sosyal medya hesapları yuvarlak ikon kutuları değil, sade
metin bağlantılarıdır.

Dar ekranda dört sütun ikiye, 620px altında tek sütuna iner; kurum sütunu
tam genişliğe geçer.

---

## Aktarılan içerik ve eski sınıflar

Sayfa metinleri kaynak siteden birebir alınmıştır ve **değiştirilemez**.
İçlerinde kaynak sitenin CSS sınıfları gömülüdür (`icerik`, `kisayol`,
Bootstrap 3 sınıfları — toplam 53 sınıf).

Bu sınıflar `legacy` katmanında ve `.icerik` kapsamı altında karşılanır.
Böylece:

- İçerik metnine dokunmadan görünümü iyileştirilebilir
- Yeni tasarım aynı sınıf adlarını kullansa bile çakışma olmaz

`.collapse` sınıfı bilinçli olarak **gizlenmez**. Bootstrap'te gizlidir;
gizlenseydi içerikteki 59 blok kullanıcıya görünmez olurdu ki bu, içeriği
değiştirmekle aynı sonucu doğururdu.

---

## Katman düzeni

```
@layer tokens, base, layout, site, legacy, panel, utility;
```

Hangi kuralın kazanacağı seçici özgüllüğüyle değil **katman sırasıyla**
belirlenir. Bu, `!important` yarışını ve uzun seçici zincirlerini önler.

---

## Ekran boyutları

Tasarım masaüstü, tablet ve mobil için birlikte düşünülür.

| Eşik | Davranış |
|---|---|
| ≥ 900px | Sol menü/ray yanda, içerik iki sütun |
| < 900px | Sol menü/ray üstte yatay şeride dönüşür, içerik tek sütun |
| < 720px | İçerik ızgarası tek sütuna iner, görseller küçülür |
| < 600px | Duyuru görselleri küçük, tablolar yatay kaydırılır |

Tablolar dar ekranda kendi içinde yatay kaydırılır; **sayfa gövdesi asla
yatay kaymaz.**

---

## Erişilebilirlik

- Odak halkası görünürdür: 2px kırmızı dış çizgi, 1px boşlukla
- Metin/zemin karşıtlığı WCAG AA düzeyindedir
- Renk tek başına anlam taşımaz; etkin durum çizgi ve kalınlıkla da belirtilir
- `prefers-reduced-motion` tercihinde geçişler kapatılır
- Görsellerde alt metni; dekoratif ikonlarda boş `alt` ve `aria-hidden`
- Klavye ile içeriğe atlama bağlantısı (`.atla`) her sayfada bulunur

---

## Performans

- Yazı tipi olarak sistem yazı tipleri kullanılır; dış yazı tipi indirilmez
- Gölge, blur ve büyük geçiş efektleri yok — çizim maliyeti düşük
- Yanıtlar sıkıştırılır (%77–83 küçülme)
- Görsellerde `loading="lazy"` ve boyut nitelikleri; düzen kayması olmaz
