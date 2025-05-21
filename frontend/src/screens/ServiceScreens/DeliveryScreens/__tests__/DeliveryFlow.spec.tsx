import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Componentes a serem testados
import ServiceSelectionScreen from '../../ServiceSelectionScreen';
import DeliveryDetailsScreen from '../DeliveryDetailsScreen';
import DeliveryConfirmationScreen from '../DeliveryConfirmationScreen';
import DeliveryTrackingScreen from '../DeliveryTrackingScreen';

// Mock para o react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  const MockMapView = (props) => {
    return <View testID="mock-map-view">{props.children}</View>;
  };
  const MockMarker = (props) => {
    return <View testID="mock-marker">{props.children}</View>;
  };
  const MockPolyline = (props) => {
    return <View testID="mock-polyline" />;
  };
  
  MockMapView.Marker = MockMarker;
  MockMapView.Polyline = MockPolyline;
  
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polyline: MockPolyline,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock para o Lottie
jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => <View testID="mock-lottie" />,
  };
});

// Mock para o Expo LinearGradient
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: (props) => <View testID="mock-linear-gradient">{props.children}</View>,
  };
});

// Mock para o useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {
        deliveryDetails: {
          packageType: 'small',
          urgencyType: 'standard',
          specialInstructions: 'Teste',
          insuranceEnabled: false,
          estimatedPrice: 25.0,
        },
        origin: { address: 'Endereço de origem' },
        destination: { address: 'Endereço de destino' },
      },
    }),
  };
});

// Configuração do Stack Navigator para testes
const Stack = createStackNavigator();
const TestNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
        <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} />
        <Stack.Screen name="DeliveryConfirmation" component={DeliveryConfirmationScreen} />
        <Stack.Screen name="DeliveryTracking" component={DeliveryTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('Fluxo de Entrega', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('deve permitir selecionar o serviço de entregas na tela de seleção', () => {
    const { getByTestId } = render(<TestNavigator />);
    
    // Verificar se o card de entregas está presente
    const deliveryCard = getByTestId('serviceCard-delivery');
    expect(deliveryCard).toBeTruthy();
    
    // Simular clique no card de entregas
    fireEvent.press(deliveryCard);
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('DeliveryDetails');
  });

  it('deve permitir configurar os detalhes da entrega', () => {
    const { getByTestId, getByText } = render(<DeliveryDetailsScreen />);
    
    // Verificar se os tipos de pacote estão presentes
    const smallPackage = getByTestId('packageType-small');
    const mediumPackage = getByTestId('packageType-medium');
    expect(smallPackage).toBeTruthy();
    expect(mediumPackage).toBeTruthy();
    
    // Simular seleção de pacote médio
    fireEvent.press(mediumPackage);
    
    // Verificar se os tipos de urgência estão presentes
    const expressUrgency = getByTestId('urgencyType-express');
    expect(expressUrgency).toBeTruthy();
    
    // Simular seleção de urgência expressa
    fireEvent.press(expressUrgency);
    
    // Simular entrada de instruções especiais
    const instructionsInput = getByTestId('specialInstructions');
    fireEvent.changeText(instructionsInput, 'Cuidado, item frágil');
    
    // Simular ativação do seguro
    const insuranceSwitch = getByTestId('insuranceSwitch');
    fireEvent.valueChange(insuranceSwitch, true);
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('SelectDestination', {
      serviceType: 'delivery',
      deliveryDetails: expect.objectContaining({
        packageType: 'medium',
        urgencyType: 'express',
        specialInstructions: 'Cuidado, item frágil',
        insuranceEnabled: true,
      }),
    });
  });

  it('deve exibir o resumo da entrega na tela de confirmação', () => {
    const { getByText, getByTestId } = render(<DeliveryConfirmationScreen />);
    
    // Verificar se o resumo da entrega está presente
    expect(getByText('Resumo da Entrega')).toBeTruthy();
    expect(getByText('Pacote Pequeno')).toBeTruthy();
    expect(getByText('Normal')).toBeTruthy();
    
    // Verificar se os endereços estão presentes
    expect(getByText('Origem')).toBeTruthy();
    expect(getByText('Destino')).toBeTruthy();
    expect(getByText('Endereço de origem')).toBeTruthy();
    expect(getByText('Endereço de destino')).toBeTruthy();
    
    // Verificar se o preço está presente
    expect(getByText('Valor Total:')).toBeTruthy();
    
    // Simular clique no botão de confirmar
    const confirmButton = getByTestId('confirmButton');
    fireEvent.press(confirmButton);
    
    // Verificar se a navegação foi chamada corretamente (após o timeout)
    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('DeliveryTracking', expect.anything());
    });
  });

  it('deve exibir o acompanhamento da entrega na tela de tracking', () => {
    const { getByTestId, getByText } = render(<DeliveryTrackingScreen />);
    
    // Verificar se o mapa está presente
    expect(getByTestId('mock-map-view')).toBeTruthy();
    
    // Verificar se o status inicial está correto
    expect(getByText('Buscando Entregador')).toBeTruthy();
    
    // Verificar se a animação está presente
    expect(getByTestId('mock-lottie')).toBeTruthy();
    
    // Aguardar a mudança de status (simulada por setTimeout no componente)
    waitFor(() => {
      expect(getByText('Entregador a caminho')).toBeTruthy();
    });
  });
});
