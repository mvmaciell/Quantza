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
import DateTimePicker from '@react-native-community/datetimepicker';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Tipos de veículo
const vehicleTypes = [
  {
    id: 'standard',
    name: 'Padrão',
    icon: 'car',
    description: 'Sedan ou hatchback',
    priceMultiplier: 1.0,
  },
  {
    id: 'comfort',
    name: 'Conforto',
    icon: 'car-sport',
    description: 'Mais espaço e conforto',
    priceMultiplier: 1.3,
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: 'car-sport',
    description: 'Veículos de luxo',
    priceMultiplier: 1.8,
  },
];

/**
 * Tela de detalhes da viagem longa
 * 
 * Esta tela permite que o usuário configure os detalhes da viagem longa,
 * como tipo de veículo, opção de ida e volta, data/hora e informações adicionais.
 * 
 * @returns {React.ReactElement} Componente de tela de detalhes da viagem longa
 */
const LongTripDetailsScreen = () => {
  const navigation = useNavigation();
  const [vehicleType, setVehicleType] = useState('standard');
  const [roundTrip, setRoundTrip] = useState(false);
  const [scheduledTrip, setScheduledTrip] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 dias depois
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(150.0);
  const [animatedValues] = useState({
    vehicleType: vehicleTypes.reduce((acc, type) => {
      acc[type.id] = new Animated.Value(type.id === 'standard' ? 1 : 0);
      return acc;
    }, {}),
  });
  const [priceAnimation] = useState(new Animated.Value(0));
  const [showRoadAnimation, setShowRoadAnimation] = useState(false);

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
  }, [roundTrip, scheduledTrip]);

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

    // Mostrar efeito de estrada e vibrar quando o preço muda
    setShowRoadAnimation(true);
    Vibration.vibrate(100);
    setTimeout(() => setShowRoadAnimation(false), 1000);
  }, [estimatedPrice]);

  // Função para calcular o preço estimado
  const calculateEstimatedPrice = () => {
    // Obter o multiplicador de tipo de veículo
    const typeMultiplier = vehicleTypes.find(t => t.id === vehicleType).priceMultiplier;
    
    // Preço base para viagem longa (50km+)
    const basePrice = 150.0;
    
    // Aplicar multiplicador de tipo de veículo
    let finalPrice = basePrice * typeMultiplier;
    
    // Adicionar preço para ida e volta
    if (roundTrip) {
      finalPrice *= 1.8; // 80% do preço original para a volta
    }
    
    // Adicionar taxa para viagem agendada
    if (scheduledTrip) {
      finalPrice += 15.0;
    }
    
    // Atualizar preço estimado
    setEstimatedPrice(finalPrice);
  };

  // Função para formatar data
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para lidar com mudança de data de partida
  const handleDepartureDateChange = (event, selectedDate) => {
    setShowDeparturePicker(false);
    if (selectedDate) {
      setDepartureDate(selectedDate);
      
      // Se a data de retorno for anterior à nova data de partida, ajustar
      if (roundTrip && returnDate < selectedDate) {
        const newReturnDate = new Date(selectedDate);
        newReturnDate.setDate(selectedDate.getDate() + 1);
        setReturnDate(newReturnDate);
      }
    }
  };

  // Função para lidar com mudança de data de retorno
  const handleReturnDateChange = (event, selectedDate) => {
    setShowReturnPicker(false);
    if (selectedDate) {
      setReturnDate(selectedDate);
    }
  };

  // Função para continuar com os detalhes da viagem
  const handleContinue = () => {
    // Em uma implementação real, salvaríamos os detalhes e navegaríamos para a próxima tela
    navigation.navigate('SelectDestination', {
      serviceType: 'longTrip',
      longTripDetails: {
        vehicleType,
        roundTrip,
        scheduledTrip,
        departureDate: departureDate.toISOString(),
        returnDate: returnDate.toISOString(),
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
        <Text style={styles.headerTitle}>Detalhes da Viagem Longa</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de tipo de veículo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Veículo</Text>
          <Text style={styles.sectionSubtitle}>Selecione o tipo de veículo para sua viagem</Text>
          
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

        {/* Seção de opções de viagem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções de Viagem</Text>
          <Text style={styles.sectionSubtitle}>Configure as opções da sua viagem longa</Text>
          
          {/* Opção de ida e volta */}
          <View style={styles.optionContainer}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionName}>Ida e Volta</Text>
              <Text style={styles.optionDescription}>
                Agendar viagem de retorno automaticamente
              </Text>
            </View>
            <Switch
              value={roundTrip}
              onValueChange={setRoundTrip}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={roundTrip ? COLORS.gold : COLORS.white}
              testID="roundTripSwitch"
            />
          </View>
          
          {/* Opção de agendamento */}
          <View style={styles.optionContainer}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionName}>Agendar Viagem</Text>
              <Text style={styles.optionDescription}>
                Programar para data e hora específicas
              </Text>
            </View>
            <Switch
              value={scheduledTrip}
              onValueChange={setScheduledTrip}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={scheduledTrip ? COLORS.gold : COLORS.white}
              testID="scheduledTripSwitch"
            />
          </View>
        </View>

        {/* Seção de datas (visível apenas se agendamento estiver ativado) */}
        {scheduledTrip && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data e Hora</Text>
            <Text style={styles.sectionSubtitle}>Selecione quando deseja viajar</Text>
            
            {/* Data e hora de partida */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDeparturePicker(true)}
              testID="departureDateButton"
            >
              <View style={styles.datePickerContent}>
                <Ionicons name="calendar" size={24} color={COLORS.primary} />
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>Data de Partida</Text>
                  <Text style={styles.dateValue}>{formatDate(departureDate)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.darkGray} />
            </TouchableOpacity>
            
            {/* Data e hora de retorno (visível apenas se ida e volta estiver ativado) */}
            {roundTrip && (
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowReturnPicker(true)}
                testID="returnDateButton"
              >
                <View style={styles.datePickerContent}>
                  <Ionicons name="calendar" size={24} color={COLORS.primary} />
                  <View style={styles.dateTextContainer}>
                    <Text style={styles.dateLabel}>Data de Retorno</Text>
                    <Text style={styles.dateValue}>{formatDate(returnDate)}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            )}
            
            {/* Date pickers */}
            {showDeparturePicker && (
              <DateTimePicker
                value={departureDate}
                mode="datetime"
                display="default"
                onChange={handleDepartureDateChange}
                minimumDate={new Date()}
                testID="departureDatePicker"
              />
            )}
            
            {showReturnPicker && (
              <DateTimePicker
                value={returnDate}
                mode="datetime"
                display="default"
                onChange={handleReturnDateChange}
                minimumDate={departureDate}
                testID="returnDatePicker"
              />
            )}
          </View>
        )}

        {/* Seção de informações adicionais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          <Text style={styles.sectionSubtitle}>Adicione informações importantes sobre sua viagem</Text>
          
          <TextInput
            style={styles.additionalInfoInput}
            placeholder="Ex: Quantidade de bagagem, preferências, etc."
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
          {showRoadAnimation && (
            <View style={styles.roadAnimationContainer}>
              <LottieView
                source={require('../../../assets/animations/road-animation.json')}
                autoPlay
                loop={false}
                style={styles.roadAnimation}
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
          <Text style={styles.priceNote}>
            *Preço final pode variar conforme distância exata e condições da viagem
          </Text>
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
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTextContainer: {
    marginLeft: 15,
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginTop: 2,
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
  roadAnimationContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  roadAnimation: {
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
  priceNote: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginTop: 5,
    textAlign: 'center',
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

export default LongTripDetailsScreen;
