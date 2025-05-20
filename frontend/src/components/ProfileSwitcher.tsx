import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assumindo que expo/vector-icons está disponível

// Constantes de cores da identidade visual Quantza
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  white: '#FFFFFF',      // Branco (textos e elementos)
  secondary: '#1E2A3A',  // Azul escuro secundário
  passengerLight: '#E8F0FE', // Azul claro para modo passageiro
  partnerLight: '#FFF8E1', // Amarelo claro para modo parceiro
};

const { width } = Dimensions.get('window');

/**
 * ProfileSwitcher - Componente para alternar entre perfis de usuário e parceiro
 * 
 * Este componente permite que o usuário alterne entre os modos "Passageiro" e "Parceiro"
 * com animações fluidas e feedback visual claro.
 * 
 * @returns {React.ReactElement} Componente renderizado
 */
const ProfileSwitcher = () => {
  // Estados
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<'PASSENGER' | 'PARTNER'>('PASSENGER');
  const [isLoading, setIsLoading] = useState(false);
  
  // Valores animados
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  
  // Efeito para carregar o papel atual do usuário ao montar o componente
  useEffect(() => {
    const fetchCurrentRole = async () => {
      setIsLoading(true);
      try {
        // const roleData = await userService.getCurrentRole(); // Chamar API do backend
        // setCurrentRole(roleData.role);
        // setIsPartnerMode(roleData.role === 'PARTNER');
        console.log("ProfileSwitcher: Fetched current role (placeholder)", currentRole);
        
        // Animar para a posição inicial correta
        Animated.timing(slideAnim, {
          toValue: currentRole === 'PARTNER' ? 1 : 0,
          duration: 0, // Instantâneo na inicialização
          useNativeDriver: false, // Necessário para animação de backgroundColor
        }).start();
        
        Animated.timing(bgColorAnim, {
          toValue: currentRole === 'PARTNER' ? 1 : 0,
          duration: 0, // Instantâneo na inicialização
          useNativeDriver: false,
        }).start();
      } catch (error) {
        console.error("Failed to fetch current role:", error);
        Alert.alert("Erro", "Não foi possível carregar seu perfil atual.");
      }
      setIsLoading(false);
    };
    fetchCurrentRole();
  }, []);

  /**
   * Alterna entre os perfis de passageiro e parceiro
   * @param {boolean} newRoleIsPartner - Se o novo papel é parceiro (true) ou passageiro (false)
   */
  const handleSwitchProfile = async (newRoleIsPartner: boolean) => {
    const targetRole = newRoleIsPartner ? 'PARTNER' : 'PASSENGER';
    if (targetRole === currentRole || isLoading) return;

    setIsLoading(true);
    
    // Animação de pressionar
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();
    
    try {
      // Simulação de chamada à API (substituir por chamada real)
      // const response = await userService.switchProfile(targetRole);
      
      // Animação de deslizamento e rotação
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: newRoleIsPartner ? 1 : 0,
          duration: 300,
          useNativeDriver: false, // Necessário para animação de backgroundColor
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(rotateAnim, {
          toValue: newRoleIsPartner ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(bgColorAnim, {
          toValue: newRoleIsPartner ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
      
      console.log(`ProfileSwitcher: Switched to ${targetRole} (placeholder)`);
      setCurrentRole(targetRole); // Simulação
      setIsPartnerMode(newRoleIsPartner); // Simulação
      
      // Feedback visual de sucesso
      Alert.alert(
        "Perfil Alterado", 
        `Você está agora no modo ${targetRole === 'PARTNER' ? 'Parceiro' : 'Passageiro'}.`,
        [{ text: "OK" }],
        { cancelable: true }
      );
      
      // Aqui você pode querer forçar uma recarga do estado global do app ou navegação
    } catch (error: any) {
      console.error("Failed to switch profile:", error);
      Alert.alert(
        "Erro ao Mudar Perfil", 
        error.message || "Não foi possível alterar o perfil. Verifique se você está aprovado como parceiro.",
        [{ text: "OK" }],
        { cancelable: true }
      );
      
      // Reverter animações se a API falhar
      Animated.timing(slideAnim, {
        toValue: currentRole === 'PARTNER' ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
      
      Animated.timing(bgColorAnim, {
        toValue: currentRole === 'PARTNER' ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }
    setIsLoading(false);
  };

  // Interpolações para animações
  const sliderPosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, width / 2 - 4],
  });
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const backgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.passengerLight, COLORS.partnerLight],
  });
  
  const textColorPassenger = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.background, COLORS.secondary],
  });
  
  const textColorPartner = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.secondary, COLORS.background],
  });

  return (
    <View style={styles.container} testID="profileSwitcher">
      <Animated.View 
        style={[
          styles.switchContainer, 
          { 
            backgroundColor,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Slider animado */}
        <Animated.View 
          style={[
            styles.slider, 
            { 
              left: sliderPosition,
              backgroundColor: isPartnerMode ? COLORS.primary : COLORS.background,
            }
          ]}
        />
        
        {/* Botão Passageiro */}
        <TouchableOpacity 
          style={[styles.option, styles.leftOption]} 
          onPress={() => handleSwitchProfile(false)}
          disabled={isLoading || currentRole === 'PASSENGER'}
          testID="passengerModeButton"
        >
          <Animated.Text 
            style={[
              styles.optionText, 
              { color: textColorPassenger }
            ]}
          >
            Passageiro
          </Animated.Text>
          <Ionicons 
            name="person" 
            size={18} 
            color={currentRole === 'PASSENGER' ? COLORS.white : COLORS.secondary} 
          />
        </TouchableOpacity>
        
        {/* Botão Parceiro */}
        <TouchableOpacity 
          style={[styles.option, styles.rightOption]} 
          onPress={() => handleSwitchProfile(true)}
          disabled={isLoading || currentRole === 'PARTNER'}
          testID="partnerModeButton"
        >
          <Animated.Text 
            style={[
              styles.optionText, 
              { color: textColorPartner }
            ]}
          >
            Parceiro
          </Animated.Text>
          <Ionicons 
            name="car" 
            size={18} 
            color={currentRole === 'PARTNER' ? COLORS.white : COLORS.secondary} 
          />
        </TouchableOpacity>
        
        {/* Ícone de troca animado */}
        <Animated.View 
          style={[
            styles.switchIcon, 
            { 
              transform: [{ rotate: rotation }],
              opacity: isLoading ? 0.5 : 1,
            }
          ]}
        >
          <Ionicons 
            name="swap-horizontal" 
            size={20} 
            color={isPartnerMode ? COLORS.primary : COLORS.background} 
          />
        </Animated.View>
      </Animated.View>
      
      {/* Indicador de status atual */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Modo atual: <Text style={styles.statusHighlight}>
            {currentRole === 'PARTNER' ? 'Parceiro' : 'Passageiro'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 40,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.passengerLight,
    position: 'relative',
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  slider: {
    position: 'absolute',
    width: width / 2 - 30,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.background,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 1,
  },
  leftOption: {
    paddingLeft: 10,
  },
  rightOption: {
    paddingRight: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  switchIcon: {
    position: 'absolute',
    top: 15,
    left: width / 2 - 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  statusContainer: {
    marginTop: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(13, 27, 42, 0.05)',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  statusHighlight: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default ProfileSwitcher;
