// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AuthScreens/RegisterScreen.tsx
// Tela de Cadastro

import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Switch } from 'react-native';

const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isPartner, setIsPartner] = React.useState(false);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  const handleRegister = () => {
    // Lógica para chamar o authService.register(...)
    // Validar senhas, termos, etc.
    // Navegar para verificação de email/telefone ou tela Home
    console.log('Register attempt with:', { fullName, email, phone, isPartner, agreedToTerms });
    // navigation.navigate('VerifyScreen'); // Exemplo
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta Quantza</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone (com DDD)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.switchContainer}>
        <Text>Quero ser Parceiro (Motorista)</Text>
        <Switch value={isPartner} onValueChange={setIsPartner} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Li e aceito os Termos de Uso e Política de Privacidade</Text>
        <Switch value={agreedToTerms} onValueChange={setAgreedToTerms} />
      </View>
      <Button title="Cadastrar" onPress={handleRegister} disabled={!agreedToTerms || password !== confirmPassword || !password} />
      <Button title="Já tem conta? Faça Login" onPress={() => navigation.navigate('LoginScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default RegisterScreen;

