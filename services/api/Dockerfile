FROM node:20-alpine AS build

WORKDIR /app

COPY services/api/package.json services/api/package-lock.json ./services/api/

WORKDIR /app/services/api

RUN npm ci

COPY services/api/ ./

RUN npm run build

FROM node:20-alpine AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app/services/api

COPY services/api/package.json services/api/package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts \
  && addgroup -S clara \
  && adduser -S clara -G clara \
  && chown -R clara:clara /app

COPY --from=build /app/services/api/dist ./dist

USER clara

EXPOSE 3000

CMD ["node", "dist/main.js"]
