# Etapa de compilación
FROM node:20 as build
WORKDIR /home/app
COPY package*.json .
RUN npm install
COPY . /home/app
RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=build /home/app/dist/devsu-test/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]