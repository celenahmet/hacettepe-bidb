#!/usr/bin/env bash
#
# Arka uç ve ön yüz testlerini çalıştırır.
#
# Makineye Java ya da Maven KURULMAZ; arka uç testleri kapta çalışır.
# Bağımlılıklar adlandırılmış bir Docker biriminde saklanır, ikinci koşu
# hızlıdır. Ön yüz testleri Chrome'u başsız kipte kullanır.
#
# Kullanım:
#   tools/test.sh              # tüm testleri çalıştırır
#   tools/test.sh arka         # yalnızca arka uç
#   tools/test.sh on           # yalnızca ön yüz
#   tools/test.sh --kanit      # testlerin GERÇEKTEN ölçtüğünü kanıtlar
#
# NEDEN "--kanit" VAR
#
# Geçen bir test tek başına hiçbir şey kanıtlamaz. Yanlış yazılmış bir
# test de geçer; hiçbir şeyi sınamayan bir test de geçer. Bu depodaki
# ölçüm araçlarının hepsinde aynı sebeple bir kanıt kipi vardır.
#
# --kanit, üretim koduna BİLEREK beş hata sokar, testlerin kırmızıya
# döndüğünü görür ve hataları geri alır. Testler bu hataları yakalamazsa
# "0 hata" sonucu güvenilmez demektir.
#
# Sokulan hatalar, gerçekte yaşanmış ya da sessiz kalacak türden seçildi:
#   1. Bir Core Web Vitals eşiğinin kayması   (ölçüm sessizce yanlış derecelenir)
#   2. Asgari parola uzunluğunun düşmesi      (zayıf parola kabul edilir)
#   3. Sıfırlama jetonunun düz metin saklanması (yedek sızarsa hesap ele geçer)
#   4. Türkçe sayı biçiminin bozulması        ("0.328" yazar, kimse fark etmez)
#   5. Bir çevirinin Türkçe bırakılması       (İngilizce panelde Türkçe metin)
#
# Windows'ta Git Bash, macOS ve Linux'ta doğrudan çalışır.

set -euo pipefail

# Git Bash (Windows) POSIX görünümlü argümanları Windows yoluna çevirir;
# docker'a verilen KAP İÇİ yollar (/kaynak) bundan bozulur.
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL='*'

KOK="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MAVEN_IMAJ="maven:3.9-eclipse-temurin-21"
ONBELLEK="bidb-maven-onbellek"

renk_bilgi()  { printf '\033[36m%s\033[0m\n' "$*"; }
renk_iyi()    { printf '\033[32m%s\033[0m\n' "$*"; }
renk_uyari()  { printf '\033[33m%s\033[0m\n' "$*"; }
renk_hata()   { printf '\033[31m%s\033[0m\n' "$*" >&2; }

# Docker'a verilecek ANA MAKİNE yolu. Windows'ta /c/… biçimini Docker
# anlamadığı için C:/… biçimine çevrilir.
anamakine_yolu() {
  if [[ "$(uname -s)" == MINGW* || "$(uname -s)" == MSYS* ]]; then
    (cd "$1" && pwd -W)
  else
    echo "$1"
  fi
}

if ! command -v docker > /dev/null 2>&1; then
  renk_hata "Docker bulunamadı."
  exit 1
fi

ARKA_UC="$(anamakine_yolu "$KOK/backend")"

mvn_calistir() {   # mvn_calistir <hedef...>
  docker run --rm \
    -v "$ARKA_UC":/kaynak \
    -v "$ONBELLEK":/root/.m2 \
    -w /kaynak "$MAVEN_IMAJ" \
    mvn -B "$@"
}

# ---------------------------------------------------------------- testler

arka_uc_testleri() {
  renk_bilgi "Arka uç testleri çalışıyor (ilk koşuda bağımlılıklar inilir)…"
  local cikti
  if cikti="$(mvn_calistir test 2>&1)"; then
    printf '%s\n' "$cikti" | grep -E "^\[INFO\] Tests run: .* -- in " | sed 's/^\[INFO\] /  /' || true
    printf '%s\n' "$cikti" | grep -E "^\[INFO\] Tests run: [0-9]+, Failures" | tail -1 | sed 's/^\[INFO\] /  TOPLAM: /' || true
    return 0
  fi
  printf '%s\n' "$cikti" | grep -E "Tests run:|^\[ERROR\] +[A-Za-z].*:[0-9]+ " || true
  renk_hata "Arka uç testleri düştü."
  return 1
}

on_yuz_testleri() {
  renk_bilgi "Ön yüz testleri çalışıyor (Chrome başsız)…"
  if [ ! -d "$KOK/frontend/node_modules" ]; then
    renk_hata "frontend/node_modules yok. Önce: cd frontend && npm install"
    return 1
  fi
  local cikti durum=0
  cikti="$(cd "$KOK/frontend" && npx ng test --watch=false --browsers=ChromeHeadless 2>&1)" || durum=$?
  # Karma satır silme kaçış dizileri kullanır; yalnızca son özet okunur.
  printf '%s\n' "$cikti" | grep -E "FAILED$|^\s+Expected|TOTAL:" | sed 's/^/  /' || true
  if [ "$durum" -ne 0 ]; then
    renk_hata "Ön yüz testleri düştü."
    return 1
  fi
  return 0
}

testleri_calistir() {   # testleri_calistir [arka|on]
  local hedef="${1:-hepsi}" durum=0
  case "$hedef" in
    arka) arka_uc_testleri || durum=1 ;;
    on)   on_yuz_testleri  || durum=1 ;;
    *)    arka_uc_testleri || durum=1; echo; on_yuz_testleri || durum=1 ;;
  esac
  echo
  if [ "$durum" -eq 0 ]; then
    renk_iyi "Testler geçti."
    echo "  Gerçekten ölçtüklerini görmek için:  tools/test.sh --kanit"
  else
    renk_hata "Testler düştü."
  fi
  return "$durum"
}

# ---------------------------------------------------------------- kanıt

VITAL="$KOK/backend/src/main/java/tr/edu/hacettepe/bidb/web/WebVitalController.java"
PAROLA="$KOK/backend/src/main/java/tr/edu/hacettepe/bidb/service/ParolaSifirlamaServisi.java"
ESIK="$KOK/frontend/src/app/admin/vitals-esik.ts"
SOZLUK="$KOK/frontend/src/app/admin/admin-dil.service.ts"

BOZULACAK=("$VITAL" "$PAROLA" "$ESIK" "$SOZLUK")

geri_al() {
  # Yedekten geri yüklenir; git durumuna bakılmaz. Kanıt kipi, henüz
  # işlenmemiş değişikliklerin üstünde de güvenle çalışabilmelidir —
  # "git checkout" burada kullanıcının kendi çalışmasını silerdi.
  local d
  for d in "${BOZULACAK[@]}"; do
    if [ -f "$d.kanit-yedek" ]; then
      mv -f "$d.kanit-yedek" "$d"
      # Zaman damgası TAZELENİR. mv, yedeğin (bozulmadan ÖNCE alınmış)
      # eski zamanını korur; bu durumda kaynak, bozuk koddan derlenmiş
      # .class dosyasından eski görünür ve Maven yeniden derlemez.
      # Ölçüldü: kaynak düzeltilmiş olmasına rağmen sonraki koşu, bozuk
      # bytecode'u çalıştırıp "testler düştü" dedi. Sessizce yanlış bir
      # sonuç, kanıt kipinin verebileceği en kötü zarardır.
      touch "$d"
    fi
  done
  return 0
}

kanit_calistir() {
  renk_bilgi "Önce testlerin temiz kodda geçtiği doğrulanıyor…"
  if ! mvn_calistir test > /dev/null 2>&1; then
    renk_hata "Arka uç testleri zaten düşüyor. Kanıt kipi ancak yeşil bir taban üstünde anlamlıdır."
    exit 1
  fi
  if ! (cd "$KOK/frontend" && npx ng test --watch=false --browsers=ChromeHeadless > /dev/null 2>&1); then
    renk_hata "Ön yüz testleri zaten düşüyor. Kanıt kipi ancak yeşil bir taban üstünde anlamlıdır."
    exit 1
  fi
  renk_iyi "Taban temiz."
  echo

  local d
  for d in "${BOZULACAK[@]}"; do cp "$d" "$d.kanit-yedek"; done
  trap geri_al EXIT

  renk_uyari "Üretim koduna bilerek beş hata sokuluyor…"
  echo "  1. LCP 'iyi' eşiği 2500 → 3000"
  echo "  2. Asgari parola uzunluğu 12 → 8"
  echo "  3. Sıfırlama jetonu karmalanmadan saklanıyor"
  echo "  4. Türkçe sayı biçimi İngilizceye çevriliyor"
  echo "  5. Bir çeviri İngilizce alanında Türkçe bırakılıyor"
  echo

  sed -i 's/case "LCP" -> 2500;/case "LCP" -> 3000;/' "$VITAL"
  sed -i 's/public static final int ASGARI_PAROLA = 12;/public static final int ASGARI_PAROLA = 8;/' "$PAROLA"
  sed -i 's|return HexFormat.of().formatHex(md.digest(jeton.getBytes(StandardCharsets.UTF_8)));|return jeton;|' "$PAROLA"
  sed -i "s/const yerel = dil === 'en' ? 'en-US' : 'tr-TR';/const yerel = 'en-US';/" "$ESIK"
  sed -i "s/kaliteOptimum: { tr: 'Optimum beklenti', en: 'Expected range' },/kaliteOptimum: { tr: 'Optimum beklenti', en: 'Optimum beklenti' },/" "$SOZLUK"

  # Hatalar gerçekten sokulabildi mi? sed sessizce hiçbir şey yapmamış
  # olabilir (kod değiştiyse). O durumda "testler yakaladı" sonucu yanlış olur.
  local sokulan=0
  grep -q 'case "LCP" -> 3000;' "$VITAL"        && sokulan=$((sokulan + 1))
  grep -q 'ASGARI_PAROLA = 8;' "$PAROLA"        && sokulan=$((sokulan + 1))
  grep -q 'return jeton;' "$PAROLA"             && sokulan=$((sokulan + 1))
  grep -q "const yerel = 'en-US';" "$ESIK"      && sokulan=$((sokulan + 1))
  grep -q "en: 'Optimum beklenti' }" "$SOZLUK"  && sokulan=$((sokulan + 1))
  if [ "$sokulan" -ne 5 ]; then
    renk_hata "Hatalar sokulamadı ($sokulan/5). Üretim kodu değişmiş; kanıt kipi güncellenmeli."
    exit 1
  fi

  renk_bilgi "Testler bozuk kod üstünde çalışıyor…"
  local arka on arka_durum=0 on_durum=0
  arka="$(mvn_calistir test 2>&1)" || arka_durum=$?
  on="$(cd "$KOK/frontend" && npx ng test --watch=false --browsers=ChromeHeadless 2>&1)" || on_durum=$?

  geri_al
  trap - EXIT

  echo
  echo "Yakalanan bozulmalar:"
  printf '%s\n' "$arka" | grep -E "^\[ERROR\] +[A-Za-z][A-Za-z]*Test\." | sed 's/^\[ERROR\] */  /' || true
  printf '%s\n' "$on" | grep -oE "vitals-esik [^ ]+ [^F]*FAILED|AdminDilServisi [^F]*FAILED" | sed 's/^/  /' | sort -u || true

  # Her beş hatanın da AYRI AYRI yakalandığı doğrulanır. Yalnızca birinin
  # yakalanması "testler çalışıyor" demek için yeterli değildir.
  local eksik=""
  printf '%s\n' "$arka" | grep -q "WebVitalEsikTest"  || eksik="$eksik eşik"
  printf '%s\n' "$arka" | grep -q "ParolaKuraliTest"  || eksik="$eksik parola"
  printf '%s\n' "$arka" | grep -q "JetonKarmaTest"    || eksik="$eksik jeton"
  printf '%s\n' "$on"   | grep -q "vitals-esik"       || eksik="$eksik sayı-biçimi"
  printf '%s\n' "$on"   | grep -q "AdminDilServisi"   || eksik="$eksik çeviri"

  echo
  if [ "$arka_durum" -eq 0 ] || [ "$on_durum" -eq 0 ] || [ -n "$eksik" ]; then
    renk_hata "TESTLER GÜVENİLMEZ. Yakalanmayan bozulmalar:$eksik"
    [ "$arka_durum" -eq 0 ] && renk_hata "  Arka uç testleri bozuk kodda da GEÇTİ."
    [ "$on_durum" -eq 0 ]   && renk_hata "  Ön yüz testleri bozuk kodda da GEÇTİ."
    exit 1
  fi

  renk_iyi "Testler çalışıyor: beş bozulmanın beşini de yakaladılar."
  echo "  Üretim kodu geri alındı."

  # Geri alma gerçekten oldu mu? Sessizce bozuk kalmış bir depo,
  # kanıt kipinin verebileceği en kötü zarardır.
  if grep -q 'case "LCP" -> 2500;' "$VITAL" \
     && grep -q 'ASGARI_PAROLA = 12;' "$PAROLA" \
     && grep -q 'formatHex' "$PAROLA" \
     && grep -q "dil === 'en' ? 'en-US' : 'tr-TR'" "$ESIK" \
     && grep -q "en: 'Expected range' }" "$SOZLUK"; then
    renk_iyi "Geri alma doğrulandı: dört dosya da özgün hâlinde."
  else
    renk_hata "GERİ ALMA BAŞARISIZ. Dosyaları elle kontrol edin: git diff"
    exit 1
  fi

  # Kaynağın doğru görünmesi yetmez; depo gerçekten YEŞİL mi?
  # Metnin doğru olduğu hâlde derlenmiş çıktının bozuk kaldığı bir durum
  # yaşandı (zaman damgası yüzünden yeniden derlenmiyordu). Kanıt kipi
  # kendi bıraktığı hâli sınamadan bitmemeli.
  echo
  renk_bilgi "Depo temiz hâline döndü mü, son kez sınanıyor…"
  if mvn_calistir test > /dev/null 2>&1 \
     && (cd "$KOK/frontend" && npx ng test --watch=false --browsers=ChromeHeadless > /dev/null 2>&1); then
    renk_iyi "Testler yeniden geçiyor. Depo kanıt öncesindeki hâlinde."
  else
    renk_hata "Testler hâlâ düşüyor. Depo bozuk kalmış olabilir: git diff"
    exit 1
  fi
}

# ---------------------------------------------------------------- giriş

case "${1:-}" in
  --kanit)  kanit_calistir ;;
  arka)     testleri_calistir arka ;;
  on)       testleri_calistir on ;;
  "")       testleri_calistir ;;
  *)
    echo "Hacettepe BİDB — test aracı"
    echo
    echo "Kullanım:"
    echo "  tools/test.sh            Tüm testleri çalıştırır"
    echo "  tools/test.sh arka       Yalnızca arka uç (Java)"
    echo "  tools/test.sh on         Yalnızca ön yüz (Angular)"
    echo "  tools/test.sh --kanit    Testlerin gerçekten ölçtüğünü kanıtlar"
    ;;
esac
