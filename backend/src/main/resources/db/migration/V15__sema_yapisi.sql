-- Organizasyon şemasının işaretlemesi, gerçek bir şema çizilebilecek
-- biçimde düzenlenir.
--
-- SORUN: Üç dal eşit genişlikte üç sütuna diziliyordu. Ortadaki dal
-- ("İdari ve Mali İşler Birimi") tek satırdan ibaret olduğu için altında
-- kocaman bir boşluk kalıyor, şema dengesiz görünüyordu. Oysa o birim
-- diğer ikisiyle eşdeğer değil: bir yardımcılık değil, doğrudan Daire
-- Başkanına bağlı tek bir birim. Yani boşluk bir tasarım kazası değil,
-- yanlış eşitlemenin sonucuydu.
--
-- ÇÖZÜM: O birim, gövdeden ayrılan bir yan dal olarak işaretlenir
-- (sema-yan). İki yardımcılık ise gövdenin altında yan yana durur.
-- Böylece hem denge kurulur hem de şema doğruyu söyler: birim,
-- yardımcılıkların bir eşi değil Başkanlığa doğrudan bağlı bir kalemdir.
--
-- Hiyerarşi yine iç içe listede duruyor; sınıflar yalnızca çizimin
-- hangi ögeyi nereye koyacağını söylüyor. Metinler değişmedi.

UPDATE page
SET content_html = '<div class="icerik">

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

<div class="sema">
  <ul class="sema-kok">
    <li>
      <span class="sema-dugum sema-baskan">Daire Başkanı</span>
      <ul class="sema-dal">
        <li class="sema-yan">
          <span class="sema-dugum">İdari ve Mali İşler Birimi</span>
        </li>
        <li class="sema-kol">
          <span class="sema-dugum">Daire Başkan Yardımcısı <b>(İdari)</b></span>
          <ul class="sema-birim">
            <li>BYS ve Bireysel İşlemler Birimi</li>
            <li>İnsan Kaynakları Destek Birimi</li>
            <li>Kullanıcı Destek Birimi (Beytepe)</li>
            <li>Kullanıcı Destek Birimi (Sıhhiye)</li>
            <li>Sistem Yazılımları Birimi</li>
            <li>Yazılım Geliştirme Birimi</li>
          </ul>
        </li>
        <li class="sema-kol">
          <span class="sema-dugum">Daire Başkan Yardımcısı <b>(Teknik)</b></span>
          <ul class="sema-birim">
            <li>Ağ Birimi</li>
            <li>Sistem ve Ağ Birimi (Sıhhiye)</li>
            <li>Sistem ve Güvenlik Birimi</li>
            <li>Web Birimi</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>

</div>',
    updated_at = now()
WHERE slug = 'org-chart' AND language = 'tr';
