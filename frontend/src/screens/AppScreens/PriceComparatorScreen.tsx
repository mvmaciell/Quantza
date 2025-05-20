// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/PriceComparatorScreen.tsx
// Tela do Comparador de Preços Animado

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons'; // Para o ícone de raio

const PriceComparatorScreen = ({ route, navigation }: any) => {
  const { origin, destination } = route.params; // Receber origem e destino
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<any>(null);

  // Animações
  const [fadeAnim] = useState(new Animated.Value(0)); // Para o fade in geral
  const [competitorAFade] = useState(new Animated.Value(0));
  const [competitorBFade] = useState(new Animated.Value(0));
  const [quantzaPriceScale] = useState(new Animated.Value(0.8));
  const [quantzaPriceOpacity] = useState(new Animated.Value(0));
  const [boltAnim] = useState(new Animated.Value(0)); // Para o raio

  useEffect(() => {
    console.log("PriceComparatorScreen mounted with:", { origin, destination });

    // Simular cálculo de preços e animações
    const fetchPricesAndAnimate = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simular busca de preços
      setPrices({
        competitorA: (Math.random() * 10 + 20).toFixed(2), // Preço aleatório entre 20-30
        competitorB: (Math.random() * 10 + 18).toFixed(2), // Preço aleatório entre 18-28
        quantza: (Math.random() * 5 + 15).toFixed(2),   // Preço aleatório entre 15-20 (mais barato)
      });
      setLoading(false);
    };

    fetchPricesAndAnimate();
  }, [origin, destination]);

  useEffect(() => {
    if (!loading && prices) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(competitorAFade, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(competitorBFade, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(boltAnim, { // Animação do raio
            toValue: 1,
            duration: 300,
            easing: Easing.bounce,
            delay: 500,
            useNativeDriver: true,
          }),
          Animated.spring(quantzaPriceScale, { // Animação de "queda" do preço Quantza
            toValue: 1,
            friction: 3,
            tension: 100,
            delay: 700,
            useNativeDriver: true,
          }),
          Animated.timing(quantzaPriceOpacity, {
            toValue: 1,
            duration: 500,
            delay: 700,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [loading, prices, fadeAnim, competitorAFade, competitorBFade, quantzaPriceScale, quantzaPriceOpacity, boltAnim]);

  const handleSelectQuantza = () => {
    if (!prices) return;
    console.log("Quantza price selected:", prices.quantza);
    // Navegar para a tela de confirmação da corrida ou buscando motorista
    navigation.navigate("ConfirmRideScreen", { origin, destination, quantzaFare: prices.quantza });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#D4A017" />
        <Text style={styles.loadingText}>Calculando sua rota e a melhor taxa ..</Text>
      </View>
    );
  }

  if (!prices) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Não foi possível calcular os preços. Tente novamente.</Text>
      </View>
    );
  }

  const boltTranslateY = boltAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-50, 0, -10], // Simula o raio caindo e um leve recuo
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Encontramos as Melhores Opções!</Text>

      <Animated.View style={[styles.priceCard, styles.competitorCard, { opacity: competitorAFade }]}>
        {/* <Icon name="car-outline" size={24} color="#E0E0E0" /> */}
        <Text style={styles.competitorIcon}>🚗</Text>
        <Text style={styles.competitorText}>Concorrente A</Text>
        <Text style={styles.competitorPrice}>R$ {prices.competitorA}</Text>
      </Animated.View>

      <Animated.View style={[styles.priceCard, styles.competitorCard, { opacity: competitorBFade, marginTop: 15 }]}>
        {/* <Icon name="car-sport-outline" size={24} color="#E0E0E0" /> */}
        <Text style={styles.competitorIcon}>🚘</Text>
        <Text style={styles.competitorText}>Concorrente B</Text>
        <Text style={styles.competitorPrice}>R$ {prices.competitorB}</Text>
      </Animated.View>
      
      <View style={styles.quantzaContainer}>
        <Animated.View style={{ transform: [{ translateY: boltTranslateY }], opacity: boltAnim, alignItems: 'center' }}>
          {/* <Icon name="flash-outline" size={50} color="#FFD700" /> */}
          <Text style={styles.boltIcon}>⚡️</Text>
        </Animated.View>
        <Animated.View 
          style={[
            styles.priceCard, 
            styles.quantzaCard, 
            { 
              opacity: quantzaPriceOpacity, 
              transform: [{ scale: quantzaPriceScale }]
            }
          ]}
        >
          <Text style={styles.quantzaTitle}>Quantza</Text>
          <Text style={styles.quantzaSubtitle}>Nossa Melhor Taxa:</Text>
          <Text style={styles.quantzaPrice}>R$ {prices.quantza}</Text>
          <TouchableOpacity style={styles.selectButton} onPress={handleSelectQuantza}>
            <Text style={styles.selectButtonText}>Selecionar Quantza</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0D1B2A",
    alignItems: "center",
  },
  loadingContainer: {
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#D4A017",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
  },
  priceCard: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10, // Espaço entre os cards de concorrentes
    alignItems: "center",
  },
  competitorCard: {
    backgroundColor: "#1E2A3A",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  competitorIcon: {
    fontSize: 20,
    color: "#E0E0E0",
  },
  competitorText: {
    fontSize: 18,
    color: "#E0E0E0",
  },
  competitorPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  quantzaContainer: {
    marginTop: 20, // Espaço acima do raio e card Quantza
    alignItems: "center",
    width: "100%",
  },
  boltIcon: {
    fontSize: 40,
    color: "#FFD700", // Dourado para o raio
    marginBottom: -15, // Sobrepor um pouco o card
    zIndex: 1,
  },
  quantzaCard: {
    backgroundColor: "#D4A017", // Dourado
    width: "95%", // Um pouco maior
  },
  quantzaTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D1B2A", // Azul escuro
  },
  quantzaSubtitle: {
    fontSize: 16,
    color: "#0D1B2A",
    marginTop: 5,
  },
  quantzaPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0D1B2A",
    marginVertical: 10,
  },
  selectButton: {
    backgroundColor: "#0D1B2A", // Azul escuro
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  selectButtonText: {
    color: "#FFFFFF", // Branco
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PriceComparatorScreen;

