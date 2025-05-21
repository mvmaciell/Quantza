# Documentação de Implementação - Backend para Múltiplos Tipos de Serviço

## Visão Geral

Este documento registra a implementação do backend para suporte a múltiplos tipos de serviço no aplicativo Quantza 2.0, parte da Fase 3.1 do roadmap de expansão de serviços. Esta implementação permite gerenciar diferentes modalidades de serviço, como corridas, entregas, transporte de pets, etc., com configurações e precificações específicas.

## Componentes Implementados

### 1. Modelo de Dados (ServiceType)

**Implementação:**
- Schema completo para tipos de serviço
- Campos para identificação (id, nome, descrição, ícone)
- Parâmetros de precificação (preço base, por km, por minuto, mínimo)
- Configurações de disponibilidade e requisitos
- Sistema de modificadores de preço com condições

### 2. Controlador REST (ServiceTypeController)

**Endpoints:**
- `GET /api/services/types` - Listar todos os tipos de serviço
- `GET /api/services/types/:id` - Obter detalhes de um tipo específico
- `POST /api/services/types` - Criar novo tipo de serviço
- `PUT /api/services/types/:id` - Atualizar tipo de serviço existente
- `DELETE /api/services/types/:id` - Excluir tipo de serviço
- `POST /api/services/calculate` - Calcular preço para um serviço específico

### 3. Lógica de Precificação

**Implementação:**
- Cálculo base: preço fixo + (distância × valor/km) + (tempo × valor/minuto)
- Sistema de modificadores condicionais (fixos ou percentuais)
- Avaliação dinâmica de condições para aplicação de modificadores
- Garantia de preço mínimo por serviço
- Detalhamento dos componentes do preço final

## Detalhes Técnicos

### Modelo de Dados:
```typescript
interface IServiceType extends Document {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumPrice: number;
  available: boolean;
  requiresVerification: boolean;
  allowedVehicleTypes: string[];
  modifiers: {
    name: string;
    type: 'fixed' | 'percentage';
    value: number;
    condition?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Cálculo de Preço:
```typescript
// Cálculo base
let price = serviceType.basePrice + 
           (distance * serviceType.pricePerKm) + 
           (duration * serviceType.pricePerMinute);

// Aplicar modificadores
for (const modifier of serviceType.modifiers) {
  // Verificar condição (se existir)
  if (modifier.condition) {
    const conditionMet = /* avaliar condição */;
    if (!conditionMet) continue;
  }
  
  // Aplicar modificador
  const modifierValue = modifier.type === 'fixed' 
    ? modifier.value 
    : (price * modifier.value / 100);
  
  price += modifierValue;
}

// Garantir preço mínimo
price = Math.max(price, serviceType.minimumPrice);
```

### Resposta de Cálculo:
```json
{
  "success": true,
  "data": {
    "serviceId": "delivery",
    "serviceName": "Entregas",
    "basePrice": 5.00,
    "distanceCharge": 7.50,
    "timeCharge": 3.00,
    "appliedModifiers": [
      {
        "name": "Taxa de Urgência",
        "value": 2.50
      }
    ],
    "totalPrice": 18.00
  }
}
```

## Como Ajustar

### 1. Adicionar Novo Tipo de Serviço:
```javascript
// Exemplo de criação de novo tipo de serviço
const newServiceType = {
  id: "pet",
  name: "Transporte de Pets",
  description: "Serviço especializado para transporte de animais",
  icon: "paw",
  basePrice: 8.00,
  pricePerKm: 2.00,
  pricePerMinute: 0.30,
  minimumPrice: 15.00,
  available: true,
  requiresVerification: true,
  allowedVehicleTypes: ["sedan", "suv"],
  modifiers: [
    {
      name: "Taxa de Porte Grande",
      type: "fixed",
      value: 5.00,
      condition: "params.petSize === 'large'"
    },
    {
      name: "Taxa de Limpeza",
      type: "fixed",
      value: 3.00
    }
  ]
};

// Enviar para API
fetch('/api/services/types', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newServiceType)
});
```

### 2. Adicionar Novo Modificador de Preço:
```javascript
// Buscar tipo de serviço existente
const serviceType = await ServiceType.findOne({ id: 'delivery' });

// Adicionar novo modificador
serviceType.modifiers.push({
  name: "Taxa de Volume Extra",
  type: "percentage",
  value: 10, // 10%
  condition: "params.volume > 50"
});

// Salvar alterações
await serviceType.save();
```

### 3. Personalizar Cálculo de Preço:
Para implementar lógicas de cálculo mais complexas, modifique o método `calculatePrice` no controlador:

```javascript
// Exemplo: adicionar fator de demanda dinâmico
public async calculatePrice(req: Request, res: Response): Promise<void> {
  // ... código existente ...
  
  // Obter fator de demanda atual (poderia vir de outro serviço)
  const demandFactor = await DemandService.getCurrentFactor(serviceId, location);
  
  // Aplicar fator de demanda
  price = price * demandFactor;
  
  // ... resto do código ...
}
```

## Próximos Passos

1. Implementar rotas para os endpoints no arquivo de rotas
2. Adicionar validação de entrada para os endpoints
3. Implementar testes unitários e de integração
4. Criar seed data para tipos de serviço padrão
5. Integrar com o frontend para seleção de serviços

## Mensagem de Commit

"feat(services): Implementa modelo e controlador para múltiplos tipos de serviço com precificação dinâmica"
