import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import PaymentPreferences from './PaymentPreferences';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../constants/theme';

// Tipos
interface ServicePreference {
  serviceId: string;
  defaultPaymentMethodId: string;
}

interface ServicePreferencesManagerProps {
  serviceId: string;
  serviceName: string;
  onPreferenceChange?: (preference: ServicePreference) => void;
  children?: React.ReactNode;
}

/**
 * Componente gerenciador de preferências de serviço
 * 
 * Este componente gerencia as preferências do usuário para um tipo específico de serviço,
 * incluindo persistência, recuperação e integração com os fluxos de serviço.
 * 
 * @param {ServicePreferencesManagerProps} props - Propriedades do componente
 * @returns {React.ReactElement} Componente gerenciador de preferências
 */
const ServicePreferencesManager: React.FC<ServicePreferencesManagerProps> = ({
  serviceId,
  serviceName,
  onPreferenceChange,
  children,
}) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
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
    {
      id: 'pix1',
      type: 'pix',
      name: 'PIX',
      details: 'usuario@email.com',
      isDefault: false,
    },
    {
      id: 'cash1',
      type: 'cash',
      name: 'Dinheiro',
      details: 'Pagamento em espécie',
      isDefault: false,
    },
  ]);

  // Efeito para carregar preferências salvas
  useEffect(() => {
    loadPreferences();
  }, []);

  // Função para carregar preferências do AsyncStorage
  const loadPreferences = async () => {
    try {
      const preferencesJson = await AsyncStorage.getItem(`preferences_${serviceId}`);
      
      if (preferencesJson) {
        const preferences = JSON.parse(preferencesJson);
        
        // Atualizar métodos de pagamento com base nas preferências salvas
        if (preferences.defaultPaymentMethodId) {
          const updatedMethods = paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === preferences.defaultPaymentMethodId,
          }));
          
          setPaymentMethods(updatedMethods);
          
          // Notificar sobre a preferência carregada
          if (onPreferenceChange) {
            onPreferenceChange({
              serviceId,
              defaultPaymentMethodId: preferences.defaultPaymentMethodId,
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  // Função para salvar preferências no AsyncStorage
  const savePreferences = async (defaultPaymentMethodId: string) => {
    try {
      const preferences = {
        serviceId,
        defaultPaymentMethodId,
      };
      
      await AsyncStorage.setItem(`preferences_${serviceId}`, JSON.stringify(preferences));
      
      // Notificar sobre a mudança de preferência
      if (onPreferenceChange) {
        onPreferenceChange(preferences);
      }
      
      // Mostrar animação de pontos
      setShowAnimation(true);
      
      // Resetar flag de animação após um tempo
      setTimeout(() => {
        setShowAnimation(false);
      }, 3500);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  // Função para selecionar um método de pagamento padrão
  const handleSelectDefaultPayment = (methodId: string) => {
    // Atualizar métodos de pagamento
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId,
    }));
    
    setPaymentMethods(updatedMethods);
    
    // Salvar preferência
    savePreferences(methodId);
  };

  // Função para obter o método de pagamento padrão atual
  const getDefaultPaymentMethod = () => {
    return paymentMethods.find(method => method.isDefault);
  };

  return (
    <View style={styles.container}>
      {/* Conteúdo principal */}
      {children}
      
      {/* Modal de preferências */}
      <Modal
        visible={showPreferences}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreferences(false)}
      >
        <View style={styles.modalContainer}>
          <PaymentPreferences
            serviceType={{ id: serviceId, name: serviceName }}
            paymentMethods={paymentMethods}
            onSelectDefault={handleSelectDefaultPayment}
            onClose={() => setShowPreferences(false)}
            showAnimation={showAnimation}
          />
        </View>
      </Modal>
      
      {/* Métodos expostos para componentes filhos */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            openPreferences: () => setShowPreferences(true),
            defaultPaymentMethod: getDefaultPaymentMethod(),
          });
        }
        return child;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ServicePreferencesManager;
