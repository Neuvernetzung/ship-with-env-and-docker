#!/bin/bash

    set -e
    
    trap exit INT TERM
    
    until nc -z nginx 80; do
      echo "Warten, dass Nginx gestartet wird..."
      sleep 5s & wait ${!}
    done
    
    if [ -d "/etc/letsencrypt/live/test-backend.räucherkerzen-shop.de" ]; then
echo "Let's Encrypt Certificate for test-backend.räucherkerzen-shop.de already exists."
else
echo "Obtaining the certificates for test-backend.räucherkerzen-shop.de"

certbot certonly   --webroot   -w "/var/www/certbot"   --expand   -d "test-backend.räucherkerzen-shop.de" -d "www.test-backend.räucherkerzen-shop.de"   --email t.heerwagen@web.de   --rsa-key-size "4096"   --agree-tos   --noninteractive || true
fi
    