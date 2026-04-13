FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first to leverage Docker layer cache.
COPY package*.json ./
RUN npm ci

# Build frontend static files.
COPY . .
ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL
RUN npm run build

FROM alpine:3.20 AS runner

WORKDIR /app

# Final image contains only compiled static assets.
COPY --from=builder /app/dist ./dist

# The built dist files are copied to this mounted volume.
VOLUME ["/build"]

CMD ["sh", "-c", "rm -rf /build/* && cp -r /app/dist/. /build/"]
