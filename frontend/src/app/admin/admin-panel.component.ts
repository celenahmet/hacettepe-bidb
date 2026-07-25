import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PageEditorComponent } from './page-editor.component';
import { LoginEventsAdminComponent } from './login-events-admin.component';
import { AuditLogAdminComponent } from './audit-log-admin.component';
import { StaffEditorComponent } from './staff-editor.component';
import { NewsCoverComponent } from '../pages/news-cover.component';
import { AdminNews, NewsOptions, Shortcut, AdminMenuItem, AdminMenu, AdminPage, Slide, AdminSocialAccount, AdminApiService, ContactChannel, QualitySummary, QualityVitalScore, AnalyticsReport } from './admin-api.service';
import { ContactTicketAdminComponent } from './contact-ticket-admin.component';
import { AdminDilServisi } from './admin-dil.service';
import { tiklamaSinirlayici } from './tiklama-siniri';
import { AccessibilityMenuComponent } from '../layout/accessibility-menu.component';
import { Api } from '../core/api.service';
import { disaBaglantilariGuvenceyeAl } from '../core/icerik-bicim';

/** Alt bilgide görünen kurum bilgileri. */
interface ContactInfo extends Record<string, string> {
  iletisim_adres: string;
  iletisim_telefon: string;
  iletisim_eposta: string;
  iletisim_faks: string;
}

type AdminTab = 'analytics' | 'quality' | 'pages' | 'news' | 'slider' |
  'shortcuts' | 'menus' | 'sosyal' | 'iletisim' | 'tickets' | 'personel' | 'hakkinda' |
  'girisKayitlari' | 'islemGunlugu';
interface MobileMenuItem {
  tab: AdminTab;
  label: string;
  note: string;
}

/** Yönetim paneli: giriş, sayfa SEO düzenleme ve duyuru yönetimi. */
@Component({
  selector: 'bidb-admin-panel',
  imports: [FormsModule, PageEditorComponent, StaffEditorComponent, NewsCoverComponent, ContactTicketAdminComponent, LoginEventsAdminComponent, AuditLogAdminComponent, AccessibilityMenuComponent],
  template: `
    <div class="yonetim">
      @if (!api.girisYapildi()) {
        <div class="giris-duzen" [style.background-image]="arkaPlanGorseli() ? 'url(' + arkaPlanGorseli() + ')' : null">
          <div class="giris-kutu">
            <header class="giris-marka">
              <img src="/hu-logo.svg" alt="" aria-hidden="true" width="40" height="45">
              <span class="kurum">{{ dilServisi.t('girisKurum') }}</span>
              <h1 [innerHTML]="dilServisi.t('girisBaslik')"></h1>
            </header>

            <div class="giris-alan">
              <form (ngSubmit)="giris()">
                <h2>{{ dilServisi.t('yonetimPaneli') }}</h2>

                <label for="kullanici">{{ dilServisi.t('kullaniciAdi') }}</label>
                <input id="kullanici" name="kullanici" [(ngModel)]="kullanici" autocomplete="username" required>

                <label for="parola">{{ dilServisi.t('parola') }}</label>
                <input id="parola" name="parola" type="password" [(ngModel)]="parola" autocomplete="current-password" required>

                @if (hata()) { <p class="hata" role="alert">{{ hata() }}</p> }

                <span class="dugmeler">
                  <button type="submit" [disabled]="calisiyor()">
                    {{ calisiyor() ? dilServisi.t('girisYapiliyor') : dilServisi.t('girisYap') }}
                  </button>
                </span>
              </form>
            </div>
          </div>
        </div>
      } @else {
        <div class="yonetim-duzen">
          <nav class="ray" aria-label="Yönetim bölümleri">
            <div class="ray-tepe">
              <img src="/hu-logo.svg" alt="" aria-hidden="true" width="26" height="30">
              <span class="ray-tepe-yazi">
                <strong>HÜ BİDB</strong>
                <span>{{ dilServisi.t('yonetimPaneli') }}</span>
              </span>
              <button type="button" class="dil-degistir" (click)="dilDegistir()"
                      [attr.aria-label]="dilServisi.dil() === 'tr' ? 'Switch to English' : 'Türkçeye geç'">
                {{ dilServisi.dil() === 'tr' ? 'EN' : 'TR' }}
              </button>
              <button type="button" class="erisilebilirlik-degistir" (click)="erisilebilirlikDegistir()"
                      [class.etkin]="erisilebilirlikAcik()"
                      [attr.aria-pressed]="erisilebilirlikAcik()"
                      [attr.aria-label]="dilServisi.dil() === 'tr' ? 'Erişilebilirlik menüsünü aç/kapat' : 'Toggle accessibility menu'"
                      [title]="dilServisi.dil() === 'tr' ? 'Erişilebilirlik menüsü' : 'Accessibility menu'">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="4.5" r="1.6"/>
                  <path d="M4 8.5c3 1 13 1 16 0M12 8v13M8 21l2-6h4l2 6M9 13h6"/>
                </svg>
              </button>
            </div>

            <div class="ray-liste">
          <button type="button" [class.etkin]="sekme() === 'analytics'" (click)="sekmeAnalitik()">
            <span class="no">01</span>
            <span>{{ dilServisi.t('bolumAnalitik') }}</span>
            @if (analytics(); as a) { <span class="sayi">{{ a.currentMonthViews }}</span> }
          </button>
          <button type="button" [class.etkin]="sekme() === 'quality'" (click)="sekmeKalite()">
            <span class="no">02</span>
            <span>{{ dilServisi.t('bolumKalite') }}</span>
            @if (quality(); as q) { <span class="sayi">{{ q.seoScore }}</span> }
          </button>
          <button type="button" [class.etkin]="sekme() === 'pages'" (click)="sekme.set('pages')">
            <span class="no">03</span>
            <span>{{ dilServisi.t('bolumSayfalar') }}</span>
            <span class="sayi">{{ pages().length }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'news'" (click)="sekmeDuyuru()">
            <span class="no">04</span>
            <span>{{ dilServisi.t('bolumDuyurular') }}</span>
            <span class="sayi">{{ news().length }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'slider'" (click)="sekmeSlider()">
            <span class="no">05</span>
            <span>{{ dilServisi.t('bolumSlider') }}</span>
            <span class="sayi">{{ slides().length }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'shortcuts'" (click)="sekmeKisayol()">
            <span class="no">06</span>
            <span>{{ dilServisi.t('bolumKisayollar') }}</span>
            <span class="sayi">{{ shortcuts().length }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'menus'" (click)="sekmeMenu()">
            <span class="no">07</span>
            <span>{{ dilServisi.t('bolumMenuler') }}</span>
            <span class="sayi">{{ menus().length }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'sosyal'" (click)="sekmeSosyal()">
            <span class="no">08</span>
            <span>{{ dilServisi.t('bolumSosyal') }}</span>
            <span class="sayi">{{ socialAccounts().length }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'iletisim'" (click)="sekmeIletisim()">
            <span class="no">09</span>
            <span>{{ dilServisi.t('bolumIletisim') }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'tickets'" (click)="sekme.set('tickets')">
            <span class="no">10</span>
            <span>{{ dilServisi.t('bolumTalepler') }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'personel'" (click)="sekme.set('personel')">
            <span class="no">11</span>
            <span>{{ dilServisi.t('bolumPersonel') }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'islemGunlugu'" (click)="sekme.set('islemGunlugu')">
            <span class="no">12</span>
            <span>{{ dilServisi.t('bolumIslemGunlugu') }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'girisKayitlari'" (click)="sekme.set('girisKayitlari')">
            <span class="no">13</span>
            <span>{{ dilServisi.t('bolumGuvenlik') }}</span>
          </button>
          <button type="button" [class.etkin]="sekme() === 'hakkinda'" (click)="sekme.set('hakkinda')">
            <span class="no">14</span>
            <span>{{ dilServisi.t('bolumHakkinda') }}</span>
          </button>

          <button type="button" class="ray-liste-cikis" (click)="api.cikis()">{{ dilServisi.t('cikisYap') }}</button>
            </div>
          </nav>

          <main class="calisma">
            <header class="calisma-ust">
              <button type="button" class="mobil-menu-ac" (click)="mobilMenuAcik.set(true)" aria-label="Yönetim menüsünü aç">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <span class="bolum-no">{{ bolumNo() }} · Yönetim Paneli</span>
              <h1>{{ bolumBasligi() }}</h1>
            </header>

            <div class="calisma-govde">


        @if (bilgi()) { <p class="bilgi" role="status">{{ bilgi() }}</p> }

        @if (sekme() === 'analytics') {
          @if (analyticsLoading()) {
            <p class="aciklama" role="status">Aylık kullanım raporu hazırlanıyor…</p>
          } @else if (analytics(); as a) {
            <section class="analitik-ozet" aria-label="Kullanım özeti">
              <article>
                <span>Bu ay</span>
                <strong>{{ sayiBicimle(a.currentMonthViews) }}</strong>
                <small>sayfa görüntüleme</small>
              </article>
              <article>
                <span>Geçen ay</span>
                <strong>{{ sayiBicimle(a.previousMonthViews) }}</strong>
                <small [class.artis]="(a.monthlyChangePercent ?? 0) > 0"
                       [class.azalis]="(a.monthlyChangePercent ?? 0) < 0">
                  {{ degisimEtiketi(a.monthlyChangePercent) }}
                </small>
              </article>
              <article>
                <span>{{ a.months }} aylık toplam</span>
                <strong>{{ sayiBicimle(a.totalViews) }}</strong>
                <small>anonim görüntüleme</small>
              </article>
              <article>
                <span>Aktif içerik</span>
                <strong>{{ a.activePages }}</strong>
                <small>görüntülenen sayfa</small>
              </article>
            </section>

            <div class="analitik-ana-izgara">
              <section class="analitik-panel analitik-grafik">
                <header>
                  <div><span class="bolum-no">12 Aylık Eğilim</span><h2>Aylık trafik</h2></div>
                  <button type="button" class="ikincil" (click)="analitikYukle()">Yenile</button>
                </header>
                @if (a.monthly.length) {
                  <div class="aylik-grafik" role="img" aria-label="Aylık sayfa görüntüleme grafiği">
                    @for (item of a.monthly; track item.key) {
                      <div class="aylik-sutun">
                        <span class="sutun-deger">{{ sayiBicimle(item.views) }}</span>
                        <i [style.height.%]="grafikYuksekligi(item.views, a.monthly)"></i>
                        <small>{{ ayEtiketi(item.key) }}</small>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="kalite-bos">
                    <strong>Rapor oluşmaya başladı</strong>
                    <p>Yayınlanan sürüm ziyaret aldıkça aylık eğilim burada gerçek verilerle görünecek.</p>
                  </div>
                }
                <div class="gunluk-baslik">
                  <strong>Son 30 gün</strong>
                  <span>Günlük yoğunluk</span>
                </div>
                <div class="gunluk-spark" role="img" aria-label="Son 30 günlük görüntüleme yoğunluğu">
                  @for (item of a.daily; track item.key) {
                    <i [style.height.%]="grafikYuksekligi(item.views, a.daily)"
                       [attr.title]="item.key + ': ' + item.views"></i>
                  }
                </div>
              </section>

              <aside class="analitik-kirilimlar">
                <section class="analitik-panel">
                  <span class="bolum-no">Cihazlar</span>
                  <h2>Erişim biçimi</h2>
                  @for (item of a.devices; track item.name) {
                    <div class="kirilim-satir">
                      <span>{{ cihazEtiketi(item.name) }}</span><strong>%{{ item.percentage }}</strong>
                      <i><b [style.width.%]="item.percentage"></b></i>
                    </div>
                  }
                </section>
                <section class="analitik-panel">
                  <span class="bolum-no">Kaynaklar</span>
                  <h2>Trafik kaynağı</h2>
                  @for (item of a.referrers; track item.name) {
                    <div class="kirilim-satir">
                      <span>{{ kaynakEtiketi(item.name) }}</span><strong>%{{ item.percentage }}</strong>
                      <i><b [style.width.%]="item.percentage"></b></i>
                    </div>
                  }
                </section>
              </aside>
            </div>

            <section class="kalite-bolum">
              <header>
                <div><span class="bolum-no">İçerik Performansı</span><h2>Sayfa bazlı rapor</h2></div>
                <p>Toplam görüntüleme, aylık karşılaştırma ve son ziyaret tek raporda.</p>
              </header>
              <div class="tablo-kaydir">
                <table class="yonetim-tablo analitik-tablo">
                  <thead><tr><th>Sayfa</th><th>Toplam</th><th>Bu ay</th><th>Geçen ay</th><th>Değişim</th><th>Son ziyaret</th></tr></thead>
                  <tbody>
                    @for (page of a.pages; track page.path) {
                      <tr>
                        <td><strong>{{ page.path }}</strong></td>
                        <td>{{ sayiBicimle(page.views) }}</td>
                        <td>{{ sayiBicimle(page.currentMonthViews) }}</td>
                        <td>{{ sayiBicimle(page.previousMonthViews) }}</td>
                        <td><span class="trend" [class.artis]="(page.changePercent ?? 0) > 0"
                                  [class.azalis]="(page.changePercent ?? 0) < 0">{{ degisimEtiketi(page.changePercent) }}</span></td>
                        <td><small>{{ tarihSaat(page.lastViewedAt) }}</small></td>
                      </tr>
                    } @empty {
                      <tr><td colspan="6">Henüz sayfa görüntüleme verisi bulunmuyor.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          } @else {
            <p class="hata" role="alert">Analitik raporu alınamadı. {{ analyticsHata() || 'Backend bağlantısını kontrol edin.' }}</p>
          }
        } @else if (sekme() === 'quality') {
          @if (qualityLoading()) {
            <p class="aciklama" role="status">Kalite verileri hesaplanıyor…</p>
          } @else if (quality(); as q) {
            <section class="kalite-ozet" aria-label="Kalite puanları">
              <article class="kalite-puan" [attr.data-level]="puanSeviyesi(q.seoScore)">
                <span>SEO bütünlüğü</span>
                <div class="kalite-halka" [style.--kp]="q.seoScore" role="img"
                     [attr.aria-label]="'100 üzerinden ' + q.seoScore">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle class="halka-iz" cx="60" cy="60" r="52"></circle>
                    <circle class="halka-deger" cx="60" cy="60" r="52"></circle>
                  </svg>
                  <strong>{{ q.seoScore }}</strong>
                </div>
                <small>100 üzerinden · {{ q.pages.length }} yayın</small>
              </article>
              <article class="kalite-puan"
                       [attr.data-level]="puanSeviyesi(q.performanceScore)"
                       [class.bekliyor]="q.performanceScore === null">
                <span>Gerçek kullanıcı performansı</span>
                <div class="kalite-halka" [style.--kp]="q.performanceScore ?? 0" role="img"
                     [attr.aria-label]="q.performanceScore === null ? 'Henüz ölçüm yok' : '100 üzerinden ' + q.performanceScore">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle class="halka-iz" cx="60" cy="60" r="52"></circle>
                    <circle class="halka-deger" cx="60" cy="60" r="52"></circle>
                  </svg>
                  <strong>{{ q.performanceScore ?? '—' }}</strong>
                </div>
                <small>
                  @if (q.performanceScore === null) {
                    Henüz ziyaretçi ölçümü yok
                  } @else {
                    28 gün · {{ q.performanceSamples }} örnek
                  }
                </small>
              </article>
              <article class="kalite-puan kalite-puan--bilgi">
                <span>Son hesaplama</span>
                <strong class="kalite-zaman">{{ tarihSaat(q.generatedAt) }}</strong>
                <button type="button" class="ikincil" (click)="kaliteYukle()">Yenile</button>
              </article>
            </section>

            <section class="kalite-bolum">
              <header>
                <div>
                  <span class="bolum-no">Core Web Vitals</span>
                  <h2>Gerçek kullanıcı ölçümleri</h2>
                </div>
                <p>75. yüzdelik değerler; ortalama değer kullanıcı deneyimini gizlemez.</p>
              </header>

              @if (q.vitals.length) {
                <div class="kalite-vital-izgara">
                  @for (v of q.vitals; track v.path + v.metric) {
                    <article class="kalite-vital" [attr.data-rating]="v.rating">
                      <button type="button" class="kalite-vital-tetik" (click)="acikVitalKaydi.set(v)">
                        <div>
                          <span>{{ v.metric }}</span>
                          <strong>{{ metrikDegeri(v.metric, v.p75) }}</strong>
                        </div>
                        <p>{{ v.path }}</p>
                        <small>{{ v.samples }} örnek · {{ dereceEtiketi(v.rating) }}</small>
                        <span class="kalite-vital-detay-ipucu">Ayrıntılar için tıklayın</span>
                      </button>
                    </article>
                  }
                </div>
              } @else {
                <div class="kalite-bos">
                  <strong>Ölçüm birikmesi bekleniyor</strong>
                  <p>
                    Yeni sürüm yayınlandıktan sonra ziyaretçilerin anonim LCP, INP,
                    CLS, FCP ve TTFB değerleri burada görünecek.
                  </p>
                </div>
              }
            </section>

            <section class="kalite-bolum">
              <header>
                <div>
                  <span class="bolum-no">Sayfa Denetimi</span>
                  <h2>SEO geliştirme kuyruğu</h2>
                </div>
                <p>En düşük puanlı kayıtlar önce gösterilir.</p>
              </header>
              <div class="tablo-kaydir">
                <table class="yonetim-tablo kalite-tablo">
                  <thead>
                    <tr><th>Sayfa</th><th>Tür</th><th>Puan</th><th>Geliştirme alanları</th></tr>
                  </thead>
                  <tbody>
                    @for (p of q.pages; track p.path) {
                      <tr>
                        <td><strong>{{ p.title }}</strong><br><small>{{ p.path }}</small></td>
                        <td>{{ p.contentType === 'news' ? 'Duyuru' : 'Sayfa' }}</td>
                        <td>
                          <span class="kalite-rozet" [attr.data-level]="puanSeviyesi(p.score)">
                            {{ p.score }}
                          </span>
                        </td>
                        <td>
                          @if (p.issues.length) {
                            <ul>
                              @for (issue of p.issues; track issue) { <li>{{ issue }}</li> }
                            </ul>
                          } @else {
                            <span class="kalite-tamam">Eksik bulunmadı</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          } @else {
            <p class="hata" role="alert">Kalite özeti alınamadı. {{ qualityHata() || 'Backend bağlantısını kontrol edin.' }}</p>
          }
        } @else if (sekme() === 'pages') {
          <p class="aciklama">
            "Düzenle" ile sayfanın metnini, adresini ve belgelerini yönetebilir,
            sürüm geçmişinden eski bir hâle dönebilirsiniz.
          </p>

          <button type="button" (click)="yeniSayfaAc()">Yeni sayfa</button>

          @if (yeniSayfa(); as ys) {
            <form class="duyuru-form" (ngSubmit)="yeniSayfaKaydet()">
              <h2>Yeni sayfa</h2>

              <label for="ysdil">Dil</label>
              <select id="ysdil" name="ysdil" [ngModel]="ys.language"
                      (ngModelChange)="yeniSayfaAlan('language', $event)">
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
              </select>

              <label for="ysbaslik">Başlık</label>
              <input id="ysbaslik" name="ysbaslik" [ngModel]="ys.title"
                     (ngModelChange)="yeniSayfaAlan('title', $event)" required>

              <label for="ysslug">Adres (kısa ve İngilizce olmalı)</label>
              <input id="ysslug" name="ysslug" [ngModel]="ys.slug"
                     (ngModelChange)="yeniSayfaAlan('slug', $event)" required>
              <p class="aciklama">
                Sayfa adresi: <code>{{ SITE }}/{{ ys.language }}/{{ adresOnizleme(ys.slug) }}</code>
              </p>

              <span class="dugmeler">
                <button type="submit">OluşfileType</button>
                <button type="button" class="ikincil" (click)="yeniSayfa.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <div class="tablo-kaydir">

            <table class="yonetim-tablo">
              <thead>
                <tr><th>Sayfa</th><th>Dil</th><th>İçerik</th><th>Yayında</th><th></th></tr>
              </thead>
              <tbody>
                @for (s of pages(); track s.id) {
                  <tr>
                    <td>{{ s.title }}<br><small>/{{ s.language }}/{{ s.slug }}</small></td>
                    <td>{{ s.language }}</td>
                    <td>{{ s.contentLength }} krkt</td>
                    <td>{{ s.published ? 'Evet' : 'Hayır' }}</td>
                    <td>
                      <button type="button" class="ikincil" (click)="duzenle(s)">SEO</button>
                      <button type="button" (click)="openPage(s)">Düzenle</button>
                    </td>
                  </tr>

                  @if (acikSayfa()?.id === s.id) {
                    <tr class="duzenleme">
                      <td colspan="5">
                        <bidb-page-editor [sayfa]="s" (kapat)="acikSayfa.set(null)"
                                            (degisti)="refreshPages()" />
                      </td>
                    </tr>
                  }

                  @if (secili()?.id === s.id) {
                    <tr class="duzenleme">
                      <td colspan="5">
                        <form (ngSubmit)="saveSeo()">
                          <label [attr.for]="'t' + s.id">Başlık (title)</label>
                          <input [attr.id]="'t' + s.id" name="seoTitle" [ngModel]="secili()!.seoTitle"
                                 (ngModelChange)="alanDegis('seoTitle', $event)">

                          <label [attr.for]="'d' + s.id">Açıklama (description)</label>
                          <textarea [attr.id]="'d' + s.id" name="seoDescription" rows="2"
                                    [ngModel]="secili()!.seoDescription"
                                    (ngModelChange)="alanDegis('seoDescription', $event)"></textarea>

                          <label [attr.for]="'k' + s.id">Anahtar kelimeler</label>
                          <input [attr.id]="'k' + s.id" name="seoKeywords" [ngModel]="secili()!.seoKeywords"
                                 (ngModelChange)="alanDegis('seoKeywords', $event)">

                          <label [attr.for]="'i' + s.id">Sosyal paylaşım görseli</label>
                          <input [attr.id]="'i' + s.id" name="seoImage" [ngModel]="secili()!.seoImage"
                                 (ngModelChange)="alanDegis('seoImage', $event)"
                                 placeholder="/images/... veya https://...">

                          <label [attr.for]="'r' + s.id">Arama motoru yönergesi</label>
                          <select [attr.id]="'r' + s.id" name="seoRobots" [ngModel]="secili()!.seoRobots"
                                  (ngModelChange)="alanDegis('seoRobots', $event)">
                            <option value="index, follow">Dizine ekle, bağlantıları izle</option>
                            <option value="noindex, follow">Dizine ekleme, bağlantıları izle</option>
                            <option value="noindex, nofollow">Dizine ekleme, bağlantıları izleme</option>
                          </select>

                          <label [attr.for]="'schema' + s.id">Yapılandırılmış veri türü</label>
                          <select [attr.id]="'schema' + s.id" name="seoSchemaType"
                                  [ngModel]="secili()!.seoSchemaType"
                                  (ngModelChange)="alanDegis('seoSchemaType', $event)">
                            <option value="WebPage">Standart sayfa</option>
                            <option value="AboutPage">Kurumsal tanıtım</option>
                            <option value="ContactPage">İletişim sayfası</option>
                            <option value="FAQPage">Sık sorulan sorular</option>
                            <option value="WebSite">Ana sayfa / web sitesi</option>
                          </select>

                          <label class="onay">
                            <input type="checkbox" name="published" [ngModel]="secili()!.published"
                                   (ngModelChange)="alanDegis('published', $event)"> Yayında
                          </label>

                          <span class="dugmeler">
                            <button type="submit">Kaydet</button>
                            <button type="button" class="ikincil" (click)="secili.set(null)">Vazgeç</button>
                          </span>
                        </form>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>

          </div>
        } @else if (sekme() === 'news') {
          <form class="duyuru-form duyuru-form--haber" (ngSubmit)="duyuruKaydet()">
            <div class="duyuru-form-baslik">
              <div>
                <span class="bolum-no">Haber ve Duyuru</span>
                <h2>{{ newsItem().id ? 'Duyuruyu düzenle' : 'Yeni duyuru oluştur' }}</h2>
              </div>
              <p>Kategori, hedef kitle ve kapak dili birlikte yönetilir.</p>
            </div>

            <label for="dbaslik">Başlık</label>
            <input id="dbaslik" name="title" [ngModel]="newsItem().title"
                   (ngModelChange)="duyuruAlan('title', $event)" required>
            @if (duyuruBaslikSeoDurumu(); as sd) {
              <p class="seo-ipucu" [class.uyumlu]="sd.uyumlu" [class.uyumsuz]="!sd.uyumlu">{{ sd.mesaj }}</p>
            }

            <fieldset class="duyuru-siniflandirma">
              <legend>Yayın sınıflandırması</legend>
              <div class="duyuru-alan-izgara">
                <label>
                  <span>Kategori</span>
                  <select name="category" [ngModel]="newsItem().category"
                          (ngModelChange)="duyuruAlan('category', $event)">
                    @for (secenek of duyuruSecenekleri().categories; track secenek.key) {
                      <option [value]="secenek.key">{{ secenek.trLabel }}</option>
                    }
                  </select>
                  <small>{{ secenekAciklamasi('categories', newsItem().category) }}</small>
                </label>

                <label>
                  <span>Hedef kitle</span>
                  <select name="audience" [ngModel]="newsItem().audience"
                          (ngModelChange)="duyuruAlan('audience', $event)">
                    @for (secenek of duyuruSecenekleri().audiences; track secenek.key) {
                      <option [value]="secenek.key">{{ secenek.trLabel }}</option>
                    }
                  </select>
                  <small>{{ secenekAciklamasi('audiences', newsItem().audience) }}</small>
                </label>
              </div>
            </fieldset>

            <span class="onaylar">
              <label class="onay">
                <input type="checkbox" name="dyayin" [ngModel]="newsItem().published"
                       (ngModelChange)="duyuruAlan('published', $event)"> Yayında
              </label>
              <label class="onay">
                <input type="checkbox" name="doneCikan" [ngModel]="newsItem().featured"
                       (ngModelChange)="duyuruAlan('featured', $event)"> Öne çıkan (listenin başına sabitlenir)
              </label>
            </span>

            <section class="duyuru-belge-modu" [class.etkin]="newsItem().documentOnly">
              <label class="belge-modu-secim">
                <input type="checkbox" name="documentOnly"
                       [ngModel]="newsItem().documentOnly"
                       (ngModelChange)="duyuruBelgeModu($event)">
                <span>
                  <strong>Yalnızca belge ile yayımla</strong>
                  <small>Kart tıklandığında ayrı bir haber sayfası yerine doğrudan yüklenen belge açılır.</small>
                </span>
              </label>

              @if (newsItem().documentOnly) {
                <div class="belge-yayin-alani">
                  <div class="yukleme">
                    <label for="dbelge">Duyuru belgesini yükle</label>
                    <input id="dbelge" type="file"
                           accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.zip"
                           (change)="duyuruBelgeSec($event)">
                    @if (belgeYukleniyor()) { <small>Belge yükleniyor…</small> }
                  </div>

                  <label for="dbelgeadres">Belge adresi</label>
                  <input id="dbelgeadres" name="externalUrl" required
                         [ngModel]="newsItem().externalUrl"
                         (ngModelChange)="duyuruAlan('externalUrl', $event)"
                         placeholder="/uploads/duyuru-belgesi.pdf">
                  @if (newsItem().externalUrl) {
                    <p class="belge-hazir">
                      <span aria-hidden="true">✓</span>
                      <span>Belge bağlantısı hazır</span>
                      <a [href]="newsItem().externalUrl" target="_blank" rel="noopener">Kontrol et</a>
                    </p>
                  } @else {
                    <p class="belge-uyari">Yayın kaydedilmeden önce bir belge yüklenmesi veya belge adresi girilmesi zorunludur.</p>
                  }
                </div>
              }
            </section>

            <label for="dtarih">Yayın tarihi</label>
            <input id="dtarih" name="publishedOn" type="date" [ngModel]="newsItem().publishedOn"
                   (ngModelChange)="duyuruAlan('publishedOn', $event)" required>

            <label for="dozet">Özet (listede başlığın altında görünür)</label>
            <textarea id="dozet" name="summary" rows="2" [ngModel]="newsItem().summary"
                      (ngModelChange)="duyuruAlan('summary', $event)"></textarea>

            <fieldset class="duyuru-siniflandirma">
              <legend>Arama motoru ve sosyal paylaşım</legend>
              <label for="dseotitle">SEO başlığı
                <small>— boş bırakılırsa duyuru başlığı kullanılır</small>
              </label>
              <input id="dseotitle" name="seoTitle" maxlength="300"
                     [ngModel]="newsItem().seoTitle"
                     (ngModelChange)="duyuruAlan('seoTitle', $event)">

              <label for="dseodescription">SEO açıklaması
                <small>— boş bırakılırsa duyuru özeti kullanılır</small>
              </label>
              <textarea id="dseodescription" name="seoDescription" rows="2" maxlength="500"
                        [ngModel]="newsItem().seoDescription"
                        (ngModelChange)="duyuruAlan('seoDescription', $event)"></textarea>

              <label for="dseokeywords">Anahtar kelimeler</label>
              <input id="dseokeywords" name="seoKeywords" maxlength="500"
                     [ngModel]="newsItem().seoKeywords"
                     (ngModelChange)="duyuruAlan('seoKeywords', $event)">
            </fieldset>

            <section class="duyuru-kapak-secimi">
              <div class="duyuru-kapak-baslik">
                <div>
                  <span class="bolum-no">Kapak Tasarımı</span>
                  <h3>Fotoğraf veya kurumsal şablon</h3>
                </div>
                <p>Fotoğraf yüklenmezse seçtiğiniz hazır renk paleti ve kurumsal şablon otomatik kullanılır.</p>
              </div>

              <div class="yukleme">
                <label for="dgorsel">Özel fotoğraf yükle</label>
                <input id="dgorsel" type="file" accept="image/*" (change)="duyuruGorselSec($event)">
                @if (gorselYukleniyor()) { <small>Yükleniyor…</small> }
                @if (newsItem().imageUrl) {
                  <div class="gorsel-onizleme">
                    <img [src]="newsItem().imageUrl" alt="">
                    <div>
                      <strong>Özel fotoğraf etkin</strong>
                      <small>Şablon, fotoğraf kaldırılırsa yeniden devreye girer.</small>
                      <button type="button" class="ikincil" (click)="duyuruGorselKaldir()">Fotoğrafı kaldır</button>
                    </div>
                  </div>
                  <label for="dgorselalt">Görsel açıklaması (erişilebilirlik ve arama motorları için)</label>
                  <input id="dgorselalt" name="imageAlt" [ngModel]="newsItem().imageAlt"
                         (ngModelChange)="duyuruAlan('imageAlt', $event)">
                }
              </div>

              <label for="dkapakmetni">Şablon üstü kısa metin
                <small>— boş bırakırsanız kategori adı kullanılır</small>
              </label>
              <div class="karakterli-alan">
                <input id="dkapakmetni" name="coverText" maxlength="120"
                       [ngModel]="newsItem().coverText"
                       (ngModelChange)="duyuruAlan('coverText', $event)"
                       placeholder="Örn. Planlı sistem çalışması">
                <small>{{ (newsItem().coverText?.length || 0) }}/120</small>
              </div>

              <fieldset class="sablon-alani" [disabled]="!!newsItem().imageUrl">
                <legend>Hazır renk paleti ve şablon seçin</legend>
                <div class="sablon-izgara">
                  @for (secenek of duyuruSecenekleri().templates; track secenek.key) {
                    <label class="sablon-secim" [class.etkin]="newsItem().coverTemplate === secenek.key">
                      <input type="radio" name="coverTemplate" [value]="secenek.key"
                             [ngModel]="newsItem().coverTemplate"
                             (ngModelChange)="duyuruAlan('coverTemplate', $event)">
                      <bidb-news-cover
                        [title]="newsItem().title || 'Duyuru başlığı'"
                        [category]="newsItem().category"
                        [audience]="newsItem().audience"
                        [template]="$any(secenek.key)"
                        [coverText]="newsItem().coverText"
                        [language]="newsItem().language === 'en' ? 'en' : 'tr'" />
                      <span class="sablon-bilgi">
                        <strong>{{ secenek.trLabel }}</strong>
                        <small>{{ secenek.description }}</small>
                      </span>
                    </label>
                  }
                </div>
              </fieldset>
            </section>

            @if (!newsItem().documentOnly) {
              <label for="dslug">Haber adresi
                <small>— doldurursanız haber kendi sayfasında açılır</small>
              </label>
              <input id="dslug" name="slug" [ngModel]="newsItem().slug"
                     (ngModelChange)="duyuruAlan('slug', $event)"
                     placeholder="örn. yeni-eposta-sistemi">
              @if (newsItem().slug) {
                <p class="aciklama">
                  Haber adresi: <code>{{ SITE }}/{{ newsItem().language }}/newsItem/{{ adresOnizleme(newsItem().slug) }}</code>
                </p>
              }

              <label for="dicerik">Haber metni (HTML)</label>
              <textarea id="dicerik" name="contentHtml" rows="10" class="kod" [ngModel]="newsItem().contentHtml"
                        (ngModelChange)="duyuruAlan('contentHtml', $event)"></textarea>

              <label for="dadres">Dış bağlantı <small>— haber sayfası yoksa buraya gidilir</small></label>
              <input id="dadres" name="externalUrl" [ngModel]="newsItem().externalUrl"
                     (ngModelChange)="duyuruAlan('externalUrl', $event)">
            }

            <label for="ddil">Dil</label>
            <select id="ddil" name="language" [ngModel]="newsItem().language" (ngModelChange)="duyuruAlan('language', $event)">
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
            </select>

            <span class="dugmeler">
              <button type="submit">{{ newsItem().id ? 'Güncelle' : 'Ekle' }}</button>
              <button type="button" class="ikincil" (click)="duyuruOnizle()">Önizle</button>
              <button type="button" class="ikincil" (click)="duyuruOnizlePencerede()">Yeni pencerede önizle</button>
              @if (newsItem().id) {
                <button type="button" class="ikincil" (click)="duyuruSifirla()">Vazgeç</button>
              }
            </span>

            @if (duyuruOnizleme(); as ono) {
              <section class="onizleme">
                <h3>Önizleme</h3>
                @if (newsItem().imageUrl) {
                  <img class="haber-gorsel" [src]="newsItem().imageUrl" [alt]="newsItem().imageAlt || ''">
                } @else {
                  <div class="admin-haber-kapak-onizleme">
                    <bidb-news-cover
                      [title]="newsItem().title"
                      [category]="newsItem().category"
                      [audience]="newsItem().audience"
                      [template]="newsItem().coverTemplate"
                      [coverText]="newsItem().coverText"
                      [language]="newsItem().language === 'en' ? 'en' : 'tr'" />
                  </div>
                }
                <h4>{{ newsItem().title }}</h4>
                @if (newsItem().summary) { <p>{{ newsItem().summary }}</p> }
                <div class="icerik" [innerHTML]="ono"></div>
              </section>
            }
          </form>

          <div class="tablo-kaydir">

            <table class="yonetim-tablo">
              <thead><tr><th>Tarih</th><th>Kapak</th><th>Kategori / hedef</th><th>Başlık</th><th>Adres</th><th>Dil</th><th></th></tr></thead>
              <tbody>
                @for (d of news(); track d.id) {
                  <tr>
                    <td><small>{{ d.publishedOn }}</small></td>
                    <td>
                      @if (d.imageUrl) {
                        <img [src]="d.imageUrl" alt="" class="kucuk-gorsel">
                      } @else {
                        <span class="kucuk-sablon" [attr.data-sablon]="d.coverTemplate" aria-label="Şablon kapak">
                          {{ secenekEtiketi('templates', d.coverTemplate).slice(0, 2) }}
                        </span>
                      }
                    </td>
                    <td>
                      <strong class="tablo-kategori">{{ secenekEtiketi('categories', d.category) }}</strong>
                      <small>{{ secenekEtiketi('audiences', d.audience) }}</small>
                    </td>
                    <td>
                      {{ d.title }}
                      @if (d.documentOnly) { <span class="belge-yayin-rozeti">Belge</span> }
                    </td>
                    <td>
                      @if (d.slug) { <small><code>/{{ d.language }}/newsItem/{{ d.slug }}</code></small> }
                      @else { <span class="soluk">bağlantı</span> }
                    </td>
                    <td>{{ d.language }}</td>
                    <td>
                      <button type="button" class="ikincil" (click)="duyuruDuzenle(d)">Düzenle</button>
                      <button type="button" class="tehlike" (click)="deleteNews(d)">Sil</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

          </div>
        } @else if (sekme() === 'slider') {
          <button type="button" (click)="slaytDuzenle(null)">Yeni slideItem</button>

          @if (slideItem(); as sl) {
            <form class="duyuru-form" (ngSubmit)="saveSlide()">
              <h2>{{ sl.id ? 'Slaytı düzenle' : 'Yeni slideItem' }}</h2>
              <label for="sbaslik">Başlık</label>
              <input id="sbaslik" name="sbaslik" [ngModel]="sl.title" (ngModelChange)="slaytAlan('title', $event)">
              <label for="sgorsel">Görsel adresi</label>
              <input id="sgorsel" name="sgorsel" [ngModel]="sl.imageUrl" (ngModelChange)="slaytAlan('imageUrl', $event)" required>
              <label for="salt">Görsel açıklaması (erişilebilirlik)</label>
              <input id="salt" name="salt" [ngModel]="sl.imageAlt" (ngModelChange)="slaytAlan('imageAlt', $event)">
              <label for="sbas">Yayın başlangıcı (isteğe bağlı)</label>
              <input id="sbas" name="sbas" type="date" [ngModel]="sl.startsOn"
                     (ngModelChange)="slaytAlan('startsOn', $event)">

              <label for="sbit">Yayın bitişi (isteğe bağlı)</label>
              <input id="sbit" name="sbit" type="date" [ngModel]="sl.endsOn"
                     (ngModelChange)="slaytAlan('endsOn', $event)">
              <p class="aciklama">
                Tarih verilirse slayt yalnızca bu aralıkta gösterilir.
              </p>

              <label class="onay">
                <input type="checkbox" name="slyayin" [ngModel]="sl.published"
                       (ngModelChange)="slaytAlan('published', $event)"> Yayında
              </label>

              <label for="ssira">Sıra</label>
              <input id="ssira" name="ssira" type="number" [ngModel]="sl.sortOrder" (ngModelChange)="slaytAlan('sortOrder', +$event)">
              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="slideItem.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <div class="tablo-kaydir">

            <table class="yonetim-tablo">
              <thead><tr><th>Sıra</th><th>Başlık</th><th>Görsel</th><th>Dil</th><th></th></tr></thead>
              <tbody>
                @for (sl of slides(); track sl.id) {
                  <tr>
                    <td>{{ sl.sortOrder }}</td>
                    <td>{{ sl.title }}</td>
                    <td><small>{{ sl.imageUrl }}</small></td>
                    <td>{{ sl.language }}</td>
                    <td>
                      <button type="button" class="ikincil" (click)="slaytDuzenle(sl)">Düzenle</button>
                      <button type="button" class="tehlike" (click)="deleteSlide(sl)">Sil</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

          </div>
        } @else if (sekme() === 'menus') {
          @if (menuItem(); as md) {
            <form class="duyuru-form" (ngSubmit)="ogeKaydet()">
              <h2>{{ md.oge.id ? 'Bağlantıyı düzenle' : 'Yeni bağlantı' }}</h2>
              <label for="metiket">Etiket</label>
              <input id="metiket" name="metiket" [ngModel]="md.oge.label" (ngModelChange)="ogeAlan('label', $event)" required>

              <label for="msayfa">Sayfa (iç bağlantı)</label>
              <select id="msayfa" name="msayfa" [ngModel]="md.oge.pageId" (ngModelChange)="ogeAlan('pageId', $event ? +$event : null)">
                <option [value]="null">— dış bağlantı kullan —</option>
                @for (sf of pages(); track sf.id) {
                  <option [value]="sf.id">{{ sf.language }}/{{ sf.slug }} — {{ sf.title }}</option>
                }
              </select>

              <label for="mdis">Dış url (sayfa seçilmediyse)</label>
              <input id="mdis" name="mdis" [ngModel]="md.oge.externalUrl" (ngModelChange)="ogeAlan('externalUrl', $event)">

              <label for="msira">Sıra</label>
              <input id="msira" name="msira" type="number" [ngModel]="md.oge.sortOrder" (ngModelChange)="ogeAlan('sortOrder', +$event)">

              <label class="onay">
                <input type="checkbox" name="myeni" [ngModel]="md.oge.newTab" (ngModelChange)="ogeAlan('newTab', $event)"> Yeni sekmede açılsın
              </label>

              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="menuItem.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <button type="button" (click)="bolumDuzenle(null)">Yeni menü bölümü</button>

          @if (menuBolum(); as mb) {
            <form class="duyuru-form" (ngSubmit)="bolumKaydet()">
              <h2>{{ mb.id ? 'Bölümü düzenle' : 'Yeni bölüm' }}</h2>
              <label for="bbaslik">Bölüm başlığı</label>
              <input id="bbaslik" name="bbaslik" [ngModel]="mb.title" (ngModelChange)="bolumAlan('title', $event)" required>
              <label for="bdil">Dil</label>
              <select id="bdil" name="bdil" [ngModel]="mb.language" (ngModelChange)="bolumAlan('language', $event)">
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
              </select>
              <label for="bsira">Sıra</label>
              <input id="bsira" name="bsira" type="number" [ngModel]="mb.sortOrder" (ngModelChange)="bolumAlan('sortOrder', +$event)">
              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="menuBolum.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          @for (m of menus(); track m.id) {
            <section class="menu-bolum">
              <h2>{{ m.title }} <small>({{ m.language }})</small></h2>
              <span class="dugmeler">
                <button type="button" class="ikincil" (click)="ogeDuzenle(m.id, null)">Bağlantı ekle</button>
                <button type="button" class="ikincil" (click)="bolumDuzenle(m)">Bölümü düzenle</button>
                <button type="button" class="tehlike" (click)="bolumSil(m)">Bölümü sil</button>
              </span>
              <div class="tablo-kaydir">
                <table class="yonetim-tablo">
                  <thead><tr><th>Sıra</th><th>Etiket</th><th>Hedef</th><th></th></tr></thead>
                  <tbody>
                    @for (o of m.items; track o.id) {
                      <tr>
                        <td>{{ o.sortOrder }}</td>
                        <td>{{ o.label }}</td>
                        <td><small>{{ o.pagePath || o.externalUrl }}</small></td>
                        <td>
                          <button type="button" class="ikincil" (click)="ogeDuzenle(m.id, o)">Düzenle</button>
                          <button type="button" class="tehlike" (click)="ogeSil(o)">Sil</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }
        } @else if (sekme() === 'sosyal') {
          <button type="button" (click)="sosyalDuzenle(null)">Yeni hesap</button>

          @if (socialAccount(); as sh) {
            <form class="duyuru-form" (ngSubmit)="saveSocialAccount()">
              <h2>{{ sh.id ? 'Hesabı düzenle' : 'Yeni hesap' }}</h2>
              <label for="sag">Ağ (instagram, facebook, twitter, youtube, linkedin)</label>
              <input id="sag" name="sag" [ngModel]="sh.network" (ngModelChange)="sosyalAlan('network', $event)" required>
              <label for="sadres">Adres</label>
              <input id="sadres" name="sadres" [ngModel]="sh.url" (ngModelChange)="sosyalAlan('url', $event)" required>
              <label for="ssira2">Sıra</label>
              <input id="ssira2" name="ssira2" type="number" [ngModel]="sh.sortOrder" (ngModelChange)="sosyalAlan('sortOrder', +$event)">
              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="socialAccount.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <div class="tablo-kaydir">

            <table class="yonetim-tablo">
              <thead><tr><th>Sıra</th><th>Ağ</th><th>Adres</th><th></th></tr></thead>
              <tbody>
                @for (sh of socialAccounts(); track sh.id) {
                  <tr>
                    <td>{{ sh.sortOrder }}</td>
                    <td>{{ sh.network }}</td>
                    <td><small>{{ sh.url }}</small></td>
                    <td>
                      <button type="button" class="ikincil" (click)="sosyalDuzenle(sh)">Düzenle</button>
                      <button type="button" class="tehlike" (click)="deleteSocialAccount(sh)">Sil</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

          </div>
        } @else if (sekme() === 'iletisim') {
          <p class="aciklama">
            Alt bilgide görünen kurum bilgileri. Her telefon ve e-posta ayrı
            bir kayıttır; sıra numarası görüntüleme sırasını belirler.
          </p>

          <button type="button" (click)="kanalDuzenle(null)">Yeni kayıt</button>

          @if (kanal(); as k) {
            <form class="duyuru-form" (ngSubmit)="kanalKaydet()">
              <h2>{{ k.id ? 'Kaydı düzenle' : 'Yeni kayıt' }}</h2>

              <label for="ktur">Tür</label>
              <select id="ktur" name="ktur" [ngModel]="k.type" (ngModelChange)="kanalAlan('type', $event)">
                <option value="address">Adres</option>
                <option value="phone">Telefon</option>
                <option value="email">E-posta</option>
                <option value="fax">Faks</option>
              </select>

              <label for="kdeger">Değer</label>
              <input id="kdeger" name="kdeger" [ngModel]="k.value"
                     (ngModelChange)="kanalAlan('value', $event)" required>

              <label for="ketiket">Etiket (isteğe bağlı)</label>
              <input id="ketiket" name="ketiket" [ngModel]="k.label"
                     (ngModelChange)="kanalAlan('label', $event)"
                     placeholder="örn. Daire Başkanlığı">

              <label for="ksira">Sıra</label>
              <input id="ksira" name="ksira" type="number" [ngModel]="k.sortOrder"
                     (ngModelChange)="kanalAlan('sortOrder', +$event)">

              <label for="kdil">Dil</label>
              <select id="kdil" name="kdil" [ngModel]="k.language" (ngModelChange)="kanalAlan('language', $event)">
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
              </select>

              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="kanal.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <div class="tablo-kaydir">

            <table class="yonetim-tablo">
              <thead><tr><th>Tür</th><th>Sıra</th><th>Değer</th><th>Etiket</th><th>Dil</th><th></th></tr></thead>
              <tbody>
                @for (k of kanallar(); track k.id) {
                  <tr>
                    <td>{{ turAdi(k.type) }}</td>
                    <td>{{ k.sortOrder }}</td>
                    <td>{{ k.value }}</td>
                    <td><small>{{ k.label || '—' }}</small></td>
                    <td>{{ k.language }}</td>
                    <td>
                      <button type="button" class="ikincil" (click)="kanalDuzenle(k)">Düzenle</button>
                      <button type="button" class="tehlike" (click)="kanalSil(k)">Sil</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

          </div>

        } @else if (sekme() === 'shortcuts') {
          <button type="button" (click)="kisayolDuzenle(null)">Yeni kısayol</button>

          @if (shortcutItem(); as ks) {
            <form class="duyuru-form" (ngSubmit)="saveShortcut()">
              <h2>{{ ks.id ? 'Kısayolu düzenle' : 'Yeni kısayol' }}</h2>
              <label for="kad">Ad</label>
              <input id="kad" name="kad" [ngModel]="ks.name" (ngModelChange)="kisayolAlan('name', $event)" required>
              <label for="kadres">Adres</label>
              <input id="kadres" name="kadres" [ngModel]="ks.url" (ngModelChange)="kisayolAlan('url', $event)" required>
              <label for="kikon">İkon adresi</label>
              <input id="kikon" name="kikon" [ngModel]="ks.iconUrl" (ngModelChange)="kisayolAlan('iconUrl', $event)">
              <label for="ksira">Sıra (100 ve üzeri servis karuselinde görünür)</label>
              <input id="ksira" name="ksira" type="number" [ngModel]="ks.sortOrder" (ngModelChange)="kisayolAlan('sortOrder', +$event)">
              <label class="onay">
                <input type="checkbox" name="kyeni" [ngModel]="ks.newTab" (ngModelChange)="kisayolAlan('newTab', $event)"> Yeni sekmede açılsın
              </label>

              <label for="kstur">Nerede görünsün</label>
              <select id="kstur" name="kstur" [ngModel]="ks.type" (ngModelChange)="kisayolAlan('type', $event)">
                <option value="shortcut">Kısayol — üstteki ikon ızgarası</option>
                <option value="service">Servis — alttaki karusel</option>
              </select>

              <label class="onay">
                <input type="checkbox" name="ksyayin" [ngModel]="ks.published"
                       (ngModelChange)="kisayolAlan('published', $event)"> Yayında
              </label>
              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="shortcutItem.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <div class="tablo-kaydir">

            <table class="yonetim-tablo">
              <thead><tr><th>Sıra</th><th>Ad</th><th>Adres</th><th>Dil</th><th></th></tr></thead>
              <tbody>
                @for (ks of shortcuts(); track ks.id) {
                  <tr>
                    <td>{{ ks.sortOrder }}</td>
                    <td>{{ ks.name }}</td>
                    <td><small>{{ ks.url }}</small></td>
                    <td>{{ ks.language }}</td>
                    <td>
                      <button type="button" class="ikincil" (click)="kisayolDuzenle(ks)">Düzenle</button>
                      <button type="button" class="tehlike" (click)="deleteShortcut(ks)">Sil</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

          </div>
        } @else if (sekme() === 'tickets') {
          <bidb-contact-ticket-admin></bidb-contact-ticket-admin>
        } @else if (sekme() === 'personel') {

          <!-- Personel sayfası HTML metni değil, birim ve kişi kayıtlarıdır;
               düzenlemesi kendi bileşeninde durur. -->
          <bidb-staff-editor></bidb-staff-editor>

        } @else if (sekme() === 'girisKayitlari') {

          <bidb-login-events-admin></bidb-login-events-admin>

        } @else if (sekme() === 'islemGunlugu') {

          <bidb-audit-log-admin></bidb-audit-log-admin>

        } @else if (sekme() === 'hakkinda') {

          <section class="hakkinda-bolum">
            <h2>Bu yönetim paneli nedir?</h2>
            <p>
              Bu panel, Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı'nın
              kurumsal internet sitesini (bidb.hacettepe.edu.tr) yöneten
              içerik yönetim sistemidir. Sayfa metinleri, duyurular, slider,
              kısayollar, menüler, personel kayıtları, iletişim bilgileri ve
              gelen iletişim talepleri buradan düzenlenir; sitenin SEO ve
              gerçek kullanıcı performans ölçümleri "SEO ve Performans"
              sekmesinden takip edilir.
            </p>
            <p>
              Sistem Angular (sunucu tarafı render ile) ön yüz ve Spring Boot
              REST servisi olmak üzere iki ayrı uygulamadan oluşur;
              PostgreSQL veritabanı kullanır. Kaynak sayfa metinleri aktarım
              sırasında birebir korunmuş, yalnızca teknik/yapısal hatalar
              (bozuk bağlantı, eksik alt metin, erişilebilirlik) düzeltilmiştir.
            </p>

            <h2>Menülerin ve içeriğin dinamikliği</h2>
            <p>
              Sitede görünen hiçbir menü, kısayol ya da sayfa sırası kodun
              içine gömülü değildir — hepsi veritabanında kayıtlıdır ve bu
              panelin "Menüler", "Kısayollar" ve "Sayfalar" sekmelerinden
              düzenlenir. Bir bölüm eklemek, bir sayfayı taşımak ya da bir
              bağlantının hedefini değiştirmek için kod değişikliği ya da
              yeniden dağıtım (deployment) gerekmez; değişiklik kaydedildiği
              anda, panelden çıkış yapılmadan siteye yansır. Bu, sitenin
              yapısının zaman içinde Bilgi İşlem personeli tarafından, bir
              yazılımcıya ihtiyaç duymadan güncellenebilmesi için bilinçli
              bir tasarım tercihidir.
            </p>

            <h2>Mimari tercihler</h2>
            <p>
              Kullanılan teknoloji yığını (Angular + Spring Boot + PostgreSQL,
              sunucu tarafı render, aşamalı hidrasyon, sayfa tipine göre
              bölünmüş stil paketleri gibi performans kararları dahil) ve
              genel mimari yaklaşım, Bilgi İşlem Daire Başkanlığı tarafından
              belirlenmiş; uygulama bu çerçeve içinde geliştirilmiştir.
              Aktarılan sayfa içeriğinin birebir korunması, kurumsal kırmızı/
              lacivert kimliğin tutarlı kullanımı ve sade, okunabilir bir
              tasarım dili gibi ilkeler de baştan itibaren bu çerçevenin
              bir parçasıydı.
            </p>

            <h2>Geliştirme notu</h2>
            <p>
              Bu yönetim paneli ve site, Bilgi İşlem Daire Başkanlığı'nda
              <strong> 2026 yılı yaz stajyerliği</strong> kapsamında, Personel
              biriminden <strong>Şahin Kaan Aytaç</strong>'ın önderliğinde
              geliştirilmiştir. Kısa bir staj süresine sığdırılmış olmasına
              rağmen sistem uçtan uca (içerik aktarımından SEO'ya, mobil
              uyuma, güvenlik sertleştirmesine kadar) gözden geçirilmeye
              çalışılmıştır; eksik ya da geliştirilebilecek noktalar için
              geri bildirim her zaman değerlidir.
            </p>
            <p>
              Geliştirenler:
            </p>
            <ul class="hakkinda-liste">
              <li><strong>Ahmet Çelen</strong> — <a href="mailto:ahmetcelen@hacettepe.edu.tr">ahmetcelen&#64;hacettepe.edu.tr</a></li>
              <li><strong>Yusuf Nurülgür</strong> — <a href="mailto:yusufnurulgur@hacettepe.edu.tr">yusufnurulgur&#64;hacettepe.edu.tr</a></li>
            </ul>
            <p class="hakkinda-not">
              Sistem, sürdürülebilirlik ve kurumsallık ilkesiyle
              belgelenmiştir; ileride görev alacak ekiplerin devir sürecini
              kolaylaştırması amaçlanmıştır. Dinamik sistemler sayesinde web
              sitesi, kod değişikliği gerekmeden bu panel üzerinden
              yönetilebilir durumdadır.
            </p>
          </section>

        }
            </div>
          </main>

          <nav class="mobil-alt-nav" aria-label="Mobil yönetim menüsü">
            <button type="button" [class.etkin]="sekme() === 'analytics'" (click)="mobilSekmeAc('analytics')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>
              <span>Analitik</span>
            </button>
            <button type="button" [class.etkin]="sekme() === 'pages' || sekme() === 'news'" (click)="mobilSekmeAc('pages')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8m-8 4h8"/></svg>
              <span>İçerik</span>
            </button>
            <button type="button" [class.etkin]="sekme() === 'slider' || sekme() === 'shortcuts' || sekme() === 'menus'" (click)="mobilSekmeAc('slider')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18v13H3zM8 21h8m-4-4v4"/></svg>
              <span>Site</span>
            </button>
            <button type="button" [class.etkin]="sekme() === 'quality' || sekme() === 'personel' || sekme() === 'tickets' || sekme() === 'iletisim' || sekme() === 'sosyal'" (click)="mobilSekmeAc('quality')">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="9" y="9" width="6" height="6" rx="1"/>
                <circle cx="5" cy="5" r="2"/>
                <circle cx="19" cy="5" r="2"/>
                <circle cx="5" cy="19" r="2"/>
                <circle cx="19" cy="19" r="2"/>
                <path d="m7 7 2.5 2.5M17 7l-2.5 2.5M7 17l2.5-2.5M17 17l-2.5-2.5"/>
              </svg>
              <span>Yönetim</span>
            </button>
          </nav>

          @if (mobilMenuAcik()) {
            <div class="mobil-menu-perde" (click)="mobilMenuAcik.set(false)"></div>
            <div class="mobil-alt-menu" role="dialog" aria-modal="true" aria-label="Yönetim menüsü"
                 (keydown.escape)="mobilMenuAcik.set(false)">
              <header>
                <strong>Yönetim Menüsü</strong>
                <button type="button" class="ikincil" (click)="mobilMenuAcik.set(false)" aria-label="Menüyü kapat">
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"
                       fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="M6 6l12 12M18 6 6 18"/>
                  </svg>
                </button>
              </header>
              <div>
                @for (oge of MOBIL_MENU_OGELERI; track oge.tab) {
                  <button type="button" [class.etkin]="sekme() === oge.tab" (click)="mobilMenuSec(oge.tab)">
                    <span>{{ oge.label }}</span>
                    <small>{{ oge.note }}</small>
                  </button>
                }
              </div>
              <button type="button" class="mobil-cikis" (click)="api.cikis()">Çıkış</button>
            </div>
          }

          @if (acikVitalKaydi(); as av) {
            <div class="vital-perde" (click)="acikVitalKaydi.set(null)"></div>
            <div class="vital-pencere" role="dialog" aria-modal="true" [attr.aria-label]="av.metric + ' ölçüm ayrıntısı'"
                 [attr.data-rating]="av.rating" (keydown.escape)="acikVitalKaydi.set(null)">
              <header>
                <div>
                  <span class="vital-pencere-metrik">{{ av.metric }}</span>
                  <strong class="vital-pencere-deger">{{ metrikDegeri(av.metric, av.p75) }}</strong>
                </div>
                <button type="button" class="ikincil" (click)="acikVitalKaydi.set(null)" aria-label="Kapat">
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"
                       fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="M6 6l12 12M18 6 6 18"/>
                  </svg>
                </button>
              </header>

              <div class="vital-pencere-durum">
                <span class="vital-pencere-rozet" [attr.data-rating]="av.rating">{{ dereceEtiketi(av.rating) }}</span>
                <span>{{ av.path }} · {{ av.samples }} örnek · 75. yüzdelik</span>
              </div>

              <div class="vital-pencere-govde">
                <section>
                  <span class="vital-pencere-baslik">Teknik tanım</span>
                  <p>{{ VITAL_ACIKLAMA[av.metric].teknik }}</p>
                </section>
                <section>
                  <span class="vital-pencere-baslik">Sade dille</span>
                  <p>{{ VITAL_ACIKLAMA[av.metric].sade }}</p>
                </section>
              </div>
            </div>
          }
        </div>
      }

      @if (erisilebilirlikAcik()) {
        <bidb-accessibility-menu [language]="dilServisi.dil()"></bidb-accessibility-menu>
      }
    </div>
  `
})
export class AdminPanelComponent {

  /** Sol raydaki bölümlerin numarası ve adı; başlıkta da kullanılır. */
  private readonly BOLUMLER: Record<string, { no: string; ad: string }> = {
    analytics: { no: '01', ad: 'Analitik' },
    quality: { no: '02', ad: 'SEO ve Performans' },
    pages: { no: '03', ad: 'Sayfalar' },
    news: { no: '04', ad: 'Duyurular' },
    slider: { no: '05', ad: 'Slider' },
    shortcuts: { no: '06', ad: 'Kısayollar' },
    menus: { no: '07', ad: 'Menüler' },
    sosyal: { no: '08', ad: 'Sosyal Medya' },
    iletisim: { no: '09', ad: 'İletişim Bilgileri' },
    tickets: { no: '10', ad: 'İletişim Talepleri' },
    personel: { no: '11', ad: 'Personel' },
    islemGunlugu: { no: '12', ad: 'İşlem Günlüğü' },
    girisKayitlari: { no: '13', ad: 'Güvenlik Kayıtları' },
    hakkinda: { no: '14', ad: 'Yazılım Hakkında' }
  };

  protected bolumNo(): string {
    return this.BOLUMLER[this.sekme()]?.no ?? '00';
  }

  protected bolumBasligi(): string {
    return this.BOLUMLER[this.sekme()]?.ad ?? 'Yönetim';
  }
  protected api = inject(AdminApiService);
  protected dilServisi = inject(AdminDilServisi);

  protected dilDegistir(): void {
    this.dilServisi.degistir(this.dilServisi.dil() === 'tr' ? 'en' : 'tr');
  }

  /**
   * Erişilebilirlik menüsü varsayılan olarak KAPALI — her sayfada durup
   * dikkat dağıtmasın diye. İhtiyacı olan personel bir kez açtığında tercih
   * kalıcı olur (localStorage) ve sonraki tüm girişlerde (giriş ekranı dahil)
   * otomatik açık gelir.
   */
  protected erisilebilirlikAcik = signal(this.erisilebilirlikKayitli());

  private erisilebilirlikKayitli(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem('bidb-yonetim-erisilebilirlik') === '1';
  }

  protected erisilebilirlikDegistir(): void {
    const yeni = !this.erisilebilirlikAcik();
    this.erisilebilirlikAcik.set(yeni);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bidb-yonetim-erisilebilirlik', yeni ? '1' : '0');
    }
  }
  protected publicApi = inject(Api);
  private temizleyici = inject(DomSanitizer);

  protected kullanici = '';
  protected parola = '';
  protected hata = signal('');
  protected bilgi = signal('');
  protected calisiyor = signal(false);

  protected arkaPlanGorseli = signal<string | null>(null);

  protected sekme = signal<AdminTab>('analytics');
  protected mobilMenuAcik = signal(false);

  /** Mobilde başlığın yanındaki "menü" düğmesiyle açılan tam bölüm listesi
   *  (masaüstü sol rayın 11 öğesiyle aynı hedefe gider). */
  protected readonly MOBIL_MENU_OGELERI: MobileMenuItem[] = [
    { tab: 'analytics', label: 'Analitik', note: 'Ziyaret ve trafik raporu' },
    { tab: 'quality', label: 'SEO ve Performans', note: 'Kalite ölçümleri' },
    { tab: 'pages', label: 'Sayfalar', note: 'Metin, URL ve SEO' },
    { tab: 'news', label: 'Duyurular', note: 'Haber ve duyuru yayınları' },
    { tab: 'slider', label: 'Slider', note: 'Ana sayfa vitrini' },
    { tab: 'shortcuts', label: 'Kısayollar', note: 'Servis bağlantıları' },
    { tab: 'menus', label: 'Menüler', note: 'Site navigasyonu' },
    { tab: 'sosyal', label: 'Sosyal Medya', note: 'Kurumsal hesaplar' },
    { tab: 'iletisim', label: 'İletişim Bilgileri', note: 'Kurumsal iletişim bilgileri' },
    { tab: 'tickets', label: 'İletişim Talepleri', note: 'Form kayıtları ve takip' },
    { tab: 'personel', label: 'Personel', note: 'Birim ve personel kayıtları' },
    { tab: 'islemGunlugu', label: 'İşlem Günlüğü', note: 'Panelde yapılan değişiklikler' },
    { tab: 'girisKayitlari', label: 'Güvenlik Kayıtları', note: 'Giriş denemeleri kaydı' },
    { tab: 'hakkinda', label: 'Yazılım Hakkında', note: 'Bu panel hakkında bilgi' }
  ];
  protected analytics = signal<AnalyticsReport | null>(null);
  protected analyticsLoading = signal(false);
  protected analyticsHata = signal('');
  protected quality = signal<QualitySummary | null>(null);
  protected qualityLoading = signal(false);
  protected qualityHata = signal('');
  /** Ayrıntı penceresi açık olan Core Web Vitals kaydı; kapalıyken null. */
  protected acikVitalKaydi = signal<QualityVitalScore | null>(null);

  /** Core Web Vitals kartına tıklanınca açılan pencerede, hem teknik hem sade dille açıklama. */
  protected readonly VITAL_ACIKLAMA: Record<string, { teknik: string; sade: string }> = {
    LCP: {
      teknik: 'Sayfadaki en büyük görünür öğenin (genelde ana görsel ya da başlık) ekrana çizildiği an.',
      sade: "Sayfanın \"yüklendi\" hissi verdiği an — ne kadar erken, o kadar iyi."
    },
    INP: {
      teknik: 'Bir tıklama ya da dokunmadan, tarayıcının ekranı güncellemesine kadar geçen süre.',
      sade: 'Bir düğmeye bastığınızda sitenin ne kadar hızlı tepki verdiği.'
    },
    CLS: {
      teknik: 'Yükleme sırasında içeriğin kaydığı toplam görsel mesafenin ölçüsü.',
      sade: "Sayfa yüklenirken metnin/düğmelerin yerinin oynayıp oynamadığı — 0'a yakın olması, tıklarken hedefin kaymaması demek."
    },
    FCP: {
      teknik: 'Tarayıcının ekrana ilk içeriği (metin ya da görsel) boyadığı an.',
      sade: 'Boş beyaz ekranın ne kadar sürdüğü.'
    },
    TTFB: {
      teknik: 'Sunucunun isteğe ilk baytı döndürme süresi.',
      sade: 'Sunucunun ne kadar hızlı yanıt verdiği — sayfa henüz çizilmeden önceki gecikme.'
    }
  };

  protected pages = signal<AdminPage[]>([]);
  protected news = signal<AdminNews[]>([]);
  protected duyuruSecenekleri = signal<NewsOptions>({ categories: [], audiences: [], templates: [] });
  protected secili = signal<AdminPage | null>(null);
  protected newsItem = signal<AdminNews>(this.bosDuyuru());

  /**
   * Duyuru başlığı için canlı SEO uyum kontrolü. Engellemez — yalnızca
   * bilgilendirir; "SEO ve Performans" sekmesindeki puanlamayla aynı
   * 25-70 karakter aralığını kullanır (bkz. backend AdminQualityController).
   */
  protected duyuruBaslikSeoDurumu = computed(() => {
    const baslik = (this.newsItem().title || '').trim();
    if (!baslik) return null;
    const uzunluk = baslik.length;
    if (uzunluk < 25) {
      return {
        uyumlu: false,
        mesaj: `SEO uyarısı: başlık ${uzunluk} karakter (önerilen: 25-70). Konuyu ve kime hitap ettiğini biraz daha açıklayıcı yazmayı deneyin.`
      };
    }
    if (uzunluk > 70) {
      return {
        uyumlu: false,
        mesaj: `SEO uyarısı: başlık ${uzunluk} karakter (önerilen: 25-70). 70'i aşan kısım arama sonuçlarında kesilebilir; kısaltmayı deneyin.`
      };
    }
    return { uyumlu: true, mesaj: `Başlık uzunluğu (${uzunluk} karakter) SEO için uygun aralıkta.` };
  });
  protected slides = signal<Slide[]>([]);
  protected shortcuts = signal<Shortcut[]>([]);
  protected slideItem = signal<Slide | null>(null);
  protected shortcutItem = signal<Shortcut | null>(null);
  protected menus = signal<AdminMenu[]>([]);
  protected menuItem = signal<{ menuId: number; oge: AdminMenuItem } | null>(null);
  protected menuBolum = signal<{ id: number | null; language: string; position: string; title: string; sortOrder: number } | null>(null);
  protected socialAccounts = signal<AdminSocialAccount[]>([]);
  protected socialAccount = signal<AdminSocialAccount | null>(null);
  protected acikSayfa = signal<AdminPage | null>(null);
  protected gorselYukleniyor = signal(false);
  protected belgeYukleniyor = signal(false);
  protected kanallar = signal<ContactChannel[]>([]);
  protected kanal = signal<ContactChannel | null>(null);

  /** Adres önizlemelerinde gösterilen site adresi. */
  protected readonly SITE = 'bidb.hacettepe.edu.tr';
  protected duyuruOnizleme = signal<SafeHtml | null>(null);
  protected yeniSayfa = signal<{ language: string; slug: string; title: string } | null>(null);
  protected iletisim = signal<ContactInfo>({
    iletisim_adres: '', iletisim_telefon: '', iletisim_eposta: '', iletisim_faks: ''
  });

  constructor() {
    if (this.api.girisYapildi()) {
      this.sayfalariYukle();
      this.sayilariYukle();
      this.analitikYukle();
      this.kaliteYukle();
    } else {
      this.publicApi.slider('tr').subscribe(slides => {
        if (slides && slides.length > 0) {
          const rastgele = slides[Math.floor(Math.random() * slides.length)];
          this.arkaPlanGorseli.set(rastgele.imageUrl);
        }
      });
    }
  }

  protected giris(): void {
    this.hata.set('');
    this.calisiyor.set(true);
    this.api.girisDene(this.kullanici, this.parola).subscribe({
      next: () => {
        this.api.girisOnayla();
        this.sayfalariYukle();
        this.sayilariYukle();
        this.analitikYukle();
        this.kaliteYukle();
        this.calisiyor.set(false);
        this.parola = '';
      },
      error: () => {
        this.hata.set('Kullanıcı adı veya parola hatalı.');
        this.calisiyor.set(false);
      }
    });
  }

  protected duzenle(s: AdminPage): void {
    this.secili.set(this.secili()?.id === s.id ? null : { ...s });
  }

  protected sekmeKalite(): void {
    this.sekme.set('quality');
    this.kaliteYukle();
  }

  protected sekmeAnalitik(): void {
    this.sekme.set('analytics');
    this.analitikYukle();
  }

  private analitikYenileSiniri = tiklamaSinirlayici();

  protected analitikYukle(): void {
    if (!this.analitikYenileSiniri()) return;
    this.analyticsLoading.set(true);
    this.api.analyticsReport(12).subscribe({
      next: (report) => {
        this.analytics.set(report);
        this.analyticsLoading.set(false);
        this.analyticsHata.set('');
      },
      error: (e) => {
        this.analytics.set(null);
        this.analyticsLoading.set(false);
        this.analyticsHata.set(this.baglantiHatasi(e));
      }
    });
  }

  /** Bir HTTP hatasından, operatöre gösterilecek kısa ve somut bir açıklama üretir. */
  private baglantiHatasi(e: { status?: number }): string {
    if (!e.status) return 'Sunucuya ulaşılamadı.';
    if (e.status === 401 || e.status === 403) return `Yetki hatası (${e.status}) — oturum sona ermiş olabilir.`;
    return `Sunucu ${e.status} hatası döndürdü.`;
  }

  protected sayiBicimle(value: number): string {
    return new Intl.NumberFormat('tr-TR').format(value);
  }

  protected degisimEtiketi(value: number | null): string {
    if (value === null) return 'Yeni';
    if (value === 0) return 'Değişmedi';
    return `${value > 0 ? '+' : ''}%${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(value)}`;
  }

  protected grafikYuksekligi(value: number, points: { views: number }[]): number {
    const max = Math.max(1, ...points.map((point) => point.views));
    return Math.max(8, Math.round(value * 100 / max));
  }

  protected ayEtiketi(value: string): string {
    const [year, month] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('tr-TR', { month: 'short', year: '2-digit' })
      .format(new Date(year, month - 1, 1));
  }

  protected cihazEtiketi(value: string): string {
    return ({ mobile: 'Telefon', tablet: 'Tablet', desktop: 'Masaüstü' } as Record<string, string>)[value] ?? value;
  }

  protected kaynakEtiketi(value: string): string {
    return ({
      direct: 'Doğrudan', internal: 'Site içi', search: 'Arama motoru',
      social: 'Sosyal medya', external: 'Diğer siteler'
    } as Record<string, string>)[value] ?? value;
  }

  protected mobilSekmeAc(tab: AdminTab): void {
    switch (tab) {
      case 'analytics': this.sekmeAnalitik(); break;
      case 'quality': this.sekmeKalite(); break;
      case 'news': this.sekmeDuyuru(); break;
      case 'slider': this.sekmeSlider(); break;
      case 'shortcuts': this.sekmeKisayol(); break;
      case 'menus': this.sekmeMenu(); break;
      case 'sosyal': this.sekmeSosyal(); break;
      case 'iletisim': this.sekmeIletisim(); break;
      case 'tickets': this.sekme.set('tickets'); break;
      default: this.sekme.set(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Tam menüden bir bölüm seçilince hem o sekmeye geçilir hem menü kapanır. */
  protected mobilMenuSec(tab: AdminTab): void {
    this.mobilSekmeAc(tab);
    this.mobilMenuAcik.set(false);
  }

  private kaliteYenileSiniri = tiklamaSinirlayici();

  protected kaliteYukle(): void {
    if (!this.kaliteYenileSiniri()) return;
    this.qualityLoading.set(true);
    this.api.qualitySummary().subscribe({
      next: (summary) => {
        this.quality.set(summary);
        this.qualityLoading.set(false);
        this.qualityHata.set('');
      },
      error: (e) => {
        this.quality.set(null);
        this.qualityLoading.set(false);
        this.qualityHata.set(this.baglantiHatasi(e));
      }
    });
  }

  protected puanSeviyesi(score: number | null): string {
    if (score === null) return 'unknown';
    if (score >= 90) return 'good';
    if (score >= 60) return 'needs-improvement';
    return 'poor';
  }

  protected dereceEtiketi(rating: string): string {
    return rating === 'good' ? 'İyi' : rating === 'needs-improvement' ? 'İyileştirilmeli' : 'Zayıf';
  }

  protected metrikDegeri(metric: string, value: number): string {
    return metric === 'CLS' ? value.toFixed(3) : `${Math.round(value)} ms`;
  }

  protected tarihSaat(value: string): string {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'short', timeStyle: 'short'
    }).format(new Date(value));
  }

  protected alanDegis(alan: keyof AdminPage, value: unknown): void {
    const s = this.secili();
    if (s) this.secili.set({ ...s, [alan]: value } as AdminPage);
  }

  protected duyuruAlan(alan: keyof AdminNews, value: unknown): void {
    this.newsItem.set({ ...this.newsItem(), [alan]: value } as AdminNews);
  }

  protected saveSeo(): void {
    const s = this.secili();
    if (!s) return;
    this.api.saveSeo(s.id, s).subscribe({
      next: (guncel) => {
        this.pages.update((liste) => liste.map((x) => (x.id === guncel.id ? guncel : x)));
        this.secili.set(null);
        this.mesaj(guncel.title + ' güncellendi.');
      },
      error: () => this.mesaj('Kaydedilemedi.')
    });
  }

  protected sekmeDuyuru(): void {
    this.sekme.set('news');
    this.api.news().subscribe((d) => this.news.set(d));
    this.api.newsOptions().subscribe((s) => this.duyuruSecenekleri.set(s));
  }

  protected duyuruKaydet(): void {
    const d = this.newsItem();
    if (d.documentOnly && !d.externalUrl?.trim()) {
      this.mesaj('Belge yayını için önce bir belge yükleyin veya belge adresi girin.');
      return;
    }
    const istek = d.id ? this.api.updateNews(d.id, d) : this.api.addNews(d);
    istek.subscribe({
      next: () => {
        this.duyuruSifirla();
        this.sekmeDuyuru();
        this.mesaj('Duyuru kaydedildi.');
      },
      error: (e) => this.mesaj(typeof e?.error === 'string' ? e.error : 'Duyuru kaydedilemedi.')
    });
  }

  protected deleteNews(d: AdminNews): void {
    if (!d.id) return;
    this.api.deleteNews(d.id).subscribe({
      next: () => {
        this.news.update((liste) => liste.filter((x) => x.id !== d.id));
        this.mesaj('Duyuru silindi.');
      },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected duyuruDuzenle(d: AdminNews): void {
    this.newsItem.set({ ...d });
  }

  protected secenekEtiketi(tur: keyof NewsOptions, anahtar: string): string {
    return this.duyuruSecenekleri()[tur].find((s) => s.key === anahtar)?.trLabel ?? anahtar;
  }

  protected secenekAciklamasi(tur: keyof NewsOptions, anahtar: string): string {
    return this.duyuruSecenekleri()[tur].find((s) => s.key === anahtar)?.description ?? '';
  }

  protected duyuruSifirla(): void {
    this.newsItem.set(this.bosDuyuru());
  }

  protected sekmeSlider(): void {
    this.sekme.set('slider');
    this.api.slides().subscribe((l) => this.slides.set(l));
  }

  protected sekmeKisayol(): void {
    this.sekme.set('shortcuts');
    this.api.shortcuts().subscribe((l) => this.shortcuts.set(l));
  }

  protected slaytDuzenle(s: Slide | null): void {
    this.slideItem.set(s ? { ...s } : { id: null, language: 'tr', title: '', subtitle: '', imageUrl: '', imageAlt: '', linkUrl: null, startsOn: null, endsOn: null, sortOrder: 0, published: true });
  }

  protected slaytAlan(alan: keyof Slide, value: unknown): void {
    const s = this.slideItem();
    if (s) this.slideItem.set({ ...s, [alan]: value } as Slide);
  }

  protected saveSlide(): void {
    const s = this.slideItem();
    if (!s) return;
    this.api.saveSlide(s).subscribe({
      next: () => { this.slideItem.set(null); this.sekmeSlider(); this.mesaj('Slayt kaydedildi.'); },
      error: () => this.mesaj('Slayt kaydedilemedi.')
    });
  }

  protected deleteSlide(s: Slide): void {
    if (!s.id) return;
    this.api.deleteSlide(s.id).subscribe({
      next: () => { this.slides.update((l) => l.filter((x) => x.id !== s.id)); this.mesaj('Slayt silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected kisayolDuzenle(k: Shortcut | null): void {
    this.shortcutItem.set(k ? { ...k } : { id: null, language: 'tr', name: '', iconUrl: '', url: '', newTab: false, type: 'shortcut', sortOrder: 0, published: true });
  }

  protected kisayolAlan(alan: keyof Shortcut, value: unknown): void {
    const k = this.shortcutItem();
    if (k) this.shortcutItem.set({ ...k, [alan]: value } as Shortcut);
  }

  protected saveShortcut(): void {
    const k = this.shortcutItem();
    if (!k) return;
    this.api.saveShortcut(k).subscribe({
      next: () => { this.shortcutItem.set(null); this.sekmeKisayol(); this.mesaj('Kısayol kaydedildi.'); },
      error: () => this.mesaj('Kısayol kaydedilemedi.')
    });
  }

  protected deleteShortcut(k: Shortcut): void {
    if (!k.id) return;
    this.api.deleteShortcut(k.id).subscribe({
      next: () => { this.shortcuts.update((l) => l.filter((x) => x.id !== k.id)); this.mesaj('Kısayol silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected sekmeMenu(): void {
    this.sekme.set('menus');
    this.api.menus().subscribe((l) => this.menus.set(l));
  }

  protected ogeDuzenle(menuId: number, o: AdminMenuItem | null): void {
    this.menuItem.set({
      menuId,
      oge: o ? { ...o } : { id: null, label: '', pageId: null, pagePath: null, externalUrl: '', newTab: false, sortOrder: 0 }
    });
  }

  protected ogeAlan(alan: keyof AdminMenuItem, value: unknown): void {
    const d = this.menuItem();
    if (d) this.menuItem.set({ menuId: d.menuId, oge: { ...d.oge, [alan]: value } as AdminMenuItem });
  }

  protected ogeKaydet(): void {
    const d = this.menuItem();
    if (!d) return;
    this.api.saveMenuItem(d.menuId, d.oge).subscribe({
      next: () => { this.menuItem.set(null); this.sekmeMenu(); this.mesaj('Menü bağlantısı kaydedildi.'); },
      error: () => this.mesaj('Kaydedilemedi.')
    });
  }

  protected ogeSil(o: AdminMenuItem): void {
    if (!o.id) return;
    this.api.deleteMenuItem(o.id).subscribe({
      next: () => { this.sekmeMenu(); this.mesaj('Bağlantı silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected sekmeSosyal(): void {
    this.sekme.set('sosyal');
    this.api.socialAccounts().subscribe((l) => this.socialAccounts.set(l));
  }

  protected sosyalDuzenle(s: AdminSocialAccount | null): void {
    this.socialAccount.set(s ? { ...s } : { id: null, network: '', url: '', sortOrder: 0, published: true });
  }

  protected sosyalAlan(alan: keyof AdminSocialAccount, value: unknown): void {
    const s = this.socialAccount();
    if (s) this.socialAccount.set({ ...s, [alan]: value } as AdminSocialAccount);
  }

  protected saveSocialAccount(): void {
    const s = this.socialAccount();
    if (!s) return;
    this.api.saveSocialAccount(s).subscribe({
      next: () => { this.socialAccount.set(null); this.sekmeSosyal(); this.mesaj('Sosyal medya hesabı kaydedildi.'); },
      error: () => this.mesaj('Kaydedilemedi.')
    });
  }

  protected deleteSocialAccount(s: AdminSocialAccount): void {
    if (!s.id) return;
    this.api.deleteSocialAccount(s.id).subscribe({
      next: () => { this.socialAccounts.update((l) => l.filter((x) => x.id !== s.id)); this.mesaj('Hesap silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected bolumDuzenle(m: AdminMenu | null): void {
    this.menuBolum.set(m
      ? { id: m.id, language: m.language, position: m.position, title: m.title, sortOrder: m.sortOrder }
      : { id: null, language: 'tr', position: 'sol', title: '', sortOrder: 0 });
  }

  protected bolumAlan(alan: 'language' | 'position' | 'title' | 'sortOrder', value: unknown): void {
    const m = this.menuBolum();
    if (m) this.menuBolum.set({ ...m, [alan]: value });
  }

  protected bolumKaydet(): void {
    const m = this.menuBolum();
    if (!m) return;
    this.api.saveMenuSection(m).subscribe({
      next: () => { this.menuBolum.set(null); this.sekmeMenu(); this.mesaj('Menü bölümü kaydedildi.'); },
      error: () => this.mesaj('Kaydedilemedi.')
    });
  }

  protected bolumSil(m: AdminMenu): void {
    this.api.deleteMenuSection(m.id).subscribe({
      next: () => { this.sekmeMenu(); this.mesaj('Menü bölümü silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  /** Sayfanın tüm düzenlenebilir yönlerini açar. */
  protected openPage(s: AdminPage): void {
    this.secili.set(null);
    this.acikSayfa.set(this.acikSayfa()?.id === s.id ? null : s);
  }

  protected refreshPages(): void {
    this.api.pages().subscribe((l) => this.pages.set(l));
  }

  protected yeniSayfaAc(): void {
    this.yeniSayfa.set({ language: 'tr', slug: '', title: '' });
  }

  protected yeniSayfaAlan(alan: 'language' | 'slug' | 'title', value: unknown): void {
    const y = this.yeniSayfa();
    if (y) this.yeniSayfa.set({ ...y, [alan]: value as string });
  }

  protected yeniSayfaKaydet(): void {
    const y = this.yeniSayfa();
    if (!y) return;
    this.api.createPage({ ...y, contentHtml: '<div class="icerik"><p></p></div>' }).subscribe({
      next: (olusan) => {
        this.yeniSayfa.set(null);
        // Yeni sayfa oluşturulur oluşturulmaz metin ve SEO alanları açılır;
        // kullanıcı 70 satırlık listede sayfayı aramak zorunda kalmaz.
        const id = (olusan as { id?: number })?.id;
        this.api.pages().subscribe((l) => {
          this.pages.set(l);
          const yeni = l.find((x) => x.id === id);
          if (yeni) {
            this.acikSayfa.set(yeni);
            this.secili.set({ ...yeni });
          }
        });
        this.mesaj('Sayfa oluşturuldu. Metnini ve arama motoru bilgilerini şimdi girebilirsiniz.');
      },
      error: (e) => this.mesaj(typeof e?.error === 'string' ? e.error : 'Oluşturulamadı.')
    });
  }

  /** Duyuru görseli yüklenir ve adresi forma yazılır. */
  protected duyuruGorselSec(olay: Event): void {
    const girdi = olay.target as HTMLInputElement;
    const dosya = girdi.files?.[0];
    if (!dosya) return;
    this.gorselYukleniyor.set(true);
    this.api.uploadFile(dosya).subscribe({
      next: (s) => {
        this.gorselYukleniyor.set(false);
        girdi.value = '';
        this.duyuruAlan('imageUrl', s.url);
        if (!this.newsItem().imageAlt) this.duyuruAlan('imageAlt', this.newsItem().title);
      },
      error: (e) => {
        this.gorselYukleniyor.set(false);
        this.mesaj(typeof e?.error === 'string' ? e.error : 'Görsel yüklenemedi.');
      }
    });
  }

  protected duyuruGorselKaldir(): void {
    this.newsItem.set({ ...this.newsItem(), imageUrl: null, imageAlt: null });
  }

  protected duyuruBelgeModu(etkin: boolean): void {
    this.newsItem.set({ ...this.newsItem(), documentOnly: etkin });
  }

  /** Belge yüklenir ve duyurunun doğrudan açılan bağlantısı olarak atanır. */
  protected duyuruBelgeSec(olay: Event): void {
    const girdi = olay.target as HTMLInputElement;
    const dosya = girdi.files?.[0];
    if (!dosya) return;
    this.belgeYukleniyor.set(true);
    this.api.uploadFile(dosya).subscribe({
      next: (sonuc) => {
        this.belgeYukleniyor.set(false);
        girdi.value = '';
        this.duyuruAlan('externalUrl', sonuc.url);
      },
      error: (e) => {
        this.belgeYukleniyor.set(false);
        this.mesaj(typeof e?.error === 'string' ? e.error : 'Belge yüklenemedi.');
      }
    });
  }

  /**
   * Adresin sunucuda alacağı hâli gösterir: Türkçe karakterler dönüştürülür,
   * boşluklar tireye çevrilir. Sunucudaki sadeleştirmenin aynısıdır.
   */
  protected adresOnizleme(ham: string | null): string {
    if (!ham) return '';
    return ham.trim().toLocaleLowerCase('tr')
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
      .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
  }

  protected duyuruOnizle(): void {
    this.duyuruOnizleme.set(this.temizleyici.bypassSecurityTrustHtml(disaBaglantilariGuvenceyeAl(this.newsItem().contentHtml ?? '')));
  }

  /**
   * Kaydetmeden önce, ayrı bir tarayıcı PENCERESİNDE (yeni sekme değil —
   * boyut/araç çubuğu özellikleri verilerek tarayıcının bunu ayrı pencere
   * olarak açması sağlanır) yayınlanmış görünümün önizlemesi.
   */
  protected duyuruOnizlePencerede(): void {
    const item = this.newsItem();
    const govde = disaBaglantilariGuvenceyeAl(item.contentHtml ?? '');
    // "noopener" burada KASITLI OLARAK kullanılmaz: bu pencerenin içeriğini
    // document.write() ile biz yazıyoruz (dışarıdan bir URL yüklenmiyor,
    // yazılan HTML'de <script> de yok), yani reverse-tabnabbing riski hiç
    // yok — ama noopener verilirse tarayıcı pencereye referans DÖNMEZ
    // (kasıtlı güvenlik davranışı), bu da document.write() çağrısını hiç
    // çalıştıramadan fonksiyonun erken çıkmasına yol açıyordu; pencere
    // boş ("about:blank") açılıp öyle kalıyordu.
    const pencere = window.open('', 'bidbDuyuruOnizleme', 'width=860,height=920');
    if (!pencere) return;

    const kacir = (deger: string) => deger
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const baslik = kacir(item.title || 'Duyuru');
    const kapak = item.imageUrl
      ? `<img src="${kacir(item.imageUrl)}" alt="${kacir(item.imageAlt || '')}" style="width:100%;max-height:360px;object-fit:cover;border-radius:4px;margin-bottom:24px;">`
      : '';

    pencere.document.open();
    pencere.document.write(`<!doctype html><html lang="${item.language === 'en' ? 'en' : 'tr'}"><head>
      <meta charset="utf-8"><title>Önizleme — ${baslik}</title>
      <style>
        body { margin:0; padding:0; background:#f5f2ee; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color:#1c2530; }
        .kap { max-width: 720px; margin: 0 auto; padding: 40px 24px 80px; }
        .etiket { color:#b31821; font-weight:700; font-size:11px; letter-spacing:.12em; text-transform:uppercase; margin:0 0 10px; }
        h1 { font-size: 1.9rem; line-height:1.25; margin: 0 0 24px; color:#0f2c52; }
        .govde { font-size: 1rem; line-height: 1.7; }
        .govde img { max-width: 100%; }
      </style>
      </head><body>
        <div class="kap">
          <p class="etiket">Önizleme — henüz yayınlanmadı</p>
          <h1>${baslik}</h1>
          ${kapak}
          <div class="govde">${govde}</div>
        </div>
      </body></html>`);
    pencere.document.close();
  }

  protected sekmeIletisim(): void {
    this.sekme.set('iletisim');
    this.api.contactChannels().subscribe((l) => this.kanallar.set(l));
  }

  protected turAdi(t: string): string {
    return { address: 'Adres', phone: 'Telefon', email: 'E-posta', fax: 'Faks' }[t] ?? t;
  }

  protected kanalDuzenle(k: ContactChannel | null): void {
    this.kanal.set(k
      ? { ...k }
      : { id: null, language: 'tr', type: 'phone', label: null, value: '', sortOrder: 0, published: true });
  }

  protected kanalAlan(alan: keyof ContactChannel, deger: unknown): void {
    const k = this.kanal();
    if (k) this.kanal.set({ ...k, [alan]: deger } as ContactChannel);
  }

  protected kanalKaydet(): void {
    const k = this.kanal();
    if (!k) return;
    this.api.saveContactChannel(k).subscribe({
      next: () => { this.kanal.set(null); this.sekmeIletisim(); this.mesaj('İletişim bilgisi kaydedildi.'); },
      error: () => this.mesaj('Kaydedilemedi.')
    });
  }

  protected kanalSil(k: ContactChannel): void {
    if (!k.id) return;
    this.api.deleteContactChannel(k.id).subscribe({
      next: () => { this.kanallar.update((l) => l.filter((x) => x.id !== k.id)); this.mesaj('Kayıt silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  private sayilariYukle(): void {
    this.api.news().subscribe((l) => this.news.set(l));
    this.api.newsOptions().subscribe((s) => this.duyuruSecenekleri.set(s));
    this.api.slides().subscribe((l) => this.slides.set(l));
    this.api.shortcuts().subscribe((l) => this.shortcuts.set(l));
    this.api.menus().subscribe((l) => this.menus.set(l));
    this.api.socialAccounts().subscribe((l) => this.socialAccounts.set(l));
  }

  private sayfalariYukle(): void {
    this.api.pages().subscribe({
      next: (l) => this.pages.set(l),
      error: () => this.api.cikis()
    });
  }

  private bosDuyuru(): AdminNews {
    return {
      id: null,
      language: 'tr',
      title: '',
      summary: null,
      publishedOn: new Date().toISOString().slice(0, 10),
      featured: false,
      published: true,
      externalUrl: null,
      documentOnly: false,
      slug: null,
      imageUrl: null,
      imageAlt: null,
      contentHtml: null,
      category: 'general',
      audience: 'all-users',
      coverTemplate: 'institutional',
      coverText: null,
      seoTitle: null,
      seoDescription: null,
      seoKeywords: null,
      seoRobots: 'index, follow'
    };
  }

  private mesaj(m: string): void {
    this.bilgi.set(m);
    setTimeout(() => this.bilgi.set(''), 4000);
  }
}
