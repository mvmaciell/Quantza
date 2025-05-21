import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Componentes a serem testados
import ServiceSelectionScreen from '../../ServiceSelectionScreen';
import LongTripDetailsScreen from '../LongTripDetailsScreen';
import LongTripConfirmationScreen from '../LongTripConfirmationScreen';
import LongTripTrackingScreen from '../LongTripTrackingScreen';

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

// Mock para o DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return (props) => {
    return <View testID="mock-date-picker" onPress={() => props.onChange(null, new Date())} />;
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
        longTripDetails: {
          vehicleType: 'standard',
          roundTrip: true,
          scheduledTrip: false,
          departureDate: new Date().toISOString(),
          returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          additionalInfo: 'Viagem a trabalho',
          estimatedPrice: 150.0,
        },
        origin: { address: 'São Paulo, SP' },
        destination: { address: 'Rio de Janeiro, RJ' },
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
        <Stack.Screen name="LongTripDetails" component={LongTripDetailsScreen} />
        <Stack.Screen name="LongTripConfirmation" component={LongTripConfirmationScreen} />
        <Stack.Screen name="LongTripTracking" component={LongTripTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('Fluxo de Viagem Longa', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('deve permitir selecionar o serviço de viagem longa na tela de seleção', () => {
    const { getByTestId } = render(<TestNavigator />);
    
    // Verificar se o card de viagem longa está presente
    const longTripCard = getByTestId('serviceCard-longTrip');
    expect(longTripCard).toBeTruthy();
    
    // Simular clique no card de viagem longa
    fireEvent.press(longTripCard);
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('LongTripDetails');
  });

  it('deve permitir configurar os detalhes da viagem longa', () => {
    const { getByTestId, getByText } = render(<LongTripDetailsScreen />);
    
    // Verificar se os tipos de veículo estão presentes
    const standardVehicle = getByTestId('vehicleType-standard');
    const comfortVehicle = getByTestId('vehicleType-comfort');
    expect(standardVehicle).toBeTruthy();
    expect(comfortVehicle).toBeTruthy();
    
    // Simular seleção de veículo conforto
    fireEvent.press(comfortVehicle);
    
    // Simular ativação de ida e volta
    const roundTripSwitch = getByTestId('roundTripSwitch');
    fireEvent.valueChange(roundTripSwitch, true);
    
    // Simular ativação de agendamento
    const scheduledTripSwitch = getByTestId('scheduledTripSwitch');
    fireEvent.valueChange(scheduledTripSwitch, true);
    
    // Simular entrada de informações adicionais
    const additionalInfoInput = getByTestId('additionalInfo');
    fireEvent.changeText(additionalInfoInput, 'Viagem a trabalho');
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('SelectDestination', {
      serviceType: 'longTrip',
      longTripDetails: expect.objectContaining({
        vehicleType: 'comfort',
        roundTrip: true,
        scheduledTrip: true,
      }),
    });
  });

  it('deve exibir o resumo da viagem na tela de confirmação', () => {
    const { getByText, getByTestId } = render(<LongTripConfirmationScreen />);
    
    // Verificar se o resumo da viagem está presente
    expect(getByText('Resumo da Viagem')).toBeTruthy();
    expect(getByText('Padrão')).toBeTruthy();
    expect(getByText('Ida e Volta')).toBeTruthy();
    
    // Verificar se os endereços estão presentes
    expect(getByText('Origem')).toBeTruthy();
    expect(getByText('Destino')).toBeTruthy();
    expect(getByText('São Paulo, SP')).toBeTruthy();
    expect(getByText('Rio de Janeiro, RJ')).toBeTruthy();
    
    // Verificar se o preço está presente
    expect(getByText('Valor Total:')).toBeTruthy();
    
    // Verificar se o selo de parceiro verificado está presente
    expect(getByText('Parceiro Verificado')).toBeTruthy();
    expect(getByText('Viagens Longas')).toBeTruthy();
    
    // Simular clique no botão de confirmar
    const confirmButton = getByTestId('confirmButton');
    fireEvent.press(confirmButton);
    
    // Verificar se a navegação foi chamada corretamente (após o timeout)
    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('LongTripTracking', expect.anything());
    });
  });

  it('deve exibir o acompanhamento da viagem na tela de tracking', () => {
    const { getByTestId, getByText } = render(<LongTripTrackingScreen />);
    
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
