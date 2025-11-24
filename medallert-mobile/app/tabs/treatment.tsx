import { useCallback, useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import Background from "@/components/Background";
import Colors from "@/constants/Colors";
import { useAuth } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import env from "@/config/env";
import { SharedTreatments } from "@/components/SharedTreatments";
import { Treatment } from "@/constants/Models";


export default function TreatmentView() {
  const { logout, token } = useAuth();
  const colorScheme = useColorScheme();
  const theme = useMemo(() => Colors[colorScheme ?? "light"], [colorScheme]);

  const [treatments, setTreatment] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const AddTreatmentButton = () => (
    <TouchableOpacity onPress={() => router.push("/create-treatment")}>
      <View style={[localStyles.card, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, textAlign: "center" }}>+ Adicionar tratamento</Text>
      </View>
    </TouchableOpacity>
  );

  function handlePress(treatmentId: string) {
    router.push({
      pathname: "/detail-treatment",
      params: { id: treatmentId },
    });
  }

  function formatDate(dateString?: string | null): string {
    if (!dateString) return "Sem data definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchTreatments = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${env.BASE_URL}/medication/treatment`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Erro ao buscar tratamentos: ${response.status}`);
          }

          const data = await response.json();
          if (isActive) {
            const trea = Array.isArray(data?.treatments) ? data.treatments : [];
            setTreatment(trea);
          }
        } catch (err) {
          console.error("Erro ao buscar tratamentos:", err);
          if (isActive) setTreatment([]);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchTreatments();
      return () => {
        isActive = false;
      };
    }, [token])
  );

  return (
    <Background>

      {loading ? (
        <View style={localStyles.center}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      ) : (

        <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Meus tratamentos</Text>
          </View>

          {treatments.length === 0 ? (
            <>
              <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text, textAlign: "center" }}>
                  Nenhum tratamento encontrado
                </Text>

              </View>
              <AddTreatmentButton />
            </>

          ) : (
            <>

              <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                {treatments.map((trea, idx) => (
                  <TouchableOpacity
                    key={trea.treatmentId}
                    onPress={() => handlePress(trea.treatmentId)}
                    style={[
                      localStyles.row,
                      {
                        borderBottomWidth: idx !== treatments.length - 1 ? 0.2 : 0,
                        borderBottomColor: theme.text,
                      },
                    ]}
                  >
                    <View>
                      <Text style={{ color: theme.text, fontWeight: "600" }}>
                        {trea.name}
                      </Text>

                      {trea.description && (
                        <Text
                          style={{ color: theme.text, opacity: 0.7, fontSize: 13 }}
                          numberOfLines={1}
                        >
                          {trea.description}
                        </Text>
                      )}

                      <Text style={{ color: theme.text, opacity: 0.5, fontSize: 12, marginTop: 4 }}>
                        Termina em: {formatDate(trea.endAt)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <AddTreatmentButton />
            </>
          )}
        </ScrollView>


      )}

       <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => router.push("/progress-visualization")}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: theme.tint }}>
                  📊 Ver Relatório
                </Text>
              </TouchableOpacity>
            </View>

            
      <SharedTreatments />

    </Background>
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
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
});
