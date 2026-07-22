-- Fotoğrafı olmayan personel için varsayılan ikon tercihi doldurulur.
--
-- NASIL BELİRLENDİ: yalnızca Türkçede tereddütsüz tek cinsiyete ait olan
-- adlar işaretlendi. Unisex kullanılan (Görkem, Özgür) ve nadir/ayırt
-- edilemeyen adlar (Ahum, Kaymak, İzgen, Cefakar) BİLEREK boş bırakıldı;
-- onlarda nötr siluet görünür.
--
-- Bu bir tahmindir ve gerçek kişilerle ilgilidir. Yanlış bir işaretleme,
-- kişinin kendisini sayfada yanlış görmesi demektir; bu yüzden şüpheli
-- olan hiçbir ad işaretlenmedi. Alan panelden kişi bazında düzeltilebilir
-- ve dilenirse tamamen boşaltılabilir.
--
-- Fotoğraf yüklenen kişide bu alan hiç kullanılmaz.

UPDATE staff_member SET avatar = 'kadin' WHERE full_name IN (
  'Esin Alan',
  'Merve Ak',
  'Aysun Ardıç',
  'Esma Özge Pöç',
  'Fehime Aydın',
  'Hacer Doğan',
  'Sevgi İpek',
  'Hilal Vural Sicim',
  'Özge Işıl Kulaksız',
  'Özge Taşcı',
  'Saliha Kübra Aydın',
  'Nazlı Özlem Onat',
  'Mehtap Sayılgan Toklu',
  'Gülten Özyurt',
  'Gülay Çitçi'
);

UPDATE staff_member SET avatar = 'erkek' WHERE full_name IN (
  'Mustafa Gökhan Güzel',
  'Ertan Güzelcan',
  'Süleyman Alaş',
  'Emre Gökmen',
  'Sadık Toklu',
  'Erkan Türkyılmaz',
  'Hasan Türker Sözer',
  'Fatih Kekeç',
  'Ramazan Öztürk',
  'Hüseyin Özyurt',
  'Ahmet Emin Baktır',
  'İsmail Hakkı Sönmez',
  'Taha Baş',
  'Çağlar Ünal',
  'Erencan Polat',
  'Abdulkadir Üçme',
  'Şeref Çambaşı',
  'Hasan Avcı',
  'Şahin Kaan Aytaç',
  'Ali Doğan',
  'Sezai Yılmaz',
  'Kadir Akın Ayhan',
  'Ahmet Serdar Öztürk',
  'Ali Özgan',
  'İbrahim Halil Demir',
  'Mehmet Karataş',
  'Mevlüt Ediz',
  'Osman Çetin',
  'Mustafa Kayhan',
  'Mehmet Aslan'
);
