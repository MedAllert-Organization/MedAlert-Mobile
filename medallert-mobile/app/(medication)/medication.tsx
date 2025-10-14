import { BackButton } from "@/components/BackButton";
import Background from "@/components/Background";
import ButtonPrimary from "@/components/ButtonPrimary";
import LinkText from "@/components/LinkText";
import MedicationItem from "@/components/medication-item";
import Subtitle from "@/components/Subtitle";
import TextField from "@/components/TextField";
import { getToken } from "@/providers/auth-provider";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../utils/remedyStyles";
import env from "@/config/env";

export type MedicationsRequest = {
  success: boolean;
  medications: Medication[];
};

export type Medication = {
  medicationId: string;
  treatmentId: string | null;
  userId: string;
  name: string;
  dose: string;
  description: string;
  visualTypeId: string | null;
  soundTypeId: string | null;
  alertPeriodInHours: number;
  endTreatmentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CreateMedication = {
  name: string;
  dose: string;
  description: string;
  treatmentId: string | null;
  visualTypeId: string | null;
  soundTypeId: string | null;
  alertPeriodInHours: number;
  endTreatmentAt: Date | null;
};

export default function MedicationScreen() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [medicationName, setMedicationName] = useState("");
  const [medicationDose, setMedicationDose] = useState("");
  const [medicationDesc, setMedicationDesc] = useState("");
  const [medicationPeriod, setMedicationPeriod] = useState(0);
  const [medicationEndDate, setMedicationEndDate] = useState<Date | null>(null);

  const [isMedicationDateVisible, setIsMedicationDateVisible] = useState(false);

  const hideDatePicker = () => {
    setIsMedicationDateVisible(false);
  };

  const handleMedicationEndConfirm = (date: Date) => {
    setMedicationEndDate(date);
    hideDatePicker();
  };

  const showMedicationEndPicker = () => setIsMedicationDateVisible(true);

  const getMedications = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/medication`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Bruh", res);
      }

      const response = (await res.json()) as MedicationsRequest;
      setMeds(response.medications);
    } catch (e) {
      Alert.alert("Houve um erro ao buscar os medicamentos");
      console.log(e);
    }
  }, []);

  const createMedication = useCallback(
    async (
      payload: CreateMedication = {
        name: "RN Med Test",
        dose: "dose test",
        description: "desc",
        alertPeriodInHours: 12,
        treatmentId: null,
        visualTypeId: null,
        soundTypeId: null,
        endTreatmentAt: null,
      },
    ): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/medication`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error(res);
        }
        await getMedications();
      } catch (e) {
        Alert.alert("Houve um erro ao criar o medicamento!");
        console.log(e);
      }
    },
    [getMedications],
  );

  const deleteMedication = useCallback(
    async (id: string): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${env.BASE_URL}/medication/medication/${id}`,
          {
            method: "delete",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) {
          console.error("Bruh", res);
        }
        await getMedications();
      } catch (e) {
        Alert.alert("Houve um erro ao apagar o medicamento!");
        console.log(e);
      }
    },
    [getMedications],
  );

  useEffect(() => {
    (async () => {
      await Promise.allSettled([getMedications()]);
    })();
  }, [getMedications]);

  async function handleCreateMedication() {
    if (
      !medicationName ||
      !medicationDose ||
      !medicationDesc ||
      medicationPeriod <= 0
    ) {
      Alert.alert("Preencha todos os campos corretamente!");
      return;
    }
    await createMedication({
      name: medicationName,
      dose: medicationDose,
      description: medicationDesc,
      alertPeriodInHours: medicationPeriod,
      endTreatmentAt: medicationEndDate,
      treatmentId: null,
      visualTypeId: null,
      soundTypeId: null,
    });

    setMedicationDesc("");
    setMedicationDose("");
    setMedicationName("");
    setMedicationPeriod(0);
    setMedicationEndDate(null);

    await getMedications();
  }

  return (
    <Background>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ paddingBottom: 16 }}>
          <BackButton />
          <Subtitle>Medicamentos</Subtitle>

          <Text>Nome</Text>
          <TextField value={medicationName} onChangeText={setMedicationName} />

          <Text>Dose</Text>
          <TextField value={medicationDose} onChangeText={setMedicationDose} />

          <Text>Descrição</Text>
          <TextField value={medicationDesc} onChangeText={setMedicationDesc} />

          <Text>Horas (Período do medicamento)</Text>
          <TextField
            keyboardType="decimal-pad"
            value={String(medicationPeriod)}
            onChangeText={(t) => setMedicationPeriod(Number(t))}
          />

          <Text>Data Limite (opcional)</Text>
          <View style={{ paddingVertical: 12, flexDirection: "row", gap: 4 }}>
            <TouchableOpacity onPress={showMedicationEndPicker}>
              <Text style={{ color: "blue" }}>
                {medicationEndDate?.toISOString() ?? "Escolha a data"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isMedicationDateVisible}
              mode="date"
              onConfirm={handleMedicationEndConfirm}
              onCancel={hideDatePicker}
            />
            <TouchableOpacity onPress={() => setMedicationEndDate(null)}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>

          <ButtonPrimary
            onPress={handleCreateMedication}
            title="Criar Medicamento"
          />
        </View>
        <FlatList
          data={meds}
          keyExtractor={(item) => item.medicationId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MedicationItem
              onPress={() => deleteMedication(item.medicationId)}
              name={item.name}
            />
          )}
        />
        <LinkText onPress={() => router.push("/treatment")}>
          Ver Tratamentos
        </LinkText>
      </SafeAreaView>
    </Background>
  );
}
