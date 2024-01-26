ARG VERSION
FROM node:18.15.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build

FROM --platform=linux/amd64 sigp/lighthouse:${VERSION}
ARG NETWORK

USER root
RUN apt-get -y update && apt-get -y upgrade && apt-get -y install \
    curl \
    jq \
    procps \
    unzip \
    sudo \
    supervisor \
    vim-tiny \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /opt/lighthouse

VOLUME /data

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# Install deno
RUN curl --fail --location --progress-bar --output /tmp/deno.zip "https://github.com/denoland/deno/releases/download/v1.40.2/deno-x86_64-unknown-linux-gnu.zip" \
  && unzip -d /usr/local/bin/ -o /tmp/deno.zip \
  && chmod +x /usr/local/bin/deno \
  && rm /tmp/deno.zip

COPY server /usr/local/server
RUN cd /usr/local/server && deno check server.ts && deno cache server.ts

COPY wizard-server /usr/local/wizard-server
RUN cd /usr/local/wizard-server && deno check wizard-server.ts && deno cache wizard-server.ts

COPY startLighthouse.sh /opt/lighthouse
COPY server/settings/defaultsettings-${NETWORK}.json /opt/lighthouse/defaultsettings.json
RUN chmod a+x /opt/lighthouse/startLighthouse.sh

COPY supervisord.conf /etc/supervisord.conf

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]
