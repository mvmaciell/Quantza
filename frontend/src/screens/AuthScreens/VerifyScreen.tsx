// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AuthScreens/VerifyScreen.tsx
// Tela para verificação de Email e Telefone

import React from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

const VerifyScreen = ({ navigation, route }: any) => {
  // const { verificationType, contact } = route.params; // Ex: verificationType: 'email' ou 'phone'
  const [code, setCode] = React.useState("");

  const handleVerifyCode = () => {
    // Lógica para chamar o authService.verifyCode(contact, code, verificationType)
    console.log("Verification attempt with code:", code);
    // Se sucesso, navegar para a próxima etapa (ex: Home ou cadastro de parceiro)
    // navigation.navigate('AppTabs');
  };

  const handleResendCode = () => {
    // Lógica para chamar o authService.resendVerificationCode(contact, verificationType)
    console.log("Resend code request");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Verifique seu {route.params?.verificationType === "email" ? "Email" : "Telefone"}
      </Text>
      <Text style={styles.subtitle}>
        Enviamos um código de verificação para {route.params?.contact}.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Código de Verificação"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <Button title="Verificar Código" onPress={handleVerifyCode} />
      <Button title="Reenviar Código" onPress={handleResendCode} />
      <Button
        title="Voltar ao Login"
        onPress={() => navigation.navigate("LoginScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    textAlign: "center",
  },
});

export default VerifyScreen;

