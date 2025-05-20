// Placeholder: /home/ubuntu/quantza_app/frontend/src/components/gamification/PostRideAnimations.tsx
// Componente para exibir animações de gamificação pós-corrida (ex: ganho de pontos, doação)

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
// import LottieView from 'lottie-react-native'; // Para animações Lottie mais complexas

interface PostRideAnimationsProps {
  pointsAwarded?: number;
  donationAmount?: number;
  onAnimationComplete?: () => void;
}

const PostRideAnimations: React.FC<PostRideAnimationsProps> = ({
  pointsAwarded,
  donationAmount,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Para fade in/out
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Para efeito de "pop"

  useEffect(() => {
    if (pointsAwarded || donationAmount) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, { // Efeito de mola para o scale
            toValue: 1,
            friction: 3,
            tension: 60,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2000), // Manter visível por 2 segundos
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }
  }, [pointsAwarded, donationAmount, fadeAnim, scaleAnim, onAnimationComplete]);

  if (!pointsAwarded && !donationAmount) {
    return null; // Não renderizar nada se não houver o que animar
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {pointsAwarded && (
        <View style={styles.animationItem}>
          {/* <LottieView source={require('../../../assets/animations/points-earned.json')} autoPlay loop={false} style={styles.lottieIcon} /> */}
          <Text style={styles.lottiePlaceholder}>✨</Text>
          <Text style={styles.animationText}>+{pointsAwarded} Pontos!</Text>
        </View>
      )}
      {donationAmount && donationAmount > 0 && (
        <View style={styles.animationItem}>
          {/* <LottieView source={require('../../../assets/animations/donation-made.json')} autoPlay loop={false} style={styles.lottieIcon} /> */}
          <Text style={styles.lottiePlaceholder}>💖</Text>
          <Text style={styles.animationText}>Doação de R$ {donationAmount.toFixed(2)} realizada!</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Para sobrepor a tela de fim de corrida
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000, // Para garantir que fique na frente
  },
  animationItem: {
    backgroundColor: "rgba(29, 43, 58, 0.9)", // Fundo semi-transparente escuro
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#D4A017",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  animationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D4A017", // Dourado Quantza
    marginLeft: 10,
  },
  lottieIcon: {
    width: 40,
    height: 40,
  },
  lottiePlaceholder: {
    fontSize: 24, // Emoji como placeholder
  }
});

export default PostRideAnimations;

