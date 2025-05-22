# Quantza - Aplicativo de Mobilidade e Serviços

![Quantza Logo](https://via.placeholder.com/150x50?text=Quantza)

## Sobre o Projeto

Quantza é uma plataforma completa de mobilidade e serviços que conecta usuários e parceiros através de uma experiência digital intuitiva, segura e eficiente. O aplicativo oferece diversos tipos de serviços, incluindo corridas tradicionais, entregas, transporte de pets, viagens longas e transporte acessível.

## Funcionalidades Principais

### Para Usuários
- **Múltiplos Serviços**: Solicite corridas, entregas, transporte de pets, viagens longas e transporte acessível
- **Pagamentos Integrados**: Gerencie métodos de pagamento e visualize histórico de transações
- **Sistema de Pontos**: Acumule pontos em cada corrida e acompanhe seu saldo
- **Doações Automáticas**: Parte do valor de cada corrida é destinada a causas sociais
- **Assinatura Premium**: Acesso a benefícios exclusivos e descontos especiais
- **Segurança Avançada**: Verificação em duas etapas, biometria e validação de documentos

### Para Parceiros
- **Dashboard de Desempenho**: Visualize métricas importantes e acompanhe seu progresso
- **Relatórios Detalhados**: Acesse análises aprofundadas de ganhos, corridas e avaliações
- **Programa de Incentivos**: Participe de desafios e ganhe recompensas extras
- **Múltiplas Modalidades**: Escolha quais tipos de serviço deseja oferecer
- **Extrato de Ganhos**: Acompanhe seus ganhos e solicite saques

## Tecnologias Utilizadas

- **Frontend**: React Native, TypeScript, Expo
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: MongoDB, Redis
- **Autenticação**: JWT, OAuth 2.0
- **Pagamentos**: Integração com Pagar.me
- **Mapas e Geolocalização**: Google Maps API
- **Notificações**: Firebase Cloud Messaging
- **CI/CD**: GitHub Actions

## Estrutura do Projeto

```
quantza_app/
├── backend/                # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/         # Configurações do servidor
│   │   ├── controllers/    # Controladores da API
│   │   ├── middlewares/    # Middlewares personalizados
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços de negócio
│   │   └── utils/          # Utilitários
│   ├── tests/              # Testes automatizados
│   └── package.json        # Dependências do backend
│
├── frontend/               # Aplicativo React Native
│   ├── src/
│   │   ├── assets/         # Imagens, fontes e recursos
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── constants/      # Constantes e configurações
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── navigation/     # Configuração de navegação
│   │   ├── screens/        # Telas do aplicativo
│   │   │   ├── AppScreens/           # Telas principais do app
│   │   │   ├── AuthScreens/          # Telas de autenticação
│   │   │   ├── OnboardingScreens/    # Telas de onboarding
│   │   │   ├── PartnerScreens/       # Telas específicas para parceiros
│   │   │   ├── ServiceScreens/       # Telas de serviços
│   │   │   └── VerificationScreens/  # Telas de verificação
│   │   ├── services/       # Serviços e APIs
│   │   ├── store/          # Gerenciamento de estado
│   │   ├── styles/         # Estilos globais
│   │   └── utils/          # Funções utilitárias
│   ├── tests/              # Testes automatizados
│   └── package.json        # Dependências do frontend
│
└── docs/                   # Documentação do projeto
    ├── api/                # Documentação da API
    ├── architecture/       # Diagramas e arquitetura
    ├── guides/             # Guias de desenvolvimento
    └── screenshots/        # Capturas de tela
```

## Fases de Desenvolvimento

### Fase 1: Fundação e Autenticação
- Estrutura base do aplicativo
- Sistema de autenticação e registro
- Perfis de usuário e parceiro

### Fase 2: Funcionalidades Essenciais
- Solicitação de corridas
- Mapas e geolocalização
- Sistema de pagamentos

### Fase 3: Expansão de Serviços
- Múltiplos tipos de serviço (entregas, pets, viagens longas, acessível)
- Configuração de preferências por tipo de serviço
- Cálculo de preços diferenciados

### Fase 4: Relatórios e Analytics
- Dashboard de desempenho para parceiros
- Relatórios detalhados de ganhos
- Análise de desempenho e qualidade
- Tendências e previsões

### Fase 5: Funcionalidades Adicionais
- Sistema de pontos
- Doações automáticas
- Assinatura premium
- Carteira digital

## Novidades da Fase 4: Relatórios e Analytics

A Fase 4 introduz um sistema completo de relatórios e analytics para parceiros, permitindo uma visão detalhada de seu desempenho e ganhos:

### Dashboard de Desempenho
- **Métricas Principais**: Visualização rápida de ganhos, corridas, avaliação e taxa de aceitação
- **Gráficos Interativos**: Acompanhamento visual de ganhos por período
- **Distribuição de Serviços**: Análise da proporção entre diferentes tipos de serviço
- **Avaliações Recentes**: Acesso rápido aos últimos feedbacks recebidos
- **Dicas Personalizadas**: Recomendações para aumentar ganhos e melhorar desempenho

### Relatórios Detalhados
- **Relatório de Ganhos**: Análise completa de ganhos brutos, taxas, ganhos líquidos e rentabilidade
- **Relatório de Corridas**: Detalhamento de corridas realizadas, distâncias, tempos e eficiência
- **Relatório de Avaliações**: Análise de avaliações recebidas, comentários e tendências
- **Relatório de Taxa de Aceitação**: Métricas de aceitação de corridas e dicas para melhorar
- **Relatório de Distribuição de Serviços**: Análise de rentabilidade por tipo de serviço

### Funcionalidades Avançadas
- **Filtros de Período**: Análise por dia, semana, mês, trimestre ou ano
- **Comparativos**: Visualização de crescimento ou queda em relação a períodos anteriores
- **Exportação**: Possibilidade de exportar relatórios em PDF
- **Análise de Tendências**: Identificação de padrões e sazonalidades

## Como Utilizar o Dashboard de Desempenho

### Para Parceiros
1. Faça login no aplicativo Quantza com suas credenciais de parceiro
2. Acesse a seção "Desempenho" no menu principal
3. Visualize o dashboard com suas métricas principais
4. Utilize os filtros de período para ajustar a visualização
5. Toque em qualquer métrica para acessar relatórios detalhados
6. Explore as diferentes análises e recomendações

### Customização de Relatórios
- **Período de Análise**: Selecione entre dia, semana, mês, trimestre ou ano
- **Exportação**: Exporte relatórios em PDF para análise offline
- **Detalhamento**: Acesse informações detalhadas de cada serviço realizado

## Instalação e Configuração

### Pré-requisitos
- Node.js 14+
- npm ou yarn
- MongoDB
- React Native CLI
- Android Studio / Xcode (para desenvolvimento mobile)

### Backend
```bash
# Clonar o repositório
git clone https://github.com/mvmaciell/Quantza.git

# Navegar para o diretório do backend
cd Quantza/backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar o servidor em modo desenvolvimento
npm run dev
```

### Frontend
```bash
# Navegar para o diretório do frontend
cd Quantza/frontend

# Instalar dependências
npm install

# Iniciar o aplicativo em modo desenvolvimento
npm start

# Para executar no Android
npm run android

# Para executar no iOS
npm run ios
```

## Testes

### Backend
```bash
# Executar testes unitários
npm run test:unit

# Executar testes de integração
npm run test:integration

# Executar todos os testes
npm test
```

### Frontend
```bash
# Executar testes unitários
npm run test:unit

# Executar testes de componentes
npm run test:components

# Executar testes e2e (requer dispositivo/emulador)
npm run test:e2e

# Executar todos os testes
npm test
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento.

---

© 2025 Quantza. Todos os direitos reservados.
