# ---------------------------------------------------------------------------- #
#                                     Build                                    #
# ---------------------------------------------------------------------------- #
FROM node:lts-slim as builder

# update packages, to reduce risk of vulnerabilities
RUN apt-get update && apt-get upgrade -y 
RUN apt-get install -y wget
RUN apt-get autoclean -y && apt-get autoremove -y

# Getting dumb-init 
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 && \
echo "057ecd4ac1d3c3be31f82fc0848bf77b1326a975b4f8423fe31607205a0fe945  /usr/local/bin/dumb-init" | sha256sum -c - && \
chmod 755 /usr/local/bin/dumb-init

WORKDIR /home/app
COPY . /home/app

RUN npm install -g pnpm
RUN pnpm config set store-dir .pnpm-store
RUN pnpm install --frozen-lockfile
RUN pnpm build

# ---------------------------------------------------------------------------- #
#                                    Deploy                                    #
# ---------------------------------------------------------------------------- #

FROM node:16.16.0-bullseye-slim AS release

# Should be all feed in pipeline
ARG ENVIRONMENT
ARG DB_NAME
ARG DB_USER
ARG DB_PWD
ARG DB_HOST
ARG DB_PORT
ARG BCRYPT_ROUNDS
ARG REDIS_PORT
ARG REDIS_DB
ARG REDIS_PASSWORD
ARG REDIS_PREFIX

ENV ENVIRONMENT={ENVIRONMENT}
ENV DB_NAME={DB_NAME}
ENV DB_USER={DB_USER}
ENV DB_PWD={DB_PWD}
ENV DB_HOST={DB_HOST}
ENV DB_PORT={DB_PORT}
ENV BCRYPT_ROUNDS={BCRYPT_ROUNDS}
ENV REDIS_PORT={REDIS_PORT}
ENV REDIS_DB={REDIS_DB}
ENV REDIS_PASSWORD={REDIS_PASSWORD}
ENV REDIS_PREFIX={REDIS_PREFIX}

USER node

COPY --chown=node:node --from=builder /usr/local/bin/dumb-init /usr/local/bin/dumb-init
COPY --chown=node:node --from=builder /home/app /home/app

WORKDIR /home/app

EXPOSE ${PORT}

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD [ "node", "./dist/main.js" ]
