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
 * Tela de confirmação do transporte acessível
 * 
 * Esta tela permite que o usuário confirme os detalhes do transporte acessível,
 * visualize o resumo e confirme a solicitação.
 * 
 * @returns {React.ReactElement} Componente de tela de confirmação do transporte acessível
 */
const AccessibleTransportConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { accessibleTransportDetails, origin, destination } = route.params || {};
  
  const [showAccessibilityAnimation, setShowAccessibilityAnimation] = useState(false);
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

  // Função para obter o nome do tipo de veículo
  const getVehicleTypeName = () => {
    switch (accessibleTransportDetails?.vehicleType) {
      case 'standard_accessible':
        return 'Padrão Acessível';
      case 'van_accessible':
        return 'Van Acessível';
      default:
        return 'Padrão Acessível';
    }
  };

  // Função para confirmar o transporte
  const handleConfirmTransport = () => {
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
    
    // Vibrar e mostrar animação de acessibilidade
    Vibration.vibrate([0, 100, 50, 100]);
    setShowAccessibilityAnimation(true);
    
    // Simular processamento e navegar para a próxima tela
    setTimeout(() => {
      navigation.navigate('AccessibleTransportTracking', {
        accessibleTransportDetails,
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
      {showAccessibilityAnimation && (
        <View style={styles.accessibilityAnimationContainer}>
          <LottieView
            source={require('../../../assets/animations/accessibility-animation.json')}
            autoPlay
            loop={false}
            style={styles.accessibilityAnimation}
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
        <Text style={styles.headerTitle}>Confirmar Transporte Acessível</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de resumo */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Ionicons name="accessibility" size={24} color={COLORS.gold} />
            <Text style={styles.summaryTitle}>Resumo do Transporte</Text>
          </View>
          
          {/* Detalhes do veículo */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipo de Veículo:</Text>
            <Text style={styles.detailValue}>{getVehicleTypeName()}</Text>
          </View>
          
          {/* Assistência adicional */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assistência Adicional:</Text>
            <Text style={styles.detailValue}>
              {accessibleTransportDetails?.needAssistance ? 'Sim' : 'Não'}
            </Text>
          </View>
          
          {/* Informações adicionais */}
          {accessibleTransportDetails?.additionalInfo ? (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.additionalInfoLabel}>Informações Adicionais:</Text>
              <Text style={styles.additionalInfoValue}>
                {accessibleTransportDetails.additionalInfo}
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
              {formatPrice(accessibleTransportDetails?.estimatedPrice || 0)}
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
        
        {/* Seção de parceiro verificado */}
        <View style={styles.partnerSection}>
          <View style={styles.partnerHeader}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.gold} />
            <Text style={styles.partnerTitle}>Parceiro Verificado</Text>
          </View>
          
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerDescription}>
              Seu transporte será realizado por um parceiro com veículo adaptado para acessibilidade.
            </Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="accessibility" size={16} color={COLORS.white} />
              <Text style={styles.verifiedText}>Acessibilidade</Text>
            </View>
          </View>
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
            onPress={handleConfirmTransport}
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
                <Text style={styles.confirmButtonText}>Confirmar Transporte</Text>
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
  accessibilityAnimationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
  accessibilityAnimation: {
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
  additionalInfoContainer: {
    marginTop: 5,
    padding: 12,
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
  },
  additionalInfoLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 5,
  },
  additionalInfoValue: {
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
  partnerSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  partnerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginLeft: 10,
  },
  partnerInfo: {
    alignItems: 'center',
  },
  partnerDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 15,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  verifiedText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 5,
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

export default AccessibleTransportConfirmationScreen;
