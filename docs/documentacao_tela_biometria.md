# Documentação de Implementação - Tela de Autenticação Biométrica

## Visão Geral

Este documento registra a implementação da tela de autenticação biométrica para o aplicativo Quantza 2.0, parte da Fase 2.1 do roadmap de segurança. Esta tela permite que os usuários configurem e gerenciem a autenticação biométrica (impressão digital, Face ID) para acesso rápido e seguro ao aplicativo.

## Funcionalidades Implementadas

### 1. Detecção de Biometria Disponível

**Implementação:**
- Verificação automática da disponibilidade de hardware biométrico no dispositivo
- Detecção do tipo de biometria disponível (impressão digital, reconhecimento facial)
- Verificação se o usuário tem biometria cadastrada no dispositivo
- Adaptação da interface com base no tipo de biometria disponível

### 2. Ativação/Desativação de Biometria

**Funcionalidades:**
- Toggle para ativar/desativar autenticação biométrica
- Verificação biométrica antes da ativação para confirmar identidade
- Feedback visual durante o processo de ativação/desativação
- Tratamento de erros e estados de carregamento

### 3. Teste de Biometria

**Implementação:**
- Botão para testar a autenticação biométrica configurada
- Feedback imediato sobre o sucesso ou falha do teste
- Interface adaptativa que só exibe o botão de teste quando a biometria está ativada

### 4. Elementos de UI/UX

**Componentes:**
- Cabeçalho com botão de voltar
- Ícones contextuais baseados no tipo de biometria disponível
- Toggle para ativação/desativação
- Botão de teste com feedback visual
- Seção de informações de segurança
- Tratamento de estados de indisponibilidade e erro

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `expo-local-authentication`: Para interação com APIs nativas de biometria
- `react-native`: Componentes de interface do usuário
- `Ionicons`: Para ícones contextuais

### Estados Gerenciados:
- Disponibilidade de biometria no dispositivo
- Tipo de biometria disponível (impressão digital, reconhecimento facial)
- Estado de ativação da biometria
- Estados de carregamento e erro

### Fluxos Implementados:
- Verificação inicial de disponibilidade
- Ativação com confirmação biométrica
- Desativação simples
- Teste de funcionamento

## Como Ajustar

### 1. Integrar com API Real:
```javascript
// Substituir simulações por chamadas reais à API
useEffect(() => {
  const checkBiometricAvailability = async () => {
    try {
      // Código de verificação de hardware permanece o mesmo
      
      // Substituir simulação por chamada real
      const response = await authService.getBiometricSettings();
      setBiometricEnabled(response.enabled);
      setLoading(false);
    } catch (err) {
      setError('Não foi possível verificar a disponibilidade de biometria.');
      setBiometricAvailable(false);
      setLoading(false);
    }
  };
  
  checkBiometricAvailability();
}, []);
```

### 2. Personalizar Mensagens:
```javascript
// Para modificar as mensagens de prompt biométrico:
const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Mensagem personalizada aqui',
  cancelLabel: 'Texto personalizado para cancelar',
  disableDeviceFallback: true, // ou false para permitir fallback para senha
});
```

### 3. Adicionar Opções Avançadas:
```javascript
// Para adicionar opções avançadas de biometria:
<View style={styles.settingContainer}>
  <View style={styles.settingTextContainer}>
    <Text style={styles.settingTitle}>Exigir após inatividade</Text>
    <Text style={styles.settingDescription}>
      Solicitar biometria novamente após 5 minutos de inatividade.
    </Text>
  </View>
  <Switch
    trackColor={{ false: "#767577", true: COLORS.primary }}
    thumbColor={requireAfterInactivity ? COLORS.white : "#f4f3f4"}
    ios_backgroundColor="#3e3e3e"
    onValueChange={toggleRequireAfterInactivity}
    value={requireAfterInactivity}
    disabled={loading || !biometricAvailable || !biometricEnabled}
    testID="inactivitySwitch"
  />
</View>
```

## Próximos Passos

1. Implementar a integração com o backend para armazenar preferências de biometria
2. Criar fluxo de login biométrico na tela inicial
3. Implementar verificação biométrica para operações sensíveis (pagamentos, alterações de perfil)
4. Adicionar opções avançadas (tempo de inatividade, níveis de segurança)
5. Implementar testes automatizados para os fluxos biométricos

## Mensagem de Commit

"feat(auth): Implementa tela de configuração de autenticação biométrica"
