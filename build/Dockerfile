ARG VERSION
FROM node:18.15.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build

# build monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN yarn
RUN rm -Rf build && yarn run build

# https://github.com/ConsenSys/teku/blob/master/docker/jdk17/Dockerfile
FROM --platform=linux/amd64 sigp/lighthouse:${VERSION}

USER root
RUN apt-get -y update && apt-get -y upgrade && apt-get -y install \
    curl \
    gettext\
    jq \
    nginx \
    nodejs \
    procps \
    sudo \
    supervisor \
    vim-tiny \
    wget \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -s /bin/false nginx

# Instal node v18.15.0
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION v18.15.0

RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . /root/.nvm/nvm.sh \
    && nvm install v18.15.0 \
    && nvm use v18.15.0

RUN mkdir -p /opt/lighthouse

ENV NODE_PATH $NVM_DIR/$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/$NODE_VERSION/bin:$PATH

VOLUME /data

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard
COPY --from=builder /usr/src/monitor /usr/local/monitor

COPY startLighthouse.sh /opt/lighthouse
COPY reload-certs.sh /opt/lighthouse/reload-certs.sh
COPY monitor/settings/defaultsettings.json /opt/lighthouse
RUN chmod a+x /opt/lighthouse/startLighthouse.sh /opt/lighthouse/reload-certs.sh
COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]
