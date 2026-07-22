-- Elektronik İmza Kullanma Rehberi: kaynak alt sistemin (eimza/*.php)
-- 16 sayfası birebir içeri alınır.
--
-- İÇERİK KAYNAKTAN ALINDI, DEĞİŞTİRİLMEDİ. Her sayfanın yalnızca ana gövde
-- metni (baslik_duyurular/icerik_baslik + duyurular_ic/icerik_yazi)
-- ayıklandı; kaynağın kendi şablonu, sol menüsü ve slaytları alınmadı.
-- İç .php bağlantıları yeni site adreslerine (/tr/e-signature-*), göreli
-- dosya ve görsel yolları kaynak sunucuya (mutlak) çevrildi.
--
-- Süreç bilgileri (form sürümleri, KAMU SM kuralları, tarih pencereleri)
-- kurum tarafından güncellenir; bu sayfalar panelden düzenlenebilir.
--
-- Sayfalar arası gezinme, stored içeriğe gömülmedi: e-signature ile
-- başlayan sayfalarda ortak bir alt-gezinme bileşeni gösterilir.

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature', 'tr',
  $eimza$Elektronik İmza Kullanma Rehberi$eimza$,
  $eimza$<div class="icerik">
EBYS üzerinden üretilen verilerin elektronik ortamda ıslak imzaya eşdeğer şekilde kullanılmasını sağlamak amacıyla, imzaya yetkili personele "e-imza Sertifikası" temin edilmektedir.</br>

Kurumumuz tarafından onaylanacak e-imza taleplerinde ön başvuru işlemleri, aşağıda belirtilen koşullar çerçevesinde değerlendirilecektir. Bu koşullar dışındaki durumlar için sipariş oluşturulmayacaktır.</br>
<hr>

 



<details class="group border-b border-gray-200 py-3 cursor-pointer select-none">
  <summary class="flex justify-between items-center list-none font-bold text-gray-800 hover:text-red-700 transition-colors">
    <span class="text-lg"><b><font color="red">1. İdari Görevi Bulunanlar İçin Ön Başvuru</font></b></span>
    <!-- Artı / Eksi İşareti (Grup açıkken döner) -->
    <span class="text-2xl font-light transition-transform duration-300 group-open:rotate-45 text-gray-500">+</span>
  </summary>
  <div class="mt-3 text-gray-600 pl-2 leading-relaxed">






       İdari görev ataması yapıldıktan sonra EBYS de kullanıcı rolleri tanımlanmış olan personel için süreç şu şekilde işler:
<br><b>Süreç:</b> İdari görevi ve kişisel bilgileri (T.C. Kimlik No, doğum tarihi (gg/aa/yyyy) ve kurumsal e-posta adresi) içeren e-imza teminine dair üst yazı, ekine görevlendirme yazısı da eklenerek ilgili birim yönetimi tarafından Bilgi İşlem Daire Başkanlığına iletilir.

<br><b>Yenileme:</b> İdari görevin devam etmesi durumunda, mevcut e-imzanın süresinin bitmesine en fazla 1 ay kala başvuru yapılabilir.
<br><b>Kapsam:</b> Aşağıda listelenen görevler dışında kurumsal e-imza temini yapılmayacaktır.<br>
*Üniversite Yönetimi; Üniversite Etik Kurul ve Komisyon Üyeleri; 
<br>*Fakülteler: Dekan, Dekan Yardımcısı, Bölüm Başkanı ve Yardımcısı, Fakülte Sekreteri. (Eczacılık, Fizik Tedavi ve Reh., Hemşirelik, Sağlık Bilimleri ve Tıp Fakültelerinde Anabilim Dalı Başkanı) 
<br>*Konservatuvar/ Enstitüler: Müdür, Müdür Yardımcısı, Anabilim Dalı Başkanı, Enstitü Sekreteri.
<br>*YO/MYO: Müdür ve Müdür Yardımcısı, YO/MYO Sekreteri.
<br>*Uygulama Araştırma Merkezleri: Uygulama ve Araştırma Merkezi Müdürü; 
<br>*İdari Birimler: İç Denetçi, Hukuk Müşaviri, Avukat, Daire Başkanı, Daire Başkanı Yardımcısı ve Şube Müdürü, Harcama Yetkilisi, Gerçekleştirme Görevlisi ve Yedekleri;<br>   


<br><B>Kurullarda Görevli Akademik Personel:</B></font>
       <br>Fakülte, Enstitü ve Yönetim Kurullarında görevli akademik personel için talepler; ilgili birim yönetimi tarafından  <a href="https://bidb.hacettepe.edu.tr/eimza/Kurul_YK_Eimza_OnSiparis_v2.xlsx" blank="_target"> <b>Kurul_YK_Eimza_OnSiparis</b></a> <font color="green">Excel formu</font>  doldurularak üst yazı ekinde Bilgi İşlem Daire Başkanlığına iletilir.</br>

 




  </div>
</details>







<details class="group border-b border-gray-200 py-3 cursor-pointer select-none mt-4">
  <summary class="flex justify-between items-center list-none font-bold text-gray-800 hover:text-red-700 transition-colors">
    <span class="text-lg">


 <B><font color="red">2. TÜBİTAK / TÜSEB Projelerinde Görevli Akademik Personel </B></font>


</span>
    <!-- Artı / Eksi İşareti -->
    <span class="text-2xl font-light transition-transform duration-300 group-open:rotate-45 text-gray-500">+</span>
  </summary>
  <div class="mt-3 text-gray-600 pl-2 leading-relaxed">
    <!-- 2. Başlığın altına gelecek mevcut metinlerinizi buraya yapıştırın -->



Projelerde görev alan akademik personelimizin e-imza başvuru süreçleri; kamu kaynaklarının etkin kullanımı ile kurumsal bütçenin korunması prensipleri doğrultusunda Bilgi İşlem Daire Başkanlığı tarafından titizlikle yönetilmektedir. Sürecin aksamadan yürütülmesi için başvuru kriterlerine  ve belge düzenine uyulması büyük önem arz etmektedir.<br>

<br><b>Başvuru Kriterleri </b>
<br> E-imza talepleri, aşağıdaki iki şartı birlikte sağlayan akademik personel için işleme alınacaktır.
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    - Yürürlükte olan bir projesi bulunmak veya en geç <b>1 ay içerisinde</b> yeni bir proje başvurusunda bulunacak olmak.
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    - İlgili proje sistemlerinde (PRODİS, TBYS vb.) dijital onay/imza yetkisine sahip <b>Yürütücü, Araştırmacı</b> veya <b>Danışman</b> rollerinden birinde görevli olmak.<br>

<br><b>Uygulama Adımları</b>

<br><b> 2.1. Formların Teslimi:</b> Talep sahibi, ilgili başvuru formlarını eksiksiz doldurarak bağlı bulunduğu Birim Amirliğine teslim eder.<br>

<br><b> 2.2. Resmi Yazışma:</b> İlgili yönetim birimi, bu formları bir üst yazı ekinde Bilgi İşlem Daire Başkanlığına iletir.
        <br><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ÖNEMLİ NOT:</b> İdari işleyişin verimliliği adına; belgeleri eksik olan, imza süreçleri tamamlanmamış veya kriterlere uygun      olmayan başvurular işleme alınmadan ilgili birime iade edilecektir. Başvurularınızın hızlıca sonuçlanabilmesi için formların eksiksiz teslim edildiğinden emin olmanızı rica ederiz.<br>

<br><b> 2.3. Gerekli Başvuru Formları</b>
<br>A) Devam Eden Proje İçin:
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 1-- <a href="https://bidb.hacettepe.edu.tr/eimza/Proje_Eimza_OnSiparis_v5.xlsx" blank="_target"> <b>Proje_Eimza_OnSiparis </b>(Versiyon 5)</a> formu
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 2-- ARBİS / TBYS "Projelerim" sekmesinden alınan <b>Proje Özet Sayfası </b>
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 3-- (Varsa) <b>"Ek Süre Onay Yazısı"</b> (Proje süresi dolmuş ancak uzatılmışsa zorunludur)
<br> B) Yeni Başvurulacak Proje İçin:
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 1-- <a href="https://bidb.hacettepe.edu.tr/eimza/Proje_Eimza_OnSiparis_v5.xlsx" blank="_target"> <b>Proje_Eimza_OnSiparis </b>(Versiyon 5)</a> formu 
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 4-- ARBİS/TBYS üzerinden alınan <b>"Proje Başvuru Formu"</b>

<p>
<b>Dikkat Edilmesi Gereken Hususlar</b>
       <br><b>Yeni Başvurusu Yapılacaksa:</b> Başvurusu planlanan projelerde <b>"Projenin Taslak Adı" ve "Başvuru Dönemi"</b> formda mutlaka yer almalıdır. Boş bırakılan formlar değerlendirmeye alınmaz. Ayrıca <b>ARBİS/TBYS başvuru formu</b> üst yazıya eklenmelidir.
       
       <br><b>Zamanlama:</b> Yeni proje başvuru tarihine 1 aydan uzun süre bulunan talepler için sistem üzerinden sipariş açılmayacaktır. Bu tür taleplerin zamanı geldiğinde iletilmesi rica olunur.

       <br><b>Ek Süre Onayı:</b> Proje süresi dolan taleplerde, "Ek Süre Onay Yazısı" eklenmediği takdirde e-imza temini kurumsal ödeme kapsamında alınmayacak ve sipariş süreci başlatılmayacaktır.

       <br><b>BAP Projeleri: </b> Bilimsel Araştırma Projeleri (BAP) süreçlerinde e-imza kullanımı bulunmadığından, bu projeler için sipariş süreci başlatılmayacaktır; akademik personelimizin talepte bulunmamasını önemle rica ederiz. 

       <br><b>İdari Personel:</b> Projelerde görevli idari personel için bireysel veya kurumsal ödemeli e-imza siparişi oluşturulmamaktadır.
</p>       



  </div>
</details>




<hr><b>Genel Notlar ve Önemli Uyarılar</b></br>
<p class="text-gray-600 pl-4 mt-1"> 
<b>E-imza Yenileme:</b> Kullanım süresi dolmuş veya dolmasına en fazla 1 ay kalmış sertifikalar için yukarıdaki süreçler geçerlidir. Daha uzun sertifika süresi bulunan talepler işleme alınmaz. Yenilemelerde yeni kart okuyucu temin edilmez.</br>

<b>Kapsam Dışı:</b> Hacettepe Üniversitesi Hastaneleri ve Diş Hekimliği Fakültesi, e-imza süreçlerini kendi bünyelerinde yürütmektedir.</br>

<b>Kayıp/Çalıntı: </b> Bu durumlarda yenileme işlemleri; KAMU SM web sayfası üzerinden  "Online İşlemler" (NES İşlemleri -> Bireysel İşlemler -> Kişi Ödemeli Başvuru) menüsünden bireysel olarak yapılmalıdır.</br>

<b>Kullanıcı Sorumluluğu: </b> Kullanıcı kaynaklı arıza, kayıp/çalıntı, PIN-PUK blokesi ve kimlik bilgisi güncellemesi gibi durumlarda oluşacak yenileme bedelleri bireysel olarak karşılanır. 
</p>     

       
       
        <b>Başvuru Formu ve Takip</b>
 <p class="text-gray-600 pl-4 mt-1">
        Kurum onayı verildikten sonra KAMU SM tarafından ön sipariş oluşturulur ve başvuru sahibinin kurumsal e-posta adresine işlem adımlarını içeren bir bilgilendirme mesajı gönderilir.  Başvuru sahiplerinin e-posta kutularını (Gereksiz/Spam klasörü dahil) düzenli olarak kontrol etmeleri gerekmektedir. Sertifikanın üretim aşamasına geçebilmesi için gelen bağlantıdaki adımların tamamlanması şarttır. Ön siparişi açıldığı halde 6 ay içerisinde tamamlanmayan talepler, KAMU SM tarafından otomatik olarak iptal edilmektedir.

<br><b>Bilgilendirme E-postası Gelmeyenler/Bulamayanlar; </b>E-posta ulaşmayan veya bağlantıyı bulamayan kullanıcılarımız KAMU SM web sayfası üzerinden
        Online İşlemler > NES İşlemleri > Bireysel İşlemler > Başvuru İşlemleri menüsünü kullanarak başvuru formlarına doğrudan erişebilirler.
</p>

       <b>Sertifikanın Üretimi </b> 
<p class="text-gray-600 pl-4 mt-1">
Sertifikanın üretilmesi için sistem üzerinden oluşturulan form doldurulmalı ve başvuru yöntemi seçilmelidir:
<br>1.<b>Islak İmzalı Başvuru:</b> Aktif e-imzası olmayan veya ilk kez başvuru yapanlar için; Formun çıktısı alınarak imzalanmalı ve formda belirtilen adrese bireysel olarak kargo ile gönderilmelidir. ("Kamu Sertifikasyon Merkezi TÜBİTAK Gebze Yerleşkesi (İdari Bina) P.K.74 41470 KOCAELİ")
       <br>2. <b>E-imzalı/ E-Onaylı Başvuru: </b> Başvuru işlemi mevcut bir e-imza ile veya e-onay yöntemiyle tamamlandıysa, fiziksel evrak gönderilmesine gerek yoktur. 
</p>
<hr>
       
       Süreç takibi (üretim, teslimat) <a href="https://onlineislemler.kamusm.gov.tr/landing" target="_blank"><b>Kamu SM Online İşlemler</b></a> web sayfasından yapılabilir.</br>
<hr>
	

        <u><b>ÖNEMLİ :</b></u> Yeni üretilen sertifika, eski sertifikanın süresi bittiğinde aktif olacaktır. Süre dolduktan sonra PIN alma işlemlerini tamamlayarak yeni sertifikanızı kullanmaya başlayabilirsiniz.
<br>
        <br><b>Teknik Destek</b><br>
Sürücü kurulumu ve teknik yardım için  <b>Kamu SM Çağrı Merkezini (444 5 576)</b> arayabilir veya
        Bilgi İşlem Daire Başkanlığı <a href="https://bidbdestek.hacettepe.edu.tr/login.php"><b>Sorun Bildirim Destek</b> </a> sayfası üzerinden form doldurarak yardım talep edebilirsiniz.
<hr>
        
        
	
	   
          
    
         
          
  
</div><!--içerik yazi bit-->  
</div><!--içerik bit-->
</div><!--orta bit-->
<div class="temizle">
</div>$eimza$,
  $eimza$Elektronik İmza Kullanma Rehberi | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Elektronik İmza Kullanma Rehberi.$eimza$,
  TRUE, 40
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-about', 'tr',
  $eimza$E-İmza Hakkında$eimza$,
  $eimza$<div class="icerik">
<p> 15 Ocak 2004 tarihli ve  5070 sayılı Elektronik İmza Kanununa göre elektronik imza; başka bir elektronik  veriye eklenen veya elektronik veriyle mantıksal bağlantısı bulunan ve kimlik  doğrulama amacıyla kullanılan elektronik veriyi tanımlamaktadır.<br>
         Elektronik&nbsp; imza; bir&nbsp; bilginin&nbsp; üçüncü&nbsp; tarafların&nbsp;  erişimine&nbsp; kapalı&nbsp; bir ortamda,&nbsp; bütünlüğü&nbsp;  bozulmadan&nbsp; (bilgiyi&nbsp; ileten&nbsp; tarafın&nbsp; oluşturduğu orijinal  haliyle) ve tarafların kimlikleri doğrulanarak iletildiğini elektronik veya  benzeri araçlarla garanti eden harf, karakter veya sembollerden oluşur. Kanuna  uygun olarak oluşturulmuş e-imza, bilgisayarda veya elektronik ortamda  gerçekleştirilen onay işlemlerine hukuki dayanak kazandırır ve kâğıdı ortadan  kaldırır. Onay amaçlı irade beyanında bulunmak isteyen kişi, kurumunun  elektronik evrak akış sisteminde, web üzerinden sunulan hizmetlerde ya da  e-devlet hizmetlerinde elektronik imza kullanabilir.<br />
Elektronik imza kullanıcılarına aşağıda belirtilen üç temel özelliği  sağlamaktadır:</p>
        <p><strong>Veri Bütünlüğü:</strong> Verinin izinsiz  ya da yanlışlıkla değiştirilmesini, silinmesini ve veriye ekleme yapılmasını  önlemek,</p>
          <p><strong>Kimlik Doğrulama ve Onaylama:</strong> Mesajın ve mesaj sahibinin iletiminin geçerliliğini sağlamak,</p>
          <p><strong>İnkar Edilemezlik:</strong> Bireylerin  elektronik ortamda gerçekleştirdikleri işlemleri inkar etmelerini önlemek.</p>
        
       
      </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$E-İmza Hakkında | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: E-İmza Hakkında.$eimza$,
  TRUE, 41
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-legislation', 'tr',
  $eimza$Mevzuat$eimza$,
  $eimza$<div class="icerik">
<h2 align="left">KANUNLAR </h2>
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_kanunu.pdf">5070 Sayılı Elektronik İmza Kanunu</a></br>
          23.01.2004 tarihli ve 25355 sayılı Resmi Gazete<br />
          Bu Kanun, elektronik imzanın hukuki yapısını, elektronik sertifika hizmet sağlayıcılarının faaliyetlerini ve her alanda elektronik
imzanın kullanımına ilişkin işlemleri kapsar.</p>

<h2 align="left">YÖNETMELİKLER </h2>
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_yonetmelik.pdf">Elektronik İmza Kanununun Uygulanmasına İlişkin Usul ve Esaslar Hakkında Yönetmelik</a><br>
          06.01.2005 tarihli ve 25692 sayılı Resmi Gazete<br />
          Bu Yönetmelik,  elektronik imzanın hukuk, teknik ve mali hususlara ilişkin usul ve esasları kapsar.</p>
          
          <!-- <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/resmi_yazisma_usul_ve_esaslari.pdf">Resmi Yazışmalarda Uygulanacak Esas ve Usuller Hakkında Yönetmelik</a>
          <div align="left">02.12.2004 tarihli ve 25658 sayılı Resmi Gazete<br />
          Bu Yönetmelik, resmi yazışma kurallarını belirlemek, bilgi ve belge alışverişinin sağlıklı, hızlı ve güvenli bir biçimde yürütülmesini
          sağlar. Bütün kamu kurum ve kuruluşlarını kapsar.</div>
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/sertifika_malisorumluluk_yonetmelik.pdf">Sertifika Mali Sorumluluk Sigortası Yönetmeliği</a>
          <div align="left">26.082004 tarihli ve 25565 sayılı Resmi Gazete<br />
          Sertifika mali sorumluluk sigortası yükümlülüğünün yerine getirilmesine ilişkin usul ve esasları belirler.</div>
          -->

<h2 align="left">TEBLİĞLER </h2>
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_degisiklik_tebligi.pdf">Elektronik İmza ile İlgili Süreçlere ve Teknik Kriterlere İlişkin Tebliğde Değişiklik Yapılmasına Dair Tebliğ</a>
          <br>30.01.2013 tarihli ve 28544 sayılı Resmi Gazete</br>
          Elektronik İmza ile İlgili Süreçlere ve Teknik Kriterlere İlişkin Tebliğin 6.maddesi değiştirilmiştir.</p>
          
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_teblig.pdf">Elektronik İmza ile İlgili Süreçlere ve Teknik Kriterlere İlişkin Tebliğ</a><br>
          06.01.2005 tarihli ve 25692 sayılı Resmi Gazete<br/>
          Bu Tebliğ, nitelikli elektronik sertifika başvurusu, sertifikanın oluşturulması, yayımlanması, yenilenmesi, iptali ve arşivleme süreçleri dahil olmak üzere ESHS'nin işleyişine, imza oluşturma ve doğrulama verilerine, sertifika ilkelerine ve sertifika uygulama esaslarına, imza oluşturma ve doğrulama araçlarına, ESHS'nin faaliyetleri için kullandığı sistem, cihaz ile fiziki güvenliğine, personeline, zaman damgasına ve hizmetlerine ilişkin teknik hususları kapsar.</p>
         
 <h2 align="left">TELEKOMÜNİKASYON KURUL KARARLARI </h2>
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/kurulkarar_profil_rehberi.pdf">Nitelikli Elektronik Sertifika, SİL ve OCSP İstek/Cevap Profilleri Rehberi'ne İlişkin Kurul Kararları</a>
          <br>18.04.2007 tarihli ve 2007/DK-77/760 sayılı</p>

           <p align="left">Güvenli Elektronik İmza Oluşturma ve Doğrulama Uygulamaları ile Güvenli Elektronik İmza Formatlarına Dair Usul ve Esaslar Hakkında Kurul Kararı</p>
          
          
<h2 align="left">KAMU SM İLE İLGİLİ DÜZENLEMELER (GENELGELER) </h2>
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/200421_genelge.pdf">2004/21 Sayılı Başbakanlık Genelgesi</a>
          <br>Amaç: Bütün kamu kurum ve kuruluşlarının elektronik sertifika ihtiyaçlarının tek merkezden sağlanması</p>
          <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/200613_genelge.pdf">2006/13 Sayılı Başbakanlık Genelgesi</a></p>
          
          <!--<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/200816_genelge.pdf">2008/16 Sayılı Başbakanlık Genelgesi</a></p>
          <p align="left">TSE 13298 Elektronik Belge Yönetim Standardı</p>-->
          
          
          
          
      
      </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Mevzuat | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Mevzuat.$eimza$,
  TRUE, 42
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-application', 'tr',
  $eimza$Başvuru$eimza$,
  $eimza$<div class="icerik">
<p><b>İdari görev</b> nedeniyle e-imza  talebinde bulunulacak personel için, idari amirlikler tarafından Bilgi İşlem  Daire Başkanlığı'na üst yazı ile e-imza talebi gönderilir.
Yazıda ilgili personelin TC no, doğum tarihi g/a/y olarak ve  kurumsal e-posta bilgileri de bulunur.</p>

<p><b>TÜBİTAK proje</b> başvurusunda bulunacak/devam eden projeleri bulunan akademik personel için e-imza talepleri, bireysel olarak
    <a href="https://bidb.hacettepe.edu.tr/eimza/TUBITAK_Proje_Eimza_OnSiparis_v5.xlsx" blank="_target"> <b>TUBİTAK_Proje_Eimza_OnSiparis form </b> </a> doldurularak 
       idari amirliklerine (Dekanlık, Enstitü, Rektörlük, Genel Sekreterlik...) teslim edilerek, ilgili birim yönetimi tarafından form üst 
      yazı ile Başkanlığımıza gönderilir.</p>

<p> Fakülte, Enstitü Kurul ve Yönetim Kurullarında görevli akademik personel için;</u>
       <br>E-imza talepleri birim amirliklerince  <a href="https://bidb.hacettepe.edu.tr/eimza/Kurul_YK_Eimza_OnSiparis_v2.xlsx" blank="_target"> <b>Kurul_YK_Eimza_OnSiparis Excel form </b></a> doldurularak 
       üst yazıya bu form Excel dosyası olarak eklenerek (tarama yapılmadan) Başkanlığımıza gönderilir. </p>


<p>Talepler başkanlığımızca değerlendirilerek, e-imza temini uygun olanlar için kurum onayı TÜBİTAK KAMU SM ye iletilir. <br>
   <FONT COLOR="RED" size="2">Diğer koşullarda üniversite tarafından e-imza temin/yenileme işlemleri yapılmayacaktır. (05.11.2020)</font></p>



        <p><u>Kurum tarafından e-imza kurum onayı Kamu SM ye iletilen personelin başvuru yapması:</u>
          
        <br> Kamu SM başvuru sahiplerinin e-posta adreslerine işlem adımlarını anlatan bilgilendirme e-postası gönderecektir. 
             <br>--aktif e-imzası olanlar (yenileme) "e-imzalı başvuru" yaparak tamamlar,           
             <br>--aktif e-imzası olmayanlar "ıslak imzalı başvuru" ile işleme devam ederek başvuru formunu yazıcıdan alır, imzalar ve <br><i>Adres: Kamu Sertifikasyon Merkezi TÜBİTAK Gebze Yerleşkesi (İdari Bina) P.K .74, Gebze 41470 KOCAELİ </i> adresine <b>bireysel olarak posta</b> yolu ile gönderir.<br>

        <br> Kamu SM'ye ön sipariş talebi iletildiği halde e-postalarına gelen başvuru linkini bulamayanlar 
       Kamu SM web sayfası Online İşlemlere GİRİŞ yaptıktan sonra NES İşlemleri -> Bireysel İşlemler -> Başvuru İşlemleri menüsünden başvuru formuna ulaşabilirler. </p>                    
          
              
</p>   
          
        
</div><!--içerik yazi bit-->  
</div><!--içerik bit-->
</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Başvuru | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Başvuru.$eimza$,
  TRUE, 43
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-workflow', 'tr',
  $eimza$Başvuru İş Akışı$eimza$,
  $eimza$<div class="icerik">
<img src="https://bidb.hacettepe.edu.tr/eimza/images/isakisi_20141120_personel.jpg" width="623" height="860" border="0">

      </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Başvuru İş Akışı | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Başvuru İş Akışı.$eimza$,
  TRUE, 44
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-certificate-received', 'tr',
  $eimza$Sertifikamı Aldım, Ne Yapmalıyım?$eimza$,
  $eimza$<div class="icerik">
KAMUSM 'den almış olduğunuz sertifikanızı kullanabilmeniz için <b><a href="http://kamusm.gov.tr/islemler/sertifikami_aldim_ne_yapmaliyim/?info=1" target="_blank"> 
"NES Sertifikamı Aldım Ne Yapmalıyım?" </a></b> sayfasından sürücü kurulumları ve yeni PIN oluşturmak için ilgili yönergelerden destek alabilir
veya Sorun Bildirim Destek <a href="https://bidbdestek.hacettepe.edu.tr/login.php"> https://bidbdestek.hacettepe.edu.tr/login.php</a> 
sayfasından form doldurabilirsiniz.
 
     
      
</div><!--içerik yazi bit--> 
</div><!--içerik bit-->
</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Sertifikamı Aldım, Ne Yapmalıyım? | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Sertifikamı Aldım, Ne Yapmalıyım?.$eimza$,
  TRUE, 45
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-java', 'tr',
  $eimza$Java Ayarları$eimza$,
  $eimza$<div class="icerik">
<p>Nitelikli Elektronik Sertifika ile imza atabilmek için bilgisayarınızda Java programının yüklü ve güncel olması gerekmektedir.</p>
        <p><a href="http://www.java.com/tr/download" target="_blank">http://www.java.com/tr/download</a> adresinden en son güncelleme kurulabilir.</p>
        <p>E-imza kullanıcıları Java sürümlerini yükseltmiş  ve e-imza işlemini gerçekleştiremiyorlarsa; Java > Security sekmesindeki güvenlik seviyesini en alta çekmeleri gerekmektedir.<br />
1-Denetim Masası - Java programı açılır.<br />
        <img src="https://bidb.hacettepe.edu.tr/eimza/images/basvuru_java.jpg" width="596" height="196" /></p>
        <p>2-Açılan pencerede Security (Güvenlik) sekmesine tıklayıp, Security Level ok işareti <strong>Medium</strong> seviyesine getirilir ve OK ile kayıt edilir.<br />
<img src="https://bidb.hacettepe.edu.tr/eimza/images/basvuru_java_security.jpg" /></p>

        
        <p>&nbsp;</p>
      </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Java Ayarları | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Java Ayarları.$eimza$,
  TRUE, 46
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-remote-desktop', 'tr',
  $eimza$Masaüstü Yardım$eimza$,
  $eimza$<div class="icerik">
<p>Uzaktan Erişim Programı indirebilirsiniz.</p>
          <table>
          <tr>
            <td><a href="https://bidb.hacettepe.edu.tr/eimza/indir/AA_v3.3.exe"><img src="https://bidb.hacettepe.edu.tr/eimza/images/image_ammyy.jpg" alt="Ammyy" width="270" height="70" /></a></td>
            <td><a href="https://bidb.hacettepe.edu.tr/eimza/indir/TeamViewer_Setup_tr.exe"><img src="https://bidb.hacettepe.edu.tr/eimza/images/image_team.jpg" alt="TeamViewer" width="270" height="70" /></a></td>
          </tr><br />
          <tr><td align="center"><a href="https://bidb.hacettepe.edu.tr/eimza/indir/AMMYY_REHBER.pdf">Ammyy Rehberi</a></td>
          <td align="center"><a href="https://bidb.hacettepe.edu.tr/eimza/indir/TEAMVIWER_REHBER.pdf">Teamviewer Rehberi</a></td>
          </tr><br /><br />
</table>

        
        <p>&nbsp;</p>
      </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Masaüstü Yardım | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Masaüstü Yardım.$eimza$,
  TRUE, 47
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-security-word', 'tr',
  $eimza$Güvenlik Sözcüğü$eimza$,
  $eimza$<div class="icerik">
Güvenlik sözcüğü, başvuru sahibinin başvuru formu doldururken  belirlemiş olduğu  bir yetkilendirme parametresidir.<br><br> 
Güvenlik sözcüğünü unutanlar, 
 <a href="https://onlineislemler.kamusm.gov.tr">https://onlineislemler.kamusm.gov.tr</a> sayfası üzerinden işlemlerini yapabilirler.
     

</div><!--içerik yazi bit-->
</div><!--içerik bit-->   
</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Güvenlik Sözcüğü | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Güvenlik Sözcüğü.$eimza$,
  TRUE, 48
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-renewal', 'tr',
  $eimza$Sertifika Yenileme$eimza$,
  $eimza$<div class="icerik">
Sertifikaların yenileme işlemleri kurum yetkilisi olarak <b>Bilgi İşlem Daire Başkanlığı</b>'nın KAMU SM 'ye onay vermesi ile 
yapılacaktır. Yenileme yapılabilmesi için aşağıdaki şartların sağlanıyor olması gerekir;

<ul>
<li>Sertifika sahibinin idari görevinin (imzaya yetkili) devam ediyor olması,
<li>Kurum yetkilisinin KAMU SM 'ye onay vererek yenileme talebinde bulunması,
<li>KAMU SM 'den daha önce alınmış sertifikanın bulunması,
</ul>

Şartlar sağlanıyorsa, KAMU SM, sertifika sahibinin e-posta adresine "NES Başvuru Formu Erişim Parolası" gönderir. 
Yenileme için başvuru formu "Elektronik İmzalı arayüzü" seçilerek imzalanmalıdır. <br><br>
Sertifika süresi bitmişse aynı işlem ıslak imzalı olarak  gerçekleştirilir. 
Bu durumda başvuru formu yazıcıdan çıktı alınıp imzalanarak, TÜBİTAK Gebze yerleşkesine posta ile gönderilir.<br/><br>
Yeni sertifika, kişinin önceki sertifikasının süresinin dolmasına 15 gün kala üretilir 
ve eski sertifikanın süresi bitmeden kullanıma açılmaz.<br><br>
               
         
     </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Sertifika Yenileme | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Sertifika Yenileme.$eimza$,
  TRUE, 49
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-update', 'tr',
  $eimza$Sertifika Güncelleme$eimza$,
  $eimza$<div class="icerik">
Aşağıdaki durumlarda sertifika güncelleme hizmetinden yararlanılabilir.    	 
<li>PUK kodunun üst üste yanlış girilerek kartın kullanılamaz hale gelmesi</b>
<li>Akıllı kartın kaybedilmesi, çalınması veya arızalanması
<li>Kimlik bilgilerinin değişmesi
<br>İmza verisi oluşturma verisi ve sertifika yeni bir akıllı kart içine yüklenerek, <b>üretim bedeli sertifika sahibi tarafından karşılanarak,</b> sertifika sahibine ulaştırılır. <br><br>

<b>Garanti Kapsamı - Donanım Arıza</b><br>
E-imza sorunu yaşıyorsanız, KAMU SM Çağrı merkezine 444 5 576 numaralı telefondan ulaşarak veya aldığınız hatanın ekran görüntüsünü bilgi[at]kamusm.gov.tr adresine e-posta olarak göndererek kart okuyucunuzun kontrol edilmesini sağlayabilirsiniz. Kontrol sonucu sizlere çağrı esnasında veya e-posta ile çözüm sunulacaktır. <br>Sorun, sertifika üretiminden kaynaklı hatalar ve garanti süresindeki donanımsal arızalardan  
(hatalı kullanım hariç) kaynaklanıyorsa garanti kapsamına girer. Bu tür durumlarda arıza yetkililer tarafından incelenip onaylandıktan sonra sertifika sahibine 
yeni bir sertifika verilir. Güncelleme bedeli KAMU SM tarafından karşılanır.

</div><!--içerik yazi bit--> 
</div><!--içerik bit--> 
</div><!--orta bitti-->
<div class="temizle">
</div>$eimza$,
  $eimza$Sertifika Güncelleme | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Sertifika Güncelleme.$eimza$,
  TRUE, 50
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-cancellation', 'tr',
  $eimza$Sertifika İptal$eimza$,
  $eimza$<div class="icerik">
Sertifika sahibi KAMUSM Çağrı Merkezi'ni (444 5 576) arayarak sertifikasını iptal ettirebilir. 
<br>Çağrı Merkezinden yapılan başvurularda, sertifika sahibinin kimliği KAMUSM sisteminde tanımlı bilgileri kullanılarak doğrulanır ve iptal işlemi yerine getirilir.
<br><br>Herhangi bir nedenle  iptal edilen NES tekrar kullanılamaz.
       
</div><!--içerik yazi bit-->
</div><!--içerik bit-->
</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Sertifika İptal | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Sertifika İptal.$eimza$,
  TRUE, 51
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-info-update', 'tr',
  $eimza$Sertifika Bilgi Güncelleme$eimza$,
  $eimza$<div class="icerik">
Sertifika sahibi; kurum birimi, adres, telefon numaraları gibi iletişim bilgilerini güncellemek için 444 5 576 Kamu SM Çağrı Merkezi ile görüşmelidir.

</div><!--içerik yazi bit--> 
</div><!--içerik bit-->
</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Sertifika Bilgi Güncelleme | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Sertifika Bilgi Güncelleme.$eimza$,
  TRUE, 52
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-password', 'tr',
  $eimza$Şifre İşlemleri$eimza$,
  $eimza$<div class="icerik">
<p>PIN çözme ekranlarının sağlıklı çalışması için bilgisayarınızda Java'nın 1.8 ve üzeri sürümünün kurulu olması gerekmektedir.<br> 
           (Google Chrome ile Java eklentisi sorunu yaşayabilirsiniz! Mozilla Firefox veya Internet Explorer gibi farklı tarayıcılar kullanabilirsiniz)</p>

        <p><b>Yeni NES PIN Oluşturma</b><br>
           Yeni üretilmiş sertifikanız, eski sertifikanızın süresi bittiğinde geçerli olacaktır. Eskisinin 
           süresi dolduktan sonra <b>yeni sertifikanızı kullanabilmeniz </b> için yeni PIN almalısınız. Gerekli adımlar ve uyarıların bulunduğu broşüre 
           <a href="https://kamusm.bilgem.tubitak.gov.tr/dokumanlar/yonergeler/nes/nes_kilit_cozme/?info=1">
           https://kamusm.bilgem.tubitak.gov.tr/dokumanlar/yonergeler/nes/nes_kilit_cozme/?info=1</a> adresinden ulaşabilirsiniz.</p>

      <p><b>Kilit Çözme</b><br>
         PIN bilgisinin güvenli olarak muhafaza edilmesi kart sahibinin sorumluluğundadır. PIN'in 3 (üç) kere hatalı girilmesi durumunda 
        <a href="https://onlineislemler.kamusm.gov.tr/landing/"><b>https://onlineislemler.kamusm.gov.tr/landing</b></a> sayfasından giriş yapılarak
        <b>Kilit Çözme</b> seçeneği ile yeni PIN belirleme işlemi yapılmalıdır. PUK kodu ile kesinlikle işlem yapmayınız. Yetkisiz veya hatalı olarak yapılan 3 (üç) PUK giriş denemesi
        sonrası kart bir daha kullanılamayacak biçimde kullanım dışı kalır. Bu durumda kart ücreti sertifika sahibi tarafından karşılanır.</p>

      <p>Yardım için 444 5 576 KAMUSM Çağrı Merkezini arayabilir veya Başkanlığımızın <a href="https://bidbdestek.hacettepe.edu.tr/login.php">Sorun Bildirim Destek</a>
         sayfasından form doldurabilirsiniz.</p>
      
 </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Şifre İşlemleri | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Şifre İşlemleri.$eimza$,
  TRUE, 53
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-unit-officers', 'tr',
  $eimza$Birim E-İmza Sorumluları$eimza$,
  $eimza$<div class="icerik">
<table cellspacing="0" cellpadding="0">
            <col width="230" />
            <col width="310" />
            <col width="94" />
            
            <tr height="41">
              <td height="41" width="230"><b>BİRİM</b></td>
              <td width="310"><b>E-İMZA SORUMLUSU</b></td>
              <td width="94"><b>TELEFON</b></td>
              
            </tr>
            
            
 <tr height="26">
              <td height="26">Bilgisayar ve Bilişim Fakültesi </td>
              <td>Latif ELVAN</td>
              <td> </td>              
            </tr>


              <tr height="26">
              <td height="26">Eczacılık Fakültesi </td>
              <td>Umut Emre AYGÜL</td>
              <td>3052148</td>
              
            </tr>
            <tr height="26">
              <td height="26">Edebiyat Fakültesi</td>
              <td>Gökçen RUTBİL</td>
              <td>2976810</td>              
            </tr>

            <tr height="26">
              <td height="26">Eğitim Fakültesi</td>
              <td>Gamze YILMAZ</td>
              <td>2976820</td>              
            </tr>

            <tr height="26">
              <td height="26">Fen Fakültesi </td>
              <td>Gülnihal DOĞRUYOL ASLAN</td>
              <td>2976855</td>
            </tr>

            <tr height="26">
              <td height="26">Fizik Tedavi ve Reh. Fak</td>
              <td>Perihan IĞDIR</td>
              <td>3051576</td>              
            </tr>
              
            
            <tr height="26">
              <td height="26">Güzel Sanatlar Fakültesi</td>
              <td>Tuba DEMİR, Erhan YEŞİLÖZ</td>
              <td>2976840</td>
              
            </tr>
            <tr height="26">
              <td height="26">Hemşirelik Fakültesi </td>
              <td>Hülya ÇOLAK, Gökhan DEMİR</td>
              <td>3051580</td>
              
            </tr>
            <tr height="26">
              <td height="26">Hukuk Fakültesi </td>
              <td>Aysel TAŞKIN</td>
              <td>2976270</td>
              
            </tr>
            <tr height="26">
              <td height="26">İkt.ve İdari Bilimler Fak. </td>
              <td>Hamdi KAPLAN</td>
              <td>2976830</td>
              
            </tr>
            <tr height="26">
              <td height="26">İletişim Fakültesi </td>
              <td>Zehra SARAÇ</td>
              <td>2976225</td>
              
            </tr>
            <tr height="26">
              <td height="26">Mühendislik Fakültesi</td>
              <td>Celal YURT</td>
              <td>2976800</td>              
            </tr>

            <tr height="26">
              <td height="26">Sağlık Bilimleri Fakültesi </td>
              <td>Alev ŞAKACI</td>
              <td>3052051</td>              
            </tr>

            <tr height="26">
              <td height="26">Spor Bilimleri Fakültesi</td>
              <td>Aslan YAZAR</td>
              <td>2976890</td>              
            </tr>

            <tr height="26">
              <td height="26">Tıp Fakültesi </td>
              <td>Uğur KAYA</td>
              <td>3051080</td>              
            </tr>
            
            <tr height="26">
              <td height="26">Atatürk İlke. ve İnk.Tar.Ens. </td>
              <td>Aylin TAŞ</td>
              <td>2976870</td>
              
            </tr>
            <tr height="26">
              <td height="26">Bilişim Enstitüsü </td>
              <td>Semra CEDİMOĞLU</td>
              <td>2976462</td>
              
            </tr>
            <tr height="26">
              <td height="26">Çocuk Sağlığı Ens. </td>
              <td>Nurten TÖRE</td>
              <td>3051399</td>
             
            </tr>
            <tr height="26">
              <td height="26">Eğitim Bilimleri Ens. </td>
              <td>Serap AKKAYA	</td>
              <td>2978572</td>
              
            </tr>
            <tr height="26">
              <td height="26">Fen Bilimleri Ens. </td>
              <td>Temel ÖZDEMİR</td>
              <td>2976865</td>
              
            </tr>
            <tr height="26">
              <td height="26">Güzel Sanatlar Ens. </td>
              <td>Lale ÖZDEMİR</td>
              <td>2978754</td>
              
            </tr>
            <tr height="26">
              <td height="26">Halk Sağlığı Ens. </td>
              <td>Seval ÖZDEMİR</td>
              <td>3053141</td>
              
            </tr>
            <tr height="26">
              <td height="26">Kanser Enstitüsü</td>
              <td>Gülay ÇELİK</td>
              <td>3052994</td>
              
            </tr>
            <tr height="26">
              <td height="26">Nörolojik Bil. ve Psi.Ens. </td>
              <td>Meltem ANLI</td>
              <td>3052130</td>
              
            </tr>
            <tr height="26">
              <td height="26">Nüfus Etütleri Ens. </td>
              <td>Semra CEDİMOĞLU</td>
              <td>3051115</td>
              
            </tr>
            <tr height="26">
              <td height="26">Nükleer Bilimler Ens. </td>
              <td>Banu TAŞKIRAN</td>
              <td>2976880</td>
              
            </tr>
            <tr height="26">
              <td height="26">Sağlık Bilimleri Ens. </td>
              <td>Onur ASLANER</td>
              <td>3051554</td>
              
            </tr>
            <tr height="26">
              <td height="26">Sosyal Bilimler Ens. </td>
              <td>Doç.Dr.Mutlu ER</td>
              <td>2976860</td>
              
            </tr>
            <tr height="26">
              <td height="26">Türkiyat Araştırmaları Ens. </td>
              <td>Meral UZUN</td>
              <td>2976771</td>
              
            </tr>
            <tr height="26">
              <td height="26">Yabancı Diller YO</td>
              <td>Mehtap KOCAOĞLU</td>
              <td>2978085</td>
              
            </tr>
            <tr height="26">
              <td height="26">Mesleki Teknoloji YO </td>
              <td>Ayhan DURSUN</td>
              <td>2976885</td>
             
            </tr>
            <tr height="26">
              <td height="26">Hacettepe ASO 1.OSB MYO </td>
              <td>Doç.Dr.Şener KARABULUT</td>
              <td>2672030</td>
              
            </tr>
</tr>
            <tr height="26">
              <td height="26">Başkent OSB Tek.Bil.MYO </td>
              <td>Canip PERÇİN</td>
              <td>5020469</td>
              
            </tr>
            <tr height="26">
              <td height="26">Sağlık Hizmetleri MYO </td>
              <td>Sadike Baltacı Ertaş</td>
              <td>3051433</td>
              
            </tr>
            <tr height="26">
              <td height="26">Sosyal Bilimler MYO </td>
              <td>Nihat SELÇUK</td>
              <td>3116015</td>
              
            </tr>
                       
            <tr height="26">
              <td height="26">Ankara Devlet Konser. </td>
              <td>Münevver YENİÇELİK</td>
              <td>2126210</td>
              
            </tr>
             <tr height="26">
              <td height="26">Hukuk Müşavirliği</td>
              <td>Ahmet KARABOĞA</td>
              <td>3052346</td>
              
            </tr>
            <tr height="26">
              <td height="26">İç Denetim Birimi</td>
              <td>Ayşe DİLBEROĞLU</td>
              <td>3052552</td>
              
            </tr>
            <tr height="26">
              <td height="26">İdari ve Mali İşler DB</td>
              <td>İbrahim SEZER</td>
              <td>3054107</td>
              
            </tr>
            <tr height="26">
              <td height="26">Kütüphane ve Dök. DB</td>
              <td>Serpil VAROL</td>
              <td>2976585</td>
              
            </tr>
            <tr height="26">
              <td height="26">Öğrenci İşleri DB</td>
              <td>Özkan AY</td>
              <td>2976570</td>
              
            </tr>
            <tr height="26">
              <td height="26">Personel DB</td>
              <td></td>
              <td></td>
              
            </tr>
            <tr height="26">
              <td height="26">Sağlık, Kültür ve Spor DB</td>
              <td>Murat GÜNAYDIN</td>
              <td>3051759</td>
              
            </tr>
            <tr height="26">
              <td height="26">Strateji Geliştirme DB</td>
              <td>Murat AKBAY</td>
              <td>3052188</td>
              
            </tr>
            <tr height="26">
              <td height="26">Yapı İşleri ve Teknik DB</td>
              <td>Kenan KORKMAZ</td>
              <td>2972447</td>
              
            </tr>
            <tr height="26">
              <td height="26">Bilimsel Araştırma Proje.</td>
              <td>Leyla SEVİM</td>
              <td>2976133/118</td>
              
            </tr>
            <tr height="26">
              <td height="26"><div align="left">Sağlık Hizmetleri Brm</div></td>
              <td>İlkem DEMİRCİ</td>
              <td>3053146</td>
              
            </tr>
          </table>
          
      </div><!--içerik yazi bit-->    
        
        
    </div><!--içerik bit-->

</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$Birim E-İmza Sorumluları | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: Birim E-İmza Sorumluları.$eimza$,
  TRUE, 54
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, published, sort_order)
VALUES (
  'e-signature-faq', 'tr',
  $eimza$E-İmza Sık Sorulan Sorular$eimza$,
  $eimza$<div class="icerik">
<p><a href="#SSS1">Elektronik imzanın hukuki sonuçları nedir?</a></p>
<p><a href="#SSS2">Elektronik imza almak istiyorum, ne yapmalıyım?</a></p>
<p><a href="#SSS3">Başvuru formu için e-postama başvuru erişim parolası gelmedi?</a></p>
<p><a href="#SSS4">Güvenlik Sözcüğü nedir? Unuttum ne yapmalıyım?</a></p>
<p><a href="#SSS5">Başvuru formunu nasıl doldurabilirim?</a></p>
<p><a href="#SSS6">İmzalama yönteminin seçilmesi</a></p>
<p><a href="#SSS7">E-imza kurulum için ne yapmalı?</a></p>
<p><a href="#SSS8">Pin/Puk bilgisini kaybettim</a></p>
<p><a href="#SSS9">E-imzamı kaybettim, ne yapmalıyım?</a></p>
<p><a href="#SSS10">E-imza token'ımın arızalı olduğunu düşünüyorum?</a></p>
<p><a href="#SSS11">E-imzamı nasıl yenilerim?</a></p>
<p><a href="#SSS12">Değişen kimlik bilgilerimi nasıl güncellerim?</a></p>
<p><a href="#SSS13">Nasıl yardım alabilirim?</a></p>

	  	  <p><a name="SSS1"><strong>SSS 1 : Elektronik imzanın hukuki sonuçları nedir?</strong></a> <br/>
                Elektronik İmza Kanunu’nda; güvenli elektronik imza, elle atılan imzaya eşdeğer kabul edilmiş ve elektronik imza ile oluşturulmuş verilerin senet hükmünde olacağı belirtilmiştir. Ancak kanunların resmi şekle veya özel bir merasime tabi tuttuğu hukuki işlemler ile teminat sözleşmelerinin güvenli elektronik imza ile gerçekleştirilemeyeceği hükme bağlanmıştır.  Diğer bir deyişle, kanunların merasimi ya da üçüncü tarafların şahitliğini gerek gördüğü emlak alım satımı, veraset ve intikal, evlenme gibi işlemler elektronik imza ile gerçekleştirilememektedir.</p>
          

         	 <p><a name="SSS2"><strong>SSS 2 : Elektronik imza almak istiyorum, ne yapmalıyım?</strong></a> <br/>
          	  Üniversitemiz, "Elektronik Belge Yönetim Sistemleri - EBYS" kullanarak kurum içi ve kurum dışı yazışmalarda evrak üzerine ıslak 
	 	  imza atmaya yetkili personele (EBYS de tanımlı idari görevi bulunan) elektronik imza temini yapacaktır. Paraf atanlara e-imza alınmayacaktır.<br> 
	  	 Yönetsel görevi olan personel için e-imza talepleri (Fakülte/Enstitü/MYO/YO/Konservatuvar/Daire Başkanlığı) idare amirlikleri tarafından Bilgi İşlem Daire Başkanlığı'na yapılacaktır.
		<br><br>
		  TÜBİTAK projeleri devam eden veya yeni proje başvurusunda bulunacak akademisyenlerimiz e-imza kullanma ihtiyaçlarını, TC no, kurum eposta, proje numarası 
		 ve proje adı bilgilerininde bulunduğu bir dilekçe ile Dekanlık/Enstitü Müdürlüklerine iletebilirler.</p>


		<p><a name="SSS3"><strong>SSS 3 : Başvuru formu için erişim parolası gelmemiş ise ne yapmalıyım?</strong></a> <br/>
       		 Nadir olarak TÜBİTAK KAMUSM’den gönderilen e-posta teknik aksaklıklar nedeniyle ulaşmayabilir.  
		 Bu durumda <a href="https://basvuru.kamusm.gov.tr/bs/sifreunutma.go">https://basvuru.kamusm.gov.tr/bs/sifreunutma.go</a> linkininden yeniden eposta gönderilmesini sağlayabilirsiniz.
		 Eğer bilgilerinizde bir hata yoksa e-posta adresinize tekrar parola gönderilecektir. 
		 <br>Bilgilerinizde bir hata varsa eimza@hacettepe.edu.tr adresine eposta gönderebilirsiniz.</p> 


		<p><a name="SSS4"><strong>SSS 4 : Güvenlik Sözcüğü nedir? Unuttum ne yapmalıyım?</strong></a> <br/>
        	   E-imza Kullanma Rehberi web sayfamızın Sertifika İşlemleri > Güvenlik Sözcüğü Yenileme sekmesinden ayrıntılı bilgi alabilirsiniz.</p>


		<p><a name="SSS5"><strong>SSS 5 : Başvuru formunu nasıl doldurabilirim?</strong></a></br>
		   İlgili <a href="http://www.bidb.hacettepe.edu.tr/eimza/indir/yrd_bidb_basvuru_form_doldurma.pdf">web sayfasından </a> ayrıntılı bilgi alabilirsiniz.</p>


	 <p><a name="SSS6"><strong>SSS 6 : İmzalama yönteminin seçilmesi</strong></a> <br/>
            Başvuru formu doldururken bu kısımda geçerli bir Nitelikli Elektronik Sertifikası olan kullanıcılar yenileme ve güncelleme işlemleri için 
	   <font color="#339900">Elektronik İmzalı Başvuru Arayüzü’nü,</font> ilk defa sertifika alacak olanlar <font color="#339900">Islak İmzalı Başvuru Arayüzü'nü</font> kullanarak imzalama yapar.
           <br /><img src="https://bidb.hacettepe.edu.tr/eimza/images/imzalama_methodu.jpg" width="600" height="417" /></p>


	 <p><a name="SSS7"><strong>SSS 7 : E-imza kurulum için ne yapmalıyım?</strong></a></br>
	   - KamuSM Çağrı Merkezi 444 5 576 'yı arayabilir<br>
	   - Elektronik İmza Kullanım Rehberi <a href="http://www.bidb.hacettepe.edu.tr/eimza/indir/yrd_bidb_sertifikami_aldim_ne_yapmaliyim.pdf"> web sayfasından</a> yardımcı dokümanları takip edebilir <br>
	   - Bilgi İşlem Daire Başkanlığı Sorun Bildirim Destek <a href="https://bidbdestek.hacettepe.edu.tr/login.php"> web sayfasından</a> form doldurabilirsiniz.</p>


	<p><a name="SSS8"><strong>SSS 8 : PIN/PUK bilgisini kaybettim</strong></a><br/>
	    E-imza Kullanma Rehberi web sayfamızın <a href="https://bidb.hacettepe.edu.tr/eimza/sifre.php">Şifre İşlemleri </a> sekmesinden ayrıntılı bilgi alabilirsiniz.</p>        


	<p><a name="SSS9"><strong>SSS 9: E-imzamı kaybettim, ne yapmalıyım?</strong></a> <br/>
	   E-imzanızı kaybetmeniz durumunda güvenlik nedeniyle iptali için vakit geçirmeden TÜBİTAK KAMUSM Çağrı Merkezini arayarak iptal ettirmeli 
	   ardından sertifikanızın yeniden üretilmesi için <strong>Kurum Yetkiliniz</strong> ile (eimza@hacettepe.edu.tr) iletişime geçmelisiniz.
	   Kayıp durumlarında üretim bedeli bireysel karşılanır. </p> 


	<p><a name="SSS10"><strong>SSS 10: E-imza token'ımın arızalı olduğunu düşünüyorum?</strong></a><br /> 
	   Çapraz kontrol sonucu (başka bir bilgisayarda kullanım ve başka bir sertifika ile kullanım) çalışmıyorsa TÜBİTAK KAMUSM Çağrı Merkezini
	  (444 5 576) arayarak destek alabilirsiniz. TÜBİTAK garanti kapsamındaki arızalarda tokenı değiştirir, kullanıcı kaynaklı arızalarda ise 
	  token bedeli sertifika sahibi tarafından bireysel karşılanır. </p>


	<p><a name="SSS11"><strong>SSS 11 : E-imzamı nasıl yenilerim?</strong></a><br />
           Geçerlilik süresi 1-3 ay içinde dolacak olan sertifikaların yenileme işlemleri idari görevi devam eden sertifika sahipleri için yapılır.</p>


	<p><a name="SSS12"><strong>SSS 12 : Değişen kimlik bilgilerimi nasıl güncellerim?</strong></a><br />Değişen kimlik bilgileriniz  (ad. soyad) için sertifikanın güncellenmesi, yani yeniden 
           üretilmesi gereklidir. Değişen kimlik bilgilerinizi ve TC numaranızı eimza@hacettepe.edu.tr adresine mail atarak sertifikanızın bireysel ödemeli olarak yeniden üretilmesini talep edebilirsiniz.</p>
         

	<p><a name="SSS13"><strong>SSS 13 : Nasıl yardım alabilirim?</strong></a> <br/>
           KAMUSM Çağrı Merkezinden  (444 5 576)<br />
           <a href="http://www.kamusm.gov.tr/">KAMUSM web sayfası</a>ndan <br />
           <a href="http://www.bidb.hacettepe.edu.tr/eimza/index.php">E-imza Kullanma Rehberi</a> web sayfasından<br />
           <a href="https://bidbdestek.hacettepe.edu.tr/login.php">Sorun Bildirim Destek</a>  web sayfasından form doldurarak<br> yardım alabilirsiniz. </p> 
 


</div><!--içerik yazi bit-->    
</div><!--içerik bit-->
</div><!--orta bitt-->
<div class="temizle">
</div>$eimza$,
  $eimza$E-İmza Sık Sorulan Sorular | E-İmza Kullanma Rehberi$eimza$,
  $eimza$Hacettepe Üniversitesi e-imza kullanma rehberi: E-İmza Sık Sorulan Sorular.$eimza$,
  TRUE, 55
)
ON CONFLICT (slug, language) DO UPDATE
  SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
      seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
      updated_at = now();

-- Üst/sol menüdeki dış bağlantı iç sayfaya yönlendirilir.
UPDATE menu_item
SET external_url = NULL,
    page_id = (SELECT id FROM page WHERE slug = 'e-signature' AND language = 'tr')
WHERE label = 'E-İmza Kullanma Rehberi';

-- Ana sayfadaki kısayol da iç sayfaya bağlanır.
UPDATE shortcut SET url = '/tr/e-signature' WHERE url = '/eimza/';

-- Eski dış adresten gelen bağlantılar korunur.
INSERT INTO redirect (old_path, new_path) VALUES ('/eimza', '/tr/e-signature')
ON CONFLICT (old_path) DO UPDATE SET new_path = EXCLUDED.new_path;
