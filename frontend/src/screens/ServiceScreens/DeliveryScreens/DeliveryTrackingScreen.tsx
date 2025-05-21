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

// Status da entrega
const DELIVERY_STATUS = {
  SEARCHING: 'searching',
  PARTNER_FOUND: 'partner_found',
  PICKUP: 'pickup',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
};

/**
 * Tela de acompanhamento da entrega
 * 
 * Esta tela permite que o usuário acompanhe o status da entrega em tempo real,
 * visualize a localização do entregador e receba atualizações.
 * 
 * @returns {React.ReactElement} Componente de tela de acompanhamento da entrega
 */
const DeliveryTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { deliveryDetails, origin, destination } = route.params || {};
  
  const [deliveryStatus, setDeliveryStatus] = useState(DELIVERY_STATUS.SEARCHING);
  const [partner, setPartner] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [showRay, setShowRay] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  
  const mapRef = useRef(null);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const statusBarWidth = useRef(new Animated.Value(0)).current;

  // Coordenadas simuladas para origem, destino e parceiro
  const originCoords = { latitude: -23.5505, longitude: -46.6333 };
  const destinationCoords = { latitude: -23.5605, longitude: -46.6533 };
  const [partnerCoords, setPartnerCoords] = useState({ latitude: -23.5405, longitude: -46.6233 });

  // Efeito para simular a progressão do status da entrega
  useEffect(() => {
    const statusTimeline = [
      { status: DELIVERY_STATUS.SEARCHING, delay: 3000 },
      { status: DELIVERY_STATUS.PARTNER_FOUND, delay: 5000 },
      { status: DELIVERY_STATUS.PICKUP, delay: 8000 },
      { status: DELIVERY_STATUS.IN_TRANSIT, delay: 10000 },
      { status: DELIVERY_STATUS.DELIVERED, delay: 15000 },
    ];

    let timeoutIds = [];

    statusTimeline.forEach((item, index) => {
      const timeoutId = setTimeout(() => {
        setDeliveryStatus(item.status);
        
        // Atualizar estimativa de tempo
        if (item.status === DELIVERY_STATUS.PARTNER_FOUND) {
          setEstimatedTime(12);
          // Simular encontrar um parceiro
          setPartner({
            name: 'Carlos Silva',
            rating: 4.8,
            vehicle: 'Honda CG 160',
            photo: 'https://randomuser.me/api/portraits/men/32.jpg',
          });
          // Mostrar efeito de raio e vibrar
          setShowRay(true);
          Vibration.vibrate(100);
          setTimeout(() => setShowRay(false), 1500);
        } else if (item.status === DELIVERY_STATUS.PICKUP) {
          setEstimatedTime(10);
        } else if (item.status === DELIVERY_STATUS.IN_TRANSIT) {
          setEstimatedTime(8);
          setShowPulse(false);
        } else if (item.status === DELIVERY_STATUS.DELIVERED) {
          // Mostrar efeito de raio e vibrar
          setShowRay(true);
          Vibration.vibrate([0, 100, 50, 100]);
          setTimeout(() => setShowRay(false), 1500);
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
      if (deliveryStatus === DELIVERY_STATUS.PARTNER_FOUND || deliveryStatus === DELIVERY_STATUS.PICKUP) {
        // Mover em direção à origem
        setPartnerCoords(prev => ({
          latitude: prev.latitude + (originCoords.latitude - prev.latitude) * 0.1,
          longitude: prev.longitude + (originCoords.longitude - prev.longitude) * 0.1,
        }));
      } else if (deliveryStatus === DELIVERY_STATUS.IN_TRANSIT) {
        // Mover em direção ao destino
        setPartnerCoords(prev => ({
          latitude: prev.latitude + (destinationCoords.latitude - prev.latitude) * 0.1,
          longitude: prev.longitude + (destinationCoords.longitude - prev.longitude) * 0.1,
        }));
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
    if (showPulse) {
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
  }, [showPulse]);

  // Função para renderizar o conteúdo baseado no status
  const renderStatusContent = () => {
    switch (deliveryStatus) {
      case DELIVERY_STATUS.SEARCHING:
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
                source={require('../../../assets/animations/searching.json')}
                autoPlay
                loop
                style={styles.searchingAnimation}
              />
            </Animated.View>
            <Text style={styles.statusTitle}>Buscando Entregador</Text>
            <Text style={styles.statusDescription}>
              Estamos encontrando o melhor entregador para você
            </Text>
          </View>
        );
      
      case DELIVERY_STATUS.PARTNER_FOUND:
      case DELIVERY_STATUS.PICKUP:
      case DELIVERY_STATUS.IN_TRANSIT:
      case DELIVERY_STATUS.DELIVERED:
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
                    <Text style={styles.partnerName}>{partner.name}</Text>
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
                  <Ionicons name="bicycle" size={18} color={COLORS.darkGray} />
                  <Text style={styles.vehicleText}>{partner.vehicle}</Text>
                </View>
                
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>
                    {deliveryStatus === DELIVERY_STATUS.PARTNER_FOUND && 'Entregador a caminho'}
                    {deliveryStatus === DELIVERY_STATUS.PICKUP && 'Coletando seu pacote'}
                    {deliveryStatus === DELIVERY_STATUS.IN_TRANSIT && 'Entrega em andamento'}
                    {deliveryStatus === DELIVERY_STATUS.DELIVERED && 'Entrega concluída!'}
                  </Text>
                  <Text style={styles.statusDescription}>
                    {deliveryStatus === DELIVERY_STATUS.PARTNER_FOUND && 'Seu entregador está indo até o local de coleta'}
                    {deliveryStatus === DELIVERY_STATUS.PICKUP && 'Seu entregador está coletando seu pacote'}
                    {deliveryStatus === DELIVERY_STATUS.IN_TRANSIT && 'Seu pacote está a caminho do destino'}
                    {deliveryStatus === DELIVERY_STATUS.DELIVERED && 'Seu pacote foi entregue com sucesso!'}
                  </Text>
                </View>
                
                {deliveryStatus !== DELIVERY_STATUS.DELIVERED && (
                  <View style={styles.estimatedTimeContainer}>
                    <Ionicons name="time-outline" size={20} color={COLORS.gold} />
                    <Text style={styles.estimatedTimeText}>
                      Tempo estimado: <Text style={styles.timeValue}>{estimatedTime} min</Text>
                    </Text>
                  </View>
                )}
                
                {deliveryStatus === DELIVERY_STATUS.DELIVERED && (
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => navigation.navigate('DeliveryRating', { partner })}
                  >
                    <Text style={styles.rateButtonText}>Avaliar Entrega</Text>
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
          description={origin?.address || "Local de coleta"}
        >
          <View style={styles.originMarker}>
            <Ionicons name="radio-button-on" size={24} color={COLORS.primary} />
          </View>
        </Marker>
        
        {/* Marcador de destino */}
        <Marker
          coordinate={destinationCoords}
          title="Destino"
          description={destination?.address || "Local de entrega"}
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
              <Ionicons name="bicycle" size={24} color={COLORS.white} />
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
      
      {/* Efeito de raio */}
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
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          testID="backButton"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acompanhar Entrega</Text>
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
  rayContainer: {
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
  rayAnimation: {
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
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 3,
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
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  estimatedTimeText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  timeValue: {
    fontWeight: 'bold',
    color: COLORS.primaryDark,
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

export default DeliveryTrackingScreen;
