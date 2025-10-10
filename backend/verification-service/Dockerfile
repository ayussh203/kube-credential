FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json tsconfig.build.json jest.config.cjs ./
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
RUN npm ci --omit=dev --no-audit --no-fund
ENV PORT=4002
ENV SERVICE_NAME=verification-service
ENV LOG_LEVEL=info
ENV ISSUANCE_DB_FILE=/data/issuance.db
ENV VERIFICATION_DB_FILE=/data/verification.db
EXPOSE 4002
CMD ["node", "dist/index.js"]
