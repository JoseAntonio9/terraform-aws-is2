# Etapa 1: Construcción con Node
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Definimos que la API estará en la ruta relativa /api
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Etapa 2: Servidor Nginx (Producción)
FROM nginx:alpine
# Copiamos los archivos estáticos generados por React
COPY --from=builder /app/build /usr/share/nginx/html
# Copiamos la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
