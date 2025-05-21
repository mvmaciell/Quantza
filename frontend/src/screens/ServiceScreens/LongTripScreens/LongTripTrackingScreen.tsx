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
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Status da viagem
const TRIP_STATUS = {
  SEARCHING: 'searching',
  PARTNER_FOUND: 'partner_found',
  PICKUP: 'pickup',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
};

/**
 * Tela de acompanhamento da viagem longa
 * 
 * Esta tela permite que o usuário acompanhe o status da viagem longa em tempo real,
 * visualize a localização do parceiro e receba atualizações.
 * 
 * @returns {React.ReactElement} Componente de tela de acompanhamento da viagem longa
 */
const LongTripTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { longTripDetails, origin, destination } = route.params || {};
  
  const [tripStatus, setTripStatus] = useState(TRIP_STATUS.SEARCHING);
  const [partner, setPartner] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(105);
  const [showRoadAnimation, setShowRoadAnimation] = useState(true);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [totalDistance, setTotalDistance] = useState(120); // km
  
  const mapRef = useRef(null);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const statusBarWidth = useRef(new Animated.Value(0)).current;

  // Coordenadas simuladas para origem, destino e parceiro
  const originCoords = { latitude: -23.5505, longitude: -46.6333 };
  const destinationCoords = { latitude: -23.5605, longitude: -46.6533 };
  const [partnerCoords, setPartnerCoords] = useState({ latitude: -23.5405, longitude: -46.6233 });

  // Efeito para simular a progressão do status da viagem
  useEffect(() => {
    const statusTimeline = [
      { status: TRIP_STATUS.SEARCHING, delay: 3000 },
      { status: TRIP_STATUS.PARTNER_FOUND, delay: 5000 },
      { status: TRIP_STATUS.PICKUP, delay: 8000 },
      { status: TRIP_STATUS.IN_TRANSIT, delay: 10000 },
      { status: TRIP_STATUS.ARRIVED, delay: 20000 },
    ];

    let timeoutIds = [];

    statusTimeline.forEach((item, index) => {
      const timeoutId = setTimeout(() => {
        setTripStatus(item.status);
        
        // Atualizar estimativa de tempo
        if (item.status === TRIP_STATUS.PARTNER_FOUND) {
          setEstimatedTime(95);
          // Simular encontrar um parceiro
          setPartner({
            name: 'Carlos Silva',
            rating: 4.8,
            vehicle: 'Toyota Corolla',
            photo: 'https://randomuser.me/api/portraits/men/45.jpg',
            longTripVerified: true,
          });
          // Mostrar efeito de estrada e vibrar
          setShowRoadAnimation(true);
          Vibration.vibrate(100);
          setTimeout(() => setShowRoadAnimation(false), 1500);
        } else if (item.status === TRIP_STATUS.PICKUP) {
          setEstimatedTime(90);
          setDistanceCovered(5);
        } else if (item.status === TRIP_STATUS.IN_TRANSIT) {
          setEstimatedTime(85);
          setDistanceCovered(15);
          setShowRoadAnimation(false);
        } else if (item.status === TRIP_STATUS.ARRIVED) {
          setDistanceCovered(totalDistance);
          // Mostrar efeito de estrada e vibrar
          setShowRoadAnimation(true);
          Vibration.vibrate([0, 100, 50, 100]);
          setTimeout(() => setShowRoadAnimation(false), 1500);
        }
        
        // Animar a barra de progresso
        Animated.timing(statusBarWidth, {
          toValue: (index + 1) / statusTimeline.length,
          duration: 800,
          useNativeDriver: false,
        }).start();
      }, item.delay);
      
      timeoutIds.push(timeoutId);
    });

    // Simular movimento do parceiro
    const movePartnerInterval = setInterval(() => {
      if (tripStatus === TRIP_STATUS.PARTNER_FOUND || tripStatus === TRIP_STATUS.PICKUP) {
        // Mover em direção à origem
        setPartnerCoords(prev => ({
          latitude: prev.latitude + (originCoords.latitude - prev.latitude) * 0.1,
          longitude: prev.longitude + (originCoords.longitude - prev.longitude) * 0.1,
        }));
      } else if (tripStatus === TRIP_STATUS.IN_TRANSIT) {
        // Mover em direção ao destino
        setPartnerCoords(prev => ({
          latitude: prev.latitude + (destinationCoords.latitude - prev.latitude) * 0.1,
          longitude: prev.longitude + (destinationCoords.longitude - prev.longitude) * 0.1,
        }));
        
        // Incrementar distância coberta
        setDistanceCovered(prev => Math.min(prev + 2, totalDistance));
        
        // Atualizar tempo estimado
        setEstimatedTime(prev => Math.max(prev - 1, 0));
      }
    }, 1000);

    // Limpar timeouts e intervalos ao desmontar
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      clearInterval(movePartnerInterval);
    };
  }, []);

  // Efeito para animar o pulso
  useEffect(() => {
    if (showRoadAnimation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Parar a animação
      pulseAnimation.setValue(1);
    }
  }, [showRoadAnimation]);

  // Função para formatar tempo
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // Função para renderizar o conteúdo baseado no status
  const renderStatusContent = () => {
    switch (tripStatus) {
      case TRIP_STATUS.SEARCHING:
        return (
          <View style={styles.statusContent}>
            <Animated.View
              style={[
                styles.searchingContainer,
                {
                  transform: [{ scale: pulseAnimation }],
                },
              ]}
            >
              <LottieView
                source={require('../../../assets/animations/road-searching.json')}
                autoPlay
                loop
                style={styles.searchingAnimation}
              />
            </Animated.View>
            <Text style={styles.statusTitle}>Buscando Parceiro</Text>
            <Text style={styles.statusDescription}>
              Estamos encontrando o melhor parceiro para sua viagem longa
            </Text>
          </View>
        );
      
      case TRIP_STATUS.PARTNER_FOUND:
      case TRIP_STATUS.PICKUP:
      case TRIP_STATUS.IN_TRANSIT:
      case TRIP_STATUS.ARRIVED:
        return (
          <View style={styles.statusContent}>
            {partner && (
              <View style={styles.partnerContainer}>
                <View style={styles.partnerHeader}>
                  <Image
                    source={{ uri: partner.photo }}
                    style={styles.partnerPhoto}
                  />
                  <View style={styles.partnerInfo}>
                    <View style={styles.partnerNameContainer}>
                      <Text style={styles.partnerName}>{partner.name}</Text>
                      {partner.longTripVerified && (
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="car-sport" size={12} color={COLORS.white} />
                        </View>
                      )}
                    </View>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color={COLORS.gold} />
                      <Text style={styles.partnerRating}>{partner.rating}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="chatbubble-ellipses" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.partnerVehicle}>
                  <Ionicons name="car" size={18} color={COLORS.darkGray} />
                  <Text style={styles.vehicleText}>{partner.vehicle}</Text>
                </View>
                
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>
                    {tripStatus === TRIP_STATUS.PARTNER_FOUND && 'Parceiro a caminho'}
                    {tripStatus === TRIP_STATUS.PICKUP && 'Parceiro chegou'}
                    {tripStatus === TRIP_STATUS.IN_TRANSIT && 'Viagem em andamento'}
                    {tripStatus === TRIP_STATUS.ARRIVED && 'Viagem concluída!'}
                  </Text>
                  <Text style={styles.statusDescription}>
                    {tripStatus === TRIP_STATUS.PARTNER_FOUND && 'Seu parceiro está indo até o local de partida'}
                    {tripStatus === TRIP_STATUS.PICKUP && 'Seu parceiro está aguardando você'}
                    {tripStatus === TRIP_STATUS.IN_TRANSIT && 'Você está a caminho do seu destino'}
                    {tripStatus === TRIP_STATUS.ARRIVED && 'Você chegou ao seu destino!'}
                  </Text>
                </View>
                
                {tripStatus !== TRIP_STATUS.ARRIVED && (
                  <View style={styles.tripProgressContainer}>
                    <View style={styles.progressHeader}>
                      <View style={styles.distanceContainer}>
                        <Ionicons name="speedometer" size={16} color={COLORS.primary} />
                        <Text style={styles.distanceText}>
                          {distanceCovered}/{totalDistance} km
                        </Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.timeText}>
                          {formatTime(estimatedTime)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View 
                          style={[
                            styles.progressBarFill,
                            { width: `${(distanceCovered / totalDistance) * 100}%` }
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                )}
                
                {tripStatus === TRIP_STATUS.ARRIVED && (
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => navigation.navigate('LongTripRating', { partner })}
                  >
                    <Text style={styles.rateButtonText}>Avaliar Viagem</Text>
                    <Ionicons name="star" size={18} color={COLORS.white} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: (originCoords.latitude + destinationCoords.latitude) / 2,
          longitude: (originCoords.longitude + destinationCoords.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marcador de origem */}
        <Marker
          coordinate={originCoords}
          title="Origem"
          description={origin?.address || "Local de partida"}
        >
          <View style={styles.originMarker}>
            <Ionicons name="radio-button-on" size={24} color={COLORS.primary} />
          </View>
        </Marker>
        
        {/* Marcador de destino */}
        <Marker
          coordinate={destinationCoords}
          title="Destino"
          description={destination?.address || "Local de chegada"}
        >
          <View style={styles.destinationMarker}>
            <Ionicons name="location" size={24} color={COLORS.gold} />
          </View>
        </Marker>
        
        {/* Marcador do parceiro (se encontrado) */}
        {partner && (
          <Marker
            coordinate={partnerCoords}
            title={partner.name}
            description={partner.vehicle}
          >
            <View style={styles.partnerMarker}>
              <Ionicons name="car-sport" size={20} color={COLORS.white} />
            </View>
          </Marker>
        )}
        
        {/* Linha conectando origem e destino */}
        <Polyline
          coordinates={[originCoords, destinationCoords]}
          strokeWidth={3}
          strokeColor={COLORS.primary}
          lineDashPattern={[1]}
        />
      </MapView>
      
      {/* Efeito de estrada */}
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
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          testID="backButton"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acompanhar Viagem</Text>
      </View>
      
      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: statusBarWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
      
      {/* Conteúdo do status */}
      <View style={styles.contentContainer}>
        {renderStatusContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  roadAnimationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  roadAnimation: {
    width: 300,
    height: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(13, 27, 42, 0.8)', // COLORS.primaryDark com transparência
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(13, 27, 42, 0.8)', // COLORS.primaryDark com transparência
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  statusContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    ...SHADOWS.medium,
  },
  searchingContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  searchingAnimation: {
    width: 100,
    height: 100,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginBottom: 5,
  },
  statusDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  partnerContainer: {
    width: '100%',
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  partnerPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 3,
  },
  verifiedBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerRating: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 5,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  vehicleText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  statusTextContainer: {
    marginBottom: 15,
  },
  tripProgressContainer: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(13, 27, 42, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  rateButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    ...SHADOWS.medium,
  },
  rateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
});

export default LongTripTrackingScreen;
