-- Hakkımızda sayfası kurumsal bir dille yeniden yazılır.
--
-- İlk sürümde başlıklar soru cümlesi biçimindeydi ("Ne yapıyoruz",
-- "Nerede çalışıyoruz", "Nasıl örgütlendik"). Bu dil bir tanıtım
-- broşürüne yakışır; kamu kurumunun kendi sayfasında ise hafif kalıyor.
-- Başlıklar kurumsal karşılıklarıyla değiştirildi: Kuruluş ve Yasal
-- Dayanak, Faaliyet Alanları, Teşkilat Yapısı, Yerleşkeler ve Altyapı,
-- Bilgi Güvenliği Yönetimi.
--
-- KURULUŞ BİLGİSİ EKLENDİ. İlk sürümde bilerek yazılmamıştı, çünkü kaynak
-- sitede geçmiyordu ve tahminle yazılamazdı. Bilgi mevzuattan doğrulandı:
--
--   * Hacettepe Üniversitesi 1967 yılında kurulmuştur.
--   * Üniversitelerin idari teşkilatı, 2547 sayılı Yükseköğretim
--     Kanunu'nun 51. maddesine dayanılarak çıkarılan 124 sayılı Kanun
--     Hükmünde Kararname ile düzenlenmiştir. KHK 7 Ekim 1983 tarihlidir;
--     21 Kasım 1983 tarih ve 18228 sayılı Resmî Gazetede yayımlanmıştır.
--     Bilgi İşlem Daire Başkanlıkları bu kararnameyle kurulmuştur.
--
-- Başkanlığın kendi görev tanımı bu kararnamedeki tanımla aynı çerçevede;
-- sitedeki Misyon ve Vizyon metni de aynı ifadeleri taşıyor. Sayfa bu
-- bağı kuruyor — kurumsal hafıza tam olarak budur.
--
-- Başkanlığa özgü bir kuruluş tarihi (ilk kadro, ilk başkan, ilk sistem
-- odası gibi) hâlâ yazılmadı: bu bilgi hiçbir açık kaynakta yok.
-- Başkanlıktan gelirse "Kuruluş ve Yasal Dayanak" bölümüne eklenir.
--
-- İLETİŞİM BÖLÜMÜ metne gömülmedi: sayfanın altına, panelden yönetilen
-- iletişim kayıtlarından üretilerek eklenir (bidb-contact-block). Numara
-- ve adres metne yazılsaydı, panelden güncellendiğinde bu sayfa eskide
-- kalırdı — alt bilgi doğruyu, sayfa yanlışı gösterirdi.
--
-- Sayısal değerler yine kopyalanmadı, kendi sayfalarına bağlanıldı:
-- kopyalanan sayı, kaynağı güncellendiğinde sessizce yanlışa döner.

UPDATE page
SET content_html = '<div class="icerik">
<p>Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı, üniversitenin bilişim altyapısını kuran, işleten ve geliştiren birimdir. Eğitim, öğretim, araştırma ve idari süreçlerin dayandığı ağ, sunucu, yazılım ve kullanıcı hizmetleri Başkanlığımız tarafından yürütülür.</p>

<h2>Kuruluş ve Yasal Dayanak</h2>
<p>Hacettepe Üniversitesi 1967 yılında kurulmuştur. Üniversitelerin idari teşkilatı ise 2547 sayılı Yükseköğretim Kanunu''nun 51. maddesine dayanılarak çıkarılan 124 sayılı Kanun Hükmünde Kararname ile düzenlenmiştir. Bilgi İşlem Daire Başkanlıkları, 7 Ekim 1983 tarihli bu kararnameyle kurulmuştur; kararname 21 Kasım 1983 tarih ve 18228 sayılı Resmî Gazetede yayımlanmıştır.</p>
<p>Kararname, Başkanlığın görevini üniversitenin bilgi işlem sistemini işletmek, eğitim, öğretim ve araştırmalara destek sağlamak ve üniversitenin ihtiyaç duyacağı diğer bilgi işlem hizmetlerini yerine getirmek olarak tanımlar. Başkanlığımızın <a href="/tr/mission-vision">misyon ve vizyonu</a> bu görev tanımı üzerine kuruludur.</p>

<h2>Faaliyet Alanları</h2>
<p>Başkanlığın faaliyetleri dört ana başlıkta toplanır:</p>
<ul>
<li><strong>Ağ ve sistem altyapısı.</strong> Yerleşke ağlarının kurulumu, yönetimi ve güvenliği; sunucuların ve temel internet servislerinin ilgili mevzuat çerçevesinde işletilmesi, güncellenmesi ve yedeklenmesi.</li>
<li><strong>Yazılım geliştirme ve yönetim sistemleri.</strong> Üniversite birimlerinin iş süreçlerini bilgisayar ortamına taşıyan uygulamaların geliştirilmesi; Belge Yönetim Sistemi, Bireysel İşlemler ve İnsan Kaynakları Yönetim Sistemi gibi kurumsal sistemlerin işletilmesi ve son kullanıcı desteği.</li>
<li><strong>Kullanıcı hizmetleri.</strong> E-posta ve hesap işlemleri, kablosuz erişim, lisanslı yazılım dağıtımı, elektronik imza süreçleri, bilgisayar salonlarının işletilmesi ve teknik destek.</li>
<li><strong>Web hizmetleri.</strong> Üniversite web sayfasının yapılandırılması ve güncellenmesi; akademik ve idari birimler, öğrenci toplulukları ve üniversite etkinlikleri için web sayfası hazırlanması ve teknik desteği.</li>
</ul>
<p>Birimlerin ayrıntılı görev tanımları <a href="/tr/overview">Genel Tanıtım</a> sayfasında yer alır.</p>

<h2>Teşkilat Yapısı</h2>
<p>Başkanlık; Daire Başkanı ile idari ve teknik alanlardan sorumlu iki Daire Başkan Yardımcısına bağlı birimlerden oluşur. İdari ve Mali İşler Birimi doğrudan Daire Başkanlığına bağlıdır. Teşkilatın tamamı <a href="/tr/org-chart">Organizasyon Şeması</a> sayfasında, birimlerde görevli personel <a href="/tr/staff">Personel</a> sayfasında görülebilir.</p>

<h2>Yerleşkeler ve Altyapı</h2>
<p>Üniversitemiz iki ana yerleşkeye sahiptir. Başkanlığın ana binası Beytepe Yerleşkesinde, buraya bağlı Bilgi İşlem Merkezi ise Sıhhiye Yerleşkesinde bulunur. Her iki yerleşke UlakNet üzerinden yüksek hızda internet hizmeti alır ve birbirine Metro Ethernet hattıyla bağlıdır.</p>
<p>Ağ omurgası, kablosuz erişim ve sunucu altyapısına ilişkin güncel bilgiler <a href="/tr/network">Ağ Altyapısı</a> ve <a href="/tr/hardware">Mevcut Donanım Bilgileri</a> sayfalarındadır. Her iki yerleşkede öğrencilerin kullanımına açık bilgisayar salonları işletilmektedir; kullanım kuralları <a href="/tr/lab-rules">PC Salonlarının Kullanım Kuralları</a> sayfasında yayımlanmıştır.</p>

<h2>Bilgi Güvenliği Yönetimi</h2>
<p>Bilgi güvenliği, Başkanlığımızda kişisel dikkate bırakılmış bir konu değil, yazılı kurallara bağlanmış bir yönetim sistemidir. Bilgi Güvenliği Yönetim Sistemi, TS ISO/IEC 27001 standardı temel alınarak yapılandırılmış ve işletilmektedir. Uyulması gereken kurallar <a href="/tr/security-policy">Bilgi Güvenliği Politikası</a> ve <a href="/tr/isms">Bilgi Güvenliği Yönetim Sistemi</a> sayfalarında yayımlanmıştır.</p>

</div>',
    seo_description = 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı: kuruluş ve yasal dayanak, faaliyet alanları, teşkilat yapısı, yerleşkeler ve bilgi güvenliği yönetimi.',
    updated_at = now()
WHERE slug = 'about' AND language = 'tr';
