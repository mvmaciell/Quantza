# Documentação Técnica Detalhada do Aplicativo Quantza

**Versão:** 1.0 (MVP)
**Data:** 15 de Maio de 2025

## 1. Introdução

Este documento fornece uma visão técnica aprofundada do aplicativo Quantza, abrangendo sua arquitetura, estrutura de código, principais funcionalidades e guias para customização e manutenção. O objetivo é capacitar desenvolvedores a entender, modificar e evoluir o aplicativo de forma eficiente.

O Quantza é um aplicativo de mobilidade desenvolvido com React Native para o frontend (iOS e Android) e Node.js com TypeScript para o backend, utilizando PostgreSQL como banco de dados. O projeto foi estruturado com foco em modularidade, escalabilidade e manutenibilidade.

## 2. Estrutura Geral do Projeto

O projeto está dividido em duas principais pastas na raiz `/home/ubuntu/quantza_app/`:

*   **`frontend/`**: Contém todo o código-fonte do aplicativo mobile React Native.
*   **`backend/`**: Contém todo o código-fonte da API e serviços do backend.
*   **`docs/`**: Contém toda a documentação do projeto, incluindo este documento, mockups, guias de configuração, etc.
*   **`docker-compose.yml`**: Orquestra os serviços de frontend, backend e banco de dados para o ambiente de desenvolvimento.

### 2.1. Estrutura do Frontend (`/home/ubuntu/quantza_app/frontend/`)

```
frontend/
├── android/             # Código específico da plataforma Android
├── ios/                 # Código específico da plataforma iOS
├── src/
│   ├── assets/          # Imagens, fontes, etc.
│   ├── components/      # Componentes React Native reutilizáveis
│   │   ├── gamification/ # Componentes específicos de gamificação
│   │   └── RideRequestModal.tsx
│   │   └── ProfileSwitcher.tsx
│   ├── navigation/      # Configuração da navegação (React Navigation)
│   ├── screens/         # Telas do aplicativo
│   │   ├── AppScreens/    # Telas principais após login (Home, Corrida, etc.)
│   │   │   ├── __tests__/ # Testes para as telas principais
│   │   │   └── ... (HomeScreen_v3.tsx, SelectDestinationScreen.tsx, etc.)
│   │   ├── AuthScreens/   # Telas de autenticação (Login, Cadastro, etc.)
│   │   └── ProfileScreens/ # Telas de perfil
│   ├── services/        # Lógica de comunicação com API, serviços locais
│   │   └── authService.ts
│   ├── store/           # Gerenciamento de estado (ex: Redux, Zustand - se implementado)
│   ├── theme/           # Configurações de tema (cores, fontes, estilos globais)
│   └── utils/           # Funções utilitárias
├── e2e/                 # Testes End-to-End com Detox
├── firebaseConfig.json_placeholder.json # Placeholder para config do Firebase
├── googleMapsConfig.json_placeholder.json # Placeholder para config do Google Maps
├── Dockerfile           # Dockerfile para o ambiente de frontend
├── package.json         # Dependências e scripts do frontend
└── ... (outros arquivos de configuração: Metro, Babel, ESLint, etc.)
```

### 2.2. Estrutura do Backend (`/home/ubuntu/quantza_app/backend/`)

```
backend/
├── src/
│   ├── config/          # Configurações da aplicação (banco de dados, Pagar.me, etc.)
│   ├── database/
│   │   ├── migrations/    # Migrations do banco de dados (TypeORM, Prisma, etc.)
│   │   └── seeds/         # Seeds para popular o banco de dados
│   ├── modules/         # Módulos de funcionalidades (Auth, User, Ride, etc.)
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   └── interfaces/  # Interfaces TypeScript
│   │   │   └── auth.service.spec.ts # Testes unitários
│   │   │   └── auth.integration.spec.ts # Testes de integração
│   │   ├── user/
│   │   ├── partner/
│   │   ├── ride/
│   │   ├── payment/
│   │   ├── points/
│   │   └── donations/
│   ├── shared/          # Módulos e utilitários compartilhados
│   │   └── middleware/    # Middlewares (autenticação, logging, etc.)
│   ├── app.module.ts    # Módulo raiz da aplicação (NestJS)
│   ├── main.ts          # Ponto de entrada da aplicação (NestJS)
│   └── ...
├── .github/             # Workflows do GitHub Actions para CI/CD
│   └── workflows/
│       └── ci.yml
├── pagarmeConfig.json_placeholder.json # Placeholder para config do Pagar.me
├── database_schema.md   # Documentação do esquema do banco de dados
├── Dockerfile           # Dockerfile para o ambiente de backend
├── package.json         # Dependências e scripts do backend
└── ... (outros arquivos de configuração: tsconfig.json, ESLint, etc.)
```

## 3. Guia de Customização e Ajustes no Código

Esta seção detalha como realizar ajustes e customizações nas principais funcionalidades do aplicativo Quantza. Para cada funcionalidade, serão indicados os arquivos relevantes e exemplos de modificações comuns.

**Antes de qualquer modificação, certifique-se de:**
*   Ter o ambiente de desenvolvimento configurado conforme o `README.md` do projeto e o guia de configuração do Detox.
*   Utilizar controle de versão (Git) para rastrear suas alterações.
*   Rodar os testes (unitários, integração, E2E) após as modificações para garantir que nada foi quebrado.




### 3.1. Autenticação (Cadastro, Login, Verificação)

#### 3.1.1. Frontend

*   **Telas:**
    *   `frontend/src/screens/AuthScreens/WelcomeScreen.tsx` (Se houver uma tela de boas-vindas separada, não listada anteriormente mas comum)
    *   `frontend/src/screens/AuthScreens/RegisterScreen.tsx`: Tela de cadastro.
    *   `frontend/src/screens/AuthScreens/LoginScreen.tsx`: Tela de login.
    *   `frontend/src/screens/AuthScreens/VerifyScreen.tsx`: Tela de verificação de e-mail/telefone.
    *   `frontend/src/screens/AuthScreens/PartnerDetailsScreen.tsx`: Tela para coletar detalhes adicionais do parceiro.
*   **Componentes:**
    *   Inputs de texto, botões (reutilizáveis de `frontend/src/components/` ou definidos localmente).
*   **Serviços:**
    *   `frontend/src/services/auth/authService.ts`: Contém as chamadas à API de autenticação do backend.

*   **Customizações Comuns (Frontend):**
    *   **Textos e Labels:** Modifique diretamente nos arquivos `.tsx` das telas. Ex: Mudar "Criar Conta" para "Registrar-se".
    *   **Validação de Campos:** A lógica de validação (ex: formato de e-mail, força da senha) geralmente está no `authService.ts` ou diretamente nos componentes de input/tela. Pode usar bibliotecas como `formik` e `yup` (verificar `package.json`).
    *   **Estilos (Cores, Fontes, Layout):** Ajuste os objetos `StyleSheet` em cada arquivo `.tsx`. Cores e fontes globais podem estar em `frontend/src/theme/`.
    *   **Fluxo de Navegação:** A navegação é gerenciada pelo React Navigation (ver `frontend/src/navigation/`). Para mudar para onde o usuário é redirecionado após login/cadastro, ajuste as chamadas `navigation.navigate()`.
    *   **Adicionar Login Social (Google, Apple):** Requer configuração no Firebase/Auth0, instalação de SDKs específicos (ex: `@react-native-google-signin/google-signin`) e implementação da lógica de login no `authService.ts` e nas telas.
    *   **`testID`s para Detox:** Certifique-se de que todos os inputs, botões e elementos interativos possuem `testID`s únicos. Ex:
        ```tsx
        // Em RegisterScreen.tsx
        <TextInput testID="registerEmailInput" ... />
        <TouchableOpacity testID="registerSubmitButton" ... />
        ```

#### 3.1.2. Backend

*   **Módulo:** `backend/src/modules/auth/`
    *   `auth.controller.ts`: Define os endpoints da API (ex: `/auth/register`, `/auth/login`).
    *   `auth.service.ts`: Contém a lógica de negócios (validação, criação de usuário no banco, geração de tokens JWT).
    *   `dto/`: Define os Data Transfer Objects para validação de payloads de requisição (ex: `RegisterUserDto`).
    *   `strategies/jwt.strategy.ts` (Exemplo, se JWT for usado): Validação de tokens JWT.
*   **Módulo de Usuário/Parceiro:** `backend/src/modules/user/` e `backend/src/modules/partner/` são envolvidos para criar/consultar perfis.

*   **Customizações Comuns (Backend):**
    *   **Regras de Senha:** Modifique a lógica de validação de senha no `auth.service.ts` ou nos DTOs (usando `class-validator`).
    *   **Configuração JWT (Tokens):** Segredo do JWT, tempo de expiração, etc., são geralmente configurados em variáveis de ambiente e usados no `AuthModule` ou `JwtStrategy`.
    *   **Integração com Serviços de E-mail:** Para envio de e-mail de verificação/boas-vindas, integre um serviço como SendGrid, Mailgun (a lógica estaria no `auth.service.ts` ou em um serviço de notificação separado).
    *   **Lógica de Aprovação de Parceiro:** A lógica para aprovar um parceiro após o envio de detalhes está no `partner.service.ts`.

### 3.2. Fluxo de Solicitação de Corrida (Lado do Usuário)

#### 3.2.1. Frontend

*   **Telas:**
    *   `frontend/src/screens/AppScreens/HomeScreen_v3.tsx`: Ponto de partida para solicitar corrida.
    *   `frontend/src/screens/AppScreens/SelectDestinationScreen.tsx`: Seleção de origem/destino, integração com Google Maps.
    *   `frontend/src/screens/AppScreens/PriceComparatorScreen.tsx`: Exibe comparação de preços.
    *   `frontend/src/screens/AppScreens/ConfirmRideScreen.tsx`: Confirmação dos detalhes da corrida.
    *   `frontend/src/screens/AppScreens/SearchingDriverScreen.tsx`: Tela de espera enquanto busca motorista.
    *   `frontend/src/screens/AppScreens/UserTrackRideScreen.tsx` (ou similar para acompanhamento do usuário): Acompanha o motorista e a corrida.
*   **Componentes:** Componentes de mapa, inputs de endereço, cards de informação.
*   **Serviços:**
    *   Serviço para interagir com a API de corridas do backend (ex: `frontend/src/services/rideService.ts` - a ser criado ou já existente).
    *   Integração com Google Maps SDK (configuração em `googleMapsConfig.json_placeholder.json` e uso nas telas de mapa).

*   **Customizações Comuns (Frontend):**
    *   **Integração Google Maps:** Chave de API, estilos do mapa, marcadores, cálculo de rota (usando a Directions API do Google Maps).
        *   **Ajustar Chave API:** Preencha `googleMapsConfig.json_placeholder.json` e carregue no local apropriado.
        *   **Estilo do Mapa:** `HomeScreen_v3.tsx`, `SelectDestinationScreen.tsx` - procure por `customMapStyle` na props do `MapView`.
    *   **Comparador de Preços:**
        *   **Lógica de Busca de Preços de Concorrentes:** Atualmente simulado. Para dados reais, seria necessário integrar APIs de terceiros (se disponíveis e permitido) ou web scraping (complexo e instável). A lógica estaria em um serviço no frontend ou, preferencialmente, no backend.
        *   **Animação do "Raio Quantza":** Em `PriceComparatorScreen.tsx`, usando bibliotecas como `react-native-reanimated` ou `Lottie`.
    *   **Layout das Telas:** Ajuste os `StyleSheet` e a estrutura JSX nas respectivas telas.
    *   **`testID`s:** Adicione `testID`s para campos de endereço, botões de confirmação, elementos do mapa (se possível interagir via Detox), etc.

#### 3.2.2. Backend

*   **Módulo:** `backend/src/modules/ride/`
    *   `ride.controller.ts`: Endpoints para solicitar corrida, calcular preço, etc.
    *   `ride.service.ts`: Lógica de cálculo de tarifa Quantza, criação de registro de corrida no banco, busca por motoristas disponíveis (matchmaking).
    *   `dto/CreateRideDto.ts` (exemplo).
*   **Integrações:**
    *   Pode interagir com um serviço de geolocalização para calcular distâncias/tempos (ex: Google Maps Distance Matrix API).

*   **Customizações Comuns (Backend):**
    *   **Algoritmo de Precificação Quantza:** A lógica de cálculo de tarifa está no `ride.service.ts`. Pode envolver tarifa base, custo por km, custo por minuto, multiplicadores de demanda (tarifa dinâmica).
    *   **Algoritmo de Matchmaking:** A lógica para encontrar o motorista mais próximo/adequado está no `ride.service.ts`. Pode usar geolocalização (PostGIS no PostgreSQL) e status do motorista.
    *   **Comunicação em Tempo Real (Socket.io):** Configurada para notificar motoristas sobre novas corridas e atualizar o usuário sobre o status. Veja `backend/src/gateways/ride.gateway.ts` (se usar NestJS gateways) ou configuração manual do Socket.io.

### 3.3. Fluxo de Gerenciamento de Corrida (Lado do Parceiro)

#### 3.3.1. Frontend

*   **Telas:**
    *   `frontend/src/screens/AppScreens/PartnerHomeScreen.tsx`: Tela principal do parceiro (status online/offline, mapa).
    *   `frontend/src/screens/AppScreens/PartnerTrackRideScreen.tsx`: Acompanhamento da corrida (rota para passageiro, rota para destino).
*   **Componentes:**
    *   `frontend/src/components/RideRequestModal.tsx`: Modal para aceitar/recusar novas solicitações.

*   **Customizações Comuns (Frontend):**
    *   **Notificações de Nova Corrida:** Som, vibração, aparência do `RideRequestModal.tsx`.
    *   **Interação com Mapa (Navegação):** Integração com apps de navegação externos (Google Maps, Waze) é feita via `Linking` do React Native em `PartnerTrackRideScreen.tsx`.
    *   **Botões de Ação:** "Cheguei", "Iniciar Viagem", "Finalizar Corrida" - textos, estilos e ações associadas em `PartnerTrackRideScreen.tsx`.
    *   **`testID`s:** Para botões de status, modal de corrida, botões de ação na corrida.

#### 3.3.2. Backend

*   **Módulo:** `backend/src/modules/ride/`
    *   `ride.controller.ts`: Endpoints para parceiro aceitar/recusar corrida, atualizar status da corrida (chegou, iniciou, finalizou).
    *   `ride.service.ts` (ou `partner_ride.service.ts`): Lógica para atribuir corrida ao parceiro, atualizar status no banco, notificar usuário via Socket.io.

*   **Customizações Comuns (Backend):**
    *   **Lógica de Atribuição de Corrida:** Garantir que apenas um parceiro possa aceitar uma corrida.
    *   **Timeouts para Aceitação:** Lógica no `ride.service.ts` para lidar com solicitações não aceitas (ex: reatribuir para outro motorista).

--- 
*Esta documentação continuará com os demais fluxos (Pós-Corrida, Gamificação, Pagamentos, etc.) na próxima interação.*



### 3.4. Pós-Corrida e Avaliação

#### 3.4.1. Frontend

*   **Telas:**
    *   `frontend/src/screens/AppScreens/UserRideEndScreen.tsx`: Tela de fim de corrida para o usuário (resumo, avaliação do parceiro).
    *   `frontend/src/screens/AppScreens/PartnerRideEndScreen.tsx`: Tela de fim de corrida para o parceiro (ganhos, avaliação do usuário).
*   **Componentes:** Componentes de avaliação por estrelas, campos de comentário.

*   **Customizações Comuns (Frontend):**
    *   **Sistema de Avaliação:** Mudar o número de estrelas, adicionar/remover critérios de avaliação.
    *   **Textos e Layout:** Ajustar os `StyleSheet` e a estrutura JSX nas telas.
    *   **`testID`s:** Para estrelas de avaliação, campos de comentário, botões de submissão.

#### 3.4.2. Backend

*   **Módulo:** `backend/src/modules/ride/` ou um novo módulo `backend/src/modules/rating/`.
    *   Controller: Endpoints para submeter avaliações.
    *   Service: Lógica para salvar avaliações no banco, calcular média de avaliação de usuários/parceiros.

*   **Customizações Comuns (Backend):**
    *   **Cálculo de Média de Avaliação:** Ajustar a lógica no serviço correspondente.
    *   **Armazenamento de Comentários:** Definir como os comentários são armazenados e se há moderação.

### 3.5. Gamificação, Pontos e Doações

#### 3.5.1. Frontend

*   **Telas:**
    *   `frontend/src/screens/AppScreens/UserPointsScreen.tsx`: Exibe saldo e histórico de pontos.
    *   `frontend/src/screens/AppScreens/UserDonationsScreen.tsx`: Exibe histórico de doações.
*   **Componentes:**
    *   `frontend/src/components/gamification/PostRideAnimations.tsx`: Animações de ganho de pontos, doações.

*   **Customizações Comuns (Frontend):**
    *   **Animações:** Substituir ou modificar as animações (Lottie, Reanimated) em `PostRideAnimations.tsx`.
    *   **Exibição de Pontos/Doações:** Ajustar o layout e informações nas telas `UserPointsScreen.tsx` e `UserDonationsScreen.tsx`.
    *   **`testID`s:** Para elementos de saldo, itens do histórico.

#### 3.5.2. Backend

*   **Módulos:**
    *   `backend/src/modules/points/points.service.ts`: Lógica de cálculo e atribuição de pontos.
    *   `backend/src/modules/donations/donations.service.ts`: Lógica para registrar doações.
    *   `backend/src/modules/ride/ride.service.ts`: Chama os serviços de pontos e doações ao finalizar uma corrida.

*   **Customizações Comuns (Backend):**
    *   **Regras de Pontuação:** Modificar a lógica de quantos pontos são ganhos por corrida (ex: baseado em valor, distância, tipo de usuário) em `points.service.ts`.
    *   **Percentual de Doação:** Ajustar o percentual (atualmente 1%) em `donations.service.ts` ou `ride.service.ts`.
    *   **Causa da Doação:** A configuração da entidade/causa para a qual a doação é destinada (atualmente placeholder).

### 3.6. Pagamentos e Assinatura Premium

#### 3.6.1. Frontend

*   **Telas:**
    *   `frontend/src/screens/AppScreens/PremiumSubscriptionScreen.tsx`: Apresenta o plano Premium e permite a contratação.
    *   `frontend/src/screens/AppScreens/UserWalletScreen.tsx`: Gerenciamento de métodos de pagamento.
*   **Serviços:**
    *   Serviço para interagir com a API de pagamentos do backend (ex: `frontend/src/services/paymentService.ts` - a ser criado ou já existente), que por sua vez interage com o Pagar.me.

*   **Customizações Comuns (Frontend):**
    *   **Benefícios do Premium:** Atualizar os textos e layout em `PremiumSubscriptionScreen.tsx`.
    *   **Fluxo de Pagamento Pagar.me:** A integração com o Pagar.me no frontend pode envolver a coleta segura de dados do cartão (usando o SDK do Pagar.me se disponível para React Native, ou um WebView seguro, ou tokenização). A lógica de processamento do pagamento em si é no backend.
    *   **Gerenciamento de Cartões:** Adicionar/remover cartões em `UserWalletScreen.tsx`.
    *   **`testID`s:** Para botões de assinatura, campos de formulário de pagamento.

#### 3.6.2. Backend

*   **Módulo:** `backend/src/modules/payment/pagarme.service.ts`: Contém a lógica de integração com a API do Pagar.me para processar pagamentos de corridas e assinaturas.
*   **Módulo de Usuário/Assinatura:** Um módulo para gerenciar o status da assinatura Premium dos usuários.

*   **Customizações Comuns (Backend):**
    *   **Chaves Pagar.me:** Configurar as chaves de API (secret key) do Pagar.me em `pagarmeConfig.json_placeholder.json` e carregá-las de forma segura no `pagarme.service.ts` (idealmente via variáveis de ambiente).
    *   **Lógica de Assinatura:** Criação de planos no Pagar.me, gerenciamento de assinaturas (cobrança recorrente), webhooks para status de pagamento.
    *   **Processamento de Pagamento de Corridas:** Lógica para cobrar o usuário após a corrida.

### 3.7. Ganhos e Incentivos do Parceiro

#### 3.7.1. Frontend

*   **Telas:**
    *   `frontend/src/screens/AppScreens/PartnerEarningsScreen.tsx`: Exibe ganhos e permite solicitar saque.
    *   `frontend/src/screens/AppScreens/PartnerIncentivesScreen.tsx`: Tela placeholder para programa de incentivos.

*   **Customizações Comuns (Frontend):**
    *   **Exibição de Ganhos:** Formato do extrato, gráficos de ganhos em `PartnerEarningsScreen.tsx`.
    *   **Fluxo de Saque:** Atualmente mockado. Para um fluxo real, precisaria de campos para dados bancários e integração com um sistema de pagamento a parceiros.
    *   **Programa de Incentivos:** Desenvolver a UI e lógica para exibir metas, progresso e recompensas em `PartnerIncentivesScreen.tsx`.
    *   **`testID`s:** Para elementos de saldo, botão de saque, itens de incentivo.

#### 3.7.2. Backend

*   **Módulo:** `backend/src/modules/partner/` ou um novo módulo `backend/src/modules/earnings/`.
    *   Service: Lógica para calcular ganhos do parceiro (comissão Quantza), registrar solicitações de saque.
    *   Controller: Endpoints para parceiro visualizar ganhos e solicitar saque.
*   **Módulo de Incentivos:** Lógica para definir e rastrear metas de incentivos.

*   **Customizações Comuns (Backend):**
    *   **Cálculo de Comissão:** Definir a porcentagem da Quantza sobre as corridas.
    *   **Sistema de Pagamento a Parceiros:** Integrar com uma plataforma para realizar os pagamentos dos saques (atualmente mockado).
    *   **Lógica de Incentivos:** Definir regras para bônus, recompensas por número de corridas, avaliação, etc.

## 4. Testes

O projeto Quantza inclui uma estrutura para testes unitários, de integração e E2E.

*   **Testes Unitários e de Integração (Backend):**
    *   Localizados dentro de cada módulo (ex: `backend/src/modules/auth/auth.service.spec.ts`).
    *   Utilizam Jest e podem usar bibliotecas como `supertest` para testes de integração de controllers.
    *   **Como rodar:** `npm test` ou `yarn test` no diretório `backend/` (verificar scripts em `package.json`).
*   **Testes Unitários e de Componentes (Frontend):**
    *   Podem ser encontrados em `frontend/src/screens/AppScreens/__tests__/` ou similares.
    *   Utilizam Jest e React Native Testing Library.
    *   **Como rodar:** `npm test` ou `yarn test` no diretório `frontend/`.
*   **Testes E2E (Frontend):**
    *   Localizados em `frontend/e2e/`.
    *   Utilizam Detox e Jest.
    *   **Como rodar:** Veja o Guia de Configuração do Detox (`docs/configuracao_ambiente_testes_detox.md`).
        ```bash
        # Exemplo
        cd frontend
        npx detox build -c android.emu.debug
        npx detox test -c android.emu.debug
        ```

*   **Adicionando Novos Testes:**
    *   Siga a estrutura existente nos diretórios de teste.
    *   Para o backend, crie arquivos `.spec.ts` para novos serviços ou controllers.
    *   Para o frontend, use a React Native Testing Library para testes de componentes e Detox para fluxos E2E, garantindo `testID`s nos componentes.

## 5. CI/CD (Integração Contínua e Deploy Contínuo)

O projeto possui uma configuração básica de CI/CD com GitHub Actions.

*   **Localização dos Workflows:**
    *   Backend: `backend/.github/workflows/ci.yml`
    *   Frontend: `frontend/.github/workflows/ci.yml`
*   **Funcionalidades Atuais:** Build e execução de testes (simulados para E2E no CI, a menos que runners com emuladores/simuladores estejam completamente configurados).

*   **Customizações e Melhorias:**
    *   **Deploy Automatizado:** Adicionar etapas para deploy em ambientes de staging/produção (ex: para o backend, buildar imagem Docker e push para um container registry como AWS ECR, Google GCR, Docker Hub; para o frontend, buildar o app e enviar para App Store Connect / Google Play Console usando ferramentas como Fastlane).
    *   **Configuração Completa de Testes E2E no CI:** Requer configuração robusta de emuladores/simuladores nos runners do CI (ver seção Detox no CI do guia de configuração).
    *   **Variáveis de Ambiente e Segredos:** Configurar segredos no GitHub Actions (para chaves de API, etc.) e usá-los nos workflows.

## 6. Manutenção e Boas Práticas

*   **Controle de Versão:** Use Git para todas as alterações. Siga um fluxo de trabalho como Gitflow (feature branches, develop, main).
*   **Code Style e Linting:** ESLint está configurado para frontend e backend. Use `npm run lint` ou `yarn lint` para verificar e `npm run format` ou `yarn format` (se Prettier estiver configurado) para formatar o código.
*   **Documentação:** Mantenha esta documentação e o `database_schema.md` atualizados conforme o código evolui.
*   **Gerenciamento de Dependências:** Atualize as dependências regularmente (com cautela, testando após cada atualização significativa) usando `npm update` ou `yarn upgrade`.
*   **Logging:** Implemente um sistema de logging robusto no backend (ex: Winston, Pino) para monitoramento e troubleshooting em produção.
*   **Monitoramento:** Configure ferramentas de monitoramento de performance (APM) e de erros (ex: Sentry, New Relic) para ambientes de produção.

## 7. Considerações Finais

Esta documentação visa ser um guia completo para o desenvolvimento e manutenção do aplicativo Quantza. À medida que o projeto evolui, é crucial que esta documentação seja mantida atualizada para refletir o estado atual do software.

Para dúvidas ou problemas não cobertos aqui, consulte a documentação das tecnologias específicas utilizadas (React Native, NestJS, Detox, Pagar.me, etc.) ou procure suporte nas comunidades correspondentes.

