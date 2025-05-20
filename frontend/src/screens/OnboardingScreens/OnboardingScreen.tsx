import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

// Importando os placeholders SVG
import OnboardingPlaceholders from '../../assets/onboarding/placeholders';
import OnboardingAssets from '../../assets/onboarding';

// Constantes de cores da identidade visual Quantza
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  white: '#FFFFFF',      // Branco (textos e elementos)
  secondary: '#1E2A3A',  // Azul escuro secundário
};

const { width, height } = Dimensions.get('window');

/**
 * OnboardingScreen - Tela de apresentação inicial do aplicativo
 * 
 * Esta tela é exibida apenas na primeira utilização do aplicativo,
 * apresentando slides com as principais funcionalidades e diferenciais.
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 */
const OnboardingScreen = ({ navigation }) => {
  // Dados dos slides de onboarding
  const slides = [
    {
      id: '1',
      title: 'Bem-vindo ao Quantza',
      description: 'O aplicativo de mobilidade que revoluciona sua experiência de transporte.',
      PlaceholderComponent: OnboardingPlaceholders.Welcome,
    },
    {
      id: '2',
      title: 'Multi-serviços',
      description: 'Corridas, entregas, transporte de animais e muito mais em um só lugar.',
      PlaceholderComponent: OnboardingPlaceholders.Services,
    },
    {
      id: '3',
      title: 'Programa de Pontos',
      description: 'Ganhe pontos em cada corrida e troque por benefícios exclusivos.',
      PlaceholderComponent: OnboardingPlaceholders.Points,
    },
    {
      id: '4',
      title: 'Doações Automáticas',
      description: 'Parte de cada corrida é destinada a projetos sociais. Faça a diferença a cada viagem.',
      PlaceholderComponent: OnboardingPlaceholders.Donations,
    },
    {
      id: '5',
      title: 'Carteira Digital',
      description: 'Gerencie seus pagamentos, pontos e doações em um só lugar.',
      PlaceholderComponent: OnboardingPlaceholders.Wallet,
    },
  ];

  // Estado para controlar o slide atual
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Referência para o FlatList
  const flatListRef = useRef(null);
  
  // Valor compartilhado para animação do scroll
  const scrollX = useSharedValue(0);
  
  // Efeito para pré-carregar assets (quando estiverem disponíveis)
  useEffect(() => {
    // Tentativa de pré-carregar assets, com fallback silencioso
    try {
      OnboardingAssets.preloadAssets();
    } catch (error) {
      console.log('Assets ainda não disponíveis para pré-carregamento');
    }
  }, []);
  
  // Handler para o evento de scroll
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Função para navegar para o próximo slide
  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Último slide, navegar para a tela de login/cadastro
      navigation.replace('Auth', { screen: 'Login' });
    }
  };

  // Função para pular o onboarding
  const skipOnboarding = () => {
    navigation.replace('Auth', { screen: 'Login' });
  };

  // Renderiza um item do slide
  const renderItem = ({ item, index }) => {
    // Estilo animado para cada slide
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.4, 1, 0.4],
        Extrapolate.CLAMP
      );
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    // Componente de placeholder para este slide
    const PlaceholderComponent = item.PlaceholderComponent;

    return (
      <View style={styles.slide} testID={`onboardingSlide-${index}`}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <PlaceholderComponent />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  // Renderiza os indicadores de página
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const dotWidth = interpolate(
              scrollX.value,
              inputRange,
              [8, 16, 8],
              Extrapolate.CLAMP
            );
            
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.5, 1, 0.5],
              Extrapolate.CLAMP
            );
            
            return {
              width: dotWidth,
              opacity,
              backgroundColor: currentIndex === index ? COLORS.primary : COLORS.white,
            };
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[styles.dot, animatedDotStyle]}
              testID={`paginationDot-${index}`}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container} testID="onboardingScreen">
        {/* Botão de pular */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipOnboarding}
          testID="skipButton"
        >
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
        
        {/* Lista de slides */}
        <Animated.FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          testID="onboardingSlider"
        />
        
        {/* Paginação (indicadores de página) */}
        {renderPagination()}
        
        {/* Botão de próximo/começar */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={goToNextSlide}
          testID="nextButton"
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: COLORS.background,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 30,
  },
  nextButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
