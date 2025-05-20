# Demonstração dos Fluxos do Aplicativo Quantza em Formato de GIFs Descritivos

**Data:** 15 de Maio de 2025

## Introdução

Este documento descreve uma série de GIFs que demonstram os principais fluxos de interação do aplicativo Quantza. Como a geração direta de arquivos GIF não é possível neste ambiente, cada "GIF" é apresentado como uma descrição detalhada da sequência de telas e ações que seriam visualizadas. O objetivo é fornecer uma representação visual clara de como o usuário e o parceiro interagem com o aplicativo.

--- 

## GIFs Descritivos dos Fluxos

### Fluxo 1: Autenticação e Perfis

**GIF 1.1: Cadastro de Novo Usuário (Passageiro)**
*   **Descrição:** Demonstra o processo de cadastro de um novo usuário com o perfil de "Passageiro".
*   **Sequência de Telas e Ações:**
    1.  **Tela de Boas-Vindas:** Usuário visualiza a tela inicial.
    2.  Usuário clica no botão "Cadastrar".
    3.  **Tela de Cadastro:** Usuário preenche nome, e-mail, senha e confirmação de senha.
    4.  Usuário seleciona a opção "Sou Passageiro".
    5.  Usuário clica no botão "Cadastrar".
    6.  **Tela de Verificação de E-mail (Simulada):** Usuário é informado que um e-mail de verificação foi enviado (ou tela Home, dependendo do fluxo exato pós-cadastro).

**GIF 1.2: Cadastro de Novo Usuário (Parceiro)**
*   **Descrição:** Demonstra o processo de cadastro de um novo usuário com o perfil de "Parceiro".
*   **Sequência de Telas e Ações:**
    1.  **Tela de Boas-Vindas:** Usuário visualiza a tela inicial.
    2.  Usuário clica no botão "Cadastrar".
    3.  **Tela de Cadastro:** Usuário preenche nome, e-mail, senha e confirmação de senha.
    4.  Usuário seleciona a opção "Sou Parceiro".
    5.  Usuário clica no botão "Cadastrar".
    6.  **Tela de Detalhes do Parceiro:** Usuário é direcionado para preencher informações adicionais (CNH, veículo, etc. - campos simulados).
    7.  Usuário preenche os campos e clica em "Enviar para Análise".
    8.  **Tela de Confirmação/Aguardando Aprovação (Simulada):** Usuário é informado que os dados foram enviados.

**GIF 1.3: Login de Usuário Existente**
*   **Descrição:** Demonstra o processo de login de um usuário já cadastrado.
*   **Sequência de Telas e Ações:**
    1.  **Tela de Boas-Vindas:** Usuário clica no botão "Login".
    2.  **Tela de Login:** Usuário insere e-mail e senha.
    3.  Usuário clica no botão "Entrar".
    4.  **Tela Home (Usuário ou Parceiro):** Usuário é redirecionado para a tela principal correspondente ao seu perfil.

**GIF 1.4: Alternância de Perfil (Usuário para Parceiro)**
*   **Descrição:** Demonstra um usuário com ambos os perfis aprovados alternando da visão de Passageiro para Parceiro.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Usuário:** Usuário está na interface de passageiro.
    2.  Usuário acessa o menu (ou um switcher de perfil dedicado, conforme `ProfileSwitcher.tsx`).
    3.  Usuário clica na opção "Mudar para Perfil Parceiro".
    4.  **Tela Home do Parceiro:** A interface é atualizada para a visão do parceiro, mostrando o mapa, status online/offline, etc.

### Fluxo 2: Solicitação de Corrida (Usuário)

**GIF 2.1: Solicitação Completa de Corrida pelo Usuário**
*   **Descrição:** Demonstra todo o fluxo de solicitação de uma corrida, desde a definição do destino até a busca por um motorista.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Usuário (`HomeScreen_v3.tsx`):** Usuário visualiza o mapa e o campo "Para onde você vai?".
    2.  Usuário clica no campo de destino.
    3.  **Tela de Seleção de Destino (`SelectDestinationScreen.tsx`):** Usuário digita o endereço de destino. Uma lista de sugestões (simulada) aparece. Usuário seleciona um destino.
    4.  **Tela do Comparador de Preços (`PriceComparatorScreen.tsx`):** Animação de "Calculando melhor taxa". Preços simulados de "Concorrente A", "Concorrente B" são exibidos. O "raio Quantza" destaca o preço do Quantza.
    5.  Usuário clica no botão para confirmar a corrida com a tarifa Quantza.
    6.  **Tela de Confirmação de Corrida (`ConfirmRideScreen.tsx`):** Detalhes da rota (origem, destino, tempo estimado, preço final) são exibidos. Usuário clica em "Confirmar Corrida".
    7.  **Tela "Buscando Motorista" (`SearchingDriverScreen.tsx`):** Animação de busca (pulso no mapa, radar) é exibida.
    8.  (Simulado) Motorista é encontrado. Transição para a tela de acompanhamento.
    9.  **Tela de Acompanhamento da Corrida (Usuário):** Mapa mostra o ícone do motorista se aproximando. Informações do motorista e veículo são exibidas. Opções de contato/cancelamento (placeholders) visíveis.

### Fluxo 3: Gerenciamento de Corrida (Parceiro)

**GIF 3.1: Aceitação e Execução de Corrida pelo Parceiro**
*   **Descrição:** Demonstra o parceiro recebendo, aceitando e completando uma corrida.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Parceiro (`PartnerHomeScreen.tsx`):** Parceiro está com status "Online".
    2.  **Modal de Nova Solicitação (`RideRequestModal.tsx`):** Um modal surge com vibração, mostrando detalhes da corrida (passageiro, origem, destino, ganho estimado) e um temporizador.
    3.  Parceiro clica em "Aceitar Corrida".
    4.  **Tela de Acompanhamento da Corrida (Parceiro - `PartnerTrackRideScreen.tsx`):** Mapa mostra a rota até o passageiro. Botão "Cheguei ao Passageiro" está ativo.
    5.  Parceiro clica em "Cheguei ao Passageiro".
    6.  Interface atualiza. Botão "Iniciar Viagem" fica ativo.
    7.  Parceiro clica em "Iniciar Viagem".
    8.  Mapa mostra a rota até o destino final do passageiro.
    9.  Parceiro clica em "Finalizar Corrida" ao chegar ao destino.
    10. **Tela de Fim de Corrida (Parceiro - `PartnerRideEndScreen.tsx`):** Resumo da corrida com ganhos e opção de avaliar o usuário.

### Fluxo 4: Pós-Corrida e Avaliação

**GIF 4.1: Avaliação Pós-Corrida (Usuário)**
*   **Descrição:** Demonstra o usuário avaliando o parceiro após a corrida.
*   **Sequência de Telas e Ações:**
    1.  **Tela de Fim de Corrida (Usuário - `UserRideEndScreen.tsx`):** Resumo da corrida (valor, pontos ganhos, doação) e interface de avaliação (estrelas, campo de comentário).
    2.  Usuário seleciona as estrelas e digita um comentário (opcional).
    3.  Usuário clica em "Enviar Avaliação".
    4.  Feedback visual de confirmação. Animação de pontos ganhos (`PostRideAnimations.tsx`) é exibida.

**GIF 4.2: Avaliação Pós-Corrida (Parceiro)**
*   **Descrição:** Demonstra o parceiro avaliando o usuário após a corrida.
*   **Sequência de Telas e Ações:**
    1.  **Tela de Fim de Corrida (Parceiro - `PartnerRideEndScreen.tsx`):** Resumo dos ganhos e interface de avaliação do usuário.
    2.  Parceiro seleciona as estrelas e digita um comentário (opcional).
    3.  Parceiro clica em "Enviar Avaliação".
    4.  Feedback visual de confirmação.

### Fluxo 5: Funcionalidades Adicionais do Usuário

**GIF 5.1: Visualização de Pontos Acumulados (Usuário)**
*   **Descrição:** Usuário acessa e visualiza seu saldo e histórico de pontos.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Usuário:** Usuário navega para a seção "Meus Pontos" (via menu ou tab bar).
    2.  **Tela de Pontos (`UserPointsScreen.tsx`):** Saldo total de pontos é exibido no topo. Lista/histórico de transações de pontos (ganhos por corrida, resgates futuros - simulados) é mostrada.

**GIF 5.2: Visualização de Doações (Usuário)**
*   **Descrição:** Usuário acessa e visualiza seu histórico de doações.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Usuário:** Usuário navega para a seção "Minhas Doações".
    2.  **Tela de Doações (`UserDonationsScreen.tsx`):** Valor total doado e lista/histórico de doações (1% por corrida - simulado) são exibidos.

**GIF 5.3: Assinatura do Plano Premium (Usuário)**
*   **Descrição:** Usuário explora e simula a contratação do plano Premium.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Usuário:** Usuário navega para a seção "Seja Premium".
    2.  **Tela de Assinatura Premium (`PremiumSubscriptionScreen.tsx`):** Benefícios do plano Premium são listados. Botão "Assinar Agora" visível.
    3.  Usuário clica em "Assinar Agora".
    4.  (Simulado) Modal de confirmação de pagamento Pagar.me aparece.
    5.  Usuário confirma o pagamento (simulado).
    6.  Feedback de assinatura bem-sucedida. Interface pode indicar status Premium.

**GIF 5.4: Gerenciamento da Carteira (Usuário)**
*   **Descrição:** Usuário acessa a carteira para adicionar um novo método de pagamento.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Usuário:** Usuário navega para a seção "Carteira".
    2.  **Tela da Carteira (`UserWalletScreen.tsx`):** Métodos de pagamento existentes (se houver) e histórico de transações são exibidos. Botão "Adicionar Método de Pagamento" visível.
    3.  Usuário clica em "Adicionar Método de Pagamento".
    4.  (Simulado) Formulário para adicionar dados do cartão de crédito (integrado com Pagar.me).
    5.  Usuário preenche os dados e salva.
    6.  Novo método de pagamento aparece listado na carteira.

### Fluxo 6: Funcionalidades Adicionais do Parceiro

**GIF 6.1: Visualização de Ganhos e Solicitação de Saque (Parceiro)**
*   **Descrição:** Parceiro acessa seus ganhos e simula uma solicitação de saque.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Parceiro:** Parceiro navega para a seção "Meus Ganhos".
    2.  **Tela de Ganhos (`PartnerEarningsScreen.tsx`):** Saldo atual, extrato detalhado de ganhos por corrida e período são exibidos. Botão "Solicitar Saque" visível.
    3.  Parceiro clica em "Solicitar Saque".
    4.  (Simulado) Modal para confirmar valor do saque e dados bancários (placeholders).
    5.  Parceiro confirma a solicitação.
    6.  Feedback de solicitação de saque enviada.

**GIF 6.2: Visualização do Programa de Incentivos (Parceiro)**
*   **Descrição:** Parceiro acessa a tela do programa de incentivos.
*   **Sequência de Telas e Ações:**
    1.  **Tela Home do Parceiro:** Parceiro navega para a seção "Incentivos".
    2.  **Tela de Incentivos (`PartnerIncentivesScreen.tsx`):** Conteúdo placeholder sobre metas, desafios e recompensas é exibido.

--- 

**Observação Final:** Estes GIFs descritivos servem como um guia visual para as funcionalidades implementadas. Em uma demonstração real, os GIFs seriam gravações de tela do aplicativo em execução em um emulador/simulador.

