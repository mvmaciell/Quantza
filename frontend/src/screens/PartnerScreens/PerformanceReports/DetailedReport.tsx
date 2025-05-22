import React from 'react';
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
import { useFocusEffect } from '@react-navigation/native';

// Componentes
import Card from '../../../components/Card';
import FilterPeriod from '../../../components/FilterPeriod';
import LoadingOverlay from '../../../components/LoadingOverlay';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Serviços
import { PartnerService } from '../../../services/PartnerService';

// Tipos
interface DetailedReportProps {
  navigation: any;
  route: {
    params: {
      reportType: string;
      period: string;
    };
  };
}

/**
 * Tela de Relatório Detalhado para Parceiros
 * 
 * Esta tela apresenta relatórios detalhados sobre ganhos, corridas,
 * avaliações ou outros aspectos do desempenho do parceiro.
 * 
 * @param {DetailedReportProps} props - Propriedades do componente
 * @returns {React.ReactElement} Tela de relatório detalhado
 */
const DetailedReport: React.FC<DetailedReportProps> = ({ navigation, route }) => {
  // Parâmetros da rota
  const { reportType, period: initialPeriod } = route.params;
  
  // Estados
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [period, setPeriod] = React.useState<string>(initialPeriod || 'week');
  const [reportData, setReportData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  // Dimensões da tela
  const screenWidth = Dimensions.get('window').width;
  
  // Efeito para carregar dados ao focar na tela
  useFocusEffect(
    React.useCallback(() => {
      loadReportData();
    }, [reportType, period])
  );
  
  // Função para carregar dados do relatório
  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      // Carregar dados específicos com base no tipo de relatório
      switch (reportType) {
        case 'earnings':
          data = await PartnerService.getEarningsReport(period);
          break;
        case 'rides':
          data = await PartnerService.getRidesReport(period);
          break;
        case 'rating':
        case 'ratings':
          data = await PartnerService.getRatingsReport(period);
          break;
        case 'acceptance':
          // Implementar quando o endpoint estiver disponível
          data = getMockAcceptanceData();
          break;
        case 'services':
          // Implementar quando o endpoint estiver disponível
          data = getMockServicesData();
          break;
        default:
          data = null;
          setError('Tipo de relatório não reconhecido.');
      }
      
      setReportData(data);
    } catch (err) {
      console.error(`Erro ao carregar relatório ${reportType}:`, err);
      setError('Não foi possível carregar os dados do relatório. Tente novamente.');
      
      // Dados mockados para desenvolvimento
      setReportData(getMockReportData(reportType));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Função para atualizar dados (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    loadReportData();
  };
  
  // Função para exportar relatório
  const exportReport = async (format: string) => {
    try {
      setLoading(true);
      
      // Chamar serviço de exportação
      const result = await PartnerService.exportReport(reportType, format, period);
      
      // Processar resultado (download ou abrir)
      // Implementação depende da plataforma e requisitos
      
      setLoading(false);
    } catch (err) {
      console.error(`Erro ao exportar relatório ${reportType}:`, err);
      setError('Não foi possível exportar o relatório. Tente novamente.');
      setLoading(false);
    }
  };
  
  // Obter título do relatório com base no tipo
  const getReportTitle = () => {
    switch (reportType) {
      case 'earnings':
        return 'Relatório de Ganhos';
      case 'rides':
        return 'Relatório de Corridas';
      case 'rating':
      case 'ratings':
        return 'Relatório de Avaliações';
      case 'acceptance':
        return 'Taxa de Aceitação';
      case 'services':
        return 'Distribuição de Serviços';
      default:
        return 'Relatório Detalhado';
    }
  };
  
  // Renderizar conteúdo específico com base no tipo de relatório
  const renderReportContent = () => {
    if (!reportData) return null;
    
    switch (reportType) {
      case 'earnings':
        return renderEarningsReport();
      case 'rides':
        return renderRidesReport();
      case 'rating':
      case 'ratings':
        return renderRatingsReport();
      case 'acceptance':
        return renderAcceptanceReport();
      case 'services':
        return renderServicesReport();
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Tipo de relatório não suportado.</Text>
          </View>
        );
    }
  };
  
  // Renderizar relatório de ganhos
  const renderEarningsReport = () => {
    const { summary, details, chart, analysis } = reportData;
    
    return (
      <>
        {/* Resumo financeiro */}
        <Card title="Resumo Financeiro" style={styles.card}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ganhos Brutos</Text>
              <Text style={styles.summaryValue}>R$ {summary.gross.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Taxas</Text>
              <Text style={styles.summaryValue}>R$ {summary.fees.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ganhos Líquidos</Text>
              <Text style={[styles.summaryValue, styles.highlightValue]}>
                R$ {summary.net.toFixed(2)}
              </Text>
            </View>
            
            {/* Comparativo com período anterior */}
            {summary.comparison && (
              <View style={styles.comparisonContainer}>
                <Text style={styles.comparisonLabel}>
                  Comparado ao período anterior:
                </Text>
                <View style={styles.comparisonValue}>
                  <Ionicons
                    name={summary.comparison.trend > 0 ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={summary.comparison.trend > 0 ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.comparisonText,
                      {
                        color: summary.comparison.trend > 0 ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  >
                    {Math.abs(summary.comparison.trend).toFixed(1)}% ({summary.comparison.value > 0 ? '+' : ''}
                    R$ {summary.comparison.value.toFixed(2)})
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>
        
        {/* Análise de ganhos */}
        <Card title="Análise de Rentabilidade" style={styles.card}>
          <View style={styles.analysisContainer}>
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="car" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Ganho médio por corrida</Text>
                <Text style={styles.analysisValue}>
                  R$ {analysis.averagePerRide.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Ganho médio por hora</Text>
                <Text style={styles.analysisValue}>
                  R$ {analysis.averagePerHour.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="map" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Ganho médio por km</Text>
                <Text style={styles.analysisValue}>
                  R$ {analysis.averagePerKm.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Detalhamento de serviços */}
        <Card title="Detalhamento por Serviço" style={styles.card}>
          {details.services.map((service, index) => (
            <View
              key={index}
              style={[
                styles.serviceItem,
                index < details.services.length - 1 && styles.serviceItemBorder,
              ]}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceDate}>{service.date}</Text>
                  <View style={styles.serviceType}>
                    <Ionicons name={service.icon} size={14} color={COLORS.darkGray} />
                    <Text style={styles.serviceTypeText}>{service.type}</Text>
                  </View>
                </View>
                <Text style={styles.serviceValue}>R$ {service.value.toFixed(2)}</Text>
              </View>
              
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceDetailsText}>
                  {service.distance} km • {service.duration} min
                </Text>
                <TouchableOpacity
                  style={styles.serviceDetailsButton}
                  onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
                >
                  <Text style={styles.serviceDetailsButtonText}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {details.services.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhum serviço realizado no período selecionado.
            </Text>
          )}
          
          {details.hasMore && (
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => navigation.navigate('AllServices', { period })}
            >
              <Text style={styles.viewMoreText}>Ver Todos os Serviços</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </Card>
      </>
    );
  };
  
  // Renderizar relatório de corridas
  const renderRidesReport = () => {
    const { summary, details, chart, analysis } = reportData;
    
    return (
      <>
        {/* Resumo de corridas */}
        <Card title="Resumo de Corridas" style={styles.card}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total de Corridas</Text>
              <Text style={styles.summaryValue}>{summary.total}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Distância Total</Text>
              <Text style={styles.summaryValue}>{summary.totalDistance} km</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tempo Total</Text>
              <Text style={[styles.summaryValue, styles.highlightValue]}>
                {summary.totalDuration} h
              </Text>
            </View>
            
            {/* Comparativo com período anterior */}
            {summary.comparison && (
              <View style={styles.comparisonContainer}>
                <Text style={styles.comparisonLabel}>
                  Comparado ao período anterior:
                </Text>
                <View style={styles.comparisonValue}>
                  <Ionicons
                    name={summary.comparison.trend > 0 ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={summary.comparison.trend > 0 ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.comparisonText,
                      {
                        color: summary.comparison.trend > 0 ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  >
                    {Math.abs(summary.comparison.trend).toFixed(1)}% ({summary.comparison.value > 0 ? '+' : ''}
                    {summary.comparison.value} corridas)
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>
        
        {/* Análise de corridas */}
        <Card title="Análise de Eficiência" style={styles.card}>
          <View style={styles.analysisContainer}>
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="speedometer" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Tempo médio de chegada</Text>
                <Text style={styles.analysisValue}>
                  {analysis.averageArrivalTime} min
                </Text>
              </View>
            </View>
            
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="timer" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Duração média por corrida</Text>
                <Text style={styles.analysisValue}>
                  {analysis.averageDuration} min
                </Text>
              </View>
            </View>
            
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="close-circle" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Taxa de cancelamento</Text>
                <Text style={styles.analysisValue}>
                  {analysis.cancellationRate}%
                </Text>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Detalhamento de corridas */}
        <Card title="Detalhamento de Corridas" style={styles.card}>
          {details.rides.map((ride, index) => (
            <View
              key={index}
              style={[
                styles.serviceItem,
                index < details.rides.length - 1 && styles.serviceItemBorder,
              ]}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceDate}>{ride.date}</Text>
                  <View style={styles.serviceType}>
                    <Ionicons name={ride.icon} size={14} color={COLORS.darkGray} />
                    <Text style={styles.serviceTypeText}>{ride.type}</Text>
                  </View>
                </View>
                <Text style={styles.serviceValue}>R$ {ride.value.toFixed(2)}</Text>
              </View>
              
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceDetailsText}>
                  {ride.distance} km • {ride.duration} min
                </Text>
                <TouchableOpacity
                  style={styles.serviceDetailsButton}
                  onPress={() => navigation.navigate('RideDetails', { rideId: ride.id })}
                >
                  <Text style={styles.serviceDetailsButtonText}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {details.rides.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhuma corrida realizada no período selecionado.
            </Text>
          )}
          
          {details.hasMore && (
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => navigation.navigate('AllRides', { period })}
            >
              <Text style={styles.viewMoreText}>Ver Todas as Corridas</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </Card>
      </>
    );
  };
  
  // Renderizar relatório de avaliações
  const renderRatingsReport = () => {
    const { summary, details, chart, analysis } = reportData;
    
    return (
      <>
        {/* Resumo de avaliações */}
        <Card title="Resumo de Avaliações" style={styles.card}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avaliação Média</Text>
              <Text style={styles.summaryValue}>{summary.average.toFixed(1)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total de Avaliações</Text>
              <Text style={styles.summaryValue}>{summary.total}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avaliações 5 estrelas</Text>
              <Text style={[styles.summaryValue, styles.highlightValue]}>
                {summary.fiveStars} ({((summary.fiveStars / summary.total) * 100).toFixed(0)}%)
              </Text>
            </View>
            
            {/* Comparativo com período anterior */}
            {summary.comparison && (
              <View style={styles.comparisonContainer}>
                <Text style={styles.comparisonLabel}>
                  Comparado ao período anterior:
                </Text>
                <View style={styles.comparisonValue}>
                  <Ionicons
                    name={summary.comparison.trend > 0 ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={summary.comparison.trend > 0 ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.comparisonText,
                      {
                        color: summary.comparison.trend > 0 ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  >
                    {Math.abs(summary.comparison.trend).toFixed(1)}% ({summary.comparison.value > 0 ? '+' : ''}
                    {summary.comparison.value.toFixed(1)} estrelas)
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>
        
        {/* Distribuição de avaliações */}
        <Card title="Distribuição de Avaliações" style={styles.card}>
          <View style={styles.ratingDistribution}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = analysis.distribution[stars] || 0;
              const percentage = summary.total > 0 ? (count / summary.total) * 100 : 0;
              
              return (
                <View key={stars} style={styles.ratingDistributionItem}>
                  <View style={styles.ratingStars}>
                    <Text style={styles.ratingStarsText}>{stars}</Text>
                    <Ionicons name="star" size={14} color={COLORS.warning} />
                  </View>
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingBarFill,
                        { width: `${percentage}%`, backgroundColor: getStarColor(stars) },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </Card>
        
        {/* Comentários recentes */}
        <Card title="Comentários Recentes" style={styles.card}>
          {details.comments.map((comment, index) => (
            <View
              key={index}
              style={[
                styles.commentItem,
                index < details.comments.length - 1 && styles.commentItemBorder,
              ]}
            >
              <View style={styles.commentHeader}>
                <View style={styles.commentStars}>
                  {Array(5).fill(0).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < comment.stars ? 'star' : 'star-outline'}
                      size={16}
                      color={i < comment.stars ? COLORS.warning : COLORS.lightGray}
                    />
                  ))}
                </View>
                <Text style={styles.commentDate}>{comment.date}</Text>
              </View>
              
              <Text style={styles.commentText}>{comment.text}</Text>
              
              <View style={styles.serviceType}>
                <Ionicons name={comment.serviceIcon} size={14} color={COLORS.darkGray} />
                <Text style={styles.serviceTypeText}>{comment.serviceType}</Text>
              </View>
            </View>
          ))}
          
          {details.comments.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhum comentário recebido no período selecionado.
            </Text>
          )}
          
          {details.hasMore && (
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => navigation.navigate('AllComments', { period })}
            >
              <Text style={styles.viewMoreText}>Ver Todos os Comentários</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </Card>
      </>
    );
  };
  
  // Renderizar relatório de taxa de aceitação
  const renderAcceptanceReport = () => {
    const { summary, details, chart, analysis } = reportData;
    
    return (
      <>
        {/* Resumo de taxa de aceitação */}
        <Card title="Taxa de Aceitação" style={styles.card}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Taxa Atual</Text>
              <Text style={styles.summaryValue}>{summary.current}%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Solicitações Recebidas</Text>
              <Text style={styles.summaryValue}>{summary.totalRequests}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Solicitações Aceitas</Text>
              <Text style={[styles.summaryValue, styles.highlightValue]}>
                {summary.acceptedRequests}
              </Text>
            </View>
            
            {/* Comparativo com período anterior */}
            {summary.comparison && (
              <View style={styles.comparisonContainer}>
                <Text style={styles.comparisonLabel}>
                  Comparado ao período anterior:
                </Text>
                <View style={styles.comparisonValue}>
                  <Ionicons
                    name={summary.comparison.trend > 0 ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={summary.comparison.trend > 0 ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.comparisonText,
                      {
                        color: summary.comparison.trend > 0 ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  >
                    {Math.abs(summary.comparison.trend).toFixed(1)}% ({summary.comparison.value > 0 ? '+' : ''}
                    {summary.comparison.value.toFixed(1)}%)
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>
        
        {/* Análise de aceitação */}
        <Card title="Análise de Aceitação" style={styles.card}>
          <View style={styles.analysisContainer}>
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Tempo médio de resposta</Text>
                <Text style={styles.analysisValue}>
                  {analysis.averageResponseTime} seg
                </Text>
              </View>
            </View>
            
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="close-circle" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Taxa de rejeição</Text>
                <Text style={styles.analysisValue}>
                  {analysis.rejectionRate}%
                </Text>
              </View>
            </View>
            
            <View style={styles.analysisItem}>
              <View style={styles.analysisIconContainer}>
                <Ionicons name="timer" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisLabel}>Expiradas sem resposta</Text>
                <Text style={styles.analysisValue}>
                  {analysis.expiredRate}%
                </Text>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Dicas para melhorar */}
        <Card title="Dicas para Melhorar" style={styles.card}>
          {details.tips.map((tip, index) => (
            <View
              key={index}
              style={[
                styles.tipItem,
                index < details.tips.length - 1 && styles.tipItemBorder,
              ]}
            >
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
  
  // Renderizar relatório de distribuição de serviços
  const renderServicesReport = () => {
    const { summary, details, chart, analysis } = reportData;
    
    return (
      <>
        {/* Resumo de distribuição de serviços */}
        <Card title="Distribuição de Serviços" style={styles.card}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total de Serviços</Text>
              <Text style={styles.summaryValue}>{summary.total}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tipo Mais Frequente</Text>
              <Text style={styles.summaryValue}>{summary.mostFrequent.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tipo Mais Rentável</Text>
              <Text style={[styles.summaryValue, styles.highlightValue]}>
                {summary.mostProfitable.name}
              </Text>
            </View>
          </View>
        </Card>
        
        {/* Detalhamento por tipo de serviço */}
        <Card title="Detalhamento por Tipo" style={styles.card}>
          {details.serviceTypes.map((service, index) => (
            <View
              key={index}
              style={[
                styles.serviceTypeItem,
                index < details.serviceTypes.length - 1 && styles.serviceTypeItemBorder,
              ]}
            >
              <View style={styles.serviceTypeHeader}>
                <View style={styles.serviceTypeInfo}>
                  <View style={[styles.serviceTypeIcon, { backgroundColor: service.color + '20' }]}>
                    <Ionicons name={service.icon} size={20} color={service.color} />
                  </View>
                  <Text style={styles.serviceTypeName}>{service.name}</Text>
                </View>
                <Text style={styles.serviceTypeCount}>{service.count} ({service.percentage}%)</Text>
              </View>
              
              <View style={styles.serviceTypeDetails}>
                <View style={styles.serviceTypeDetail}>
                  <Text style={styles.serviceTypeDetailLabel}>Ganho Total:</Text>
                  <Text style={styles.serviceTypeDetailValue}>R$ {service.totalEarnings.toFixed(2)}</Text>
                </View>
                <View style={styles.serviceTypeDetail}>
                  <Text style={styles.serviceTypeDetailLabel}>Média por Serviço:</Text>
                  <Text style={styles.serviceTypeDetailValue}>R$ {service.averageEarning.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>
        
        {/* Análise de rentabilidade por tipo */}
        <Card title="Rentabilidade por Tipo" style={styles.card}>
          <View style={styles.profitabilityContainer}>
            {analysis.profitability.map((item, index) => (
              <View key={index} style={styles.profitabilityItem}>
                <View style={styles.profitabilityHeader}>
                  <Text style={styles.profitabilityRank}>#{index + 1}</Text>
                  <Text style={styles.profitabilityName}>{item.name}</Text>
                  <Text style={styles.profitabilityValue}>R$ {item.averageEarning.toFixed(2)}/serviço</Text>
                </View>
                <View style={styles.profitabilityBar}>
                  <View
                    style={[
                      styles.profitabilityBarFill,
                      { width: `${item.percentage}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
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
        <TouchableOpacity style={styles.retryButton} onPress={loadReportData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Função auxiliar para obter cor com base no número de estrelas
  const getStarColor = (stars: number) => {
    switch (stars) {
      case 5:
        return COLORS.success;
      case 4:
        return COLORS.primary;
      case 3:
        return COLORS.warning;
      case 2:
        return COLORS.orange;
      case 1:
        return COLORS.danger;
      default:
        return COLORS.lightGray;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getReportTitle()}</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => exportReport('pdf')}
        >
          <Ionicons name="download" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Filtros de período */}
      <FilterPeriod
        selectedPeriod={period as any}
        onSelectPeriod={(newPeriod) => setPeriod(newPeriod)}
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
          <LoadingOverlay message={`Carregando relatório de ${getReportTitle().toLowerCase()}...`} />
        ) : error ? (
          renderError()
        ) : (
          renderReportContent()
        )}
      </ScrollView>
    </View>
  );
};

// Dados mockados para desenvolvimento
const getMockReportData = (reportType: string) => {
  switch (reportType) {
    case 'earnings':
      return {
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
            {
              id: '3',
              date: '18/05/2025',
              type: 'Transporte de Pet',
              icon: 'paw',
              value: 42.30,
              distance: 15.8,
              duration: 30,
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
      };
    case 'rides':
      return {
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
            {
              id: '3',
              date: '18/05/2025',
              type: 'Transporte de Pet',
              icon: 'paw',
              value: 42.30,
              distance: 15.8,
              duration: 30,
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
      };
    case 'rating':
    case 'ratings':
      return {
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
            {
              stars: 5,
              date: '18/05/2025',
              text: 'Muito atencioso com meu pet, recomendo!',
              serviceType: 'Transporte de Pet',
              serviceIcon: 'paw',
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
      };
    case 'acceptance':
      return getMockAcceptanceData();
    case 'services':
      return getMockServicesData();
    default:
      return null;
  }
};

// Dados mockados para taxa de aceitação
const getMockAcceptanceData = () => {
  return {
    summary: {
      current: 95,
      totalRequests: 105,
      acceptedRequests: 100,
      comparison: {
        trend: -2.1,
        value: -2.0,
      },
    },
    details: {
      tips: [
        {
          icon: 'notifications',
          title: 'Mantenha o App Aberto',
          description: 'Certifique-se de que o aplicativo está aberto e o volume do telefone está ligado para não perder solicitações.',
        },
        {
          icon: 'time',
          title: 'Responda Rapidamente',
          description: 'Tente responder às solicitações em até 15 segundos para melhorar sua taxa de aceitação.',
        },
        {
          icon: 'location',
          title: 'Posicione-se Estrategicamente',
          description: 'Fique em áreas com boa conexão de internet para evitar falhas na recepção de solicitações.',
        },
      ],
    },
    chart: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      data: [98, 97, 95, 96, 94, 93, 95],
    },
    analysis: {
      averageResponseTime: 8.5,
      rejectionRate: 4.8,
      expiredRate: 0.2,
    },
  };
};

// Dados mockados para distribuição de serviços
const getMockServicesData = () => {
  return {
    summary: {
      total: 42,
      mostFrequent: {
        name: 'Corridas Tradicionais',
        count: 27,
      },
      mostProfitable: {
        name: 'Viagens Longas',
        averageEarning: 85.50,
      },
    },
    details: {
      serviceTypes: [
        {
          name: 'Corridas Tradicionais',
          icon: 'car',
          color: '#1B76BC',
          count: 27,
          percentage: 65,
          totalEarnings: 675.50,
          averageEarning: 25.02,
        },
        {
          name: 'Entregas',
          icon: 'cube',
          color: '#FF9500',
          count: 8,
          percentage: 20,
          totalEarnings: 160.25,
          averageEarning: 20.03,
        },
        {
          name: 'Transporte de Pets',
          icon: 'paw',
          color: '#4CD964',
          count: 4,
          percentage: 10,
          totalEarnings: 158.80,
          averageEarning: 39.70,
        },
        {
          name: 'Transporte Acessível',
          icon: 'accessibility',
          color: '#FF3B30',
          count: 2,
          percentage: 5,
          totalEarnings: 85.20,
          averageEarning: 42.60,
        },
      ],
    },
    chart: {
      data: [
        { name: 'Corridas', value: 65, color: '#1B76BC' },
        { name: 'Entregas', value: 20, color: '#FF9500' },
        { name: 'Pets', value: 10, color: '#4CD964' },
        { name: 'Acessível', value: 5, color: '#FF3B30' },
      ],
    },
    analysis: {
      profitability: [
        {
          name: 'Viagens Longas',
          averageEarning: 85.50,
          percentage: 100,
          color: '#007AFF',
        },
        {
          name: 'Transporte Acessível',
          averageEarning: 42.60,
          percentage: 50,
          color: '#FF3B30',
        },
        {
          name: 'Transporte de Pets',
          averageEarning: 39.70,
          percentage: 46,
          color: '#4CD964',
        },
        {
          name: 'Corridas Tradicionais',
          averageEarning: 25.02,
          percentage: 29,
          color: '#1B76BC',
        },
        {
          name: 'Entregas',
          averageEarning: 20.03,
          percentage: 23,
          color: '#FF9500',
        },
      ],
    },
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
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  exportButton: {
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
  card: {
    marginTop: 15,
  },
  summaryContainer: {
    width: '100%',
  },
  summaryItem: {
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  highlightValue: {
    color: COLORS.primary,
  },
  comparisonContainer: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  comparisonLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  comparisonValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  analysisContainer: {
    width: '100%',
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  analysisIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(27, 118, 188, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  analysisContent: {
    flex: 1,
  },
  analysisLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 3,
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  serviceItem: {
    paddingVertical: 12,
  },
  serviceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 3,
  },
  serviceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTypeText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginLeft: 5,
  },
  serviceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDetailsText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  serviceDetailsButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(27, 118, 188, 0.1)',
  },
  serviceDetailsButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 8,
  },
  viewMoreText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginVertical: 20,
  },
  ratingDistribution: {
    width: '100%',
  },
  ratingDistributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 30,
  },
  ratingStarsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginRight: 3,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: COLORS.darkGray,
    width: 30,
    textAlign: 'right',
  },
  commentItem: {
    paddingVertical: 12,
  },
  commentItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentStars: {
    flexDirection: 'row',
  },
  commentDate: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.darkText,
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  tipItemBorder: {
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
  serviceTypeItem: {
    paddingVertical: 12,
  },
  serviceTypeItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  serviceTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  serviceTypeCount: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  serviceTypeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  serviceTypeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTypeDetailLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginRight: 5,
  },
  serviceTypeDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  profitabilityContainer: {
    width: '100%',
  },
  profitabilityItem: {
    marginBottom: 15,
  },
  profitabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profitabilityRank: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profitabilityName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkText,
  },
  profitabilityValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  profitabilityBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  profitabilityBarFill: {
    height: '100%',
    borderRadius: 4,
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

export default DetailedReport;
