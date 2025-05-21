import { Request, Response } from 'express';
import ServiceType, { IServiceType } from './service-type.model';

/**
 * Controlador para gerenciamento de tipos de serviço
 */
class ServiceTypeController {
  /**
   * Listar todos os tipos de serviço
   * @param req Requisição Express
   * @param res Resposta Express
   */
  public async listServiceTypes(req: Request, res: Response): Promise<void> {
    try {
      // Parâmetros opcionais de filtro
      const { available, requiresVerification } = req.query;
      
      // Construir filtro baseado nos parâmetros
      const filter: any = {};
      
      if (available !== undefined) {
        filter.available = available === 'true';
      }
      
      if (requiresVerification !== undefined) {
        filter.requiresVerification = requiresVerification === 'true';
      }
      
      // Buscar tipos de serviço com filtros aplicados
      const serviceTypes = await ServiceType.find(filter).sort({ name: 1 });
      
      res.status(200).json({
        success: true,
        count: serviceTypes.length,
        data: serviceTypes,
      });
    } catch (error) {
      console.error('Erro ao listar tipos de serviço:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar tipos de serviço',
        error: error.message,
      });
    }
  }

  /**
   * Obter detalhes de um tipo de serviço específico
   * @param req Requisição Express
   * @param res Resposta Express
   */
  public async getServiceType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar tipo de serviço pelo ID
      const serviceType = await ServiceType.findOne({ id });
      
      if (!serviceType) {
        res.status(404).json({
          success: false,
          message: `Tipo de serviço com ID ${id} não encontrado`,
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: serviceType,
      });
    } catch (error) {
      console.error(`Erro ao buscar tipo de serviço:`, error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar tipo de serviço',
        error: error.message,
      });
    }
  }

  /**
   * Criar um novo tipo de serviço
   * @param req Requisição Express
   * @param res Resposta Express
   */
  public async createServiceType(req: Request, res: Response): Promise<void> {
    try {
      const serviceTypeData = req.body;
      
      // Verificar se já existe um tipo de serviço com o mesmo ID
      const existingServiceType = await ServiceType.findOne({ id: serviceTypeData.id });
      
      if (existingServiceType) {
        res.status(400).json({
          success: false,
          message: `Já existe um tipo de serviço com o ID ${serviceTypeData.id}`,
        });
        return;
      }
      
      // Criar novo tipo de serviço
      const newServiceType = await ServiceType.create(serviceTypeData);
      
      res.status(201).json({
        success: true,
        message: 'Tipo de serviço criado com sucesso',
        data: newServiceType,
      });
    } catch (error) {
      console.error('Erro ao criar tipo de serviço:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar tipo de serviço',
        error: error.message,
      });
    }
  }

  /**
   * Atualizar um tipo de serviço existente
   * @param req Requisição Express
   * @param res Resposta Express
   */
  public async updateServiceType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Não permitir alteração do ID
      if (updateData.id && updateData.id !== id) {
        res.status(400).json({
          success: false,
          message: 'Não é permitido alterar o ID do tipo de serviço',
        });
        return;
      }
      
      // Buscar e atualizar o tipo de serviço
      const updatedServiceType = await ServiceType.findOneAndUpdate(
        { id },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedServiceType) {
        res.status(404).json({
          success: false,
          message: `Tipo de serviço com ID ${id} não encontrado`,
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Tipo de serviço atualizado com sucesso',
        data: updatedServiceType,
      });
    } catch (error) {
      console.error('Erro ao atualizar tipo de serviço:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar tipo de serviço',
        error: error.message,
      });
    }
  }

  /**
   * Excluir um tipo de serviço
   * @param req Requisição Express
   * @param res Resposta Express
   */
  public async deleteServiceType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar e excluir o tipo de serviço
      const deletedServiceType = await ServiceType.findOneAndDelete({ id });
      
      if (!deletedServiceType) {
        res.status(404).json({
          success: false,
          message: `Tipo de serviço com ID ${id} não encontrado`,
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Tipo de serviço excluído com sucesso',
        data: deletedServiceType,
      });
    } catch (error) {
      console.error('Erro ao excluir tipo de serviço:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir tipo de serviço',
        error: error.message,
      });
    }
  }

  /**
   * Calcular preço estimado para um tipo de serviço
   * @param req Requisição Express
   * @param res Resposta Express
   */
  public async calculatePrice(req: Request, res: Response): Promise<void> {
    try {
      const { serviceId, distance, duration, ...additionalParams } = req.body;
      
      if (!serviceId || !distance || !duration) {
        res.status(400).json({
          success: false,
          message: 'Parâmetros obrigatórios: serviceId, distance, duration',
        });
        return;
      }
      
      // Buscar tipo de serviço
      const serviceType = await ServiceType.findOne({ id: serviceId });
      
      if (!serviceType) {
        res.status(404).json({
          success: false,
          message: `Tipo de serviço com ID ${serviceId} não encontrado`,
        });
        return;
      }
      
      // Verificar se o serviço está disponível
      if (!serviceType.available) {
        res.status(400).json({
          success: false,
          message: `O serviço ${serviceType.name} não está disponível no momento`,
        });
        return;
      }
      
      // Calcular preço base
      let price = serviceType.basePrice + 
                 (distance * serviceType.pricePerKm) + 
                 (duration * serviceType.pricePerMinute);
      
      // Aplicar modificadores
      const appliedModifiers = [];
      
      for (const modifier of serviceType.modifiers) {
        // Verificar se o modificador tem uma condição
        if (modifier.condition) {
          // Avaliar a condição usando Function constructor (com cuidado!)
          // Em produção, usar uma abordagem mais segura para avaliar condições
          try {
            const conditionMet = new Function(
              'params',
              `const { distance, duration, ...rest } = params; return ${modifier.condition};`
            )({ distance, duration, ...additionalParams });
            
            if (!conditionMet) continue;
          } catch (error) {
            console.error(`Erro ao avaliar condição do modificador ${modifier.name}:`, error);
            continue;
          }
        }
        
        // Aplicar modificador
        const modifierValue = modifier.type === 'fixed' 
          ? modifier.value 
          : (price * modifier.value / 100);
        
        price += modifierValue;
        
        appliedModifiers.push({
          name: modifier.name,
          value: modifierValue,
        });
      }
      
      // Garantir preço mínimo
      price = Math.max(price, serviceType.minimumPrice);
      
      // Arredondar para duas casas decimais
      price = Math.round(price * 100) / 100;
      
      res.status(200).json({
        success: true,
        data: {
          serviceId: serviceType.id,
          serviceName: serviceType.name,
          basePrice: serviceType.basePrice,
          distanceCharge: distance * serviceType.pricePerKm,
          timeCharge: duration * serviceType.pricePerMinute,
          appliedModifiers,
          totalPrice: price,
        },
      });
    } catch (error) {
      console.error('Erro ao calcular preço:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao calcular preço',
        error: error.message,
      });
    }
  }
}

export default new ServiceTypeController();
