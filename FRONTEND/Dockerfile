# Usar la imagen de Node.js v20 ligera como base
FROM node:20-alpine

# Instalar dependencias globales útiles si es necesario
# Nota: git y bash a veces son requeridos por herramientas de Expo
RUN apk add --no-interactive --no-cache bash git

WORKDIR /usr/src/app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código del frontend al contenedor
COPY . .

# Exponer el puerto por defecto de Metro Bundler (Expo SDK 54+)
EXPOSE 8081

# Iniciar Expo en modo LAN para ser accesible en la red local
CMD [ "npx", "expo", "start", "--lan" ]
