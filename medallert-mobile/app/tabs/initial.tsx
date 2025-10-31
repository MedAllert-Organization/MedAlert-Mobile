import { useCallback, useEffect, useState } from "react";
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
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import env from "@/config/env";
import { router, useFocusEffect } from "expo-router";
import Background from "@/components/Background";

export type Medication = {
  medicationId: string;
  treatmentId: string | null;
  userId: string;
  name: string;
  dose: string;
  description: string;
  visualTypeId: string | null;
  soundTypeId: string | null;
  alertPeriodInHours: number;
  endTreatmentAt: string | null;
  createdAt: string;
  updatedAt: string;
  takenQuantity: number | null;
  totalQuantity: number | null;
};

function getTimeRemaining(med: Medication & { lastTaken?: string }) {
  try {
    const now = new Date();

    // Usa lastTaken se existir, senão createdAt
    const referenceTime = med.lastTaken ? new Date(med.lastTaken) : new Date(med.createdAt);

    const periodMs = med.alertPeriodInHours * 60 * 60 * 1000;
    const elapsedMs = now.getTime() - referenceTime.getTime();
    const remainderMs = periodMs - (elapsedMs % periodMs);

    const hours = Math.floor(remainderMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainderMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours <= 0 && minutes <= 0) return "Agora";
    if (hours === 0) return `em ${minutes} min`;
    return `em ${hours}h ${minutes}min`;
  } catch {
    return "";
  }
}

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
      return () => {
        isActive = false;
      };
    }, [token])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMedicines((prev) => [...prev]);
    }, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, []);

  function handlePress(med: Medication) {
    // router.push({
    //   pathname: "/medication-detail",
    //   params: { id: medId },
    // });
    // router.push({
    //   pathname: "/medication-detail",
    //   params: { med: JSON.stringify(med) },
    // });
  }

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
                Nenhum medicamento para hoje
              </Text>
            </View>
          ) : (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Medicamentos para hoje
              </Text>

              <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                {medicines.map((med, idx) => (
                  <TouchableOpacity
                    key={`${med.medicationId}-${med.treatmentId ?? idx}`}
                    onPress={() => handlePress(med)}
                    style={[
                      localStyles.row,
                      {
                        borderBottomWidth: idx !== medicines.length - 1 ? 0.2 : 0,
                        borderBottomColor: theme.text,
                      },
                    ]}
                  >

                    <View>
                      <Text style={{ color: theme.text, fontWeight: "600" }}>
                        {med.name}
                      </Text>

                      {med.dose && (
                        <Text style={{ color: theme.text, opacity: 0.7 }}>
                          Dose: {med.dose}
                        </Text>
                      )}

                      <Text style={{ color: theme.text, opacity: 0.6 }}>
                        Próxima dose {getTimeRemaining(med)}
                      </Text>

                      {med.takenQuantity != null && med.totalQuantity != null && (
                        <Text style={{ color: theme.text, opacity: 0.6 }}>
                          progresso: {med.takenQuantity}/{med.totalQuantity}
                        </Text>
                      )}

                    </View>

                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
});
