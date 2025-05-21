import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Tipos de veículo acessível
const vehicleTypes = [
  {
    id: 'standard_accessible',
    name: 'Padrão Acessível',
    icon: 'car',
    description: 'Veículo com espaço para cadeira de rodas',
    priceMultiplier: 1.2,
  },
  {
    id: 'van_accessible',
    name: 'Van Acessível',
    icon: 'car-sport',
    description: 'Van adaptada com mais espaço',
    priceMultiplier: 1.5,
  },
];

/**
 * Tela de detalhes do transporte acessível
 * 
 * Esta tela permite que o usuário configure os detalhes do transporte acessível,
 * como tipo de veículo, necessidades específicas e informações adicionais.
 * 
 * @returns {React.ReactElement} Componente de tela de detalhes do transporte acessível
 */
const AccessibleTransportDetailsScreen = () => {
  const navigation = useNavigation();
  const [vehicleType, setVehicleType] = useState('standard_accessible');
  const [needAssistance, setNeedAssistance] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(35.0);
  const [animatedValues] = useState({
    vehicleType: vehicleTypes.reduce((acc, type) => {
      acc[type.id] = new Animated.Value(type.id === 'standard_accessible' ? 1 : 0);
      return acc;
    }, {}),
  });
  const [priceAnimation] = useState(new Animated.Value(0));
  const [showAccessibilityAnimation, setShowAccessibilityAnimation] = useState(false);

  // Efeito para animar a seleção de tipo de veículo
  useEffect(() => {
    // Resetar todas as animações
    Object.keys(animatedValues.vehicleType).forEach(key => {
      Animated.timing(animatedValues.vehicleType[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    // Animar o tipo selecionado
    Animated.timing(animatedValues.vehicleType[vehicleType], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Recalcular preço estimado
    calculateEstimatedPrice();
  }, [vehicleType]);

  // Efeito para recalcular preço quando as opções mudam
  useEffect(() => {
    calculateEstimatedPrice();
  }, [needAssistance]);

  // Efeito para animar o preço quando ele muda
  useEffect(() => {
    // Animar o preço
    Animated.sequence([
      Animated.timing(priceAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(priceAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Mostrar efeito de acessibilidade e vibrar quando o preço muda
    setShowAccessibilityAnimation(true);
    Vibration.vibrate(100);
    setTimeout(() => setShowAccessibilityAnimation(false), 1000);
  }, [estimatedPrice]);

  // Função para calcular o preço estimado
  const calculateEstimatedPrice = () => {
    // Obter o multiplicador de tipo de veículo
    const typeMultiplier = vehicleTypes.find(t => t.id === vehicleType).priceMultiplier;
    
    // Preço base
    const basePrice = 35.0;
    
    // Aplicar multiplicador de tipo de veículo
    let finalPrice = basePrice * typeMultiplier;
    
    // Adicionar taxa para assistência adicional
    if (needAssistance) {
      finalPrice += 10.0;
    }
    
    // Atualizar preço estimado
    setEstimatedPrice(finalPrice);
  };

  // Função para continuar com os detalhes do transporte
  const handleContinue = () => {
    // Em uma implementação real, salvaríamos os detalhes e navegaríamos para a próxima tela
    navigation.navigate('SelectDestination', {
      serviceType: 'accessible',
      accessibleTransportDetails: {
        vehicleType,
        needAssistance,
        additionalInfo,
        estimatedPrice,
      },
    });
  };

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          testID="backButton"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Transporte Acessível</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de tipo de veículo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Veículo</Text>
          <Text style={styles.sectionSubtitle}>Selecione o tipo de veículo acessível</Text>
          
          <View style={styles.optionsContainer}>
            {vehicleTypes.map((type) => {
              // Valores animados para o card selecionado
              const cardScale = animatedValues.vehicleType[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              });
              
              const cardBorderColor = animatedValues.vehicleType[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.lightGray, COLORS.gold],
              });

              const iconColor = animatedValues.vehicleType[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.darkGray, COLORS.gold],
              });

              return (
                <Animated.View
                  key={type.id}
                  style={[
                    styles.optionCard,
                    {
                      transform: [{ scale: cardScale }],
                      borderColor: cardBorderColor,
                    },
                  ]}
                  testID={`vehicleType-${type.id}`}
                >
                  <TouchableOpacity
                    style={styles.optionCardContent}
                    onPress={() => setVehicleType(type.id)}
                  >
                    <Animated.View style={styles.iconContainer}>
                      <Ionicons
                        name={type.icon}
                        size={28}
                        color={iconColor}
                      />
                      <View style={styles.accessibilityIconOverlay}>
                        <Ionicons
                          name="accessibility"
                          size={14}
                          color={iconColor}
                        />
                      </View>
                    </Animated.View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionName}>{type.name}</Text>
                      <Text style={styles.optionDescription}>
                        {type.description}
                      </Text>
                    </View>
                    {vehicleType === type.id && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.gold} />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Seção de opções de assistência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções de Assistência</Text>
          <Text style={styles.sectionSubtitle}>Configure as opções de assistência necessárias</Text>
          
          {/* Opção de assistência adicional */}
          <View style={styles.optionContainer}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionName}>Assistência Adicional</Text>
              <Text style={styles.optionDescription}>
                Solicitar ajuda adicional do motorista
              </Text>
            </View>
            <Switch
              value={needAssistance}
              onValueChange={setNeedAssistance}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={needAssistance ? COLORS.gold : COLORS.white}
              testID="assistanceSwitch"
            />
          </View>
        </View>

        {/* Seção de informações adicionais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          <Text style={styles.sectionSubtitle}>Adicione informações importantes sobre suas necessidades</Text>
          
          <TextInput
            style={styles.additionalInfoInput}
            placeholder="Ex: Tipo de cadeira de rodas, necessidades específicas, etc."
            placeholderTextColor={COLORS.mediumGray}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline
            numberOfLines={3}
            testID="additionalInfo"
          />
        </View>

        {/* Seção de preço estimado */}
        <View style={styles.priceSection}>
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
          <Text style={styles.priceLabel}>Preço Estimado:</Text>
          <Animated.View
            style={[
              styles.priceContainer,
              {
                transform: [
                  {
                    scale: priceAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.1, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.currencySymbol}>R$</Text>
            <Text style={styles.priceValue}>
              {estimatedPrice.toFixed(2).replace('.', ',')}
            </Text>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          testID="continueButton"
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 15,
    opacity: 0.8,
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  optionCardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  accessibilityIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  selectedIndicator: {
    marginLeft: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  additionalInfoInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: COLORS.darkText,
    textAlignVertical: 'top',
    minHeight: 100,
    ...SHADOWS.medium,
  },
  priceSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    position: 'relative',
  },
  accessibilityAnimationContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  accessibilityAnimation: {
    width: 200,
    height: 200,
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
  footer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  continueButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default AccessibleTransportDetailsScreen;
