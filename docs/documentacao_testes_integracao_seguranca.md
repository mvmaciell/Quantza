# Documentação de Testes de Integração - Fluxo de Segurança e Verificação

## Visão Geral

Este documento registra a implementação dos testes de integração para o fluxo completo de segurança e verificação do aplicativo Quantza 2.0. Estes testes garantem que todas as etapas do processo de segurança funcionem corretamente em conjunto, desde a autenticação de dois fatores até a verificação de antecedentes.

## Testes Implementados

### 1. Autenticação de Dois Fatores (2FA)

**Testes:**
- Configuração inicial de 2FA via SMS
- Inserção e verificação de código
- Confirmação de ativação bem-sucedida
- Tratamento de erros e casos de borda

### 2. Autenticação Biométrica

**Testes:**
- Detecção de hardware biométrico disponível
- Ativação de autenticação biométrica
- Simulação de autenticação bem-sucedida
- Tratamento de erros e casos de borda

### 3. Verificação Facial

**Testes:**
- Solicitação de permissão da câmera
- Detecção de rosto e posicionamento
- Verificação de vivacidade (piscar olhos)
- Captura de selfie e processamento
- Navegação para próxima etapa após sucesso

### 4. Validação de Documentos

**Testes:**
- Seleção de tipo de documento (CNH, RG)
- Captura da frente e verso do documento
- Revisão das imagens capturadas
- Extração de dados via OCR (simulada)
- Confirmação dos dados extraídos

### 5. Verificação de Antecedentes

**Testes:**
- Preenchimento automático com dados extraídos do documento
- Preenchimento manual de campos adicionais
- Gestão de consentimentos para diferentes verificações
- Envio do formulário e processamento
- Exibição de resultados da verificação

### 6. Fluxo Completo de Segurança

**Teste:**
- Navegação sequencial por todas as etapas do processo
- Verificação da integração entre as diferentes telas
- Confirmação da conclusão bem-sucedida do fluxo completo

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `@testing-library/react-native`: Para renderização e interação com componentes
- `jest`: Como framework de testes
- `@react-navigation/native` e `@react-navigation/stack`: Para simular navegação entre telas

### Mocks Implementados:
- Serviços de autenticação (2FA, biometria)
- APIs nativas (câmera, detector facial, autenticação local)
- Navegação entre telas
- Respostas de APIs externas

### Abordagem de Testes:
- Testes isolados para cada componente principal
- Teste de integração para o fluxo completo
- Simulação de interações do usuário
- Verificação de estados e navegação

## Como Ajustar

### 1. Adicionar Testes para Casos de Erro:
```javascript
// Exemplo para adicionar teste de falha na verificação facial
it('deve exibir mensagem de erro quando a verificação facial falhar', async () => {
  // Mock para simular falha na detecção de vivacidade
  jest.spyOn(FacialVerificationService, 'verifyLiveness').mockImplementationOnce(() => 
    Promise.resolve({ success: false, message: 'Não foi possível detectar vivacidade.' })
  );
  
  const { getByTestId, getByText } = render(<TestNavigator initialRouteName="FacialVerification" />);
  
  // Simular captura
  fireEvent.press(getByTestId('captureButton'));
  
  // Aguardar mensagem de erro
  await waitFor(() => {
    expect(getByText('Não foi possível detectar vivacidade.')).toBeTruthy();
    expect(getByTestId('retryButton')).toBeTruthy();
  });
  
  // Verificar se botão de tentar novamente está presente
  fireEvent.press(getByTestId('retryButton'));
  
  // Verificar se voltou ao estado inicial
  await waitFor(() => {
    expect(getByText('Posicione seu rosto dentro da área')).toBeTruthy();
  });
});
```

### 2. Adicionar Testes de Acessibilidade:
```javascript
// Exemplo para verificar acessibilidade nos componentes
it('deve ter elementos acessíveis em todas as telas', async () => {
  const { getByTestId } = render(<TestNavigator initialRouteName="TwoFactorSetup" />);
  
  // Verificar se os elementos principais têm propriedades de acessibilidade
  const setupButton = getByTestId('continueButton');
  expect(setupButton.props.accessibilityLabel).toBeTruthy();
  expect(setupButton.props.accessibilityHint).toBeTruthy();
  
  // Verificar navegação acessível
  expect(getByTestId('backButton').props.accessibilityRole).toBe('button');
});
```

### 3. Adicionar Testes de Performance:
```javascript
// Exemplo para medir tempo de renderização
it('deve renderizar a tela de verificação facial em tempo aceitável', async () => {
  const startTime = Date.now();
  
  const { getByTestId } = render(<TestNavigator initialRouteName="FacialVerification" />);
  
  const renderTime = Date.now() - startTime;
  console.log(`Tempo de renderização: ${renderTime}ms`);
  
  // Verificar se renderizou em menos de 500ms
  expect(renderTime).toBeLessThan(500);
  
  // Verificar se elementos críticos estão presentes
  expect(getByTestId('cameraView')).toBeTruthy();
});
```

## Próximos Passos

1. Implementar testes E2E com Detox para fluxos completos em dispositivos reais
2. Adicionar testes de regressão para garantir que novas funcionalidades não quebrem o fluxo existente
3. Configurar integração contínua para executar testes automaticamente a cada commit
4. Implementar relatórios de cobertura de testes
5. Adicionar testes de segurança específicos (tentativas de bypass, injeção de dados inválidos)

## Mensagem de Commit

"test(verification): Implementa testes de integração para o fluxo completo de segurança e verificação"
