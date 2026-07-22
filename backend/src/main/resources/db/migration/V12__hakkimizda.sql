-- "Genel Tanıtım" kendi adresine taşınır, "Hakkımızda" ayrı bir sayfa olur.
--
-- GEREKÇE: Genel Tanıtım sayfası /tr/about adresinde duruyordu ve üst
-- şeritteki "Hakkımızda" bağlantısı da oraya gidiyordu. Ama o sayfa
-- kurumu tanıtmıyor: birimlerin görev tanımlarını tek tek sayıyor.
-- "Hakkımızda" diyerek gelen ziyaretçi, aradığı genel bilgi yerine
-- on dört birimin görev listesiyle karşılaşıyordu.
--
-- Genel Tanıtım /tr/overview adresine geçer. "promotion" tercih edilmedi:
-- İngilizcede tanıtım-pazarlama çağrışımı taşır; kurumsal bir başkanlığın
-- birim görevlerini anlatan sayfa için "overview" doğru karşılıktır ve
-- alt bilgide o sayfanın İngilizce adı olarak zaten kullanılıyordu.
--
-- Boşalan /tr/about adresine yeni "Hakkımızda" sayfası kurulur.

-- 1) Genel Tanıtım yeni adresine taşınır. Başlık ve içerik değişmez.
UPDATE page SET slug = 'overview', updated_at = now()
WHERE slug = 'about' AND language = 'tr';

-- Menü öğesi sayfaya kimlikle bağlı olduğu için kendiliğinden düzelir;
-- yalnızca eski adres yönlendirmesi eklenir.
INSERT INTO redirect (old_path, new_path)
VALUES ('/tr/about', '/tr/overview')
ON CONFLICT (old_path) DO UPDATE SET new_path = EXCLUDED.new_path;


-- 2) Yeni Hakkımızda sayfası.
--
-- İÇERİK NOTU: Bu sayfa kaynak sitede yoktu; metin, bidb.hacettepe.edu.tr
-- üzerindeki sayfalardan (Misyon ve Vizyon, Ağ Altyapısı, Donanım, PC
-- Salonları, Bilgi Güvenliği Politikası, Genel Tanıtım) doğrulanabilen
-- bilgilerle yazıldı. Uydurulmuş hiçbir bilgi yok.
--
-- Kuruluş tarihi ve tarihçe BİLEREK yazılmadı: kaynak sitede bu bilgi
-- hiçbir sayfada geçmiyor. Tahmin edilerek yazılması, kurumsal bir
-- sayfada düzeltilmesi en zor hata türü olurdu.
--
-- Sayısal değerler (cihaz adetleri, bilgisayar sayıları) bu sayfaya
-- kopyalanmadı; kendi sayfalarına bağlantı verildi. Kopyalanan sayı,
-- kaynağı güncellendiğinde sessizce yanlışa döner.

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order)
VALUES (
  'about', 'tr', 'Hakkımızda',
  '<div class="icerik">
<p>Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı, üniversitenin bilişim altyapısını kuran, işleten ve geliştiren birimdir. Eğitim, öğretim, araştırma ve idari süreçlerin dayandığı ağ, sunucu, yazılım ve kullanıcı hizmetleri Başkanlığımız tarafından yürütülür.</p>

<h2>Ne yapıyoruz</h2>
<p>Başkanlığımızın çalışma alanı dört ana başlıkta toplanır:</p>
<ul>
<li><strong>Ağ ve sistem altyapısı.</strong> Yerleşke ağlarının kurulumu, yönetimi ve güvenliği; sunucuların ve temel internet servislerinin işletilmesi.</li>
<li><strong>Yazılım geliştirme ve yönetim sistemleri.</strong> Üniversite birimlerinin iş süreçlerini bilgisayar ortamına taşıyan uygulamaların geliştirilmesi; Belge Yönetim Sistemi, Bireysel İşlemler ve İnsan Kaynakları Yönetim Sistemi gibi kurumsal sistemlerin işletilmesi.</li>
<li><strong>Kullanıcı hizmetleri.</strong> E-posta, kablosuz erişim, lisanslı yazılım dağıtımı, elektronik imza ve son kullanıcı desteği.</li>
<li><strong>Web hizmetleri.</strong> Üniversite web sayfasının ve birim sayfalarının yapılandırılması, güncellenmesi ve teknik desteği.</li>
</ul>
<p>Birimlerin görev tanımlarının ayrıntısı <a href="/tr/overview">Genel Tanıtım</a> sayfasındadır.</p>

<h2>Nerede çalışıyoruz</h2>
<p>Üniversitemiz iki ana yerleşkeye sahiptir. Başkanlığımızın ana binası Beytepe Yerleşkesinde, buraya bağlı Bilgi İşlem Merkezi ise Sıhhiye Yerleşkesindedir. Her iki yerleşke UlakNet üzerinden yüksek hızda internet hizmeti alır ve birbirine Metro Ethernet hattıyla bağlıdır.</p>
<p>Ağ altyapısının ayrıntısı için <a href="/tr/network">Ağ Altyapısı</a> ve <a href="/tr/hardware">Mevcut Donanım Bilgileri</a> sayfalarına bakabilirsiniz. Her iki yerleşkede öğrencilerin kullanımına açık bilgisayar salonları işletilmektedir; kurallar <a href="/tr/lab-rules">PC Salonlarının Kullanım Kuralları</a> sayfasındadır.</p>

<h2>Nasıl örgütlendik</h2>
<p>Başkanlık, Daire Başkanı ile idari ve teknik alanlardan sorumlu iki Daire Başkan Yardımcısına bağlı birimlerden oluşur. Örgütlenmenin tamamı <a href="/tr/org-chart">Organizasyon Şeması</a> sayfasında, birimlerde görevli personel ise <a href="/tr/staff">Personel</a> sayfasındadır.</p>

<h2>Nasıl çalışıyoruz</h2>
<p>Bilgi güvenliği, Başkanlığımızda kişisel dikkate bırakılmış bir konu değil, yazılı kurallara bağlanmış bir yönetim sistemidir. Bilgi Güvenliği Yönetim Sistemi TS ISO/IEC 27001 standardı temel alınarak yapılandırılmış ve işletilmektedir. Uyulması gereken kurallar <a href="/tr/security-policy">Bilgi Güvenliği Politikası</a> ve <a href="/tr/isms">Bilgi Güvenliği Yönetim Sistemi</a> sayfalarında yayımlanmıştır.</p>
<p>Başkanlığımızın <a href="/tr/mission-vision">misyon ve vizyonu</a>, hizmet ilkelerimizi belirler.</p>

<h2>Bize ulaşın</h2>
<p>Adres, telefon ve e-posta bilgileri <a href="/tr/contact">İletişim</a> sayfasındadır.</p>
</div>',
  'Hakkımızda | Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı',
  'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı; üniversitenin ağ, sistem, yazılım ve kullanıcı hizmetlerini yürüten birimdir. Görev alanımız, örgütlenmemiz ve çalışma ilkelerimiz.',
  'Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı, hakkımızda, kurumsal, bilişim altyapısı',
  TRUE, 0
)
ON CONFLICT DO NOTHING;
