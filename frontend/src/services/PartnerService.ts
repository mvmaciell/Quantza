import { AxiosInstance } from 'axios';
import api from './api';

/**
 * Serviço para gerenciamento de dados de parceiros
 * 
 * Esta classe implementa métodos para acessar e manipular dados
 * relacionados a parceiros, incluindo desempenho, ganhos e estatísticas.
 */
export class PartnerService {
  private static instance: AxiosInstance = api;

  /**
   * Obtém dados de desempenho do parceiro
   * 
   * @param {string} period - Período de análise ('day', 'week', 'month', 'quarter', 'year')
   * @returns {Promise<any>} Dados de desempenho do parceiro
   */
  static async getPerformanceData(period: string = 'week'): Promise<any> {
    try {
      const response = await this.instance.get(`/partner/performance?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados de desempenho:', error);
      throw error;
    }
  }

  /**
   * Obtém relatório detalhado de ganhos do parceiro
   * 
   * @param {string} period - Período de análise ('day', 'week', 'month', 'quarter', 'year')
   * @param {Object} filters - Filtros adicionais para o relatório
   * @returns {Promise<any>} Relatório detalhado de ganhos
   */
  static async getEarningsReport(period: string = 'week', filters: any = {}): Promise<any> {
    try {
      const response = await this.instance.post('/partner/reports/earnings', {
        period,
        ...filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter relatório de ganhos:', error);
      throw error;
    }
  }

  /**
   * Obtém relatório detalhado de corridas/serviços do parceiro
   * 
   * @param {string} period - Período de análise ('day', 'week', 'month', 'quarter', 'year')
   * @param {Object} filters - Filtros adicionais para o relatório
   * @returns {Promise<any>} Relatório detalhado de corridas/serviços
   */
  static async getRidesReport(period: string = 'week', filters: any = {}): Promise<any> {
    try {
      const response = await this.instance.post('/partner/reports/rides', {
        period,
        ...filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter relatório de corridas:', error);
      throw error;
    }
  }

  /**
   * Obtém relatório detalhado de avaliações do parceiro
   * 
   * @param {string} period - Período de análise ('day', 'week', 'month', 'quarter', 'year')
   * @param {Object} filters - Filtros adicionais para o relatório
   * @returns {Promise<any>} Relatório detalhado de avaliações
   */
  static async getRatingsReport(period: string = 'week', filters: any = {}): Promise<any> {
    try {
      const response = await this.instance.post('/partner/reports/ratings', {
        period,
        ...filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter relatório de avaliações:', error);
      throw error;
    }
  }

  /**
   * Obtém análise de tendências para o parceiro
   * 
   * @param {string} period - Período de análise ('day', 'week', 'month', 'quarter', 'year')
   * @param {string} metricType - Tipo de métrica para análise ('earnings', 'rides', 'ratings')
   * @returns {Promise<any>} Análise de tendências
   */
  static async getTrendsAnalysis(period: string = 'month', metricType: string = 'earnings'): Promise<any> {
    try {
      const response = await this.instance.get(`/partner/trends?period=${period}&metric=${metricType}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter análise de tendências:', error);
      throw error;
    }
  }

  /**
   * Obtém recomendações personalizadas para o parceiro
   * 
   * @returns {Promise<any>} Recomendações personalizadas
   */
  static async getPersonalizedRecommendations(): Promise<any> {
    try {
      const response = await this.instance.get('/partner/recommendations');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      throw error;
    }
  }

  /**
   * Exporta relatório em formato específico
   * 
   * @param {string} reportType - Tipo de relatório ('earnings', 'rides', 'ratings')
   * @param {string} format - Formato de exportação ('pdf', 'csv', 'excel')
   * @param {string} period - Período de análise
   * @param {Object} filters - Filtros adicionais para o relatório
   * @returns {Promise<any>} URL ou blob do relatório exportado
   */
  static async exportReport(
    reportType: string,
    format: string = 'pdf',
    period: string = 'month',
    filters: any = {}
  ): Promise<any> {
    try {
      const response = await this.instance.post('/partner/reports/export', {
        reportType,
        format,
        period,
        ...filters,
      }, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      throw error;
    }
  }

  /**
   * Configura alertas e notificações para o parceiro
   * 
   * @param {Object} alertSettings - Configurações de alertas
   * @returns {Promise<any>} Confirmação de configuração
   */
  static async configureAlerts(alertSettings: any): Promise<any> {
    try {
      const response = await this.instance.post('/partner/alerts/configure', alertSettings);
      return response.data;
    } catch (error) {
      console.error('Erro ao configurar alertas:', error);
      throw error;
    }
  }

  /**
   * Obtém configurações atuais de alertas do parceiro
   * 
   * @returns {Promise<any>} Configurações atuais de alertas
   */
  static async getAlertSettings(): Promise<any> {
    try {
      const response = await this.instance.get('/partner/alerts/settings');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter configurações de alertas:', error);
      throw error;
    }
  }
}
