import { useCallback, useEffect, useState } from "react";
import InitialImportantComponent from "@/components/initial-important-allert-component";
import InitialMedicineComponent from "@/components/initial-medicine-component";
import Colors from "@/constants/Colors";
import { useAuth } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import env from "@/config/env";
import { useFocusEffect } from "expo-router";
import Background from "@/components/Background";

type Medication = {
  medicationId: string;
  userId: string;
  treatmentId: string | null;
  name: string;
  dose: string | null;
  description: string | null;
  visualTypeId: string | null;
  soundTypeId: string | null;
  alertPeriodInHours: number;
  endTreatmentAt: Date | null;
};

export default function Initial() {
  const { logout, token } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [medicines, setMedicines] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);



  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMedicines = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${env.BASE_URL}/medication/medication/today`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Erro ao buscar medicamentos: ${response.status}`);
          }

          const data = await response.json();

          if (isActive) {
            if (Array.isArray(data?.medications)) {
              setMedicines(data.medications);
            } else {
              console.warn("Formato inesperado da resposta:", data);
              setMedicines([]);
            }
          }
        } catch (err) {
          console.error("Erro ao buscar medicamentos:", err);
          if (isActive) setMedicines([]);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchMedicines();

      return () => {
        isActive = false;
      };
    }, [token])
  );




  return (
    <Background >

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Summary</Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View style={styles.avatar} />
              <TouchableOpacity onPress={() => logout()}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={theme.text}
                />
              </TouchableOpacity>
            </View>
          </View>
          <InitialImportantComponent />
          <InitialMedicineComponent medicines={medicines} />
        </ScrollView>
        
      )}

    </Background>
  );
}
