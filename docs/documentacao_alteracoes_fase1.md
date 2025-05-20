# Documentação de Alterações - Fase 1: Fundação Visual e Onboarding

## Visão Geral

Este documento registra as alterações realizadas na Fase 1 do roadmap de implementação do Quantza 2.0, focando na Fundação Visual e Onboarding. Cada alteração está documentada com detalhes técnicos, impacto no código e instruções para ajustes futuros.

## 1. Criação da SplashScreen Animada

**Arquivo:** `/home/ubuntu/quantza_app/frontend/src/screens/OnboardingScreens/SplashScreen.tsx`

**Descrição:**
Implementação da nova tela de splash com animação de logo e efeito de raio, conforme solicitado no escopo atualizado. A tela utiliza Animated API do React Native para criar uma sequência de animações que inclui fade in do logo, escala, aparecimento do raio com rotação, e vibração do dispositivo sincronizada com o efeito visual.

**Detalhes Técnicos:**
- Utiliza `Animated` do React Native para animações
- Implementa efeito de vibração com `Vibration` API
- Mantém a identidade visual do Quantza (azul escuro, dourado, branco)
- Inclui placeholders para logo e raio que devem ser substituídos por imagens reais

**Como Ajustar:**
1. **Substituir Placeholders:**
   ```javascript
   // Substituir o placeholder do logo
   <View style={styles.logoPlaceholder}>
     <Text style={styles.logoText}>QUANTZA</Text>
   </View>
   
   // Substituir por:
   <Image 
     source={require('../../assets/logo.png')} 
     style={styles.logo} 
     resizeMode="contain" 
   />
   ```

2. **Ajustar Duração das Animações:**
   ```javascript
   // Modificar os valores de duration para ajustar a velocidade das animações
   Animated.timing(logoOpacity, {
     toValue: 1,
     duration: 800, // Aumentar/diminuir conforme necessário
     useNativeDriver: true,
     easing: Easing.out(Easing.ease),
   }),
   ```

3. **Personalizar Efeito de Vibração:**
   ```javascript
   // Ajustar o padrão de vibração
   Vibration.vibrate([0, 100, 50, 100]); // [delay, duração, delay, duração]
   ```

**Mensagem de Commit:**
"feat(splash): Adiciona SplashScreen animada com efeito de raio e vibração"

## 2. Implementação das Telas de Onboarding

**Arquivo:** `/home/ubuntu/quantza_app/frontend/src/screens/OnboardingScreens/OnboardingScreen.tsx`

**Descrição:**
Implementação da tela de onboarding com slides que apresentam as principais funcionalidades do Quantza. A tela utiliza FlatList com paginação e animações para transição entre slides, botões para navegar e pular o onboarding, e indicadores de página animados.

**Detalhes Técnicos:**
- Utiliza `Animated.FlatList` para slides com paginação
- Implementa animações de escala e opacidade durante a transição
- Indicadores de página animados que mudam de tamanho e opacidade
- Botões "Próximo" e "Pular" para navegação
- Mantém a identidade visual do Quantza

**Como Ajustar:**
1. **Modificar Conteúdo dos Slides:**
   ```javascript
   // Editar o array de slides para modificar títulos, descrições ou adicionar novos slides
   const slides = [
     {
       id: '1',
       title: 'Bem-vindo ao Quantza',
       description: 'O aplicativo de mobilidade que revoluciona sua experiência de transporte.',
       image: require('../../assets/onboarding/welcome.png'),
     },
     // Adicionar ou modificar slides aqui
   ];
   ```

2. **Substituir Imagens Placeholder:**
   Criar e adicionar as imagens reais em:
   - `frontend/src/assets/onboarding/welcome.png`
   - `frontend/src/assets/onboarding/services.png`
   - `frontend/src/assets/onboarding/points.png`
   - `frontend/src/assets/onboarding/donations.png`
   - `frontend/src/assets/onboarding/wallet.png`

3. **Ajustar Navegação Após Onboarding:**
   ```javascript
   // Modificar para navegar para a tela desejada após o onboarding
   navigation.replace('Login'); // Substituir 'Login' pela tela desejada
   ```

4. **Personalizar Animações:**
   ```javascript
   // Ajustar os valores de interpolação para modificar as animações
   const scale = interpolate(
     scrollX.value,
     inputRange,
     [0.8, 1, 0.8], // Valores de escala [anterior, atual, próximo]
     Extrapolate.CLAMP
   );
   ```

**Mensagem de Commit:**
"feat(onboarding): Implementa telas de onboarding com slides animados e navegação intuitiva"

## 3. Atualização da Navegação

**Pendente:** Atualizar o arquivo de navegação principal para incluir as novas telas de Splash e Onboarding no fluxo de navegação.

**Próximos Passos:**
1. Identificar o arquivo de navegação principal (provavelmente em `frontend/src/navigation/`)
2. Adicionar as novas telas ao stack de navegação
3. Implementar lógica para exibir onboarding apenas na primeira execução

**Mensagem de Commit Futura:**
"feat(navigation): Integra SplashScreen e OnboardingScreen ao fluxo de navegação"

## 4. Refinamento do Switcher de Perfil

**Pendente:** Aprimorar o componente `ProfileSwitcher.tsx` para melhorar a transição entre perfis de usuário e parceiro.

**Próximos Passos:**
1. Identificar o componente atual em `frontend/src/components/ProfileSwitcher.tsx`
2. Implementar animações de transição
3. Melhorar o visual diferenciado para cada perfil

**Mensagem de Commit Futura:**
"feat(profile): Aprimora o switcher de perfil com animações e visual diferenciado"

## Considerações Gerais

- As implementações seguem a identidade visual do Quantza (azul escuro, dourado, branco)
- Todas as telas incluem `testID` para facilitar testes E2E com Detox
- As animações são otimizadas com `useNativeDriver: true` quando possível
- Os componentes são documentados com JSDoc para facilitar a manutenção

## Próximas Implementações na Fase 1

1. Atualização do arquivo de navegação
2. Refinamento do switcher de perfil
3. Criação de assets necessários (logo, raio, imagens de onboarding)
4. Testes de integração das novas telas no fluxo do aplicativo
