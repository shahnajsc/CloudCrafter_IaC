# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install


COPY prisma ./prisma
COPY src ./src

RUN npm run build

# --- Runtime Stage ---
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --chmod=755 entrypoint.sh /usr/local/bin

EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
