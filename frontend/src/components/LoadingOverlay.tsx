import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// Constantes e tipos
import { COLORS } from '../../../constants/theme';

// Tipos
interface LoadingOverlayProps {
  message?: string;
}

/**
 * Componente de overlay de carregamento
 * 
 * Este componente exibe um indicador de carregamento com mensagem opcional
 * para indicar que uma operação está em andamento.
 * 
 * @param {LoadingOverlayProps} props - Propriedades do componente
 * @returns {React.ReactElement} Componente de overlay de carregamento
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Carregando...',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
