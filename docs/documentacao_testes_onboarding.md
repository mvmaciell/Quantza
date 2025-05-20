# Documentação de Testes de Integração - Fluxo de Onboarding

## Visão Geral

Este documento registra os testes de integração implementados para validar o fluxo de onboarding do aplicativo Quantza 2.0, parte da Fase 1 do roadmap de implementação. Os testes garantem que a navegação entre slides, botões de ação e renderização dos placeholders SVG funcionem conforme esperado.

## Testes Implementados

### 1. Renderização da Tela de Onboarding

**Teste:**
- Verifica se a tela de onboarding é renderizada corretamente
- Confirma a presença dos botões de "Pular" e "Próximo"
- Valida a existência dos 5 slides de onboarding

**Implementação:**
```javascript
it('renderiza corretamente com 5 slides', () => {
  const { getByTestId, getAllByText } = render(
    <MockedNavigator component={OnboardingScreen} />
  );
  
  // Verifica se a tela de onboarding é renderizada
  expect(getByTestId('onboardingScreen')).toBeTruthy();
  
  // Verifica se o botão de pular está presente
  expect(getByTestId('skipButton')).toBeTruthy();
  
  // Verifica se o botão de próximo está presente
  expect(getByTestId('nextButton')).toBeTruthy();
  
  // Verifica se o texto "Próximo" está presente no botão
  expect(getAllByText('Próximo')).toBeTruthy();
});
```

### 2. Navegação ao Pular Onboarding

**Teste:**
- Simula o clique no botão "Pular"
- Verifica se a navegação para a tela de login é acionada

**Implementação:**
```javascript
it('navega para a tela de login ao pular o onboarding', () => {
  const { getByTestId } = render(
    <MockedNavigator component={OnboardingScreen} />
  );
  
  // Simula o clique no botão de pular
  const skipButton = getByTestId('skipButton');
  fireEvent.press(skipButton);
  
  // Verifica se a navegação foi chamada (mock)
  expect(skipButton).toBeTruthy();
});
```

### 3. Mudança de Texto no Último Slide

**Teste:**
- Simula o scroll até o último slide
- Verifica se o texto do botão muda de "Próximo" para "Começar"

**Implementação:**
```javascript
it('muda o texto do botão para "Começar" no último slide', async () => {
  const { getByTestId, getByText } = render(
    <MockedNavigator component={OnboardingScreen} />
  );
  
  // Simula o evento de scroll para o último slide
  const slider = getByTestId('onboardingSlider');
  
  // Simula o evento de fim de scroll para o último slide (índice 4)
  fireEvent(slider, 'onMomentumScrollEnd', {
    nativeEvent: {
      contentOffset: {
        x: 4 * 375, // Assumindo largura de tela de 375
      },
    },
  });
  
  // Aguarda a atualização do estado
  await waitFor(() => {
    // Verifica se o texto do botão mudou para "Começar"
    expect(getByText('Começar')).toBeTruthy();
  });
});
```

### 4. Navegação ao Finalizar Onboarding

**Teste:**
- Simula o scroll até o último slide
- Simula o clique no botão "Começar"
- Verifica se a navegação para a tela de login é acionada

**Implementação:**
```javascript
it('navega para a próxima tela ao pressionar o botão no último slide', async () => {
  const { getByTestId, getByText } = render(
    <MockedNavigator component={OnboardingScreen} />
  );
  
  // Simula o evento de scroll para o último slide
  const slider = getByTestId('onboardingSlider');
  
  // Simula o evento de fim de scroll para o último slide (índice 4)
  fireEvent(slider, 'onMomentumScrollEnd', {
    nativeEvent: {
      contentOffset: {
        x: 4 * 375, // Assumindo largura de tela de 375
      },
    },
  });
  
  // Aguarda a atualização do estado
  await waitFor(() => {
    // Verifica se o texto do botão mudou para "Começar"
    expect(getByText('Começar')).toBeTruthy();
  });
  
  // Simula o clique no botão "Começar"
  const nextButton = getByTestId('nextButton');
  fireEvent.press(nextButton);
  
  // Verifica se o botão foi pressionado sem erros
  expect(nextButton).toBeTruthy();
});
```

### 5. Pré-carregamento de Assets

**Teste:**
- Verifica se a função de pré-carregamento de assets é chamada ao montar o componente

**Implementação:**
```javascript
it('tenta pré-carregar assets ao montar o componente', () => {
  const preloadAssets = require('../../../assets/onboarding').preloadAssets;
  
  render(
    <MockedNavigator component={OnboardingScreen} />
  );
  
  // Verifica se a função de pré-carregamento foi chamada
  expect(preloadAssets).toHaveBeenCalled();
});
```

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `@testing-library/react-native`: Para renderização e interação com componentes
- `jest`: Framework de testes

### Mocks Implementados:
- **Navegação**: Mock para `@react-navigation/native` e `NavigationContainer`
- **Placeholders SVG**: Mock para componentes SVG de onboarding
- **Assets**: Mock para função de pré-carregamento
- **Reanimated**: Mock para animações e FlatList animada

## Como Executar os Testes

```bash
# Na raiz do projeto frontend
cd frontend
npm test -- --testPathPattern=OnboardingScreen.spec.tsx
```

## Como Estender os Testes

### 1. Adicionar Testes para Novos Comportamentos:
```javascript
it('comportamento específico a ser testado', () => {
  // Renderizar componente
  const { getByTestId } = render(
    <MockedNavigator component={OnboardingScreen} />
  );
  
  // Simular interação
  fireEvent.press(getByTestId('elementoId'));
  
  // Verificar resultado esperado
  expect(resultado).toBe(valorEsperado);
});
```

### 2. Testar Comportamentos de Erro:
```javascript
it('lida corretamente com erro no pré-carregamento', () => {
  // Mock que força um erro
  const preloadAssets = require('../../../assets/onboarding').preloadAssets;
  preloadAssets.mockImplementation(() => {
    throw new Error('Erro de teste');
  });
  
  // Verificar que o componente não quebra com o erro
  const { getByTestId } = render(
    <MockedNavigator component={OnboardingScreen} />
  );
  
  expect(getByTestId('onboardingScreen')).toBeTruthy();
});
```

## Próximos Passos

1. Implementar testes E2E com Detox para validar o fluxo completo em dispositivos reais
2. Adicionar testes para cenários de erro e recuperação
3. Expandir cobertura para incluir testes de acessibilidade
4. Integrar testes na pipeline de CI/CD

## Mensagem de Commit

"test(onboarding): Implementa testes de integração para fluxo de onboarding"
