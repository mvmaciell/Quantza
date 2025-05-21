import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../constants/theme';

// Tipos
interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'pix' | 'cash';
  name: string;
  details: string;
  isDefault: boolean;
}

interface ServiceType {
  id: string;
  name: string;
}

interface PaymentPreferencesProps {
  serviceType: ServiceType;
  paymentMethods: PaymentMethod[];
  onSelectDefault: (methodId: string) => void;
  onClose: () => void;
  showAnimation?: boolean;
}

/**
 * Componente de preferências de pagamento por tipo de serviço
 * 
 * Este componente permite que o usuário selecione um método de pagamento padrão
 * para um tipo específico de serviço, com animações e feedback visual.
 * 
 * @param {PaymentPreferencesProps} props - Propriedades do componente
 * @returns {React.ReactElement} Componente de preferências de pagamento
 */
const PaymentPreferences: React.FC<PaymentPreferencesProps> = ({
  serviceType,
  paymentMethods,
  onSelectDefault,
  onClose,
  showAnimation = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    paymentMethods.find(method => method.isDefault)?.id || null
  );
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  
  const pointsAnimation = useRef(new Animated.Value(0)).current;
  const containerScale = useRef(new Animated.Value(0.95)).current;

  // Efeito para animar a entrada do componente
  useEffect(() => {
    Animated.spring(containerScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  // Efeito para mostrar animação de pontos quando solicitado
  useEffect(() => {
    if (showAnimation) {
      // Simular ganho de pontos por definir preferência
      const points = 15;
      setEarnedPoints(points);
      
      // Simular total de pontos do usuário
      setTotalPoints(350 + points);
      
      // Mostrar animação de pontos
      setShowPointsAnimation(true);
      
      // Vibrar para feedback tátil
      Vibration.vibrate([0, 100, 50, 100]);
      
      // Animar o contador de pontos
      Animated.timing(pointsAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
      
      // Esconder a animação após um tempo
      setTimeout(() => {
        setShowPointsAnimation(false);
      }, 3000);
    }
  }, [showAnimation]);

  // Função para selecionar um método de pagamento como padrão
  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    onSelectDefault(methodId);
  };

  // Função para renderizar um ícone baseado no tipo de pagamento
  const renderPaymentIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <Ionicons name="card" size={24} color={COLORS.primary} />;
      case 'debit':
        return <Ionicons name="card-outline" size={24} color={COLORS.primary} />;
      case 'pix':
        return <Ionicons name="flash" size={24} color={COLORS.primary} />;
      case 'cash':
        return <Ionicons name="cash" size={24} color={COLORS.primary} />;
      default:
        return <Ionicons name="card" size={24} color={COLORS.primary} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: containerScale }],
        },
      ]}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Pagamento Padrão para {serviceType.name}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          testID="closeButton"
        >
          <Ionicons name="close" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>

      {/* Descrição */}
      <Text style={styles.description}>
        Selecione o método de pagamento padrão para {serviceType.name}.
        Esta preferência será aplicada automaticamente em suas próximas solicitações.
      </Text>

      {/* Lista de métodos de pagamento */}
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.paymentMethodItem,
              selectedMethod === item.id && styles.selectedMethodItem,
            ]}
            onPress={() => handleSelectMethod(item.id)}
            testID={`paymentMethod-${item.id}`}
          >
            <View style={styles.paymentMethodIcon}>
              {renderPaymentIcon(item.type)}
            </View>
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>{item.name}</Text>
              <Text style={styles.paymentMethodDetails}>{item.details}</Text>
            </View>
            {selectedMethod === item.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Botão de salvar */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onClose}
        testID="saveButton"
      >
        <Text style={styles.saveButtonText}>Salvar Preferência</Text>
      </TouchableOpacity>

      {/* Animação de pontos */}
      {showPointsAnimation && (
        <View style={styles.pointsAnimationContainer}>
          <LottieView
            source={require('../../assets/animations/points-animation.json')}
            autoPlay
            loop={false}
            style={styles.pointsAnimation}
          />
          <Animated.View
            style={[
              styles.pointsContent,
              {
                opacity: pointsAnimation,
                transform: [
                  {
                    translateY: pointsAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.pointsEarned}>+{earnedPoints} pontos</Text>
            <Text style={styles.pointsTotal}>Total: {totalPoints} pontos</Text>
          </Animated.View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  description: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMethodItem: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(27, 118, 188, 0.05)',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    ...SHADOWS.small,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 3,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  selectedIndicator: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.medium,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsAnimationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    zIndex: 10,
  },
  pointsAnimation: {
    width: 150,
    height: 150,
  },
  pointsContent: {
    alignItems: 'center',
  },
  pointsEarned: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 5,
  },
  pointsTotal: {
    fontSize: 16,
    color: COLORS.primaryDark,
  },
});

export default PaymentPreferences;
