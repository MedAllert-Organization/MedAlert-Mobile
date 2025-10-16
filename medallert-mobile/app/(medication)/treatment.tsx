import Background from "@/components/Background";
import ButtonPrimary from "@/components/ButtonPrimary";
import Subtitle from "@/components/Subtitle";
import TextField from "@/components/TextField";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../utils/remedyStyles";
import { getToken } from "@/providers/auth-provider";
import LinkText from "@/components/LinkText";
import { router } from "expo-router";
import { BackButton } from "@/components/BackButton";
import env from "@/config/env";
import { Medication } from "./medication";

export type MedicationsRequest = {
  success: boolean;
  medications: Medication[];
};

export type Treatment = {
  treatmentId: string;
  userId: string;
  name: string;
  description: string | null;
  startAt: string;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TreatmentRequest = {
  success: boolean;
  treatments: Treatment[];
};

type CreateTreatment = {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date | null;
  medicationIds: string[];
};

export default function TreatmentsScreen() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  const [newTreatmentName, setNewTreatmentName] = useState("");
  const [newTreatmentDesc, setNewTreatmentDesc] = useState("");
  const [treatmentDate, setTreatmentDate] = useState(new Date());
  const [treatmentEndDate, setTreatmentEndDate] = useState<Date | null>(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const getTreatments = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/treatment`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erro ao buscar tratamentos");

      const response = (await res.json()) as TreatmentRequest;
      setTreatments(response.treatments);
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao buscar os tratamentos.");
      console.log(e);
    }
  }, []);

  const getMedications = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/medication`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar medicamentos");

      const response = (await res.json()) as MedicationsRequest;
      setMeds(response.medications);
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao buscar os medicamentos");
      console.log(e);
    }
  }, []);

  const createTreatment = useCallback(
    async (payload: CreateTreatment): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/treatment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erro ao criar tratamento");
        await getTreatments();
      } catch (e) {
        Alert.alert("Erro", "Houve um erro ao criar o tratamento!");
        console.log(e);
      }
    },
    [getTreatments],
  );

  const deleteTreatment = useCallback(
    async (id: string): Promise<void> => {
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
        await getTreatments();
      } catch (e) {
        Alert.alert("Erro", "Houve um erro ao apagar o tratamento!");
        console.log(e);
      }
    },
    [getTreatments],
  );

  useEffect(() => {
    getTreatments();
    getMedications();
  }, [getTreatments, getMedications]);

  function toggleMedicationSelection(id: string) {
    setSelectedMedications((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  async function handleAddTreatment() {
    if (!newTreatmentName || !newTreatmentDesc || selectedMedications.length === 0) {
      Alert.alert("Atenção", "Preencha todos os campos e selecione ao menos um medicamento!");
      return;
    }

    await createTreatment({
      name: newTreatmentName,
      description: newTreatmentDesc,
      startAt: treatmentDate,
      endAt: treatmentEndDate,
      medicationIds: selectedMedications,
    });

    setNewTreatmentName("");
    setNewTreatmentDesc("");
    setTreatmentDate(new Date());
    setTreatmentEndDate(null);
    setSelectedMedications([]);
  }

  return (
    <Background>
       <BackButton />
        <ScrollView showsVerticalScrollIndicator={false}>
         

          <Subtitle>💊 Criar novo tratamento</Subtitle>

          <Text style={styles.label}>Nome</Text>
          <TextField
            value={newTreatmentName}
            onChangeText={setNewTreatmentName}
            placeholder="Ex: Dor nas costelas"
          />

          <Text style={styles.label}>Descrição</Text>
          <TextField
            value={newTreatmentDesc}
            onChangeText={setNewTreatmentDesc}
            placeholder="Ex: Tratamento com anti-inflamatório"
          />

          <Text style={styles.label}>Medicamentos</Text>
          {meds.length === 0 ? (
            <Text style={{ opacity: 0.7 }}>Nenhum medicamento cadastrado.</Text>
          ) : (
            meds.map((med) => (
              <TouchableOpacity
                key={med.medicationId}
                onPress={() => toggleMedicationSelection(med.medicationId)}
                style={{
                  backgroundColor: selectedMedications.includes(med.medicationId)
                    ? "#d1e7dd"
                    : "#f0f0f0",
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 4,
                }}
              >
                <Text style={{ fontWeight: "500" }}>{med.name}</Text>
                <Text style={{ opacity: 0.6, fontSize: 13 }}>
                  {med.description || "Sem descrição"}
                </Text>
              </TouchableOpacity>
            ))
          )}

          <Text style={styles.label}>Data de início</Text>
          <TouchableOpacity
            onPress={() => setStartPickerVisible(true)}
            style={{
              backgroundColor: "#e8f0fe",
              padding: 8,
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#1a73e8" }}>
              {treatmentDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isStartPickerVisible}
            mode="date"
            onConfirm={(d) => {
              setTreatmentDate(d);
              setStartPickerVisible(false);
            }}
            onCancel={() => setStartPickerVisible(false)}
          />

          <Text style={styles.label}>Data de término (opcional)</Text>
          <TouchableOpacity
            onPress={() => setEndPickerVisible(true)}
            style={{
              backgroundColor: "#e8f0fe",
              padding: 8,
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#1a73e8" }}>
              {treatmentEndDate
                ? treatmentEndDate.toLocaleDateString()
                : "Escolher data"}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isEndPickerVisible}
            mode="date"
            onConfirm={(d) => {
              setTreatmentEndDate(d);
              setEndPickerVisible(false);
            }}
            onCancel={() => setEndPickerVisible(false)}
          />

          <ButtonPrimary
            onPress={handleAddTreatment}
            title="💾 Criar tratamento"
          />

          <View style={{ marginTop: 32 }}>
            <Subtitle>🧾 Lista de tratamentos</Subtitle>
            {treatments.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 12, opacity: 0.7 }}>
                Nenhum tratamento cadastrado ainda.
              </Text>
            ) : (
              treatments.map((item) => (
                <View
                  key={item.treatmentId}
                  style={{
                    backgroundColor: "#fff",
                    padding: 12,
                    borderRadius: 12,
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>
                      {item.name}
                    </Text>
                    <Text style={{ opacity: 0.6, fontSize: 13 }}>
                      {item.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteTreatment(item.treatmentId)}
                  >
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          <View style={{ marginTop: 24, marginBottom: 40 }}>
            <LinkText onPress={() => router.push("/medication")}>
              ➡️ Ver medicamentos
            </LinkText>
          </View>
        </ScrollView>
     
    </Background>
  );
}
