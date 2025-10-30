import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import styles from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import { BackButton } from "@/components/BackButton";
import Background from "@/components/Background";
import { Treatment } from "./(medication)/create-treatment";
import MedicineComponent from "@/components/medicine-component";

export default function TreatmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/treatment/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar tratamento");

        const data = await res.json();
        console.log(data)
        setTreatment(data.treatment);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar o tratamento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id]);

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Sem data definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }


  if (loading)
    return (
      <View style={localStyles.center}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );

  if (!treatment)
    return (
      <View style={localStyles.center}>
        <Text style={{ color: theme.text }}>Tratamento não encontrado.</Text>
      </View>
    );

  return (
    <Background>
      <BackButton />

      <Text style={[styles.title, { color: theme.text, marginBottom: 6 }]}>
        {treatment.name}
      </Text>

      <Text>
        inicio:
        {formatDate(treatment.startAt)}
      </Text>
      <Text>
        término:
        {formatDate(treatment.endAt)}
      </Text>

      {loading ? (
        <View style={localStyles.center}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      ) : (

        <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>


          {(treatment.medications ?? []).length === 0 ? (
            <View style={[localStyles.card, { backgroundColor: theme.background }]}>
              <Text style={{ color: theme.text, textAlign: "center" }}>
                Nenhuma medicação foi encontrada
              </Text>
            </View>
          ) : (
            <MedicineComponent
              medicines={treatment.medications ?? []}
              title="Todos os medicamentos"
            />
          )}

        </ScrollView>
      )}
    </Background>

  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  medRow: {
    marginVertical: 6,
  },
  takeButton: {
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
