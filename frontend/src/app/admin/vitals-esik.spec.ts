import { SOZLUK } from './admin-dil.service';
import { metrikDegeri, vitalAraliklar, VitalOlcum } from './vitals-esik';

/**
 * Ölçüm biçimlendirmesi ve "Optimum beklenti" aralıkları.
 *
 * NEDEN BU TEST VAR
 *
 * İki ayrı sessiz kusur sınıfı var:
 *
 * 1. Sayı biçimi. Türkçe panelde ondalık ayracı virgül olmalı. Yanlış
 *    ayraç hiçbir hata üretmez, yalnızca kurumsal bir panelde yanlış
 *    yazılmış bir sayı durur.
 *
 * 2. Aralık ile rozetin çelişmesi. Ekranda "Zayıf" rozeti dururken
 *    vurgulu satırın "İyi" olması mümkün olsaydı, panel kullanıcıya
 *    yanlış bilgi verirdi ve hiçbir yerde hata görünmezdi.
 */
describe('vitals-esik', () => {

  /** Gerçek sözlükle çevirir; sınama kendi metnini uydurmaz. */
  const t = (dil: 'tr' | 'en') => (anahtar: string) => SOZLUK[anahtar]?.[dil] ?? anahtar;

  describe('metrikDegeri', () => {

    it('Türkçede ondalık ayracı virgüldür', () => {
      expect(metrikDegeri('CLS', 0.328, 'tr')).toBe('0,328');
      expect(metrikDegeri('CLS', 0.1, 'tr')).toBe('0,100');
    });

    it('İngilizcede ondalık ayracı noktadır', () => {
      expect(metrikDegeri('CLS', 0.328, 'en')).toBe('0.328');
      expect(metrikDegeri('CLS', 0.1, 'en')).toBe('0.100');
    });

    it('CLS her zaman üç basamak gösterir', () => {
      // 0,1 ile 0,100 aynı sayıdır ama eşikle karşılaştırırken
      // basamak sayısının sabit olması okumayı kolaylaştırır.
      expect(metrikDegeri('CLS', 0.25, 'tr')).toBe('0,250');
      expect(metrikDegeri('CLS', 0, 'tr')).toBe('0,000');
    });

    it('süre metrikleri tam sayıya yuvarlanır ve birimiyle yazılır', () => {
      expect(metrikDegeri('LCP', 1019.4, 'tr')).toBe('1.019 ms');
      expect(metrikDegeri('TTFB', 402.20000000000005, 'tr')).toBe('402 ms');
      expect(metrikDegeri('INP', 72, 'en')).toBe('72 ms');
    });

    it('binlik ayracı da dile göre değişir', () => {
      expect(metrikDegeri('LCP', 2500, 'tr')).toBe('2.500 ms');
      expect(metrikDegeri('LCP', 2500, 'en')).toBe('2,500 ms');
    });

    it('CLS milisaniye olarak yazılmaz', () => {
      /* CLS birimsiz bir orandır. "0,328 ms" yazması ölçüyü yanlış
         tanıtırdı ve eşikle karşılaştırmayı anlamsız kılardı. */
      expect(metrikDegeri('CLS', 0.328, 'tr')).not.toContain('ms');
      expect(metrikDegeri('LCP', 0.328, 'tr')).toContain('ms');
    });
  });

  describe('vitalAraliklar', () => {

    const kayit = (rating: string): VitalOlcum =>
      ({ metric: 'CLS', good: 0.1, poor: 0.25, rating });

    it('her zaman üç aralık döner', () => {
      const a = vitalAraliklar(kayit('good'), 'tr', t('tr'));
      expect(a.length).toBe(3);
      expect(a.map((x) => x.derece)).toEqual(['good', 'needs-improvement', 'poor']);
    });

    it('yalnızca ölçümün düştüğü aralık vurgulanır', () => {
      for (const derece of ['good', 'needs-improvement', 'poor']) {
        const a = vitalAraliklar(kayit(derece), 'tr', t('tr'));
        const vurgulu = a.filter((x) => x.etkin);
        expect(vurgulu.length).withContext(`${derece}: vurgulu satır sayısı`).toBe(1);
        expect(vurgulu[0].derece).withContext(`${derece}: yanlış satır vurgulandı`).toBe(derece as any);
      }
    });

    it('bilinmeyen bir derece hiçbir satırı vurgulamaz', () => {
      /* Sunucu bir gün başka bir değer dönerse, YANLIŞ bir satırı
         vurgulamaktansa hiçbirini vurgulamamak doğrudur. */
      const a = vitalAraliklar(kayit('bilinmeyen'), 'tr', t('tr'));
      expect(a.filter((x) => x.etkin).length).toBe(0);
    });

    it('sınırlar kayıttan okunur, içeri gömülmez', () => {
      // Uydurma eşiklerle çağrılır: çıktıda o sayılar görünmelidir.
      const a = vitalAraliklar(
        { metric: 'LCP', good: 1234, poor: 5678, rating: 'poor' }, 'tr', t('tr'));
      expect(a[0].aralik).toContain('1.234 ms');
      expect(a[1].aralik).toContain('1.234 ms');
      expect(a[1].aralik).toContain('5.678 ms');
      expect(a[2].aralik).toContain('5.678 ms');
    });

    it('iyileştirilmeli aralığı iki sınırı da gösterir', () => {
      const a = vitalAraliklar(kayit('needs-improvement'), 'tr', t('tr'));
      expect(a[1].aralik).toBe('0,100 – 0,250');
    });

    it('etiketler sözlükten gelir ve dile göre değişir', () => {
      const tr = vitalAraliklar(kayit('good'), 'tr', t('tr'));
      const en = vitalAraliklar(kayit('good'), 'en', t('en'));

      expect(tr.map((x) => x.etiket))
        .toEqual([SOZLUK['kaliteIyi'].tr, SOZLUK['kaliteGelistirilmeli'].tr, SOZLUK['kaliteZayif'].tr]);
      expect(en.map((x) => x.etiket))
        .toEqual([SOZLUK['kaliteIyi'].en, SOZLUK['kaliteGelistirilmeli'].en, SOZLUK['kaliteZayif'].en]);
    });

    it('aralık metinleri de dile göre değişir', () => {
      const tr = vitalAraliklar(kayit('good'), 'tr', t('tr'));
      const en = vitalAraliklar(kayit('good'), 'en', t('en'));

      expect(tr[0].aralik).toBe(`0,100 ${SOZLUK['kaliteVeAlti'].tr}`);
      expect(en[0].aralik).toBe(`0.100 ${SOZLUK['kaliteVeAlti'].en}`);
      expect(tr[2].aralik).toBe(`0,250 ${SOZLUK['kaliteUstu'].tr}`);
      expect(en[2].aralik).toBe(`0.250 ${SOZLUK['kaliteUstu'].en}`);
    });

    it('İngilizce çıktıda Türkçeye özgü harf kalmaz', () => {
      const en = vitalAraliklar(kayit('poor'), 'en', t('en'));
      const metin = en.map((x) => `${x.etiket} ${x.aralik}`).join(' ');
      expect(metin).not.toMatch(/[çğıöşüÇĞİÖŞÜ]/);
    });

    it('aralıklar birbirini kapsamaz: iyi sınırı zayıf sınırından küçüktür', () => {
      const olcum = { metric: 'LCP', good: 2500, poor: 4000, rating: 'good' };
      expect(olcum.good).toBeLessThan(olcum.poor);
      const a = vitalAraliklar(olcum, 'tr', t('tr'));
      // İyi satırı iyi sınırını, zayıf satırı zayıf sınırını göstermeli
      expect(a[0].aralik.startsWith('2.500')).toBeTrue();
      expect(a[2].aralik.startsWith('4.000')).toBeTrue();
    });
  });
});
