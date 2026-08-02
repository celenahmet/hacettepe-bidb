import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AdminApiService, AuditEvent } from './admin-api.service';
import { tiklamaSinirlayici } from './tiklama-siniri';
import { aramaIcinSadelestir } from '../core/arama-metni';

/** Yönetim panelinde yapılan değişiklik işlemlerinin denetim kaydı. */
@Component({
  selector: 'bidb-audit-log-admin',
  imports: [SlicePipe],
  template: `
    <section class="kalite-bolum">
      <header>
        <div>
          <span class="bolum-no">Güvenlik Denetimi</span>
          <h2>İşlem günlüğü</h2>
          <p>Panelde yapılan her oluşturma/güncelleme/silme işlemi — oturum, kullanıcı adı, genel ve yerel IPv4 ile.</p>
        </div>
        <button type="button" class="ikincil" (click)="yukle()">Yenile</button>
      </header>

      <div class="gunluk-arac-cubugu">
        <!-- Yer tutucu metin erişilebilir ad yerine geçmez; ad, panelin geri
             kalanıyla aynı örüntüyle (görünmez etiket) veriliyor —
             bkz. contact-ticket-admin.component.ts. -->
        <label class="gunluk-arama-etiket">
          <span class="sr-only">Kayıtlarda filtrele</span>
          <input type="search" class="gunluk-arama" placeholder="Filtrele: işlem, kullanıcı, oturum, yol…"
                 [value]="filtre()" (input)="filtre.set($any($event.target).value)">
        </label>
        <span class="gunluk-sayac">{{ filtrelenmis().length }} / {{ kayitlar().length }} kayıt</span>
      </div>

      @if (yukleniyor()) {
        <p class="aciklama" role="status">Kayıtlar yükleniyor…</p>
      } @else if (hata()) {
        <p class="hata" role="alert">{{ hata() }}</p>
      } @else if (filtrelenmis().length) {
        <div class="tablo-kaydir">
          <table class="yonetim-tablo">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Oturum</th>
                <th>Kullanıcı</th>
                <th>İşlem</th>
                <th>Kaynak</th>
                <th>Genel IPv4</th>
                <th>Yerel IPv4</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              @for (k of filtrelenmis(); track k.id) {
                <tr>
                  <td><small>{{ tarihSaat(k.occurredAt) }}</small></td>
                  <td><code class="gunluk-oturum">{{ k.sessionId | slice: 0:8 }}</code></td>
                  <td>{{ k.attemptedUsername || '—' }}</td>
                  <td>{{ k.actionLabel }}</td>
                  <td class="gunluk-yol"><small>{{ k.resourcePath }}</small></td>
                  <td><small>{{ k.ipAddress }}</small></td>
                  <td><small>{{ k.localIpAddress || '—' }}</small></td>
                  <td>
                    <!-- Rozet tıklanabilir: kod tek başına ne olduğunu söylemiyor.
                         "400" gören bir yönetici işlemin reddedildiğini bilmek
                         zorunda değil. <button> kullanılıyor ki klavyeyle de
                         açılabilsin ve ekran okuyucu tıklanabilir olduğunu söylesin. -->
                    <button type="button" class="giris-kayit-rozet durum-tetik"
                            [class.basarili]="k.successful" [class.basarisiz]="!k.successful"
                            (click)="acikDurum.set(k)"
                            [attr.aria-label]="k.httpStatus + ' durum kodu — açıklamayı göster'">
                      {{ k.httpStatus }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="kalite-bos">
          <strong>Kayıt yok</strong>
          <p>Panelde yapılan bir sonraki değişiklik işlemi burada görünecek.</p>
        </div>
      }

      @if (acikDurum(); as k) {
        <div class="aciklama-perde" (click)="acikDurum.set(null)"></div>
        <div class="aciklama-pencere" role="dialog" aria-modal="true"
             [attr.aria-label]="k.httpStatus + ' durum kodu açıklaması'"
             [attr.data-rating]="durumDerecesi(k.httpStatus)"
             (keydown.escape)="acikDurum.set(null)">
          <header>
            <div>
              <span class="aciklama-pencere-metrik">{{ k.httpStatus }}</span>
              <strong class="aciklama-pencere-deger">{{ durum(k.httpStatus).ad }}</strong>
            </div>
            <button type="button" class="ikincil" (click)="acikDurum.set(null)" aria-label="Kapat">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"
                   fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <path d="M6 6l12 12M18 6 6 18"/>
              </svg>
            </button>
          </header>

          <div class="aciklama-pencere-durum">
            <span class="aciklama-pencere-rozet" [attr.data-rating]="durumDerecesi(k.httpStatus)">
              {{ k.successful ? 'İşlem yapıldı' : 'İşlem yapılmadı' }}
            </span>
            <span>{{ k.actionLabel }} · {{ k.resourcePath }}</span>
          </div>

          <div class="aciklama-pencere-govde">
            <section>
              <span class="aciklama-pencere-baslik">Teknik tanım</span>
              <p>{{ durum(k.httpStatus).teknik }}</p>
            </section>
            <section>
              <span class="aciklama-pencere-baslik">Sade dille</span>
              <p>{{ durum(k.httpStatus).sade }}</p>
            </section>
          </div>
        </div>
      }
    </section>
  `
})
export class AuditLogAdminComponent implements OnInit {
  private api = inject(AdminApiService);

  protected kayitlar = signal<AuditEvent[]>([]);
  protected yukleniyor = signal(false);
  protected hata = signal('');
  protected filtre = signal('');
  protected acikDurum = signal<AuditEvent | null>(null);

  /* HTTP durum kodu sözlüğü.

     Günlükte hâlihazırda 200, 204, 400, 404, 405 ve 500 geçiyor. Liste
     bunlarla sınırlı tutulmadı: panel büyüdükçe başka kodlar da düşecek ve
     o gün sözlükte olmayan bir kod "açıklama yok" diye görünmemeli. Sözlükte
     bulunmayan her kod için sınıfına göre (2xx/3xx/4xx/5xx) yine de anlamlı
     bir açıklama üretiliyor — bkz. durum(). */
  private readonly DURUM: Record<number, { ad: string; teknik: string; sade: string }> = {
    200: {
      ad: 'Başarılı',
      teknik: 'Sunucu isteği kabul etti ve sonucu gövdede döndürdü.',
      sade: 'İşlem yapıldı. İstediğiniz değişiklik kaydedildi.'
    },
    201: {
      ad: 'Oluşturuldu',
      teknik: 'İstek yeni bir kayıt oluşturdu; yanıt yeni kaydın adresini taşır.',
      sade: 'Yeni kayıt açıldı.'
    },
    204: {
      ad: 'Başarılı, içerik yok',
      teknik: 'İstek kabul edildi ama döndürülecek bir gövde yok.',
      sade: 'İşlem yapıldı. Genelde silme işlemlerinde görürsünüz: silinen şeyin geri döndürülecek bir hâli kalmadığı için gövde boştur. Hata değildir.'
    },
    304: {
      ad: 'Değişmemiş',
      teknik: 'Kaynak, tarayıcıdaki kopyadan bu yana değişmemiş.',
      sade: 'İçerik zaten güncel olduğu için yeniden gönderilmedi.'
    },
    400: {
      ad: 'Geçersiz istek',
      teknik: 'Gönderilen veri doğrulamadan geçmedi; sunucu isteği işlemeden reddetti.',
      sade: 'İşlem yapılmadı. Doğrudan reddedildi: bir alan boş kalmış, çok uzun ya da beklenen biçimde değil. Kayıtta hiçbir değişiklik olmadı.'
    },
    401: {
      ad: 'Kimlik doğrulanmadı',
      teknik: 'İstek geçerli bir kimlik bilgisi taşımıyor.',
      sade: 'Oturum açılmamış ya da düşmüş. Yeniden giriş yapmak gerekir.'
    },
    403: {
      ad: 'Yetki yok',
      teknik: 'Kimlik doğrulandı ama bu işlem için yetki verilmedi.',
      sade: 'Kim olduğunuz biliniyor ama bu işlemi yapma izniniz yok.'
    },
    404: {
      ad: 'Bulunamadı',
      teknik: 'İstenen adreste bir kaynak yok.',
      sade: 'Aranan kayıt yok. Genelde başka bir yerden zaten silinmiş bir şeye erişilmeye çalışıldığında olur.'
    },
    405: {
      ad: 'Yöntem uygun değil',
      teknik: 'Adres var ama bu HTTP yöntemini (GET/POST/PUT/DELETE) kabul etmiyor.',
      sade: 'Adres doğru ama yapılmak istenen işlem bu adres için tanımlı değil. Genelde eski bir bağlantıdan ya da elle yazılmış bir adresten gelir.'
    },
    409: {
      ad: 'Çakışma',
      teknik: 'İstek, kaydın mevcut durumuyla çelişiyor.',
      sade: 'Aynı şeyden zaten var. Örneğin kullanılmakta olan bir adresle yeni sayfa açılmak istenmiş olabilir.'
    },
    413: {
      ad: 'Gönderilen veri çok büyük',
      teknik: 'İstek gövdesi izin verilen sınırı aşıyor.',
      sade: 'Dosya çok büyük. Daha küçük bir dosyayla denenmeli.'
    },
    415: {
      ad: 'Desteklenmeyen dosya türü',
      teknik: 'Gönderilen içerik türü kabul edilenler arasında değil.',
      sade: 'Bu dosya biçimi kabul edilmiyor.'
    },
    422: {
      ad: 'İşlenemeyen içerik',
      teknik: 'İsteğin biçimi doğru ama içeriği iş kurallarına uymuyor.',
      sade: 'Gönderilen bilgi kurallara uymadığı için kaydedilmedi.'
    },
    429: {
      ad: 'Çok fazla istek',
      teknik: 'Hız sınırı aşıldı; istek geçici olarak reddedildi.',
      sade: 'Çok kısa sürede çok fazla deneme yapıldı. Bir süre bekleyip tekrar denemek gerekir.'
    },
    500: {
      ad: 'Sunucu hatası',
      teknik: 'Sunucu isteği işlerken beklenmeyen bir hataya düştü.',
      sade: 'İşlem yapılmadı ve sebebi sizde değil — hata sunucu tarafında. Tekrarlıyorsa kayda alınıp incelenmeli.'
    },
    502: {
      ad: 'Geçersiz ağ geçidi',
      teknik: 'Ara sunucu, arkadaki servisten geçerli bir yanıt alamadı.',
      sade: 'Sunucular arasındaki bağlantı koptu. Genelde arka uç yeniden başlatılırken görülür.'
    },
    503: {
      ad: 'Servis kullanılamıyor',
      teknik: 'Servis geçici olarak isteğe yanıt veremiyor.',
      sade: 'Sunucu şu an hizmet veremiyor; genelde bakım ya da yeniden başlatma anıdır.'
    },
    504: {
      ad: 'Ağ geçidi zaman aşımı',
      teknik: 'Ara sunucu, arkadaki servisten süresi içinde yanıt alamadı.',
      sade: 'Sunucu vaktinde cevap vermedi. İşlemin yapılıp yapılmadığı belirsizdir; kaydı kontrol etmek gerekir.'
    }
  };

  /** Sözlükte olmayan kodlar sınıfına göre yine de açıklanır. */
  protected durum(kod: number): { ad: string; teknik: string; sade: string } {
    const bilinen = this.DURUM[kod];
    if (bilinen) return bilinen;
    if (kod >= 200 && kod < 300) return {
      ad: 'Başarılı',
      teknik: '2xx sınıfı: sunucu isteği kabul etti.',
      sade: 'İşlem yapıldı.'
    };
    if (kod >= 300 && kod < 400) return {
      ad: 'Yönlendirme',
      teknik: '3xx sınıfı: istek başka bir adrese yönlendirildi.',
      sade: 'İstek başka bir adrese aktarıldı; hata değildir.'
    };
    if (kod >= 400 && kod < 500) return {
      ad: 'İstek reddedildi',
      teknik: '4xx sınıfı: sorun istekte; sunucu isteği işlemeden reddetti.',
      sade: 'İşlem yapılmadı. Gönderilen istekte bir sorun var.'
    };
    if (kod >= 500) return {
      ad: 'Sunucu hatası',
      teknik: '5xx sınıfı: sorun sunucu tarafında.',
      sade: 'İşlem yapılmadı ve sebebi sunucu tarafında.'
    };
    return {
      ad: 'Bilinmeyen kod',
      teknik: 'Bu kod bilinen HTTP sınıflarına girmiyor.',
      sade: 'Bu kodun anlamı çözülemedi.'
    };
  }

  /* Pencerenin vurgu rengi. Kalite penceresiyle aynı üç değeri kullanır:
     4xx beklenen bir ret olduğu için "poor" değil "needs-improvement". */
  protected durumDerecesi(kod: number): 'good' | 'needs-improvement' | 'poor' {
    if (kod >= 500) return 'poor';
    if (kod >= 400) return 'needs-improvement';
    return 'good';
  }

  protected filtrelenmis = computed(() => {
    const sorgu = aramaIcinSadelestir(this.filtre().trim());
    if (!sorgu) return this.kayitlar();
    return this.kayitlar().filter((k) =>
      aramaIcinSadelestir(k.actionLabel).includes(sorgu) ||
      aramaIcinSadelestir(k.resourcePath).includes(sorgu) ||
      aramaIcinSadelestir(k.sessionId).includes(sorgu) ||
      aramaIcinSadelestir(k.attemptedUsername).includes(sorgu) ||
      aramaIcinSadelestir(k.ipAddress).includes(sorgu));
  });

  private yenileSiniri = tiklamaSinirlayici();

  ngOnInit(): void {
    this.yukle();
  }

  protected yukle(): void {
    if (!this.yenileSiniri()) return;
    this.yukleniyor.set(true);
    this.hata.set('');
    this.api.auditEvents().subscribe({
      next: (liste) => {
        this.kayitlar.set(liste);
        this.yukleniyor.set(false);
      },
      error: () => {
        this.hata.set('İşlem günlüğü alınamadı.');
        this.yukleniyor.set(false);
      }
    });
  }

  protected tarihSaat(deger: string): string {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(new Date(deger));
  }
}
