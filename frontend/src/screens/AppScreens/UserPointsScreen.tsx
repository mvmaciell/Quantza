// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/UserPointsScreen.tsx
// Tela para o Usuário visualizar seus Pontos Acumulados

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
// import { pointsService } from "../../services/points/pointsService"; // Supondo um pointsService no frontend
// import { LineChart } from "react-native-chart-kit"; // Para gráfico de pontos

const UserPointsScreen = ({ navigation }: any) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]); // [{date: string, description: string, amount: number}]
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPointsData = async () => {
    setIsLoading(true);
    try {
      // const currentPoints = await pointsService.getUserTotalPoints(); // Chamar API real
      // const history = await pointsService.getUserPointsHistory(); // Chamar API real
      
      // Simulação de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTotalPoints(1250);
      setPointsHistory([
        { id: "1", date: "2025-05-14", description: "Corrida para Av. Paulista", amount: 25, type: "earned" },
        { id: "2", date: "2025-05-13", description: "Bônus de boas-vindas", amount: 100, type: "earned" },
        { id: "3", date: "2025-05-12", description: "Corrida para o Parque", amount: 15, type: "earned" },
        { id: "4", date: "2025-05-10", description: "Resgate de Voucher Lanche", amount: -50, type: "spent" },
        { id: "5", date: "2025-05-08", description: "Corrida para o Shopping", amount: 30, type: "earned" },
      ]);
      console.log("UserPointsScreen: Fetched points data (placeholder)");
    } catch (error) {
      console.error("Failed to fetch points data:", error);
      // Alert.alert("Erro", "Não foi possível carregar seus pontos.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPointsData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPointsData();
  };

  // Dados para o gráfico (exemplo)
  // const chartData = {
  //   labels: pointsHistory.slice(0, 5).map(p => p.date.substring(5)).reverse(), // últimos 5 dias
  //   datasets: [
  //     {
  //       data: pointsHistory.slice(0, 5).map(p => p.amount > 0 ? p.amount : 0).reverse(), // Apenas ganhos para simplificar
  //       color: (opacity = 1) => `rgba(212, 160, 23, ${opacity})`, // Dourado Quantza
  //       strokeWidth: 2,
  //     },
  //   ],
  //   legend: ["Pontos Ganhos Recentemente"],
  // };

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D4A017" />
        <Text style={styles.loadingText}>Carregando seus pontos...</Text>
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
          <Text style={styles.headerTitle}>Meus Pontos Quantza</Text>
          <View style={styles.totalPointsCard}>
            <Text style={styles.totalPointsLabel}>Saldo Atual</Text>
            <Text style={styles.totalPointsValue}>{totalPoints} pts</Text>
            {/* <Text style={styles.pointsEquivalent}>(Equivalente a R$ {(totalPoints * 0.01).toFixed(2)} em recompensas)</Text> */}
          </View>
        </View>

        {/* Placeholder para Gráfico de Pontos */}
        {/* <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Evolução dos Pontos</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 40} // from react-native
            height={220}
            chartConfig={{
              backgroundColor: "#1E2A3A",
              backgroundGradientFrom: "#15202B",
              backgroundGradientTo: "#0D1B2A",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#D4A017",
              },
            }}
            bezier
            style={styles.chartStyle}
          />
        </View> */}
        <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Gráfico de Evolução de Pontos (Placeholder)</Text>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Histórico de Transações</Text>
          {pointsHistory.length === 0 && !isLoading ? (
            <Text style={styles.emptyHistoryText}>Você ainda não possui transações de pontos.</Text>
          ) : (
            pointsHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyItemDetails}>
                  <Text style={styles.historyItemDescription}>{item.description}</Text>
                  <Text style={styles.historyItemDate}>{new Date(item.date).toLocaleDateString("pt-BR")}</Text>
                </View>
                <Text style={[styles.historyItemAmount, item.type === "spent" ? styles.spentAmount : styles.earnedAmount]}>
                  {item.type === "spent" ? "-" : "+"}{item.amount} pts
                </Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.redeemButton} onPress={() => Alert.alert("Resgatar Pontos", "Funcionalidade de resgate em desenvolvimento.")}>
            <Text style={styles.redeemButtonText}>Resgatar Recompensas</Text>
        </TouchableOpacity>

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
  totalPointsCard: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  totalPointsLabel: {
    fontSize: 18,
    color: "#A0A0A0",
    marginBottom: 5,
  },
  totalPointsValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#D4A017",
  },
  // pointsEquivalent: {
  //   fontSize: 14,
  //   color: "#888",
  //   marginTop: 5,
  // },
  chartPlaceholder: {
    height: 200,
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
  // chartContainer: {
  //   marginBottom: 25,
  // },
  // chartStyle: {
  //   borderRadius: 16,
  // },
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyItemDetails: {
    flex: 1,
  },
  historyItemDescription: {
    fontSize: 16,
    color: "#E0E0E0",
    marginBottom: 2,
  },
  historyItemDate: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  earnedAmount: {
    color: "#4CAF50", // Verde para ganhos
  },
  spentAmount: {
    color: "#FF6B6B", // Vermelho para gastos
  },
  emptyHistoryText: {
    fontSize: 15,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 10,
  },
  redeemButton: {
    backgroundColor: "#D4A017",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  redeemButtonText: {
    color: "#0D1B2A",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserPointsScreen;

