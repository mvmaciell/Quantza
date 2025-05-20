# Mapeamento de Atualizações do Aplicativo Quantza

**Data:** 20 de Maio de 2025
**Versão:** 2.0 (Expansão do MVP)

## Introdução

Este documento mapeia todas as atualizações e novas funcionalidades solicitadas para o aplicativo Quantza, com base no novo escopo fornecido pelo cliente. As atualizações estão organizadas por categorias funcionais para facilitar o planejamento e a implementação.

## 1. Telas de Entrada e Identidade Visual

### 1.1. Splash Screen
- **Novo:** Logotipo animado com efeito de raio e vibração durante o carregamento inicial
- **Impacto:** Criação de nova tela e animações com Lottie ou React Native Reanimated

### 1.2. Onboarding/Apresentação
- **Novo:** Slides de apresentação exibidos apenas na primeira utilização
- **Conteúdo:** Multi-serviços, programa de pontos, doações, carteira, diferenciais
- **Impacto:** Criação de novas telas de onboarding com navegação entre slides

### 1.3. Login/Cadastro (Expansão)
- **Expansão:** Integração com login social (Google, Apple, Facebook)
- **Novo:** Aceite explícito dos termos, política de privacidade/LGPD
- **Impacto:** Atualização das telas de login e cadastro, integração com SDKs de autenticação social

## 2. Segurança e Verificação

### 2.1. Verificação de Identidade
- **Novo:** Upload de documento (RG/CNH) para usuários e parceiros
- **Novo:** Selfie para verificação facial (match documento x selfie)
- **Novo:** Análise e aprovação manual/automática antes do uso
- **Novo:** Tela de status de aprovação ("Em análise", "Aprovado", "Reprovado")
- **Impacto:** Novas telas de upload, integração com API de verificação facial, fluxo de aprovação

### 2.2. Verificação Contínua
- **Novo:** Selfie para checagem facial rápida antes de pedir corrida ou iniciar serviço
- **Novo:** Verificação facial diária obrigatória para parceiros
- **Novo:** Bloqueio automático em caso de falha na verificação
- **Impacto:** Implementação de fluxo de verificação recorrente, integração com câmera, sistema de bloqueio

### 2.3. Segurança Durante Serviços
- **Novo:** Botão de emergência durante corridas/entregas
- **Novo:** Compartilhamento de status com contatos
- **Novo:** Relatório de paradas não previstas
- **Novo:** Preferências de segurança (ex: motoristas mulheres)
- **Impacto:** Novas funcionalidades na tela de acompanhamento, sistema de alertas, compartilhamento

## 3. Expansão de Perfis e Transição

### 3.1. Switcher/Alternância de Perfil
- **Refinamento:** Ícone ou botão fixo/menu lateral para alternar entre perfis
- **Refinamento:** Visual diferenciado para cada perfil
- **Impacto:** Aprimoramento do componente `ProfileSwitcher.tsx`, ajustes visuais por perfil

### 3.2. Perfil de Parceiro Expandido
- **Novo:** Dashboard do parceiro com ganhos, status, mapa de demanda
- **Novo:** Histórico e relatórios detalhados
- **Novo:** Área para atualização de documentos
- **Novo:** Status de validade dos documentos com alertas
- **Novo:** Clube do Parceiro com benefícios exclusivos
- **Impacto:** Novas telas e componentes para o perfil de parceiro

### 3.3. Perfil de Usuário Expandido
- **Novo:** Selo de "Cliente Premium" no perfil e/ou na home
- **Novo:** Banner/botão "Vire Premium"/"Assine e ganhe benefícios"
- **Novo:** Tela de benefícios do Premium com comparativo
- **Impacto:** Atualização das telas de perfil do usuário, novas telas para Premium

## 4. Expansão de Serviços

### 4.1. Novos Tipos de Serviço
- **Novo:** Além de corridas, adicionar:
  - Entrega
  - Transporte de Animais
  - Acessibilidade (PCD)
  - Aluguel de bikes/patinetes/carros elétricos (em breve)
- **Impacto:** Novas opções na tela principal, lógica de seleção de serviço, telas específicas por serviço

### 4.2. Configuração Avançada de Serviços
- **Novo:** Seleção de múltiplas paradas
- **Novo:** Preferências adicionais (motorista mulher, espaço extra, PCD, animal)
- **Novo:** Opção de dividir valor da corrida
- **Novo:** Opção de agendar serviço
- **Impacto:** Expansão das telas de configuração de corrida, novas opções e fluxos

### 4.3. Agendamento de Serviços
- **Novo:** Tela dedicada para agendamento
- **Novo:** Histórico de agendamentos futuros/passados
- **Novo:** Gerenciamento/cancelamento de agendamentos
- **Impacto:** Novas telas e fluxos para agendamento, lógica de persistência

## 5. Carteira Digital e Benefícios

### 5.1. Carteira Digital Expandida
- **Refinamento:** Extrato detalhado de transações
- **Novo:** Adição de saldo via cartão, PIX, boleto
- **Novo:** Troca de pontos por benefícios/milhas/produtos
- **Novo:** Resgate de promoções
- **Impacto:** Expansão da tela de carteira, novas funcionalidades de pagamento e resgate

### 5.2. Programa de Pontos/Cashback Aprimorado
- **Refinamento:** Histórico detalhado de acúmulo/trocas
- **Novo:** Ofertas de resgate (produtos, cupons, milhas)
- **Novo:** Regras do programa, ranking/gamificação
- **Impacto:** Expansão da tela de pontos, novas funcionalidades de resgate

### 5.3. Planos Premium
- **Refinamento:** Tela de comparação detalhada (comum x Premium)
- **Refinamento:** Benefícios detalhados
- **Novo:** Processo de assinatura com múltiplas formas de pagamento
- **Novo:** Controle de renovação/cancelamento
- **Impacto:** Expansão da tela Premium, integração com pagamentos recorrentes

## 6. Doações e Impacto Social

### 6.1. Doação Expandida
- **Refinamento:** Percentual fixo por corrida, mais visível
- **Novo:** Botão "Doar Agora" em diversos pontos do app
- **Novo:** Tela de doação com opções de valor e instituições
- **Impacto:** Novas opções de doação, tela dedicada

### 6.2. Tela de Impacto Social
- **Novo:** Total já doado (automático + voluntário)
- **Novo:** Histórico pessoal de doações
- **Novo:** Detalhamento do destino das doações
- **Novo:** Linha do tempo ou mapa das doações
- **Novo:** Ranking/gamificação dos doadores
- **Novo:** Compartilhamento de impacto (redes sociais)
- **Impacto:** Nova tela de impacto social, visualizações e compartilhamento

## 7. Parcerias e Clube de Vantagens

### 7.1. Tela de Parcerias
- **Novo:** Empresas conveniadas
- **Novo:** Benefícios e descontos ativos
- **Novo:** Clube de vantagens
- **Impacto:** Nova tela de parcerias e benefícios

### 7.2. Área para Empresas
- **Novo:** Cadastro de empresas parceiras
- **Novo:** Gestão de benefícios para colaboradores
- **Impacto:** Nova área corporativa, fluxos de cadastro e gestão

## 8. Suporte e Ajuda

### 8.1. Central de Ajuda Expandida
- **Refinamento:** FAQ mais completo
- **Novo:** Chat com suporte
- **Novo:** Sistema de chamados/tickets
- **Impacto:** Expansão da central de ajuda, integração com chat

### 8.2. Acessibilidade/Suporte Inclusivo
- **Novo:** Canal específico para pessoas com deficiência
- **Novo:** Reportar acessibilidade de motoristas, veículos e app
- **Impacto:** Novas opções de suporte, fluxos específicos

## 9. Notificações e Campanhas

### 9.1. Sistema de Notificações Expandido
- **Refinamento:** Status de serviços ativos
- **Novo:** Promoções e campanhas
- **Novo:** Alertas de pontos ou saldo prestes a expirar
- **Novo:** Notificações sobre doações e projetos sociais
- **Impacto:** Expansão do sistema de notificações, novas categorias

### 9.2. Campanhas e Promoções
- **Novo:** Tela de promoções com cupons
- **Novo:** Campanhas de indicação
- **Novo:** Tela "Em breve" para novos serviços
- **Impacto:** Novas telas para promoções e campanhas

## 10. Personalização e Preferências

### 10.1. Personalização de Perfil
- **Novo:** Foto, preferências, conquistas
- **Impacto:** Expansão das opções de perfil

### 10.2. Preferências Avançadas
- **Novo:** Idioma, notificações, temas
- **Impacto:** Nova tela de preferências avançadas

## Considerações Técnicas e de Implementação

### Impactos no Frontend
- Novas telas e componentes
- Expansão de fluxos existentes
- Integração com câmera para selfies e documentos
- Animações e efeitos visuais (raio, vibração)
- Temas e estilos diferenciados por perfil

### Impactos no Backend
- Novos endpoints para verificação facial e de documentos
- Expansão do modelo de dados para novos serviços
- Sistema de aprovação manual/automática
- Lógica para planos Premium e assinaturas
- APIs para parcerias e clube de vantagens

### Integrações Externas Adicionais
- Serviços de verificação facial e de documentos
- Gateways de pagamento para assinaturas
- APIs de parceiros para clube de vantagens
- Serviços de chat para suporte

## Próximos Passos

1. Priorizar as atualizações com base em valor para o usuário e complexidade técnica
2. Definir um roadmap de implementação incremental
3. Iniciar o desenvolvimento das funcionalidades priorizadas
4. Realizar commits incrementais no repositório GitHub do cliente
