# ClearQR web app as a small static container.
# Stage 1 builds the static export; stage 2 serves it with nginx (no Node at run time).
# CLEARQR_BASE_PATH is the subpath the app lives under (default empty, a site root such as https://clearqr.app/); set it to /clearqr or another subpath to serve from one.

FROM node:24-bookworm-slim AS build
WORKDIR /app
ARG CLEARQR_BASE_PATH=
# Optional links shown in the page, fixed at build time. Leave the tip link empty to hide the tip card.
ARG NEXT_PUBLIC_CLEARQR_TIP_URL=
ARG NEXT_PUBLIC_CLEARQR_CONTACT_URL=
# The guide site, for the "Full step-by-step guide" links. Leave empty to hide them.
ARG NEXT_PUBLIC_CLEARQR_GUIDES_URL=
# Set to 1 for a release build: a guide page that still shows the placeholder fails the build.
ARG CLEARQR_STRICT=
ENV CLEARQR_BASE_PATH=${CLEARQR_BASE_PATH} \
    NEXT_PUBLIC_CLEARQR_TIP_URL=${NEXT_PUBLIC_CLEARQR_TIP_URL} \
    NEXT_PUBLIC_CLEARQR_CONTACT_URL=${NEXT_PUBLIC_CLEARQR_CONTACT_URL} \
    NEXT_PUBLIC_CLEARQR_GUIDES_URL=${NEXT_PUBLIC_CLEARQR_GUIDES_URL} \
    CLEARQR_STRICT=${CLEARQR_STRICT} \
    NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
ARG CLEARQR_BASE_PATH=
# Redirect-only mode: set to the new site address (https only) and this image answers every path with a 301 to it.
ARG CLEARQR_REDIRECT_TO=
ARG CLEARQR_VERSION=dev
ARG CLEARQR_REVISION=unknown
ARG CLEARQR_CREATED=unknown
LABEL org.opencontainers.image.title="ClearQR" \
      org.opencontainers.image.description="Free, private QR code generator. Everything runs in your browser." \
      org.opencontainers.image.version="${CLEARQR_VERSION}" \
      org.opencontainers.image.revision="${CLEARQR_REVISION}" \
      org.opencontainers.image.created="${CLEARQR_CREATED}" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/ClearSky-Digital/clearQR" \
      org.opencontainers.image.url="https://cscloud.digital" \
      org.opencontainers.image.vendor="ClearSky Digital LLC"
USER root
COPY deploy/nginx.conf deploy/nginx-redirect.conf /tmp/
# The base path is fixed at build time, like the pages themselves.
RUN if [ -n "${CLEARQR_REDIRECT_TO}" ]; then       T="${CLEARQR_REDIRECT_TO%/}";       printf '%s' "$T" | grep -Eq '^https://[A-Za-z0-9.-]+(:[0-9]+)?(/[A-Za-z0-9._~/-]*)?$' || { echo "CLEARQR_REDIRECT_TO must be a plain https address"; exit 1; };       sed -e "s#__TARGET__#$T#g" -e "s#__BASE__#${CLEARQR_BASE_PATH}#g" /tmp/nginx-redirect.conf > /etc/nginx/conf.d/default.conf;     else       sed "s#__BASE__#${CLEARQR_BASE_PATH}#g" /tmp/nginx.conf > /etc/nginx/conf.d/default.conf;     fi  && if [ -z "${CLEARQR_BASE_PATH}" ]; then sed -i '/# subpath-start/,/# subpath-end/d' /etc/nginx/conf.d/default.conf; fi  && rm /tmp/nginx.conf /tmp/nginx-redirect.conf /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY --from=build /app/out /usr/share/nginx/html${CLEARQR_BASE_PATH}
USER 101
ENV CLEARQR_BASE_PATH=${CLEARQR_BASE_PATH}
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:8080/healthz" || exit 1
