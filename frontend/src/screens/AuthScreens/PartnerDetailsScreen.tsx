// Placeholder: /home/ubuntu/quantza_app/frontend/src/screens/AuthScreens/PartnerDetailsScreen.tsx
// Tela para coletar informações adicionais do Parceiro (Motorista)

import React from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

// Para o seletor de arquivos/imagens, você precisaria de uma biblioteca como react-native-document-picker ou react-native-image-picker
// import DocumentPicker from 'react-native-document-picker';

const PartnerDetailsScreen = ({ navigation, route }: any) => {
  // const { userId } = route.params; // ID do usuário que está se cadastrando como parceiro

  const [cnhNumber, setCnhNumber] = React.useState("");
  const [vehicleModel, setVehicleModel] = React.useState("");
  const [vehiclePlate, setVehiclePlate] = React.useState("");
  const [cnhImage, setCnhImage] = React.useState<any>(null); // Placeholder para o arquivo/uri da imagem
  const [vehicleDocument, setVehicleDocument] = React.useState<any>(null); // Placeholder

  const handleSelectCnhImage = async () => {
    // Lógica para selecionar imagem da CNH
    // try {
    //   const res = await DocumentPicker.pickSingle({
    //     type: [DocumentPicker.types.images],
    //   });
    //   setCnhImage(res);
    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {
    //     console.log("User cancelled the picker");
    //   } else {
    //     Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    //   }
    // }
    Alert.alert("Upload CNH", "Funcionalidade de upload de imagem da CNH (placeholder).");
    setCnhImage({ name: "cnh_exemplo.jpg", type: "image/jpeg" }); // Simulação
  };

  const handleSelectVehicleDocument = async () => {
    // Lógica para selecionar documento do veículo
    Alert.alert("Upload Documento Veículo", "Funcionalidade de upload de documento do veículo (placeholder).");
    setVehicleDocument({ name: "doc_veiculo_exemplo.pdf", type: "application/pdf" }); // Simulação
  };

  const handleSubmitDetails = () => {
    if (!cnhNumber || !vehicleModel || !vehiclePlate || !cnhImage || !vehicleDocument) {
      Alert.alert("Campos Incompletos", "Por favor, preencha todos os campos e envie os documentos.");
      return;
    }
    const partnerData = {
      // userId,
      cnhNumber,
      vehicleModel,
      vehiclePlate,
      cnhImageName: cnhImage?.name,
      vehicleDocumentName: vehicleDocument?.name,
      // Em um cenário real, você enviaria os arquivos via FormData
    };
    console.log("Submitting partner details:", partnerData);
    // Chamar um partnerService.submitDetails(partnerData, cnhImageFile, vehicleDocumentFile)
    Alert.alert("Sucesso", "Detalhes enviados para análise (placeholder).");
    // Navegar para uma tela de "Aguardando Aprovação" ou para a Home do app
    // navigation.replace("WaitingApprovalScreen"); ou navigation.popToTop(); navigation.navigate("AppTabs");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete seu Cadastro de Parceiro</Text>
      <TextInput
        style={styles.input}
        placeholder="Número da CNH"
        value={cnhNumber}
        onChangeText={setCnhNumber}
      />
      <Button title={cnhImage ? `CNH: ${cnhImage.name}` : "Anexar Foto da CNH"} onPress={handleSelectCnhImage} />

      <TextInput
        style={styles.input}
        placeholder="Modelo do Veículo"
        value={vehicleModel}
        onChangeText={setVehicleModel}
        style={styles.marginTop}
      />
      <TextInput
        style={styles.input}
        placeholder="Placa do Veículo"
        value={vehiclePlate}
        onChangeText={setVehiclePlate}
        autoCapitalize="characters"
      />
      <Button title={vehicleDocument ? `Doc: ${vehicleDocument.name}` : "Anexar Documento do Veículo"} onPress={handleSelectVehicleDocument} />

      <View style={styles.submitButtonContainer}>
        <Button title="Enviar para Análise" onPress={handleSubmitDetails} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  marginTop: {
    marginTop: 20,
  },
  submitButtonContainer: {
    marginTop: 30,
  }
});

export default PartnerDetailsScreen;

