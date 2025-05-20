# Dockerfile para o Frontend (React Native) - Ambiente de Desenvolvimento

# Imagem base com Node.js e Android SDK (ajuste conforme necessidade para iOS)
FROM reactnativecommunity/react-native-android AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe as portas necessárias para o Metro Bundler e outros serviços
EXPOSE 8081
EXPOSE 5555 # Para ADB

# Comando padrão para iniciar o Metro Bundler (ou o que for necessário para o dev)
# Este Dockerfile é mais para encapsular o ambiente de desenvolvimento.
# Para build de produção, o processo é diferente e geralmente feito fora do Docker ou em um estágio de build específico.
CMD [ "npm", "start" ]

