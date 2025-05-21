import { ServiceType } from '../types/service';

/**
 * Interface para tipos de serviço
 */
export interface ServiceTypeModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  basePrice: number;
  priceMultipliers: Record<string, number>;
  additionalOptions: ServiceTypeOption[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para opções adicionais de serviço
 */
export interface ServiceTypeOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  isPercentage: boolean;
}

/**
 * Classe para gerenciamento de tipos de serviço
 * 
 * Esta classe implementa a integração entre frontend e backend para
 * gerenciamento de tipos de serviço, incluindo listagem, detalhes e preferências.
 */
export class ServiceTypeManager {
  private static API_BASE_URL = '/api/services';

  /**
   * Obtém todos os tipos de serviço disponíveis
   * 
   * @returns {Promise<ServiceTypeModel[]>} Lista de tipos de serviço
   */
  static async getAllServiceTypes(): Promise<ServiceTypeModel[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/types`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter tipos de serviço: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter tipos de serviço:', error);
      
      // Fallback para dados mockados em caso de erro
      return this.getMockServiceTypes();
    }
  }

  /**
   * Obtém detalhes de um tipo de serviço específico
   * 
   * @param {string} serviceTypeId - ID do tipo de serviço
   * @returns {Promise<ServiceTypeModel>} Detalhes do tipo de serviço
   */
  static async getServiceTypeDetails(serviceTypeId: string): Promise<ServiceTypeModel> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/types/${serviceTypeId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter detalhes do tipo de serviço: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao obter detalhes do tipo de serviço ${serviceTypeId}:`, error);
      
      // Fallback para dados mockados em caso de erro
      const mockTypes = this.getMockServiceTypes();
      return mockTypes.find(type => type.id === serviceTypeId) || mockTypes[0];
    }
  }

  /**
   * Obtém as preferências do usuário para um tipo de serviço
   * 
   * @param {string} serviceTypeId - ID do tipo de serviço
   * @param {string} userId - ID do usuário
   * @returns {Promise<any>} Preferências do usuário para o tipo de serviço
   */
  static async getUserServicePreferences(serviceTypeId: string, userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/preferences/${serviceTypeId}/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter preferências: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao obter preferências para ${serviceTypeId}:`, error);
      
      // Retornar objeto vazio em caso de erro
      return {};
    }
  }

  /**
   * Salva as preferências do usuário para um tipo de serviço
   * 
   * @param {string} serviceTypeId - ID do tipo de serviço
   * @param {string} userId - ID do usuário
   * @param {any} preferences - Preferências a serem salvas
   * @returns {Promise<boolean>} Sucesso da operação
   */
  static async saveUserServicePreferences(serviceTypeId: string, userId: string, preferences: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/preferences/${serviceTypeId}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao salvar preferências: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao salvar preferências para ${serviceTypeId}:`, error);
      return false;
    }
  }

  /**
   * Calcula o preço para um tipo de serviço com base nos parâmetros
   * 
   * @param {string} serviceTypeId - ID do tipo de serviço
   * @param {any} params - Parâmetros para cálculo do preço
   * @returns {Promise<number>} Preço calculado
   */
  static async calculateServicePrice(serviceTypeId: string, params: any): Promise<number> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/types/${serviceTypeId}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao calcular preço: ${response.status}`);
      }
      
      const result = await response.json();
      return result.price;
    } catch (error) {
      console.error(`Erro ao calcular preço para ${serviceTypeId}:`, error);
      
      // Fallback para cálculo local em caso de erro
      return this.calculateLocalPrice(serviceTypeId, params);
    }
  }

  /**
   * Cria uma solicitação de serviço
   * 
   * @param {string} serviceTypeId - ID do tipo de serviço
   * @param {any} requestData - Dados da solicitação
   * @returns {Promise<any>} Dados da solicitação criada
   */
  static async createServiceRequest(serviceTypeId: string, requestData: any): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceTypeId,
          ...requestData,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar solicitação: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao criar solicitação para ${serviceTypeId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém o histórico de solicitações de um usuário para um tipo de serviço
   * 
   * @param {string} serviceTypeId - ID do tipo de serviço
   * @param {string} userId - ID do usuário
   * @returns {Promise<any[]>} Lista de solicitações
   */
  static async getUserServiceHistory(serviceTypeId: string, userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/history/${serviceTypeId}/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter histórico: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao obter histórico para ${serviceTypeId}:`, error);
      return [];
    }
  }

  /**
   * Calcula o preço localmente (fallback)
   * 
   * @param {string} serviceTypeId - ID do tipo de serviço
   * @param {any} params - Parâmetros para cálculo do preço
   * @returns {number} Preço calculado
   */
  private static calculateLocalPrice(serviceTypeId: string, params: any): number {
    // Obter tipo de serviço mockado
    const mockTypes = this.getMockServiceTypes();
    const serviceType = mockTypes.find(type => type.id === serviceTypeId);
    
    if (!serviceType) {
      return 0;
    }
    
    // Preço base
    let price = serviceType.basePrice;
    
    // Aplicar multiplicador de veículo
    if (params.vehicleType && serviceType.priceMultipliers[params.vehicleType]) {
      price *= serviceType.priceMultipliers[params.vehicleType];
    }
    
    // Aplicar modificadores de opções adicionais
    if (serviceType.additionalOptions && params.options) {
      serviceType.additionalOptions.forEach(option => {
        if (params.options[option.id]) {
          if (option.isPercentage) {
            price *= (1 + option.priceModifier);
          } else {
            price += option.priceModifier;
          }
        }
      });
    }
    
    // Aplicar modificador de distância (simplificado)
    if (params.distance) {
      price += params.distance * 2.0; // R$ 2,00 por km
    }
    
    return price;
  }

  /**
   * Obtém tipos de serviço mockados (fallback)
   * 
   * @returns {ServiceTypeModel[]} Lista de tipos de serviço mockados
   */
  private static getMockServiceTypes(): ServiceTypeModel[] {
    return [
      {
        id: 'standard',
        name: 'Corrida Tradicional',
        description: 'Transporte de passageiros para qualquer destino',
        icon: 'car',
        isActive: true,
        basePrice: 25.0,
        priceMultipliers: {
          basic: 1.0,
          comfort: 1.3,
          premium: 1.8,
        },
        additionalOptions: [
          {
            id: 'extraStop',
            name: 'Parada Adicional',
            description: 'Adicionar uma parada durante o trajeto',
            priceModifier: 5.0,
            isPercentage: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'delivery',
        name: 'Entrega',
        description: 'Entrega de pacotes e documentos',
        icon: 'cube',
        isActive: true,
        basePrice: 20.0,
        priceMultipliers: {
          motorcycle: 1.0,
          car: 1.3,
          van: 1.6,
        },
        additionalOptions: [
          {
            id: 'urgent',
            name: 'Entrega Urgente',
            description: 'Prioridade máxima na entrega',
            priceModifier: 0.4,
            isPercentage: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'petTransport',
        name: 'Transporte de Pets',
        description: 'Transporte seguro para seu animal de estimação',
        icon: 'paw',
        isActive: true,
        basePrice: 30.0,
        priceMultipliers: {
          standard: 1.0,
          premium: 1.4,
        },
        additionalOptions: [
          {
            id: 'withOwner',
            name: 'Com Acompanhante',
            description: 'Dono acompanha o animal durante o transporte',
            priceModifier: 0.2,
            isPercentage: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'longTrip',
        name: 'Viagem Longa',
        description: 'Viagens intermunicipais e interestaduais',
        icon: 'map',
        isActive: true,
        basePrice: 150.0,
        priceMultipliers: {
          standard: 1.0,
          comfort: 1.3,
          premium: 1.8,
        },
        additionalOptions: [
          {
            id: 'roundTrip',
            name: 'Ida e Volta',
            description: 'Agendar viagem de ida e volta',
            priceModifier: 0.8,
            isPercentage: true,
          },
          {
            id: 'scheduled',
            name: 'Agendamento',
            description: 'Agendar viagem para data futura',
            priceModifier: 15.0,
            isPercentage: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'accessible',
        name: 'Transporte Acessível',
        description: 'Veículos adaptados para acessibilidade',
        icon: 'accessibility',
        isActive: true,
        basePrice: 35.0,
        priceMultipliers: {
          standard_accessible: 1.2,
          van_accessible: 1.5,
        },
        additionalOptions: [
          {
            id: 'assistance',
            name: 'Assistência Adicional',
            description: 'Ajuda adicional do motorista',
            priceModifier: 10.0,
            isPercentage: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
