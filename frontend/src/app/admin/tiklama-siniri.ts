/**
 * "Yenile" gibi düğmelerin art arda hızlı tıklanmasında her tıklamanın
 * ayrı bir isteğe dönüşmesini önler (spam koruması).
 *
 * Tek bir paylaşılan uygulama yerine her bileşende aynı mantığın tekrar
 * yazılmaması için burada toplandı — bkz. admin-panel.component.ts,
 * login-events-admin.component.ts, audit-log-admin.component.ts,
 * contact-ticket-admin.component.ts, staff-editor.component.ts.
 */
export function tiklamaSinirlayici(bekleMs = 1000): () => boolean {
  let sonIzinVerilen = 0;
  return () => {
    const simdi = Date.now();
    if (simdi - sonIzinVerilen < bekleMs) return false;
    sonIzinVerilen = simdi;
    return true;
  };
}
