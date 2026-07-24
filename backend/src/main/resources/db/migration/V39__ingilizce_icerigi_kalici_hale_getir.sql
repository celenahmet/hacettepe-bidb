-- Önceki oturumlarda (Gemini destekli) İngilizce çevirinin büyük kısmı
-- doğrudan psql ile veritabanına yazıldı — hiçbiri Flyway migration'ı
-- olarak kayıtlı değildi. scratch/ klasöründeki ~120 translated_*.html
-- dosyası bunun kanıtı: iş fiilen bitmiş, ama veritabanı bir kez
-- sıfırlanırsa (docker compose down -v, temiz kurulum, CI) TÜM İngilizce
-- içerik — sayfalar, menüler, ana sayfa slaytları, hızlı erişim
-- kısayolları, son 10 haber — geri dönüşsüz kaybolurdu.
--
-- Bu migration, şu anki CANLI İngilizce veriyi olduğu gibi (V37/V38'in
-- düzelttiği eski bağlantılar ve karakter bozulmaları dahil, hepsi zaten
-- düzeltilmiş hâliyle) kalıcı hâle getiriyor. Metinler değiştirilmedi;
-- yalnızca sistemi yeniden üretilebilir kılıyor.
--
-- İki ek düzeltme aynı migration'da:
--  1. EN 'about'/'management' slug'ları, TR tarafının 2016 sonrası mimarisiyle
--     (overview/org-chart) hizalanıyor. TR ana sayfa slaytı zaten
--     /tr/overview kullanıyordu; EN slaytı da /en/about'a değil artık
--     var olan /en/overview'a işaret ediyor olmalı. menu_item de aynı
--     yeniden adlandırmayla güncelleniyor. page_id sabit kaldığı için
--     (UPDATE ile yeniden adlandırma, silip yeniden ekleme değil) hiçbir
--     menü bağlantısı kopmuyor.
--  2. Ana sayfa slaytındaki iki kırık İngilizce bağlantı düzeltildi:
--     /en/network-internet ve /en/wireless-access sayfaları hiç var
--     olmadı — doğrusu /en/network ve /en/wireless.

-- 'overview'/'org-chart' slug'ları altında AYRICA iki kayıt daha vardı (id
-- 202, 201) — güncel TR kaynağıyla karşılaştırıldığında bunların TR
-- 'overview' sayfasının gerçek 11 birimini değil, tamamen farklı/uydurma
-- bir birim listesini (Software and Database Development, System, Help
-- Desk...) çevirdiği görüldü. Canlı EN menüsü YANLIŞLIKLA bu ikisine
-- bağlıydı; doğru, kaynakla birebir örtüşen çeviri 'about'/'management'
-- slug'ları altında menüden kopuk duruyordu. Yanlış olanlar siliniyor,
-- doğrular aşağıda doğru slug'lara taşınıyor.
DELETE FROM menu_item WHERE page_id IN (
  SELECT id FROM page WHERE slug IN ('overview', 'org-chart') AND language = 'en'
);
DELETE FROM page WHERE slug IN ('overview', 'org-chart') AND language = 'en';

UPDATE page SET slug = 'overview' WHERE slug = 'about' AND language = 'en';
UPDATE page SET slug = 'org-chart' WHERE slug = 'management' AND language = 'en';

-- === Sayfalar (page, language='en') ===
INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('overview', 'en', 'General Overview', '
<div class="icerik">

    <p align="justify"><strong><u>Network Unit (Beytepe):</u></strong> Performs the installation of the local network, manages and audits the existing network, develops projects regarding the future of the network, and provides the necessary infrastructure, hardware, software, and information support to provide internet usage services to users. </p>
    <p align="justify"><strong><u>Network and System Unit (Sıhhiye):</u></strong> Performs the installation of the local network, manages and audits the existing network, develops projects regarding the future of the network, and provides the necessary infrastructure, hardware, software, and information support to provide internet usage services to users. It operates, updates, and backs up all server computers hosted by our Department and basic internet services (DNS, FTP, WEB, E-MAIL, WEBMAIL, PROXY, etc.) within the framework of Law No. 5651 on the Regulation of Publications on the Internet and Combating Crimes Committed by Means of Such Publications, the Regulation on the Procedures and Principles for the Issuance of Activity Certificates to Access Providers and Hosting Providers by the Telecommunications Authority, and the Regulation on the Procedures and Principles for the Regulation of Publications on the Internet.</p>
    <p align="justify"><strong><u>System and Security Unit (Beytepe):</u></strong> It operates, updates, and backs up all server computers hosted by our Department and basic internet services (DNS, FTP, WEB, E-MAIL, WEBMAIL, PROXY, etc.) within the framework of Law No. 5651 on the Regulation of Publications on the Internet and Combating Crimes Committed by Means of Such Publications, the Regulation on the Procedures and Principles for the Issuance of Activity Certificates to Access Providers and Hosting Providers by the Telecommunications Authority, and the Regulation on the Procedures and Principles for the Regulation of Publications on the Internet. It ensures the security of the system room and the Uninterruptible Power Supply room.</p>
    <p align="justify"><strong><u>System Software Unit:</u></strong> Provides the maintenance, backup, and administration of applications, database and application servers operating within the framework of management systems, and ensures the coordination of these systems with other systems administered by the Department of Information Technology.</p>
    <p align="justify"><strong><u>Software Development Unit:</u></strong> Determines the most appropriate solution method by evaluating the software needs submitted in order to transfer the works of the units within our university to the computer environment and to produce the requested reports over the collected data. It evaluates the needs, analyses them, and offers solution proposals for the fulfilment of the software need that arises during both administrative and academic works and for ensuring integration with other existing software if deemed necessary.</p>
    <p align="justify"><strong><u>EDMS and Individual Transactions Unit:</u></strong> It operates in the areas of running our University''s Management Systems EDMS (Electronic Document Management System) and IT (Individual Transactions) systems, and providing end-user support to our personnel using these systems. It makes the initial application for the Qualified Electronic Certificate (QEC) required for Electronic Signature on behalf of the university personnel to the TÜBİTAK Public Certification Authority, manages the process from the application to the Public Certification Authority until the delivery of the QEC to the relevant personnel, and supports the relevant university personnel in cases of loss, theft, cancellation, and renewal. It supports the university personnel for the installations needed in Electronic Signature applications, informs the University personnel about the Electronic Signature process via web page and&nbsp; e-mail, and ensures coordination in correspondence, administrative procedures, and technical matters between the Department of Information Technology and the Public Certification Authority.</p>
    <p align="justify"><strong><u>Administrative and Financial Affairs Unit:</u></strong> Prepares the estimated budget of our Department for the following year. Makes the purchases related to the budget items under its expenditure authority. Prepares the first six-month and annual Unit Activity Reports. Prepares its 5-year strategic plan. Prepares the unit monitoring report in 3-month periods during the year. By managing the Unit Movable Registry Control System, it performs procedures such as movable entry, exit, scrapping, and intra-unit fixture consignments. Coordinates maintenance and repair works within the Department. Creates requirement lists by gathering the needs of the Department Units at certain periods. Prepares and presents the reports requested by the management.</p>
    <p align="justify"><strong><u>Human Resources Unit:</u></strong> Operates our University''s Human Resources Management System (HRMS) and provides end-user support to the personnel and accrual users in the Department of Personnel, ensures the creation of Lists, Reports, and Statistical Tables that were not foreseen previously in the Human Resources Management System (HRMS), prepares the payrolls (Salary, Salary Differences, Revolving Fund, Duty, Additional Course, Bonus, Bonus Difference) of all employees of our University together with their legal attachments to the accrual directorates, and distributes the payroll given to the individual via e-mail.</p>
    <p align="justify"><strong><u>User Support Unit:</u></strong> 
Performs the maintenance and repair of computers and peripheral devices registered as fixtures within our University, reports those with hardware malfunctions that cannot be repaired, and ensures that the additional hardware present in the computer is introduced to the system. 
<br>The "Call Centre" located within this unit provides telephone support regarding the opening of electronic mail accounts, password change requests, and e-mail accounts. Responds to requests received via the Problem Notification and Support System. Provides technical support (installation of hardware such as computers, printers, projectors, etc.) for the events (conferences, congresses) organised by the units of our University, and responds to the requests for help reaching the Department via telephone. 
<br>Operates and updates the interface of the Software Repository, which contains licensed and free programmes serving over the internet.
   


 <p align="justify"><strong><u>Web Unit:</u></strong> Carries out the duties of configuring and updating the Hacettepe University web page, creating web pages for Academic/Administrative Units, Student Societies, and Organisations, and providing technical support for the personal web pages of Academic/Administrative Personnel and Students.</p>
    <p align="justify"><strong><u>Computer Laboratories:</u></strong> Provides the operation of the laboratory with 75 computers serving at our University''s Sıhhiye Campus.</p>

</div>
', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('accessibility', 'en', 'Accessibility Statement', '
<div class="icerik">
<p align="justify"><strong>1. Statement of Commitment</strong><br />
  As Hacettepe University Department of Information Technology, we are committed to making our digital services accessible to all users, including individuals with disabilities. We are continuously improving our website to bring it to standards that will ensure everyone can access information equally and independently.&nbsp; <br />
</p><p align="justify"><strong>2. Compliance Status</strong><br />
  This website is largely compliant with&nbsp;<strong>WCAG 2.2 Level AA</strong>&nbsp;(Web Content Accessibility Guidelines) standards. The accessibility features currently active on our site are as follows:&nbsp; </p>
<ul>
  <li><strong>Accessibility Menu:</strong>&nbsp;Tools such as text size adjustment, contrast options, link highlighting, and screen reading are available.</li>
  <li><strong>Keyboard Navigation:</strong>&nbsp;Support is provided to navigate between tabs using only a keyboard without using a mouse.</li>
  <li><strong>Visual Descriptions:</strong>&nbsp;Alternative text (alt-text) efforts for important visuals are ongoing.&nbsp; </li>
</ul>
<p align="justify"><strong>3. Known Limitations</strong><br />
  Some old archive documents (old directives in PDF format) or third-party integrations may not yet fully meet accessibility standards. Our efforts to provide accessible versions of these contents are continuing.&nbsp; <br />
<p align="justify"><strong>4. Feedback and Contact</strong><br />
  If you encounter any accessibility barrier while using our site or have suggestions for improvement, please contact us:</p>
<ul>
  <li><strong>E-mail:</strong>&nbsp;bidb@hacettepe.edu.tr</li>
  <li><strong>Telephone:</strong>&nbsp;+90 312 297 62 62</li>
  <li><strong>Address:</strong>&nbsp;Hacettepe University Department of Information Technology, 06800 Beytepe / ANKARA&nbsp; </li>
</ul>
</p><p align="justify"><strong>5. Approval and Update Date</strong><br />
This statement was last updated on 28.04.2026

</div>
', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('alumni-email', 'en', 'Hacettepe University Alumni Account', '
<div class="icerik">
  <p>
    Improvement and development works have been carried out in Hacettepe University Electronic Mail Systems to help our users communicate more efficiently and effectively, and the <strong>new e-mail system (Microsoft Exchange)</strong> has been put into use as of 11 May 2022.</p><p>
    Taking into consideration the loyalty of our alumni to our University, based on the <strong><em>Senate decision dated 08.12.2022 and numbered 2022-000</em></strong> that came into effect, Hacettepe University alumni have been enabled to receive corporate e-mails without being a member of the Alumni Association. </p><p>
    <strong>Who Can Get an Alumni Account?</strong><br>
    All of our University members who have graduated by completing our University''s associate degree, bachelor''s degree, master''s degree, and doctoral programmes can benefit from this service.</p><p>
    <strong>How Can I Get My Alumni Account?</strong><br>
    According to the E-mail Directive, existing corporate electronic mail accounts with the <strong>@hacettepe.edu.tr</strong> extension are closed to use 90 days after the graduation date. After the user account is closed, the alumnus/alumna themselves can open an e-mail account by </p><p>
    1- Using the <strong>&ldquo;Create New Account&rdquo;</strong> button at <strong>https://portal.hacettepe.edu.tr</strong>, or<br>
    2- Applying in person to the Department of Information Technology with a document showing that they have graduated.<br>
    <strong>What is the Subdomain of the Alumni Account?</strong><br>
    The subdomain &ldquo;mezun.hacettepe.edu.tr&rdquo; will be used after the &ldquo;@&rdquo; sign in the alumni accounts to be opened.<br>
    <strong>Which Services Can I Benefit From with the Alumni Account?</strong></p>
  <ul>
    <li>The alumni accounts to be defined will only be able to be used for communication. </li>
    <li>Microsoft&rsquo;s Office 365 Mail Service will be used.</li>
    <li>In the provided mail service, each user is given 50GB of space where they can store their e-mails.</li>
  </ul>
  <p><em>In accordance with the protocols and agreements made by our University, our users who will receive an alumni account <strong>will not be able to benefit</strong> from our services such as proxy (e-resource) service, software in the software repository, and Office programmes.</em></p><p>
    <strong>How Can I Log In to My Alumni Account?</strong><br>
    After opening an alumni account from the Department of Information Technology Portal, you need to access your account by logging in through the <a href="https://outlook.office.com/" target="_blank">https://outlook.office.com/</a> interface.</p><p>
    <strong>I Forgot the Username of My Alumni Account, How Can I Find Out?</strong><br>
    You need to retrieve your username by using the &ldquo;I Forgot My Username&rdquo; button from the Department of Information Technology Portal.</p><p>
    <strong>I Forgot the Password of My Alumni Account, How Can I Find Out?</strong><br>
    You need to create a new password by using the &ldquo;I Forgot My Password&rdquo; button from the Department of Information Technology Portal.</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('ansys-011018', 'en', 'ANSYS Software Announcement', '
<div class="icerik"> + + + <strong>Dear Academic Staff and Students of Our University,</strong><br /> + <br /> + We have procured ANSYS software, a computer-aided engineering programme that enables analyses and simulations to be performed in engineering studies with computer assistance.<br /> + <br /> + ANSYS software is accessible to Hacettepe University staff and students; however, due to network licensing, it can only be used on computers within the campus.<br /> + <br /> + <strong>ANSYS Discovery AIM v19 (Windows 64 bit) </strong>DVD images and&nbsp; <strong>ANSYS Electromagnetics Suite v19 (Windows 64 bit) </strong>installation files can be obtained from our Software Repository. Detailed information and installation guides are available on the relevant page.<br />+ <br /> + Hacettepe University Department of Information Technology Portal (<a href="https://portal.hacettepe.edu.tr/">https://portal.hacettepe.edu.tr/</a>)<br /> + <br /> + <strong>Username:</strong> Your e-mail username (do not include @hacettepe.edu.tr)<br /> + <strong>Password:</strong> Your current e-mail password</p> + <p><a href="https://portal.hacettepe.edu.tr/" style="color:#006600; font-weight:bold">From the Portal left menu: &quot;BIDB APPLICATIONS &gt; Software Repository&quot;, then from the inner menu: &quot;Academic Software &gt; ANSYS Software&quot;</a></p> + + <p>For your information. Yours sincerely. <br /> + Department of Information Technology</p> + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('archive', 'en', 'Archive', '
<div class="icerik"> +  + <p><a href="/dosyalar/personelalimsonuc200123v1.pdf" target="_blank">Contracted IT Personnel Recruitment Examination Results (20.01.2023)</a></p> + <p><a href="/dosyalar/SozlesmeliBilisimPersoneliSinavSonuc_v01_160123.pdf" target="_blank">Written Examination Results and Oral Examination Information Regarding Contracted IT Personnel Recruitment</a> (Update 16.01.2023 Time: 15:41)</p> + + + + <p><a href="/dosyalar/SozlesmeliBilisimPersoneliSinavDuyurusu100123.pdf" target="_blank">List of Candidates Entitled to Sit the Examination as a Result of the Preliminary Review for Contracted IT Personnel Recruitment (10.01.2023)</a></p> + + <p>Regarding the Upgrade of PHP and MySQL Versions <span style="font-size: small;color:orange">(18.11.22)</span><br> In order to ensure the security of web pages, the PHP and MySQL versions running on the server will be upgraded to version 7 and above on 18/11/2022.<br> + The compatibility of PHP code used on web pages with the new PHP version must be verified. You may send your questions regarding the web service from your Hacettepe e-mail address to webmaster@hacettepe.edu.tr.</p> + + + <p>Regarding HTTPS Transition <span style="font-size: small;color:orange">(13.10.22)</span><br> + The https://alanadi.hacettepe.edu.tr addresses for the websites of Hacettepe University units have been made available.<br> + In order to reduce issues encountered at https://alanadi.hacettepe.edu.tr addresses, please do not use the www prefix for hacettepe.edu.tr addresses on your site.<br> + Web page administrators may send questions/issues regarding www-less and https addresses and https://alanadi.hacettepe.edu.tr to webmaster@hacettepe.edu.tr from their Hacettepe e-mail addresses.</p> + + + <p><a href="/en/email-migration">Information Regarding Hacettepe University New E-mail Service (Microsoft Exchange Service) (11.05.2022)</a></p> + <p><a href="/dosyalar/sinav_sonuc191121.pdf" target="_blank">Contracted IT Personnel Recruitment Examination Results (19.11.21)</a></p> + <p><a href="/dosyalar/katilimlist091121.pdf" target="_blank">Written Examination Results and Oral Examination Information Regarding Contracted IT Personnel Recruitment (09.11.21)</a></p> + <p><a href="/dosyalar/Aday-degerlendirme271021.pdf" target="_blank">List of Candidates Entitled to Sit the Examination as a Result of the Preliminary Review for Contracted IT Personnel Recruitment (27.10.2021)</a></p> + <p><a href="/en/notices">Contracted IT Personnel Examination Announcement (05.10.2021)</a></p> + + + <p><a href="/dosyalar/maviekran.pdf" target="_blank">Windows 10 20H2 03 KB5001567 Update Resolving Blue Screen Errors Has Been Released</a></p> + + <p><a href="/en/notice-121120">Secure E-mail Information Text</a></p> + <p><a href="/en/notice-110520">Applications Accessible from Within the Campus</a></p> + + <p><a href="/dosyalar/yonlendirmeiptal080920.pdf" target="_blank">Removal of Forwarding from the E-mail System</a></p> + <p><a href="/dosyalar/matlab090620.pdf" target="_blank">Free MATLAB Training Sessions</a></p> + + <p><a href="/dosyalar/BilgiIslemDairesi_UzaktanEgitim.pdf" target="_blank">Regarding Distance Education</a></p> + <p>Dear Members of the Hacettepe Community,<br> + It has been observed that the spread of the &ldquo;WannaCry&rdquo; and &ldquo;CryptoLocker&rdquo; viruses, which can render your important files inaccessible, has been increasing through various channels (worldwide, nationally, and within universities). It is important that your computers have antivirus software installed and that updates are checked to ensure you are not affected by this problem. Should antivirus software be needed, it can be installed or updated from the Department of Information Technology software repository. Users are kindly urged to prioritise this matter to avoid more serious problems in the future.<br>+ Yours sincerely,<br> + Department of Information Technology</p> + + + <p><a href="/dosyalar/isobelge2020.pdf" target="_blank">The 2019&#8211;2020 renewal of the ISO 27001 Information Security certificate has been completed.</a></p> + + <p><a href="/dosyalar/mac240819.pdf" target="_blank">Attention MAC Computer Users</a></p> + <p><a href="http://ogrenciyardim.hacettepe.edu.tr/" target="_blank">The Student Help Centre has been opened for use.</a></p> + + <p><a href="/tr/notice-051218">Regarding E-mail Settings</a></p> + <p><a href="/en/spss-081118">IBM SPSS Software for Our Students</a></p> + <p><a href="/en/matlab-061118">MATLAB Software for Our Students</a></p> + <p><a href="/en/sas-191018">SAS (Statistical Analysis Software) Software Announcement</a></p> + <p><a href="/en/ansys-011018">ANSYS Software Announcement</a></p> + + + <p><A href="/en/stylecc50-removal">Regarding the Removal of 50th Anniversary Logos from the Web Page</A></p> + <p><A href="https://eduroam.hacettepe.edu.tr/baglanti.html" target="_blank">iOS 11 Eduroam Connection Settings</A> + (You may follow updates regarding Eduroam connection settings on the <A href="http://eduroam.hacettepe.edu.tr/">http://eduroam.hacettepe.edu.tr</A> web page.) </p> + + + + + + <p><A href="/en/email">Regarding Hacettepe E-mail Password Operations</A></p> + <p><A href="/tr/owncloud">Hacettepe University Cloud Storage (Owncloud) service has been launched.</A> (Publication Date: 01.08.16) </p> + <p><A href="/en/notice-050416">Home directory access control for personal web pages (FTP)</A> (Publication Date: 05.04.16)</p> + + + + <p><A href="/dosyalar/epostaaktarimi.pdf" target="_blank">Mail Transfer from an Electronic Mail Account</A></p> + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('cms', 'en', 'Hacettepe University Content Management System', '
<div class="icerik">
<p>The Content Management System (HÜ-CMS), prepared by the Department of Information Technology and through which you can manage the content of your web pages, has been put into service.</p>
<p>This system has been prepared for page administrators who manage or will manage the web pages of our university''s units/departments. Individual users will receive an authorisation error when they log into the system.</p>
<p>Existing pages must apply via a petition to use the system. A sample petition is below.</p>
<TABLE width="100%" border="0" cellpadding="5">
  <TBODY>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon01.png"></TD>
      <TD align="left" valign="middle"><STRONG>What is HÜ-CMS?</STRONG><BR>
        HÜ-CMS is a web-based application through which you can centrally manage the content of your web pages. With this application, you can enter content into your web site and edit content. You can perform your processes through your browser without needing any program while making these arrangements.</TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon02.png"></TD>
      <TD align="left" valign="middle"><p><STRONG>System Login</STRONG><BR>
        You can log into the system via the <A href="http://hu-iys.hacettepe.edu.tr/">http://hu-iys.hacettepe.edu.tr/</A> address with your hacettepe.edu.tr email account information. You do not need another password to use the system.</p>
          <p><STRONG>Page Responsibility</STRONG><BR>
            When you log into the system, you can intervene in the pages you are responsible for. If you do not have a page responsibility definition for any page, you cannot use the system.</p></TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon03.png"></TD>
      <TD align="left" valign="middle"><p><STRONG>HÜ-CMS Components</STRONG></p>
          <OL>
            <LI>Menus</LI>
            <LI>Pages</LI>
            <LI>News and Announcements</LI>
            <LI>Photo Gallery</LI>
            <LI>Video Gallery</LI>
          </OL></TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon04.png"></TD>
      <TD align="left" valign="middle"><STRONG>Template Structure</STRONG><BR>
        The system uses the template prepared by the Department of Information Technology. When the template is changed centrally, the pages using the system will automatically start using the changed template.<BR>
        <BR>
        <STRONG>Multi-Language Support</STRONG><BR>
        Multi-language support is provided for the pages defined in the system.</TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon05.png"></TD>
      <TD align="left" valign="middle"><STRONG>File Management</STRONG><BR>
        You can use the file space defined separately for each page for the files (documents, images, etc.) you will use on your page.</TD>
    </TR>
    <TR>
      <TD width="128" align="left" valign="middle"><IMG src="/images/hu-iysicon06.png"></TD>
      <TD align="left" valign="middle"><p><STRONG>Who Can Use HÜ-CMS?</STRONG><BR>
        HÜ-CMS can be used by the following units.</p>
          <OL>
            <LI>Faculties</LI>
            <LI>Departments</LI>
            <LI>Units</LI>
            <LI>Research Centres</LI>
            <LI>Institutes</LI>
            <LI>Schools</LI>
            <LI>Vocational Schools</LI>
            <LI>Student Societies</LI>
            <LI>Congresses Organised by Hacettepe University</LI>
          </OL>
        <p><STRONG>How Can I Apply for HÜ-CMS?</STRONG><BR>
          To use HÜ-CMS, it is necessary to apply via an official letter with the <A href="/dosyalar/BGYS-F-23-IYSTalepFormurevizyon.docx"><STRONG>"HÜ-CMS Application Form"</STRONG></A>.</p></TD>
    </TR>
  </TBODY>
</TABLE>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('committees', 'en', 'Committees', '<div class="icerik">
<p><b>Quality Commission</b></p>

<table class="table table-bordered">
  <tbody>
    <tr>
      <td>Mustafa Gökhan Güzel</td>
      <td>Acting Head of Department</td>
      <td>Chair</td>
    </tr>
    <tr>
      <td>Görkem Çoruh</td>
      <td>Deputy Head of Department</td>
      <td>Member</td>
    </tr>
    <tr>
      <td>Ahum Barbaros</td>
      <td>Programmer</td>
      <td>Member</td>
    </tr>
    <tr>
      <td>Nazlı Özlem Onat</td>
      <td>Lecturer</td>
      <td>Member</td>
    </tr>
    <tr>
      <td>Taha Baş</td>
      <td>Engineer</td>
      <td>Member</td>
    </tr>
    <tr>
      <td>Sezgi Çobanbaş</td>
      <td>Student</td>
      <td>Student Quality Ambassador</td>
    </tr>
    <tr>
      <td>Melike Nur Erden</td>
      <td>Student</td>
      <td>Student Quality Ambassador</td>
    </tr>
  </tbody>
</table>



</div>', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('connection-security', 'en', 'About HU Internet Connection', E'
<div class="icerik">
 <p>Users sometimes cannot connect to the places they wish to connect to over the Internet, or they connect at slower speeds than usual. In such cases, the first thing that comes to the user''s mind is the possibility of a malfunction in our university''s external connection. However, Internet packets, which travel through various routes from the end user''s computer to a Web server on the other side of the world, can get stuck at any stage of these routes.</p>
 <p>When a user suspects their connection speed, they can guess where the problem lies by running some tests themselves. Some helpful information on this topic will be provided here. </p>
 <p>However, before providing this information, it is beneficial to briefly mention the routes and speeds through which our university connects to the outside world. </p>
 <p><strong>Hacettepe University''s Connection to the Outside World</strong></p>
 <p>The connections of our university''s units and departments outside the two main campuses are first established to one of these campuses, and the schools then connect to the outside world from there. For detailed information on this topic, please refer to the <a href="/en/network">Network Infrastructure</a> section.
 </p>
 <p>Different organisations in the world provide Internet services by receiving service from different ISP (Internet Service Provider) companies. These ISPs connect to other ISPs that operate larger backbones. And this scheme develops in layers. The routes between these are drawn by very large capacity &quot;router&quot; devices, and the optimum route is attempted to be calculated dynamically. </p>
 <p>If a computer user at Hacettepe University wishes to connect to a newspaper in the USA over the Web, the traffic is actually provided by packets passing through dozens of points, and this is calculated in a fraction of a second. Considering that the whole world''s packets travel back and forth on the same highways, and that traffic flows by confirming that the packets (small data blocks that make up Internet traffic) go from one place to another one by one, it is normal for some packets to &quot;get lost on the way&quot; and time out while waiting for an acknowledgement. Furthermore, when instantaneous or long-term interruptions of millions of existing connections are added to this, if a user experiences a problem connecting somewhere, they will simply complain that &quot;the connection is slow again&quot;. </p>
 <p>At this point, it may not be easy for a user to understand where the connection slowness originates from. It would be appropriate to mention some practical tests here for those who are curious: </p>
 <p><strong>Where is My Connection Slowing Down? How Can I Tell?</strong></p>
 <ol>
   <li><strong>The user can first start by checking their connection to the server closest to them:</strong> For example, they check their connection to other computers in their department. A practical method for this is the &quot;PING&quot; command. With this command, which is available in both Windows and Linux, you send a packet of a few Bytes from your computer to a point and measure how many seconds (milliseconds) it takes to return. For this, the personal firewall of the computer to be PINGed and/or the network switching devices in between must allow it. In different parts of Hacettepe, some ping traffic is intentionally blocked for network security reasons. [The ping command is executed in Windows by typing the command &quot;ping target_ip_address&quot; in the black command window obtained by typing Start-&gt;Run-&gt;cmd. Generally, two computers within the same network are not expected to ping each other slower than 1-2 ms.] </li>
   <li><strong>A Web site of the current institution can be tested.</strong> For example, those working in Beytepe need to check how quickly they access www.hacettepe.edu.tr, while those working in Sıhhiye need to check how quickly they access, for instance, the www.hacettepe.com.tr address located there. Sıhhiye can test its access to Beytepe (or vice versa) by mutually trying these addresses. </li>
   <li><strong>The connection to the nearest connected external ISP can be checked.</strong> For Hacettepe, this place is Ulakbim. Ulakbim''s Web site, www.ulak.net.tr, can be a test address for this. Those who are curious can determine the speed by trying to download appropriately sized files from this institution''s file sharing sites. For example, the address ftp.ulak.net.tr offers a large file archive. Or those who are more curious can try to reach Ulaknet using the &quot;traceroute&quot; command. This command is also available in Windows and Linux. The version in Windows is &quot;tracert&quot;. Again, if this command (and then the address to be visited) is typed instead of ping from the command line, the command will sequentially write the intermediate points (routers) it passes through to reach this point and the travel times of the packets to them (just like in ping). The places marked with &quot;*&quot; are unreachable places. &quot;Unreachability&quot; is either an inability to reach due to a malfunction at that point, or systems create the impression of being unreachable by not responding due to their security. At this point, the user cannot proceed further.
     <p><strong>If everything is normal up to this point, the user can think that at least there is no problem within Hacettepe University. To understand where the problem is after Hacettepe, it is necessary to continue:</strong> </p>
   </li>
   <li><strong>Access to other universities can be tested.</strong> This can be started by testing the connection to the Web pages of the closest universities such as Ankara, METU, Bilkent, and Gazi. In fact, as of the date this article was written, it is possible to go to METU''s Web address with &quot;traceroute&quot;. An example traceroute result from a PC in the Electronic Engineering Department in Beytepe is as follows:
     <pre>C:\\&gt;tracert www.metu.edu.tr    Tracing route to midyat.general.services.metu.edu.tr [144.122.144.160] over  a maximum of 30 hops:      1     4 ms     9 ms     9 ms  193.140.221.254  ---&gt; Electronic Eng. Router    2    13 ms    &lt;1 ms    &lt;1 ms  192.168.6.126    ---&gt; Campus Router    3     8 ms    &lt;1 ms     1 ms  192.168.216.250  ---&gt; Campus exit Router    4     8 ms     1 ms     1 ms  193.140.0.29     ---&gt; Ulakbim Router    5     7 ms     1 ms     1 ms  193.140.10.114   ---&gt; METU exit Router    6    10 ms     1 ms     1 ms  144.122.2.199    ---&gt; METU Service Router    7     2 ms     1 ms    &lt;1 ms  144.122.144.160  ---&gt; METU WEB server    Trace complete.  </pre>
   </li>
   <li><strong>Connections to Istanbul universities can be tested.</strong> This test can provide information about the status of the intercity private circuit provided by Ulakbim through Türk Telekom. </li>
   <li><strong>A connection to the Web site of a commercial organisation abroad can be tested.</strong> This test can be performed separately for an organisation in the USA and one in Europe. With this, a rough idea can be obtained about both the connection between TTNet and Ulakbim, and the situation at different international exits of TTNet. </li>
   <li><strong>Finally, a connection to the Web site of a university located abroad can be tested.</strong> Since Ulaknet''s connection to the world academic network is made through a different organisation than Türk Telekom, this test can provide an idea about the problem. If the problem is around Ulaknet''s Ankara building, this connection will also fail. </li>
 </ol>
 The tests above are undoubtedly suggested to give the user a simple idea; they do not allow reaching a definitive conclusion. It is always possible for addresses to change or for institutions to change their access policies. With a small search on the Internet, sites that allow performing speed tests can be found. However, these are generally tests prepared with users connecting closest to them in mind. They may not mean anything at all for remote users.
 <p>Although it is not necessary for a simple user, it can be recommended for curious users to do research on the Internet and try to learn how TCP/IP communication protocols work. Users are informed about foreseen or occurred problems on the main Web page of the Hacettepe University Department of Information Technology. </p>
 <p>Again, curious users can examine the Web pages showing Ulakbim''s network statistics and the graphs there. From here, both backbone traffic and exit graphs of individual universities can be accessed. If obvious interruptions stand out at a specific moment in the daily traffic, it can be considered that a malfunction has occurred at that point. The address of the page belonging to Ulakbim''s network statistics is: </p>
 <p><a href="https://stat.ulakbim.gov.tr/ulaknet/" target="_blank">https://stat.ulakbim.gov.tr/ulaknet/</a> </p>
 <p>Users can access a lot of different information from the links provided at this address. </p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('contact', 'en', 'Contact Information', '
<div class="icerik">


<p>Hacettepe University<BR>
  Department of Information Technology<BR>
  06800 Beytepe / ANKARA<BR>
  Tel: +90 312 297 62 00<BR>
  Fax: +90 312 299 20 88<BR>
  E-Mail: <A href="mailto:bidb@hacettepe.edu.tr">bidb@hacettepe.edu.tr</A><BR>
</p>
<p>You can access the contact information of the department staff via the <A href="/en/staff">Staff</A> link.</p>
<p><STRONG><A id="kroki_harita" href="javascript:;">Click here for the transportation map to Hacettepe University Department of Information Technology.</A></STRONG></p>
</div>
', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('database-query', 'en', 'Database Query Page', '
<div class="icerik"> +  + <p> + You can check your database information on the server with IP address 193.140.239.9 from this page. + + <p> + <FORM ACTION=''/hizmetlerweb/wkb/dblidya.php'' METHOD=''post''> + <table> + <tr> + <td>Database Name:<br><span class="small">(dbname)</span></td> + <td><input TYPE=''text'' NAME=''db'' class=''fe'' AUTOCOMPLETE=OFF><td> + </tr> + <tr> + <td>Database Username:<br><span class="small">(dbuser)</span></td> + <td><input TYPE=''text'' NAME=''user'' class=''fe'' AUTOCOMPLETE=OFF><td> + </tr> + <tr> + <td>Database Password:</td> + <td><input TYPE=''password'' NAME=''pw'' class=''fe'' AUTOCOMPLETE=OFF><td> + </tr> + + + <tr> + <td colspan=''2''><center> + <input type=''hidden'' name=''submitted'' value=''1''> + <input TYPE=''submit'' VALUE=''Check'' class=''fe''><input type=''reset'' value=''CLEAR'' class=''fe''></center></td>+ </tr> + </table> + </form> + + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('disclaimer', 'en', 'Disclaimer', '
<div class="icerik">
<p align="justify">This site provides links to Internet sites controlled by third parties. There is absolutely no connection of interest between our institution and the information, products, and services on these third-party sites. Furthermore, our department has no relation to or control over any information and content that the relevant third parties may publish on their websites. The information on this site and third-party sites is provided *as is*, and no explicit or implicit guarantee is given.</p>
<p align="justify">The internal information provided on our site is supplied through an automation system, and its content is updated frequently. Nevertheless, our institution does not provide any guarantee regarding the use or the results of the use of the materials on this site or on third-party sites in terms of accuracy, precision, timeliness, reliability, or other aspects; against any kind of technical and human error, no real or legal person within our institution can be held responsible for any material or moral damage that the site visitor may suffer in relation to any information provided here. Should the visitor feel the need to question the accuracy of the information provided, they are obliged to utilise other sources.</p>
<p align="justify">By using this site, the visitor to our site is deemed to have understood the warnings stated above and to have accepted the compensation of all material and moral damages that may arise.</p>

</div>
', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('document-links', 'en', 'Useful Documents and Links', '
<div class="icerik">
<p>Below are links to some external addresses that we think might be useful for our users. Although the continuity, validity, and recency of these links are checked by us from time to time, we present to the knowledge of our users that situations such as broken links and sites losing their validity may also occur.    
<p>New additions / removals to the links provided here may be made over time. </p>
<p><STRONG>Useful Links </STRONG></p>
<UL>
  <LI>ULAKBİM, National Academic Network and Information Centre: <A href="http://www.ulakbim.gov.tr/" target="_new">www.ulakbim.gov.tr</A> <BR>
  </LI>
  <LI>Turkish Anti-Spam Organisation: <A href="http://www.spam.org.tr/" target="_new">www.spam.org.tr</A> <BR>
  </LI>
  <LI>Turkish Security Documents from Ulaknet: <A href="http://csirt.ulakbim.gov.tr/dokumanlar/" target="_new">csirt.ulakbim.gov.tr/dokumanlar</A> <BR>
  </LI>
  <LI>Turkish Security Documents from Ulaknet: <A href="http://csirt.ulakbim.gov.tr/dokumanlar/" target="_new">csirt.ulakbim.gov.tr/dokumanlar</A> </LI>
</UL>


</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('documents', 'en', 'Information and Documents', '
<div class="icerik"> + + <UL> + <li><a href="/en/vpn" target="_blank">VPN Installation Guide</a></li> + <LI><A href="/en/spam">About SPAM and PHISHING</A></LI> + <LI><A href="/en/security">Viruses and Security Recommendations</A></LI> + <LI><A href="/en/it-security-tips">Precautions for Computer Accidents</A></LI> + <LI><A href="/en/connection-security">About HU Internet Connection</A></LI>+ <LI><A href="/en/proxy">Proxy Settings</A></LI> + <LI><A href="/en/document-links">Useful Documents and Links</A></LI> + </UL> + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('dorm-access', 'en', 'HUNET - BEYTEPE Dormitory Access Protocol', '
<div class="icerik">
  <p><STRONG>1. Applications that are always open</STRONG><BR>
    ftpcc, hacettepetv, hacettepetv1, newscc, yunus,  yurt_portal, web-browsing, smtp, imap, pop3, ssl, ssh, dns, hotmail, yahoo-mail,  yahoo-webmessenger, msn-base, msn-webmessenger, facebook, facebook-chat,  facebook-mail, facebook-apps, facebook-base, facebook-social-plugin, gmail,  skype, naver-mail, unknown-tcp, twitter, twitter-base, twitter-posting,  google-talk-base, gtalk-voice, yahoo-file-transfer, yahoo-im-base, yahoo-voice,  jabber, oovoo, skype-probe, nntp, msn-video, msn-voice, rtcp, friendfeed,  ms-update, google-earth, google-translate, millenium-ils</p>
  <p><STRONG>2. Applications that are open between 00:00 and 08:00</STRONG><BR>
    tftp, ftp, cftp, hotfile, rapidshare, sopcast, rss,  megaupload, badongo, bigupload, bonpoo, boxnet-base, boxnet-editing,  boxnet-uploading, depositfiles, divshare, docstoc, drop.io, dropbox,  easy-share, eatlime, esnips, filedropper, file-host, filer.cx, files.to,  fileserve, filesonic, filestube, fluxiom, foldershare, fs2you, gigaup,  ifile.it, jubii, leapfile, mediafire, mediamax, nakido-flag, naver-ndrive,  netload, okurin, omnidrive, openomy, sendspace, skydrive, steekr,  taku-file-bin, titanize, totoexpress, turboshare, wixi, xdrive, yourfilehost,  yousendit, adnstream, afreeca, brighttalk, channel4, dailymotion, flickrflumotion,  fotki, fotoweb, freeetv, google-video-base, google-video-enterprise, gyao,  itv-player, justin.tv, libero-video, megavideo, metacafe, mgoon, mogulus,  netflix, niconico-douga, ooyala, photobucket, pullbbang-video, rtmp, rtmpe,  rtmpt, sbs-netv, shutterfly, socialtv, stagevu, teachertube, tidaltv, tudou,  ustream, veetle, veohtv, yahoo-douga, youku, youtube-base, youtube-safety-mode,  youtube-uploading, bbc-iplayer, rtp, rtsp, flash, last.fm, photobucket, vimeo,  http-audio, http-video, all-slots-casino, battlefield2, bet365, blokus,  bomberclone, call-of-duty, doof, eve-online, evony, gamespy, garena, hangame,  knight-online, lineage, little-fighter, maplestory, nintendo-wfc,  paradise-paintball, party-poker, playstation-network, pogo, poker-stars,  regnum, second-life, source-engine, steam, subspace, tales-runner, unreal,  war-rock, we-dancing-online, wiiconnect24, wolfenstein, worldofwarcraft,  xbox-live, zango, warcraft, baidu-hi, baidu-hi-games, winamax, runescape, stun,  kerberos</p>
  <p><STRONG>3. Applications that are never open</STRONG><BR>
    proxy, p2p (KaZaA, iMesh, eDonkey2000, Gnutella, Napster,  Aimster, Madster, FastTrack, Audiogalaxy, MFTP, eMule, Overnet, NeoModus,  Direct Connect, Acquisition, BearShare, Gnucleus , GTK-Gnutella, LimeWire,  Mactella, Morpheus, Phex, Qtella, Shareaza, XoLoX, OpenNap, WinMX, DC++,  BitTorrent etc.) and applications not listed above</p></div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('dorm-rules', 'en', 'Rules for Dormitories and Student Houses', '
<div class="icerik">

 <p>Hacettepe University Department of Information Technology also provides Internet service to the dormitories and private student houses located at the university. Students can connect their personal computers to this system to obtain an automatic IP address and establish Internet and Intranet connections - via virtual IP + NAT -. </p>
 <p>While benefiting from the Internet service provided by the Department of Information Technology in these areas, the following rules must be observed: </p>
 <OL>
   <LI>Resources such as Internet and Intranet connections, user codes, etc., provided for students'' personal computers in dormitory rooms must be used within the framework of the "<A href="/en/student-rules">Hacettepe University Information Technology Resources Acceptable Use Policy</A>". </LI>
   <LI>The university''s computer and network infrastructure has been established to serve academic, administrative, educational, and research purposes. Personal use on the network must never prevent other users from fulfilling their network access requirements. Therefore, certain rules and prohibitions that must be observed have been introduced: 
     <UL>
       <LI>The use of network resources for personal gain and profit is prohibited. </LI>
       <LI>Sending mass e-mails (mail bombing, spam) or allowing third parties to send them by using network resources is prohibited. </LI>
       <LI>Running server-type software that provides services (web hosting, e-mail, ftp service, etc.) in dormitory rooms is prohibited. </LI>
       <LI>Any activity (proxy, relay, IP sharer, NAT, etc.) that may cause university network resources to be used from outside the university or that will allow individuals or computers outside the university to identify themselves as if they were inside the university is prohibited. </LI>
       <LI>Engaging in activities that threaten network security or monitor network traffic is prohibited. </LI>
       <LI>Every student who has a computer connected to the network system in their dormitory room is primarily responsible for the use and security of resources such as the Internet/Intranet connection, user accounts, etc., allocated to them by the university, and for any prohibited activities that may arise in the event that these resources are made available to third parties, consciously or unconsciously. </LI>
     </UL>
   </LI>
   <LI>In the event that it is determined that the above-mentioned rules have not been observed, one or more of the actions such as termination of the network connection, suspension of user accounts, initiation of a legal investigation according to university regulations, or initiation of a judicial investigation according to the laws of the Republic of Turkey may be applied to the relevant person. </LI>
   <LI>Students who are found to have not complied with the rules are notified through the management of the unit where they reside (dormitory or student houses). </LI>
 </OL>
 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature', 'en', 'Electronic Signature Usage Guide', '
<div class="icerik">
In order to ensure that the data generated via the EDMS is used electronically as an equivalent to a wet signature, personnel authorised to sign are provided with an "e-signature Certificate".</br>

In the e-signature requests to be approved by our institution, the preliminary application procedures will be evaluated within the framework of the conditions specified below. Orders will not be created for situations outside these conditions.</br>
<hr>



<details class="group border-b border-gray-200 py-3 cursor-pointer select-none">
<summary class="flex justify-between items-center list-none font-bold text-gray-800 hover:text-red-700 transition-colors">
<span class="text-lg"><b><font color="red">1. Preliminary Application for Those with Administrative Duties</font></b></span>
<!-- Artı / Eksi İşareti (Grup açıkken döner) -->
<span class="text-2xl font-light transition-transform duration-300 group-open:rotate-45 text-gray-500">+</span>
</summary>
<div class="mt-3 text-gray-600 pl-2 leading-relaxed">



For personnel whose user roles have been defined in the EDMS after the administrative duty appointment has been made, the process proceeds as follows:
<br><b>Process:</b> The cover letter regarding the provision of the e-signature, including the administrative duty and personal information (TR Identity Number, date of birth (dd/mm/yyyy) and corporate e-mail address), along with the assignment letter attached to it, is forwarded to the Department of Information Technology by the relevant unit administration.

<br><b>Renewal:</b> In the event that the administrative duty continues, an application can be made at most 1 month before the expiry of the existing e-signature.
<br><b>Scope:</b> Corporate e-signatures will not be provided outside the duties listed below.<br>
*University Administration; University Ethics Board and Commission Members;
<br>*Faculties: Dean, Vice Dean, Head of Department and Deputy, Faculty Secretary. (Head of Main Branch of Science in the Faculties of Pharmacy, Physical Therapy and Rehabilitation, Nursing, Health Sciences and Medicine)
<br>*Conservatory/ Institutes: Director, Deputy Director, Head of Main Branch of Science, Institute Secretary.
<br>*Schools/Vocational Schools: Director and Deputy Director, School/Vocational School Secretary.
<br>*Application Research Centres: Application and Research Centre Director;
<br>*Administrative Units: Internal Auditor, Legal Counsel, Lawyer, Head of Department, Deputy Head of Department and Branch Manager, Authorising Officer, Realisation Officer and their Substitutes.<br>


<br><B>Academic Personnel Serving on Boards:</B></font>
<br>Requests for academic personnel serving on Faculty, Institute and Boards of Directors are forwarded by the relevant unit administration to the Department of Information Technology in the appendix of a cover letter by filling out the <a href="https://bidb.hacettepe.edu.tr/eimza/Kurul_YK_Eimza_OnSiparis_v2.xlsx" blank="_target"> <b>Kurul_YK_Eimza_OnSiparis</b></a> <font color="green">Excel form</font>.</br>



</div>
</details>








<details class="group border-b border-gray-200 py-3 cursor-pointer select-none mt-4">
<summary class="flex justify-between items-center list-none font-bold text-gray-800 hover:text-red-700 transition-colors">
<span class="text-lg">


<B><font color="red">2. Academic Personnel In Charge of TÜBİTAK / TÜSEB Projects </B></font>


</span>
<!-- Artı / Eksi İşareti -->
<span class="text-2xl font-light transition-transform duration-300 group-open:rotate-45 text-gray-500">+</span>
</summary>
<div class="mt-3 text-gray-600 pl-2 leading-relaxed">
<!-- 2. Başlığın altına gelecek mevcut metinlerinizi buraya yapıştırın -->



The e-signature application processes of our academic personnel taking part in projects are meticulously managed by the Department of Information Technology in line with the principles of effective use of public resources and protection of the corporate budget. It is of great importance to comply with the application criteria and document arrangement in order for the process to be carried out without interruption.<br>

<br><b>Application Criteria </b>
<br> E-signature requests will be processed for academic personnel who meet the following two conditions together.
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
- To have an ongoing project or to apply for a new project within <b>1 month</b> at the latest.
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
- To be on duty in one of the roles of <b>Executive, Researcher</b> or <b>Consultant</b> with digital approval/signature authority in the relevant project systems (PRODİS, TBYS, etc.).<br>

<br><b>Implementation Steps</b>

<br><b> 2.1. Submission of Forms:</b> The applicant completes the relevant application forms and submits them to the Unit Directorate to which they are affiliated.<br>

<br><b> 2.2. Official Correspondence:</b> The relevant management unit forwards these forms to the Department of Information Technology as an attachment to a cover letter.
<br><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IMPORTANT NOTE:</b> In the name of the efficiency of administrative operations; applications with missing documents, incomplete signature processes, or those not complying with the criteria will be returned to the relevant unit without being processed. We kindly ask you to make sure that the forms are submitted completely so that your applications can be concluded quickly.<br>

<br><b> 2.3. Required Application Forms</b>
<br>A) For an Ongoing Project:
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 1-- <a href="https://bidb.hacettepe.edu.tr/eimza/Proje_Eimza_OnSiparis_v5.xlsx" blank="_target"> <b>Proje_Eimza_OnSiparis </b>(Version 5)</a> form
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 2-- <b>Project Summary Page </b> obtained from the "My Projects" tab of ARBİS / TBYS
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 3-- (If any) <b>"Additional Time Approval Letter"</b> (Mandatory if the project duration has expired but has been extended)
<br> B) For a New Project to be Applied For:
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 1-- <a href="https://bidb.hacettepe.edu.tr/eimza/Proje_Eimza_OnSiparis_v5.xlsx" blank="_target"> <b>Proje_Eimza_OnSiparis </b>(Version 5)</a> form
<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Form 4-- <b>"Project Application Form"</b> obtained via ARBİS/TBYS

<p>
<b>Points to be Considered</b>
<br><b>If a New Application will be Made:</b> The <b>"Draft Name of the Project" and "Application Period"</b> must definitely be included in the form for the projects planned to be applied for. Blank forms are not evaluated. In addition, the <b>ARBİS/TBYS application form</b> must be attached to the cover letter.

<br><b>Timing:</b> Orders will not be opened over the system for requests with more than 1 month left to the new project application date. It is kindly requested that such requests be forwarded when the time comes.

<br><b>Additional Time Approval:</b> In requests where the project duration has expired, if the "Additional Time Approval Letter" is not attached, the provision of the e-signature will not be included within the scope of corporate payment, and the order process will not be initiated.

<br><b>BAP Projects: </b> Since there is no e-signature use in Scientific Research Projects (BAP) processes, the order process will not be initiated for these projects; we strongly urge our academic personnel not to make requests.

<br><b>Administrative Personnel:</b> Individual or corporate paid e-signature orders are not created for administrative personnel working on projects.
</p>



</div>
</details>




<hr><b>General Notes and Important Warnings</b></br>
<p class="text-gray-600 pl-4 mt-1">
<b>E-signature Renewal:</b> The processes above apply to certificates that have expired or have at most 1 month left to expire. Requests for certificates with longer durations are not processed. A new card reader is not provided in renewals.</br>

<b>Out of Scope:</b> Hacettepe University Hospitals and the Faculty of Dentistry carry out their e-signature processes within their own bodies.</br>

<b>Lost/Stolen: </b> In these cases, renewal procedures must be carried out individually from the "Online Transactions" (QEC Transactions -> Individual Transactions -> Individual Paid Application) menu on the Public Certification Authority web page.</br>

<b>User Responsibility: </b> Renewal fees arising in cases such as user-caused faults, lost/stolen incidents, PIN-PUK blocks, and identity information updates are covered individually.
</p>



<b>Application Form and Tracking</b>
<p class="text-gray-600 pl-4 mt-1">
After corporate approval is given, a preliminary order is created by the Public Certification Authority and an informative message containing the transaction steps is sent to the corporate e-mail address of the applicant. Applicants are required to check their e-mail boxes (including the Junk/Spam folder) regularly. In order for the certificate to proceed to the production phase, the completion of the steps in the incoming link is essential. Requests that are not completed within 6 months even though their preliminary orders have been opened are automatically cancelled by the Public Certification Authority.

<br><b>Those Who Did Not Receive/Could Not Find the Information E-mail; </b>Our users who did not receive an e-mail or could not find the link can directly access the application forms by using the Online Transactions > QEC Transactions > Individual Transactions > Application Transactions menu on the Public Certification Authority web page.
</p>

<b>Production of the Certificate </b>
<p class="text-gray-600 pl-4 mt-1">
In order to produce the certificate, the form generated over the system must be filled out and the application method must be selected:
<br>1.<b>Wet Signed Application:</b> For those who do not have an active e-signature or are applying for the first time; The form must be printed out, signed, and sent individually by cargo to the address specified on the form. ("Kamu Sertifikasyon Merkezi TÜBİTAK Gebze Yerleşkesi (İdari Bina) P.K.74 41470 KOCAELİ")
<br>2. <b>E-signed/ E-Approved Application: </b> If the application process was completed with an existing e-signature or via the e-approval method, there is no need to send physical documents.
</p>
<hr>

Process tracking (production, delivery) can be done on the <a href="https://onlineislemler.kamusm.gov.tr/landing" target="_blank"><b>Public Certification Authority Online Transactions</b></a> web page.</br>
<hr>


<u><b>IMPORTANT :</b></u> The newly produced certificate will become active when the old certificate expires. After the duration expires, you can start using your new certificate by completing the PIN acquisition procedures.
<br>
<br><b>Technical Support</b><br>
For driver installation and technical assistance, you can call the <b>Public Certification Authority Call Centre (444 5 576)</b> or request help by filling out a form on the Department of Information Technology <a href="https://bidbdestek.hacettepe.edu.tr/login.php"><b>Issue Notification Support</b> </a> page.
<hr>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-about', 'en', 'About E-Signature', '
<div class="icerik">
<p>According to the Electronic Signature Law No. 5070 dated 15 January 2004, an electronic signature defines electronic data that is attached to or logically associated with other electronic data and used for authentication purposes.<br>
An electronic&nbsp; signature consists of letters, characters, or symbols that guarantee, via electronic or similar means, that information is transmitted in an environment closed to the access of third parties, without compromising its integrity (in its original form created by the transmitting party), and with the identities of the parties authenticated. An e-signature created in accordance with the law provides a legal basis for approval procedures carried out on computers or in an electronic environment, and eliminates paper. A person who wishes to make a declaration of will for approval purposes can use an electronic signature in their organisation''s electronic document flow system, services offered over the web, or e-government services.<br />
An electronic signature provides users with the three fundamental features specified below:</p>
<p><strong>Data Integrity:</strong> To prevent data from being altered, deleted, or added to without authorisation or by mistake,</p>
<p><strong>Authentication and Approval:</strong> To ensure the validity of the message and the transmission by the owner of the message,</p>
<p><strong>Non-Repudiation:</strong> To prevent individuals from denying transactions they have carried out in an electronic environment.</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-application', 'en', 'Application', '
<div class="icerik">
<p>For personnel requesting an e-signature due to an <b>administrative duty</b>, an e-signature request is sent via an official letter to the Department of Information Technology by administrative authorities.
The letter must also include the relevant personnel''s TR ID number, date of birth in dd/mm/yyyy format, and corporate e-mail information.</p>

<p>For academic personnel who will apply for a <b>TÜBİTAK project</b> or have ongoing projects, e-signature requests are made individually by filling out the
<a href="https://bidb.hacettepe.edu.tr/eimza/TUBITAK_Proje_Eimza_OnSiparis_v5.xlsx" blank="_target"> <b>TUBİTAK_Proje_Eimza_OnSiparis form </b> </a>
and delivering it to their administrative authorities (Dean''s Office, Institute, Rectorate, General Secretariat, etc.). The relevant unit management then sends the form to our Department via an official letter.</p>

<p>For academic personnel serving on Faculty, Institute Boards, and Boards of Directors;</u>
<br>E-signature requests are made by unit authorities by filling out the <a href="https://bidb.hacettepe.edu.tr/eimza/Kurul_YK_Eimza_OnSiparis_v2.xlsx" blank="_target"> <b>Kurul_YK_Eimza_OnSiparis Excel form </b></a>.
This form is attached as an Excel file (without scanning) to an official letter and sent to our Department.</p>


<p>Requests are evaluated by our department, and for those eligible for e-signature provision, institutional approval is forwarded to TÜBİTAK Public Certification Authority. <br>
<FONT COLOR="RED" size="2">Under other circumstances, e-signature provision/renewal procedures will not be carried out by the university. (05.11.2020)</font></p>



<p><u>Application procedure for personnel whose institutional e-signature approval has been forwarded to Public Certification Authority by the institution:</u>

<br> Public Certification Authority will send an informational e-mail explaining the transaction steps to the e-mail addresses of the applicants.
<br>--those with an active e-signature (renewal) complete the process by making an "e-signed application",
<br>--those without an active e-signature proceed with a "wet-signed application", print the application form from a printer, sign it, and send it <b>individually via post</b> to the address: <br><i>Adres: Kamu Sertifikasyon Merkezi TÜBİTAK Gebze Yerleşkesi (İdari Bina) P.K .74, Gebze 41470 KOCAELİ </i>.<br>

<br> Those who cannot find the application link in their e-mails even though a pre-order request has been forwarded to Public Certification Authority
can access the application form from the QEC Operations -> Individual Operations -> Application Operations menu after LOGGING IN to the Online Operations on the Public Certification Authority web page.</p>


</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-cancellation', 'en', 'Certificate Cancellation', '
<div class="icerik"> + The certificate holder can have their certificate cancelled by calling the Public Certification Authority Call Centre (444 5 576). + <br>For applications made through the Call Centre, the identity of the certificate holder is verified using the information defined in the Public Certification Authority system, and the cancellation process is carried out.+ <br><br>A QEC that is cancelled for any reason cannot be used again. + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-certificate-received', 'en', 'I Have Received My Certificate, What Should I Do?', '
<div class="icerik">
In order to use the certificate you obtained from the Public Certification Authority, you can refer to the relevant instructions for driver installation and creating a new PIN on the <b><a href="http://kamusm.gov.tr/islemler/sertifikami_aldim_ne_yapmaliyim/?info=1" target="_blank">
"I Have Received My QEC, What Should I Do?" </a></b> page, or you can complete the form on the Issue Reporting Support page at <a href="https://bidbdestek.hacettepe.edu.tr/login.php"> https://bidbdestek.hacettepe.edu.tr/login.php</a>.
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-faq', 'en', 'E-Signature Frequently Asked Questions', '
<div class="icerik">
<p><a href="#SSS1">What are the legal consequences of an electronic signature?</a></p>
<p><a href="#SSS2">I want to obtain an electronic signature, what should I do?</a></p>
<p><a href="#SSS3">I did not receive an application access password in my e-mail for the application form?</a></p>
<p><a href="#SSS4">What is a Security Word? I forgot it, what should I do?</a></p>
<p><a href="#SSS5">How can I fill out the application form?</a></p>
<p><a href="#SSS6">Selection of the signing method</a></p>
<p><a href="#SSS7">What to do for e-signature installation?</a></p>
<p><a href="#SSS8">I lost my Pin/Puk information</a></p>
<p><a href="#SSS9">I lost my e-signature, what should I do?</a></p>
<p><a href="#SSS10">I think my e-signature token is faulty?</a></p>
<p><a href="#SSS11">How do I renew my e-signature?</a></p>
<p><a href="#SSS12">How do I update my changed identity information?</a></p>
<p><a href="#SSS13">How can I get help?</a></p>

<p><a name="SSS1"><strong>FAQ 1 : What are the legal consequences of an electronic signature?</strong></a> <br/>
In the Electronic Signature Law; a secure electronic signature is accepted as equivalent to a manual signature, and it is stated that data generated with an electronic signature will have the force of a deed. However, it is stipulated that legal transactions subjected to a formal format or a special ceremony by laws, and guarantee agreements cannot be executed with a secure electronic signature. In other words, transactions such as real estate trading, inheritance and transfer, and marriage, where the law requires a ceremony or the testimony of third parties, cannot be executed with an electronic signature.</p>


<p><a name="SSS2"><strong>FAQ 2 : I want to obtain an electronic signature, what should I do?</strong></a> <br/>
Our university will provide an electronic signature to the personnel authorised to affix a wet signature on documents in internal and external correspondence (having an administrative duty defined in the EDMS) by using the "Electronic Document Management Systems - EDMS". E-signatures will not be obtained for those who initial.<br>
For personnel with a managerial duty, e-signature requests will be made to the Department of Information Technology by the administrative authorities (Faculty/Institute/Vocational School/School/Conservatory/Head of Department).
<br><br>
Our academicians with ongoing TÜBİTAK projects or who will apply for a new project can forward their e-signature usage needs to the Dean''s Offices/Institute Directorates with a petition containing their TR ID number, corporate e-mail, project number, and project name information.</p>


<p><a name="SSS3"><strong>FAQ 3 : What should I do if an access password for the application form has not arrived?</strong></a> <br/>
Rarely, the e-mail sent from TÜBİTAK Public Certification Authority may not arrive due to technical glitches.
In this case, you can ensure that the e-mail is resent from the link <a href="https://basvuru.kamusm.gov.tr/bs/sifreunutma.go">https://basvuru.kamusm.gov.tr/bs/sifreunutma.go</a>.
If there are no errors in your information, a password will be sent to your e-mail address again.
<br>If there is an error in your information, you can send an e-mail to eimza@hacettepe.edu.tr.</p>


<p><a name="SSS4"><strong>FAQ 4 : What is a Security Word? I forgot it, what should I do?</strong></a> <br/>
You can get detailed information from the Certificate Transactions > Security Word Renewal tab of our Electronic Signature Usage Guide web page.</p>


<p><a name="SSS5"><strong>FAQ 5 : How can I fill out the application form?</strong></a></br>
You can get detailed information from the relevant <a href="http://www.bidb.hacettepe.edu.tr/eimza/indir/yrd_bidb_basvuru_form_doldurma.pdf">web page</a>.</p>


<p><a name="SSS6"><strong>FAQ 6 : Selection of the signing method</strong></a> <br/>
While filling out the application form, in this section, users with a valid Qualified Electronic Certificate sign using the <font color="#339900">Electronically Signed Application Interface</font> for renewal and update processes, and those who will obtain a certificate for the first time sign using the <font color="#339900">Wet Signed Application Interface</font>.
<br /><img src="/images/eimza/imzalama_methodu.jpg" width="600" height="417" /></p>


<p><a name="SSS7"><strong>FAQ 7 : What should I do for e-signature installation?</strong></a></br>
- You can call the Public Certification Authority Call Centre at 444 5 576<br>
- You can follow the auxiliary documents from the Electronic Signature Usage Guide <a href="http://www.bidb.hacettepe.edu.tr/eimza/indir/yrd_bidb_sertifikami_aldim_ne_yapmaliyim.pdf"> web page</a> <br>
- You can fill out a form on the Department of Information Technology Issue Notification Support <a href="https://bidbdestek.hacettepe.edu.tr/login.php"> web page</a>.</p>


<p><a name="SSS8"><strong>FAQ 8 : I lost my PIN/PUK information</strong></a><br/>
You can get detailed information from the <a href="https://bidb.hacettepe.edu.tr/eimza/sifre.php">Password Transactions </a> tab of our E-signature Usage Guide web page.</p>


<p><a name="SSS9"><strong>FAQ 9: I lost my e-signature, what should I do?</strong></a> <br/>
In the event that you lose your e-signature, you must immediately call the TÜBİTAK Public Certification Authority Call Centre for its cancellation for security reasons, and then you must contact your <strong>Corporate Authority</strong> (eimza@hacettepe.edu.tr) for the reproduction of your certificate.
In cases of loss, the production fee is covered individually. </p>


<p><a name="SSS10"><strong>FAQ 10: I think my e-signature token is faulty?</strong></a><br />
If it does not work as a result of cross-checking (use on another computer and use with another certificate), you can get support by calling the TÜBİTAK Public Certification Authority Call Centre (444 5 576). TÜBİTAK replaces the token for faults within the scope of the warranty, whereas for user-caused faults, the token fee is covered individually by the certificate owner. </p>


<p><a name="SSS11"><strong>FAQ 11 : How do I renew my e-signature?</strong></a><br />
The renewal processes of certificates whose validity period will expire within 1-3 months are carried out for certificate owners whose administrative duty continues.</p>


<p><a name="SSS12"><strong>FAQ 12 : How do I update my changed identity information?</strong></a><br />The certificate needs to be updated, that is, reproduced for your changed identity information (name, surname). You can request that your certificate be reproduced on an individual payment basis by sending your changed identity information and TR ID number via e-mail to eimza@hacettepe.edu.tr.</p>


<p><a name="SSS13"><strong>FAQ 13 : How can I get help?</strong></a> <br/>
You can get help by<br/>
calling the Public Certification Authority Call Centre (444 5 576)<br />
visiting the <a href="http://www.kamusm.gov.tr/">Public Certification Authority web page</a> <br />
visiting the <a href="http://www.bidb.hacettepe.edu.tr/eimza/index.php">E-signature Usage Guide</a> web page<br />
filling out a form on the <a href="https://bidbdestek.hacettepe.edu.tr/login.php">Issue Notification Support</a> web page. </p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-info-update', 'en', 'Certificate Information Update', '
<div class="icerik">
The certificate holder must contact the KAMU SM Call Centre at 444 5 576 to update their contact information, such as their institutional unit, address, and telephone numbers.
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-java', 'en', 'Java Settings', '
<div class="icerik">
<p>To be able to sign with a Qualified Electronic Certificate, the Java programme must be installed and up-to-date on your computer.</p>
<p>The latest update can be installed from <a href="http://www.java.com/tr/download" target="_blank">http://www.java.com/tr/download</a>.</p>
<p>If e-signature users have upgraded their Java versions and cannot perform the e-signature process, they must lower the security level in the Java > Security tab to the lowest setting.<br />
1-Open Control Panel - Java programme.<br />
<img src="/images/eimza/basvuru_java.jpg" width="596" height="196" /></p>
<p>2-In the window that opens, click on the Security tab, move the Security Level slider to the <strong>Medium</strong> level, and save with OK.<br />
<img src="/images/eimza/basvuru_java_security.jpg" /></p>


<p>&nbsp;</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-legislation', 'en', 'Legislation', '
<div class="icerik">
<h2 align="left">LAWS </h2>
<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_kanunu.pdf">Electronic Signature Law No. 5070</a></br>
Official Gazette dated 23.01.2004 and numbered 25355<br />
This Law encompasses the legal structure of electronic signatures, the activities of electronic certificate service providers, and the procedures related to the use of electronic signatures in every field.</p>

<h2 align="left">REGULATIONS </h2>
<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_yonetmelik.pdf">Regulation on the Procedures and Principles Regarding the Implementation of the Electronic Signature Law</a><br>
Official Gazette dated 06.01.2005 and numbered 25692<br />
This Regulation encompasses the procedures and principles regarding the legal, technical, and financial aspects of electronic signatures.</p>

<!-- <p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/resmi_yazisma_usul_ve_esaslari.pdf">Regulation on the Procedures and Principles to be Applied in Official Correspondence</a>
<div align="left">Official Gazette dated 02.12.2004 and numbered 25658<br />
This Regulation determines the rules of official correspondence and ensures that the exchange of information and documents is carried out in a healthy, fast, and secure manner. It covers all public institutions and organisations.</div>
<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/sertifika_malisorumluluk_yonetmelik.pdf">Certificate Financial Liability Insurance Regulation</a>
<div align="left">Official Gazette dated 26.08.2004 and numbered 25565<br />
It determines the procedures and principles regarding the fulfilment of the certificate financial liability insurance obligation.</div>
-->

<h2 align="left">COMMUNIQUÉS </h2>
<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_degisiklik_tebligi.pdf">Communiqué on the Amendment of the Communiqué on Processes and Technical Criteria Related to Electronic Signatures</a>
<br>Official Gazette dated 30.01.2013 and numbered 28544</br>
Article 6 of the Communiqué on Processes and Technical Criteria Related to Electronic Signatures has been amended.</p>

<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/eimza_teblig.pdf">Communiqué on Processes and Technical Criteria Related to Electronic Signatures</a><br>
Official Gazette dated 06.01.2005 and numbered 25692<br/>
This Communiqué covers the technical issues regarding the functioning of the ECSP, signature creation and verification data, certificate policies and certificate practice statements, signature creation and verification tools, the system, equipment, and physical security used by the ECSP for its activities, its personnel, time stamps, and services, including the processes of qualified electronic certificate application, certificate generation, publication, renewal, revocation, and archiving.</p>

<h2 align="left">TELECOMMUNICATIONS BOARD DECISIONS </h2>
<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/kurulkarar_profil_rehberi.pdf">Board Decisions Regarding the Qualified Electronic Certificate, CRL, and OCSP Request/Response Profiles Guide</a>
<br>Dated 18.04.2007 and numbered 2007/DK-77/760</p>

<p align="left">Board Decision on the Procedures and Principles Regarding Secure Electronic Signature Creation and Verification Applications and Secure Electronic Signature Formats</p>


<h2 align="left">REGULATIONS (CIRCULARS) RELATED TO PUBLIC CERTIFICATION AUTHORITY </h2>
<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/200421_genelge.pdf">Prime Ministry Circular No. 2004/21</a>
<br>Purpose: Providing the electronic certificate needs of all public institutions and organisations from a single centre</p>
<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/200613_genelge.pdf">Prime Ministry Circular No. 2006/13</a></p>

<!--<p align="left"><a href="https://bidb.hacettepe.edu.tr/eimza/mevzuat/200816_genelge.pdf">Prime Ministry Circular No. 2008/16</a></p>
<p align="left">TSE 13298 Electronic Document Management Standard</p>-->
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-password', 'en', 'Password Procedures', '
<div class="icerik">
<p>For the PIN unlocking screens to function properly, Java version 1.8 or above must be installed on your computer.<br>
(You may experience Java plugin issues with Google Chrome! You can use different browsers such as Mozilla Firefox or Internet Explorer.)</p>

<p><b>Creating a New QEC PIN</b><br>
Your newly produced certificate will become valid when your old certificate expires. After the old one expires, you must obtain a new PIN in order to <b>be able to use your new certificate</b>. You can access the brochure containing the necessary steps and warnings at
<a href="https://kamusm.bilgem.tubitak.gov.tr/dokumanlar/yonergeler/nes/nes_kilit_cozme/?info=1">
https://kamusm.bilgem.tubitak.gov.tr/dokumanlar/yonergeler/nes/nes_kilit_cozme/?info=1</a>.</p>

<p><b>Unlocking</b><br>
Safely keeping the PIN information is the responsibility of the card holder. In the event that the PIN is entered incorrectly 3 (three) times, a new PIN must be set by logging in at
<a href="https://onlineislemler.kamusm.gov.tr/landing/"><b>https://onlineislemler.kamusm.gov.tr/landing</b></a> and using the <b>Unlock</b> option. Do not perform any operations with the PUK code under any circumstances. Following 3 (three) unauthorised or incorrect PUK entry attempts, the card becomes permanently unusable. In this case, the card fee is borne by the certificate holder.</p>

<p>For assistance, you can call the KAMU SM Call Centre at 444 5 576 or fill out the form on our Department''s <a href="https://bidbdestek.hacettepe.edu.tr/login.php">Issue Reporting Support</a> page.</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-remote-desktop', 'en', 'Desktop Help', '
<div class="icerik">
<p>You can download the Remote Access Programme.</p>
<table>
<tr>
<td><a href="https://bidb.hacettepe.edu.tr/eimza/indir/AA_v3.3.exe"><img src="/images/eimza/image_ammyy.jpg" alt="Ammyy" width="270" height="70" /></a></td>
<td><a href="https://bidb.hacettepe.edu.tr/eimza/indir/TeamViewer_Setup_tr.exe"><img src="/images/eimza/image_team.jpg" alt="TeamViewer" width="270" height="70" /></a></td>
</tr><br />
<tr><td align="center"><a href="https://bidb.hacettepe.edu.tr/eimza/indir/AMMYY_REHBER.pdf">Ammyy Guide</a></td>
<td align="center"><a href="https://bidb.hacettepe.edu.tr/eimza/indir/TEAMVIWER_REHBER.pdf">TeamViewer Guide</a></td>
</tr><br /><br />
</table>


<p>&nbsp;</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-renewal', 'en', 'Certificate Renewal', '
<div class="icerik">
Certificate renewal procedures will be carried out with the approval given to Public Certification Authority by the <b>Department of Information Technology</b> as the institutional authority.
The following conditions must be met for renewal to be carried out;

<ul>
<li>The certificate holder''s administrative duty (authorised to sign) is continuing,
<li>The institutional authority making a renewal request by giving approval to Public Certification Authority,
<li>Having a certificate previously obtained from Public Certification Authority,
</ul>

If the conditions are met, Public Certification Authority will send a "QEC Application Form Access Password" to the certificate holder''s e-mail address.
The application form for renewal must be signed by selecting the "Electronically Signed interface". <br><br>
If the certificate has expired, the same procedure is carried out with a wet signature.
In this case, the application form is printed out, signed, and sent to the TÜBİTAK Gebze campus via post.<br/><br>
The new certificate is produced 15 days before the expiry of the person''s previous certificate
and is not activated for use before the old certificate expires.<br><br>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-security-word', 'en', 'Security Word', '
<div class="icerik"> + The security word is an authorisation parameter that the applicant determines while filling out the application form.<br><br> + Those who forget their security word can perform their transactions via the + <a href="https://onlineislemler.kamusm.gov.tr">https://onlineislemler.kamusm.gov.tr</a> page.+ </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-unit-officers', 'en', 'Unit E-Signature Officers', '
<div class="icerik">
<table cellspacing="0" cellpadding="0">
<col width="230" />
<col width="310" />
<col width="94" />

<tr height="41">
<td height="41" width="230"><b>UNIT</b></td>
<td width="310"><b>E-SIGNATURE OFFICER</b></td>
<td width="94"><b>TELEPHONE</b></td>

</tr>


<tr height="26">
<td height="26">Faculty of Computer and Informatics </td>
<td>Latif ELVAN</td>
<td> </td>
</tr>


<tr height="26">
<td height="26">Faculty of Pharmacy </td>
<td>Umut Emre AYGÜL</td>
<td>3052148</td>

</tr>
<tr height="26">
<td height="26">Faculty of Letters</td>
<td>Gökçen RUTBİL</td>
<td>2976810</td>
</tr>

<tr height="26">
<td height="26">Faculty of Education</td>
<td>Gamze YILMAZ</td>
<td>2976820</td>
</tr>

<tr height="26">
<td height="26">Faculty of Science </td>
<td>Gülnihal DOĞRUYOL ASLAN</td>
<td>2976855</td>
</tr>

<tr height="26">
<td height="26">Faculty of Physical Therapy and Rehabilitation</td>
<td>Perihan IĞDIR</td>
<td>3051576</td>
</tr>


<tr height="26">
<td height="26">Faculty of Fine Arts</td>
<td>Tuba DEMİR, Erhan YEŞİLÖZ</td>
<td>2976840</td>

</tr>
<tr height="26">
<td height="26">Faculty of Nursing </td>
<td>Hülya ÇOLAK, Gökhan DEMİR</td>
<td>3051580</td>

</tr>
<tr height="26">
<td height="26">Faculty of Law </td>
<td>Aysel TAŞKIN</td>
<td>2976270</td>

</tr>
<tr height="26">
<td height="26">Faculty of Economics and Administrative Sciences </td>
<td>Hamdi KAPLAN</td>
<td>2976830</td>

</tr>
<tr height="26">
<td height="26">Faculty of Communication </td>
<td>Zehra SARAÇ</td>
<td>2976225</td>

</tr>
<tr height="26">
<td height="26">Faculty of Engineering</td>
<td>Celal YURT</td>
<td>2976800</td>
</tr>

<tr height="26">
<td height="26">Faculty of Health Sciences </td>
<td>Alev ŞAKACI</td>
<td>3052051</td>
</tr>

<tr height="26">
<td height="26">Faculty of Sport Sciences</td>
<td>Aslan YAZAR</td>
<td>2976890</td>
</tr>

<tr height="26">
<td height="26">Faculty of Medicine </td>
<td>Uğur KAYA</td>
<td>3051080</td>
</tr>

<tr height="26">
<td height="26">Atatürk Institute for Modern Turkish History </td>
<td>Aylin TAŞ</td>
<td>2976870</td>

</tr>
<tr height="26">
<td height="26">Informatics Institute </td>
<td>Semra CEDİMOĞLU</td>
<td>2976462</td>

</tr>
<tr height="26">
<td height="26">Institute of Child Health </td>
<td>Nurten TÖRE</td>
<td>3051399</td>

</tr>
<tr height="26">
<td height="26">Institute of Educational Sciences </td>
<td>Serap AKKAYA </td>
<td>2978572</td>

</tr>
<tr height="26">
<td height="26">Institute of Science </td>
<td>Temel ÖZDEMİR</td>
<td>2976865</td>

</tr>
<tr height="26">
<td height="26">Institute of Fine Arts </td>
<td>Lale ÖZDEMİR</td>
<td>2978754</td>

</tr>
<tr height="26">
<td height="26">Institute of Public Health </td>
<td>Seval ÖZDEMİR</td>
<td>3053141</td>

</tr>
<tr height="26">
<td height="26">Cancer Institute</td>
<td>Gülay ÇELİK</td>
<td>3052994</td>

</tr>
<tr height="26">
<td height="26">Institute of Neurological Sciences and Psychiatry </td>
<td>Meltem ANLI</td>
<td>3052130</td>

</tr>
<tr height="26">
<td height="26">Institute of Population Studies </td>
<td>Semra CEDİMOĞLU</td>
<td>3051115</td>

</tr>
<tr height="26">
<td height="26">Institute of Nuclear Sciences </td>
<td>Banu TAŞKIRAN</td>
<td>2976880</td>

</tr>
<tr height="26">
<td height="26">Institute of Health Sciences </td>
<td>Onur ASLANER</td>
<td>3051554</td>

</tr>
<tr height="26">
<td height="26">Institute of Social Sciences </td>
<td>Assoc. Prof. Dr Mutlu ER</td>
<td>2976860</td>

</tr>
<tr height="26">
<td height="26">Institute of Turkic Studies </td>
<td>Meral UZUN</td>
<td>2976771</td>

</tr>
<tr height="26">
<td height="26">School of Foreign Languages</td>
<td>Mehtap KOCAOĞLU</td>
<td>2978085</td>

</tr>
<tr height="26">
<td height="26">School of Vocational Technology </td>
<td>Ayhan DURSUN</td>
<td>2976885</td>

</tr>
<tr height="26">
<td height="26">Hacettepe ASO 1st OIZ Vocational School </td>
<td>Assoc. Prof. Dr Şener KARABULUT</td>
<td>2672030</td>

</tr>
</tr>
<tr height="26">
<td height="26">Başkent OIZ Vocational School of Technical Sciences </td>
<td>Canip PERÇİN</td>
<td>5020469</td>

</tr>
<tr height="26">
<td height="26">Vocational School of Health Services </td>
<td>Sadike Baltacı Ertaş</td>
<td>3051433</td>

</tr>
<tr height="26">
<td height="26">Vocational School of Social Sciences </td>
<td>Nihat SELÇUK</td>
<td>3116015</td>

</tr>

<tr height="26">
<td height="26">Ankara State Conservatory </td>
<td>Münevver YENİÇELİK</td>
<td>2126210</td>

</tr>
<tr height="26">
<td height="26">Office of the Legal Counsel</td>
<td>Ahmet KARABOĞA</td>
<td>3052346</td>

</tr>
<tr height="26">
<td height="26">Internal Audit Unit</td>
<td>Ayşe DİLBEROĞLU</td>
<td>3052552</td>

</tr>
<tr height="26">
<td height="26">Department of Administrative and Financial Affairs</td>
<td>İbrahim SEZER</td>
<td>3054107</td>

</tr>
<tr height="26">
<td height="26">Department of Library and Documentation</td>
<td>Serpil VAROL</td>
<td>2976585</td>

</tr>
<tr height="26">
<td height="26">Department of Student Affairs</td>
<td>Özkan AY</td>
<td>2976570</td>

</tr>
<tr height="26">
<td height="26">Department of Personnel</td>
<td></td>
<td></td>

</tr>
<tr height="26">
<td height="26">Department of Health, Culture and Sports</td>
<td>Murat GÜNAYDIN</td>
<td>3051759</td>

</tr>
<tr height="26">
<td height="26">Department of Strategy Development</td>
<td>Murat AKBAY</td>
<td>3052188</td>

</tr>
<tr height="26">
<td height="26">Department of Construction and Technical Works</td>
<td>Kenan KORKMAZ</td>
<td>2972447</td>

</tr>
<tr height="26">
<td height="26">Scientific Research Projects</td>
<td>Leyla SEVİM</td>
<td>2976133/118</td>

</tr>
<tr height="26">
<td height="26"><div align="left">Health Services Unit</div></td>
<td>İlkem DEMİRCİ</td>
<td>3053146</td>

</tr>
</table>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-update', 'en', 'Certificate Update', '
<div class="icerik">
The certificate update service can be utilised in the following circumstances:
<li>The card becoming unusable due to the PUK code being entered incorrectly in succession</b>
<li>Loss, theft, or malfunction of the smart card
<li>Changes to identity information
<br>The signature creation data and the certificate are loaded onto a new smart card and delivered to the certificate holder, <b>with the production cost being covered by the certificate holder.</b> <br><br>

<b>Warranty Coverage - Hardware Malfunction</b><br>
If you are experiencing an e-signature issue, you can have your card reader checked by contacting the KAMU SM Call Centre at 444 5 576 or by sending a screenshot of the error you received via e-mail to bilgi[at]kamusm.gov.tr. Following the check, a solution will be provided to you during the call or via e-mail. <br>If the problem arises from certificate production errors or hardware malfunctions within the warranty period (excluding misuse), it is covered by the warranty. In such cases, after the malfunction is inspected and approved by the authorities, a new certificate is issued to the certificate holder. The update cost is covered by KAMU SM.
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('e-signature-workflow', 'en', 'Application Workflow', '
<div class="icerik">
<img src="/images/eimza/isakisi_20141120_personel.jpg" width="623" height="860" border="0">
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('email', 'en', 'E-mail Operations', '
<div class="icerik">

<ul>
    <li><a href="https://posta.hacettepe.edu.tr" target="_blank">E-mail Login</a></li>
    
  <li><a href="/en/email-account" target="_blank">Create New E-mail Account</a> </li>
  <li><a href="https://portal.hacettepe.edu.tr/hesap/kullaniciadimiunuttum" target="_blank">Forgot Username</a></li>
  <li><a href="https://portal.hacettepe.edu.tr/hesap/sifremiunuttum" target="_blank">Forgot Password</a></li>
  <li><a href="https://portal.hacettepe.edu.tr/login" target="_blank">Update Password</a></li>
  <li><a href="https://portal.hacettepe.edu.tr/login" target="_blank">Update Information</a> </li>
  <li><a href="https://portal.hacettepe.edu.tr/login" target="_blank">Update Phone Number</a><br />
  </li>
  <li><a href="/en/proxy-spam" target="_blank">Proxy-Spam Control</a></li>
    <li><a href="/en/email-migration">Microsoft Exchange Connection Settings</a><br />
  </li>



</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('email-account', 'en', 'Opening a New Email Account', '
<div class="icerik">
 <p>To Obtain a Personal Email Account:</p>
 <ul>
   <li><strong>For our newly registered associate degree and undergraduate students;</strong></li>
 </ul>
 <p>Following their registration date, institutional electronic mail accounts with the @hacettepe.edu.tr extension are automatically opened by the Department of Information Technology and sent as a message to the mobile phone number or email address registered in BİLSİS (Student Information System).<br>
   If the message is not received, it is necessary to access the account information by using the &ldquo;Forgot My Username&rdquo; and &ldquo;Forgot My Password&rdquo; buttons on the Department of Information Technology Portal page.</p>
 <ul>
   <li><strong>For our Hacettepe University Master''s and Doctoral Students;</strong></li>
 </ul>
 <p>Following their registration date, institutional electronic mail accounts with the @hacettepe.edu.tr extension are automatically opened by the Department of Information Technology and sent as a message to the mobile phone number or email address registered in PRENS (Institute Student Information System).<br>
   If the message is not received, it is necessary to access the account information by using the &ldquo;Forgot My Username&rdquo; and &ldquo;Forgot My Password&rdquo; buttons on the Department of Information Technology Portal page.</p>
 <ul>
   <li><strong>Our Hacettepe University &ldquo;Academic&rdquo; and &ldquo;Administrative&rdquo; staff;</strong></li>
 </ul>
 <p>Our academic/administrative staff who wish to obtain an electronic mail account must contact the Call Centre at the telephone number 0.312 297 62 62.</p>

 <p> <STRONG>To Obtain an Institutional Email Account:</STRONG></p>
 <p> It is possible to obtain a separate email account for an entity such as a faculty, institute, department, unit, university-related society, project group, organisation, etc., within Hacettepe University. For this purpose, a written request must be submitted to our department by the administration of the relevant authority (dean, head of department, directorate, etc.) to which you are affiliated. The request must explicitly state the purpose for which this account will be opened, who will be responsible for it, and for how long it will remain open. </p>

 <p> <STRONG>To Obtain an Alumni Email Account:</STRONG></p>
 <p>
   In order to help our users communicate more efficiently and effectively within the Hacettepe University Electronic Mail Systems, improvement and development works have been carried out, and as of 11 May 2022, the <strong>new email system (Microsoft Exchange)</strong> has been put into use.</p><p>
   Considering our alumni''s loyalty to our University, based on the <strong><em>Senate decision dated 8.12.2022 and numbered 2022-000</em></strong> which entered into force, Hacettepe University alumni have been enabled to obtain institutional email accounts without having to be members of the Alumni Association. </p>
   <p><a href="/en/alumni-email">Click here for detailed information</a></p>


 <p><STRONG>For the relevant forms,<a href="/en/forms"> click here.</a></STRONG></p>
 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('email-backup-video', 'en', 'Old E-mail Backup Procedures (Video Guide)', '
<div class="icerik"> +  + <p><strong>Old E-mail Outlook Backup</strong></p> + <div class="embed-responsive embed-responsive-16by9 mb-3"> + <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/2gA3lCvhmm8" allowfullscreen></iframe>+ </div> + + + <p><strong>Old E-mail Outlook Restore from Backup</strong></p> + <div class="embed-responsive embed-responsive-16by9 mb-3"> + <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/uaWXIfhdMPE" allowfullscreen></iframe>+ </div> + + + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('email-migration', 'en', 'Information on the New Hacettepe University Email Service (Microsoft Exchange Service)', '
<div class="icerik">


         <p class="mt-0"><strong>Installation Settings</strong></p>


     <p><a href="/dosyalar/yenimail/web_arayuz_giris.pdf" target="_blank">Login via the Email Interface</a></p>
        <p><a href="/dosyalar/yenimail/outlook_kurulum.pdf" target="_blank">Outlook Email Account Settings</a></p>
  <p><a href="/dosyalar/yenimail/android_outlook_191125.pdf" target="_blank">Outlook Email Account Settings on Android Devices</a></p>
         <p><a href="/dosyalar/yenimail/Android_posta_kurulum_250522.pdf" target="_blank">Android Email Account Settings</a></p>
         <p><a href="/dosyalar/yenimail/ios_kurulum_250522.pdf" target="_blank">iOS Email Account Settings</a></p>
         <p><a href="/dosyalar/yenimail/MACOSkurulum2.pdf" target="_blank">macOS Email Account Settings</a></p>


         <p></p>


 <p><strong>Why are we changing the email service?</strong></p>
  <p>We are replacing the email system utilised at our university in order to:</p>
 <ul>
   <li>Manage users efficiently and securely,</li>
   <li>Keep pace with developing technologies,</li>
   <li>Meet contemporary cybersecurity requirements,</li>
   <li>Provide a more reliable and user-friendly service,</li>
   <li>Find time- and cost-effective solutions for potential issues,</li>
   <li>Clean up historical data pollution to a certain extent.</li>
 </ul>
 <p></p>

 <p><strong>With this change:</strong></p>
 <ul>
   <li>Microsoft&rsquo;s Exchange service will be utilised.</li>
   <li>Your emails will be migrated to the new system.</li>
   <li>The storage space allocated for each user to retain their emails has been set to <span class="text-danger">5 GB</span>.</li>
   <li>A <span class="text-danger">100 GB OneDrive</span> cloud storage space will be provided for Hacettepe University students.</li>
   <li>User information and emails will be stored on our servers at the Hacettepe Department of Information Technology. </li>
   <li>Other Microsoft services we offer will operate more harmoniously in conjunction with the new system. </li>
   <li>You will continue to be able to use the services that were accessible with your email username and password in the legacy system (e.g., wireless internet service, software repository).</li>
 </ul>

 <div class="uyari alert alert-warning">
   <p>Warning 1: Each user will be permitted to send a maximum of<strong> </strong>50 external emails within a 24-hour period.<br>
   Warning 2: The maximum email size a user can send in a single message will be <strong>25 MB</strong>.<br>
   Warning 3: The maximum <strong>number of recipients</strong> to whom a single email can be delivered will be <strong>30</strong>.</p>
 </div>



 <p><strong>To use the new email system,</strong></p>
 <ol>
   <li>Please visit the <a href="https://portal.hacettepe.edu.tr" target="_blank">portal.hacettepe.edu.tr</a> address.<strong></strong></li>

   <li>Complete the information update process. <a href="https://portal.hacettepe.edu.tr/hesap/bilgiguncelleme" target="_blank">(Information Update)</a>
   <ul>
     <li>Click the Information Update button on the screen that appears. Log in using your current email username and password.</li>
     <li>Fill in the fields on the information update screen completely and accurately.</li>
     <li>Approve the Email User Agreement.</li>
     <li class="text-danger">The information collected on the information update screen is requested for verification purposes via MERNİS. It is not recorded in our system.</li>
     <li>
       <div class="embed-responsive embed-responsive-16by9 mb-3">
   <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/1q2ingOIwEY" allowfullscreen></iframe>
 </div>
     </li>
     <li><a href="/dosyalar/BilgiGuncellemeDokuman.pdf" target="_blank"><strong>Information Update Document (.PDF)</strong></a></li>
   </ul>
   </li>
   <li>Complete the password update process.
     <ul>
       <li>On this page, enter your current password and then set your new password. </li>
   <li>Please ensure that your new password is at least 8 characters long, contains at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character, and does not include Turkish characters.</li>
   <li>
       <div class="embed-responsive embed-responsive-16by9 mb-3">
   <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/CmwHF20CFrw" allowfullscreen></iframe>
 </div>
     </li>

     <li><a href="/dosyalar/SifreGuncelleme.pdf" target="_blank"><strong>Password Update Document (.PDF)</strong></a></li>

     </ul>
   </li>

   <li>You can begin using the new email service by logging in at <strong><a href="https://posta.hacettepe.edu.tr" target="_blank">posta.hacettepe.edu.tr</a></strong>.</li>
   <li>After the new email system is actively in use, our users will be able to access their legacy email inboxes via <a href="https://eskiposta.hacettepe.edu.tr" target="_blank">eskiposta.hacettepe.edu.tr</a> until the transition process is complete. The <a href="https://eskiposta.hacettepe.edu.tr" target="_blank">eskiposta.hacettepe.edu.tr</a> address will become active upon the deployment of the new email system.</li>
 </ol>

 <div class="uyari alert alert-warning">
 <p>Warning 1: Each user will be permitted to send a maximum of 200 external emails within a 5-minute period.<br>
   Warning 2: For your security, it is crucial that your new password differs from your last 3 passwords.<br>
   Warning 3: No one, including the Department of Information Technology staff, will ever ask you to share your personal password. Therefore, do not share your password with anyone.<br>
   Warning 4: It is mandatory to change your password at least once every 90 days.<br>
   Warning 5: If you still encounter an error after correctly completing the steps, please contact the Call Centre for assistance at 0 312 297 6262.</p>
 </div>








 <p></p>
 <p><a href="/dosyalar/EskiEpostaYedekAlmaIslemleri.pdf" target="_blank">Legacy Email Backup Procedures</a></p>
 <p><a href="/en/email-backup-video">Legacy Email Backup Procedures (Video Tutorial)</a></p>
 <p><a href="/dosyalar/epostayonergesi_300120.pdf" target="_blank">HU Email Directive</a></p>


</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('external-access', 'en', 'External Access Rules', '
<div class="icerik">


<p><STRONG>Rules Defined on the Firewall</STRONG></p>
In order to make the use of Hacettepe University''s informatics resources more effective and efficient, a series of regulations have been implemented on the "Firewall" and "Router" devices located at our university''s main Internet gateways. These regulations aim to ensure both that our Internet traffic flows smoothly and to protect our users against certain attacks that may come from the outside.
<p><STRONG>Suppression of Traffic Using Peer-to-Peer Technology</STRONG></p>
The Department of Information Technology of Hacettepe University has deployed a hardware/software system to block the file transfer of certain popular peer-to-peer programmes since the beginning of 2006. The reasons for this can be summarised as follows:
<UL>
  <LI>Our Internet traffic analyses have shown that the biggest reason for the congestion we experience in our Internet traffic is that some of our users, consciously or unconsciously, continuously use various file sharing programmes (peer-to-peer programmes: e.g. torrent clients, emule, e-donkey, etc.) during the day. These programmes are mostly used to download large files of hundreds of megabytes in length, and by their nature, they also open the files being downloaded or already downloaded to the sharing of off-campus users at the same time. This means that a single computer connects to hundreds-thousands of points simultaneously. Our devices that provide Internet connection, especially the firewall devices we use for the Internet security of our campus, struggle greatly to handle this level of traffic, no matter how powerful they are. No matter how much the connection speed and capacity are increased, it is not unforeseeable that the use of "peer-to-peer" programmes, which is also one of the problems of many universities in the world, will saturate this over time as well.</LI>
  <LI>Another issue that is particularly ignored by some users is whether some of the shared files have copyrights. As it is known, both the downloading of such files and their sharing externally are carried out over IP addresses registered to our university. It is possible that files shared externally put our institution in a difficult situation legally.</LI>
</UL>
<p>Although the technology used is not perfect, there has been a significant improvement in Internet connection performance. The aim is not to restrict users, but merely to improve the sharing of equity resources. For this reason, other technologies, addresses, and methods thought to congest network traffic are not blocked for the time being. The tendency of our department is to contribute to raising the awareness of users rather than increasing technical blockages and to reduce unnecessary traffic that will be caused by pests such as viruses/worms on campuses by ensuring the use of licensed software.</p>
<p><STRONG>Port Restrictions</STRONG></p>
Internet ports that do not harm users'' Internet access, but which will facilitate the entry of certain malicious programmes or computer hackers into systems by exploiting vulnerabilities in the operating systems used, have been closed at the WAN entrance of the campuses. Different regulations are implemented in different regions of the university in line with the hardware infrastructure, Internet gateway capacity, user profile, and requirements of that location.
<p>If you think that your work is disrupted due to port restrictions, you can call the Call Centre of our department or send an e-mail to cagrimerkezi@hacettepe.edu.tr.</p>
<p><STRONG>Intrusion Detection and Prevention Systems (IDS, IPS)</STRONG></p>
Again in parallel with the requirements of different regions of our university, Intrusion Detection and Prevention systems are used at the WAN entrances of the campuses. Undoubtedly, none of these systems is flawless, but by using certain basic algorithms, they manage to block many attacks attempted to be made.
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('faq', 'en', 'Frequently Asked Questions', '
<div class="icerik">
      
      
      
      
      
      
      
      <div class="container">
      <div class="panel-group" id="accordion">
      <p style=''color:red;font-weight: bold;font-size: 20px;''>EMAIL SERVICE</p>
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">I am a member of the university, how can I get an electronic mail account?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse1" class="panel-collapse collapse">
      
      <div class="panel-body"><a href="/en/email-account">Click here for detailed information</a></div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">How can I obtain an electronic mail account for use by a department/sub-department/faculty/symposium/congress, etc.?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse2" class="panel-collapse collapse">
      
      <div class="panel-body">It is possible to obtain a separate email account for a faculty, institute, department, unit, university-related community, project group, organisation, etc., within Hacettepe University. For this, a written request must be submitted to our department by the administration of the authority you are affiliated with (dean, head of department, directorate, etc.). The Corporate Electronic Mail Request Form must be filled out and attached to the letter.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">What can I use the electronic mail account assigned in my name for?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse3" class="panel-collapse collapse">
      
      <div class="panel-body">
      <ol>
      <li>For communication,</li>
      <li>To connect to wireless networks on campus,</li>
      <li>To access Library Resources from off-campus,</li>
      <li>To apply for student accommodation,</li>
      <li>You can use it to log in to the Management Systems (Academic and Administrative Staff).</li>
      </ol>
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">I forgot the password for my electronic mail account, how can I get it?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse4" class="panel-collapse collapse">
      
      <div class="panel-body">
      You can obtain your temporary password from the <a href="portal.hacettepe.edu.tr" target="_blank">portal.hacettepe.edu.tr</a> address using the "I Forgot My Password" button under the "E-mail Transactions" menu.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">I forgot the username for my electronic mail account, how can I find it out? </a>
      
      </p>
      
      </div>
      
      
      <div id="collapse5" class="panel-collapse collapse">
      
      <div class="panel-body">You need to find out your username by using the "I Forgot My Username" button on the Department of Information Technology Portal.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse6">How long can I use the password for my electronic mail account?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse6" class="panel-collapse collapse">
      
      <div class="panel-body">
      For security reasons, you can use the password assigned to you for 180 days. Therefore, you need to update it every 180 days so that your password is not blocked from use.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse7">How can I change/update the password for my electronic mail account?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse7" class="panel-collapse collapse">
      
      <div class="panel-body">
      You need to update your password by using the "Update Password" button on the Department of Information Technology Portal.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse8">What should I pay attention to when changing the password for my electronic mail account?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse8" class="panel-collapse collapse">
      
      <div class="panel-body">
      <ol>
      <li>The password you choose must be at least 8 and at most 15 characters.</li>
      <li>The password you choose must contain one uppercase letter, one lowercase letter, one number and one special character (~!@#?$%^&()_- ).</li>
      <li>The password you choose must not contain the letters (ı,İ,ğ,Ğ,ş,Ş,ü,Ü,ö,Ö,ç,Ç) due to technical limitations.</li>
      </ol>
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse9">Are my electronic mail account username and password the same as my BİLSİS username and password?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse9" class="panel-collapse collapse">
      
      <div class="panel-body">
      The username and password of the electronic mail account with the @hacettepe.edu.tr extension defined in your name are different from your BİLSİS password. The username and password for the Student Information System (BİLSİS) are provided by the Information Systems Directorate of the Department of Student Affairs.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse10">I cannot get a password from the Department of Information Technology portal screen, what should I do?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse10" class="panel-collapse collapse">
      
      <div class="panel-body">
      To be able to get a password from the Department of Information Technology portal screen, you must have previously updated your information. Since you will not be able to update your information if you forget your password or if your password is blocked, you need to contact the Call Centre in such cases and have an "Information Update" done.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse11">Can I use my electronic mail account after graduating or leaving the university?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse11" class="panel-collapse collapse">
      
      <div class="panel-body">
      Your electronic mail account will be closed to use within the period determined by the Electronic Mail Directive in case of your graduation or termination of your relationship with our University.
      Our graduates who wish to obtain an alumni account can obtain a corporate electronic mail account by using the "Open New Account (Alumni Account)" button on the Department of Information Technology Portal.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse12">How can I migrate emails from the electronic mail account?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse12" class="panel-collapse collapse">
      
      <div class="panel-body">
      You need to set up your account on the mail client by following the relevant instructions at the <a href="/en/email-migration" target="_blank"> https://bidb.hacettepe.edu.tr/tr/eposta_gecis </a> link address.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse13">What do I need to do to close my electronic mail account?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse13" class="panel-collapse collapse">
      
      <div class="panel-body">
      After filling out and signing the <A href="/dosyalar/BGYS-F-12e-PostaiptalFormu.docx">E-mail Cancellation Form</A> located under the "Forms" heading on our home page, you need to submit it to the Call Centre.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse14">What do I need to do to change the username of my electronic mail account (including compulsory reasons)?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse14" class="panel-collapse collapse">
      
      <div class="panel-body">
      The username of the account assigned to you can only be changed by closing the account and opening a new one. For this, the user must apply to the Call Centre in person or by email by filling out the "E-mail Cancellation Form".
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse15">Is it possible to create a mailing list?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse15" class="panel-collapse collapse">
      
      <div class="panel-body">
      It is possible, but you must apply to our department with an official letter regarding the address you request.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse16">How can access to and use of the mailing list be made?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse16" class="panel-collapse collapse">
      
      <div class="panel-body">
      You can review the document by clicking on the <a href="/dosyalar/haberlesme101023.pdf" " target="_blank">communication</a> link.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse17">My emails were deleted by mistake, what can I do?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse17" class="panel-collapse collapse">
      
      <div class="panel-body">
      You can access the necessary document from the <a href="/dosyalar/e-postakurtarma101023.pdf" target="_blank">email recovery</a> link.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse18">When I log into my account from the SUN-JAVA interface, my inbox folder does not appear, why?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse18" class="panel-collapse collapse">
      
      <div class="panel-body">
      If you cannot see your inbox folder when you log into the interface with your username and password, your account has been automatically blocked by the system because it is spreading spam emails. In such a case, you need to unblock it by using the "Proxy-Spam check" button in the "E-mail Transactions" menu at the <a href="portal.hacettepe.edu.tr">portal.hacettepe.edu.tr</a> address and change your password for security reasons.
      <br>If you cannot remove the block, you need to contact the Call Centre.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse19">What is the determined quota for cloud storage space? What should I do to increase it?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse19" class="panel-collapse collapse">
      
      <div class="panel-body">Every user is given 1 TB of OneDrive cloud space. This space cannot be increased.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse20">What do I need to do to make an external connection on the system(s) and access the servers?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse20" class="panel-collapse collapse">
      
      <div class="panel-body">Access from off-campus can be provided by making a VPN connection. For this, a written request must be submitted to our department. The VPN Connection Request Form must be filled out and attached to the letter.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      <p style=''color:red;font-weight: bold;font-size: 20px;''>EDMS</p>
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse21">The New Electronic Document Management System (EDMS)</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse21" class="panel-collapse collapse">
      
      <div class="panel-body">
      For the new EDMS installation, logging in, creating documents, wet-signed business processes, e-signature
      installation and usage, help information, and contact information of the responsible persons to apply to when there is a problem, the address <a href="http://www.ebysbilgilendirme.hacettepe.edu.tr" target="_blank">http://www.ebysbilgilendirme.hacettepe.edu.tr</a> should be
      used.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      <p style=''color:red;font-weight: bold;font-size: 20px;''>PROXY</p>
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse22">What is the proxy service?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse22" class="panel-collapse collapse">
      
      <div class="panel-body">
      A proxy is an auxiliary gateway system that provides communication between a computer on the internet and other computers connected to the internet. A proxy server executes the requests it receives from you and forwards the result back to you.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse23">How can I access library resources from off-campus?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse23" class="panel-collapse collapse">
      
      <div class="panel-body">
      Only members of Hacettepe University can access electronic resources remotely. For this, you need to have received an electronic mail account with the @hacettepe.edu.tr extension and made the necessary Proxy settings on your device.
      <br>For Proxy Settings, you can use the <a href="/en/proxy" target="_blank"> https://bidb.hacettepe.edu.tr/tr/proxy </a> address.
      
      
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse24">Although I have made the proxy settings completely and entered my username and password correctly, the same screen constantly appears, what should I do?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse24" class="panel-collapse collapse">
      
      <div class="panel-body">The fact that you cannot connect despite having made the proxy settings and entered your username and password indicates that your account has been automatically blocked by the system. To remove the block, you need to contact the Call Centre.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      <p style=''color:red;font-weight: bold;font-size: 20px;''>INTERNET</p>
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse25">How can I connect to wireless networks on campus?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse25" class="panel-collapse collapse">
      
      <div class="panel-body">All academic/administrative staff and students who are members of our university can connect to the HACETTEPE and EDUROAM networks on our campuses. For this, they need to have an electronic mail account with the @hacettepe.edu.tr extension.
      To connect to the HACETTEPE network, it is sufficient to type the username and password into the interface.
      To connect to the EDUROAM network, it is necessary to visit the <a href="https://eduroam.hacettepe.edu.tr/" target="_blank">https://eduroam.hacettepe.edu.tr</a> internet address.
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse26">Why can''t I connect to wireless networks?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse26" class="panel-collapse collapse">
      
      <div class="panel-body">
      You may not be able to connect to wireless networks for the following reasons.
      <ol>
      <li>Your password may have expired.</li>
      <li>The settings made for the device may have been reset.</li>
      <li>The device''s version may need to be updated.</li>
      <li>The wireless networks to which the device was previously connected may need to be forgotten.</li>
      </ol>
      </div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse27">I cannot connect to the wired internet, what can I do?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse27" class="panel-collapse collapse">
      
      <div class="panel-body">For detailed information and assistance, you need to contact the Call Centre at the phone number 0.312 297 62 62.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse28">What can I do to have an internet socket installed?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse28" class="panel-collapse collapse">
      
      <div class="panel-body">For the installation of an internet socket, the Directorate of Construction and Technical Works must be contacted, and after the process is finished, the Call Centre must be informed to activate the line.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse29">How can we meet our network cable needs?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse29" class="panel-collapse collapse">
      
      <div class="panel-body">If information is provided via the Problem Notification Support System regarding how much cable is needed, assistance is provided by the Network unit.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      <p style=''color:red;font-weight: bold;font-size: 20px;''>WEB SERVICE</p>
      <div class="panel panel-default">
      
      <div class="panel-heading">
      
      <p class="panel-title">
      
      <a data-toggle="collapse" data-parent="#accordion" href="#collapse30">How can I obtain web space for use by a department/sub-department/faculty/symposium/congress, etc.?</a>
      
      </p>
      
      </div>
      
      
      <div id="collapse30" class="panel-collapse collapse">
      
      <div class="panel-body">It is possible to obtain web space for a faculty, institute, department, unit, university-related community, project group, organisation, etc., within Hacettepe University. For this, a written request must be submitted to our department by the administration of the authority you are affiliated with (dean, head of department, directorate, etc.). The Web User Code Request Form must be filled out and attached to the letter.</div>
      
      <p>&nbsp;</p>
      </div>
      
      </div>
      
      

<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse31">What should I do for information, corrections, and additions to be included on the Hacettepe University website?</a>
</p>
</div>
<div id="collapse31" class="panel-collapse collapse">
<div class="panel-body">For information, corrections, and additions to be included on the site, you must apply to <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a>.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse32">What should I do to get a personal web page?</a>
</p>
</div>
<div id="collapse32" class="panel-collapse collapse">
<div class="panel-body">The personal web spaces of all our University members who receive a Hacettepe University e-mail account are defined when they open their account. The files that make up your web pages are located in the public_html folder that you will open via FTP on the server hosting your personal web page. Your home page (landing page) name must be index (such as .html, .htm, .php...). You need to view your web page from the address http://yunus.hacettepe.edu.tr/~username using any browser.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse33">I''m having a problem while doing FTP, what could be the reason?</a>
</p>
</div>
<div id="collapse33" class="panel-collapse collapse">
<div class="panel-body">Since the files that make up your web pages are located in the public_html folder that you will open via FTP on the server hosting your personal web page, your folder might not have been created.
<br>Your password may have expired.
<br>You may be entering an incorrect user or password. In such a case, you must send an e-mail to <a href="mailto:bidb@hacettepe.edu.tr">bidb@hacettepe.edu.tr</a> or contact the Call Centre.
</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse34">Can I use MYSQL, what should I do?</a>
</p>
</div>
<div id="collapse34" class="panel-collapse collapse">
<div class="panel-body">All our users have the right to use mysql. Our users who want to use Mysql must notify their database requests via e-mail to <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a>.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse35">What is the Content Management System? Who can use it?</a>
</p>
</div>
<div id="collapse35" class="panel-collapse collapse">
<div class="panel-body">
HU-CMS is a web-based application where you can centrally manage the content of your web pages. With this application, you can enter content and edit content on your website. While making these arrangements, you can perform your operations through your browser without needing any programme.<br>
HU-CMS can be used by the following units.
<ul>
<li>Faculties</li>
<li>Departments</li>
<li>Units</li>
<li>Research Centres</li>
<li>Institutes</li>
<li>Schools</li>
<li>Vocational Schools</li>
<li>Student Communities</li>
<li>Congresses Organised by Hacettepe University</li>
</ul>
</div>
<p>&nbsp;</p>
</div>
</div>
<p style=''color:red;font-weight: bold;font-size: 20px;''>E-SIGNATURE</p>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse36">How can I apply for an electronic signature?</a>
</p>
</div>
<div id="collapse36" class="panel-collapse collapse">
<div class="panel-body">For any information and assistance regarding electronic signature, you must visit the E-signature User Guide (<a href="https://bidb.hacettepe.edu.tr/eimza/basvuru.php">https://bidb.hacettepe.edu.tr/eimza/basvuru.php</a>) or send an e-mail to <a href="mailto:eimza@hacettepe.edu.tr">eimza@hacettepe.edu.tr</a>.</div>
<p>&nbsp;</p>
</div>
</div>
<p style=''color:red;font-weight: bold;font-size: 20px;''>HUYS</p>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse37">Why can''t I log in to the Management Systems?</a>
</p>
</div>
<div id="collapse37" class="panel-collapse collapse">
<div class="panel-body">In order for our University''s academic and administrative staff to log in to the system, they must have an e-mail account with the @hacettepe.edu.tr extension. Since the login is done with the username and password of the defined account, your password must be active, and you should not type the @hacettepe.edu.tr extension when typing your username.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse38">I can log in to the Management Systems, but when I click on Individual Transactions, I get a ''you are not authorised'' warning, what can I do?</a>
</p>
</div>
<div id="collapse38" class="panel-collapse collapse">
<div class="panel-body">If you can log in to the system without any problems with your username and password, but you get a ''you are not authorised'' warning when you click on ''Individual Transactions'', the necessary role definition for your account may not have been made. To resolve the problem, you need to call our Department and contact the person responsible for your unit.</div>
<p>&nbsp;</p>
</div>
</div>
<p style=''color:red;font-weight: bold;font-size: 20px;''>APPLICATIONS AND PROGRAMMES</p>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse39">Can I use the SPSS application on my MAC computer? </a>
</p>
</div>
<div id="collapse39" class="panel-collapse collapse">
<div class="panel-body">SPSS does not work on versions after the El Capitan version. Our recommendation is that users use the Windows 10 operating system for SPSS v23.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse40">Does our university offer educational applications free of charge? </a>
</p>
</div>
<div id="collapse40" class="panel-collapse collapse">
<div class="panel-body">Yes, our university offers many applications for educational purposes. You can access these applications at yazilimdeposu.hacettepe.edu.tr. To use the applications without any problems, download the application from yazilimdeposu.hacettepe.edu.tr. Read the installation documents on the page and follow the steps there. Otherwise, you may experience licence problems.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse41">Eset Endpoint application gives a Licence/Update warning. What should I do?</a>
</p>
</div>
<div id="collapse41" class="panel-collapse collapse">
<div class="panel-body">Uninstall the Eset application from your computer, download the up-to-date application from yazilimdeposu.hacettepe.edu.tr and install it on your computer. While uninstalling the application from your computer, make sure that Eset Management Agent is also uninstalled.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse42">What should I do to use Office365 applications?</a>
</p>
</div>
<div id="collapse42" class="panel-collapse collapse">
<div class="panel-body">You can access all the details at <a href="/en/office365" target="_blank">https://bidb.hacettepe.edu.tr/tr/office365</a>.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse43">I get a licence warning when I try to use the Office365 application. What should I do?</a>
</p>
</div>
<div id="collapse43" class="panel-collapse collapse">
<div class="panel-body">Send an e-mail to bidb@hacettepe.edu.tr explaining the situation in detail. Only e-mails sent from your address with the hacettepe extension will be replied to.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse44">I get a licence error when I log in to the office application on my computer with my hacettepe account, what should I do?</a>
</p>
</div>
<div id="collapse44" class="panel-collapse collapse">
<div class="panel-body">To use the Office application with your hacettepe account without any problems, you must download the Office365 application to your computer from office.com and use this application. For detailed information, review the instructions in the link below.
<a href="/en/office365" target="_blank"> https://bidb.hacettepe.edu.tr/tr/office365</a>
</div>
<p>&nbsp;</p>
</div>
</div>
<p style=''color:red;font-weight: bold;font-size: 20px;''>OTHER</p>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse45">I get an error while doing Windows/Office activation, what can I do?</a>
</p>
</div>
<div id="collapse45" class="panel-collapse collapse">
<div class="panel-body">You must report the error code you receive to the Call Centre.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse46">What can I do about hardware failures on my computer?</a>
</p>
</div>
<div id="collapse46" class="panel-collapse collapse">
<div class="panel-body">You must get support for your barcoded computer by using the Department of Information Technology Problem Notification Support System (<a href="https://bidbdestek.hacettepe.edu.tr">https://bidbdestek.hacettepe.edu.tr</a>).</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse47">I cannot print from the network printer, what can I do?</a>
</p>
</div>
<div id="collapse47" class="panel-collapse collapse">
<div class="panel-body">You must make a notification from the Department of Information Technology Problem Notification Support System (<a href="https://bidbdestek.hacettepe.edu.tr">https://bidbdestek.hacettepe.edu.tr</a>).</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse48">How can I apply for a dormitory?</a>
</p>
</div>
<div id="collapse48" class="panel-collapse collapse">
<div class="panel-body">For dormitory application procedures, the ''Accommodation Facilities'' page of the Department of Health, Culture and Sports must be visited. <a href="https://sksdb.hacettepe.edu.tr/bidbnew/category.php?id=3&title=barinma" target="_blank">https://sksdb.hacettepe.edu.tr/bidbnew/category.php?id=3&title=barinma</a></div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse49">What should I do to log in to the E-Learning platform (Blackboard Distance Education System)?</a>
</p>
</div>
<div id="collapse49" class="panel-collapse collapse">
<div class="panel-body">Associate Degree and Undergraduate students<br>
<a href="https://hadi.hacettepe.edu.tr" target="_blank">https://hadi.hacettepe.edu.tr</a>
<br>
Foreign Language Preparatory students and SFL Course students<br>
<a href="https://ydyohazirlik.hacettepe.edu.tr" target="_blank">https://ydyohazirlik.hacettepe.edu.tr</a>
<br>
Faculty of Medicine students,<br>
<a href="https://tipmoodle.hacettepe.edu.tr" target="_blank">https://tipmoodle.hacettepe.edu.tr</a>
<br>
Postgraduate students with and without a thesis;<br>
<a href="https://lisansustu.hacettepe.edu.tr" target="_blank">https://lisansustu.hacettepe.edu.tr</a>
<br>
must log in via these links.<br>
For detailed information and assistance, the Distance Education Application and Research Centre must be contacted.
</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse50">How can I get my Hacettepe University identity card?</a>
</p>
</div>
<div id="collapse50" class="panel-collapse collapse">
<div class="panel-body">You must apply to the Department of Health, Culture and Sports, APK unit for HU-CARD.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse51">I am a university member, can I use the software repository?</a>
</p>
</div>
<div id="collapse51" class="panel-collapse collapse">
<div class="panel-body">All our University members who receive a Hacettepe University e-mail account can use the software repository. They can access licenced software free of charge.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse52">How can I log in to the software repository?</a>
</p>
</div>
<div id="collapse52" class="panel-collapse collapse">
<div class="panel-body">You must log in with the username and password of your Hacettepe University e-mail account, without the @hacettepe.edu.tr extension.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse53">I cannot log in to the BILSIS system, what should I do?</a>
</p>
</div>
<div id="collapse53" class="panel-collapse collapse">
<div class="panel-body">You must contact the Student Affairs Department, Information Systems Directorate via the phone numbers 0.312 297 65 70 (5 Lines) Beytepe / 0.312 305 21 41 Sıhhiye or via the e-mail address hureg@hacettepe.edu.tr.
<br>The BILSIS password is not coming to my registered e-mail, what can I do?
<br>You must contact the Student Affairs Department, Information Systems Directorate via the phone numbers 0.312 297 65 70 (5 Lines) Beytepe / 0.312 305 21 41 Sıhhiye or via the e-mail address hureg@hacettepe.edu.tr.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse54">Where can I get a transcript/diploma?</a>
</p>
</div>
<div id="collapse54" class="panel-collapse collapse">
<div class="panel-body">You must contact the Student Affairs Department, Information Systems Directorate via the phone numbers 0.312 297 65 70 (5 Lines) Beytepe / 0.312 305 21 41 Sıhhiye or via the e-mail address hureg@hacettepe.edu.tr.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse55">I am having problems logging in to the AVESIS, BAPSIS, DAPSIS system, what can I do?</a>
</p>
</div>
<div id="collapse55" class="panel-collapse collapse">
<div class="panel-body">In order to check the login authorisations, the user must send an e-mail to bidb@hacettepe.edu.tr from their corporate e-mail address with the @hacettepe.edu.tr extension.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse56">I am having a problem logging in to the NUCLEUS system, what can I do?</a>
</p>
</div>
<div id="collapse56" class="panel-collapse collapse">
<div class="panel-body">For any information and assistance, you must call the phone numbers 0.312 305 12 78-80 / 0.312 305 41 56.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse57">I am having a problem logging in to the Institute''s system (prens.hacettepe.edu.tr), what can I do?</a>
</p>
</div>
<div id="collapse57" class="panel-collapse collapse">
<div class="panel-body">You must contact the institute you are affiliated with.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse58">What should I do to receive/not receive general announcements?</a>
</p>
</div>
<div id="collapse58" class="panel-collapse collapse">
<div class="panel-body">You must notify your requests to be added to the group to the Press and Public Relations Directorate via the e-mail address bhim@hacettepe.edu.tr. However, you cannot leave the group because e-mails are sent to inform the entire campus. If you do not want the e-mail to reach you; you can make it go to your junk mailbox via the interface. You can access the information on how to do this from the <a href="/dosyalar/istenmeyenposta101023.pdf" " target="_blank">istenmeyen_e-posta</a> link.</div>
<p>&nbsp;</p>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading">
<p class="panel-title">
<a data-toggle="collapse" data-parent="#accordion" href="#collapse59">I cannot access hospital test results, what can I do?</a>
</p>
</div>
<div id="collapse59" class="panel-collapse collapse">
<div class="panel-body">For detailed information and assistance, you must call the phone number 0.312 305 12 78-80.</div>
<p>&nbsp;</p>
</div>
</div>
</div>
</div>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('forms', 'en', 'Forms', '
<div class="icerik"> + + <UL> + + <li><a href="/dosyalar/E-PostaEngelKaldirmaFormu.docx">E-Mail Unblocking Form</a></li> + <li><a href="/dosyalar/E-PostaIptalFormu.docx">E-Mail Cancellation Form</a></li> + <li><a href="/dosyalar/E-PostaTalepFormuKurumsal.docx">E-Mail Request Form (Institutional)</a></li> + <li><a href="/dosyalar/E-PostaGuncellemeFormuKurumsal.docx">E-Mail Update Form (Institutional)</a></li>+ + <li><a href="/dosyalar/E_postaDigerKullaniciTalep_Formu.docx">E-Mail Request Form (Other)</a></li> + <li><a href="/dosyalar/BGYS-F-25MisafirKullaniciTalep Formu.docx">Guest User Request Form</a></li>+ + <LI><A href="/dosyalar/BGYS-F-03SunucuTalepFormuv01.docx">Server Request Form</A></LI> + <LI><A href="/dosyalar/SunucuBakimListesiFormu.docx">Server Maintenance Form</A></LI> + <LI><A href="/en/vpn">VPN Connection Guide</A></LI> + <LI><A href="/dosyalar/SSLVPNBaglantiTalepFormu.pdf" target="_blank">VPN Connection Request Form</A></LI>+ <li><a href="/dosyalar/HUBIDB_YazilimGelistirmeTalepFormu.pdf">Software Development Request Form</a></li> + + + + </UL> + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('hardware', 'en', 'Hardware', '
<div class="icerik">



<p align="justify">The Department of Information Technology of Hacettepe University has infrastructure facilities intended to provide services in the field of informatics services, particularly network devices and fibre cabling.</p>
<p align="justify">In our Beytepe Campus, there are 1 router in operation, two redundant main backbones, 57 semi-backbone layer 3 network switches, 509 layer 2 network switches along with 1761 WIFI devices, and 5 central control devices for WIFI management, as well as 56 WIFI devices independent of the central control devices.</p>

<p align="justify">In our Sıhhiye Campus, there are one operational "router", a redundant main backbone, 1 bandwidth management device, 14 layer 3 network switches, 174 layer 2 network switches along with 274 Wi-Fi devices.</p>
<p align="justify">For the security of our network system, a redundant firewall system is used in front of the campus and servers. For the security of our Sıhhiye Campus, a redundant firewall system and URL filtering systems are used.</p>





</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('home', 'en', 'Overview', '<div class="icerik">
		<p>The  Computer Center was first founded as a &quot;Data Processing Unit&quot; in 1968, but later it became an  independent center.  The main  facilities and services provided by Computer Center in both campuses have a  purpose;</p>
<ul type="disc">
  <li>to provide       computer services for education and research, </li>
  <li>to form, operate       and manage the communications infrastructure       (electronic network structure) in the campuses. </li>
  <li>to provide       hardware, software and end-user support for academic and administrative       units of the university. </li>
  <li>to provide       computer use       opportunities       for students       and academics. </li>
</ul>

		</div>', 'Hacettepe University Department of Information Technology', 'Services, announcements, email, network, software and user support resources from Hacettepe University Department of Information Technology.', 'Hacettepe University, information technology, email, network, software, user support', 't', '72', NULL, 'index, follow', 'WebSite')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('hunet-policy', 'en', 'HUNET Usage Principles', '
<div class="icerik">
<p><strong>1. Definitions</strong></p>
<p><STRONG>Information Technology Resource:</STRONG> The computer network (HUNET) located within the campuses of Hacettepe University and established and managed by the Department of Information Technology, all internal and external networks it is connected to, and all kinds of electronic devices, computers, and by-products connected to this network.</p>
<p><STRONG>HUNET:</STRONG> The general name given to the network that connects information technology resources within Hacettepe University at the department, unit, building, and campus level with a network structure and provides Internet access.</p>
<p><STRONG>IT Centre (BİM):</STRONG> The centre operating within the Hacettepe University Department of Information Technology where systems providing access to all network, server, and similar services are brought together and managed (Information Technology Centre).</p>
<p><STRONG>Campus User:</STRONG> Academic and administrative staff, students, or private or legal persons with usage rights who use the information technology resources found within Hacettepe University by accessing them from within the university campuses.</p>
<p><STRONG>Off-Campus User:</STRONG> Academic and administrative staff, students, or private or legal persons with usage rights who use the information technology resources found within Hacettepe University by accessing them from outside the university campuses through various methods.</p>
<p><STRONG>Visitor:</STRONG> Persons who are not within Hacettepe University but remotely access Hacettepe University''s information technology resources (WEB, FTP, etc.) for various reasons, and persons who are not staff or students of the university but access certain information technology resources (wireless network, etc.) located within the campuses.</p>
<p><strong>2. Statement of Authority and Responsibility</strong></p>
In our university, the authority and responsibility for the establishment and operation of the Internet and Intranet network belong to the Department of Information Technology. The Department of Information Technology is responsible for establishing, operating, and updating the infrastructure created to enable departments and units to reach information technology resources in line with academic, administrative, educational, and research purposes. The Department of Information Technology establishes the main network access points determined in departments and units, carries out the necessary cabling activities for communication with the Information Technology Centre, procures the necessary network switching devices for users to connect to these points, and places them. The responsibility and authority for planning and implementing the system at the technical level belong to the Department of Information Technology. The Department of Information Technology is not responsible for the connections of sub-units such as rooms, offices, and laboratories other than the main access points established in the buildings; these are under the responsibility of the unit/department itself. However, the Department of Information Technology can provide consultancy services when necessary and upon request.
<p>Users of Hacettepe University information technology resources are individually responsible themselves for all kinds of activities they perform using the "user code/password" pair allocated to them on Hacettepe University servers and/or their IP (Internet Protocol) address, the content of all kinds of resources (files, documents, software, etc.) they create using Hacettepe University information technology resources and/or keep on the Hacettepe University information technology resource allocated to them, providing the information requested by authorised bodies regarding the use of the resource accurately and completely, and against the usage rules of the relevant resource, university regulations, the laws of the Republic of Turkey, and the regulations attached to them.</p>
<p>Hacettepe University administration reserves the right to be a direct party in case of any dispute that may arise between Hacettepe University users and private users and third persons or organisations.</p>
<p><strong>3. General Principles for the Use of Information Technology Resources</strong></p>
It is essential that information technology resources are used in relation to educational, instructional, research and development, service, and administrative activities. All uses outside these purposes are only possible as long as they do not restrict the usage made for the purposes mentioned above and are not contrary to the rules and principles below:
<OL>
  <LI>Hacettepe University information technology resources must not be wasted by those who use these resources.</LI>
  <LI>Units making Hacettepe University information technology resources available for use are also considered to have assumed the responsibility regarding the use of these resources. In the event that the resources are used inappropriately by a user affiliated with the unit or department, the opportunity for cooperation between the relevant unit or department management and the Department of Information Technology must be provided.</LI>
  <LI>Users are themselves responsible for the confidentiality, privacy, and security of all kinds of data they send and/or receive over the network and the information inside their computers connected to HUNET. The user must back up data as deemed necessary against any virus - hacker attack or technical accidents that may occur depending on the importance of the data on their computer.</LI>
  <LI>Departments or units are responsible for using the information technology resources allocated to them fairly and in a way that will not prevent the access rights of other users of the university. The management must cooperate with the Department of Information Technology on this issue and, evaluating the usage information received from the Department of Information Technology, must warn their employees or students if they see an action contrary to this rule.</LI>
  <LI>Departments or units are responsible for the incoming and outgoing traffic created by their users. They must quickly evaluate the information and warnings coming from the Department of Information Technology on this issue and apply the necessary sanctions to the user creating contrary and unwanted traffic as soon as possible.</LI>
  <LI>Because users mostly do not value the importance of the data found on their computers, they may not take the necessary precautions, may not be bothered by the presence of malware such as viruses, etc. on their computers, or may not show an effort to detect their presence. However, it is mostly forgotten or unknown that this situation also negatively affects the usage of the university''s information technology resources to a significant degree. Department or unit managements are obliged to raise the awareness of users on this issue as well.</LI>
  <LI>When the Department of Information Technology detects a problem that could threaten security or the operation of the system, it must be able to make a rapid and healthy cooperation with the relevant department or unit management to identify the person or sub-unit; therefore, department or unit managements must document and keep up to date information such as users'' connections, IP / MAC addresses, and which socket on the network access device reaches which computer. If possible, managements must definitely assign a person responsible for the local network structure and provide the Department of Information Technology with the necessary contact information so that this person can be reached rapidly when necessary.</LI>
  <LI>Units or departments must not make arbitrary changes, either at the software or hardware level, on the cabling system, network access devices, and other equipment that the Department of Information Technology has established in its buildings and given the responsibility of safekeeping. In the event of a requirement, the technical person in charge of that unit, determined in advance and notified to the Department of Information Technology, must contact the Department of Information Technology, and the necessary change must be made as a result of mutual information and approval.</LI>
  <LI>Information and files shared over local information technology resources connected to the HUNET network (department servers, personal computers used to share information, etc.) must absolutely not be contrary to general information sharing rules and must not contradict copyright, legality, confidentiality, license conditions, and other regulations.</LI>
  <LI>Hacettepe University information technology resources must absolutely not be used for commercial purposes without the knowledge and permission of the university management, must not cause unfair competition among organisations working for commercial purposes, and must not be used to allow for the generation of commercial income. These resources can in no way be transferred, rented, or sold.</LI>
  <LI>No news, announcement, information, and document belonging to the internal use of Hacettepe University must be transmitted to third parties via HUNET or an environment for their transmission must not be created without permission.</LI>
  <LI>No password given to users to use Hacettepe University Information Technology resources must be given to third parties, and it must not be allowed for third parties to access university information technology resources via HUNET.</LI>
  <LI>HUNET and affiliated information technology resources must absolutely not be used under any circumstances to host and transmit materials contrary to general morality; to engage in activities contrary to the laws of the Republic of Turkey, the regulations attached to them, and the rules and principles determined by Hacettepe University; or for the purpose of making political propaganda.</LI>
  <LI>Placing a "disclaimer" prior to the sharing of unwanted information cannot be seen or shown as an excuse when the above rules are violated.</LI>
  <LI>Our university provides its Internet service from the National Academic Network (ULAKNET) operated by the National Academic Network and Information Centre (ULAKBİM), an institute of the Scientific and Technological Research Council of Turkey (TÜBİTAK), and is subject to the provisions determined by the ULAKNET ACCEPTABLE USE POLICY (UKP). <A href="https://ulakbim.tubitak.gov.tr/sites/images/Ulakbim/ukp-v2011.pdf" target="_blank">Please click here for the UKP.</A></LI>
</OL>
<p><strong>4. Enforcement and Sanctions</strong></p>
In the event that the offered information technology resources are used contrary to the general principles, Hacettepe University authorities may resort to one or several of the actions of warning the user verbally and/or in writing, suspending the network connection temporarily or indefinitely, freezing the user account, taking necessary initiatives to initiate an internal university administrative investigation, or activating judicial mechanisms in line with the laws of the Republic of Turkey, depending on the intensity of the use or the magnitude of the damage given to the resources or persons / organisations.
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('isms', 'en', 'Information Security Management System', '
<div class="icerik">


 <p><a href="/dosyalar/BilgiGuvenligiPolitikasi.pdf" target="_blank">Information Security Policy</a></p>
 <p><a href="/dosyalar/BilgiSistemleriKabulEdilebilirKullanimPolitikasi.pdf" target="_blank">Information Systems Acceptable Use Policy</a></p>

 <p><a href="/dosyalar/ParolaPolitikasi.pdf" target="_blank">Password Policy</a></p>
 <p><a href="/dosyalar/TemizMasaveTemizEkranPolitikasi.pdf" target="_blank">Clear Desk and Clear Screen Policy</a></p>


 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('it-security-tips', 'en', 'Precautions for Computer Accidents', '
<div class="icerik">

<p><STRONG>Factors That Can Harm the Computer</STRONG></p>
<STRONG>Factors threatening the computer in terms of both hardware and the data it contains may include the following:</STRONG>
<UL>
  <LI><STRONG>Hardware failures.</STRONG> Hardware components manufactured for personal computers have a certain lifespan. In particular, the "hard disk", which is the main component where data is stored, is a device containing highly sensitive disks spinning at thousands of revolutions per minute. Just like old record players, but magnetically this time, these disks spinning in a vacuum are read and written by heads that approach them as close as microns without touching them. Therefore, these sensitive devices are mostly damaged by being moved while operating or by receiving sudden impacts while operating. When the lifespan allocated during production is added to this (which can be estimated to some extent from the warranty period), the possibility of hard disks failing one day and losing the data inside is a danger that cannot be ignored. </LI>
  <LI><STRONG>Power outages and electrical faults.</STRONG> A computer, if lacking special protection, can be highly sensitive to sudden power outages. Sudden power cuts while a file is exactly being written to the disk, while the operating system is performing background disk defragmentation, or while the computer is booting up or shutting down can cause significant data losses on the hard disk. Similarly, sudden and massive voltage fluctuations can damage the computer and its data. </LI>
  <LI><STRONG>Failures arising from grounding issues and static electricity.</STRONG> The chips inside the computer, due to their electronic nature, are highly sensitive to currents flowing from accumulated static electricity. This sensitivity increases particularly when plugging or unplugging a hardware component into the computer. Similarly, as a result of improper grounding in the electrical installations of buildings, a potential difference can occur between computer cases and the outside world at a level capable of flowing significant current, and this undesirable current can flow through the computer''s monitor, usb, ethernet (network), serial/parallel port, etc. connectors. This, in turn, can cause hardware malfunctions, and even the loss of some data due to hardware failing at the wrong time. </LI>
  <LI><STRONG>Overheating.</STRONG> One of the factors shortening the lifespan of computers, and perhaps the most important one, is the problem of overheating. Cheap and poorly chosen computer cases, improperly installed cooling components, and overloading of computers can lead to overheating and associated temporary or permanent malfunctions. </LI>
  <LI><STRONG>Attacks by computer hackers.</STRONG> No matter how, no precaution can guarantee 100 percent protection for a computer connected to the Internet network. Computer hackers, whether human or robot, can find a vulnerability and infiltrate your computer or damage it to an extent that prevents its use. Your computer may not suffer hardware damage, but the cost of losing the data inside can exceed the hardware cost many times over. </LI>
  <LI><STRONG>Viruses and other malicious programs.</STRONG> With the same foresight, no antivirus or similar protective software can claim to protect your computer 100 percent from viruses and other malicious entities. Indeed, if this claim were true, it would mean an end for both the harming and protecting sides. While viruses may cause simple damage, such as sending Spam emails or slowing down the Internet connection, they can also possess the power to permanently delete data on the computer. </LI>
  <LI><STRONG>User errors.</STRONG> Users can sometimes, even unknowingly, damage the computer in terms of both hardware and software. The incorrect installation of additional hardware or mistakes made during installation, the incorrect installation of software, accidentally deleted/formatted files/disks, incorrectly installed device drivers, and many other behaviours can serve as examples of user errors. </LI>
  <LI><STRONG>Bugs within installed software or the operating system.</STRONG> Some software packages (especially those from unknown sources) can damage the computer due to bugs within their own structure, and may even render the operating system unusable. This can happen during initial installation, while performing a specific task during use, when certain combinations of tasks are performed together, when other incompatible programs are running simultaneously, or while completely uninstalling the software package. The bugs of some software do not become apparent unless they accumulate; therefore, some bugs can reveal themselves over time. </LI>
</UL>
<p><STRONG>Beneficial Precautions to Take</STRONG></p>
In light of the information above, the points a computer user should pay attention to and the precautions they must take can be listed as follows:
<UL>
  <LI>Always back up your data periodically and without procrastination.</LI>
  <LI>Make sure to use an Uninterruptible Power Supply (UPS) and a Surge Protector. </LI>
  <LI>Through BIOS settings, ensure that the computer does not turn on by itself when power is restored after an outage. Find the setting in your computer''s BIOS regarding "what to do when power is restored after an outage" (this usually appears as "Power on failure") and select the "stay off (off)" option instead of the "as in the last state (last state)" option. This will largely prevent the computer from being damaged in consecutive and frequent power cuts and successive fluctuations. </LI>
  <LI>When plugging new hardware into the computer, unplug it from the mains and ground yourself. </LI>
  <LI>While the computer is operating (except USB and Ethernet), do not plug or unplug anything into any socket such as a mouse, serial port, parallel port, keyboard, etc. </LI>
  <LI>Implement the recommendations in our article titled <A href="/en/virus-protection">Recommendations for protection against computer viruses and attacks</A>. </LI>
  <LI>If you are not exactly sure what to do and how to do it on the computer, do not make hardware or software changes. </LI>
  <LI>If possible, install/have installed the software provided with modern motherboards that displays temperature information and check the internal temperature status of the device from time to time.</LI>
  <LI>Pay attention to the grounding of the plug sockets in your building and the room you are in.</LI>
  <LI>Try not to touch the computer while your body is charged with static electricity. </LI>
  <LI>Do not leave your computer on unnecessarily.</LI>
  <LI>Make sure to act in accordance with the rules when shutting down your computer.</LI>
  <LI>Never move your computer while it is on, and do not shake or vibrate the desk it is on. </LI>
</UL>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('lab-rules', 'en', 'PC Laboratory Usage Rules', '
<div class="icerik">

 <p>Hacettepe University Department of Information Technology operates computer laboratories consisting of 75 computers at the Sıhhiye Campus and 260 computers operating on a 24-hour basis at the Beytepe Campus. The laboratories primarily aim to meet the IT requirements of students at the campuses. All computers in the laboratory are connected to the Internet and include office software and auxiliary tools that may be deemed necessary. </p>
 <p>An authorised person responsible for the operation of these laboratories, which are subject to an appointment rule, is also constantly present. </p>
 <p>In order to share resources fairly and optimally, the rules that must be followed in the use of these laboratories are stated below: </p>
 <OL>
   <LI>Only Hacettepe University students can use the computers located in the computer laboratories. It is strictly forbidden for non-university personnel to enter the computer rooms. </LI>
   <LI>Computer access rights are granted to students for a specified period. This period is determined as exact multiples of an academic term. At the end of the usage period, all profiles and disk areas belonging to the relevant user will be deleted. </LI>
   <LI>Usernames and passwords used to log in to the computers are exclusively for the use of the student who received that password. The student receiving the password is personally responsible for its security and confidentiality. In the event that it is determined that the password has been used by someone else, the student who owns the password will be held responsible. </LI>
   <LI>It is forbidden for more than one person to sit at a computer. </LI>
   <LI>It is strictly forbidden to enter computer rooms with food or drinks. </LI>
   <LI>Users may not, for whatever purpose, engage in hack/crack and similar attacks against any computer within or outside the university, and may not even attempt to seize the passwords or data of others. </LI>
   <LI>No disturbing behaviour is allowed in the computer laboratories; noise must not be made, speaking in a loud voice is prohibited, being present for purposes other than computer use such as chatting, etc. is forbidden, and speaking on mobile phones is not allowed. </LI>
   <LI>Users are forbidden from personalising the existing system in line with their own wishes outside the permitted limits and from installing programmes. </LI>
   <LI>The hardware, software, and Internet connections provided are solely for the education, instruction, and communication requirements of students. They cannot be used for any purpose other than these. </LI>
   <LI>The existing CD burners will be used exclusively for backing up personal files. It is forbidden to make any unauthorised copies for purposes other than this. </LI>
   <LI>Users other than the staff responsible for the laboratories will not turn on/off the computers, monitors, and uninterruptible power supplies. Users only need to LOGOUT and leave when their work is finished. The computer cannot be left without performing a LOGOUT. </LI>
   <LI>Computers cannot be used for purposes contrary to general morals, societal rules, laws, and personal rights under any circumstances. </LI>
   <LI>The computer laboratories are monitored 24 hours a day by security cameras and images are recorded. Users must use the laboratories with this awareness. </LI>
   <LI>Students can store their files in the disk spaces allocated to them. However, our university is not responsible for the security and permanence of this data. The user should back up their important files, keeping in mind the possibility that data may be deleted in any extraordinary situation. </LI>
   <LI>The usage rights of users who act contrary to any of the items specified above will be revoked indefinitely, and their situations will be reported in writing to the faculty/department/unit administration to which they are affiliated. </LI>
 </OL>
 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('mail-filtering', 'en', 'E-Mail Filtering Policies', '
<div class="icerik">
  <p>Currently Being Updated.</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('mailing-lists', 'en', 'E-Mail Lists Usage Rules', '
<div class="icerik">

 <p><strong>"GENERAL" Announcement List</strong></p>
 The list frequently used by users is the "GENERAL ANNOUNCEMENT LIST".<BR>
 Users wishing to send messages using the "General" announcement list should send their messages to the <A href="mailto:bhim@hacettepe.edu.tr">bhim@hacettepe.edu.tr</A> address. New users wishing to receive e-mails from the "General" announcement list should register by sending their Name, Surname, and Department information to the <A href="mailto:bhim@hacettepe.edu.tr">bhim@hacettepe.edu.tr</A> address. The management of the list is carried out by the Hacettepe University Directorate of Press and Public Relations.
 <p>This list is a moderated list and is used solely for making announcements that concern the entire university. Considering that even a single message sent to this list, which has thousands of members, occupies traffic and disk space thousands of times the size of that message, our users wishing to send e-mails here must pay attention to certain rules: </p>
 <p>  </p>
 <UL>
   <LI><STRONG>The scopes of the announcements to be made should not exceed the following topics:</STRONG> Rectorate announcements; General Secretariat announcements; Passing away, funeral ceremony, and blood requirement announcements; Announcements regarding basic necessities that concern the entire university such as electricity, water, and Internet; Announcements regarding social and cultural events organised by the Directorate of Press and Public Relations and the Department of Health, Culture and Sports; Conference, congress, and symposium announcements organised by Academic Units. </LI>
   <LI><STRONG>Messages to be sent should be prepared in plain text as much as possible. HTML formatting should be particularly avoided (giving colours, font styles, background images or colours, etc., formats to texts).</STRONG> In addition to the fact that there are many different computers and e-mail reader programmes at our university, we also have users who access their e-mails from entirely different environments abroad. HTML, etc., formatting can even cause some of our users not to be able to view these e-mails at all. </LI>
   <LI><STRONG>Messages to be sent should be written within the e-mail programme as much as possible. Writing in environments such as a Microsoft Word document, etc., and adding it as an attachment to the e-mail should be avoided.</STRONG> Both the aforementioned reasons apply here, and there is a possibility that attachments may carry viruses, etc., contents. Furthermore, attachments occupy many times the space occupied by plain text and both strain the traffic and cause quotas to be filled unnecessarily. </LI>
   <LI><STRONG>If it is absolutely necessary to make an attachment (image, long pdf/word/ppt documents, etc.) to messages, the relevant attachment files should be placed on personal Web spaces or those of the institution instead; and links (e.g. http://yunus.hacettepe.edu.tr/~user/document.pdf) that will allow users to connect to these places should be provided in the e-mail message.</STRONG> If the length of the files to be attached roughly remains under 100-150 KB, then these files can also be attached directly to the e-mail. </LI>
   <LI><STRONG>Even if messages contain attachments, for users who are not suited to open the attachments at that moment, what that message is about and by whom it was sent should be written briefly within the message instead of an empty e-mail.</STRONG> </LI>
   <LI><STRONG>The subject of the messages should be chosen in a way that provides accurate and sufficient information about the content of the message, but does not exceed a few words.</STRONG> For instance, instead of "Announcement of passing away", a subject line like "Announcement of the passing away of the father of XXX YYY" will be more informative. </LI>
   <LI><STRONG>Messages to be sent must not contain advertisements and commercial interests, and must not contravene general societal rules and laws.</STRONG> </LI>
   <LI><STRONG>Sending congratulatory messages due to special days such as Eid, New Year, etc., can be an extremely well-intentioned and polite behaviour; however, it must not be forgotten that such messages create very heavy traffic.</STRONG> Considering that an avalanche effect could occur with individuals taking others as an example and wishing to send such messages themselves, it should be preferred to send these messages to personal addresses rather than to the "GENERAL" list. </LI>
   <LI><STRONG>It is necessary that the messages planned to be sent are read well, their deficiencies are corrected before being sent, and the lengths of the attachments to be made -if any- are checked.</STRONG> Sending messages with incomplete information repeatedly along with their corrections negatively affects traffic and quotas. Not writing the name, title, and affiliated unit of the sender at the end of the messages is among the commonly encountered oversights. </LI>
 </UL>
 <p>The general principles summarised above are valid not only for the "GENERAL" list but also for all similar discussion and announcement lists with many members. </p>
 <p>The list management reserves the right to reject messages sent by our users if they do not comply with the above rules. To obtain more information on this subject, the bhim@hacettepe.edu.tr e-mail address can be consulted. </p>
 <p>The Hacettepe University Department of Information Technology thanks our users for the meticulousness they will show in complying with the principles listed above. </p>
 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('org-chart', 'en', 'Organisation Chart', '
<div class="icerik">

    <table class="table table-borderless">


<tr>
    <td>Mustafa Gökhan GÜZEL</td>
    <td>Head of Department</td>
    <td><a href="mailto:gokhan@hacettepe.edu.tr">gokhan{at}hacettepe.edu.tr</a></td>
  </tr>







  <tr>
    <td>Esin ALAN</td>
    <td>Department Secretary</td>
    <td><a href="mailto:esin.alan@hacettepe.edu.tr">esin.alan{at}hacettepe.edu.tr</a></td>
  </tr>
</table>

<div class="sema">
  <ul class="sema-kok">
    <li>
      <span class="sema-dugum sema-baskan">Head of Department</span>
      <ul class="sema-dal">
        <li class="sema-yan">
          <span class="sema-dugum">Administrative and Financial Affairs Unit</span>
        </li>
        <li class="sema-kol">
          <span class="sema-dugum">Deputy Head of Department <b>(Administrative)</b></span>
          <ul class="sema-birim">
            <li>EDMS and Individual Transactions Unit</li>
            <li>Human Resources Support Unit</li>
            <li>User Support Unit (Beytepe)</li>
            <li>User Support Unit (Sıhhiye)</li>
            <li>System Software Unit</li>
            <li>Software Development Unit</li>
          </ul>
        </li>
        <li class="sema-kol">
          <span class="sema-dugum">Deputy Head of Department <b>(Technical)</b></span>
          <ul class="sema-birim">
            <li>Network Unit</li>
            <li>System and Network Unit (Sıhhiye)</li>
            <li>System and Security Unit</li>
            <li>Web Unit</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>

</div>
', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('matlab-061118', 'en', 'MATLAB Software for Our Students', '
<div class="icerik"> + <p>Dear Students of Our University,<br /> + <br /> + We have procured MATLAB software for our students &mdash; an integrated technical computing environment that combines numerical computations, advanced graphics and visualisation, and a high-level programming language.&nbsp;<br />+ <br /> + MATLAB software, procured for 100 simultaneous users, is accessible to Hacettepe University students; however, due to the campus agreement, it can only be used within the campus.&nbsp;<br /> + <br /> + MATLAB R2018b (Windows, Mac, Linux - 64 bit) DVD installation images and guides can be obtained from our software repository. Detailed information is available on the Software Repository Mathworks&nbsp;MATLAB (Classroom) page.<br /> + <br /> + &nbsp; &nbsp; &nbsp; &nbsp; Hacettepe University Department of Information Technology Portal (<a href="https://portal.hacettepe.edu.tr/">https://portal.hacettepe.edu.tr/</a>)<br /> + <br /> + &nbsp; &nbsp; &nbsp; &nbsp; Username: Your e-mail username (do not include @hacettepe.edu.tr)<br /> + &nbsp; &nbsp; &nbsp; &nbsp; Password: Your current e-mail password<br /> + <br /> + From the Portal left menu: &quot;BIDB APPLICATIONS &gt; Software Repository&quot;, then from the inner left menu: &quot;Academic Software &gt; Mathworks MATLAB (Classroom)&quot;<br /> + <br /> + For your information. Yours sincerely.&nbsp;<br /> + <br /> + Department of Information Technology</p> + + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('mission-vision', 'en', 'Mission and Vision', '
<div class="icerik">

    <p>Our mission is to operate the information technology system of our university by closely following technology; to provide support for education, training, and research, and to fulfil completely the other information technology services that our university will need.</p>
    <p>Our vision is to rank at the top among the universities in Turkey in terms of informatics infrastructure, user satisfaction, organised events, and the quality and diversity of services provided; and to have a quality and technology comparable to the information technology centres of respected universities around the world.</p>

</div>
', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('network', 'en', 'Network Infrastructure', '
<div class="icerik">

<p align="justify">Hacettepe University has two main campuses: Beytepe and Sıhhiye Campuses. Sıhhiye Campus is located in the city centre and mostly houses health-related faculties and departments along with Hacettepe Hospitals. Beytepe Campus is located relatively far from the city centre and houses other faculties and departments of the university such as engineering, literature, science, and education. The main building of the university''s Department of Information Technology is located in Beytepe Campus, and there is an Information Technology Centre affiliated with it in Sıhhiye Campus.</p><p align="justify">
  Each of the Beytepe and Sıhhiye campuses receives high-speed Internet service via UlakNet. Beytepe Campus is connected to Ulaknet with a WAN (Wide Area Network) and Sıhhiye Campus with a Metro Ethernet line. Furthermore, Sıhhiye Campus and Beytepe Campus are connected to each other with a Metro Ethernet line.</p><p align="justify">
  Other faculties and vocational schools spread across different regions of Ankara receive Internet services by connecting to one of the two main campuses mentioned above, depending on their proximity. Connection speeds and types vary according to the requirements of the campus (leased lines, WiFi wireless radio links, direct fibre optic cabling, etc.).</p><p align="justify">Hacettepe University communicates with the outside world using the BGP4 protocol. The autonomous system number of the university is AS24922. The university has 33 C-Class IPv4 address blocks. Departments, units, and student dormitories communicate with the outside world via real IP or virtual IP (+NAT, Network Address Translation) according to their security and requirements. Intranet/Extranet traffic can be provided as a mixture of real/virtual IPs without NAT. There is a 48-bit IPV6 address allocated to our campus by Ulakbim. Currently, the DNS server within the university and the Department of Information Technology operate with IPV6 IPs.</p><p align="justify">
  The WAN / Extranet connections that the university has according to its campuses in Ankara are listed below:</p>
<table class="table">
<thead>
  <tr>
   <th scope="col"colspan="2"><strong>Hacettepe University WAN / Extranet Connections</strong></th>
  </tr>
</thead> 
<tbody> 
  <tr>
    <td>Connection Points</td>
    <td>Connection Type</td>
  
  </tr>
  <tr>
    <td>Beytepe Campus - ULAKNET</td>
    <td>Single Mode Fibre Optic Cable</td>

  </tr>
  <tr>
    <td>Sıhhiye Campus - ULAKNET</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Campus - Sıhhiye Campus</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Campus - Beşevler Conservatory</td>
    <td>METRO Ethernet</td>
 
  </tr>
  <tr>
    <td>Sıhhiye Campus - Social Sciences Vocational School</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Campus - Başkent OSB Technical Sciences Vocational School</td>
    <td>METRO Ethernet</td>
  
  </tr>
  <tr>
    <td>Beytepe Campus - Hacettepe Ankara Industry 1st OSB Vocational School</td>
    <td>METRO Ethernet</td>
 
  </tr>
  </tbody>
</table>





</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('notice-050416', 'en', 'Notices', '
<div class="icerik"> + <p><b>Home Directory Provisioning for Personal Web Pages via FTP</b></p> + + <p>Home directory provisioning on the server for personal web pages takes place when users connect to the server via FTP.<br> + After connecting to the area via FTP, the public_html folder must be created manually in order to transfer web page files. Detailed information is available at <a href="/hizmetlerweb/kisisel.shtml">http://www.bidb.hacettepe.edu.tr/hizmetlerweb/kisisel.shtml</a>.</p>+ + + <p>You may report any issues you encounter by e-mail to <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a>.</p> + + <p>We bring this to your attention.</p> + + <p>HU Department of Information Technology Systems Group</p> + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('notice-110520', 'en', 'Applications Accessible from Within the Campus', '
<div class="icerik"> + + <p>Dear Members of the Hacettepe Community,<br /> + During the distance education process, we would like to share an important announcement to enable our academic staff and students to access software more conveniently.</p> + + + + <p>The applications listed below, which were previously accessible only from within the campus, have been opened for access via the VPN service. In this context,</p> + + <ul> + <li>ARCGIS</li> + <li>SPSS</li> + <li>Matlab Academic &amp; Classroom</li> + + <li>Simapro</li> + </ul> + + <p>a VPN connection must be established in order to use the above software from outside the campus.<br /> + <strong>Please visit <a href="http://www.bidb.hacettepe.edu.tr/tr/VPN" target="_blank">http://www.bidb.hacettepe.edu.tr/tr/VPN</a> for the VPN software download and installation guide.</strong></p>+ + + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('notice-121120', 'en', 'Secure E-Mail Information Notice', '
<div class="icerik"> + + <p>In accordance with measure item 3.1.4.8 of the Information and Communication Security Guide dated 24 July 2020 (<a href="https://cbddo.gov.tr/SharedFolderServer/Genel/File/bg_rehber.pdf" target="_blank">https://cbddo.gov.tr/SharedFolderServer/Genel/File/bg_rehber.pdf</a>), published by the Presidency of the Republic of Turkey, Digital Transformation Office:<br />+ <br /> + &quot;Technologies and standards such as SPF and DKIM shall be employed to reduce the likelihood of forged or integrity-compromised e-mails infiltrating valid domain names.&quot;<br /> + In line with this principle, the necessary work to enable secure e-mail exchange has been carried out by our department.<br /> + <br /> + Within this scope, it is recommended that other institutions activate/update PTR, SPF, and DKIM DNS records as well as DMARC policies on their own domain name servers in order to ensure healthy e-mail communication.<br /> + <br /> + E-mail communications conducted with institutions that have not updated or published the aforementioned records in their DNS entries will be flagged as suspicious/unsolicited (SPAM) in accordance with our institution''s policies.<br /> + <br /> + We kindly draw your attention to this important matter.</p> + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('notice-280425', 'en', 'CONTRACTED IT PERSONNEL EXAMINATION ANNOUNCEMENT', '
<div class="icerik"> + + + <p align="center"><strong>HACETTEPE UNIVERSITY</strong></a><br /> + <strong>DEPARTMENT OF INFORMATION TECHNOLOGY</strong><br /> + <strong>CONTRACTED IT PERSONNEL RECRUITMENT ANNOUNCEMENT</strong><br /> + In accordance with Article 8 of the Regulation on the Principles and Procedures Concerning the Employment of Contracted IT Personnel in Large-Scale Information Technology Units of Public Institutions and Organisations, published in the Official Gazette dated 31/12/2008 and numbered 27097, a total of 3 (three) Contracted IT Personnel — comprising 1 (one) Senior Software Development Specialist (Java), 1 (one) Senior Frontend Development Specialist, and 1 (one) Senior Software Development Specialist — will be recruited by Hacettepe University Department of Information Technology through a written and oral examination, in order of success, to be employed within the Department of Information Technology.</p> + <p><strong>I- APPLICATION REQUIREMENTS</strong><br /> + <strong>A- GENERAL REQUIREMENTS (QUALIFICATIONS)</strong><br /> + a) To meet the general conditions set out in Article 48 of Civil Servants Law No. 657,<br /> + b) To hold a degree from a four-year faculty programme in computer engineering, software engineering, electrical engineering, electronic engineering, electrical and electronic engineering, or industrial engineering, or from an overseas higher education institution whose equivalence has been recognised by the Council of Higher Education,<br /> + c) To have at least 3 years of professional experience for those not exceeding twice the contract salary ceiling, or at least 5 years for others, in the fields of software, software design and development and the management thereof, or in the installation and management of large-scale network systems (Professional experience must be documented as having been gained as IT personnel. In determining professional experience, the following are taken into account: services rendered as IT personnel in a staff position subject to Law No. 657, or in a contracted capacity subject to paragraph (B) of Article 4 of the same Law or to Decree-Law No. 399, as well as periods documented as having been spent as IT personnel in worker status in the private sector with social security premium contributions.)<br /> + d) To demonstrate knowledge of at least two current programming languages, provided that the candidate has knowledge of computer peripheral hardware and installed network management security,<br /> + e) Acceptable documents include: approved undergraduate or postgraduate transcripts specifying the programming languages covered, an approved letter from the graduated department specifying the programming languages taught, an approved letter from an employer indicating the programming languages used, or course participation certificates from training institutions,<br /> + f) To accept the personal rights and other rules specified in the Regulation on the Principles and Procedures Concerning the Employment of Contracted IT Personnel in Large-Scale Information Technology Units of Public Institutions and Organisations,<br /> + g) For male candidates: not to have reached compulsory military service age, or, if having done so, to have completed, deferred, or been exempted from compulsory military service,<br /> + h) To embrace a team-based working and sharing ethos in an intensive work environment,<br /> + ı) To be oriented towards innovative approaches and open to learning,<br /> + i) To possess analytical thinking ability.<br /> + <strong>B. SPECIAL REQUIREMENTS</strong><br /> + <strong>SENIOR SOFTWARE DEVELOPMENT SPECIALIST (Java)</strong><strong> &nbsp;</strong><strong> </strong><br /> + <strong>(1 Person, Full-Time, Up to 3 Times the Monthly Gross Contract Salary Ceiling)</strong></p> + <ul> + <li>To hold a degree from a four-year faculty programme in computer engineering, software engineering, electrical engineering, electronic engineering, electrical and electronic engineering, or industrial engineering, or from an overseas higher education institution whose equivalence has been recognised by the Council of Higher Education,</li> + <li>To have experience in Spring Boot, Spring Core, Spring Data, Spring Security, ORM, JPA (Hibernate), Maven, Apache Wicket, JSF, and JSP. </li> + <li>To have worked in enterprise software development processes using Spring Framework and Spring Boot architectures for at least 5 years,</li> + <li>To have experience in enterprise web-based application development,</li> + <li>To have knowledge and experience in web services (SOAP, REST),</li> + <li>To have worked with and have experience in web technologies such as HTML, CSS, JavaScript, and Angular,</li> + <li>To have experience with ORM (Object Relational Mapping) technologies (preferably Hibernate or Spring Data JPA),</li> + <li>To have worked with at least one version control system (Git, TFS, SVN, etc.),</li> + <li>To have developed applications using at least one relational database such as MySQL, PostgreSQL, or Oracle,</li> + <li>To have experience in database design, optimisation, and performance improvement,</li> + <li>To have knowledge and experience in microservice architecture,</li> + <li>To have knowledge of SOLID principles. </li> + <li>To have knowledge of Application Container (Docker, Kubernetes, OpenShift, …etc.) technologies,</li> + <li>To have used or have knowledge of RabbitMQ and Redis technologies,</li> + <li>To be proficient in the installation and management of Weblogic, Apache, IIS, and similar environments in large-scale systems (applications with at least 20,000 users)</li> + <li>To possess analytical thinking ability and rapid problem-solving skills,</li> + <li>To have strong communication skills and a disposition towards teamwork.</li> + </ul> + <p><strong>Preferably; </strong></p> + <ul> + <li>To have knowledge of DevOps processes, CI/CD practices, and container architectures (Docker, Kubernetes),</li> + <li>To have worked in the software development phases of at least one system with 20,000 or more users,</li> + <li>To have actively participated in ISO 27001 processes </li> + </ul> + <p><strong>SENIOR FRONTEND SOFTWARE DEVELOPMENT SPECIALIST</strong><strong> </strong><br /> + <strong>(1 Person - Full-Time - Up to 3 Times the Monthly Gross Contract Salary Ceiling)</strong></p> + <ul> + <li>To hold a degree from a four-year faculty programme in computer engineering, software engineering, electrical engineering, electronic engineering, electrical and electronic engineering, or industrial engineering, or from an overseas higher education institution whose equivalence has been recognised by the Council of Higher Education,</li> + <li>To have knowledge of UI/UX design,</li> + <li>At least 2 years of experience in developing web applications with Angular (v15+)</li> + <li>To have experience in mobile application development (iOS &amp; Android) with Flutter,</li> + <li>To have knowledge and experience in HTML/CSS/Javascript, Bootstrap, jQuery, Ajax, and similar common libraries and methods, </li> + <li>To have knowledge of TypeScript, </li> + <li>To have knowledge of the DOM and the Javascript Object model, </li> + <li>To have knowledge and experience in at least one front-end development framework/library such as Angular, React, and/or Vue JS,</li> + <li>To have knowledge and experience in version control systems such as Git and SVN, </li> + <li>To have knowledge of CSS pre-processors such as SASS, LESS, and STYLUS, </li> + <li>To be capable of creating Responsive designs compatible with major web browsers, and to have knowledge and experience in Responsive Front-End Frameworks such as Bootstrap and Material, </li> + <li>To have knowledge of Cross-Browser compatibility and interface development.</li> + <li>To have knowledge of software design patterns, </li> + <li>To have knowledge of SOLID principles. </li> + <li>To value documentation and regular reporting, and to be able to adapt to flexible working hours and an intensive workload. </li> + <li>To possess analytical thinking ability and rapid problem-solving skills,</li> + <li>To have strong communication skills and a disposition towards teamwork.</li> + </ul> + <p><strong>Preferably;</strong></p> + <ul> + <li>To have experience in developing web applications with Angular (v15+),</li> + <li>To have worked in enterprise software development processes with Flutter,</li> + <li>To have worked in the software development phases of at least one system with 20,000 or more users,</li> + </ul> + <p><strong>SENIOR SOFTWARE DEVELOPMENT SPECIALIST </strong><br /> + <strong>( 1 Person, Full-Time, Up to 3 Times the Monthly Gross Contract Salary Ceiling )</strong></p> + <ul> + <li>To hold a degree from a four-year faculty programme in computer engineering, software engineering, electrical engineering, electronic engineering, electrical and electronic engineering, or industrial engineering, or from an overseas higher education institution whose equivalence has been recognised by the Council of Higher Education,</li> + <li>To have worked as a software specialist in large-scale information technology units for at least five (5) years,</li> + <li>To have experience in application development using the Laravel PHP framework,</li> + <li>To have knowledge of web service technologies and experience with SOAP and REST services,</li> + <li>To have knowledge and experience in web-based software development using Bootstrap, JavaScript, jQuery, HTML5, and CSS3</li> + <li>To have worked with at least one version control system (Git, TFS, SVN, etc.),</li> + <li>To have developed applications using at least one relational database such as MySQL, PostgreSQL, or Oracle,</li> + <li>To value documentation and regular reporting, to be adaptable to flexible working hours and an intensive workload. i) To be proficient in the installation and management of Weblogic, Apache, IIS, and similar environments in large-scale systems (applications with at least 20,000 users),</li> + <li>To be proficient in the installation and management of Weblogic, Apache, IIS, and similar environments in large-scale systems (applications with at least 20,000 users)</li> + <li>To have knowledge and experience in responsive web design,</li> + <li>To have knowledge and experience in version control systems such as Git and SVN,</li> + <li>To have used and have knowledge of RabbitMQ and Redis technologies,</li> + <li>To possess analytical thinking ability and rapid problem-solving skills,</li> + <li>To have strong communication skills and a disposition towards teamwork.</li> + <li>To have knowledge of SOLID principles. </li> + </ul> + <p><strong>Preferably;</strong></p> + <ul> + <li>To demonstrate knowledge of at least two programming languages, preferably PHP (Laravel Framework) and Java</li> + <li>To have worked in the software development phases of at least one system with 20,000 or more users,</li> + <li>To have actively participated in ISO 27001 processes</li> + </ul> + <p>&nbsp;</p> + <p><strong>II. REQUIRED DOCUMENTS – APPLICATION METHOD – LOCATION – DATE</strong><br /> + <br /> + Applications are to be submitted between 28/04/2025 and 12/05/2025 by completing the "<a href="/dosyalar/basvuruformu_bidb_280425.xlsx">Contracted IT Personnel Application Form</a>" available at https://bidb.hacettepe.edu.tr, attaching a photograph, signing the form, and delivering it either in person or by post (to arrive at the address below by the final application date), together with the documents listed below, to the Department of Information Technology (Hacettepe University Department of Information Technology – Beytepe / ANKARA).</p> + <ul> + <li>Application form (with photograph) (https://bidb.hacettepe.edu.tr ),</li> + <li>Original or notarised copy of the undergraduate diploma or school leaving certificate (if the original document is presented, a photocopy will be certified by our institution),</li> + <li>E-Government Barcoded Higher Education Graduate Certificate</li> + <li>E-Government Barcoded Transcript</li> + <li>Barcoded document obtained from https://www.turkiye.gov.tr/sgk-tescil-ve-hizmet-dokumu for the purpose of verifying employment in the position applied for, </li> + <li>Document demonstrating the professional experience specified in item (c) under the GENERAL REQUIREMENTS (QUALIFICATIONS) heading (Professional experience must be documented as having been gained as IT personnel. Only service periods following undergraduate graduation will be taken into account when calculating durations),</li> + <li>Document demonstrating knowledge of at least two current programming languages, as specified in item (d) under the GENERAL REQUIREMENTS (QUALIFICATIONS) heading,</li> + <li>Certificates and documents demonstrating experience or expertise required under the SPECIAL REQUIREMENTS for each position (Certificates must have been obtained through examination),</li> + <li>KPSS P3 examination result document (Candidates who do not present a KPSS examination result document will be assigned a score of seventy (70).),</li> + <li>Document showing the score obtained in the Public Personnel Foreign Language Proficiency Examination (YDS, etc.) in English, or an equivalent YDS score obtained in another foreign language examination accepted by the Council of Higher Education (Candidates who do not present a document will have their foreign language score assessed as zero).</li> + </ul> + <p><strong>III. EVALUATION OF APPLICATIONS AND ANNOUNCEMENT OF RESULTS</strong><br /> + Following the review of applications, candidates who meet the general and special requirements will be ranked based on 70% of their KPSS score (candidates without a KPSS score or who do not present a document will have their KPSS score taken as 70) and 30% of their foreign language score (candidates who do not present a document for foreign language score will have their score assessed as zero), and up to ten times (10x) the number of positions for each title will be invited to the written examination, starting from the highest score. If multiple candidates share the same score at the last rank in this ordering, all such candidates will be admitted to the examination. The list of candidates entitled to sit the written examination, together with information on the examination venue, will be announced on https://bidb.hacettepe.edu.tr and/or https://hacettepe.edu.tr no later than 15/05/2025. No separate written notification or official notice will be issued. <br />+ <strong>IV. EXAMINATION SUBJECTS, VENUE, AND DATE</strong><br /> + Examination questions will cover all subjects specified in the technical and special requirements of the applied position.<br /> + The written examination will be held on 22/05/2025 at Hacettepe University Beytepe Campus, 06800 Çankaya/Ankara.<br /> + The oral examination will be held on 29/05/2025 at Hacettepe University Beytepe Campus, 06800 Çankaya/Ankara. <br /> + <strong>V. ASSESSMENT</strong><br /> + <br /> + Candidates who score 70 or above out of a total of 100 in the written examination will be invited to the oral examination. A minimum score of 70 out of 100 is required to pass both the written and oral examinations. The final success ranking of candidates in the Contracted IT Personnel Entrance Examination will be determined by calculating the arithmetic mean of the scores obtained in the written and oral examinations. Candidates will be ranked as principal and reserve candidates according to their final success ranking, and contracts will be concluded with a number of candidates equal to the number of vacancies. <br /> + <strong>VI. ANNOUNCEMENT OF EXAMINATION RESULTS</strong><br /> + Written and oral examination results will be announced on https://bidb.hacettepe.edu.tr. No separate written notification or official notice will be issued. <br /> + <strong>VII. POSITIONS AND SALARIES</strong></p> + <table border="0" cellspacing="0" cellpadding="0" width="671"> + <tr> + <td valign="top"><p>&nbsp;</p></td> + <td valign="top"><p align="center"><strong>POSITION</strong> </p></td> + <td width="99" valign="top"><p align="center"><strong>NUMBER OF PERSONNEL TO BE RECRUITED</strong> </p></td> + <td width="161" valign="top"><p align="center"><strong>NUMBER OF CANDIDATES TO BE INVITED TO EXAMINATION</strong> </p></td> + <td width="274" valign="top"><p align="center"><strong>MONTHLY GROSS CONTRACT SALARY COEFFICIENT CEILING</strong> </p></td> + <td valign="top"><p align="center">&nbsp;</p></td> + </tr> + <tr> + <td valign="top"><p>&nbsp;</p></td> + <td valign="top"><p>Senior Software Development Specialist (Java)</p></td> + <td width="99" valign="top"><p align="center">1</p></td> + <td width="161" valign="top"><p align="center">10</p></td> + <td width="274" valign="top"><p align="center">Up to 3 times</p></td> + <td valign="top"><p align="center">&nbsp;</p></td> + </tr> + <tr> + <td valign="top"><p>&nbsp;</p></td> + <td valign="top"><p>Senior Frontend Development Specialist</p></td> + <td width="99" valign="top"><p align="center">1</p></td> + <td width="161" valign="top"><p align="center">10</p></td> + <td width="274" valign="top"><p align="center">Up to 3 times</p></td> + <td valign="top"><p align="center">&nbsp;</p></td> + </tr> + <tr> + <td valign="top"><p>&nbsp;</p></td> + <td valign="top"><p>Senior Software Development Specialist</p></td> + <td width="99" valign="top"><p align="center">1</p></td> + <td width="161" valign="top"><p align="center">10</p></td> + <td width="274" valign="top"><p align="center">Up to 3 times</p></td> + <td valign="top"><p align="center">&nbsp;</p></td> + </tr> + </table> + <p>The monthly gross contract salary shall be the amount resulting from the multiplication of the contract salary ceiling by the gross contract salary ceiling multiples specified under the SPECIAL REQUIREMENTS heading, for those employed under paragraph (B) of Article 4 of Civil Servants Law No. 657. However, the institution is authorised to conclude contracts and make payments below the ceiling rate.<br /> + <strong>VIII. OTHER MATTERS</strong><br /> + <br /> + Foreign language examination result documents are valid for 5 years if no validity period is stated on the document. A number of reserve candidates equal to the number of positions stated in the announcement will be identified. A security investigation will be conducted for each successful candidate (contracts will not be concluded with candidates whose security investigation is unfavourable). Contracts will not be concluded with candidates who provide false statements or who successfully sit the examination despite not meeting the eligibility requirements. If it is subsequently established that any of the qualifications required for employment are not possessed after a contract has been signed, the contract will be terminated. Furthermore, legal proceedings will be initiated against those who provide false statements. This is respectfully announced to the public.<br /> + This is respectfully announced to the public.<br /> + <strong>Hacettepe University </strong></p> + <p>CONTACT:<br /> + Hacettepe University <br /> + Department of Information Technology<br /> + E-mail: bidb@hacettepe.edu.tr<br /> + Tel: 0 (312) 297 62 00 </p> + <h2><a href="/dosyalar/basvuruformu_bidb_280425.xlsx">Contracted IT Personnel Application Form (.xlsx)</a></h2> + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('notice-iskur-280225', 'en', 'İŞKUR Youth Programme – Occupational Health and Safety Training', '
<div class="icerik"> + + <p><strong>İŞKUR Youth Programme – Occupational Health and Safety Training</strong></p> + + <p>Students who have qualified to participate in the İŞKUR Youth Programme are required to attend the online training to be delivered by our University''s <strong>Occupational Health and Safety Coordination Office</strong> on <strong>5 March 2025</strong> between <strong>10.00 and 12.00</strong>.</p> + + <p><strong>Participation Link: <a href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_OWVkMmE2Y2ItNGJkMy00YTg5LWEyOTMtNzMxNjAzZTBhZWI3%40thread.v2/0?context=%7b%22Tid%22%3a%22fda4d358-3750-4b5b-9588-c0294ccf291e%22%2c%22Oid%22%3a%22f09f3a94-f6ad-4014-9fe0-50a6d165c11d%22%7d" target="_blank">https://teams.microsoft.com/l/meetup-join/19%3ameeting_OWVkMmE2Y2ItNGJkMy00YTg5LWEyOTMtNzMxNjAzZTBhZWI3%40thread.v2/0?context=%7b%22Tid%22%3a%22fda4d358-3750-4b5b-9588-c0294ccf291e%22%2c%22Oid%22%3a%22f09f3a94-f6ad-4014-9fe0-50a6d165c11d%22%7d</a></strong></p>+ + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('notices', 'en', 'Contracted IT Personnel Examination Announcement', '
<div class="icerik"> + + + <p align="center"><strong>HACETTEPE UNIVERSITY</strong><br> + <strong>DEPARTMENT OF INFORMATION TECHNOLOGY</strong><br> + <strong>CONTRACTED IT PERSONNEL EXAMINATION ANNOUNCEMENT</strong></p> + <p align="center"><br> + In order to employ staff on a full-time basis within the Department of Information Technology of Hacettepe University, 3 (Three) Contracted IT Personnel will be recruited in order of success in written and oral examinations to be conducted by the Department of Information Technology of Hacettepe University, pursuant to Article 8 of the &ldquo;Regulation on the Principles and Procedures Regarding the Employment of Contracted IT Personnel in Large-Scale Information Technology Units of Public Institutions and Organisations&rdquo; published in the Official Gazette No. 27097 dated 31/12/2008.</p> + <p><strong>I- APPLICATION CONDITIONS</strong><br> + </p> + <p><strong>I.A- GENERAL CONDITIONS (QUALIFICATIONS)</strong><br> + a) To fulfil the conditions specified in Article 48 of the Civil Servants Act No. 657,<br> + b) To have graduated from a four-year faculty programme in computer engineering, software engineering, electrical engineering, electronics engineering, electrical-electronics engineering, or industrial engineering, or from a foreign higher education institution whose equivalence has been recognised by the Council of Higher Education,<br> + c) To have graduated from engineering departments of four-year faculties other than those specified in clause (b), from departments of science-literature, education, and educational sciences faculties that provide education in computers and technology, or from statistics, mathematics, and physics departments, or from a foreign higher education institution whose equivalence has been recognised by the Council of Higher Education (they may apply for one of the positions to be paid up to 2 times the monthly gross contract fee ceiling),<br> + &ccedil;) To have at least 3 (three) years of professional experience for those not exceeding twice the fee ceiling and at least 5 (five) years for others, in the areas of software, software design and development and the management of this process, or in the installation and management of large-scale network systems; (In determining professional experience, the following are taken into account: documented service periods as IT personnel under Law No. 657 as a permanent staff member or as a contracted staff member subject to clause (B) of Article 4 of the same Act or to Decree-Law No. 399, and service periods documented as IT personnel employed as a worker in the private sector with premiums paid to social security institutions)<br> + d) To hold a certificate demonstrating knowledge of at least two current programming languages, provided that the candidate has knowledge of computer peripheral hardware and the security of the installed network management.<br> + e) For male candidates: not to have reached the age of compulsory military service, or, if having reached that age, to have completed, been exempted from, deferred, or transferred to the reserve class of compulsory military service.<br> + </p> + <p><strong>I.B- SPECIAL CONDITIONS </strong><br> + </p> + <p><strong>I.B.1. SENIOR SYSTEMS SPECIALIST&nbsp;(1 Person - Full-Time - </strong><strong>Up to Twice</strong><strong>)&nbsp;<br> + </strong><br> + a)&nbsp;To have graduated from a four-year faculty programme in computer engineering, software engineering,&nbsp;electrical engineering, electronics engineering,&nbsp;electrical and electronics&nbsp;engineering, or industrial engineering, or from a foreign higher education institution whose equivalence has been recognised by the Council of Higher Education, or from engineering departments of four-year faculties other than those specified, from departments of science-literature, education, and educational sciences faculties that provide education in computers and technology, or from statistics, mathematics, and physics departments, or from a foreign higher education institution whose equivalence has been recognised by the Council of Higher Education,<br> + <br> + b)&nbsp;To have at least 3 (three) years of experience in the areas of installation and management for more than 500 clients in Windows Server, Microsoft Active Directory, Exchange, Internet Information&nbsp;Services (IIS), Domain Name Server&nbsp;(DNS), Dynamic Host Configuration Protocol&nbsp;(DHCP), and to document this. The duration of experience shall be a preferential criterion.<br> + c) To have experience in Mail&nbsp;Gateway management,<br> + <br> + &ccedil;) To have experience in System&nbsp;Center Configuration Manager (SCCM) at an enterprise scale,<br> + <br> + d) To have been involved in the planning/installation processes of Business Continuity or Disaster Recovery systems,<br> + <br> + e) To have knowledge and experience with Load Balancer devices,</p> + <p><strong>I.B.2. SENIOR SOFTWARE DEVELOPMENT SPECIALIST (2 Persons - Full-Time &ndash; Up to Twice)</strong><br> + a) To have graduated from a four-year faculty programme in computer engineering, software engineering, electrical engineering, electronics engineering, electrical and electronics engineering, or industrial engineering, or from a foreign higher education institution whose equivalence has been recognised by the Council of Higher Education, or from engineering departments of four-year faculties other than those specified, from departments of science-literature, education, and educational sciences faculties that provide education in computers and technology, or from statistics, mathematics, and physics departments, or from a foreign higher education institution whose equivalence has been recognised by the Council of Higher Education,<br> + b) To have at least 3 (three) years of experience in Java technologies and to document this. The duration of experience shall be a preferential criterion.<br> + c) To be proficient in HTML, CSS, JavaScript, Ajax, jQuery web technologies, <br> + d) To have used MySQL, PostgreSQL, Oracle, or similar databases,<br> + e) To be proficient in web-based application development technologies; to have worked on projects using at least one of the technologies JSP/Servlet, JSF, Spring, Spring Boot, Angular, etc., <br> + f) To have knowledge of reporting tools,<br> + g) To have worked on at least one project developed with SOAP and REST service technologies,<br> + h) To have used any Java-based application server, preferably enterprise J2EE-based application servers such as JBoss or Oracle WebLogic,<br> + &imath;) Preferably to have developed a project using any ORM tool such as Hibernate, JPA, iBatis, MyBatis, etc.,<br> + i) Preferably to have knowledge and experience in project management, configuration and change management, test management, and performance management tools.<br> + j) To be capable of analytical thinking, inclined towards teamwork, and to possess strong communication skills, <br> + k) To value documentation and to be able to produce it regularly, </p> + + + <p><strong>II. REQUIRED DOCUMENTS - METHOD, PLACE AND DATE OF APPLICATION</strong><br> + Applications will be submitted between 06/10/2021 and 20/10/2021 by completing the &ldquo;<a href="/dosyalar/basvuruformu_bidb.xlsx">Contracted IT Personnel Application Form</a>&rdquo; available at www.bidb.hacettepe.edu.tr, affixing a photograph and signing it, and delivering it in person together with the documents listed below to the Department of Information Technology (Hacettepe University Department of Information Technology &ndash; Beytepe/ANKARA), or by posting it so as to reach the aforementioned address by the final application date.<br> + a) Application form (with photograph),<br> + b) Original or notarially certified copy of undergraduate diploma or certificate of completion (if the original document is presented, a photocopy will be certified by our Institution),<br> + c) A document demonstrating the professional experience specified in clause (&ccedil;) of the GENERAL CONDITIONS (QUALIFICATIONS) section (It is required to document that professional experience was gained as IT personnel. Only services after undergraduate graduation will be taken into account when calculating periods),<br> + &ccedil;) A document demonstrating knowledge of at least two current programming languages, as specified in clause (d) of the GENERAL CONDITIONS (QUALIFICATIONS) section,<br> + d) For each position, documents demonstrating the certificates as well as experience or expertise required under SPECIAL CONDITIONS (Certificates must have been obtained through examination),<br> + e) KPSS P3 examination result document (those who do not submit a KPSS examination result document will be assigned a score of seventy (70).),<br> + f) A document showing the score obtained from the Public Personnel Foreign Language Proficiency Examination (YDS etc.) in English, or the YDS-equivalent score from another foreign language examination recognised by the Council of Higher Education (those who do not submit a document will have their foreign language score evaluated as zero).<br> + </p> + <p><strong>III. EVALUATION OF APPLICATIONS AND ANNOUNCEMENT OF RESULTS</strong> <br> + As a result of the review of applications, from among candidates fulfilling the general and special conditions, up to ten times (10) the number of candidates for each title will be invited to the written examination, starting from the highest scoring candidate, based on a ranking calculated by combining 70% of the KPSS score (the KPSS score of a candidate who has no KPSS score or does not submit a document is taken as 70) and 30% of the foreign language score (those who do not submit a document relating to their foreign language score will have their score evaluated as zero). If more than one candidate shares the same score at the last place in this ranking, all such candidates will be admitted to the examination. The list of candidates entitled to sit the written examination, together with the venue information, will be announced at www.bidb.hacettepe.edu.tr and/or www.hacettepe.edu.tr no later than 27/10/2021. No written notification or service of notice will be made separately.<br> + </p> + <p><strong>IV. EXAMINATION SUBJECTS, VENUE AND DATE</strong><br> + The examination questions will cover all subjects specified in the technical and special conditions of the applied position.<br> + The written examination will be held on 03/11/2021 at Hacettepe University Beytepe Campus, 06800 Cankaya/Ankara.<br> + The oral examination will be held on 10/11/2021 at Hacettepe University Beytepe Campus, 06800 Cankaya/Ankara.</p> + + <p><strong>V. ASSESSMENT</strong><br> + Candidates who score 70 or more out of 100 in the written examination will be invited to the oral examination. In order to be successful in the written and oral examinations, a minimum score of 70 out of 100 is required. The final success grade of candidates for the Contracted IT Personnel Entrance Examination will be determined by taking the arithmetic mean of the scores obtained in the written and oral examinations. Candidates will be ranked as principal and reserve candidates according to their final success grades, and contracts will be concluded with as many candidates as the available quota.<br> + </p> + <p><strong>VI. ANNOUNCEMENT OF EXAMINATION RESULTS</strong><br> + The written and oral examination results will be announced on www.bidb.hacettepe.edu.tr and www.hacettepe.edu.tr. No written notification or service of notice will be made separately.<br> + </p> + + + <p><strong>VII. POSITIONS AND SALARIES</strong></p> + <div class="table-responsive"> + <table class="table table-hover"> + <tr> + <td><br> + <strong>ARTICLE</strong></td> + <td><p align="center"><strong>POSITION</strong></p></td> + <td><p align="center"><strong>NUMBER OF PERSONNEL TO BE RECRUITED</strong></p></td> + <td><p align="center"><strong>NUMBER OF CANDIDATES TO BE INVITED TO THE EXAMINATION</strong></p></td> + <td><p align="center"><strong>MONTHLY GROSS CONTRACT FEE MULTIPLIER CEILING</strong></p></td> + <td><p align="center"><strong>MONTHLY GROSS CONTRACT FEE CEILING (TL)</strong></p></td> + </tr> + <tr> + <td><p>I.B.1</p></td> + <td><p>Senior Systems Specialist</p></td> + <td><p align="center">1</p></td> + <td><p align="center">10</p></td> + <td><p align="center">Up to 2 times</p></td> + <td><p align="center">16.178,62</p></td> + </tr> + <tr> + <td><p>I.B.2</p></td> + <td><p>Senior Software Development Specialist</p></td> + <td><p align="center">2</p></td> + <td><p align="center">20</p></td> + <td><p align="center">Up to 2 times</p></td> + <td><p align="center">16.178,62</p></td> + </tr> + </table> + </div> + <p>The monthly gross contract fee for those employed pursuant to clause (B) of Article 4 of the Civil Servants Act No. 657 shall be the amount resulting from multiplying the contract fee ceiling by the gross contract fee ceiling multipliers specified under the SPECIAL CONDITIONS heading. However, the Institution is authorised to draw up contracts and make payments below the ceiling fee.<br> + </p> + <p><strong>VIII. OTHER MATTERS</strong><br> + Foreign language examination result documents, if no validity period is stated on the document, are valid for 5 years. Reserve candidates equal in number to each position stated in the announcement will be designated. A security clearance will be conducted for each successful candidate (contracts will not be signed with candidates whose security clearance is unfavourable). Contracts will not be concluded with those who make false declarations or with candidates who have succeeded in the examination despite not fulfilling the conditions for sitting it. Should it become apparent after the signing of the contract that any of the qualifications required for employment are not possessed, the contract will be terminated. Furthermore, legal proceedings will be initiated against those who make false declarations. This matter is hereby respectfully announced to the public.</p> + + + <h2><a href="/dosyalar/basvuruformu_bidb.xlsx">Contracted IT Personnel Application Form (.xlsx)</a></h2> + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('office365', 'en', 'Office 365', '
<div class="icerik">
 <p><a href="/dosyalar/HU-Office_365_Hesap_Olusturma.pdf" target="_blank">USING MICROSOFT OFFICE 365</a></p>



 <p><a href="/dosyalar/HU-TeamsKurulumKilavuzu.pdf" target="_blank">MICROSOFT TEAMS INSTALLATION GUIDE</a></p>
 <p><a href="/dosyalar/HU-TeamsKullanimKilavuzu.pdf" target="_blank">MICROSOFT TEAMS USER GUIDE</a></p>







 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('personal-pages', 'en', 'Web Service for Personal Web Pages', '
<div class="icerik">
   <ul>
     <li><a href="/en/personal-pages#2">FTP Connection Settings</a></li>
     <li><a href="/en/personal-pages#21">General Information</a></li>
     <li><a href="/en/personal-pages#4">MYSQL Usage</a> </li>
     <li><a href="/en/database-query">Database Checking Page</a></li>
     <li><a href="/en/personal-pages#5">Quota</a></li>
   </ul>
   <p><strong><a name="2"></a>FTP Connection Settings: </strong><br>
   </p>
   <p>The connection information to be used in the FTP programme is as follows.<br>
     Host/URL: yunus.hacettepe.edu.tr<br>
     Username: username (it is the part of your e-mail with the hacettepe extension before the @ sign)<br>
     Password: the password of your hacettepe e-mail address</p>
   <p><strong><a name="21"></a>General Information: </strong></p>
   <p>The files that make up your web pages must be located in the public_html folder that you will open via FTP on the server that hosts your personal web page.</p>
   <p>The name of your home page (landing page) must be index (such as .html, .htm, .php...).</p>
   <p>You can view your web page from the address http://yunus.hacettepe.edu.tr/~username with the help of any browser.</p>
   <p><strong>CGI Right </strong><br>
     All our users have the right to use cgi. There is a right to use CGI in all directories within the public_html directory. It is sufficient to define the location of your CGI in the "action" part of your CGIs. If it gives a "Not Found" error when you try to access your CGI over the web; <br>
     After you have placed your CGI programmes correctly in the system, you must give references to these programmes in a special way. <br>
     A "trial" CGI programme that you will place in the public_html directory for personal web pages will be accessible from the address http://yunus.hacettepe.edu.tr/~username/deneme. </p>
   <p><strong><a name="4"></a>MYSQL Usage </strong><br>
     All our users have the right to use mysql. Our users who want to use Mysql must notify their database requests via e-mail to <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a>. </p>
   <p><strong><a name="5"></a>Web Quota Application</strong><br>
     100MB of disk space is allocated for student users. </p>
   <p>For questions and problems you may encounter regarding the preparation and publication of personal web pages, you can send an e-mail to <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a>. </p>
   <p> </p>
   <p>HACETTEPE UNIVERSITY-Department of Information Technology reserves the right to make changes in the service policy of web users without notifying other persons and organisations. Furthermore, HACETTEPE UNIVERSITY-Department of Information Technology has the right to make technical changes on the central web server at any time. It may notify users of these changes in advance, as well as it may be possible not to announce changes that can be made instantaneously in advance. Web users are obliged to monitor the information in this text periodically and be aware of possible changes.</p>
 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('proxy', 'en', 'Proxy Settings', '
<div class="icerik">

<p><STRONG>What is a proxy service?</STRONG></p>
<p> A proxy is a supplementary gateway system that enables communication between a computer on the internet and other computers connected to the internet. A proxy server executes the requests it receives from you and forwards the result back to you.</p>
<p><STRONG>What does a proxy do?</STRONG></p>
<UL>
<LI>A proxy service executes requests to retrieve information on your behalf and forwards the result back to you. This information is stored on the proxy service. Upon your next visit, the proxy service will transfer this information to you very rapidly as a server.</LI>
<LI>Proxy services are utilised to reduce congestion on international internet connections, accelerate access, and use the network more efficiently.</LI>
<LI>Restricting or prohibiting access to certain destinations, etc.</LI>
<LI>Besides these, it is also used to access blocked sites by changing the IP address.</LI>
<LI>Furthermore, a proxy service is also used to remain hidden.</LI>
</UL>
<p><STRONG>Off-campus access to electronic resources</STRONG></p>
<p>Only members of Hacettepe University can remotely access electronic resources. To achieve this, they must make the necessary proxy configurations on their computers.</p>
<p><STRONG>You can use the following documents for Proxy Settings</STRONG></p>
<UL>
<LI><A href="/dosyalar/proxy-pdf/edgeproxy_2023.pdf" target="_blank">Microsoft Edge Settings</A></LI>

<LI><A href="/dosyalar/proxy-pdf/chromeproxy_2023.pdf" target="_blank">Proxy Settings for Chrome</A></LI>
<LI><A href="/dosyalar/proxy-pdf/macos_chrome_proxy_ayarlari2021.pdf" target="_blank">MacOS Chrome Proxy Settings</A></LI>
<LI><A href="/dosyalar/proxy-pdf/firefoxproxy_2023.pdf" target="_blank">Proxy Settings for Mozilla Firefox</A></LI>
<LI><A href="/dosyalar/proxy-pdf/safari_proxy_ayarlari2021.pdf" target="_blank">Proxy Settings for Safari</A></LI>


<LI><A href="/dosyalar/proxy-pdf/android_proxy_ayarlari2021.pdf" target="_blank">Proxy Settings for Android Wifi</LI>
<LI><A href="/dosyalar/proxy-pdf/IOSWifiProxyAyarlariEkim2020.pdf" target="_blank">Proxy Settings for iOS Wifi</A></LI>
</UL>



</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('proxy-spam', 'en', 'Proxy-Spam Control', '
<div class="icerik">

 <p><b>What should you do if your Proxy account is blocked?</b><br />
 1. You must absolutely run a virus scan on all devices (phone, tablet, computer) where you use your e-mail account.<br />
 2. You must send an informative e-mail detailing that the virus scanning process has been performed to the bidb@hacettepe.edu.tr address.<br />
 3. Your Proxy block will be removed taking into consideration the e-mail you have sent. After your Proxy block is removed, you must absolutely change your password using the “Change Password” button located on our portal screen.</p>
 <p><b>Matters to be Considered in Password Change</b></br>


   1-The password you choose must be at least 8, and at most 15 characters.<br />
 2-The password you choose must absolutely contain an uppercase letter, a lowercase letter, a number, and a special character (<br />
 ~!@#?$%^&amp;()_- ).<br />
 3-The password you choose must not contain the letters (ı,İ,ğ,Ğ,ş,Ş,ü,Ü,ö,Ö,ç,Ç) due to technical limitations.</p>




 <p><b>What should you do if your e-mail account is blocked?</b><br />
   1. You must absolutely run a virus scan on all devices (phone, tablet, computer) where you use your e-mail account.<br />
   2. You must send an informative e-mail detailing that the virus scanning process has been performed to the bidb@hacettepe.edu.tr address.<br />
   3. Your E-mail block will be removed taking into consideration the e-mail you have sent. After your E-mail block is removed, you must absolutely change your password using the “Change Password” button located on our portal screen.<br />
   <b>Matters to be Considered in Password Chang</b>e</p>
 <ul>
 <ul>
   <li>The password you choose must consist of 8 characters.</li>
   <li>The password you choose must absolutely contain an uppercase letter, a lowercase letter, a number, and a special character.</li>
   <li>The password you choose must not contain the letters &quot;ı,I,g,G,s,S,ü,Ü,ö,Ö,ç,Ç&quot; and some punctuation marks due to technical limitations.</li>
 </ul>


 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('sas-191018', 'en', 'SAS (Statistical Analysis Software) Software Announcement', '
<div class="icerik"> + <p>Dear Academic and Administrative Staff of Our University&nbsp;<br /> + <br /> + &nbsp; &nbsp; &nbsp; Licences valid until 29 June 2019 for SAS 9.4 have been procured. Our users will be able to continue using the SAS software with perpetual licences.&nbsp;Detailed information is available on the Software Repository SAS (Statistical Analysis Software) page, which can be accessed through the Hacettepe University Department of Information Technology Portal&nbsp;(<a href="https://portal.hacettepe.edu.tr/">https://portal.hacettepe.edu.tr/</a>). For the benefit of our students and the security of the software licence, it is recommended that the software be installed and made available in shared student laboratories through departmental administrators.<br />+ <br /> + For your information. Yours sincerely.&nbsp;<br /> + Department of Information Technology</p> + + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('security', 'en', 'Viruses and Security Recommendations', '
<div class="icerik">
<p><STRONG>Virus</STRONG></p>
Computer viruses are pieces of programs generally written to damage a computer, make its operation difficult, or prevent the user from working. While these programs can stand alone, they generally work by embedding themselves into another general-purpose program found on the computer. Once viruses manage to run, they try to copy themselves to other files. Because some files are automatically executed in the background by operating systems, a computer containing an infected file can run this file, and once the virus becomes active, it copies itself to other files. An infected computer can even infect files found on different media connected to it (floppy disks, writable flash drives, network-shared folders with write permission, etc.).
<p>Viruses must be "executed" to become active. When a program that has another known function but is infected with a virus is run, the embedded virus also becomes active. Contrary to popular belief, a computer is not infected when an infected floppy disk, flash memory, CD, etc., is inserted into the computer - unless there is an auto-run file. For the virus to become active, the infected file must be executed manually or by the operating system.</p>
<p>In the early days, files that could be infected were only "program" files. That is, they were generally files ending in ".exe, .com, .pif". However, with the development of software technology, the increase in "executable" file types, and the increasing complexity of operating systems, the types of files that pose a potential danger also increased. Files with the ".doc" extension, which were once known only as "text" files, turned into complex files where "executable" small programs (macros) could be embedded due to the advancement of office software. Similarly, files with the ".gif" extension, which were seen as innocent because they only contain "images", became potential virus sources by exploiting the vulnerabilities of popular operating systems.</p>
<p>Currently, many files, from screensavers to innocent documents, have become capable of "being infected and infecting".</p>
<p>Viruses come to the computer from files downloaded from the Internet - of suspicious origin -, from infected email attachments, and from infected files found on media such as floppy disks, flash memory, and CDs attached to the computer from the outside.</p>
<p>An infected computer can be detected by scanning it with antivirus programs. The user may also suspect something is wrong due to excessive slowing down in the computer''s operation. For some viruses, antivirus manufacturer companies publish small scanner/cleaner programs that can be downloaded from the Internet and run, and which are effective only for that virus type. However, there is no guarantee of this, and the virus may not be cleaned until the computer is reinstalled. In fact, some new-generation viruses enter the computer and hide themselves for a long time, incubating. These can become active at an appropriate time, cause the necessary damage to the computer, perhaps even send the user''s data (passwords, etc.) to their centre, and self-destruct, completely covering their tracks. For this reason, antivirus software can also be helpless at this point.</p>
<p>The viruses mentioned above are called "file viruses". Apart from these, there are also viruses that settle in the "boot sector", which is the first area the disks refer to when loading the operating systems. Their functions, duties, and behaviours are the same as other viruses. What is different is that they hide themselves in different areas on the disk. However, their prevalence is lower.</p>
<p><STRONG>Worm</STRONG></p>
Worms are malicious software that can enter a computer over a network by generally exploiting errors and vulnerabilities in the software of the operating systems used. They have similar functions to viruses, but they are not programs that must be executed by the user to infect. In other words, worms scan the computer network and enter computers where they find a security vulnerability without any user activity. A newly installed computer that has not been patched properly can catch a worm the moment it is connected to the Internet network (when its cable is plugged in and the necessary IP settings are made).
<p>The best way to be protected from worms is to install the computer with the latest version of the operating systems when first setting it up, to follow and apply updates, to close the doors against external attacks using a personal firewall, and to physically connect the computer to the Internet after all these precautions have been taken. Some worms have been so aggressive from time to time that they have managed to infiltrate the computer the moment it first connected to the Internet to perform an update.</p>
<p>A computer infected with a worm constantly attacks the entire Internet network over the network it is on without the user''s knowledge, and tries to spread itself by randomly trying millions of IP addresses. For this reason, a computer with a worm will generally create heavy traffic on the network it is on, which can negatively affect the Internet access of that region.</p>
<p>This "disease" of a computer with a worm can be detected by scanning with antivirus programs, or it can be understood from the intense activity it creates in the network traffic. For some worms, antivirus manufacturer companies publish small scanner/cleaner programs that can be downloaded from the Internet and run, and which are effective only for that worm type. However, there is no guarantee of this, and the worm may not be cleaned until the computer is reinstalled.</p>
<p><STRONG>Spyware</STRONG></p>
Spyware (sometimes also called Ad-ware) are programs that can infect a computer through various methods. Although they can infect even while browsing the Web by exploiting the software vulnerabilities of some operating systems'' Internet browsers, they generally infect by running programs of unknown origin that appear to serve other purposes. Free games downloaded from the Internet, file-sharing programs, serial number generating programs, screensavers, some music players, and many other free software unfortunately actually work as spyware behind their primary duties.
<p>Although spyware is not intended to cause as much damage as viruses, they can steal the data found on your computer (passwords, files, credit card numbers, email addresses, correspondence, visited web page addresses, etc.) and transmit them to remote centres. These can slow down or completely prevent the use of the computer or some programs. With the help of spyware, passwords stolen can be used to damage bank accounts, thefts can be committed, or a hacker can be allowed to enter the computer remotely.</p>
<p>One of the most important purposes spyware serves is to detect the sites people enter and exit while browsing the Web and to try to learn their areas of interest based on this. Spyware, which secretly transmits this information to their centres via the Internet, can later send Spam advertisements to people in accordance with these areas of interest.</p>
<p><STRONG>Hacking</STRONG></p>
There are many hackers on the Internet network. These can be real people, as well as robot software written to hack and whose purpose is to wander the Internet and research the vulnerabilities of computers. Hackers, who exploit the vulnerabilities and errors of the operating systems used (especially Windows), aim to enter the computer without the user''s knowledge and bring it under control. Once a computer is breached, the damage that can be done or the information that can be stolen is entirely at the hacker''s mercy. In fact, most of the time, to be able to enter the main server computers of large organisations such as universities, hackers first attack personal computers, which are more unprotected, and try to enter the main systems using them.
<p>The methods used by hackers include not only exploiting these weaknesses of computers with operating systems whose vulnerabilities have not been patched in time but also exploiting weaknesses resulting from users'' ignorance and carelessness. A user who puts no password for login to their computer or puts passwords that are very easy to guess has actually invited a potential hacker. Similarly, a user who does not use a firewall, antivirus, antispyware, and does not perform updates in time endangers both themselves and the institution they are in.</p>
<p><STRONG>Personal Firewall</STRONG></p>
Firewalls are the name given to software or software/hardware systems that try to protect computer networks intelligently against attacks that may come from outside by constantly examining incoming and outgoing data. Personal firewall software, on the other hand, are programs that only serve to protect that computer against attacks over the network and generally work integrated into the operating system.
<p>Operating systems, by their complex nature, can be vulnerable to attacks that may come over the Internet. In addition, programs executed - intentionally or unintentionally - can create new vulnerabilities in the system and, while serving a purpose (for example, downloading files from the Internet), can cause harm in another way. Personal firewall programs aim to protect the system against various attacks independently of the programs used within it. While some inform the user if they suspect a program is trying to reach a remote location, others also follow programs whose codes have changed (perhaps out of concern that a virus might have changed them) and issue warnings. Most firewalls notice the scans (research to find vulnerabilities in the computer) frequently used by hackers and ensure that the computer does not respond to them.</p>
<p>However, since firewalls are ultimately computer programs, it is also possible that a pest that has managed to infiltrate once can render them ineffective. Or, from time to time, due to the user''s unconscious behaviour, the person can also ensure that the system allows potentially harmful Internet traffic.</p>
<p>In versions of Windows prior to XP and prior to XP''s Service Pack 2, an integrated firewall in the operating system was either non-existent or very inadequate. A more satisfactory personal firewall was also added to the system along with XP SP2. However, some hackers or hacker software that find the vulnerabilities of this also manage to overcome this structure. Currently, there are some professional firewall software sold on the market, as well as non-commercial free software (like Sygate Personal Firewall) which have almost the same capabilities. Experience has shown that for a user who does not show a tendency to download and use programs with hacking potential such as password crackers, screensavers, games, etc., who uses licensed or software of reliable origin, who has installed some protection tools on their computer, and who does updates in time, the firewall software coming integrated with XP SP2 and later operating systems seems to be sufficient.</p>
<p><STRONG>Antivirus and Antispyware</STRONG></p>
These are software installed on the computer against viruses and spyware that notice and prevent them when they try to enter the computer. Once installed on the computer, they automatically start working in the background every time the computer is turned on and simultaneously check all read and written files. The cost of this often emerges as the computer booting up significantly slower and longer, and performing processes slower than usual. Since such programs try to track tens of thousands of known viruses, the actual decrease in speed remains at quite acceptable levels when compared to the work done. Both types of scanners occasionally connect to their manufacturer companies over the Internet and update their virus definitions. This is necessary to be aware of newly released virus and spyware software. It is not the case that every antivirus and antispyware software will find all viruses. There is not even an ideal software. A software that does not know the fingerprint of a newly released and rapidly spreading virus cannot notice this, and the virus infects the computer. In fact, once some viruses infect a computer, they can recognise popular antivirus software and render them ineffective without the user noticing. While the user works with peace of mind, the virus has actually started to damage the computer.
<p>Because of their functions, antivirus and antispyware are generally separate programs that need to be installed separately. They are generally sold for a fee and need to be licensed. "Cracked" versions of popular antivirus programs can also frequently be found on the market. However, no one can guarantee that intentional spyware programs have not been placed inside these during "cracking", and when it is necessary to perform an update against newly released viruses, the manufacturer companies they connect to realise that these are pirated and may refuse to allow updates. Recently, programs where antivirus, antispyware, and even a personal firewall are packaged together have also started to be seen on the market. However, their prices and the amount of memory and workload they will occupy in the system increase at that rate.</p>
<p>Some well-known antispyware programs, in their free versions released for promotional purposes, work by scanning the existing disk when the user requests it instead of performing an instant check. One of the most popular of these is Ad-Aware. In addition, there are sites that connect to your computer over the Internet and perform remote scanning. The user gives some permissions for their access to your computer and perhaps installs small programs. Apart from creating a major security vulnerability for the user, this is a method that is extremely slow and can also negatively affect institutional Internet traffic; it is not recommended by us.</p>
<p>The even more complicated part of the problem is that some of the many antivirus and antispyware software frequently found on the Internet are actually viruses and spyware themselves. These are software that appear to the normal user as if protecting them (which they might actually be protecting from some malware) and at the same time conduct espionage. They may even be advertising with very flashy Web sites. Individuals should not install such programs without doing thorough research and consulting experts. In our university, especially at the Beytepe Campus, some such antivirus software spreading through friend recommendations have been encountered. Computers on which this software is installed have, without the users being aware, occasionally caused serious chaos in the Internet traffic.</p>
<H4>How Do I Protect My Computer from Viruses and Spyware?</H4>
In this very broad topic, only some practical recommendations will be given here. Here, users using Microsoft Windows operating systems are generally targeted. The reason for this is that this operating system has a much larger user base compared to others, and vulnerabilities found in this operating system are found and exploited more than others. Undoubtedly, what is explained here will also give general ideas to users using operating systems like Linux, MacOS, etc.
<p><STRONG>Fundamentally, ways to protect from viruses and spyware can be listed as follows:</STRONG></p>
<OL>
  <LI><STRONG>Do not download or open programs of unknown origin from the outside.</STRONG> Even though it may seem like a highly restrictive situation, in today''s Internet environment, unfortunately, we have to act much more "paranoid" compared to the past. "Cute" screensavers, free games, password cracking programs can each be a potential virus or spyware source. Especially "hack/crack" sites used to find pirated programs or software keys are ideal places. Most of these require something to be clicked, something to be said "yes" to, even to provide a key. This is actually nothing more than the person installing harmful software on their computer with their own hands. These should definitely be avoided. Freeware/shareware sites known on the Internet, whose reliability has been proven, and which do not install pirated software are much safer.</LI>
  <LI><STRONG>Never open insecure emails; do not run the attachments inside them.</STRONG> Sometimes even from a very reliable person, either without them knowing or using their name, emails can be potential virus carriers. In particular, files with the ".doc" extension, which are Word documents, can contain potential viruses. Some email clients (like Outlook) can open and run the incoming email on their own without the user wanting to due to vulnerabilities and errors in their software. It is beneficial to adjust their settings and to stay away from email software that runs things without the user''s request. Sometimes those who send infected files via email can hide their extensions in a way to deceive users. For example, the actual suffix of a harmful file presented as if it has a harmless file extension like an mp3 file might be 100 spaces and ".exe" after mp3, and because some email clients cannot show these spaces, users may think this file is an mp3 file and click it. The best behaviour regarding attachments might be to save them somewhere without opening them, to be sure of their extension, and especially if it is a "doc" file, to try to open it and somehow see inside with another more primitive program, for example, "Windows Wordpad", etc.</LI>
  <LI><STRONG>Use licensed operating systems and software.</STRONG> It is of great benefit to obtain and install especially Windows operating systems licensed. Those who use unlicensed operating systems most of the time cannot benefit from the updates released for them and made against software errors. Furthermore, it is difficult to be sure that unwanted codes have not been placed inside these software obtained as a "crack" by the "cracker". In licensed operating systems, users cannot install and use additional software like "antispyware". This rule is valid for the operating systems as well as other subsequently installed software like Office. The Hacettepe University Department of Information Technology has made the necessary agreements and software provision so that users can use the software licensed.</LI>
  <LI><STRONG>Use Antivirus and Antispyware.</STRONG> However, it is important to obtain and install the legal ones of these. It is also necessary to draw attention to a behavioural pattern frequently observed in users: Users act more carelessly in computer use, saying, "I am using an antivirus anyway." Users who think that if there is a harmful program, the antivirus will stop it anyway, actually ignore the fact that antiviruses cannot provide one hundred percent protection and even often cannot find newly spreading viruses, and they mostly realise they are infected with a virus too late. Users should not fall into this error. There is a wide variety of antivirus and antispyware software on the market and in the Internet world. The rule is not "the most popular is the best". The more widespread an antivirus program is, the better its vulnerabilities and weaknesses are known, and this makes the job of virus writers easier. On the other hand, a completely unheard-of antivirus software might be suspicious, its update frequency might be insufficient, or they might slow down your computer even more compared to famous programs with better technology. Unfortunately, in the free market environment, it is quite difficult to recommend one of these software, which have advantages and disadvantages against each other, over the other. As of the date this article was written, licensed Windows XP users can download and run the software called "Windows Defender (beta)" free of charge from Microsoft''s Web site. This is an "antispyware" software and can work quite effectively. Again, shortly, an antivirus/antispyware/firewall package called "Microsoft OneCare" will be offered to users outside the USA. The Hacettepe University Department of Information Technology is also waiting to make the necessary agreements for this package which is also sold. Currently, the "beta" version of the package can be installed and tried.</LI>
  <LI><STRONG>Use a personal firewall.</STRONG> As mentioned under the firewall heading above, there are also different options on this subject. At the very least, the user needs to install Service Pack 2 on their Windows XP (some operating systems come already installed) and activate the firewall available on it. It is of great benefit for a user who does not run special applications to check an option similar to "don''t allow exceptions" while doing this activation. It would be a useful behaviour for users to occasionally enter the place where Windows firewall settings are made during use and check whether any program has changed the existing settings and allowed new vulnerabilities. Because once some spyware programs enter the computer, they play with some settings of the existing firewall and can ensure that the system allows input ports that are not normally allowed from the outside.</LI>
  <LI><STRONG>Do not visit suspicious Web sites as much as possible.</STRONG> Web site administrators exploiting some vulnerabilities found in Windows can use some codes that cause the user to catch spyware in the event of visiting these sites. These methods are frequently used especially in "crack" sites, game sites, lyrics and mp3 sites, pirated software sites named "warez", and pornographic sites. A method that can be used to slightly reduce the risk as of the date this article was written could be to use the Mozilla Firefox browser instead of Internet Explorer. This browser software can be installed on the computer as a separate alternative without damaging the existing IE. Due to some of its features, it does not get caught in the traps that IE falls into.</LI>
  <LI><STRONG>Use virtual machines.</STRONG> It is a method that advanced users may prefer. Virtual machine software is available on the market. A user who acquires one of these and installs it on their computer runs as if another computer as a window inside their computer. The user installs another operating system they want inside this, independent of the existing operating system, "boots it", and a new computer runs inside the window. The device that this virtual computer thinks is its own hard disk is actually a harmless file found on the main hard disk. With this, an Internet connection can be established, it can safely enter and exit anywhere, desired virus-infected programs can be run. Everything will remain inside this virtual machine and the real computer will not be affected by this.</LI>
</OL></div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('security-policy', 'en', 'Security Policy', '<div class="icerik">
<p><strong>As Hacettepe University Department of Information Technology, in order to establish, operate, and continuously improve a management system in accordance with the ISO/IEC 27001 Information Security Management System Standard;</strong><br />
   <strong> General Principles</strong></p>
<ul>
  <li>The details regarding the information security requirements and rules outlined by this policy are regulated by ISMS procedures. Institution staff and third parties are obliged to know these procedures and conduct their work in compliance with these rules.</li>
  <li>It is essential that these rules and procedures are taken into consideration for all information stored and processed in printed or electronic media and for the use of all information systems, unless otherwise specified.</li>
  <li>The Information Security Management System is structured and operated based on the TS ISO/IEC 27001:2013 &quot;Information Technology Security Techniques and Information Security Management Systems Requirements&quot; standard.</li>
  <li>Information systems and infrastructure provided to staff or third parties by the institution, as well as all types of information, documents, and products generated using these systems, belong to the institution unless there are statutory provisions or contracts requiring otherwise.</li>
</ul>
<p><strong>Basic ISMS Principles</strong><strong></strong></p>
<ul>
  <li>Confidentiality agreements aiming to guarantee the confidentiality needs of the institution are signed with staff and third parties.</li>
  <li>Security requirements that may arise in cases of outsourcing are analysed, and security conditions and controls are stated in specifications and contracts.</li>
  <li>The inventory of information assets is created in line with information security management needs, and asset ownerships are assigned.</li>
  <li>Institutional data is classified, and the security needs and usage rules of the data in each class are determined.</li>
  <li>Information security controls to be applied in recruitment, role change, and termination processes are determined and implemented.</li>
  <li>Physical security controls parallel to the needs of the assets stored in secure areas are applied.</li>
  <li>Necessary controls and policies are developed and implemented against physical threats that the institution''s information assets may be exposed to inside and outside the institution.</li>
  <li>Procedures and instructions regarding capacity management, relations with third parties, backup, system acceptance, and other security processes are developed and implemented.</li>
  <li>Audit log generation configurations for network devices, operating systems, servers, and applications are set in parallel with the security needs of the relevant systems. The protection of audit logs against unauthorised access is ensured.</li>
  <li>Access rights are assigned proportionately to the need. The most secure technology and techniques possible are used for access control.</li>
  <li>Security requirements are determined in system procurement and development; it is checked whether the security requirements are met during system acceptance or testing.</li>
  <li>The necessary infrastructure is established for reporting information security breach incidents and vulnerabilities. Breach incident records are kept, necessary corrective and preventive actions are implemented, and learning from security incidents is ensured through organised awareness training.</li>
  <li>Continuity plans for critical infrastructure are prepared, maintained, and exercised.</li>
  <li>Processes necessary for compliance with laws, internal policies and procedures, and technical security standards are designed; compliance assurance is provided through surveillance and audit activities to be conducted continuously and periodically.</li>
</ul>
<p><strong>Acceptable Use Rules to Be Followed</strong><strong></strong><br />
  The rules to be followed are specified in the procedures prepared within the scope of the ISMS. All rules are primarily included in the &quot;Information Systems Acceptable Use Policy&quot; document. All staff and third parties within the scope of the ISMS must comply with the specified rules.</p>
<p><strong>Management of third parties</strong> </p>
  <ul>
<li>Any person who is not an employee of the Hacettepe University Department of Information Technology but accesses information systems resources is considered a 3rd Party. The rules that 3rd Parties must follow and the form of management are separately specified as 3rd Party in ISMS comprehensive documents. The signing of temporary or permanent work contracts to be made with any person or institution fitting the definition of 3rd Party must be tracked up-to-date. Before the contract is signed, agreed and approved security agreements should be prepared, and an institutional confidentiality agreement with Institutions and an individual confidentiality agreement with 3rd Party employees should be signed. If necessary, time should be allocated for third-party employees to comply with the policy.</p>
</li>
</ul>
</div>', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('service-groups', 'en', 'Service Groups', '<div class="icerik">


 <ul>
    <li>System and Network Unit</li>
    <li>End-User Support Unit</li>
    <li>Web Design Unit</li>
    <li>Electronic-Signature Control  Unit</li>
    <li>Information Unit for Personnel  and Accounting Services</li>
  </ul>
 
</div>', 'Hacettepe University Comnputer Center', '', '', 't', '67', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('services', 'en', 'Web Service for Unit Web Pages', '
<div class="icerik">

  <ol>
    <li><a href="/en/services#5">Method of Application</a></li>
    <li><a href="/en/services#6">Requirements for User Code Supervisors</a></li>
    <li><a href="/en/services#7">Activation of User Code</a></li>
    <li><a href="/en/services#8">New Password Request</a></li>
    <li><a href="/en/services#9">Alias (Virtual) E-mail Service</a></li>
    <li><a href="/en/services#11">Technical Specifications</a></li>
    <li><a href="/dosyalar/BGYS-F-12WebKullaniciKoduTalepFormurevizyon.docx">Sample Application Petition</a> (for web pages managed via FTP)</li>
    <li><a href="/en/cms">Web Content Management System for managing web page content (HU-CMS) </a></li>
    <li><a href="/en/services#12">Contact for Questions and Issues</a></li>
  </ol>
  <p><strong><a name="5"></a>1. Method of Application</strong><br>
  </p>
  <p>To obtain a user code, student societies must first apply to the HU Department of Health, Culture and Sports. The user code is activated based on the relevant official letter from the Department of Health, Culture and Sports.</p>
  <p>For events and organisations, an application must be submitted to the Department of Information Technology (BİDB) with a petition approved by the unit manager organising the event to activate a user code. </p>
  <p>The application petition must specify the reasons for the user code request, the name and surname, title, telephone number, and an e-mail address with the Hacettepe domain of the person(s) who will be responsible for the user code.</p>
  <p><strong><a name="6"></a>2. Requirements for User Code Supervisors</strong><br>
    The person(s) possessing the user code are those to whom the alias (virtual) address is forwarded. These individuals are required to have knowledge of HTML or the ability to use tools intended for preparing web pages.</p>
  <p><strong><a name="7"></a>3. Activation of User Code</strong><br>
    Once the user code request reaches the HU Department of Information Technology (BİDB) and is approved by the relevant authorities, the necessary procedures for activating the user code are carried out. All information regarding the user code and the web page is sent to the responsible person(s)'' e-mail address with the Hacettepe domain after the code is activated.</p>
  <p><strong><a name="8"></a>4. New Password Request</strong><br>
    In the event that the password associated with the user code is forgotten or lost, a new password is created for the existing user code and sent to the e-mail address of the page supervisor. For a new password request, the person(s) responsible for the web page must apply to <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a>. New password requests for student societies are fulfilled with the involvement of the society''s academic advisor.</p>
  <p><strong><a name="9"></a>5. Alias (Virtual) E-mail Service</strong><br>
    When the user code is activated, an address such as usercodemaster@hacettepe.edu.tr is provided as an e-mail address. This is an alias (virtual) address. This address does not have a username and password. It is only for forwarding. This address is forwarded to the user code supervisors. The e-mail addresses of these individuals must have a "hacettepe" domain.<br>
    For instance: webmaster@hacettepe.edu.tr is an alias address and is forwarded to the personnel working in the Web Unit. When an e-mail is sent to this address, the e-mail reaches all personnel working in this unit. To reply to this mail, the personnel use their own personal e-mail accounts. </p>
  <p><strong><a name="11"></a>6. Technical Specifications</strong><br>
  </p>
  <p>For security reasons, FTP connections cannot be made to the web server from outside Hacettepe University campuses. </p>
  <p>The character set of the web server is ISO-8859-9. The UTF-8 character set is not used. </p>
  <p> PHP and MySQL support is provided on web pages.</p>
  <p><strong><a name="12"></a>7. Contact for Questions and Issues</strong><br>
    Questions/issues related to the user code should be forwarded to <a href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</a> with a detailed explanation (along with error messages, if any). </p>
  <hr>
  HACETTEPE UNIVERSITY Department of Information Technology (BİDB) reserves the right to make changes to its web users service policy without prior notice to other individuals and institutions. Furthermore, HACETTEPE UNIVERSITY Department of Information Technology (BİDB) has the right to make technical changes on the central web server at any time. While it may notify users of these changes in advance, it is also possible that instant changes may not be announced beforehand.
  <p>Web users are obliged to periodically monitor the information contained in this text and be aware of potential changes.</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('software', 'en', 'Licensed Software Server', '
<div class="icerik">
<p align="justify"><STRONG>HACETTEPE UNIVERSITY SOFTWARE SERVER</STRONG><BR>
<BR>
The Hacettepe University Software Repository System was established in 2006 to distribute software packages and licences procured for the use of university staff and students over the Internet. <BR>
<BR>
The system is designed to benefit both our staff and students. All licensed software is open to university personnel, and some licensed software is made accessible and available for use by students. The most useful and popular free software is also available on our server.<BR>
<BR>
Licensed software, in addition to all the legal advantages they bring, makes it difficult for viruses and pirates to enter computers thanks to their updatability and manufacturer support, ensuring safer use.<BR>
<BR>
Licensed software and, if applicable, licence keys may only be used by members of Hacettepe University. They cannot be made available to third parties outside the university, directly or indirectly. The relevant user will be held responsible if a similar situation is detected. Our users who download licensed software here are deemed to have accepted these terms. This also applies to some licensed software offered to our students. <BR>
<BR>
All information and guides to assist our users regarding the software are available on our server. It is important to read this information carefully and perform installations according to the guides, if any. It is also recommended to read the information on the "<STRONG>HELP</STRONG>" page located in the top menu of the Software Repository.<BR>
<BR>
We are only able to provide support for software located in the software repository. We do not have a service for operating systems (such as Home editions) and other software not included in the software repository.<BR>
<BR>
To connect to the Hacettepe University Licensed Software Server:<BR>
<A href="http://yazilimdeposu.hacettepe.edu.tr/">yazilimdeposu.hacettepe.edu.tr</A><BR>
<BR>
You may send any problems, opinions, and suggestions regarding this service to the <A href="mailto:yazilimdeposu@hacettepe.edu.tr">yazilimdeposu@hacettepe.edu.tr</A> address.</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('spam', 'en', 'About SPAM and PHISHING', E'
<div class="icerik">
  <p><strong>Spam</strong></p>
  <p>Almost every e-mail user encounters many unwanted promotional e-mails in their mailbox every day. In the internet world, all such messages sent without the recipient''s consent are called SPAM. Spam was actually a brand of canned goods sold in the UK in the late 1960s. In 1970, the famous UK television comedy programme Monty Python featured a sketch where a couple who did not want to eat processed food could find nothing but products containing Spam on a restaurant menu and were forced to eat it. Inspired by this highly popular sketch at the time, unwanted promotional e-mails also began to be called Spam.</p>
  <p>Today, spam messages constitute more than 70% of the world''s daily internet mail traffic. Spammers typically send e-mails trying to persuade recipients regarding topics such as Viagra-derivative drugs, replicas of famous watch brands, money transfer requests from an exiled king of a distressed African country, and so on. It is generally determined that these e-mails originate from the Far East, Eastern Europe, and North America. According to spam statistics, approximately one in a thousand recipients of spam messages believe these messages and do what is instructed. Given that spam is sent to millions of people simultaneously, this translates into a massive customer base. It has been observed that some spammers caught as a result of various legal pursuits have amassed millions of dollars through this method. </p>
  <p>It may not be accurate to portray spam messages merely as fraudulent messages. Many local or foreign individuals or firms send bulk e-mails to introduce their products and services to people in the quickest and cheapest way possible. However, the lack of reliability of messages arriving in this manner, as well as the fact that they are delivered without the recipient''s consent one way or another, causes them to be evaluated in the same category. </p>
  <p>Technically, it is entirely possible to forge the sender''s name and address in e-mail messages. For instance, a message that at first glance appears to have your name and address as the sender can be sent to any other person without any involvement from you or your affiliated institution. Even if the details of the message header are specifically examined and the originating IP address is found, expert hackers can connect from their location to other places, and from there to yet other places, sending messages with forged addresses; tracking them can be practically nearly impossible. Therefore, the sender of spam can easily conceal their true identity and location if they wish. </p>
  <p>The lifeblood of spammers is the e-mail addresses to which spam will be sent. The more e-mail addresses a spammer possesses, the more customer potential they have. Consequently, e-mail addresses have transformed into a commercial asset that is bought and sold. In fact, CDs containing hundreds of thousands of stored e-mail addresses are even sold under the counter; moreover, they are advertised through Spam messages as well. </p>
  <p>There are various ways to obtain e-mail addresses. However, most of the time, these addresses are unknowingly provided to spammers by the account holders themselves: </p>
  <OL>
    <LI><STRONG>Sites requiring "Free Membership":</STRONG> Many sites, ranging from lyric websites to forums, state that their use is free but require membership with just an e-mail address. If the site does not explicitly state that it will not share the collected e-mail address with anyone and will not use it for spam purposes, it is highly likely that this address will be stored in a database to be sold to spammers. Some sites even use the addresses they collect from users for spam purposes despite explicitly stating otherwise. <BR>
        <BR>
    </LI>
    <LI><STRONG>E-Mail forwarding:</STRONG> Sometimes, a message, joke, picture, etc., received from an acquaintance via e-mail is highly appreciated, and the user immediately forwards it to their own acquaintances. During forwarding, the addresses of previous senders accumulate within the e-mail. Eventually, these mountain-like accumulated messages fall into the hands of a spammer. This can happen through spyware on any of the recipients'' computers, or the recipient themselves might be someone who sells addresses to spammers for money. Some messages are specifically designed to exploit users'' emotions. For example, claims that a very popular product is actually carcinogenic; calls to vote to protest websites containing insults to national and moral values; requests for help for a non-existent girl with cancer; messages believed to bring luck, and many more can serve as examples. <BR>
        <BR>
    </LI>
    <LI><STRONG>Web sites:</STRONG> There is robot software that crawls web sites around the world and collects data. They scan sites and try to find e-mail addresses within them. The character they try to catch the most is the "@" symbol. For this reason, on some sites, e-mail addresses are written in the format "someone (at) somewhere.com" to avoid these types of robots as much as possible. <BR>
        <BR>
    </LI>
    <LI><STRONG>Computer viruses:</STRONG> A virus designed for this purpose that infects a person''s computer can, without the person''s knowledge, collect addresses from the address book of the e-mail client (Outlook, etc.) and even from all accumulated e-mails, and transmit them to spammers over the internet. </LI>
  </OL>
  <p>Although there is no definitive formula for protection against Spam, taking at least some precautions can be effective in reducing their numbers: </p>
  <p>  </p>
  <OL>
    <LI><STRONG>Obtaining a separate address from a provider offering free e-mail addresses (GMail, Yahoo, Hotmail, etc.) and providing this as the e-mail address to sites requiring membership.</STRONG> Also, occasionally logging in with this address and clearing all accumulated mail (since this is not your normal address, useful e-mails are not expected to arrive) in a single sweep. <BR>
        <BR>
    </LI>
    <LI>Some written forms also ask for an e-mail address. If it is not a highly trusted place, the above procedure can be applied to them as well. <BR>
        <BR>
    </LI>
    <LI><STRONG>Modifying the content of incoming messages you wish to forward to other people, deleting other e-mail address headers if any, and typing the e-mail addresses of the people you are sending them to in the "BCC" line instead of the "To" line.</STRONG> The address of a person sent an e-mail via BCC (Blind Carbon Copy) will not be seen by other recipients. This will prevent the spread of addresses. <BR>
        <BR>
    </LI>
    <LI><STRONG>Not revealing your existence to the spammer.</STRONG> Any unwanted incoming message may contain a phrase like "click here or send a message here if you do not want to receive this message". Complying with these and replying will not remove the spam recipient from that list, but will rather give the spammer the information that the address is indeed a valid and read address, further solidifying your place in the spammer''s address book. <BR>
        <BR>
    </LI>
    <LI><STRONG>Verifying the accuracy of the content of incoming messages before forwarding them to someone else or a discussion list.</STRONG> For instance, a site mentioned in a message claiming to contain hostility against Atatürk and using rhetoric like "whatever you do, do not enter the site and increase its counter; click here to protest and send it to those around you" might not exist at all, or might have been opened and closed years ago. Such messages are given names like "hoax", "scam", "con", etc. Popular search engines can be used to check their validity. For example, if the words "hoax checking" are entered into Google, it is possible to reach sites related to "urban legends" circulating via e-mail. <BR>
        <BR>
    </LI>
    <LI><STRONG>Writing e-mail addresses on personal websites using informal methods (such as "someone (-at-) somewhere (dot) com") as much as possible.</STRONG> With this method, when automatic scanning robots enter your site, they will not understand that this is an e-mail address. <BR>
        <BR>
    </LI>
    <LI><STRONG>Using antispyware and antivirus programmes.</STRONG> <BR>
        <BR>
    </LI>
    <LI><STRONG>Not installing or running illegal software or software from an unknown source.</STRONG> Most password crackers, cracked software, and illegal programmes and games are Trojans (Trojan Horses). In other words, their behind-the-scenes function is to cause harm in some way. They can also work to send your address and the addresses of the people in your address book to spammers. Since you install and run these programmes willingly, they are not considered viruses, and antivirus programmes will not warn you. </LI>
  </OL>
  <p>Hacettepe University Department of Information Technology performs Spam checks on e-mail addresses with the @hacettepe.edu.tr domain, and suspicious messages are moved to the "Junk Mail" folder. This folder is also automatically deleted at regular intervals due to quota issues. </p>
  <p>Although it is easy for a human to understand whether a message is Spam or not, the situation is not the same for a computer. Automated scanners search for certain popular keywords (like Viagra, for example) within the message, try to determine whether the name in the "from" line of the message has sent messages to an abnormal number of people, and even attempt to acquire new keywords and perform their checks using them by connecting to spam databases established at specific points worldwide. Spammers, on the other hand, write keywords in a distorted manner (such as "\\/ | A AA GG rA") to avoid getting caught by these scanners, or they write the text inside an image file instead of normal text and send that file as an attachment, or they invent completely different, unimaginable methods. This technical war continues mutually. Therefore, no spam scanner can filter such messages with a hundred percent success rate. </p>
  <p>While the solution to the problem may seem to lie in countries making legal regulations regarding spam, it is equally important for individuals to protect themselves from malware such as viruses and spyware, to think twice when providing their e-mail addresses to free sites, and to refrain from running programmes from unknown sources. </p>
  <p><STRONG>Phishing</STRONG></p>
  <p>This term, derived by distorting the word "fishing", which means to catch fish, is used to mean trying to gain an advantage or cause harm by sending e-mails to users they see as "fish" on the Internet and directing them. </p>
  <p>Such e-mail messages attempt to make users harm themselves by taking advantage of their lack of knowledge. For example, a message like "On this date, such-and-such virus will launch an attack over the internet worldwide. Do not turn on your computers on that date!" will at most serve only to deprive you of using the computer that day with your own consent. Or, even worse, an e-mail like "Attention! If you see a file named something.dll under the Windows/System directory of your computer, it means your computer has been infected with such-and-such virus. Delete that file immediately and restart your computer!" might succeed in rendering your computer inoperable by having you delete a file that is perhaps essential for your system with your own hands. </p>
  <p>Aside from these, it should not be forgotten that no serious organisation, especially banks, attempts to obtain or change your personal information via e-mail. They do not write an e-mail saying "click here to change your personal information". Through technical tricks, the link you are asked to click within the e-mail can indeed be displayed as the real bank''s address. However, when that link is clicked, it can redirect to a completely different address that is actually a fake of the real bank''s web page, and the user may not notice this. In such situations, the best method is to call the relevant institution and verify the situation. </p>
  <p>Credit card numbers, personal information, and all types of passwords, including those for e-mail, should never be sent openly via e-mail. Technically, an e-mail passes through many points until it reaches its destination. It is always possible for the content of e-mails to be "listened to" at these points. </p>
  <p>Especially in areas where Wireless Internet is used, places such as banks should not be accessed unless absolutely necessary, and transactions involving credit cards, passwords, etc., should not be carried out, regardless of the destination. Signals in the air can be intercepted by third parties. Even if the signals are encrypted, it must not be forgotten that all encryption methods are only secure until they are broken. </p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('spss-081118', 'en', 'IBM SPSS Software for Our Students', '
<div class="icerik"> + + <p>Dear Students of Our University,<br /> + <br /> + We are pleased to announce that IBM SPSS software — covering statistical analysis, data and text mining, predictive modelling, decision optimisation, collaboration, and deployment — is now available for use by our students. Installation files and guides for IBM SPSS Statistics v23, AMOS v23, Sample Power v3, and Visualization Designer v1.0 (Windows &amp; Mac) can be obtained from our software repository. Detailed information is available on the Software Repository IBM SPSS Software page. <br />+ <br /> + + Hacettepe University Information Technology Portal (<a href="https://portal.hacettepe.edu.tr/" target="_blank">https://portal.hacettepe.edu.tr/</a>)<br /> + <br /> + + Username: Your e-mail username (do not include @hacettepe.edu.tr)<br /> + + Password: Your current e-mail password<br /> + <br /> + (After logging in, navigate via the left-hand menu: &quot;Academic Software &gt; IBM SPSS Software&quot;)<br /> + <br /> + We wish to bring this to your attention. Yours sincerely. <br /> + <br /> + Department of Information Technology<p> + + + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('staff', 'en', 'Staff', '', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('student-rules', 'en', 'Framework Rules for Our Students Regarding the Hacettepe University Academic Network (HUNET)', '
<div class="icerik">
 
 <p> The computer network (HUNET), which is located within the campuses of Hacettepe University and established and managed by the Department of Information Technology (BİDB), serves its students and all its employees. HUNET also enables students to connect with their own computers from their dormitory rooms in order to carry out their academic studies. It has never been aimed to block or monitor communication within the scope of the HUNET service. However, in order for this service to continue uninterrupted and to ensure the security of all users, all our students must comply with the network usage and security policies specified below.<BR>
 <p><STRONG>HUNET Rules :</STRONG><BR>
 <p>HUNET investments, utilising state resources, exist to serve fundamental purposes, namely academic, administrative, educational, and research. Personal use of the network must never impede the fulfilment of these fundamental purposes. In this context, the rules that must be observed in the use of the network are specified below.</p>
 <UL>
   <LI>The violation of System and Network security is prohibited. HUNET administrators are responsible for monitoring and investigating such violations.</LI>
   <LI> The actions included in the Turkish Penal Code No. 5237, dated 26/09/2004, and listed below, must not be committed via HUNET: </LI>
   <UL>
     <LI>Incitement to suicide (Article 84)</LI>
     <LI>Sexual abuse of children (Article 103, first paragraph)</LI>
     <LI>Encouraging and facilitating the use of narcotic or stimulant substances (Article 190)</LI>
     <LI>Provision of substances dangerous to health (Article 194)</LI>
     <LI>Obscene content (Article 226)</LI>
     <LI>Prostitution (Article 227)</LI>
     <LI>Providing a place and opportunity for gambling (Article 228)</LI>
   </UL>
   <LI>Peer-to-peer (P2P) file-sharing programmes via HUNET have been disabled for use due to their high bandwidth consumption, in addition to the legal issues they create. </LI>
   <LI>Personal gain must not be obtained via HUNET; multiple e-mails containing advertising, announcements, propaganda, etc. that are commercial, political, or contrary to general moral rules must not be sent.</LI>
   <LI>No activities must be undertaken that could cause HUNET to be used from outside the university.</LI>
   <LI>Computers providing sharing services, regardless of the content type, cannot be kept in Hacettepe University dormitory rooms.<U></U></LI>
   <LI>Every student who has a computer registered in their name in Hacettepe University dormitory rooms is primarily responsible for the consequences that may arise if they allow third parties to use HUNET resources, either consciously or unconsciously.</LI>
 </UL>
 <p>In the event of non-compliance with the rules specified above, one or more of the following penalties will be applied upon notification:</p>
 <UL>
   <LI><STRONG>Restriction of network access, </STRONG></LI>
   <LI><STRONG>Termination of the user code and network access, </STRONG></LI>
   <LI><STRONG>Initiation of an investigation within the university, </STRONG></LI>
   <LI><STRONG>Application to judicial authorities.</STRONG></LI>
 </UL>
 <p>The HUNET service is not an infinite resource, and compliance with the rules is of great importance for the continuity and quality of the service. It is clear that contrary behaviours will cause usage restrictions. For this reason, we expect all our students to show the necessary diligence and care regarding the use of HUNET <BR>
     <STRONG>Hacettepe University Rectorate</STRONG><BR>
   <STRONG>*</STRONG> These rules are valid from the date of their publication. Amendments may be made to the text where deemed necessary. </p>
 
 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('stylecc50-removal', 'en', 'Regarding the Removal of 50th-Anniversary Logos from the Website', '
<div class="icerik"> + <p>The 50th-anniversary logos added to the Hacettepe University logo to mark the 50th anniversary of the University''s founding are being removed from web pages now that the 50th anniversary has concluded.</p>+ <p>The changes that must be made to the style.css file used in the design employed by Hacettepe University units in order to remove the 50th-anniversary logo are as follows.<br> + (You can access the latest version of style.css at <a href="/sablon2017/css/style.css" target="_blank">http://www.bidb.hacettepe.edu.tr/sablon2017/css/style.css</a>.)</p> + <p>1- In the banner50 and banner50_en classes, the width should be set to 10px and the background should be disabled.<br> + 2- In the banner and banner_en classes, the width should be set to 930px</p> + <p>The updated classes are as follows.<br> + </p> + <p>#banner50{<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; width:10px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height:100px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /*background:url(../images/banner50.png) no-repeat left center;*/<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; float:left;<br> + }<br> + #banner50_en{<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; width:10px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height:100px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /*background:url(../images/banner50_en.png) no-repeat left center;*/<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; float:left;<br> + }<br> + #banner{<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; width:930px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height:100px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; background:url(../images/banner.png) no-repeat left center;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; float:left;<br> + }<br> + #banner_en{<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; width:930px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height:100px;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; background:url(../images/banner_en.png) no-repeat left center;<br> + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; float:left;<br> + }</p> + <p>The 50th-anniversary logo has been removed from web pages managed via the content management system.</p> + <p>We kindly request your attention to this matter.<br> + Department of Information Technology</p> + </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('virus-protection', 'en', 'Recommendations for Protection against Computer Viruses and Attacks', '
<div class="icerik">
<p>Written by: Barış AKÇAY, Deputy Head of the Department of Information Technology, 07.2006</p>
<p>
Since the subject is highly detailed and each sub-heading requires lengthy explanations, what is explained here will only be in the form of simple definitions and some practical recommendations. Readers need to conduct research to obtain detailed information. The addresses of some websites that may be useful on this subject are provided in the "Useful Documents and Links" section.
</p>
<p> </p>
<h4>Some Basic Definitions</h4>
Before explaining the methods of protection against computer pests, it is necessary to mention some concepts that can sometimes be confused with one another:
<p> </p>
<h5>Virus</h5>
Computer viruses are generally pieces of programmes written with the aim of damaging a computer, making its operation difficult, or preventing the user from working. While these programmes can stand alone, they usually operate by embedding themselves into another purposeful programme on the computer. Once viruses manage to run, they attempt to copy themselves to other files as well. Since some files are run automatically and in the background by operating systems, a computer hosting a virus-infected file may run this file, and when the virus becomes active, it copies itself to other files. Furthermore, an infected computer can infect files found on different media connected to it (floppy disks, writable flash disks, network shared folders with write permission, etc.).
<p>
Viruses must be "run" in order to become active. When an infected programme with another known function is executed, the virus embedded within it also becomes active. Contrary to popular belief, when an infected floppy disk, flash memory, CD, etc., is inserted into a computer - unless there is an auto-run file - the computer will not be infected with the virus. The infected file must be run manually or by the operating system for the virus to become active.
</p>
<p>
Initially, the files that could be infected by viruses were only "programme" files. That is, they were generally files ending with ".exe, .com, .pif". However, with the development of software technology, the increase in "executable" file types, and the growing complexity of operating systems, the types of files that pose a potential threat have also increased. Files with the ".doc" extension, once known only as "text" files, have transformed into complex files where "executable" applets (macros) can also be embedded due to the advancement of office software. Similarly, files with the ".gif" extension, seen as innocent because they only contain "images", have become a potential source of viruses by exploiting the vulnerabilities of popular operating systems.
</p>
<p>
Currently, many files, from screensavers to innocent documents, have become capable of "being infected with and spreading viruses".
</p>
<p>
Viruses enter the computer from downloaded files of suspicious origin from the Internet, infected e-mail attachments, and infected files found on media such as floppy disks, flash memories, and CDs inserted into the computer from the outside.
</p>
<p>
An infected computer can be detected by scanning with antivirus programmes. The user may also become suspicious from the extreme slowdown in the computer''s operation. For some viruses, antivirus manufacturing companies publish small scanner/cleaner programmes that can be downloaded from the Internet and run, which are effective only for that virus type. However, there is no guarantee of this, and the virus may not be cleaned until the computer is reinstalled. Moreover, some new generation viruses enter the computer, hide themselves for a long time, and incubate. They can become active at a suitable time, cause the necessary damage to the computer, perhaps even send the user''s data (passwords, etc.) to their centre, destroy themselves, and make their traces completely lost. For this reason, antiviruses can also be helpless at this point.
</p>
<p>
The viruses mentioned above are called "file viruses". Apart from these, there are also viruses that settle in the "boot sector", which is the first area discs access when loading operating systems. Their functions, tasks, and behavioural patterns are the same as other viruses. What is different is that they hide themselves in different areas on the disc. However, their prevalence is less.
</p>
<p> </p>
<h5>Worm</h5>
Worms are malicious software that can enter a computer over a network by generally exploiting errors and vulnerabilities in the software of the operating systems used. They have similar functions to viruses, but they are not programmes that need to be run by the user to infect. In other words, worms scan the computer network and enter computers where they find a security vulnerability without any user activity. A newly installed computer that has not been patched properly can catch a worm the moment it connects to the Internet network (the cable is plugged in and the necessary IP settings are made).
<p>
The best way to protect against worms is to install the computer with the latest version of the operating system when first installing it, follow and apply updates, close the doors against external attacks by using a personal firewall, and physically connect the computer to the Internet after all these precautions have been taken. Some worms have occasionally been so aggressive that they managed to infiltrate the computer the moment the computer was first installed and connected to the Internet to perform an update.
</p>
<p>
A computer infected with a worm constantly attacks the entire Internet network over the network it is located on without the user''s knowledge, trying to spread itself by randomly trying millions of IP addresses. Therefore, a computer with a worm will generally create heavy traffic on the network it is located in, negatively affecting the Internet access of that region.
</p>
<p>
This "illness" of a computer with a worm can be detected by scanning with antivirus programmes, or it can be understood from the intense activity it creates in network traffic. For some worms, antivirus manufacturing companies publish small scanner/cleaner programmes that can be downloaded from the Internet and run, which are effective only for that worm type. However, there is no guarantee of this, and the worm may not be cleaned until the computer is reinstalled.
</p>
<p> </p>
<h5>Spyware</h5>
Spyware (sometimes also called Ad-ware) are programmes that can infect a computer through various methods. Although they can infect even while browsing the Web by exploiting the software vulnerabilities of the Internet browsers of some operating systems, they generally infect through the execution of programmes whose origin is unknown and which appear to serve other purposes. Free games downloaded from the Internet, file sharing programmes, serial number generating programmes, screensavers, some music players, and many other free software unfortunately operate as spyware behind their primary tasks.
<p>
Although spyware is not intended to cause as much damage as viruses, they can steal the data on your computer (passwords, files, credit card numbers, e-mail addresses, correspondence, addresses of visited web pages, etc.) and transmit them to remote centres. These can slow down or completely prevent the use of the computer or some programmes. Passwords stolen with the help of spyware can be used to damage bank accounts, commit thefts, or allow a hacker to access the computer remotely.
</p>
<p>
One of the most important purposes served by spyware is to detect the sites people log in and out of while browsing the Web and to try to learn their areas of interest based on this. Spyware, which secretly transmits this information to their centres via the Internet, can later send Spam advertisements to people in accordance with these areas of interest.
</p>
<p> </p>
<h5>Hacking</h5>
There are many hackers on the Internet network. These can be real individuals, or they can be robot software written for the purpose of hacking, whose aim is to browse the Internet and search for vulnerabilities of computers. Hackers, exploiting the vulnerabilities and errors of the operating systems used (especially Windows), aim to enter the computer without the user''s knowledge and take it under control. Once the computer is entered, the damage that can be caused or the information that can be stolen is entirely at the hacker''s mercy. In fact, most of the time, in order to enter the main server computers of large organisations such as universities, hackers first attack more unprotected personal computers and try to enter the main systems using them.
<p>
The methods used by hackers include not only exploiting these weaknesses of computers with operating systems that have not been patched on time but also exploiting weaknesses arising from users'' ignorance and carelessness. A user who does not set a password at all for logging into their computer or who sets passwords that are very easy to guess has actually invited a potential hacker. Similarly, a user who does not use a firewall, antivirus, or antispyware, and who does not perform updates on time, puts both themselves and their organisation at risk.
</p>
<p> </p>
<h5>Personal Firewall</h5>
Firewalls are the name given to software or software/hardware systems that try to intelligently protect computer networks against external attacks by constantly examining incoming and outgoing data. Personal firewall software, on the other hand, are programmes that serve to protect only that computer against attacks coming over the network and generally operate integrated with the operating system.
<p>
Operating systems can be vulnerable to attacks over the Internet due to their complex nature. Furthermore, the programmes executed - intentionally or unintentionally - can create new vulnerabilities in the system and, while serving a purpose (for example, downloading files from the Internet), they can also cause damage in another way. Personal firewall programmes aim to protect the system against various attacks independently of the programmes used in it. While some suspect and notify the user if a programme tries to reach a remote location, others also track programmes whose codes change (perhaps with the concern that a virus might have altered them) and issue warnings. Most firewalls notice the scans frequently used by hackers (research to find vulnerabilities in the computer) and ensure that the computer does not respond to them.
</p>
<p>
However, since firewalls are also computer programmes in the end, it is possible for a pest that manages to infiltrate inside to render them ineffective. Or, from time to time, due to the user''s unconscious behaviour, a person can ensure that the system allows Internet traffic that could be harmful.
</p>
<p>
In versions of Windows prior to XP and before Service Pack 2 of XP, a firewall integrated into the operating system was either nonexistent or very inadequate. With XP SP2, a more satisfactory personal firewall was also added to the system. However, some hackers or pirated software that find its vulnerabilities manage to overcome this structure as well. Currently, just as there are some professional firewall software sold on the market, there are also free software for non-commercial use with almost the same capabilities (such as Sygate Personal Firewall). Experience has shown that for a user who does not tend to download and use programmes such as password crackers, screensavers, games, etc., which have the potential to be pirated, uses licensed or reliable software, has installed some protection tools on their computer, and performs updates on time, the firewall software coming integrated with XP SP2 and later operating systems seems sufficient.
</p>
<p> </p>
<h5>Antivirus and Antispyware</h5>
These are software loaded onto the computer against viruses and spyware, which notice and prevent them when they try to enter the computer. Once installed on the computer, they automatically start working in the background every time the computer is turned on, and simultaneously check all read and written files. The cost of this often manifests itself as the computer booting up significantly slower and longer, and performing operations slower than usual. Since such programmes try to track tens of thousands of known viruses, the resulting speed decrease actually remains at quite acceptable levels compared to the work done. Both types of scanners occasionally connect to their manufacturing companies over the Internet and update their virus definitions. This is necessary to be aware of newly released viruses and spyware software. It is out of the question for every antivirus and antispyware software to find all viruses. In fact, there is no ideal software. The software that does not know the fingerprint of a newly released and rapidly spreading virus cannot notice it, and the virus infects the computer. Some viruses can even recognise popular antivirus software once they infect the computer and neutralise them without the user noticing. While the user works with peace of mind, the virus has actually started to damage the computer.
<p>
Antiviruses and antispyware are generally separate programmes that need to be installed separately due to their functions. They are usually sold for money and need to be licensed. "Cracked" versions of popular antivirus programmes can frequently be found on the market. However, as no one can guarantee that malicious spyware programmes have not been intentionally inserted into them during "cracking", the manufacturing companies they connect with to update against new viruses will realise they are pirated and may refuse to provide updates. Recently, programmes bundling antivirus, antispyware, and even personal firewalls together have begun to appear on the market. However, their prices and the amount of memory and processing power they occupy in the system increase proportionally.
</p>
<p>
Some well-known antispyware programmes, on the other hand, in their free versions released for promotional purposes, operate by scanning the existing disk when the user wishes, instead of performing instant checks. One of the most popular of these is Ad-Aware. In addition, there are sites that connect to your computer over the Internet and perform remote scanning. For their access to your computer, the user gives some permissions and perhaps installs some small programmes. This is a method that, in addition to creating a major security vulnerability for the user, is extremely slow and can also negatively affect corporate Internet traffic; it is not recommended by us.
</p>
<p>
The even more complex aspect of the problem is that some of the many antivirus and antispyware software frequently found on the Internet are actually viruses and spyware themselves. These are software that appear to the normal user as if they are protecting them (which in fact, they might genuinely be protecting against some pests) while simultaneously spying. They might even be advertising themselves with very flashy websites. People should not install such programmes without conducting good research and consulting those who know. At our university, especially at the Beytepe Campus, some of these types of antivirus software spreading through friend recommendations have been encountered. Computers with this software installed have occasionally caused serious disruptions in Internet traffic without the users realising it.
</p>
<p> </p>
<h4>How Do I Protect My Computer From Viruses and Spyware?</h4>
On this very broad subject, only some practical recommendations will be provided here. Usually, users of Microsoft Windows operating systems are targeted here. The reason for this is that this operating system has a much larger user base compared to others, and the vulnerabilities found in the operating system are more abundant and exploited more than others. Undoubtedly, what is explained here will also give general ideas to users of operating systems such as Linux, MacOS, etc.
<p>
Basically, the ways of protection against viruses and spyware can be listed as follows:
</p>
<p> </p>
<ol>
<li><strong>Do not download or open programmes of unknown origin from the outside.</strong> Although it may seem like quite a restrictive situation, in today''s Internet environment, unfortunately, we have to act much more "paranoid" than before. "Cute" screensavers, free games, password cracking programmes can be a potential source of viruses or spyware. Especially "hack/crack" sites used for finding pirated programmes or software keys are ideal places. Many of these require clicking on something or saying "yes" to something just to provide a key. This is, in fact, nothing but the person installing harmful software on their computer with their own hands. These must definitely be avoided. Known freeware/shareware sites on the Internet that have proven their reliability and do not allow the installation of pirated software are much safer.</li>
<p> </p>
<li><strong>Never open insecure e-mails, do not run attachments inside them.</strong> Sometimes e-mails coming from even a very reliable person, either without them realising or in their name, can be potential virus carriers. Especially files with the ".doc" extension, which are Word documents, can contain potential viruses. Some e-mail clients (such as Outlook) can also open and run incoming e-mails on their own without the user''s intention due to vulnerabilities and errors in their software. It is beneficial to configure these settings and stay away from e-mail software that executes things without the user''s desire. Sometimes, those who send infected files via e-mail can hide their extensions in a way that deceives users. For example, a harmful file that is made to look like it has a harmless file extension such as an mp3 file might actually have 100 spaces after mp3 followed by ".exe" as the suffix, and because some e-mail clients cannot display these spaces, users might think this file is an mp3 file and click on it. The best behaviour regarding attachments is to save them somewhere without opening them, to be sure of their extension, and especially if it is a "doc" file, to open it with another more primitive programme such as "Windows Wordpad", etc., and try to see inside somewhat.</li>
<p> </p>
<li><strong>Use licensed operating systems and software.</strong> It is highly beneficial to obtain and install especially Windows operating systems under a licence. Users who use unlicensed operating systems most often cannot benefit from the updates released for them and made against software errors. Furthermore, it is difficult to be sure that unwanted codes have not been placed by the "cracker" into these software obtained as "cracks". On licensed operating systems, users also cannot install and use additional software such as "antispyware". This rule applies not only to operating systems but also to other subsequently installed software like Office. Hacettepe University Department of Information Technology has made the necessary agreements and software procurement for users to be able to use software licensed.</li>
<p> </p>
<li><strong>Use Antivirus and Antispyware.</strong> However, it is important to obtain and install the legal versions of these. It is also necessary to draw attention to a behavioural pattern frequently observed in users: Users act more carelessly in computer use, saying "I use an antivirus anyway". Users who think that if there is a harmful programme, the antivirus will stop it anyway, actually ignore the fact that antiviruses cannot provide a hundred percent protection and most of the time cannot even find newly spreading viruses, and they often realise they have caught a virus too late. Users should not fall into this error. There is a wide variety of antivirus and antispyware software available on the market and the Internet world. The rule is not "the most popular is the best". The more widespread an antivirus programme is, the better its vulnerabilities and weaknesses are known, which makes the job of virus writers easier. On the other hand, an completely unheard of antivirus software can be suspicious, its update frequency might be insufficient, or they can slow down your computer even more compared to famous programmes with better technology. Unfortunately, in a free market environment, it is also quite difficult to recommend one of these software, which have advantages and disadvantages against one another, over another. As of the date this article was written, licensed Windows XP users can download and run the software named "Windows Defender (beta)" free of charge from Microsoft''s website. This is an "antispyware" software and can operate quite effectively. Again, in a short while, an antivirus/antispyware/firewall package named "Microsoft OneCare" will be offered to users outside the USA. The Hacettepe University Department of Information Technology is also waiting to make the necessary agreements for this sold package. Currently, the "beta" version of the package can be installed and tested.</li>
<p> </p>
<li><strong>Use a personal firewall.</strong> As mentioned under the firewall heading above, there are different options on this issue as well. At the very least, a user must install Service Pack 2 on their Windows XP (some operating systems come pre-installed) and enable the built-in firewall. It is highly beneficial for a user who does not run special applications to check the option similar to "don''t allow exceptions" while doing this activation. It will be a useful behaviour for users to go into the place where Windows firewall settings are made from time to time during use and check whether any programme has changed the current settings and allowed new vulnerabilities. Because some spyware, once they enter the computer, play with some settings of the existing firewall and can enable the system to allow external entry ports that are normally not allowed.</li>
<p> </p>
<li><strong>Do not visit suspicious Web sites as much as possible.</strong> Website administrators who exploit some vulnerabilities found in Windows can use certain codes that cause the user to catch spyware if they visit these sites. These methods are frequently used especially on "crack" sites, game sites, lyrics and mp3 sites, pirated software sites called "warez", and pornographic sites. A method that can be used to reduce the risk a little as of the date this article was written could be to use the Mozilla Firefox browser instead of Internet Explorer. This browser software can be installed on the computer as a separate alternative without damaging the existing IE. Due to some of its features, it does not get caught in the traps that IE falls into.
<p> </p>
</li>
<li><strong>Use virtual machines.</strong> It is a method that advanced users can prefer. Virtual machine software is available on the market. A user who acquires one of these and installs it on their computer runs an entirely separate computer inside their computer as a window. The user installs another operating system of their choice into this, independent of the current operating system, "boots" it up, and a new computer runs inside the window. The device that this virtual computer thinks is its own hard disk is actually a harmless file on the main hard disk. With this, an Internet connection can be established, one can safely enter and exit anywhere, and desired infected programmes can be run. Everything will remain inside this virtual machine, and the real computer will not be affected by this.</li>
</ol>

</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('vpn', 'en', 'Information and Connection Guides regarding the VPN system', '
<div class="icerik">
<p>Dear User,</p>
<p>There has been a change in our VPN application.</p>
<p>You can access our new application by logging into <a href="https://vpn.hacettepe.edu.tr/" target="_blank" rel="noopener noreferrer">https://vpn.hacettepe.edu.tr</a> in your browser with your Hacettepe E-mail username and password, and then installing the appropriate application for your Operating System.</p>
<p><a href="/dosyalar/hu_vpn_erisim_klavuzu.pdf" target="_blank">You can access the installation document here.</a></p>
<p>Should you encounter any problems, please inform us via e-mail at <a href="mailto:system@hacettepe.edu.tr">system@hacettepe.edu.tr</a>.</p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('web-policy', 'en', 'WEB Page Publishing Principles', '
<div class="icerik">
<p>The directive covering the principles of preparation and publication of Hacettepe University Unit and Personal Web pages was approved by the Hacettepe University Senate on 02.07.2007.</p>
<p>All institutions, units, departments, and individuals affiliated with Hacettepe University are required to comply with these principles whilst preparing their Web pages.</p>
<p>You may access all of these principles by clicking the link below: <BR>
<BR>
<A href="/dosyalar/web_sayfasi_ilkeleri.pdf">Hacettepe University Web Page Preparation and Publication Principles</A> (in *.pdf format.) </p>
<p><a href="https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5651&MevzuatTur=1&MevzuatTertip=5" target="_blank">Law No. 5651 on the Regulation of Publications Made in the Internet Environment and Combating Crimes Committed Through These Publications</a></p>
<p><a href="https://www.btk.gov.tr/kanunlar" target="_blank">Other Legal Regulations Regarding Informatics</a></p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('web-services', 'en', 'WEB Services', '
<div class="icerik">
<p><STRONG>Hacettepe University Main Web Site</STRONG><BR>
The Department of Information Technology is responsible for Hacettepe University''s main Web site at <A href="http://www.hacettepe.edu.tr/" target="_new">www.hacettepe.edu.tr</A>. The Web Unit operating within the Department carries out the design and update of this site. For information requested to be included on the site, necessary corrections and additions, one may apply to the <A href="mailto:webmaster@hacettepe.edu.tr">webmaster@hacettepe.edu.tr</A> address. </p>
<UL>
<LI><A href="/en/services">Web Service for Unit Web Pages</A> </LI>
<LI><A href="/en/personal-pages">Web Service for Personal Web Pages</A> </LI>
</UL>
<p>Please examine the Prime Ministry Circular No. 2007/4 on the Guide for Public Institutions Internet Sites from the <A href="https://www.btk.gov.tr/kanunlar" target="_blank" >legal regulations concerning informatics</A> page. </p>
</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('webmail', 'en', 'Email', '
<div class="icerik">







<div class="row">
	<div class="col-lg-3  mb-4">
	
		<div class="card text-center h-100">		  
		  <div class="card-body">
		  	<div class="mb-2"><img src="/images/icon_exchange2.jpg" width="48" /></div>
		    <h5 class="card-title2"><a href="https://posta.hacettepe.edu.tr" target="_blank">Email Login<br />(Microsoft Exchange)</a></h5>	
		    <p><span class="text-danger">(Staff - Student Login)</span></p>	    
		  </div>
		</div>
	
	</div>

<div class="col-lg-3 mb-4">
	
		<div class="card text-center h-100">		  
		  <div class="card-body">
		  	<div class="mb-2"><img src="/images/icon_mail2.jpg" width="48" /></div>
		    <h5 class="card-title2"><a href="https://outlook.office.com/" target="_blank">Alumni Email Login</a></h5>		    
		  </div>
		</div>
	
	</div>


	<div class="col-lg-3  mb-4">
	
		<div class="card text-center h-100">		  
		  <div class="card-body">
		  	<div class="mb-2"><img src="/images/icon/portal.png" width="48" /></div>
		    <h5 class="card-title2"><a href="https://portal.hacettepe.edu.tr/" target="_blank">HU Department of Information Technology Portal</a></h5>		    
		  </div>
		</div>
	
	</div>

	





</div>
	
	
  
  



</div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

INSERT INTO page (slug, language, title, content_html, seo_title, seo_description, seo_keywords, published, sort_order, seo_image, seo_robots, seo_schema_type)
VALUES ('wireless', 'en', 'Wireless Access Services', '
<div class="icerik">
 <p>The wireless network infrastructure established in Sıhhiye and Beytepe campuses, dormitories area and open areas within the campus serves with eduroam and Hacettepe broadcasts.</p>
 <p><strong>What is eduroam?</strong> <a href="https://eduroam.org/what-is-eduroam/" target="_blank" rel="noopener noreferrer">eduroam</a> (education roaming) is a secure, worldwide roaming wireless network access service developed for the international research and education community. Students, researchers and staff from participating institutions can connect to the internet on campuses where eduroam is available without creating a new account, using the account information provided by their own institutions.</p>
 <p>You can access the current connection settings for Hacettepe University at <a href="https://eduroam.hacettepe.edu.tr" target="_blank" rel="noopener noreferrer">eduroam.hacettepe.edu.tr</a>.</p>
 </div>

', NULL, NULL, NULL, 't', '0', NULL, 'index, follow', 'WebPage')
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, seo_image = EXCLUDED.seo_image, seo_robots = EXCLUDED.seo_robots, seo_schema_type = EXCLUDED.seo_schema_type, updated_at = now();

-- === Menü (menu, menu_item — language='en') ===
-- Referans bütünlüğü sağlamak için sil-yeniden-oluştur; page_id her satırda
-- slug üzerinden alt sorguyla çözülüyor, sabit id'ye bağlı değil.

DELETE FROM menu_item WHERE menu_id IN (SELECT id FROM menu WHERE language = 'en');
DELETE FROM menu WHERE language = 'en';

INSERT INTO menu (language, position, title, sort_order) VALUES ('en', 'sol', 'Corporate', '0');
INSERT INTO menu (language, position, title, sort_order) VALUES ('en', 'sol', 'Services', '1');
INSERT INTO menu (language, position, title, sort_order) VALUES ('en', 'sol', 'Rules and Policies', '2');
INSERT INTO menu (language, position, title, sort_order) VALUES ('en', 'sol', 'Technical Infrastructure', '3');
INSERT INTO menu (language, position, title, sort_order) VALUES ('en', 'sol', 'Contact', '4');
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Contact', (SELECT id FROM page WHERE slug='contact' AND language='en'), NULL, 'f', '0' FROM menu m WHERE m.language='en' AND m.title='Contact';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Disclaimer', (SELECT id FROM page WHERE slug='disclaimer' AND language='en'), NULL, 'f', '1' FROM menu m WHERE m.language='en' AND m.title='Contact';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Accessibility Statement', (SELECT id FROM page WHERE slug='accessibility' AND language='en'), NULL, 'f', '2' FROM menu m WHERE m.language='en' AND m.title='Contact';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Overview', (SELECT id FROM page WHERE slug='overview' AND language='en'), NULL, 'f', '0' FROM menu m WHERE m.language='en' AND m.title='Corporate';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Organizational Chart', (SELECT id FROM page WHERE slug='org-chart' AND language='en'), NULL, 'f', '1' FROM menu m WHERE m.language='en' AND m.title='Corporate';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Mission and Vision', (SELECT id FROM page WHERE slug='mission-vision' AND language='en'), NULL, 'f', '2' FROM menu m WHERE m.language='en' AND m.title='Corporate';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Information Security Policy', (SELECT id FROM page WHERE slug='security-policy' AND language='en'), NULL, 'f', '3' FROM menu m WHERE m.language='en' AND m.title='Corporate';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Staff', (SELECT id FROM page WHERE slug='staff' AND language='en'), NULL, 'f', '4' FROM menu m WHERE m.language='en' AND m.title='Corporate';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Boards and Committees', (SELECT id FROM page WHERE slug='committees' AND language='en'), NULL, 'f', '5' FROM menu m WHERE m.language='en' AND m.title='Corporate';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Information Security Management System', (SELECT id FROM page WHERE slug='isms' AND language='en'), NULL, 'f', '0' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Hacettepe University E-mail Directive', (SELECT id FROM page WHERE slug=NULL AND language='en'), '/dosyalar/epostayonergesi22.pdf', 't', '1' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'E-mail Scanning Policies', (SELECT id FROM page WHERE slug='mail-filtering' AND language='en'), NULL, 'f', '2' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Web Page Publishing Principles', (SELECT id FROM page WHERE slug='web-policy' AND language='en'), NULL, 'f', '3' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Dormitory and Student Housing Rules', (SELECT id FROM page WHERE slug='dorm-rules' AND language='en'), NULL, 'f', '4' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'PC Labs Usage Rules', (SELECT id FROM page WHERE slug='lab-rules' AND language='en'), NULL, 'f', '5' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Mailing Lists Policies', (SELECT id FROM page WHERE slug='mailing-lists' AND language='en'), NULL, 'f', '6' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'HUNET Usage Principles', (SELECT id FROM page WHERE slug='hunet-policy' AND language='en'), NULL, 'f', '7' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'HUNET Student Framework Rules', (SELECT id FROM page WHERE slug='student-rules' AND language='en'), NULL, 'f', '8' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'HUNET Beytepe Dormitory Access Protocol', (SELECT id FROM page WHERE slug='dorm-access' AND language='en'), NULL, 'f', '9' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Legal Regulations regarding IT', (SELECT id FROM page WHERE slug=NULL AND language='en'), 'https://www.btk.gov.tr/kanunlar', 't', '10' FROM menu m WHERE m.language='en' AND m.title='Rules and Policies';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Web Services', (SELECT id FROM page WHERE slug='web-services' AND language='en'), NULL, 'f', '0' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Content Management System', (SELECT id FROM page WHERE slug='cms' AND language='en'), NULL, 'f', '1' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Wireless Access Services', (SELECT id FROM page WHERE slug='wireless' AND language='en'), NULL, 'f', '2' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Licensed Software Server', (SELECT id FROM page WHERE slug='software' AND language='en'), NULL, 'f', '3' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'HU Management Systems', (SELECT id FROM page WHERE slug=NULL AND language='en'), 'https://huys.hacettepe.edu.tr:7020/CasSunucu/login?service=http%3A%2F%2Fhuys.hacettepe.edu.tr%2FuygulamaGiris', 't', '4' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'E-Signature User Guide', (SELECT id FROM page WHERE slug='e-signature' AND language='en'), NULL, 't', '5' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Information and Documents', (SELECT id FROM page WHERE slug='documents' AND language='en'), NULL, 'f', '6' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'E-mail Services', (SELECT id FROM page WHERE slug='email' AND language='en'), NULL, 'f', '7' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Webmail', (SELECT id FROM page WHERE slug='webmail' AND language='en'), NULL, 'f', '8' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Office 365', (SELECT id FROM page WHERE slug='office365' AND language='en'), NULL, 'f', '9' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Proxy Settings and Setup', (SELECT id FROM page WHERE slug='proxy' AND language='en'), NULL, 'f', '10' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Frequently Asked Questions', (SELECT id FROM page WHERE slug='faq' AND language='en'), NULL, 'f', '11' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Forms', (SELECT id FROM page WHERE slug='forms' AND language='en'), NULL, 'f', '12' FROM menu m WHERE m.language='en' AND m.title='Services';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Network Infrastructure', (SELECT id FROM page WHERE slug='network' AND language='en'), NULL, 'f', '0' FROM menu m WHERE m.language='en' AND m.title='Technical Infrastructure';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'Current Hardware Information', (SELECT id FROM page WHERE slug='hardware' AND language='en'), NULL, 'f', '1' FROM menu m WHERE m.language='en' AND m.title='Technical Infrastructure';
INSERT INTO menu_item (menu_id, label, page_id, external_url, new_tab, sort_order) SELECT m.id, 'External Access Rules', (SELECT id FROM page WHERE slug='external-access' AND language='en'), NULL, 'f', '2' FROM menu m WHERE m.language='en' AND m.title='Technical Infrastructure';

-- === Ana sayfa slaytları (slide, language='en') ===

DELETE FROM slide WHERE language = 'en';

INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published, starts_on, ends_on) VALUES ('en', 'Network and System Infrastructure', 'Beytepe and Sıhhiye campuses receive high-speed internet service via UlakNet and are connected by a Metro Ethernet line.', '/images/slider/slide3-1920.webp', 'Aerial view of Beytepe Campus within the forest area', '/en/network', '1', 't', NULL, NULL);
INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published, starts_on, ends_on) VALUES ('en', 'Sıhhiye Computer Centre', 'A Computer Centre affiliated with our Department operates in the Sıhhiye Campus, where the health sciences faculties and hospitals are located.', '/images/slider/slide1-1920.webp', 'Hacettepe building at Sıhhiye Campus', '/en/contact', '2', 't', NULL, NULL);
INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published, starts_on, ends_on) VALUES ('en', 'Wireless Access', 'Eduroam and Hacettepe wireless networks provide service on both campuses, including open areas and dormitories.', '/images/slider/slide4-1920.webp', 'Students spending time on the grass at Beytepe Campus', '/en/wireless', '3', 't', NULL, NULL);
INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published, starts_on, ends_on) VALUES ('en', 'Software Services', 'The Electronic Document Management System (EDMS), Personal Services, and Human Resources Management System are operated by our Department; software needs of units are developed.', '/images/slider/slide2-1920.webp', 'Glass-fronted building at Beytepe Campus', '/en/overview', '4', 't', NULL, NULL);
INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published, starts_on, ends_on) VALUES ('en', 'Event and Unit Websites', 'Web pages are prepared and technical support is provided for academic and administrative units, student clubs, and university events.', '/images/slider/spor-1920.webp', 'Sports festival trophy and sports equipment at Hacettepe University stadium', '/en/web-services', '5', 't', NULL, NULL);
INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published, starts_on, ends_on) VALUES ('en', 'User Support', 'E-mail and account operations, licensed software distribution, qualified electronic certificates, and technical support requests are met via our Call Centre.', '/images/slider/slide5-1920.webp', 'Beytepe Campus entrance sign', '/en/faq', '6', 't', NULL, NULL);

-- === Hızlı erişim / servis kısayolları (shortcut, language='en') ===

DELETE FROM shortcut WHERE language = 'en';

INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Hacettepe Portal', '/images/icon/portal_new.jpg', 'https://portal.hacettepe.edu.tr/', 't', '0', 't', 'service');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Web Services', '/images/hizmet1.png', '/en/web-services', 'f', '1', 't', 'service');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'HU Content Management System', '/images/hizmet2.png', 'http://hu-iys.hacettepe.edu.tr/', 't', '2', 't', 'service');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Academic Pre-Evaluation Application System', '/images/servis_akademik.png', 'https://kriter.hacettepe.edu.tr', 't', '3', 't', 'service');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Faculty of Fine Arts Application System', '/images/servis_gsf.png', 'https://ozelyeteneksinavi.hacettepe.edu.tr/giris/', 't', '4', 't', 'service');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Faculty of Education Alumni Information System', '/images/hizmet_mezunbilgi.jpg', 'http://egitimmezun.hacettepe.edu.tr/', 't', '5', 't', 'service');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Vehicle Sticker Application', '/images/servis_sticker.png', 'http://guvenlik.hacettepe.edu.tr/sticker/', 't', '6', 't', 'service');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'E-mail Services', '/images/icon/eposta_new.jpg', '/en/email', 'f', '0', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Webmail', '/images/icon_exchange2.jpg', '/en/webmail', 'f', '1', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Office 365', '/images/icon/office365.png', '/en/office365', 'f', '2', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'HU Department of IT Portal', '/images/icon/portal_new.jpg', 'https://portal.hacettepe.edu.tr/', 't', '3', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'EDMS Information', '/images/icon/ebys_new.jpg', 'http://ebysbilgilendirme.hacettepe.edu.tr/', 't', '4', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'E-Signature & Mobile Signature', '/images/icon/eimza_new.jpg', '/en/e-signature', 't', '5', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Proxy Settings and Setup', '/images/icon/proxy_new.jpg', '/en/proxy', 'f', '6', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Issue Reporting and Support Services', '/images/icon/yardim_new.jpg', 'https://bidbdestek.hacettepe.edu.tr', 't', '7', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Frequently Asked Questions', '/images/icon/sss_new.jpg', '/en/faq', 'f', '8', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Forms', '/images/icon/form_new.jpg', '/en/forms', 'f', '9', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Information and Documents', '/images/icon/bilgidokuman_new.jpg', '/en/documents', 'f', '10', 't', 'shortcut');
INSERT INTO shortcut (language, name, icon_url, url, new_tab, sort_order, published, type) VALUES ('en', 'Software Repository', '/images/icon/yazilimdeposu_new.jpg', 'https://yazilimdeposu.hacettepe.edu.tr/', 't', '11', 't', 'shortcut');

-- === Haberler (news, language='en' — plana göre yalnızca son 10 kayıt) ===

DELETE FROM news WHERE language = 'en';

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Information on Microsoft OneDrive Storage Quotas', NULL, NULL, '2026-06-23', 'f', 't', '/dosyalar/onedriveduyuru230626.pdf', NULL, '/images/news/demo-basketbol-takimi.webp', 'Women''s basketball team at Hacettepe sports hall', '0', 'software-license', 'all-users', 'technology', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Regarding Microsoft 365 Licensing and Usage Changes', NULL, NULL, '2026-06-02', 'f', 't', '/dosyalar/365A1plus_020626.pdf', NULL, '/images/news/demo-voleybol-maci-1.webp', 'Volleyball match played at Hacettepe sports hall', '0', 'software-license', 'all-users', 'technology', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Evaluation Result Regarding the Recruitment of Contracted IT Personnel', NULL, NULL, '2026-04-24', 'f', 't', '/dosyalar/sozlesmeilan240426.pdf', NULL, '/images/news/demo-futbol-takimlari.webp', 'Football teams before the match on Hacettepe pitch', '0', 'recruitment', 'all-users', 'people', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Written Exam Results and Oral Exam Information Regarding the Recruitment of Contracted IT Personnel', NULL, NULL, '2026-04-09', 'f', 't', '/dosyalar/EK_5_sozlu_sinava_girmeye_hak_kazananlarin_ilani_090426.pdf', NULL, '/images/news/demo-voleybol-takimi.webp', 'Women''s volleyball team at Hacettepe sports hall', '0', 'recruitment', 'all-users', 'people', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Preliminary Examination Result List of Candidates Eligible for the Exam Regarding the Recruitment of Contracted IT Personnel', NULL, NULL, '2026-03-31', 'f', 't', '/dosyalar/EK_3_yazili_sinava_girmeye_hak_kazananlarin_ilani_310326.pdf', NULL, '/images/news/demo-futbol-takimi.webp', 'Football team before the match on Hacettepe pitch', '0', 'recruitment', 'all-users', 'people', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'ISKUR Youth Programme Notary Draw', NULL, NULL, '2025-10-15', 'f', 't', '/dosyalar/iskur_kuracekimi_151025.pdf', NULL, '/images/news/demo-tenis-maci.webp', 'Athlete serving on indoor tennis court', '0', 'iskur', 'students', 'career', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', '2025-2026 Academic Year ISKUR Youth Programme', NULL, NULL, '2025-10-14', 'f', 't', 'https://pdb.hacettepe.edu.tr/duyuru/iskur_131025.pdf', NULL, '/images/news/demo-voleybol-maci-2.webp', 'Volleyball match played at Hacettepe sports hall', '0', 'iskur', 'students', 'career', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Evaluation Result of the Recruitment of Contracted IT Personnel', NULL, NULL, '2025-05-29', 'f', 't', '/dosyalar/sozlesme_hak_kazananlarin_ilani290525.pdf', NULL, NULL, NULL, '0', 'recruitment', 'all-users', 'people', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Written Exam Results and Oral Exam Information Regarding the Recruitment of Contracted IT Personnel', NULL, NULL, '2025-05-23', 'f', 't', '/dosyalar/Sozlu_sinava_girmeye_hak_kazananlarin_ilani_232025.pdf', NULL, NULL, NULL, '0', 'recruitment', 'all-users', 'people', NULL, NULL, NULL, NULL, 'index, follow');

INSERT INTO news (language, title, summary, content_html, published_on, featured, published, external_url, slug, image_url, image_alt, view_count, category, audience, cover_template, cover_text, seo_title, seo_description, seo_keywords, seo_robots) VALUES ('en', 'Preliminary Examination Result List of Candidates Eligible for the Exam Regarding the Recruitment of Contracted IT Personnel', NULL, NULL, '2025-05-13', 'f', 't', '/dosyalar/yazili_sinava_girmeye_hak_kazananlarin_ilani130525.pdf', NULL, NULL, NULL, '0', 'recruitment', 'all-users', 'people', NULL, NULL, NULL, NULL, 'index, follow');
