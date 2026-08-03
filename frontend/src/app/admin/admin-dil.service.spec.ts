import { AdminDilServisi, SOZLUK } from './admin-dil.service';

/**
 * Yönetim paneli çeviri sözlüğü.
 *
 * NEDEN BU TEST VAR
 *
 * Panelin İngilizceye çevrilmesi bir kerelik iş değil: her yeni bölüm,
 * her yeni etiket sözlüğe bir satır ekler ve eklemeyi unutmak hiçbir
 * hata üretmez. Panel çalışır, düğme görünür — yalnızca İngilizce
 * panelde Türkçe kalır.
 *
 * Bu tam olarak yaşandı: ölçüm ayrıntı penceresinin metinleri şablona
 * sabit Türkçe yazılmıştı. Pencere yalnızca karta tıklanınca açıldığı
 * için tarayıcı üstünde çalışan dil denetim aracı onu hiç görmedi ve
 * panel "temiz" raporlandı. Sözlüğün kendisini dolaşan bir test,
 * ekranda görünme koşuluna bağlı değildir.
 */
describe('AdminDilServisi', () => {

  const anahtarlar = Object.keys(SOZLUK);

  it('sözlük boş değil', () => {
    expect(anahtarlar.length).toBeGreaterThan(100);
  });

  it('her anahtarın Türkçe karşılığı dolu', () => {
    const eksik = anahtarlar.filter((a) => !SOZLUK[a].tr || !SOZLUK[a].tr.trim());
    expect(eksik).withContext(`Türkçesi boş anahtarlar: ${eksik.join(', ')}`).toEqual([]);
  });

  it('her anahtarın İngilizce karşılığı dolu', () => {
    const eksik = anahtarlar.filter((a) => !SOZLUK[a].en || !SOZLUK[a].en.trim());
    expect(eksik).withContext(`İngilizcesi boş anahtarlar: ${eksik.join(', ')}`).toEqual([]);
  });

  it('İngilizce karşılıklar Türkçeye özgü harf içermez', () => {
    /* Türkçeye özgü harf, çevirinin yapılmadığının kanıtıdır. Bu denetim
       EKSİK BULUR ama YANLIŞ BULMAZ: "Kaydet" gibi bu harfleri içermeyen
       bir Türkçe metni kaçırır. Sıfır bulgu tek başına yeterli değildir. */
    const TR_HARF = /[çğıöşüÇĞİÖŞÜ]/;
    const cevrilmemis = anahtarlar
      .filter((a) => TR_HARF.test(SOZLUK[a].en))
      .map((a) => `${a} = "${SOZLUK[a].en}"`);
    expect(cevrilmemis)
      .withContext(`İngilizce alanında Türkçe metin kalmış:\n  ${cevrilmemis.join('\n  ')}`)
      .toEqual([]);
  });

  it('İngilizce karşılık Türkçesinin birebir kopyası değil', () => {
    /* Kısaltmalar, kurum adları ve iki dilde de aynı yazılan sözcükler
       dışında, aynı olan bir satır "çevirmeyi unutup Türkçeyi
       kopyalamanın" izidir.

       Listeye eklenen her istisna BİLİNÇLİ olmalıdır; bu yüzden her biri
       değeriyle birlikte yazılır. Listeyi "aynı olanları geçir" diye
       genişletmek testi anlamsız kılar. */
    const AYNI_OLABILIR = new Set([
      'SEO', 'URL', 'BİDB', 'Hacettepe',
      'Slider',  // arayüz terimi olarak iki dilde de "Slider"
      'Normal'   // öncelik derecesi; İngilizcede de "Normal"
    ]);
    const kopya = anahtarlar.filter((a) => {
      const { tr, en } = SOZLUK[a];
      if (tr !== en) return false;
      return !AYNI_OLABILIR.has(tr);
    });
    expect(kopya)
      .withContext(`İki dilde birebir aynı: ${kopya.join(', ')}`)
      .toEqual([]);
  });

  it('metinler baş ve sondaki boşluklardan arınmış', () => {
    // Görünmez boşluk, düğme genişliğini ve hizalamayı sessizce bozar.
    const bosluklu = anahtarlar.filter(
      (a) => SOZLUK[a].tr !== SOZLUK[a].tr.trim() || SOZLUK[a].en !== SOZLUK[a].en.trim()
    );
    expect(bosluklu).withContext(`Kenarında boşluk olan: ${bosluklu.join(', ')}`).toEqual([]);
  });

  describe('t()', () => {
    let servis: AdminDilServisi;

    beforeEach(() => {
      localStorage.removeItem('bidb-yonetim-dil');
      servis = new AdminDilServisi();
    });

    it('varsayılan dil Türkçedir', () => {
      expect(servis.dil()).toBe('tr');
    });

    it('dil değişince metin de değişir', () => {
      const ornek = 'kaydet';
      expect(SOZLUK[ornek]).withContext('sınama anahtarı sözlükte yok').toBeDefined();

      expect(servis.t(ornek)).toBe(SOZLUK[ornek].tr);
      servis.degistir('en');
      expect(servis.t(ornek)).toBe(SOZLUK[ornek].en);
      servis.degistir('tr');
      expect(servis.t(ornek)).toBe(SOZLUK[ornek].tr);
    });

    it('bilinmeyen anahtar için anahtarın kendisi döner', () => {
      /* Belgelenmiş davranış: eksik çeviri sessizce boş bırakılmaz,
         ekranda anahtar adı görünür ve gözden kaçmaz. */
      expect(servis.t('boyleBirAnahtarYok')).toBe('boyleBirAnahtarYok');
      expect(servis.t('')).toBe('');
    });

    it('seçilen dil tarayıcıda saklanır', () => {
      servis.degistir('en');
      expect(localStorage.getItem('bidb-yonetim-dil')).toBe('en');
      expect(new AdminDilServisi().dil()).toBe('en');
      servis.degistir('tr');
    });
  });
});
