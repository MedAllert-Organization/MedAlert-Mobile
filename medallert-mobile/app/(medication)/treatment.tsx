import Background from "@/components/Background";
import ButtonPrimary from "@/components/ButtonPrimary";
import Subtitle from "@/components/Subtitle";
import TextField from "@/components/TextField";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../utils/remedyStyles";
import { getToken } from "@/providers/auth-provider";
import LinkText from "@/components/LinkText";
import { router } from "expo-router";
import { BackButton } from "@/components/BackButton";
import env from "@/config/env";

export type TreatmentRequest = {
  success: boolean;
  treatments: Treatment[];
};

export type Treatment = {
  createdAt: string;
  description: string;
  endAt: string;
  name: string;
  startAt: string;
  treatmentId: string;
  updatedAt: string;
  userId: string;
};

type CreateTreatment = {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date | null;
};

export default function TreatmentsScreen() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [newTreatmentName, setNewTreatmentName] = useState<string>("");
  const [newTreatmentDesc, setNewTreatmentDesc] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [treatmentDate, setTreatmentDate] = useState<Date>(new Date());
  const [treatmentEndDate, setTreatmentEndDate] = useState<Date | null>(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
  };

  const showEndDatePicker = () => setEndDatePickerVisibility(true);

  const handleEndConfirm = (date: Date) => {
    setTreatmentEndDate(date);
    hideDatePicker();
  };

  const handleConfirm = (date: Date) => {
    setTreatmentDate(date);
    hideDatePicker();
  };

  const getTreatments = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/treatment`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Bruh", res);
      }

      const response = (await res.json()) as TreatmentRequest;
      setTreatments(response.treatments);
    } catch (e) {
      Alert.alert("Houve um erro ao buscar os tratamentos");
      console.log(e);
    }
  }, []);

  const deleteTreatment = useCallback(
    async (id: string): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${env.BASE_URL}/medication/treatment/${id}`,
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
        await getTreatments();
      } catch (e) {
        Alert.alert("Houve um erro ao apagar o tratamento!");
        console.log(e);
      }
    },
    [getTreatments],
  );

  const createTreatment = useCallback(
    async (payload: CreateTreatment): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/treatment`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Failed to create Treatment", res);
        }
        await getTreatments();
      } catch (e) {
        Alert.alert("Houve um erro ao criar o tratamento!");
        console.log(e);
      }
    },
    [getTreatments],
  );

  useEffect(() => {
    (async () => {
      await Promise.allSettled([getTreatments()]);
    })();
  }, [getTreatments]);

  async function handleAddTreatment() {
    if (!newTreatmentName || !newTreatmentDesc || !treatmentDate) {
      Alert.alert("Preencha todos os campos corretamente.");
      return;
    }
    await createTreatment({
      name: newTreatmentName,
      description: newTreatmentDesc,
      startAt: treatmentDate,
      endAt: treatmentEndDate,
    });
    setTreatmentDate(new Date());
    setNewTreatmentDesc("");
    setNewTreatmentName("");
    setTreatmentEndDate(null);
    await getTreatments();
  }

  return (
    <Background>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
        <BackButton />
        <View style={{ paddingBottom: 4, gap: 12 }}>
          <Subtitle>Tratamentos</Subtitle>
          <Text>Nome</Text>
          <TextField
            value={newTreatmentName}
            onChangeText={setNewTreatmentName}
          />
          <Text>Descrição</Text>
          <TextField
            value={newTreatmentDesc}
            onChangeText={setNewTreatmentDesc}
          />
          <Text>Data Início</Text>
          <View>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={{ color: "blue" }}>
                {treatmentDate?.toISOString() || "Escolher Data"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <Text>Data Fim (opcional)</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <TouchableOpacity onPress={showEndDatePicker}>
              <Text style={{ color: "blue" }}>
                {treatmentEndDate?.toISOString() ?? "Escolher Data"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="date"
              onConfirm={handleEndConfirm}
              onCancel={hideDatePicker}
            />
            <TouchableOpacity onPress={() => setTreatmentEndDate(null)}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>
          <ButtonPrimary
            onPress={handleAddTreatment}
            title="Criar Tratamento"
          />

          <FlatList
            data={treatments}
            keyExtractor={(item) => item.treatmentId}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => deleteTreatment(item.treatmentId)}
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <LinkText onPress={() => router.push("/medication")}>
          Ver medicamentos
        </LinkText>
      </SafeAreaView>
    </Background>
  );
}
