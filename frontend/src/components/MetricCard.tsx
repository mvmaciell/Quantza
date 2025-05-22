import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Tipos
interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: number;
  onPress?: () => void;
  style?: object;
}

/**
 * Componente de card de métrica para dashboards
 * 
 * Este componente exibe uma métrica importante com valor, ícone,
 * tendência e permite navegação para detalhes.
 * 
 * @param {MetricCardProps} props - Propriedades do componente
 * @returns {React.ReactElement} Componente de card de métrica
 */
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  onPress,
  style,
}) => {
  // Animação para efeito de pressionar
  const scaleAnim = new Animated.Value(1);
  
  // Funções para animação de pressionar
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Renderizar indicador de tendência
  const renderTrendIndicator = () => {
    if (trend === undefined || trend === 0) return null;
    
    const isPositive = trend > 0;
    const trendColor = isPositive ? COLORS.success : COLORS.danger;
    const iconName = isPositive ? 'arrow-up' : 'arrow-down';
    
    return (
      <View style={styles.trendContainer}>
        <Ionicons name={iconName} size={12} color={trendColor} />
        <Text style={[styles.trendText, { color: trendColor }]}>
          {Math.abs(trend).toFixed(1)}%
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={!onPress}
      >
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{value}</Text>
              {renderTrendIndicator()}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 15,
    ...SHADOWS.small,
  },
  touchable: {
    width: '100%',
    padding: 15,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
});

export default MetricCard;
