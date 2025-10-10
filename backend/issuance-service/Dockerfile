# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# copy configs + src only
COPY tsconfig.json tsconfig.build.json jest.config.cjs ./
COPY src ./src

# compile with build-only tsconfig
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm ci --omit=dev --no-audit --no-fund

ENV PORT=4001
ENV SERVICE_NAME=issuance-service
ENV LOG_LEVEL=info
ENV ISSUANCE_DB_FILE=/data/issuance.db

EXPOSE 4001
CMD ["node", "dist/index.js"]
