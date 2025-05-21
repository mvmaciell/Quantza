import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Componentes a serem testados
import ServiceSelectionScreen from '../../ServiceSelectionScreen';
import PetTransportDetailsScreen from '../PetTransportDetailsScreen';
import PetTransportConfirmationScreen from '../PetTransportConfirmationScreen';
import PetTransportTrackingScreen from '../PetTransportTrackingScreen';

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
        petTransportDetails: {
          petSize: 'small',
          accompaniment: 'with_owner',
          additionalInfo: 'Rex, cachorro dócil',
          carrierEnabled: false,
          estimatedPrice: 30.0,
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
        <Stack.Screen name="PetTransportDetails" component={PetTransportDetailsScreen} />
        <Stack.Screen name="PetTransportConfirmation" component={PetTransportConfirmationScreen} />
        <Stack.Screen name="PetTransportTracking" component={PetTransportTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('Fluxo de Transporte de Pets', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('deve permitir selecionar o serviço de transporte de pets na tela de seleção', () => {
    const { getByTestId } = render(<TestNavigator />);
    
    // Verificar se o card de transporte de pets está presente
    const petCard = getByTestId('serviceCard-pet');
    expect(petCard).toBeTruthy();
    
    // Simular clique no card de transporte de pets
    fireEvent.press(petCard);
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('PetTransportDetails');
  });

  it('deve permitir configurar os detalhes do transporte de pets', () => {
    const { getByTestId, getByText } = render(<PetTransportDetailsScreen />);
    
    // Verificar se os tipos de porte estão presentes
    const smallPet = getByTestId('petSize-small');
    const mediumPet = getByTestId('petSize-medium');
    expect(smallPet).toBeTruthy();
    expect(mediumPet).toBeTruthy();
    
    // Simular seleção de porte médio
    fireEvent.press(mediumPet);
    
    // Verificar se os tipos de acompanhamento estão presentes
    const withoutOwner = getByTestId('accompaniment-without_owner');
    expect(withoutOwner).toBeTruthy();
    
    // Simular seleção de acompanhamento sem tutor
    fireEvent.press(withoutOwner);
    
    // Simular entrada de informações adicionais
    const additionalInfoInput = getByTestId('additionalInfo');
    fireEvent.changeText(additionalInfoInput, 'Rex, cachorro dócil');
    
    // Simular ativação da transportadora
    const carrierSwitch = getByTestId('carrierSwitch');
    fireEvent.valueChange(carrierSwitch, true);
    
    // Simular clique no botão de continuar
    const continueButton = getByTestId('continueButton');
    fireEvent.press(continueButton);
    
    // Verificar se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('SelectDestination', {
      serviceType: 'pet',
      petTransportDetails: expect.objectContaining({
        petSize: 'medium',
        accompaniment: 'without_owner',
        additionalInfo: 'Rex, cachorro dócil',
        carrierEnabled: true,
      }),
    });
  });

  it('deve exibir o resumo do transporte na tela de confirmação', () => {
    const { getByText, getByTestId } = render(<PetTransportConfirmationScreen />);
    
    // Verificar se o resumo do transporte está presente
    expect(getByText('Resumo do Transporte')).toBeTruthy();
    expect(getByText('Pequeno')).toBeTruthy();
    expect(getByText('Com Tutor')).toBeTruthy();
    
    // Verificar se os endereços estão presentes
    expect(getByText('Origem')).toBeTruthy();
    expect(getByText('Destino')).toBeTruthy();
    expect(getByText('Endereço de origem')).toBeTruthy();
    expect(getByText('Endereço de destino')).toBeTruthy();
    
    // Verificar se o preço está presente
    expect(getByText('Valor Total:')).toBeTruthy();
    
    // Verificar se o selo de parceiro verificado está presente
    expect(getByText('Parceiro Verificado')).toBeTruthy();
    expect(getByText('Selo Pet')).toBeTruthy();
    
    // Simular clique no botão de confirmar
    const confirmButton = getByTestId('confirmButton');
    fireEvent.press(confirmButton);
    
    // Verificar se a navegação foi chamada corretamente (após o timeout)
    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('PetTransportTracking', expect.anything());
    });
  });

  it('deve exibir o acompanhamento do transporte na tela de tracking', () => {
    const { getByTestId, getByText } = render(<PetTransportTrackingScreen />);
    
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
