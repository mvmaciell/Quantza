import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
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
 * TwoFactorSetupScreen - Tela para configuração de autenticação de dois fatores
 * 
 * Esta tela permite ao usuário configurar diferentes métodos de autenticação de dois fatores,
 * como SMS, e-mail ou aplicativo autenticador.
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @param {Object} route - Objeto de rota com parâmetros
 */
const TwoFactorSetupScreen = ({ navigation, route }) => {
  // Estados para controlar os métodos de 2FA
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [authenticatorEnabled, setAuthenticatorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  // Estados para controlar o carregamento e erros
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para armazenar informações do usuário
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  
  // Efeito para carregar as configurações atuais do usuário
  useEffect(() => {
    const loadUserSettings = async () => {
      setLoading(true);
      try {
        // Aqui seria uma chamada à API para obter as configurações atuais
        // const response = await authService.get2FASettings();
        
        // Simulação de dados
        setTimeout(() => {
          setPhoneNumber('+55 (11) 98765-4321');
          setEmail('usuario@exemplo.com');
          setSmsEnabled(false);
          setEmailEnabled(true);
          setAuthenticatorEnabled(false);
          setBiometricEnabled(true);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Não foi possível carregar suas configurações de segurança.');
        setLoading(false);
      }
    };
    
    loadUserSettings();
  }, []);
  
  // Função para alternar o método SMS
  const toggleSmsMethod = async (value) => {
    setLoading(true);
    try {
      if (value) {
        // Aqui seria uma chamada à API para verificar o número de telefone
        // const response = await authService.verifySmsMethod(phoneNumber);
        
        // Simulação de sucesso
        setTimeout(() => {
          setSmsEnabled(true);
          setLoading(false);
          Alert.alert(
            'SMS Ativado',
            'Você receberá um código por SMS para verificação ao fazer login.',
            [{ text: 'OK' }]
          );
        }, 1000);
      } else {
        // Aqui seria uma chamada à API para desativar o método SMS
        // const response = await authService.disableSmsMethod();
        
        // Simulação de sucesso
        setTimeout(() => {
          setSmsEnabled(false);
          setLoading(false);
          Alert.alert(
            'SMS Desativado',
            'Você não receberá mais códigos por SMS para verificação.',
            [{ text: 'OK' }]
          );
        }, 1000);
      }
    } catch (err) {
      setError('Não foi possível alterar as configurações de SMS.');
      setLoading(false);
    }
  };
  
  // Função para alternar o método de e-mail
  const toggleEmailMethod = async (value) => {
    setLoading(true);
    try {
      if (value) {
        // Aqui seria uma chamada à API para verificar o e-mail
        // const response = await authService.verifyEmailMethod(email);
        
        // Simulação de sucesso
        setTimeout(() => {
          setEmailEnabled(true);
          setLoading(false);
          Alert.alert(
            'E-mail Ativado',
            'Você receberá um código por e-mail para verificação ao fazer login.',
            [{ text: 'OK' }]
          );
        }, 1000);
      } else {
        // Aqui seria uma chamada à API para desativar o método de e-mail
        // const response = await authService.disableEmailMethod();
        
        // Simulação de sucesso
        setTimeout(() => {
          setEmailEnabled(false);
          setLoading(false);
          Alert.alert(
            'E-mail Desativado',
            'Você não receberá mais códigos por e-mail para verificação.',
            [{ text: 'OK' }]
          );
        }, 1000);
      }
    } catch (err) {
      setError('Não foi possível alterar as configurações de e-mail.');
      setLoading(false);
    }
  };
  
  // Função para configurar o aplicativo autenticador
  const setupAuthenticator = () => {
    navigation.navigate('AuthenticatorSetup');
  };
  
  // Função para alternar o método biométrico
  const toggleBiometricMethod = async (value) => {
    setLoading(true);
    try {
      if (value) {
        // Aqui seria uma chamada para verificar se o dispositivo suporta biometria
        // const isBiometricAvailable = await authService.checkBiometricAvailability();
        
        // Simulação de sucesso
        setTimeout(() => {
          setBiometricEnabled(true);
          setLoading(false);
          Alert.alert(
            'Biometria Ativada',
            'Você poderá usar sua impressão digital ou Face ID para autenticação.',
            [{ text: 'OK' }]
          );
        }, 1000);
      } else {
        // Aqui seria uma chamada à API para desativar o método biométrico
        // const response = await authService.disableBiometricMethod();
        
        // Simulação de sucesso
        setTimeout(() => {
          setBiometricEnabled(false);
          setLoading(false);
          Alert.alert(
            'Biometria Desativada',
            'Você não poderá mais usar biometria para autenticação.',
            [{ text: 'OK' }]
          );
        }, 1000);
      }
    } catch (err) {
      setError('Não foi possível alterar as configurações de biometria.');
      setLoading(false);
    }
  };
  
  // Renderiza um item de método de autenticação
  const renderMethodItem = (
    title,
    description,
    icon,
    isEnabled,
    onToggle,
    onPress = null,
    isConfigurable = false
  ) => {
    return (
      <TouchableOpacity
        style={styles.methodItem}
        onPress={onPress}
        disabled={!onPress}
        testID={`method-${title.toLowerCase().replace(/\s/g, '-')}`}
      >
        <View style={styles.methodIconContainer}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>{title}</Text>
          <Text style={styles.methodDescription}>{description}</Text>
          {isConfigurable && (
            <TouchableOpacity
              style={styles.configButton}
              onPress={onPress}
              testID={`configure-${title.toLowerCase().replace(/\s/g, '-')}`}
            >
              <Text style={styles.configButtonText}>Configurar</Text>
            </TouchableOpacity>
          )}
        </View>
        <Switch
          trackColor={{ false: "#767577", true: COLORS.primary }}
          thumbColor={isEnabled ? COLORS.white : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onToggle}
          value={isEnabled}
          disabled={loading}
          testID={`switch-${title.toLowerCase().replace(/\s/g, '-')}`}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container} testID="twoFactorSetupScreen">
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            testID="backButton"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Autenticação de Dois Fatores</Text>
        </View>
        
        {/* Conteúdo principal */}
        {loading && !error ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Carregando configurações...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.replace('TwoFactorSetup')}
              testID="retryButton"
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            {/* Informações sobre 2FA */}
            <View style={styles.infoContainer}>
              <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
              <Text style={styles.infoTitle}>Proteja sua conta</Text>
              <Text style={styles.infoText}>
                A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta.
                Além da senha, você precisará fornecer um segundo fator de verificação ao fazer login.
              </Text>
            </View>
            
            {/* Lista de métodos */}
            <View style={styles.methodsContainer}>
              <Text style={styles.sectionTitle}>Métodos Disponíveis</Text>
              
              {/* Método SMS */}
              {renderMethodItem(
                'SMS',
                `Receba um código por SMS no número ${phoneNumber}`,
                'phone-portrait',
                smsEnabled,
                toggleSmsMethod
              )}
              
              {/* Método E-mail */}
              {renderMethodItem(
                'E-mail',
                `Receba um código por e-mail em ${email}`,
                'mail',
                emailEnabled,
                toggleEmailMethod
              )}
              
              {/* Método Aplicativo Autenticador */}
              {renderMethodItem(
                'Aplicativo Autenticador',
                'Use um aplicativo como Google Authenticator ou Authy',
                'apps',
                authenticatorEnabled,
                (value) => {
                  if (value) {
                    setupAuthenticator();
                  } else {
                    setAuthenticatorEnabled(false);
                    Alert.alert(
                      'Autenticador Desativado',
                      'O aplicativo autenticador foi desativado com sucesso.',
                      [{ text: 'OK' }]
                    );
                  }
                },
                setupAuthenticator,
                true
              )}
              
              {/* Método Biometria */}
              {renderMethodItem(
                'Biometria',
                'Use sua impressão digital ou Face ID',
                'finger-print',
                biometricEnabled,
                toggleBiometricMethod
              )}
            </View>
            
            {/* Recomendações de segurança */}
            <View style={styles.recommendationsContainer}>
              <Text style={styles.sectionTitle}>Recomendações</Text>
              <View style={styles.recommendationItem}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.recommendationText}>
                  Ative pelo menos dois métodos diferentes para maior segurança.
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.recommendationText}>
                  O aplicativo autenticador funciona mesmo sem conexão à internet.
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.recommendationText}>
                  Mantenha seus dados de contato atualizados para não perder acesso à sua conta.
                </Text>
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
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  methodsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 160, 23, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  configButton: {
    backgroundColor: 'rgba(212, 160, 23, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  configButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  recommendationsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 8,
    flex: 1,
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    fontSize: 16,
    color: COLORS.background,
    fontWeight: 'bold',
  },
});

export default TwoFactorSetupScreen;
