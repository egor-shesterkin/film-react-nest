FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies required for building.
COPY package*.json ./
RUN npm ci

# Build NestJS app into dist.
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only.
COPY package*.json ./
RUN npm ci --omit=dev

# Run compiled production code.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/main"]
