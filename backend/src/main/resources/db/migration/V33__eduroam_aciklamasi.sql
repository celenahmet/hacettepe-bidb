UPDATE page
SET content_html = '<div class="icerik">
<p>Sıhhiye ve Beytepe yerleşkelerinde, yurtlar bölgesi ve yerleşke içindeki açık alanlarda kurulan kablosuz ağ altyapısı eduroam ve Hacettepe yayınlarıyla hizmet vermektedir.</p>
<p><strong>eduroam nedir?</strong> <a href="https://eduroam.org/what-is-eduroam/" target="_blank" rel="noopener noreferrer">eduroam</a> (education roaming), uluslararası araştırma ve eğitim topluluğu için geliştirilen güvenli ve dünya çapında bir kablosuz ağ dolaşım hizmetidir. Katılımcı kurumların öğrencileri, araştırmacıları ve personeli; kendi kurumlarınca sağlanan hesap bilgileriyle eduroam bulunan yerleşkelerde yeniden hesap oluşturmadan internete bağlanabilir.</p>
<p>Hacettepe Üniversitesi için güncel bağlantı ayarlarına <a href="https://eduroam.hacettepe.edu.tr" target="_blank" rel="noopener noreferrer">eduroam.hacettepe.edu.tr</a> adresinden ulaşabilirsiniz.</p>
</div>',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'wireless'
  AND language = 'tr';
