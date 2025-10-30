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
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
  takenQuantity: number;
  totalQuantity: number;
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

export default function CreateMedication() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [medicationName, setMedicationName] = useState("");
  const [medicationDose, setMedicationDose] = useState("");
  const [medicationDesc, setMedicationDesc] = useState("");
  const [medicationPeriod, setMedicationPeriod] = useState(0);
  const [medicationEndDate, setMedicationEndDate] = useState<Date | null>(null);
  const [isMedicationDateVisible, setIsMedicationDateVisible] = useState(false);

  const hideDatePicker = () => setIsMedicationDateVisible(false);
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

      if (!res.ok) throw new Error("Erro ao buscar medicamentos");

      const response = (await res.json()) as MedicationsRequest;
      setMeds(response.medications);
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao buscar os medicamentos");
      console.log(e);
    }
  }, []);

  const createMedication = useCallback(
    async (payload: CreateMedication): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/medication`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erro ao criar medicamento");

        await getMedications();
      } catch (e) {
        Alert.alert("Erro", "Houve um erro ao criar o medicamento!");
        console.log(e);
      }
    },
    [getMedications],
  );

  const deleteMedication = useCallback(
    async (id: string): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/medication/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao apagar medicamento");
        await getMedications();
      } catch (e) {
        Alert.alert("Erro", "Houve um erro ao apagar o medicamento!");
        console.log(e);
      }
    },
    [getMedications],
  );

  useEffect(() => {
    getMedications();
  }, [getMedications]);

  async function handleCreateMedication() {
    if (
      !medicationName ||
      !medicationDose ||
      !medicationDesc ||
      medicationPeriod <= 0
    ) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente!");
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
  }

  return (
   
    <Background>
  <View>
     <BackButton />
    </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
    
            }}
          >
            <View style={{ paddingBottom: 20 }}>
             
              <Subtitle>💊 Medicamentos</Subtitle>

              <View style={{ gap: 10, marginTop: 12 }}>
                <Text style={styles.label}>Nome</Text>
                <TextField
                  value={medicationName}
                  onChangeText={setMedicationName}
                  placeholder="Ex: Paracetamol"
                />

                <Text style={styles.label}>Dose</Text>
                <TextField
                  value={medicationDose}
                  onChangeText={setMedicationDose}
                  placeholder="Ex: 500mg"
                />

                <Text style={styles.label}>Descrição</Text>
                <TextField
                  value={medicationDesc}
                  onChangeText={setMedicationDesc}
                  placeholder="Para dor de cabeça..."
                />

                <Text style={styles.label}>Intervalo (em horas)</Text>
                <TextField
                  keyboardType="decimal-pad"
                  value={String(medicationPeriod)}
                  onChangeText={(t) => setMedicationPeriod(Number(t))}
                  placeholder="Ex: 8"
                />

                <DateTimePickerModal
                  isVisible={isMedicationDateVisible}
                  mode="date"
                  onConfirm={handleMedicationEndConfirm}
                  onCancel={hideDatePicker}
                />

                <ButtonPrimary
                  onPress={handleCreateMedication}
                  title="💾 Criar Medicamento"
                />
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Subtitle>Lista de medicamentos</Subtitle>

              {meds.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 12, opacity: 0.7 }}>
                  Nenhum medicamento cadastrado ainda.
                </Text>
              ) : (
                meds.map((item) => (
                  <MedicationItem
                    key={item.medicationId}
                    name={item.name}
                    onPress={() => deleteMedication(item.medicationId)}
                  />
                ))
              )}
            </View>

            <View style={{ marginTop: 24 }}>
              <LinkText onPress={() => router.push("/tabs/treatment")}>
                ➡️ Ver Tratamentos
              </LinkText>
            </View>
          </ScrollView>
    </Background>
  );
}
