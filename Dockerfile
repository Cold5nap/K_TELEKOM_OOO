# Базовый образ с Node.js и corepack для pnpm
FROM node:20-slim AS base

RUN npm install -g pnpm@10.11.0

WORKDIR /app/client

# Установка зависимостей с кэшированием
FROM base AS deps
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm install

# Сборка приложения
FROM base AS build
COPY client/ ./
COPY --from=deps /app/client/node_modules ./node_modules
RUN pnpm run build

# Финальный образ с продакшен-артефактами
FROM node:20-slim AS prod

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY --from=deps /app/client/node_modules ./node_modules
COPY --from=build /app/client/dist ./dist
COPY client/package.json ./

FROM python:3.12.5-slim-bookworm
# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем Python зависимости
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем Django проект
COPY server/ .

# Копируем собранный фронтенд из предыдущего этапа
COPY --from=prod /app/dist /app/static

COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Команда для запуска миграций и сервера
CMD ["/wait-for-db.sh", "sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8002 manager.wsgi:application"]