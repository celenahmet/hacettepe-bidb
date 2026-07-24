-- Kapsamlı SEO çalışması: meta açıklama (seo_description) eksikliği.
--
-- 80 TR + 80 EN sayfadan yalnızca 18'inde (TR) / 1'inde (EN) gerçek bir
-- meta açıklama vardı; geri kalanı Seo servisinin genel şablonuna
-- ("{sayfa} hakkında ... güncel bilgiler.") düşüyordu — arama
-- motorlarında neredeyse tüm sayfalar aynı/çok benzer açıklamayla
-- görünüyordu.
--
-- Bu migration, içeriği OLDUĞU GİBİ kullanarak (uydurmadan, yalnızca
-- HTML etiketleri temizlenip ilk anlamlı ~155 karaktere kırpılarak)
-- 130 sayfa için gerçek, sayfaya özgü açıklama üretiyor. Zaten özel
-- açıklaması olan 19 sayfaya dokunulmadı. İçeriği çok kısa/listeye
-- dayalı 11 sayfa (ör. tek satırlık arşiv kayıtları) atlandı — onlar
-- için Seo servisinin genel şablonu zaten yeterli.

UPDATE page SET seo_description = '1. Statement of Commitment As Hacettepe University Department of Information Technology, we are committed to making our digital services accessible to all…' WHERE id = 100;
UPDATE page SET seo_description = 'Improvement and development works have been carried out in Hacettepe University Electronic Mail Systems to help our users communicate more efficiently and…' WHERE id = 125;
UPDATE page SET seo_description = 'Dear Academic Staff and Students of Our University, We have procured ANSYS software, a computer-aided engineering programme that enables analyses and…' WHERE id = 163;
UPDATE page SET seo_description = 'Contracted IT Personnel Recruitment Examination Results (20.01.2023) Written Examination Results and Oral Examination Information Regarding Contracted IT…' WHERE id = 159;
UPDATE page SET seo_description = 'The Content Management System (HÜ-CMS), prepared by the Department of Information Technology and through which you can manage the content of your web…' WHERE id = 173;
UPDATE page SET seo_description = 'Quality Commission Mustafa Gökhan Güzel Acting Head of Department Chair Görkem Çoruh Deputy Head of Department Member Ahum Barbaros Programmer Member…' WHERE id = 93;
UPDATE page SET seo_description = 'Users sometimes cannot connect to the places they wish to connect to over the Internet, or they connect at slower speeds than usual. In such cases, the…' WHERE id = 174;
UPDATE page SET seo_description = 'Hacettepe University Department of Information Technology 06800 Beytepe / ANKARA Tel: +90 312 297 62 00 Fax: +90 312 299 20 88 E-Mail…' WHERE id = 98;
UPDATE page SET seo_description = 'You can check your database information on the server with IP address 193.140.239.9 from this page. Database Name: (dbname) Database Username: (dbuser)…' WHERE id = 161;
UPDATE page SET seo_description = 'This site provides links to Internet sites controlled by third parties. There is absolutely no connection of interest between our institution and the…' WHERE id = 99;
UPDATE page SET seo_description = 'Below are links to some external addresses that we think might be useful for our users. Although the continuity, validity, and recency of these links are…' WHERE id = 175;
UPDATE page SET seo_description = 'VPN Installation Guide About SPAM and PHISHING Viruses and Security Recommendations Precautions for Computer Accidents About HU Internet Connection Proxy…' WHERE id = 145;
UPDATE page SET seo_description = '1. Applications that are always open ftpcc, hacettepetv, hacettepetv1, newscc, yunus, yurt_portal, web-browsing, smtp, imap, pop3, ssl, ssh, dns, hotmail…' WHERE id = 122;
UPDATE page SET seo_description = 'Hacettepe University Department of Information Technology also provides Internet service to the dormitories and private student houses located at the…' WHERE id = 127;
UPDATE page SET seo_description = 'In order to ensure that the data generated via the EDMS is used electronically as an equivalent to a wet signature, personnel authorised to sign are…' WHERE id = 176;
UPDATE page SET seo_description = 'According to the Electronic Signature Law No. 5070 dated 15 January 2004, an electronic signature defines electronic data that is attached to or logically…' WHERE id = 149;
UPDATE page SET seo_description = 'For personnel requesting an e-signature due to an administrative duty , an e-signature request is sent via an official letter to the Department of…' WHERE id = 177;
UPDATE page SET seo_description = 'The certificate holder can have their certificate cancelled by calling the Public Certification Authority Call Centre (444 5 576). For applications made…' WHERE id = 148;
UPDATE page SET seo_description = 'In order to use the certificate you obtained from the Public Certification Authority, you can refer to the relevant instructions for driver installation…' WHERE id = 140;
UPDATE page SET seo_description = 'What are the legal consequences of an electronic signature? I want to obtain an electronic signature, what should I do? I did not receive an application…' WHERE id = 157;
UPDATE page SET seo_description = 'The certificate holder must contact the KAMU SM Call Centre at 444 5 576 to update their contact information, such as their institutional unit, address…' WHERE id = 154;
UPDATE page SET seo_description = 'To be able to sign with a Qualified Electronic Certificate, the Java programme must be installed and up-to-date on your computer. The latest update can be…' WHERE id = 151;
UPDATE page SET seo_description = 'LAWS Electronic Signature Law No. 5070 Official Gazette dated 23.01.2004 and numbered 25355 This Law encompasses the legal structure of electronic…' WHERE id = 178;
UPDATE page SET seo_description = 'For the PIN unlocking screens to function properly, Java version 1.8 or above must be installed on your computer. (You may experience Java plugin issues…' WHERE id = 155;
UPDATE page SET seo_description = 'You can download the Remote Access Programme. Ammyy Guide TeamViewer Guide' WHERE id = 139;
UPDATE page SET seo_description = 'Certificate renewal procedures will be carried out with the approval given to Public Certification Authority by the Department of Information Technology…' WHERE id = 152;
UPDATE page SET seo_description = 'The security word is an authorisation parameter that the applicant determines while filling out the application form. Those who forget their security word…' WHERE id = 143;
UPDATE page SET seo_description = 'UNIT E-SIGNATURE OFFICER TELEPHONE Faculty of Computer and Informatics Latif ELVAN Faculty of Pharmacy Umut Emre AYGÜL 3052148 Faculty of Letters Gökçen…' WHERE id = 179;
UPDATE page SET seo_description = 'The certificate update service can be utilised in the following circumstances: The card becoming unusable due to the PUK code being entered incorrectly in…' WHERE id = 153;
UPDATE page SET seo_description = 'E-mail Login Create New E-mail Account Forgot Username Forgot Password Update Password Update Information Update Phone Number Proxy-Spam Control Microsoft…' WHERE id = 180;
UPDATE page SET seo_description = 'To Obtain a Personal Email Account: For our newly registered associate degree and undergraduate students; Following their registration date, institutional…' WHERE id = 181;
UPDATE page SET seo_description = 'Old E-mail Outlook Backup Old E-mail Outlook Restore from Backup' WHERE id = 160;
UPDATE page SET seo_description = 'Installation Settings Login via the Email Interface Outlook Email Account Settings Outlook Email Account Settings on Android Devices Android Email Account…' WHERE id = 182;
UPDATE page SET seo_description = 'Rules Defined on the Firewall In order to make the use of Hacettepe University''s informatics resources more effective and efficient, a series of…' WHERE id = 103;
UPDATE page SET seo_description = 'EMAIL SERVICE I am a member of the university, how can I get an electronic mail account? Click here for detailed information How can I obtain an…' WHERE id = 183;
UPDATE page SET seo_description = 'E-Mail Unblocking Form E-Mail Cancellation Form E-Mail Request Form (Institutional) E-Mail Update Form (Institutional) E-Mail Request Form (Other) Guest…' WHERE id = 146;
UPDATE page SET seo_description = 'The Department of Information Technology of Hacettepe University has infrastructure facilities intended to provide services in the field of informatics…' WHERE id = 102;
UPDATE page SET seo_description = '1. Definitions Information Technology Resource: The computer network (HUNET) located within the campuses of Hacettepe University and established and…' WHERE id = 184;
UPDATE page SET seo_description = 'Information Security Policy Information Systems Acceptable Use Policy Password Policy Clear Desk and Clear Screen Policy' WHERE id = 111;
UPDATE page SET seo_description = 'Factors That Can Harm the Computer Factors threatening the computer in terms of both hardware and the data it contains may include the following: Hardware…' WHERE id = 113;
UPDATE page SET seo_description = 'Hacettepe University Department of Information Technology operates computer laboratories consisting of 75 computers at the Sıhhiye Campus and 260…' WHERE id = 185;
UPDATE page SET seo_description = '"GENERAL" Announcement List The list frequently used by users is the "GENERAL ANNOUNCEMENT LIST". Users wishing to send messages using the "General"…' WHERE id = 186;
UPDATE page SET seo_description = 'Dear Students of Our University, We have procured MATLAB software for our students — an integrated technical computing environment that combines numerical…' WHERE id = 164;
UPDATE page SET seo_description = 'Our mission is to operate the information technology system of our university by closely following technology; to provide support for education, training…' WHERE id = 97;
UPDATE page SET seo_description = 'Hacettepe University has two main campuses: Beytepe and Sıhhiye Campuses. Sıhhiye Campus is located in the city centre and mostly houses health-related…' WHERE id = 101;
UPDATE page SET seo_description = 'Home Directory Provisioning for Personal Web Pages via FTP Home directory provisioning on the server for personal web pages takes place when users connect…' WHERE id = 168;
UPDATE page SET seo_description = 'Dear Members of the Hacettepe Community, During the distance education process, we would like to share an important announcement to enable our academic…' WHERE id = 169;
UPDATE page SET seo_description = 'In accordance with measure item 3.1.4.8 of the Information and Communication Security Guide dated 24 July 2020 (…' WHERE id = 170;
UPDATE page SET seo_description = 'HACETTEPE UNIVERSITY DEPARTMENT OF INFORMATION TECHNOLOGY CONTRACTED IT PERSONNEL RECRUITMENT ANNOUNCEMENT In accordance with Article 8 of the Regulation…' WHERE id = 187;
UPDATE page SET seo_description = 'İŞKUR Youth Programme – Occupational Health and Safety Training Students who have qualified to participate in the İŞKUR Youth Programme are required to…' WHERE id = 188;
UPDATE page SET seo_description = 'HACETTEPE UNIVERSITY DEPARTMENT OF INFORMATION TECHNOLOGY CONTRACTED IT PERSONNEL EXAMINATION ANNOUNCEMENT In order to employ staff on a full-time basis…' WHERE id = 162;
UPDATE page SET seo_description = 'USING MICROSOFT OFFICE 365 MICROSOFT TEAMS INSTALLATION GUIDE MICROSOFT TEAMS USER GUIDE' WHERE id = 126;
UPDATE page SET seo_description = 'Mustafa Gökhan GÜZEL Head of Department gokhan{at}hacettepe.edu.tr Esin ALAN Department Secretary esin.alan{at}hacettepe.edu.tr Head of Department…' WHERE id = 197;
UPDATE page SET seo_description = 'Network Unit (Beytepe): Performs the installation of the local network, manages and audits the existing network, develops projects regarding the future of…' WHERE id = 196;
UPDATE page SET seo_description = 'FTP Connection Settings General Information MYSQL Usage Database Checking Page Quota FTP Connection Settings: The connection information to be used in the…' WHERE id = 123;
UPDATE page SET seo_description = 'What is a proxy service? A proxy is a supplementary gateway system that enables communication between a computer on the internet and other computers…' WHERE id = 158;
UPDATE page SET seo_description = 'What should you do if your Proxy account is blocked? 1. You must absolutely run a virus scan on all devices (phone, tablet, computer) where you use your…' WHERE id = 189;
UPDATE page SET seo_description = 'Dear Academic and Administrative Staff of Our University Licences valid until 29 June 2019 for SAS 9.4 have been procured. Our users will be able to…' WHERE id = 165;
UPDATE page SET seo_description = 'Virus Computer viruses are pieces of programs generally written to damage a computer, make its operation difficult, or prevent the user from working…' WHERE id = 119;
UPDATE page SET seo_description = 'As Hacettepe University Department of Information Technology, in order to establish, operate, and continuously improve a management system in accordance…' WHERE id = 92;
UPDATE page SET seo_description = 'System and Network Unit End-User Support Unit Web Design Unit Electronic-Signature Control Unit Information Unit for Personnel and Accounting Services' WHERE id = 67;
UPDATE page SET seo_description = 'Method of Application Requirements for User Code Supervisors Activation of User Code New Password Request Alias (Virtual) E-mail Service Technical…' WHERE id = 190;
UPDATE page SET seo_description = 'HACETTEPE UNIVERSITY SOFTWARE SERVER The Hacettepe University Software Repository System was established in 2006 to distribute software packages and…' WHERE id = 138;
UPDATE page SET seo_description = 'Spam Almost every e-mail user encounters many unwanted promotional e-mails in their mailbox every day. In the internet world, all such messages sent…' WHERE id = 191;
UPDATE page SET seo_description = 'Dear Students of Our University, We are pleased to announce that IBM SPSS software — covering statistical analysis, data and text mining, predictive…' WHERE id = 192;
UPDATE page SET seo_description = 'The computer network (HUNET), which is located within the campuses of Hacettepe University and established and managed by the Department of Information…' WHERE id = 193;
UPDATE page SET seo_description = 'The 50th-anniversary logos added to the Hacettepe University logo to mark the 50th anniversary of the University''s founding are being removed from web…' WHERE id = 167;
UPDATE page SET seo_description = 'Written by: Barış AKÇAY, Deputy Head of the Department of Information Technology, 07.2006 Since the subject is highly detailed and each sub-heading…' WHERE id = 194;
UPDATE page SET seo_description = 'Dear User, There has been a change in our VPN application. You can access our new application by logging into https://vpn.hacettepe.edu.tr in your browser…' WHERE id = 135;
UPDATE page SET seo_description = 'The directive covering the principles of preparation and publication of Hacettepe University Unit and Personal Web pages was approved by the Hacettepe…' WHERE id = 137;
UPDATE page SET seo_description = 'Hacettepe University Main Web Site The Department of Information Technology is responsible for Hacettepe University''s main Web site at…' WHERE id = 136;
UPDATE page SET seo_description = 'Email Login (Microsoft Exchange) (Staff - Student Login) Alumni Email Login HU Department of Information Technology Portal' WHERE id = 115;
UPDATE page SET seo_description = 'The wireless network infrastructure established in Sıhhiye and Beytepe campuses, dormitories area and open areas within the campus serves with eduroam and…' WHERE id = 195;
UPDATE page SET seo_description = '1. Taahhüt Beyanı Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı olarak, dijital hizmetlerimizi engelli bireyler dahil tüm kullanıcılar için…' WHERE id = 22;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Elektronik Posta Sistemlerinde kullanıcılarımızın daha verimli ve etkili bir şekilde iletişim kurmasına yardımcı olmak amacıyla…' WHERE id = 39;
UPDATE page SET seo_description = 'Üniversitemizin Değerli Akademik Personeli / Öğrencileri, Bilgisayar destekli olarak mühendislik çalışmalarında analiz ve simülasyonların yapılabildiği…' WHERE id = 2;
UPDATE page SET seo_description = 'Sözleşmeli Bilişim Personeli Alımı Sınav Sonuçları (20.01.2023) Sözleşmeli Bilişim Personeli Alımı İle İlgili Yazılı Sınav Sonuçları ve Sözlü Sınav…' WHERE id = 3;
UPDATE page SET seo_description = 'Bilgi İşlem Daire Başkanlığı tarafından hazırlanan ve web sayfalarınızın içeriğini yönetebileceğiniz İçerik Yönetim Sistemi (HÜ-İYS) hizmete girmiştir. Bu…' WHERE id = 28;
UPDATE page SET seo_description = 'Kalite Komisyonu Mustafa Gökhan Güzel Daire Başkan V. Başkan Görkem Çoruh Daire Başkan Y. Üye Ahum Barbaros Programcı Üye Nazlı Özlem Onat Öğretim…' WHERE id = 36;
UPDATE page SET seo_description = 'Kullanıcılar zaman zaman Internet üzerinden bağlantı kurmak istedikleri yerlere bağlanamamakta ya da olağandan daha yavaş hızlarda bağlanabilmektedirler…' WHERE id = 4;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı 06800 Beytepe / ANKARA Tel: +90 312 297 62 00 Faks: +90 312 299 20 88 E-Posta: bidb@hacettepe.edu.tr…' WHERE id = 33;
UPDATE page SET seo_description = 'Bu sayfadan 193.140.239.9 ip li sunucu üzerindeki veri tabanı bilgilerinizi kontrol edebilirsiniz. Veritabanı Adı: (dbname) Veritabanı Kulanıcı Adı…' WHERE id = 10;
UPDATE page SET seo_description = 'Bu site üçüncü sahıslar tarafından kontrol edilen İnternet sitelerine bağlantılar sağlamaktadır. Bu üçüncü şahıs sitelerindeki bilgiler, ürünler ve…' WHERE id = 52;
UPDATE page SET seo_description = 'Aşağıda kullanıcılarımız için yararlı olabileceğini düşündüğümüz bazı dış adreslere bağlantılar bulunmaktadır. Bu bağlantıların sürekliliği, geçerliliği…' WHERE id = 11;
UPDATE page SET seo_description = 'VPN Kurulumu Kılavuzu SPAM ve PHISHING Hakkında Virüsler ve Güvenlik Önerileri Bilgisayar Kazaları için Önlemler HÜ Internet Bağlantısı Hakkında Proxy…' WHERE id = 6;
UPDATE page SET seo_description = '1. Sürekli açık olan uygulamalar ftpcc, hacettepetv, hacettepetv1, newscc, yunus, yurt_portal, web-browsing, smtp, imap, pop3, ssl, ssh, dns, hotmail…' WHERE id = 30;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Bilgi İşlem Dairesi üniversitede bulunan yurt ve özel öğrenci evlerine de Internet hizmeti vermektedir. Öğrenciler kendi kişisel…' WHERE id = 42;
UPDATE page SET seo_description = 'E-Posta Giriş Yeni E-Posta Açma Kullanıcı Adımı Unuttum Şifremi Unuttum Şifre Güncelleme Bilgi Güncelleme Telefon No Güncelleme Proxy-Spam Kontrol…' WHERE id = 18;
UPDATE page SET seo_description = 'Kişisel e-posta Hesabı Almak için: Yeni kayıt yaptıran ön lisans, lisans öğrencilerimiz için; Kayıt yaptırdıkları tarihten sonra Bilgi İşlem Daire…' WHERE id = 20;
UPDATE page SET seo_description = 'Eski E-Posta Outlook Yedek Alma Eski E-Posta Outlook Yedekten Geri Yükleme' WHERE id = 24;
UPDATE page SET seo_description = 'Kurulum Ayarları Mail Arayüzü Üzerinden Giriş Outlook Mail Hesabı Ayarları Android Cihazlarda Outlook Mail Hesabı Ayarları Android Mail Hesabı Ayarları…' WHERE id = 21;
UPDATE page SET seo_description = 'Firewall Üzerinde Tanımlı Kurallar Hacettepe Üniversitesi bilişim kaynaklarının kullanımını daha etkin ve verimli kılabilmek amacıyla üniversitemiz ana…' WHERE id = 23;
UPDATE page SET seo_description = 'E-POSTA HİZMETİ Üniversite mensubuyum elektronik posta hesabı nasıl alabilirim? Detaylı bilgi için tıklayınız Bölüm/ anabilim dalı / fakülte / sempozyum /…' WHERE id = 55;
UPDATE page SET seo_description = 'E-Posta Engel Kaldırma Formu E-Posta İptal Formu E-Posta Talep Formu (Kurumsal) E-Posta Güncelleme Formu (Kurumsal) E-Posta Talep Formu (Diğer) Misafir…' WHERE id = 25;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Bilgi İşlem Dairesi’nin başta ağ cihazları ve fiber kablolama olmak üzere bilişim hizmetleri alanında hizmet vermeye yönelik alt…' WHERE id = 12;
UPDATE page SET seo_description = '1. Tanımlar Bilişim Kaynağı: Hacettepe Üniversitesi kampüsleri dahilinde bulunan ve BİD''nin kurup yönettiği bilgisayar ağı (HUNET), bağlı olduğu tüm iç ve…' WHERE id = 29;
UPDATE page SET seo_description = 'Bilgi Güvenliği Politikası Bilgi Sistemleri Kabul Edilebilir Kullanım Politikası Parola Politikası Temiz Masa ve Temiz Ekran Politikası' WHERE id = 5;
UPDATE page SET seo_description = 'Bilgisayara Zarar Verebilecek Unsurlar Bilgisayarı gerek donanım gerekse içinde bulunan veriler açısından tehdit eden etkenler şunlar olabilir: Donanımda…' WHERE id = 9;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Bilgi İşlem Dairesi Sıhhiye Yerleşkesinde 75 adet ve Beytepe Yerleşkesinde 24 saat esasına göre hizmet veren 260 adet bilgisayardan…' WHERE id = 45;
UPDATE page SET seo_description = '"GENEL" Duyuru Listesi Kullanıcıların sıklıkla kullandığı liste "GENEL DUYURU LİSTESİ"dir. "Genel" duyuru listesini kullanarak mesaj göndermek isteyen…' WHERE id = 47;
UPDATE page SET seo_description = 'Üniversitemizin Değerli Öğrencileri, Numerik hesaplamaları, ileri düzey grafikleri ve görüntülemeyi, ve üst düzey programlama dilini birleştiren, entegre…' WHERE id = 38;
UPDATE page SET seo_description = 'Misyonumuz teknolojiyi yakından izleyerek üniversitemizin bilgi işlem sistemini işletmek; eğitim, öğretim ve araştırmalara destek sağlamak…' WHERE id = 40;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi iki ana yerleşkeye sahiptir: Beytepe ve Sıhhiye Yerleşkeleri. Sıhhiye Yerleşkesi şehir merkezinde bulunmakta ve çoğunlukla sağlık…' WHERE id = 1;
UPDATE page SET seo_description = 'Kişisel web sayfaları için ev dizini açılım kontrolü (FTP) Kişisel web sayfaları için sunucuya ev dizini açılımı sunucuya FTP ile bağlandıklarında…' WHERE id = 16;
UPDATE page SET seo_description = 'Değerli Hacettepeliler, Uzaktan eğitim sürecinde öğretim üyelerimiz ve öğrencilerimizin yazılımlara daha rahat ulaşabilmeleri için önemli bir duyuruyu…' WHERE id = 13;
UPDATE page SET seo_description = 'T.C. Cumhurbaşkanlığı, Dijital Dönüşüm Ofisi, 24 Temmuz 2020 tarihli Bilgi ve İletişim Güvenliği Rehberi(…' WHERE id = 14;
UPDATE page SET seo_description = 'HACETTEPE ÜNİVERSİTESİ BİLGİ İŞLEM DAİRE BAŞKANLIĞI SÖZLEŞMELİ BİLİŞİM PERSONELİ DUYURUSU Hacettepe Üniversitesi Bilgi İşlem Dairesi Başkanlığı bünyesinde…' WHERE id = 32;
UPDATE page SET seo_description = 'İŞKUR Gençlik Programı, İş Sağlığı ve Güvenliği Eğitimi İŞKUR Gençlik Programı kapsamında programa katılmaya hak kazanan öğrencilerimizin 5 Mart 2025 günü…' WHERE id = 15;
UPDATE page SET seo_description = 'HACETTEPE ÜNİVERSİTESİ BİLGİ İŞLEM DAİRE BAŞKANLIĞI SÖZLEŞMELİ BİLİŞİM PERSONELİ SINAV DUYURUSU Hacettepe Üniversitesi Bilgi İşlem Dairesi Başkanlığı…' WHERE id = 31;
UPDATE page SET seo_description = 'MİCROSOFT OFFİCE 365 KULLANMA MİCROSOFT TEAMS KURULUM KILAVUZU MİCROSOFT TEAMS KULLANIM KILAVUZU' WHERE id = 41;
UPDATE page SET seo_description = 'Mustafa Gökhan GÜZEL Daire Başkanı gokhan{at}hacettepe.edu.tr Esin ALAN Başkanlık Sekreteri esin.alan{at}hacettepe.edu.tr Daire Başkanı İdari ve Mali…' WHERE id = 63;
UPDATE page SET seo_description = 'Ağ Birimi (Beytepe): Yerel ağın kurulumu, mevcut ağın yönetimi, denetimini yapar ve ağın geleceği ile ilgili projeleri üretir, kullanıcılara internet…' WHERE id = 26;
UPDATE page SET seo_description = 'FTP Bağlantı Ayarları Genel Bilgiler MYSQL Kullanımı Veritabanı Kontrol Sayfası Kota FTP Bağlantı Ayarları: FTP programında kullanılacak bağlantı…' WHERE id = 35;
UPDATE page SET seo_description = 'Proxy hizmeti nedir? Proxy, internet üzerindeki bir bilgisayar ile internete bağlı diğer bilgisayarlar arasındaki iletişimi sağlayan yardımcı bir geçiş…' WHERE id = 48;
UPDATE page SET seo_description = 'Proxy hesabınız engellenirse ne yapmalısınız? 1. Elektronik posta hesabınızı kullandığınız tüm cihazları (telefon, tablet, bilgisayar) mutlaka virüs…' WHERE id = 49;
UPDATE page SET seo_description = 'Üniversitemizin Değerli Akademik ve İdari Personeli SAS 9.4 için 29 Haziran 2019 tarihine kadar geçerli olan lisanslar temin edilmiştir. Kullanıcılarımız…' WHERE id = 50;
UPDATE page SET seo_description = 'Virüs Bilgisayar virüsleri, genellikle bilgisayara zarar vermek, çalışmasını zorlaştırmak ya da kullanıcının çalışmasına engel olmak amacıyla yazılmış…' WHERE id = 27;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Bilgi İşlem Dairesi Başkanlığı olarak ISO 27001 Bilgi Güvenliği Yönetim Sistemi Standardına uygun bir yönetim sistemi kurmak…' WHERE id = 7;
UPDATE page SET seo_description = 'Başvuru Şekli Kullanıcı Kodu Sorumlularının Sahip Olması Gereken Özellikler Kullanıcı Kodunun Açılması Yeni Şifre Talebi Alias (Sanal) E-posta Hizmeti…' WHERE id = 51;
UPDATE page SET seo_description = 'HACETTEPE ÜNİVERSİTESİ YAZILIM SUNUCUSU Hacettepe Üniversitesi Yazılım Deposu Sistemi, üniversite çalışanlarının ve öğrencilerinin kullanımı için temin…' WHERE id = 62;
UPDATE page SET seo_description = 'Spam Hemen hemen her e-posta kullanıcısı her gün posta kutusunda istemediği bir çok reklam vs. amaçlı e-posta ile karşılaşmaktadır. Internet dünyasında…' WHERE id = 53;
UPDATE page SET seo_description = 'Üniversitemizin Değerli Öğrencileri, İstatistiksel analiz, veri ve metin madenciliği, tahmine dayalı modelleme, karar optimizasyonu, işbirliği ve devreye…' WHERE id = 54;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi kampüsleri dahilinde bulunan ve BİD''nin kurup yönettiği bilgisayar ağı (HUNET); öğrencilerine ve tüm çalışanlarına hizmet…' WHERE id = 8;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi''nin kuruluşunun 50.yılı nedeniyle Hacettepe Üniversitesi logosuna eklenen 50.yıl logoları 50.yılın sona ermesi nedeniyle web…' WHERE id = 56;
UPDATE page SET seo_description = 'Yazan: Barış AKÇAY, HÜ BİD Bşk.Yrd., 07.2006 Konunun son derece detaylı olması ve her bir alt başlığın uzun açıklamalar gerektirmesi dolayısıyla, burada…' WHERE id = 58;
UPDATE page SET seo_description = 'Sayın Kullanıcımız; VPN uygulamamızda değişiklik olmuştur. Yeni uygulamamıza tarayıcınızda https://vpn.hacettepe.edu.tr adresine Hacettepe E-posta…' WHERE id = 59;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Birim ve Kişisel Web sayfalarının hazırlanması ve yayımlanması ilkelerini kapsayan yönerge 02.07.2007 tarihinde Hacettepe…' WHERE id = 61;
UPDATE page SET seo_description = 'Hacettepe Üniversitesi Ana Web Sitesi Hacettepe Üniversitesi''nin ana Web sitesi www.hacettepe.edu.tr adresinden Bilgi İşlem Dairesi sorumludur. Daire…' WHERE id = 60;
UPDATE page SET seo_description = 'E-Posta Girişi (Microsoft Exchange) (Personel - Öğrenci Girişi) Mezun E-Posta Giriş HÜ Bilgi İşlem Daire Başkanlığı Portalı' WHERE id = 17;
UPDATE page SET seo_description = 'Sıhhiye ve Beytepe yerleşkelerinde, yurtlar bölgesi ve yerleşke içindeki açık alanlarda kurulan kablosuz ağ altyapısı eduroam ve Hacettepe yayınlarıyla…' WHERE id = 34;
