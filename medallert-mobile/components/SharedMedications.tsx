import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Alert } from "react-native";

interface SharedMedicationsResponse {
  success: boolean;
  medications: Medication[];
}

interface Medication {
  medicationId: string;
  userId: string;
  createdAt: string;
  medication: MedicationPayload;
}

interface MedicationPayload {
  medicationId: string;
  name: string;
  dose: string;
  description: string;
  alertPeriodInHours: number;
  user: User;
}

interface User {
  userId: string;
  fullName: string;
}

export function SharedMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);

  const listSharedMedications = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/shared-with-me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok)
        throw new Error("Erro ao listar medicamentos compartilhados");

      const result = (await res.json()) as SharedMedicationsResponse;
      setMedications(result.medications);
    } catch (e) {
      Alert.alert(
        "Erro",
        "Houve um erro ao listar medicamentos compartilhados!",
      );
      console.log(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await listSharedMedications();
    })();
  }, [listSharedMedications]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Compartilhados comigo</Text>
      {medications.length === 0 ? (
        <View style={{ alignItems: "center", padding: 2 }}>
          <Text style={{ opacity: 0.75 }}>
            Nenhum medicamento foi compartilhado com você.
          </Text>
        </View>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.medicationId}
          renderItem={({ item }) => (
            <View style={localStyles.card}>
              <Text style={localStyles.userInfo}>
                Nome: {item.medication.user.fullName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={localStyles.medicationName}>
                    {item.medication.name}
                  </Text>
                  <Text style={localStyles.medicationDesc}>
                    {item.medication.description}
                  </Text>
                  <Text style={localStyles.medicationDesc}>
                    {item.medication.dose}
                  </Text>
                </View>
                <Text style={localStyles.medicationPeriod}>
                  A cada {item.medication.alertPeriodInHours}h
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
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
    gap: 4,
  },
  userInfo: {
    fontSize: 18,
    fontWeight: "500",
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "500",
  },
  medicationDesc: {
    fontSize: 14,
  },
  medicationDose: {
    fontSize: 14,
    fontStyle: "italic",
  },
  medicationPeriod: {
    opacity: 0.8,
  },
});
