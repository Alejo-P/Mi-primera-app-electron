# Imagen base para la aplicación frontend
# Usando Node.js 20 en una imagen Alpine para un tamaño reducido
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración y dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install --legacy-peer-deps

# Instalar Vite de forma global
RUN npm install -g vite

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 5173

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev-docker"]