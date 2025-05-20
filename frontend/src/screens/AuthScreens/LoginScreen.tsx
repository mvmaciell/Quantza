// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AuthScreens/LoginScreen.tsx
// Tela de Login

import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Lógica para chamar o authService.login(email, password)
    // Navegar para a tela Home após login bem-sucedido
    console.log('Login attempt with:', email, password);
    // navigation.navigate('AppTabs'); // Exemplo de navegação
  };

  const handleSocialLogin = (provider: string) => {
    // Lógica para chamar o authService.socialLogin(provider)
    console.log('Social login attempt with:', provider);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Quantza</Text>
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
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <View style={styles.socialLoginContainer}>
        <Button title="Login com Google" onPress={() => handleSocialLogin('google')} />
        {/* Adicionar botão para Apple Login se necessário */}
      </View>
      <Button title="Não tem conta? Cadastre-se" onPress={() => navigation.navigate('RegisterScreen')} />
      <Button title="Esqueci minha senha" onPress={() => navigation.navigate('ForgotPasswordScreen')} />
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
  socialLoginContainer: {
    marginVertical: 20,
  },
});

export default LoginScreen;

