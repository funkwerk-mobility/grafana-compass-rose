# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build

# Final stage - just the built plugin
FROM alpine:latest
COPY --from=builder /app/dist /plugin
