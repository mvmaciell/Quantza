# Documentação da Expansão de Serviços - Quantza 2.0

## Visão Geral

Este documento detalha a implementação da Fase 3 do Quantza 2.0, focada na expansão de serviços além das corridas tradicionais. A implementação segue uma arquitetura modular que permite adicionar novos tipos de serviço de forma flexível, mantendo a identidade visual do Quantza e incorporando elementos de gamificação.

## Arquitetura da Expansão de Serviços

### Estrutura de Pastas

```
frontend/
  └── src/
      ├── screens/
      │   ├── ServiceScreens/
      │   │   ├── ServiceSelectionScreen.tsx       # Tela principal de seleção de serviços
      │   │   ├── DeliveryScreens/                 # Telas específicas para o serviço de entregas
      │   │   │   ├── DeliveryDetailsScreen.tsx    # Configuração de detalhes da entrega
      │   │   │   ├── DeliveryConfirmationScreen.tsx # Confirmação da entrega
      │   │   │   ├── DeliveryTrackingScreen.tsx   # Acompanhamento da entrega
      │   │   │   └── __tests__/                   # Testes para o fluxo de entregas
      │   │   ├── PetTransportScreens/             # (Futuro) Telas para transporte de pets
      │   │   ├── LongTripScreens/                 # (Futuro) Telas para viagens longas
      │   │   └── AccessibleTransportScreens/      # (Futuro) Telas para transporte acessível
      ├── components/
      │   └── ServiceComponents/                   # Componentes reutilizáveis para serviços
      ├── constants/
      │   └── serviceTypes.ts                      # Definições de tipos de serviço
      └── services/
          └── pricingService.ts                    # Serviço de cálculo de preços
```

### Fluxo de Navegação

O fluxo de navegação para os diferentes serviços segue um padrão consistente:

1. **Tela Home** → **Tela de Seleção de Serviço** → **Tela de Detalhes Específicos** → **Tela de Confirmação** → **Tela de Acompanhamento**

Cada tipo de serviço tem suas próprias telas de detalhes, confirmação e acompanhamento, mas compartilham a mesma tela de seleção inicial.

## Componentes Implementados

### 1. ServiceSelectionScreen

**Descrição:** Tela principal que permite ao usuário escolher entre os diferentes tipos de serviço disponíveis.

**Características:**
- Cards visuais para cada tipo de serviço
- Animações de seleção
- Indicação visual de serviços disponíveis vs. em breve
- Navegação contextual baseada no serviço selecionado

**Como ajustar:**
- Para adicionar um novo tipo de serviço, edite o array `serviceTypes` no início do arquivo:

```typescript
// Adicionar novo tipo de serviço
const serviceTypes = [
  // Serviços existentes...
  {
    id: 'newService',
    name: 'Nome do Novo Serviço',
    icon: 'icon-name', // Nome do ícone do Ionicons
    description: 'Descrição do serviço',
    available: true, // ou false para "Em breve"
  },
];
```

- Para modificar a navegação para um novo serviço, ajuste a função `handleContinue`:

```typescript
const handleContinue = () => {
  switch (selectedService) {
    // Casos existentes...
    case 'newService':
      navigation.navigate('NewServiceDetails');
      break;
  }
};
```

### 2. DeliveryDetailsScreen

**Descrição:** Tela que permite ao usuário configurar os detalhes específicos de uma entrega.

**Características:**
- Seleção de tipo de pacote (documento, pequeno, médio, grande)
- Seleção de urgência (normal, expressa, agendada)
- Campo para instruções especiais
- Opção de seguro para itens de valor
- Cálculo de preço em tempo real
- Animações e efeitos visuais (raio, vibração)

**Como ajustar:**
- Para modificar os tipos de pacote, edite o array `packageTypes`:

```typescript
const packageTypes = [
  // Tipos existentes...
  {
    id: 'newType',
    name: 'Novo Tipo',
    icon: 'icon-name',
    description: 'Descrição',
    maxWeight: 'XYkg',
  },
];
```

- Para ajustar o cálculo de preço, modifique a função `calculateEstimatedPrice`:

```typescript
const calculateEstimatedPrice = () => {
  // Lógica existente...
  
  // Adicionar novo caso para tipo de pacote
  switch (packageType) {
    // Casos existentes...
    case 'newType':
      basePrice = 35.0; // Novo preço base
      break;
  }
  
  // Resto da lógica...
};
```

### 3. DeliveryConfirmationScreen

**Descrição:** Tela que exibe um resumo da entrega e permite ao usuário confirmar a solicitação.

**Características:**
- Resumo dos detalhes da entrega
- Exibição de endereços de origem e destino
- Exibição do preço total
- Seleção de método de pagamento
- Animações de confirmação (confetti, vibração)

**Como ajustar:**
- Para adicionar novos campos ao resumo, edite a seção `summaryContainer`:

```tsx
<View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Novo Campo:</Text>
  <Text style={styles.detailValue}>
    {deliveryDetails?.newField || 'Valor padrão'}
  </Text>
</View>
```

- Para modificar as animações de confirmação, ajuste a função `handleConfirmDelivery`:

```typescript
const handleConfirmDelivery = () => {
  // Lógica existente...
  
  // Ajustar padrão de vibração
  Vibration.vibrate([0, 100, 50, 200]); // Novo padrão
  
  // Resto da lógica...
};
```

### 4. DeliveryTrackingScreen

**Descrição:** Tela que permite ao usuário acompanhar o status da entrega em tempo real.

**Características:**
- Mapa interativo com marcadores para origem, destino e entregador
- Exibição do status atual da entrega
- Barra de progresso animada
- Informações do entregador
- Estimativa de tempo atualizada
- Animações e efeitos visuais (raio, pulso)

**Como ajustar:**
- Para modificar os status de entrega, edite o objeto `DELIVERY_STATUS`:

```typescript
const DELIVERY_STATUS = {
  // Status existentes...
  NEW_STATUS: 'new_status',
};
```

- Para adicionar um novo status na linha do tempo, ajuste o array `statusTimeline`:

```typescript
const statusTimeline = [
  // Status existentes...
  { status: DELIVERY_STATUS.NEW_STATUS, delay: 12000 },
];
```

- Para personalizar o conteúdo exibido para cada status, modifique a função `renderStatusContent`:

```typescript
const renderStatusContent = () => {
  switch (deliveryStatus) {
    // Casos existentes...
    case DELIVERY_STATUS.NEW_STATUS:
      return (
        <View style={styles.statusContent}>
          {/* Conteúdo para o novo status */}
        </View>
      );
  }
};
```

## Integração com o Backend

### Endpoints Necessários

Para suportar a expansão de serviços, os seguintes endpoints devem ser implementados no backend:

1. **GET /api/services/types** - Listar tipos de serviço disponíveis
2. **POST /api/services/calculate** - Calcular preço por tipo de serviço
3. **POST /api/services/request** - Solicitar serviço específico
4. **GET /api/services/history** - Histórico por tipo de serviço

### Modelo de Dados

O backend deve implementar os seguintes modelos:

1. **ServiceType** - Tipos de serviço e configurações
2. **ServiceRequest** - Solicitações específicas por tipo
3. **ServicePreference** - Preferências de usuários e parceiros
4. **PricingRule** - Regras de precificação por modalidade

### Exemplo de Implementação do Modelo ServiceType

```typescript
// backend/src/modules/service/service-type.model.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ServiceRequest } from './service-request.model';
import { PricingRule } from './pricing-rule.model';

@Entity('service_types')
export class ServiceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // 'ride', 'delivery', 'pet', etc.

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  icon: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  requiresSpecialVerification: boolean;

  @OneToMany(() => ServiceRequest, request => request.serviceType)
  requests: ServiceRequest[];

  @OneToMany(() => PricingRule, rule => rule.serviceType)
  pricingRules: PricingRule[];
}
```

### Exemplo de Implementação do Controller ServiceType

```typescript
// backend/src/modules/service/service-type.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';
import { AuthGuard } from '../auth/auth.guard';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { RequestServiceDto } from './dto/request-service.dto';

@Controller('services')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Get('types')
  async getServiceTypes() {
    return this.serviceTypeService.findAll();
  }

  @Post('calculate')
  @UseGuards(AuthGuard)
  async calculatePrice(@Body() calculatePriceDto: CalculatePriceDto) {
    return this.serviceTypeService.calculatePrice(calculatePriceDto);
  }

  @Post('request')
  @UseGuards(AuthGuard)
  async requestService(@Body() requestServiceDto: RequestServiceDto) {
    return this.serviceTypeService.createRequest(requestServiceDto);
  }

  @Get('history')
  @UseGuards(AuthGuard)
  async getServiceHistory() {
    return this.serviceTypeService.getHistory();
  }
}
```

## Cálculo de Preços

O sistema de cálculo de preços foi implementado de forma modular, permitindo diferentes fórmulas por tipo de serviço.

### Fórmula Base

```
Preço = (Tarifa Base + (Distância × Valor/km) + (Tempo × Valor/min)) 
        × Fator de Demanda + Modificadores - Descontos
```

### Implementação para Entregas

Para o serviço de entregas, os seguintes fatores são considerados:

1. **Tarifa Base por Tipo de Pacote:**
   - Documento: R$ 15,00
   - Pacote Pequeno: R$ 25,00
   - Pacote Médio: R$ 40,00
   - Pacote Grande: R$ 60,00

2. **Multiplicador por Urgência:**
   - Normal: 1.0x
   - Expressa: 1.5x
   - Agendada: 1.2x

3. **Modificadores:**
   - Seguro: +R$ 5,00

### Como Ajustar o Cálculo de Preços

Para modificar a lógica de cálculo de preços, edite a função `calculateEstimatedPrice` no arquivo `DeliveryDetailsScreen.tsx`:

```typescript
const calculateEstimatedPrice = () => {
  // Obter o multiplicador de urgência
  const urgencyMultiplier = urgencyTypes.find(u => u.id === urgencyType).multiplier;
  
  // Preço base por tipo de pacote
  let basePrice = 0;
  switch (packageType) {
    case 'document':
      basePrice = 15.0; // Modificar este valor para ajustar o preço base
      break;
    // Outros casos...
  }
  
  // Aplicar multiplicador de urgência
  let finalPrice = basePrice * urgencyMultiplier;
  
  // Adicionar seguro se habilitado
  if (insuranceEnabled) {
    finalPrice += 5.0; // Modificar este valor para ajustar o preço do seguro
  }
  
  // Atualizar preço estimado
  setEstimatedPrice(finalPrice);
};
```

## Animações e Gamificação

A implementação inclui diversos elementos de gamificação e feedback visual:

### 1. Animações de Seleção

- Cards que aumentam de escala quando selecionados
- Transições suaves entre estados
- Indicadores visuais de seleção (ícones, cores)

### 2. Efeitos de Raio e Vibração

- Efeito de raio quando o preço muda ou quando um parceiro é encontrado
- Padrões de vibração para diferentes eventos
- Animação de confetti na confirmação

### 3. Feedback Visual em Tempo Real

- Barra de progresso animada durante o acompanhamento
- Animação de pulso durante a busca por parceiro
- Transições suaves entre estados de entrega

### Como Ajustar as Animações

Para modificar as animações, você pode ajustar os seguintes elementos:

1. **Animação de Raio:**
   - Substitua o arquivo `lightning.json` em `assets/animations/`
   - Ajuste o tamanho e duração no componente:

```typescript
<LottieView
  source={require('../../../assets/animations/lightning.json')}
  autoPlay
  loop={false}
  style={{ width: 200, height: 200 }} // Ajustar tamanho
/>
```

2. **Padrões de Vibração:**
   - Modifique os padrões de vibração nas funções relevantes:

```typescript
// Vibração simples
Vibration.vibrate(100); // Duração em ms

// Vibração com padrão
Vibration.vibrate([0, 100, 50, 100]); // Padrão: espera, vibra, espera, vibra
```

3. **Animações de Escala:**
   - Ajuste os valores de interpolação nas animações:

```typescript
const cardScale = animatedValues[type.id].interpolate({
  inputRange: [0, 1],
  outputRange: [1, 1.05], // Modificar para aumentar/diminuir o efeito
});
```

## Testes Automatizados

Foram implementados testes automatizados para validar o fluxo completo de entregas:

1. **Testes de Seleção de Serviço**
2. **Testes de Configuração de Detalhes**
3. **Testes de Confirmação**
4. **Testes de Acompanhamento**

### Como Executar os Testes

```bash
cd frontend
npm test -- --testPathPattern=ServiceScreens
```

### Como Adicionar Novos Testes

Para adicionar testes para um novo tipo de serviço, crie um arquivo de teste em `__tests__/` seguindo o padrão do `DeliveryFlow.spec.tsx`:

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
// Importar componentes relevantes

describe('Fluxo do Novo Serviço', () => {
  it('deve permitir selecionar o novo serviço', () => {
    // Implementação do teste
  });
  
  // Outros testes...
});
```

## Próximos Passos

### 1. Implementação de Serviços Adicionais

Seguindo o mesmo padrão arquitetural, os próximos serviços a serem implementados são:

1. **Transporte de Pets**
2. **Viagens Longas**
3. **Transporte Acessível**

### 2. Integração com Preferências de Usuário

Implementar a tela de preferências que permitirá aos usuários configurar:

- Serviços favoritos
- Preferências por tipo de serviço
- Métodos de pagamento preferenciais por serviço

### 3. Integração com Preferências de Parceiro

Implementar a tela que permitirá aos parceiros configurar:

- Tipos de serviço oferecidos
- Configurações de veículo
- Disponibilidade por tipo de serviço

## Conclusão

A implementação da expansão de serviços segue uma arquitetura modular e flexível, permitindo adicionar novos tipos de serviço de forma incremental. A estrutura mantém a identidade visual do Quantza e incorpora elementos de gamificação para melhorar a experiência do usuário.

Todos os componentes foram desenvolvidos seguindo as melhores práticas de engenharia de software, com código modular, documentação detalhada e testes automatizados.
