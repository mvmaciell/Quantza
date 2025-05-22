import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Componente a ser testado
import DetailedReport from '../DetailedReport';

// Mock do serviço
jest.mock('../../../../services/PartnerService', () => ({
  PartnerService: {
    getEarningsReport: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        summary: {
          gross: 1250.75,
          fees: 187.61,
          net: 1063.14,
          comparison: {
            trend: 8.5,
            value: 83.45,
          },
        },
        details: {
          services: [
            {
              id: '1',
              date: '20/05/2025',
              type: 'Corrida Tradicional',
              icon: 'car',
              value: 35.50,
              distance: 12.5,
              duration: 25,
            },
            {
              id: '2',
              date: '19/05/2025',
              type: 'Viagem Longa',
              icon: 'map',
              value: 120.75,
              distance: 45.2,
              duration: 65,
            },
          ],
          hasMore: true,
        },
        chart: {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          data: [150, 180, 190, 165, 210, 220, 135],
        },
        analysis: {
          averagePerRide: 29.75,
          averagePerHour: 45.20,
          averagePerKm: 2.35,
        },
      });
    }),
    getRidesReport: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        summary: {
          total: 42,
          totalDistance: 385.5,
          totalDuration: 15.5,
          comparison: {
            trend: 5.2,
            value: 2,
          },
        },
        details: {
          rides: [
            {
              id: '1',
              date: '20/05/2025',
              type: 'Corrida Tradicional',
              icon: 'car',
              value: 35.50,
              distance: 12.5,
              duration: 25,
            },
            {
              id: '2',
              date: '19/05/2025',
              type: 'Viagem Longa',
              icon: 'map',
              value: 120.75,
              distance: 45.2,
              duration: 65,
            },
          ],
          hasMore: true,
        },
        chart: {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          data: [5, 7, 8, 6, 9, 5, 2],
        },
        analysis: {
          averageArrivalTime: 4.5,
          averageDuration: 22.3,
          cancellationRate: 3.2,
        },
      });
    }),
    getRatingsReport: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        summary: {
          average: 4.8,
          total: 38,
          fiveStars: 32,
          comparison: {
            trend: 0.2,
            value: 0.1,
          },
        },
        details: {
          comments: [
            {
              stars: 5,
              date: '20/05/2025',
              text: 'Motorista excelente, muito pontual e educado!',
              serviceType: 'Corrida Tradicional',
              serviceIcon: 'car',
            },
            {
              stars: 4,
              date: '19/05/2025',
              text: 'Boa viagem, apenas um pouco de atraso.',
              serviceType: 'Viagem Longa',
              serviceIcon: 'map',
            },
          ],
          hasMore: true,
        },
        chart: {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          data: [4.7, 4.8, 5.0, 4.9, 4.8, 4.7, 4.9],
        },
        analysis: {
          distribution: {
            5: 32,
            4: 5,
            3: 1,
            2: 0,
            1: 0,
          },
        },
      });
    }),
    exportReport: jest.fn().mockImplementation(() => {
      return Promise.resolve({ success: true });
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

describe('DetailedReport', () => {
  it('renderiza corretamente o relatório de ganhos', async () => {
    const { getByText, findByText } = render(
      <MockNavigator 
        component={DetailedReport} 
        params={{ reportType: 'earnings', period: 'week' }}
      />
    );
    
    // Verifica se o título está presente
    expect(getByText('Relatório de Ganhos')).toBeTruthy();
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(getByText('Resumo Financeiro')).toBeTruthy();
    });
    
    // Verifica se os dados do resumo financeiro estão presentes
    expect(await findByText('Ganhos Brutos')).toBeTruthy();
    expect(await findByText('R$ 1250.75')).toBeTruthy();
    expect(await findByText('Taxas')).toBeTruthy();
    expect(await findByText('R$ 187.61')).toBeTruthy();
    expect(await findByText('Ganhos Líquidos')).toBeTruthy();
    expect(await findByText('R$ 1063.14')).toBeTruthy();
    
    // Verifica se a análise de rentabilidade está presente
    expect(await findByText('Análise de Rentabilidade')).toBeTruthy();
    expect(await findByText('Ganho médio por corrida')).toBeTruthy();
    expect(await findByText('R$ 29.75')).toBeTruthy();
    expect(await findByText('Ganho médio por hora')).toBeTruthy();
    expect(await findByText('R$ 45.20')).toBeTruthy();
    expect(await findByText('Ganho médio por km')).toBeTruthy();
    expect(await findByText('R$ 2.35')).toBeTruthy();
    
    // Verifica se o detalhamento por serviço está presente
    expect(await findByText('Detalhamento por Serviço')).toBeTruthy();
    expect(await findByText('20/05/2025')).toBeTruthy();
    expect(await findByText('Corrida Tradicional')).toBeTruthy();
    expect(await findByText('R$ 35.50')).toBeTruthy();
    expect(await findByText('19/05/2025')).toBeTruthy();
    expect(await findByText('Viagem Longa')).toBeTruthy();
    expect(await findByText('R$ 120.75')).toBeTruthy();
  });
  
  it('renderiza corretamente o relatório de corridas', async () => {
    const { getByText, findByText } = render(
      <MockNavigator 
        component={DetailedReport} 
        params={{ reportType: 'rides', period: 'week' }}
      />
    );
    
    // Verifica se o título está presente
    expect(getByText('Relatório de Corridas')).toBeTruthy();
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(getByText('Resumo de Corridas')).toBeTruthy();
    });
    
    // Verifica se os dados do resumo de corridas estão presentes
    expect(await findByText('Total de Corridas')).toBeTruthy();
    expect(await findByText('42')).toBeTruthy();
    expect(await findByText('Distância Total')).toBeTruthy();
    expect(await findByText('385.5 km')).toBeTruthy();
    expect(await findByText('Tempo Total')).toBeTruthy();
    expect(await findByText('15.5 h')).toBeTruthy();
    
    // Verifica se a análise de eficiência está presente
    expect(await findByText('Análise de Eficiência')).toBeTruthy();
    expect(await findByText('Tempo médio de chegada')).toBeTruthy();
    expect(await findByText('4.5 min')).toBeTruthy();
    expect(await findByText('Duração média por corrida')).toBeTruthy();
    expect(await findByText('22.3 min')).toBeTruthy();
    expect(await findByText('Taxa de cancelamento')).toBeTruthy();
    expect(await findByText('3.2%')).toBeTruthy();
    
    // Verifica se o detalhamento de corridas está presente
    expect(await findByText('Detalhamento de Corridas')).toBeTruthy();
    expect(await findByText('20/05/2025')).toBeTruthy();
    expect(await findByText('Corrida Tradicional')).toBeTruthy();
    expect(await findByText('R$ 35.50')).toBeTruthy();
    expect(await findByText('19/05/2025')).toBeTruthy();
    expect(await findByText('Viagem Longa')).toBeTruthy();
    expect(await findByText('R$ 120.75')).toBeTruthy();
  });
  
  it('renderiza corretamente o relatório de avaliações', async () => {
    const { getByText, findByText } = render(
      <MockNavigator 
        component={DetailedReport} 
        params={{ reportType: 'ratings', period: 'week' }}
      />
    );
    
    // Verifica se o título está presente
    expect(getByText('Relatório de Avaliações')).toBeTruthy();
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(getByText('Resumo de Avaliações')).toBeTruthy();
    });
    
    // Verifica se os dados do resumo de avaliações estão presentes
    expect(await findByText('Avaliação Média')).toBeTruthy();
    expect(await findByText('4.8')).toBeTruthy();
    expect(await findByText('Total de Avaliações')).toBeTruthy();
    expect(await findByText('38')).toBeTruthy();
    expect(await findByText('Avaliações 5 estrelas')).toBeTruthy();
    expect(await findByText('32 (84%)')).toBeTruthy();
    
    // Verifica se a distribuição de avaliações está presente
    expect(await findByText('Distribuição de Avaliações')).toBeTruthy();
    
    // Verifica se os comentários recentes estão presentes
    expect(await findByText('Comentários Recentes')).toBeTruthy();
    expect(await findByText('Motorista excelente, muito pontual e educado!')).toBeTruthy();
    expect(await findByText('Boa viagem, apenas um pouco de atraso.')).toBeTruthy();
  });
  
  it('permite alternar entre diferentes períodos', async () => {
    const { getByText, findByTestId } = render(
      <MockNavigator 
        component={DetailedReport} 
        params={{ reportType: 'earnings', period: 'week' }}
      />
    );
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(getByText('Resumo Financeiro')).toBeTruthy();
    });
    
    // Verifica se os filtros de período estão presentes
    expect(await findByTestId('period-day')).toBeTruthy();
    expect(await findByTestId('period-week')).toBeTruthy();
    expect(await findByTestId('period-month')).toBeTruthy();
    
    // Clica no filtro de período "Mês"
    fireEvent.press(await findByTestId('period-month'));
    
    // Verifica se o serviço foi chamado novamente com o novo período
    await waitFor(() => {
      expect(require('../../../../services/PartnerService').PartnerService.getEarningsReport).toHaveBeenCalledWith('month', {});
    });
  });
  
  it('permite exportar o relatório', async () => {
    const mockGoBack = jest.fn();
    const { getByText } = render(
      <DetailedReport 
        navigation={{ goBack: mockGoBack }} 
        route={{ params: { reportType: 'earnings', period: 'week' } }}
      />
    );
    
    // Aguarda o carregamento dos dados
    await waitFor(() => {
      expect(getByText('Resumo Financeiro')).toBeTruthy();
    });
    
    // Encontra e clica no botão de exportar
    const exportButton = getByText('Icon: download');
    fireEvent.press(exportButton);
    
    // Verifica se o serviço de exportação foi chamado
    await waitFor(() => {
      expect(require('../../../../services/PartnerService').PartnerService.exportReport).toHaveBeenCalledWith('earnings', 'pdf', 'week', {});
    });
  });
  
  it('exibe mensagem de erro quando o carregamento falha', async () => {
    // Mock de erro no serviço
    require('../../../../services/PartnerService').PartnerService.getEarningsReport.mockImplementationOnce(() => {
      return Promise.reject(new Error('Falha na conexão'));
    });
    
    const { findByText } = render(
      <MockNavigator 
        component={DetailedReport} 
        params={{ reportType: 'earnings', period: 'week' }}
      />
    );
    
    // Verifica se a mensagem de erro é exibida
    expect(await findByText(/Não foi possível carregar os dados do relatório/i)).toBeTruthy();
    expect(await findByText('Tentar Novamente')).toBeTruthy();
  });
  
  it('permite voltar para a tela anterior', async () => {
    const mockGoBack = jest.fn();
    const { getByText } = render(
      <DetailedReport 
        navigation={{ goBack: mockGoBack }} 
        route={{ params: { reportType: 'earnings', period: 'week' } }}
      />
    );
    
    // Encontra e clica no botão de voltar
    const backButton = getByText('Icon: arrow-back');
    fireEvent.press(backButton);
    
    // Verifica se a função de voltar foi chamada
    expect(mockGoBack).toHaveBeenCalled();
  });
});
