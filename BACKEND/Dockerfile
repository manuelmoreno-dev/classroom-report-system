# Usar una versión oficial de Node.js v20 ligera como base
FROM node:20-alpine

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install

# Copiar el resto del código del backend al contenedor
COPY . .

# Expone el puerto que utiliza el Express API
EXPOSE 3000

# Comando para arrancar el servidor backend
CMD [ "node", "server.js" ]
