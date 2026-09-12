FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Optional build-time overrides; the app also reads app.json extra and code fallbacks.
ARG EXPO_PUBLIC_POSTHOG_KEY
ARG EXPO_PUBLIC_POSTHOG_HOST
ENV EXPO_PUBLIC_POSTHOG_KEY=$EXPO_PUBLIC_POSTHOG_KEY
ENV EXPO_PUBLIC_POSTHOG_HOST=$EXPO_PUBLIC_POSTHOG_HOST

RUN npm run export:web

FROM node:22-bookworm-slim
WORKDIR /app
RUN npm i -g serve@14
COPY --from=build /app/dist ./dist
COPY serve.json ./dist/serve.json
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "serve dist -s -l tcp://0.0.0.0:${PORT}"]
