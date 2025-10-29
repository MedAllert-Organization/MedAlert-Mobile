import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function MedicineDetail() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [medication, setMedication] = useState<Medication | null>(null);

  useEffect(() => {
    const fetchMed = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/medication/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar medicação");

        const data = await res.json();
        setMedication(data.medication);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar o medicamento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMed();
  }, [id]);

  const handleShareTap = useCallback((id: string) => {
    router.push({ pathname: "/(medication)/share-medication", params: { id } });
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  if (!medication) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Medication not found.</Text>
      </View>
    );
  }

  return (
    <Background>
      <View style={styles.controlsContainer}>
        <BackButton />
        <TouchableOpacity onPress={() => handleShareTap(id)}>
          <MaterialIcons name="mobile-screen-share" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{ padding: 16 }}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {medication.name}
        </Text>

        {medication.dose && (
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Dose: {medication.dose}
          </Text>
        )}

        {medication.description && (
          <Text style={[styles.description, { color: theme.text }]}>
            {medication.description}
          </Text>
        )}

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Alert every {medication.alertPeriodInHours} hours
          </Text>

          <Text style={[styles.infoText, { color: theme.text }]}>
            Created at: {new Date(medication.createdAt).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    opacity: 0.8,
    marginBottom: 16,
  },
  infoBox: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#00000010",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
