import { Text, View, useColorScheme, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";
import InitialMedicineComponent from "@/components/progress-visualization/medicine-card";
import ButtonPrimary from "@/components/ButtonPrimary";
import Background from "@/components/Background";

export default function ProgressVisualization() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const medicines: { name: string; percentage: string; dosage: string; }[] = [];

  const handleGenerateReport = async () => {
    Alert.alert("Gerar Relatório", "Gerado com sucesso");
  };

  return (
    <Background>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}>
        <Text
          style={[
            styles.titleMain,
            {
              color: theme.tint,
              textShadowColor: 'black',
              textShadowOffset: { width: -1, height: 1 }
            }
          ]}
        >
          Progresso
        </Text>

        <Text
          style={[
            styles.titleSubtitle,
            {
              textShadowColor: 'black',
              textShadowOffset: { width: -1, height: 1 }
            }
          ]}
        >
          Acompanhe seus medicamentos
        </Text>

        <View style={styles.medicineCardContainer}>
          <InitialMedicineComponent medicines={medicines} />
        </View>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <ButtonPrimary
          title="Gerar Relatório"
          onPress={handleGenerateReport}
        />
      </View>

    </Background>
  );
}

const styles = StyleSheet.create({
  titleMain: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  titleSubtitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  medicineCardContainer: {
    justifyContent: "center",
    marginTop: 20,
    width: "90%",
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    width: "50%",
    alignSelf: "center",
  },
});
