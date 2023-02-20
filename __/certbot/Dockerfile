FROM certbot/certbot

RUN apk add --no-cache bash

COPY certbot.sh /opt/

RUN chmod +x /opt/certbot.sh
#Fix line ending bugs
RUN sed -i 's/\r//' /opt/certbot.sh

ENTRYPOINT ["/opt/certbot.sh"]