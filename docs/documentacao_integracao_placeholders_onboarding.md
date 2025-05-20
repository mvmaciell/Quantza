# Documentação de Alterações - Integração de Placeholders SVG nas Telas de Onboarding

## Visão Geral

Este documento registra as alterações realizadas para integrar os placeholders SVG nas telas de onboarding do aplicativo Quantza 2.0, parte da Fase 1 do roadmap de implementação. Os componentes SVG criados anteriormente foram integrados à tela de onboarding, substituindo as referências a imagens estáticas que ainda não existiam.

## Alterações Realizadas

### 1. Integração dos Placeholders SVG

**Implementação:**
- Atualização do arquivo `/frontend/src/screens/OnboardingScreens/OnboardingScreen.tsx`
- Importação dos componentes SVG de `/frontend/src/assets/onboarding/placeholders.tsx`
- Substituição das referências a imagens estáticas por componentes SVG dinâmicos

### 2. Estrutura de Dados Atualizada

**Alterações:**
- Modificação da estrutura de dados dos slides para incluir componentes SVG:
  ```javascript
  const slides = [
    {
      id: '1',
      title: 'Bem-vindo ao Quantza',
      description: '...',
      PlaceholderComponent: OnboardingPlaceholders.Welcome,
    },
    // ... outros slides
  ];
  ```

### 3. Renderização Dinâmica

**Implementação:**
- Atualização do método `renderItem` para renderizar componentes SVG:
  ```javascript
  const PlaceholderComponent = item.PlaceholderComponent;
  
  return (
    <View style={styles.slide} testID={`onboardingSlide-${index}`}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <PlaceholderComponent />
      </Animated.View>
      {/* ... resto do código */}
    </View>
  );
  ```

### 4. Pré-carregamento de Assets

**Funcionalidade:**
- Adição de um `useEffect` para tentar pré-carregar assets quando disponíveis:
  ```javascript
  useEffect(() => {
    try {
      OnboardingAssets.preloadAssets();
    } catch (error) {
      console.log('Assets ainda não disponíveis para pré-carregamento');
    }
  }, []);
  ```

### 5. Melhorias de Testabilidade

**Implementação:**
- Adição de `testID` para cada slide e elemento de paginação:
  ```javascript
  <View style={styles.slide} testID={`onboardingSlide-${index}`}>
  ```
  ```javascript
  <Animated.View
    key={`dot-${index}`}
    style={[styles.dot, animatedDotStyle]}
    testID={`paginationDot-${index}`}
  />
  ```

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `react-native-reanimated`: Para animações fluidas durante a navegação entre slides
- Componentes SVG personalizados de `placeholders.tsx`

### Fluxo de Navegação:
- Atualização da navegação para usar rotas aninhadas:
  ```javascript
  navigation.replace('Auth', { screen: 'Login' });
  ```

## Como Ajustar

### 1. Substituir por Imagens Reais:
```javascript
// Quando as imagens reais estiverem disponíveis:
// 1. Remover a importação dos placeholders
// import OnboardingPlaceholders from '../../assets/onboarding/placeholders';

// 2. Atualizar a estrutura de dados dos slides:
const slides = [
  {
    id: '1',
    title: 'Bem-vindo ao Quantza',
    description: '...',
    image: require('../../assets/onboarding/welcome.png'),
  },
  // ... outros slides
];

// 3. Atualizar o método renderItem:
return (
  <View style={styles.slide}>
    <Animated.View style={[styles.imageContainer, animatedStyle]}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="contain"
      />
    </Animated.View>
    {/* ... resto do código */}
  </View>
);
```

### 2. Personalizar Animações:
```javascript
// Para modificar as animações de transição:
const animatedStyle = useAnimatedStyle(() => {
  const scale = interpolate(
    scrollX.value,
    inputRange,
    [0.7, 1, 0.7], // Ajustar valores para efeito mais ou menos intenso
    Extrapolate.CLAMP
  );
  
  const opacity = interpolate(
    scrollX.value,
    inputRange,
    [0.3, 1, 0.3], // Ajustar valores para efeito mais ou menos intenso
    Extrapolate.CLAMP
  );
  
  // Adicionar rotação ou outros efeitos
  const rotate = interpolate(
    scrollX.value,
    inputRange,
    [-5, 0, 5],
    Extrapolate.CLAMP
  );
  
  return {
    transform: [
      { scale },
      { rotateZ: `${rotate}deg` }
    ],
    opacity,
  };
});
```

## Próximos Passos

1. Implementar testes de integração para validar o fluxo completo de onboarding
2. Verificar a navegação entre slides e para a tela de login
3. Testar a responsividade em diferentes tamanhos de tela
4. Preparar a estrutura para substituição fácil por imagens finais de alta qualidade

## Mensagem de Commit

"feat(onboarding): Integra placeholders SVG nas telas de onboarding"
