import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Alert } from "react-native";

interface SharedTreatmentsResponse {
  success: boolean;
  treatments: TreatmentShare[];
}

interface TreatmentShare {
  userId: string;
  createdAt: string;
  treatment: TreatmentPayload;
}

interface TreatmentPayload {
  treatmentId: string;
  name: string;
  description: string;
  user: User;
}

interface User {
  userId: string;
  fullName: string;
}

export function SharedTreatments() {
  const [treatments, setTreatments] = useState<TreatmentShare[]>([]);

  const listSharedTreatments = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/shared-with-me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao listar tratamentos compartilhados");

      const result = (await res.json()) as SharedTreatmentsResponse;
      setTreatments(result.treatments);
    } catch (e) {
      Alert.alert(
        "Erro",
        "Houve um erro ao listar tratamentos compartilhados!"
      );
      console.error(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await listSharedTreatments();
    })();
  }, [listSharedTreatments]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Tratamentos compartilhados comigo</Text>
      {treatments.length === 0 ? (
        <View style={{ alignItems: "center", padding: 2 }}>
          <Text style={{ opacity: 0.75 }}>
            Nenhum tratamento foi compartilhado com você.
          </Text>
        </View>
      ) : (
        <FlatList
          data={treatments}
          keyExtractor={(item) => item.treatment.treatmentId}
          renderItem={({ item }) => (
            <View style={localStyles.card}>
              <Text style={localStyles.userInfo}>
                Compartilhado por: {item.treatment.user.fullName}
              </Text>
              <View style={{ gap: 4 }}>
                <Text style={localStyles.treatmentName}>
                  {item.treatment.name}
                </Text>
                {item.treatment.description && (
                  <Text style={localStyles.treatmentDesc}>
                    {item.treatment.description}
                  </Text>
                )}
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
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "500",
  },
  treatmentDesc: {
    fontSize: 14,
    opacity: 0.8,
  },
});
