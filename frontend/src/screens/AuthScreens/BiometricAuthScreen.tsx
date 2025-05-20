import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

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
 * BiometricAuthScreen - Tela para configuração de autenticação biométrica
 * 
 * Esta tela permite ao usuário configurar e gerenciar a autenticação biométrica
 * (impressão digital, Face ID) para acesso rápido e seguro ao aplicativo.
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @param {Object} route - Objeto de rota com parâmetros
 */
const BiometricAuthScreen = ({ navigation, route }) => {
  // Estados para controlar a autenticação biométrica
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Efeito para verificar a disponibilidade de biometria no dispositivo
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        // Verificar se o dispositivo suporta biometria
        const compatible = await LocalAuthentication.hasHardwareAsync();
        
        if (!compatible) {
          setBiometricAvailable(false);
          setError('Seu dispositivo não suporta autenticação biométrica.');
          setLoading(false);
          return;
        }
        
        // Verificar se o usuário tem biometria cadastrada no dispositivo
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (!enrolled) {
          setBiometricAvailable(false);
          setError('Você não tem biometria cadastrada neste dispositivo. Configure nas configurações do sistema.');
          setLoading(false);
          return;
        }
        
        // Obter o tipo de biometria disponível
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        // Determinar o tipo de biometria
        let type = 'biometria';
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          type = Platform.OS === 'ios' ? 'Face ID' : 'Reconhecimento Facial';
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          type = Platform.OS === 'ios' ? 'Touch ID' : 'Impressão Digital';
        }
        
        setBiometricType(type);
        setBiometricAvailable(true);
        
        // Verificar se a biometria já está ativada
        // Aqui seria uma chamada à API para obter as configurações atuais
        // const response = await authService.getBiometricSettings();
        
        // Simulação de dados
        setTimeout(() => {
          setBiometricEnabled(false);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Não foi possível verificar a disponibilidade de biometria.');
        setBiometricAvailable(false);
        setLoading(false);
      }
    };
    
    checkBiometricAvailability();
  }, []);
  
  // Função para alternar a autenticação biométrica
  const toggleBiometricAuth = async (value) => {
    if (!biometricAvailable) return;
    
    setLoading(true);
    try {
      if (value) {
        // Autenticar o usuário antes de ativar a biometria
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Confirme sua identidade usando ${biometricType}`,
          cancelLabel: 'Cancelar',
          disableDeviceFallback: true,
        });
        
        if (result.success) {
          // Aqui seria uma chamada à API para ativar a biometria
          // const response = await authService.enableBiometricAuth();
          
          // Simulação de sucesso
          setTimeout(() => {
            setBiometricEnabled(true);
            setLoading(false);
            Alert.alert(
              'Biometria Ativada',
              `Você poderá usar ${biometricType} para acessar o aplicativo.`,
              [{ text: 'OK' }]
            );
          }, 1000);
        } else {
          setLoading(false);
          Alert.alert(
            'Verificação Cancelada',
            'A verificação biométrica foi cancelada.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Aqui seria uma chamada à API para desativar a biometria
        // const response = await authService.disableBiometricAuth();
        
        // Simulação de sucesso
        setTimeout(() => {
          setBiometricEnabled(false);
          setLoading(false);
          Alert.alert(
            'Biometria Desativada',
            `Você não poderá mais usar ${biometricType} para acessar o aplicativo.`,
            [{ text: 'OK' }]
          );
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
      setError(`Não foi possível ${value ? 'ativar' : 'desativar'} a autenticação biométrica.`);
    }
  };
  
  // Função para testar a autenticação biométrica
  const testBiometricAuth = async () => {
    if (!biometricAvailable || !biometricEnabled) return;
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Teste de ${biometricType}`,
        cancelLabel: 'Cancelar',
        disableDeviceFallback: true,
      });
      
      if (result.success) {
        Alert.alert(
          'Teste Bem-sucedido',
          `${biometricType} funcionando corretamente!`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Teste Cancelado',
          'O teste biométrico foi cancelado.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      setError('Não foi possível realizar o teste biométrico.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container} testID="biometricAuthScreen">
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            testID="backButton"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Autenticação Biométrica</Text>
        </View>
        
        {/* Conteúdo principal */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Verificando disponibilidade...</Text>
          </View>
        ) : error && !biometricAvailable ? (
          <View style={styles.errorContainer}>
            <Ionicons name="finger-print-outline" size={64} color={COLORS.error} />
            <Text style={styles.errorTitle}>Biometria Indisponível</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {
                // Aqui poderia abrir as configurações do sistema
                Alert.alert(
                  'Configurações do Sistema',
                  'Você será redirecionado para as configurações do sistema para configurar sua biometria.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Ir para Configurações', onPress: () => {
                      // Código para abrir configurações do sistema
                    }}
                  ]
                );
              }}
              testID="settingsButton"
            >
              <Text style={styles.settingsButtonText}>Abrir Configurações do Sistema</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            {/* Informações sobre biometria */}
            <View style={styles.infoContainer}>
              <Ionicons 
                name={
                  biometricType?.toLowerCase().includes('face') 
                    ? 'scan-outline' 
                    : 'finger-print-outline'
                } 
                size={64} 
                color={COLORS.primary} 
              />
              <Text style={styles.infoTitle}>
                {biometricType} Disponível
              </Text>
              <Text style={styles.infoText}>
                A autenticação biométrica permite acesso rápido e seguro ao aplicativo
                sem a necessidade de digitar sua senha a cada login.
              </Text>
            </View>
            
            {/* Toggle de ativação */}
            <View style={styles.settingContainer}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Ativar {biometricType}</Text>
                <Text style={styles.settingDescription}>
                  Use {biometricType} para fazer login no aplicativo Quantza.
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: COLORS.primary }}
                thumbColor={biometricEnabled ? COLORS.white : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleBiometricAuth}
                value={biometricEnabled}
                disabled={loading || !biometricAvailable}
                testID="biometricSwitch"
              />
            </View>
            
            {/* Botão de teste */}
            {biometricEnabled && (
              <TouchableOpacity
                style={styles.testButton}
                onPress={testBiometricAuth}
                disabled={loading || !biometricAvailable || !biometricEnabled}
                testID="testButton"
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.background} />
                <Text style={styles.testButtonText}>Testar {biometricType}</Text>
              </TouchableOpacity>
            )}
            
            {/* Informações de segurança */}
            <View style={styles.securityInfoContainer}>
              <Text style={styles.securityInfoTitle}>Informações de Segurança</Text>
              
              <View style={styles.securityItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
                <View style={styles.securityItemContent}>
                  <Text style={styles.securityItemTitle}>Dados Biométricos Seguros</Text>
                  <Text style={styles.securityItemText}>
                    Seus dados biométricos nunca saem do seu dispositivo. O Quantza
                    utiliza apenas tokens de autenticação seguros.
                  </Text>
                </View>
              </View>
              
              <View style={styles.securityItem}>
                <Ionicons name="lock-closed-outline" size={24} color={COLORS.primary} />
                <View style={styles.securityItemContent}>
                  <Text style={styles.securityItemTitle}>Proteção Adicional</Text>
                  <Text style={styles.securityItemText}>
                    Mesmo com biometria ativada, sua senha ainda será solicitada
                    periodicamente para operações sensíveis.
                  </Text>
                </View>
              </View>
              
              <View style={styles.securityItem}>
                <Ionicons name="alert-circle-outline" size={24} color={COLORS.primary} />
                <View style={styles.securityItemContent}>
                  <Text style={styles.securityItemTitle}>Atenção</Text>
                  <Text style={styles.securityItemText}>
                    Se você adicionar ou remover dados biométricos no seu dispositivo,
                    será necessário reconfigurar a autenticação biométrica no Quantza.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
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
  scrollView: {
    flex: 1,
  },
  infoContainer: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: 24,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
    marginLeft: 8,
  },
  securityInfoContainer: {
    padding: 24,
  },
  securityInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  securityItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  securityItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  securityItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  securityItemText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});

export default BiometricAuthScreen;
