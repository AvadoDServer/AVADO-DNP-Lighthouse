ARG VERSION
FROM node:16.15.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build


# build monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN yarn

FROM --platform=linux/amd64 sigp/lighthouse:${VERSION}
# FROM sigp/lighthouse:${VERSION}

USER root
RUN apt-get -y update && apt-get -y upgrade && apt-get -y install \
    curl \
    gettext\
    jq \
    nginx \
    nodejs \
    sudo \
    supervisor \
    vim-tiny \
    wget \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -s /bin/false nginx

RUN mkdir -p /opt/lighthouse
VOLUME /data

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard
COPY --from=builder /usr/src/monitor /usr/local/monitor

COPY startLighthouse.sh /opt/lighthouse
COPY reload-certs.sh /opt/lighthouse/reload-certs.sh
COPY wizard/src/components/defaultsettings.json /opt/lighthouse
RUN chmod a+x /opt/lighthouse/startLighthouse.sh /opt/lighthouse/reload-certs.sh
COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


