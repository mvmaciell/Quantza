# Documentação do Fluxo de Transporte Acessível - Quantza 2.0

## Visão Geral

Este documento detalha a implementação do fluxo de transporte acessível para o Quantza 2.0, parte da Fase 3 focada na expansão de serviços. A implementação segue uma arquitetura modular que permite fácil manutenção e expansão futura, mantendo a identidade visual do Quantza e incorporando elementos de gamificação com símbolos de acessibilidade.

## Arquitetura do Fluxo de Transporte Acessível

### Estrutura de Pastas

```
frontend/
  └── src/
      ├── screens/
      │   ├── ServiceScreens/
      │   │   ├── ServiceSelectionScreen.tsx       # Tela principal de seleção de serviços
      │   │   ├── AccessibleTransportScreens/      # Telas específicas para transporte acessível
      │   │   │   ├── AccessibleTransportDetailsScreen.tsx    # Configuração de detalhes do transporte
      │   │   │   ├── AccessibleTransportConfirmationScreen.tsx # Confirmação do transporte
      │   │   │   ├── AccessibleTransportTrackingScreen.tsx   # Acompanhamento do transporte
      │   │   │   └── __tests__/                   # Testes para o fluxo de transporte acessível
      ├── assets/
      │   └── animations/
      │       └── accessibility-animation.json     # Animação de acessibilidade para gamificação
```

### Fluxo de Navegação

O fluxo de navegação para transporte acessível segue o padrão:

1. **Tela Home** → **Tela de Seleção de Serviço** → **Tela de Detalhes do Transporte Acessível** → **Tela de Confirmação** → **Tela de Acompanhamento**

## Componentes Implementados

### 1. AccessibleTransportDetailsScreen

**Descrição:** Tela que permite ao usuário configurar os detalhes do transporte acessível.

**Características:**
- Seleção de tipo de veículo acessível (padrão acessível, van acessível)
- Opção de assistência adicional
- Campo para informações adicionais
- Cálculo de preço em tempo real
- Animações e efeitos visuais (símbolos de acessibilidade, vibração)

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
  const basePrice = 35.0; // Modificar este valor
  
  // Resto da lógica...
};
```

### 2. AccessibleTransportConfirmationScreen

**Descrição:** Tela que exibe um resumo do transporte acessível e permite ao usuário confirmar a solicitação.

**Características:**
- Resumo dos detalhes do transporte
- Exibição de endereços de origem e destino
- Exibição do preço total
- Seleção de método de pagamento
- Seção de parceiro verificado
- Animações de confirmação (símbolos de acessibilidade, vibração)

**Como ajustar:**
- Para adicionar novos campos ao resumo, edite a seção `summaryContainer`:

```tsx
<View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Novo Campo:</Text>
  <Text style={styles.detailValue}>
    {accessibleTransportDetails?.newField || 'Valor padrão'}
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

### 3. AccessibleTransportTrackingScreen

**Descrição:** Tela que permite ao usuário acompanhar o status do transporte acessível em tempo real.

**Características:**
- Mapa interativo com marcadores para origem, destino e parceiro
- Exibição do status atual do transporte
- Barra de progresso animada
- Informações do parceiro
- Indicadores de tempo estimado
- Animações e efeitos visuais (símbolos de acessibilidade, pulso)

**Como ajustar:**
- Para modificar os status de transporte, edite o objeto `TRANSPORT_STATUS`:

```typescript
const TRANSPORT_STATUS = {
  // Status existentes...
  NEW_STATUS: 'new_status',
};
```

- Para adicionar um novo status na linha do tempo, ajuste o array `statusTimeline`:

```typescript
const statusTimeline = [
  // Status existentes...
  { status: TRANSPORT_STATUS.NEW_STATUS, delay: 12000 },
];
```

- Para personalizar o conteúdo exibido para cada status, modifique a função `renderStatusContent`:

```typescript
const renderStatusContent = () => {
  switch (transportStatus) {
    // Casos existentes...
    case TRANSPORT_STATUS.NEW_STATUS:
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

Para suportar transporte acessível, os seguintes endpoints devem ser implementados no backend:

1. **GET /api/services/accessible/partners** - Listar parceiros disponíveis para transporte acessível
2. **POST /api/services/accessible/calculate** - Calcular preço para transporte acessível
3. **POST /api/services/accessible/request** - Solicitar transporte acessível
4. **GET /api/services/accessible/history** - Histórico de transportes acessíveis

### Modelo de Dados

O backend deve implementar os seguintes modelos específicos para transporte acessível:

1. **AccessibleTransportRequest** - Solicitações de transporte acessível
2. **AccessibleTransportPreference** - Preferências de usuários para transporte acessível
3. **AccessibleTransportPricingRule** - Regras de precificação para transporte acessível

### Exemplo de Implementação do Modelo AccessibleTransportRequest

```typescript
// backend/src/modules/service/accessible-transport-request.model.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.model';
import { Partner } from '../partner/partner.model';
import { ServiceRequest } from './service-request.model';

@Entity('accessible_transport_requests')
export class AccessibleTransportRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceRequest)
  @JoinColumn()
  serviceRequest: ServiceRequest;

  @Column()
  vehicleType: string; // 'standard_accessible', 'van_accessible'

  @Column({ default: false })
  needAssistance: boolean;

  @Column({ nullable: true })
  additionalInfo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

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

O sistema de cálculo de preços para transporte acessível considera os seguintes fatores:

### Fórmula Base

```
Preço = Preço Base × Multiplicador de Veículo + Adicionais
```

### Implementação

Para o serviço de transporte acessível, os seguintes fatores são considerados:

1. **Preço Base:**
   - R$ 35,00

2. **Multiplicador por Tipo de Veículo:**
   - Padrão Acessível: 1.2x
   - Van Acessível: 1.5x

3. **Adicionais:**
   - Assistência adicional: +R$ 10,00

### Como Ajustar o Cálculo de Preços

Para modificar a lógica de cálculo de preços, edite a função `calculateEstimatedPrice` no arquivo `AccessibleTransportDetailsScreen.tsx`:

```typescript
const calculateEstimatedPrice = () => {
  // Obter o multiplicador de tipo de veículo
  const typeMultiplier = vehicleTypes.find(t => t.id === vehicleType).priceMultiplier;
  
  // Preço base
  const basePrice = 35.0; // Modificar este valor para ajustar o preço base
  
  // Aplicar multiplicador de tipo de veículo
  let finalPrice = basePrice * typeMultiplier;
  
  // Adicionar taxa para assistência adicional
  if (needAssistance) {
    finalPrice += 10.0; // Modificar este valor para ajustar a taxa de assistência
  }
  
  // Atualizar preço estimado
  setEstimatedPrice(finalPrice);
};
```

## Animações e Gamificação

A implementação inclui diversos elementos de gamificação e feedback visual específicos para transporte acessível:

### 1. Animações de Acessibilidade

- Efeito de símbolo de acessibilidade quando o preço muda ou quando um parceiro é encontrado
- Padrões de vibração para diferentes eventos
- Animação de acessibilidade durante a busca por parceiro

### 2. Indicadores de Progresso

- Barra de progresso animada durante o acompanhamento
- Indicadores de tempo estimado
- Transições suaves entre estados de transporte

### 3. Feedback Visual em Tempo Real

- Mapa interativo com atualização da posição do parceiro
- Animação de pulso durante a busca por parceiro
- Transições suaves entre estados de transporte

### Como Ajustar as Animações

Para modificar as animações, você pode ajustar os seguintes elementos:

1. **Animação de Acessibilidade:**
   - Substitua o arquivo `accessibility-animation.json` em `assets/animations/`
   - Ajuste o tamanho e duração no componente:

```typescript
<LottieView
  source={require('../../../assets/animations/accessibility-animation.json')}
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

Foram implementados testes automatizados para validar o fluxo completo de transporte acessível:

1. **Testes de Seleção de Serviço**
2. **Testes de Configuração de Detalhes**
3. **Testes de Confirmação**
4. **Testes de Acompanhamento**

### Como Executar os Testes

```bash
cd frontend
npm test -- --testPathPattern=AccessibleTransportFlow
```

### Como Adicionar Novos Testes

Para adicionar novos testes para o fluxo de transporte acessível, edite o arquivo `AccessibleTransportFlow.spec.tsx`:

```typescript
it('deve testar nova funcionalidade', () => {
  const { getByTestId } = render(<AccessibleTransportDetailsScreen />);
  
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

O fluxo de transporte acessível está integrado com o sistema de selos de parceiro. Parceiros que realizam transporte acessível recebem um selo específico que é exibido durante o processo de solicitação e acompanhamento.

### Como Implementar o Selo no Cadastro de Parceiro

Para implementar o selo no cadastro de parceiro, adicione o seguinte campo ao modelo de parceiro:

```typescript
// backend/src/modules/partner/partner.model.ts

@Entity('partners')
export class Partner {
  // Campos existentes...
  
  @Column({ default: false })
  accessibilityVerified: boolean;
  
  // Outros campos...
}
```

E adicione uma opção no formulário de cadastro do parceiro:

```tsx
<View style={styles.optionContainer}>
  <Text style={styles.optionLabel}>Transporte Acessível</Text>
  <Switch
    value={accessibilityEnabled}
    onValueChange={setAccessibilityEnabled}
    trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
    thumbColor={accessibilityEnabled ? COLORS.gold : COLORS.white}
  />
  <Text style={styles.optionDescription}>
    Habilitar para receber solicitações de transporte acessível
  </Text>
</View>
```

## Próximos Passos

### 1. Sistema de Preferências por Tipo de Serviço

O próximo passo é implementar um sistema que permita aos usuários configurar suas preferências para cada tipo de serviço:

- Preferências para transporte acessível
- Veículos favoritos
- Configurações de acessibilidade

### 2. Cálculo de Preços Diferenciados

Implementar um sistema de cálculo de preços mais sofisticado que considere:

- Distância e tempo estimado
- Demanda atual
- Disponibilidade de parceiros com veículos acessíveis

## Conclusão

A implementação do fluxo de transporte acessível segue uma arquitetura modular e flexível, permitindo fácil manutenção e evolução futura. A estrutura mantém a identidade visual do Quantza e incorpora elementos de gamificação específicos para transporte acessível, como símbolos de acessibilidade e indicadores de progresso.

Todos os componentes foram desenvolvidos seguindo as melhores práticas de engenharia de software, com código modular, documentação detalhada e testes automatizados. A implementação também foi projetada para ser facilmente expansível, permitindo a adição de novos tipos de veículos acessíveis e funcionalidades no futuro.
