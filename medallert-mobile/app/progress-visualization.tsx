import { Text, View, useColorScheme, StyleSheet, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";
import InitialMedicineComponent from "@/components/progress-visualization/medicine-card";
import ButtonPrimary from "@/components/ButtonPrimary";
import Background from "@/components/Background";
import { File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from "react";
import { getToken } from "@/providers/auth-provider";
import env from "@/config/env";

export default function ProgressVisualization() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [isGenerating, setIsGenerating] = useState(false);

  const medicines: { name: string; percentage: string; dosage: string; }[] = [];

  const handleGenerateReport = async () => {
    try {

      Alert.alert(
        "Escolha o Período",
        "Selecione o período do relatório:",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Semanal",
            onPress: () => downloadReport("Weekly")
          },
          {
            text: "Mensal",
            onPress: () => downloadReport("Monthly")
          }
        ]
      );
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      Alert.alert("Erro", "Não foi possível gerar o relatório");
    }
  };

  const downloadReport = async (period: "Weekly" | "Monthly") => {
    try {
      setIsGenerating(true);

      const token = await getToken();

      const response = await fetch(`${env.BASE_URL}/medication/report/${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const periodLabel = period === "Weekly" ? "semanal" : "mensal";
      const fileName = `relatorio_${periodLabel}_${Date.now()}.pdf`;

      const file = new File(fileName);

      await file.create();
      await file.write(uint8Array);

      const fileUri = file.uri;

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {

        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Salvar Relatório',
          UTI: 'com.adobe.pdf'
        });

        Alert.alert("Sucesso", "Relatório gerado com sucesso!");
      } else {
        Alert.alert("Sucesso", `Relatório salvo em: ${fileUri}`);
      }

    } catch (error) {
      setIsGenerating(false);
      console.error("Erro ao baixar relatório:", error);
      Alert.alert("Erro", "Houve um erro ao gerar o relatório!");
    }
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
          title={isGenerating ? "Gerando..." : "Gerar Relatório"}
          onPress={handleGenerateReport}
          disabled={isGenerating}
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