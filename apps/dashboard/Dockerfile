FROM node:20-alpine AS build

ARG VITE_API_BASE_URL
ARG VITE_AUTH_MODE=demo
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_AUTH_MODE=${VITE_AUTH_MODE}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

WORKDIR /app

COPY apps/dashboard/package.json apps/dashboard/package-lock.json ./apps/dashboard/

WORKDIR /app/apps/dashboard

RUN npm ci

COPY apps/dashboard/ ./

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/dashboard/dist /usr/share/nginx/html

EXPOSE 8080
