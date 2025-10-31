import { useCallback, useState, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import Background from "@/components/Background";
import MedicineComponent from "@/components/medicine-component";
import Colors from "@/constants/Colors";
import { useAuth } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import env from "@/config/env";
import type { Medication } from "../(medication)/create-medication";

export default function MedicationView() {
  const { token } = useAuth();
  const colorScheme = useColorScheme();
  const theme = useMemo(() => Colors[colorScheme ?? "light"], [colorScheme]);

  const [medicines, setMedicines] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const AddMedicationButton = () => (
    <TouchableOpacity onPress={() => router.push("/create-medication")}>
      <View style={[localStyles.card, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, textAlign: "center" }}>
          + Adicionar medicação
        </Text>
      </View>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMedicines = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${env.BASE_URL}/medication/medication`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Erro ao buscar medicamentos: ${response.status}`);
          }

          const data = await response.json();
          if (isActive) {
            const meds = Array.isArray(data?.medications)
              ? data.medications
              : [];
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
      return () => {
        isActive = false;
      };
    }, [token]),
  );

  return (
    <Background>
      {loading ? (
        <View style={localStyles.center}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      ) : (
        <View style={{ paddingBottom: 0 }}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Medicação</Text>
          </View>

          {medicines.length === 0 ? (
            <>
              <View
                style={[
                  localStyles.card,
                  { backgroundColor: theme.background },
                ]}
              >
                <Text style={{ color: theme.text, textAlign: "center" }}>
                  Nenhuma medicação foi encontrada
                </Text>
              </View>
              <AddMedicationButton />
            </>
          ) : (
            <>
              <MedicineComponent
                medicines={medicines}
                title="Meus Medicamentos"
              />
              <AddMedicationButton />
            </>
          )}
      
        </View>
      )}
    </Background>
  );
}

const localStyles = StyleSheet.create({
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
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
