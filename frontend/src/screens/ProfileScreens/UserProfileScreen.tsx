// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/ProfileScreens/UserProfileScreen.tsx
// Tela de Perfil do Usuário (Passageiro)

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
// import ProfileSwitcher from "../../components/ProfileSwitcher";

const UserProfileScreen = ({ navigation }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // const profile = await userService.getUserProfile(); // Chamar API do backend
        // setUserData(profile);
        // Simulação de dados
        setUserData({
          fullName: "Usuário Passageiro Exemplo",
          email: "passageiro@exemplo.com",
          phone_number: "(XX) XXXXX-XXXX",
          pointsBalance: 250,
          totalDonated: 15.75,
          isPremium: false,
          currentRole: "PASSENGER",
        });
        console.log("UserProfileScreen: Fetched user profile (placeholder)");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      }
      setIsLoading(false);
    };
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Não foi possível carregar o perfil.</Text>
        <Button title="Tentar Novamente" onPress={() => { /* Lógica para tentar novamente */ }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Perfil do Passageiro</Text>
        {/* <ProfileSwitcher /> */}

        <View style={styles.infoSection}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{userData.fullName}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.value}>{userData.phone_number}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Pontos Acumulados:</Text>
          <Text style={styles.value}>{userData.pointsBalance} Pontos</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Total Doado:</Text>
          <Text style={styles.value}>R$ {userData.totalDonated?.toFixed(2)}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Assinatura Premium:</Text>
          <Text style={styles.value}>{userData.isPremium ? "Ativa" : "Inativa"}</Text>
        </View>

        <Button title="Editar Perfil" onPress={() => Alert.alert("Editar Perfil", "Navegar para tela de edição (placeholder).")} />
        <Button title="Histórico de Corridas" onPress={() => Alert.alert("Histórico", "Navegar para histórico (placeholder).")} />
        <Button title="Meus Pagamentos" onPress={() => Alert.alert("Pagamentos", "Navegar para pagamentos (placeholder).")} />
        {!userData.isPremium && (
          <Button title="Seja Premium" onPress={() => Alert.alert("Premium", "Navegar para tela premium (placeholder).")} />
        )}
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
});

export default UserProfileScreen;

