# Plano de Priorização e Roadmap de Implementação - Quantza 2.0

**Data:** 20 de Maio de 2025
**Versão:** 2.0 (Expansão do MVP)

## Introdução

Este documento apresenta a priorização das atualizações mapeadas para o aplicativo Quantza, organizando-as em fases incrementais de implementação. A priorização considera o valor para o usuário, a complexidade técnica, as dependências entre funcionalidades e a viabilidade de entregas incrementais.

## Critérios de Priorização

1. **Valor para o Usuário:** Impacto positivo na experiência e retenção
2. **Complexidade Técnica:** Esforço de desenvolvimento e riscos técnicos
3. **Dependências:** Requisitos prévios para implementação
4. **Visibilidade:** Impacto visual e percepção de evolução do app
5. **Segurança:** Requisitos críticos de segurança e conformidade

## Roadmap de Implementação

### Fase 1: Fundação Visual e Onboarding (Prioridade Alta)

**Objetivo:** Estabelecer a nova identidade visual e melhorar a experiência inicial do usuário.

#### 1.1. Telas de Entrada e Identidade Visual
- Splash Screen com animação de raio e vibração
- Telas de Onboarding/Apresentação
- Refinamento visual da tela Home mantendo a identidade já estabelecida

#### 1.2. Expansão do Switcher de Perfil
- Aprimoramento do componente `ProfileSwitcher.tsx`
- Visual diferenciado para cada perfil (usuário/parceiro)
- Transição fluida entre perfis

**Entregáveis:**
- Novas telas de Splash e Onboarding
- Componente de alternância de perfil aprimorado
- Documentação detalhada das alterações

**Estimativa:** 1-2 semanas

### Fase 2: Segurança e Verificação Básica (Prioridade Alta)

**Objetivo:** Implementar os fundamentos do sistema de segurança e verificação.

#### 2.1. Upload e Verificação de Documentos
- Tela de upload de documentos (RG/CNH)
- Tela de captura de selfie para verificação
- Tela de status de aprovação

#### 2.2. Verificação Facial Básica
- Integração com câmera para selfies
- Estrutura básica para verificação (placeholder para API externa)

**Entregáveis:**
- Fluxo de upload de documentos
- Sistema básico de verificação facial
- Telas de status de aprovação
- Documentação detalhada das alterações

**Estimativa:** 2-3 semanas

### Fase 3: Expansão de Serviços (Prioridade Média-Alta)

**Objetivo:** Ampliar os tipos de serviços oferecidos além das corridas.

#### 3.1. Seleção de Novos Serviços
- Atualização da tela Home para incluir novos tipos de serviço
- Telas específicas para cada tipo de serviço
- Lógica de seleção e configuração por serviço

#### 3.2. Configuração Avançada de Serviços
- Seleção de múltiplas paradas
- Preferências adicionais (motorista mulher, espaço extra, etc.)
- Opção de dividir valor

**Entregáveis:**
- Tela Home atualizada com novos serviços
- Telas de configuração por tipo de serviço
- Documentação detalhada das alterações

**Estimativa:** 2-3 semanas

### Fase 4: Carteira Digital e Pontos Expandidos (Prioridade Média)

**Objetivo:** Aprimorar o sistema de carteira digital e programa de pontos.

#### 4.1. Carteira Digital Expandida
- Extrato detalhado de transações
- Adição de saldo via múltiplos métodos
- Interface de troca de pontos

#### 4.2. Programa de Pontos/Cashback Aprimorado
- Histórico detalhado de acúmulo/trocas
- Ofertas de resgate
- Elementos básicos de gamificação

**Entregáveis:**
- Tela de carteira expandida
- Sistema de pontos aprimorado
- Documentação detalhada das alterações

**Estimativa:** 2 semanas

### Fase 5: Doações e Impacto Social (Prioridade Média)

**Objetivo:** Expandir as funcionalidades de doação e visualização de impacto.

#### 5.1. Doação Expandida
- Botão "Doar Agora" em pontos estratégicos
- Tela dedicada para doações voluntárias
- Opções de valor e instituições

#### 5.2. Tela de Impacto Social
- Histórico de doações
- Visualização do destino das doações
- Compartilhamento de impacto

**Entregáveis:**
- Sistema de doações expandido
- Tela de impacto social
- Documentação detalhada das alterações

**Estimativa:** 1-2 semanas

### Fase 6: Planos Premium e Benefícios (Prioridade Média)

**Objetivo:** Implementar o sistema de assinatura Premium e benefícios.

#### 6.1. Planos Premium
- Tela de comparação (comum x Premium)
- Processo de assinatura
- Controle de renovação/cancelamento

#### 6.2. Benefícios Premium
- Selo de "Cliente Premium" no perfil
- Banner/botão "Vire Premium"
- Benefícios visuais para usuários Premium

**Entregáveis:**
- Sistema de assinatura Premium
- Telas de benefícios e comparação
- Documentação detalhada das alterações

**Estimativa:** 2 semanas

### Fase 7: Agendamento e Funcionalidades Avançadas (Prioridade Média-Baixa)

**Objetivo:** Adicionar funcionalidades avançadas de agendamento e personalização.

#### 7.1. Agendamento de Serviços
- Tela dedicada para agendamento
- Histórico de agendamentos
- Gerenciamento de agendamentos

#### 7.2. Personalização e Preferências
- Personalização de perfil expandida
- Preferências avançadas (idioma, notificações, temas)

**Entregáveis:**
- Sistema de agendamento
- Opções avançadas de personalização
- Documentação detalhada das alterações

**Estimativa:** 1-2 semanas

### Fase 8: Parcerias e Clube de Vantagens (Prioridade Baixa)

**Objetivo:** Implementar o sistema de parcerias e clube de vantagens.

#### 8.1. Tela de Parcerias
- Empresas conveniadas
- Benefícios e descontos
- Clube de vantagens

#### 8.2. Área para Empresas
- Cadastro de empresas parceiras
- Gestão de benefícios para colaboradores

**Entregáveis:**
- Sistema de parcerias
- Área corporativa básica
- Documentação detalhada das alterações

**Estimativa:** 2-3 semanas

### Fase 9: Suporte, Notificações e Refinamentos (Prioridade Baixa)

**Objetivo:** Completar o sistema com funcionalidades de suporte e notificações.

#### 9.1. Central de Ajuda Expandida
- FAQ mais completo
- Chat com suporte
- Sistema de chamados/tickets

#### 9.2. Sistema de Notificações Expandido
- Novas categorias de notificações
- Campanhas e promoções
- Tela "Em breve" para novos serviços

**Entregáveis:**
- Central de ajuda expandida
- Sistema de notificações aprimorado
- Documentação detalhada das alterações

**Estimativa:** 1-2 semanas

## Considerações para Implementação

### Abordagem de Desenvolvimento
- **Desenvolvimento Incremental:** Cada fase será implementada e testada separadamente
- **Commits Frequentes:** Commits pequenos e bem documentados para cada funcionalidade
- **Integração Contínua:** Push regular para o repositório GitHub do cliente
- **Documentação Detalhada:** Cada alteração será documentada com tutoriais de ajuste

### Dependências Técnicas
- Integração com serviços de verificação facial e de documentos
- APIs para processamento de pagamentos recorrentes (assinaturas)
- Serviços de chat para suporte ao cliente

### Riscos e Mitigações
- **Complexidade da Verificação Facial:** Iniciar com implementação básica, evoluir incrementalmente
- **Integrações Externas:** Usar mocks e simulações durante o desenvolvimento inicial
- **Consistência Visual:** Manter a identidade visual já estabelecida em todas as novas telas

## Próximos Passos Imediatos

1. Configurar o repositório Git remoto e realizar o push inicial do projeto
2. Iniciar a implementação da Fase 1 (Fundação Visual e Onboarding)
3. Documentar cada alteração com tutoriais detalhados
4. Realizar commits incrementais e push para o GitHub do cliente
5. Reportar progresso e coletar feedback após cada fase concluída
