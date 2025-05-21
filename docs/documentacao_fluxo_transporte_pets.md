# Documentação do Fluxo de Transporte de Pets - Quantza 2.0

## Visão Geral

Este documento detalha a implementação do fluxo de transporte de pets para o Quantza 2.0, parte da Fase 3 focada na expansão de serviços. A implementação segue uma arquitetura modular que permite fácil manutenção e expansão futura, mantendo a identidade visual do Quantza e incorporando elementos de gamificação com tema de pegadas.

## Arquitetura do Fluxo de Transporte de Pets

### Estrutura de Pastas

```
frontend/
  └── src/
      ├── screens/
      │   ├── ServiceScreens/
      │   │   ├── ServiceSelectionScreen.tsx       # Tela principal de seleção de serviços
      │   │   ├── PetTransportScreens/             # Telas específicas para o transporte de pets
      │   │   │   ├── PetTransportDetailsScreen.tsx    # Configuração de detalhes do transporte
      │   │   │   ├── PetTransportConfirmationScreen.tsx # Confirmação do transporte
      │   │   │   ├── PetTransportTrackingScreen.tsx   # Acompanhamento do transporte
      │   │   │   └── __tests__/                   # Testes para o fluxo de transporte de pets
      ├── assets/
      │   └── animations/
      │       └── paw-prints.json                  # Animação de pegadas para gamificação
```

### Fluxo de Navegação

O fluxo de navegação para o transporte de pets segue o padrão:

1. **Tela Home** → **Tela de Seleção de Serviço** → **Tela de Detalhes do Transporte de Pets** → **Tela de Confirmação** → **Tela de Acompanhamento**

## Componentes Implementados

### 1. PetTransportDetailsScreen

**Descrição:** Tela que permite ao usuário configurar os detalhes do transporte de pets.

**Características:**
- Seleção de porte do animal (pequeno, médio, grande)
- Opções de acompanhamento (com tutor, sem tutor)
- Campo para informações adicionais
- Opção de transportadora para maior segurança
- Cálculo de preço em tempo real
- Animações e efeitos visuais (pegadas, vibração)

**Como ajustar:**
- Para modificar os portes de animal disponíveis, edite o array `petSizes`:

```typescript
const petSizes = [
  // Portes existentes...
  {
    id: 'newSize',
    name: 'Novo Porte',
    icon: 'paw',
    description: 'Descrição',
    priceMultiplier: 1.3,
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

### 2. PetTransportConfirmationScreen

**Descrição:** Tela que exibe um resumo do transporte de pets e permite ao usuário confirmar a solicitação.

**Características:**
- Resumo dos detalhes do transporte
- Exibição de endereços de origem e destino
- Exibição do preço total
- Seleção de método de pagamento
- Seção de parceiro verificado com selo pet
- Animações de confirmação (pegadas, vibração)

**Como ajustar:**
- Para adicionar novos campos ao resumo, edite a seção `summaryContainer`:

```tsx
<View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Novo Campo:</Text>
  <Text style={styles.detailValue}>
    {petTransportDetails?.newField || 'Valor padrão'}
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

### 3. PetTransportTrackingScreen

**Descrição:** Tela que permite ao usuário acompanhar o status do transporte de pets em tempo real.

**Características:**
- Mapa interativo com marcadores para origem, destino e parceiro
- Exibição do status atual do transporte
- Barra de progresso animada
- Informações do parceiro com selo pet
- Estimativa de tempo atualizada
- Animações e efeitos visuais (pegadas, pulso)

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

Para suportar o transporte de pets, os seguintes endpoints devem ser implementados no backend:

1. **GET /api/services/pet/partners** - Listar parceiros disponíveis para transporte de pets
2. **POST /api/services/pet/calculate** - Calcular preço para transporte de pets
3. **POST /api/services/pet/request** - Solicitar transporte de pets
4. **GET /api/services/pet/history** - Histórico de transportes de pets

### Modelo de Dados

O backend deve implementar os seguintes modelos específicos para transporte de pets:

1. **PetTransportRequest** - Solicitações de transporte de pets
2. **PetTransportPreference** - Preferências de usuários para transporte de pets
3. **PetTransportPricingRule** - Regras de precificação para transporte de pets

### Exemplo de Implementação do Modelo PetTransportRequest

```typescript
// backend/src/modules/service/pet-transport-request.model.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.model';
import { Partner } from '../partner/partner.model';
import { ServiceRequest } from './service-request.model';

@Entity('pet_transport_requests')
export class PetTransportRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceRequest)
  @JoinColumn()
  serviceRequest: ServiceRequest;

  @Column()
  petSize: string; // 'small', 'medium', 'large'

  @Column()
  accompaniment: string; // 'with_owner', 'without_owner'

  @Column({ nullable: true })
  additionalInfo: string;

  @Column({ default: false })
  carrierEnabled: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Partner, { nullable: true })
  @JoinColumn()
  partner: Partner;

  @Column({ default: 'searching' })
  status: string; // 'searching', 'partner_found', 'pickup', 'in_transit', 'delivered'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}
```

## Cálculo de Preços

O sistema de cálculo de preços para transporte de pets considera os seguintes fatores:

### Fórmula Base

```
Preço = Preço Base × Multiplicador de Porte × Multiplicador de Acompanhamento + Adicionais
```

### Implementação

Para o serviço de transporte de pets, os seguintes fatores são considerados:

1. **Preço Base:**
   - R$ 30,00

2. **Multiplicador por Porte do Animal:**
   - Pequeno: 1.0x
   - Médio: 1.2x
   - Grande: 1.5x

3. **Multiplicador por Acompanhamento:**
   - Com Tutor: 1.0x
   - Sem Tutor: 1.3x

4. **Adicionais:**
   - Transportadora: +R$ 10,00

### Como Ajustar o Cálculo de Preços

Para modificar a lógica de cálculo de preços, edite a função `calculateEstimatedPrice` no arquivo `PetTransportDetailsScreen.tsx`:

```typescript
const calculateEstimatedPrice = () => {
  // Obter o multiplicador de porte do animal
  const sizeMultiplier = petSizes.find(s => s.id === petSize).priceMultiplier;
  
  // Obter o multiplicador de acompanhamento
  const accompMultiplier = accompanimentOptions.find(a => a.id === accompaniment).priceMultiplier;
  
  // Preço base
  const basePrice = 30.0; // Modificar este valor para ajustar o preço base
  
  // Aplicar multiplicadores
  let finalPrice = basePrice * sizeMultiplier * accompMultiplier;
  
  // Adicionar transportadora se habilitada
  if (carrierEnabled) {
    finalPrice += 10.0; // Modificar este valor para ajustar o preço da transportadora
  }
  
  // Atualizar preço estimado
  setEstimatedPrice(finalPrice);
};
```

## Animações e Gamificação

A implementação inclui diversos elementos de gamificação e feedback visual específicos para o transporte de pets:

### 1. Animações de Pegadas

- Efeito de pegadas quando o preço muda ou quando um parceiro é encontrado
- Padrões de vibração para diferentes eventos
- Animação de pegadas durante a busca por parceiro

### 2. Selo de Parceiro Pet

- Badge visual para parceiros verificados para transporte de pets
- Exibição do selo na tela de confirmação e acompanhamento
- Destaque visual para parceiros com verificação específica

### 3. Feedback Visual em Tempo Real

- Barra de progresso animada durante o acompanhamento
- Animação de pulso durante a busca por parceiro
- Transições suaves entre estados de transporte

### Como Ajustar as Animações

Para modificar as animações, você pode ajustar os seguintes elementos:

1. **Animação de Pegadas:**
   - Substitua o arquivo `paw-prints.json` em `assets/animations/`
   - Ajuste o tamanho e duração no componente:

```typescript
<LottieView
  source={require('../../../assets/animations/paw-prints.json')}
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

Foram implementados testes automatizados para validar o fluxo completo de transporte de pets:

1. **Testes de Seleção de Serviço**
2. **Testes de Configuração de Detalhes**
3. **Testes de Confirmação**
4. **Testes de Acompanhamento**

### Como Executar os Testes

```bash
cd frontend
npm test -- --testPathPattern=PetTransportFlow
```

### Como Adicionar Novos Testes

Para adicionar novos testes para o fluxo de transporte de pets, edite o arquivo `PetTransportFlow.spec.tsx`:

```typescript
it('deve testar nova funcionalidade', () => {
  const { getByTestId } = render(<PetTransportDetailsScreen />);
  
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

O fluxo de transporte de pets está integrado com o sistema de selos de parceiro, conforme solicitado pelo usuário. Parceiros que optam por transportar animais recebem um selo específico que é exibido durante o processo de solicitação e acompanhamento.

### Como Implementar o Selo no Cadastro de Parceiro

Para implementar o selo no cadastro de parceiro, adicione o seguinte campo ao modelo de parceiro:

```typescript
// backend/src/modules/partner/partner.model.ts

@Entity('partners')
export class Partner {
  // Campos existentes...
  
  @Column({ default: false })
  petTransportVerified: boolean;
  
  // Outros campos...
}
```

E adicione uma opção no formulário de cadastro do parceiro:

```tsx
<View style={styles.optionContainer}>
  <Text style={styles.optionLabel}>Transporte de Pets</Text>
  <Switch
    value={petTransportEnabled}
    onValueChange={setPetTransportEnabled}
    trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
    thumbColor={petTransportEnabled ? COLORS.gold : COLORS.white}
  />
  <Text style={styles.optionDescription}>
    Habilitar para receber solicitações de transporte de pets
  </Text>
</View>
```

## Próximos Passos

### 1. Implementação de Serviços Adicionais

Seguindo o mesmo padrão arquitetural, os próximos serviços a serem implementados são:

1. **Viagens Longas**
2. **Transporte Acessível**

### 2. Integração com Preferências de Usuário

Implementar a tela de preferências que permitirá aos usuários configurar:

- Preferências para transporte de pets
- Pets favoritos
- Métodos de pagamento preferenciais para transporte de pets

## Conclusão

A implementação do fluxo de transporte de pets segue uma arquitetura modular e flexível, permitindo fácil manutenção e evolução futura. A estrutura mantém a identidade visual do Quantza e incorpora elementos de gamificação específicos para pets, como animações de pegadas e selo de parceiro verificado.

Todos os componentes foram desenvolvidos seguindo as melhores práticas de engenharia de software, com código modular, documentação detalhada e testes automatizados.
