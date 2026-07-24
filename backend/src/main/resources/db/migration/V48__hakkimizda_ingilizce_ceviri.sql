-- 'about' (Hakkımızda) sayfası TR'de kaynak sitede yoktu, kurum için özel
-- yazılmıştı (bkz. verify-content.js BILINCLI_SAPMA: "tr/about"). EN'de bu
-- slug hiç yoktu — V39'da eski EN 'about' (birim listesi) 'overview'e
-- taşındığından beri bu ayrı "Hakkımızda" tanıtım sayfasının İngilizcesi
-- hiç yazılmamıştı. Docs/ceviri-sozlugu.md'deki kilitli terimlerle ve
-- Organisation Chart sayfasında zaten yayında olan unvanlarla (Head of
-- Department, EDMS...) tutarlı çevrildi.

INSERT INTO page (slug, language, title, content_html, published, sort_order)
VALUES (
  'about', 'en', 'About Us',
  '<div class="icerik">
<p>The Hacettepe University Department of Information Technology establishes, operates and develops the university''s information technology infrastructure. The network, server, software and user services underpinning the university''s education, training, research and administrative processes are carried out by our Department.</p>

<h2>Establishment and Legal Basis</h2>
<p>Hacettepe University was founded in 1967. The administrative organisation of universities is regulated by Decree Law No. 124, issued on the basis of Article 51 of Higher Education Law No. 2547. Departments of Information Technology were established by this Decree Law on 7 October 1983; the Decree Law was published in the Official Gazette dated 21 November 1983, No. 18228.</p>
<p>The Decree Law defines the Department''s duty as operating the university''s information technology system, providing support for education, training and research, and fulfilling the other information technology services the university will need. Our Department''s <a href="/en/mission-vision">mission and vision</a> are founded on this definition of duty.</p>

<h2>Areas of Activity</h2>
<p>The Department''s activities fall under four main headings:</p>
<ul>
<li><strong>Network and system infrastructure.</strong> Installation, management and security of campus networks; operation, updating and backup of servers and core internet services within the framework of the relevant legislation.</li>
<li><strong>Software development and management systems.</strong> Development of applications that transfer the business processes of university units to a computer environment; operation of, and end-user support for, corporate systems such as the Document Management System (DMS), Individual Transactions and the Human Resources Management System.</li>
<li><strong>User services.</strong> E-mail and account operations, wireless access, licensed software distribution, electronic signature processes, operation of computer laboratories and technical support.</li>
<li><strong>Web services.</strong> Configuration and updating of the university web page; preparation of, and technical support for, web pages for academic and administrative units, student societies and university events.</li>
</ul>
<p>Detailed duty descriptions for each unit are given on the <a href="/en/overview">Overview</a> page.</p>

<h2>Organisational Structure</h2>
<p>The Department consists of units reporting to the Head of Department and to two Deputy Heads of Department responsible for administrative and technical matters respectively. The Administrative and Financial Affairs Unit reports directly to the Head of Department. The full structure can be seen on the <a href="/en/org-chart">Organisation Chart</a> page, and the staff serving in each unit on the <a href="/en/staff">Staff</a> page.</p>

<h2>Campuses and Infrastructure</h2>
<p>Our university has two main campuses and a number of vocational schools. The Department''s main building is located at Beytepe Campus, with an affiliated Computer Centre at Sıhhiye Campus. Our Department also provides information technology support to university enterprises affiliated with the Directorate of Health, Culture and Sports. Both campuses receive high-speed internet service via UlakNet and are connected to each other by a Metro Ethernet line.</p>
<p>Current information on the network backbone, wireless access and server infrastructure is available on the <a href="/en/network">Network Infrastructure</a> and <a href="/en/hardware">Current Hardware Information</a> pages. Computer laboratories open to student use are operated on both campuses; usage rules are published on the <a href="/en/lab-rules">PC Laboratory Usage Rules</a> page.</p>

<h2>Information Security Management</h2>
<p>Information security at our Department is not left to individual discretion but is governed by a management system bound by written rules. The Information Security Management System is structured and operated on the basis of the TS ISO/IEC 27001 standard. The rules to be complied with are published on the <a href="/en/security-policy">Information Security Policy</a> and <a href="/en/isms">Information Security Management System</a> pages.</p>

</div>',
  true, 0
);

INSERT INTO menu_item (menu_id, label, page_id, sort_order)
SELECT m.id, 'About Us', (SELECT id FROM page WHERE slug='about' AND language='en'), -1
FROM menu m WHERE m.language='en' AND m.title='Corporate'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.menu_id = m.id
    AND mi.page_id = (SELECT id FROM page WHERE slug='about' AND language='en')
);
