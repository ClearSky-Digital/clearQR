# ClearQR web app as a small static container.
# Stage 1 builds the static export; stage 2 serves it with nginx (no Node at run time).
# CLEARQR_BASE_PATH is the subpath the app lives under (default /clearQR); set it to "" for a site root.

FROM node:24-bookworm-slim AS build
WORKDIR /app
ARG CLEARQR_BASE_PATH=/clearQR
ENV CLEARQR_BASE_PATH=${CLEARQR_BASE_PATH} \
    NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
ARG CLEARQR_BASE_PATH=/clearQR
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
COPY deploy/nginx.conf /tmp/clearqr.conf
# The base path is fixed at build time, like the pages themselves.
RUN sed "s#__BASE__#${CLEARQR_BASE_PATH}#g" /tmp/clearqr.conf > /etc/nginx/conf.d/default.conf \
 && if [ -z "${CLEARQR_BASE_PATH}" ]; then sed -i '/# subpath-start/,/# subpath-end/d' /etc/nginx/conf.d/default.conf; fi \
 && rm /tmp/clearqr.conf /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY --from=build /app/out /usr/share/nginx/html${CLEARQR_BASE_PATH}
USER 101
ENV CLEARQR_BASE_PATH=${CLEARQR_BASE_PATH}
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:8080${CLEARQR_BASE_PATH}/" || exit 1
