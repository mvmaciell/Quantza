# Guia de Preparação para Deploy e Entrega do MVP Quantza

**Versão:** 1.0 (MVP)
**Data:** 15 de Maio de 2025

## 1. Introdução

Este guia fornece os passos e considerações essenciais para preparar o ambiente de deploy do aplicativo Quantza (MVP) e para a entrega do código-fonte. Ele complementa a `documentacao_tecnica_quantza.md` e assume que todas as fases de desenvolvimento e testes (simulados) foram concluídas.

## 2. Checklist Pré-Deploy

Antes de iniciar o processo de deploy, verifique os seguintes itens:

*   **[ ] Código Finalizado e Testado:** Todas as funcionalidades do MVP foram implementadas e os testes (unitários, integração, E2E simulados) foram executados.
*   **[ ] Controle de Versão:** Todo o código está commitado e pushado para o repositório Git principal (branch `main` ou `master` estável).
*   **[ ] Documentação Atualizada:** A `documentacao_tecnica_quantza.md`, `database_schema.md`, e outros documentos relevantes estão atualizados.
*   **[ ] Chaves de API e Configurações:** Todas as chaves de API e configurações de ambiente para produção estão prontas e seguras (NÃO devem ser commitadas diretamente no código, exceto os arquivos placeholder).

## 3. Configurações de Ambiente para Produção

É crucial substituir os arquivos placeholder de configuração pelas chaves e credenciais reais para o ambiente de produção.

### 3.1. Backend (`/home/ubuntu/quantza_app/backend/`)

*   **`pagarmeConfig.json_placeholder.json` -> `pagarmeConfig.json` (ou variáveis de ambiente):**
    *   Substitua pelos dados reais da sua conta Pagar.me (API Key de produção).
    *   **Recomendação:** Para produção, utilize variáveis de ambiente para carregar essas chaves, em vez de um arquivo JSON versionado. O `pagarme.service.ts` deve ser adaptado para ler essas variáveis (ex: `process.env.PAGARME_API_KEY`).
*   **Configurações do Banco de Dados (PostgreSQL):**
    *   As credenciais do banco de dados (usuário, senha, host, porta, nome do banco) devem ser gerenciadas via variáveis de ambiente no ambiente de produção. O arquivo de configuração do TypeORM (ou ORM utilizado) no backend (ex: `ormconfig.js` ou configuração no `app.module.ts`) deve ser capaz de ler essas variáveis.
*   **Segredo JWT:**
    *   O segredo para assinar os tokens JWT (usado no `auth.module.ts` ou `jwt.strategy.ts`) DEVE ser uma string longa, complexa e única, gerenciada via variável de ambiente (ex: `JWT_SECRET`).
*   **Outras Configurações (Firebase Admin SDK, etc.):**
    *   Se o backend utilizar o Firebase Admin SDK (para notificações push avançadas, por exemplo), o arquivo de credenciais JSON do Firebase deve ser armazenado de forma segura no servidor de produção e seu caminho fornecido via variável de ambiente.

### 3.2. Frontend (`/home/ubuntu/quantza_app/frontend/`)

*   **`firebaseConfig.json_placeholder.json` -> `firebaseConfig.json` (ou configuração em tempo de build):**
    *   Substitua pelos dados reais do seu projeto Firebase (apiKey, authDomain, projectId, etc.) para o aplicativo de produção (iOS e Android).
    *   **Recomendação:** Para segurança, considere carregar essas configurações via variáveis de ambiente durante o processo de build do aplicativo ou usar diferentes arquivos de configuração por ambiente (ex: `firebase.prod.js`).
*   **`googleMapsConfig.json_placeholder.json` -> `googleMapsConfig.json` (ou configuração em tempo de build):**
    *   Substitua pela sua chave de API do Google Maps Platform habilitada para os SDKs de Android e iOS, e para as APIs de Geocoding, Places, Directions, Distance Matrix, etc., que o Quantza utiliza.
    *   Restrinja o uso da chave de API no Google Cloud Console para os IDs dos seus aplicativos Android e iOS e para os domínios/IPs do seu backend (se a chave for usada lá também).

## 4. Build para Produção

### 4.1. Backend

O backend é uma aplicação Node.js/TypeScript e será executado como um container Docker em produção.

1.  **Construir a Imagem Docker:**
    ```bash
    cd /home/ubuntu/quantza_app/backend
    docker build -t quantza-backend:latest .
    ```
    Este comando utiliza o `Dockerfile` presente na pasta `backend/`.
2.  **Considerações para a Imagem Docker de Produção:**
    *   O `Dockerfile` deve ser otimizado para produção (multi-stage builds para reduzir o tamanho da imagem, remover dependências de desenvolvimento, etc.).
    *   Certifique-se de que o `CMD` no Dockerfile inicia a aplicação em modo de produção (ex: `npm run start:prod`).

### 4.2. Frontend (React Native)

Gerar os builds de release para Android e iOS.

*   **Android (APK ou AAB):**
    1.  **Configurar Assinatura:** Siga a documentação do React Native para [gerar uma chave de upload](https://reactnative.dev/docs/signed-apk-android#generating-an-upload-key) e [configurar as variáveis do Gradle](https://reactnative.dev/docs/signed-apk-android#setting-up-gradle-variables) com as informações da sua keystore.
    2.  **Gerar o Android App Bundle (AAB) (Recomendado para Google Play):**
        ```bash
        cd /home/ubuntu/quantza_app/frontend/android
        ./gradlew bundleRelease
        ```
        O AAB estará em `frontend/android/app/build/outputs/bundle/release/app-release.aab`.
    3.  **Gerar APK (Opcional):**
        ```bash
        cd /home/ubuntu/quantza_app/frontend/android
        ./gradlew assembleRelease
        ```
        O APK estará em `frontend/android/app/build/outputs/apk/release/app-release.apk`.

*   **iOS (IPA):**
    1.  **Configurar Assinatura e Provisionamento:** Configure os certificados de distribuição e perfis de provisionamento no Apple Developer Console e no Xcode.
    2.  **Arquivar e Distribuir via Xcode:**
        *   Abra o projeto iOS (`frontend/ios/QuantzaFrontend.xcworkspace`) no Xcode.
        *   Selecione "Any iOS Device (arm64)" como destino.
        *   Vá em Product > Scheme > Edit Scheme, selecione "Run" e configure "Build Configuration" para "Release".
        *   Vá em Product > Archive.
        *   Após o arquivamento, o Xcode Organizer abrirá. Selecione o arquivo e clique em "Distribute App" para gerar o IPA e/ou enviar para o App Store Connect.
    3.  **Via Linha de Comando (Avançado, usando Fastlane):** Ferramentas como [Fastlane](https://fastlane.tools/) podem automatizar o processo de build e deploy para iOS e Android.

## 5. Estratégias de Deploy

### 5.1. Backend

*   **Plataformas de Container:**
    *   **AWS:** Elastic Kubernetes Service (EKS), Elastic Container Service (ECS), Fargate.
    *   **Google Cloud:** Google Kubernetes Engine (GKE), Cloud Run.
    *   **Azure:** Azure Kubernetes Service (AKS), Azure Container Instances.
    *   **Outros:** DigitalOcean Kubernetes, Heroku (para Docker deploys).
*   **Banco de Dados:** Utilize um serviço de banco de dados gerenciado (AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL) para escalabilidade, backups e manutenção.
*   **CI/CD:** Configure seu pipeline de CI/CD (GitHub Actions, GitLab CI, Jenkins, etc.) para construir a imagem Docker e fazer deploy automaticamente em um ambiente de staging e, após aprovação, em produção.

### 5.2. Frontend

*   **Google Play Store (Android):**
    *   Crie uma conta no [Google Play Console](https://play.google.com/console).
    *   Siga as instruções para criar uma nova aplicação, preencher os detalhes da loja (descrição, screenshots, política de privacidade), e fazer upload do seu AAB (ou APK).
*   **Apple App Store (iOS):**
    *   Crie uma conta no [Apple Developer Program](https://developer.apple.com/programs/).
    *   Use o [App Store Connect](https://appstoreconnect.apple.com/) para criar um novo registro de aplicativo, preencher os metadados, fazer upload do build (IPA via Xcode ou Transporter) e enviar para revisão.

## 6. Empacotamento do Código para Entrega

Para entregar o código-fonte do MVP:

1.  **Limpeza (Opcional, mas recomendado):**
    *   Remova `node_modules/` de `frontend/` e `backend/`.
    *   Remova pastas de build (ex: `frontend/android/app/build/`, `frontend/ios/build/`).
    *   Certifique-se de que nenhum arquivo de configuração com segredos reais (`.env`, `firebaseConfig.json` preenchido, etc.) está incluído. Apenas os arquivos `_placeholder.json` devem estar presentes.
2.  **Compactação:**
    *   Crie um arquivo ZIP ou TAR.GZ da pasta raiz do projeto (`/home/ubuntu/quantza_app/`).
    ```bash
    # Exemplo na pasta /home/ubuntu/
    zip -r quantza_mvp_entrega.zip quantza_app/
    # ou
    tar -czvf quantza_mvp_entrega.tar.gz quantza_app/
    ```
3.  **Inclusão da Documentação:** Certifique-se de que a pasta `docs/` com toda a documentação está incluída no pacote.

## 7. Considerações Pós-Deploy (Manutenção)

*   **Monitoramento:** Configure monitoramento de logs, performance e erros para o backend e frontend.
*   **Backups:** Garanta que o banco de dados de produção tenha backups regulares.
*   **Atualizações de Segurança:** Mantenha as dependências e sistemas operacionais atualizados.
*   **Feedback do Usuário:** Colete feedback dos usuários para planejar futuras iterações e melhorias.

Este guia fornece os passos iniciais para o deploy. Cada plataforma de cloud e loja de aplicativos possui suas próprias especificidades que devem ser consultadas em suas documentações oficiais.

