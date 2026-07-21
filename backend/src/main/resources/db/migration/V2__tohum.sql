-- Bu dosya tools/seed.js tarafından üretildi. Elle düzenlemeyin.
-- Kaynak: mevcut bidb.hacettepe.edu.tr içeriği (metinler birebir aktarılmıştır).

INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('altyapi', 'tr', 'Ağ Altyapısı', '<div class="icerik">

<p align="justify">Hacettepe Üniversitesi iki ana yerleşkeye sahiptir: Beytepe ve Sıhhiye  Yerleşkeleri. Sıhhiye Yerleşkesi şehir merkezinde bulunmakta ve çoğunlukla  sağlık ile ilgili fakülte ve bölümlerle Hacettepe Hastaneleri''ni  barındırmaktadır. Beytepe Yerleşkesi ise göreceli olarak şehir merkezinden  uzakta bulunmakta ve üniversitenin mühendislik, edebiyat, fen, eğitim gibi  diğer fakülte ve bölümlerini barındırmaktadır. Üniversitenin Bilgi İşlem  Dairesi ana binası Beytepe Yerleşkesinde yer almakta, Sıhhiye Yerleşkesinde de  buraya bağlı bir Bilgi İşlem Merkezi bulunmaktadır. </p><p align="justify">
  Beytepe ve Sıhhiye yerleşkelerinin her biri UlakNet üzerinden yüksek hızda  Internet hizmeti almaktadırlar. Beytepe Yerleşkesi WAN (Wide Area Network) ile Sıhhiye Yerleşkesi ise Metro Ethernet hattı  ile Ulaknet&rsquo;e bağlıdır. Ayrıca Sıhhiye Yerleşkesi ile Beytepe Yerleşkesi  Metro Ethernet hattı ile birbirine bağlıdır.</p><p align="justify">
  Ankara''nın farklı bölgelerine yayılmış olan diğer fakülte ve yüksekokullar  yakınlık durumuna bağlı olarak adı geçen iki ana yerleşkeden birine bağlanarak  Internet servislerini almaktadırlar. Bağlantı hızları ve tipleri yerleşkenin  gereksinimine uygun olarak değişiklik göstermektedir (kiralık devreler, WiFi  kablosuz radyolinkler, doğrudan fiber optik kablolama, vb.). </p><p align="justify">Hacettepe Üniversitesi dış dünya ile BGP4 protokolünü kullanarak  haberleşmektedir. Üniversitenin otonom sistem numarası AS24922''dir.  Üniversiteye ait 33 adet C-Sınıfı IPv4 adres bloğu bulunmaktadır. Bölüm, birim  ve öğrenci yurtları güvenlik ve gereksinimlerine göre gerçek IP veya sanal IP  (+NAT, Network Address Translation) üzerinden dış dünya ile  haberleşmektedirler. İntranet/Extranet trafiği ise gerçek/sanal IP karışık  olarak NAT''lanmadan sağlanabilmektedir. Kampüsümüze Ulakbim tarafından tahsis  edilen 48 bit IPV6 adresi bulunmaktadır. Şu an üniversite bünyesinde bulunan  DNS sunucu ve Bilgi İşlem Daire Başkanlığı IPV6 ipleriyle çalışmaktadır.</p><p align="justify">
  Üniversitenin Ankara''daki yerleşkelerine göre sahip olduğu WAN / Extranet  bağlantıları aşağıda listelenmiştir: </p>
<table class="table">
<thead>
  <tr>
   <th scope="col"colspan="2"><strong>Hacettepe Üniversitesi Wan / Extranet Bağlantıları</strong></th>
  </tr>
</thead> 
<tbody> 
  <tr>
    <td>Bağlantı Noktaları</td>
    <td>Bağlantı Tipi</td>
  
  </tr>
  <tr>
    <td>Beytepe Yerleşkesi - ULAKNET</td>
    <td>Single Mode Fiberoptik kablo</td>

  </tr>
  <tr>
    <td>Sıhhiye Yerleşkesi - ULAKNET</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Yerleşkesi - Sıhhiye Yerleşkesi</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Yerleşkesi - Beşevler Konservatuar</td>
    <td>METRO Ethernet</td>
 
  </tr>
  <tr>
    <td>Sıhhiye Yerleşkesi - Sosyal Bilimler MYO</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Yerleşkesi - Başkent OSBTeknik Bilimler MYO</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Yerleşkesi - Hacettepe Ankara Sanayi 1.OSB MYO</td>
    <td>METRO Ethernet</td>
 
  </tr>
  </tbody>
</table>





</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 1);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('bgys', 'tr', 'Bilgi Güvenliği Yönetim Sistemi', '<div class="icerik">


<p><a href="/dosyalar/BilgiGuvenligiPolitikasi.pdf" target="_blank">Bilgi Güvenliği Politikası</a></p>
<p><a href="/dosyalar/BilgiSistemleriKabulEdilebilirKullanimPolitikasi.pdf" target="_blank">Bilgi Sistemleri Kabul Edilebilir Kullanım Politikası</a></p>

<p><a href="/dosyalar/ParolaPolitikasi.pdf" target="_blank">Parola Politikası</a></p>
<p><a href="/dosyalar/TemizMasaveTemizEkranPolitikasi.pdf" target="_blank">Temiz Masa ve Temiz Ekran Politikası</a></p>


</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 2);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Bilgi Güvenliği Politikası', 'https://bidb.hacettepe.edu.tr/dosyalar/BilgiGuvenligiPolitikasi.pdf', 'PDF', 0 FROM sayfa WHERE slug = 'bgys' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Bilgi Sistemleri Kabul Edilebilir Kullanım Politikası', 'https://bidb.hacettepe.edu.tr/dosyalar/BilgiSistemleriKabulEdilebilirKullanimPolitikasi.pdf', 'PDF', 1 FROM sayfa WHERE slug = 'bgys' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Parola Politikası', 'https://bidb.hacettepe.edu.tr/dosyalar/ParolaPolitikasi.pdf', 'PDF', 2 FROM sayfa WHERE slug = 'bgys' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Temiz Masa ve Temiz Ekran Politikası', 'https://bidb.hacettepe.edu.tr/dosyalar/TemizMasaveTemizEkranPolitikasi.pdf', 'PDF', 3 FROM sayfa WHERE slug = 'bgys' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('bilgidokuman', 'tr', 'Bilgi ve Dokümanlar', '<div class="icerik">

  <UL>
    <li><a href="/tr/VPN" target="_blank">VPN Kurulumu Kılavuzu</a></li>
    <LI><A href="/tr/spam">SPAM ve PHISHING Hakkında</A></LI>
    <LI><A href="/tr/guvenlik">Virüsler ve Güvenlik Önerileri</A></LI>
    <LI><A href="/tr/bil_onlem">Bilgisayar Kazaları için Önlemler</A></LI>
    <LI><A href="/tr/baglanti_onlem">HÜ Internet Bağlantısı Hakkında</A></LI>
    <LI><A href="/tr/proxy">Proxy Ayarları</A></LI>
    <LI><A href="/tr/dokuman_link">Yararlı Doküman ve Bağlantılar</A></LI>
  </UL>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 3);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('bilgikorumaanapolitikamiz', 'tr', 'Bilgi Güvenliği Politikası', '<div class="icerik">
<p><strong>Hacettepe Üniversitesi  Bilgi İşlem Dairesi Başkanlığı olarak ISO 27001 Bilgi Güvenliği Yönetim Sistemi  Standardına uygun bir yönetim sistemi kurmak, işletmek ve sürekli iyileştirmek  amacıyla;</strong><br />
   <strong> Genel Esaslar</strong></p>
<ul>
  <li>Bu  politika ile çerçevesi çizilen bilgi güvenliği gereksinimleri ve kurallarına  ilişkin ayrıntılar, BGYS prosedürleri ile düzenlenir. Kurum çalışanları ve 3.  taraflar bu prosedürleri bilmek ve çalışmalarını bu kurallara uygun şekilde  yürütmekle yükümlüdür.</li>
  <li>Bu  kural ve prosedürlerin, aksi belirtilmedikçe, basılı veya elektronik ortamda  depolanan ve işlenen tüm bilgiler ile bütün bilgi sistemlerinin kullanımı için  dikkate alınması esastır.</li>
  <li>Bilgi  Güvenliği Yönetim Sistemi, TS ISO/IEC 27001:2013 &quot;Bilgi Teknolojisi  Güvenlik Teknikleri (Information Technology Security Techniques) ve Bilgi  Güvenliği Yönetim Sistemleri Gereksinimler (Information Security Management  Systems Requirements)&quot; standardını temel alarak yapılandırılır ve  işletilir.</li>
  <li>Kurum  tarafından çalışanlara veya 3. taraflara sunulan bilgi sistemleri ve altyapısı  ile bu sistemler kullanılarak üretilen her türlü bilgi, belge ve ürün aksini  gerektiren kanun hükümleri veya sözleşmeler bulunmadıkça kuruma aittir.</li>
</ul>
<p><strong>Temel BGYS Prensipleri</strong><strong></strong></p>
<ul>
  <li>Çalışanlar  ve üçüncü taraflarla kurumun gizlilik ihtiyaçlarını güvence altına almayı  amaçlayan gizlilik anlaşmaları yapılır.</li>
  <li>Dış  kaynak kullanım durumlarında oluşabilecek güvenlik gereksinimleri analiz  edilerek güvenlik şart ve kontrolleri şartname ve sözleşmelerde ifade edilir.</li>
  <li>Bilgi  varlıklarının envanteri bilgi güvenliği yönetim ihtiyaçları doğrultusunda  oluşturulur ve varlık sahiplikleri atanır.</li>
  <li>Kurumsal  veriler sınıflandırılır ve her sınıftaki verilerin güvenlik ihtiyaçları ve  kullanım kuralları belirlenir.</li>
  <li>İşe  alım, görev değişikliği ve işten ayrılma süreçlerinde uygulanacak bilgi  güvenliği kontrolleri belirlenir ve uygulanır.</li>
  <li>Güvenli  alanlarda saklanan varlıkların ihtiyaçlarına paralel fiziksel güvenlik  kontrolleri uygulanır.</li>
  <li>Kuruma  ait bilgi varlıkları için kurum içinde ve dışında maruz kalabilecekleri fiziksel  tehditlere karşı gerekli kontrol ve politikalar geliştirilir ve uygulanır.</li>
  <li>Kapasite  yönetimi, üçüncü taraflarla ilişkiler, yedekleme, sistem kabulü ve diğer  güvenlik süreçlerine ilişkin prosedür ve talimatlar geliştirilir ve uygulanır.</li>
  <li>Ağ  cihazları, işletim sistemleri, sunucular ve uygulamalar için denetim kaydı  üretme konfigürasyonları ilgili sistemlerin güvenlik ihtiyaçlarına paralel  biçimde ayarlanır. Denetim kayıtlarının yetkisiz erişime karşı korunması  sağlanır.</li>
  <li>Erişim  hakları ihtiyaç nispetinde atanır. Erişim kontrolü için mümkün olan en güvenli  teknoloji ve teknikler kullanılır.</li>
  <li>Sistem  temini ve geliştirilmesinde güvenlik gereksinimleri belirlenir, sistem kabulü  veya testlerinde güvenlik gereksinimlerinin karşılanıp karşılanmadığı kontrol  edilir.</li>
  <li>Bilgi  güvenliği ihlal olayları ve zayıflıklarının raporlanması için gerekli altyapı  oluşturulur. İhlal olay kayıtları tutulur, gerekli düzeltici önleyici  faaliyetler uygulanır ve düzenlenen farkındalık eğitimleri vasıtasıyla güvenlik  olaylarından öğrenme sağlanır.</li>
  <li>Kritik  altyapı için süreklilik planları hazırlanır, bakımı ve tatbikatı yapılır.</li>
</ul>
<ol>
  <li>Yasalara,  iç politika ve prosedürlere, teknik güvenlik standartlarına uyum için gerekli  süreçler tasarlanır, sürekli ve periyodik olarak yapılacak gözetim ve denetim  faaliyetleri ile uyum güvencesi sağlanır.</li>
</ol>
<p><strong>Uyulması Gereken Kabul Edilebilir  Kullanım Kuralları</strong><strong></strong><br />
  Uyulması gereken kurallar BGYS  Kapsamında hazırlanan prosedürlerde belirtilmiştir. Tüm kurallar esas olarak  &quot;Bilgi Sistemleri Kabul Edilebilir Kullanım Politikası&quot; dokümanında  yer almaktadır. BGYS kapsamı dâhilinde yer alan tüm çalışanlar ve 3. Taraflar  belirtilen kurallara uymak zorundadır.</p>
<p><strong>Üçüncü  tarafların yönetimi</strong> </p>
  <ul>
<li>Hacettepe  Üniversitesi Bilgi İşlem Daire Başkanlığı çalışanı olmayıp bilgi sistemleri  kaynaklarına erişim sağlayan her türlü kişi 3. Taraf olarak kabul edilir. 3.  Tarafların uyması gereken kurallar ve yönetim şekli BGYS kapsamlı dokümanlarda  3. Taraf olarak ayrıca belirtilmiştir. 3. Taraf tanımına uyan her türlü kişi ya  da kurumla yapılacak geçici ya da sürekli çalışma sözleşmelerin imzalanması  güncel olarak takip edilmelidir. Sözleşme imzalanmadan önce kararlaştırılmış ve  onaylanmış güvenlik anlaşmaları hazırlanıp Kurumlarla kurumsal gizlilik  sözleşmesi 3. Taraf çalışanlarıyla bireysel gizlilik sözleşmesi yapılmalıdır.  Gerektiği takdirde üçüncü taraf çalışanlarının politikaya uyması için süre  tahsis edilmelidir.</p>
</li>
</ul>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 4);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('bilisim_ilke', 'tr', 'Hacettepe Üniversitesi Akademik Ağı (HUNET) Hakkında Öğrencilerimiz için Çerçeve Kurallar', '<div class="icerik">

<p> Hacettepe Üniversitesi kampüsleri dahilinde  bulunan ve BİD''nin kurup yönettiği bilgisayar ağı (HUNET); öğrencilerine ve tüm  çalışanlarına hizmet vermektedir. HUNET, öğrencilerin akademik çalışmalarını  yapabilmeleri için yurt odalarından kendi bilgisayarları ile  bağlanmalarına da olanak vermektedir. HUNET  hizmeti kapsamında haberleşmeyi  engellemek veya denetlemek hiçbir zaman hedeflenmemiştir. Ancak, bu hizmetin  kesintisiz devam etmesi ve bütün kullanıcıların güvenliğinin sağlanabilmesi için  tüm öğrencilerimizin aşağıda belirtilen ağ kullanım ve güvenlik politikalarına  uymaları gerekmektedir.<BR>
<p><STRONG>HUNET  Kuralları :</STRONG><BR>
<p>HUNET yatırımları, devlet kaynakları  kullanılarak akademik, idari, eğitim ve araştırma olmak üzere temel amaçlara  hizmet etmek üzere mevcuttur. Ağ üzerindeki kişisel kullanımlar hiçbir zaman temel  amaçların yerine getirilmelerine engel olmamalıdır. Bu kapsamda ağ kullanımında  uyulması gereken kurallar aşağıda belirtilmiştir.</p>
<UL>
  <LI>Sistem ve Ağ güvenliğinin ihlal edilmesi yasaktır. HUNET  yöneticileri bu tür ihlalleri takip etmekle ve incelmekle sorumludur.</LI>
  <LI> HUNET üzerinden, 26/9/2004  tarihli 5237 sayılı Türk Ceza Kanunu''nunda   yer verilen ve aşağıda sıralanan eylemler yapılmamalıdır: </LI>
  <UL>
    <LI>İntihara yönlendirme (madde 84)</LI>
    <LI>Çocukların cinsel istismarı (madde 103, birinci fıkra)</LI>
    <LI>Uyuşturucu veya uyarıcı madde kullanılmasını teşvik ve  kolaylaştırma (madde 190)</LI>
    <LI>Sağlık için tehlikeli madde temini (madde 194)</LI>
    <LI>Müstehcen içerik (madde 226)</LI>
    <LI>Fuhuş (madde 227)</LI>
    <LI>Kumar oynanması için yer ve imkan sağlama (madde 228)</LI>
  </UL>
  <LI>HUNET üzerinden Peer-to-peer (P2P) dosya paylaşım  programları, yarattığı yasal sorunların yanı sıra, yüksek bant genişliği tüketmeleri  nedeniyle kullanıma kapatılmıştır. </LI>
  <LI>HUNET üzerinden şahsi kazanç elde edilmesi; ticari, siyasi,  genel ahlak kurallarına aykırı reklam, duyuru, propaganda vb içeriği olan çoklu  e-postalar gönderilmemelidir.</LI>
  <LI>HUNET''in üniversite dışından kullanılmasına sebep olabilecek  hiç bir faaliyet yapılmamalıdır.</LI>
  <LI>Hacettepe Üniversitesi yurt odalarında, içerik türü her ne  olursa olsun paylaşım hizmeti veren bilgisayar bulundurulamaz.<U></U></LI>
  <LI>Hacettepe Üniversite yurt odalarında, adına kayıtlı  bilgisayar bulunan her öğrenci, HUNET kaynaklarını bilinçli ya da bilinçsiz  olarak üçüncü kişilere kullandırması durumunda ortaya çıkabilecek sonuçların  asli sorumlusudur.</LI>
</UL>
<p>Yukarıda belirtilen kurallara  uyulmadığında, bilgi vermek süreti ile aşağıdaki cezalardan bir ya da birkaçı  uygulanacaktır:</p>
<UL>
  <LI><STRONG>Ağ erişiminin  sınırlandırılması, </STRONG></LI>
  <LI><STRONG>Kullanıcı kodunun  ve ağ erişiminin kapatılması, </STRONG></LI>
  <LI><STRONG>Üniversite  bünyesinde soruşturma başlatılması, </STRONG></LI>
  <LI><STRONG>Adli yargıya  başvurulması.</STRONG></LI>
</UL>
<p>HUNET hizmeti sonsuz bir kaynak olmayıp,  kurallara uyulması hizmetin sürekliliği ve kalitesi için çok önem taşımaktadır.  Aksi davranışların kullanım kısıtlamalarına neden olacağı açıktır. Bu nedenle  tüm öğrencilerimizden HUNET kullanımı konusunda gereken titizliği ve özeni  göstermelerini bekliyoruz <BR>
    <STRONG>Hacettepe  Üniversitesi Rektörlüğü</STRONG><BR>
  <STRONG>*</STRONG> Bu kurallar  yayınlandığı tarihten itibaren geçerlidir. Gerekli görüldüğü durumlarda metin  üzerinde değişiklik yapılabilir. </p>
 
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 5);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('donanim', 'tr', 'Donanım', '<div class="icerik">



<p align="justify">Hacettepe Üniversitesi Bilgi İşlem Dairesi’nin başta ağ cihazları ve fiber kablolama olmak üzere bilişim hizmetleri alanında hizmet vermeye yönelik alt yapı olanakları mevcuttur.</p>
<p align="justify">Beytepe  Yerleşkemizde çalışan  1  adet  router,  yedekli  çalışan  iki  ana  omurga,  57  adet yarı omurga 3. seviye ağ anahtarlama cihazı, 509 adet 2. seviye ağ anahtarlama cihazı ile 1761 adet WIFI cihazı ve WIFI yönetimi için 5 adet merkezi kontrol cihazı, 56 tane merkezi kontrol cihazından bağımsız WIFI cihazı mevcuttur.  </p>

<p align="justify">Sihhiye kampusümüzde çalışan bir adet “router”, yedekli ana omurga, 1 adet bant genişliği yönetim cihazı ,14 adet 3. seviye ağ anahtarlama cihazı, 174 adet 2.seviye ağ anahtarlama cihazı ile 274 adet Wi-Fi cihazı mevcuttur.</p>
<p align="justify">Ağ sistemimizin güvenliği için kampüs ve sunucular önünde yedekli güvenlik duvarı sistemi kullanılmaktadır. Sıhhiye kampüsümüzün güvenliği için yedekli güvenlik duvarı sistemi ve URL filtreleme sistemleri kullanılmaktadır.</p>





</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 6);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('e-posta', 'tr', 'E-posta', '<div class="icerik">







<div class="row">
	<div class="col-lg-3  mb-4">
	
		<div class="card text-center h-100">		  
		  <div class="card-body">
		  	<div class="mb-2"><img src="/images/icon_exchange2.jpg" width="48" /></div>
		    <h5 class="card-title2"><a href="https://posta.hacettepe.edu.tr" target="_blank">E-Posta Girişi<br />(Microsoft Exchange)</a></h5>	
		    <p><span class="text-danger">(Personel - Öğrenci Girişi)</span></p>	    
		  </div>
		</div>
	
	</div>

<div class="col-lg-3 mb-4">
	
		<div class="card text-center h-100">		  
		  <div class="card-body">
		  	<div class="mb-2"><img src="/images/icon_mail2.jpg" width="48" /></div>
		    <h5 class="card-title2"><a href="https://outlook.office.com/" target="_blank">Mezun E-Posta Giriş</a></h5>		    
		  </div>
		</div>
	
	</div>


	<div class="col-lg-3  mb-4">
	
		<div class="card text-center h-100">		  
		  <div class="card-body">
		  	<div class="mb-2"><img src="/images/icon/portal.png" width="48" /></div>
		    <h5 class="card-title2"><a href="https://portal.hacettepe.edu.tr/" target="_blank">HÜ Bilgi İşlem Daire Başkanlığı Portalı</a></h5>		    
		  </div>
		</div>
	
	</div>

	





</div>
	
	
  
  



</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 7);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('eposta', 'tr', 'E-posta İşlemleri', '<div class="icerik">

<ul>
    <li><a href="https://posta.hacettepe.edu.tr" target="_blank">E-Posta Giriş</a></li>
    
  <li><a href="/tr/epostaalma" target="_blank">Yeni E-Posta Açma</a> </li>
  <li><a href="https://portal.hacettepe.edu.tr/hesap/kullaniciadimiunuttum" target="_blank">Kullanıcı Adımı Unuttum</a></li>
  <li><a href="https://portal.hacettepe.edu.tr/hesap/sifremiunuttum" target="_blank">Şifremi Unuttum</a></li>
  <li><a href="https://portal.hacettepe.edu.tr/login" target="_blank">Şifre Güncelleme</a></li>
  <li><a href="https://portal.hacettepe.edu.tr/login" target="_blank">Bilgi Güncelleme</a> </li>
  <li><a href="https://portal.hacettepe.edu.tr/login" target="_blank">Telefon No Güncelleme</a><br />
  </li>
  <li><a href="/tr/proxy_spam_kntr" target="_blank">Proxy-Spam Kontrol</a></li>
    <li><a href="/tr/eposta_gecis">Microsoft Exchange Bağlantı Ayarları</a><br />
  </li>



</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 8);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('erisilebilirlik', 'tr', 'Erişilebilirlik Bildirimi', '<div class="icerik">
<p align="justify"><strong>1. Taahhüt Beyanı</strong><br />
  Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı olarak, dijital  hizmetlerimizi engelli bireyler dahil tüm kullanıcılar için erişilebilir  kılmayı taahhüt ediyoruz. Web sitemizi, herkesin bilgiye eşit ve bağımsız bir  şekilde ulaşabilmesini sağlayacak standartlara getirmek için sürekli  geliştiriyoruz.&nbsp; <br />
</p><p align="justify"><strong>2. Uyumluluk Durumu</strong><br />
  Bu web sitesi,&nbsp;<strong>WCAG 2.2 Seviye AA</strong>&nbsp;(Web İçeriği Erişilebilirlik  Kılavuzu) standartlarına büyük ölçüde uyumludur. Sitemizde şu an için aktif  olan erişilebilirlik özellikleri şunlardır:&nbsp; </p>
<ul>
  <li><strong>Erişilebilirlik Menüsü:</strong>&nbsp;Yazı boyutu  ayarlama, kontrast seçenekleri, link vurgulama ve sesli okuma gibi araçlar  mevcuttur.</li>
  <li><strong>Klavye Navigasyonu:</strong>&nbsp;Fare kullanmadan sadece klavye ile  sekmeler arasında gezinebilme desteği sağlanmaktadır.</li>
  <li><strong>Görsel Betimlemeler:</strong>&nbsp;Önemli görseller için alternatif  metin (alt-text) çalışmaları devam etmektedir.&nbsp; </li>
</ul>
<p align="justify"><strong>3. Bilinen Sınırlamalar</strong><br />
  Bazı eski arşiv belgeleri (PDF formatındaki eski yönergeler) veya üçüncü taraf  entegrasyonları henüz tam erişilebilirlik standartlarını karşılamıyor olabilir.  Bu içeriklerin erişilebilir versiyonları üzerinde çalışmalarımız sürmektedir.&nbsp; <br />
<p align="justify"><strong>4. Geri Bildirim ve İletişim</strong><br />
  Sitemizi kullanırken herhangi bir erişilebilirlik engeliyle karşılaşırsanız  veya iyileştirme öneriniz varsa lütfen bizimle iletişime geçin:</p>
<ul>
  <li><strong>E-posta:</strong>&nbsp;bidb@hacettepe.edu.tr</li>
  <li><strong>Telefon:</strong>&nbsp;+90 312 297 62 62</li>
  <li><strong>Adres:</strong>&nbsp;Hacettepe Üniversitesi Bilgi İşlem  Daire Başkanlığı, 06800 Beytepe / ANKARA&nbsp; </li>
</ul>
</p><p align="justify"><strong>5. Onay ve Güncelleme Tarihi</strong><br />
Bu bildirim en son 28.04.2026 tarihinde güncellenmiştir

</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 9);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('erisim', 'tr', 'Dış Erişim Kuralları', '<div class="icerik">


<p><STRONG>Firewall Üzerinde Tanımlı Kurallar</STRONG></p>
Hacettepe Üniversitesi bilişim   kaynaklarının kullanımını daha etkin ve verimli kılabilmek amacıyla   üniversitemiz ana Internet çıkışlarında bulunan "Firewall" ve "Router" cihazları   üzerinde bir dizi düzenleme yapılmıştır. Bu düzenlemeler, hem Internet   trafiğimizin sorunsuz olarak akmasını sağlamayı, hem de kullanıcılarımızı   dışarıdan gelebilecek bazı saldırılara karşı korumayı amaçlamaktadır.
<p><STRONG>Peer-to-Peer Teknolojisini Kullanan Trafiğin Bastırılması</STRONG></p>
Hacettepe   Üniversitesi Bilgi İşlem Dairesi, 2006 yılı başından itibaren popüler bazı   peer-to-peer programların dosya transferini engellemek için bir donanım/yazılım   sistemini devreye sokmuştur. Bunun gerekçeleri şöyle özetlenebilir:
<UL>
  <LI>Yaptığımız Internet trafik analizleri göstermiştir ki, Internet trafiğimizde   yaşadığımız yoğunluğun en büyük nedeni gün içinde bazı kullanıcılarımızın   bilinçli ya da bilinçsiz olarak, hiç durmaksızın çeşitli dosya paylaşım   programlarını (peer-to-peer programlar: örn. torrent clients, emule, e-donkey,   vb.) kullanmaları olmuştur. Bu programlar çoğunlukla yüzlerce megabyte   uzunluğundaki büyük dosyaları indirmek için kullanılmakta ve doğaları gereği   aynı zamanda indirilen veya indirilmekte olan dosyaları da kampüs dışı   kullanıcıların paylaşımına açmaktadırlar. Bu ise tek bir bilgisayarın aynı anda   yüzlerce-binlerce noktaya bağlantı kurması anlamına gelmektedir. Kampüsümüzün   Internet güvenliği için kullanmakta olduğumuz firewall cihazları başta olmak   üzere Internet bağlantısını sağlamakta olan cihazlarımız -ne kadar güçlü   olurlarsa olsunlar- bu düzeydeki bir trafiği kaldırabilmekte çok   zorlanmaktadırlar. Bağlantı hızı ve kapasitesi ne kadar arttırılırsa   arttırılsın, dünyada birçok üniversitenin de problemlerinden biri olan   "peer-to-peer" programların kullanımının zaman içinde bunu da doyuma ulaştırağı   öngörülemez değildir. </LI>
  <LI>Özellikle bazı kullanıcıların göz ardı ettikleri bir diğer konu, paylaşılan   bazı dosyaların telif hakkı olup olmamasıdır. Bilindiği gibi bu tür dosyaların   indirilmesi de dışarıya paylaştırılması da üniversitemize kayıtlı IP adresleri   üzerinden olmaktadır. Dışarıya paylaşılan dosyaların kurumumuzu yasal olarak zor   durumda bırakması söz konusu olabilmektedir. </LI>
</UL>
<p>Kullanılan teknoloji mükemmel olmamasına rağmen, Internet bağlantı   performansında önemli bir iyileşme yaşanmıştır. Amaç, kullanıcıları sınırlamak   değil, özkaynakların paylaşımını iyileştirmekten ibarettir. Bu nedenle, ağ   trafiğini yoğunlaştırdığı düşünülen diğer teknoloji, adres ve yöntemler şu an   için engellenmemektedir. Dairemizin eğilimi, teknik engellemeleri arttırmak   yerine kullanıcıların bilinçlenmesine katkı sağlamak ve lisanslı yazılımların   kullanılmasını sağlayarak kampüslerde virüs/worm vb. zararlıların oluşturacağı   gereksiz trafiği azaltmak yönündedir. </p>
<p><STRONG>Port Sınırlamaları</STRONG></p>
Kullanıcıların Internet erişimine bir zarar vermeyen,   ancak kullanılan işletim sistemlerinin açıklarından yararlanarak bazı zararlı   programların ya da bilgisayar korsanlarının sistemlere girişlerini   kolaylaştıracak Internet port''ları kampüslerin WAN girişinde kapatılmıştır.   Üniversitenin farklı bölgelerinde, o yerin donanım altyapısı, Internet çıkış   kapasitesi, kullanıcı profili ve gereksinimleri doğrultusunda farklı   düzenlemeler yapılmaktadır.
<p>Eğer port engellemeleri nedeniyle çalışmanızın aksadığını düşünüyorsanız   dairemizin Çağrı Merkezini arayabilir ya da cagrimerkezi@hacettepe.edu.tr adresine   e-posta gönderebilirsiniz. </p>
<p><STRONG>Saldırı Tespit ve Önleme Sistemleri (IDS, IPS)</STRONG></p>
Yine üniversitemizin   farklı bölgelerinin gereksinimlerine paralel olarak kampüslerin WAN girişlerinde   Saldırı Tespit ve Önleme (Intrusion Detection and Prevention) sistemleri   kullanılmaktadır. Kuşkusuz bu sistemlerin hiç biri kusursuz değildir, ancak bazı   temel algoritmaları kullanarak yapılmaya teşebbüs edilen bir çok saldırıyı bloke   etmeyi başarmaktadır.
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 10);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('formlar', 'tr', 'Formlar', '<div class="icerik">

<UL>

<li><a href="/dosyalar/E-PostaEngelKaldirmaFormu.docx">E-Posta Engel Kaldırma Formu</a></li>
<li><a href="/dosyalar/E-PostaIptalFormu.docx">E-Posta İptal Formu</a></li>
<li><a href="/dosyalar/E-PostaTalepFormuKurumsal.docx">E-Posta Talep Formu (Kurumsal)</a></li>
<li><a href="/dosyalar/E-PostaGuncellemeFormuKurumsal.docx">E-Posta Güncelleme Formu (Kurumsal)</a></li>

<li><a href="/dosyalar/E_postaDigerKullaniciTalep_Formu.docx">E-Posta Talep Formu (Diğer)</a></li>
<li><a href="/dosyalar/BGYS-F-25MisafirKullaniciTalep Formu.docx">Misafir Kullanıcı Talep Formu</a></li>
  
  <LI><A href="/dosyalar/BGYS-F-03SunucuTalepFormuv01.docx">Sunucu Talep Formu</A></LI>
  <LI><A href="/dosyalar/SunucuBakimListesiFormu.docx">Sunucu Bakım Formu</A></LI>
  <LI><A href="/tr/VPN">VPN Bağlantı Kılavuzu</A></LI>
  <LI><A href="/dosyalar/SSLVPNBaglantiTalepFormu.pdf" target="_blank">VPN Bağlantı Talep Formu</A></LI>
<li><a href="/dosyalar/HUBIDB_YazilimGelistirmeTalepFormu.pdf">Yazılım Geliştirme Talep Formu</a></li>
  

  
</UL>

</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 11);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'E-Posta Engel Kaldırma Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/E-PostaEngelKaldirmaFormu.docx', 'DOCX', 0 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'E-Posta İptal Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/E-PostaIptalFormu.docx', 'DOCX', 1 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'E-Posta Talep Formu (Kurumsal)', 'https://bidb.hacettepe.edu.tr/dosyalar/E-PostaTalepFormuKurumsal.docx', 'DOCX', 2 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'E-Posta Güncelleme Formu (Kurumsal)', 'https://bidb.hacettepe.edu.tr/dosyalar/E-PostaGuncellemeFormuKurumsal.docx', 'DOCX', 3 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'E-Posta Talep Formu (Diğer)', 'https://bidb.hacettepe.edu.tr/dosyalar/E_postaDigerKullaniciTalep_Formu.docx', 'DOCX', 4 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Misafir Kullanıcı Talep Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/BGYS-F-25MisafirKullaniciTalep Formu.docx', 'DOCX', 5 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sunucu Talep Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/BGYS-F-03SunucuTalepFormuv01.docx', 'DOCX', 6 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sunucu Bakım Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/SunucuBakimListesiFormu.docx', 'DOCX', 7 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'VPN Bağlantı Talep Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/SSLVPNBaglantiTalepFormu.pdf', 'PDF', 8 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Yazılım Geliştirme Talep Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/HUBIDB_YazilimGelistirmeTalepFormu.pdf', 'PDF', 9 FROM sayfa WHERE slug = 'formlar' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('geneltanitim', 'tr', 'Genel Tanıtım', '<div class="icerik">

    <p align="justify"><strong><u>Ağ  Birimi (Beytepe):</u></strong> Yerel ağın kurulumu, mevcut ağın  yönetimi, denetimini yapar  ve ağın  geleceği ile ilgili projeleri üretir, kullanıcılara internet kullanımı hizmeti  verilmesi için gerekli altyapı, donanım, yazılım ve bilgi desteği sağlar. </p>
    <p align="justify"><strong><u>Ağ ve  Sistem Birimi (Sıhhiye):</u></strong> Yerel ağın kurulumu, mevcut  ağın yönetimi, denetimini yapar  ve ağın  geleceği ile ilgili projeleri üretir, kullanıcılara internet kullanımı hizmeti  verilmesi için gerekli altyapı, donanım, yazılım ve bilgi desteği sağlar.  Başkanlığımızın ev sahipliği yaptığı tüm sunucu bilgisayarları ve temel  internet servislerini (DNS, FTP, WEB, E-POSTA, WEBMAIL, PROXY, vb.) 5651 sayılı  İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla  İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun, Telekomünikasyon Kurumu  Tarafından Erişim Sağlayıcılara ve Yer Sağlayıcılara Faaliyet Belgesi  Verilmesine İlişkin Usul ve Esaslar Hakkında Yönetmelik, İnternet Ortamında  Yapılan Yayınların Düzenlenmesine Dair Usul ve Esaslar Hakkında Yönetmelik  çerçevesinde işletir, günceller ve yedeklemesini yapar.</p>
    <p align="justify"><strong><u>Sistem  ve Güvenlik Birimi (Beytepe):</u></strong> Başkanlığımızın ev  sahipliği yaptığı tüm sunucu bilgisayarları ve temel internet servislerini  (DNS, FTP, WEB, E-POSTA, WEBMAIL, PROXY, vb.) 5651 sayılı İnternet Ortamında  Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla  Mücadele Edilmesi Hakkında Kanun, Telekomünikasyon Kurumu Tarafından Erişim  Sağlayıcılara ve Yer Sağlayıcılara Faaliyet Belgesi Verilmesine İlişkin Usul ve  Esaslar Hakkında Yönetmelik, İnternet Ortamında Yapılan Yayınların  Düzenlenmesine Dair Usul ve Esaslar Hakkında Yönetmelik çerçevesinde işletir,  günceller ve yedeklemesini yapar. Sistem odasının ve  Kesintisiz Güç Kaynağı odasının güvenliğini  sağlar.</p>
    <p align="justify"><strong><u>Sistem  Yazılımları Birimi:</u></strong> Yönetim sistemleri çerçevesinde çalışan uygulamaların, veritabanı ve  uygulama sunucularının bakım, yedekleme ve idaresi ile bu sistemlerin Bilgi  İşlem Dairesi tarafından idare edilen diğer sistemlerle eş güdümünü sağlar.</p>
    <p align="justify"><strong><u>Yazılım  Geliştirme Birimi:</u></strong><u> </u>Üniversitemiz bünyesindeki  birimlerimizin işlerini bilgisayar ortamına taşımak ve toplanan veriler  üzerinden istenen raporları üretebilmek amacı ile iletilen yazılım  ihtiyaçlarını değerlendirilerek en uygun çözüm yöntemini belirler. Gerek idari  gerekse akademik işler sırasında ortaya çıkan yazılım ihtiyacının karşılanması  ve gerek görüldüğü takdirde mevcuttaki diğer yazılımlarla entegrasyonun  sağlanması için ihtiyaçları değerlendirir, analiz eder ve çözüm önerileri  sunar.</p>
    <p align="justify"><strong><u>BYS ve Bireysel  İşlemler Birimi:</u></strong><u> </u>Üniversitemizin Yönetim  Sistemleri <strong>BYS</strong> (Belge Yönetim Sistemi), <strong>Bİ</strong> (Bireysel İşlemler) sistemlerini işletme ve bu sistemleri kullanan  personelimize son kullanıcı desteği verme konusunda faaliyet göstermektedir. Elektronik-İmza için  gerekli Nitelikli Elektronik Sertifika (NES) ilk başvurusunu üniversite  personeli adına TÜBİTAK KAMUSM (Kamu Sertifikasyon Merkezi)’ne yapar, KAMUSM ye  başvuru ile başlayıp NES’ nın ilgili personele iletilmesine kadar geçen süreci  yöneterek kayıp, çalıntı, iptal, yenileme durumlarında ilgili üniversite  personeline destek olur, Üniversite personeline Elektronik-İmza uygulamalarında  ihtiyaç duyulacak kurulumlar için destek olur, Elektronik-İmza işleyişi  hakkında Üniversite personelini web sayfası ve&nbsp; e-posta yoluyla  bilgilendirir, Bilgi İşlem Daire Başkanlığı ile Kamu Sertifikasyon Merkezi  (Kamu SM) arasındaki yazışmalar, idari işlemler ve teknik konularda  koordinasyonu sağlar.</p>
    <p align="justify"><strong><u>İdari ve Mali  İşler Birimi:</u></strong>Başkanlığımızın bir sonraki yıla ilişkin tahmini bütçesini hazırlar. Harcama yetkisinde olan bütçe tertiplerine ilişkin satın almaları yapar. İlk altı aylık ve yıllık Birim Faaliyet Raporlarını hazırlar. 5 yıllık stratejik planını hazırlar. Yıl içerisinde 3’er aylık dilimler halinde birim izleme raporunu hazırlar. Birim Taşınır Kayıt Kontrol Sistemini yöneterek taşınır girişi, çıkışı, hurdaya ayırma gibi işlemlerini ve birim içi demirbaş zimmetlerini yapar. Başkanlık içi bakım ve onarım işlerini koordine eder. Belirli dönemlerde Başkanlık Birimlerinin ihtiyaçlarını toplayarak ihtiyaç listelerini oluşturur. Yönetim tarafından istenen raporları hazırlar ve sunar.</p>
    <p align="justify"><strong><u>İnsan  Kaynakları Birimi:</u></strong> Üniversitemizin İnsan Kaynakları  Yönetim Sistemini (İKYS) işletir ve Personel Dairesi Başkanlığındaki personel  ve tahakkuk kullanıcılarına son kullanıcı desteği verir,<strong> </strong>İnsan Kaynakları Yönetim Sisteminde (İKYS) daha önceden ön  görülmemiş Liste, Rapor ve İstatistiksel Tabloların oluşturulmasını sağlar,  Üniversitemizin tüm çalışanlarının bordrolarını (Maaş, Maaş Farkları, Döner  Sermaye, Nöbet, Ekders, İkramiye, İkramiye Farkı) yasal ekleri ile birlikte  tahakkuk müdürlüklerine hazırlar ve kişiye verilen bordronun e-posta yoluyla dağıtımını  yapar.</p>
    <p align="justify"><strong><u>Kullanıcı  Destek Birimi :</u></strong> 
Üniversitemiz bünyesinde demirbaş kaydı bulunan bilgisayar ve çevre birimlerinin bakım ve onarımını yapar, onarılamayacak durumda donanım arızası olanları rapor eder, bilgisayarda mevcut bulunan ek donanımların sisteme tanıtılmasını sağlar. 
<br>Bu birim içerisinde bulunan "Çağrı Merkezi" ise elektronik posta hesaplarının açılması, şifre değişikliği talebi ve e-posta hesaplarına ilişkin telefon desteği sağlar. Sorun Bildirim ve Destek Sistemi aracılığı ile gelen talepleri yanıtlar. Üniversitemiz birimlerinin yaptığı etkinlikler (konferans, kongre) için teknik destek sağlar (bilgisayar, yazıcı, projeksiyon cihazı gibi donanımların kurulumu v.b.), Başkanlığa telefon aracılığı ile ulaşan yardım taleplerini karşılar. 
<br>İnternet üzerinden hizmet veren lisanslı ve ücretsiz programların bulunduğu Yazılım Deposu ara yüzünün işletilmesi ve güncellenmesini yapar.
   


 <p align="justify"><strong><u>Web  Birimi:</u></strong> Hacettepe Üniversitesi web sayfasının yapılandırılması ve  güncellenmesi, Akademik/İdari Birimler, Öğrenci Toplulukları ve  Organizasyonlara yönelik web sayfası oluşturulması, Akademik/İdari Personel ve  Öğrenci kişisel web sayfalarına teknik destek sağlanması görev yürütür.</p>
    <p align="justify"><strong><u>Bilgisayar  Laboratuvarları:</u></strong> Üniversitemiz Sıhhiye Kampüsünde hizmet veren 75 bilgisayarlık laboratuvarın işletilmesini sağlamaktadır.</p>

</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 12);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('hu-iys', 'tr', 'Hacettepe Üniversitesi İçerik Yönetim Sistemi', '<div class="icerik">
<p>Bilgi İşlem  Daire Başkanlığı tarafından hazırlanan ve web sayfalarınızın içeriğini  yönetebileceğiniz İçerik Yönetim Sistemi (HÜ-İYS) hizmete girmiştir.</p>
<p>Bu sistem üniversitemiz birimler/bölümler web sayfalarını yöneten veya yönetecek olan sayfa sorumluları için hazırlanmıştır. Bireysel kullanıcılar sisteme giriş yaptığında yetki hatası alırlar.</p>
<p>Mevcut sayfaların sistemi kullanması için dilekçe ile başvurması gerekmektedir. Dilekçe örneği aşağıdadır.</p>
<TABLE width="100%" border="0" cellpadding="5">
  <TBODY>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon01.png"></TD>
      <TD align="left" valign="middle"><STRONG>HÜ-İYS Nedir?</STRONG><BR>
        HÜ-İYS,  merkezi olarak web sayfalarınızın içeriğini yönetebileceğiniz web tabanlı bir  uygulamadır. Bu uygulama ile web sitenize içerik girişi ve içerik düzenlemesi  yapabilirsiniz. Bu düzenlemeleri yaparken herhangi bir programa ihtiyaç  duymadan tarayıcınız üzerinden işlemlerinizi yapabilirsiniz.</TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon02.png"></TD>
      <TD align="left" valign="middle"><p><STRONG>Sisteme Giriş</STRONG><BR>
        Sisteme <A href="http://hu-iys.hacettepe.edu.tr/">http://hu-iys.hacettepe.edu.tr/</A> adresi üzerinden hacettepe.edu.tr eposta hesap bilgileriniz ile  giriş yapabilirsiniz. Sistemi kullanmak için başka bir şifreye ihtiyacınız  yoktur.</p>
          <p><STRONG>Sayfa Sorumluluğu</STRONG><BR>
            Sisteme giriş yaptığınızda sorumlu olduğunuz sayfalara  müdahale edebilirsiniz. Eğer herhangi bir sayfa için sayfa sorumluluğu  tanımlamanız yok ise sistemi kullanamazsınız.</p></TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon03.png"></TD>
      <TD align="left" valign="middle"><p><STRONG>HÜ-İYS Bileşenleri</STRONG></p>
          <OL>
            <LI>Menüler</LI>
            <LI>Sayfalar</LI>
            <LI>Haber ve Duyurular</LI>
            <LI>Foto Galeri</LI>
            <LI>Video Galeri</LI>
          </OL></TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon04.png"></TD>
      <TD align="left" valign="middle"><STRONG>Şablon Yapısı</STRONG><BR>
        Sistem Bilgi  İşlem Daire Başkanlığı tarafından hazırlanan şablonu kullanmaktadır. Şablon  merkezi olarak değiştirildiğinde sistemi kullanan sayfalar otomatik olarak  değişen şablonu kullanmaya başlayacaktır. <BR>
        <BR>
        <STRONG>Çoklu Dil Desteği</STRONG><BR>
        Sistemde tanımlı  sayfalar için çoklu dil desteği sağlanmaktadır.</TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon05.png"></TD>
      <TD align="left" valign="middle"><STRONG>Dosya Yönetimi</STRONG><BR>
        Sayfanızda  kullanacağınız dosyalar(doküman, resim vs.) için her bir sayfa için ayrı olarak  tanımlanmış dosya alanını kullanabilirsiniz.</TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon06.png"></TD>
      <TD align="left" valign="middle"><p><STRONG>HÜ-İYS Kimler Kullanabilir?</STRONG><BR>
        HÜ-İYS  aşağıdaki birimler tarafından kullanılabilir.</p>
          <OL>
            <LI>Fakülteler</LI>
            <LI>Bölümler</LI>
            <LI>Birimler</LI>
            <LI>Araştırma Merkezleri</LI>
            <LI>Enstitüler</LI>
            <LI>Yüksek Okullar</LI>
            <LI>Meslek Yüksek Okulları</LI>
            <LI>Öğrenci Toplulukları</LI>
            <LI>Hacettepe Üniversitesi Tarafından  Düzenlenen Kongreler</LI>
          </OL>
        <p><STRONG>HÜ-İYS İçin Nasıl Başvurabilirim?</STRONG><BR>
          HÜ-İYS Kullanmak için <A href="/dosyalar/BGYS-F-23-IYSTalepFormurevizyon.docx"><STRONG>“HÜ-İYS Başvuru Formu”</STRONG></A> ile resmi yazı üzerinden başvurulması gerekmektedir. </p></TD>
    </TR>
  </TBODY>
</TABLE>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 13);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, '“HÜ-İYS Başvuru Formu”', 'https://bidb.hacettepe.edu.tr/dosyalar/BGYS-F-23-IYSTalepFormurevizyon.docx', 'DOCX', 0 FROM sayfa WHERE slug = 'hu-iys' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('hunet_kurallar', 'tr', 'HUNET Kullanım İlkeleri', '<div class="icerik">
<p><strong>1. Tanımlar</strong></p>
<p><STRONG>Bilişim Kaynağı:</STRONG> Hacettepe Üniversitesi kampüsleri dahilinde bulunan   ve BİD''nin kurup yönettiği bilgisayar ağı (HUNET), bağlı olduğu tüm iç ve dış   ağlar ile bu ağa bağlanan her türlü elektronik cihaz, bilgisayar ve yan   ürünleri. </p>
<p><STRONG>HUNET:</STRONG> Hacettepe Üniversitesi dahilinde bölüm, birim, bina ve kampüs   düzeyinde bilişim kaynaklarını bir ağ yapısı ile birbirine bağlayan ve Internet   erişimini sağlayan ağa verilen genel ad. </p>
<p><STRONG>BİM:</STRONG> Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı bünyesinde   faaliyet gösteren ve ağ, sunucu ve benzeri servislerin tümüne olan erişimi   sağlayan sistemlerin bir araya geldiği ve yönetildiği merkez (Bilgi İşlem   Merkezi). </p>
<p><STRONG>Kampüs Kullanıcısı:</STRONG> Hacettepe Üniversitesi dahilinde bulunan bilişim   kaynaklarını üniversite kampüsleri içinden erişerek kullanan akademik ve idari   personel, öğrenci ya da kullanım hakkı tanınmış özel ya da tüzel kişi. </p>
<p><STRONG>Kampüs Dışı Kullanıcı:</STRONG> Hacettepe Üniversitesi dahilinde bulunan   bilişim kaynaklarını üniversite kampüsleri dışından çeşitli yöntemlerle erişerek   kullanan akademik ve idari personel, öğrenci ya da kullanım hakkı tanınmış özel   ya da tüzel kişi. </p>
<p><STRONG>Ziyaretçi:</STRONG> Hacettepe Üniversitesi dahilinde olmayan, ancak çeşitli   nedenlerle Hacettepe Üniversitesi bilişim kaynaklarına (WEB, FTP vb.) uzaktan   erişenler ile üniversitenin personel ya da öğrencisi olmayıp kampüsler dahilinde   bulunan bazı bilişim kaynaklarına (kablosuz ağ vb.) ulaşan kişi. </p>
<p><strong>2. Yetki Ve Sorumluluk Beyanı</strong></p>
Üniversitemizde Internet ve Intranet   ağının kurulum ve işletmesine ait yetki ve sorumluluk Bilgi İşlem Dairesi   (BİD)''ne aittir. BİD, akademik, idari, eğitim ve araştırma amaçları   doğrultusunda bölüm ve birimlerin bilişim kaynaklarına ulaşabilmerini sağlamak   üzere oluşturulan altyapıyı kurmak, işletmek ve güncellemekle sorumludur. BİD,   bölüm ve birimlerde tespit edilen ana ağ erişim noktalarını kurar, Bilgi İşlem   Merkezi (BİM) ile iletişimi için gerekli kablolama faaliyetlerini yürütür, bu   noktalara kullanıcıların bağlanabilmesi için gerekli ağ anahtarlama cihazlarını   temin eder ve yerleştirir. Sistemi teknik düzeyde planlama ve uygulama   sorumluluk ve yetkisi BİD''ndedir. BİD, binalar içinde kurulan ana erişim   noktaları dışında kalan oda, ofis ve laboratuvar gibi alt birimlerin   bağlantılarından sorumlu değildir; bunlar birimin/bölümün kendi   sorumluluğundadır. Ancak BİD gereken durumlarda ve istek üzerine danışmanlık   hizmeti verebilir.
<p>Hacettepe Üniversitesi bilişim kaynakları kullanıcıları, Hacettepe   Üniversitesi sunucuları üzerinde kendilerine tahsis edilen "kullanıcı   kodu/şifre" ikilisi ve/veya IP (Internet Protocol) adresi kullanılarak   gerçekleştirdikleri her türlü etkinlikten, Hacettepe Üniversitesi bilişim   kaynaklarını kullanarak oluşturdukları ve/veya kendilerine tahsis edilen   Hacettepe Üniversitesi bilişim kaynağı üzerinde bulundurdukları her türlü   kaynağın (belge, doküman, yazılım, vb.) içeriğinden, kaynağın kullanımı hakkında   yetkili makamlar tarafından talep edilen bilgilerin doğru ve eksiksiz   verilmesinden, ilgili kaynağın kullanım kurallarına, üniversite   yönetmeliklerine, Türkiye Cumhuriyeti yasalarına ve bunlara bağlı olan   yönetmeliklere karşı birebir kendileri sorumludur. </p>
<p>Hacettepe Üniversitesi yönetimi, Hacettepe Üniversitesi kullanıcıları ve özel   kullanıcılar ile üçüncü kişi veya kuruluşlar arasında doğabilecek her türlü   ihtilaf durumunda doğrudan taraf olma hakkını saklı tutar. </p>
<p><strong>3. Bilişim Kaynaklarının Kullanımı İçin Genel İlkeler</strong></p>
Bilişim   kaynaklarının, eğitim, öğretim, araştırma-geliştirme, hizmet ve idari   faaliyetler ile ilişkili olan kullanımı esastır. Bu amaçlar dışında kalan tüm   kullanımlar ancak ve ancak yukarıda adı geçen amaçlarla yapılan kullanımı   kısıtlamadığı ve aşağıdaki kural ve ilkelere aykırı olmadığı sürece mümkündür:
<OL>
  <LI>Hacettepe Üniversitesi bilişim kaynakları, bu kaynakları kullananlar   tarafından boşa harcanmamalıdır. </LI>
  <LI>Hacettepe Üniversitesi bilişim kaynaklarını kullanıma sunan birimler, bu   kaynakların kullanımı ile ilgili sorumluluğu da üstlenmiş sayılırlar.   Kaynakların, birim veya bölüme bağlı bir kullanıcı tarafından kurallara uygun   olmayan şekilde kullanılması halinde ilgili birim veya bölüm yönetimi ile BİD   arasında işbirliği olanağı sağlanmalıdır. </LI>
  <LI>Kullanıcılar ağ üzerinden yolladıkları ve/veya aldıkları her türlü veri ile   HUNET''e bağlı bilgisayarlarının içindeki bilgilerinin gizliliğinden,   mahremiyetinden ve güvenliğinden kendileri sorumludur. Kullanıcı,   bilgisayarındaki verilerin önemine bağlı olarak oluşabilecek herhangi bir virüs   - korsan saldırısına ya da teknik kazalara karşı gerekli gördükçe yedekleme   yapmalıdır. </LI>
  <LI>Bölüm veya birimler, kendilerine verilen bilişim kaynaklarını adil olarak ve   üniversitenin diğer kullanıcılarının erişim haklarını engellemeyecek şekilde   kullanmakla sorumludurlar. Yönetim, bu konuda BİD ile işbirliği yapılmalı ve   BİD''nden aldıkları kullanım bilgilerini değerlendirerek, bu kurala aykırı bir   hareket görüyorsa çalışanlarını ya da öğrencilerini uyarmalıdır. </LI>
  <LI>Bölüm veya birimler, kullanıcıların yarattığı giriş ve çıkış trafiğinden   sorumludurlar. Bu konuda BİD''nden gelecek bilgileri ve uyarıları hızla   değerlendirip, aykırı ve istenmeyen trafiği yaratan kullanıcıya gerekli   yaptırımı en kısa zamanda yerine getirmelidirler. </LI>
  <LI>Kullanıcılar, çoğu zaman, bilgisayarlarında bulunan verilerin değerini   önemsemedikleri için gerekli önlemleri almamakta, virüs vb. zararlıların   bilgisayarlarında bulunmasından rahatsız olmamakta veya bunların varlığını   tespit etmek için bir gayret göstermeyebilmektedirler. Ancak bu durumun,   üniversitenin bilişim kaynaklarınının kullanımını da olumsuz derecede etkilediği   çoğu zaman unutulmakta ya da bilinmemektedir. Bölüm veya birim yönetimleri   kullanıcıları bu konuda da bilinçlendirmekle yükümlüdürler. </LI>
  <LI>BİD, güvenliği veya sistemin çalışmasını tehdit edebilecek bir problem   tespit ettiğinde, kişi ya da alt birimin kimliğinin tespiti için ilgili bölüm ya   da birim yönetimi ile hızlı ve sağlıklı bir işbirliği yapabilmeli; bu nedenle   bölüm veya birim yönetimleri, kullanıcıların bağlantıları, IP / MAC adresleri,   ağ erişim cihazı üzerinde hangi soketin hangi bilgisayara ulaştığı gibi   konularda dökümantasyon yapmalı ve bu bilgilerin güncelliğini korumalıdır.   Yönetimler tarafından mümkünse mutlaka yerel ağ yapısından sorumlu bir kişi   görevlendirilmeli ve bu kişiye gerektiği zaman hızla ulaşabilmesi için BİD''ne   gerekli erişim bilgileri verilmelidir. </LI>
  <LI>Birimler veya bölümler, BİD''nin binalarında kurup muhafaza sorumluluğunu   verdiği kablolama sistemi, ağ erişim cihazları ve diğer teçhizat üzerinde, gerek   yazılım gerekse donanım düzeyinde keyfi değişiklikler yapmamalı, bir gereksinim   olduğu takdirde, o birimin daha önceden belirlenip BİD''ne bildirilmiş teknik   sorumlusu tarafından BİD ile irtibata geçilmeli, gerekli değişiklik karşılıklı   bilgilendirme ve onay sonucunda yapılmalıdır. </LI>
  <LI>HUNET ağına bağlanan yerel bilişim kaynakları üzerinden paylaştırılan bilgi   ve dosyalar (bölüm sunucuları, bilgi paylaştırmak için kullanılan kişisel   bilgisayarlar, vs.) kesinlikle genel bilgi paylaşımı kurallarına aykırı   olmamalı, telif hakkı, yasallık, gizlilik, lisans koşulları vd. düzenlemelere   aykırı düşmemelidir. </LI>
  <LI>Hacettepe Üniversitesi bilişim kaynakları üniversite yönetiminin bilgisi ve   izni haricinde hiçbir surette ticari amaçla kullanılmamalı, ticari amaçla   çalışan kuruluşlar arasında haksız rekabete sebep olmamalı, ticari gelir   teminine olanak sağlamak için kullanılmamalıdır. Bu kaynaklar hiçbir surette   devredilemez, kiralanılamaz ve satılamaz. </LI>
  <LI>Hacettepe Üniversitesi''nin iç kullanımına ait hiçbir haber, duyuru, bilgi ve   belge, izin alınmadan HUNET aracılığı ile üçüncü şahıslara iletilmemeli veya   iletilecek ortam oluşturulmamalıdır. </LI>
  <LI>Hacettepe Üniversitesi Bilişim kaynaklarının kullanılması için kullanıcılara   verilmiş olan hiçbir şifre üçüncü şahıslara verilmemeli, üçüncü şahısların   üniversite bilişim kaynaklarına HUNET aracılığı ile erişimine olanak   sağlanmamalıdır. </LI>
  <LI>HUNET ve bağlı bilişim kaynakları hiçbir surette genel ahlaka aykırı   materyali barındırmak ve iletmek; Türkiye Cumhuriyeti yasalarına, bunlara bağlı   yönetmeliklere, Hacettepe Üniversitesi tarafından belirlenmiş kural ve ilkelere   aykırı faaliyetlerde bulunmak; siyasi propaganda yapmak amacıyla kesinlikle   kullanılmamalıdır. </LI>
  <LI>İstenmeyen bilgilerin paylaşımından önce "yasal sorumluluk sınırı   (disclaimer)" koymak yukarıdaki kurallar çiğnendiği zaman bir mazeret olarak   görülemez ve gösterilemez. </LI>
  <LI>Üniversitemiz internet hizmetini Türkiye Bilimsel ve Teknolojik Araştırma Kurumu''nun (TÜBİTAK) bir enstitüsü olan  Ulusal Akademik Ağ ve Bilgi Merkezi (ULAKBİM) tarafından işletilen Ulusal Akademik Ağ''dan (ULAKNET)  sağlamakta olup ULAKNET KULLANIM POLİTİKASI (UKP) ile belirlenen hükümlere tabiidir. <A href="https://ulakbim.tubitak.gov.tr/sites/images/Ulakbim/ukp-v2011.pdf" target="_blank">UKP için lütfen tıklayınız.</A> </LI>
</OL>
<p><strong>4. Uygulama Ve Yaptırımlar</strong></p>
Sunulan bilişim kaynaklarının genel ilkelere   aykırı biçimde kullanılması durumunda Hacettepe Üniversitesi makamları,   kullanımın yoğunluğuna, kaynaklara veya kişi / kurumlara verilen zararın   büyüklüğüne göre kullanıcıyı sözlü ve/veya yazılı olarak uyarma, ağ bağlantısını   süreli veya süresiz olarak kesme, kullanıcı hesabını dondurma, üniversite içi   idari soruşturmanın başlatılması için gerekli girişimlerde bulunma ya da Türkiye   Cumhuriyeti yasaları doğrultusunda adli mekanizmaları harekete geçirme   işlemlerinden bir ya da birkaçına başvurabilir. 
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 14);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'UKP için lütfen tıklayınız.', 'https://ulakbim.tubitak.gov.tr/sites/images/Ulakbim/ukp-v2011.pdf', 'PDF', 0 FROM sayfa WHERE slug = 'hunet_kurallar' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('hunet_protokol', 'tr', 'HUNET - BEYTEPE Yurt Erişim Protokolü', '<div class="icerik">

<p><STRONG>1. Sürekli açık  olan uygulamalar</STRONG><BR>
  ftpcc, hacettepetv, hacettepetv1, newscc, yunus,  yurt_portal, web-browsing, smtp, imap, pop3, ssl, ssh, dns, hotmail, yahoo-mail,  yahoo-webmessenger, msn-base, msn-webmessenger, facebook, facebook-chat,  facebook-mail, facebook-apps, facebook-base, facebook-social-plugin, gmail,  skype, naver-mail, unknown-tcp, twitter, twitter-base, twitter-posting,  google-talk-base, gtalk-voice, yahoo-file-transfer, yahoo-im-base, yahoo-voice,  jabber, oovoo, skype-probe, nntp, msn-video, msn-voice, rtcp, friendfeed,  ms-update, google-earth, google-translate, millenium-ils</p>
<p><STRONG>2. 00:00 ile 08:00  arasında açık olan uygulamalar</STRONG><BR>
  tftp, ftp, cftp, hotfile, rapidshare, sopcast, rss,  megaupload, badongo, bigupload, bonpoo, boxnet-base, boxnet-editing,  boxnet-uploading, depositfiles, divshare, docstoc, drop.io, dropbox,  easy-share, eatlime, esnips, filedropper, file-host, filer.cx, files.to,  fileserve, filesonic, filestube, fluxiom, foldershare, fs2you, gigaup,  ifile.it, jubii, leapfile, mediafire, mediamax, nakido-flag, naver-ndrive,  netload, okurin, omnidrive, openomy, sendspace, skydrive, steekr,  taku-file-bin, titanize, totoexpress, turboshare, wixi, xdrive, yourfilehost,  yousendit, adnstream, afreeca, brighttalk, channel4, dailymotion, flickrflumotion,  fotki, fotoweb, freeetv, google-video-base, google-video-enterprise, gyao,  itv-player, justin.tv, libero-video, megavideo, metacafe, mgoon, mogulus,  netflix, niconico-douga, ooyala, photobucket, pullbbang-video, rtmp, rtmpe,  rtmpt, sbs-netv, shutterfly, socialtv, stagevu, teachertube, tidaltv, tudou,  ustream, veetle, veohtv, yahoo-douga, youku, youtube-base, youtube-safety-mode,  youtube-uploading, bbc-iplayer, rtp, rtsp, flash, last.fm, photobucket, vimeo,  http-audio, http-video, all-slots-casino, battlefield2, bet365, blokus,  bomberclone, call-of-duty, doof, eve-online, evony, gamespy, garena, hangame,  knight-online, lineage, little-fighter, maplestory, nintendo-wfc,  paradise-paintball, party-poker, playstation-network, pogo, poker-stars,  regnum, second-life, source-engine, steam, subspace, tales-runner, unreal,  war-rock, we-dancing-online, wiiconnect24, wolfenstein, worldofwarcraft,  xbox-live, zango, warcraft, baidu-hi, baidu-hi-games, winamax, runescape, stun,  kerberos</p>
<p><STRONG>3.Hiçbir zaman açık  olmayan uygulamalar</STRONG><BR>
  proxy, p2p (KaZaA, iMesh, eDonkey2000, Gnutella, Napster,  Aimster, Madster, FastTrack, Audiogalaxy, MFTP, eMule, Overnet, NeoModus,  Direct Connect, Acquisition, BearShare, Gnucleus , GTK-Gnutella, LimeWire,  Mactella, Morpheus, Phex, Qtella, Shareaza, XoLoX, OpenNap, WinMX, DC++,  BitTorrent vs..) ve yukarıda yer almayan uygulamalar</p></div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 15);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('iletisim', 'tr', 'İletişim Bilgileri', '<div class="icerik">


<p>Hacettepe Üniversitesi<BR>
  Bilgi İşlem Daire Başkanlığı<BR>
  06800 Beytepe / ANKARA<BR>
  Tel: +90 312 297 62 00<BR>
  Faks: +90 312 299 20 88<BR>
  E-Posta: <A href="mailto:bidb@hacettepe.edu.tr">bidb@hacettepe.edu.tr</A><BR>
</p>
<p>Daire çalışanlarına ait iletişim bilgilerine <A href="/tr/personel">Personel</A> bağlantısından ulaşabilirsiniz.</p>
<p><STRONG><A id="kroki_harita" href="javascript:;">HÜ BİDB''ye ulaşım krokisi için tıklayınız.</A></STRONG></p>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 16);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('kablosuz', 'tr', 'Kablosuz Erişim Servisleri', '<div class="icerik">
<p>Sıhhiye ve Beytepe kampüslerinde YURTLAR BÖLGESİ ve KAMPÜS İÇERİSİNDE açık alanlarda kurulan  wifi sistemi Eduroam ve Hacettepe yayınları ile hizmet vermektedir.</p>
<p>Eduroam bağlantı ayarları ile ilgili güncellemeleri <a href="http://eduroam.hacettepe.edu.tr" target="_blank">http://eduroam.hacettepe.edu.tr</a> web sayfasından takip edebilirsiniz.</p>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 17);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('kk', 'tr', 'Kurul ve Komisyonlar', '<div class="icerik">
<p><b>Kalite Komisyonu</b></p>

<table class="table table-bordered">
  <tbody>
    <tr>
      <td>Mustafa Gökhan Güzel</td>
      <td>Daire Başkan V.</td>
      <td>Başkan</td>
    </tr>
    <tr>
      <td>Görkem Çoruh</td>
      <td>Daire Başkan Y.</td>
      <td>Üye</td>
    </tr>
    <tr>
      <td>Ahum Barbaros</td>
      <td>Programcı</td>
      <td>Üye</td>
    </tr>
    <tr>
      <td>Nazlı Özlem Onat</td>
      <td>Öğretim Görevlisi</td>
      <td>Üye</td>
    </tr>
    <tr>
      <td>Taha Baş</td>
      <td>Mühendis</td>
      <td>Üye</td>
    </tr>
    <tr>
      <td>Sezgi Çobanbaş</td>
      <td>Öğrenci</td>
      <td>Öğrenci Kalite Elçisi</td>
    </tr>
    <tr>
      <td>Melike Nur Erden</td>
      <td>Öğrenci</td>
      <td>Öğrenci Kalite Elçisi</td>
    </tr>
  </tbody>
</table>



</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 18);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('misyonvizyon', 'tr', 'Misyon ve Vizyon', '<div class="icerik">

    <p>Misyonumuz teknolojiyi yakından izleyerek üniversitemizin bilgi işlem  sistemini işletmek; eğitim, öğretim ve araştırmalara destek sağlamak,  üniversitemizin ihtiyaç duyacağı diğer bilgi işlem hizmetlerini eksiksiz olarak  yerine getirmektir. </p>
    <p> Vizyonumuz, Türkiye''deki üniversiteler arasında bilişim altyapısı, kullanıcı  memnuniyeti, düzenlenen etkinlikler, verilen servis kalitesi ve çeşitliliği  bakımından en üst sıraya yerleşmek; dünyanın saygın üniversitelerinin  bilgi-işlem merkezleri ile kıyaslanabilir kalite ve teknolojiye sahip  olabilmektir. </p>

</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 19);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('office365', 'tr', 'Office 365', '<div class="icerik">
<p><a href="/dosyalar/HU-Office_365_Hesap_Olusturma.pdf" target="_blank">MİCROSOFT OFFİCE 365 KULLANMA</a></p>



<p><a href="/dosyalar/HU-TeamsKurulumKilavuzu.pdf" target="_blank">MİCROSOFT TEAMS KURULUM KILAVUZU</a></p>
<p><a href="/dosyalar/HU-TeamsKullanimKilavuzu.pdf" target="_blank">MİCROSOFT TEAMS KULLANIM KILAVUZU</a></p>







</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 20);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'MİCROSOFT OFFİCE 365 KULLANMA', 'https://bidb.hacettepe.edu.tr/dosyalar/HU-Office_365_Hesap_Olusturma.pdf', 'PDF', 0 FROM sayfa WHERE slug = 'office365' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'MİCROSOFT TEAMS KURULUM KILAVUZU', 'https://bidb.hacettepe.edu.tr/dosyalar/HU-TeamsKurulumKilavuzu.pdf', 'PDF', 1 FROM sayfa WHERE slug = 'office365' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'MİCROSOFT TEAMS KULLANIM KILAVUZU', 'https://bidb.hacettepe.edu.tr/dosyalar/HU-TeamsKullanimKilavuzu.pdf', 'PDF', 2 FROM sayfa WHERE slug = 'office365' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('ogr_kural', 'tr', 'Yurt ve Öğrenci Evleri için Kurallar', '<div class="icerik">

<p>Hacettepe Üniversitesi Bilgi İşlem Dairesi üniversitede bulunan yurt ve özel   öğrenci evlerine de Internet hizmeti vermektedir. Öğrenciler kendi kişisel   bilgisayarlarını bu sisteme bağlayarak otomatik IP adresi almakta ve -sanal IP +   NAT üzerinden- Internet ve Intranet bağlantısı kurabilmektedirler. </p>
<p>Bu bölgelerde BİD''nin verdiği Internet hizmetinden yararlanırken aşağıdaki   kurallara uyulması gerekmektedir: </p>
<OL>
  <LI>Yurt odalarında öğrencilerin kişisel bilgisayarları için sağlanan Internet   ve Intranet bağlantısı, kullanıcı kodları vb. kaynaklar "<A href="/tr/bilisim_ilke">Hacettepe   Üniversitesi Bilişim Kaynakları Kullanım İlkeleri</A>" çerçevesinde   kullanılmalıdır. </LI>
  <LI>Üniversitenin bilgisayar ve ağ altyapısı akademik, idari, eğitim ve   araştırma amaçlarına hizmet etmek amacıyla kurulmuştur. Ağ üzerindeki kişisel   kullanımlar hiçbir zaman diğer kullanıcıların ağ erişim gereksinimlerini yerine   getirmelerine engel olmamalıdır. Bu nedenle uyulması gereken bazı kural ve   yasaklar getirilmiştir:
    <UL>
      <LI>Ağ kaynaklarının kişisel kazanç ve kar amacı ile kullanılması yasaktır. </LI>
      <LI>Ağ kaynakları kullanılarak, kitlesel e-postaların gönderilmesi (mail   bombing, spam) veya üçüncü şahısların göndermesine olanak sağlanması yasaktır. </LI>
      <LI>Yurt odalarında, servis veren (web hosting, e-posta, ftp servisi vb.) sunucu   nitelikli yazılımların çalıştırılması yasaktır. </LI>
      <LI>Üniversite ağ kaynaklarının üniversite dışından kullanılmasına sebep   olabilecek ya da üniversite dışındaki kişi ya da bilgisayarların kendilerini   üniversite içindeymiş gibi tanıtmalarını sağlayacak her tür faaliyet (proxy,   relay, IP sharer, NAT vb.) yasaktır. </LI>
      <LI>Ağ güvenliğini tehdit edici ya da ağ trafiğini gözlemleyici faaliyetlerde   bulunmak yasaktır. </LI>
      <LI>Yurt odasında, ağ sistemine bağlı bilgisayarı bulunan her öğrenci,   üniversite tarafından kendisine ayrılan Internet/Intranet bağlantısı, kullanıcı   hesapları vb. kaynakların kullanımından, güvenliğinden ve bu kaynakların   bilinçli ya da bilinçsiz olarak üçüncü kişilere kullandırılması durumunda ortaya   çıkabilecek yasaklanmış faaliyetlerden birinci derecede sorumludur. </LI>
    </UL>
  </LI>
  <LI>Yukarıda belirtilen kurallara uyulmadığının tesbiti durumunda ilgili kişiye   ağ bağlantısının kapatılması, kullanıcı hesaplarının dondurulması, üniversite   yönetmeliklerine göre yasal soruşturmanın başlatılması veya Türkiye Cumhuriyeti   yasalarına göre adli soruşturmanın başlatılması gibi işlemlerden biri ya da   birkaçı uygulanabilir. </LI>
  <LI>Kurallara uymadığı tesbit edilen öğrencilere ikamet ettiği birimin (yurt ya   da öğrenci evleri) yönetimi aracılığı ile bildirim yapılır. </LI>
</OL>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 21);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('organizasyonsemasi', 'tr', 'Organizasyon Şeması', '<div class="icerik">
<p align="center"><img src="/sayfa/tr/kurumsalsema180117.jpg" /></p>

</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 22);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('pc_salon', 'tr', 'PC Salonlarının Kullanım Kuralları', '<div class="icerik">


<p>Hacettepe Üniversitesi Bilgi İşlem Dairesi Sıhhiye Yerleşkesinde 75 adet ve Beytepe Yerleşkesinde 24 saat esasına göre hizmet veren 260 adet bilgisayardan oluşan bilgisayar salonlarını işletmektedir. Salonlar, özellikle yerleşkelerdeki öğrencilerin bilişim gereksinimlerini karşılamayı amaçlamaktadır. Salondaki tüm bilgisayarlar Internet bağlantılı olup gerekli olabileceği düşünülen ofis yazılımları ve yardımcı araçları da bulundurmaktadır. </p>
<p>Randevu kuralı uygulanan bu salonların işletiminden sorumlu bir yetkili de   sürekli olarak hazır bulunmaktadır. </p>
<p>Kaynakların adil ve optimium biçimde paylaşılabilmesi amacıyla bu salonların   kullanımında uyulması gereken kurallar aşağıda belirtilmiştir: </p>
<OL>
  <LI>Bilgisayar salonlarında bulunan bilgisayarları sadece Hacettepe Üniversitesi   öğrencileri kullanabilirler. Üniversite dışından kişilerin bilgisayar odalarına   girmeleri kesinlikle yasaktır. </LI>
  <LI>Bilgisayar giriş hakları öğrencilere belirli bir süreliğine verilir. Bu süre   bir eğitim döneminin tam katları şeklinde belirlenir. Kullanım süresi bitiminde,   iligili kullanıcıya ait tüm profil ve disk alanları silinecektir. </LI>
  <LI>Bilgisayarlara giriş için kullanılan kullanıcı ad ve şifreleri sadece o   şifreyi alan öğrencinin kullanımı içindir. Şifreyi alan öğrenci, bunun güvenlik   ve gizliliğinden bizzat sorumludur. Şifrenin bir başkası tarafından   kullanıldığının tespiti halinde şifrenin sahibi olan öğrenci sorumlu   tutulacaktır. </LI>
  <LI>Bir bilgisayar başında birden fazla kişinin oturması yasaktır. </LI>
  <LI>Bilgisayar odalarına yiyecek veya içecekle girmek kesinlikle yasaktır. </LI>
  <LI>Kullanıcılar, her ne amaçlı olursa olsun, üniversite içi veya dışına yönelik   herhangi bir bilgisayara hack/crack ve benzeri ataklarda bulunamaz, başkalarının   şifresini veya verilerini ele geçirmeye teşebbüs dahi edemez. </LI>
  <LI>Bilgisayar salonlarında kullanıcıları rahatsız edici hiçbir davranışta   bulunulamaz, gürültü yapılamaz, yüksek sesle konuşulamaz, bilgisayar kullanımı   dışında sohbet vs. amaçlarla bulunulamaz, cep telefonu ile konuşulamaz. </LI>
  <LI>Kullanıcıların, mevcut sistemi kendi istekleri doğrultusunda, izin verilen   sınırlar dışında kişiselleştirmeleri ve program yüklemeleri yasaktır. </LI>
  <LI>Sunulan donanım, yazılım ve Internet bağlantıları, sadece öğrencilerin   eğitim, öğretim ve iletişim gereksinimleri içindir. Bunlar dışında herhangi bir   amaçla kullanılamaz. </LI>
  <LI>Mevcut CD yazıcılar, sadece kişisel dosyaların yedeklenmesi için   kullanılacaktır. Bu amaç dışında her türlü izinsiz kopyalama yapmak yasaktır. </LI>
  <LI>Salonlardan sorumlu olan görevliler dışındaki kullanıcılar bilgisayarlar,   monitörler ve kesintisiz güç kaynakları üzerinden açma/kapama yapmayacaklardır.   Kullanıcıların sadece işleri bitince LOGOUT yapıp çıkmaları gerekmektedir.   LOGOUT yapmadan bilgisayar terk edilemez. </LI>
  <LI>Bilgisayarlar, hiç bir şekilde genel ahlak ve toplum kurallarına, yasalara   ve kişisel haklara aykırı amaçlar için kullanılamaz. </LI>
  <LI>Bilgisayar salonları 24 saat güvenlik kameraları ile izlenmekte ve   görüntüler kaydedilmektedir. Kullanıcıların salonları bu bilinçle kullanmaları   gerekmektedir. </LI>
  <LI>Öğrenciler, kendilerine ayrılmış disk alanlarında dosyalarını   saklayabilirler. Ancak, üniversitemiz, bu verilerin güvenliğinden ve   kalıcılığından sorumlu değildir. Kullanıcı, herhangi bir olağanüstü durum   dahilinde verilerin silinebileceği olasılığını göz önünde bulundurarak önemli   dosyalarını yedeklemelidir. </LI>
  <LI>Yukarıda belirtilen maddelerden herhangi birine aykırı hareket eden   kullanıcıların kullanım hakları süresiz olarak alınacak ve durumları bağlı   olduğu fakülte/bölüm/birim yönetimine yazılı olarak iletilecektir. </LI>
</OL>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 23);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('personel', 'tr', 'Personel', '<div class="icerik">
<table class="table table-borderless table-sm">
  <tr>
    <td colspan="2"><p><strong>Yönetim</strong></p></td>
  </tr>
  <tr>
    <td><p>Mustafa Gökhan Güzel</p></td>
    <td><p>Daire Başkanı</p></td>
  </tr>







 
  <tr>
    <td><p>Esin Alan</p></td>
    <td><p>Başkanlık Sekreteri</p></td>
  </tr>
</table>


<p><strong>İdari ve Mali İşler Birimi</strong><br />
Esin Alan*<br />
Ertan Güzelcan<br />
Süleyman Alaş<br>
Merve Ak

</p>
<p><strong>E-Posta Hizmetleri (297 62 62)</strong><br />
Aysun Ardıç*<br />
Emre Gökmen*</p>


<p><strong>Ağ Birimi (Beytepe)</strong><br />
Sadık Toklu*<br />
Erkan Türkyılmaz<br />
Hasan Türker Sözer<br />
Fatih Kekeç</p>

<p><strong>Ağ ve Sistem Birimi (Sıhhiye)</strong><br />
Cefakar İçel* <br />


</p>


<p><strong>Sistem Birimi (Beytepe)</strong><br />
Görkem Çoruh *<br>
Esma Özge Pöç<br>
Ramazan Öztürk<br>
Hüseyin Özyurt<br>
Ahmet Emin Baktır

</p>


<p><strong>Sistem Yazılımları Birimi</strong><br />
İsmail Hakkı Sönmez*
</p>


<p><strong>Yazılım Geliştirme Birimi</strong><br />

Fehime Aydın*<br>
Taha Baş<br>
Çağlar Ünal<br>

Hacer Doğan<br>
Ahum Barbaros<br>
Erencan Polat<br>
Özgür Özköse<br>
Abdulkadir Üçme<br>
Şeref Çambaşı<br>
Hasan Avcı<br>
Şahin Kaan Aytaç</p>



<p><strong>EBYS ve Bireysel İşlemler Birimi (Beytepe)</strong><br />
Sevgi İpek*<br />
Hilal Vural Sicim (e-imza)<br />

Özge Işıl Kulaksız<br />
Özge Taşcı</p>


<p><strong>EBYS ve Bireysel İşlemler Birimi (Sıhhiye)</strong><br />
Saliha Kübra Aydın*<br />
Ali Doğan<br />
Kaymak Yıldıztekin</p>


<p><strong>İnsan Kaynakları Birimi</strong><br />
Nazlı Özlem Onat*<br />
Sezai Yılmaz</p>


<p><strong>Kullanıcı Destek Birimi (Beytepe)</strong><br />
Kadir Akın Ayhan*<br />
Ahmet Serdar Öztürk<br />
</p>


<p><strong>Kullanıcı Destek Birimi (Sıhhiye)</strong><br />
Mehmet Karataş*<br />
Mevlüt Ediz<br />
Osman Çetin</p>


<p><strong>Web Birimi</strong><br />
İzgen Solak*<br />
Mehtap Sayılgan Toklu<br />
Gülten Özyurt</p>


<p><b>Sıhhiye Bilgisayar Laboratuvarı</b><br />
Kaymak Yıldıztekin*<br />


<p><b>Başkanlık İdari Destek Personeli</b><br />
Mustafa Kayhan<br />
Gülay Çitçi</p>
* Birim Sorumluları
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 24);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('posta_kural', 'tr', 'E-Posta Listeleri Kullanım Kuralları', '<div class="icerik">


<p><strong>"GENEL" Duyuru Listesi</strong></p>
Kullanıcıların sıklıkla kullandığı liste "GENEL   DUYURU LİSTESİ"dir.<BR>
"Genel" duyuru listesini kullanarak mesaj göndermek isteyen kullanıcılar, mesajlarını <A href="mailto:bhim@hacettepe.edu.tr">bhim@hacettepe.edu.tr</A> adresine göndermelidir. "Genel" duyuru  listeden e-posta   almak isteyen yeni kullanıcılar ise <A href="mailto:bhim@hacettepe.edu.tr">bhim@hacettepe.edu.tr</A> adresine Ad, Soyad ve   Bölüm bilgilerini göndererek kayıt yaptırmalıdırlar. Listenin yönetimi   Hacettepe Üniversitesi Basın ve Halkla İlişkiler Müdürlüğü tarafından   yapılmaktadır.
<p>Bu liste kontrollü (moderated) bir liste olup, sadece üniversite genelini   ilgilendiren duyuruların yapılmasında kullanılmaktadır. Binlerce üyesi olan bu   listeye gönderilen bir mesajın dahi o mesajın binlerce katı kadar trafik ve disk   alanını işgal ettiği düşünülürse, buraya e-posta göndermek isteyen   kullanıcılarımızın bazı kurallara dikkat etmeleri gerekmektedir: </p>
<p>  </p>
<UL>
  <LI><STRONG>Yapılacak duyuruların kapsamları şu konuların dışına çıkmamalıdır:</STRONG> Rektörlük duyuruları; Genel Sekreterlik duyuruları; Vefat, cenaze töreni ve kan   ihtiyacı duyuruları; Üniversite genelini ilgilendiren elektrik, su, ve Internet   gibi temel ihtiyaçlar hakkındaki duyurular; Basın ve Halkla İlişkiler ile SKS   Dairesi tarafından düzenlenen sosyal ve kültürel etkinlikler hakkında duyurular;   Akademik Birimler tarafından düzenlenen konferans, kongre ve sempozyum   duyuruları. </LI>
  <LI><STRONG>Yollancak mesajlar mümkün olduğunca düz yazı (plain text) olarak   hazırlanmalıdır. HTML formatlama yapmaktan özellikle kaçınılmalıdır (yazılara   renk, font şekilleri, arkaplan resimleri ya da renkleri, vb. biçimler   vermek).</STRONG> Üniversitemizde pek çok farklı bilgisayar ve e-posta okuyucu   programın olmasının yanısıra e-postalarına yurt dışından bambaşka ortamlarda   erişen kullanıcılarımız da mevcuttur. HTML vb. formatlamalar bazı   kullanıcılarımızın bu e-postaları hiç görüntüleyememesine bile neden   olabilmektedir. </LI>
  <LI><STRONG>Yollanacak mesajlar mümkün olduğunca e-posta programının içinde   yazılmalıdır. Microsoft Word dökümanı vb. ortamlarda yazıp e-postaya eklenti   yapılmasından kaçınılmalıdır.</STRONG> Burada hem yukarıdaki nedenler geçerlidir, hem   de eklentilerin virüs vb. içerikleri taşıma olasılığı bulunmaktadır. Ayrıca   eklentiler, düz yazının işgal ettiği yerin defalarca katı yer işgal etmekte ve   hem trafiği zorlamakta hem de kotaların gereksiz yere dolmasına neden   olmaktadırlar. </LI>
  <LI><STRONG>Mesajlara bir eklenti (resim, uzun pdf/word/ppt dökümanları vb.)   yapılması kesinlikle gerekiyorsa, bunun yerine ilgili eklenti dosyaları kişisel   ya da bulunulan kurumun Web alanlarına yerleştirilmeli; e-posta mesajında da   buralara kullanıcıların bağlanmasını sağlayacak linkler (örn.   http://yunus.hacettepe.edu.tr/~kullanici/belge.pdf) verilmelidir.</STRONG> Eklenecek   dosyaların uzunluğu kabaca 100-150 KB''nin altında kalıyorsa o zaman bu dosyalar   doğrudan doğruya e-posta''ya da eklenebilir. </LI>
  <LI><STRONG>Mesajlar eklentili dahi olsa eklentileri o an için açmaya uygun olmayan   kullanıcılar için boş bir e-posta yerine kısaca o mesajın ne ile ilgili olduğu,   kimin tarafından gönderildiği mesajın içine yazılmalıdır.</STRONG> </LI>
  <LI><STRONG>Mesajların konusu, mesajın içeriği hakkında doğru ve yeterli bilgi   verecek biçimde, ancak birkaç sözcüğü aşmayacak şekilde seçilmelidir.</STRONG> Örneğin, "Vefat duyurusu" yerine "XXX YYY''nin babasının vefat duyurusu" şeklinde   bir konu satırı daha bilgilendirici olacaktır. </LI>
  <LI><STRONG>Yollancak mesajlar reklam ve ticari menfaat içermemeli, genel toplumsal   kurallara ve yasalara aykırı olmamalıdır.</STRONG> </LI>
  <LI><STRONG>Bayram, yılbaşı vb. özel günler nedeniyle kutlama mesajları yollamak son   derece iyi niyetli ve nazik bir davranış olabilir; ancak bu tür mesajların çok   yoğun bir trafik yarattığı da unutulmamalıdır.</STRONG> Diğerinden örnek alan   kişilerin kendilerinin de bu tür mesajlar yollamak istemesiyle bir çığ etkisinin   de oluşabileceği göz önüne alınırsa, bu mesajları "GENEL" listesine yollamak   yerine kişisel adreslere yollamak tercih edilmelidir. </LI>
  <LI><STRONG>Yollanması planlanan mesajların iyi okunması, yollanmadan önce   eksiklerinin düzeltilmesi, -varsa- yapılacak eklentilerin uzunluklarının kontrol   edilmesi gereklidir.</STRONG> Eksik bilgi ile yollanan mesajların düzeltmeleri ile   birlikte tekrar tekrar yollanması trafiği ve kotaları olumsuz yönde   etkilemektedir. Mesajların sonunda genellikle yollayan kişinin adını, ünvanını   ve bulunduğu birimi yazmaması sık rastlanan unutkanlıklardandır. </LI>
</UL>
<p>Yukarıda özetlenen genel presipler sadece "GENEL" listesi için değil, benzeri   çok üyesi olan tüm tartışma ve duyuru listeleri için de geçerlidir. </p>
<p>Liste yönetimi, kullanıcılarımızın gönderdikleri mesajları yukarıdaki   kurallara uymadıkları takdirde reddetme hakkına sahiptir. Bu konuda daha fazla   bilgi almak için bhim@hacettepe.edu.tr e-posta adresine başvurulabilir. </p>
<p>Hacettepe Üniversitesi Bilgi İşlem Dairesi, kullanıcılarımıza yukarıda   sıralanan prensiplere uymakta gösterecekleri titizlik için teşekkür eder. </p>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 25);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('proxy', 'tr', 'Proxy Ayarları', '<div class="icerik">

<p><STRONG>Proxy hizmeti nedir?</STRONG></p>
<p> Proxy,  internet üzerindeki bir bilgisayar ile internete bağlı diğer bilgisayarlar  arasındaki iletişimi sağlayan yardımcı bir geçiş yolu sistemidir. Bir Proxy  sunucusu, sizden aldığı istekleri yürütür ve sonucu yine size iletir.</p>
<p><STRONG>Proxy  ne işe yarar?</STRONG></p>
<UL>
  <LI>Bir  Proxy servisi sizin adınıza bilgi alma isteklerini yürütür ve sonucu size yine  iletir. Bu bilgiler Proxy servisi üzerinde tutulur. Bir dahaki girişinizde  Proxy servisi bu bilgileri sunucu olarak size çok hızlı aktarır.</LI>
  <LI>Proxy  servisleri, uluslararası internet bağlantılarındaki yoğunluğu azaltmak,  erişimleri hızlandırmak ve ağı daha etkin kullanmak için kullanılır.</LI>
  <LI>Bağlanılan  yerleri kısıtlamak yada yasaklamak vb.</LI>
  <LI>Bunların  yanında ip değiştirme ile engellenen sitelere ulaşmak içinde kullanılmaktadır.</LI>
  <LI>Tüm  bunların yanında Proxy servisi gizlenmek için de kullanılmaktadır.</LI>
</UL>
<p><STRONG>Elektronik  kaynaklara kampus dışından erişim</STRONG></p>
<p>Sadece  Hacettepe Üniversitesi mensupları elektronik kaynaklara uzaktan erişim  sağlayabilirler. Bunun için bilgisayarlarına gerekli Proxy ayarlamalarını  yapmaları gerekir.</p>
<p><STRONG>Proxy Ayarları için aşağıdaki dokümanları kullanabilirsiniz</STRONG></p>
<UL>
<LI><A href="/dosyalar/proxy-pdf/edgeproxy_2023.pdf" target="_blank">Microsoft Edge Ayarları</A></LI>
  
  <LI><A href="/dosyalar/proxy-pdf/chromeproxy_2023.pdf" target="_blank">Chrome İçin Proxy Ayarları</A></LI>
<LI><A href="/dosyalar/proxy-pdf/macos_chrome_proxy_ayarlari2021.pdf" target="_blank">Macos Chrome Proxy Ayarları</A></LI>
  <LI><A href="/dosyalar/proxy-pdf/firefoxproxy_2023.pdf" target="_blank">Mozilla Firefox İçin Proxy Ayarları</A></LI>
  <LI><A href="/dosyalar/proxy-pdf/safari_proxy_ayarlari2021.pdf" target="_blank">Safari İçin Proxy Ayarları</A></LI>
 

  <LI><A href="/dosyalar/proxy-pdf/android_proxy_ayarlari2021.pdf" target="_blank">Android Wifi İçin Proxy Ayarları</LI>
  <LI><A href="/dosyalar/proxy-pdf/IOSWifiProxyAyarlariEkim2020.pdf" target="_blank">IOS Wifi İçin Proxy Ayarları</A></LI>
</UL>



</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 26);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Microsoft Edge Ayarları', 'https://bidb.hacettepe.edu.tr/dosyalar/proxy-pdf/edgeproxy_2023.pdf', 'PDF', 0 FROM sayfa WHERE slug = 'proxy' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Chrome İçin Proxy Ayarları', 'https://bidb.hacettepe.edu.tr/dosyalar/proxy-pdf/chromeproxy_2023.pdf', 'PDF', 1 FROM sayfa WHERE slug = 'proxy' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Macos Chrome Proxy Ayarları', 'https://bidb.hacettepe.edu.tr/dosyalar/proxy-pdf/macos_chrome_proxy_ayarlari2021.pdf', 'PDF', 2 FROM sayfa WHERE slug = 'proxy' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Mozilla Firefox İçin Proxy Ayarları', 'https://bidb.hacettepe.edu.tr/dosyalar/proxy-pdf/firefoxproxy_2023.pdf', 'PDF', 3 FROM sayfa WHERE slug = 'proxy' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Safari İçin Proxy Ayarları', 'https://bidb.hacettepe.edu.tr/dosyalar/proxy-pdf/safari_proxy_ayarlari2021.pdf', 'PDF', 4 FROM sayfa WHERE slug = 'proxy' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Android Wifi İçin Proxy Ayarları IOS Wifi İçin Proxy Ayarları', 'https://bidb.hacettepe.edu.tr/dosyalar/proxy-pdf/android_proxy_ayarlari2021.pdf', 'PDF', 5 FROM sayfa WHERE slug = 'proxy' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('sorumluluksiniri', 'tr', 'Sorumluluk Sınırı', '<div class="icerik">
<p align="justify">Bu site üçüncü sahıslar tarafından kontrol edilen İnternet sitelerine bağlantılar sağlamaktadır. Bu üçüncü şahıs sitelerindeki bilgiler, ürünler ve hizmetler ile kurumumuzun hiçbir şekilde herhangi bir menfaat bağlantısı söz konusu değildir. Yine ilgili üçüncü şahısların web sitelerinde yayınlayabileceği herhangi bir bilgi ve içerikle de bölümümüzün bir ilgisi ve kontrolü olamaz. Bu site ve üçüncü şahıs sitelerindeki bilgiler *olduğu gibi* sağlanmaktadır ve açık ya da dolaylı hiç bir garanti verilmemektedir.</p>
<p align="justify">Sitemizde verilen dahili bilgiler bir otomasyon sistemi üzerinden sağlanmakta ve içeriği sıklıkla güncellenmektedir. Yine de kurumumuz, bu sitedeki ya da üçüncü şahıs sitelerindeki malzemelerin kullanımı ya da kullanım sonuçları konusunda, doğruluk, kesinlik, zamanında olmaklık, güvenilirlik ya da başka açılardan hiç bir garanti vermez; her türlü teknik ve insani hataya karşı, burada verilen herhangi bir bilgi ile ilgili olarak site ziyaretçisinin görebileceği maddi ve manevi herhangi bir zarardan kurumumuz nezdinde özel veya tüzel bir kişinin sorumluğu bulunamaz. Ziyaretçi, verilen bilgilerin doğruluğunu sorgulamak ihtiyacı duyduğu takdirde başka kaynaklardan yararlanmak zorundadır.</p>
<p align="justify">Sitemizin ziyaretçisi, bu siteyi kullanmakla yukarıda belirtilen uyarıları anlamış ve doğabilecek tüm maddi ve manevi zararın tazminini de üstlenmiş kabul edilir.</p>

</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 27);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('sss', 'tr', 'Sık Sorulan Sorular', '<div class="icerik">

  
  


  
   <div class="container"> 
		<div class="panel-group" id="accordion">
<p style=''color:red;font-weight: bold;font-size: 20px;''>E-POSTA HİZMETİ</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">Üniversite mensubuyum elektronik posta hesabı nasıl alabilirim?</a>

        </p>

      </div>

    
      <div id="collapse1" class="panel-collapse collapse">

        <div class="panel-body"><a href="/tr/epostaalma">Detaylı bilgi için tıklayınız</a></div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Bölüm/ anabilim dalı / fakülte / sempozyum / kongre vb. için kullanılmak üzere elektronik posta hesabı nasıl alabilirim?</a>

        </p>

      </div>

    
      <div id="collapse2" class="panel-collapse collapse">

        <div class="panel-body">Hacettepe Üniversitesi bünyesinde, fakülte, enstitü, bölüm, birim, üniversite ile ilgili bir topluluk, proje grubu, organizasyon vb. bir oluşum için ayrı bir e-posta hesabı almak mümkündür. Bunun için bağlı bulunduğunuz makamın (dekan, bölüm başkanı, müdürlük, vb.) yönetiminden dairemize yazılı bir istekte bulunulması gerekmektedir. Kurumsal Elektronik Posta Talep Formu doldurularak yazıya eklenmelidir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">Adıma tanımlanan elektronik posta hesabını ne için kullanabilirim?</a>

        </p>

      </div>

    
      <div id="collapse3" class="panel-collapse collapse">

        <div class="panel-body">
<ol>
<li>İletişim için,</li>
<li>Kampüs içinde kablosuz ağlara bağlanmak için,</li>
<li>Kampüs dışından Kütüphane Kaynaklarına erişim için,</li>
<li>Yurt başvurusu yapmak için,</li>
<li>Yönetim Sistemlerine (Akademik ve İdari Personel) giriş işlemi için kullanabilirsiniz.</li>
</ol>
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">Elektronik posta hesabımın şifresini unuttum, nasıl alabilirim?</a>

        </p>

      </div>

    
      <div id="collapse4" class="panel-collapse collapse">

        <div class="panel-body">
<a href="portal.hacettepe.edu.tr" target="_blank">portal.hacettepe.edu.tr</a> adresinden "E-posta İşlemleri" menüsünden "Şifremi Unuttum" butonunu kullanarak geçici şifrenizi alabilirsiniz.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">Elektronik posta hesabımın kullanıcı adını unuttum nasıl öğrenebilirim? </a>

        </p>

      </div>

    
      <div id="collapse5" class="panel-collapse collapse">

        <div class="panel-body">Kullanıcı adınızı, Bilgi İşlem Daire Başkanlığı Portalından “Kullanıcı Adımı Unuttum” butonunu kullanarak öğrenmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse6">Elektronik posta hesabımın şifresini ne kadar kullanabilirim?</a>

        </p>

      </div>

    
      <div id="collapse6" class="panel-collapse collapse">

        <div class="panel-body">
Güvenlik nedeniyle tarafınıza tanımlanan şifreyi 180 gün kullanabilmektesiniz. Bu nedenle şifrenizin kullanıma kapanmaması için 180 gün de bir güncellemeniz gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse7">Elektronik posta hesabımın şifresini nasıl değiştirebilirim / güncelleyebilirim?</a>

        </p>

      </div>

    
      <div id="collapse7" class="panel-collapse collapse">

        <div class="panel-body">
Bilgi İşlem Daire Başkanlığı Portalından “Şifre Güncelleme” butonunu kullanarak şifrenizi güncellemeniz gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse8">Elektronik posta hesabımın şifresini değiştirirken nelere dikkat etmem gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse8" class="panel-collapse collapse">

        <div class="panel-body">
<ol>
<li>Seçeceğiniz parola en az 8, en fazla 15 karakter olmalıdır.</li>
<li>Seçeceğiniz parola içerisinde bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter (~!@#?$%^&()_- ) mutlaka olmalıdır.</li>
<li>Seçeceğiniz parola, teknik sınırlamalar nedeniyle (ı,İ,ğ,Ğ,ş,Ş,ü,Ü,ö,Ö,ç,Ç) harflerini içermemelidir.</li>
</ol>
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse9">Elektronik posta hesabımın kullanıcı adı ve şifresi ile BİLSİS kullanıcı adı ve şifrem aynı mıdır?</a>

        </p>

      </div>

    
      <div id="collapse9" class="panel-collapse collapse">

        <div class="panel-body">
Adınıza tanımlanan @hacettepe.edu.tr uzantılı elektronik posta hesabının kullanıcı adı ve şifresi BİLSİS şifrenizden farklıdır. Öğrenci Bilgi Sistemi (BİLSİS) için kullanıcı adı ve şifre Öğrenci İşleri Dairesi Başkanlığının Bilgi Sistemleri Müdürlüğü tarafından verilmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse10">Bilgi İşlem Daire Başkanlığı portal ekranından şifre alamıyorum, ne yapmam gerekir?</a>

        </p>

      </div>

    
      <div id="collapse10" class="panel-collapse collapse">

        <div class="panel-body">
Bilgi İşlem Daire Başkanlığı portal ekranından şifre alabilmeniz için daha önceden bilgi güncellemesi yapmış olmanız gerekmektedir. Şifrenizi unutmanız halinde veya şifrenizin bloke olması halinde bilgi güncellemesi yapamayacağınız için bu tür durumlarda Çağrı Merkezi ile iletişime geçerek "Bilgi Güncellemesi" yaptırmanız gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse11">Elektronik posta hesabımı mezun olduktan veya üniversiteden ayrıldıktan sonra kullanabiliyor muyum?</a>

        </p>

      </div>

    
      <div id="collapse11" class="panel-collapse collapse">

        <div class="panel-body">
Elektronik posta hesabınız, Mezun olmanız veya Üniversitemiz ile ilişiğinizin kesilmesi durumunda Elektronik Posta Yönergesi ile belirlenen süre içinde kullanıma kapatılmaktadır.
Mezun hesabı almak isteyen mezunlarımız, Bilgi İşlem Daire Başkanlığı Portalından "Yeni Hesap Açma (Mezun Hesabı)" butonunu kullanarak kurumsal elektronik posta hesabı alabilir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse12">Elektronik posta hesabından mail aktarımı nasıl yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse12" class="panel-collapse collapse">

        <div class="panel-body">
<a href="/tr/eposta_gecis" target="_blank"> https://bidb.hacettepe.edu.tr/tr/eposta_gecis </a> bağlantı adresindeki ilgili yönergeleri izleyerek hesabınızı posta istemcisine kurmanız gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse13">Elektronik posta hesabımın kapatılması için ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse13" class="panel-collapse collapse">

        <div class="panel-body">
Ana sayfamızda yer alan "Formlar" başlığı altında yer alan <A href="/dosyalar/BGYS-F-12e-PostaiptalFormu.docx">E-posta İptal Formu</A> nu doldurup imzaladıktan sonra Çağrı Merkezine iletmeniz gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse14">Elektronik posta hesabımın kullanıcı adını değiştirmek için (zorunlu sebepler dahilinde) ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse14" class="panel-collapse collapse">

        <div class="panel-body">
Adınıza tanımlanan hesabın kullanıcı adı değişikliği ancak hesap kapatılıp yeni hesap açılarak değiştirilebilmektedir. Bunun için kullanıcının “E-posta İptal Formu”nu doldurarak Çağrı Merkezine şahsen veya mail yoluyla başvurması gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse15">Haberleşme listesi oluşturmak mümkün müdür?</a>

        </p>

      </div>

    
      <div id="collapse15" class="panel-collapse collapse">

        <div class="panel-body">
Mümkün ancak istediğiniz adres ile ilgili bölümümüze resmi yazı ile başvurmanız gerekmektedir. 
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse16">Haberleşme listesine erişim ve kullanım nasıl yapılabilir?</a>

        </p>

      </div>

    
      <div id="collapse16" class="panel-collapse collapse">

        <div class="panel-body">
<a href="https://bidb.hacettepe.edu.tr/dosyalar/haberlesme101023.pdf" " target="_blank">haberlesme</a> linkine basarak dokümanı inceleyebilirsiniz.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse17">Yanlışlıkla maillerim silindi ne yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse17" class="panel-collapse collapse">

        <div class="panel-body">
<a href="https://bidb.hacettepe.edu.tr/dosyalar/e-postakurtarma101023.pdf" target="_blank">e-posta kurtarma</a> linkinden gerekli dokümana ulaşabilirsiniz.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse18">SUN-JAVA ara yüzünden hesabıma giriş yaptığımda inbox klasörüm görünmüyor neden?</a>

        </p>

      </div>

    
      <div id="collapse18" class="panel-collapse collapse">

        <div class="panel-body">
Kullanıcı adı ve şifrenizle ara yüze giriş yaptığınızda inbox klasörünüzü göremiyorsanız, hesabınız spam mail yaydığı için sistem tarafından otomatik olarak engellenmiştir. Böyle bir durumda <a href="portal.hacettepe.edu.tr">portal.hacettepe.edu.tr</a> adresinde  "E-posta İşlemleri" menüsünde yer alan "Proxy-Spam kontrol" butonunu kullanarak engeliniz kaldırmanız ve şifrenizi güvenlik nedeniyle değiştirmeniz gerekmektedir.
<br>Engeli kaldıramamanız halinde Çağrı Merkezi ile iletişime geçmeniz gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse19">Bulut depolama alanı için belirlenen kota nedir? Arttırmak için ne yapmalıyım?</a>

        </p>

      </div>

    
      <div id="collapse19" class="panel-collapse collapse">

        <div class="panel-body">Her kullanıcıya 1 TB Onedrive bulut alanı verilmektedir. Bu alan arttırılamamaktadır.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse20">Sistem(ler) üzerinde dışarıdan bağlantı yapmak ve sunuculara erişim için ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse20" class="panel-collapse collapse">

        <div class="panel-body">VPN bağlantısı yaparak kampüs dışından erişim sağlanabilmektedir. Bunun için dairemize yazılı bir istekte bulunulması gerekmektedir. VPN Bağlantı Talep Formu doldurularak yazıya eklenmelidir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>EBYS</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse21">Yeni Elektronik Belge Yönetim Sistemini (EBYS)</a>

        </p>

      </div>

    
      <div id="collapse21" class="panel-collapse collapse">

        <div class="panel-body">
Yeni EBYS kurulum, oturum açma, belge oluşturma, ıslak imzalı iş süreçleri, e-imza
kurulum ve kullanımı, yardım bilgileri, sorun yaşanınca başvurulacak sorumlulara ait
iletişim bilgileri için <a href="http://www.ebysbilgilendirme.hacettepe.edu.tr" target="_blank">http://www.ebysbilgilendirme.hacettepe.edu.tr</a> adresi
kullanılmalıdır.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>PROXY</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse22">Proxy hizmeti nedir?</a>

        </p>

      </div>

    
      <div id="collapse22" class="panel-collapse collapse">

        <div class="panel-body">
Proxy, internet üzerindeki bir bilgisayar ile internete bağlı diğer bilgisayarlar arasındaki iletişimi sağlayan yardımcı bir geçiş yolu sistemidir. Bir Proxy sunucusu, sizden aldığı istekleri yürütür ve sonucu yine size iletir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse23">Kütüphane kaynaklarına kampüs dışından nasıl erişim sağlayabilirim?</a>

        </p>

      </div>

    
      <div id="collapse23" class="panel-collapse collapse">

        <div class="panel-body">
Sadece Hacettepe Üniversitesi mensupları elektronik kaynaklara uzaktan erişim sağlayabilirler. Bunun için @hacettepe.edu.tr uzantılı elektronik posta hesabı almış olmanız ve cihazınıza gerekli Proxy ayarlarını yapmış olmanı gerekmektedir.
<br>Proxy Ayarları için <a href="/tr/proxy" target="_blank"> https://bidb.hacettepe.edu.tr/tr/proxy </a>adresini kullanabilirsiniz.


</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse24">Proxy ayarlarını eksiksiz yapmama ve kullanıcı adımı, şifremi doğru girmeme rağmen, sürekli olarak aynı ekran karşıma geliyor, ne yapmalıyım?</a>

        </p>

      </div>

    
      <div id="collapse24" class="panel-collapse collapse">

        <div class="panel-body">Proxy ayarlarını yapmanıza ve kullanıcı adı şifrenizi girmenize rağmen bağlantı kuramamanız, hesabınızın sistem tarafından otomatik olarak engellendiğini göstermektedir. Engelin kaldırabilmesi için Çağrı Merkezi ile iletişime geçmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>İNTERNET</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse25">Kampüs içinde kablosuz ağlara nasıl bağlanabilirim?</a>

        </p>

      </div>

    
      <div id="collapse25" class="panel-collapse collapse">

        <div class="panel-body">Üniversitemiz mensubu tüm akademik/idari personel ve öğrencilerimiz kampüslerimizde HACETTEPE ve EDUROAM ağlarına bağlanabilmektedir. Bunun için @hacettepe.edu.tr uzantılı elektronik posta hesabına sahip olmaları gerekmektedir.
HACETTEPE ağına bağlanabilmek için ara yüze kullanıcı adı ve şifrenin yazılması yeterlidir. 
EDUROAM ağına bağlanabilmek için <a href="https://eduroam.hacettepe.edu.tr/" target="_blank">https://eduroam.hacettepe.edu.tr</a> internet adresini ziyaret etmek gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse26">Kablosuz ağlara neden bağlanamıyorum?</a>

        </p>

      </div>

    
      <div id="collapse26" class="panel-collapse collapse">

        <div class="panel-body">
Aşağıdaki nedenlerden dolayı kablosuz ağlara bağlanamıyor olabilirsiniz. 
<ol>
<li>Şifrenizin süresi dolmuş olabilir.</li>
<li>Cihaz için yapılan ayarlar sıfırlanmış olabilir.</li>
<li>Cihazın sürümünün güncellenmesi gerekebilir.</li>
<li>Cihazın daha önce bağlanmış olduğu kablosuz ağların unutturulması gerekebilir.</li>
</ol>
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse27">Kablolu internete bağlanamıyorum ne yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse27" class="panel-collapse collapse">

        <div class="panel-body">Detaylı bilgi ve yardım için 0.312 297 62 62 telefon numarasından Çağrı Merkezi ile iletişime geçmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse28">İnternet prizi çekilmesi için ne yapa bilirim?</a>

        </p>

      </div>

    
      <div id="collapse28" class="panel-collapse collapse">

        <div class="panel-body">İnternet prizi çekilmesi işlemi için Yapı İşleri Dairesi Başkanlığı ile iletişime geçilmeli, işlem bittikten sonra Çağrı Merkezine hattın açılması için bilgi verilmesi gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse29">Network kablosu ihtiyacımızı nasıl karşılaya biliriz?</a>

        </p>

      </div>

    
      <div id="collapse29" class="panel-collapse collapse">

        <div class="panel-body">Sorun Bildirim Destek Sisteminden ne kadar kabloya ihtiyaç duyulduğu ile ilgili bilgi verilmesi halinde Network birimi tarafından yardımcı olunmaktadır.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>WEB SERVİSİ</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse30">Bölüm/ anabilim dalı / fakülte / sempozyum / kongre vb. için kullanılmak üzere web alanı nasıl alabilirim?</a>

        </p>

      </div>

    
      <div id="collapse30" class="panel-collapse collapse">

        <div class="panel-body">Hacettepe Üniversitesi bünyesinde, fakülte, enstitü, bölüm, birim, üniversite ile ilgili bir topluluk, proje grubu, organizasyon vb. bir oluşum için web alanı almak mümkündür. Bunun için bağlı bulunduğunuz makamın (dekan, bölüm başkanı, müdürlük, vb.) yönetiminden dairemize yazılı bir istekte bulunulması gerekmektedir. Web Kullanıcı Kodu Talep Formu doldurularak yazıya eklenmelidir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse31">Hacettepe Üniversitesi internet sayfasında yer alması istenilen bilgiler, yapılması gereken düzeltmeler ve eklentiler için ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse31" class="panel-collapse collapse">

        <div class="panel-body">Sitede yer alması istenilen bilgiler, yapılması gereken düzeltmeler ve eklentiler için <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a> adresine başvurulması gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse32">Kişisel web sayfası almak için ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse32" class="panel-collapse collapse">

        <div class="panel-body">Hacettepe Üniversitesi elektronik posta hesabı alan tüm Üniversite mensuplarımızın kişisel web alanları hesabı açtırdıkları zaman tanımlanmaktadır. Web sayfalarınızı oluşturan dosyalar kişisel web sayfanızı taşıyan sunucuda FTP ile açacağınız public_html klasörü içerisinde yer almaktadır. Giriş sayfanızın (açılış sayfanızın) ismi index (.html, .htm, .php... gibi) olmalıdır. Web sayfanızı herhangi bir tarayıcı yardımı ile http://yunus.hacettepe.edu.tr/~kullanıcıadı adresinden görüntülemeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse33">FTP yaparken sorun yaşıyorum sebebi ne olabilir?</a>

        </p>

      </div>

    
      <div id="collapse33" class="panel-collapse collapse">

        <div class="panel-body">Web sayfalarınızı oluşturan dosyalar kişisel web sayfanızı taşıyan sunucuda FTP ile açacağınız public_html klasörü içerisinde yer aldığından dolayı klasörünüz oluşturulmamış olabilir. 
<br>Şifrenizin süresi dolmuş olabilir.
<br>Hatalı kullanıcı yada şifre giriyor olabilirsiniz. Böyle bir durumda <a href="mailto:bidb@hacettepe.edu.tr">bidb@hacettepe.edu.tr</a> adresine mail göndermeniz veya Çağrı Merkezi ile iletişim kurmanız gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse34">MYSQL kullanabiliyor muyum, ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse34" class="panel-collapse collapse">

        <div class="panel-body">Tüm kullanıcılarımızın mysql kullanım hakkı bulunmaktadır. Mysql kullanmak isteyen kullanıcılarımız veri tabanını istemlerini <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a> e-posta yolu ile bildirmeleri gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse35">İçerik Yönetim Sistemi nedir? Kimler kullanabilir?</a>

        </p>

      </div>

    
      <div id="collapse35" class="panel-collapse collapse">

        <div class="panel-body">
HÜ-İYS, merkezi olarak web  sayfalarınızın içeriğini yönetebileceğiniz web tabanlı bir uygulamadır. Bu  uygulama ile web sitenize içerik girişi ve içerik düzenlemesi yapabilirsiniz.  Bu düzenlemeleri yaparken herhangi bir programa ihtiyaç duymadan tarayıcınız  üzerinden işlemlerinizi yapabilirsiniz.<br>
  HÜ-İYS aşağıdaki birimler tarafından  kullanılabilir.
<ul>
  <li>Fakülteler</li>
  <li>Bölümler</li>
  <li>Birimler</li>
  <li>Araştırma  Merkezleri</li>
  <li>Enstitüler</li>
  <li>Yüksek Okullar</li>
  <li>Meslek Yüksek  Okulları</li>
  <li>Öğrenci  Toplulukları</li>
  <li>Hacettepe  Üniversitesi Tarafından Düzenlenen Kongreler</li>
</ul>
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>E-İMZA</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse36">Elektronik imzaya nasıl başvurabilirim?</a>

        </p>

      </div>

    
      <div id="collapse36" class="panel-collapse collapse">

        <div class="panel-body">Elektronik imza ile ilgili her türlü  bilgi ve yardım için E-imza Kullanma Rehberini (<a href="https://bidb.hacettepe.edu.tr/eimza/basvuru.php">https://bidb.hacettepe.edu.tr/eimza/basvuru.php</a>) ziyaret etmeniz veya <a href="mailto:eimza@hacettepe.edu.tr">eimza@hacettepe.edu.tr</a> adresine mail göndermeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>HUYS</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse37">Yönetim Sistemlerine neden giriş yapamıyorum?</a>

        </p>

      </div>

    
      <div id="collapse37" class="panel-collapse collapse">

        <div class="panel-body">Üniversitemiz akademik ve idari personelin sisteme giriş yapabilmesi için @hacettepe.edu.tr uzantılı elektronik posta hesabının olması gerekmektedir. Tanımlanan hesabın kullanıcı adı ve şifresi ile giriş yapıldığı için şifrenizin aktif olması, kullanıcı adınızı yazarken @hacettepe.edu.tr uzantısını yazmamanız gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse38">Yönetim Sistemlerine giriş yapabiliyorum ama Bireysel İşlemlere tıkladığımda yetkiniz yok uyarısı alıyorum, ne yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse38" class="panel-collapse collapse">

        <div class="panel-body">Kullanıcı adı ve şifrenizle sorunsuz bir şekilde sisteme giriş yapabildiğiniz halde “Bireysel İşlemler”e tıklandığında “yetkiniz yok” uyarı alıyorsanız, hesabınız için gerekli rol tanımlanması yapılmamış olabilir. Sorunun giderilmesi için Başkanlığımızı arayarak biriminizden sorumlu kişi ile iletişime geçmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>UYGULAMA VE PROGRAMLAR</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse39">SPSS uygulamasını MAC bilgisayarımda kullanabilir miyim? </a>

        </p>

      </div>

    
      <div id="collapse39" class="panel-collapse collapse">

        <div class="panel-body">El Capitan sürümünden sonraki sürümlerde spss çalışmamaktadır. Tavsiyemiz kullanıcıların spss v23 için Windows 10 işletim sistemini kullanmalarıdır.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse40">Üniversitemiz eğitim amaçlı uygulamaları ücretsiz olarak sunmakta mıdır? </a>

        </p>

      </div>

    
      <div id="collapse40" class="panel-collapse collapse">

        <div class="panel-body">Evet üniversitemiz eğitim amaçlı olarak birçok uygulamayı sunmaktadır. Bu uygulamalara, yazilimdeposu.hacettepe.edu.tr adresinden ulaşabilirsiniz. Uygulamaları sorunsuz kullanabilmek için uygulamayı yazilimdeposu.hacettepe.edu.tr adresinden indiriniz. Sayfadaki kurulum dokümanlarını okuyup oradaki adımları takip ediniz. Aksi halde lisans sorunları yaşayabilirsiniz.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse41">Eset Endpoint uygulaması Lisans/Güncelleme uyarısı veriyor. Ne yapmalıyım?</a>

        </p>

      </div>

    
      <div id="collapse41" class="panel-collapse collapse">

        <div class="panel-body">Eset uygulamasını bilgisayarınızdan kaldırıp güncel uygulamayı yazilimdeposu.hacettepe.edu.tr den indirip bilgisayarınıza yükleyiniz. Uygulamayı bilgisayarınızdan kaldırırken Eset Management Agent’in de kaldırıldığından emin olunuz.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse42">Office365 uygulamalarını kullanmak için ne yapmalıyım?</a>

        </p>

      </div>

    
      <div id="collapse42" class="panel-collapse collapse">

        <div class="panel-body"><a href="/tr/office365" target="_blank">https://bidb.hacettepe.edu.tr/tr/office365</a> adresi üzerinden tüm detaylara ulaşabilirsiniz.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse43">Office365 uygulamasını kullanmaya çalıştığımda lisans uyarısı alıyorum. Ne yapmalıyım?</a>

        </p>

      </div>

    
      <div id="collapse43" class="panel-collapse collapse">

        <div class="panel-body">bidb@hacettepe.edu.tr eposta adresine durumu detaylı anlatır şekilde e-posta atınız. Sadece hacettepe uzantılı adresinizden attığınız e-postalara dönüş yapılacaktır.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse44">Bilgisayarımdaki office uygulamasına hacettepe hesabımla giriş yaptığımda lisans hatası alıyorum ne yapmalıyım?</a>

        </p>

      </div>

    
      <div id="collapse44" class="panel-collapse collapse">

        <div class="panel-body">Office uygulamasını hacettepe hesabınızla sorunsuz kullanabilmek için, office.com dan office365 uygulamasını bilgisayarınıza indirip, bu uygulamayı kullanmalısınız. Detaylı bilgi için aşağıdaki linkteki talimatları inceleyiniz.
<a href="/tr/office365" target="_blank"> https://bidb.hacettepe.edu.tr/tr/office365</a>
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	<p style=''color:red;font-weight: bold;font-size: 20px;''>DİĞER</p>
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse45">Windows/Office etkinleştirmesini (aktivasyonunu) yaparken hata alıyorum, ne yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse45" class="panel-collapse collapse">

        <div class="panel-body">Aldığınız hata kodunu Çağrı Merkezine bildirmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse46">Bilgisayarımda oluşan donanımsal arızalar için ne yapa bilirim?</a>

        </p>

      </div>

    
      <div id="collapse46" class="panel-collapse collapse">

        <div class="panel-body">Bilgi İşlem Daire Başkanlığı Sorun Bildirim Destek Sistemini (<a href="https://bidbdestek.hacettepe.edu.tr">https://bidbdestek.hacettepe.edu.tr</a>) kullanarak, barkodlu bilgisayarınız için destek almanız gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse47">Ağ yazıcısından çıktı alınamıyor, ne yapa bilirim?</a>

        </p>

      </div>

    
      <div id="collapse47" class="panel-collapse collapse">

        <div class="panel-body">Bilgi İşlem Daire Başkanlığı Sorun Bildirim Destek Sisteminden (<a href="https://bidbdestek.hacettepe.edu.tr">https://bidbdestek.hacettepe.edu.tr</a>) bildirimde bulunmanız gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse48">Yurt başvurusu nasıl yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse48" class="panel-collapse collapse">

        <div class="panel-body">Yurt başvuru işlemleri için Sağlık, Kültür ve Spor Daire Başkanlığının “Barınma Olanakları” sayfasının ziyaret edilmesi gerekmektedir. <a href="https://sksdb.hacettepe.edu.tr/bidbnew/category.php?id=3&title=barinma" target="_blank">https://sksdb.hacettepe.edu.tr/bidbnew/category.php?id=3&title=barinma</a></div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse49">E-Öğrenme platformuna (Blackboard Uzaktan Eğitim Sistemi) giriş yapmak için ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse49" class="panel-collapse collapse">

        <div class="panel-body">Ön Lisans ve Lisans öğrencileri<br>
<a href="https://hadi.hacettepe.edu.tr" target="_blank">https://hadi.hacettepe.edu.tr</a>
<br>
Yabancı Dil Hazırlık öğrencileri ve YDYO Kurs öğrencileri<br>
<a href="https://ydyohazirlik.hacettepe.edu.tr" target="_blank">https://ydyohazirlik.hacettepe.edu.tr</a>
<br>
Tıp Fakültesi öğrencileri,<br>
<a href="https://tipmoodle.hacettepe.edu.tr" target="_blank">https://tipmoodle.hacettepe.edu.tr</a>
<br>
Tezli ve Tezsiz Lisansüstü öğrencileri;<br>
<a href="https://lisansustu.hacettepe.edu.tr" target="_blank">https://lisansustu.hacettepe.edu.tr</a>
<br>
üzerinden giriş yapmaları gerekmektedir.<br>
Detaylı bilgi ve yardım için Uzaktan Eğitim Uygulama ve Araştırma Merkezi ile iletişime geçilmesi gerekmektedir.
</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse50">Hacettepe Üniversitesi kimlik kartımı nasıl alabilirim?</a>

        </p>

      </div>

    
      <div id="collapse50" class="panel-collapse collapse">

        <div class="panel-body">Sağlık, Kültür ve Spor Daire Başkanlığına APK birimine HÜ-KART için başvurmanız gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse51">Üniversite mensubuyum yazılım deposunu kullanabiliyor muyum?</a>

        </p>

      </div>

    
      <div id="collapse51" class="panel-collapse collapse">

        <div class="panel-body">Hacettepe Üniversitesi elektronik posta hesabı alan tüm Üniversite mensuplarımız yazılım deposunu kullanabilmektedir. Ücretsiz olarak lisanslı yazılımlara erişim sağlayabilmektedirler.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse52">Yazılım deposuna nasıl giriş yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse52" class="panel-collapse collapse">

        <div class="panel-body">Hacettepe Üniversitesi elektronik posta hesabınızın kullanıcı adı ve şifresi ile @hacettepe.edu.tr uzantısı olmadan giriş yapmanız gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse53">BİLSİS sistemine giriş yapamıyorum, ne yapmam gerekir?</a>

        </p>

      </div>

    
      <div id="collapse53" class="panel-collapse collapse">

        <div class="panel-body">0.312 297 65 70 (5 Hat) Beytepe / 0.312 305 21 41 Sıhhiye telefon numaralarından veya hureg@hacettepe.edu.tr e-posta adresinden Öğrenci İşleri Dairesi Başkanlığı Bilgi Sistemleri Müdürlüğü ile iletişime geçmeniz gerekmektedir.
<br>BİLSİS şifresi kayıtlı e-postama gelmiyor, ne yapabilirim?
<br>0.312 297 65 70 (5 Hat) Beytepe / 0.312 305 21 41 Sıhhiye telefon numaralarından veya hureg@hacettepe.edu.tr e-posta adresinden Öğrenci İşleri Dairesi Başkanlığı Bilgi Sistemleri Müdürlüğü ile iletişime geçmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse54">Transcript/diploma nerden alabilirim?</a>

        </p>

      </div>

    
      <div id="collapse54" class="panel-collapse collapse">

        <div class="panel-body">0.312 297 65 70 (5 Hat) Beytepe / 0.312 305 21 41 Sıhhiye telefon numaralarından veya hureg@hacettepe.edu.tr e-posta adresinden Öğrenci İşleri Dairesi Başkanlığı Bilgi Sistemleri Müdürlüğü ile iletişime geçmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse55">AVESİS, BAPSİS, DAPSİS  sistemine giriş yaparken sorun yaşıyorum, ne yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse55" class="panel-collapse collapse">

        <div class="panel-body">Giriş yetkilerinin kontrol edilebilmesi için kullanıcının @hacettepe.edu.tr uzantılı kurumsal elektronik posta adresinden bidb@hacettepe.edu.tr adresine mail göndermesi gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse56">NUCLEUS sistemine girişte sorun yaşıyorum, ne yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse56" class="panel-collapse collapse">

        <div class="panel-body">Her türlü bilgi ve yardım için 0.312 305 12 78-80 / 0.312 305 41 56 telefon numaralarını aramanız gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse57">Enstitünün sistemine (prens.hacettepe.edu.tr) giriş yaparken sorun yaşıyorum, ne yapabilirim?</a>

        </p>

      </div>

    
      <div id="collapse57" class="panel-collapse collapse">

        <div class="panel-body">Bağlı bulunduğunuz enstitü ile iletişime geçmeniz gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse58">Genel duyuruları almak/almamak için ne yapmam gerekiyor?</a>

        </p>

      </div>

    
      <div id="collapse58" class="panel-collapse collapse">

        <div class="panel-body">Gruba eklenme taleplerinizi bhim@hacettepe.edu.tr e-posta adresinden Basın ve Halkla İlişkiler Müdürlüğüne bildirmeniz gerekmektedir. Ancak tüm kampüsü bilgilendirmek amaçlı e-postalar gönderildiği için gruptan ayrılamazsınız. E-postanın tarafınıza ulaşmasını istemiyorsanız; arayüz üzerinden gereksiz posta kutunuza gitmesini sağlayabilirsiniz.<a href="https://bidb.hacettepe.edu.tr/dosyalar/istenmeyenposta101023.pdf" " target="_blank">istenmeyen_e-posta</a> linkinden nasıl yapacağınız bilgisine ulaşabilirsiniz.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	<div class="panel panel-default">

      <div class="panel-heading">

        <p class="panel-title">

          <a data-toggle="collapse" data-parent="#accordion" href="#collapse59">Hastane tahlil sonuçlarına ulaşamıyorum ne yapa bilirim?</a>

        </p>

      </div>

    
      <div id="collapse59" class="panel-collapse collapse">

        <div class="panel-body">Detaylı bilgi ve yardım için 0.312 305 12 78-80 telefon numarasını aramanız gerekmektedir.</div>

		<p>&nbsp;</p>
      </div>

    </div>

	
	</div>
</div>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 28);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'E-posta İptal Formu', 'https://bidb.hacettepe.edu.tr/dosyalar/BGYS-F-12e-PostaiptalFormu.docx', 'DOCX', 0 FROM sayfa WHERE slug = 'sss' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'haberlesme', 'https://bidb.hacettepe.edu.tr/dosyalar/haberlesme101023.pdf', 'PDF', 1 FROM sayfa WHERE slug = 'sss' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'e-posta kurtarma', 'https://bidb.hacettepe.edu.tr/dosyalar/e-postakurtarma101023.pdf', 'PDF', 2 FROM sayfa WHERE slug = 'sss' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'istenmeyen_e-posta', 'https://bidb.hacettepe.edu.tr/dosyalar/istenmeyenposta101023.pdf', 'PDF', 3 FROM sayfa WHERE slug = 'sss' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('tarama', 'tr', 'E-Posta Tarama Politikaları', '<div class="icerik">

<p>Güncelleme Aşamasındadır.</p>







</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 29);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('webser', 'tr', 'WEB Servisleri', '<div class="icerik">
<p><STRONG>Hacettepe Üniversitesi Ana Web Sitesi</STRONG><BR>
  Hacettepe Üniversitesi''nin   ana Web sitesi <A href="http://www.hacettepe.edu.tr/" target="_new">www.hacettepe.edu.tr</A> adresinden Bilgi İşlem Dairesi sorumludur.   Daire bünyesinde faaliyet gösteren Web Birimi, bu sitenin tasarım ve   güncellemesini yapmaktadır. Sitede yer alması istenilen bilgiler, yapılması   gereken düzeltmeler ve eklentiler için <A href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</A> adresine   başvurulabilir. </p>
<UL>
  <LI><A href="/tr/servis">Birimler Web Sayfaları için Web   Servisi</A> </LI>
  
  <LI><A href="/tr/kisisel">Kişisel Web Sayfaları için Web   Servisi</A> </LI>
  
  
</UL>
<p>Lütfen <A href="https://www.btk.gov.tr/kanunlar" target="_blank" >bilişim ile ilgili yasal düzenlemeler</A> sayfasından Kamu Kurumları İnternet Sitesi Kılavuzu ile İlgili 2007/4 Sayılı Başbakanlık Genelgesi inceleyiniz. </p>


</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 30);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('yayim', 'tr', 'WEB Sayfası Yayım İlkeleri', '<div class="icerik">

<p>Hacettepe Üniversitesi Birim ve Kişisel Web sayfalarının hazırlanması ve   yayımlanması ilkelerini kapsayan yönerge 02.07.2007 tarihinde Hacettepe   Üniversitesi Senatosu''nca onaylanmıştır.</p>
<p>Hacettepe Üniversitesi''ne bağlı tüm kurum, birim, bölüm ve kişilerin Web   sayfalarını hazırlarken bu ilkelere uyması gerekmektedir.</p>
<p>Bu ilkelerin tümüne aşağıdaki link''e tıklayarak erişebilirsiniz: <BR>
    <BR>
  <A href="/dosyalar/web_sayfasi_ilkeleri.pdf">Hacettepe Üniversitesi Web Sayfası   Hazırlama ve Yayım İlkeleri</A> (*.pdf formatındadır.) </p>
  
  <p><a href="https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5651&MevzuatTur=1&MevzuatTertip=5" target="_blank">5651 sayılı Kanun İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun</a></p>
  <p><a  href="https://www.btk.gov.tr/kanunlar" target="_blank">Bilişim ile ilgili diğer Yasal Düzenlemeler</a></p>
  
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 31);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Hacettepe Üniversitesi Web Sayfası Hazırlama ve Yayım İlkeleri', 'https://bidb.hacettepe.edu.tr/dosyalar/web_sayfasi_ilkeleri.pdf', 'PDF', 0 FROM sayfa WHERE slug = 'yayim' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('yazilim', 'tr', 'Lisanslı Yazılım Sunucusu', '<div class="icerik">

<p align="justify"><STRONG>HACETTEPE ÜNİVERSİTESİ YAZILIM SUNUCUSU</STRONG><BR>
    <BR>
  Hacettepe Üniversitesi Yazılım Deposu Sistemi, üniversite çalışanlarının ve  öğrencilerinin kullanımı için temin edilmiş olan yazılım paketlerinin ve  lisansların Internet üzerinden dağıtılması amacıyla 2006 yılında kurulmuştur. <BR>
  <BR>
  Sistem, hem personelimizin hem de öğrencilerimizin de yararlanması için  tasarlanmıştır. Tüm lisanslı yazılımlar üniversite personeline açık olup, bazı  lisanslı yazılımlar öğrencilerin erişimine ve kullanımına sunulmuştur.  Sunucumuzda en kullanışlı ve popüler ücretsiz yazılımlar da mevcuttur.<BR>
  <BR>
  Lisanslı yazılımlar, getirdikleri tüm yasal avantajların yanında,  güncellenebilirlikleri ve üretici firma desteği sayesinde virüs ve korsanların  bilgisayarlara girmesini zorlaştırmakta ve daha güvenli bir kullanım  sağlamaktadır.<BR>
  <BR>
  Lisanslı yazılımlar ve varsa lisans anahtarları sadece Hacettepe Üniversitesi  mensupları tarafından kullanılabilir. Üniversite dışında üçüncü şahıslara  doğrudan veya dolaylı olarak kullandırılamaz. Benzer bir durumun tespitinde  ilgili kullanıcı sorumlu tutulacaktır. Buradaki lisanslı yazılımları indiren  kullanıcılarımız bu şartları kabul etmiş sayılırlar. Öğrencilerimize sunulan  lisanslı bazı yazılımlar için de bu durum geçerlidir. <BR>
  <BR>
  Yazılımlarla ilgili olarak kullanıcılarımıza yardımcı olacak tüm bilgiler ve  kılavuzlar sunucumuzda mevcuttur. Bu bilgilerin dikkatle okunması ve varsa  kılavuzlara göre kurulumların yapılması önem arz etmektedir. Yazılım Deposu üst  menüde bulunan "<STRONG>YARDIM</STRONG>" sayfasındaki bilgilerin de okunması  önerilmektedir.<BR>
  <BR>
  Sadece yazılım deposunda yer alan yazılımlara destek verebilmekteyiz. Yazılım  deposunda yer almayan işletim sistemleri (Ev sürümleri gibi) ve  diğer  yazılımlarla ilgili olarak bir hizmetimiz bulunmamaktadır.<BR>
  <BR>
  Hacettepe Üniversitesi Lisanslı Yazılım Sunucusuna bağlanmak için:<BR>
  <A href="http://yazilimdeposu.hacettepe.edu.tr/">yazilimdeposu.hacettepe.edu.tr</A><BR>
  <BR>
  Bu servis ile ilgili her türlü sorun, görüş ve önerilerinizi <A href="mailto:yazilimdeposu@hacettepe.edu.tr">yazilimdeposu@hacettepe.edu.tr</A> adresine gönderebilirsiniz.</p>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 32);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('yonetim', 'tr', 'Yönetim', '<div class="icerik">

    <table class="table table-borderless">
  

<tr>
    <td>Mustafa Gökhan GÜZEL</td>
    <td>Daire Başkanı</td>
    <td><a href="mailto:gokhan@hacettepe.edu.tr">gokhan{at}hacettepe.edu.tr</a></td>
  </tr>





  
 
  <tr>
    <td>Esin ALAN</td>
    <td>Başkanlık Sekreteri</td>
    <td><a href="mailto:esin.alan@hacettepe.edu.tr">esin.alan{at}hacettepe.edu.tr</a></td>
  </tr>
</table>
</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 33);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('anasayfa', 'tr', 'Haber ve Duyurular', '<div id="ana-icerik">
            
<div class="container genel">
    <div class="row no-gutters">
        <div class="col-md-12 col-sm-12">
            <div class="row no-gutters kisayollar"><div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/eposta.png);"><a href="/tr/eposta">E-Posta<br />İşlemleri</a></div></div>
<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(/images/icon_exchange2.jpg);"><a href="/tr/e-posta">E-Posta<br />Giriş</a></div></div>


<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/office365.png);"><a href="/tr/office365">Office 365</a></div></div>

<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/portal.png);"><a href="https://portal.hacettepe.edu.tr/" target="_blank">HÜ BİDB<br />Portalı</a></div></div>

<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/ebys.png);"><a href="http://ebysbilgilendirme.hacettepe.edu.tr/" target="_blank">EBYS<br />Bilgilendirme</a></div></div>

<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/eimza.png);"><a href="https://bidb.hacettepe.edu.tr/eimza/" target="_blank">E-İmza & Mobil İmza</a></div></div>




<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/proxy.png);"><a href="/tr/proxy">Proxy Ayarları<br /> ve Kurulumu</a></div></div>
<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/yardim.png);"><a href="https://bidbdestek.hacettepe.edu.tr" target="_blank">Sorun Bildirim ve Destek Hizmetleri</a></div></div>
<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/sss.png);"><a href="/tr/sss">Sık Sorulan Sorular</a></div></div>

<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/form.png);"><a href="/tr/formlar">Formlar</a></div></div>
<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/bilgidokuman.png);"><a href="/tr/bilgidokuman">Bilgi ve<br />Dokümanlar</a></div></div>

<div class="col-md-2 col-4"><div class="kisayol" style="background-image: url(images/icon/yazilimdeposu.png);"><a href="https://yazilimdeposu.hacettepe.edu.tr/" target="_blank">Yazılım<br />Deposu</a></div></div>




</div>
        </div>
        <div class="col-md-12 col-sm-12 duyurular_ana"><h1>Haber ve Duyurular</h1>
<div id="ana-icerik" class="duyurular_liste">

<p><a href="/dosyalar/onedriveduyuru230626.pdf" target="_blank">Microsoft OneDrive Depolama Kotaları Hakkında Bilgilendirme</a> (23.06.2026)</p>
<p><a href="/dosyalar/365A1plus_020626.pdf" target="_blank">Microsoft 365 Lisanslama ve Kullanım Değişikliği Hakkında</a> (02.06.2026)</p>
<p><a href="/dosyalar/sozlesmeilan240426.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Değerlendirme Sonucu</a> (24.04.2026)</p>
<p><a href="/dosyalar/EK_5_sozlu_sinava_girmeye_hak_kazananlarin_ilani_090426.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri</a> (09.04.2026)</p>
<p><a href="/dosyalar/EK_3_yazili_sinava_girmeye_hak_kazananlarin_ilani_310326.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi</a> (31.03.2026)</p>
<p>İŞKUR Gençlik Programı kapsamında Asil olarak kazanan adaylarımızın başvuruları 26.10.2025 tarihi saat: 24.00’a kadar uzatılmıştır. Belirtilen tarih ve saatten sonra yapılan başvurular dikkate alınmayacaktır. Yedek adaylarımız için daha sonra iletişime geçilecektir. (24.10.2025)</p>

<p><b>İŞKUR Gençlik Programı kapsamında asil olarak kazanan adaylarımızın dikkatine</b><br>
Değerli Öğrencilerimiz,<br>
İŞKUR Gençlik Programı kapsamında asil olarak kazanan adaylarımızın başvuruları 23.10.2025 tarihinde başlayacak olup, 24.10.2025 mesai bitimine kadar alınacaktır.<br>
Belirtilen tarih ve saatten sonra yapılan başvurular dikkate alınmayacaktır.<br>
Başvurularınızı <a href="https://iskur.hacettepe.edu.tr" target="_blank">iskur.hacettepe.edu.tr</a> adresi üzerinden yapabilirsiniz.<br>
Tüm öğrencilerimize önemle duyurulur (23.10.2025)</p>




<p><a href="/dosyalar/iskur_kuracekimi_151025.pdf" target="_blank">İŞKUR Gençlik Programı Noter Kurası Çekilişi</a> (15.10.2025)</p>
<p><a href="https://pdb.hacettepe.edu.tr/duyuru/iskur_131025.pdf" target="_blank">2025-2026 Eğitim Öğretim Dönemi İŞKUR Gençlik Programı</a> (14.10.2025)</p>

<p><a href="/dosyalar/sozlesme_hak_kazananlarin_ilani290525.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı Değerlendirme Sonucu</a> (29.05.2025)</p>

<p><a href="/dosyalar/Sozlu_sinava_girmeye_hak_kazananlarin_ilani_232025.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri</a> (23.05.2025)</p>

<p><a href="/dosyalar/yazili_sinava_girmeye_hak_kazananlarin_ilani130525.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi</a> (13.05.25)</p>

<p><a href="/tr/ilan_280425">Sözleşmeli Bilişim Personeli Alımı</a> (28.04.25)</p>
<p><a href="/tr/duy_iskur280225">İŞKUR Gençlik Programı, İş Sağlığı ve Güvenliği Eğitimi</a> (28.02.25)</p>
<p><a href="https://www.hacettepe.edu.tr/duyuru/rekduy/iskur240225.pdf" target="_blank">İŞKUR Gençlik Programı Asıl  Olarak Hak Kazanan Öğrencilerimiz</a> (24.02.25)</p>
<p><a href="/dosyalar/sonuc200225.pdf" target="_blank">İŞKUR Gençlik Programı  Çerçevesinde 19.02.2025 Tarihinde Yapılan Noter Çekilişi</a> (20.02.25)</p>
<p><a href="/dosyalar/iskurduyuru170225.pdf" target="_blank"> İşkur Gençlik Programı</a> (17.02.25)</p>
<p><a href="/tr/VPN">VPN sistemi ile ilgili Bilgilendirme ve Bağlantı Kılavuzları</a> (27.09.24)</p>
<p><a href="/dosyalar/prsalimsonuc221223.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı Değerlendirme Sonucu (22.12.23)</a></p>
<p><a href="/dosyalar/SinavSonucuYazili181223.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri (18.12.23)</a></p>

<p><a href="/dosyalar/Sinav_web_141223.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi (11.12.23)</a></p>

<p>Kişisel web sayfalarını  taşıyan sunucuda (yunus.hacettepe.edu.tr)  yapılan güncelleme çalışmaları nedeniyle kişisel web sayfaları 21.07.2023 tarihine kadar görüntülenebilecek fakat  web sayfaları içeriklerinde değişiklik yapılamayacaktır. (19.07.23)</p>

<p><a href="/dosyalar/SozlesmeYapmayaHakKazananlar_200623.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı Sınav Sonuçları</a> (20.06.23)</p>
<p><a href="/dosyalar/sinavsonuc160623.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri (16.06.23)</a></p>

	<p><a href="/dosyalar/sozlesmeli_personel_140623.pdf" target="_blank">Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi (14.06.23)</a></p>

<p><a href="/dosyalar/bilisimduyuru300523.pdf" target="_blank">Sözleşmeli Bilişim Personeli Duyurusu</a> (30.05.23)</p>
<p><a href="/tr/mezuneposta">Mezun E-posta Hesabı Hakkında</a> (20.03.23)</p>







<p>Hacettepe Üniversitesi resmi web sitesinde yayınlanması istenilen duyuru ve görseller Basın ve Halkla İlişkiler Müdürlüğü''nün bhim@hacettepe.edu.tr e-posta adresine gönderilmesi gerekmektedir.</p>

</div>
<div class="duyurular_tum"><a href="/tr/arsiv">DUYURU ARŞİVİ</a></div></div>
    </div>

</div>


<link rel="stylesheet" href="/css/owl.carousel.min.css">
<link rel="stylesheet" href="/css/owl.theme.default.min.css">


<div class="container servisler mt-4">
    <h1>Servisler ve Uygulamalar</h1>
    <div class="servisler_liste">
        <div class="owl-carousel owl-theme">
		

            <div class="item servis">
                <a href="/tr/webser">
                    <img src="images/hizmet1.png" alt="Web Servisleri" /><br />
                    Web Servisleri
                </a>
            </div>
            <div class="item servis">
                <a href="http://hu-iys.hacettepe.edu.tr/" target="_blank">
                    <img src="images/hizmet2.png" alt="HÜ-İYS İçerik Yönetim Sistemi" /><br />
                    HÜ İçerik Yönetim Sistemi
                </a>
            </div>
			<div class="item servis">
                <a href="http://egitimmezun.hacettepe.edu.tr/" target="_blank">
                    <img src="images/hizmet_mezunbilgi.jpg" alt="Eğitim Fakültesi Mezun Bilgi Sistemi" /><br />
                    Eğitim Fakültesi Mezun Bilgi Sistemi
                </a>
            </div>
           
            <div class="item servis">
                <a href="https://ozelyeteneksinavi.hacettepe.edu.tr/giris/" target="_blank">
                    <img src="images/servis_gsf.png" alt="GSF Başvuru Sistemi" /><br />
                    GSF Başvuru Sistemi
                </a>
            </div>

          <div class="item servis">
                <a href="https://kriter.hacettepe.edu.tr" target="_blank">
                    <img src="images/servis_akademik.png" alt="Akademik  Ön Değerlendirme Başvuru sistemi" /><br />
                    Akademik  Ön Değerlendirme Başvuru Sistemi
                </a>
            </div>

           <div class="item servis">
                <a href="http://guvenlik.hacettepe.edu.tr/sticker/" target="_blank">
                    <img src="images/servis_sticker.png" alt="Sticker Başvurusu" /><br />
                    Sticker Başvurusu
                </a>
            </div>

           <div class="item servis">
                <a href="https://portal.hacettepe.edu.tr/" target="_blank">
                    <img src="images/servis_portal.png" alt="Bilgi İşlem Daire Başkanlığı Portal" /><br />
                   Portal
                </a>
            </div>




        </div>
    </div>

</div>





		</div>', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı', '', '', 34);
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Microsoft OneDrive Depolama Kotaları Hakkında Bilgilendirme', 'https://bidb.hacettepe.edu.tr/dosyalar/onedriveduyuru230626.pdf', 'PDF', 0 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Microsoft 365 Lisanslama ve Kullanım Değişikliği Hakkında', 'https://bidb.hacettepe.edu.tr/dosyalar/365A1plus_020626.pdf', 'PDF', 1 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Değerlendirme Sonucu', 'https://bidb.hacettepe.edu.tr/dosyalar/sozlesmeilan240426.pdf', 'PDF', 2 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri', 'https://bidb.hacettepe.edu.tr/dosyalar/EK_5_sozlu_sinava_girmeye_hak_kazananlarin_ilani_090426.pdf', 'PDF', 3 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi', 'https://bidb.hacettepe.edu.tr/dosyalar/EK_3_yazili_sinava_girmeye_hak_kazananlarin_ilani_310326.pdf', 'PDF', 4 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'İŞKUR Gençlik Programı Noter Kurası Çekilişi', 'https://bidb.hacettepe.edu.tr/dosyalar/iskur_kuracekimi_151025.pdf', 'PDF', 5 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, '2025-2026 Eğitim Öğretim Dönemi İŞKUR Gençlik Programı', 'https://pdb.hacettepe.edu.tr/duyuru/iskur_131025.pdf', 'PDF', 6 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı Değerlendirme Sonucu', 'https://bidb.hacettepe.edu.tr/dosyalar/sozlesme_hak_kazananlarin_ilani290525.pdf', 'PDF', 7 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri', 'https://bidb.hacettepe.edu.tr/dosyalar/Sozlu_sinava_girmeye_hak_kazananlarin_ilani_232025.pdf', 'PDF', 8 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi', 'https://bidb.hacettepe.edu.tr/dosyalar/yazili_sinava_girmeye_hak_kazananlarin_ilani130525.pdf', 'PDF', 9 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'İŞKUR Gençlik Programı Asıl Olarak Hak Kazanan Öğrencilerimiz', 'https://www.hacettepe.edu.tr/duyuru/rekduy/iskur240225.pdf', 'PDF', 10 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'İŞKUR Gençlik Programı Çerçevesinde 19.02.2025 Tarihinde Yapılan Noter Çekilişi', 'https://bidb.hacettepe.edu.tr/dosyalar/sonuc200225.pdf', 'PDF', 11 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'İşkur Gençlik Programı', 'https://bidb.hacettepe.edu.tr/dosyalar/iskurduyuru170225.pdf', 'PDF', 12 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı Değerlendirme Sonucu (22.12.23)', 'https://bidb.hacettepe.edu.tr/dosyalar/prsalimsonuc221223.pdf', 'PDF', 13 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri (18.12.23)', 'https://bidb.hacettepe.edu.tr/dosyalar/SinavSonucuYazili181223.pdf', 'PDF', 14 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi (11.12.23)', 'https://bidb.hacettepe.edu.tr/dosyalar/Sinav_web_141223.pdf', 'PDF', 15 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı Sınav Sonuçları', 'https://bidb.hacettepe.edu.tr/dosyalar/SozlesmeYapmayaHakKazananlar_200623.pdf', 'PDF', 16 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri (16.06.23)', 'https://bidb.hacettepe.edu.tr/dosyalar/sinavsonuc160623.pdf', 'PDF', 17 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi (14.06.23)', 'https://bidb.hacettepe.edu.tr/dosyalar/sozlesmeli_personel_140623.pdf', 'PDF', 18 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, 'Sözleşmeli Bilişim Personeli Duyurusu', 'https://bidb.hacettepe.edu.tr/dosyalar/bilisimduyuru300523.pdf', 'PDF', 19 FROM sayfa WHERE slug = 'anasayfa' AND dil = 'tr';
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('grup', 'en', 'Service Groups', '<div class="icerik">


 <ul>
    <li>System and Network Unit</li>
    <li>End-User Support Unit</li>
    <li>Web Design Unit</li>
    <li>Electronic-Signature Control  Unit</li>
    <li>Information Unit for Personnel  and Accounting Services</li>
  </ul>
 
</div>', 'Hacettepe University Comnputer Center', '', '', 35);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('iletisim', 'en', 'Contact', '<div class="icerik">
  <p>Hacettepe Üniversitesi<BR>
    Bilgi İşlem Daire Başkanlığı<BR>
    06800 Beytepe / ANKARA<BR>
    Telephone: +90 312 297 62 00<BR>
    Fax: +90 312 299 20 88<BR>
    E-Mail: <A href="mailto:bidb@hacettepe.edu.tr">bidb@hacettepe.edu.tr</A></p>
 
</div>', 'Hacettepe University Comnputer Center', '', '', 36);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('mv', 'en', 'Mission and Vision', '<div class="icerik">
 <p>Our  mission is to operate the computer system of our university by keeping abreast  of technology; to provide academic and administrative supports which are  required for education, instruction, research and development and to fulfill the computer  services demanded by the university.</p>
  <p> Our  vision is to reach a higher standard in terms of information technology  infrastructure, user satisfaction, organized events, and the quality and  diversity of services among the universities in TÜRKİYE, and to have  the quality and technology comparable to computer centers of internationally high-ranked universities</p>

</div>', 'Hacettepe University Comnputer Center', '', '', 37);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('overview', 'en', 'Overview', '<div class="icerik">

  <p>The  Computer Center was first founded as a "Data Processing Unit" in 1968, but later it became an  independent center.  The main  facilities and services provided by Computer Center in both campuses have a  purpose;</p>
  <UL type="disc">
    <LI>to provide       computer services for education and research, </LI>
    <LI>to form, operate       and manage the communications infrastructure       (electronic network structure) in the campuses. </LI>
    <LI>to provide       hardware, software and end-user support for academic and administrative       units of the university. </LI>
    <LI>to provide       computer use       opportunities       for students       and academics. </LI>
  </UL>
 
</div>', 'Hacettepe University Comnputer Center', '', '', 38);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('yonetim', 'en', 'Administrative Organization', '<div class="icerik">


  <table class="table table-borderless">

    <tr>
        <td>Mustafa Gökhan GÜZEL</td>
        <td>Director</td>
        <td><a href="mailto:gokhan@hacettepe.edu.tr">gokhan{at}hacettepe.edu.tr</a></td>
    </tr>      






  
  <tr>
    <td>Esin ALAN</td>
    <td>Secretary</td>

    <td><a href="mailto:esin.alan@hacettepe.edu.tr">esin.alan{at}hacettepe.edu.tr</a></td>
  </tr>
</table>
 
</div>', 'Hacettepe University Comnputer Center', '', '', 39);
INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES ('anasayfa', 'en', 'Overview', '<div class="icerik">
		<p>The  Computer Center was first founded as a &quot;Data Processing Unit&quot; in 1968, but later it became an  independent center.  The main  facilities and services provided by Computer Center in both campuses have a  purpose;</p>
<ul type="disc">
  <li>to provide       computer services for education and research, </li>
  <li>to form, operate       and manage the communications infrastructure       (electronic network structure) in the campuses. </li>
  <li>to provide       hardware, software and end-user support for academic and administrative       units of the university. </li>
  <li>to provide       computer use       opportunities       for students       and academics. </li>
</ul>

		</div>', 'Hacettepe University Comnputer Center', '', '', 40);

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('tr', 'sol', 'Kurumsal', 0);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Genel Tanıtım', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'geneltanitim' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurumsal';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Yönetim', s.id, 1 FROM menu m JOIN sayfa s ON s.slug = 'yonetim' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurumsal';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Misyon ve Vizyon', s.id, 2 FROM menu m JOIN sayfa s ON s.slug = 'misyonvizyon' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurumsal';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Bilgi Güvenliği Politikası', s.id, 3 FROM menu m JOIN sayfa s ON s.slug = 'bilgikorumaanapolitikamiz' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurumsal';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Personel', s.id, 4 FROM menu m JOIN sayfa s ON s.slug = 'personel' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurumsal';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Organizasyon Şeması', s.id, 5 FROM menu m JOIN sayfa s ON s.slug = 'organizasyonsemasi' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurumsal';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Kurul ve Komisyonlar', s.id, 6 FROM menu m JOIN sayfa s ON s.slug = 'kk' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurumsal';

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('tr', 'sol', 'Servislerimiz', 1);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'WEB Servisleri', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'webser' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'İçerik Yönetim Sistemi', s.id, 1 FROM menu m JOIN sayfa s ON s.slug = 'hu-iys' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Kablosuz Erişim Servisleri', s.id, 2 FROM menu m JOIN sayfa s ON s.slug = 'kablosuz' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Lisanslı Yazılım Sunucusu', s.id, 3 FROM menu m JOIN sayfa s ON s.slug = 'yazilim' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Bilgi ve Dokümanlar', s.id, 4 FROM menu m JOIN sayfa s ON s.slug = 'bilgidokuman' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'E-Posta İşlemleri', s.id, 5 FROM menu m JOIN sayfa s ON s.slug = 'eposta' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'E-Posta Giriş', s.id, 6 FROM menu m JOIN sayfa s ON s.slug = 'e-posta' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Office 365', s.id, 7 FROM menu m JOIN sayfa s ON s.slug = 'office365' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Proxy Ayarları ve Kurulumu', s.id, 8 FROM menu m JOIN sayfa s ON s.slug = 'proxy' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Sık Sorulan Sorular', s.id, 9 FROM menu m JOIN sayfa s ON s.slug = 'sss' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Formlar', s.id, 10 FROM menu m JOIN sayfa s ON s.slug = 'formlar' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Servislerimiz';

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('tr', 'sol', 'Kurallar ve İlkeler', 2);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Bilgi Güvenliği Yönetim Sistemi', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'bgys' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'E-Posta Tarama Politikaları', s.id, 1 FROM menu m JOIN sayfa s ON s.slug = 'tarama' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'WEB Sayfası Yayım İlkeleri', s.id, 2 FROM menu m JOIN sayfa s ON s.slug = 'yayim' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Yurt ve Öğrenci Evleri Kuralları', s.id, 3 FROM menu m JOIN sayfa s ON s.slug = 'ogr_kural' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'PC Salonlarının Kullanım Kuralları', s.id, 4 FROM menu m JOIN sayfa s ON s.slug = 'pc_salon' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Dağıtım Listeleri Politikaları', s.id, 5 FROM menu m JOIN sayfa s ON s.slug = 'posta_kural' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'HUNET Kullanım İlkeleri', s.id, 6 FROM menu m JOIN sayfa s ON s.slug = 'hunet_kurallar' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'HUNET Öğrenci Çerçeve Kuralları', s.id, 7 FROM menu m JOIN sayfa s ON s.slug = 'bilisim_ilke' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'HUNET Beytepe Yurt Erişim Protokolü', s.id, 8 FROM menu m JOIN sayfa s ON s.slug = 'hunet_protokol' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Kurallar ve İlkeler';

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('tr', 'sol', 'Teknik Altyapı', 3);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Ağ Altyapısı', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'altyapi' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Teknik Altyapı';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Mevcut Donanım Bilgileri', s.id, 1 FROM menu m JOIN sayfa s ON s.slug = 'donanim' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Teknik Altyapı';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Dış Erişim Kuralları', s.id, 2 FROM menu m JOIN sayfa s ON s.slug = 'erisim' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'Teknik Altyapı';

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('tr', 'sol', 'İletişim', 4);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'İletişim', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'iletisim' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'İletişim';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Sorumluluk Sınırı', s.id, 1 FROM menu m JOIN sayfa s ON s.slug = 'sorumluluksiniri' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'İletişim';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Erişilebilirlik Bildirimi', s.id, 2 FROM menu m JOIN sayfa s ON s.slug = 'erisilebilirlik' AND s.dil = 'tr' WHERE m.dil = 'tr' AND m.baslik = 'İletişim';

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('en', 'sol', 'Corporate', 0);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Overview', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'overview' AND s.dil = 'en' WHERE m.dil = 'en' AND m.baslik = 'Corporate';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Mission and Vision', s.id, 1 FROM menu m JOIN sayfa s ON s.slug = 'mv' AND s.dil = 'en' WHERE m.dil = 'en' AND m.baslik = 'Corporate';
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Administrative Organization', s.id, 2 FROM menu m JOIN sayfa s ON s.slug = 'yonetim' AND s.dil = 'en' WHERE m.dil = 'en' AND m.baslik = 'Corporate';

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('en', 'sol', 'Services', 1);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Service Groups', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'grup' AND s.dil = 'en' WHERE m.dil = 'en' AND m.baslik = 'Services';

INSERT INTO menu (dil, konum, baslik, sira) VALUES ('en', 'sol', 'Contact', 2);
INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, 'Contact', s.id, 0 FROM menu m JOIN sayfa s ON s.slug = 'iletisim' AND s.dil = 'en' WHERE m.dil = 'en' AND m.baslik = 'Contact';

INSERT INTO sosyal_hesap (ag, adres, sira) VALUES ('instagram', 'https://www.instagram.com/hacettepe_university/', 0);
INSERT INTO sosyal_hesap (ag, adres, sira) VALUES ('facebook', 'https://www.facebook.com/HacettepeUniversitesiKurumsal', 1);
INSERT INTO sosyal_hesap (ag, adres, sira) VALUES ('twitter', 'https://twitter.com/hacettepe1967', 2);

INSERT INTO slider (dil, baslik, alt_baslik, gorsel_url, gorsel_alt, sira) VALUES ('tr', 'Bilgi İşlem Daire Başkanlığı', '', '/images/r1.jpg', 'Bilgi İşlem Daire Başkanlığı tanıtım görseli', 0);
INSERT INTO slider (dil, baslik, alt_baslik, gorsel_url, gorsel_alt, sira) VALUES ('tr', 'Bilgi İşlem Daire Başkanlığı', '', '/images/ic1.jpg', 'Bilgi İşlem Daire Başkanlığı tanıtım görseli', 1);
INSERT INTO slider (dil, baslik, alt_baslik, gorsel_url, gorsel_alt, sira) VALUES ('tr', 'Bilgi İşlem Daire Başkanlığı', '', '/images/ic2.jpg', 'Bilgi İşlem Daire Başkanlığı tanıtım görseli', 2);

INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'E-Posta İşlemleri', '/images/icon/eposta.png', '/tr/eposta', FALSE, 0);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'E-Posta Giriş', '/images/icon_exchange2.jpg', '/tr/e-posta', FALSE, 1);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Office 365', '/images/icon/office365.png', '/tr/office365', FALSE, 2);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'HÜ BİDB Portalı', '/images/icon/portal.png', 'https://portal.hacettepe.edu.tr/', TRUE, 3);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'EBYS Bilgilendirme', '/images/icon/ebys.png', 'http://ebysbilgilendirme.hacettepe.edu.tr/', TRUE, 4);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'E-İmza & Mobil İmza', '/images/icon/eimza.png', '/eimza/', TRUE, 5);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Proxy Ayarları ve Kurulumu', '/images/icon/proxy.png', '/tr/proxy', FALSE, 6);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Sorun Bildirim ve Destek Hizmetleri', '/images/icon/yardim.png', 'https://bidbdestek.hacettepe.edu.tr', TRUE, 7);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Sık Sorulan Sorular', '/images/icon/sss.png', '/tr/sss', FALSE, 8);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Formlar', '/images/icon/form.png', '/tr/formlar', FALSE, 9);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Bilgi ve Dokümanlar', '/images/icon/bilgidokuman.png', '/tr/bilgidokuman', FALSE, 10);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Yazılım Deposu', '/images/icon/yazilimdeposu.png', 'https://yazilimdeposu.hacettepe.edu.tr/', TRUE, 11);

INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Web Servisleri', '/images/hizmet1.png', '/tr/webser', FALSE, 100);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'HÜ İçerik Yönetim Sistemi', '/images/hizmet2.png', 'http://hu-iys.hacettepe.edu.tr/', TRUE, 101);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Eğitim Fakültesi Mezun Bilgi Sistemi', '/images/hizmet_mezunbilgi.jpg', 'http://egitimmezun.hacettepe.edu.tr/', TRUE, 102);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'GSF Başvuru Sistemi', '/images/servis_gsf.png', 'https://ozelyeteneksinavi.hacettepe.edu.tr/giris/', TRUE, 103);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Akademik Ön Değerlendirme Başvuru Sistemi', '/images/servis_akademik.png', 'https://kriter.hacettepe.edu.tr', TRUE, 104);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Sticker Başvurusu', '/images/servis_sticker.png', 'http://guvenlik.hacettepe.edu.tr/sticker/', TRUE, 105);
INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES ('tr', 'Portal', '/images/servis_portal.png', 'https://portal.hacettepe.edu.tr/', TRUE, 106);

INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Microsoft OneDrive Depolama Kotaları Hakkında Bilgilendirme', '2026-06-23', '/dosyalar/onedriveduyuru230626.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Microsoft 365 Lisanslama ve Kullanım Değişikliği Hakkında', '2026-06-02', '/dosyalar/365A1plus_020626.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Değerlendirme Sonucu', '2026-04-24', '/dosyalar/sozlesmeilan240426.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri', '2026-04-09', '/dosyalar/EK_5_sozlu_sinava_girmeye_hak_kazananlarin_ilani_090426.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi', '2026-03-31', '/dosyalar/EK_3_yazili_sinava_girmeye_hak_kazananlarin_ilani_310326.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'İŞKUR Gençlik Programı Noter Kurası Çekilişi', '2025-10-15', '/dosyalar/iskur_kuracekimi_151025.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', '2025-2026 Eğitim Öğretim Dönemi İŞKUR Gençlik Programı', '2025-10-14', 'https://pdb.hacettepe.edu.tr/duyuru/iskur_131025.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı Değerlendirme Sonucu', '2025-05-29', '/dosyalar/sozlesme_hak_kazananlarin_ilani290525.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri', '2025-05-23', '/dosyalar/Sozlu_sinava_girmeye_hak_kazananlarin_ilani_232025.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi', '2025-05-13', '/dosyalar/yazili_sinava_girmeye_hak_kazananlarin_ilani130525.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı', '2025-04-28', '/tr/ilan_280425');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'İŞKUR Gençlik Programı, İş Sağlığı ve Güvenliği Eğitimi', '2025-02-28', '/tr/duy_iskur280225');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'İŞKUR Gençlik Programı Asıl Olarak Hak Kazanan Öğrencilerimiz', '2025-02-24', 'https://www.hacettepe.edu.tr/duyuru/rekduy/iskur240225.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'İŞKUR Gençlik Programı Çerçevesinde 19.02.2025 Tarihinde Yapılan Noter Çekilişi', '2025-02-20', '/dosyalar/sonuc200225.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'İşkur Gençlik Programı', '2025-02-17', '/dosyalar/iskurduyuru170225.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'VPN sistemi ile ilgili Bilgilendirme ve Bağlantı Kılavuzları', '2024-09-27', '/tr/VPN');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı Değerlendirme Sonucu', '2023-12-22', '/dosyalar/prsalimsonuc221223.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri', '2023-12-18', '/dosyalar/SinavSonucuYazili181223.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi', '2023-12-11', '/dosyalar/Sinav_web_141223.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı Sınav Sonuçları', '2023-06-20', '/dosyalar/SozlesmeYapmayaHakKazananlar_200623.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav Bilgileri', '2023-06-16', '/dosyalar/sinavsonuc160623.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Alımı İle İlgili Ön İnceleme Sonucu Sınava Girmeye Hak Kazananların Listesi', '2023-06-14', '/dosyalar/sozlesmeli_personel_140623.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Sözleşmeli Bilişim Personeli Duyurusu', '2023-05-30', '/dosyalar/bilisimduyuru300523.pdf');
INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES ('tr', 'Mezun E-posta Hesabı Hakkında', '2023-03-20', '/tr/mezuneposta');

INSERT INTO slider (dil, baslik, alt_baslik, gorsel_url, gorsel_alt, sira) VALUES ('en', 'Computer Center', '', '/images/r1.jpg', 'Promotional image for the Directorate of Information Technology', 0);




INSERT INTO ayar (anahtar, dil, deger) VALUES ('iletisim_adres', 'tr', 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı 06800 Beytepe / ANKARA');
INSERT INTO ayar (anahtar, dil, deger) VALUES ('iletisim_telefon', 'tr', '+90 312 297 62 62 · +90 312 297 62 00 · +90 312 299 20 88');
INSERT INTO ayar (anahtar, dil, deger) VALUES ('iletisim_eposta', 'tr', 'bhim@hacettepe.edu.tr · bidb@hacettepe.edu.tr');
INSERT INTO ayar (anahtar, dil, deger) VALUES ('iletisim_faks', 'tr', '+90 312 299 20 88');
