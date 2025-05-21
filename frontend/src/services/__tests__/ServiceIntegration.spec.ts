import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ServiceTypeManager } from '../../ServiceTypeManager';
import { PriceCalculator } from '../../PriceCalculator';

// Mock para fetch
global.fetch = jest.fn();

describe('Integração ServiceTypeManager e PriceCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve calcular preços corretamente para corrida tradicional', async () => {
    // Configurar mock para fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ price: 45.0 }),
      })
    );

    // Parâmetros para cálculo
    const params = {
      vehicleType: 'comfort',
      distance: 10,
      duration: 15,
    };

    // Calcular preço via API
    const apiPrice = await ServiceTypeManager.calculateServicePrice('standard', params);
    expect(apiPrice).toBe(45.0);

    // Verificar se fetch foi chamado corretamente
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/services/types/standard/calculate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(params),
      })
    );

    // Calcular preço localmente
    const localPrice = PriceCalculator.calculateStandardPrice(params);
    
    // Verificar se o preço local está próximo do preço da API (pode haver pequenas diferenças de arredondamento)
    expect(Math.abs(localPrice - apiPrice)).toBeLessThan(0.1);
  });

  it('deve calcular preços corretamente para entrega', async () => {
    // Configurar mock para fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ price: 60.0 }),
      })
    );

    // Parâmetros para cálculo
    const params = {
      vehicleType: 'car',
      distance: 8,
      isUrgent: true,
      packageSize: 'medium',
    };

    // Calcular preço via API
    const apiPrice = await ServiceTypeManager.calculateServicePrice('delivery', params);
    expect(apiPrice).toBe(60.0);

    // Verificar se fetch foi chamado corretamente
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/services/types/delivery/calculate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(params),
      })
    );

    // Calcular preço localmente
    const localPrice = PriceCalculator.calculateDeliveryPrice(params);
    
    // Verificar se o preço local está próximo do preço da API
    expect(Math.abs(localPrice - apiPrice)).toBeLessThan(0.1);
  });

  it('deve calcular preços corretamente para transporte de pets', async () => {
    // Configurar mock para fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ price: 52.0 }),
      })
    );

    // Parâmetros para cálculo
    const params = {
      vehicleType: 'standard',
      distance: 5,
      petSize: 'medium',
      withOwner: true,
    };

    // Calcular preço via API
    const apiPrice = await ServiceTypeManager.calculateServicePrice('petTransport', params);
    expect(apiPrice).toBe(52.0);

    // Calcular preço localmente
    const localPrice = PriceCalculator.calculatePetTransportPrice(params);
    
    // Verificar se o preço local está próximo do preço da API
    expect(Math.abs(localPrice - apiPrice)).toBeLessThan(0.1);
  });

  it('deve calcular preços corretamente para viagem longa', async () => {
    // Configurar mock para fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ price: 285.0 }),
      })
    );

    // Parâmetros para cálculo
    const params = {
      vehicleType: 'comfort',
      distance: 80,
      roundTrip: true,
      scheduledTrip: true,
    };

    // Calcular preço via API
    const apiPrice = await ServiceTypeManager.calculateServicePrice('longTrip', params);
    expect(apiPrice).toBe(285.0);

    // Calcular preço localmente
    const localPrice = PriceCalculator.calculateLongTripPrice(params);
    
    // Verificar se o preço local está próximo do preço da API
    expect(Math.abs(localPrice - apiPrice)).toBeLessThan(0.1);
  });

  it('deve calcular preços corretamente para transporte acessível', async () => {
    // Configurar mock para fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ price: 62.0 }),
      })
    );

    // Parâmetros para cálculo
    const params = {
      vehicleType: 'van_accessible',
      distance: 7,
      needAssistance: true,
    };

    // Calcular preço via API
    const apiPrice = await ServiceTypeManager.calculateServicePrice('accessible', params);
    expect(apiPrice).toBe(62.0);

    // Calcular preço localmente
    const localPrice = PriceCalculator.calculateAccessiblePrice(params);
    
    // Verificar se o preço local está próximo do preço da API
    expect(Math.abs(localPrice - apiPrice)).toBeLessThan(0.1);
  });

  it('deve lidar com erros de API e usar fallback local', async () => {
    // Configurar mock para fetch com erro
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    // Parâmetros para cálculo
    const params = {
      vehicleType: 'standard_accessible',
      distance: 5,
      needAssistance: false,
    };

    // Tentar calcular preço via API (deve usar fallback)
    const price = await ServiceTypeManager.calculateServicePrice('accessible', params);
    
    // Verificar se um preço foi retornado (usando fallback)
    expect(price).toBeGreaterThan(0);
    
    // Calcular preço localmente para comparação
    const localPrice = PriceCalculator.calculateAccessiblePrice(params);
    
    // Verificar se o preço retornado é igual ao preço local (fallback)
    expect(price).toBe(localPrice);
  });

  it('deve formatar preços corretamente', () => {
    const price = 42.5;
    const formattedPrice = PriceCalculator.formatPrice(price);
    expect(formattedPrice).toBe('R$ 42,50');
  });
});
