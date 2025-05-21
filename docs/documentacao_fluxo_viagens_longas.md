# Documentação do Fluxo de Viagens Longas - Quantza 2.0

## Visão Geral

Este documento detalha a implementação do fluxo de viagens longas para o Quantza 2.0, parte da Fase 3 focada na expansão de serviços. A implementação segue uma arquitetura modular que permite fácil manutenção e expansão futura, mantendo a identidade visual do Quantza e incorporando elementos de gamificação com tema de estrada.

## Arquitetura do Fluxo de Viagens Longas

### Estrutura de Pastas

```
frontend/
  └── src/
      ├── screens/
      │   ├── ServiceScreens/
      │   │   ├── ServiceSelectionScreen.tsx       # Tela principal de seleção de serviços
      │   │   ├── LongTripScreens/                 # Telas específicas para viagens longas
      │   │   │   ├── LongTripDetailsScreen.tsx    # Configuração de detalhes da viagem
      │   │   │   ├── LongTripConfirmationScreen.tsx # Confirmação da viagem
      │   │   │   ├── LongTripTrackingScreen.tsx   # Acompanhamento da viagem
      │   │   │   └── __tests__/                   # Testes para o fluxo de viagens longas
      ├── assets/
      │   └── animations/
      │       └── road-animation.json              # Animação de estrada para gamificação
```

### Fluxo de Navegação

O fluxo de navegação para viagens longas segue o padrão:

1. **Tela Home** → **Tela de Seleção de Serviço** → **Tela de Detalhes da Viagem Longa** → **Tela de Confirmação** → **Tela de Acompanhamento**

## Componentes Implementados

### 1. LongTripDetailsScreen

**Descrição:** Tela que permite ao usuário configurar os detalhes da viagem longa.

**Características:**
- Seleção de tipo de veículo (padrão, conforto, premium)
- Opção de ida e volta
- Opção de agendamento com seleção de data/hora
- Campo para informações adicionais
- Cálculo de preço em tempo real
- Animações e efeitos visuais (estrada, vibração)

**Como ajustar:**
- Para modificar os tipos de veículo disponíveis, edite o array `vehicleTypes`:

```typescript
const vehicleTypes = [
  // Tipos existentes...
  {
    id: 'newType',
    name: 'Novo Tipo',
    icon: 'car-sport',
    description: 'Descrição',
    priceMultiplier: 1.5,
  },
];
```

- Para ajustar o cálculo de preço, modifique a função `calculateEstimatedPrice`:

```typescript
const calculateEstimatedPrice = () => {
  // Lógica existente...
  
  // Ajustar preço base
  const basePrice = 180.0; // Modificar este valor
  
  // Resto da lógica...
};
```

### 2. LongTripConfirmationScreen

**Descrição:** Tela que exibe um resumo da viagem longa e permite ao usuário confirmar a solicitação.

**Características:**
- Resumo dos detalhes da viagem
- Exibição de endereços de origem e destino
- Exibição do preço total
- Seleção de método de pagamento
- Seção de parceiro verificado
- Animações de confirmação (estrada, vibração)

**Como ajustar:**
- Para adicionar novos campos ao resumo, edite a seção `summaryContainer`:

```tsx
<View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Novo Campo:</Text>
  <Text style={styles.detailValue}>
    {longTripDetails?.newField || 'Valor padrão'}
  </Text>
</View>
```

- Para modificar o selo de parceiro verificado, ajuste a seção `partnerSection`:

```tsx
<View style={styles.verifiedBadge}>
  <Ionicons name="custom-icon" size={16} color={COLORS.white} />
  <Text style={styles.verifiedText}>Novo Texto do Selo</Text>
</View>
```

### 3. LongTripTrackingScreen

**Descrição:** Tela que permite ao usuário acompanhar o status da viagem longa em tempo real.

**Características:**
- Mapa interativo com marcadores para origem, destino e parceiro
- Exibição do status atual da viagem
- Barra de progresso animada
- Informações do parceiro
- Indicadores de distância percorrida e tempo restante
- Animações e efeitos visuais (estrada, pulso)

**Como ajustar:**
- Para modificar os status de viagem, edite o objeto `TRIP_STATUS`:

```typescript
const TRIP_STATUS = {
  // Status existentes...
  NEW_STATUS: 'new_status',
};
```

- Para adicionar um novo status na linha do tempo, ajuste o array `statusTimeline`:

```typescript
const statusTimeline = [
  // Status existentes...
  { status: TRIP_STATUS.NEW_STATUS, delay: 12000 },
];
```

- Para personalizar o conteúdo exibido para cada status, modifique a função `renderStatusContent`:

```typescript
const renderStatusContent = () => {
  switch (tripStatus) {
    // Casos existentes...
    case TRIP_STATUS.NEW_STATUS:
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

Para suportar viagens longas, os seguintes endpoints devem ser implementados no backend:

1. **GET /api/services/longtrip/partners** - Listar parceiros disponíveis para viagens longas
2. **POST /api/services/longtrip/calculate** - Calcular preço para viagens longas
3. **POST /api/services/longtrip/request** - Solicitar viagem longa
4. **GET /api/services/longtrip/history** - Histórico de viagens longas

### Modelo de Dados

O backend deve implementar os seguintes modelos específicos para viagens longas:

1. **LongTripRequest** - Solicitações de viagens longas
2. **LongTripPreference** - Preferências de usuários para viagens longas
3. **LongTripPricingRule** - Regras de precificação para viagens longas

### Exemplo de Implementação do Modelo LongTripRequest

```typescript
// backend/src/modules/service/long-trip-request.model.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.model';
import { Partner } from '../partner/partner.model';
import { ServiceRequest } from './service-request.model';

@Entity('long_trip_requests')
export class LongTripRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceRequest)
  @JoinColumn()
  serviceRequest: ServiceRequest;

  @Column()
  vehicleType: string; // 'standard', 'comfort', 'premium'

  @Column({ default: false })
  roundTrip: boolean;

  @Column({ default: false })
  scheduledTrip: boolean;

  @Column({ type: 'timestamp', nullable: true })
  departureDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date;

  @Column({ nullable: true })
  additionalInfo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  distance: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Partner, { nullable: true })
  @JoinColumn()
  partner: Partner;

  @Column({ default: 'searching' })
  status: string; // 'searching', 'partner_found', 'pickup', 'in_transit', 'arrived'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}
```

## Cálculo de Preços

O sistema de cálculo de preços para viagens longas considera os seguintes fatores:

### Fórmula Base

```
Preço = Preço Base × Multiplicador de Veículo × Multiplicador de Viagem + Adicionais
```

### Implementação

Para o serviço de viagens longas, os seguintes fatores são considerados:

1. **Preço Base:**
   - R$ 150,00 (para viagens de 50km+)

2. **Multiplicador por Tipo de Veículo:**
   - Padrão: 1.0x
   - Conforto: 1.3x
   - Premium: 1.8x

3. **Multiplicador de Viagem:**
   - Somente ida: 1.0x
   - Ida e volta: 1.8x (80% do preço original para a volta)

4. **Adicionais:**
   - Agendamento: +R$ 15,00

### Como Ajustar o Cálculo de Preços

Para modificar a lógica de cálculo de preços, edite a função `calculateEstimatedPrice` no arquivo `LongTripDetailsScreen.tsx`:

```typescript
const calculateEstimatedPrice = () => {
  // Obter o multiplicador de tipo de veículo
  const typeMultiplier = vehicleTypes.find(t => t.id === vehicleType).priceMultiplier;
  
  // Preço base para viagem longa (50km+)
  const basePrice = 150.0; // Modificar este valor para ajustar o preço base
  
  // Aplicar multiplicador de tipo de veículo
  let finalPrice = basePrice * typeMultiplier;
  
  // Adicionar preço para ida e volta
  if (roundTrip) {
    finalPrice *= 1.8; // Modificar este valor para ajustar o multiplicador de ida e volta
  }
  
  // Adicionar taxa para viagem agendada
  if (scheduledTrip) {
    finalPrice += 15.0; // Modificar este valor para ajustar a taxa de agendamento
  }
  
  // Atualizar preço estimado
  setEstimatedPrice(finalPrice);
};
```

## Animações e Gamificação

A implementação inclui diversos elementos de gamificação e feedback visual específicos para viagens longas:

### 1. Animações de Estrada

- Efeito de estrada quando o preço muda ou quando um parceiro é encontrado
- Padrões de vibração para diferentes eventos
- Animação de estrada durante a busca por parceiro

### 2. Indicadores de Progresso

- Barra de progresso animada durante o acompanhamento
- Indicadores de distância percorrida e tempo restante
- Transições suaves entre estados de viagem

### 3. Feedback Visual em Tempo Real

- Mapa interativo com atualização da posição do parceiro
- Animação de pulso durante a busca por parceiro
- Transições suaves entre estados de viagem

### Como Ajustar as Animações

Para modificar as animações, você pode ajustar os seguintes elementos:

1. **Animação de Estrada:**
   - Substitua o arquivo `road-animation.json` em `assets/animations/`
   - Ajuste o tamanho e duração no componente:

```typescript
<LottieView
  source={require('../../../assets/animations/road-animation.json')}
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

## Testes Automatizados

Foram implementados testes automatizados para validar o fluxo completo de viagens longas:

1. **Testes de Seleção de Serviço**
2. **Testes de Configuração de Detalhes**
3. **Testes de Confirmação**
4. **Testes de Acompanhamento**

### Como Executar os Testes

```bash
cd frontend
npm test -- --testPathPattern=LongTripFlow
```

### Como Adicionar Novos Testes

Para adicionar novos testes para o fluxo de viagens longas, edite o arquivo `LongTripFlow.spec.tsx`:

```typescript
it('deve testar nova funcionalidade', () => {
  const { getByTestId } = render(<LongTripDetailsScreen />);
  
  // Implementação do teste
  const newElement = getByTestId('new-element');
  expect(newElement).toBeTruthy();
  
  // Simular interação
  fireEvent.press(newElement);
  
  // Verificar resultado esperado
  expect(mockNavigate).toHaveBeenCalledWith('ExpectedScreen');
});
```

## Integração com o Sistema de Selos de Parceiro

O fluxo de viagens longas está integrado com o sistema de selos de parceiro. Parceiros que realizam viagens longas recebem um selo específico que é exibido durante o processo de solicitação e acompanhamento.

### Como Implementar o Selo no Cadastro de Parceiro

Para implementar o selo no cadastro de parceiro, adicione o seguinte campo ao modelo de parceiro:

```typescript
// backend/src/modules/partner/partner.model.ts

@Entity('partners')
export class Partner {
  // Campos existentes...
  
  @Column({ default: false })
  longTripVerified: boolean;
  
  // Outros campos...
}
```

E adicione uma opção no formulário de cadastro do parceiro:

```tsx
<View style={styles.optionContainer}>
  <Text style={styles.optionLabel}>Viagens Longas</Text>
  <Switch
    value={longTripEnabled}
    onValueChange={setLongTripEnabled}
    trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
    thumbColor={longTripEnabled ? COLORS.gold : COLORS.white}
  />
  <Text style={styles.optionDescription}>
    Habilitar para receber solicitações de viagens longas (50km+)
  </Text>
</View>
```

## Próximos Passos

### 1. Implementação de Serviços Adicionais

Seguindo o mesmo padrão arquitetural, o próximo serviço a ser implementado é:

1. **Transporte Acessível**

### 2. Integração com Preferências de Usuário

Implementar a tela de preferências que permitirá aos usuários configurar:

- Preferências para viagens longas
- Veículos favoritos
- Métodos de pagamento preferenciais para viagens longas

## Conclusão

A implementação do fluxo de viagens longas segue uma arquitetura modular e flexível, permitindo fácil manutenção e evolução futura. A estrutura mantém a identidade visual do Quantza e incorpora elementos de gamificação específicos para viagens longas, como animações de estrada e indicadores de progresso.

Todos os componentes foram desenvolvidos seguindo as melhores práticas de engenharia de software, com código modular, documentação detalhada e testes automatizados.
