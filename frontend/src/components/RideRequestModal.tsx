// Placeholder: /home/ubuntu/quantza_app/frontend/src/components/RideRequestModal.tsx
// Modal para exibir uma nova solicitação de corrida para o Parceiro

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Button,
  Animated,
  Vibration,
} from "react-native";

interface RideRequest {
  id: string;
  userName: string;
  userRating: number;
  origin: { description: string; location: { lat: number; lng: number } };
  destination: { description: string; location: { lat: number; lng: number } };
  estimatedFare: number;
  estimatedDistance: string;
  estimatedDuration: string;
}

interface RideRequestModalProps {
  isVisible: boolean;
  rideRequest: RideRequest | null;
  onAccept: (rideId: string) => void;
  onReject: (rideId: string) => void;
  onDismiss: () => void; // Para quando o tempo esgota ou é dispensado de outra forma
}

const RIDE_ACCEPT_TIMEOUT_MS = 30000; // 30 segundos para aceitar

const RideRequestModal: React.FC<RideRequestModalProps> = ({
  isVisible,
  rideRequest,
  onAccept,
  onReject,
  onDismiss,
}) => {
  const [timeLeft, setTimeLeft] = useState(RIDE_ACCEPT_TIMEOUT_MS / 1000);
  const progressAnim = React.useRef(new Animated.Value(1)).current; // 1 = 100%

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (isVisible && rideRequest) {
      Vibration.vibrate([500, 500, 500]); // Vibrar para alertar
      setTimeLeft(RIDE_ACCEPT_TIMEOUT_MS / 1000);
      progressAnim.setValue(1); // Resetar barra de progresso

      Animated.timing(progressAnim, {
        toValue: 0, // 0 = 0%
        duration: RIDE_ACCEPT_TIMEOUT_MS,
        useNativeDriver: false, // width/height anim não suportado por native driver em alguns casos
      }).start();

      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      timeoutId = setTimeout(() => {
        console.log("Ride request timed out:", rideRequest.id);
        onDismiss(); // Chama onDismiss quando o tempo esgota
      }, RIDE_ACCEPT_TIMEOUT_MS);
    }

    return () => {
      clearInterval(timerInterval);
      clearTimeout(timeoutId);
      progressAnim.stopAnimation();
    };
  }, [isVisible, rideRequest, onDismiss, progressAnim]);

  if (!rideRequest) {
    return null;
  }

  const handleAccept = () => {
    onAccept(rideRequest.id);
  };

  const handleReject = () => {
    onReject(rideRequest.id);
  };

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss} // Android back button
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Nova Solicitação de Corrida!</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Passageiro:</Text>
            <Text style={styles.value}>{rideRequest.userName} (Avaliação: {rideRequest.userRating} ★)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>De:</Text>
            <Text style={styles.value}>{rideRequest.origin.description}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Para:</Text>
            <Text style={styles.value}>{rideRequest.destination.description}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Distância Estimada:</Text>
            <Text style={styles.value}>{rideRequest.estimatedDistance}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Ganho Estimado:</Text>
            <Text style={[styles.value, styles.fareValue]}>R$ {rideRequest.estimatedFare.toFixed(2)}</Text>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Tempo para aceitar: {timeLeft}s</Text>
            <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBarForeground, { width: progressBarWidth }]} />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Rejeitar" onPress={handleReject} color="#FF6B6B" />
            <Button title="Aceitar Corrida" onPress={handleAccept} color="#4CAF50" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fundo escurecido
  },
  modalView: {
    margin: 20,
    backgroundColor: "#1E2A3A", // Cor de fundo do modal
    borderRadius: 15,
    padding: 25,
    alignItems: "stretch", // Para os botões ocuparem a largura
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#D4A017", // Dourado Quantza
  },
  detailRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: "#A0A0A0", // Cinza claro
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: "#FFFFFF", // Branco
  },
  fareValue: {
    fontWeight: "bold",
    color: "#81b0ff", // Azul claro para destaque do preço
    fontSize: 18,
  },
  timerContainer: {
    marginTop: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 14,
    color: "#D4A017",
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 10,
    width: "100%",
    backgroundColor: "#334050", // Fundo da barra de progresso
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarForeground: {
    height: "100%",
    backgroundColor: "#D4A017", // Cor da barra de progresso (Dourado)
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

export default RideRequestModal;

