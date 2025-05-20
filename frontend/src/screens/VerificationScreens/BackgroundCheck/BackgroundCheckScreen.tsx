import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

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
 * BackgroundCheckScreen - Tela para verificação de antecedentes
 * 
 * Esta tela permite que o usuário forneça informações adicionais para verificação
 * de antecedentes, como CPF, endereço e autorização para consultas.
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @param {Object} route - Objeto de rota com parâmetros
 */
const BackgroundCheckScreen = ({ navigation, route }) => {
  // Parâmetros da rota
  const { documentType, extractedData } = route.params || {};
  
  // Estados para controlar o formulário e a verificação
  const [formData, setFormData] = useState({
    cpf: extractedData?.documentNumber || '',
    fullName: extractedData?.name || '',
    birthDate: extractedData?.birthDate || '',
    motherName: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  const [consents, setConsents] = useState({
    criminalRecords: false,
    creditCheck: false,
    employmentHistory: false,
  });
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState('form'); // 'form', 'verifying', 'success', 'error'
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  
  // Valores animados
  const formOpacity = useSharedValue(1);
  const successOpacity = useSharedValue(0);
  const successScale = useSharedValue(0.8);
  
  // Efeito para preencher dados do formulário com informações extraídas do documento
  useEffect(() => {
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        cpf: extractedData.documentNumber || prev.cpf,
        fullName: extractedData.name || prev.fullName,
        birthDate: extractedData.birthDate || prev.birthDate,
      }));
    }
  }, [extractedData]);
  
  // Função para atualizar dados do formulário
  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  
  // Função para atualizar consentimentos
  const updateConsent = (field, value) => {
    setConsents(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Função para validar o formulário
  const validateForm = () => {
    // Validar CPF
    if (!formData.cpf || formData.cpf.length !== 11) {
      Alert.alert('Erro de Validação', 'Por favor, insira um CPF válido com 11 dígitos.');
      return false;
    }
    
    // Validar nome completo
    if (!formData.fullName || formData.fullName.length < 5) {
      Alert.alert('Erro de Validação', 'Por favor, insira seu nome completo.');
      return false;
    }
    
    // Validar data de nascimento
    if (!formData.birthDate) {
      Alert.alert('Erro de Validação', 'Por favor, insira sua data de nascimento.');
      return false;
    }
    
    // Validar nome da mãe
    if (!formData.motherName || formData.motherName.length < 5) {
      Alert.alert('Erro de Validação', 'Por favor, insira o nome completo da sua mãe.');
      return false;
    }
    
    // Validar endereço
    if (!formData.address.street || !formData.address.number || !formData.address.neighborhood || 
        !formData.address.city || !formData.address.state || !formData.address.zipCode) {
      Alert.alert('Erro de Validação', 'Por favor, preencha todos os campos obrigatórios do endereço.');
      return false;
    }
    
    // Validar consentimentos
    if (!consents.criminalRecords) {
      Alert.alert('Consentimento Necessário', 'É necessário autorizar a consulta de antecedentes criminais para prosseguir.');
      return false;
    }
    
    return true;
  };
  
  // Função para enviar o formulário
  const submitForm = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setVerificationStep('verifying');
    
    try {
      // Aqui seria uma chamada à API para verificação de antecedentes
      // const response = await verificationService.checkBackground({
      //   formData,
      //   consents,
      // });
      
      // Simulação de verificação
      setTimeout(() => {
        // Simulação de resultado positivo
        const simulatedResult = {
          status: 'approved',
          details: {
            criminalRecords: {
              status: 'clear',
              message: 'Nenhum registro criminal encontrado.',
            },
            creditCheck: consents.creditCheck ? {
              status: 'approved',
              score: 750,
              message: 'Score de crédito adequado.',
            } : null,
            employmentHistory: consents.employmentHistory ? {
              status: 'verified',
              message: 'Histórico de emprego verificado.',
            } : null,
          },
          message: 'Verificação de antecedentes concluída com sucesso.',
        };
        
        setVerificationResult(simulatedResult);
        
        // Animar transição para sucesso
        formOpacity.value = withTiming(0, { duration: 300 });
        successOpacity.value = withTiming(1, { duration: 500 });
        successScale.value = withSequence(
          withTiming(1.1, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
        
        setVerificationStep('success');
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Erro na verificação de antecedentes:', error);
      setError('Ocorreu um erro durante a verificação. Por favor, tente novamente mais tarde.');
      setVerificationStep('error');
      setLoading(false);
    }
  };
  
  // Função para finalizar o processo
  const finishProcess = () => {
    // Navegar para a próxima etapa do processo
    navigation.navigate('VerificationComplete', {
      verificationResult,
    });
  };
  
  // Estilo animado para o formulário
  const formStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      display: formOpacity.value === 0 ? 'none' : 'flex',
    };
  });
  
  // Estilo animado para o sucesso
  const successStyle = useAnimatedStyle(() => {
    return {
      opacity: successOpacity.value,
      transform: [{ scale: successScale.value }],
      display: successOpacity.value === 0 ? 'none' : 'flex',
    };
  });
  
  // Renderizar conteúdo com base na etapa atual
  const renderContent = () => {
    switch (verificationStep) {
      case 'form':
        return (
          <Animated.ScrollView 
            style={[styles.formContainer, formStyle]} 
            contentContainerStyle={styles.formContent}
            testID="backgroundCheckForm"
          >
            <Text style={styles.formTitle}>Verificação de Antecedentes</Text>
            <Text style={styles.formSubtitle}>
              Preencha as informações abaixo para que possamos realizar a verificação de antecedentes.
              Seus dados serão tratados com segurança e confidencialidade.
            </Text>
            
            {/* Seção de Dados Pessoais */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Dados Pessoais</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CPF</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cpf}
                  onChangeText={(value) => updateFormData('cpf', value)}
                  placeholder="Digite apenas números"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="numeric"
                  maxLength={11}
                  testID="cpfInput"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData('fullName', value)}
                  placeholder="Seu nome completo"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  testID="fullNameInput"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Data de Nascimento</Text>
                <TextInput
                  style={styles.input}
                  value={formData.birthDate}
                  onChangeText={(value) => updateFormData('birthDate', value)}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="numeric"
                  maxLength={10}
                  testID="birthDateInput"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome da Mãe</Text>
                <TextInput
                  style={styles.input}
                  value={formData.motherName}
                  onChangeText={(value) => updateFormData('motherName', value)}
                  placeholder="Nome completo da sua mãe"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  testID="motherNameInput"
                />
              </View>
            </View>
            
            {/* Seção de Endereço */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Endereço Atual</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Rua/Avenida</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address.street}
                  onChangeText={(value) => updateFormData('address.street', value)}
                  placeholder="Nome da rua ou avenida"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  testID="streetInput"
                />
              </View>
              
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Número</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.address.number}
                    onChangeText={(value) => updateFormData('address.number', value)}
                    placeholder="Nº"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                    testID="numberInput"
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <Text style={styles.inputLabel}>Complemento (opcional)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.address.complement}
                    onChangeText={(value) => updateFormData('address.complement', value)}
                    placeholder="Apto, Bloco, etc."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    testID="complementInput"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bairro</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address.neighborhood}
                  onChangeText={(value) => updateFormData('address.neighborhood', value)}
                  placeholder="Nome do bairro"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  testID="neighborhoodInput"
                />
              </View>
              
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 2, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Cidade</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.address.city}
                    onChangeText={(value) => updateFormData('address.city', value)}
                    placeholder="Nome da cidade"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    testID="cityInput"
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Estado</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.address.state}
                    onChangeText={(value) => updateFormData('address.state', value)}
                    placeholder="UF"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    maxLength={2}
                    testID="stateInput"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CEP</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address.zipCode}
                  onChangeText={(value) => updateFormData('address.zipCode', value)}
                  placeholder="00000-000"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="numeric"
                  maxLength={9}
                  testID="zipCodeInput"
                />
              </View>
            </View>
            
            {/* Seção de Consentimentos */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Autorizações</Text>
              <Text style={styles.sectionSubtitle}>
                Para realizar a verificação de antecedentes, precisamos da sua autorização para consultar as seguintes bases de dados:
              </Text>
              
              <View style={styles.consentItem}>
                <View style={styles.consentTextContainer}>
                  <Text style={styles.consentTitle}>Antecedentes Criminais</Text>
                  <Text style={styles.consentDescription}>
                    Autorizo a consulta de antecedentes criminais junto aos órgãos competentes.
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: COLORS.primary }}
                  thumbColor={consents.criminalRecords ? COLORS.white : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => updateConsent('criminalRecords', value)}
                  value={consents.criminalRecords}
                  testID="criminalRecordsSwitch"
                />
              </View>
              
              <View style={styles.consentItem}>
                <View style={styles.consentTextContainer}>
                  <Text style={styles.consentTitle}>Histórico de Crédito</Text>
                  <Text style={styles.consentDescription}>
                    Autorizo a consulta do meu histórico de crédito junto aos órgãos de proteção ao crédito.
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: COLORS.primary }}
                  thumbColor={consents.creditCheck ? COLORS.white : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => updateConsent('creditCheck', value)}
                  value={consents.creditCheck}
                  testID="creditCheckSwitch"
                />
              </View>
              
              <View style={styles.consentItem}>
                <View style={styles.consentTextContainer}>
                  <Text style={styles.consentTitle}>Histórico Profissional</Text>
                  <Text style={styles.consentDescription}>
                    Autorizo a verificação do meu histórico profissional junto a empregadores anteriores.
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: COLORS.primary }}
                  thumbColor={consents.employmentHistory ? COLORS.white : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => updateConsent('employmentHistory', value)}
                  value={consents.employmentHistory}
                  testID="employmentHistorySwitch"
                />
              </View>
            </View>
            
            {/* Botão de Envio */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitForm}
              disabled={loading}
              testID="submitButton"
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Enviar para Verificação</Text>
              )}
            </TouchableOpacity>
            
            {/* Nota de Privacidade */}
            <Text style={styles.privacyNote}>
              Seus dados serão utilizados exclusivamente para fins de verificação de antecedentes
              e serão tratados de acordo com nossa Política de Privacidade.
            </Text>
          </Animated.ScrollView>
        );
        
      case 'verifying':
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Verificando seus antecedentes...</Text>
            <Text style={styles.loadingSubtext}>
              Estamos consultando as bases de dados autorizadas.
              Este processo pode levar alguns instantes.
            </Text>
          </View>
        );
        
      case 'success':
        return (
          <Animated.View style={[styles.successContainer, successStyle]}>
            <View style={styles.successIconContainer}>
              <Ionicons name="shield-checkmark" size={80} color={COLORS.success} />
            </View>
            
            <Text style={styles.successTitle}>Verificação Concluída!</Text>
            <Text style={styles.successSubtitle}>
              Sua verificação de antecedentes foi concluída com sucesso.
            </Text>
            
            <View style={styles.resultContainer}>
              {verificationResult && (
                <>
                  <View style={styles.resultItem}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={COLORS.success} 
                    />
                    <View style={styles.resultTextContainer}>
                      <Text style={styles.resultTitle}>Antecedentes Criminais</Text>
                      <Text style={styles.resultText}>
                        {verificationResult.details.criminalRecords.message}
                      </Text>
                    </View>
                  </View>
                  
                  {verificationResult.details.creditCheck && (
                    <View style={styles.resultItem}>
                      <Ionicons 
                        name="checkmark-circle" 
                        size={24} 
                        color={COLORS.success} 
                      />
                      <View style={styles.resultTextContainer}>
                        <Text style={styles.resultTitle}>Histórico de Crédito</Text>
                        <Text style={styles.resultText}>
                          {verificationResult.details.creditCheck.message}
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  {verificationResult.details.employmentHistory && (
                    <View style={styles.resultItem}>
                      <Ionicons 
                        name="checkmark-circle" 
                        size={24} 
                        color={COLORS.success} 
                      />
                      <View style={styles.resultTextContainer}>
                        <Text style={styles.resultTitle}>Histórico Profissional</Text>
                        <Text style={styles.resultText}>
                          {verificationResult.details.employmentHistory.message}
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.continueButton}
              onPress={finishProcess}
              testID="continueButton"
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          </Animated.View>
        );
        
      case 'error':
        return (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={COLORS.error} />
            <Text style={styles.errorTitle}>Erro na Verificação</Text>
            <Text style={styles.errorText}>
              {error || 'Não foi possível completar a verificação de antecedentes. Por favor, tente novamente mais tarde.'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setVerificationStep('form')}
              testID="retryButton"
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container} testID="backgroundCheckScreen">
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (verificationStep === 'form') {
                navigation.goBack();
              } else {
                // Para outros estados, perguntar antes de voltar
                Alert.alert(
                  'Cancelar Verificação',
                  'Tem certeza que deseja cancelar a verificação de antecedentes? Todo o progresso será perdido.',
                  [
                    { text: 'Não', style: 'cancel' },
                    { text: 'Sim', onPress: () => navigation.goBack() }
                  ]
                );
              }
            }}
            disabled={loading}
            testID="backButton"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verificação de Antecedentes</Text>
        </View>
        
        {/* Conteúdo principal */}
        {renderContent()}
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
  // Estilos para o formulário
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 24,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 24,
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.white,
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  consentTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  consentDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  privacyNote: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Estilos para carregamento
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Estilos para sucesso
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  resultContainer: {
    width: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resultTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  // Estilos para erro
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
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});

export default BackgroundCheckScreen;
