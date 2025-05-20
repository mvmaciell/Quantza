# Documentação de Implementação - Tela de Configuração de Autenticação de Dois Fatores

## Visão Geral

Este documento registra a implementação da tela de configuração de autenticação de dois fatores (2FA) para o aplicativo Quantza 2.0, parte da Fase 2.1 do roadmap de segurança. Esta tela permite que os usuários configurem diferentes métodos de autenticação de dois fatores, aumentando a segurança de suas contas.

## Funcionalidades Implementadas

### 1. Interface de Configuração de 2FA

**Implementação:**
- Criação da tela `TwoFactorSetupScreen` para gerenciamento de métodos de 2FA
- Interface visual alinhada à identidade do Quantza (azul escuro, dourado, branco)
- Suporte a múltiplos métodos de autenticação:
  - SMS
  - E-mail
  - Aplicativo autenticador
  - Biometria (impressão digital, Face ID)

### 2. Gerenciamento de Métodos

**Funcionalidades:**
- Ativação/desativação de cada método via switches
- Visualização do status atual de cada método
- Feedback visual durante ativação/desativação
- Tratamento de erros e estados de carregamento

### 3. Fluxo de Usuário

**Implementação:**
- Carregamento inicial das configurações do usuário
- Toggles para ativar/desativar métodos
- Botão de configuração para métodos que requerem setup adicional
- Navegação para telas específicas de configuração (ex: aplicativo autenticador)
- Feedback via alertas para confirmação de ações

### 4. Elementos de UI/UX

**Componentes:**
- Cabeçalho com botão de voltar
- Seção informativa sobre a importância da 2FA
- Lista de métodos disponíveis com ícones e descrições
- Switches para ativação/desativação
- Seção de recomendações de segurança
- Indicadores de carregamento e tratamento de erros

## Detalhes Técnicos

### Componentes React Native:
- `SafeAreaView` e `StatusBar` para compatibilidade com diferentes dispositivos
- `ScrollView` para conteúdo extenso
- `Switch` para toggles de ativação/desativação
- `ActivityIndicator` para estados de carregamento
- `TouchableOpacity` para elementos interativos
- `Ionicons` para ícones consistentes

### Estados Gerenciados:
- Estado de cada método de autenticação (ativado/desativado)
- Estado de carregamento durante operações assíncronas
- Estado de erro para tratamento de falhas
- Dados do usuário (telefone, e-mail) para exibição contextual

### Simulações Implementadas:
- Carregamento inicial de configurações do usuário
- Ativação/desativação de métodos de autenticação
- Feedback de sucesso/erro

## Como Ajustar

### 1. Integrar com API Real:
```javascript
// Substituir simulações por chamadas reais à API
const loadUserSettings = async () => {
  setLoading(true);
  try {
    // Substituir simulação por chamada real
    const response = await authService.get2FASettings();
    
    // Atualizar estados com dados reais
    setPhoneNumber(response.phoneNumber);
    setEmail(response.email);
    setSmsEnabled(response.methods.sms);
    setEmailEnabled(response.methods.email);
    setAuthenticatorEnabled(response.methods.authenticator);
    setBiometricEnabled(response.methods.biometric);
    setLoading(false);
  } catch (err) {
    setError('Não foi possível carregar suas configurações de segurança.');
    setLoading(false);
  }
};
```

### 2. Personalizar Estilos:
```javascript
// Para modificar cores e estilos:
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  // Modificar ou adicionar cores aqui
};

// Para ajustar estilos de componentes específicos:
const styles = StyleSheet.create({
  methodItem: {
    // Modificar estilos aqui
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  // Outros estilos...
});
```

### 3. Adicionar Novos Métodos de Autenticação:
```javascript
// Para adicionar um novo método de autenticação:
// 1. Adicionar novo estado
const [newMethodEnabled, setNewMethodEnabled] = useState(false);

// 2. Adicionar função de toggle
const toggleNewMethod = async (value) => {
  setLoading(true);
  try {
    // Lógica de ativação/desativação
    setNewMethodEnabled(value);
    setLoading(false);
    Alert.alert(
      value ? 'Método Ativado' : 'Método Desativado',
      value ? 'Novo método ativado com sucesso.' : 'Novo método desativado com sucesso.',
      [{ text: 'OK' }]
    );
  } catch (err) {
    setError('Não foi possível alterar as configurações.');
    setLoading(false);
  }
};

// 3. Adicionar renderização do método
{renderMethodItem(
  'Novo Método',
  'Descrição do novo método de autenticação',
  'icon-name',
  newMethodEnabled,
  toggleNewMethod
)}
```

## Próximos Passos

1. Implementar a tela de configuração do aplicativo autenticador (AuthenticatorSetupScreen)
2. Integrar com Firebase Authentication ou Auth0 para autenticação real
3. Implementar a lógica de verificação biométrica nativa
4. Criar tela de verificação durante o login (TwoFactorVerifyScreen)
5. Implementar testes automatizados para os fluxos de 2FA

## Mensagem de Commit

"feat(auth): Implementa tela de configuração de autenticação de dois fatores"
