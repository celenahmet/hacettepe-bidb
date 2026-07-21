import { RenderMode, ServerRoute } from '@angular/ssr';

/** İçerik veritabanından geldiği için sayfalar her istekte sunucuda
 *  render edilir (önceden üretim yapılmaz). Böylece güncel içerik
 *  ilk yanıtın HTML'inde yer alır. */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Server }
];
