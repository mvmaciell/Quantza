import { ServiceType } from '../types/service';

/**
 * Classe para cálculo de preços diferenciados por modalidade de serviço
 * 
 * Esta classe implementa a lógica de cálculo de preços para diferentes tipos de serviço,
 * considerando fatores específicos de cada modalidade.
 */
export class PriceCalculator {
  // Preços base por tipo de serviço
  private static BASE_PRICES = {
    standard: 25.0,      // Corrida tradicional
    delivery: 20.0,      // Entrega
    petTransport: 30.0,  // Transporte de pets
    longTrip: 150.0,     // Viagem longa
    accessible: 35.0,    // Transporte acessível
  };

  // Multiplicadores por tipo de veículo para cada serviço
  private static VEHICLE_MULTIPLIERS = {
    // Corrida tradicional
    standard: {
      basic: 1.0,
      comfort: 1.3,
      premium: 1.8,
    },
    // Entrega
    delivery: {
      motorcycle: 1.0,
      car: 1.3,
      van: 1.6,
    },
    // Transporte de pets
    petTransport: {
      standard: 1.0,
      premium: 1.4,
    },
    // Viagem longa
    longTrip: {
      standard: 1.0,
      comfort: 1.3,
      premium: 1.8,
    },
    // Transporte acessível
    accessible: {
      standard_accessible: 1.2,
      van_accessible: 1.5,
    },
  };

  /**
   * Calcula o preço para uma corrida tradicional
   * 
   * @param {Object} params - Parâmetros para cálculo
   * @param {string} params.vehicleType - Tipo de veículo
   * @param {number} params.distance - Distância em km
   * @param {number} params.duration - Duração estimada em minutos
   * @returns {number} Preço calculado
   */
  static calculateStandardPrice(params: {
    vehicleType: string;
    distance: number;
    duration: number;
  }): number {
    const { vehicleType, distance, duration } = params;
    
    // Obter preço base e multiplicador de veículo
    const basePrice = this.BASE_PRICES.standard;
    const vehicleMultiplier = this.VEHICLE_MULTIPLIERS.standard[vehicleType] || 1.0;
    
    // Calcular componentes do preço
    const distancePrice = distance * 2.0; // R$ 2,00 por km
    const durationPrice = duration * 0.5; // R$ 0,50 por minuto
    
    // Calcular preço final
    const finalPrice = (basePrice + distancePrice + durationPrice) * vehicleMultiplier;
    
    return Math.max(finalPrice, basePrice); // Garantir preço mínimo
  }

  /**
   * Calcula o preço para uma entrega
   * 
   * @param {Object} params - Parâmetros para cálculo
   * @param {string} params.vehicleType - Tipo de veículo
   * @param {number} params.distance - Distância em km
   * @param {boolean} params.isUrgent - Se a entrega é urgente
   * @param {string} params.packageSize - Tamanho do pacote ('small', 'medium', 'large')
   * @returns {number} Preço calculado
   */
  static calculateDeliveryPrice(params: {
    vehicleType: string;
    distance: number;
    isUrgent: boolean;
    packageSize: string;
  }): number {
    const { vehicleType, distance, isUrgent, packageSize } = params;
    
    // Obter preço base e multiplicador de veículo
    const basePrice = this.BASE_PRICES.delivery;
    const vehicleMultiplier = this.VEHICLE_MULTIPLIERS.delivery[vehicleType] || 1.0;
    
    // Calcular componentes do preço
    const distancePrice = distance * 1.8; // R$ 1,80 por km
    
    // Adicional por urgência
    const urgencyMultiplier = isUrgent ? 1.4 : 1.0;
    
    // Adicional por tamanho do pacote
    let packageMultiplier = 1.0;
    switch (packageSize) {
      case 'small':
        packageMultiplier = 1.0;
        break;
      case 'medium':
        packageMultiplier = 1.2;
        break;
      case 'large':
        packageMultiplier = 1.5;
        break;
      default:
        packageMultiplier = 1.0;
    }
    
    // Calcular preço final
    const finalPrice = (basePrice + distancePrice) * vehicleMultiplier * urgencyMultiplier * packageMultiplier;
    
    return Math.max(finalPrice, basePrice); // Garantir preço mínimo
  }

  /**
   * Calcula o preço para transporte de pets
   * 
   * @param {Object} params - Parâmetros para cálculo
   * @param {string} params.vehicleType - Tipo de veículo
   * @param {number} params.distance - Distância em km
   * @param {string} params.petSize - Porte do animal ('small', 'medium', 'large')
   * @param {boolean} params.withOwner - Se o dono acompanha o animal
   * @returns {number} Preço calculado
   */
  static calculatePetTransportPrice(params: {
    vehicleType: string;
    distance: number;
    petSize: string;
    withOwner: boolean;
  }): number {
    const { vehicleType, distance, petSize, withOwner } = params;
    
    // Obter preço base e multiplicador de veículo
    const basePrice = this.BASE_PRICES.petTransport;
    const vehicleMultiplier = this.VEHICLE_MULTIPLIERS.petTransport[vehicleType] || 1.0;
    
    // Calcular componentes do preço
    const distancePrice = distance * 2.2; // R$ 2,20 por km
    
    // Adicional por porte do animal
    let petSizeMultiplier = 1.0;
    switch (petSize) {
      case 'small':
        petSizeMultiplier = 1.0;
        break;
      case 'medium':
        petSizeMultiplier = 1.2;
        break;
      case 'large':
        petSizeMultiplier = 1.4;
        break;
      default:
        petSizeMultiplier = 1.0;
    }
    
    // Adicional por acompanhamento do dono
    const ownerMultiplier = withOwner ? 1.2 : 1.0;
    
    // Calcular preço final
    const finalPrice = (basePrice + distancePrice) * vehicleMultiplier * petSizeMultiplier * ownerMultiplier;
    
    return Math.max(finalPrice, basePrice); // Garantir preço mínimo
  }

  /**
   * Calcula o preço para viagem longa
   * 
   * @param {Object} params - Parâmetros para cálculo
   * @param {string} params.vehicleType - Tipo de veículo
   * @param {number} params.distance - Distância em km
   * @param {boolean} params.roundTrip - Se é viagem de ida e volta
   * @param {boolean} params.scheduledTrip - Se é viagem agendada
   * @returns {number} Preço calculado
   */
  static calculateLongTripPrice(params: {
    vehicleType: string;
    distance: number;
    roundTrip: boolean;
    scheduledTrip: boolean;
  }): number {
    const { vehicleType, distance, roundTrip, scheduledTrip } = params;
    
    // Obter preço base e multiplicador de veículo
    const basePrice = this.BASE_PRICES.longTrip;
    const vehicleMultiplier = this.VEHICLE_MULTIPLIERS.longTrip[vehicleType] || 1.0;
    
    // Calcular componentes do preço
    const distancePrice = distance * 1.5; // R$ 1,50 por km
    
    // Adicional por ida e volta
    const tripMultiplier = roundTrip ? 1.8 : 1.0; // 80% do preço original para a volta
    
    // Adicional por agendamento
    const schedulingFee = scheduledTrip ? 15.0 : 0.0;
    
    // Calcular preço final
    const finalPrice = ((basePrice + distancePrice) * vehicleMultiplier * tripMultiplier) + schedulingFee;
    
    return Math.max(finalPrice, basePrice); // Garantir preço mínimo
  }

  /**
   * Calcula o preço para transporte acessível
   * 
   * @param {Object} params - Parâmetros para cálculo
   * @param {string} params.vehicleType - Tipo de veículo
   * @param {number} params.distance - Distância em km
   * @param {boolean} params.needAssistance - Se necessita assistência adicional
   * @returns {number} Preço calculado
   */
  static calculateAccessiblePrice(params: {
    vehicleType: string;
    distance: number;
    needAssistance: boolean;
  }): number {
    const { vehicleType, distance, needAssistance } = params;
    
    // Obter preço base e multiplicador de veículo
    const basePrice = this.BASE_PRICES.accessible;
    const vehicleMultiplier = this.VEHICLE_MULTIPLIERS.accessible[vehicleType] || 1.2;
    
    // Calcular componentes do preço
    const distancePrice = distance * 2.0; // R$ 2,00 por km
    
    // Adicional por assistência
    const assistanceFee = needAssistance ? 10.0 : 0.0;
    
    // Calcular preço final
    const finalPrice = ((basePrice + distancePrice) * vehicleMultiplier) + assistanceFee;
    
    return Math.max(finalPrice, basePrice); // Garantir preço mínimo
  }

  /**
   * Calcula o preço para qualquer tipo de serviço
   * 
   * @param {ServiceType} serviceType - Tipo de serviço
   * @param {Object} params - Parâmetros específicos para o tipo de serviço
   * @returns {number} Preço calculado
   */
  static calculatePrice(serviceType: ServiceType, params: any): number {
    switch (serviceType) {
      case 'standard':
        return this.calculateStandardPrice(params);
      case 'delivery':
        return this.calculateDeliveryPrice(params);
      case 'petTransport':
        return this.calculatePetTransportPrice(params);
      case 'longTrip':
        return this.calculateLongTripPrice(params);
      case 'accessible':
        return this.calculateAccessiblePrice(params);
      default:
        return 0;
    }
  }

  /**
   * Formata o preço para exibição
   * 
   * @param {number} price - Preço a ser formatado
   * @returns {string} Preço formatado (ex: "R$ 25,00")
   */
  static formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
}
