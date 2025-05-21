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

// Tipos de porte de animal
const petSizes = [
  {
    id: 'small',
    name: 'Pequeno',
    icon: 'paw',
    description: 'Até 10kg',
    priceMultiplier: 1.0,
  },
  {
    id: 'medium',
    name: 'Médio',
    icon: 'paw',
    description: '10kg a 25kg',
    priceMultiplier: 1.2,
  },
  {
    id: 'large',
    name: 'Grande',
    icon: 'paw',
    description: 'Acima de 25kg',
    priceMultiplier: 1.5,
  },
];

// Opções de acompanhamento
const accompanimentOptions = [
  {
    id: 'with_owner',
    name: 'Com Tutor',
    icon: 'person',
    description: 'Você acompanhará o animal',
    priceMultiplier: 1.0,
  },
  {
    id: 'without_owner',
    name: 'Sem Tutor',
    icon: 'car',
    description: 'Apenas o animal será transportado',
    priceMultiplier: 1.3,
  },
];

/**
 * Tela de detalhes do transporte de pets
 * 
 * Esta tela permite que o usuário configure os detalhes do transporte de pets,
 * como porte do animal, opção de acompanhamento e informações adicionais.
 * 
 * @returns {React.ReactElement} Componente de tela de detalhes do transporte de pets
 */
const PetTransportDetailsScreen = () => {
  const navigation = useNavigation();
  const [petSize, setPetSize] = useState('small');
  const [accompaniment, setAccompaniment] = useState('with_owner');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [carrierEnabled, setCarrierEnabled] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(30.0);
  const [animatedValues] = useState({
    petSize: petSizes.reduce((acc, size) => {
      acc[size.id] = new Animated.Value(size.id === 'small' ? 1 : 0);
      return acc;
    }, {}),
    accompaniment: accompanimentOptions.reduce((acc, option) => {
      acc[option.id] = new Animated.Value(option.id === 'with_owner' ? 1 : 0);
      return acc;
    }, {}),
  });
  const [priceAnimation] = useState(new Animated.Value(0));
  const [showPawPrints, setShowPawPrints] = useState(false);

  // Efeito para animar a seleção de porte do animal
  useEffect(() => {
    // Resetar todas as animações
    Object.keys(animatedValues.petSize).forEach(key => {
      Animated.timing(animatedValues.petSize[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    // Animar o porte selecionado
    Animated.timing(animatedValues.petSize[petSize], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Recalcular preço estimado
    calculateEstimatedPrice();
  }, [petSize]);

  // Efeito para animar a seleção de acompanhamento
  useEffect(() => {
    // Resetar todas as animações
    Object.keys(animatedValues.accompaniment).forEach(key => {
      Animated.timing(animatedValues.accompaniment[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    // Animar a opção selecionada
    Animated.timing(animatedValues.accompaniment[accompaniment], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Recalcular preço estimado
    calculateEstimatedPrice();
  }, [accompaniment]);

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

    // Mostrar efeito de pegadas e vibrar quando o preço muda
    setShowPawPrints(true);
    Vibration.vibrate(100);
    setTimeout(() => setShowPawPrints(false), 1000);
  }, [estimatedPrice]);

  // Função para calcular o preço estimado
  const calculateEstimatedPrice = () => {
    // Obter o multiplicador de porte do animal
    const sizeMultiplier = petSizes.find(s => s.id === petSize).priceMultiplier;
    
    // Obter o multiplicador de acompanhamento
    const accompMultiplier = accompanimentOptions.find(a => a.id === accompaniment).priceMultiplier;
    
    // Preço base
    const basePrice = 30.0;
    
    // Aplicar multiplicadores
    let finalPrice = basePrice * sizeMultiplier * accompMultiplier;
    
    // Adicionar transportadora se habilitada
    if (carrierEnabled) {
      finalPrice += 10.0;
    }
    
    // Atualizar preço estimado
    setEstimatedPrice(finalPrice);
  };

  // Efeito para recalcular preço quando a transportadora muda
  useEffect(() => {
    calculateEstimatedPrice();
  }, [carrierEnabled]);

  // Função para continuar com os detalhes do transporte
  const handleContinue = () => {
    // Em uma implementação real, salvaríamos os detalhes e navegaríamos para a próxima tela
    navigation.navigate('SelectDestination', {
      serviceType: 'pet',
      petTransportDetails: {
        petSize,
        accompaniment,
        additionalInfo,
        carrierEnabled,
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
        <Text style={styles.headerTitle}>Detalhes do Transporte</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de porte do animal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Porte do Animal</Text>
          <Text style={styles.sectionSubtitle}>Selecione o tamanho do seu pet</Text>
          
          <View style={styles.optionsContainer}>
            {petSizes.map((size) => {
              // Valores animados para o card selecionado
              const cardScale = animatedValues.petSize[size.id].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              });
              
              const cardBorderColor = animatedValues.petSize[size.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.lightGray, COLORS.gold],
              });

              const iconColor = animatedValues.petSize[size.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.darkGray, COLORS.gold],
              });

              return (
                <Animated.View
                  key={size.id}
                  style={[
                    styles.optionCard,
                    {
                      transform: [{ scale: cardScale }],
                      borderColor: cardBorderColor,
                    },
                  ]}
                  testID={`petSize-${size.id}`}
                >
                  <TouchableOpacity
                    style={styles.optionCardContent}
                    onPress={() => setPetSize(size.id)}
                  >
                    <Animated.View style={styles.iconContainer}>
                      <Ionicons
                        name={size.icon}
                        size={28}
                        color={iconColor}
                      />
                    </Animated.View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionName}>{size.name}</Text>
                      <Text style={styles.optionDescription}>
                        {size.description}
                      </Text>
                    </View>
                    {petSize === size.id && (
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

        {/* Seção de acompanhamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acompanhamento</Text>
          <Text style={styles.sectionSubtitle}>Escolha como será o transporte</Text>
          
          <View style={styles.accompanimentContainer}>
            {accompanimentOptions.map((option) => {
              // Valores animados para o card selecionado
              const cardScale = animatedValues.accompaniment[option.id].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              });
              
              const cardBorderColor = animatedValues.accompaniment[option.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.lightGray, COLORS.gold],
              });

              const iconColor = animatedValues.accompaniment[option.id].interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.darkGray, COLORS.gold],
              });

              return (
                <Animated.View
                  key={option.id}
                  style={[
                    styles.accompanimentCard,
                    {
                      transform: [{ scale: cardScale }],
                      borderColor: cardBorderColor,
                    },
                  ]}
                  testID={`accompaniment-${option.id}`}
                >
                  <TouchableOpacity
                    style={styles.accompanimentCardContent}
                    onPress={() => setAccompaniment(option.id)}
                  >
                    <Animated.View style={styles.iconContainer}>
                      <Ionicons
                        name={option.icon}
                        size={28}
                        color={iconColor}
                      />
                    </Animated.View>
                    <Text style={styles.accompanimentName}>{option.name}</Text>
                    <Text style={styles.accompanimentDescription}>
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Seção de informações adicionais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          <Text style={styles.sectionSubtitle}>Adicione informações importantes sobre seu pet</Text>
          
          <TextInput
            style={styles.additionalInfoInput}
            placeholder="Ex: Nome do pet, comportamento, etc."
            placeholderTextColor={COLORS.mediumGray}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline
            numberOfLines={3}
            testID="additionalInfo"
          />
        </View>

        {/* Seção de transportadora */}
        <View style={styles.section}>
          <View style={styles.carrierContainer}>
            <View style={styles.carrierInfo}>
              <Text style={styles.carrierName}>Transportadora</Text>
              <Text style={styles.carrierDescription}>
                Adicione uma transportadora para maior segurança (+R$10,00)
              </Text>
            </View>
            <Switch
              value={carrierEnabled}
              onValueChange={setCarrierEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={carrierEnabled ? COLORS.gold : COLORS.white}
              testID="carrierSwitch"
            />
          </View>
        </View>

        {/* Seção de preço estimado */}
        <View style={styles.priceSection}>
          {showPawPrints && (
            <View style={styles.pawPrintsContainer}>
              <LottieView
                source={require('../../../assets/animations/paw-prints.json')}
                autoPlay
                loop={false}
                style={styles.pawPrintsAnimation}
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
  },
  selectedIndicator: {
    marginLeft: 10,
  },
  accompanimentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  accompanimentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    width: '48%',
    ...SHADOWS.medium,
  },
  accompanimentCardContent: {
    padding: 15,
    alignItems: 'center',
  },
  accompanimentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginTop: 8,
    marginBottom: 3,
    textAlign: 'center',
  },
  accompanimentDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  additionalInfoInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: COLORS.darkText,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  carrierContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    ...SHADOWS.medium,
  },
  carrierInfo: {
    flex: 1,
    marginRight: 15,
  },
  carrierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 3,
  },
  carrierDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  priceSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    position: 'relative',
  },
  pawPrintsContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  pawPrintsAnimation: {
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

export default PetTransportDetailsScreen;
