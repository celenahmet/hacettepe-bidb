package tr.edu.hacettepe.bidb.web;

/**
 * Yönetim panelinin çeşitli CRUD uçlarında tekrarlanan basit girdi
 * denetimleri (manuel — @Valid/annotation yerine, kodun geri kalanındaki
 * mevcut yaklaşımla tutarlı olsun diye, bkz. AdminContactController).
 *
 * Panel tek paylaşılan bir yönetici hesabı arkasında olduğundan asıl tehdit
 * dış saldırgan değildir; asıl amaç (a) eksik/boş zorunlu alanların çirkin
 * bir 500'e (NOT NULL ihlali) düşmeden temiz bir 400 vermesi ve (b) URL
 * alanlarına "javascript:" gibi bir şema kaydedilmemesidir — Angular
 * tarafı [href] bağlarken bunu zaten süzüyor, ama sunucunun da aynı veriyi
 * doğrulaması tek katmana güvenmemek için gerekli.
 */
final class Girdi {
    private Girdi() {}

    static boolean bos(String deger) {
        return deger == null || deger.isBlank();
    }

    /**
     * Yayın sitesindeki bağlantı alanları için: ya köke göreli bir yol
     * ("/tr/..."), ya da http(s) ile başlayan mutlak bir adres olmalı.
     * "javascript:", "data:" gibi şemalar reddedilir.
     */
    static boolean gecerliBaglanti(String deger) {
        if (bos(deger)) return false;
        String d = deger.trim();
        return d.startsWith("/") || d.startsWith("http://") || d.startsWith("https://") || d.startsWith("mailto:") || d.startsWith("tel:");
    }
}
