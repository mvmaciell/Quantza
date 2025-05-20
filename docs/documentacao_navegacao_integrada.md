# Documentação de Alterações - Integração de Navegação

## Visão Geral

Este documento registra as alterações realizadas na estrutura de navegação do aplicativo Quantza 2.0, parte da Fase 1 do roadmap de implementação. A navegação foi completamente estruturada para integrar as novas telas de Splash, Onboarding e o ProfileSwitcher aprimorado, além de organizar o fluxo de navegação para os diferentes perfis de usuário.

## Alterações Realizadas

### 1. Estrutura de Navegação Completa

**Implementação:**
- Criação do arquivo principal de navegação (`/frontend/src/navigation/index.tsx`)
- Estruturação hierárquica de navegadores para diferentes contextos
- Integração das novas telas de Splash e Onboarding no fluxo inicial
- Incorporação do ProfileSwitcher aprimorado como componente de alternância entre perfis

### 2. Navegadores Específicos

**Navegadores Implementados:**
- `OnboardingNavigator`: Gerencia o fluxo de Splash e Onboarding inicial
- `AuthNavigator`: Controla o fluxo de autenticação (login, cadastro, verificação)
- `UserTabNavigator`: Navegação em abas para o perfil de usuário/passageiro
- `PartnerTabNavigator`: Navegação em abas para o perfil de parceiro/motorista
- `UserStackNavigator`: Fluxo de telas para solicitação e acompanhamento de corridas
- `PartnerStackNavigator`: Fluxo de telas para aceitação e execução de corridas
- `AppNavigator`: Alterna entre os navegadores de usuário e parceiro com base no perfil ativo
- `RootNavigator`: Controla o fluxo principal do aplicativo (onboarding, autenticação, app)

### 3. Integração com Identidade Visual

**Personalização:**
- Aplicação das cores da identidade visual Quantza em toda a navegação
- Ícones personalizados para as abas de navegação
- Estilos consistentes para cabeçalhos e barras de navegação
- Transições fluidas entre telas e navegadores

### 4. Lógica de Navegação Condicional

**Funcionalidades:**
- Verificação de primeira execução para exibição do Onboarding
- Verificação de autenticação para direcionamento ao fluxo correto
- Alternância dinâmica entre perfis de usuário e parceiro
- Tipagem completa para navegação segura e autocompletamento

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `@react-navigation/native`: Base da navegação React Navigation
- `@react-navigation/stack`: Navegação em pilha para fluxos sequenciais
- `@react-navigation/bottom-tabs`: Navegação em abas para seções principais
- `Ionicons`: Ícones para as abas de navegação

### Estrutura de Tipos:
- Tipos definidos para cada navegador, garantindo segurança de tipos
- Parâmetros de rota tipados para passagem segura de dados entre telas

### Integração com ProfileSwitcher:
- O ProfileSwitcher é renderizado como componente fixo no AppNavigator
- A alternância entre perfis controla qual navegador é exibido (UserStack ou PartnerStack)

## Como Ajustar

### 1. Modificar Fluxo de Onboarding:
```javascript
// Para desativar o Onboarding após a primeira execução:
// Em RootNavigator, modifique a lógica de verificação
React.useEffect(() => {
  // Verificar se é primeira execução usando AsyncStorage
  const checkFirstLaunch = async () => {
    try {
      const value = await AsyncStorage.getItem('alreadyLaunched');
      if (value === null) {
        // Primeira execução
        await AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        // Não é primeira execução
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };
  
  checkFirstLaunch();
}, []);
```

### 2. Adicionar Novas Telas:
```javascript
// Para adicionar uma nova tela ao fluxo do usuário:
// 1. Importe a tela
import NewScreen from '../screens/AppScreens/NewScreen';

// 2. Adicione o tipo ao UserStackParamList
type UserStackParamList = {
  // ... tipos existentes
  NewScreenRoute: { param1: string }; // Adicione os parâmetros necessários
};

// 3. Adicione a tela ao UserStackNavigator
const UserStackNavigator = () => {
  return (
    <UserStack.Navigator>
      {/* ... telas existentes */}
      <UserStack.Screen name="NewScreenRoute" component={NewScreen} />
    </UserStack.Navigator>
  );
};
```

### 3. Personalizar Estilos de Navegação:
```javascript
// Para modificar as cores e estilos da navegação:
// Altere as constantes de cores no início do arquivo
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  // Modifique ou adicione cores aqui
};

// Para personalizar o estilo das abas:
<UserTab.Navigator
  screenOptions={{
    // ... outras opções
    tabBarStyle: {
      backgroundColor: COLORS.background,
      borderTopColor: COLORS.secondary,
      height: 60, // Ajuste a altura
      paddingBottom: 5, // Ajuste o padding
    },
    tabBarLabelStyle: {
      fontSize: 12, // Ajuste o tamanho da fonte
      fontWeight: 'bold', // Ajuste o peso da fonte
    },
  }}
>
```

### 4. Implementar Lógica Real de Autenticação:
```javascript
// Para implementar verificação real de autenticação:
React.useEffect(() => {
  // Verificar se o usuário está autenticado
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Verificar validade do token com o backend
        const isValid = await authService.validateToken(token);
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  };
  
  checkAuth();
}, []);
```

## Próximos Passos

1. Implementar a lógica real de verificação de primeira execução (AsyncStorage)
2. Implementar a lógica real de verificação de autenticação
3. Conectar o ProfileSwitcher à lógica real de alternância de perfil
4. Adicionar animações de transição entre telas
5. Implementar tratamento de deep links para notificações

## Mensagem de Commit

"feat(navigation): Implementa estrutura de navegação completa com integração de novas telas"
