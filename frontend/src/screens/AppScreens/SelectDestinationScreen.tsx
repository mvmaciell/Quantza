// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AppScreens/SelectDestinationScreen.tsx
// Tela para selecionar origem e destino da corrida

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; // Biblioteca popular para isso
// import MapView, { Marker } from 'react-native-maps'; // Para mostrar o mapa

// Chave da API do Google Maps (deve vir de googleMapsConfig.json_placeholder.json ou similar)
// const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_ANDROID_OR_IOS";

const SelectDestinationScreen = ({ navigation }: any) => {
  const [origin, setOrigin] = useState<any>(null); // { description: string, location: { lat: number, lng: number } }
  const [destination, setDestination] = useState<any>(null);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [isOriginFocused, setIsOriginFocused] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Simulação de busca de sugestões (substituir por chamada real à API do Google Places)
  const fetchSuggestions = async (query: string, type: "origin" | "destination") => {
    if (query.length < 3) {
      type === "origin" ? setOriginSuggestions([]) : setDestinationSuggestions([]);
      return;
    }
    setIsLoading(true);
    console.log(`Fetching suggestions for ${type}: ${query} (placeholder)`);
    // Simulação de resposta da API
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockSuggestions = [
      { id: "1", description: `${query} - Rua Exemplo, 123`, location: { lat: -23.55052, lng: -46.633308 } },
      { id: "2", description: `${query} - Avenida Principal, 456`, location: { lat: -23.561372, lng: -46.65618 } },
      { id: "3", description: `${query} - Ponto de Referência`, location: { lat: -23.5475, lng: -46.63611 } },
    ];
    if (type === "origin") {
      setOriginSuggestions(mockSuggestions);
    } else {
      setDestinationSuggestions(mockSuggestions);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOriginFocused) {
      fetchSuggestions(originInput, "origin");
    } else {
      fetchSuggestions(destinationInput, "destination");
    }
  }, [originInput, destinationInput, isOriginFocused]);

  const handleSelectSuggestion = (suggestion: any, type: "origin" | "destination") => {
    if (type === "origin") {
      setOrigin(suggestion);
      setOriginInput(suggestion.description);
      setOriginSuggestions([]);
      setIsOriginFocused(false); // Mover foco para destino
    } else {
      setDestination(suggestion);
      setDestinationInput(suggestion.description);
      setDestinationSuggestions([]);
    }
  };

  const handleConfirmRoute = () => {
    if (!origin || !destination) {
      Alert.alert("Atenção", "Por favor, selecione a origem e o destino.");
      return;
    }
    console.log("Route confirmed:", { origin, destination });
    // Navegar para a tela do Comparador de Preços Animado, passando os dados da rota
    navigation.navigate("PriceComparatorScreen", { origin, destination });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para onde vamos?</Text>
      
      <TextInput
        style={styles.input}
        placeholder="📍 Ponto de partida (ou usar atual)"
        value={originInput}
        onChangeText={setOriginInput}
        onFocus={() => setIsOriginFocused(true)}
      />
      {isOriginFocused && isLoading && <ActivityIndicator />}
      {isOriginFocused && originSuggestions.length > 0 && (
        <FlatList
          data={originSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item, "origin")}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="🏁 Informe o destino"
        value={destinationInput}
        onChangeText={setDestinationInput}
        onFocus={() => setIsOriginFocused(false)}
        editable={!!origin} // Só edita destino após origem definida
      />
      {!isOriginFocused && isLoading && <ActivityIndicator />}
      {!isOriginFocused && destinationSuggestions.length > 0 && (
        <FlatList
          data={destinationSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item, "destination")}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      {/* Placeholder para o Mapa - Integrar MapView aqui */}
      {/* <View style={styles.mapPlaceholder}>
        <Text>Mapa Aqui</Text>
        {origin && <Text>Origem: {origin.description}</Text>}
        {destination && <Text>Destino: {destination.description}</Text>}
      </View> */}

      <Button 
        title="Calcular Rota e Ver Preços" 
        onPress={handleConfirmRoute} 
        disabled={!origin || !destination || isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0D1B2A",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1E2A3A",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  suggestionsList: {
    maxHeight: 150, // Limitar altura da lista de sugestões
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#0D1B2A",
  },
  mapPlaceholder: {
    flex: 1, // Ocupar espaço restante
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    marginVertical: 20,
    minHeight: 200, // Altura mínima para o mapa
  },
});

export default SelectDestinationScreen;

