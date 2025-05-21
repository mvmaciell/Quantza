import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Componentes a serem testados
import ServiceSelectionScreen from '../../ServiceSelectionScreen';
import AccessibleTransportDetailsScreen from '../AccessibleTransportDetailsScreen';
import AccessibleTransportConfirmationScreen from '../AccessibleTransportConfirmationScreen';
import AccessibleTransportTrackingScreen from '../AccessibleTransportTrackingScreen';

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
        accessibleTransportDetails: {
          vehicleType: 'standard_accessible',
          needAssistance: true,
          additionalInfo: 'Cadeira de rodas manual',
          estimatedPrice: 42.0,
        },
        origin: { address: 'Av. Paulista, 1000, São Paulo, SP' },
        destination: { address: 'Shopping Ibirapuera, São Paulo, SP' },
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
        <Stack.Screen name="AccessibleTransportDetails" component={AccessibleTransportDetailsScreen} />
        <Stack.Screen name="AccessibleTransportConfirmation" component={AccessibleTransportConfirmationScreen} />
        <Stack.Screen name="AccessibleTransportTracking" component={AccessibleTransportTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('Fluxo de Transporte Acessível', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('deve permitir selecionar o serviço de transporte acessível na tela de seleção', () => {
    const { getByTestId } = render(<TestNavigator />);
    
    // Verificar se o card de transporte acessível está presente
    const accessibleCard = getByTestId('serviceCard-accessible');
    expect(accessibleCard).toBeTruthy();
    
    // Simular clique no card de transporte acessível
    fireEvent.press(accessibleCard);
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('AccessibleTransportDetails');
  });

  it('deve permitir configurar os detalhes do transporte acessível', () => {
    const { getByTestId, getByText } = render(<AccessibleTransportDetailsScreen />);
    
    // Verificar se os tipos de veículo estão presentes
    const standardVehicle = getByTestId('vehicleType-standard_accessible');
    const vanVehicle = getByTestId('vehicleType-van_accessible');
    expect(standardVehicle).toBeTruthy();
    expect(vanVehicle).toBeTruthy();
    
    // Simular seleção de van acessível
    fireEvent.press(vanVehicle);
    
    // Simular ativação de assistência adicional
    const assistanceSwitch = getByTestId('assistanceSwitch');
    fireEvent.valueChange(assistanceSwitch, true);
    
    // Simular entrada de informações adicionais
    const additionalInfoInput = getByTestId('additionalInfo');
    fireEvent.changeText(additionalInfoInput, 'Cadeira de rodas manual');
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('SelectDestination', {
      serviceType: 'accessible',
      accessibleTransportDetails: expect.objectContaining({
        vehicleType: 'van_accessible',
        needAssistance: true,
      }),
    });
  });

  it('deve exibir o resumo do transporte na tela de confirmação', () => {
    const { getByText, getByTestId } = render(<AccessibleTransportConfirmationScreen />);
    
    // Verificar se o resumo do transporte está presente
    expect(getByText('Resumo do Transporte')).toBeTruthy();
    expect(getByText('Padrão Acessível')).toBeTruthy();
    expect(getByText('Sim')).toBeTruthy();
    
    // Verificar se os endereços estão presentes
    expect(getByText('Origem')).toBeTruthy();
    expect(getByText('Destino')).toBeTruthy();
    expect(getByText('Av. Paulista, 1000, São Paulo, SP')).toBeTruthy();
    expect(getByText('Shopping Ibirapuera, São Paulo, SP')).toBeTruthy();
    
    // Verificar se o preço está presente
    expect(getByText('Valor Total:')).toBeTruthy();
    
    // Verificar se o selo de parceiro verificado está presente
    expect(getByText('Parceiro Verificado')).toBeTruthy();
    expect(getByText('Acessibilidade')).toBeTruthy();
    
    // Simular clique no botão de confirmar
    const confirmButton = getByTestId('confirmButton');
    fireEvent.press(confirmButton);
    
    // Verificar se a navegação foi chamada corretamente (após o timeout)
    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('AccessibleTransportTracking', expect.anything());
    });
  });

  it('deve exibir o acompanhamento do transporte na tela de tracking', () => {
    const { getByTestId, getByText } = render(<AccessibleTransportTrackingScreen />);
    
    // Verificar se o mapa está presente
    expect(getByTestId('mock-map-view')).toBeTruthy();
    
    // Verificar se o status inicial está correto
    expect(getByText('Buscando Parceiro')).toBeTruthy();
    
    // Verificar se a animação está presente
    expect(getByTestId('mock-lottie')).toBeTruthy();
    
    // Aguardar a mudança de status (simulada por setTimeout no componente)
    waitFor(() => {
      expect(getByText('Parceiro a caminho')).toBeTruthy();
    });
  });
});
