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
  userId?: string;
  name: string;
  dose: string;
  description?: string;
  visualTypeId?: string | null;
  soundTypeId?: string | null;
  alertPeriodInMinutes?: number;
  endTreatmentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  takenQuantity: number | null;
  totalQuantity: number | null;
  lastTaken?: string | null;
  nextTakeAt?: string | null;
  timezone?: string;
};

function convertToUserTimezone(dateString: string, timezone?: string) {
  try {
    const date = new Date(dateString);

    const tz = timezone || "UTC";

    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return null;
  }
}


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
        if (!med.nextTakeAt) continue;
        const nextAlert = new Date(med.nextTakeAt);
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

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${env.BASE_URL}/medication/treatment-medication/today`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar medicamentos: ${response.status}`);
      }

      const data = await response.json();

      const meds = Array.isArray(data?.medications?.medications)
        ? data.medications.medications
        : [];

      const timezone = data?.medications?.timezone ?? "America/Sao_Paulo";

      const medsWithTimezone = meds.map((m: any) => ({
        ...m,
        timezone: m.timezone || timezone,
      }));

      setMedicines(medsWithTimezone);

      await updateNotifications(medsWithTimezone);
    } catch (err) {
      console.error("Erro ao buscar medicamentos:", err);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) fetchMedicines();
      return () => {
        isActive = false;
      };
    }, [token])
  );

  const confirmTaken = (med: Medication) => {
    Alert.alert(
      "Confirmar medicação",
      `Você tomou ${med.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, tomei",
          onPress: async () => {
            try {
              const now = new Date().toISOString();

              const response = await fetch(
                `${env.BASE_URL}/medication/treatment-medication/update-progress`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    treatmentId: med.treatmentId,
                    medicationId: med.medicationId,
                    progress: {
                      lastTaken: now,
                      takenQuantity: (med.takenQuantity ?? 0) + 1,
                    },
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Falha ao atualizar progresso");
              }

              await fetchMedicines();
            } catch (error) {
              console.error("Erro ao atualizar progresso:", error);
              Alert.alert("Erro", "Não foi possível atualizar o progresso.");
            }
          },
        },
      ]
    );
  };

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
            <TouchableOpacity onPress={logout}>
              <MaterialCommunityIcons name="logout" size={24} color={theme.text} />
            </TouchableOpacity>
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
                  const nextFormatted =
                    med.nextTakeAt && med.timezone
                      ? convertToUserTimezone(med.nextTakeAt, med.timezone)
                      : null;

                  return (
                    <TouchableOpacity
                      key={`${med.medicationId}-${med.treatmentId}-${idx}`}
                      onPress={() => confirmTaken(med)}
                    >
                      <View
                        style={[
                          localStyles.row,
                          {
                            borderBottomWidth:
                              idx !== medicines.length - 1 ? 0.2 : 0,
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

                          {med.takenQuantity != null &&
                            med.totalQuantity != null && (
                              <Text style={{ color: theme.text, opacity: 0.6 }}>
                                Progresso: {med.takenQuantity}/{med.totalQuantity}
                              </Text>
                            )}

                          {nextFormatted ? (
                            <Text style={{ color: theme.text, opacity: 0.6 }}>
                              Próximo: {nextFormatted}
                            </Text>
                          ) : (
                            <Text style={{ color: theme.text, opacity: 0.4 }}>
                              Nenhum horário definido
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
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
