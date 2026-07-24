#!/bin/sh
# Kap root olarak başlar (paylaşılan birimin sahipliğini düzeltmek için),
# ardından ayrıcalıksız 'bidb' kullanıcısına düşürülür. Panelden yüklenen
# belgeler kalıcı bir Docker biriminde durur; bu birim daha önce root
# olarak çalışan bir kapla oluşturulmuş olabilir — her başlangıçta
# sahiplik yeniden ayarlanır, bu ucuz ve zararsız bir işlemdir.
set -e
dizin="${BIDB_DOSYA_DIZINI:-/veri/dosyalar}"
mkdir -p "$dizin"
chown -R bidb:bidb "$dizin"
exec su-exec bidb java -jar /uygulama/uygulama.jar
