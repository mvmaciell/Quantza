# Documentação de Alterações - Estrutura de Assets para Onboarding

## Visão Geral

Este documento registra as alterações realizadas na estrutura de assets para as telas de onboarding do aplicativo Quantza 2.0, parte da Fase 1 do roadmap de implementação. Foi criada uma estrutura organizada para gerenciar os assets de onboarding, facilitando a manutenção e substituição futura por imagens finais.

## Alterações Realizadas

### 1. Estrutura de Diretórios

**Implementação:**
- Criação do diretório `/frontend/src/assets/onboarding/` para armazenar todos os assets relacionados ao onboarding
- Organização centralizada para facilitar a gestão e substituição de assets

### 2. Módulo de Gerenciamento de Assets

**Implementação:**
- Criação do arquivo `/frontend/src/assets/onboarding/index.ts` como ponto central de acesso aos assets
- Implementação de funções utilitárias para pré-carregamento de assets
- Estrutura para geração de placeholders durante o desenvolvimento

### 3. Preparação para Assets Reais

**Funcionalidades:**
- Referências para os arquivos de imagem que serão utilizados nas telas de onboarding:
  - `welcome.png`: Imagem de boas-vindas para o primeiro slide
  - `services.png`: Imagem ilustrando os multi-serviços do Quantza
  - `points.png`: Imagem representando o programa de pontos
  - `donations.png`: Imagem ilustrando o sistema de doações
  - `wallet.png`: Imagem da carteira digital

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `expo-asset`: Para gerenciamento e pré-carregamento de assets (assumindo disponibilidade)

### Funcionalidades Implementadas:
- `preloadAssets()`: Função para pré-carregar todas as imagens de onboarding, evitando flashes durante a navegação
- `generatePlaceholders()`: Função utilitária para gerar imagens de placeholder durante o desenvolvimento

## Como Ajustar

### 1. Substituir Imagens Placeholder por Imagens Reais:
```javascript
// Quando as imagens reais estiverem disponíveis, basta substituir os arquivos:
// - /frontend/src/assets/onboarding/welcome.png
// - /frontend/src/assets/onboarding/services.png
// - /frontend/src/assets/onboarding/points.png
// - /frontend/src/assets/onboarding/donations.png
// - /frontend/src/assets/onboarding/wallet.png
```

### 2. Adicionar Novas Imagens:
```javascript
// Para adicionar uma nova imagem ao módulo:
// 1. Adicione o arquivo à pasta /frontend/src/assets/onboarding/
// 2. Atualize o módulo index.ts:

const OnboardingAssets = {
  preloadAssets: async () => {
    const images = [
      // ... imagens existentes
      require('./nova_imagem.png'), // Nova imagem
    ];
    
    await Promise.all(images.map(image => Asset.fromModule(image).downloadAsync()));
    console.log('Onboarding assets preloaded');
  },
  // ... resto do código
};
```

### 3. Utilizar as Imagens nas Telas de Onboarding:
```javascript
// Em OnboardingScreen.tsx:
import OnboardingAssets from '../../assets/onboarding';

// No useEffect para pré-carregar:
useEffect(() => {
  OnboardingAssets.preloadAssets();
}, []);

// Ao renderizar os slides:
<Image 
  source={require('../../assets/onboarding/welcome.png')} 
  style={styles.image} 
  resizeMode="contain" 
/>
```

## Próximos Passos

1. Criar imagens placeholder básicas para desenvolvimento
2. Integrar o módulo de assets com as telas de onboarding
3. Preparar a estrutura para substituição fácil por imagens finais de alta qualidade
4. Implementar pré-carregamento de assets para melhorar a experiência do usuário

## Mensagem de Commit

"feat(assets): Cria estrutura para gerenciamento de assets de onboarding"
