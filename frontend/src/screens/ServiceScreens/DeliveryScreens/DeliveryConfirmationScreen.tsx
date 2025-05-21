import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

/**
 * Tela de confirmação da entrega
 * 
 * Esta tela permite que o usuário confirme os detalhes da entrega,
 * visualize o resumo e confirme a solicitação.
 * 
 * @returns {React.ReactElement} Componente de tela de confirmação da entrega
 */
const DeliveryConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { deliveryDetails, origin, destination } = route.params || {};
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const priceAnimation = useRef(new Animated.Value(1)).current;
  const confirmButtonScale = useRef(new Animated.Value(1)).current;

  // Efeito para animar o botão de confirmação
  useEffect(() => {
    // Animação de pulsação contínua para o botão
    Animated.loop(
      Animated.sequence([
        Animated.timing(confirmButtonScale, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(confirmButtonScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Função para formatar o preço
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  // Função para obter o nome do tipo de pacote
  const getPackageTypeName = () => {
    switch (deliveryDetails?.packageType) {
      case 'document':
        return 'Documento';
      case 'small':
        return 'Pacote Pequeno';
      case 'medium':
        return 'Pacote Médio';
      case 'large':
        return 'Pacote Grande';
      default:
        return 'Pacote';
    }
  };

  // Função para obter o nome do tipo de urgência
  const getUrgencyTypeName = () => {
    switch (deliveryDetails?.urgencyType) {
      case 'standard':
        return 'Normal';
      case 'express':
        return 'Expressa';
      case 'scheduled':
        return 'Agendada';
      default:
        return 'Normal';
    }
  };

  // Função para confirmar a entrega
  const handleConfirmDelivery = () => {
    setIsConfirming(true);
    
    // Animar o preço
    Animated.sequence([
      Animated.timing(priceAnimation, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(priceAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Vibrar e mostrar confetti
    Vibration.vibrate([0, 100, 50, 100]);
    setShowConfetti(true);
    
    // Simular processamento e navegar para a próxima tela
    setTimeout(() => {
      navigation.navigate('DeliveryTracking', {
        deliveryDetails,
        origin,
        destination,
      });
    }, 2500);
  };

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary]}
      style={styles.container}
    >
      {showConfetti && (
        <View style={styles.confettiContainer}>
          <LottieView
            source={require('../../../assets/animations/confetti.json')}
            autoPlay
            loop={false}
            style={styles.confettiAnimation}
          />
        </View>
      )}
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isConfirming}
          testID="backButton"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Entrega</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de resumo */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Ionicons name="cube" size={24} color={COLORS.gold} />
            <Text style={styles.summaryTitle}>Resumo da Entrega</Text>
          </View>
          
          {/* Detalhes do pacote */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipo de Pacote:</Text>
            <Text style={styles.detailValue}>{getPackageTypeName()}</Text>
          </View>
          
          {/* Detalhes da urgência */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Urgência:</Text>
            <Text style={styles.detailValue}>{getUrgencyTypeName()}</Text>
          </View>
          
          {/* Seguro */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seguro:</Text>
            <Text style={styles.detailValue}>
              {deliveryDetails?.insuranceEnabled ? 'Sim' : 'Não'}
            </Text>
          </View>
          
          {/* Instruções especiais */}
          {deliveryDetails?.specialInstructions ? (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsLabel}>Instruções Especiais:</Text>
              <Text style={styles.instructionsValue}>
                {deliveryDetails.specialInstructions}
              </Text>
            </View>
          ) : null}
        </View>
        
        {/* Seção de endereços */}
        <View style={styles.addressesContainer}>
          <View style={styles.addressHeader}>
            <Ionicons name="location" size={24} color={COLORS.gold} />
            <Text style={styles.addressTitle}>Endereços</Text>
          </View>
          
          {/* Origem */}
          <View style={styles.addressBox}>
            <View style={styles.addressIconContainer}>
              <Ionicons name="radio-button-on" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>Origem</Text>
              <Text style={styles.addressValue}>
                {origin?.address || 'Sua localização atual'}
              </Text>
            </View>
          </View>
          
          {/* Linha conectora */}
          <View style={styles.addressConnector}>
            <View style={styles.connectorLine} />
          </View>
          
          {/* Destino */}
          <View style={styles.addressBox}>
            <View style={styles.addressIconContainer}>
              <Ionicons name="location" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>Destino</Text>
              <Text style={styles.addressValue}>
                {destination?.address || 'Endereço de destino'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Seção de preço */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Valor Total:</Text>
          <Animated.View
            style={[
              styles.priceContainer,
              {
                transform: [{ scale: priceAnimation }],
              },
            ]}
          >
            <Text style={styles.currencySymbol}>R$</Text>
            <Text style={styles.priceValue}>
              {formatPrice(deliveryDetails?.estimatedPrice || 0)}
            </Text>
          </Animated.View>
          
          <Text style={styles.priceNote}>
            Valor estimado, pode variar conforme distância e tempo
          </Text>
        </View>
        
        {/* Seção de método de pagamento */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentHeader}>
            <Ionicons name="card" size={24} color={COLORS.gold} />
            <Text style={styles.paymentTitle}>Método de Pagamento</Text>
          </View>
          
          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodIcon}>
              <Ionicons name="card-outline" size={24} color={COLORS.primaryDark} />
            </View>
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>Cartão de Crédito</Text>
              <Text style={styles.paymentMethodDetail}>**** **** **** 1234</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View
          style={[
            styles.confirmButtonContainer,
            {
              transform: [{ scale: confirmButtonScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.confirmButton,
              isConfirming && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirmDelivery}
            disabled={isConfirming}
            testID="confirmButton"
          >
            {isConfirming ? (
              <>
                <LottieView
                  source={require('../../../assets/animations/loading.json')}
                  autoPlay
                  loop
                  style={styles.loadingAnimation}
                />
                <Text style={styles.confirmButtonText}>Processando...</Text>
              </>
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Confirmar Entrega</Text>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
  confettiAnimation: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.darkGray,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  instructionsContainer: {
    marginTop: 5,
    padding: 12,
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 5,
  },
  instructionsValue: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  addressesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginLeft: 10,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 3,
  },
  addressValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  addressConnector: {
    flexDirection: 'row',
    paddingLeft: 15,
    height: 30,
  },
  connectorLine: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  priceSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  priceLabel: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },
  priceValue: {
    color: COLORS.gold,
    fontSize: 36,
    fontWeight: 'bold',
  },
  priceNote: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginTop: 5,
    textAlign: 'center',
  },
  paymentSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginLeft: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    padding: 12,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...SHADOWS.small,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  paymentMethodDetail: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  confirmButtonContainer: {
    overflow: 'visible',
  },
  confirmButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.mediumGray,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loadingAnimation: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default DeliveryConfirmationScreen;
