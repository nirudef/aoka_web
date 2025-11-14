# 1. Base Stage: Устанавливает Node.js и зависимости
# Используем образ с Node.js, который будет общим для всех сборок
FROM node:20-alpine AS base

# Установка переменных окружения
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Устанавливаем зависимости и кэшируем их
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 2. Builder Stage: Собирает Next.js приложение
# Копируем зависимости из предыдущего этапа
FROM base AS builder
WORKDIR /app
COPY . .

# Установите переменные окружения, необходимые для сборки
# Пример: ENV NEXT_PUBLIC_API_URL=https://api.aoka.kz

# Собираем приложение
RUN npm run build

# 3. Runner Stage: Финальный, минимальный образ для продакшена
# Используем минимальный образ Node.js для сокращения размера
FROM node:20-alpine AS runner
WORKDIR /app

# Настраиваем среду
ENV NODE_ENV production
# Next.js требует этот путь
ENV NEXT_TELEMETRY_DISABLED 1

# Копируем только то, что нужно для запуска:
# 1. Сборка (Next.js .next папка)
COPY --from=builder /app/.next ./.next
# 2. Публичные файлы
COPY --from=builder /app/public ./public
# 3. Файлы Node.js для запуска
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/node_modules ./node_modules

# Пользователь для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Указываем, какой порт слушать (по умолчанию 3000)
EXPOSE 3000

# Запускаем приложение в продакшене
CMD ["npm", "start"]
