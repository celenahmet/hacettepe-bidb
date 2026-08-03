# Devir Notu

Bu belge, projeyi devralan herkesin (insan ya da yapay zekâ ajanı) işe
başlamadan önce okuması gereken tek belgedir. Kararların *gerekçelerini*
anlatır; "ne yapıldı" bilgisi git geçmişinde, "nasıl çalışır" bilgisi
diğer `docs/` dosyalarındadır.

---

## 1. Proje nedir

Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı web sitesinin
(bidb.hacettepe.edu.tr) yeniden yapımı.

**Yığın başkanlıkça belirlendi, değiştirilemez:** Spring Boot (Java 21) +
PostgreSQL + Angular 20 (SSR). Docker Compose ile üç servis: `db`,
`backend` (8081), `frontend` (4000).

Mimari kararlar bizim elimizde; teknoloji seçimi değil.

---

## 2. İHLAL EDİLEMEZ KURALLAR

Bunlar tercih değil, kısıttır. Bir değişiklik bunlardan birini bozuyorsa
değişiklik yanlıştır.

### 2.1 İçerik değişmez

Kaynak sitedeki metinler **birebir** korunur. Yazım hataları, çift
boşluklar, tuhaf büyük harfler dâhil. Düzeltmek serbest değildir.

Sunum düzeltmeleri **çizim sırasında** yapılır, saklanan içerik
değiştirilmez — bkz. `frontend/src/app/core/icerik-bicim.ts`. Orada
yapılanlar: kapanmamış `</a>` onarımı, `{at}` → `@`, e-posta/telefon
bağlantılandırma, bağlantı listelerini kart ızgarasına işaretleme.

Bu kural `tools/verify-content.js` ile **her değişiklikten sonra** ölçülür.

### 2.2 Doğrulama boşluğu bırakılmaz

`verify-content.js` içinde bir sayfayı `BILINCLI_SAPMA`'ya eklemek, o
sayfayı **doğrulamadan tamamen çıkarır**. Bunu yapan kişi, yerine geçecek
bir denetim yazmak zorundadır.

Örnekler: personel yapısal veriye taşındı → `personel-denetim.js`;
e-imza ayrı kaynaktan geldi → `eimza-denetim.js`.

Sapma kaydı bırakıp denetim yazmamak, birebirlik güvencesini sessizce yok
eder. **Bu projedeki en tehlikeli hata türü budur.**

### 2.3 Tasarım ilkeleri

- Hacettepe kırmızısı sabittir: `--hu-kirmizi: #b31821`. Değiştirilmez.
- **Emoji yok.** İkon serbest.
- Altı çizili metin kullanılmaz (bağlantı vurgusu dışında).
- Kaçınılacaklar: hazır tema hissi, gereksiz gradient/glow/glassmorphism,
  her yerde aynı yuvarlak kartlar, büyük anlamsız sloganlar, aşırı
  animasyon, rastgele dekoratif şekiller, içeriğin önüne geçen gösteriş.
- Ölçüt: **10 yıl sonra da sırıtmayacak.** Bir tercih "şu an moda olduğu
  için" iyi görünüyorsa kullanma; yapının kendisinden doğuyorsa kullan.
- Masaüstü, tablet ve mobil birlikte düşünülür. Her tasarım kararının
  gerekçesi kısaca açıklanır (kod yorumlarında da).

---

## 3. Mimari

### 3.1 Katmanlar

```
backend/   Spring Boot · JPA (ddl-auto: validate) · Flyway (V1…V20)
frontend/  Angular 20 · SSR · standalone bileşenler · signals
tools/     Node betikleri: aktarım + doğrulama
```

Veritabanı şeması **yalnızca Flyway ile** değişir. Hibernate `validate`
modundadır; şema ile varlık sınıfı uyuşmazsa uygulama açılmaz — bu
kasıtlıdır.

Migration'lar ileri yönlüdür. Uygulanmış bir migration düzenlenmez; yeni
bir migration yazılır (örn. V18'in hatası V20 ile düzeltildi).

### 3.2 CSS katman sırası

`frontend/src/styles.css`:

```
@layer tokens, base, layout, legacy, site, kamu, panel, utility;
```

Öncelik **adla değil katmanla** belirlenir; seçici özgüllüğü yarışına
girilmez. `legacy` katmanı aktarılan içeriğin eski sınıflarını taşır ve
tamamı `.icerik` altında kapsandığı için yeni tasarıma sızamaz.

Yeni tasarım kuralları `kamu` katmanına yazılır.

### 3.3 İçerik → sunum köprüsü

Bazı sayfalar saklanan HTML'i doğrudan basmaz; **ayrıştırılıp** bileşenle
çizilir. İçerik yine birebir korunur, yalnızca sunum yenilenir:

| Sayfa | Bileşen | Ne yapar |
|---|---|---|
| `faq` | `faq.component.ts` | Bootstrap akordeonunu arama + kategori filtreli akordeona çevirir |
| `overview` | `units.component.ts` | 12 birim paragrafını ikonlu kart ızgarasına çevirir |
| `staff` | `staff-list.component.ts` | Veriden gelir (HTML değil) |
| `e-signature*` | `e-imza-nav.component.ts` | Kaynağın sol menüsünü site menü altyapısıyla kurar |

Ayrıştırma **düzenli ifadelerle** yapılır, DOMParser ile değil — sunucu
tarafı çizimde (SSR) DOMParser yoktur ve liste arama motoruna yapılı
girmelidir.

---

## 4. DOĞRULAMA ARAÇLARI

Kod değişikliğinden sonra, önce testler:

```bash
tools/test.sh            # arka uç (JUnit) + ön yüz (Karma) testleri
tools/test.sh --kanit    # testlerin GERÇEKTEN ölçtüğünü kanıtlar
```

Makineye Java ya da Maven kurmaya gerek yok; arka uç testleri kapta
çalışır. Aşağıdaki tarayıcı araçlarından farkı önemlidir: **testler
mantığı sınar, araçlar ekranı ölçer.** İkisi birbirinin yerine geçmez.
Bunun somut örneği yaşandı — ölçüm ayrıntı penceresi çevrilmemişti ama
pencere yalnızca tıklanınca açıldığı için `panel-dil-denetim.js` onu hiç
görmedi ve panel "temiz" raporlandı. Sözlüğü doğrudan dolaşan bir test,
ekranda görünme koşuluna bağlı değildir.

`--kanit` üretim koduna bilerek beş hata sokar, testlerin kırmızıya
döndüğünü görür, geri alır ve **deponun yeniden yeşile döndüğünü** sınar.
Son adım gereklidir: geri alma sırasında zaman damgası tazelenmezse Maven
kaynağı yeniden derlemez ve bir sonraki koşu bozuk bytecode'u çalıştırır
(yaşandı).

Yapısal her değişiklikten sonra:

```bash
node tools/verify-content.js    # ana site metinleri kaynakla birebir mi
node tools/eksik-denetim.js     # sayfa/bağlantı/belge/görsel/kaynak bağımlılığı
node tools/eimza-denetim.js     # 16 e-imza sayfası kendi kaynağıyla birebir mi
node tools/personel-denetim.js  # birim ve kişiler iki yönde eşleşiyor mu
node tools/menu-denetim.js      # menü kaynakla birebir
node tools/son-kontrol.js       # 30 maddelik yayına hazırlık
```

SEO ya da meta etiket değişikliğinden sonra:

```bash
node tools/seo-denetim.js         # 158 sayfada title/description/canonical/
                                  # hreflang/og/JSON-LD/tek h1
node tools/seo-denetim.js --kanit # aracın gerçekten ölçtüğünü doğrular
```

Tasarım ya da panel dili değişikliğinden sonra:

```bash
node tools/hizalama-denetim.js         # ızgaraların sütun ekseni kayık mı
node tools/panel-dil-denetim.js        # İngilizce panelde çevrilmemiş metin
node tools/buyuk-harf-denetim.js       # yanlış dille büyük/küçük harf dönüşümü
node tools/erisilebilirlik-denetim.js  # WCAG 2.2 AA: alt metin, form adı,
                                       # başlık atlama, dokunma hedefi (24x24)
```

**Erişilebilirlik bildirimi bir TAAHHÜTTÜR.** `/tr/accessibility` sayfası
"WCAG 2.2 Seviye AA standartlarına büyük ölçüde uyumludur" diyor. Bu, ölçüt
listesinin tamamını bağlar — SC 2.5.8 (dokunma hedefi en az 24x24) dâhil.
Bildirimin metni kaynak içeriğidir ve değiştirilmez; onun yerine site
iddiaya uydurulur.

Dokunma hedefinde iki farklı yöntem kullanılır ve **hangisinin uygun
olduğu duruma bağlıdır**: çevresinde boşluk olan tek başına denetimlerde
(dil seçimi, "Tümü") görünmez sözde öğeyle hedef büyütülür ve düzen hiç
değişmez. ÜST ÜSTE DİZİLİ bağlantılarda (alt bilgi iletişim listesi) bu
çalışmaz: 17px'lik satırlarda 24px'lik alanlar komşularıyla çakışır ve
ölçüt "hedef başka bir hedefle kesişmemeli" der. Orada gerçek boşluk
verilir.

**Büyük harf dönüşümü dile bağlıdır ve bu gözden kaçar.** Türkçede "i"nin
büyüğü "İ", İngilizcede "I"dır; CSS'in `text-transform` özelliği dönüşümü
ÖĞENİN DİLİNE göre yapar. Dil yanlış olduğunda İngilizce "Sign in" metni
"SİGN İN" olarak çıkar. Bu, kurumsal bir sitede göze batan bir hatadır ve
kodda hiçbir izi yoktur — yalnızca ekranda görünür.

Bu yüzden `.yonetim` kök öğesinin `lang` özniteliği panel diline BAĞLIDIR.
Belge dili (`html lang`) sitenin diline göre ayarlanır (Seo servisi) ama
panelin kendi dil seçimi ondan bağımsızdır; ikisi ayrışınca dönüşüm bozulur.

Bu dört araç çalışan siteye ve `--remote-debugging-port=9222` ile açılmış
bir Chrome'a ihtiyaç duyar; ölçüm gerçek tarayıcıda yapılır ve bu zorunlu:
sütun genişliği CSS'in yanı sıra yazı tipine ve içeriğe bağlıdır, harf
dönüşümü yalnızca çizim sırasında oluşur, dokunma hedefi ise ancak
`elementFromPoint` ile ölçülebilir. Hiçbirinin kodda izi yoktur. Dördünün
de `--kanit` modu var.

**Kaynak sitenin İngilizce sayfaları artık içerik SUNMUYOR.** `/en/<slug>`
isteklerinin tamamı aynı taslak sayfayı döndürüyor ("Böyle bir sayfa
bulunmamaktadır"). `verify-content.js` bunları ayrı sayar; aksi hâlde 79
sahte "FARKLI" üretiyor ve gerçek bir bozulma o kalabalıkta görünmez
oluyordu. Nitekim bir kez öyle oldu: kaynağın VPN sayfasına sonradan
eklenen bir kılavuz bağlantısı (V75) bu yığının içinde gözden kaçmıştı.

Denetimin bugünkü sonucu: **56 birebir aynı, 4 farklı, 21 bilinçli sapma,
78 sayfayı kaynak sunmuyor.** Kalan dört farkın hepsi İngilizce
(`en/contact`, `en/mission-vision`, `en/org-chart`, `en/overview`) ve
İngilizce çeviri işi bilinçli olarak ertelenmiş durumda (bkz. 7. bölüm).
Bilerek gizlenmediler; çeviri yapıldığında ele alınacaklar. **Türkçe tarafta
açıklanmamış tek fark yok.**

`eksik-denetim.js` yalnızca durum koduna değil **içerik türüne** de bakar:
200 dönen bir yanıtın doğru dosya olduğunu varsayma.

**Denetimler her şeyi yakalamaz.** "200 OK ama görsel bozuk" hatası bu
projede iki kez çıktı. Yapısal değişiklikten sonra **ekran görüntüsüyle de
bak.**

**Bir denetimin "temiz" demesi, denetimin çalıştığı anlamına gelmez.** Bu
oturumda bir kontrast ölçeri her oranı `NaN` üretiyordu, yani hiçbir zaman
bulgu veremezdi ve "temiz" raporluyordu. Bu yüzden `hizalama-denetim.js`
bilinen bir kusuru enjekte edip yakalayıp yakalamadığını gösteren bir
`--kanit` moduyla geliyor. Yeni bir denetim yazarken aynısını yap.

---

## 5. PAHALIYA MAL OLAN HATALAR (tekrarlama)

Her biri gerçekten yaşandı. Yeni bir ajan aynı tuzağa düşmesin:

1. **Sessiz boş sayfa.** İstekler hatada boş değere düşüp bir daha
   denemiyordu; backend bir an cevap veremediğinde sayfa kalıcı boş
   kalıyordu. Çözüm: `core/yeniden-dene.ts` (2 deneme, artan gecikme,
   4xx'te denemez).

2. **Dengesiz `</div>`.** Legacy HTML'den içerik çıkarırken kaba ait
   olmayan kapanış etiketleri alındı; üst kapsayıcılar erken kapanıp düzen
   bozuldu. Sayfa 200 dönüyordu, denetimler temiz görünüyordu.
   Çözüm: div derinliği sayan çıkarma (`kabiDengele`).

3. **Kapanmamış `<a>`.** Kaynakta eksik `</a>`, sonraki `<li>`'yi içine
   alıyordu → boş hücre + dışarı düşen madde. Çözüm: `bagliMaddeleriOnar`.

4. **DatePipe yereli.** `date: '…' : '' : 'tr-TR'` yerel veri kaydı
   olmadan hata atıyor ve **kartın tüm gövdesi çizilmiyordu**.
   Çözüm: `registerLocaleData(localeTr)` (app.config.ts).

5. **Hydration karışması.** İki ayrı istekten yazılan üst menü, sunucu ve
   tarayıcıda farklı sırayla oluşup düğümleri karıştırıyordu (Hizmetlerimiz
   altında Personel görünüyordu). Çözüm: `forkJoin` ile tek adımda yazmak.

6. **CSS özgüllük tuzakları.**
   - `:has()` bir `:not()` içinde kullanılamaz — seçicinin tamamı geçersiz olur.
   - `.icerik .sema ul` (0,2,1), `.icerik .sema-dal`dan (0,2,0) daha özgüldür;
     sıfırlama kuralı dalın boşluğunu eziyordu.
   - Eşit özgüllükte **kaynak sırası kazanır**: marka ikonları, dosya türü
     kurallarından *sonra* yazılmalı (yoksa `edgeproxy.pdf` PDF ikonu alır).

7. **Site geneline sızan yönlendirme.** Küçük harfe yönlendirme tüm yollara
   uygulanınca `styles-CYIGEJUB.css` de yönlendi ve site CSS'siz kaldı.
   Kural artık yalnızca `/tr|/en` yollarına uygulanır.

8. **Ölçüm aracı yalan söyleyebilir.** `--window-size=390` Windows'ta 485px
   veriyordu. Gerçek görünüm için CDP `Emulation.setDeviceMetricsOverride`
   kullan. Tarayıcı profili de her seferinde silinmeli (önbellek yanıltır).

---

## 6. MEVCUT DURUM

### Tamamlanan

- 79 TR sayfa aktarıldı, içerik birebir (67 ana site + 16 e-imza + türetilenler)
- Türkçe adresler İngilizce adreslere taşındı, 65 kalıcı yönlendirme
- Personel yapısal veriye taşındı (16 birim / 53 kişi), panelden yönetilir
- E-imza alt sistemi (16 sayfa) birebir içeri alındı, kendi sol menüsüyle
- Yönetim paneli: sayfa, SEO, duyuru, menü, iletişim, personel, dosya
- Tasarım: hero (iki yüzeyli kurumsal slider), haber kartları, SSS (arama+filtre), personel,
  organizasyon şeması, birim kartları, tablolar, renkli marka ikonları

### Bekleyen

1. **İngilizce çeviri** (aşağıda ayrı bölüm)
2. `e-signature-workflow` sayfası kaynakta da boş — yayından kaldırılabilir
3. **Test kapsamı dar.** 56 test var (31 arka uç, 25 ön yüz) ve hepsi saf
   mantığı sınıyor: Core Web Vitals eşikleri, parola kuralı, sıfırlama
   jetonunun karmalanması, sayı biçimi, çeviri sözlüğü. Veritabanına ya
   da HTTP katmanına dokunan hiçbir test yok — depo (Testcontainers) için
   bağımlılık `pom.xml`'de hazır, kullanılmadı. Sırada denmeye değer
   olanlar: yetkilendirme (kimliksiz istek `/api/admin/**`'e girebiliyor
   mu), parola sıfırlama akışının uçtan uca davranışı (jeton tek kullanım,
   süre dolumu, hız sınırı) ve içerik uçlarının yayımlanmamış kaydı
   sızdırmaması.

> Slider ve kısayol düzenleme uçları bu listeden **çıkarıldı**: ikisi de
> yazılmış durumda ve uçtan uca denendi — ekle/güncelle/sil sırasıyla
> 200/200/204 dönüyor, kayıt sayıları test sonrası korunuyor.

---

## 6b. KAYNAKTAN BİLİNÇLİ SAPMALAR

Aktarımın kuralı "kaynak metin birebir korunur". Aşağıdakiler kurum
kararıyla bu kuralın DIŞINDA bırakılmıştır. Buraya yazılmalarının sebebi:
aksi hâlde bir sonraki denetim bunları "bozulmuş" diye işaretler ve aynı
soru her seferinde yeniden doğar.

Sayfa METİNLERİNDEKİ sapmalar `tools/verify-content.js` içindeki
`BILINCLI_SAPMA` listesinde tutulur. Aşağıdakiler sayfa metni değil,
yapısal veridir; o listeye girmezler.

| Sapma | Nerede | Gerekçe |
|---|---|---|
| Portal, servis listesinde 2. sırada | Ana sayfa kartları + üst menüdeki "Hizmetlerimiz" | Kaynakta EN SONDA (V68 ile oraya döndürülmüştü). En çok kullanılan giriş noktası olduğu için kurum tercihiyle öne alındı — V69. |

Servis sırası **iki yüzeyi birden** etkiler ve bu bilinçlidir: ana sayfa
kartları ile üst menüdeki açılır liste aynı kayıtlardan üretilir
(`header.component.ts`, `anaSayfa.services`). Ayrı sıralamak menüye özel
bir sıra alanı gerektirirdi; iki yüzeyin aynı sırayı göstermesi kullanıcı
açısından da tutarlı olduğu için tercih edilmedi.

---

## 7. İNGİLİZCE ÇEVİRİ — ERTELENDİ (kapsam kararlaştırıldı)

**DURUM: Tasarım işleri bitene kadar başlanmayacak.**

Gerekçe (kurum kararı): sayfalar tasarım aşamasında değişmeye devam
ediyor. Değişen bir metni çevirmek, sonra yeniden çevirmek demek. Çeviri,
içerik ve düzen oturduktan sonra tek seferde yapılacak.

Bu bölüm, o zaman geldiğinde plan sıfırdan kurulmasın diye kararları
saklar.

### Kararlaştırılan kapsam

**Dil:** akademik İngiliz İngilizcesi (UK). Kurum akredite; hata payı yok.

**Çevrilecek:** 65 sayfa, ~39.800 kelime.

**Çevrilmeyecek (kurum kararı):** süresi geçmiş sınav/alım ve yazılım
duyuruları — 14 sayfa, ~7.500 kelime:
`notice-*`, `notices`, `archive`, `stylecc50-removal`,
`ansys-011018`, `matlab-061118`, `sas-191018`, `spss-081118`.

**Duyuru kayıtları:** `news` tablosunda 24 kayıt var; yalnızca **son 10
duyuru** çevrilecek.

**Pilot sayfalar:** en çok ziyaret edilen genel sayfalar — ana sayfa, sol
menü ve üst menüdeki başlıca sayfalar. Önce bunlar çevrilip kalite
onaylanacak, sonra ölçeklenecek.

### Uygulama sırası (o zaman gelince)

**Adım 0 — Terim sözlüğü.** 65 sayfada tutarlılığı sağlayan tek şey budur;
çeviriye başlamadan onaylanmalı. Kilitlenmesi gerekenler içerikten
tarandı: HUNET, BİDB, EBYS, NES, KAMU SM, TÜBİTAK, VPN, MYO, KPSS,
ISO 27001, 5651 ve 5070 sayılı kanunlar, tüm birim adları.

Kanun ve standartların **resmî İngilizce başlıkları** kullanılır; serbest
çeviri yapılmaz.

**Adım 1 — Yapı koruyan hat.** HTML etiketleri, `href`, dosya adları ve
bağlantı hedefleri değiştirilmeden yalnızca metin düğümleri çevrilir.
Çıkışta yapı denetlenir: aynı etiket sayısı, aynı bağlantılar, geride
Türkçe kalmamış.

**Adım 2 — Risk kademesi.**

| Kademe | İçerik | Yaklaşım |
|---|---|---|
| A | Servis tanıtımları, birim görevleri, rehberler, SSS | Çevrilir |
| B | Politikalar, kullanım ilkeleri, sorumluluk sınırı, mevzuat | Çevrilir ama **yayından önce ilgili birim onayı** |

**Adım 3 — Pilot.** Yukarıdaki pilot sayfalar çevrilir, kalite onaylanır,
sonra kalanına geçilir.

### Bilinen açık

Kaynak sitenin İngilizce tarafında yalnızca 5 sayfa vardır
(`overview`, `mv`, `yonetim`, `iletisim`, `grup`) ve beşi de
aktarılmıştır. Bu çeviri kaynağın ötesine geçen yeni bir iştir.

`/en/accessibility` ve `/en/disclaimer` şu an kaynaktan gelen Türkçe
"Böyle bir sayfa bulunmamaktadır!" metnini gösteriyor — kaynakta bu
ikisinin İngilizcesi yok. Çeviri turunda düzeltilecek; o zamana kadar
EN alt bilgideki bağlantıları kaldırmak da bir seçenek.

## 8. ÇALIŞTIRMA

```bash
docker compose up -d --build          # üç servis
# frontend :4000 · backend :8081 · db :5432
# panel: /yonetim  (kullanıcı/parola docker-compose.yml ortam değişkenlerinde)
```

Ekran görüntüsü ve gerçek görünüm ölçümü için `scratchpad/cek.js` deseni
kullanılır (CDP + `Emulation.setDeviceMetricsOverride`).

**Windows notu:** Git Bash'in `/tmp` yolu ile Node'un gördüğü `/tmp` aynı
yer değildir; geçici dosyalar scratchpad dizinine yazılmalı. Kabuk
alıntılama Türkçe karakterleri bozabildiği için üretilen kod dosyaya
yazılıp çalıştırılmalı, `node -e` içine gömülmemeli.

---

## 9. TASARIM DİLİ (yeni sayfa eklerken)

- Başlıklar kurumsal lacivert (`--hu-lacivert`), sol kenarda kırmızı işaret
- Kutu ve gölge yerine **ince çizgi ve boşluk**; ağırlık hizadan gelir
- Kart ızgaraları `auto-fill` ile: sütun sayısını ekran belirler, içerik değil
- İkonlar çizgi biçiminde, tek renk; marka logoları yalnızca gerçek
  markalar için tam renkli
- Hareket: kısa, amaçlı, `prefers-reduced-motion` ile kapanabilir
- Her yeni stil dosyası başına **neden böyle yapıldığını** yazan bir yorum
  bloğu konur — bu projede yorumlar kararların tek kaydıdır

Örnek alınacak dosyalar: `styles/sema.css`, `styles/personel.css`,
`styles/haberler.css`, `styles/hero.css`.
