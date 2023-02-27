FROM alpine

RUN apk add --no-cache openssl

COPY default.conf /etc/nginx/conf.d/

COPY options-ssl-nginx.conf /etc/nginx/

COPY hsts.conf /etc/nginx/

COPY nginx.sh /customization/

RUN chmod +x /customization/nginx.sh

RUN sed -i 's/\r//' /opt/nginx.sh

EXPOSE 80

CMD ["/customization/nginx.sh"]