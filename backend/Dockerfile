# Dockerfile para o Backend (Node.js/TypeScript)

# Imagem base
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências de produção
RUN npm install --only=production

# Copia o restante dos arquivos da aplicação
COPY . .

# Compila o TypeScript (se aplicável)
# RUN npm run build # Descomente se você tiver um script de build para TypeScript

# Imagem final menor
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist # Supondo que o build do TS vá para a pasta dist
# Se não houver build, copie os arquivos .js diretamente ou os .ts se for rodar com ts-node
# COPY --from=builder /usr/src/app/src ./src

# Expõe a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "node", "dist/server.js" ] # Ajuste conforme o entrypoint da sua aplicação compilada
# CMD [ "npm", "start" ] # Ou use o script de start do package.json

