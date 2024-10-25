# Dockerfile

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

# Instala dependências essenciais do Chromium
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  libx11 \
  libxcomposite \
  libxdamage \
  libxi \
  libxtst \
  libxrandr \
  libxrender \
  mesa-gl \
  udev \
  dbus

# Defina o caminho do Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Criando usuário para Puppeteer
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

USER pptruser

RUN npm install
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json .

# Instala dependências essenciais do Chromium
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  libx11 \
  libxcomposite \
  libxdamage \
  libxi \
  libxtst \
  libxrandr \
  libxrender \
  mesa-gl \
  udev \
  dbus

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

USER pptruser

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .

RUN source .env

# bootstrap container
ENTRYPOINT [ "npm", "start" ]
