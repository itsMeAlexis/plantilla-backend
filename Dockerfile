# Imagen base
FROM node:20

# Establecer directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto (ajusta si es necesario)
EXPOSE 5500

# Comando para iniciar la app
CMD ["npm", "run", "dev"]
