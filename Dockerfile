# Usa la imagen de Node.js
FROM node:18


# Configura el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos necesarios
COPY package*.json ./
RUN npm install

COPY . .


# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "start:dev"]