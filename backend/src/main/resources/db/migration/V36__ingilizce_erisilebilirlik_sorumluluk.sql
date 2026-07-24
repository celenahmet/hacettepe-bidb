-- İngilizce çeviri turu — ilk iki sayfa: Accessibility Statement, Disclaimer.
--
-- BU İKİ SAYFA KIRIKTI. Kaynaktan aktarılan EN kayıtları "Böyle bir sayfa
-- bulunmamaktadır!" (kaynak sitenin soft-404 mesajı) içeriyordu; İngilizce
-- ziyaretçi hukuki bir metne değil Türkçe hata mesajına düşüyordu. Bu
-- migration onları TR sayfanın tam ve doğru İngilizce çevirisiyle
-- değiştiriyor; başka hiçbir sayfaya dokunmuyor.
--
-- ÇEVİRİ İLKESİ: TR yapı birebir korunuyor. Aynı sayıda madde, aynı
-- <ul>/<li>, hatta TR kaynaktaki eksik kapanış etiketi (bölüm 3'ün <p>'si
-- kapanmadan bölüm 4 başlıyor) kasıtlı olarak İngilizce sürümde de aynen
-- tekrarlandı — yapı-koruyan çeviri kuralı, kaynağın kendi HTML
-- tutarsızlığını düzeltmeyi değil yalnızca metni çevirmeyi öngörüyor.
--
-- Bu iki sayfa "Kademe B" (politika/hukuki metin) sınıfındadır — kurum
-- onayı alınana kadar taslak kabul edilmelidir. Ancak mevcut hâl (kırık
-- sayfa) her durumda daha kötü olduğu için yayında tutulması uygun görüldü.
--
-- SEO alanları TR eşleriyle aynı kalıba uydu: seo_title/seo_description
-- boş bırakıldı, Seo servisi (frontend/src/app/core/seo.service.ts)
-- bunları sayfa başlığından otomatik üretiyor.

UPDATE page
SET title = 'Accessibility Statement',
    content_html = '<div class="icerik">
<p align="justify"><strong>1. Commitment Statement</strong><br />
  As the Hacettepe University Department of Information Technology, we are committed to making our digital services accessible to all users, including persons with disabilities. We continuously develop our website to bring it in line with the standards required to ensure that everyone can access information on an equal and independent basis.&nbsp; <br />
</p><p align="justify"><strong>2. Compliance Status</strong><br />
  This website is largely compliant with the&nbsp;<strong>WCAG 2.2 Level AA</strong>&nbsp;(Web Content Accessibility Guidelines) standards. The accessibility features currently active on our site are as follows:&nbsp; </p>
<ul>
  <li><strong>Accessibility Menu:</strong>&nbsp;Tools such as font size adjustment, contrast options, link highlighting and text-to-speech are available.</li>
  <li><strong>Keyboard Navigation:</strong>&nbsp;Support is provided for navigating between tabs using only the keyboard, without a mouse.</li>
  <li><strong>Image Descriptions:</strong>&nbsp;Work on providing alternative text (alt text) for significant images is ongoing.&nbsp; </li>
</ul>
<p align="justify"><strong>3. Known Limitations</strong><br />
  Some older archived documents (older directives in PDF format) or third-party integrations may not yet fully meet accessibility standards. Work on producing accessible versions of this content is ongoing.&nbsp; <br />
<p align="justify"><strong>4. Feedback and Contact</strong><br />
  If you encounter any accessibility barrier while using our site, or if you have a suggestion for improvement, please contact us:</p>
<ul>
  <li><strong>E-mail:</strong>&nbsp;bidb@hacettepe.edu.tr</li>
  <li><strong>Telephone:</strong>&nbsp;+90 312 297 62 62</li>
  <li><strong>Address:</strong>&nbsp;Hacettepe University Department of Information Technology, 06800 Beytepe / ANKARA&nbsp; </li>
</ul>
</p><p align="justify"><strong>5. Approval and Update Date</strong><br />
This statement was last updated on 28 April 2026

</div>',
    seo_title = NULL,
    seo_description = NULL,
    updated_at = now()
WHERE slug = 'accessibility' AND language = 'en';

UPDATE page
SET title = 'Disclaimer',
    content_html = '<div class="icerik">
<p align="justify">This site provides links to Internet sites that are controlled by third parties. Our institution has no interest whatsoever, in any way, in the information, products or services on these third-party sites. Likewise, our department can have no involvement in or control over any information or content that may be published on the websites of the relevant third parties. The information on this site and on third-party sites is provided *as is*, and no warranty, express or implied, is given.</p>
<p align="justify">The internal information provided on our site is supplied through an automation system, and its content is updated frequently. Nevertheless, our institution gives no warranty whatsoever as to the accuracy, precision, timeliness, reliability or any other aspect of the use, or the results of the use, of the materials on this site or on third-party sites; against any technical or human error, no natural or legal person may hold our institution liable for any material or non-material damage that a site visitor may sustain in connection with any information provided here. Should a visitor need to verify the accuracy of the information provided, they are required to make use of other sources.</p>
<p align="justify">By using this site, the visitor is deemed to have understood the warnings set out above and to have accepted liability for the compensation of any material or non-material damage that may arise.</p>

</div>',
    seo_title = NULL,
    seo_description = NULL,
    updated_at = now()
WHERE slug = 'disclaimer' AND language = 'en';
