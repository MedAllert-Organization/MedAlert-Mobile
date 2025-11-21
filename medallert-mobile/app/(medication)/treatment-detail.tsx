import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import Colors from "@/constants/Colors";
import styles from "@/utils/styles";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import { BackButton } from "@/components/BackButton";
import Background from "@/components/Background";
import { Treatment } from "./create-treatment";
import MedicineTreatmentDetail from "./medication-treatment-detail";

export default function TreatmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  const [shareVisible, setShareVisible] = useState(false);
  const [email, setEmail] = useState("");

  async function resetTreatment() {
    try {
      const token = await getToken();

      const res = await fetch(`${env.BASE_URL}/medication/treatment/${id}/reset`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao resetar tratamento");

      const data = await res.json();
      setTreatment(data.treatment ?? data);

      Alert.alert("Sucesso", "Tratamento resetado.");

    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao resetar o tratamento!");
      console.log(e);
    }
  }

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
        setTreatment(data.treatment ?? data);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar o tratamento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id]);

  async function deleteTreatment() {
    try {
      const token = await getToken();

      const res = await fetch(`${env.BASE_URL}/medication/treatment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao apagar tratamento");

      Alert.alert("Sucesso", "Tratamento apagado.");
      router.replace("/tabs/treatment");
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao apagar o tratamento!");
      console.log(e);
    }
  }

  async function handleShare() {
    if (!email.trim()) {
      Alert.alert("Atenção", "Informe um e-mail para compartilhar.");
      return;
    }

    try {
      const token = await getToken();

      const res = await fetch(`${env.BASE_URL}/medication/${id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Falha ao compartilhar tratamento");
      }

      Alert.alert("Sucesso", "Tratamento compartilhado com sucesso!");
      setShareVisible(false);
      setEmail("");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", err.message ?? "Falha ao compartilhar tratamento.");
    }
  }

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

      <View style={localStyles.headerRow}>
        <Text style={[styles.title, { color: theme.text, flex: 1 }]}>
          {treatment.name}
        </Text>

        <TouchableOpacity
          onPress={() => setShareVisible(true)}
          style={[localStyles.shareButton, { backgroundColor: theme.tint }]}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: theme.text }}>
        Início: {formatDate(treatment.startAt)}
      </Text>
      <Text style={{ color: theme.text, marginBottom: 10 }}>
        Término: {formatDate(treatment.endAt)}
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {(!treatment.medications || treatment.medications.length === 0) ? (
          <View style={[localStyles.card, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text, textAlign: "center" }}>
              Nenhuma medicação foi encontrada.
            </Text>
          </View>
        ) : (
          (treatment.medications ?? []).map((medication, i) => (
            <MedicineTreatmentDetail key={i} medication={medication} />
          ))
        )}
      </ScrollView>

     

      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Confirmar reset",
              "Deseja realmente resetar este tratamento?\nIsso irá zerar horários, doses tomadas e recalcular tudo.",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Resetar", style: "destructive", onPress: resetTreatment },
              ]
            )
          }
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: theme.tint }}>
            Resetar tratamento
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Confirmar exclusão",
              "Tem certeza que deseja apagar este tratamento?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Apagar", style: "destructive", onPress: deleteTreatment },
              ]
            )
          }
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "red" }}>
            Deletar tratamento
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={shareVisible} transparent animationType="fade">
        <View style={localStyles.modalOverlay}>
          <View
            style={[
              localStyles.modalContent,
              { backgroundColor: theme.background },
            ]}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Compartilhar tratamento
            </Text>
            <Text style={{ color: theme.text, marginBottom: 8 }}>
              Digite o e-mail da pessoa:
            </Text>
            <TextInput
              style={[
                localStyles.input,
                {
                  borderColor: theme.tint,
                  color: theme.text,
                },
              ]}
              placeholder="exemplo@email.com"
              placeholderTextColor={theme.text + "88"}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={localStyles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShareVisible(false)}
                style={[localStyles.modalButton, { backgroundColor: "#aaa" }]}
              >
                <Text style={{ color: "#fff" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={[localStyles.modalButton, { backgroundColor: theme.tint }]}
              >
                <Text style={{ color: "#fff" }}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Background>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
});