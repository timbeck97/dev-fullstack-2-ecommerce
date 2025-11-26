FROM node:20

WORKDIR /usr/src/app

 apt-get update && apt-get install -y python3 make g++


COPY package*.json ./

# Instalar dependências normalmente
RUN npm install

RUN npm rebuild better-sqlite3 --build-from-source


COPY . .

EXPOSE 5000
CMD ["npx", "ts-node", "src/index.ts"]
