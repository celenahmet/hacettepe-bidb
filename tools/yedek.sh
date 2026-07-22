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
#   tools/yedek.sh yukle <damga>       # yedeği geri yükler (ÜZERİNE YAZAR)
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
  yukle)    yedek_yukle "${2:-}" ;;
  *)
    echo "Hacettepe BİDB — yedekleme aracı"
    echo
    echo "Kullanım:"
    echo "  tools/yedek.sh al                 Yedek alır (veritabanı + belgeler)"
    echo "  tools/yedek.sh listele            Mevcut yedekleri listeler"
    echo "  tools/yedek.sh yukle <damga>      Yedeği geri yükler"
    echo
    echo "Örnek:"
    echo "  tools/yedek.sh al"
    echo "  tools/yedek.sh yukle 20260722-104500"
    ;;
esac
