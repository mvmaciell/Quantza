// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/PartnerEarningsScreen.tsx
// Tela de Ganhos do Parceiro (Saldo, Histórico de Corridas, Saque)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
// import { earningsService } from "../../services/partner/earningsService"; // Supondo um earningsService no frontend
// import { BarChart } from "react-native-chart-kit"; // Para gráfico de ganhos

interface RideEarning {
  id: string;
  date: string;
  passengerName: string;
  fare: number;
  commission: number;
  netEarning: number;
  origin: string;
  destination: string;
}

const PartnerEarningsScreen = ({ navigation }: any) => {
  const [availableBalance, setAvailableBalance] = useState(0);
  const [recentEarnings, setRecentEarnings] = useState<RideEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week"); // 'day', 'week', 'month'

  const fetchEarningsData = async (period: string) => {
    setIsLoading(true);
    try {
      // const earningsData = await earningsService.getPartnerEarnings(period); // API real
      // setAvailableBalance(earningsData.availableBalance);
      // setRecentEarnings(earningsData.rides);

      // Simulação de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAvailableBalance(375.80);
      setRecentEarnings([
        { id: "re1", date: "2025-05-14", passengerName: "Ana Silva", fare: 30.00, commission: 4.50, netEarning: 25.50, origin: "Centro", destination: "Aeroporto" },
        { id: "re2", date: "2025-05-14", passengerName: "Bruno Costa", fare: 22.00, commission: 3.30, netEarning: 18.70, origin: "Bairro Novo", destination: "Shopping" },
        { id: "re3", date: "2025-05-13", passengerName: "Carlos Dias", fare: 45.00, commission: 6.75, netEarning: 38.25, origin: "Universidade", destination: "Rodoviária" },
        { id: "re4", date: "2025-05-13", passengerName: "Daniela Lima", fare: 18.50, commission: 2.78, netEarning: 15.72, origin: "Teatro", destination: "Restaurante" },
        { id: "re5", date: "2025-05-12", passengerName: "Eduarda Melo", fare: 55.00, commission: 8.25, netEarning: 46.75, origin: "Hotel", destination: "Evento X" },
      ]);
      console.log(`PartnerEarningsScreen: Fetched earnings data for ${period} (placeholder)`);
    } catch (error) {
      console.error("Failed to fetch earnings data:", error);
      Alert.alert("Erro", "Não foi possível carregar seus ganhos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData(selectedPeriod);
  }, [selectedPeriod]);

  const handleWithdraw = () => {
    if (availableBalance <= 0) {
      Alert.alert("Saldo Insuficiente", "Você não possui saldo disponível para saque.");
      return;
    }
    Alert.alert("Solicitar Saque", `Você está solicitando o saque de R$ ${availableBalance.toFixed(2)}. Detalhes da conta e prazos serão exibidos aqui. (Funcionalidade de saque em desenvolvimento).`);
    // Navegar para uma tela de confirmação de saque ou exibir modal
  };

  const renderEarningItem = ({ item }: { item: RideEarning }) => (
    <View style={styles.earningItem}>
      <View style={styles.earningItemHeader}>
        <Text style={styles.earningItemDate}>{new Date(item.date).toLocaleDateString("pt-BR")}</Text>
        <Text style={styles.earningItemValue}>+ R$ {item.netEarning.toFixed(2)}</Text>
      </View>
      <Text style={styles.earningItemDescription}>Corrida com {item.passengerName}</Text>
      <Text style={styles.earningItemRoute}>{item.origin} → {item.destination}</Text>
      <Text style={styles.earningItemDetails}>Total: R$ {item.fare.toFixed(2)} (Comissão: R$ {item.commission.toFixed(2)})</Text>
    </View>
  );

  // Dados para o gráfico (exemplo)
  // const chartData = {
  //   labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], // Dependendo do período
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43, 60], // Ganhos do período
  //     },
  //   ],
  // };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D4A017" />
        <Text style={styles.loadingText}>Carregando seus ganhos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponível para Saque</Text>
          <Text style={styles.balanceValue}>R$ {availableBalance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
            <Text style={styles.withdrawButtonText}>Solicitar Saque</Text>
          </TouchableOpacity>
        </View>

        {/* Placeholder para Gráfico de Ganhos */}
        <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Gráfico de Ganhos por Período (Placeholder)</Text>
            {/* <BarChart data={chartData} ... /> */}
        </View>
        <View style={styles.periodSelector}>
            {["day", "week", "month"].map(period => (
                <TouchableOpacity 
                    key={period} 
                    style={[styles.periodButton, selectedPeriod === period && styles.selectedPeriodButton]}
                    onPress={() => setSelectedPeriod(period)}
                >
                    <Text style={[styles.periodButtonText, selectedPeriod === period && styles.selectedPeriodButtonText]}>
                        {period === "day" ? "Hoje" : period === "week" ? "Semana" : "Mês"}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Histórico de Ganhos Recentes ({selectedPeriod === "day" ? "Hoje" : selectedPeriod === "week" ? "Últimos 7 dias" : "Este Mês"})</Text>
          <FlatList
            data={recentEarnings}
            renderItem={renderEarningItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum ganho neste período.</Text>}
          />
        </View>

        <TouchableOpacity style={styles.fullHistoryButton} onPress={() => Alert.alert("Histórico Completo", "Tela de histórico completo de ganhos em desenvolvimento.")}>
            <Text style={styles.fullHistoryButtonText}>Ver Histórico Completo</Text>
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
  balanceCard: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 18,
    color: "#A0A0A0",
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#81b0ff", // Azul claro para ganhos
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: "#D4A017",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  withdrawButtonText: {
    color: "#0D1B2A",
    fontSize: 16,
    fontWeight: "bold",
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: "#1E2A3A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  chartPlaceholderText: {
    color: "#A0A0A0",
    fontSize: 16,
    textAlign: "center",
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    paddingVertical: 5,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  selectedPeriodButton: {
    backgroundColor: "#D4A017",
  },
  periodButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedPeriodButtonText: {
    color: "#0D1B2A",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  earningItem: {
    backgroundColor: "#1E2A3A",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  earningItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  earningItemDate: {
    fontSize: 13,
    color: "#A0A0A0",
  },
  earningItemValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#81b0ff",
  },
  earningItemDescription: {
    fontSize: 15,
    color: "#E0E0E0",
    marginBottom: 3,
  },
  earningItemRoute: {
    fontSize: 13,
    color: "#B0B0B0",
    fontStyle: "italic",
    marginBottom: 3,
  },
  earningItemDetails: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  emptyListText: {
    fontSize: 15,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 10,
  },
  fullHistoryButton: {
    borderColor: "#D4A017",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  fullHistoryButtonText: {
    color: "#D4A017",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PartnerEarningsScreen;

