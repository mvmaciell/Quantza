import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../constants/theme';

// Tipos de serviço disponíveis
const serviceTypes = [
  {
    id: 'ride',
    name: 'Corrida',
    icon: 'car-sport',
    description: 'Transporte de passageiros de um ponto a outro',
    available: true,
  },
  {
    id: 'delivery',
    name: 'Entregas',
    icon: 'cube',
    description: 'Transporte de itens e pacotes',
    available: true,
  },
  {
    id: 'pet',
    name: 'Transporte de Pets',
    icon: 'paw',
    description: 'Serviço especializado para transporte de animais',
    available: false, // Será implementado na Fase 3.4
    comingSoon: true,
  },
  {
    id: 'longTrip',
    name: 'Viagens Longas',
    icon: 'map',
    description: 'Serviço para trajetos intermunicipais',
    available: false, // Será implementado na Fase 3.5
    comingSoon: true,
  },
  {
    id: 'accessible',
    name: 'Transporte Acessível',
    icon: 'accessibility',
    description: 'Serviço especializado para pessoas com mobilidade reduzida',
    available: false, // Será implementado na Fase 3.6
    comingSoon: true,
  },
];

/**
 * Tela de seleção de tipo de serviço
 * 
 * Esta tela permite que o usuário selecione entre diferentes tipos de serviço
 * disponíveis no Quantza, como corridas, entregas, transporte de pets, etc.
 * 
 * @returns {React.ReactElement} Componente de tela de seleção de serviço
 */
const ServiceSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState('ride'); // Padrão: corrida
  const [animatedValues] = useState(
    serviceTypes.reduce((acc, service) => {
      acc[service.id] = new Animated.Value(service.id === 'ride' ? 1 : 0);
      return acc;
    }, {})
  );

  // Efeito para animar a seleção de serviço
  useEffect(() => {
    // Resetar todas as animações
    Object.keys(animatedValues).forEach(key => {
      Animated.timing(animatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    // Animar o serviço selecionado
    Animated.timing(animatedValues[selectedService], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedService]);

  // Função para selecionar um serviço
  const handleServiceSelection = (serviceId) => {
    // Verificar se o serviço está disponível
    const service = serviceTypes.find(s => s.id === serviceId);
    if (!service.available) {
      // Mostrar mensagem de "em breve"
      // Em uma implementação real, usaríamos um Toast ou Alert
      console.log(`${service.name} estará disponível em breve!`);
      return;
    }

    setSelectedService(serviceId);
  };

  // Função para continuar com o serviço selecionado
  const handleContinue = () => {
    // Navegar para a tela apropriada com base no serviço selecionado
    switch (selectedService) {
      case 'ride':
        navigation.navigate('SelectDestination');
        break;
      case 'delivery':
        navigation.navigate('DeliveryDetails');
        break;
      default:
        navigation.navigate('SelectDestination');
    }
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
        <Text style={styles.headerTitle}>Selecione o Serviço</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Escolha o tipo de serviço que você precisa
        </Text>

        <View style={styles.servicesContainer}>
          {serviceTypes.map((service) => {
            // Valores animados para o card selecionado
            const cardScale = animatedValues[service.id].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05],
            });
            
            const cardBorderColor = animatedValues[service.id].interpolate({
              inputRange: [0, 1],
              outputRange: [COLORS.lightGray, COLORS.gold],
            });

            const iconColor = animatedValues[service.id].interpolate({
              inputRange: [0, 1],
              outputRange: [COLORS.darkGray, COLORS.gold],
            });

            return (
              <Animated.View
                key={service.id}
                style={[
                  styles.serviceCard,
                  {
                    transform: [{ scale: cardScale }],
                    borderColor: cardBorderColor,
                    opacity: service.available ? 1 : 0.7,
                  },
                ]}
                testID={`serviceCard-${service.id}`}
              >
                <TouchableOpacity
                  style={styles.serviceCardContent}
                  onPress={() => handleServiceSelection(service.id)}
                  disabled={!service.available}
                >
                  <Animated.View style={styles.iconContainer}>
                    <Ionicons
                      name={service.icon}
                      size={32}
                      color={service.available ? iconColor : COLORS.mediumGray}
                    />
                  </Animated.View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>
                      {service.name}
                      {service.comingSoon && (
                        <Text style={styles.comingSoon}> (Em breve)</Text>
                      )}
                    </Text>
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                  </View>
                  {selectedService === service.id && service.available && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.gold} />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
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

const { width } = Dimensions.get('window');

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
  subtitle: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  serviceCardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  comingSoon: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  selectedIndicator: {
    marginLeft: 10,
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

export default ServiceSelectionScreen;
