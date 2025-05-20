// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/PartnerRideEndScreen.tsx
// Tela de Fim de Corrida para o Parceiro (com avaliação do usuário)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
// import { AirbnbRating } from 'react-native-ratings'; // Para avaliação com estrelas

const PartnerRideEndScreen = ({ route, navigation }: any) => {
  const { rideDetails } = route.params; // Detalhes da corrida finalizada
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmitReview = async () => {
    console.log("Submitting review for user:", { rideId: rideDetails.id, userId: rideDetails.userId, rating, comment });
    // await rideService.submitPartnerReview(rideDetails.id, rideDetails.userId, rating, comment);
    Alert.alert("Avaliação Enviada!", "Obrigado pelo seu feedback!");
    // Navegar para a Home do Parceiro ou para uma tela de resumo de ganhos
    navigation.popToTop();
    navigation.navigate("PartnerHomeScreen"); // Ou para PartnerEarningsScreen
  };

  if (!rideDetails) {
    return <View style={styles.container}><Text>Carregando resumo da corrida...</Text></View>;
  }

  const userName = rideDetails.userName || "Passageiro";
  const earnings = rideDetails.partnerEarnings || (rideDetails.fare * 0.85); // Simulação de ganho do parceiro

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Corrida Finalizada!</Text>
        <Text style={styles.subtitle}>De: {rideDetails.origin.description}</Text>
        <Text style={styles.subtitle}>Para: {rideDetails.destination.description}</Text>
        <Text style={styles.fare}>Seu Ganho: R$ {earnings.toFixed(2)}</Text>
        
        <View style={styles.divider} />

        <Text style={styles.ratingTitle}>Avalie {userName}</Text>
        {/* Placeholder para o componente de estrelas */}
        <View style={styles.ratingPlaceholder}>
          <Text style={styles.ratingText}>Componente de Avaliação (Estrelas)</Text>
          <Text>Selecionado: {rating} estrelas</Text>
          {/* <AirbnbRating
            count={5}
            reviews={["Terrível", "Ruim", "OK", "Bom", "Ótimo"]}
            defaultRating={5}
            size={30}
            onFinishRating={(value) => setRating(value)}
            starContainerStyle={{ marginBottom: 15 }}
          /> */}
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder={`Deixe um comentário para ${userName} (opcional)`}
          placeholderTextColor="#A0A0A0"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        <Button title="Enviar Avaliação e Voltar" onPress={handleSubmitReview} color="#D4A017" />

        <View style={styles.rideSummary}>
            <Text style={styles.summaryTitle}>Detalhes da Corrida</Text>
            <Text style={styles.summaryText}>Distância Percorrida: {rideDetails.distance || "N/A"}</Text>
            <Text style={styles.summaryText}>Duração: {rideDetails.duration || "N/A"}</Text>
            <Text style={styles.summaryText}>Valor Total da Corrida: R$ {rideDetails.fare?.toFixed(2) || rideDetails.quantzaFare?.toFixed(2)}</Text>
        </View>

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
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0",
    marginBottom: 5,
    textAlign: "center",
  },
  fare: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#81b0ff", // Azul claro para ganhos
    marginVertical: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#1E2A3A",
    width: "90%",
    marginVertical: 20,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  ratingPlaceholder: {
    marginBottom: 20,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    width: "100%",
  },
  ratingText: {
    color: "#A0A0A0",
    marginBottom: 5,
  },
  commentInput: {
    backgroundColor: "#1E2A3A",
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    textAlignVertical: "top",
    minHeight: 100,
    width: "100%",
    marginBottom: 20,
    fontSize: 16,
  },
  rideSummary: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    width: "100%",
    alignItems: "flex-start", // Alinhar texto à esquerda
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D4A017",
    marginBottom: 10,
    alignSelf: "center",
  },
  summaryText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
});

export default PartnerRideEndScreen;

