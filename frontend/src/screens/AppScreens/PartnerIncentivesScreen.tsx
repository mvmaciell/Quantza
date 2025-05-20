// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/PartnerIncentivesScreen.tsx
// Tela do Programa de Incentivos para Parceiros

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
// import { incentivesService } from "../../services/partner/incentivesService"; // Supondo um incentivesService

interface Incentive {
  id: string;
  title: string;
  description: string;
  goal: string; // Ex: "Complete 50 corridas esta semana"
  reward: string; // Ex: "Bônus de R$ 100"
  progress: number; // 0 a 100 (percentual)
  status: "active" | "completed" | "expired";
  endDate?: string;
}

const PartnerIncentivesScreen = ({ navigation }: any) => {
  const [activeIncentives, setActiveIncentives] = useState<Incentive[]>([]);
  const [completedIncentives, setCompletedIncentives] = useState<Incentive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncentivesData = async () => {
    setIsLoading(true);
    try {
      // const incentivesData = await incentivesService.getPartnerIncentives(); // API real
      // setActiveIncentives(incentivesData.active);
      // setCompletedIncentives(incentivesData.completed);

      // Simulação de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveIncentives([
        {
          id: "inc1",
          title: "Maratona Semanal Quantza",
          description: "Complete o número de corridas e ganhe um bônus especial!",
          goal: "50 Corridas",
          reward: "Bônus de R$ 150",
          progress: 60, // 30 de 50 corridas
          status: "active",
          endDate: "2025-05-18",
        },
        {
          id: "inc2",
          title: "Indicou, Ganhou!",
          description: "Indique novos parceiros e ganhe por cada indicação aprovada.",
          goal: "3 Indicações Aprovadas",
          reward: "R$ 50 por indicação",
          progress: 33, // 1 de 3 indicações
          status: "active",
        },
      ]);
      setCompletedIncentives([
        {
          id: "inc3",
          title: "Bônus de Performance Mensal",
          description: "Mantenha sua avaliação acima de 4.8 e ganhe.",
          goal: "Avaliação Média > 4.8",
          reward: "Bônus de R$ 200",
          progress: 100,
          status: "completed",
          endDate: "2025-04-30",
        },
      ]);
      console.log("PartnerIncentivesScreen: Fetched incentives data (placeholder)");
    } catch (error) {
      console.error("Failed to fetch incentives data:", error);
      Alert.alert("Erro", "Não foi possível carregar os programas de incentivo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncentivesData();
  }, []);

  const renderIncentiveCard = (item: Incentive, type: "active" | "completed") => (
    <View style={[styles.incentiveCard, type === "completed" && styles.completedCard]}>
      <Text style={styles.incentiveTitle}>{item.title}</Text>
      <Text style={styles.incentiveDescription}>{item.description}</Text>
      <View style={styles.goalRewardContainer}>
        <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>Meta:</Text>
            <Text style={styles.goalText}>{item.goal}</Text>
        </View>
        <View style={styles.rewardContainer}>
            <Text style={styles.rewardLabel}>Recompensa:</Text>
            <Text style={styles.rewardText}>{item.reward}</Text>
        </View>
      </View>
      {type === "active" && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progresso: {item.progress}%</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarForeground, { width: `${item.progress}%` }]} />
          </View>
        </View>
      )}
      {item.endDate && <Text style={styles.endDateText}>Válido até: {new Date(item.endDate).toLocaleDateString("pt-BR")}</Text>}
      {type === "completed" && <Text style={styles.statusTextCompleted}>Concluído!</Text>}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D4A017" />
        <Text style={styles.loadingText}>Carregando incentivos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Programa de Incentivos</Text>
        <Text style={styles.headerSubtitle}>Aumente seus ganhos participando dos nossos desafios e bônus!</Text>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Incentivos Ativos</Text>
          {activeIncentives.length > 0 ? (
            activeIncentives.map(item => renderIncentiveCard(item, "active"))
          ) : (
            <Text style={styles.emptyListText}>Nenhum incentivo ativo no momento. Fique de olho!</Text>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Incentivos Concluídos/Expirados</Text>
          {completedIncentives.length > 0 ? (
            completedIncentives.map(item => renderIncentiveCard(item, "completed"))
          ) : (
            <Text style={styles.emptyListText}>Você ainda não completou nenhum incentivo.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.termsButton} onPress={() => Alert.alert("Termos e Condições", "Detalhes sobre os termos e condições do programa de incentivos (em desenvolvimento).")}>
            <Text style={styles.termsButtonText}>Ver Termos e Condições do Programa</Text>
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
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#A0A0A0",
    textAlign: "center",
    marginBottom: 25,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4A017",
    marginBottom: 15,
  },
  incentiveCard: {
    backgroundColor: "#1E2A3A",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  completedCard: {
    backgroundColor: "#1A2530", // Um pouco mais escuro para diferenciar
    opacity: 0.8,
  },
  incentiveTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  incentiveDescription: {
    fontSize: 14,
    color: "#E0E0E0",
    marginBottom: 12,
    lineHeight: 20,
  },
  goalRewardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#2A3B4C",
    paddingVertical: 10,
  },
  goalContainer: {
    flex: 1,
    marginRight: 5,
  },
  rewardContainer: {
    flex: 1,
    marginLeft: 5,
    alignItems: "flex-end",
  },
  goalLabel: {
    fontSize: 13,
    color: "#A0A0A0",
    marginBottom: 2,
  },
  goalText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  rewardLabel: {
    fontSize: 13,
    color: "#A0A0A0",
    marginBottom: 2,
  },
  rewardText: {
    fontSize: 15,
    color: "#81b0ff", // Azul claro para recompensa
    fontWeight: "bold",
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    color: "#A0A0A0",
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#0D1B2A",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarForeground: {
    height: "100%",
    backgroundColor: "#4CAF50", // Verde para progresso
    borderRadius: 5,
  },
  endDateText: {
    fontSize: 12,
    color: "#A0A0A0",
    fontStyle: "italic",
    textAlign: "right",
    marginTop: 5,
  },
  statusTextCompleted: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 10,
  },
  emptyListText: {
    fontSize: 15,
    color: "#A0A0A0",
    textAlign: "center",
    paddingVertical: 10,
  },
  termsButton: {
    borderColor: "#D4A017",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  termsButtonText: {
    color: "#D4A017",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default PartnerIncentivesScreen;

