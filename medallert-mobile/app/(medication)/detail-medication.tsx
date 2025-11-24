import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import Background from "@/components/Background";
import { BackButton } from "@/components/BackButton";
import ButtonPrimary from "@/components/ButtonPrimary";
import { Medication, Treatment } from "@/constants/Models";

export default function MedicineDetail() {
  const { med } = useLocalSearchParams<{ med: string }>();
  const medication: Medication | null = med ? JSON.parse(med) : null;

  const [generalInfo, setGeneralInfo] = useState<Medication | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

    async function deleteMedication() {
    try {
      const token = await getToken();

      const res = await fetch(`${env.BASE_URL}/medication/medication/${medication?.medicationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao apagar medicação");

      Alert.alert("Sucesso", "Medicação apagada.");
      router.replace("/tabs/medication");
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao apagar a medicação!");
      console.log(e);
    }
  }

  const fetchGeneralInfo = useCallback(async () => {
    if (!medication?.medicationId) return;
    setLoading(true);

    try {
      const token = await getToken();

      const [medRes, treatRes] = await Promise.all([
        fetch(`${env.BASE_URL}/medication/medication/${medication.medicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${env.BASE_URL}/medication/medication/linkedTreatments/${medication.medicationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      const medData = await medRes.json().catch(() => null);
      const treatData = await treatRes.json().catch(() => null);

      if (medData?.success && medData.medication) {
        setGeneralInfo(medData.medication);
      }

      if (treatData?.success && Array.isArray(treatData.medication)) {
        setTreatments(treatData.medication);
      }
    } catch (err) {
      console.error("Erro ao buscar informações da medicação", err);
    } finally {
      setLoading(false);
    }
  }, [medication?.medicationId]);

  useEffect(() => {
    fetchGeneralInfo();
  }, [fetchGeneralInfo]);

  const handleGoToNotes = () => {
    router.push({
      pathname: "/detail-medication-notes",
      params: {
        medicationId: medication?.medicationId,
        medicationName: medication?.name,
      },
    });
  };

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

      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={[styles.title, { color: theme.text }]}>{medication.name}</Text>

        {generalInfo?.description && (
          <Text style={[styles.description, { color: theme.text }]}>
            {generalInfo.description}
          </Text>
        )}

        <View style={{ marginTop: 24 }}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Tratamentos vinculados
          </Text>

          {treatments.length === 0 ? (
            <Text style={{ color: theme.text, opacity: 0.6 }}>
              Nenhum tratamento vinculado.
            </Text>
          ) : (
            treatments.map((treatment) => (
              <View
                key={treatment.treatmentId}
                style={[
                  styles.treatmentCard,
                  { backgroundColor: theme.background },
                ]}
              >
                <Text style={[styles.treatmentName, { color: theme.text }]}>
                  {treatment.name}
                </Text>
                {treatment.description && (
                  <Text style={{ color: theme.text, opacity: 0.7 }}>
                    {treatment.description}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        <View style={styles.notesButtonContainer}>
          <ButtonPrimary
            title="📝 Ver Anotações deste Medicamento"
            onPress={handleGoToNotes}
          />
        </View>
      </ScrollView>

      <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Confirmar exclusão",
                    "Tem certeza que deseja apagar essa medicação?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      { text: "Apagar", style: "destructive", onPress: deleteMedication },
                    ]
                  )
                }
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "red" }}>
                  Deletar medicação
                </Text>
              </TouchableOpacity>
            </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  description: { fontSize: 15, opacity: 0.8, marginBottom: 16 },
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
  notesButtonContainer: {
    marginTop: 30,
    width: "100%",
  },
});