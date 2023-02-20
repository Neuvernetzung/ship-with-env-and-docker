#!/bin/sh

set -e

if [ -z "$BASE_URL" ]; then
  echo "BASE_URL Environment Variable ist nicht definiert."
  exit 1;
fi

if [[ -f /etc/nginx/conf.d/default.conf ]]; then
    echo "BASE_URL wird in Variablen-Platzhalter injected (default.conf)."
    sed -i "s|INJECT_DOMAIN|$BASE_URL|g" /etc/nginx/conf.d/default.conf
    sed -i "s|PROXIED_CONTAINER|$PROXIED_CONTAINER|g" /etc/nginx/conf.d/default.conf
    sed -i "s|PORT|$PORT|g" /etc/nginx/conf.d/default.conf
    echo "Injektion BASE_URL in Variablen-Platzhalter erfolgreich."
fi


if [ ! -f "/etc/nginx/ssl/dummy/$BASE_URL/fullchain.pem" ]; then
  echo "Dummy Zertifikat für $BASE_URL wird generiert."
  mkdir -p "/etc/nginx/ssl/dummy/$BASE_URL"
  printf "[dn]\nCN=${BASE_URL}\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:${BASE_URL}, DNS:www.${BASE_URL}\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth" > openssl.cnf
  openssl req -x509 -out "/etc/nginx/ssl/dummy/$BASE_URL/fullchain.pem" -keyout "/etc/nginx/ssl/dummy/$BASE_URL/privkey.pem" \
    -newkey rsa:2048 -nodes -sha256 \
    -subj "/CN=${BASE_URL}" -extensions EXT -config openssl.cnf
  rm -f openssl.cnf
  echo "Generierung Dummy Zertifikat für $BASE_URL erfolgreich."
fi


if [ ! -f /etc/nginx/ssl/ssl-dhparams.pem ]; then
  openssl dhparam -out /etc/nginx/ssl/ssl-dhparams.pem 2048
fi

use_lets_encrypt_certificates() {
  echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für $BASE_URL eingeleitet." 
  sed -i "s|/etc/nginx/ssl/dummy/$BASE_URL|/etc/letsencrypt/live/$BASE_URL|g" /etc/nginx/conf.d/default.conf
  echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für $BASE_URL erfolgreich."
}

reload_nginx() {
  echo "Nginx Konfiguration erneut laden."
  nginx -s reload
  echo "Neuladen der Nginx Konfiguration erfolgreich."
}

wait_for_lets_encrypt() {
  until [ -d "/etc/letsencrypt/live/$BASE_URL" ]; do
    echo "Auf Let's Encrypt Zertifikate für $BASE_URL warten."
    sleep 5s & wait ${!}
  done
  use_lets_encrypt_certificates "$BASE_URL"
  reload_nginx
}


if [ ! -d "/etc/letsencrypt/live/$BASE_URL" ]; then
  wait_for_lets_encrypt "$BASE_URL" &
else
  use_lets_encrypt_certificates "$BASE_URL"
fi


exec nginx -g "daemon off;"