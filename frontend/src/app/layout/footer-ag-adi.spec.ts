import { AG_ADLARI, agAdi } from './footer.component';

/**
 * Sosyal ağ bağlantılarının ekranda görünen adı.
 *
 * NEDEN BU TEST VAR
 *
 * Bu ad iki yerde kullanıcıya ulaşıyor: bağlantının aria-label'ı (ekran
 * okuyucu sesli okur) ve title'ı (fare üstüne gelince görünür). Ağ adı
 * veritabanında küçük harfle duruyor ve önce yalnızca "baş harfini
 * büyüt" kuralıyla gösteriliyordu. Kural iki markada yanlıştı:
 * "Linkedin" ve "Youtube". İkisi de markanın kendi yazımı değil.
 *
 * Yazım hatasının hiçbir yerde uyarısı yoktu; ancak ekrana bakan biri
 * fark edebilirdi.
 */
describe('agAdi', () => {

  it('marka adları kendi yazımlarıyla döner', () => {
    expect(agAdi('linkedin')).toBe('LinkedIn');
    expect(agAdi('youtube')).toBe('YouTube');
    expect(agAdi('instagram')).toBe('Instagram');
    expect(agAdi('facebook')).toBe('Facebook');
  });

  it('twitter, markanın yeni adıyla gösterilir', () => {
    // Kurum hesabı x.com adresinde; "Twitter" yazmak eskimiş olurdu.
    expect(agAdi('twitter')).toBe('X');
  });

  it('hiçbir marka adı yalnızca baş harf büyütülerek üretilmez', () => {
    /* Asıl denetim: sözlükteki her ad, saf "baş harfi büyüt" kuralının
       ürettiğinden FARKLI ya da ona eşit olabilir — ama LinkedIn ve
       YouTube için eşit OLMAMALIDIR. Kural tek başına yeterli olsaydı
       sözlüğe gerek kalmazdı. */
    const safKural = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    expect(AG_ADLARI['linkedin']).not.toBe(safKural('linkedin'));
    expect(AG_ADLARI['youtube']).not.toBe(safKural('youtube'));
    expect(AG_ADLARI['twitter']).not.toBe(safKural('twitter'));
  });

  it('sözlükte olmayan ağ adsız kalmaz', () => {
    /* Panelden yeni bir ağ eklendiğinde bağlantının erişilebilir adı
       boş kalmamalı; WCAG 2.4.4 bağlantının amacını ister. */
    expect(agAdi('mastodon')).toBe('Mastodon');
    expect(agAdi('bluesky')).toBe('Bluesky');
  });

  it('boş ya da tek harflik değerde çökmez', () => {
    expect(agAdi('')).toBe('');
    expect(agAdi('x')).toBe('X');
  });

  it('sözlükteki hiçbir ad boş değildir', () => {
    for (const [ag, ad] of Object.entries(AG_ADLARI)) {
      expect(ad).withContext(`${ag} için ad boş`).toBeTruthy();
      expect(ad.trim()).withContext(`${ag} adında kenar boşluğu var`).toBe(ad);
    }
  });
});
