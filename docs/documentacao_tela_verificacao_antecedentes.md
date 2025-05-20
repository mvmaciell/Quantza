# Documentação de Implementação - Tela de Verificação de Antecedentes

## Visão Geral

Este documento registra a implementação da tela de verificação de antecedentes para o aplicativo Quantza 2.0, parte da Fase 2.3 do roadmap de segurança. Esta tela permite que o usuário forneça informações adicionais para verificação de antecedentes, como CPF, endereço e autorização para consultas em bases de dados.

## Funcionalidades Implementadas

### 1. Formulário de Dados Pessoais

**Implementação:**
- Campos para CPF, nome completo, data de nascimento e nome da mãe
- Preenchimento automático com dados extraídos do documento
- Validação de campos obrigatórios e formato
- Interface adaptativa com feedback visual

### 2. Formulário de Endereço

**Funcionalidades:**
- Campos para rua, número, complemento, bairro, cidade, estado e CEP
- Layout otimizado com agrupamento lógico de campos
- Validação de campos obrigatórios
- Suporte para endereços completos

### 3. Gestão de Consentimentos

**Implementação:**
- Switches para autorização de diferentes tipos de consulta
- Descrições detalhadas sobre cada tipo de verificação
- Consentimento obrigatório para antecedentes criminais
- Consentimentos opcionais para histórico de crédito e profissional

### 4. Processamento e Resultados

**Funcionalidades:**
- Simulação de processamento com feedback visual
- Exibição estruturada dos resultados da verificação
- Tratamento de diferentes status (aprovado, pendente, rejeitado)
- Opções para continuar ou tentar novamente

## Detalhes Técnicos

### Bibliotecas Utilizadas:
- `react-native-reanimated`: Para animações fluidas na transição entre estados
- `Ionicons`: Para ícones contextuais
- Componentes nativos do React Native para formulários e switches

### Validações Implementadas:
- CPF: Verificação de formato e comprimento
- Nome completo: Verificação de comprimento mínimo
- Data de nascimento: Verificação de formato
- Endereço: Verificação de campos obrigatórios
- Consentimentos: Verificação de autorização obrigatória

### Estados Gerenciados:
- Dados do formulário (pessoais e endereço)
- Consentimentos para diferentes tipos de verificação
- Etapa atual do processo (formulário, verificando, sucesso, erro)
- Resultados da verificação
- Estados de carregamento e erro

## Como Ajustar

### 1. Integrar com API Real de Verificação:
```javascript
// Substituir simulação por chamada real à API
const submitForm = async () => {
  if (!validateForm()) return;
  
  setLoading(true);
  setVerificationStep('verifying');
  
  try {
    // Preparar dados para envio
    const formattedData = {
      ...formData,
      cpf: formData.cpf.replace(/[^\d]/g, ''), // Remover caracteres não numéricos
      birthDate: formatDateForAPI(formData.birthDate),
      address: {
        ...formData.address,
        zipCode: formData.address.zipCode.replace(/[^\d]/g, ''),
      },
    };
    
    // Chamada real à API
    const response = await verificationService.checkBackground({
      userData: formattedData,
      consents,
      documentVerificationId: route.params?.verificationId,
    });
    
    if (response.success) {
      setVerificationResult(response.result);
      
      // Animar transição para sucesso
      formOpacity.value = withTiming(0, { duration: 300 });
      successOpacity.value = withTiming(1, { duration: 500 });
      successScale.value = withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 200 })
      );
      
      setVerificationStep('success');
    } else {
      setError(response.message || 'Verificação falhou. Tente novamente.');
      setVerificationStep('error');
    }
  } catch (error) {
    console.error('Erro na verificação de antecedentes:', error);
    setError('Ocorreu um erro durante a verificação. Por favor, tente novamente mais tarde.');
    setVerificationStep('error');
  } finally {
    setLoading(false);
  }
};
```

### 2. Adicionar Validação de CEP com Preenchimento Automático:
```javascript
// Função para validar e buscar dados do CEP
const validateAndFetchCEP = async (cep) => {
  // Remover caracteres não numéricos
  const cleanCEP = cep.replace(/[^\d]/g, '');
  
  if (cleanCEP.length !== 8) return;
  
  try {
    setLoading(true);
    
    // Chamada à API de CEP (exemplo com ViaCEP)
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (!data.erro) {
      // Preencher campos de endereço automaticamente
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          street: data.logradouro || prev.address.street,
          neighborhood: data.bairro || prev.address.neighborhood,
          city: data.localidade || prev.address.city,
          state: data.uf || prev.address.state,
          zipCode: cep,
        },
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
  } finally {
    setLoading(false);
  }
};

// Adicionar ao componente TextInput do CEP:
<TextInput
  style={styles.input}
  value={formData.address.zipCode}
  onChangeText={(value) => updateFormData('address.zipCode', value)}
  onBlur={() => validateAndFetchCEP(formData.address.zipCode)}
  placeholder="00000-000"
  placeholderTextColor="rgba(255, 255, 255, 0.5)"
  keyboardType="numeric"
  maxLength={9}
  testID="zipCodeInput"
/>
```

### 3. Adicionar Validação Avançada de CPF:
```javascript
// Função para validar CPF (algoritmo completo)
const validateCPF = (cpf) => {
  // Remover caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verificar se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validar dígitos verificadores
  let sum = 0;
  let remainder;
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

// Atualizar a função validateForm:
const validateForm = () => {
  // Validar CPF
  if (!formData.cpf || !validateCPF(formData.cpf)) {
    Alert.alert('Erro de Validação', 'Por favor, insira um CPF válido.');
    return false;
  }
  
  // Resto das validações...
};
```

## Próximos Passos

1. Implementar a tela de conclusão do processo de verificação
2. Integrar com serviços reais de verificação de antecedentes
3. Implementar armazenamento seguro das informações sensíveis
4. Adicionar suporte para diferentes tipos de verificação por perfil de usuário
5. Implementar testes automatizados para o fluxo de verificação de antecedentes

## Mensagem de Commit

"feat(verification): Implementa tela de verificação de antecedentes com formulário completo e consentimentos"
