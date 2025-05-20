// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/UserWalletScreen.tsx
// Tela da Carteira do Usuário (Saldo, Métodos de Pagamento, Histórico)

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
// import { paymentService } from "../../services/payment/paymentService"; // Supondo um paymentService no frontend

interface PaymentMethod {
  id: string;
  type: "credit_card" | "pix" | "balance";
  details: string; // Ex: "**** **** **** 1234" ou "Chave PIX: email@example.com"
  isDefault?: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "ride_payment" | "top_up" | "withdrawal" | "refund" | "premium_subscription";
  status: "completed" | "pending" | "failed";
}

const UserWalletScreen = ({ navigation }: any) => {
  const [balance, setBalance] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      // const walletData = await paymentService.getUserWalletDetails(); // API real
      // setBalance(walletData.balance);
      // setPaymentMethods(walletData.paymentMethods);
      // setTransactions(walletData.transactions);

      // Simulação de dados
      await new Promise(resolve => setTimeout(resolve, 1200));
      setBalance(75.50);
      setPaymentMethods([
        { id: "pm1", type: "credit_card", details: "Visa **** **** **** 4321", isDefault: true },
        { id: "pm2", type: "pix", details: "Chave: (11) 98765-4321" },
        { id: "pm3", type: "balance", details: "Saldo Quantza" },
      ]);
      setTransactions([
        { id: "t1", date: "2025-05-14", description: "Pagamento Corrida #R123", amount: -25.50, type: "ride_payment", status: "completed" },
        { id: "t2", date: "2025-05-13", description: "Assinatura Quantza Premium", amount: -29.90, type: "premium_subscription", status: "completed" },
        { id: "t3", date: "2025-05-10", description: "Recarga de Saldo via PIX", amount: 100.00, type: "top_up", status: "completed" },
        { id: "t4", date: "2025-05-08", description: "Pagamento Corrida #R101", amount: -15.00, type: "ride_payment", status: "completed" },
        { id: "t5", date: "2025-05-05", description: "Reembolso Corrida #R090", amount: 10.00, type: "refund", status: "completed" },
      ]);
      console.log("UserWalletScreen: Fetched wallet data (placeholder)");
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados da sua carteira.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.paymentMethodItem}>
      <Text style={styles.paymentMethodType}>{item.type === "credit_card" ? "Cartão de Crédito" : item.type === "pix" ? "PIX" : "Saldo Quantza"}</Text>
      <Text style={styles.paymentMethodDetails}>{item.details}</Text>
      {item.isDefault && <Text style={styles.defaultBadge}>Padrão</Text>}
      {item.type !== "balance" && 
        <TouchableOpacity onPress={() => Alert.alert("Gerenciar Método", `Opções para ${item.details} (em desenvolvimento).`)}>
            <Text style={styles.managePaymentMethodText}>Gerenciar</Text>
        </TouchableOpacity>
      }
    </View>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
        <View style={styles.transactionInfo}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString("pt-BR")} - {item.status}</Text>
        </View>
        <Text style={[styles.transactionAmount, item.amount < 0 ? styles.negativeAmount : styles.positiveAmount]}>
            {item.amount < 0 ? "-" : "+"} R$ {Math.abs(item.amount).toFixed(2)}
        </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D4A017" />
        <Text style={styles.loadingText}>Carregando sua carteira...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>R$ {balance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Adicionar Saldo", "Funcionalidade de recarga em desenvolvimento.")}>
            <Text style={styles.actionButtonText}>Adicionar Saldo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>
          <FlatList
            data={paymentMethods}
            renderItem={renderPaymentMethod}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum método de pagamento cadastrado.</Text>}
          />
          <TouchableOpacity style={styles.addPaymentMethodButton} onPress={() => Alert.alert("Adicionar Método", "Funcionalidade de adicionar novo método de pagamento em desenvolvimento.")}>
            <Text style={styles.addPaymentMethodButtonText}>+ Adicionar Novo Método</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Histórico de Transações</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyListText}>Nenhuma transação encontrada.</Text>}
          />
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
    marginBottom: 30,
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
    color: "#D4A017",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#D4A017",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#0D1B2A",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  paymentMethodItem: {
    backgroundColor: "#1E2A3A",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentMethodType: {
    fontSize: 16,
    color: "#E0E0E0",
    fontWeight: "600",
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: "#A0A0A0",
    flex: 1,
    marginHorizontal: 10,
  },
  defaultBadge: {
    fontSize: 12,
    color: "#0D1B2A",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
    marginRight: 5,
  },
  managePaymentMethodText: {
    fontSize: 14,
    color: "#D4A017",
    fontWeight: "bold",
  },
  addPaymentMethodButton: {
    borderColor: "#D4A017",
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addPaymentMethodButtonText: {
    color: "#D4A017",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    color: "#E0E0E0",
    marginBottom: 3,
  },
  transactionDate: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  positiveAmount: {
    color: "#4CAF50",
  },
  negativeAmount: {
    color: "#FF6B6B",
  },
  emptyListText: {
    fontSize: 15,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 10,
  },
});

export default UserWalletScreen;

