import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Vibration,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

// Constantes de cores da identidade visual Quantza
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  white: '#FFFFFF',      // Branco (textos e elementos)
  secondary: '#1E2A3A',  // Azul escuro secundário
};

const { width, height } = Dimensions.get('window');

/**
 * SplashScreen - Tela inicial com animação de logo e efeito de raio
 * 
 * Esta tela é exibida durante o carregamento inicial do aplicativo,
 * apresentando o logotipo Quantza com uma animação de raio e vibração.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onFinish - Callback executado quando a animação termina
 */
const SplashScreen = ({ navigation, onFinish }) => {
  // Valores animados
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.3);
  const rayOpacity = new Animated.Value(0);
  const rayScale = new Animated.Value(0.1);
  const rayRotate = new Animated.Value(0);

  useEffect(() => {
    // Sequência de animações
    const animationSequence = Animated.sequence([
      // Fade in do logo
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      
      // Escala do logo
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      
      // Pequena pausa
      Animated.delay(300),
      
      // Animação do raio (aparece e cresce rapidamente)
      Animated.parallel([
        Animated.timing(rayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rayScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(rayRotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      
      // Raio desaparece
      Animated.timing(rayOpacity, {
        toValue: 0,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      
      // Pausa final
      Animated.delay(500),
    ]);

    // Iniciar a sequência de animações
    animationSequence.start(() => {
      // Callback quando a animação terminar
      if (onFinish) {
        onFinish();
      } else {
        // Se não houver callback, navegar para a próxima tela
        // Verificar se é primeira execução para ir para Onboarding ou Home
        // Este é um placeholder - a lógica real dependerá do seu fluxo de navegação
        navigation.replace('Onboarding');
      }
    });

    // Vibração quando o raio aparecer
    setTimeout(() => {
      Vibration.vibrate([0, 100, 50, 100]);
    }, 1700); // Tempo ajustado para coincidir com a animação do raio

    // Cleanup
    return () => {
      Vibration.cancel();
      animationSequence.stop();
    };
  }, []);

  // Interpolação para rotação do raio
  const rayRotation = rayRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container} testID="splashScreen">
        {/* Logo principal */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {/* Placeholder para o logo - substituir por Image com o logo real */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>QUANTZA</Text>
          </View>
        </Animated.View>

        {/* Efeito de raio */}
        <Animated.View
          style={[
            styles.rayEffect,
            {
              opacity: rayOpacity,
              transform: [
                { scale: rayScale },
                { rotate: rayRotation },
              ],
            },
          ]}
        >
          {/* Placeholder para o raio - substituir por Image ou SVG do raio */}
          <View style={styles.rayPlaceholder} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra sutil
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  logoText: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  rayEffect: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rayPlaceholder: {
    width: 120,
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    // Sombra para efeito de brilho
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
  },
});

export default SplashScreen;
