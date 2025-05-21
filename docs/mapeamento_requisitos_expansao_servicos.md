# Mapeamento de Requisitos para Expansão de Serviços - Quantza 2.0

## Visão Geral

Este documento mapeia os requisitos detalhados para a implementação da Fase 3 do Quantza 2.0, focada na expansão de serviços além das corridas tradicionais. Esta fase visa diversificar as opções disponíveis para usuários e parceiros, implementando diferentes modalidades de serviço com configurações e precificações específicas.

## Tipos de Serviço

### 1. Corrida Tradicional (já implementado)
- **Descrição:** Transporte de passageiros de um ponto a outro
- **Características:**
  - Capacidade para até 4 passageiros
  - Opções de categoria (econômico, conforto, premium)
  - Estimativa de tempo e distância

### 2. Entregas
- **Descrição:** Transporte de itens e pacotes
- **Características:**
  - Categorias: documentos, pequenos volumes, médios volumes
  - Opções de urgência (normal, expressa, programada)
  - Confirmação de entrega (foto, assinatura digital)
  - Rastreamento em tempo real
  - Seguro opcional para itens de valor

### 3. Transporte de Animais
- **Descrição:** Serviço especializado para transporte de pets
- **Características:**
  - Veículos adaptados com proteções e contenções
  - Parceiros verificados e treinados para lidar com animais
  - Opções para diferentes portes de animais
  - Possibilidade de acompanhamento do tutor
  - Seguro pet incluso

### 4. Viagens Longas
- **Descrição:** Serviço para trajetos intermunicipais
- **Características:**
  - Distâncias superiores a 50km
  - Parceiros específicos com documentação para viagens longas
  - Preço fixo definido antes da viagem
  - Possibilidade de paradas programadas
  - Opção de ida e volta

### 5. Transporte Acessível
- **Descrição:** Serviço especializado para pessoas com mobilidade reduzida
- **Características:**
  - Veículos adaptados com rampa/elevador
  - Parceiros treinados para assistência
  - Espaço para cadeira de rodas e equipamentos
  - Tempo adicional para embarque/desembarque
  - Opção de acompanhante sem custo adicional

## Configuração de Preferências

### Para Usuários
- **Serviços Favoritos:**
  - Marcação de serviços mais utilizados
  - Configuração de preferências por tipo de serviço
  - Salvamento de endereços específicos por tipo de serviço

- **Preferências de Parceiros:**
  - Opção de favoritar parceiros específicos
  - Filtro por avaliação mínima
  - Preferência por parceiros verificados com antecedentes

- **Configurações de Pagamento:**
  - Métodos de pagamento preferenciais por tipo de serviço
  - Opção de gorjeta automática por categoria
  - Limite de valor para aprovação automática

### Para Parceiros
- **Tipos de Serviço Oferecidos:**
  - Seleção de quais modalidades deseja atender
  - Configuração de disponibilidade por tipo de serviço
  - Definição de área de atuação específica por modalidade

- **Configurações de Veículo:**
  - Cadastro de características específicas (adaptações, capacidades)
  - Upload de documentação específica por tipo de serviço
  - Verificações adicionais para serviços especializados

- **Preferências de Corrida:**
  - Filtros para tipos de solicitação
  - Configuração de distância máxima para aceitar corridas
  - Definição de horários por tipo de serviço

## Cálculo de Preços Diferenciados

### Fatores de Precificação
- **Base por Tipo de Serviço:**
  - Tarifa base diferenciada por modalidade
  - Valor por km/tempo específico para cada serviço
  - Tarifas dinâmicas baseadas em demanda por categoria

- **Modificadores:**
  - Adicional por tamanho/peso (entregas)
  - Adicional por porte do animal (pet)
  - Adicional por distância (viagens longas)
  - Adicional por equipamentos especiais (acessibilidade)

- **Descontos e Promoções:**
  - Descontos específicos por modalidade
  - Pacotes de uso frequente por tipo de serviço
  - Promoções para novos tipos de serviço

### Algoritmo de Cálculo
- **Componentes:**
  - Tarifa base do serviço
  - Valor por distância estimada
  - Valor por tempo estimado
  - Modificadores específicos do serviço
  - Fator de demanda atual
  - Descontos aplicáveis

- **Fórmula Base:**
  ```
  Preço = (Tarifa Base + (Distância × Valor/km) + (Tempo × Valor/min)) 
          × Fator de Demanda + Modificadores - Descontos
  ```

- **Transparência:**
  - Detalhamento dos componentes do preço
  - Comparativo entre diferentes modalidades
  - Estimativa de variação por horário/demanda

## Fluxos de Usuário

### 1. Solicitação de Serviço
1. Usuário seleciona origem e destino
2. Usuário escolhe o tipo de serviço desejado
3. Usuário configura detalhes específicos do serviço
   - Entregas: tamanho, urgência, instruções
   - Pet: tipo de animal, porte, necessidades especiais
   - Viagem longa: paradas, horário de retorno
   - Acessível: tipo de assistência, equipamentos
4. Sistema calcula e exibe preço estimado
5. Usuário confirma solicitação
6. Sistema busca parceiros disponíveis para o tipo de serviço

### 2. Aceitação pelo Parceiro
1. Parceiro recebe solicitação com detalhes específicos do serviço
2. Parceiro visualiza informações relevantes para o tipo de serviço
3. Parceiro aceita ou recusa a solicitação
4. Em caso de aceitação, sistema notifica usuário com detalhes do parceiro
5. Em caso de recusa, sistema busca próximo parceiro disponível

### 3. Execução do Serviço
1. Parceiro se dirige ao ponto de origem
2. Usuário recebe atualizações específicas por tipo de serviço
3. No local, parceiro confirma início do serviço
4. Durante o trajeto, interface se adapta ao tipo de serviço
   - Entregas: status de transporte, cuidados
   - Pet: monitoramento, dicas de transporte
   - Viagem longa: marcos do trajeto, paradas
   - Acessível: assistência, contatos de emergência
5. Parceiro confirma conclusão do serviço
6. Confirmação específica por tipo de serviço
   - Entregas: foto da entrega, assinatura
   - Pet: confirmação de bem-estar
   - Viagem longa: registro de quilometragem final
   - Acessível: confirmação de assistência completa

### 4. Pós-Serviço
1. Usuário avalia o serviço com critérios específicos por modalidade
2. Sistema processa pagamento conforme cálculo final
3. Usuário recebe resumo detalhado do serviço
4. Sistema atualiza histórico específico por tipo de serviço
5. Pontos e benefícios são creditados conforme a modalidade

## Requisitos Técnicos

### Backend
- **Novos Endpoints:**
  - `/api/services/types` - Listar tipos de serviço disponíveis
  - `/api/services/calculate` - Calcular preço por tipo de serviço
  - `/api/services/request` - Solicitar serviço específico
  - `/api/services/history` - Histórico por tipo de serviço
  - `/api/preferences/user` - Gerenciar preferências do usuário
  - `/api/preferences/partner` - Gerenciar preferências do parceiro

- **Modelos de Dados:**
  - `ServiceType` - Tipos de serviço e configurações
  - `ServiceRequest` - Solicitações específicas por tipo
  - `ServicePreference` - Preferências de usuários e parceiros
  - `PricingRule` - Regras de precificação por modalidade
  - `ServiceModifier` - Modificadores específicos por serviço

- **Serviços:**
  - `PricingService` - Cálculo de preços por modalidade
  - `MatchingService` - Busca de parceiros por tipo de serviço
  - `NotificationService` - Notificações específicas por modalidade
  - `ValidationService` - Validação de requisitos por tipo de serviço

### Frontend
- **Novas Telas:**
  - Seleção de tipo de serviço
  - Configuração de detalhes por modalidade
  - Preferências de usuário por tipo de serviço
  - Preferências de parceiro por tipo de serviço
  - Histórico específico por modalidade
  - Detalhamento de preços por tipo de serviço

- **Componentes:**
  - Seletores de tipo de serviço
  - Formulários específicos por modalidade
  - Visualizadores de status adaptados
  - Calculadora de preço transparente
  - Cards de serviço por modalidade

- **Adaptações:**
  - Tela de solicitação adaptável por tipo
  - Tela de acompanhamento específica por modalidade
  - Tela de avaliação com critérios específicos
  - Carteira com histórico separado por tipo

## Próximos Passos

1. **Definir Prioridades:**
   - Quais tipos de serviço implementar primeiro
   - Quais funcionalidades são essenciais vs. desejáveis

2. **Planejar Implementação:**
   - Estruturar sprints por tipo de serviço
   - Definir dependências e ordem de desenvolvimento

3. **Desenvolver Incrementalmente:**
   - Implementar um tipo de serviço por vez
   - Testar completamente antes de avançar

4. **Validar com Usuários:**
   - Coletar feedback para cada nova modalidade
   - Ajustar baseado em experiências reais
