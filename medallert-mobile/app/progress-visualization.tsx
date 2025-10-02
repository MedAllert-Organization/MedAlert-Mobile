import { Text, View, useColorScheme, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";
import InitialMedicineComponent from "@/components/progress-visualization/medicine-card";

export default function ProgressVisualization() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const medicines = [
  { name: "Omeprasol", dosage: "10mg - 2x ao dia", percentage: "50" },
  { name: "Paracetamol", dosage: "5mg - 1x ao dia", percentage: "20" },
  { name: "Dipirona", dosage: "15mg - 3x ao dia", percentage: "80" },
  { name: "Ibuprofeno", dosage: "200mg - 2x ao dia", percentage: "60" },
  { name: "Amoxicilina", dosage: "500mg - 3x ao dia", percentage: "70" },
  { name: "Lorazepam", dosage: "1mg - 1x ao dia", percentage: "30" },
];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          "#61AEF0",
          colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2",
          colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2"
        ]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
          <ScrollView>
            <Text style={[styles.titleMain, 
            {color:theme.tint,
              textShadowColor: 'black',
              textShadowOffset: {width: -1, height: 1}
            }]}>Progresso</Text>

            <Text style={[styles.titleSubtitle, 
            {
              textShadowColor: 'black',
              textShadowOffset: {width: -1, height: 1}
            }]}>Acompanhe seus medicamentos</Text>

            <View style={[styles.medicineCardContainer]}>
              <InitialMedicineComponent medicines={medicines} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  titleMain:{
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  titleSubtitle:{
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  medicineCardContainer:{
    justifyContent: "center",
    marginTop: 20
  }
})