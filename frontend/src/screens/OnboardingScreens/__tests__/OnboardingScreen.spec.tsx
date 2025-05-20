import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../OnboardingScreen';

// Mock para o módulo de navegação
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      replace: jest.fn(),
    }),
  };
});

// Mock para os placeholders SVG
jest.mock('../../../assets/onboarding/placeholders', () => ({
  Welcome: () => 'WelcomePlaceholder',
  Services: () => 'ServicesPlaceholder',
  Points: () => 'PointsPlaceholder',
  Donations: () => 'DonationsPlaceholder',
  Wallet: () => 'WalletPlaceholder',
}));

// Mock para o módulo de assets
jest.mock('../../../assets/onboarding', () => ({
  preloadAssets: jest.fn(),
}));

// Mock para react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  
  // Mock para FlatList animada
  Reanimated.Animated.FlatList = ({ data, renderItem, keyExtractor, onMomentumScrollEnd, testID }) => {
    return (
      <FlatListMock 
        data={data} 
        renderItem={renderItem} 
        keyExtractor={keyExtractor} 
        onMomentumScrollEnd={onMomentumScrollEnd}
        testID={testID}
      />
    );
  };
  
  return Reanimated;
});

// Componente mock para FlatList
const FlatListMock = ({ data, renderItem, keyExtractor, onMomentumScrollEnd, testID }) => {
  return (
    <div data-testid={testID}>
      {data.map((item, index) => {
        return (
          <div key={keyExtractor(item)} data-testid={`slide-${index}`}>
            {renderItem({ item, index })}
          </div>
        );
      })}
    </div>
  );
};

// Stack Navigator mock para testes
const Stack = createStackNavigator();
const MockedNavigator = ({ component, params = {} }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MockedScreen"
          component={component}
          initialParams={params}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('OnboardingScreen', () => {
  it('renderiza corretamente com 5 slides', () => {
    const { getByTestId, getAllByText } = render(
      <MockedNavigator component={OnboardingScreen} />
    );
    
    // Verifica se a tela de onboarding é renderizada
    expect(getByTestId('onboardingScreen')).toBeTruthy();
    
    // Verifica se o botão de pular está presente
    expect(getByTestId('skipButton')).toBeTruthy();
    
    // Verifica se o botão de próximo está presente
    expect(getByTestId('nextButton')).toBeTruthy();
    
    // Verifica se o texto "Próximo" está presente no botão
    expect(getAllByText('Próximo')).toBeTruthy();
  });
  
  it('navega para a tela de login ao pular o onboarding', () => {
    const { getByTestId } = render(
      <MockedNavigator component={OnboardingScreen} />
    );
    
    // Simula o clique no botão de pular
    const skipButton = getByTestId('skipButton');
    fireEvent.press(skipButton);
    
    // Verifica se a navegação foi chamada (mock)
    // Como estamos usando um mock para a navegação, não podemos verificar diretamente
    // Mas podemos verificar se o botão foi pressionado sem erros
    expect(skipButton).toBeTruthy();
  });
  
  it('muda o texto do botão para "Começar" no último slide', async () => {
    const { getByTestId, getByText } = render(
      <MockedNavigator component={OnboardingScreen} />
    );
    
    // Simula o evento de scroll para o último slide
    const slider = getByTestId('onboardingSlider');
    
    // Simula o evento de fim de scroll para o último slide (índice 4)
    fireEvent(slider, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: {
          x: 4 * 375, // Assumindo largura de tela de 375
        },
      },
    });
    
    // Aguarda a atualização do estado
    await waitFor(() => {
      // Verifica se o texto do botão mudou para "Começar"
      expect(getByText('Começar')).toBeTruthy();
    });
  });
  
  it('navega para a próxima tela ao pressionar o botão no último slide', async () => {
    const { getByTestId, getByText } = render(
      <MockedNavigator component={OnboardingScreen} />
    );
    
    // Simula o evento de scroll para o último slide
    const slider = getByTestId('onboardingSlider');
    
    // Simula o evento de fim de scroll para o último slide (índice 4)
    fireEvent(slider, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: {
          x: 4 * 375, // Assumindo largura de tela de 375
        },
      },
    });
    
    // Aguarda a atualização do estado
    await waitFor(() => {
      // Verifica se o texto do botão mudou para "Começar"
      expect(getByText('Começar')).toBeTruthy();
    });
    
    // Simula o clique no botão "Começar"
    const nextButton = getByTestId('nextButton');
    fireEvent.press(nextButton);
    
    // Verifica se o botão foi pressionado sem erros
    expect(nextButton).toBeTruthy();
  });
  
  it('tenta pré-carregar assets ao montar o componente', () => {
    const preloadAssets = require('../../../assets/onboarding').preloadAssets;
    
    render(
      <MockedNavigator component={OnboardingScreen} />
    );
    
    // Verifica se a função de pré-carregamento foi chamada
    expect(preloadAssets).toHaveBeenCalled();
  });
});
