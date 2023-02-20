#!/bin/sh

cd /workdir
echo "Let's Encrypt Zertifikate werden erneuert... (`date`)"
certbot renew --no-random-sleep-on-renew
echo "Nginx Konfiguration erneut laden."
docker exec nginx nginx -s reload
echo "Neuladen der Nginx Konfiguration erfolgreich."
