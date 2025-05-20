// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/ConfirmRideScreen.tsx
// Tela para confirmar os detalhes da corrida com a tarifa Quantza

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from "react-native";
// import MapView, { Marker, Polyline } from 'react-native-maps'; // Para mostrar a rota no mapa

const ConfirmRideScreen = ({ route, navigation }: any) => {
  const { origin, destination, quantzaFare } = route.params;

  // Simulação de dados adicionais da rota (distância, tempo estimado)
  // Em um app real, isso viria do backend ou de uma API de rotas como Google Directions API
  const estimatedDistance = "5.2 km";
  const estimatedTime = "15-20 min";

  const handleConfirmRide = () => {
    console.log("Ride confirmed with Quantza fare:", quantzaFare);
    // Lógica para chamar o backend e solicitar a corrida
    // Ex: rideService.requestRide({ origin, destination, fare: quantzaFare });
    Alert.alert(
      "Chamando seu Quantza!",
      "Estamos buscando o motorista mais próximo para você."
    );
    // Navegar para a tela de "Buscando Motorista"
    navigation.replace("SearchingDriverScreen", { origin, destination, quantzaFare });
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirme sua Viagem</Text>

        {/* Placeholder para o Mapa com a Rota */}
        {/* <MapView
          style={styles.map}
          initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: Math.abs(destination.location.lat - origin.location.lat) * 1.5,
            longitudeDelta: Math.abs(destination.location.lng - origin.location.lng) * 1.5,
          }}
        >
          <Marker coordinate={origin.location} title="Origem" pinColor="green" />
          <Marker coordinate={destination.location} title="Destino" />
          {/* Adicionar Polyline para desenhar a rota */}
        {/* </MapView> */}
        <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Mapa da Rota Aqui</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>De:</Text>
            <Text style={styles.value}>{origin.description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Para:</Text>
            <Text style={styles.value}>{destination.description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Distância Estimada:</Text>
            <Text style={styles.value}>{estimatedDistance}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Tempo Estimado:</Text>
            <Text style={styles.value}>{estimatedTime}</Text>
          </View>
          <View style={[styles.detailItem, styles.fareItem]}>
            <Text style={styles.labelFare}>Tarifa Quantza:</Text>
            <Text style={styles.valueFare}>R$ {quantzaFare}</Text>
          </View>
        </View>

        {/* Adicionar opções de método de pagamento aqui */}
        <View style={styles.paymentMethodContainer}>
            <Text style={styles.paymentMethodText}>Pagamento: Cartão Final **** 1234 (Padrão)</Text>
            <Button title="Alterar" onPress={() => Alert.alert("Alterar Pagamento", "Funcionalidade de alterar método de pagamento (placeholder).")} />
        </View>

        <Button
          title="Confirmar e Chamar Quantza"
          onPress={handleConfirmRide}
          color="#D4A017" // Cor dourada do Quantza
        />
         <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          color="#AAAAAA" // Cinza para cancelar
          style={{marginTop: 10}}
        />
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#1E2A3A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  mapPlaceholderText: {
    color: "#A0A0A0",
    fontSize: 16,
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
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
    fontSize: 16,
    color: "#A0A0A0", // Cinza claro para labels
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
    color: "#FFFFFF",
  },
  fareItem: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#334050",
  },
  labelFare: {
    fontSize: 18,
    color: "#D4A017", // Dourado
    fontWeight: "bold",
  },
  valueFare: {
    fontSize: 22,
    color: "#D4A017", // Dourado
    fontWeight: "bold",
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    marginBottom: 25,
  },
  paymentMethodText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
});

export default ConfirmRideScreen;

