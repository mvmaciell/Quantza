// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/PremiumSubscriptionScreen.tsx
// Tela para o Usuário visualizar e contratar a Assinatura Premium

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
// import { pagarmeService } from "../../services/payment/pagarmeService"; // Supondo um pagarmeService no frontend para criar a assinatura

const PremiumSubscriptionScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Simular status da assinatura

  const premiumFeatures = [
    "Corridas com Desconto Exclusivo",
    "Prioridade em Horários de Pico",
    "Suporte Premium 24/7",
    "Cancelamento Gratuito (até 2x/mês)",
    "Doble de Pontos em Todas as Corridas",
    "Acesso Antecipado a Novas Funcionalidades",
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Lógica para criar um plano de assinatura no Pagar.me e depois uma assinatura para o usuário
      // Exemplo: const subscriptionResult = await pagarmeService.createSubscription({planId: "quantza_premium_monthly", userId: "current_user_id", paymentMethod: "credit_card_id" });
      console.log("Attempting to subscribe to Quantza Premium (placeholder)");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular chamada de API
      
      // if (subscriptionResult.status === "active") {
      //   setIsSubscribed(true);
      //   Alert.alert("Assinatura Ativada!", "Bem-vindo ao Quantza Premium!");
      // } else {
      //   Alert.alert("Falha na Assinatura", `Não foi possível ativar sua assinatura: ${subscriptionResult.message}`);
      // }
      setIsSubscribed(true); // Simulação de sucesso
      Alert.alert("Assinatura Ativada!", "Bem-vindo ao Quantza Premium! Aproveite todos os benefícios.");

    } catch (error: any) {
      console.error("Failed to subscribe to premium:", error);
      Alert.alert("Erro na Assinatura", error.message || "Não foi possível processar sua assinatura no momento.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = () => {
    Alert.alert("Gerenciar Assinatura", "Funcionalidade de gerenciamento de assinatura (cancelar, alterar plano) em desenvolvimento.");
    // Navegar para uma tela de gerenciamento ou abrir um link externo do Pagar.me
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>👑</Text>
          <Text style={styles.headerTitle}>Quantza Premium</Text>
          <Text style={styles.headerSubtitle}>Desbloqueie uma experiência de mobilidade superior.</Text>
        </View>

        <View style={styles.pricingCard}>
          <Text style={styles.planName}>Plano Mensal</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceCurrency}>R$</Text>
            <Text style={styles.priceValue}>29</Text>
            <Text style={styles.pricePeriod}>,90/mês</Text>
          </View>
          <Text style={styles.trialText}>(Cancele quando quiser)</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Benefícios Exclusivos:</Text>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {!isSubscribed ? (
          <TouchableOpacity 
            style={[styles.subscribeButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubscribe} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#0D1B2A" />
            ) : (
              <Text style={styles.subscribeButtonText}>Assinar Agora e Desbloquear Benefícios</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.subscribedContainer}>
            <Text style={styles.subscribedText}>Você já é um membro Quantza Premium!</Text>
            <TouchableOpacity style={styles.manageButton} onPress={handleManageSubscription}>
              <Text style={styles.manageButtonText}>Gerenciar Assinatura</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.termsText}>
          Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade. A assinatura é renovada automaticamente unless cancelada.
        </Text>
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
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D4A017",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    textAlign: "center",
  },
  pricingCard: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  planName: {
    fontSize: 18,
    color: "#E0E0E0",
    fontWeight: "600",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  priceCurrency: {
    fontSize: 20,
    color: "#D4A017",
    marginRight: 2,
    marginBottom: 5, // Alinhar com a base do valor principal
  },
  priceValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#D4A017",
    lineHeight: 50, // Ajustar para melhor alinhamento vertical
  },
  pricePeriod: {
    fontSize: 18,
    color: "#A0A0A0",
    marginLeft: 2,
    marginBottom: 5, // Alinhar com a base do valor principal
  },
  trialText: {
    fontSize: 13,
    color: "#888",
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    color: "#4CAF50", // Verde para checkmark
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#E0E0E0",
    flex: 1, // Para quebrar linha corretamente
  },
  subscribeButton: {
    backgroundColor: "#D4A017",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  subscribeButtonText: {
    color: "#0D1B2A",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  subscribedContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  subscribedText: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  manageButton: {
    borderColor: "#D4A017",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  manageButtonText: {
    color: "#D4A017",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default PremiumSubscriptionScreen;

