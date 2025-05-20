// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/SearchingDriverScreen.tsx
// Tela de "Buscando Motorista" com Animação

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Button, // Para simular a localização de um motorista
  Alert,
} from "react-native";
// import LottieView from 'lottie-react-native'; // Para animações mais complexas (opcional)

const SearchingDriverScreen = ({ route, navigation }: any) => {
  const { origin, destination, quantzaFare } = route.params;

  // Animação de radar/pulso
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("SearchingDriverScreen mounted with:", { origin, destination, quantzaFare });

    // Iniciar animação de pulso em loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simular a busca por um motorista e navegação após um tempo
    const findDriverTimeout = setTimeout(() => {
      console.log("Simulating driver found...");
      Alert.alert("Motorista Encontrado!", "Seu Quantza está a caminho.");
      // Navegar para a tela de Acompanhamento da Corrida
      navigation.replace("TrackRideScreen", {
        origin,
        destination,
        quantzaFare,
        driverDetails: {
          name: "Carlos Silva",
          vehicleModel: "Honda Civic Prata",
          vehiclePlate: "QZA2025",
          rating: 4.9,
          etaToPickup: "5 min",
          currentLocation: { latitude: origin.location.lat + 0.005, longitude: origin.location.lng + 0.005 } // Posição simulada
        },
      });
    }, 8000); // Simular 8 segundos de busca

    return () => clearTimeout(findDriverTimeout); // Limpar timeout ao desmontar

  }, [navigation, origin, destination, quantzaFare, pulseAnim]);

  const pulseStyle = {
    opacity: pulseAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    }),
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.8], // Efeito de pulsação no tamanho
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulseCircle, pulseStyle]} />
      <View style={styles.carIconContainer}>
        {/* <Icon name="car-sport" size={60} color="#D4A017" /> */}
        <Text style={styles.carIconPlaceholder}>🚗</Text>
      </View>
      
      <Text style={styles.title}>Buscando seu Quantza...</Text>
      <Text style={styles.subtitle}>
        Aguarde enquanto encontramos o motorista mais próximo para sua viagem de <Text style={styles.boldText}>{origin.description.split(",")[0]}</Text> para <Text style={styles.boldText}>{destination.description.split(",")[0]}</Text>.
      </Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.activityIndicator} />

      {/* Botão para cancelar a busca (opcional) */}
      {/* <Button 
        title="Cancelar Busca"
        onPress={() => {
          navigation.goBack();
          Alert.alert("Busca Cancelada", "Sua solicitação de corrida foi cancelada.");
        }}
        color="#FF6B6B"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D1B2A", // Azul escuro
    padding: 20,
  },
  pulseCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(212, 160, 23, 0.3)", // Dourado Quantza com opacidade
    position: "absolute",
  },
  carIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1E2A3A", // Fundo um pouco mais claro
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    zIndex: 1, // Para ficar sobre o círculo de pulso
  },
  carIconPlaceholder: {
    fontSize: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0", // Cinza claro
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: "bold",
    color: "#D4A017", // Dourado
  },
  activityIndicator: {
    marginBottom: 30,
  },
});

export default SearchingDriverScreen;

