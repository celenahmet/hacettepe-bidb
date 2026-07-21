import { RenderMode, ServerRoute } from '@angular/ssr';

/** İçerik veritabanından geldiği için sayfalar her istekte sunucuda
 *  render edilir (önceden üretim yapılmaz). Böylece güncel içerik
 *  ilk yanıtın HTML'inde yer alır. */
export const serverRoutes: ServerRoute[] = [
  // Yönetim paneli yalnızca tarayıcıda çalışır; kimlik bilgisi sunucuya gitmez
  { path: 'yonetim', renderMode: RenderMode.Client },
  { path: ':dil/duyuru/:slug', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server }
];
