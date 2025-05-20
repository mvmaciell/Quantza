# Documentação de Implementação - Tela de Verificação de Autenticação de Dois Fatores

## Visão Geral

Este documento registra a implementação da tela de verificação de autenticação de dois fatores (2FA) para o aplicativo Quantza 2.0, parte da Fase 2.1 do roadmap de segurança. Esta tela é exibida durante o processo de login quando o usuário tem 2FA ativado, permitindo a inserção do código recebido por SMS, e-mail ou aplicativo autenticador.

## Funcionalidades Implementadas

### 1. Interface de Verificação de Código

**Implementação:**
- Criação da tela `TwoFactorVerifyScreen` para verificação de códigos 2FA
- Interface visual alinhada à identidade do Quantza (azul escuro, dourado, branco)
- Suporte a múltiplos métodos de verificação:
  - SMS
  - E-mail
  - Aplicativo autenticador

### 2. Entrada de Código Otimizada

**Funcionalidades:**
- Campo de entrada de código de 6 dígitos com foco automático
- Navegação automática entre campos ao digitar
- Validação em tempo real do código inserido
- Verificação automática ao completar os 6 dígitos
- Suporte a backspace para navegação reversa entre campos

### 3. Fluxo de Usuário

**Implementação:**
- Exibição contextual baseada no método de verificação selecionado
- Contador regressivo para reenvio de código
- Opção para mudar o método de verificação
- Feedback visual durante verificação
- Tratamento de erros com mensagens claras

### 4. Elementos de UI/UX

**Componentes:**
- Cabeçalho com botão de voltar
- Ícone contextual baseado no método de verificação
- Campos de entrada de código estilizados
- Botão de verificação com estados de carregamento e desabilitado
- Opções de reenvio de código e mudança de método
- Botão de ajuda para suporte ao usuário

## Detalhes Técnicos

### Componentes React Native:
- `SafeAreaView` e `StatusBar` para compatibilidade com diferentes dispositivos
- `KeyboardAvoidingView` para ajuste automático quando o teclado está visível
- `TextInput` para entrada de código com foco automático
- `ActivityIndicator` para estados de carregamento
- `TouchableOpacity` para elementos interativos
- `Ionicons` para ícones contextuais

### Estados Gerenciados:
- Código de verificação (array de 6 dígitos)
- Estado de carregamento durante operações assíncronas
- Estado de erro para tratamento de falhas
- Contador regressivo para reenvio de código
- Estado de habilitação para reenvio

### Simulações Implementadas:
- Verificação de código (sucesso para "123456", erro para outros)
- Reenvio de código com contador regressivo
- Feedback de sucesso/erro

## Como Ajustar

### 1. Integrar com API Real:
```javascript
// Substituir simulações por chamadas reais à API
const verifyCode = async (fullCode = code.join('')) => {
  if (fullCode.length !== 6) {
    setError('Por favor, insira o código completo de 6 dígitos.');
    return;
  }
  
  setLoading(true);
  try {
    // Substituir simulação por chamada real
    const response = await authService.verify2FACode(fullCode, method);
    
    if (response.success) {
      // Navegar para a tela principal após verificação bem-sucedida
      navigation.replace('Main');
    } else {
      setError(response.message || 'Código inválido. Por favor, tente novamente.');
    }
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setError('Ocorreu um erro ao verificar o código. Por favor, tente novamente.');
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

// Para ajustar estilos dos campos de código:
const styles = StyleSheet.create({
  codeInput: {
    // Modificar estilos aqui
    width: 45,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.5)',
  },
  // Outros estilos...
});
```

### 3. Adicionar Novos Métodos de Verificação:
```javascript
// Para adicionar um novo método de verificação:
// 1. Atualizar a lógica condicional para exibição de mensagens
<Text style={styles.instruction}>
  {method === 'email'
    ? `Insira o código de 6 dígitos enviado para ${email}.`
    : method === 'authenticator'
      ? 'Insira o código de 6 dígitos do seu aplicativo autenticador.'
      : method === 'novo_metodo'
        ? 'Mensagem específica para o novo método.'
        : `Insira o código de 6 dígitos enviado para ${phoneNumber}.`}
</Text>

// 2. Atualizar o ícone contextual
<Ionicons 
  name={
    method === 'email' 
      ? 'mail' 
      : method === 'authenticator' 
        ? 'apps' 
        : method === 'novo_metodo'
          ? 'icon-para-novo-metodo'
          : 'phone-portrait'
  } 
  size={48} 
  color={COLORS.primary} 
/>
```

## Próximos Passos

1. Implementar a tela de seleção de método de verificação (TwoFactorMethodScreen)
2. Integrar com Firebase Authentication ou Auth0 para verificação real de códigos
3. Implementar armazenamento seguro de tokens de autenticação
4. Criar tela de ajuda para suporte ao usuário (2FAHelpScreen)
5. Implementar testes automatizados para os fluxos de verificação

## Mensagem de Commit

"feat(auth): Implementa tela de verificação de código para autenticação de dois fatores"
