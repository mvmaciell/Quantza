// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/PartnerTrackRideScreen.tsx
// Tela para o Parceiro acompanhar e gerenciar uma corrida aceita

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
// import MapView, { Marker, Polyline } from 'react-native-maps'; // Para o mapa
// import { rideService } from "../../services/ride/rideService"; // Supondo um rideService

const PartnerTrackRideScreen = ({ route, navigation }: any) => {
  const { rideDetails: initialRideDetails } = route.params; // Detalhes da corrida aceita
  const [ride, setRide] = useState<any>(initialRideDetails);
  const [currentLeg, setCurrentLeg] = useState<"to_passenger" | "to_destination">("to_passenger");

  useEffect(() => {
    console.log("PartnerTrackRideScreen mounted with ride:", ride);
    // Lógica para se inscrever em atualizações da corrida via WebSocket, se aplicável

    // Se a corrida já estiver em um estado avançado (ex: vindo de uma reconexão)
    if (ride.status === "IN_PROGRESS_TO_DESTINATION") {
      setCurrentLeg("to_destination");
    } else if (ride.status === "ACCEPTED_BY_PARTNER" || ride.status === "IN_PROGRESS_TO_PASSENGER") {
      setCurrentLeg("to_passenger");
    }

  }, [ride]);

  const handleArrivedAtPassenger = async () => {
    Alert.alert("Chegou ao Passageiro!", "Aguardando o passageiro embarcar.");
    // await rideService.updateRideStatus(ride.id, "ARRIVED_AT_PASSENGER");
    // setRide({ ...ride, status: "ARRIVED_AT_PASSENGER" }); // Atualizar estado local
    // setCurrentLeg("to_destination"); // Próxima etapa é levar ao destino, mas só após iniciar corrida
    console.log("Partner arrived at passenger (placeholder)");
    // Idealmente, o backend confirmaria e o status mudaria para algo como PASSENGER_PICKED_UP ou IN_PROGRESS_TO_DESTINATION
    // Por ora, vamos simular que o próximo passo é iniciar a viagem para o destino.
    setRide({ ...ride, status: "ARRIVED_AT_PASSENGER_WAITING_START" });
  };

  const handleStartRideToDestination = async () => {
    Alert.alert("Viagem Iniciada!", `Levando ${ride.passengerName || "o passageiro"} para ${ride.destination.description}.`);
    // await rideService.updateRideStatus(ride.id, "IN_PROGRESS_TO_DESTINATION");
    setRide({ ...ride, status: "IN_PROGRESS_TO_DESTINATION" });
    setCurrentLeg("to_destination");
    console.log("Ride started to destination (placeholder)");
  };

  const handleFinishRide = async () => {
    Alert.alert("Corrida Finalizada!", "Obrigado por viajar com a Quantza!");
    // await rideService.updateRideStatus(ride.id, "COMPLETED");
    console.log("Ride finished (placeholder)");
    // Navegar de volta para a Home do Parceiro ou para uma tela de resumo da corrida
    navigation.popToTop(); // Volta para a primeira tela da stack (PartnerHomeScreen)
    navigation.navigate("PartnerHomeScreen");
  };

  const handleCancelRide = () => {
    Alert.alert(
      "Cancelar Corrida",
      "Tem certeza que deseja cancelar esta corrida? Isso pode afetar sua avaliação.",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim, Cancelar", onPress: async () => {
            // await rideService.cancelRideByPartner(ride.id);
            console.log("Ride cancelled by partner (placeholder)");
            navigation.popToTop();
            navigation.navigate("PartnerHomeScreen");
          }, style: "destructive" 
        },
      ]
    );
  };

  if (!ride) {
    return <View style={styles.container}><Text>Carregando detalhes da corrida...</Text></View>;
  }

  const passengerName = ride.passengerName || ride.userName || "Passageiro";

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {currentLeg === "to_passenger" ? `A Caminho de ${passengerName}` : `Levando ${passengerName}`}
        </Text>

        {/* Placeholder para o Mapa com a Rota */}
        <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>
              Mapa: {currentLeg === "to_passenger" ? `Rota para ${ride.origin.description}` : `Rota para ${ride.destination.description}`}
            </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Passageiro:</Text>
            <Text style={styles.value}>{passengerName} (Avaliação: {ride.userRating || "N/A"} ★)</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{currentLeg === "to_passenger" ? "Ponto de Encontro:" : "Origem:"}</Text>
            <Text style={styles.value}>{ride.origin.description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Destino Final:</Text>
            <Text style={styles.value}>{ride.destination.description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Ganho Estimado:</Text>
            <Text style={styles.valueFare}>R$ {ride.estimatedFare?.toFixed(2) || ride.quantzaFare?.toFixed(2) || "N/A"}</Text>
          </View>
        </View>

        {/* Botões de Ação */} 
        <View style={styles.actionsContainer}>
          {ride.status === "ACCEPTED_BY_PARTNER" && (
            <Button title={`Cheguei em ${passengerName}`} onPress={handleArrivedAtPassenger} color="#3498DB" />
          )}
          {ride.status === "ARRIVED_AT_PASSENGER_WAITING_START" && (
            <Button title={`Iniciar Viagem para ${ride.destination.description.split(",")[0]}`} onPress={handleStartRideToDestination} color="#2ECC71" />
          )}
          {ride.status === "IN_PROGRESS_TO_DESTINATION" && (
            <Button title="Finalizar Corrida" onPress={handleFinishRide} color="#D4A017" />
          )}
        </View>

        {/* Botão de Navegação (abrir Google Maps/Waze) */}
        <Button 
            title={`Navegar para ${currentLeg === "to_passenger" ? "Passageiro" : "Destino"}`}
            onPress={() => Alert.alert("Navegação", `Abrir app de mapas para ${currentLeg === "to_passenger" ? ride.origin.description : ride.destination.description} (placeholder)`)}
            style={{marginTop: 10}}
        />

        {/* Botão de Cancelar (com cautela) */}
        {(ride.status === "ACCEPTED_BY_PARTNER" || ride.status === "ARRIVED_AT_PASSENGER_WAITING_START") && (
            <Button title="Cancelar Corrida" onPress={handleCancelRide} color="#E74C3C" style={{marginTop: 20}}/>
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: "#1E2A3A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  mapPlaceholderText: {
    color: "#A0A0A0",
    fontSize: 16,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#1E2A3A",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: "#A0A0A0",
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  valueFare: {
    fontSize: 18,
    color: "#D4A017",
    fontWeight: "bold",
  },
  actionsContainer: {
    marginBottom: 15,
  },
});

export default PartnerTrackRideScreen;

