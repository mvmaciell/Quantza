import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
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

const { width, height } = Dimensions.get('window');

// Tipos de documentos suportados
const DOCUMENT_TYPES = [
  { id: 'cnh', name: 'CNH', icon: 'card' },
  { id: 'rg', name: 'RG', icon: 'id-card' },
];

/**
 * DocumentVerificationScreen - Tela para validação de documentos
 * 
 * Esta tela permite capturar imagens de documentos (CNH, RG) para verificação
 * de identidade, com extração básica de dados via OCR.
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @param {Object} route - Objeto de rota com parâmetros
 */
const DocumentVerificationScreen = ({ navigation, route }) => {
  // Parâmetros da rota
  const { faceImage } = route.params || {};
  
  // Estados para controlar a câmera e a verificação
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(DOCUMENT_TYPES[0]);
  const [documentSide, setDocumentSide] = useState('front'); // 'front' ou 'back'
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [verificationStep, setVerificationStep] = useState('select_doc'); // 'select_doc', 'capture_front', 'capture_back', 'review', 'verifying', 'success', 'error'
  const [documentImages, setDocumentImages] = useState({
    front: null,
    back: null,
  });
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  
  // Referência para a câmera
  const cameraRef = useRef(null);
  
  // Valores animados
  const cardOpacity = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const successOpacity = useSharedValue(0);
  
  // Solicitar permissão da câmera ao montar o componente
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de acesso à câmera para capturar imagens dos seus documentos.',
          [
            {
              text: 'Cancelar',
              onPress: () => navigation.goBack(),
              style: 'cancel',
            },
            {
              text: 'Configurações',
              onPress: () => {
                // Aqui poderia abrir as configurações do sistema
                navigation.goBack();
              },
            },
          ]
        );
      }
    })();
  }, []);
  
  // Função para selecionar o tipo de documento
  const selectDocumentType = (docType) => {
    setSelectedDocType(docType);
    setVerificationStep('capture_front');
    setDocumentSide('front');
    
    // Animar a transição
    cardScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );
  };
  
  // Função para capturar a imagem do documento
  const captureDocument = async () => {
    if (!cameraReady || captureInProgress) return;
    
    setCaptureInProgress(true);
    
    try {
      // Animar a captura
      cardScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
      
      // Capturar a foto
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: Platform.OS === 'android',
      });
      
      // Processar a imagem para melhorar a qualidade para OCR
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      
      // Atualizar o estado com a imagem capturada
      setDocumentImages(prev => ({
        ...prev,
        [documentSide]: processedImage.uri,
      }));
      
      // Se for a frente do documento, pedir o verso
      if (documentSide === 'front') {
        setDocumentSide('back');
        setVerificationStep('capture_back');
      } else {
        // Se já tiver capturado ambos os lados, ir para revisão
        setVerificationStep('review');
      }
      
      setCaptureInProgress(false);
    } catch (error) {
      console.error('Erro ao capturar documento:', error);
      setError('Ocorreu um erro ao capturar a imagem. Por favor, tente novamente.');
      setCaptureInProgress(false);
    }
  };
  
  // Função para selecionar imagem da galeria
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Processar a imagem para melhorar a qualidade para OCR
        const processedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1200 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        
        // Atualizar o estado com a imagem selecionada
        setDocumentImages(prev => ({
          ...prev,
          [documentSide]: processedImage.uri,
        }));
        
        // Se for a frente do documento, pedir o verso
        if (documentSide === 'front') {
          setDocumentSide('back');
          setVerificationStep('capture_back');
        } else {
          // Se já tiver capturado ambos os lados, ir para revisão
          setVerificationStep('review');
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      setError('Ocorreu um erro ao selecionar a imagem. Por favor, tente novamente.');
    }
  };
  
  // Função para enviar documentos para verificação
  const verifyDocuments = async () => {
    setVerificationStep('verifying');
    
    try {
      // Aqui seria uma chamada à API para verificar os documentos
      // const response = await verificationService.verifyDocuments({
      //   documentType: selectedDocType.id,
      //   frontImage: documentImages.front,
      //   backImage: documentImages.back,
      //   faceImage,
      // });
      
      // Simulação de extração de dados via OCR
      setTimeout(() => {
        // Dados simulados extraídos do documento
        const simulatedData = {
          name: 'Maria Silva',
          documentNumber: '123456789',
          birthDate: '15/05/1985',
          issueDate: '10/01/2020',
          expiryDate: '10/01/2030',
        };
        
        setExtractedData(simulatedData);
        
        // Animar o sucesso
        successOpacity.value = withTiming(1, { duration: 500 });
        
        setVerificationStep('success');
      }, 3000);
    } catch (error) {
      console.error('Erro ao verificar documentos:', error);
      setError('Ocorreu um erro ao verificar seus documentos. Por favor, tente novamente.');
      setVerificationStep('error');
    }
  };
  
  // Função para confirmar os dados extraídos e finalizar
  const confirmExtractedData = () => {
    // Aqui seria uma chamada à API para confirmar os dados
    // const response = await verificationService.confirmDocumentData({
    //   documentType: selectedDocType.id,
    //   extractedData,
    // });
    
    // Navegar para a próxima etapa do processo
    navigation.navigate('VerificationComplete', {
      documentType: selectedDocType.id,
      extractedData,
    });
  };
  
  // Função para reiniciar o processo
  const restartProcess = () => {
    setSelectedDocType(DOCUMENT_TYPES[0]);
    setDocumentSide('front');
    setDocumentImages({
      front: null,
      back: null,
    });
    setExtractedData(null);
    setError(null);
    setCaptureInProgress(false);
    setVerificationStep('select_doc');
  };
  
  // Estilo animado para o card
  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ scale: cardScale.value }],
    };
  });
  
  // Estilo animado para o sucesso
  const successStyle = useAnimatedStyle(() => {
    return {
      opacity: successOpacity.value,
    };
  });
  
  // Renderizar conteúdo com base na etapa atual
  const renderContent = () => {
    switch (verificationStep) {
      case 'select_doc':
        return (
          <View style={styles.selectDocContainer}>
            <Text style={styles.selectDocTitle}>Selecione o Documento</Text>
            <Text style={styles.selectDocSubtitle}>
              Escolha um documento válido com foto para verificação
            </Text>
            
            <View style={styles.docTypeContainer}>
              {DOCUMENT_TYPES.map((docType) => (
                <TouchableOpacity
                  key={docType.id}
                  style={styles.docTypeCard}
                  onPress={() => selectDocumentType(docType)}
                  testID={`docType-${docType.id}`}
                >
                  <Ionicons name={docType.icon} size={48} color={COLORS.primary} />
                  <Text style={styles.docTypeName}>{docType.name}</Text>
                  <Text style={styles.docTypeDesc}>
                    {docType.id === 'cnh' ? 'Carteira Nacional de Habilitação' : 'Registro Geral'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 'capture_front':
      case 'capture_back':
        if (hasPermission === false) {
          return (
            <View style={styles.errorContainer}>
              <Ionicons name="camera-off" size={64} color={COLORS.error} />
              <Text style={styles.errorTitle}>Sem acesso à câmera</Text>
              <Text style={styles.errorText}>
                Precisamos de acesso à câmera para capturar imagens dos seus documentos.
                Por favor, conceda permissão nas configurações do seu dispositivo.
              </Text>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.settingsButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          );
        }
        
        return (
          <View style={styles.captureContainer}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={Camera.Constants.Type.back}
              onCameraReady={() => setCameraReady(true)}
              onMountError={(error) => {
                console.error('Erro ao montar câmera:', error);
                setError('Não foi possível inicializar a câmera. Por favor, tente novamente.');
              }}
            />
            
            <View style={styles.overlay}>
              <Animated.View style={[styles.documentOutline, cardStyle]}>
                <Text style={styles.documentSideText}>
                  {documentSide === 'front' ? 'Frente do documento' : 'Verso do documento'}
                </Text>
              </Animated.View>
            </View>
            
            <View style={styles.captureFooter}>
              <Text style={styles.captureInstructions}>
                Posicione o {documentSide === 'front' ? 'frente' : 'verso'} do seu {selectedDocType.name} dentro da área demarcada
              </Text>
              
              <View style={styles.captureButtonsContainer}>
                <TouchableOpacity
                  style={styles.galleryButton}
                  onPress={pickImage}
                  disabled={captureInProgress}
                  testID="galleryButton"
                >
                  <Ionicons name="images" size={24} color={COLORS.white} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={captureDocument}
                  disabled={captureInProgress || !cameraReady}
                  testID="captureButton"
                >
                  <Ionicons name="camera" size={28} color={COLORS.background} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() => {
                    Alert.alert(
                      'Dicas para captura',
                      '• Certifique-se de que o documento está bem iluminado\n• Evite reflexos e sombras\n• Posicione o documento completamente dentro da área demarcada\n• Mantenha a câmera estável',
                      [{ text: 'OK' }]
                    );
                  }}
                  testID="helpButton"
                >
                  <Ionicons name="help-circle" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
        
      case 'review':
        return (
          <ScrollView style={styles.reviewContainer} contentContainerStyle={styles.reviewContent}>
            <Text style={styles.reviewTitle}>Revise seus Documentos</Text>
            <Text style={styles.reviewSubtitle}>
              Verifique se as imagens estão nítidas e legíveis
            </Text>
            
            <View style={styles.documentPreviewContainer}>
              <View style={styles.documentPreviewItem}>
                <Text style={styles.documentPreviewLabel}>Frente</Text>
                <Image
                  source={{ uri: documentImages.front }}
                  style={styles.documentPreviewImage}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => {
                    setDocumentSide('front');
                    setVerificationStep('capture_front');
                  }}
                  testID="retakeFrontButton"
                >
                  <Ionicons name="camera" size={16} color={COLORS.background} />
                  <Text style={styles.retakeButtonText}>Tirar novamente</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.documentPreviewItem}>
                <Text style={styles.documentPreviewLabel}>Verso</Text>
                <Image
                  source={{ uri: documentImages.back }}
                  style={styles.documentPreviewImage}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => {
                    setDocumentSide('back');
                    setVerificationStep('capture_back');
                  }}
                  testID="retakeBackButton"
                >
                  <Ionicons name="camera" size={16} color={COLORS.background} />
                  <Text style={styles.retakeButtonText}>Tirar novamente</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={verifyDocuments}
              testID="verifyButton"
            >
              <Text style={styles.verifyButtonText}>Enviar para Verificação</Text>
            </TouchableOpacity>
          </ScrollView>
        );
        
      case 'verifying':
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Verificando seus documentos...</Text>
            <Text style={styles.loadingSubtext}>
              Estamos extraindo e validando as informações do seu {selectedDocType.name}.
              Isso pode levar alguns instantes.
            </Text>
          </View>
        );
        
      case 'success':
        return (
          <ScrollView style={styles.successContainer} contentContainerStyle={styles.successContent}>
            <Animated.View style={[styles.successIconContainer, successStyle]}>
              <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
            </Animated.View>
            
            <Text style={styles.successTitle}>Documento Verificado!</Text>
            <Text style={styles.successSubtitle}>
              As informações do seu {selectedDocType.name} foram extraídas com sucesso.
              Por favor, confirme se os dados estão corretos.
            </Text>
            
            <View style={styles.extractedDataContainer}>
              {extractedData && Object.entries(extractedData).map(([key, value]) => (
                <View key={key} style={styles.dataRow}>
                  <Text style={styles.dataLabel}>
                    {key === 'name' ? 'Nome' :
                     key === 'documentNumber' ? 'Número do Documento' :
                     key === 'birthDate' ? 'Data de Nascimento' :
                     key === 'issueDate' ? 'Data de Emissão' :
                     key === 'expiryDate' ? 'Data de Validade' : key}
                  </Text>
                  <Text style={styles.dataValue}>{value}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmExtractedData}
              testID="confirmButton"
            >
              <Text style={styles.confirmButtonText}>Confirmar Dados</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                Alert.alert(
                  'Editar Dados',
                  'Em uma implementação real, aqui você poderia editar os dados extraídos caso houvesse algum erro de reconhecimento.',
                  [{ text: 'OK' }]
                );
              }}
              testID="editButton"
            >
              <Text style={styles.editButtonText}>Editar Dados</Text>
            </TouchableOpacity>
          </ScrollView>
        );
        
      case 'error':
        return (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={COLORS.error} />
            <Text style={styles.errorTitle}>Erro na Verificação</Text>
            <Text style={styles.errorText}>
              {error || 'Não foi possível verificar seus documentos. Por favor, tente novamente.'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={restartProcess}
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
      <View style={styles.container} testID="documentVerificationScreen">
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (verificationStep === 'select_doc') {
                navigation.goBack();
              } else if (verificationStep === 'capture_front') {
                setVerificationStep('select_doc');
              } else if (verificationStep === 'capture_back') {
                setDocumentSide('front');
                setVerificationStep('capture_front');
              } else if (verificationStep === 'review') {
                setDocumentSide('back');
                setVerificationStep('capture_back');
              } else {
                // Para outros estados, perguntar antes de voltar
                Alert.alert(
                  'Cancelar Verificação',
                  'Tem certeza que deseja cancelar a verificação de documentos? Todo o progresso será perdido.',
                  [
                    { text: 'Não', style: 'cancel' },
                    { text: 'Sim', onPress: () => navigation.goBack() }
                  ]
                );
              }
            }}
            disabled={verificationStep === 'verifying'}
            testID="backButton"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verificação de Documentos</Text>
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
  // Estilos para seleção de documento
  selectDocContainer: {
    flex: 1,
    padding: 24,
  },
  selectDocTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  selectDocSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 32,
  },
  docTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  docTypeCard: {
    width: '48%',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  docTypeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  docTypeDesc: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  // Estilos para captura de documento
  captureContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentOutline: {
    width: width * 0.8,
    height: width * 0.5,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentSideText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  captureFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(13, 27, 42, 0.8)',
    padding: 20,
    alignItems: 'center',
  },
  captureInstructions: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  captureButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para revisão de documentos
  reviewContainer: {
    flex: 1,
  },
  reviewContent: {
    padding: 24,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  reviewSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 24,
  },
  documentPreviewContainer: {
    marginBottom: 24,
  },
  documentPreviewItem: {
    marginBottom: 16,
  },
  documentPreviewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  documentPreviewImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.background,
    marginLeft: 8,
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
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
  },
  successContent: {
    padding: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginVertical: 24,
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
  extractedDataContainer: {
    width: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dataRow: {
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  editButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
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

export default DocumentVerificationScreen;
