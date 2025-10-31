import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import Background from "@/components/Background";
import { BackButton } from "@/components/BackButton";
import { Medication } from "./(medication)/create-medication";

type MedicationGeneral = {
  medicationId: string;
  name: string;
  description: string;
  visualTypeId: string | null;
  soundTypeId: string | null;
  createdAt: string;
  updatedAt: string;
};

type Treatment = {
  id: string;
  name: string;
  description?: string;
  startAt?: string;
  endAt?: string | null;
};

export default function MedicineDetail() {
  const { med } = useLocalSearchParams<{ med: string }>();
  const medication: Medication | null = med ? JSON.parse(med) : null;

  const [generalInfo, setGeneralInfo] = useState<MedicationGeneral | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const fetchGeneralInfo = useCallback(async () => {
    try {
      const token = await getToken();

      const [medRes, treatRes] = await Promise.all([
        fetch(`${env.BASE_URL}/medication/medication/${medication?.medicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${env.BASE_URL}/treatment/by-medication/${medication?.medicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const medData = await medRes.json().catch(() => null);
      const treatData = await treatRes.json().catch(() => null);

      if (medData?.success) {
        const found =
          medData.medications?.find?.(
            (m: MedicationGeneral) => m.medicationId === medication?.medicationId
          ) ?? medData.medication;

        if (found) setGeneralInfo(found);
      }

      if (treatData?.success && Array.isArray(treatData.treatments)) {
        setTreatments(treatData.treatments);
      }
    } catch (err) {
      console.error("Erro ao buscar informações da medicação", err);
    } finally {
      setLoading(false);
    }
  }, [medication?.medicationId]);

  useEffect(() => {
    if (medication) {
      fetchGeneralInfo();
    }
  }, [fetchGeneralInfo]);

  if (!medication) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Medicação não encontrada.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <Background>
      <View style={styles.controlsContainer}>
        <BackButton />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.title, { color: theme.text }]}>{medication.name}</Text>

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
          {medication.alertPeriodInHours != null && (
            <Text style={[styles.infoText, { color: theme.text }]}>
              Intervalo: {medication.alertPeriodInHours}h
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

        {treatments.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Vinculada a {treatments.length} tratamento(s)
            </Text>

            {treatments.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() =>
                  router.push({
                    pathname: "/treatment-detail",
                    params: { treatmentId: t.id },
                  })
                }
                style={[
                  styles.treatmentCard,
                  { backgroundColor: theme.background },
                ]}
              >
                <Text style={[styles.treatmentName, { color: theme.text }]}>
                  {t.name}
                </Text>
                {t.description && (
                  <Text
                    style={{
                      color: theme.text,
                      opacity: 0.7,
                      fontSize: 13,
                    }}
                  >
                    {t.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </Background>
  );
}

function getNextDoseTime(med: Medication) {
  if (!med.lastTaken) return "Ainda não tomou";

  const last = new Date(med.lastTaken);
  const periodMs = (med.alertPeriodInHours ?? 0) * 60 * 60 * 1000;
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
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 16, fontWeight: "500", marginBottom: 10 },
  description: { fontSize: 15, opacity: 0.8, marginBottom: 16 },
  infoBox: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#00000010",
  },
  infoText: { fontSize: 14, marginBottom: 4 },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  treatmentCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  treatmentName: {
    fontSize: 15,
    fontWeight: "500",
  },
});
