import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
} from "react-native";
import Colors from "@/constants/Colors";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import {
  Medication,
  VisualSizeEnum,
  VisualType,
  VisualTypeEnum,
} from "@/constants/Models";
import MedicationIcon from "@/components/MedicationIcon";

interface Props {
  medication: Medication;
}

export default function MedicineTreatmentDetail({ medication }: Props) {
  const [generalInfo, setGeneralInfo] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const fetchGeneralInfo = useCallback(async () => {
    try {
      if (!medication?.medicationId) return;

      const token = await getToken();
      const response = await fetch(
        `${env.BASE_URL}/medication/medication/${medication.medicationId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const text = await response.text();
      console.log("🔹 Resposta bruta da API:", text);

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("⚠️ JSON inválido:", text);
        return;
      }

      const found =
        data?.medications?.find?.(
          (m: Medication) => m.medicationId === medication.medicationId,
        ) ??
        data.medication ??
        null;

      setGeneralInfo(found);
    } catch (err) {
      console.error("Erro ao buscar medicação geral", err);
    } finally {
      setLoading(false);
    }
  }, [medication?.medicationId]);

  useEffect(() => {
    fetchGeneralInfo();
  }, [fetchGeneralInfo]);

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );

  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {medication.name}
        </Text>
        {medication?.visualType && (
          <MedicationIcon
            color={medication?.visualType.color1}
            type={medication?.visualType.visualType}
            size={medication?.visualType.size}
            pattern={medication?.visualType.pattern}
          />
        )}
      </View>

      {medication.dose && (
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Dose: {medication.dose}
        </Text>
      )}

      {generalInfo?.description && (
        <Text style={[styles.description, { color: theme.text }]}>
          {generalInfo.description}
        </Text>
      )}

      <View style={styles.infoBox}>
        {medication.alertPeriodInMinutes != null && (
          <Text style={[styles.infoText, { color: theme.text }]}>
            Intervalo: {medication.alertPeriodInMinutes}min
          </Text>
        )}

        <Text style={[styles.infoText, { color: theme.text }]}>
          Progresso: {medication.takenQuantity} / {medication.totalQuantity}
        </Text>

        {medication.lastTaken && (
          <>
            <Text style={[styles.infoText, { color: theme.text }]}>
              Última dose: {new Date(medication.lastTaken).toLocaleString()}
            </Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              Próxima dose: {getNextDoseTime(medication)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

function getNextDoseTime(med: Medication) {
  if (!med.lastTaken) return "Ainda não tomou";

  const last = new Date(med.lastTaken);
  const periodMs = (med.alertPeriodInMinutes ?? 0) * 60 * 1000;
  const nextDose = new Date(last.getTime() + periodMs);
  const now = new Date();

  if (nextDose <= now) return "Agora";

  const diffMs = nextDose.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) return `em ${minutes} min`;
  return `em ${hours}h ${minutes}min`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 15, marginBottom: 8 },
  description: { fontSize: 14, opacity: 0.8, marginBottom: 12 },
  infoBox: { borderRadius: 10, padding: 10, backgroundColor: "#00000010" },
  infoText: { fontSize: 13, marginBottom: 4 },
});
