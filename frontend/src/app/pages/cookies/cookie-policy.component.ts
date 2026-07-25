import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Language, Page } from '../../core/models';
import { Seo } from '../../core/seo.service';
import { CookiePreferencesService } from '../../core/cookie-preferences.service';
import { SideMenuComponent } from '../../layout/side-menu.component';

/**
 * Çerez ve tarayıcı depolaması envanteri.
 *
 * Sayfa bir mevzuat şablonu gibi genel ifadeler kullanmak yerine uygulamanın
 * gerçekten kullandığı iki kayıt türünü açıklar. Yeni bir ölçüm aracı
 * eklendiğinde hem tercih servisi hem de bu envanter birlikte güncellenmelidir.
 */
@Component({
  selector: 'bidb-cookie-policy',
  imports: [RouterLink, SideMenuComponent],
  template: `
    <header class="sayfa-seridi">
      <div class="kap sayfa-seridi-ic">
        <p class="sayfa-seridi-etiket">{{ language() === 'en' ? 'Privacy and Transparency' : 'Gizlilik ve Şeffaflık' }}</p>
        <h1 class="sayfa-seridi-baslik">{{ language() === 'en' ? 'Cookie and Browser Storage Policy' : 'Çerez ve Tarayıcı Depolama Politikası' }}</h1>
        <p class="sayfa-seridi-aciklama">
          {{ language() === 'en'
            ? 'This page explains, in plain language, which browser technologies are used on the Department of Information Technology website, for what purpose and for how long.'
            : 'Bu sayfa, Bilgi İşlem Daire Başkanlığı web sitesinde hangi tarayıcı teknolojilerinin, hangi amaçla ve ne kadar süreyle kullanıldığını açık bir dille anlatır.' }}
        </p>
        <nav [attr.aria-label]="language() === 'en' ? 'Breadcrumb' : 'Sayfa yolu'">
          <ol class="sayfa-iz">
            <li><a [routerLink]="['/', language()]">{{ language() === 'en' ? 'Home' : 'Ana Sayfa' }}</a></li>
            <li aria-current="page"><span>{{ language() === 'en' ? 'Cookie Policy' : 'Çerez Politikası' }}</span></li>
          </ol>
        </nav>
      </div>
    </header>

    <div class="kap sayfa-duzen">
      <aside class="yan">
        <bidb-side-menu [dilDegeri]="language()"></bidb-side-menu>
      </aside>

      <main id="ana-icerik" class="icerik-alani cerez-politikasi">
        <header class="cerez-politika-ust">
          <aside class="cerez-mevcut-durum" aria-label="Mevcut kullanım durumu">
            <span class="cerez-durum-nokta" aria-hidden="true"></span>
            <div>
              <strong>{{ language() === 'en' ? 'Current status' : 'Güncel durum' }}</strong>
              <p>
                {{ language() === 'en'
                  ? 'No analytics or advertising cookies are active.'
                  : 'Analiz veya reklam çerezi etkin değildir.' }}
              </p>
            </div>
          </aside>
        </header>

        <nav class="cerez-icindekiler" [attr.aria-label]="language() === 'en' ? 'On this page' : 'Bu sayfada'">
          <strong>{{ language() === 'en' ? 'On this page' : 'Bu sayfada' }}</strong>
          <a href="#genel">{{ language() === 'en' ? 'General information' : 'Genel bilgi' }}</a>
          <a href="#kategoriler">{{ language() === 'en' ? 'Technology categories' : 'Teknoloji kategorileri' }}</a>
          <a href="#envanter">{{ language() === 'en' ? 'Storage inventory' : 'Depolama envanteri' }}</a>
          <a href="#yonetim">{{ language() === 'en' ? 'Managing preferences' : 'Tercihleri yönetme' }}</a>
          <a href="#iletisim">{{ language() === 'en' ? 'Updates and contact' : 'Güncellemeler ve iletişim' }}</a>
        </nav>

        <div class="cerez-politika-icerik">
            <section id="genel">
              <span class="cerez-bolum-no">01</span>
              <div>
                <h2>{{ language() === 'en' ? 'What do these technologies mean?' : 'Bu teknolojiler ne anlama gelir?' }}</h2>
                <p>
                  {{ language() === 'en'
                    ? 'Cookies are small records stored by a website in the browser. Modern web applications may also use local storage and session storage for similar technical purposes. This website identifies all three under the common heading of browser storage.'
                    : 'Çerezler, bir web sitesinin tarayıcıda sakladığı küçük kayıtlardır. Güncel web uygulamaları benzer teknik amaçlarla yerel depolama ve oturum depolamasından da yararlanabilir. Bu site, üç teknolojiyi birlikte “tarayıcı depolaması” başlığı altında açıklar.' }}
                </p>
                <p>
                  {{ language() === 'en'
                    ? 'The public website does not use these technologies to profile visitors, measure cross-site behaviour or serve advertising.'
                    : 'Kamusal web sitesi bu teknolojileri ziyaretçi profili oluşturmak, siteler arası davranış ölçmek veya reklam sunmak amacıyla kullanmaz.' }}
                </p>
              </div>
            </section>

            <section id="kategoriler">
              <span class="cerez-bolum-no">02</span>
              <div>
                <h2>{{ language() === 'en' ? 'Technology categories' : 'Teknoloji kategorileri' }}</h2>
                <div class="cerez-turler">
                  <article>
                    <span class="cerez-durum etkin">{{ language() === 'en' ? 'Active' : 'Etkin' }}</span>
                    <h3>{{ language() === 'en' ? 'Necessary' : 'Gerekli' }}</h3>
                    <p>
                      {{ language() === 'en'
                        ? 'Used only to remember this notice and maintain an authenticated administration session.'
                        : 'Yalnızca bu bildirimin hatırlanması ve doğrulanmış yönetim oturumunun sürdürülmesi için kullanılır.' }}
                  </article>
                  <article>
                    <span class="cerez-durum etkin">{{ language() === 'en' ? 'Anonymous' : 'Anonim' }}</span>
                    <h3>{{ language() === 'en' ? 'Analytics and performance' : 'Analiz ve performans' }}</h3>
                    <p>
                      {{ language() === 'en'
                        ? 'Core Web Vitals are measured without cookies or visitor identifiers and retained for up to 90 days. For monthly content reports, only the route, broad device class and traffic-source category are retained for up to 24 months. No IP address, full referrer URL, cookie or user identifier is stored.'
                        : 'Core Web Vitals değerleri çerez veya ziyaretçi tanımlayıcısı olmadan ölçülür ve en fazla 90 gün saklanır. Aylık içerik raporları için yalnızca rota, genel cihaz sınıfı ve trafik kaynağı kategorisi en fazla 24 ay tutulur; IP adresi, tam yönlendiren adres, çerez veya kullanıcı tanımlayıcısı saklanmaz.' }}
                  </article>
                  <article>
                    <span class="cerez-durum kapali">{{ language() === 'en' ? 'Not in use' : 'Kullanılmıyor' }}</span>
                    <h3>{{ language() === 'en' ? 'Advertising and marketing' : 'Reklam ve pazarlama' }}</h3>
                    <p>
                      {{ language() === 'en'
                        ? 'No advertising network, tracking pixel or marketing profile is used.'
                        : 'Reklam ağı, izleme pikseli veya pazarlama profili kullanılmaz.' }}
                  </article>
                </div>
              </div>
            </section>

            <section id="envanter">
              <span class="cerez-bolum-no">03</span>
              <div>
                <h2>{{ language() === 'en' ? 'Current storage inventory' : 'Güncel depolama envanteri' }}</h2>
                <p>
                  {{ language() === 'en'
                    ? 'The inventory below reflects the current application configuration.'
                    : 'Aşağıdaki envanter, uygulamanın güncel yapılandırmasını gösterir.' }}
                </p>
                <div class="cerez-envanter">
                  <article>
                    <header>
                      <code>bidb-cookie-preferences</code>
                      <span>{{ language() === 'en' ? 'Local storage' : 'Yerel depolama' }}</span>
                    </header>
                    <dl>
                      <div>
                        <dt>{{ language() === 'en' ? 'Purpose' : 'Amaç' }}</dt>
                        <dd>{{ language() === 'en' ? 'Remembering that the storage notice was reviewed.' : 'Depolama bildiriminin incelendiğini hatırlamak.' }}</dd>
                      </div>
                      <div>
                        <dt>{{ language() === 'en' ? 'Duration' : 'Süre' }}</dt>
                        <dd>{{ language() === 'en' ? 'Up to 12 months' : 'En fazla 12 ay' }}</dd>
                      </div>
                      <div>
                        <dt>{{ language() === 'en' ? 'Scope' : 'Kapsam' }}</dt>
                        <dd>{{ language() === 'en' ? 'Public website' : 'Kamusal web sitesi' }}</dd>
                      </div>
                    </dl>
                  </article>

                  <article>
                    <header>
                      <code>bidb-yonetim</code>
                      <span>{{ language() === 'en' ? 'Session storage' : 'Oturum depolaması' }}</span>
                    </header>
                    <dl>
                      <div>
                        <dt>{{ language() === 'en' ? 'Purpose' : 'Amaç' }}</dt>
                        <dd>{{ language() === 'en' ? 'Maintaining the authenticated administration session.' : 'Doğrulanmış yönetim paneli oturumunu sürdürmek.' }}</dd>
                      </div>
                      <div>
                        <dt>{{ language() === 'en' ? 'Duration' : 'Süre' }}</dt>
                        <dd>{{ language() === 'en' ? 'Until the browser session ends' : 'Tarayıcı oturumu sona erene kadar' }}</dd>
                      </div>
                      <div>
                        <dt>{{ language() === 'en' ? 'Scope' : 'Kapsam' }}</dt>
                        <dd>{{ language() === 'en' ? 'Authorised administration users only' : 'Yalnızca yetkili yönetim kullanıcıları' }}</dd>
                      </div>
                    </dl>
                  </article>
                </div>
                <p class="cerez-ucuncu-taraf">
                  <strong>{{ language() === 'en' ? 'Third-party cookies:' : 'Üçüncü taraf çerezleri:' }}</strong>
                  {{ language() === 'en'
                    ? ' None are currently set automatically by this website. The Google Maps frame on the contact page is connected only after the visitor selects “Load interactive map”; Google’s own privacy and cookie rules then apply. External websites opened through links apply their own policies.'
                    : ' Bu web sitesi tarafından otomatik olarak üçüncü taraf çerezi yerleştirilmez. İletişim sayfasındaki Google Maps çerçevesi yalnızca ziyaretçi “Etkileşimli haritayı aç” seçeneğine bastıktan sonra bağlanır; bu aşamadan sonra Google’ın kendi gizlilik ve çerez kuralları geçerlidir. Bağlantılarla açılan harici siteler de kendi politikalarını uygular.' }}
                </p>
              </div>
            </section>

            <section id="yonetim">
              <span class="cerez-bolum-no">04</span>
              <div>
                <h2>{{ language() === 'en' ? 'Managing your preferences' : 'Tercihlerinizi yönetme' }}</h2>
                <p>
                  {{ language() === 'en'
                    ? 'You can review the current status at any time. Necessary storage cannot be disabled through this panel because the site does not activate an optional category.'
                    : 'Güncel kullanım durumunu dilediğiniz zaman inceleyebilirsiniz. Site isteğe bağlı bir kategori etkinleştirmediği için gerekli depolama bu panelden kapatılamaz.' }}
                </p>
                <div class="cerez-yonetim-eylem">
                  <button type="button" (click)="preferences.openPanel()">
                    {{ language() === 'en' ? 'Open cookie preferences' : 'Çerez tercihlerini aç' }}
                  </button>
                  <p>
                    {{ language() === 'en'
                      ? 'You may also delete site data using your browser settings. Doing so will cause the notice to appear again.'
                      : 'Site verilerini tarayıcı ayarlarınızdan da silebilirsiniz. Bu işlem bildirimin yeniden görünmesine neden olur.' }}
                  </p>
                </div>
              </div>
            </section>

            <section id="iletisim">
              <span class="cerez-bolum-no">05</span>
              <div>
                <h2>{{ language() === 'en' ? 'Policy updates and contact' : 'Politika güncellemeleri ve iletişim' }}</h2>
                <p>
                  {{ language() === 'en'
                    ? 'This policy is reviewed when the website’s technical configuration changes. If an optional category is introduced in the future, it will not be activated before the preference mechanism and this inventory are updated.'
                    : 'Bu politika, sitenin teknik yapılandırması değiştiğinde gözden geçirilir. İleride isteğe bağlı bir kategori eklenirse tercih mekanizması ve bu envanter güncellenmeden etkinleştirilmez.' }}
                </p>
                <p>
                  {{ language() === 'en'
                    ? 'Questions about this policy may be sent to bidb@hacettepe.edu.tr.'
                    : 'Politikaya ilişkin sorularınızı bidb@hacettepe.edu.tr adresine iletebilirsiniz.' }}
                </p>
                <p class="cerez-guncelleme">
                  {{ language() === 'en' ? 'Last reviewed: 23 July 2026' : 'Son gözden geçirme: 23 Temmuz 2026' }}
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
  `
})
export class CookiePolicyComponent {
  private route = inject(ActivatedRoute);
  private seo = inject(Seo);
  protected preferences = inject(CookiePreferencesService);

  protected language = toSignal(
    this.route.paramMap.pipe(
      map((params): Language => params.get('language') === 'en' ? 'en' : 'tr')
    ),
    { initialValue: 'tr' as Language }
  );

  private seoPage = computed<Page>(() => {
    const english = this.language() === 'en';
    return {
      slug: 'cookies',
      language: this.language(),
      title: english ? 'Cookie and Browser Storage Policy' : 'Çerez ve Tarayıcı Depolama Politikası',
      contentHtml: null,
      seoTitle: null,
      seoDescription: english
        ? 'Browser storage technologies used on the Hacettepe University Department of Information Technology website.'
        : 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı web sitesinde kullanılan çerez ve tarayıcı depolama teknolojileri.',
      seoKeywords: null,
      documents: [],
      hasTranslation: true
    };
  });

  constructor() {
    effect(() => {
      const language = this.language();
      this.seo.uygula(this.seoPage(), language, `/${language}/cookies`);
    });
  }
}
