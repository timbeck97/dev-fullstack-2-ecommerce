FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ----------------------------
# NGINX COM SUPORTE A SPA
# ----------------------------
FROM nginx:alpine

# Copia o build do React
COPY --from=build /app/build /usr/share/nginx/html

# Copia config customizada do nginx com fallback para index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
