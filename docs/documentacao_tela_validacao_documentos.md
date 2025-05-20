# Documentação de Implementação - Tela de Validação de Documentos

## Visão Geral

Este documento registra a implementação da tela de validação de documentos para o aplicativo Quantza 2.0, parte da Fase 2.2 do roadmap de segurança. Esta tela permite capturar imagens de documentos (CNH, RG) para verificação de identidade, com extração básica de dados via OCR.

## Funcionalidades Implementadas

### 1. Seleção de Tipo de Documento

**Implementação:**
- Interface para seleção entre diferentes tipos de documentos (CNH, RG)
- Cards informativos com ícones e descrições para cada tipo
- Transição animada para a etapa de captura após seleção

### 2. Captura de Documentos

**Funcionalidades:**
- Captura da frente e verso do documento selecionado
- Guia visual com contorno para posicionamento do documento
- Opção para selecionar imagens da galeria como alternativa
- Instruções contextuais para cada etapa da captura
- Botão de ajuda com dicas para melhorar a qualidade da captura

### 3. Revisão de Imagens

**Implementação:**
- Visualização das imagens capturadas (frente e verso)
- Opção para repetir a captura de cada lado individualmente
- Verificação visual da qualidade e legibilidade das imagens
- Botão para enviar documentos para verificação

### 4. Extração e Validação de Dados

**Funcionalidades:**
- Simulação de processamento OCR para extração de dados
- Exibição dos dados extraídos em formato estruturado
- Opção para confirmar ou editar os dados extraídos
- Feedback visual durante o processo de verificação
- Tratamento de erros com opção de reiniciar o processo

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `expo-camera`: Para acesso à câmera do dispositivo
- `expo-image-picker`: Para seleção de imagens da galeria
- `expo-image-manipulator`: Para processamento e otimização de imagens
- `react-native-reanimated`: Para animações fluidas
- `Ionicons`: Para ícones contextuais

### Processamento de Imagens:
- Redimensionamento para otimizar qualidade para OCR
- Compressão controlada para equilibrar qualidade e tamanho
- Conversão para formato JPEG para compatibilidade

### Estados Gerenciados:
- Tipo de documento selecionado
- Lado do documento em captura (frente/verso)
- Imagens capturadas para cada lado
- Etapa atual do processo de verificação
- Dados extraídos do documento
- Estados de erro e carregamento

## Como Ajustar

### 1. Integrar com API Real de OCR:
```javascript
// Substituir simulação por chamada real à API de OCR
const verifyDocuments = async () => {
  setVerificationStep('verifying');
  
  try {
    // Preparar imagens para envio
    const frontImageBase64 = await convertImageToBase64(documentImages.front);
    const backImageBase64 = await convertImageToBase64(documentImages.back);
    
    // Chamada real à API
    const response = await verificationService.verifyDocuments({
      documentType: selectedDocType.id,
      frontImage: frontImageBase64,
      backImage: backImageBase64,
      faceImage: await convertImageToBase64(faceImage),
    });
    
    if (response.success) {
      setExtractedData(response.extractedData);
      successOpacity.value = withTiming(1, { duration: 500 });
      setVerificationStep('success');
    } else {
      setError(response.message || 'Verificação falhou. Tente novamente.');
      setVerificationStep('error');
    }
  } catch (error) {
    console.error('Erro ao verificar documentos:', error);
    setError('Ocorreu um erro ao verificar seus documentos. Por favor, tente novamente.');
    setVerificationStep('error');
  }
};
```

### 2. Adicionar Validações Adicionais:
```javascript
// Para adicionar validação de qualidade da imagem:
const captureDocument = async () => {
  // ... código existente para captura ...
  
  try {
    // Capturar a foto
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: true,
      skipProcessing: Platform.OS === 'android',
    });
    
    // Verificar qualidade da imagem
    const imageQuality = await checkImageQuality(photo.uri);
    
    if (imageQuality.score < 0.6) {
      Alert.alert(
        'Imagem com Baixa Qualidade',
        `Detectamos problemas na imagem: ${imageQuality.issues.join(', ')}. Deseja tentar novamente?`,
        [
          { text: 'Usar mesmo assim', onPress: () => processAndSaveImage(photo) },
          { text: 'Tentar novamente', style: 'cancel' }
        ]
      );
      setCaptureInProgress(false);
      return;
    }
    
    // Processar e salvar a imagem
    processAndSaveImage(photo);
  } catch (error) {
    // ... tratamento de erro existente ...
  }
};
```

### 3. Personalizar Tipos de Documentos:
```javascript
// Para adicionar ou modificar tipos de documentos suportados:
const DOCUMENT_TYPES = [
  { id: 'cnh', name: 'CNH', icon: 'card' },
  { id: 'rg', name: 'RG', icon: 'id-card' },
  { id: 'passaporte', name: 'Passaporte', icon: 'document-text' },
  { id: 'ctps', name: 'Carteira de Trabalho', icon: 'briefcase' },
];
```

## Próximos Passos

1. Implementar a tela de conclusão de verificação (VerificationCompleteScreen)
2. Integrar com serviços reais de OCR para extração de dados
3. Implementar validação cruzada entre dados faciais e documentais
4. Adicionar verificação de autenticidade de documentos
5. Implementar testes automatizados para o fluxo de validação de documentos

## Mensagem de Commit

"feat(verification): Implementa tela de validação de documentos com extração básica de dados"
