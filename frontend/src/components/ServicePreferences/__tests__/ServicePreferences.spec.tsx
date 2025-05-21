import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes a serem testados
import PaymentPreferences from '../PaymentPreferences';
import ServicePreferencesManager from '../ServicePreferencesManager';

// Mock para o AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock para o Lottie
jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => <View testID="mock-lottie" />,
  };
});

// Mock para o Vibration
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  return {
    ...rn,
    Vibration: {
      vibrate: jest.fn(),
    },
  };
});

describe('PaymentPreferences Component', () => {
  const mockServiceType = {
    id: 'standard',
    name: 'Corrida Tradicional',
  };
  
  const mockPaymentMethods = [
    {
      id: 'card1',
      type: 'credit',
      name: 'Cartão de Crédito',
      details: '**** **** **** 1234',
      isDefault: true,
    },
    {
      id: 'card2',
      type: 'debit',
      name: 'Cartão de Débito',
      details: '**** **** **** 5678',
      isDefault: false,
    },
  ];
  
  const mockOnSelectDefault = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente com os métodos de pagamento', () => {
    const { getByText, getAllByTestId } = render(
      <PaymentPreferences
        serviceType={mockServiceType}
        paymentMethods={mockPaymentMethods}
        onSelectDefault={mockOnSelectDefault}
        onClose={mockOnClose}
      />
    );
    
    // Verificar título
    expect(getByText(`Pagamento Padrão para ${mockServiceType.name}`)).toBeTruthy();
    
    // Verificar métodos de pagamento
    expect(getByText('Cartão de Crédito')).toBeTruthy();
    expect(getByText('Cartão de Débito')).toBeTruthy();
    
    // Verificar detalhes dos métodos
    expect(getByText('**** **** **** 1234')).toBeTruthy();
    expect(getByText('**** **** **** 5678')).toBeTruthy();
  });

  it('deve chamar onSelectDefault quando um método de pagamento é selecionado', () => {
    const { getByTestId } = render(
      <PaymentPreferences
        serviceType={mockServiceType}
        paymentMethods={mockPaymentMethods}
        onSelectDefault={mockOnSelectDefault}
        onClose={mockOnClose}
      />
    );
    
    // Simular clique no segundo método de pagamento
    fireEvent.press(getByTestId('paymentMethod-card2'));
    
    // Verificar se a função foi chamada com o ID correto
    expect(mockOnSelectDefault).toHaveBeenCalledWith('card2');
  });

  it('deve chamar onClose quando o botão de fechar é pressionado', () => {
    const { getByTestId } = render(
      <PaymentPreferences
        serviceType={mockServiceType}
        paymentMethods={mockPaymentMethods}
        onSelectDefault={mockOnSelectDefault}
        onClose={mockOnClose}
      />
    );
    
    // Simular clique no botão de fechar
    fireEvent.press(getByTestId('closeButton'));
    
    // Verificar se a função foi chamada
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('deve chamar onClose quando o botão de salvar é pressionado', () => {
    const { getByTestId } = render(
      <PaymentPreferences
        serviceType={mockServiceType}
        paymentMethods={mockPaymentMethods}
        onSelectDefault={mockOnSelectDefault}
        onClose={mockOnClose}
      />
    );
    
    // Simular clique no botão de salvar
    fireEvent.press(getByTestId('saveButton'));
    
    // Verificar se a função foi chamada
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('deve mostrar animação de pontos quando showAnimation é true', () => {
    const { getByText } = render(
      <PaymentPreferences
        serviceType={mockServiceType}
        paymentMethods={mockPaymentMethods}
        onSelectDefault={mockOnSelectDefault}
        onClose={mockOnClose}
        showAnimation={true}
      />
    );
    
    // Verificar se a animação de pontos é exibida
    expect(getByText('+15 pontos')).toBeTruthy();
  });
});

describe('ServicePreferencesManager Component', () => {
  const mockServiceId = 'standard';
  const mockServiceName = 'Corrida Tradicional';
  const mockOnPreferenceChange = jest.fn();
  const mockChildProps = {};
  
  const mockPreferences = {
    serviceId: mockServiceId,
    defaultPaymentMethodId: 'card2',
  };
  
  const MockChild = (props) => {
    return (
      <button
        data-testid="mock-child"
        onClick={() => props.openPreferences && props.openPreferences()}
      >
        Mock Child
      </button>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock para AsyncStorage.getItem
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === `preferences_${mockServiceId}`) {
        return Promise.resolve(JSON.stringify(mockPreferences));
      }
      return Promise.resolve(null);
    });
    
    // Mock para AsyncStorage.setItem
    AsyncStorage.setItem.mockImplementation(() => Promise.resolve());
  });

  it('deve carregar preferências salvas ao montar', async () => {
    render(
      <ServicePreferencesManager
        serviceId={mockServiceId}
        serviceName={mockServiceName}
        onPreferenceChange={mockOnPreferenceChange}
      >
        <MockChild {...mockChildProps} />
      </ServicePreferencesManager>
    );
    
    // Verificar se AsyncStorage.getItem foi chamado com a chave correta
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(`preferences_${mockServiceId}`);
    
    // Verificar se onPreferenceChange foi chamado com as preferências carregadas
    await waitFor(() => {
      expect(mockOnPreferenceChange).toHaveBeenCalledWith(mockPreferences);
    });
  });

  it('deve abrir modal de preferências quando openPreferences é chamado', () => {
    const { getByTestId, queryByText } = render(
      <ServicePreferencesManager
        serviceId={mockServiceId}
        serviceName={mockServiceName}
        onPreferenceChange={mockOnPreferenceChange}
      >
        <MockChild {...mockChildProps} />
      </ServicePreferencesManager>
    );
    
    // Verificar que o modal não está visível inicialmente
    expect(queryByText(`Pagamento Padrão para ${mockServiceName}`)).toBeNull();
    
    // Simular clique no filho para abrir preferências
    fireEvent.press(getByTestId('mock-child'));
    
    // Verificar que o modal está visível
    expect(queryByText(`Pagamento Padrão para ${mockServiceName}`)).toBeTruthy();
  });

  it('deve salvar preferências quando um método de pagamento é selecionado', async () => {
    const { getByTestId, getByText } = render(
      <ServicePreferencesManager
        serviceId={mockServiceId}
        serviceName={mockServiceName}
        onPreferenceChange={mockOnPreferenceChange}
      >
        <MockChild {...mockChildProps} />
      </ServicePreferencesManager>
    );
    
    // Simular clique no filho para abrir preferências
    fireEvent.press(getByTestId('mock-child'));
    
    // Simular clique em um método de pagamento
    fireEvent.press(getByTestId('paymentMethod-card2'));
    
    // Verificar se AsyncStorage.setItem foi chamado com os parâmetros corretos
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `preferences_${mockServiceId}`,
        JSON.stringify({
          serviceId: mockServiceId,
          defaultPaymentMethodId: 'card2',
        })
      );
    });
    
    // Verificar se onPreferenceChange foi chamado com as novas preferências
    expect(mockOnPreferenceChange).toHaveBeenCalledWith({
      serviceId: mockServiceId,
      defaultPaymentMethodId: 'card2',
    });
  });
});
