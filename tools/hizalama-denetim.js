/* Kayık dikey eksen denetimi.

   Aynı kapsayıcı içinde birden çok ızgara varsa, sütun ayrım noktalarının
   üst üste gelmesi beklenir. Gelmezse kullanıcı formda/kartlarda kırık bir
   dikey çizgi görür; hiçbir şey bozulmaz, hata da vermez, sadece özensiz
   durur. Bu yüzden gözle fark edilene kadar yaşar.

   Gerçek örnek: iletişim formunda Kategori/Konu ızgarası 1fr/1.35fr,
   altındaki Ad/Soyad ızgarası eşit iki sütundu. Birinci sütunun sağ kenarı
   788px ve 844px'te bitiyordu — 56px'lik görünür bir kayma (dc64dc3).

   Eşik neden 80px?
     0px        hizalı, sorun yok.
     1-80px     "hizalanmaya çalışılmış ama tutmamış" aralığı — kusur.
     80px üstü  bilinçli olarak farklı bir düzen; raporlanmaz.

   Ölçüm tarayıcıda getBoundingClientRect ile yapılır: CSS'i okuyup
   yorumlamak yetmez, gerçek genişlik yazı tipine ve içeriğe de bağlı.

   Gereksinim: çalışan site (localhost:4000) ve --remote-debugging-port=9222
   ile açılmış bir Chrome. Tarayıcıya Node'un yerleşik WebSocket'iyle
   doğrudan bağlanılır; diğer denetim araçları gibi bu da bağımlılıksızdır.

   Kullanım:  node tools/hizalama-denetim.js
              node tools/hizalama-denetim.js --kanit     (aracı doğrular)   */

const KOK = process.env.BIDB_KOK || "http://localhost:4000";
const CDP_KOK = process.env.BIDB_CDP || "http://localhost:9222";
const ESIK = 80;
const GENISLIK = 1400;

const YOLLAR = [
  "/tr", "/tr/contact", "/tr/about", "/tr/news", "/tr/staff",
  "/tr/web-services", "/tr/network", "/tr/e-signature", "/tr/proxy",
  "/tr/wireless", "/tr/management", "/en"
];

/* Tarayıcıda çalışacak ölçüm. Tek satırlık bir ifade olarak gönderilir. */
const OLCUM = `(function () {
  /* Bir ızgaranın İLK SATIRINDAKİ sütun sağ kenarları. Sadece ilk satır
     alınır: sonraki satırlar aynı sütun şablonunu kullandığı için ölçümü
     tekrarlamak bir şey eklemez. */
  function ayrimlar(g) {
    var ch = [].slice.call(g.children).filter(function (e) {
      return e.getBoundingClientRect().width > 0;
    });
    if (ch.length < 2) return null;
    var ilkY = Math.round(ch[0].getBoundingClientRect().top);
    var satir = ch.filter(function (e) {
      return Math.abs(Math.round(e.getBoundingClientRect().top) - ilkY) < 4;
    });
    if (satir.length < 2) return null;
    // Son sütunun sağ kenarı kapsayıcının kenarıdır, ayrım noktası değil
    return satir.slice(0, -1).map(function (e) {
      return Math.round(e.getBoundingClientRect().right);
    });
  }

  var izgaralar = [].slice.call(document.querySelectorAll("*")).filter(function (e) {
    // Dar ızgaralar (rozet, ikon dizisi) sütun ekseni oluşturmaz
    return getComputedStyle(e).display === "grid" && e.getBoundingClientRect().width > 200;
  });

  var gruplar = new Map();
  izgaralar.forEach(function (e) {
    var p = e.parentElement;
    if (!p) return;
    if (!gruplar.has(p)) gruplar.set(p, []);
    gruplar.get(p).push(e);
  });

  var bulgular = [];
  gruplar.forEach(function (liste, p) {
    if (liste.length < 2) return;
    var a = liste.map(ayrimlar);
    for (var i = 0; i < a.length - 1; i++) {
      for (var j = i + 1; j < a.length; j++) {
        // Sütun sayısı farklıysa hizalanmaları zaten beklenmez
        if (!a[i] || !a[j] || a[i].length !== a[j].length) continue;
        var sapma = Math.max.apply(null, a[i].map(function (v, k) {
          return Math.abs(v - a[j][k]);
        }));
        if (sapma > 0 && sapma <= ESIK_YER_TUTUCU) {
          bulgular.push({
            kapsayici: String(p.className || p.tagName).slice(0, 36),
            a: String(liste[i].className || "?").slice(0, 28),
            b: String(liste[j].className || "?").slice(0, 28),
            sapma: sapma
          });
        }
      }
    }
  });
  return bulgular;
})()`;

const ifade = () => OLCUM.replace("ESIK_YER_TUTUCU", String(ESIK));

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

/* En küçük CDP istemcisi.

   Yalnızca komut gönderip yanıt bekler; olaylara abone olunmaz. Sayfanın
   yüklendiği, readyState yoklanarak anlaşılır — böylece olay akışını
   yönetmek gerekmiyor ve araç bağımlılıksız kalıyor. */
class Tarayici {
  static async bagla() {
    let hedefler;
    try {
      hedefler = await (await fetch(CDP_KOK + "/json/list")).json();
    } catch (e) {
      throw new Error("Chrome hata ayıklama portuna ulaşılamadı (" + CDP_KOK + "). " +
        "Chrome'u --remote-debugging-port=9222 ile başlatın.");
    }
    const sayfa = hedefler.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    if (!sayfa) throw new Error("Açık bir sekme bulunamadı.");
    const ws = new WebSocket(sayfa.webSocketDebuggerUrl);
    await new Promise((coz, hata) => {
      ws.addEventListener("open", coz, { once: true });
      ws.addEventListener("error", () => hata(new Error("WebSocket açılamadı")), { once: true });
    });
    return new Tarayici(ws);
  }

  constructor(ws) {
    this.ws = ws;
    this.sira = 0;
    this.bekleyen = new Map();
    ws.addEventListener("message", (olay) => {
      const m = JSON.parse(olay.data);
      if (m.id === undefined) return; // olaylar önemsenmiyor
      const b = this.bekleyen.get(m.id);
      if (!b) return;
      this.bekleyen.delete(m.id);
      m.error ? b.hata(new Error(m.error.message)) : b.coz(m.result);
    });
  }

  gonder(yontem, params = {}) {
    const id = ++this.sira;
    this.ws.send(JSON.stringify({ id, method: yontem, params }));
    return new Promise((coz, hata) => this.bekleyen.set(id, { coz, hata }));
  }

  async oku(ifadeMetni) {
    const y = await this.gonder("Runtime.evaluate", { expression: ifadeMetni, returnByValue: true });
    if (y.exceptionDetails) throw new Error("Sayfada istisna: " + y.exceptionDetails.text);
    return y.result.value;
  }

  kapat() { this.ws.close(); }
}

async function tara(t, yol) {
  await t.gonder("Page.navigate", { url: KOK + yol });
  // Yükleme tamamlansın; sonra aşamalı JS yüklemesi için ek süre tanınır.
  // Erken ölçüm, henüz yerleşmemiş düzende yanlış sonuç verir.
  for (let i = 0; i < 40; i++) {
    await bekle(250);
    if (await t.oku("document.readyState === 'complete'")) break;
  }
  await bekle(2600);
  return (await t.oku(ifade())) || [];
}

(async () => {
  const kanitModu = process.argv.includes("--kanit");
  const t = await Tarayici.bagla();
  await t.gonder("Page.enable");
  await t.gonder("Runtime.enable");
  await t.gonder("Emulation.setDeviceMetricsOverride", {
    width: GENISLIK, height: 1400, deviceScaleFactor: 1, mobile: false
  });

  /* Kanıt modu: bilinen bir kayma enjekte edilir. Araç bunu yakalamıyorsa
     "0 bulgu" sonucu hiçbir şey kanıtlamaz — sessizce hep temiz raporlayan
     bir denetim, denetim yokluğundan daha kötüdür. */
  if (kanitModu) {
    const once = await tara(t, "/tr/contact");
    console.log("enjeksiyon öncesi : " + (once.length ? once.map((x) => x.sapma + "px").join(", ") : "bulgu yok"));
    await t.oku(
      "(function(){var s=document.createElement('style');" +
      "s.textContent='.iletisim-form-izgara:not(.dort){grid-template-columns:minmax(0,1fr) minmax(0,1.35fr) !important;}';" +
      "document.head.appendChild(s); return 1;})()"
    );
    await bekle(600);
    const sonra = await t.oku(ifade());
    console.log("enjeksiyon sonrası: " + (sonra.length ? sonra.map((x) => x.sapma + "px").join(", ") : "BULGU YOK"));
    const calisiyor = sonra.length > 0 && once.length === 0;
    console.log("\n" + (calisiyor ? "Araç çalışıyor: kusuru yakalıyor." : "ARAÇ GÜVENİLMEZ."));
    t.kapat();
    process.exit(calisiyor ? 0 : 1);
  }

  console.log("SAYFA".padEnd(22) + "SONUÇ");
  console.log("-".repeat(60));

  let toplam = 0;
  for (const yol of YOLLAR) {
    const b = await tara(t, yol);
    if (!b.length) {
      console.log(yol.padEnd(22) + "hizalı");
      continue;
    }
    toplam += b.length;
    console.log(yol.padEnd(22) + b.length + " kayık ızgara çifti");
    b.forEach((x) => console.log("    " + String(x.sapma).padStart(3) + "px  [" +
      x.kapsayici + "]  " + x.a + "  ile  " + x.b));
  }

  console.log("\n" + YOLLAR.length + " sayfa tarandı, " + toplam + " kayık ızgara çifti bulundu.");
  if (toplam === 0) console.log("Aracın gerçekten ölçtüğünü doğrulamak için: node tools/hizalama-denetim.js --kanit");
  t.kapat();
  process.exit(toplam ? 1 : 0);
})().catch((e) => {
  console.error("Denetim çalışmadı: " + e.message);
  process.exit(2);
});
