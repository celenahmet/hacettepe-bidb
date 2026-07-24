# Çeviri Sözlüğü — TR → EN (UK Academic English)

Bu belge, İngilizce çeviri çalışmasında **kilitli** terimleri listeler.
Burada olmayan bir terim çevrilirken önce bu listeye eklenmeli, sonra
kullanılmalıdır — aksi hâlde 65 sayfa boyunca aynı kavram farklı
biçimlerde çevrilir ve akredite bir kurum için kabul edilemez bir
tutarsızlık oluşur.

**Kural:** Bir terimin İngilizcesi burada varsa, başka bir çeviri
denenmez. Yeni bir terimle karşılaşan herkes (insan ya da ajan) önce
buraya bakar, sonra ekler.

**Kaynak zaten koddaki metinlerle uyumlu tutuldu** — `header.component.ts`
/ `footer.component.ts` içindeki sabit `language === 'en' ? '…' : '…'`
metinleri değiştirilmedi, bu sözlük onlarla çelişmez.

---

## 1. Kurum ve marka adları

| Türkçe | İngilizce | Not |
|---|---|---|
| Hacettepe Üniversitesi | Hacettepe University | Sabit, koddan geliyor |
| Bilgi İşlem Daire Başkanlığı | Department of Information Technology | Sabit, koddan geliyor — başka bir çeviri kullanılmaz |
| BİDB | BİDB | Kısaltma çevrilmez; ilk geçtiği yerde açık adıyla verilir |
| Daire Başkanlığı | the Directorate / the Department | Bağlama göre; kurumun kendisinden bahsederken "the Department" |

## 2. Unvanlar (organizasyon şeması / personel)

| Türkçe | İngilizce | Not |
|---|---|---|
| Daire Başkanı | Director | Mevcut EN içerikte zaten kullanılıyordu, korundu |
| Daire Başkan Vekili | Acting Director | |
| Başkanlık Sekreteri | Secretary to the Director | Eski EN içerik yalnızca "Secretary" kullanmıştı; UK akademik netlik için genişletildi |
| Daire Başkan Yardımcısı (İdari) | Deputy Director (Administrative Affairs) | |
| Daire Başkan Yardımcısı (Teknik) | Deputy Director (Technical Affairs) | |
| Birim Sorumlusu | Unit Supervisor | Personel sayfasında kullanılıyor |
| Öğrenci | Student | |
| Öğrenci Kalite Elçisi | Student Quality Ambassador | Kurul ve Komisyonlar sayfası |
| Üye | Member | |
| Başkan (komisyon) | Chair | Komisyon bağlamında "Director" ile karışmasın diye "Chair" |
| Öğretim Görevlisi | Lecturer | |
| Mühendis | Engineer | |
| Programcı | Programmer | |

## 3. Birim adları

Kaynakta bazı birimler organizasyon şeması ile personel sayfası arasında
**farklı** yazılıyor (örn. "BYS" / "EBYS", "İnsan Kaynakları Destek Birimi"
/ "İnsan Kaynakları Birimi"). İçerik birebir korunduğu için bu fark
İngilizcede de **korunur** — aynı TR farkı, aynı EN farkıyla yansıtılır.

| Türkçe | İngilizce |
|---|---|
| İdari ve Mali İşler Birimi | Administrative and Financial Affairs Unit |
| BYS ve Bireysel İşlemler Birimi | Document Management System (DMS) and Individual Transactions Unit |
| EBYS ve Bireysel İşlemler Birimi | Electronic Document Management System (e-DMS) and Individual Transactions Unit |
| İnsan Kaynakları Destek Birimi | Human Resources Support Unit |
| İnsan Kaynakları Birimi | Human Resources Unit |
| Kullanıcı Destek Birimi | User Support Unit |
| Sistem Yazılımları Birimi | Systems Software Unit |
| Yazılım Geliştirme Birimi | Software Development Unit |
| Ağ Birimi | Network Unit |
| Sistem ve Ağ Birimi | Systems and Network Unit |
| Sistem ve Güvenlik Birimi | Systems and Security Unit |
| Web Birimi | Web Unit |
| Kalite Komisyonu | Quality Commission |

## 4. Yerleşke adları

Özel ad; **çevrilmez**. Açıklık için "Campus" eklenebilir.

| Türkçe | İngilizce |
|---|---|
| Beytepe (Yerleşkesi) | Beytepe Campus |
| Sıhhiye (Yerleşkesi) | Sıhhiye Campus |

## 5. Sistem adları ve kısaltmalar

Kısaltmalar **çevrilmez**; ilk geçtiği yerde parantez içinde açık İngilizce
karşılığı verilir, sonraki geçişlerde kısaltma tek başına kullanılır.

| Kısaltma | Açılımı (TR) | İlk geçişte İngilizce |
|---|---|---|
| HUNET | Hacettepe Üniversitesi Akademik Ağı | Hacettepe University Academic Network (HUNET) |
| HÜ-İYS | İçerik Yönetim Sistemi | Hacettepe University Content Management System (HÜ-CMS) — bağlama göre "HÜ-İYS" özel ad olarak da bırakılabilir |
| EBYS | Elektronik Belge Yönetim Sistemi | Electronic Document Management System (e-DMS) |
| BYS | Belge Yönetim Sistemi | Document Management System (DMS) |
| NES | Nitelikli Elektronik Sertifika | Qualified Electronic Certificate (NES) |
| KAMU SM | Kamu Sertifikasyon Merkezi (TÜBİTAK) | Public Certification Authority (Kamu SM) |
| TÜBİTAK | Türkiye Bilimsel ve Teknolojik Araştırma Kurumu | The Scientific and Technological Research Council of Türkiye (TÜBİTAK) |
| HUYS | Hacettepe Üniversitesi Yönetim Sistemleri | Hacettepe University Management Information Systems (HUYS) |
| BGYS | Bilgi Güvenliği Yönetim Sistemi | Information Security Management System (ISMS) |
| VPN | — | VPN (çevrilmez) |
| FTP | — | FTP (çevrilmez) |
| SSS | Sık Sorulan Sorular | FAQ (Frequently Asked Questions) |
| MYO | Meslek Yüksekokulu | Vocational School |
| KPSS | Kamu Personeli Seçme Sınavı | Public Personnel Selection Examination (KPSS) |
| İŞKUR | Türkiye İş Kurumu | Turkish Employment Agency (İŞKUR) |

## 6. Kanun ve standart başlıkları

**Resmî İngilizce başlıklar kullanılır; serbest çeviri yapılmaz.**

| Türkçe | Resmî/yerleşik İngilizce karşılık |
|---|---|
| 5651 sayılı Kanun (İnternet Ortamında Yapılan Yayınların Düzenlenmesi…) | Law No. 5651 on the Regulation of Publications on the Internet and Combating Crimes Committed by means of Such Publications |
| 5070 sayılı Elektronik İmza Kanunu | Electronic Signature Law No. 5070 |
| 2547 sayılı Yükseköğretim Kanunu | Higher Education Law No. 2547 |
| 124 sayılı KHK (Yükseköğretim Üst Kuruluşları…) | Decree Law No. 124 on the Organisation of Higher Education Supreme Institutions and Higher Education Institutions |
| ISO/IEC 27001 | ISO/IEC 27001 (değişmez) |
| TS ISO/IEC 27001:2013 | TS ISO/IEC 27001:2013 (değişmez) |

## 7. Sık geçen genel ifadeler

| Türkçe | İngilizce |
|---|---|
| Hakkımızda | About Us |
| Genel Tanıtım | Overview |
| Organizasyon Şeması | Organisation Chart |
| Misyon ve Vizyon | Mission and Vision |
| Bilgi Güvenliği Politikası | Information Security Policy |
| Kurul ve Komisyonlar | Committees |
| Personel | Staff |
| İletişim | Contact |
| Sorumluluk Sınırı | Disclaimer |
| Erişilebilirlik Bildirimi | Accessibility Statement |
| Sık Sorulan Sorular | Frequently Asked Questions (FAQ) |
| E-posta İşlemleri | E-mail Services |
| Kablosuz Erişim | Wireless Access |
| Lisanslı Yazılım | Licensed Software |
| Formlar | Forms |
| Duyurular | Announcements |
| Haberler | News |
| yerleşke | campus |
| e-posta | e-mail (UK: iki kelime değil, tire ile — "email" ABD kullanımı, "e-mail" UK akademik yazımda tercih edilir) |
| kullanıcı | user |
| başvuru | application |
| talep | request |
| birim | unit |
| hizmet | service |

---

## Kullanım notu

Bu sözlük büyüdükçe kategoriler halinde tutulur. Yeni bir sayfa
çevrilirken karşılaşılan ve burada olmayan her özel ad / kısaltma /
kurumsal terim, çeviriden **önce** buraya eklenir, sonra sayfa çevrilir.
Böylece 65 sayfa tek bir sözlükten besleniyor, kimse aynı terimi iki
farklı şekilde çevirmiyor.
