# Documentação de Implementação - Tela de Verificação Facial Básica

## Visão Geral

Este documento registra a implementação da tela de verificação facial básica para o aplicativo Quantza 2.0, parte da Fase 2.2 do roadmap de segurança. Esta tela permite capturar uma selfie do usuário para verificação de identidade, com detecção de vivacidade básica para evitar fraudes com fotos.

## Funcionalidades Implementadas

### 1. Captura de Selfie com Câmera Frontal

**Implementação:**
- Integração com a câmera frontal do dispositivo via `expo-camera`
- Solicitação e verificação de permissões de câmera
- Interface adaptativa com base no status da permissão
- Captura de imagem em alta qualidade para verificação

### 2. Detecção de Vivacidade Básica

**Funcionalidades:**
- Detecção de piscadas (olhos fechados e depois abertos)
- Detecção de movimentos da cabeça (rotação e inclinação)
- Verificação de posicionamento adequado do rosto
- Captura automática quando todos os critérios são atendidos

### 3. Guia Visual para o Usuário

**Implementação:**
- Contorno animado para posicionamento do rosto
- Feedback visual em tempo real (cores diferentes para cada estado)
- Instruções contextuais baseadas no estado atual da verificação
- Animações para indicar sucesso ou falha na verificação

### 4. Fluxo de Usuário Completo

**Etapas:**
- Solicitação de permissão da câmera
- Posicionamento do rosto
- Verificação de vivacidade (piscar e mover a cabeça)
- Captura automática ou manual
- Verificação (simulada) no servidor
- Transição para a próxima etapa (verificação de documentos)

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `expo-camera`: Para acesso à câmera do dispositivo
- `expo-face-detector`: Para detecção e análise facial
- `react-native-reanimated`: Para animações fluidas
- `Ionicons`: Para ícones contextuais

### Algoritmos de Detecção:
- Detecção de piscadas: Monitoramento da probabilidade de olhos abertos
- Detecção de movimento: Análise dos ângulos de rotação (yaw) e inclinação (roll)
- Posicionamento: Verificação de centralização e tamanho adequado do rosto

### Estados Gerenciados:
- Permissão da câmera
- Detecção de rosto
- Posicionamento correto
- Verificações de vivacidade
- Etapas do processo de verificação
- Estados de erro e carregamento

## Como Ajustar

### 1. Modificar Critérios de Detecção:
```javascript
// Para ajustar a sensibilidade da detecção de piscadas:
if (face.leftEyeOpenProbability < 0.3 && face.rightEyeOpenProbability < 0.3) {
  // Alterar 0.3 para um valor entre 0 e 1
  // Valores menores = mais sensível (detecta piscadas mais sutis)
  // Valores maiores = menos sensível (requer olhos mais fechados)
  setLivenessChecks(prev => ({ ...prev, blinkDetected: true }));
}

// Para ajustar a sensibilidade da detecção de movimento:
if (Math.abs(face.yawAngle) > 5 || Math.abs(face.rollAngle) > 5) {
  // Alterar 5 para ajustar a sensibilidade
  // Valores menores = mais sensível (detecta movimentos mais sutis)
  // Valores maiores = menos sensível (requer movimentos mais amplos)
  setLivenessChecks(prev => ({ ...prev, movementDetected: true }));
}
```

### 2. Integrar com API Real:
```javascript
// Substituir simulação por chamada real à API
const captureFace = async () => {
  // ... código existente para captura ...
  
  try {
    // Capturar a foto
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: true,
      skipProcessing: Platform.OS === 'android',
    });
    
    setVerificationStep('captured');
    setVerificationStep('verifying');
    
    // Substituir simulação por chamada real à API
    const response = await verificationService.verifyFace({
      image: photo.base64,
      userId: currentUser.id,
    });
    
    if (response.success) {
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
          verificationId: response.verificationId,
        });
      }, 1500);
    } else {
      setFaceDetectionError(response.message || 'Verificação falhou. Tente novamente.');
      setVerificationStep('error');
    }
  } catch (error) {
    // ... tratamento de erro existente ...
  }
};
```

### 3. Adicionar Verificações de Vivacidade Adicionais:
```javascript
// Para adicionar verificação de sorriso:
const [livenessChecks, setLivenessChecks] = useState({
  blinkDetected: false,
  movementDetected: false,
  smileDetected: false,
});

// Na função handleFacesDetected:
if (face.smilingProbability > 0.7) {
  setLivenessChecks(prev => ({ ...prev, smileDetected: true }));
}

// Atualizar condição para captura:
if (livenessChecks.blinkDetected && 
    livenessChecks.movementDetected && 
    livenessChecks.smileDetected && 
    !captureInProgress) {
  captureFace();
}

// Atualizar renderInstructionMessage:
if (!livenessChecks.smileDetected) {
  return 'Sorria para a câmera';
}
```

## Próximos Passos

1. Implementar a tela de validação de documentos (DocumentVerificationScreen)
2. Integrar com serviços reais de verificação facial
3. Implementar armazenamento seguro das imagens capturadas
4. Adicionar verificações de vivacidade mais avançadas
5. Implementar testes automatizados para o fluxo de verificação facial

## Mensagem de Commit

"feat(verification): Implementa tela de verificação facial com detecção de vivacidade básica"
