// Utilitário para gerar imagens placeholder para onboarding
// Este arquivo cria imagens simples com a identidade visual do Quantza
// para uso durante o desenvolvimento, até que as imagens finais sejam criadas

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Svg, Rect, Circle, Path, G, Text as SvgText } from 'react-native-svg';

// Constantes de cores da identidade visual Quantza
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  white: '#FFFFFF',      // Branco (textos e elementos)
  secondary: '#1E2A3A',  // Azul escuro secundário
};

/**
 * Componente para gerar imagens placeholder para onboarding
 * 
 * Este componente cria SVGs simples para cada tela de onboarding,
 * seguindo a identidade visual do Quantza.
 */
const OnboardingPlaceholders = {
  // Imagem de boas-vindas
  Welcome: () => (
    <Svg width="300" height="300" viewBox="0 0 300 300">
      <Rect width="300" height="300" fill={COLORS.secondary} />
      <Circle cx="150" cy="120" r="60" fill={COLORS.primary} />
      <SvgText
        x="150"
        y="120"
        fontSize="24"
        fontWeight="bold"
        fill={COLORS.background}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        QUANTZA
      </SvgText>
      <Path
        d="M100,200 L200,200 L150,250 Z"
        fill={COLORS.white}
      />
      <SvgText
        x="150"
        y="280"
        fontSize="18"
        fill={COLORS.white}
        textAnchor="middle"
      >
        Bem-vindo ao Quantza
      </SvgText>
    </Svg>
  ),
  
  // Imagem de multi-serviços
  Services: () => (
    <Svg width="300" height="300" viewBox="0 0 300 300">
      <Rect width="300" height="300" fill={COLORS.secondary} />
      <G>
        <Circle cx="100" cy="100" r="40" fill={COLORS.primary} opacity="0.8" />
        <Circle cx="150" cy="150" r="40" fill={COLORS.primary} opacity="0.9" />
        <Circle cx="200" cy="100" r="40" fill={COLORS.primary} opacity="0.8" />
      </G>
      <Path
        d="M80,180 L220,180 L220,220 L80,220 Z"
        fill={COLORS.white}
        opacity="0.9"
      />
      <SvgText
        x="150"
        y="280"
        fontSize="18"
        fill={COLORS.white}
        textAnchor="middle"
      >
        Multi-serviços
      </SvgText>
    </Svg>
  ),
  
  // Imagem do programa de pontos
  Points: () => (
    <Svg width="300" height="300" viewBox="0 0 300 300">
      <Rect width="300" height="300" fill={COLORS.secondary} />
      <G>
        <Path
          d="M150,60 L170,120 L230,120 L180,160 L200,220 L150,180 L100,220 L120,160 L70,120 L130,120 Z"
          fill={COLORS.primary}
        />
      </G>
      <SvgText
        x="150"
        y="280"
        fontSize="18"
        fill={COLORS.white}
        textAnchor="middle"
      >
        Programa de Pontos
      </SvgText>
    </Svg>
  ),
  
  // Imagem de doações
  Donations: () => (
    <Svg width="300" height="300" viewBox="0 0 300 300">
      <Rect width="300" height="300" fill={COLORS.secondary} />
      <G>
        <Path
          d="M150,80 L190,120 C210,140 210,170 190,190 C170,210 140,210 120,190 L150,160 L180,190 C190,200 190,215 180,225 C170,235 155,235 145,225 L120,200 C100,180 100,150 120,130 Z"
          fill={COLORS.primary}
        />
      </G>
      <SvgText
        x="150"
        y="280"
        fontSize="18"
        fill={COLORS.white}
        textAnchor="middle"
      >
        Doações Automáticas
      </SvgText>
    </Svg>
  ),
  
  // Imagem da carteira digital
  Wallet: () => (
    <Svg width="300" height="300" viewBox="0 0 300 300">
      <Rect width="300" height="300" fill={COLORS.secondary} />
      <G>
        <Rect x="70" y="100" width="160" height="100" rx="10" fill={COLORS.primary} />
        <Rect x="90" y="120" width="120" height="20" rx="5" fill={COLORS.background} />
        <Rect x="90" y="150" width="60" height="30" rx="5" fill={COLORS.white} />
      </G>
      <SvgText
        x="150"
        y="280"
        fontSize="18"
        fill={COLORS.white}
        textAnchor="middle"
      >
        Carteira Digital
      </SvgText>
    </Svg>
  ),
};

export default OnboardingPlaceholders;
