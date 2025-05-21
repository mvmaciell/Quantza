# Documentação do Sistema de Preferências e Cálculo de Preços - Quantza 2.0

## Visão Geral

Este documento detalha a implementação do sistema de preferências por tipo de serviço e o cálculo de preços diferenciados por modalidade para o Quantza 2.0, parte da Fase 3 focada na expansão de serviços. A implementação segue uma arquitetura modular e flexível que permite fácil manutenção e expansão futura, mantendo a identidade visual do Quantza e incorporando elementos de gamificação.

## Arquitetura do Sistema de Preferências

### Estrutura de Pastas

```
frontend/
  └── src/
      ├── components/
      │   └── ServicePreferences/
      │       ├── PaymentPreferences.tsx        # Componente de preferências de pagamento
      │       └── ServicePreferencesManager.tsx # Gerenciador de preferências por serviço
      ├── services/
      │   ├── PriceCalculator.ts                # Serviço de cálculo de preços
      │   └── ServiceTypeManager.ts             # Gerenciador de tipos de serviço
      └── types/
          └── service.ts                        # Tipos e interfaces para serviços
```

### Fluxo de Integração

O fluxo de integração do sistema de preferências e cálculo de preços segue o padrão:

1. **Seleção de Serviço** → **Configuração de Preferências** → **Aplicação Automática em Novas Solicitações** → **Cálculo de Preço Específico por Modalidade**

## Componentes Implementados

### 1. PaymentPreferences

**Descrição:** Componente que permite ao usuário selecionar um método de pagamento padrão para um tipo específico de serviço.

**Características:**
- Seleção de método de pagamento padrão
- Animação de pontos estilo Duolingo
- Feedback visual e tátil (vibração)
- Interface intuitiva e responsiva

**Como ajustar:**
- Para modificar os estilos visuais, edite o objeto `styles`:

```typescript
const styles = StyleSheet.create({
  // Estilos existentes...
  pointsEarned: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gold, // Modificar esta cor
    marginBottom: 5,
  },
  // Outros estilos...
});
```

- Para ajustar a animação de pontos, modifique o efeito correspondente:

```typescript
// Efeito para mostrar animação de pontos quando solicitado
useEffect(() => {
  if (showAnimation) {
    // Simular ganho de pontos por definir preferência
    const points = 15; // Modificar este valor para ajustar pontos ganhos
    setEarnedPoints(points);
    
    // Resto da lógica...
  }
}, [showAnimation]);
```

### 2. ServicePreferencesManager

**Descrição:** Componente gerenciador que integra as preferências do usuário aos fluxos de serviço, incluindo persistência e recuperação automática.

**Características:**
- Persistência automática de preferências
- Integração transparente com fluxos de serviço
- Recuperação automática de preferências salvas
- Animação de pontos ao salvar preferências

**Como ajustar:**
- Para modificar a estrutura de dados de preferências, edite a interface `ServicePreference`:

```typescript
interface ServicePreference {
  serviceId: string;
  defaultPaymentMethodId: string;
  // Adicionar novos campos aqui
}
```

- Para ajustar a lógica de persistência, modifique a função `savePreferences`:

```typescript
const savePreferences = async (defaultPaymentMethodId: string) => {
  try {
    const preferences = {
      serviceId,
      defaultPaymentMethodId,
      // Adicionar novos campos aqui
    };
    
    // Resto da lógica...
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
  }
};
```

## Serviços Implementados

### 1. PriceCalculator

**Descrição:** Serviço que implementa a lógica de cálculo de preços diferenciados por modalidade de serviço.

**Características:**
- Cálculo específico para cada tipo de serviço
- Consideração de fatores específicos por modalidade
- Preços base e multiplicadores configuráveis
- Formatação de preços para exibição

**Como ajustar:**
- Para modificar os preços base, edite o objeto `BASE_PRICES`:

```typescript
private static BASE_PRICES = {
  standard: 25.0,      // Corrida tradicional
  delivery: 20.0,      // Entrega
  petTransport: 30.0,  // Transporte de pets
  longTrip: 150.0,     // Viagem longa
  accessible: 35.0,    // Transporte acessível
  // Adicionar novos tipos de serviço aqui
};
```

- Para ajustar os multiplicadores por tipo de veículo, modifique o objeto `VEHICLE_MULTIPLIERS`:

```typescript
private static VEHICLE_MULTIPLIERS = {
  // Corrida tradicional
  standard: {
    basic: 1.0,
    comfort: 1.3,
    premium: 1.8,
    // Adicionar novos tipos de veículo aqui
  },
  // Outros tipos de serviço...
};
```

- Para implementar um novo método de cálculo para um tipo de serviço, adicione uma nova função:

```typescript
static calculateNewServicePrice(params: {
  // Parâmetros específicos
}): number {
  // Implementação do cálculo
  return finalPrice;
}
```

E atualize o método `calculatePrice` para incluir o novo tipo:

```typescript
static calculatePrice(serviceType: ServiceType, params: any): number {
  switch (serviceType) {
    // Casos existentes...
    case 'newService':
      return this.calculateNewServicePrice(params);
    default:
      return 0;
  }
}
```

### 2. ServiceTypeManager

**Descrição:** Serviço que implementa a integração entre frontend e backend para gerenciamento de tipos de serviço.

**Características:**
- Listagem de tipos de serviço disponíveis
- Detalhes específicos por tipo de serviço
- Gerenciamento de preferências do usuário
- Cálculo de preços via API
- Criação de solicitações de serviço
- Histórico de solicitações

**Como ajustar:**
- Para modificar a URL base da API, edite a constante `API_BASE_URL`:

```typescript
private static API_BASE_URL = '/api/services'; // Modificar para nova URL base
```

- Para ajustar os dados mockados (fallback), modifique a função `getMockServiceTypes`:

```typescript
private static getMockServiceTypes(): ServiceTypeModel[] {
  return [
    // Tipos existentes...
    {
      id: 'newService',
      name: 'Novo Serviço',
      description: 'Descrição do novo serviço',
      icon: 'custom-icon',
      isActive: true,
      basePrice: 40.0,
      priceMultipliers: {
        // Multiplicadores específicos
      },
      additionalOptions: [
        // Opções adicionais
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}
```

## Integração com o Backend

### Endpoints Necessários

Para suportar o sistema de preferências e cálculo de preços, os seguintes endpoints foram implementados no backend:

1. **GET /api/services/types** - Listar todos os tipos de serviço disponíveis
2. **GET /api/services/types/{id}** - Obter detalhes de um tipo de serviço específico
3. **GET /api/services/preferences/{serviceTypeId}/user/{userId}** - Obter preferências do usuário para um tipo de serviço
4. **POST /api/services/preferences/{serviceTypeId}/user/{userId}** - Salvar preferências do usuário para um tipo de serviço
5. **POST /api/services/types/{serviceTypeId}/calculate** - Calcular preço para um tipo de serviço
6. **POST /api/services/requests** - Criar uma solicitação de serviço
7. **GET /api/services/history/{serviceTypeId}/user/{userId}** - Obter histórico de solicitações do usuário para um tipo de serviço

### Modelo de Dados

O backend implementa os seguintes modelos para suportar o sistema:

1. **ServiceType** - Tipos de serviço disponíveis
2. **ServiceTypeOption** - Opções adicionais para tipos de serviço
3. **ServicePreference** - Preferências do usuário para tipos de serviço
4. **ServiceRequest** - Solicitações de serviço

### Exemplo de Implementação do Modelo ServiceType

```typescript
// backend/src/modules/service/service-type.model.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ServiceTypeOption } from './service-type-option.model';

@Entity('service_types')
export class ServiceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  icon: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('json')
  priceMultipliers: Record<string, number>;

  @OneToMany(() => ServiceTypeOption, option => option.serviceType)
  additionalOptions: ServiceTypeOption[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

## Cálculo de Preços

O sistema de cálculo de preços diferenciados por modalidade considera fatores específicos para cada tipo de serviço:

### 1. Corrida Tradicional

```
Preço = (Preço Base + Preço por Distância + Preço por Duração) × Multiplicador de Veículo
```

- **Preço Base:** R$ 25,00
- **Preço por Distância:** R$ 2,00/km
- **Preço por Duração:** R$ 0,50/min
- **Multiplicadores por Tipo de Veículo:**
  - Básico: 1.0x
  - Conforto: 1.3x
  - Premium: 1.8x

### 2. Entrega

```
Preço = (Preço Base + Preço por Distância) × Multiplicador de Veículo × Multiplicador de Urgência × Multiplicador de Tamanho
```

- **Preço Base:** R$ 20,00
- **Preço por Distância:** R$ 1,80/km
- **Multiplicadores por Tipo de Veículo:**
  - Moto: 1.0x
  - Carro: 1.3x
  - Van: 1.6x
- **Multiplicador de Urgência:**
  - Normal: 1.0x
  - Urgente: 1.4x
- **Multiplicador de Tamanho:**
  - Pequeno: 1.0x
  - Médio: 1.2x
  - Grande: 1.5x

### 3. Transporte de Pets

```
Preço = (Preço Base + Preço por Distância) × Multiplicador de Veículo × Multiplicador de Porte × Multiplicador de Acompanhamento
```

- **Preço Base:** R$ 30,00
- **Preço por Distância:** R$ 2,20/km
- **Multiplicadores por Tipo de Veículo:**
  - Padrão: 1.0x
  - Premium: 1.4x
- **Multiplicador de Porte:**
  - Pequeno: 1.0x
  - Médio: 1.2x
  - Grande: 1.4x
- **Multiplicador de Acompanhamento:**
  - Sem dono: 1.0x
  - Com dono: 1.2x

### 4. Viagem Longa

```
Preço = ((Preço Base + Preço por Distância) × Multiplicador de Veículo × Multiplicador de Viagem) + Taxa de Agendamento
```

- **Preço Base:** R$ 150,00
- **Preço por Distância:** R$ 1,50/km
- **Multiplicadores por Tipo de Veículo:**
  - Padrão: 1.0x
  - Conforto: 1.3x
  - Premium: 1.8x
- **Multiplicador de Viagem:**
  - Somente ida: 1.0x
  - Ida e volta: 1.8x
- **Taxa de Agendamento:**
  - Imediato: R$ 0,00
  - Agendado: R$ 15,00

### 5. Transporte Acessível

```
Preço = ((Preço Base + Preço por Distância) × Multiplicador de Veículo) + Taxa de Assistência
```

- **Preço Base:** R$ 35,00
- **Preço por Distância:** R$ 2,00/km
- **Multiplicadores por Tipo de Veículo:**
  - Padrão Acessível: 1.2x
  - Van Acessível: 1.5x
- **Taxa de Assistência:**
  - Sem assistência: R$ 0,00
  - Com assistência: R$ 10,00

## Gamificação

O sistema de preferências inclui elementos de gamificação para incentivar a personalização:

### 1. Sistema de Pontos

- **Ganho de Pontos:** 15 pontos por definir uma preferência
- **Animação:** Estilo Duolingo, com efeito visual e vibração
- **Exibição:** Mostra pontos ganhos e saldo total

### 2. Feedback Visual e Tátil

- **Animações:** Efeitos visuais ao salvar preferências
- **Vibração:** Padrões de vibração para feedback tátil
- **Cores e Ícones:** Elementos visuais para reforçar ações

## Testes Automatizados

Foram implementados testes automatizados para validar o sistema de preferências e cálculo de preços:

1. **Testes de Componentes**
2. **Testes de Serviços**
3. **Testes de Integração**

### Como Executar os Testes

```bash
cd frontend
npm test -- --testPathPattern=ServicePreferences
npm test -- --testPathPattern=PriceCalculator
```

## Próximos Passos

### 1. Expansão do Sistema de Preferências

Possíveis expansões futuras para o sistema de preferências:

- Preferências de tipo de veículo por serviço
- Preferências de horário para agendamentos
- Preferências de rotas favoritas

### 2. Refinamento do Cálculo de Preços

Possíveis refinamentos futuros para o cálculo de preços:

- Preços dinâmicos baseados em demanda
- Descontos para usuários frequentes
- Promoções por horário ou região

## Conclusão

A implementação do sistema de preferências por tipo de serviço e cálculo de preços diferenciados por modalidade segue uma arquitetura modular e flexível, permitindo fácil manutenção e evolução futura. A estrutura mantém a identidade visual do Quantza e incorpora elementos de gamificação para incentivar a personalização.

Todos os componentes foram desenvolvidos seguindo as melhores práticas de engenharia de software, com código modular, documentação detalhada e testes automatizados. A implementação também foi projetada para ser facilmente expansível, permitindo a adição de novos tipos de serviço e funcionalidades no futuro.
