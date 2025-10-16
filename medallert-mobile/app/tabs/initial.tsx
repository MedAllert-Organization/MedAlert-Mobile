import { useCallback, useState } from "react";
import Colors from "@/constants/Colors";
import { useAuth } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import env from "@/config/env";
import { useFocusEffect } from "expo-router";
import Background from "@/components/Background";
import MedicineComponent from "@/components/medicine-component";
import { Medication } from "../(medication)/create-medication";

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
            const meds = Array.isArray(data?.medications) ? data.medications : [];
            setMedicines(meds);
          }
        } catch (err) {
          console.error("Erro ao buscar medicamentos:", err);
          if (isActive) setMedicines([]);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchMedicines();
      return () => { isActive = false; };
    }, [token])
  );

  return (
    <Background>
      {loading ? (
        <View style={localStyles.center}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Summary</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TouchableOpacity onPress={logout}>
                <MaterialCommunityIcons name="logout" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {medicines.length === 0 ? (
            <View style={[localStyles.card, { backgroundColor: theme.background }]}>
              <Text style={{ color: theme.text, textAlign: "center" }}>
                No medications scheduled for today.
              </Text>
            </View>
          ) : (
            <MedicineComponent medicines={medicines} title="Today's Medicines" />
          )}
        </ScrollView>
      )}
    </Background>
  );
}

const localStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
});