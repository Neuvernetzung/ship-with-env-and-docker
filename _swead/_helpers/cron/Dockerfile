FROM alpine

RUN apk update && apk add --no-cache docker-cli certbot

ADD crontab.txt /crontab.txt

COPY renew_certs.sh /renew_certs.sh

RUN chmod +x /renew_certs.sh

RUN sed -i 's/\r//' /opt/renew_certs.sh

RUN /usr/bin/crontab /crontab.txt

WORKDIR /workdir

CMD ["crond", "-f", "-l", "8"]