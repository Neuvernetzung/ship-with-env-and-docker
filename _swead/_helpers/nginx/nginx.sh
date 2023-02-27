
#!/bin/sh

set -e


    if [ ! -f "/etc/nginx/ssl/dummy/test-backend.räucherkerzen-shop.de/fullchain.pem" ]; then
        echo "Generating dummy certificate for test-backend.räucherkerzen-shop.de."
        mkdir -p "/etc/nginx/ssl/dummy/test-backend.räucherkerzen-shop.de"
        printf "[dn]
CN=test-backend.räucherkerzen-shop.de
[req]
distinguished_name = dn
[EXT]
subjectAltName=DNS:test-backend.räucherkerzen-shop.de, DNS:www.test-backend.räucherkerzen-shop.de
keyUsage=digitalSignature
extendedKeyUsage=serverAuth" > openssl.cnf
        openssl req -x509 -out "/etc/nginx/ssl/dummy/test-backend.räucherkerzen-shop.de/fullchain.pem" -keyout "/etc/nginx/ssl/dummy/test-backend.räucherkerzen-shop.de/privkey.pem"         -newkey rsa:2048 -nodes -sha256         -subj "/CN=test-backend.räucherkerzen-shop.de" -extensions EXT -config openssl.cnf
        rm -f openssl.cnf
        echo "Dummy certificate generation test-backend.räucherkerzen-shop.de successful."
    fi

if [ ! -f /etc/nginx/ssl/ssl-dhparams.pem ]; then
    openssl dhparam -out /etc/nginx/ssl/ssl-dhparams.pem 2048
fi


    use_lets_encrypt_Admin_certificates()() {
        echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für test-backend.räucherkerzen-shop.de eingeleitet." 
        sed -i "s|/etc/nginx/ssl/dummy/test-backend.räucherkerzen-shop.de|/etc/letsencrypt/live/test-backend.räucherkerzen-shop.de|g" /etc/nginx/conf.d/default.conf
        echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für test-backend.räucherkerzen-shop.de erfolgreich."
        }
    

reload_nginx() {
    echo "Reload nginx configuration."
    nginx -s reload
    echo "Nginx configuration reloaded successful."
}


    wait_for_lets_Admin_encrypt()() {
        until [ -d "/etc/letsencrypt/live/test-backend.räucherkerzen-shop.de" ]; do
            echo "Wait for Let's Encrypt certificates for test-backend.räucherkerzen-shop.de."
            sleep 5s & wait ${!}
        done
        use_lets_encrypt_Admin_certificates() "test-backend.räucherkerzen-shop.de"
        reload_nginx
        }


    if [ ! -d "/etc/letsencrypt/live/test-backend.räucherkerzen-shop.de" ]; then
        wait_for_lets_Admin_encrypt() "test-backend.räucherkerzen-shop.de" &
    else
        use_lets_encrypt_Admin_certificates() "test-backend.räucherkerzen-shop.de"
    fi

exec nginx -g "daemon off;"
