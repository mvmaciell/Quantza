// Placeholder: /home/ubuntu/quantza_app/frontend/src/components/ProfileSwitcher.tsx
// Componente para permitir a alternância de perfil

import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
// import { userService } from '../services/user/userService'; // Supondo um userService

const ProfileSwitcher = () => {
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<'PASSENGER' | 'PARTNER'>('PASSENGER');
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para carregar o papel atual do usuário ao montar o componente
  useEffect(() => {
    const fetchCurrentRole = async () => {
      setIsLoading(true);
      try {
        // const roleData = await userService.getCurrentRole(); // Chamar API do backend
        // setCurrentRole(roleData.role);
        // setIsPartnerMode(roleData.role === 'PARTNER');
        console.log("ProfileSwitcher: Fetched current role (placeholder)", currentRole);
      } catch (error) {
        console.error("Failed to fetch current role:", error);
        Alert.alert("Erro", "Não foi possível carregar seu perfil atual.");
      }
      setIsLoading(false);
    };
    fetchCurrentRole();
  }, []);

  const handleSwitchProfile = async (newRoleIsPartner: boolean) => {
    const targetRole = newRoleIsPartner ? 'PARTNER' : 'PASSENGER';
    if (targetRole === currentRole) return;

    setIsLoading(true);
    try {
      // const response = await userService.switchProfile(targetRole);
      // console.log(response.message);
      // setCurrentRole(targetRole);
      // setIsPartnerMode(newRoleIsPartner);
      console.log(`ProfileSwitcher: Switched to ${targetRole} (placeholder)`);
      setCurrentRole(targetRole); // Simulação
      setIsPartnerMode(newRoleIsPartner); // Simulação
      Alert.alert("Sucesso", `Perfil alterado para ${targetRole === 'PARTNER' ? 'Parceiro' : 'Passageiro'}.`);
      // Aqui você pode querer forçar uma recarga do estado global do app ou navegação
    } catch (error: any) {
      console.error("Failed to switch profile:", error);
      Alert.alert("Erro ao Mudar Perfil", error.message || "Não foi possível alterar o perfil. Verifique se você está aprovado como parceiro.");
      // Reverter o switch visual se a API falhar
      setIsPartnerMode(currentRole === 'PARTNER');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Modo Passageiro</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isPartnerMode ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={(value) => handleSwitchProfile(value)}
        value={isPartnerMode}
        disabled={isLoading}
      />
      <Text style={styles.label}>Modo Parceiro</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginVertical: 10,
  },
  label: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default ProfileSwitcher;

