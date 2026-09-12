FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx expo export -p web

FROM node:22-bookworm-slim
WORKDIR /app
RUN npm i -g serve@14
COPY --from=build /app/dist ./dist
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "serve dist -s -l tcp://0.0.0.0:${PORT}"]
