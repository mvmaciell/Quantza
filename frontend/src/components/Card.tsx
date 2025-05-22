import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Tipos
interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
}

/**
 * Componente de card para exibição de conteúdo
 * 
 * Este componente encapsula conteúdo em um card com estilo consistente,
 * opcionalmente com título e ação de toque.
 * 
 * @param {CardProps} props - Propriedades do componente
 * @returns {React.ReactElement} Componente de card
 */
const Card: React.FC<CardProps> = ({
  title,
  children,
  style,
  onPress,
}) => {
  // Renderizar conteúdo do card
  const renderContent = () => (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );

  // Se tiver onPress, envolver em TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.wrapper, style]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // Caso contrário, retornar apenas o conteúdo
  return (
    <View style={[styles.wrapper, style]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  container: {
    width: '100%',
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  content: {
    padding: 15,
  },
});

export default Card;
