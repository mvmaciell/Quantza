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

// Tipos de pacote disponíveis
const packageTypes = [
  {
    id: 'document',
    name: 'Documento',
    icon: 'document-text',
    description: 'Envelopes e documentos pequenos',
    maxWeight: '0.5kg',
  },
  {
    id: 'small',
    name: 'Pacote Pequeno',
    icon: 'cube-outline',
    description: 'Itens pequenos e leves',
    maxWeight: '3kg',
  },
  {
    id: 'medium',
    name: 'Pacote Médio',
    icon: 'cube',
    description: 'Itens de tamanho médio',
    maxWeight: '10kg',
  },
  {
    id: 'large',
    name: 'Pacote Grande',
    icon: 'archive',
    description: 'Itens grandes ou pesados',
    maxWeight: '20kg',
  },
];

// Tipos de urgência
const urgencyTypes = [
  {
    id: 'standard',
    name: 'Normal',
    icon: 'time-outline',
    description: 'Entrega padrão',
    multiplier: 1.0,
  },
  {
    id: 'express',
    name: 'Expressa',
    icon: 'flash-outline',
    description: 'Prioridade máxima',
    multiplier: 1.5,
  },
  {
    id: 'scheduled',
    name: 'Agendada',
    icon: 'calendar-outline',
    description: 'Escolha data e hora',
    multiplier: 1.2,
  },
];

/**
 * Tela de detalhes da entrega
 * 
 * Esta tela permite que o usuário configure os detalhes da entrega,
 * como tipo de pacote, urgência, instruções especiais e seguro.
 * 
 * @returns {React.ReactElement} Componente de tela de detalhes da entrega
 */
const DeliveryDetailsScreen = () => {
  const navigation = useNavigation();
  const [packageType, setPackageType] = useState('small');
  const [urgencyType, setUrgencyType] = useState('standard');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(25.0);
  const [animatedValues] = useState({
    package: packageTypes.reduce((acc, type) => {
      acc[type.id] = new Animated.Value(type.id === 'small' ? 1 : 0);
      return acc;
    }, {}),
    urgency: urgencyTypes.reduce((acc, type) => {
      acc[type.id] = new Animated.Value(type.id === 'standard' ? 1 : 0);
      return acc;
    }, {}),
  });
  const [priceAnimation] = useState(new Animated.Value(0));
  const [showRay, setShowRay] = useState(false);

  // Efeito para animar a seleção de tipo de pacote
  useEffect(() => {
    // Resetar todas as animações
    Object.keys(animatedValues.package).forEach(key => {
      Animated.timing(animatedValues.package[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    // Animar o tipo selecionado
    Animated.timing(animatedValues.package[packageType], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Recalcular preço estimado
    calculateEstimatedPrice();
  }, [packageType]);

  // Efeito para animar a seleção de urgência
  useEffect(() => {
    // Resetar todas as animações
    Object.keys(animatedValues.urgency).forEach(key => {
      Animated.timing(animatedValues.urgency[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    // Animar o tipo selecionado
    Animated.timing(animatedValues.urgency[urgencyType], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Recalcular preço estimado
    calculateEstimatedPrice();
  }, [urgencyType]);

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

    // Mostrar efeito de raio e vibrar quando o preço muda
    setShowRay(true);
    Vibration.vibrate(100);
    setTimeout(() => setShowRay(false), 1000);
  }, [estimatedPrice]);

  // Função para calcular o preço estimado
  const calculateEstimatedPrice = () => {
    // Obter o multiplicador de urgência
    const urgencyMultiplier = urgencyTypes.find(u => u.id === urgencyType).multiplier;
    
    // Preço base por tipo de pacote
    let basePrice = 0;
    switch (packageType) {
      case 'document':
        basePrice = 15.0;
        break;
      case 'small':
        basePrice = 25.0;
        break;
      case 'medium':
        basePrice = 40.0;
        break;
      case 'large':
        basePrice = 60.0;
        break;
      default:
        basePrice = 25.0;
    }
    
    // Aplicar multiplicador de urgência
    let finalPrice = basePrice * urgencyMultiplier;
    
    // Adicionar seguro se habilitado
    if (insuranceEnabled) {
      finalPrice += 5.0;
    }
    
    // Atualizar preço estimado
    setEstimatedPrice(finalPrice);
  };

  // Efeito para recalcular preço quando o seguro muda
  useEffect(() => {
    calculateEstimatedPrice();
  }, [insuranceEnabled]);

  // Função para continuar com os detalhes da entrega
  const handleContinue = () => {
    // Em uma implementação real, salvaríamos os detalhes e navegaríamos para a próxima tela
    navigation.navigate('SelectDestination', {
      serviceType: 'delivery',
      deliveryDetails: {
        packageType,
        urgencyType,
        specialInstructions,
        insuranceEnabled,
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
        <Text style={styles.headerTitle}>Detalhes da Entrega</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de tipo de pacote */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Pacote</Text>
          <Text style={styles.sectionSubtitle}>Selecione o tamanho do seu item</Text>
          
          <View style={styles.optionsContainer}>
            {packageTypes.map((type) => {
              // Valores animados para o card selecionado
              const cardScale = animatedValues.package[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              });
              
              const cardBorderColor = animatedValues.package[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.lightGray, COLORS.gold],
              });

              const iconColor = animatedValues.package[type.id].interpolate({
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
                  testID={`packageType-${type.id}`}
                >
                  <TouchableOpacity
                    style={styles.optionCardContent}
                    onPress={() => setPackageType(type.id)}
                  >
                    <Animated.View style={styles.iconContainer}>
                      <Ionicons
                        name={type.icon}
                        size={28}
                        color={iconColor}
                      />
                    </Animated.View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionName}>{type.name}</Text>
                      <Text style={styles.optionDescription}>
                        {type.description}
                      </Text>
                      <Text style={styles.optionDetail}>
                        Até {type.maxWeight}
                      </Text>
                    </View>
                    {packageType === type.id && (
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

        {/* Seção de urgência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgência</Text>
          <Text style={styles.sectionSubtitle}>Escolha a prioridade da entrega</Text>
          
          <View style={styles.urgencyContainer}>
            {urgencyTypes.map((type) => {
              // Valores animados para o card selecionado
              const cardScale = animatedValues.urgency[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              });
              
              const cardBorderColor = animatedValues.urgency[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.lightGray, COLORS.gold],
              });

              const iconColor = animatedValues.urgency[type.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.darkGray, COLORS.gold],
              });

              return (
                <Animated.View
                  key={type.id}
                  style={[
                    styles.urgencyCard,
                    {
                      transform: [{ scale: cardScale }],
                      borderColor: cardBorderColor,
                    },
                  ]}
                  testID={`urgencyType-${type.id}`}
                >
                  <TouchableOpacity
                    style={styles.urgencyCardContent}
                    onPress={() => setUrgencyType(type.id)}
                  >
                    <Animated.View style={styles.iconContainer}>
                      <Ionicons
                        name={type.icon}
                        size={28}
                        color={iconColor}
                      />
                    </Animated.View>
                    <Text style={styles.urgencyName}>{type.name}</Text>
                    <Text style={styles.urgencyDescription}>
                      {type.description}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Seção de instruções especiais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instruções Especiais</Text>
          <Text style={styles.sectionSubtitle}>Adicione informações importantes para o entregador</Text>
          
          <TextInput
            style={styles.instructionsInput}
            placeholder="Ex: Cuidado, item frágil. Entregar na portaria."
            placeholderTextColor={COLORS.mediumGray}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            testID="specialInstructions"
          />
        </View>

        {/* Seção de seguro */}
        <View style={styles.section}>
          <View style={styles.insuranceContainer}>
            <View style={styles.insuranceInfo}>
              <Text style={styles.insuranceName}>Seguro para Itens de Valor</Text>
              <Text style={styles.insuranceDescription}>
                Adicione proteção extra para seus itens valiosos (+R$5,00)
              </Text>
            </View>
            <Switch
              value={insuranceEnabled}
              onValueChange={setInsuranceEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={insuranceEnabled ? COLORS.gold : COLORS.white}
              testID="insuranceSwitch"
            />
          </View>
        </View>

        {/* Seção de preço estimado */}
        <View style={styles.priceSection}>
          {showRay && (
            <View style={styles.rayContainer}>
              <LottieView
                source={require('../../../assets/animations/lightning.json')}
                autoPlay
                loop={false}
                style={styles.rayAnimation}
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
    marginBottom: 2,
  },
  optionDetail: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  selectedIndicator: {
    marginLeft: 10,
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  urgencyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    width: '31%',
    ...SHADOWS.medium,
  },
  urgencyCardContent: {
    padding: 15,
    alignItems: 'center',
  },
  urgencyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginTop: 8,
    marginBottom: 3,
    textAlign: 'center',
  },
  urgencyDescription: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  instructionsInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: COLORS.darkText,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  insuranceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    ...SHADOWS.medium,
  },
  insuranceInfo: {
    flex: 1,
    marginRight: 15,
  },
  insuranceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 3,
  },
  insuranceDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  priceSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    position: 'relative',
  },
  rayContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rayAnimation: {
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

export default DeliveryDetailsScreen;
