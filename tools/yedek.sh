#!/usr/bin/env bash
#
# Yedekleme ve geri yükleme.
#
# İki şey yedeklenir:
#   1. Veritabanı  — sayfa metinleri, duyurular, menüler, ayarlar, sürüm geçmişi
#   2. Yüklenen belgeler — panelden yüklenen PDF ve görseller
#
# Depodaki Flyway geçişleri yalnızca kaynaktan aktarılan İLK hâli kurar.
# Panelden yapılan her değişiklik yalnızca veritabanında yaşar; bu yüzden
# yayına alındıktan sonra düzenli yedek almak zorunludur.
#
# Kullanım:
#   tools/yedek.sh al                  # yedek/ dizinine yedek alır
#   tools/yedek.sh listele             # mevcut yedekleri gösterir
#   tools/yedek.sh dogrula <damga>     # yedeği GERİ YÜKLEYEREK sınar (güvenli)
#   tools/yedek.sh yukle <damga>       # yedeği geri yükler (ÜZERİNE YAZAR)
#
# NEDEN AYRI BİR "dogrula" KOMUTU VAR
#
# "al" sırasında yapılan denetim yalnızca dökümün LİSTELENEBİLDİĞİNİ gösterir
# (pg_restore -l). Listelenen bir döküm geri yüklenemeyebilir; bozuk yedek
# ancak ihtiyaç anında fark edilirse çok geçtir. "dogrula" komutu yedeği
# GEÇİCİ ve AYRI bir veritabanına gerçekten geri yükler, canlı veritabanıyla
# karşılaştırır ve sonra o veritabanını siler.
#
# Canlı veriye DOKUNMAZ; üretimde de güvenle çalıştırılabilir.
#
# Çıkış kodları:  0 geri yüklendi ve canlı veriyle aynı
#                 1 GERİ YÜKLENEMEDİ (yedek kullanılamaz)
#                 2 geri yüklendi ama içerik farklı (eski yedeklerde normaldir)
#
# Windows'ta Git Bash, macOS ve Linux'ta doğrudan çalışır.

set -euo pipefail

# Git Bash (Windows) POSIX görünümlü argümanları Windows yoluna çevirir;
# docker'a verilen KAP İÇİ yollar (/veri, /yedek) bundan bozulur.
# Bu iki değişken dönüşümü kapatır. macOS ve Linux'ta etkisizdir.
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL='*'

PROJE="${COMPOSE_PROJECT_NAME:-hacettepebidb}"
DB_KAP="${BIDB_DB_KAP:-bidb-db}"
BELGE_BIRIMI="${PROJE}_belgeler"
KOK="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
YEDEK_DIZIN="${BIDB_YEDEK_DIZIN:-$KOK/yedek}"

# Docker'a verilecek ANA MAKİNE yolu. Windows'ta /c/… biçimini Docker
# anlamadığı için C:/… biçimine çevrilir.
anamakine_yolu() {
  local yol="$1"
  if [[ "$(uname -s)" == MINGW* || "$(uname -s)" == MSYS* ]]; then
    (cd "$yol" && pwd -W)
  else
    echo "$yol"
  fi
}

renk_bilgi()  { printf '\033[36m%s\033[0m\n' "$*"; }
renk_iyi()    { printf '\033[32m%s\033[0m\n' "$*"; }
renk_uyari()  { printf '\033[33m%s\033[0m\n' "$*"; }
renk_hata()   { printf '\033[31m%s\033[0m\n' "$*" >&2; }

kap_var_mi() {
  docker ps --format '{{.Names}}' | grep -qx "$DB_KAP"
}

gerekli_kontrol() {
  if ! command -v docker > /dev/null 2>&1; then
    renk_hata "Docker bulunamadı."
    exit 1
  fi
  if ! kap_var_mi; then
    renk_hata "Veritabanı kabı '$DB_KAP' çalışmıyor."
    renk_hata "Önce 'docker compose up -d' çalıştırın."
    exit 1
  fi
}

# ---------------------------------------------------------------- yedek al

yedek_al() {
  gerekli_kontrol
  mkdir -p "$YEDEK_DIZIN"

  local damga; damga="$(date +%Y%m%d-%H%M%S)"
  local db_dosya="$YEDEK_DIZIN/veritabani-$damga.dump"
  local belge_dosya="$YEDEK_DIZIN/belgeler-$damga.tar.gz"

  renk_bilgi "Veritabanı yedekleniyor…"
  # -Fc: sıkıştırılmış özel biçim; pg_restore ile seçmeli geri yükleme sağlar
  docker exec "$DB_KAP" pg_dump -U bidb -d bidb -Fc > "$db_dosya"

  renk_bilgi "Yüklenen belgeler yedekleniyor…"
  # Belgeler kaplar arasında paylaşılan bir birimde; geçici bir kapla okunur
  docker run --rm \
    -v "$BELGE_BIRIMI":/veri:ro \
    -v "$YEDEK_DIZIN":/yedek \
    alpine:3.20 \
    tar czf "/yedek/belgeler-$damga.tar.gz" -C /veri . 2>/dev/null

  local db_boyut belge_boyut
  db_boyut="$(du -h "$db_dosya" | cut -f1)"
  belge_boyut="$(du -h "$belge_dosya" | cut -f1)"

  # Yedeğin gerçekten okunabilir olduğu doğrulanır; bozuk yedek yedek değildir
  renk_bilgi "Yedek doğrulanıyor…"
  local tablo_sayisi
  tablo_sayisi="$(docker exec -i "$DB_KAP" pg_restore -l < "$db_dosya" | grep -c 'TABLE DATA' || true)"

  if [ "$tablo_sayisi" -lt 5 ]; then
    renk_hata "Yedek doğrulanamadı: yalnızca $tablo_sayisi tablo bulundu."
    exit 1
  fi

  renk_iyi "Yedek alındı:"
  echo "  veritabanı : $(basename "$db_dosya")  ($db_boyut, $tablo_sayisi tablo)"
  echo "  belgeler   : $(basename "$belge_dosya")  ($belge_boyut)"
  echo "  dizin      : $YEDEK_DIZIN"
  echo
  echo "  geri yüklemek için:  tools/yedek.sh yukle $damga"
}

# ---------------------------------------------------------------- listele

yedek_listele() {
  if [ ! -d "$YEDEK_DIZIN" ] || [ -z "$(ls -A "$YEDEK_DIZIN" 2>/dev/null)" ]; then
    renk_uyari "Henüz yedek yok. Almak için: tools/yedek.sh al"
    return
  fi
  renk_bilgi "Mevcut yedekler ($YEDEK_DIZIN):"
  echo
  printf "  %-18s %10s %10s\n" "DAMGA" "VERİTABANI" "BELGELER"
  for f in "$YEDEK_DIZIN"/veritabani-*.dump; do
    [ -e "$f" ] || continue
    local damga; damga="$(basename "$f" .dump | sed 's/^veritabani-//')"
    local b="$YEDEK_DIZIN/belgeler-$damga.tar.gz"
    printf "  %-18s %10s %10s\n" \
      "$damga" \
      "$(du -h "$f" | cut -f1)" \
      "$([ -e "$b" ] && du -h "$b" | cut -f1 || echo '—')"
  done
}

# ---------------------------------------------------------------- doğrula

# Her tablonun KESİN satır sayısı. pg_stat_user_tables kullanılmaz: oradaki
# değerler istatistik tahminidir ve bayat olabilir (ölçüldü: 81 satırlık
# belge tablosu için 1 diyordu). Bir yedek denetiminin tahminle çalışması
# denetimin kendisini değersiz kılar.
SAYIM_SORGUSU="SELECT string_agg(satir, E'\n' ORDER BY satir) FROM (
  SELECT format('%s=%s', tablename,
    (xpath('/row/c/text()',
      query_to_xml(format('select count(*) as c from public.%I', tablename), false, true, '')))[1]::text) AS satir
  FROM pg_tables WHERE schemaname='public') t;"

# Sütun adları ve türlerinden üretilen şema parmak izi
SEMA_SORGUSU="select md5(string_agg(t,'|')) from (
  select table_name||':'||column_name||':'||data_type t
  from information_schema.columns where table_schema='public'
  order by table_name, ordinal_position) x;"

DIZI_SORGUSU="select coalesce(string_agg(format('%s=%s', sequencename, last_value), E'\n' ORDER BY sequencename),'') from pg_sequences where schemaname='public';"

sorgula() {   # sorgula <veritabani> <sorgu>
  docker exec -i "$DB_KAP" psql -U bidb -d "$1" -t -A -c "$2"
}

yedek_dogrula() {
  local damga="${1:-}"
  if [ -z "$damga" ]; then
    renk_hata "Damga belirtilmedi.  Kullanım: tools/yedek.sh dogrula <damga>"
    yedek_listele
    exit 1
  fi

  gerekli_kontrol

  local db_dosya="$YEDEK_DIZIN/veritabani-$damga.dump"
  local belge_dosya="$YEDEK_DIZIN/belgeler-$damga.tar.gz"
  if [ ! -f "$db_dosya" ]; then
    renk_hata "Yedek bulunamadı: $db_dosya"
    exit 1
  fi

  local gecici="bidb_dogrulama_$$"
  local hata=0

  # Betik hangi noktada biterse bitsin geçici veritabanı kalmasın
  trap 'docker exec -i "$DB_KAP" psql -U bidb -d postgres -c "DROP DATABASE IF EXISTS '"$gecici"';" > /dev/null 2>&1 || true' EXIT

  renk_bilgi "Yedek geçici bir veritabanına geri yükleniyor (canlı veriye dokunulmaz)…"
  docker exec -i "$DB_KAP" psql -U bidb -d postgres -c "CREATE DATABASE $gecici OWNER bidb;" > /dev/null
  if ! docker exec -i "$DB_KAP" pg_restore -U bidb -d "$gecici" --no-owner < "$db_dosya" > /dev/null 2>&1; then
    renk_hata "GERİ YÜKLENEMEDİ. Bu yedek kullanılamaz."
    exit 1
  fi
  renk_iyi "Geri yükleme başarılı: yedek kullanılabilir durumda."
  echo

  renk_bilgi "Canlı veritabanıyla karşılaştırılıyor…"

  local a b
  a="$(sorgula bidb "$SEMA_SORGUSU")"; b="$(sorgula "$gecici" "$SEMA_SORGUSU")"
  if [ "$a" = "$b" ]; then echo "  şema           ✓ birebir aynı"
  else echo "  şema           ✗ FARKLI"; hata=1; fi

  a="$(sorgula bidb "$SAYIM_SORGUSU")"; b="$(sorgula "$gecici" "$SAYIM_SORGUSU")"
  if [ "$a" = "$b" ]; then
    echo "  satır sayıları ✓ $(printf '%s' "$a" | grep -c '=' || true) tablonun tamamı eşleşti"
  else
    echo "  satır sayıları ✗ FARKLI:"
    diff <(printf '%s\n' "$a") <(printf '%s\n' "$b") | sed 's/^/      /' || true
    hata=1
  fi

  # Diziler geri yüklenmezse sonraki kayıt birincil anahtar çakışmasıyla
  # başarısız olur; satır sayıları tuttuğu hâlde yedek kullanılamaz olur.
  a="$(sorgula bidb "$DIZI_SORGUSU")"; b="$(sorgula "$gecici" "$DIZI_SORGUSU")"
  if [ "$a" = "$b" ]; then echo "  diziler        ✓ $(printf '%s' "$a" | grep -c '=' || true) dizi aynı konumda"
  else echo "  diziler        ✗ FARKLI"; hata=1; fi

  # Satır sayısı içeriğin doğruluğunu kanıtlamaz; metinlerin kendisi sınanır.
  local icerik="select md5(string_agg(coalesce(content_html,'')||slug||language,'|' order by id)) from page;"
  a="$(sorgula bidb "$icerik")"; b="$(sorgula "$gecici" "$icerik")"
  if [ "$a" = "$b" ]; then echo "  sayfa metni    ✓ sağlama aynı"
  else echo "  sayfa metni    ✗ FARKLI"; hata=1; fi

  if [ -f "$belge_dosya" ]; then
    renk_bilgi "Belge arşivi karşılaştırılıyor…"
    local cikti
    cikti="$(docker run --rm \
      -v "$YEDEK_DIZIN":/yedek:ro \
      -v "$BELGE_BIRIMI":/veri:ro \
      alpine:3.20 sh -c "
        mkdir -p /tmp/x && tar xzf /yedek/belgeler-$damga.tar.gz -C /tmp/x || exit 9
        ha=\$(find /tmp/x -type f -exec md5sum {} \; | sed 's|/tmp/x/||' | sort | md5sum)
        hb=\$(find /veri  -type f -exec md5sum {} \; | sed 's|/veri/||'  | sort | md5sum)
        n=\$(find /tmp/x -type f | wc -l)
        [ \"\$ha\" = \"\$hb\" ] && echo \"AYNI \$n\" || echo \"FARKLI \$n\"
      " 2>/dev/null || echo "ACILAMADI 0")"
    case "$cikti" in
      AYNI*)  echo "  belgeler       ✓ ${cikti#AYNI } dosya, sağlama aynı" ;;
      FARKLI*) echo "  belgeler       ✗ İÇERİK FARKLI"; hata=1 ;;
      *)      echo "  belgeler       ✗ ARŞİV AÇILAMADI"; hata=1 ;;
    esac
  else
    renk_uyari "  belgeler       — arşiv yok"
  fi

  echo
  if [ "$hata" -eq 0 ]; then
    renk_iyi "Yedek doğrulandı: geri yüklendi ve canlı veriyle birebir eşleşti."
  else
    # Fark, yedeğin bozuk olduğu anlamına GELMEZ. Geri yükleme yukarıda zaten
    # başarılı oldu. Yedek alındıktan sonra panelden yapılan her düzenleme bu
    # farkı büyütür; eski bir yedekte fark beklenen sonuçtur. Fark yalnızca
    # AZ ÖNCE alınmış bir yedekte görülüyorsa sorun işaretidir — o durumda
    # yedekleme sırasında veri kaçırılıyor demektir.
    renk_uyari "Yedek geri yüklenebiliyor ancak içeriği canlı veriden farklı."
    echo "  Yedek alındıktan sonra veri değiştiyse bu beklenen sonuçtur."
    echo "  Az önce alınmış bir yedekte fark görüyorsanız yedekleme kusurludur."
    exit 2
  fi
}

# ---------------------------------------------------------------- geri yükle

yedek_yukle() {
  local damga="${1:-}"
  if [ -z "$damga" ]; then
    renk_hata "Damga belirtilmedi.  Kullanım: tools/yedek.sh yukle <damga>"
    yedek_listele
    exit 1
  fi

  gerekli_kontrol

  local db_dosya="$YEDEK_DIZIN/veritabani-$damga.dump"
  local belge_dosya="$YEDEK_DIZIN/belgeler-$damga.tar.gz"

  if [ ! -f "$db_dosya" ]; then
    renk_hata "Yedek bulunamadı: $db_dosya"
    exit 1
  fi

  renk_uyari "DİKKAT: Mevcut veritabanının üzerine yazılacak."
  renk_uyari "Geri yüklenecek yedek: $damga"
  printf "Devam etmek için 'evet' yazın: "
  read -r onay
  if [ "$onay" != "evet" ]; then
    echo "İptal edildi."
    exit 0
  fi

  renk_bilgi "Veritabanı geri yükleniyor…"
  # --clean: mevcut nesneleri düşürür, --if-exists: yoksa hata vermez
  docker exec -i "$DB_KAP" pg_restore -U bidb -d bidb --clean --if-exists --no-owner < "$db_dosya"

  if [ -f "$belge_dosya" ]; then
    renk_bilgi "Belgeler geri yükleniyor…"
    docker run --rm \
      -v "$BELGE_BIRIMI":/veri \
      -v "$YEDEK_DIZIN":/yedek:ro \
      alpine:3.20 \
      sh -c "rm -rf /veri/* && tar xzf /yedek/belgeler-$damga.tar.gz -C /veri"
  else
    renk_uyari "Belge yedeği bulunamadı, yalnızca veritabanı geri yüklendi."
  fi

  renk_iyi "Geri yükleme tamamlandı."
  echo "  Uygulamayı yeniden başlatın:  docker compose restart backend frontend"
}

# ---------------------------------------------------------------- giriş

case "${1:-}" in
  al)       yedek_al ;;
  listele)  yedek_listele ;;
  dogrula)  yedek_dogrula "${2:-}" ;;
  yukle)    yedek_yukle "${2:-}" ;;
  *)
    echo "Hacettepe BİDB — yedekleme aracı"
    echo
    echo "Kullanım:"
    echo "  tools/yedek.sh al                 Yedek alır (veritabanı + belgeler)"
    echo "  tools/yedek.sh listele            Mevcut yedekleri listeler"
    echo "  tools/yedek.sh dogrula <damga>    Yedeği geri yükleyerek sınar (güvenli)"
    echo "  tools/yedek.sh yukle <damga>      Yedeği geri yükler (ÜZERİNE YAZAR)"
    echo
    echo "Örnek:"
    echo "  tools/yedek.sh al"
    echo "  tools/yedek.sh dogrula 20260722-104500"
    echo "  tools/yedek.sh yukle 20260722-104500"
    ;;
esac
