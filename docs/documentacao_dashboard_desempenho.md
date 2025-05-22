# Documentação do Dashboard de Desempenho para Parceiros

## Visão Geral

O Dashboard de Desempenho para Parceiros é um componente central da Fase 4 do Quantza 2.0, projetado para fornecer aos parceiros uma visão abrangente e detalhada de seu desempenho, ganhos e métricas relevantes. Esta documentação detalha a implementação técnica, arquitetura e funcionalidades do dashboard.

## Arquitetura

### Estrutura de Componentes

O dashboard foi implementado seguindo uma arquitetura modular, com componentes reutilizáveis e separação clara de responsabilidades:

```
frontend/
  ├── src/
      ├── screens/
      │   └── PartnerScreens/
      │       └── PerformanceReports/
      │           ├── PerformanceDashboard.tsx    # Dashboard principal
      │           └── DetailedReport.tsx          # Relatórios detalhados
      ├── components/
      │   ├── Card.tsx                           # Componente de card
      │   ├── FilterPeriod.tsx                   # Filtro de período
      │   ├── LoadingOverlay.tsx                 # Overlay de carregamento
      │   └── MetricCard.tsx                     # Card de métrica
      └── services/
          └── PartnerService.ts                  # Serviço de dados de parceiros
```

### Fluxo de Dados

1. O usuário acessa o dashboard através da navegação principal
2. O componente `PerformanceDashboard` solicita dados ao `PartnerService`
3. Os dados são processados e exibidos em componentes visuais
4. O usuário pode interagir com filtros e navegar para relatórios detalhados
5. Os relatórios detalhados são carregados sob demanda através do `DetailedReport`

## Componentes Principais

### PerformanceDashboard

O componente principal que exibe o dashboard com métricas resumidas, gráficos e visualizações.

#### Funcionalidades
- Exibição de métricas principais (ganhos, corridas, avaliação, taxa de aceitação)
- Gráfico de ganhos por período
- Distribuição de serviços por tipo
- Avaliações recentes
- Dicas personalizadas

#### Estados
- `loading`: Controla a exibição do indicador de carregamento
- `refreshing`: Controla o estado de atualização pull-to-refresh
- `period`: Armazena o período selecionado (dia, semana, mês)
- `performanceData`: Armazena os dados de desempenho
- `error`: Armazena mensagens de erro, se houver

#### Métodos Principais
- `loadPerformanceData()`: Carrega dados do serviço ou usa dados mockados para desenvolvimento
- `onRefresh()`: Atualiza os dados quando o usuário puxa a tela para baixo
- `navigateToDetailedReport()`: Navega para relatórios detalhados

### DetailedReport

Componente que exibe relatórios detalhados específicos (ganhos, corridas, avaliações, etc.).

#### Funcionalidades
- Relatório detalhado de ganhos
- Relatório detalhado de corridas
- Relatório detalhado de avaliações
- Relatório de taxa de aceitação
- Relatório de distribuição de serviços

#### Estados
- `loading`: Controla a exibição do indicador de carregamento
- `refreshing`: Controla o estado de atualização pull-to-refresh
- `period`: Armazena o período selecionado
- `reportData`: Armazena os dados do relatório específico
- `error`: Armazena mensagens de erro, se houver

#### Métodos Principais
- `loadReportData()`: Carrega dados específicos do relatório
- `exportReport()`: Exporta o relatório em formato específico
- `renderReportContent()`: Renderiza o conteúdo específico com base no tipo de relatório

### Componentes de Suporte

#### FilterPeriod
Componente reutilizável para seleção de período (dia, semana, mês, trimestre, ano).

#### MetricCard
Componente para exibição de métricas importantes com valor, ícone e tendência.

#### Card
Componente para encapsular conteúdo em um card com estilo consistente.

#### LoadingOverlay
Componente para exibir indicador de carregamento com mensagem.

## Serviços

### PartnerService

Serviço responsável por acessar e manipular dados relacionados a parceiros.

#### Métodos Principais
- `getPerformanceData()`: Obtém dados gerais de desempenho
- `getEarningsReport()`: Obtém relatório detalhado de ganhos
- `getRidesReport()`: Obtém relatório detalhado de corridas/serviços
- `getRatingsReport()`: Obtém relatório detalhado de avaliações
- `getTrendsAnalysis()`: Obtém análise de tendências
- `getPersonalizedRecommendations()`: Obtém recomendações personalizadas
- `exportReport()`: Exporta relatório em formato específico
- `configureAlerts()`: Configura alertas e notificações
- `getAlertSettings()`: Obtém configurações atuais de alertas

## Fluxos de Usuário

### Visualização do Dashboard
1. Parceiro acessa a seção "Desempenho" no menu principal
2. O dashboard carrega com período padrão (semana)
3. Parceiro visualiza métricas principais e gráficos
4. Parceiro pode alterar o período usando o filtro
5. Parceiro pode atualizar os dados usando pull-to-refresh

### Acesso a Relatórios Detalhados
1. Parceiro toca em uma métrica ou botão "Ver Detalhes"
2. O sistema navega para o relatório detalhado correspondente
3. O relatório carrega com o mesmo período do dashboard
4. Parceiro visualiza dados detalhados e análises
5. Parceiro pode exportar o relatório se necessário

## Dados e Modelos

### Modelo de Dados de Desempenho
```typescript
interface PerformanceData {
  earnings: {
    total: number;
    trend: number;
    chart: {
      labels: string[];
      data: number[];
    };
  };
  rides: {
    total: number;
    trend: number;
  };
  rating: {
    average: number;
    trend: number;
  };
  acceptanceRate: {
    value: number;
    trend: number;
  };
  serviceDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentRatings: Array<{
    stars: number;
    date: string;
    comment?: string;
    serviceType: string;
    serviceIcon: string;
  }>;
  tips: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}
```

### Modelo de Dados de Relatório de Ganhos
```typescript
interface EarningsReport {
  summary: {
    gross: number;
    fees: number;
    net: number;
    comparison?: {
      trend: number;
      value: number;
    };
  };
  details: {
    services: Array<{
      id: string;
      date: string;
      type: string;
      icon: string;
      value: number;
      distance: number;
      duration: number;
    }>;
    hasMore: boolean;
  };
  chart: {
    labels: string[];
    data: number[];
  };
  analysis: {
    averagePerRide: number;
    averagePerHour: number;
    averagePerKm: number;
  };
}
```

## Estilização e Temas

O dashboard utiliza um sistema de temas consistente com o restante do aplicativo Quantza:

```typescript
const COLORS = {
  primary: '#1B76BC',
  primaryDark: '#0A5A9C',
  success: '#4CD964',
  warning: '#FFCC00',
  danger: '#FF3B30',
  info: '#5AC8FA',
  white: '#FFFFFF',
  lightBackground: '#F2F2F7',
  lightGray: '#E5E5EA',
  darkGray: '#8E8E93',
  darkText: '#1C1C1E',
  orange: '#FF9500',
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
};
```

## Animações e Interatividade

O dashboard implementa diversas animações e elementos interativos para melhorar a experiência do usuário:

1. **Animação de escala** nos cards de métricas ao pressionar
2. **Pull-to-refresh** para atualização de dados
3. **Transições suaves** entre estados de carregamento e conteúdo
4. **Gráficos interativos** com animações de entrada
5. **Feedback visual** para ações do usuário

## Tratamento de Erros

O dashboard implementa um sistema robusto de tratamento de erros:

1. **Detecção de erros** durante carregamento de dados
2. **Exibição de mensagens** amigáveis ao usuário
3. **Opção de tentar novamente** em caso de falha
4. **Dados mockados** para desenvolvimento e fallback
5. **Logging** detalhado para depuração

## Otimizações de Performance

Para garantir uma experiência fluida, foram implementadas diversas otimizações:

1. **Memoização** de componentes e funções com `useCallback` e `useMemo`
2. **Carregamento sob demanda** de relatórios detalhados
3. **Renderização condicional** para evitar processamento desnecessário
4. **Reutilização de componentes** para reduzir a árvore de renderização
5. **Lazy loading** de imagens e conteúdo pesado

## Considerações de Acessibilidade

O dashboard foi projetado considerando boas práticas de acessibilidade:

1. **Contraste adequado** entre texto e fundo
2. **Tamanhos de fonte** legíveis
3. **Áreas de toque** suficientemente grandes
4. **Feedback visual e tátil** para interações
5. **Estrutura semântica** para leitores de tela

## Testes

A implementação inclui testes automatizados para garantir a qualidade e estabilidade:

1. **Testes unitários** para componentes individuais
2. **Testes de integração** para fluxos completos
3. **Testes de snapshot** para garantir consistência visual
4. **Mocks de serviços** para testes isolados
5. **Testes de acessibilidade** para garantir usabilidade

## Próximos Passos e Melhorias Futuras

O dashboard foi projetado para permitir expansão e melhorias futuras:

1. **Personalização avançada** de métricas e visualizações
2. **Alertas e notificações** para eventos importantes
3. **Análise preditiva** para tendências futuras
4. **Comparativos avançados** com benchmarks do mercado
5. **Integração com calendário** para planejamento baseado em dados

## Guia de Customização

### Adicionando Novas Métricas

Para adicionar uma nova métrica ao dashboard:

1. Adicione a propriedade correspondente ao modelo de dados em `PartnerService.ts`
2. Atualize o método `getPerformanceData()` para incluir a nova métrica
3. Adicione um novo `MetricCard` no componente `PerformanceDashboard`
4. Implemente a navegação para o relatório detalhado, se necessário
5. Adicione o relatório detalhado correspondente em `DetailedReport.tsx`

### Personalizando Visualizações

Para personalizar ou adicionar novas visualizações:

1. Importe a biblioteca de visualização desejada (Chart.js, D3.js, etc.)
2. Crie um novo componente para a visualização específica
3. Integre o componente no dashboard ou relatório detalhado
4. Adicione os dados necessários ao modelo de dados
5. Implemente a lógica de interação, se necessário

### Adicionando Novos Tipos de Relatório

Para adicionar um novo tipo de relatório:

1. Adicione o método correspondente em `PartnerService.ts`
2. Crie a função de renderização específica em `DetailedReport.tsx`
3. Adicione o caso no switch de `renderReportContent()`
4. Implemente o modelo de dados para o novo relatório
5. Adicione a navegação para o novo relatório no dashboard

## Conclusão

O Dashboard de Desempenho para Parceiros representa um avanço significativo na proposta de valor do Quantza, oferecendo ferramentas analíticas poderosas que permitem aos parceiros maximizar seus ganhos e melhorar continuamente seu desempenho. A implementação seguiu uma abordagem modular e extensível, garantindo que o sistema possa evoluir conforme novas necessidades surjam.
