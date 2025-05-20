# Documentação de Alterações - ProfileSwitcher Aprimorado

## Visão Geral

Este documento registra as alterações realizadas no componente `ProfileSwitcher.tsx`, parte da Fase 1 do roadmap de implementação do Quantza 2.0. O componente foi completamente redesenhado para oferecer uma experiência de alternância de perfil mais intuitiva e visualmente alinhada com a identidade do Quantza.

## Alterações Realizadas

### 1. Redesign Visual

**Antes:**
- Switch padrão do React Native
- Layout simples com texto e switch
- Estilo básico sem alinhamento com a identidade visual do Quantza

**Depois:**
- Interface personalizada com slider animado
- Cores alinhadas à identidade visual do Quantza (azul escuro, dourado, branco)
- Indicadores visuais claros para cada modo (Passageiro/Parceiro)
- Ícones para melhor identificação visual dos modos

### 2. Animações Fluidas

**Novas Animações:**
- Deslizamento suave do indicador entre os modos
- Efeito de escala ao pressionar (feedback tátil)
- Rotação do ícone de troca
- Transição de cores de fundo e texto
- Feedback visual imediato ao alternar

### 3. Melhorias de UX

**Novas Funcionalidades:**
- Feedback visual mais claro do modo atual
- Indicador de status abaixo do switcher
- Desativação automática do botão do modo atual
- Tratamento de estados de carregamento
- Reversão visual em caso de falha na API

### 4. Acessibilidade e Testabilidade

**Melhorias:**
- `testID` para facilitar testes E2E com Detox
- Melhor contraste de cores para legibilidade
- Tamanhos de toque adequados para interação
- Feedback visual e textual para alterações de estado

## Detalhes Técnicos

### Principais Componentes Utilizados:
- `Animated` do React Native para animações fluidas
- `Ionicons` para ícones (assumindo disponibilidade via Expo)
- `TouchableOpacity` para áreas de toque responsivas

### Animações Implementadas:
- Interpolação de valores para posição, rotação e cores
- Animações paralelas e sequenciais para efeitos complexos
- Uso de `useNativeDriver` quando possível para performance

### Estrutura de Código:
- Organização clara com comentários JSDoc
- Separação de lógica de negócio e apresentação
- Constantes de cores para manutenção facilitada
- Estilos bem organizados e responsivos

## Como Ajustar

### 1. Modificar Cores e Tema:
```javascript
// Alterar as constantes de cores no início do arquivo
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  // Adicionar ou modificar cores aqui
};
```

### 2. Ajustar Tamanhos e Proporções:
```javascript
// Modificar valores nos estilos
const styles = StyleSheet.create({
  switchContainer: {
    // Ajustar width, height, borderRadius, etc.
    width: width - 40,
    height: 50,
    borderRadius: 25,
  },
  // Outros estilos...
});
```

### 3. Personalizar Ícones:
```javascript
// Substituir os ícones por outros da biblioteca Ionicons
<Ionicons 
  name="person" // Mudar para outro ícone
  size={18}     // Ajustar tamanho
  color={currentRole === 'PASSENGER' ? COLORS.white : COLORS.secondary} 
/>
```

### 4. Integrar com API Real:
```javascript
// Substituir a simulação pela chamada real à API
const handleSwitchProfile = async (newRoleIsPartner: boolean) => {
  // ...
  try {
    // Remover simulação:
    // console.log(`ProfileSwitcher: Switched to ${targetRole} (placeholder)`);
    // setCurrentRole(targetRole); // Simulação
    // setIsPartnerMode(newRoleIsPartner); // Simulação
    
    // Adicionar chamada real:
    const response = await userService.switchProfile(targetRole);
    setCurrentRole(targetRole);
    setIsPartnerMode(newRoleIsPartner);
    // ...
  }
  // ...
};
```

## Próximos Passos

1. Integrar o ProfileSwitcher aprimorado no sistema de navegação
2. Implementar a lógica real de alternância de perfil no backend
3. Adicionar animações de transição entre layouts de perfil diferentes
4. Testar em diferentes tamanhos de tela para garantir responsividade

## Mensagem de Commit

"feat(profile): Aprimora o switcher de perfil com animações e visual alinhado à identidade Quantza"
