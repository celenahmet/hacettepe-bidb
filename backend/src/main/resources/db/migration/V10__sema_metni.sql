-- Organizasyon şeması görselden metne çevrilir.
--
-- GEREKÇE: Şema bir JPG dosyasıydı. Görsel olarak taşınan bilgi:
--   * ekran okuyucuya görünmez (görselde alt metni de yoktu),
--   * aranamaz, kopyalanamaz, çeviriye girmez,
--   * dar ekranda okunamayacak kadar küçülür,
--   * bir birim eklendiğinde tasarım programı olmadan güncellenemez.
--
-- Metne çevrildiğinde bunların hepsi çözülür. Şemanın kendisi bir hiyerarşi
-- olduğu için iç içe liste ile yazılır: yapı, sunumdan bağımsız olarak
-- işaretlemenin içinde durur. Kutular ve bağlantı çizgileri CSS ile çizilir.
--
-- Görseldeki metinler birebir korunur; yalnızca büyük harf yazımı sitenin
-- geri kalanıyla (personel sayfasındaki birim adları) uyumlu hâle getirilir.
-- Görsel dosyası sunucuda kalır, yalnızca sayfadan çıkarılır.

UPDATE page
SET content_html = regexp_replace(
      content_html,
      '<p align="center"><img[^>]*kurumsalsema[^>]*/?></p>',
      '<div class="sema">
  <ul class="sema-kok">
    <li>
      <span class="sema-ad sema-baskan">Daire Başkanı</span>
      <ul class="sema-dal">
        <li>
          <span class="sema-ad">Daire Başkan Yardımcısı (İdari)</span>
          <ul class="sema-birim">
            <li>BYS ve Bireysel İşlemler Birimi</li>
            <li>İnsan Kaynakları Destek Birimi</li>
            <li>Kullanıcı Destek Birimi (Beytepe)</li>
            <li>Kullanıcı Destek Birimi (Sıhhiye)</li>
            <li>Sistem Yazılımları Birimi</li>
            <li>Yazılım Geliştirme Birimi</li>
          </ul>
        </li>
        <li>
          <span class="sema-ad">İdari ve Mali İşler Birimi</span>
        </li>
        <li>
          <span class="sema-ad">Daire Başkan Yardımcısı (Teknik)</span>
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
</div>',
      'g')
WHERE slug = 'org-chart' AND language = 'tr';


-- Bilgi güvenliği politikasında tek maddelik <ol> düzeltilir.
--
-- Kaynak sayfada bu madde, kendisinden önceki 13 maddelik listeyle aynı
-- cümle yapısında ve aynı konuda; ancak ayrı bir numaralı listeye düşmüş.
-- Sonuç: sayfada tek başına duran anlamsız bir "1." Numaralandırma bir
-- sıra veya öncelik bildirmediği için madde, ait olduğu listeye alınır.
-- Metnin kendisine dokunulmaz.

UPDATE page
SET content_html = replace(
      content_html,
      '</ul>
<ol>
  <li>Yasalara,',
      '  <li>Yasalara,')
WHERE slug = 'security-policy' AND language = 'tr';

UPDATE page
SET content_html = replace(
      content_html,
      'uyum güvencesi sağlanır.</li>
</ol>',
      'uyum güvencesi sağlanır.</li>
</ul>')
WHERE slug = 'security-policy' AND language = 'tr';

UPDATE page SET updated_at = now()
WHERE slug IN ('org-chart', 'security-policy') AND language = 'tr';
