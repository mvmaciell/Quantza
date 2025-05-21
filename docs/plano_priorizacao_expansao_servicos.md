# Plano de Priorização para Expansão de Serviços - Quantza 2.0

## Visão Geral

Este documento estabelece o plano de priorização para a implementação da Fase 3 do Quantza 2.0, focada na expansão de serviços. Com base no mapeamento de requisitos, este plano define a ordem de implementação, as dependências e os critérios de priorização para garantir entregas incrementais de valor.

## Critérios de Priorização

Os seguintes critérios foram considerados para priorizar as implementações:

1. **Valor para o Usuário:** Impacto positivo na experiência e utilidade do aplicativo
2. **Complexidade Técnica:** Esforço necessário para implementação
3. **Dependências:** Requisitos prévios necessários
4. **Diferenciação de Mercado:** Potencial para destacar o Quantza da concorrência
5. **Viabilidade Operacional:** Facilidade de implementação no mundo real

## Fases de Implementação

### Fase 3.1: Fundação para Múltiplos Serviços (Semanas 1-2)

**Objetivo:** Criar a infraestrutura base que permitirá a expansão para diferentes tipos de serviço.

**Prioridade: ALTA**

**Entregas:**
1. Refatoração da arquitetura para suportar múltiplos tipos de serviço
2. Implementação do modelo de dados `ServiceType` e endpoints relacionados
3. Tela de seleção de tipo de serviço no frontend
4. Adaptação do fluxo de solicitação para comportar diferentes modalidades
5. Sistema base de cálculo de preço diferenciado por tipo de serviço

**Justificativa:** Esta fase estabelece a fundação necessária para todas as implementações subsequentes, criando a flexibilidade para adicionar novos tipos de serviço de forma modular.

### Fase 3.2: Serviço de Entregas (Semanas 3-4)

**Objetivo:** Implementar o primeiro serviço adicional - entregas de itens e pacotes.

**Prioridade: ALTA**

**Entregas:**
1. Formulário específico para solicitação de entregas
2. Campos para detalhes do item (tamanho, peso, fragilidade)
3. Opções de urgência e instruções especiais
4. Adaptação da tela de acompanhamento para entregas
5. Confirmação de entrega com foto/assinatura
6. Cálculo de preço específico para entregas

**Justificativa:** O serviço de entregas é relativamente simples de implementar como primeira expansão, requer poucas adaptações nos veículos dos parceiros e tem alta demanda no mercado.

### Fase 3.3: Preferências e Configurações (Semanas 5-6)

**Objetivo:** Permitir que usuários e parceiros configurem suas preferências por tipo de serviço.

**Prioridade: MÉDIA**

**Entregas:**
1. Tela de preferências do usuário por tipo de serviço
2. Tela de configuração do parceiro para tipos de serviço oferecidos
3. Sistema de favoritos para serviços e parceiros
4. Filtros específicos por modalidade
5. Salvamento de configurações específicas por tipo de serviço

**Justificativa:** Esta fase melhora a experiência tanto para usuários quanto para parceiros, permitindo personalização e maior controle sobre os serviços, além de ser necessária antes de expandir para mais modalidades.

### Fase 3.4: Transporte de Animais (Semanas 7-8)

**Objetivo:** Implementar o serviço especializado para transporte de pets.

**Prioridade: MÉDIA**

**Entregas:**
1. Formulário específico para transporte de animais
2. Campos para detalhes do pet (tipo, porte, necessidades)
3. Verificações adicionais para parceiros que oferecem este serviço
4. Adaptação da tela de acompanhamento para transporte de pets
5. Confirmação de bem-estar do animal
6. Cálculo de preço específico para transporte de pets

**Justificativa:** O transporte de pets é um serviço com demanda crescente e com potencial de diferenciação no mercado, além de aproveitar a base de parceiros existente com adaptações mínimas.

### Fase 3.5: Viagens Longas (Semanas 9-10)

**Objetivo:** Implementar o serviço para trajetos intermunicipais.

**Prioridade: BAIXA**

**Entregas:**
1. Formulário específico para viagens longas
2. Opções para paradas programadas e ida/volta
3. Verificações adicionais para parceiros (documentação específica)
4. Adaptação da tela de acompanhamento para viagens longas
5. Sistema de marcos do trajeto e paradas
6. Cálculo de preço fixo para viagens longas

**Justificativa:** Viagens longas têm complexidade operacional maior e exigem verificações adicionais dos parceiros, mas representam uma oportunidade de mercado significativa com margens potencialmente maiores.

### Fase 3.6: Transporte Acessível (Semanas 11-12)

**Objetivo:** Implementar o serviço especializado para pessoas com mobilidade reduzida.

**Prioridade: BAIXA**

**Entregas:**
1. Formulário específico para transporte acessível
2. Campos para necessidades específicas de acessibilidade
3. Verificações rigorosas para parceiros e veículos adaptados
4. Adaptação da tela de acompanhamento para assistência
5. Confirmação de assistência completa
6. Cálculo de preço específico com tempo adicional

**Justificativa:** O transporte acessível tem alto valor social e potencial de diferenciação, mas requer parceiros com veículos especialmente adaptados, o que limita a disponibilidade inicial.

## Dependências e Pré-requisitos

### Dependências Técnicas
1. A Fase 3.1 (Fundação) é pré-requisito para todas as outras fases
2. A Fase 3.3 (Preferências) deve ser implementada antes da Fase 3.5 (Viagens Longas) e 3.6 (Transporte Acessível)
3. O sistema de verificação de parceiros da Fase 2 é necessário para as verificações adicionais nas Fases 3.4, 3.5 e 3.6

### Dependências Operacionais
1. Parceiros com veículos adequados para cada modalidade
2. Treinamento específico para parceiros por tipo de serviço
3. Termos de serviço atualizados para cada modalidade
4. Políticas de seguro específicas por tipo de serviço

## Métricas de Sucesso

Para cada fase, as seguintes métricas serão monitoradas:

1. **Adoção:** Percentual de usuários utilizando o novo tipo de serviço
2. **Satisfação:** Avaliações específicas por modalidade
3. **Conversão:** Taxa de solicitações concluídas vs. iniciadas
4. **Engajamento:** Frequência de uso por tipo de serviço
5. **Receita:** Valor médio e total gerado por modalidade

## Riscos e Mitigações

### Riscos Identificados
1. **Disponibilidade de Parceiros:** Falta de parceiros qualificados para serviços especializados
   - **Mitigação:** Implementar programa de incentivos para adaptação de veículos

2. **Complexidade da Interface:** Sobrecarga de opções para o usuário
   - **Mitigação:** Design progressivo com opções contextuais e onboarding específico

3. **Precificação Inadequada:** Margens insuficientes para parceiros em novos serviços
   - **Mitigação:** Testes de mercado e ajustes iterativos na precificação

4. **Requisitos Regulatórios:** Diferentes regulamentações por tipo de serviço
   - **Mitigação:** Análise legal prévia e implementação de verificações específicas

## Próximos Passos

1. Iniciar o desenvolvimento da Fase 3.1 (Fundação para Múltiplos Serviços)
2. Preparar documentação técnica detalhada para cada componente
3. Definir critérios de aceitação específicos para cada entrega
4. Estabelecer plano de testes para cada funcionalidade
5. Configurar métricas de monitoramento para avaliação de sucesso
