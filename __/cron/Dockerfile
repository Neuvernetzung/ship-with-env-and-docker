FROM alpine:3.15

RUN apk update && \
    apk add --no-cache docker-cli certbot

ADD crontab.txt /crontab.txt
COPY renew_certs.sh /renew_certs.sh

RUN chmod +x /renew_certs.sh
#Fix line ending bugs
RUN sed -i 's/\r//' /renew_certs.sh
RUN /usr/bin/crontab /crontab.txt

WORKDIR /workdir

CMD ["crond", "-f", "-l", "8"]