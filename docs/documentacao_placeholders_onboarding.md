# Documentação de Alterações - Placeholders SVG para Onboarding

## Visão Geral

Este documento registra as alterações realizadas para criar imagens placeholder SVG para as telas de onboarding do aplicativo Quantza 2.0, parte da Fase 1 do roadmap de implementação. Foram criados componentes SVG simples que seguem a identidade visual do Quantza, para uso durante o desenvolvimento até que as imagens finais sejam criadas por designers.

## Alterações Realizadas

### 1. Componentes SVG Placeholder

**Implementação:**
- Criação do arquivo `/frontend/src/assets/onboarding/placeholders.tsx` com componentes SVG
- Desenvolvimento de 5 imagens placeholder correspondentes aos slides de onboarding:
  - **Welcome**: Logo Quantza com elementos visuais de boas-vindas
  - **Services**: Representação visual de multi-serviços com círculos sobrepostos
  - **Points**: Estrela representando o programa de pontos
  - **Donations**: Símbolo de coração representando doações
  - **Wallet**: Representação simplificada de uma carteira digital

### 2. Alinhamento com Identidade Visual

**Características:**
- Utilização das cores oficiais do Quantza (azul escuro, dourado, branco)
- Elementos visuais simples e reconhecíveis
- Textos descritivos para cada imagem
- Design minimalista e coeso entre os diferentes placeholders

### 3. Tecnologia Utilizada

**Implementação Técnica:**
- Uso de `react-native-svg` para criação de gráficos vetoriais
- Componentes reutilizáveis e de fácil substituição
- Tamanho padronizado (300x300) para consistência visual

## Detalhes Técnicos

### Biblioteca Utilizada:
- `react-native-svg`: Para criação de gráficos vetoriais SVG no React Native

### Componentes Implementados:
- `Welcome`: Logo Quantza com círculo dourado e elementos triangulares
- `Services`: Círculos sobrepostos representando diferentes serviços
- `Points`: Estrela dourada representando o programa de pontos
- `Donations`: Símbolo de coração representando o sistema de doações
- `Wallet`: Retângulo com elementos representando uma carteira digital

## Como Ajustar

### 1. Modificar Cores e Estilos:
```javascript
// Alterar as constantes de cores no início do arquivo
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  // Modificar ou adicionar cores aqui
};
```

### 2. Personalizar Formas e Elementos:
```javascript
// Exemplo de modificação do componente Points
Points: () => (
  <Svg width="300" height="300" viewBox="0 0 300 300">
    <Rect width="300" height="300" fill={COLORS.secondary} />
    <G>
      // Modificar o path da estrela ou substituir por outro elemento
      <Path
        d="M150,60 L170,120 L230,120 L180,160 L200,220 L150,180 L100,220 L120,160 L70,120 L130,120 Z"
        fill={COLORS.primary}
      />
    </G>
    // Modificar o texto descritivo
    <SvgText
      x="150"
      y="280"
      fontSize="18"
      fill={COLORS.white}
      textAnchor="middle"
    >
      Programa de Pontos
    </SvgText>
  </Svg>
),
```

### 3. Substituir por Imagens Reais:
```javascript
// Quando as imagens reais estiverem disponíveis, você pode:
// 1. Remover este arquivo de placeholders
// 2. Adicionar as imagens reais à pasta assets/onboarding/
// 3. Atualizar as referências nas telas de onboarding
```

## Integração com as Telas de Onboarding

Para utilizar estes placeholders nas telas de onboarding:

```javascript
// Em OnboardingScreen.tsx:
import OnboardingPlaceholders from '../../assets/onboarding/placeholders';

// No renderItem da FlatList:
renderItem = ({ item, index }) => {
  let PlaceholderComponent;
  
  switch(index) {
    case 0:
      PlaceholderComponent = OnboardingPlaceholders.Welcome;
      break;
    case 1:
      PlaceholderComponent = OnboardingPlaceholders.Services;
      break;
    case 2:
      PlaceholderComponent = OnboardingPlaceholders.Points;
      break;
    case 3:
      PlaceholderComponent = OnboardingPlaceholders.Donations;
      break;
    case 4:
      PlaceholderComponent = OnboardingPlaceholders.Wallet;
      break;
    default:
      PlaceholderComponent = OnboardingPlaceholders.Welcome;
  }
  
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <PlaceholderComponent />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}
```

## Próximos Passos

1. Integrar os placeholders SVG com as telas de onboarding
2. Implementar testes de integração para validar o fluxo completo
3. Preparar a estrutura para substituição fácil por imagens finais de alta qualidade

## Mensagem de Commit

"feat(assets): Cria placeholders SVG para imagens de onboarding"
