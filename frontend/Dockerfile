# İki aşamalı derleme: makineye Node kurulmasına gerek yoktur.
# Aynı Dockerfile Windows ve macOS'ta aynı sonucu üretir.

FROM node:22-alpine AS derleme
WORKDIR /kaynak

# Önce bağımlılıklar; package.json değişmedikçe bu katman önbellekten gelir
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /uygulama

ENV NODE_ENV=production
# Sunucu tarafı render sırasında backend'e bu adresten erişilir
ENV BIDB_API=http://backend:8080
# Angular SSR, bilinmeyen host başlıklarını güvenlik gereği reddeder
ENV ALLOWED_HOSTS=localhost,127.0.0.1,bidb.hacettepe.edu.tr

COPY --from=derleme /kaynak/dist ./dist

EXPOSE 4000
CMD ["node", "dist/frontend/server/server.mjs"]
