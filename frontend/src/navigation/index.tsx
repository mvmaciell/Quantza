import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Telas de Onboarding
import SplashScreen from '../screens/OnboardingScreens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreens/OnboardingScreen';

// Telas de Autenticação
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import VerifyScreen from '../screens/AuthScreens/VerifyScreen';
import PartnerDetailsScreen from '../screens/AuthScreens/PartnerDetailsScreen';

// Telas de Perfil
import UserProfileScreen from '../screens/ProfileScreens/UserProfileScreen';
import PartnerProfileScreen from '../screens/ProfileScreens/PartnerProfileScreen';

// Telas do App (Usuário)
import HomeScreen from '../screens/AppScreens/HomeScreen_v3';
import SelectDestinationScreen from '../screens/AppScreens/SelectDestinationScreen';
import PriceComparatorScreen from '../screens/AppScreens/PriceComparatorScreen';
import ConfirmRideScreen from '../screens/AppScreens/ConfirmRideScreen';
import SearchingDriverScreen from '../screens/AppScreens/SearchingDriverScreen';
import UserRideEndScreen from '../screens/AppScreens/UserRideEndScreen';
import UserPointsScreen from '../screens/AppScreens/UserPointsScreen';
import UserDonationsScreen from '../screens/AppScreens/UserDonationsScreen';
import PremiumSubscriptionScreen from '../screens/AppScreens/PremiumSubscriptionScreen';
import UserWalletScreen from '../screens/AppScreens/UserWalletScreen';

// Telas do App (Parceiro)
import PartnerHomeScreen from '../screens/AppScreens/PartnerHomeScreen';
import PartnerTrackRideScreen from '../screens/AppScreens/PartnerTrackRideScreen';
import PartnerRideEndScreen from '../screens/AppScreens/PartnerRideEndScreen';
import PartnerEarningsScreen from '../screens/AppScreens/PartnerEarningsScreen';
import PartnerIncentivesScreen from '../screens/AppScreens/PartnerIncentivesScreen';

// Componentes
import ProfileSwitcher from '../components/ProfileSwitcher';

// Constantes de cores da identidade visual Quantza
const COLORS = {
  background: '#0D1B2A', // Azul escuro (fundo)
  primary: '#D4A017',    // Dourado (destaques)
  white: '#FFFFFF',      // Branco (textos e elementos)
  secondary: '#1E2A3A',  // Azul escuro secundário
};

// Tipos para navegação tipada
type OnboardingStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Verify: { email: string };
  PartnerDetails: undefined;
  App: undefined;
};

type UserTabParamList = {
  Home: undefined;
  Points: undefined;
  Wallet: undefined;
  Profile: undefined;
};

type PartnerTabParamList = {
  PartnerHome: undefined;
  Earnings: undefined;
  Incentives: undefined;
  PartnerProfile: undefined;
};

type UserStackParamList = {
  UserTabs: undefined;
  SelectDestination: undefined;
  PriceComparator: { origin: string; destination: string };
  ConfirmRide: { rideType: string; price: number };
  SearchingDriver: { rideId: string };
  UserRideEnd: { rideId: string };
  Premium: undefined;
  Donations: undefined;
};

type PartnerStackParamList = {
  PartnerTabs: undefined;
  PartnerTrackRide: { rideId: string };
  PartnerRideEnd: { rideId: string };
};

// Criação dos navegadores
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const UserTab = createBottomTabNavigator<UserTabParamList>();
const PartnerTab = createBottomTabNavigator<PartnerTabParamList>();
const UserStack = createStackNavigator<UserStackParamList>();
const PartnerStack = createStackNavigator<PartnerStackParamList>();
const RootStack = createStackNavigator();

// Navegador de Onboarding
const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background }
      }}
    >
      <OnboardingStack.Screen name="Splash" component={SplashScreen} />
      <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
      <OnboardingStack.Screen name="Auth" component={AuthNavigator} />
    </OnboardingStack.Navigator>
  );
};

// Navegador de Autenticação
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background }
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="Verify" component={VerifyScreen} />
      <AuthStack.Screen name="PartnerDetails" component={PartnerDetailsScreen} />
      <AuthStack.Screen name="App" component={AppNavigator} />
    </AuthStack.Navigator>
  );
};

// Navegador de Tabs do Usuário
const UserTabNavigator = () => {
  return (
    <UserTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Points') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.white,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.secondary,
        },
        headerShown: false,
      })}
    >
      <UserTab.Screen name="Home" component={HomeScreen} />
      <UserTab.Screen name="Points" component={UserPointsScreen} />
      <UserTab.Screen name="Wallet" component={UserWalletScreen} />
      <UserTab.Screen name="Profile" component={UserProfileScreen} />
    </UserTab.Navigator>
  );
};

// Navegador de Tabs do Parceiro
const PartnerTabNavigator = () => {
  return (
    <PartnerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'PartnerHome') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Incentives') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'PartnerProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.white,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.secondary,
        },
        headerShown: false,
      })}
    >
      <PartnerTab.Screen name="PartnerHome" component={PartnerHomeScreen} options={{ title: 'Home' }} />
      <PartnerTab.Screen name="Earnings" component={PartnerEarningsScreen} options={{ title: 'Ganhos' }} />
      <PartnerTab.Screen name="Incentives" component={PartnerIncentivesScreen} options={{ title: 'Incentivos' }} />
      <PartnerTab.Screen name="PartnerProfile" component={PartnerProfileScreen} options={{ title: 'Perfil' }} />
    </PartnerTab.Navigator>
  );
};

// Navegador de Stack do Usuário
const UserStackNavigator = () => {
  return (
    <UserStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background }
      }}
    >
      <UserStack.Screen name="UserTabs" component={UserTabNavigator} />
      <UserStack.Screen name="SelectDestination" component={SelectDestinationScreen} />
      <UserStack.Screen name="PriceComparator" component={PriceComparatorScreen} />
      <UserStack.Screen name="ConfirmRide" component={ConfirmRideScreen} />
      <UserStack.Screen name="SearchingDriver" component={SearchingDriverScreen} />
      <UserStack.Screen name="UserRideEnd" component={UserRideEndScreen} />
      <UserStack.Screen name="Premium" component={PremiumSubscriptionScreen} />
      <UserStack.Screen name="Donations" component={UserDonationsScreen} />
    </UserStack.Navigator>
  );
};

// Navegador de Stack do Parceiro
const PartnerStackNavigator = () => {
  return (
    <PartnerStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background }
      }}
    >
      <PartnerStack.Screen name="PartnerTabs" component={PartnerTabNavigator} />
      <PartnerStack.Screen name="PartnerTrackRide" component={PartnerTrackRideScreen} />
      <PartnerStack.Screen name="PartnerRideEnd" component={PartnerRideEndScreen} />
    </PartnerStack.Navigator>
  );
};

// Navegador principal do App (após autenticação)
const AppNavigator = () => {
  // Estado para controlar qual perfil está ativo (usuário ou parceiro)
  const [isPartnerMode, setIsPartnerMode] = React.useState(false);

  return (
    <>
      {/* ProfileSwitcher fixo no topo */}
      <ProfileSwitcher />
      
      {/* Navegador condicional baseado no perfil ativo */}
      {isPartnerMode ? <PartnerStackNavigator /> : <UserStackNavigator />}
    </>
  );
};

// Navegador Raiz
const RootNavigator = () => {
  // Estado para controlar se é primeira execução (para mostrar onboarding)
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(true);
  // Estado para controlar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Efeito para verificar se é primeira execução e se o usuário está autenticado
  React.useEffect(() => {
    // Aqui você implementaria a lógica para verificar se é primeira execução
    // e se o usuário está autenticado (usando AsyncStorage, por exemplo)
    
    // Simulação:
    setTimeout(() => {
      setIsFirstLaunch(true); // Definido como true para mostrar o onboarding
      setIsAuthenticated(false); // Definido como false para mostrar a autenticação
    }, 0);
  }, []);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background }
      }}
    >
      {isFirstLaunch ? (
        <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : isAuthenticated ? (
        <RootStack.Screen name="App" component={AppNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

// Componente principal de navegação
const Navigation = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
