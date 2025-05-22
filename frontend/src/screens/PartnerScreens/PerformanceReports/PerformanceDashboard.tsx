import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

// Componentes
import { Card, FilterPeriod, MetricCard, LoadingOverlay } from '../../../components';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Serviços
import { PartnerService } from '../../../services/PartnerService';

// Tipos
interface PerformanceDashboardProps {
  navigation: any;
}

/**
 * Dashboard de Desempenho para Parceiros
 * 
 * Esta tela apresenta um dashboard com métricas e visualizações sobre o desempenho
 * do parceiro, incluindo ganhos, corridas realizadas, avaliações e tendências.
 * 
 * @param {PerformanceDashboardProps} props - Propriedades do componente
 * @returns {React.ReactElement} Tela de dashboard de desempenho
 */
const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ navigation }) => {
  // Estados
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Dimensões da tela
  const screenWidth = Dimensions.get('window').width;

  // Efeito para carregar dados ao focar na tela
  useFocusEffect(
    useCallback(() => {
      loadPerformanceData();
    }, [period])
  );

  // Função para carregar dados de desempenho
  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar dados do serviço
      const data = await PartnerService.getPerformanceData(period);
      setPerformanceData(data);
    } catch (err) {
      console.error('Erro ao carregar dados de desempenho:', err);
      setError('Não foi possível carregar os dados de desempenho. Tente novamente.');
      
      // Dados mockados para desenvolvimento
      setPerformanceData(getMockPerformanceData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para atualizar dados (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    loadPerformanceData();
  };

  // Função para navegar para relatório detalhado
  const navigateToDetailedReport = (reportType: string) => {
    navigation.navigate('DetailedReport', { reportType, period });
  };

  // Renderizar conteúdo do dashboard
  const renderDashboardContent = () => {
    if (!performanceData) return null;

    return (
      <>
        {/* Métricas principais */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Ganhos Totais"
            value={`R$ ${performanceData.earnings.total.toFixed(2)}`}
            icon="cash"
            color={COLORS.success}
            trend={performanceData.earnings.trend}
            onPress={() => navigateToDetailedReport('earnings')}
          />
          <MetricCard
            title="Corridas"
            value={performanceData.rides.total.toString()}
            icon="car"
            color={COLORS.primary}
            trend={performanceData.rides.trend}
            onPress={() => navigateToDetailedReport('rides')}
          />
          <MetricCard
            title="Avaliação"
            value={performanceData.rating.average.toFixed(1)}
            icon="star"
            color={COLORS.warning}
            trend={performanceData.rating.trend}
            onPress={() => navigateToDetailedReport('rating')}
          />
          <MetricCard
            title="Taxa de Aceitação"
            value={`${performanceData.acceptanceRate.value}%`}
            icon="checkmark-circle"
            color={COLORS.info}
            trend={performanceData.acceptanceRate.trend}
            onPress={() => navigateToDetailedReport('acceptance')}
          />
        </View>

        {/* Gráfico de ganhos */}
        <Card title="Ganhos por Período" style={styles.chartCard}>
          <LineChart
            data={{
              labels: performanceData.earnings.chart.labels,
              datasets: [
                {
                  data: performanceData.earnings.chart.data,
                },
              ],
            }}
            width={screenWidth - 50}
            height={220}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(27, 118, 188, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: COLORS.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigateToDetailedReport('earnings')}
          >
            <Text style={styles.viewMoreText}>Ver Detalhes</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>

        {/* Distribuição de serviços */}
        <Card title="Distribuição por Tipo de Serviço" style={styles.chartCard}>
          <PieChart
            data={performanceData.serviceDistribution.map((item: any) => ({
              name: item.name,
              value: item.value,
              color: item.color,
              legendFontColor: '#7F7F7F',
              legendFontSize: 12,
            }))}
            width={screenWidth - 50}
            height={200}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigateToDetailedReport('services')}
          >
            <Text style={styles.viewMoreText}>Ver Detalhes</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>

        {/* Avaliações recentes */}
        <Card title="Avaliações Recentes" style={styles.ratingsCard}>
          {performanceData.recentRatings.map((rating: any, index: number) => (
            <View key={index} style={styles.ratingItem}>
              <View style={styles.ratingHeader}>
                <View style={styles.ratingStars}>
                  {Array(5).fill(0).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < rating.stars ? 'star' : 'star-outline'}
                      size={16}
                      color={i < rating.stars ? COLORS.warning : COLORS.lightGray}
                    />
                  ))}
                </View>
                <Text style={styles.ratingDate}>{rating.date}</Text>
              </View>
              {rating.comment && (
                <Text style={styles.ratingComment}>{rating.comment}</Text>
              )}
              <View style={styles.ratingService}>
                <Ionicons name={rating.serviceIcon} size={14} color={COLORS.darkGray} />
                <Text style={styles.ratingServiceText}>{rating.serviceType}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigateToDetailedReport('ratings')}
          >
            <Text style={styles.viewMoreText}>Ver Todas Avaliações</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>

        {/* Dicas e recomendações */}
        <Card title="Dicas para Aumentar seus Ganhos" style={styles.tipsCard}>
          {performanceData.tips.map((tip: any, index: number) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipIconContainer}>
                <Ionicons name={tip.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </Card>
      </>
    );
  };

  // Renderizar mensagem de erro
  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPerformanceData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard de Desempenho</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => navigation.navigate('PerformanceHelp')}
        >
          <Ionicons name="help-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Filtros de período */}
      <FilterPeriod
        selectedPeriod={period}
        onSelectPeriod={setPeriod}
        style={styles.filterPeriod}
      />

      {/* Conteúdo principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <LoadingOverlay message="Carregando dados de desempenho..." />
        ) : error ? (
          renderError()
        ) : (
          renderDashboardContent()
        )}
      </ScrollView>
    </View>
  );
};

// Dados mockados para desenvolvimento
const getMockPerformanceData = () => {
  return {
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
      {
        stars: 5,
        date: '18/05/2025',
        comment: 'Muito atencioso com meu pet, recomendo!',
        serviceType: 'Transporte de Pet',
        serviceIcon: 'paw',
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
      {
        icon: 'star',
        title: 'Melhore sua Avaliação',
        description: 'Mantenha o veículo limpo e ofereça uma experiência agradável.',
      },
    ],
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  helpButton: {
    padding: 5,
  },
  filterPeriod: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  chartCard: {
    marginTop: 20,
    paddingVertical: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 8,
  },
  viewMoreText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  ratingsCard: {
    marginTop: 20,
  },
  ratingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  ratingDate: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  ratingComment: {
    fontSize: 14,
    color: COLORS.darkText,
    marginBottom: 5,
  },
  ratingService: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingServiceText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginLeft: 5,
  },
  tipsCard: {
    marginTop: 20,
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(27, 118, 188, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.darkText,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PerformanceDashboard;
