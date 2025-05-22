import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Componente a ser testado
import PerformanceDashboard from '../PerformanceDashboard';

// Mock do serviço
jest.mock('../../../../services/PartnerService', () => ({
  PartnerService: {
    getPerformanceData: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        earnings: {
          total: 1250.75,
          trend: 8.5,
          chart: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            data: [150, 180, 190, 165, 210, 220, 135],
          },
        },
        rides: {
          total: 42,
          trend: 5.2,
        },
        rating: {
          average: 4.8,
          trend: 0.2,
        },
        acceptanceRate: {
          value: 95,
          trend: -2.1,
        },
        serviceDistribution: [
          { name: 'Corridas', value: 65, color: '#1B76BC' },
          { name: 'Entregas', value: 20, color: '#FF9500' },
          { name: 'Pets', value: 10, color: '#4CD964' },
          { name: 'Acessível', value: 5, color: '#FF3B30' },
        ],
        recentRatings: [
          {
            stars: 5,
            date: '20/05/2025',
            comment: 'Motorista excelente, muito pontual e educado!',
            serviceType: 'Corrida Tradicional',
            serviceIcon: 'car',
          },
          {
            stars: 4,
            date: '19/05/2025',
            comment: 'Boa viagem, apenas um pouco de atraso.',
            serviceType: 'Viagem Longa',
            serviceIcon: 'map',
          },
        ],
        tips: [
          {
            icon: 'time',
            title: 'Horários de Pico',
            description: 'Fique ativo entre 7-9h e 17-19h para maximizar seus ganhos.',
          },
          {
            icon: 'location',
            title: 'Áreas de Alta Demanda',
            description: 'Região central e zona empresarial têm maior demanda durante a semana.',
          },
        ],
      });
    }),
  },
}));

// Mock dos componentes de gráfico
jest.mock('react-native-chart-kit', () => {
  const { View, Text } = require('react-native');
  return {
    LineChart: ({ data }) => (
      <View testID="line-chart">
        <Text>LineChart Mock</Text>
        <Text>{JSON.stringify(data.labels)}</Text>
      </View>
    ),
    BarChart: ({ data }) => (
      <View testID="bar-chart">
        <Text>BarChart Mock</Text>
        <Text>{JSON.stringify(data.labels)}</Text>
      </View>
    ),
    PieChart: ({ data }) => (
      <View testID="pie-chart">
        <Text>PieChart Mock</Text>
        <Text>{JSON.stringify(data.map(item => item.name))}</Text>
      </View>
    ),
  };
});

// Mock do componente de ícone
jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    Ionicons: ({ name, size, color }) => (
      <View>
        <Text>{`Icon: ${name}`}</Text>
      </View>
    ),
  };
});

// Setup para navegação
const Stack = createStackNavigator();
const MockNavigator = ({ component, params = {} }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="MockScreen"
        component={component}
        initialParams={params}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('PerformanceDashboard', () => {
  it('renderiza corretamente com estado de carregamento inicial', () => {
    const { getByText, queryByText } = render(
      <MockNavigator component={PerformanceDashboard} />
    );
    
    // Verifica se o título está presente
    expect(getByText('Dashboard de Desempenho')).toBeTruthy();
    
    // Verifica se o indicador de carregamento está presente
    expect(getByText(/Carregando dados de desempenho/i)).toBeTruthy();
    
    // Verifica se o conteúdo ainda não está visível
    expect(queryByText('Ganhos Totais')).toBeNull();
  });
  
  it('exibe os dados de desempenho após o carregamento', async () => {
    const { getByText, queryByText, findByText } = render(
      <MockNavigator component={PerformanceDashboard} />
    );
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(queryByText(/Carregando dados de desempenho/i)).toBeNull();
    });
    
    // Verifica se as métricas principais estão presentes
    expect(await findByText('Ganhos Totais')).toBeTruthy();
    expect(await findByText('R$ 1250.75')).toBeTruthy();
    expect(await findByText('Corridas')).toBeTruthy();
    expect(await findByText('42')).toBeTruthy();
    expect(await findByText('Avaliação')).toBeTruthy();
    expect(await findByText('4.8')).toBeTruthy();
    expect(await findByText('Taxa de Aceitação')).toBeTruthy();
    expect(await findByText('95%')).toBeTruthy();
    
    // Verifica se os títulos das seções estão presentes
    expect(await findByText('Ganhos por Período')).toBeTruthy();
    expect(await findByText('Distribuição por Tipo de Serviço')).toBeTruthy();
    expect(await findByText('Avaliações Recentes')).toBeTruthy();
    expect(await findByText('Dicas para Aumentar seus Ganhos')).toBeTruthy();
    
    // Verifica se os comentários de avaliações estão presentes
    expect(await findByText('Motorista excelente, muito pontual e educado!')).toBeTruthy();
    expect(await findByText('Boa viagem, apenas um pouco de atraso.')).toBeTruthy();
    
    // Verifica se as dicas estão presentes
    expect(await findByText('Horários de Pico')).toBeTruthy();
    expect(await findByText('Áreas de Alta Demanda')).toBeTruthy();
  });
  
  it('permite alternar entre diferentes períodos', async () => {
    const { getByText, findByText, getByTestId } = render(
      <MockNavigator component={PerformanceDashboard} />
    );
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(getByText('Ganhos Totais')).toBeTruthy();
    });
    
    // Verifica se os filtros de período estão presentes
    expect(await findByTestId('period-day')).toBeTruthy();
    expect(await findByTestId('period-week')).toBeTruthy();
    expect(await findByTestId('period-month')).toBeTruthy();
    
    // Clica no filtro de período "Mês"
    fireEvent.press(getByTestId('period-month'));
    
    // Verifica se o serviço foi chamado novamente com o novo período
    await waitFor(() => {
      expect(require('../../../../services/PartnerService').PartnerService.getPerformanceData).toHaveBeenCalledWith('month');
    });
  });
  
  it('navega para relatório detalhado ao clicar em uma métrica', async () => {
    const mockNavigate = jest.fn();
    const { getByText, findByText } = render(
      <PerformanceDashboard navigation={{ navigate: mockNavigate }} />
    );
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(getByText('Ganhos Totais')).toBeTruthy();
    });
    
    // Clica na métrica de ganhos
    const ganhosTotais = await findByText('Ganhos Totais');
    fireEvent.press(ganhosTotais);
    
    // Verifica se a navegação foi chamada corretamente
    expect(mockNavigate).toHaveBeenCalledWith('DetailedReport', {
      reportType: 'earnings',
      period: 'week',
    });
  });
  
  it('exibe mensagem de erro quando o carregamento falha', async () => {
    // Mock de erro no serviço
    require('../../../../services/PartnerService').PartnerService.getPerformanceData.mockImplementationOnce(() => {
      return Promise.reject(new Error('Falha na conexão'));
    });
    
    const { findByText } = render(
      <MockNavigator component={PerformanceDashboard} />
    );
    
    // Verifica se a mensagem de erro é exibida
    expect(await findByText(/Não foi possível carregar os dados de desempenho/i)).toBeTruthy();
    expect(await findByText('Tentar Novamente')).toBeTruthy();
  });
  
  it('permite atualizar os dados ao clicar em tentar novamente', async () => {
    // Mock de erro no serviço apenas na primeira chamada
    const getPerformanceData = require('../../../../services/PartnerService').PartnerService.getPerformanceData;
    getPerformanceData.mockImplementationOnce(() => {
      return Promise.reject(new Error('Falha na conexão'));
    });
    
    const { findByText } = render(
      <MockNavigator component={PerformanceDashboard} />
    );
    
    // Aguarda a exibição da mensagem de erro
    const retryButton = await findByText('Tentar Novamente');
    
    // Reseta o mock para sucesso na próxima chamada
    getPerformanceData.mockImplementationOnce(() => {
      return Promise.resolve({
        earnings: { total: 1250.75, trend: 8.5, chart: { labels: [], data: [] } },
        rides: { total: 42, trend: 5.2 },
        rating: { average: 4.8, trend: 0.2 },
        acceptanceRate: { value: 95, trend: -2.1 },
        serviceDistribution: [],
        recentRatings: [],
        tips: [],
      });
    });
    
    // Clica no botão de tentar novamente
    fireEvent.press(retryButton);
    
    // Verifica se os dados são carregados após tentar novamente
    expect(await findByText('Ganhos Totais')).toBeTruthy();
  });
});
