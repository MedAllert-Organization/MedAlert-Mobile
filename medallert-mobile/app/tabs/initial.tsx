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
  Alert,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import env from "@/config/env";
import { useFocusEffect } from "@react-navigation/native"; 
import * as Notifications from "expo-notifications";
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
  lastTaken?: string | null;
};

export default function Initial() {
  const { logout, token } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [medicines, setMedicines] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const updateNotifications = async (meds: Medication[]) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      for (const med of meds) {
        const baseDate = med.lastTaken ? new Date(med.lastTaken) : new Date();
        const nextAlert = new Date(
          baseDate.getTime() + med.alertPeriodInHours * 60 * 60 * 1000
        );

        if (nextAlert.getTime() > Date.now()) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Lembrete: ${med.name}`,
              body: `Está na hora de tomar ${med.dose || "seu medicamento"}.`,
              sound: true,
            },
            trigger: {
              type: "timeInterval", 
              seconds: Math.max(1, (nextAlert.getTime() - Date.now()) / 1000),
              repeats: false,
            } as Notifications.TimeIntervalTriggerInput,
          });


        }
      }
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMedicines = async () => {
        setLoading(true);
        try {
          // Cancela notificações ao entrar
          await Notifications.cancelAllScheduledNotificationsAsync();

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
          const meds = Array.isArray(data?.medications) ? data.medications : [];

          if (isActive) {
            setMedicines(meds);
            await updateNotifications(meds);
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

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
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
            <Text style={[styles.title, { color: theme.text }]}>
              {getGreeting()}!
            </Text>
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
               {medicines.map((med, idx) => {
  const baseDate = med.lastTaken ? new Date(med.lastTaken) : new Date();

  const nextAlert = new Date(
    baseDate.getTime() + med.alertPeriodInHours * 60 * 60 * 1000
  );

  const isPast = nextAlert.getTime() <= Date.now();

  const nextTimeFormatted = nextAlert.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      key={`${med.medicationId}-${med.treatmentId ?? idx}`}
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

        {med.takenQuantity != null && med.totalQuantity != null && (
          <Text style={{ color: theme.text, opacity: 0.6 }}>
            Progresso: {med.takenQuantity}/{med.totalQuantity}
          </Text>
        )}

        {!isPast ? (
          <Text style={{ color: theme.text, opacity: 0.6 }}>
            Próximo: {nextTimeFormatted}
          </Text>
        ) : (
          <Text style={{ color: theme.text, opacity: 0.4 }}>
            Nenhum horário futuro
          </Text>
        )}
      </View>
    </View>
  );
})}


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
