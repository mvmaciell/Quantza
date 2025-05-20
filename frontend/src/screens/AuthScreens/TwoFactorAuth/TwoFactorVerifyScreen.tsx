import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constantes de cores da identidade visual Quantza
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  white: '#FFFFFF',      // Branco (textos e elementos)
  secondary: '#1E2A3A',  // Azul escuro secundário
  success: '#4CAF50',    // Verde para sucesso
  error: '#F44336',      // Vermelho para erro
  warning: '#FF9800',    // Laranja para avisos
};

/**
 * TwoFactorVerifyScreen - Tela para verificação de autenticação de dois fatores
 * 
 * Esta tela é exibida durante o processo de login quando o usuário tem 2FA ativado.
 * Permite a inserção do código recebido por SMS, e-mail ou aplicativo autenticador.
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @param {Object} route - Objeto de rota com parâmetros
 */
const TwoFactorVerifyScreen = ({ navigation, route }) => {
  // Parâmetros da rota
  const { method = 'sms', phoneNumber, email } = route.params || {};
  
  // Estados para controlar o código e o processo de verificação
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // Referências para os inputs de código
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  
  // Efeito para iniciar o countdown para reenvio
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);
  
  // Função para lidar com a mudança de dígito do código
  const handleCodeChange = (text, index) => {
    // Validar entrada (apenas números)
    if (text && !/^\d+$/.test(text)) return;
    
    // Atualizar o código
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Limpar erro ao digitar
    if (error) setError(null);
    
    // Avançar para o próximo input se houver texto
    if (text && index < 5) {
      inputRefs[index + 1].current.focus();
    }
    
    // Verificar automaticamente se todos os dígitos foram preenchidos
    if (text && index === 5) {
      const fullCode = [...newCode].join('');
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };
  
  // Função para lidar com a tecla de apagar
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  // Função para verificar o código
  const verifyCode = async (fullCode = code.join('')) => {
    if (fullCode.length !== 6) {
      setError('Por favor, insira o código completo de 6 dígitos.');
      return;
    }
    
    setLoading(true);
    try {
      // Aqui seria uma chamada à API para verificar o código
      // const response = await authService.verify2FACode(fullCode, method);
      
      // Simulação de verificação
      setTimeout(() => {
        // Simulação de sucesso (código 123456)
        if (fullCode === '123456') {
          setLoading(false);
          // Navegar para a tela principal após verificação bem-sucedida
          navigation.replace('Main');
        } else {
          // Simulação de erro
          setLoading(false);
          setError('Código inválido. Por favor, tente novamente.');
        }
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Ocorreu um erro ao verificar o código. Por favor, tente novamente.');
    }
  };
  
  // Função para reenviar o código
  const resendCode = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      // Aqui seria uma chamada à API para reenviar o código
      // const response = await authService.resend2FACode(method);
      
      // Simulação de reenvio
      setTimeout(() => {
        setLoading(false);
        setCountdown(30);
        setCanResend(false);
        Alert.alert(
          'Código Reenviado',
          method === 'email'
            ? `Um novo código foi enviado para ${email}.`
            : `Um novo código foi enviado para ${phoneNumber}.`,
          [{ text: 'OK' }]
        );
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Não foi possível reenviar o código. Por favor, tente novamente mais tarde.');
    }
  };
  
  // Função para mudar o método de verificação
  const changeMethod = () => {
    navigation.replace('TwoFactorMethod');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        testID="twoFactorVerifyScreen"
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            testID="backButton"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verificação de Segurança</Text>
        </View>
        
        {/* Conteúdo principal */}
        <View style={styles.content}>
          {/* Ícone e título */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name={method === 'email' ? 'mail' : method === 'authenticator' ? 'apps' : 'phone-portrait'} 
              size={48} 
              color={COLORS.primary} 
            />
          </View>
          <Text style={styles.title}>Verificação de Dois Fatores</Text>
          
          {/* Mensagem de instrução */}
          <Text style={styles.instruction}>
            {method === 'email'
              ? `Insira o código de 6 dígitos enviado para ${email}.`
              : method === 'authenticator'
                ? 'Insira o código de 6 dígitos do seu aplicativo autenticador.'
                : `Insira o código de 6 dígitos enviado para ${phoneNumber}.`}
          </Text>
          
          {/* Campos de entrada do código */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={`code-${index}`}
                ref={inputRefs[index]}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                testID={`codeInput-${index}`}
              />
            ))}
          </View>
          
          {/* Mensagem de erro */}
          {error && (
            <Text style={styles.errorText} testID="errorText">
              {error}
            </Text>
          )}
          
          {/* Botão de verificação */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (loading || code.join('').length !== 6) && styles.disabledButton
            ]}
            onPress={() => verifyCode()}
            disabled={loading || code.join('').length !== 6}
            testID="verifyButton"
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verificar</Text>
            )}
          </TouchableOpacity>
          
          {/* Opções adicionais */}
          <View style={styles.optionsContainer}>
            {/* Reenviar código */}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={resendCode}
              disabled={!canResend || loading}
              testID="resendButton"
            >
              <Text style={[
                styles.optionText,
                (!canResend || loading) && styles.disabledText
              ]}>
                {canResend 
                  ? 'Reenviar código' 
                  : `Reenviar em ${countdown}s`}
              </Text>
            </TouchableOpacity>
            
            {/* Mudar método */}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={changeMethod}
              disabled={loading}
              testID="changeMethodButton"
            >
              <Text style={[
                styles.optionText,
                loading && styles.disabledText
              ]}>
                Usar outro método
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Ajuda */}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => navigation.navigate('Help', { screen: '2FAHelp' })}
          testID="helpButton"
        >
          <Ionicons name="help-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.helpText}>Precisa de ajuda?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 160, 23, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  codeInput: {
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
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  disabledButton: {
    backgroundColor: 'rgba(212, 160, 23, 0.5)',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionButton: {
    padding: 8,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 8,
  },
});

export default TwoFactorVerifyScreen;
