#!/bin/bash

set -e

trap exit INT TERM

if [ -z "$BASE_URL" ]; then
  echo "BASE_URL Environment Variable ist nicht definiert."
  exit 1;
fi

until nc -z nginx 80; do
  echo "Warten, dass Nginx gestartet wird..."
  sleep 5s & wait ${!}
done


if [ -d "/etc/letsencrypt/live/$BASE_URL" ]; then
  echo "Let's Encrypt Zertifikat für $BASE_URL existiert bereits."
else
  echo "Beschaffung der Zertifikate für $BASE_URL"

  if [ -z "${CERTBOT_EMAIL}" ]; then
    email_arg="--register-unsafely-without-email"
  else
    email_arg="--email ${CERTBOT_EMAIL}"
  fi

  certbot certonly \
    --webroot \
    -w "/var/www/certbot" \
    --expand \
    -d "$BASE_URL" -d "www.$BASE_URL" \
    $email_arg \
    --rsa-key-size "${CERTBOT_RSA_KEY_SIZE:-4096}" \
    --agree-tos \
    --noninteractive || true
fi
