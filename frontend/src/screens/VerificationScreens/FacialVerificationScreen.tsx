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
  Dimensions,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
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

/**
 * FacialVerificationScreen - Tela para verificação facial básica
 * 
 * Esta tela permite capturar uma selfie do usuário para verificação de identidade,
 * com detecção de vivacidade básica para evitar fraudes com fotos.
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @param {Object} route - Objeto de rota com parâmetros
 */
const FacialVerificationScreen = ({ navigation, route }) => {
  // Estados para controlar a câmera e a verificação
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceInPosition, setFaceInPosition] = useState(false);
  const [faceDetectionError, setFaceDetectionError] = useState(null);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [verificationStep, setVerificationStep] = useState('initial'); // 'initial', 'detecting', 'captured', 'verifying', 'success', 'error'
  const [livenessChecks, setLivenessChecks] = useState({
    blinkDetected: false,
    movementDetected: false,
  });
  
  // Referência para a câmera
  const cameraRef = useRef(null);
  
  // Valores animados
  const outlineOpacity = useSharedValue(0.5);
  const outlineScale = useSharedValue(1);
  const checkmarkOpacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  
  // Solicitar permissão da câmera ao montar o componente
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de acesso à câmera para realizar a verificação facial.',
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
  
  // Iniciar animação do contorno ao montar o componente
  useEffect(() => {
    outlineOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Repetir infinitamente
      true // Reverter a sequência
    );
  }, []);
  
  // Estilo animado para o contorno do rosto
  const outlineStyle = useAnimatedStyle(() => {
    return {
      opacity: outlineOpacity.value,
      transform: [{ scale: outlineScale.value }],
    };
  });
  
  // Estilo animado para o ícone de sucesso
  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkmarkOpacity.value,
      transform: [{ scale: checkmarkScale.value }],
    };
  });
  
  // Função para lidar com a detecção de rostos
  const handleFacesDetected = ({ faces }) => {
    if (verificationStep === 'captured' || verificationStep === 'verifying' || 
        verificationStep === 'success' || verificationStep === 'error') {
      return;
    }
    
    if (faces.length === 0) {
      setFaceDetected(false);
      setFaceInPosition(false);
      setVerificationStep('initial');
      return;
    }
    
    setFaceDetected(true);
    setVerificationStep('detecting');
    
    const face = faces[0];
    
    // Verificar se o rosto está centralizado e em tamanho adequado
    const faceWidth = face.bounds.size.width;
    const faceHeight = face.bounds.size.height;
    const screenWidth = width;
    const screenHeight = height;
    
    const isRightSize = faceWidth > screenWidth * 0.5 && faceWidth < screenWidth * 0.9;
    const isCentered = 
      Math.abs(face.bounds.origin.x + faceWidth / 2 - screenWidth / 2) < screenWidth * 0.1 &&
      Math.abs(face.bounds.origin.y + faceHeight / 2 - screenHeight / 2) < screenHeight * 0.1;
    
    const inPosition = isRightSize && isCentered;
    setFaceInPosition(inPosition);
    
    // Verificação de vivacidade básica
    if (inPosition) {
      // Detectar piscada (olhos fechados e depois abertos)
      if (face.leftEyeOpenProbability < 0.3 && face.rightEyeOpenProbability < 0.3) {
        setLivenessChecks(prev => ({ ...prev, blinkDetected: true }));
      }
      
      // Detectar movimento da cabeça
      if (Math.abs(face.yawAngle) > 5 || Math.abs(face.rollAngle) > 5) {
        setLivenessChecks(prev => ({ ...prev, movementDetected: true }));
      }
      
      // Se todas as verificações de vivacidade passaram, capturar automaticamente
      if (livenessChecks.blinkDetected && livenessChecks.movementDetected && !captureInProgress) {
        captureFace();
      }
    }
  };
  
  // Função para capturar a foto do rosto
  const captureFace = async () => {
    if (!cameraReady || captureInProgress || !faceInPosition) return;
    
    setCaptureInProgress(true);
    
    try {
      // Animar o contorno para indicar captura
      outlineScale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      
      // Capturar a foto
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: Platform.OS === 'android', // Evitar processamento no Android
      });
      
      // Atualizar estado para mostrar que a foto foi capturada
      setVerificationStep('captured');
      
      // Simular verificação no servidor
      setVerificationStep('verifying');
      
      // Simulação de verificação bem-sucedida
      setTimeout(() => {
        // Animar o ícone de sucesso
        checkmarkOpacity.value = withTiming(1, { duration: 500 });
        checkmarkScale.value = withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
        
        setVerificationStep('success');
        
        // Navegar para a próxima tela após um breve delay
        setTimeout(() => {
          navigation.navigate('DocumentVerification', {
            faceImage: photo.uri,
          });
        }, 1500);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      setFaceDetectionError('Ocorreu um erro ao capturar sua foto. Por favor, tente novamente.');
      setVerificationStep('error');
      setCaptureInProgress(false);
    }
  };
  
  // Função para reiniciar o processo
  const restartProcess = () => {
    setFaceDetected(false);
    setFaceInPosition(false);
    setFaceDetectionError(null);
    setCaptureInProgress(false);
    setVerificationStep('initial');
    setLivenessChecks({
      blinkDetected: false,
      movementDetected: false,
    });
    
    // Resetar animações
    outlineOpacity.value = 0.5;
    outlineScale.value = 1;
    checkmarkOpacity.value = 0;
    checkmarkScale.value = 0;
    
    // Reiniciar animação do contorno
    outlineOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  };
  
  // Renderizar mensagem de instrução com base no estado atual
  const renderInstructionMessage = () => {
    switch (verificationStep) {
      case 'initial':
        return 'Posicione seu rosto no centro da tela';
      case 'detecting':
        if (!faceInPosition) {
          return 'Ajuste a distância para que seu rosto fique dentro do contorno';
        }
        if (!livenessChecks.blinkDetected) {
          return 'Pisque lentamente para verificação';
        }
        if (!livenessChecks.movementDetected) {
          return 'Mova levemente a cabeça para os lados';
        }
        return 'Mantenha-se parado para a captura';
      case 'captured':
        return 'Foto capturada!';
      case 'verifying':
        return 'Verificando sua identidade...';
      case 'success':
        return 'Verificação concluída com sucesso!';
      case 'error':
        return faceDetectionError || 'Ocorreu um erro. Tente novamente.';
      default:
        return 'Posicione seu rosto no centro da tela';
    }
  };

  // Renderizar conteúdo com base na permissão da câmera
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Solicitando permissão da câmera...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <Ionicons name="camera-off" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Sem acesso à câmera</Text>
          <Text style={styles.errorText}>
            Precisamos de acesso à câmera para realizar a verificação facial.
            Por favor, conceda permissão nas configurações do seu dispositivo.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.settingsButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container} testID="facialVerificationScreen">
        {/* Câmera */}
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.front}
          onCameraReady={() => setCameraReady(true)}
          onMountError={(error) => {
            console.error('Erro ao montar câmera:', error);
            setFaceDetectionError('Não foi possível inicializar a câmera. Por favor, tente novamente.');
          }}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true,
          }}
          onFacesDetected={handleFacesDetected}
        />
        
        {/* Overlay com contorno para posicionamento do rosto */}
        <View style={styles.overlay}>
          {/* Contorno animado */}
          <Animated.View 
            style={[
              styles.faceOutline,
              outlineStyle,
              faceInPosition && styles.faceOutlineCorrect,
              verificationStep === 'success' && styles.faceOutlineSuccess,
              verificationStep === 'error' && styles.faceOutlineError,
            ]}
          />
          
          {/* Ícone de sucesso animado */}
          {verificationStep === 'success' && (
            <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
              <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
            </Animated.View>
          )}
          
          {/* Ícone de erro */}
          {verificationStep === 'error' && (
            <View style={styles.errorIconContainer}>
              <Ionicons name="alert-circle" size={80} color={COLORS.error} />
            </View>
          )}
          
          {/* Indicador de carregamento durante verificação */}
          {verificationStep === 'verifying' && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        </View>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={captureInProgress}
            testID="backButton"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verificação Facial</Text>
        </View>
        
        {/* Rodapé com instruções */}
        <View style={styles.footer}>
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText} testID="instructionText">
              {renderInstructionMessage()}
            </Text>
          </View>
          
          {/* Botão de captura manual ou tentar novamente */}
          {(verificationStep === 'detecting' && faceInPosition) && (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={captureFace}
              disabled={captureInProgress || !faceInPosition}
              testID="captureButton"
            >
              <Ionicons name="camera" size={28} color={COLORS.background} />
            </TouchableOpacity>
          )}
          
          {verificationStep === 'error' && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={restartProcess}
              testID="retryButton"
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          )}
        </View>
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
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: 250,
    height: 350,
    borderWidth: 3,
    borderColor: COLORS.white,
    borderRadius: 150,
    opacity: 0.5,
  },
  faceOutlineCorrect: {
    borderColor: COLORS.primary,
    opacity: 0.8,
  },
  faceOutlineSuccess: {
    borderColor: COLORS.success,
    opacity: 0.8,
  },
  faceOutlineError: {
    borderColor: COLORS.error,
    opacity: 0.8,
  },
  checkmarkContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(13, 27, 42, 0.7)',
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: 'rgba(13, 27, 42, 0.7)',
    alignItems: 'center',
  },
  instructionContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
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

export default FacialVerificationScreen;
