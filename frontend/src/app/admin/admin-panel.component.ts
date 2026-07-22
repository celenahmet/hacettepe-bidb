import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PageEditorComponent } from './page-editor.component';
import { AdminNews, Shortcut, AdminMenuItem, AdminMenu, AdminPage, Slide, AdminSocialAccount, AdminApiService, ContactChannel } from './admin-api.service';

/** Alt bilgide görünen kurum bilgileri. */
interface ContactInfo extends Record<string, string> {
  iletisim_adres: string;
  iletisim_telefon: string;
  iletisim_eposta: string;
  iletisim_faks: string;
}

/** Yönetim paneli: giriş, sayfa SEO düzenleme ve newsItem yönetimi. */
@Component({
  selector: 'bidb-admin-panel',
  imports: [FormsModule, PageEditorComponent],
  template: `
    <div class="kap yonetim">
      @if (!api.girisYapildi()) {
        <form class="giris" (ngSubmit)="giris()">
          <h1>Yönetim Girişi</h1>

          <label for="kullanici">Kullanıcı nameı</label>
          <input id="kullanici" name="kullanici" [(ngModel)]="kullanici" autocomplete="username" required>

          <label for="parola">Parola</label>
          <input id="parola" name="parola" type="password" [(ngModel)]="parola" autocomplete="current-password" required>

          @if (hata()) { <p class="hata" role="alert">{{ hata() }}</p> }

          <button type="submit" [disabled]="calisiyor()">
            {{ calisiyor() ? 'Denetleniyor…' : 'Giriş Yap' }}
          </button>
        </form>
      } @else {
        <header class="yonetim-ust">
          <h1>Yönetim Paneli</h1>
          <button type="button" class="ikincil" (click)="api.cikis()">Çıkış</button>
        </header>

        <nav class="sekmeler">
          <button type="button" [class.etkin]="sekme() === 'pages'" (click)="sekme.set('pages')">
            Sayfalar ({{ pages().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'news'" (click)="sekmeDuyuru()">
            Duyurular ({{ news().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'slider'" (click)="sekmeSlider()">
            Slider ({{ slides().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'shortcuts'" (click)="sekmeKisayol()">
            Kısayollar ({{ shortcuts().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'menus'" (click)="sekmeMenu()">
            Menüler ({{ menus().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'sosyal'" (click)="sekmeSosyal()">
            Sosyal Medya ({{ socialAccounts().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'iletisim'" (click)="sekmeIletisim()">
            İletişim Bilgileri
          </button>
        </nav>

        @if (bilgi()) { <p class="bilgi" role="status">{{ bilgi() }}</p> }

        @if (sekme() === 'pages') {
          <p class="aciklama">
            "Düzenle" ile sayfanın metnini, adresini ve belgelerini yönetebilir,
            sürüm geçmişinden eski bir hâle dönebilirsiniz.
          </p>

          <button type="button" (click)="yeniSayfaAc()">Yeni sayfa</button>

          @if (yeniSayfa(); as ys) {
            <form class="duyuru-form" (ngSubmit)="yeniSayfaKaydet()">
              <h2>Yeni sayfa</h2>

              <label for="ysdil">Language</label>
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
                Page adresi: <code>{{ SITE }}/{{ ys.language }}/{{ adresOnizleme(ys.slug) }}</code>
              </p>

              <span class="dugmeler">
                <button type="submit">OluşfileType</button>
                <button type="button" class="ikincil" (click)="yeniSayfa.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <table class="yonetim-tablo">
            <thead>
              <tr><th>Page</th><th>Language</th><th>İçerik</th><th>Yayında</th><th></th></tr>
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
        } @else if (sekme() === 'news') {
          <form class="duyuru-form" (ngSubmit)="duyuruKaydet()">
            <h2>{{ newsItem().id ? 'Duyuruyu düzenle' : 'Yeni newsItem' }}</h2>

            <label for="dbaslik">Başlık</label>
            <input id="dbaslik" name="title" [ngModel]="newsItem().title"
                   (ngModelChange)="duyuruAlan('title', $event)" required>

            <span class="onaylar">
              <label class="onay">
                <input type="checkbox" name="dyayin" [ngModel]="newsItem().published"
                       (ngModelChange)="duyuruAlan('published', $event)"> Yayında
              </label>
              <label class="onay">
                <input type="checkbox" name="doneCikan" [ngModel]="newsItem().featured"
                       (ngModelChange)="duyuruAlan('featured', $event)"> Öne çıkan
              </label>
            </span>

            <label for="dtarih">Yayın tarihi</label>
            <input id="dtarih" name="publishedOn" type="date" [ngModel]="newsItem().publishedOn"
                   (ngModelChange)="duyuruAlan('publishedOn', $event)" required>

            <label for="dozet">Özet (listede başlığın altında görünür)</label>
            <textarea id="dozet" name="summary" rows="2" [ngModel]="newsItem().summary"
                      (ngModelChange)="duyuruAlan('summary', $event)"></textarea>

            <div class="yukleme">
              <label for="dgorsel">Görsel</label>
              <input id="dgorsel" type="file" accept="image/*" (change)="duyuruGorselSec($event)">
              @if (gorselYukleniyor()) { <small>Yükleniyor…</small> }
              @if (newsItem().imageUrl) {
                <div class="gorsel-onizleme">
                  <img [src]="newsItem().imageUrl" alt="">
                  <button type="button" class="ikincil" (click)="duyuruAlan('imageUrl', null)">Görseli kaldır</button>
                </div>
                <label for="dgorselalt">Görsel açıklaması (görme engelliler ve arama motorları için)</label>
                <input id="dgorselalt" name="imageAlt" [ngModel]="newsItem().imageAlt"
                       (ngModelChange)="duyuruAlan('imageAlt', $event)">
              }
            </div>

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

            <label for="dadres">Bağlantı (belge veya dış url — haber sayfası yoksa buraya gidilir)</label>
            <input id="dadres" name="externalUrl" [ngModel]="newsItem().externalUrl"
                   (ngModelChange)="duyuruAlan('externalUrl', $event)">

            <label for="ddil">Language</label>
            <select id="ddil" name="language" [ngModel]="newsItem().language" (ngModelChange)="duyuruAlan('language', $event)">
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
            </select>

            <span class="dugmeler">
              <button type="submit">{{ newsItem().id ? 'Güncelle' : 'Ekle' }}</button>
              <button type="button" class="ikincil" (click)="duyuruOnizle()">Önizle</button>
              @if (newsItem().id) {
                <button type="button" class="ikincil" (click)="duyuruSifirla()">Vazgeç</button>
              }
            </span>

            @if (duyuruOnizleme(); as ono) {
              <section class="onizleme">
                <h3>Önizleme</h3>
                @if (newsItem().imageUrl) {
                  <img class="haber-gorsel" [src]="newsItem().imageUrl" [alt]="newsItem().imageAlt || ''">
                }
                <h4>{{ newsItem().title }}</h4>
                @if (newsItem().summary) { <p>{{ newsItem().summary }}</p> }
                <div class="icerik" [innerHTML]="ono"></div>
              </section>
            }
          </form>

          <table class="yonetim-tablo">
            <thead><tr><th>Tarih</th><th>Görsel</th><th>Başlık</th><th>Adres</th><th>Language</th><th></th></tr></thead>
            <tbody>
              @for (d of news(); track d.id) {
                <tr>
                  <td><small>{{ d.publishedOn }}</small></td>
                  <td>
                    @if (d.imageUrl) {
                      <img [src]="d.imageUrl" alt="" class="kucuk-gorsel">
                    } @else { <span class="soluk">—</span> }
                  </td>
                  <td>{{ d.title }}</td>
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
        } @else if (sekme() === 'slider') {
          <button type="button" (click)="slaytDuzenle(null)">Yeni slideItem</button>

          @if (slideItem(); as sl) {
            <form class="duyuru-form" (ngSubmit)="saveSlide()">
              <h2>{{ sl.id ? 'Slideı düzenle' : 'Yeni slideItem' }}</h2>
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

          <table class="yonetim-tablo">
            <thead><tr><th>Sıra</th><th>Başlık</th><th>Görsel</th><th>Language</th><th></th></tr></thead>
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
        } @else if (sekme() === 'menus') {
          @if (menuItem(); as md) {
            <form class="duyuru-form" (ngSubmit)="ogeKaydet()">
              <h2>{{ md.oge.id ? 'Bağlantıyı düzenle' : 'Yeni bağlantı' }}</h2>
              <label for="metiket">Etiket</label>
              <input id="metiket" name="metiket" [ngModel]="md.oge.label" (ngModelChange)="ogeAlan('label', $event)" required>

              <label for="msayfa">Page (iç bağlantı)</label>
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
              <label for="bdil">Language</label>
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

        } @else {
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

          <table class="yonetim-tablo">
            <thead><tr><th>Sıra</th><th>Ad</th><th>Adres</th><th>Language</th><th></th></tr></thead>
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
        }
      }
    </div>
  `
})
export class AdminPanelComponent {
  protected api = inject(AdminApiService);
  private temizleyici = inject(DomSanitizer);

  protected kullanici = '';
  protected parola = '';
  protected hata = signal('');
  protected bilgi = signal('');
  protected calisiyor = signal(false);

  protected sekme = signal<'pages' | 'news' | 'slider' | 'shortcuts' | 'menus' | 'sosyal' | 'iletisim'>('pages');
  protected pages = signal<AdminPage[]>([]);
  protected news = signal<AdminNews[]>([]);
  protected secili = signal<AdminPage | null>(null);
  protected newsItem = signal<AdminNews>(this.bosDuyuru());
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
    }
  }

  protected giris(): void {
    this.hata.set('');
    this.calisiyor.set(true);
    this.api.girisDene(this.kullanici, this.parola).subscribe({
      next: (liste) => {
        this.api.girisOnayla();
        this.pages.set(liste);
        this.sayilariYukle();
        this.calisiyor.set(false);
        this.parola = '';
      },
      error: () => {
        this.hata.set('Kullanıcı nameı veya parola hatalı.');
        this.calisiyor.set(false);
      }
    });
  }

  protected duzenle(s: AdminPage): void {
    this.secili.set(this.secili()?.id === s.id ? null : { ...s });
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
  }

  protected duyuruKaydet(): void {
    const d = this.newsItem();
    const istek = d.id ? this.api.updateNews(d.id, d) : this.api.addNews(d);
    istek.subscribe({
      next: () => {
        this.duyuruSifirla();
        this.sekmeDuyuru();
        this.mesaj('Duyuru kaydedildi.');
      },
      error: () => this.mesaj('Duyuru kaydedilemedi.')
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
      next: () => { this.slideItem.set(null); this.sekmeSlider(); this.mesaj('Slide kaydedildi.'); },
      error: () => this.mesaj('Slide kaydedilemedi.')
    });
  }

  protected deleteSlide(s: Slide): void {
    if (!s.id) return;
    this.api.deleteSlide(s.id).subscribe({
      next: () => { this.slides.update((l) => l.filter((x) => x.id !== s.id)); this.mesaj('Slide silindi.'); },
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
        this.mesaj('Page oluşturuldu. Metnini ve arama motoru bilgilerini şimdi girebilirsiniz.');
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
    this.duyuruOnizleme.set(this.temizleyici.bypassSecurityTrustHtml(this.newsItem().contentHtml ?? ''));
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
      slug: null,
      imageUrl: null,
      imageAlt: null,
      contentHtml: null
    };
  }

  private mesaj(m: string): void {
    this.bilgi.set(m);
    setTimeout(() => this.bilgi.set(''), 4000);
  }
}
