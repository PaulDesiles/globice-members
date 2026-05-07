# This image provides a container to build Meteor server bundles.
# Bundling is not done when building the container but inside
# an interactive terminal session in a container.

FROM node:14-bullseye

RUN apt-get update && apt-get install -y \
    curl \
    git \
    vim \
    nano \
    less \
    procps \
    net-tools \
    wget \
    jq \
    gosu \
    tini \
    && rm -rf /var/lib/apt/lists/*

# Redirect npm's global prefix to a user-owned directory so that
# npm install -g does not require root.
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.meteor:/home/node/.npm-global/bin:$PATH

# Install Meteor npm shim and pre-download the toolchain, both as the
# non-root user (shim lands in ~/.npm-global, toolchain in ~/.meteor).
USER node
RUN npm install -g meteor@2.7.3
RUN meteor --version

USER root
RUN mkdir -p /app/globice-crew/.meteor/local && chown -R node:node /app

COPY --chown=node:node \
    .meteor \
    client \
    imports \
    public \
    server \
    tests \
    package*.json \
    vue.config.js \
    /app/globice-crew

USER node
RUN cd /app/globice-crew && npm install

# TODO: build once and keep the meteor cache inside the image (would save 5min per bundle)

VOLUME /app/globice-crew/.meteor/local

WORKDIR /app/globice-crew
USER root
ENTRYPOINT ["tini"]
CMD ["/bin/bash", "--login"]
