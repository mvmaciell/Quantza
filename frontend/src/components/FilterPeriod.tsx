import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constantes e tipos
import { COLORS, FONTS, SHADOWS } from '../../../constants/theme';

// Tipos
interface FilterPeriodProps {
  selectedPeriod: 'day' | 'week' | 'month' | 'quarter' | 'year';
  onSelectPeriod: (period: 'day' | 'week' | 'month' | 'quarter' | 'year') => void;
  style?: object;
}

/**
 * Componente de filtro de período para relatórios
 * 
 * Este componente permite selecionar diferentes períodos de tempo para
 * visualização de dados em relatórios e dashboards.
 * 
 * @param {FilterPeriodProps} props - Propriedades do componente
 * @returns {React.ReactElement} Componente de filtro de período
 */
const FilterPeriod: React.FC<FilterPeriodProps> = ({
  selectedPeriod,
  onSelectPeriod,
  style,
}) => {
  // Opções de período
  const periodOptions = [
    { id: 'day', label: 'Hoje' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' },
    { id: 'quarter', label: 'Trimestre' },
    { id: 'year', label: 'Ano' },
  ];

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {periodOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.periodOption,
              selectedPeriod === option.id && styles.selectedOption,
            ]}
            onPress={() => onSelectPeriod(option.id as any)}
            testID={`period-${option.id}`}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === option.id && styles.selectedText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  periodOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  selectedText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default FilterPeriod;
