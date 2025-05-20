// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/ProfileScreens/PartnerProfileScreen.tsx
// Tela de Perfil do Parceiro (Motorista)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
// import { userService } from "../../services/user/userService"; // Supondo um userService
// import { partnerService } from "../../services/partner/partnerService"; // Supondo um partnerService
// import ProfileSwitcher from "../../components/ProfileSwitcher";

const PartnerProfileScreen = ({ navigation }: any) => {
  const [partnerData, setPartnerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerProfile = async () => {
      setIsLoading(true);
      try {
        // const profile = await userService.getUserProfile(); // Chamar API do backend para dados comuns
        // const partnerDetails = await partnerService.getPartnerDetails(); // Chamar API para dados específicos do parceiro
        // setUserData({ ...profile, ...partnerDetails });
        // Simulação de dados
        setPartnerData({
          fullName: "Usuário Parceiro Exemplo",
          email: "parceiro@exemplo.com",
          phone_number: "(YY) YYYYY-YYYY",
          currentRole: "PARTNER",
          cnhNumber: "12345678900",
          vehicleModel: "Carro Exemplo X",
          vehiclePlate: "BRA2E19",
          status: "APPROVED", // PENDING_APPROVAL, REJECTED, SUSPENDED
          earningBalance: 1250.75,
          averageRating: 4.85,
          totalRidesCompleted: 120,
        });
        console.log("PartnerProfileScreen: Fetched partner profile (placeholder)");
      } catch (error) {
        console.error("Failed to fetch partner profile:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil do parceiro.");
      }
      setIsLoading(false);
    };
    fetchPartnerProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  if (!partnerData) {
    return (
      <View style={styles.container}>
        <Text>Não foi possível carregar o perfil do parceiro.</Text>
        <Button title="Tentar Novamente" onPress={() => { /* Lógica para tentar novamente */ }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Perfil do Parceiro</Text>
        {/* <ProfileSwitcher /> */}

        <View style={styles.infoSection}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{partnerData.fullName}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{partnerData.email}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Status da Conta:</Text>
          <Text style={[styles.value, partnerData.status === "APPROVED" ? styles.statusApproved : styles.statusPending]}>
            {partnerData.status === "APPROVED" ? "Aprovado" : partnerData.status === "PENDING_APPROVAL" ? "Pendente" : "Rejeitado/Suspenso"}
          </Text>
        </View>
        
        {partnerData.status === "APPROVED" && (
          <>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Saldo para Saque:</Text>
              <Text style={styles.value}>R$ {partnerData.earningBalance?.toFixed(2)}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Avaliação Média:</Text>
              <Text style={styles.value}>{partnerData.averageRating?.toFixed(2)} / 5.00</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Corridas Completas:</Text>
              <Text style={styles.value}>{partnerData.totalRidesCompleted}</Text>
            </View>
            <Button title="Meus Ganhos e Incentivos" onPress={() => Alert.alert("Ganhos", "Navegar para tela de ganhos (placeholder).")} />
            <Button title="Solicitar Saque" onPress={() => Alert.alert("Saque", "Navegar para tela de saque (placeholder).")} />
          </>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.label}>CNH:</Text>
          <Text style={styles.value}>{partnerData.cnhNumber}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Veículo:</Text>
          <Text style={styles.value}>{partnerData.vehicleModel} - {partnerData.vehiclePlate}</Text>
        </View>

        <Button title="Editar Dados do Veículo/Documentos" onPress={() => Alert.alert("Editar Veículo", "Navegar para edição de dados do parceiro (placeholder).")} />
        <Button title="Sair (Logout)" onPress={() => Alert.alert("Logout", "Lógica de logout (placeholder).")} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#0D1B2A",
  },
  infoSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D1B2A",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  statusApproved: {
    color: "green",
    fontWeight: "bold",
  },
  statusPending: {
    color: "orange",
    fontWeight: "bold",
  },
});

export default PartnerProfileScreen;

