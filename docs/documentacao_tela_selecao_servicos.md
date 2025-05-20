# Documentação de Implementação - Tela de Seleção de Serviços

## Visão Geral

Este documento registra a implementação da tela de seleção de serviços para o aplicativo Quantza 2.0, parte da Fase 3.1 do roadmap de expansão de serviços. Esta tela permite que o usuário escolha entre diferentes tipos de serviço disponíveis, como corridas, entregas, transporte de pets, etc.

## Funcionalidades Implementadas

### 1. Interface de Seleção de Serviços

**Implementação:**
- Lista visual de tipos de serviço disponíveis
- Indicação clara de serviços ativos vs. "em breve"
- Animações de seleção para melhor feedback visual
- Design consistente com a identidade visual do Quantza

### 2. Navegação Contextual

**Funcionalidades:**
- Redirecionamento para fluxos específicos por tipo de serviço
- Botão de retorno para a tela anterior
- Botão de continuação para avançar no fluxo
- Tratamento de serviços não disponíveis

### 3. Estrutura Expansível

**Implementação:**
- Arquitetura preparada para adicionar novos tipos de serviço
- Separação clara entre dados e apresentação
- Suporte para estados "disponível" e "em breve"
- Animações reutilizáveis para interações

## Detalhes Técnicos

### Componentes Principais:
- `ServiceSelectionScreen`: Componente principal da tela
- `serviceTypes`: Array de configuração dos tipos de serviço
- Animações com `Animated` para feedback visual
- Gradiente de fundo com `LinearGradient`

### Estados Gerenciados:
- `selectedService`: Serviço atualmente selecionado
- `animatedValues`: Valores de animação para cada tipo de serviço

### Fluxo de Navegação:
- Entrada: A partir da tela Home ou após definir origem
- Saída: Para tela específica do serviço selecionado
  - Corridas → SelectDestination
  - Entregas → DeliveryDetails
  - Outros → Telas específicas a serem implementadas

## Como Ajustar

### 1. Adicionar Novo Tipo de Serviço:
```javascript
// Adicionar ao array serviceTypes
const serviceTypes = [
  // ... serviços existentes
  {
    id: 'newService',
    name: 'Novo Serviço',
    icon: 'icon-name', // Nome do ícone do Ionicons
    description: 'Descrição do novo serviço',
    available: true, // ou false com comingSoon: true
  },
];

// Adicionar ao switch de navegação
const handleContinue = () => {
  switch (selectedService) {
    // ... casos existentes
    case 'newService':
      navigation.navigate('NewServiceScreen');
      break;
    default:
      navigation.navigate('SelectDestination');
  }
};
```

### 2. Personalizar Aparência por Tipo de Serviço:
```javascript
// Adicionar cores ou estilos específicos por serviço
const getServiceColor = (serviceId) => {
  switch (serviceId) {
    case 'ride':
      return COLORS.primary;
    case 'delivery':
      return COLORS.delivery; // Adicionar à paleta de cores
    case 'pet':
      return COLORS.pet; // Adicionar à paleta de cores
    default:
      return COLORS.primary;
  }
};

// Usar no componente
<View style={[styles.iconContainer, { backgroundColor: getServiceColor(service.id) }]}>
  <Ionicons name={service.icon} size={32} color={COLORS.white} />
</View>
```

### 3. Adicionar Filtros ou Categorias:
```javascript
// Adicionar estado para filtro
const [filter, setFilter] = useState('all');

// Adicionar componente de filtro
<View style={styles.filterContainer}>
  <TouchableOpacity
    style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
    onPress={() => setFilter('all')}
  >
    <Text style={styles.filterText}>Todos</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.filterButton, filter === 'available' && styles.activeFilter]}
    onPress={() => setFilter('available')}
  >
    <Text style={styles.filterText}>Disponíveis</Text>
  </TouchableOpacity>
</View>

// Filtrar serviços exibidos
const filteredServices = serviceTypes.filter(service => 
  filter === 'all' || (filter === 'available' && service.available)
);

// Usar filteredServices no map em vez de serviceTypes
```

## Próximos Passos

1. Implementar telas específicas para cada tipo de serviço
2. Integrar com backend para obter tipos de serviço dinamicamente
3. Adicionar preferências de usuário para serviços favoritos
4. Implementar lógica para mostrar serviços baseados na localização
5. Adicionar animações de transição entre telas de serviço

## Mensagem de Commit

"feat(services): Implementa tela de seleção de tipos de serviço com suporte a múltiplas modalidades"
