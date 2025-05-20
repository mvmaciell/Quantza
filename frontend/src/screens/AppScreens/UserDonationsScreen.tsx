// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/UserDonationsScreen.tsx
// Tela para o Usuário visualizar suas Doações Realizadas

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
// import { donationsService } from "../../services/donations/donationsService"; // Supondo um donationsService no frontend
// import { BarChart } from "react-native-chart-kit"; // Para gráfico de doações

const UserDonationsScreen = ({ navigation }: any) => {
  const [totalDonated, setTotalDonated] = useState(0);
  const [donationsHistory, setDonationsHistory] = useState<any[]>([]); // [{date: string, rideId: string, amount: number, cause: string}]
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDonationsData = async () => {
    setIsLoading(true);
    try {
      // const currentDonated = await donationsService.getUserTotalDonated(); // Chamar API real
      // const history = await donationsService.getUserDonationsHistory(); // Chamar API real
      
      // Simulação de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTotalDonated(25.75);
      setDonationsHistory([
        { id: "d1", date: "2025-05-14", rideId: "ride-abc-123", amount: 0.25, cause: "Reflorestamento Amazônia" },
        { id: "d2", date: "2025-05-12", rideId: "ride-def-456", amount: 0.15, cause: "Animais Carentes" },
        { id: "d3", date: "2025-05-10", rideId: "ride-ghi-789", amount: 0.30, cause: "Educação Infantil" },
        { id: "d4", date: "2025-05-07", rideId: "ride-jkl-012", amount: 0.20, cause: "Reflorestamento Amazônia" },
        { id: "d5", date: "2025-05-05", rideId: "ride-mno-345", amount: 0.50, cause: "Animais Carentes" },
      ]);
      console.log("UserDonationsScreen: Fetched donations data (placeholder)");
    } catch (error) {
      console.error("Failed to fetch donations data:", error);
      // Alert.alert("Erro", "Não foi possível carregar suas doações.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDonationsData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDonationsData();
  };

  // Dados para o gráfico (exemplo)
  // const chartData = {
  //   labels: donationsHistory.slice(0, 5).map(d => d.date.substring(5)).reverse(), // últimos 5 dias
  //   datasets: [
  //     {
  //       data: donationsHistory.slice(0, 5).map(d => d.amount).reverse(),
  //     },
  //   ],
  // };

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D4A017" />
        <Text style={styles.loadingText}>Carregando suas doações...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollViewContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4A017"/>}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Minhas Doações</Text>
          <View style={styles.totalDonatedCard}>
            {/* Placeholder para um ícone de coração ou similar */}
            <Text style={styles.iconPlaceholder}>💖</Text>
            <Text style={styles.totalDonatedLabel}>Total Doado Através do Quantza</Text>
            <Text style={styles.totalDonatedValue}>R$ {totalDonated.toFixed(2)}</Text>
            <Text style={styles.impactText}>Fazendo a diferença, uma corrida por vez!</Text>
          </View>
        </View>

        {/* Placeholder para Gráfico de Doações por Causa */}
        {/* <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Doações por Causa</Text>
          <BarChart ... />
        </View> */}
        <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Gráfico de Doações por Causa (Placeholder)</Text>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Histórico de Doações</Text>
          {donationsHistory.length === 0 && !isLoading ? (
            <Text style={styles.emptyHistoryText}>Você ainda não realizou doações através de suas corridas.</Text>
          ) : (
            donationsHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyItemIconContainer}>
                    <Text style={styles.historyItemIcon}>💸</Text>
                </View>
                <View style={styles.historyItemDetails}>
                  <Text style={styles.historyItemCause}>Causa: {item.cause}</Text>
                  <Text style={styles.historyItemRide}>Corrida ID: {item.rideId}</Text>
                  <Text style={styles.historyItemDate}>{new Date(item.date).toLocaleDateString("pt-BR")}</Text>
                </View>
                <Text style={styles.historyItemAmount}>R$ {item.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>

        {/* <TouchableOpacity style={styles.learnMoreButton} onPress={() => Alert.alert("Saiba Mais", "Informações sobre as causas apoiadas (em desenvolvimento).")}>
            <Text style={styles.learnMoreButtonText}>Conheça as Causas Apoiadas</Text>
        </TouchableOpacity> */}

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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#D4A017",
    fontSize: 16,
  },
  headerContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  totalDonatedCard: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconPlaceholder: {
    fontSize: 30,
    marginBottom: 10,
  },
  totalDonatedLabel: {
    fontSize: 16,
    color: "#A0A0A0",
    marginBottom: 5,
    textAlign: "center",
  },
  totalDonatedValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50", // Verde para doações
    marginBottom: 8,
  },
  impactText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: "#1E2A3A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 25,
    padding: 10,
  },
  chartPlaceholderText: {
    color: "#A0A0A0",
    fontSize: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyItemIconContainer: {
    marginRight: 15,
    backgroundColor: "#0D1B2A",
    padding: 8,
    borderRadius: 20, 
  },
  historyItemIcon: {
    fontSize: 18,
  },
  historyItemDetails: {
    flex: 1,
  },
  historyItemCause: {
    fontSize: 16,
    color: "#E0E0E0",
    fontWeight: "bold",
    marginBottom: 3,
  },
  historyItemRide: {
    fontSize: 12,
    color: "#A0A0A0",
    marginBottom: 2,
  },
  historyItemDate: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  emptyHistoryText: {
    fontSize: 15,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 10,
  },
  // learnMoreButton: {
  //   borderColor: "#D4A017",
  //   borderWidth: 1,
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   alignItems: "center",
  //   marginTop: 10,
  // },
  // learnMoreButtonText: {
  //   color: "#D4A017",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
});

export default UserDonationsScreen;

