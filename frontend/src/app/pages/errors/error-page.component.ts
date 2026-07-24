import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Seo } from '../../core/seo.service';

type ErrorFamily = 'request' | 'access' | 'missing' | 'limit' | 'server' | 'service';

interface ErrorContent {
  title: string;
  description: string;
  guidance: string;
  family: ErrorFamily;
}

/**
 * Kullanıcıya gösterilmesi anlamlı olan standart HTTP hata kodları.
 * Listede olmayan 400–599 kodları da ailelerine göre genel içerikle
 * karşılanır; sistem hiçbir geçerli hata kodunda boş ekran üretmez.
 */
const ERROR_CONTENT: Readonly<Record<number, ErrorContent>> = {
  400: {
    title: 'İstek işlenemedi',
    description: 'Gönderilen istek sunucu tarafından anlaşılamadı.',
    guidance: 'Adresi ve gönderdiğiniz bilgileri kontrol ederek işlemi yeniden deneyin.',
    family: 'request'
  },
  401: {
    title: 'Oturum doğrulanamadı',
    description: 'Bu kaynağa erişebilmek için kimliğinizin doğrulanması gerekiyor.',
    guidance: 'Oturum açtıktan sonra aynı işlemi yeniden deneyin.',
    family: 'access'
  },
  403: {
    title: 'Erişim izniniz bulunmuyor',
    description: 'İstediğiniz kaynak mevcut ancak hesabınızın bu işlem için yetkisi yok.',
    guidance: 'Erişim yetkiniz olması gerektiğini düşünüyorsanız birim yöneticinizle iletişime geçin.',
    family: 'access'
  },
  404: {
    title: 'Sayfa bulunamadı',
    description: 'Aradığınız adres değiştirilmiş, kaldırılmış veya hatalı yazılmış olabilir.',
    guidance: 'Ana sayfaya dönebilir ya da menüden aradığınız hizmete yeniden ulaşabilirsiniz.',
    family: 'missing'
  },
  405: {
    title: 'İşlem yöntemine izin verilmiyor',
    description: 'Bu adres, kullanılan işlem yöntemini kabul etmiyor.',
    guidance: 'Sayfayı normal bağlantısı üzerinden yeniden açmayı deneyin.',
    family: 'request'
  },
  408: {
    title: 'İstek zaman aşımına uğradı',
    description: 'İşlem tamamlanmadan bağlantı süresi sona erdi.',
    guidance: 'Bağlantınızı kontrol edip kısa bir süre sonra yeniden deneyin.',
    family: 'request'
  },
  409: {
    title: 'İşlem mevcut durumla çakıştı',
    description: 'Gönderilen değişiklik kaynağın güncel durumuyla uyuşmuyor.',
    guidance: 'Sayfayı yenileyerek güncel bilgileri aldıktan sonra işlemi tekrarlayın.',
    family: 'request'
  },
  410: {
    title: 'İçerik artık yayımlanmıyor',
    description: 'İstediğiniz kaynak kalıcı olarak yayından kaldırılmış.',
    guidance: 'Güncel içerikler için ana sayfayı veya ilgili hizmet bölümünü kullanın.',
    family: 'missing'
  },
  413: {
    title: 'Gönderilen veri çok büyük',
    description: 'İşlemde kullanılan dosya veya veri izin verilen boyutu aşıyor.',
    guidance: 'Dosya boyutunu küçülterek işlemi yeniden deneyin.',
    family: 'request'
  },
  415: {
    title: 'Dosya biçimi desteklenmiyor',
    description: 'Gönderilen içeriğin türü bu işlem için uygun değil.',
    guidance: 'İzin verilen dosya biçimlerinden birini kullanın.',
    family: 'request'
  },
  422: {
    title: 'Bilgiler doğrulanamadı',
    description: 'İstek anlaşılır olsa da bazı alanlar geçerli değil.',
    guidance: 'İşaretlenen alanları kontrol edip eksik veya hatalı bilgileri düzeltin.',
    family: 'request'
  },
  429: {
    title: 'Çok fazla istek gönderildi',
    description: 'Güvenli ve kararlı hizmet için kısa süreli bir işlem sınırı uygulandı.',
    guidance: 'Bir süre bekledikten sonra işlemi yeniden deneyin.',
    family: 'limit'
  },
  451: {
    title: 'İçeriğe yasal nedenle erişilemiyor',
    description: 'İstenen kaynak yürürlükteki bir düzenleme nedeniyle sunulamıyor.',
    guidance: 'Ayrıntılı bilgi için Bilgi İşlem Daire Başkanlığı ile iletişime geçin.',
    family: 'access'
  },
  500: {
    title: 'İşlem tamamlanamadı',
    description: 'Sunucuda beklenmeyen bir hata oluştu.',
    guidance: 'Kısa bir süre sonra yeniden deneyin. Sorun sürerse hata kodunu destek ekibine bildirin.',
    family: 'server'
  },
  501: {
    title: 'İşlem henüz desteklenmiyor',
    description: 'İstenen işlev bu sistemde uygulanmamış.',
    guidance: 'Alternatif işlem yolları için ilgili hizmet sayfasını inceleyin.',
    family: 'server'
  },
  502: {
    title: 'Bağlı servisten yanıt alınamadı',
    description: 'Sunucular arasındaki iletişim sırasında geçersiz bir yanıt alındı.',
    guidance: 'Kısa bir süre sonra sayfayı yeniden yükleyin.',
    family: 'service'
  },
  503: {
    title: 'Hizmet geçici olarak kullanılamıyor',
    description: 'Sistem bakım veya geçici yoğunluk nedeniyle şu anda yanıt veremiyor.',
    guidance: 'Lütfen birkaç dakika sonra yeniden deneyin.',
    family: 'service'
  },
  504: {
    title: 'Servis yanıt süresi aşıldı',
    description: 'Bağlı hizmet beklenen süre içinde yanıt vermedi.',
    guidance: 'Bağlantınızı kontrol edip işlemi daha sonra yeniden deneyin.',
    family: 'service'
  },
  505: {
    title: 'Protokol sürümü desteklenmiyor',
    description: 'İstekte kullanılan HTTP sürümü sunucu tarafından desteklenmiyor.',
    guidance: 'Güncel bir tarayıcıyla yeniden bağlanmayı deneyin.',
    family: 'server'
  },
  507: {
    title: 'İşlem için yeterli alan yok',
    description: 'Sunucu, isteği tamamlamak için gereken depolama alanını ayıramadı.',
    guidance: 'Daha sonra yeniden deneyin veya durumu destek ekibine bildirin.',
    family: 'server'
  },
  508: {
    title: 'İşlem döngüye girdi',
    description: 'Sunucu isteği işlerken tekrarlanan bir yönlendirme algıladı.',
    guidance: 'Adresi kontrol edin; sorun sürerse hata kodunu destek ekibine iletin.',
    family: 'server'
  },
  511: {
    title: 'Ağ doğrulaması gerekiyor',
    description: 'Ağa devam edebilmek için ek kimlik doğrulaması yapılması gerekiyor.',
    guidance: 'Bağlı olduğunuz ağın giriş sayfasını tamamladıktan sonra yeniden deneyin.',
    family: 'access'
  }
};

const GENERIC_CLIENT: ErrorContent = {
  title: 'İstek tamamlanamadı',
  description: 'İstek, istemci kaynaklı bir hata nedeniyle işlenemedi.',
  guidance: 'Adresi ve işlem bilgilerini kontrol ederek yeniden deneyin.',
  family: 'request'
};

const GENERIC_SERVER: ErrorContent = {
  title: 'Hizmet yanıt veremedi',
  description: 'Sunucu isteği tamamlarken bir sorunla karşılaştı.',
  guidance: 'Kısa bir süre sonra yeniden deneyin; sorun sürerse hata kodunu destek ekibine bildirin.',
  family: 'server'
};

@Component({
  selector: 'bidb-error-page',
  imports: [RouterLink],
  template: `
    <main id="ana-icerik" class="hata-sayfasi">
      @if (arkaPlanGorunur()) {
        <picture class="hata-arka-plan" aria-hidden="true">
          <source media="(min-width: 64rem)" srcset="/images/slider/slide2-1920.webp">
          <img
            src="/images/slider/slide2-960.webp"
            alt=""
            (error)="arkaPlanGorunur.set(false)">
        </picture>
        <span class="hata-arka-plan-ton" aria-hidden="true"></span>
      }

      <div class="kap hata-kap">
        <nav class="hata-iz" aria-label="Sayfa yolu">
          <a routerLink="/tr">Ana Sayfa</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Hata {{ code() }}</span>
        </nav>

        <section class="hata-panel" [attr.data-family]="content().family">
          <div class="hata-kod" aria-hidden="true">
            <span>Hata kodu</span>
            <strong>{{ code() }}</strong>
            <i></i>
          </div>

          <div class="hata-metin">
            <p class="hata-ust-baslik">İşlem tamamlanamadı</p>
            <h1>{{ content().title }}</h1>
            <p class="hata-aciklama">{{ content().description }}</p>

            <div class="hata-eylemler">
              <a class="hata-ana-eylem" routerLink="/tr">
                Ana sayfaya dön
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M14 7l5 5-5 5"></path>
                </svg>
              </a>
              <button type="button" (click)="geriDon()">Önceki sayfaya dön</button>
            </div>

            <div class="hata-bilgi">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 10v6M12 7.5v.01"></path>
              </svg>
              <div>
                <h2>Ne yapabilirsiniz?</h2>
                <p>{{ content().guidance }}</p>
              </div>
            </div>
          </div>
        </section>

        <div class="hata-alt">
          <p>
            Teknik destek gerektiğinde <strong>{{ code() }}</strong> hata kodunu
            ve işlem yaptığınız adresi paylaşın.
          </p>
          <a routerLink="/tr/contact">İletişim bilgileri</a>
        </div>
      </div>
    </main>
  `
})
export class ErrorPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(Seo);
  protected arkaPlanGorunur = signal(true);

  protected code = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const raw = params.get('code') ?? '';
        const parsed = /^\d{3}$/.test(raw) ? Number(raw) : 500;
        return parsed >= 400 && parsed <= 599 ? parsed : 500;
      })
    ),
    { initialValue: 404 }
  );

  protected content = computed(() => {
    const code = this.code();
    return ERROR_CONTENT[code] ?? (code < 500 ? GENERIC_CLIENT : GENERIC_SERVER);
  });

  constructor() {
    effect(() => {
      const code = this.code();
      const content = this.content();
      const canonicalPath = `/error/${code}`;
      this.seo.hata(code, content.title, content.description, canonicalPath);

      if (this.router.url.split('?')[0] !== canonicalPath) {
        void this.router.navigateByUrl(canonicalPath, { replaceUrl: true });
      }
    });
  }

  protected geriDon(): void {
    if (typeof history !== 'undefined' && history.length > 1) {
      history.back();
      return;
    }
    void this.router.navigateByUrl('/tr');
  }
}
