// Nova Tela Home do Usuário (v3) - Ajustada para garantir consistência visual Quantza
// Cores principais:
// Fundo: #0D1B2A (Azul Escuro Quantza)
// Textos/Ícones Primários: #FFFFFF (Branco Quantza)
// Destaques/Ícones Secundários: #D4A017 (Dourado Quantza)
// Elementos de fundo secundários (como inputs): #1E2A3A

import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform, // Para ajustes de padding se necessário
} from "react-native";
// É crucial substituir os placeholders de texto por componentes de ícones reais (ex: react-native-vector-icons)
// e garantir que suas cores sigam a paleta Quantza.
// Exemplo: import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen_v3 = ({ navigation }: any) => {
  const quickActions = [
    { id: "1", label: "Casa", iconName: "home-outline", iconPlaceholder: "🏠" }, // Usar iconName para o ícone real
    { id: "2", label: "Trabalho", iconName: "briefcase-outline", iconPlaceholder: "💼" },
  ];

  const comingSoonFeatures = [
    { id: "1", label: "Aluguel de carro", iconName: "car-sport-outline", iconPlaceholder: "🚗" },
    { id: "2", label: "Patinete elétrico", iconName: "sparkles-outline", iconPlaceholder: "🛴" }, // Ícone mais sugestivo para patinete elétrico
    { id: "3", label: "Bicicleta elétrica", iconName: "bicycle-outline", iconPlaceholder: "🚲" },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Olá!</Text>
        <Text style={styles.prompt}>Para onde você vai?</Text>

        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate("SelectDestinationScreen")} // Tornar toda a área clicável
          activeOpacity={0.8}
        >
          {/* <Icon name="search-outline" size={22} color="#D4A017" style={styles.searchIcon} /> */}
          <Text style={styles.searchIconPlaceholder}>🔍</Text>
          <Text
            style={styles.searchInputPlaceholderText} // Usar Text para simular placeholder se o TextInput não estiver focado
          >
            Informe o destino
          </Text>
        </TouchableOpacity>

        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionItem}
            onPress={() => console.log(`${action.label} pressed`)} // Ação placeholder
            activeOpacity={0.7}
          >
            {/* <Icon name={action.iconName} size={24} color="#FFFFFF" style={styles.quickActionIcon} /> */}
            <Text style={styles.iconTextPlaceholder}>{action.iconPlaceholder}</Text>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.comingSoonTitle}>Em breve</Text>
        <View style={styles.comingSoonContainer}>
          {comingSoonFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.comingSoonItem}
              onPress={() => console.log(`${feature.label} pressed`)} // Ação placeholder
              activeOpacity={0.7}
            >
              {/* <Icon name={feature.iconName} size={30} color="#FFFFFF" style={styles.comingSoonIcon} /> */}
              <Text style={styles.iconTextPlaceholderLg}>{feature.iconPlaceholder}</Text>
              <Text style={styles.comingSoonLabel}>{feature.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* A Barra de Navegação Inferior (Tab Navigator) é geralmente configurada no arquivo de navegação principal.
          É crucial que sua estilização siga a identidade visual Quantza:
          - Fundo: #0D1B2A ou #1E2A3A (para leve destaque)
          - Ícones ativos: #D4A017 (Dourado)
          - Ícones inativos: #FFFFFF (Branco) ou um cinza claro sutil
          - Textos: #FFFFFF ou #D4A017, conforme o estado (ativo/inativo)
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D1B2A", // Fundo Azul Escuro Quantza
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 30 : 50, // Ajuste para status bar
    paddingBottom: 30, // Espaço no final do scroll
  },
  greeting: {
    fontSize: 32, // Ajustado para melhor harmonia
    fontWeight: "bold",
    color: "#FFFFFF", // Branco Quantza
    marginBottom: 4,
  },
  prompt: {
    fontSize: 20, // Ajustado
    color: "#FFFFFF", // Branco Quantza
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2A3A", // Azul Escuro Secundário Quantza
    borderRadius: 12, // Mais arredondado
    paddingHorizontal: 15,
    paddingVertical: 14, // Ligeiramente mais alto
    marginBottom: 24,
    // Sombra sutil para dar profundidade (opcional e dependente do design final)
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  searchIcon: { // Estilo para o ícone real
    marginRight: 12,
  },
  searchIconPlaceholder: { // Placeholder para o ícone de busca
    fontSize: 20,
    color: "#D4A017", // Dourado Quantza
    marginRight: 12,
  },
  searchInputPlaceholderText: { // Texto que simula o placeholder
    flex: 1,
    fontSize: 17, // Ajustado
    color: "#A0A0A0", // Cinza claro para placeholder
  },
  quickActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2A3A", // Linha sutil com cor secundária
  },
  quickActionIcon: { // Estilo para o ícone real
    marginRight: 15,
  },
  iconTextPlaceholder: { // Placeholder para ícones gerais
    fontSize: 22,
    color: "#FFFFFF", // Branco Quantza
    marginRight: 15,
    width: 24, // Para alinhar texto
    textAlign: "center",
  },
  iconTextPlaceholderLg: { // Placeholder para ícones maiores
    fontSize: 28,
    color: "#FFFFFF", // Branco Quantza
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 17, // Ajustado
    color: "#FFFFFF", // Branco Quantza
  },
  comingSoonTitle: {
    fontSize: 18, // Ajustado
    fontWeight: "bold",
    color: "#FFFFFF", // Branco Quantza
    marginTop: 30,
    marginBottom: 15,
  },
  comingSoonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Melhor distribuição
    marginBottom: 30,
  },
  comingSoonItem: {
    alignItems: "center",
    padding: 10,
    width: "30%", // Para garantir que caibam 3 itens e tenham espaçamento
  },
  comingSoonIcon: { // Estilo para o ícone real
    marginBottom: 8,
  },
  comingSoonLabel: {
    fontSize: 13, // Ajustado
    color: "#FFFFFF", // Branco Quantza
    textAlign: "center",
  },
});

export default HomeScreen_v3;

