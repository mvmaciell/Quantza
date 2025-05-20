// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/PartnerHomeScreen.tsx
// Tela Home do Parceiro (Motorista)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  Alert,
} from "react-native";
// import MapView, { Marker } from 'react-native-maps'; // Para o mapa
// import { partnerService } from "../../services/partner/partnerService"; // Supondo um partnerService

const PartnerHomeScreen = ({ navigation }: any) => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null); // { latitude: number, longitude: number }
  const [activeRide, setActiveRide] = useState<any>(null); // Detalhes de uma corrida ativa, se houver

  // Simular obtenção da localização atual do parceiro
  useEffect(() => {
    // Em um app real, usar Geolocation.getCurrentPosition
    setCurrentLocation({ latitude: -23.55052, longitude: -46.633308 });
    console.log("PartnerHomeScreen: Fetched current location (placeholder)");

    // Verificar se há uma corrida ativa (placeholder)
    // const checkActiveRide = async () => {
    //   const ride = await partnerService.getActiveRide();
    //   setActiveRide(ride);
    // };
    // checkActiveRide();
  }, []);

  const toggleOnlineStatus = async (value: boolean) => {
    setIsOnline(value);
    try {
      // await partnerService.updateOnlineStatus(value);
      Alert.alert("Status Alterado", `Você está ${value ? "Online" : "Offline"}.`);
      console.log(`Partner status changed to: ${value ? "Online" : "Offline"} (placeholder)`);
      if (value && activeRide) {
        // Se ficar online e tiver corrida ativa, talvez navegar para a tela da corrida
        // navigation.navigate("PartnerTrackRideScreen", { rideDetails: activeRide });
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar seu status online.");
      setIsOnline(!value); // Reverter
    }
  };

  if (activeRide) {
    // Se houver uma corrida ativa, talvez redirecionar ou mostrar uma UI diferente
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Corrida em Andamento</Text>
        <Text>Origem: {activeRide.origin.description}</Text>
        <Text>Destino: {activeRide.destination.description}</Text>
        <Button title="Ver Detalhes da Corrida" onPress={() => navigation.navigate("PartnerTrackRideScreen", { rideDetails: activeRide })} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel do Parceiro</Text>
        <View style={styles.onlineSwitchContainer}>
          <Text style={styles.onlineLabel}>{isOnline ? "Online" : "Offline"}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isOnline ? "#D4A017" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleOnlineStatus}
            value={isOnline}
          />
        </View>
      </View>

      {/* Placeholder para o Mapa */}
      {/* <MapView
        style={styles.map}
        region={currentLocation ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : undefined}
        showsUserLocation
        followsUserLocation
      >
        {currentLocation && <Marker coordinate={currentLocation} title="Sua Posição" pinColor="#D4A017"/>}
      </MapView> */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>
          {isOnline ? "Aguardando novas solicitações..." : "Fique online para receber corridas."}
        </Text>
        {currentLocation && <Text style={styles.mapLocationText}>(Sua Localização: Lat {currentLocation.latitude.toFixed(3)}, Lon {currentLocation.longitude.toFixed(3)})</Text>}
      </View>

      {isOnline && !activeRide && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Você está online e pronto para receber novas solicitações de corrida.</Text>
          {/* Aqui poderiam aparecer informações como: Ganhos do dia, Próximos incentivos, etc. */}
        </View>
      )}

      {!isOnline && (
         <View style={styles.infoBoxOffline}>
          <Text style={styles.infoTextOffline}>Você está offline. Alterne para online para começar a receber corridas.</Text>
        </View>
      )}

      {/* Botões para outras seções do app do parceiro */}
      <View style={styles.actionsContainer}>
        <Button title="Meus Ganhos" onPress={() => navigation.navigate("PartnerEarningsScreen")} />
        <Button title="Histórico de Corridas" onPress={() => navigation.navigate("PartnerRideHistoryScreen")} />
        <Button title="Meu Perfil" onPress={() => navigation.navigate("PartnerProfileScreen")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20, // Ajuste para status bar, se necessário
    paddingBottom: 10,
    backgroundColor: "#1E2A3A",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  onlineSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 8,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    backgroundColor: "#15202B", // Um pouco mais escuro que o header
    borderRadius: 10,
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 18,
    color: "#A0A0A0",
    textAlign: "center",
  },
  mapLocationText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },
  map: {
    flex: 1,
  },
  infoBox: {
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: "rgba(212, 160, 23, 0.1)", // Dourado com opacidade baixa
    borderRadius: 8,
    marginBottom: 10,
  },
  infoText: {
    color: "#D4A017",
    fontSize: 15,
    textAlign: "center",
  },
  infoBoxOffline: {
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: "rgba(128, 128, 128, 0.1)", // Cinza com opacidade baixa
    borderRadius: 8,
    marginBottom: 10,
  },
  infoTextOffline: {
    color: "#A0A0A0",
    fontSize: 15,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#1E2A3A",
  },
});

export default PartnerHomeScreen;

