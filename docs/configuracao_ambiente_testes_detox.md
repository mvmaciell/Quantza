# Guia de Configuração do Ambiente de Testes E2E com Detox para o Aplicativo Quantza

Este documento detalha os passos necessários para configurar o ambiente de testes End-to-End (E2E) utilizando a ferramenta Detox para o aplicativo Quantza, desenvolvido em React Native. O guia abrange a configuração para as plataformas Android e iOS.

## 1. Introdução ao Detox

Detox é um framework de testes E2E "gray box" para aplicações mobile. Ele simula as interações do usuário com o aplicativo de forma rápida e confiável, executando os testes diretamente nos dispositivos (emuladores/simuladores ou físicos).

## 2. Pré-requisitos

Antes de iniciar a configuração do Detox, certifique-se de que seu ambiente de desenvolvimento atende aos seguintes pré-requisitos:

*   **Node.js e npm/yarn:** Versões LTS mais recentes. (O Quantza utiliza Node.js 20.x)
*   **Watchman:** Ferramenta para observar mudanças no sistema de arquivos (recomendado pelo React Native).
    ```bash
    # Exemplo para macOS com Homebrew
    brew install watchman
    ```
*   **React Native CLI:** Certifique-se de ter o ambiente de desenvolvimento React Native configurado conforme a documentação oficial ([React Native Environment Setup](https://reactnative.dev/docs/environment-setup)).
*   **Java Development Kit (JDK):** Versão 11 ou superior para desenvolvimento Android.
*   **Android Studio:** Instalado e configurado com:
    *   Android SDK (nível de API correspondente ao `targetSdkVersion` do Quantza).
    *   Pelo menos um Android Virtual Device (AVD) configurado e funcional.
*   **Xcode (para macOS):** Instalado e configurado com:
    *   Xcode Command Line Tools.
    *   Pelo menos um iOS Simulator configurado e funcional.
    *   CocoaPods (gerenciador de dependências para iOS).
        ```bash
        sudo gem install cocoapods
        ```

## 3. Instalação do Detox CLI

Instale a interface de linha de comando do Detox globalmente ou como uma dependência de desenvolvimento do projeto. Recomenda-se a instalação local para garantir a consistência da versão entre os desenvolvedores.

```bash
# Instalação local (recomendado)
cd /home/ubuntu/quantza_app/frontend
npm install detox-cli --save-dev
# ou
yarn add detox-cli --dev

# Para executar o Detox CLI localmente, use npx ou yarn
# npx detox --version
# yarn detox --version
```
Alternativamente, para instalação global:
```bash
# npm install -g detox-cli
```

Neste guia, assumiremos que o `detox-cli` foi adicionado como dependência de desenvolvimento no `frontend` do Quantza.



## 4. Adicionando Detox ao Projeto Quantza (Frontend)

Navegue até o diretório do frontend do Quantza e adicione o Detox como uma dependência de desenvolvimento:

```bash
cd /home/ubuntu/quantza_app/frontend
npm install detox --save-dev
# ou
yarn add detox --dev
```

## 5. Configuração Inicial do Detox

Execute o comando de inicialização do Detox para criar os arquivos de configuração básicos. Este comando irá detectar que é um projeto React Native e perguntará qual dispositivo de teste (Android/iOS) você deseja configurar inicialmente.

```bash
cd /home/ubuntu/quantza_app/frontend
npx detox init
```

Siga as instruções do prompt. Ele criará:

*   Uma pasta `e2e` na raiz do projeto frontend, contendo:
    *   `config.json` (ou `.detoxrc.json` em versões mais recentes): Arquivo principal de configuração do Detox.
    *   `firstTest.e2e.js` (ou similar): Um exemplo de arquivo de teste.
    *   `jest.config.js` (ou similar): Configuração do Jest para os testes E2E.

## 6. Configuração Específica para Android

### 6.1. Dependências Nativas

O Detox requer algumas dependências nativas no lado do Android. Edite o arquivo `/home/ubuntu/quantza_app/frontend/android/app/build.gradle`:

```gradle
// android/app/build.gradle

android {
    // ...
    defaultConfig {
        // ...
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        // Adicione o seguinte se não estiver presente:
        missingDimensionStrategy 'minApi', 'minApi'
    }
    // ...
}

dependencies {
    // ...
    androidTestImplementation('com.wix:detox:+') // Adicione esta linha
    // ...
}
```

### 6.2. Criação de um Arquivo de Teste Específico para Android

Crie um arquivo Java (ou Kotlin) dentro de `/home/ubuntu/quantza_app/frontend/android/app/src/androidTest/java/com/quantzafrontend/` (substitua `com/quantzafrontend` pelo seu package name se for diferente).

Crie um arquivo chamado `DetoxTest.java`:

```java
// DetoxTest.java
package com.quantzafrontend; // Substitua pelo seu package name

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {

    @Rule
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() {
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        detoxConfig.rnContextLoadTimeoutSec = (com.quantzafrontend.BuildConfig.DEBUG ? 180 : 60);

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
```

**Nota:** Certifique-se de que `MainActivity` é o nome da sua atividade principal. Se você estiver usando uma estrutura diferente (por exemplo, React Native Navigation), pode ser necessário ajustar a `ActivityTestRule`.

### 6.3. Configuração do Detox para Android (`.detoxrc.json`)

Edite o arquivo `.detoxrc.json` (ou `e2e/config.json`) na raiz do projeto frontend para adicionar ou ajustar a configuração do Android:

```json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/jest.config.js",
  "skipLegacyWorkersInjection": true,
  "apps": {
    "android.debug": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd .."
    },
    "android.release": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/release/app-release.apk",
      "build": "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd .."
    }
  },
  "devices": {
    "emulator": {
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_API_30" // Substitua pelo nome do seu AVD
      }
    }
  },
  "configurations": {
    "android.emu.debug": {
      "device": "emulator",
      "app": "android.debug"
    },
    "android.emu.release": {
      "device": "emulator",
      "app": "android.release"
    }
  }
}
```

**Importante:**
*   Ajuste `avdName` para o nome do seu AVD.
*   Os comandos de `build` podem precisar de ajustes dependendo da sua configuração.

## 7. Configuração Específica para iOS

### 7.1. Dependências Nativas (CocoaPods)

Adicione o Detox ao seu `Podfile` em `/home/ubuntu/quantza_app/frontend/ios/Podfile`:

```ruby
# ios/Podfile

target 'QuantzaFrontend' do
  # ... outras dependências

  # Adicione a configuração para Detox
  config = use_native_modules!

  # ...

  # Adicione o pod do Detox para a configuração de Debug
  # (ou para todas as configurações, se preferir)
  if ENV['CONFIGURATION'] == 'Debug'
    pod 'Detox', :podspec => '../node_modules/detox/Detox.podspec'
  end

  # ...
end

target 'QuantzaFrontendTests' do # Target de testes, se você tiver um
  inherit! :search_paths
  # ...
end
```

Depois de editar o `Podfile`, execute:

```bash
cd /home/ubuntu/quantza_app/frontend/ios
pod install
```

### 7.2. Configuração do Detox para iOS (`.detoxrc.json`)

Adicione ou ajuste a configuração do iOS no arquivo `.detoxrc.json`:

```json
{
  // ... (configurações existentes, como testRunner, apps Android, devices Android)
  "apps": {
    // ... (apps Android)
    "ios.debug": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/QuantzaFrontend.app", // Ajuste o nome do app se necessário
      "build": "xcodebuild -workspace ios/QuantzaFrontend.xcworkspace -scheme QuantzaFrontend -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "ios.release": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/QuantzaFrontend.app", // Ajuste o nome do app se necessário
      "build": "xcodebuild -workspace ios/QuantzaFrontend.xcworkspace -scheme QuantzaFrontend -configuration Release -sdk iphonesimulator -derivedDataPath ios/build"
    }
  },
  "devices": {
    // ... (devices Android)
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 14 Pro" // Substitua pelo simulador desejado
      }
    }
  },
  "configurations": {
    // ... (configurações Android)
    "ios.sim.debug": {
      "device": "simulator",
      "app": "ios.debug"
    },
    "ios.sim.release": {
      "device": "simulator",
      "app": "ios.release"
    }
  }
}
```

**Importante:**
*   Ajuste `QuantzaFrontend.app` e `QuantzaFrontend.xcworkspace` para os nomes corretos do seu projeto.
*   Ajuste `iPhone 14 Pro` para o simulador iOS desejado.
*   Os comandos de `build` podem precisar de ajustes.

## 8. Escrevendo Testes E2E com Detox

Os testes Detox são escritos em JavaScript usando Jest como test runner. Eles utilizam uma API assíncrona (`async/await`) para interagir com os elementos da UI.

### 8.1. Estrutura de um Teste

Um arquivo de teste típico (ex: `e2e/flows/auth.e2e.js`):

```javascript
// e2e/flows/auth.e2e.js

describe('Fluxo de Autenticação', () => {
  beforeAll(async () => {
    // Recarrega o app antes de todos os testes neste describe (opcional, pode ser por teste)
    // await device.launchApp({ newInstance: true }); // Para garantir um estado limpo
    // Para o Quantza, pode ser melhor lançar uma nova instância antes de cada teste ou describe
    // dependendo da necessidade de isolamento.
  });

  beforeEach(async () => {
    // Recarrega o app antes de cada teste para garantir um estado limpo
    await device.launchApp({ newInstance: true });
    // Opcional: pode ser necessário adicionar permissões aqui se o app solicitar na inicialização
    // Ex: await device.setPermissions({ notifications: 'YES', location: 'always' });
  });

  it('deve exibir a tela de Boas Vindas e permitir navegação para Login', async () => {
    // Verifica se a tela de Boas Vindas está visível (usando testID)
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
    await expect(element(by.text('Bem-vindo ao Quantza!'))).toBeVisible(); // Exemplo de busca por texto

    // Clica no botão de Login (usando testID)
    await element(by.id('loginButton')).tap();

    // Verifica se a tela de Login está visível
    await expect(element(by.id('loginScreen'))).toBeVisible();
  });

  it('deve permitir o cadastro de um novo usuário', async () => {
    await element(by.id('navigateToRegisterButton')).tap(); // Botão para ir para cadastro
    await expect(element(by.id('registerScreen'))).toBeVisible();

    // Preenche o formulário de cadastro
    await element(by.id('nameInput')).typeText('Usuário Teste Detox');
    await element(by.id('emailInput')).typeText('detox@quantza.com');
    await element(by.id('passwordInput')).typeText('Senha@123');
    await element(by.id('confirmPasswordInput')).typeText('Senha@123');
    
    // Seleciona perfil (exemplo com Switch ou Radio button)
    // await element(by.id('userProfileRadioButton')).tap();

    // Rola a tela se necessário para encontrar o botão
    // await element(by.id('registerScrollView')).scrollTo('bottom');

    await element(by.id('registerButton')).tap();

    // Verifica se o usuário foi redirecionado para a próxima tela (ex: verificação de email)
    await expect(element(by.id('verifyScreen'))).toBeVisible(); 
  });

  // Adicione mais testes para login, recuperação de senha, etc.
});
```

### 8.2. Seletores (Matchers)

Detox usa seletores para encontrar elementos na tela:

*   `by.id('testID')`: Melhor e mais robusto. Adicione `testID` aos seus componentes React Native.
*   `by.text('Texto Exato')`: Para encontrar elementos pelo texto visível.
*   `by.label('Accessibility Label')`: Para encontrar elementos pelo `accessibilityLabel`.
*   `by.type('RCTView')`: Para encontrar elementos pelo tipo nativo (menos recomendado para testes estáveis).

### 8.3. Ações (Actions)

*   `.tap()`: Simula um toque no elemento.
*   `.typeText('texto')`: Digita texto em um campo de input.
*   `.clearText()`: Limpa o texto de um input.
*   `.swipe('left' | 'right' | 'up' | 'down', 'fast' | 'slow', percentage)`: Simula um swipe.
*   `.scrollTo('edge')`: Rola um `ScrollView` (ex: `by.id('myScrollView').scrollTo('bottom')`).

### 8.4. Expectativas (Expectations)

*   `expect(element(...)).toBeVisible()`: Verifica se o elemento está visível.
*   `expect(element(...)).toBeNotVisible()`: Verifica se o elemento não está visível.
*   `expect(element(...)).toHaveText('texto')`: Verifica o texto do elemento.
*   `expect(element(...)).toHaveLabel('label')`: Verifica o `accessibilityLabel`.
*   `expect(element(...)).toHaveId('testID')`: Verifica o `testID`.

## 9. Executando os Testes Detox

### 9.1. Construindo o Aplicativo

Antes de rodar os testes, você precisa construir a versão de debug (ou release) do seu aplicativo com o Detox integrado:

```bash
# Para Android (Debug)
npx detox build -c android.emu.debug

# Para iOS (Debug)
npx detox build -c ios.sim.debug
```

### 9.2. Rodando os Testes

Após o build, execute os testes:

```bash
# Para Android (Debug)
npx detox test -c android.emu.debug

# Para iOS (Debug)
npx detox test -c ios.sim.debug

# Para rodar um arquivo de teste específico:
npx detox test -c android.emu.debug e2e/flows/auth.e2e.js
```

**Dica:** Certifique-se de que o emulador/simulador especificado na configuração está em execução antes de rodar os testes.

## 10. Integração com CI/CD (Exemplo com GitHub Actions)

A configuração do CI/CD para Detox pode ser complexa, pois requer um ambiente com emuladores/simuladores. Serviços como GitHub Actions (com macOS runners para iOS), Bitrise, CircleCI, etc., podem ser usados.

Um exemplo simplificado para GitHub Actions (Android em runner Linux, iOS em runner macOS):

```yaml
# .github/workflows/detox_e2e_tests.yml

name: Testes E2E com Detox

on: [push, pull_request]

jobs:
  android-e2e:
    runs-on: ubuntu-latest # Pode precisar de um runner com mais recursos ou setup de emulador
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Instalar dependências do frontend
        working-directory: ./frontend
        run: yarn install --frozen-lockfile
      
      # Configuração do Emulador Android (pode ser complexo e variar)
      - name: Setup Android Emulator
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 30 # Nível da API do emulador
          target: google_apis # Ou default
          arch: x86_64
          profile: Pixel_API_30 # Nome do AVD
          # script: echo "Emulator started"

      - name: Construir app Android para Detox
        working-directory: ./frontend
        run: npx detox build -c android.emu.debug

      - name: Rodar testes Detox Android
        working-directory: ./frontend
        run: npx detox test -c android.emu.debug --headless # --headless se suportado pelo emulador

  ios-e2e:
    runs-on: macos-latest # Runner macOS é necessário para testes iOS
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Instalar CocoaPods
        run: sudo gem install cocoapods
      - name: Instalar dependências do frontend e pods
        working-directory: ./frontend
        run: |
          yarn install --frozen-lockfile
          cd ios && pod install && cd ..

      - name: Construir app iOS para Detox
        working-directory: ./frontend
        run: npx detox build -c ios.sim.debug

      - name: Rodar testes Detox iOS
        working-directory: ./frontend
        run: npx detox test -c ios.sim.debug --cleanup # --cleanup para desligar o simulador
```

**Notas sobre CI/CD:**
*   A configuração de emuladores/simuladores em CI é o maior desafio.
*   `android-emulator-runner` é uma action popular para Android.
*   Runners macOS já vêm com Xcode e simuladores, mas podem precisar de inicialização.
*   Considere o tempo de execução e os custos dos runners.

## 11. Dicas e Troubleshooting

*   **`testID` é seu amigo:** Use `testID` consistentemente em todos os componentes interativos.
*   **Testes Flaky (Instáveis):** Podem ocorrer devido a animações, chamadas de rede, ou timeouts curtos. Use `waitFor` para elementos aparecerem, aumente timeouts no `.detoxrc.json` ou na `DetoxTest.java`.
    ```javascript
    await waitFor(element(by.id('loadingIndicator'))).toBeNotVisible().withTimeout(10000); // Espera até 10s
    ```
*   **Logs do Detox:** Use `npx detox test ... --loglevel verbose` para mais detalhes.
*   **Debugando Testes:** Você pode usar `console.log` nos seus testes e inspecionar a hierarquia de views nativas se necessário.
*   **Permissões:** Lide com pop-ups de permissão (localização, notificações) no início dos testes ou usando `device.setPermissions()`.
*   **Atualizações do Detox/React Native:** Verifique a documentação oficial do Detox para compatibilidade e possíveis breaking changes ao atualizar versões.
*   **Limpeza:** Use `device.launchApp({delete: true})` para desinstalar e reinstalar o app, garantindo um estado completamente limpo (mais lento).

## 12. Próximos Passos para o Quantza

1.  **Implementar `testID`s:** Adicionar `testID`s a todos os componentes interativos e telas chave do Quantza.
2.  **Escrever suítes de teste:** Criar arquivos `.e2e.js` para cada fluxo principal do aplicativo (Autenticação, Solicitação de Corrida, Fluxo do Parceiro, etc.).
3.  **Refinar Configurações:** Ajustar os comandos de build e nomes de AVD/Simulador no `.detoxrc.json` para corresponder ao ambiente de desenvolvimento do Quantza.
4.  **Integrar ao CI/CD:** Implementar e testar os workflows do GitHub Actions.

Este guia fornece uma base sólida para a configuração e execução de testes E2E com Detox no projeto Quantza. Consulte sempre a [documentação oficial do Detox](https://wix.github.io/Detox/) para informações mais detalhadas e atualizadas.

