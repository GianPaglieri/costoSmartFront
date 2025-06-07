# Establece la imagen base
FROM node:14-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /frontend

# Copia los archivos necesarios
COPY package.json .
COPY package-lock.json .

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto en el que el frontend está escuchando
EXPOSE 19006

# Comando para iniciar el servidor web
CMD [ "npx", "expo", "start", "--web" ]


