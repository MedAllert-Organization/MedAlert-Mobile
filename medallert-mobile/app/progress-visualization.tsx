import { Text, View, useColorScheme, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";
import ButtonPrimary from "@/components/ButtonPrimary";
import Background from "@/components/Background";
import { File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState, useEffect, useCallback } from "react";
import { getToken } from "@/providers/auth-provider";
import env from "@/config/env";
import { router } from "expo-router";
import { BackButton } from "@/components/BackButton";

type TreatmentMedication = {
  medicationId: string;
  name: string;
  dose: string;
  takenQuantity: number;
  totalQuantity: number;
};

type Treatment = {
  treatmentId: string;
  name: string;
  startAt: string;
  endAt: string;
  medications: TreatmentMedication[];
};

export default function ProgressVisualization() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [isGenerating, setIsGenerating] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      const response = await res.json();
      setTreatments(response.treatments || []);
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao buscar os tratamentos");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getTreatments();
  }, [getTreatments]);

  const calculateProgress = (medication: TreatmentMedication): number => {
    if (!medication.totalQuantity || medication.totalQuantity === 0) return 0;
    return Math.round((medication.takenQuantity / medication.totalQuantity) * 100);
  };

  const calculateTreatmentProgress = (treatment: Treatment): number => {
    if (!treatment.medications || treatment.medications.length === 0) return 0;

    const totalProgress = treatment.medications.reduce((sum, med) => {
      return sum + calculateProgress(med);
    }, 0);

    return Math.round(totalProgress / treatment.medications.length);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 75) return "#4CAF50";
    if (percentage >= 50) return "#FFC107";
    if (percentage >= 25) return "#FF9800";
    return "#F44336";
  };

  const handleGenerateReport = async () => {
    try {
      Alert.alert(
        "Escolha o Período",
        "Selecione o período do relatório:",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Semanal",
            onPress: () => downloadReport("Weekly")
          },
          {
            text: "Mensal",
            onPress: () => downloadReport("Monthly")
          }
        ]
      );
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      Alert.alert("Erro", "Não foi possível gerar o relatório");
    }
  };

  const downloadReport = async (period: "Weekly" | "Monthly") => {
    try {
      setIsGenerating(true);

      const token = await getToken();

      const response = await fetch(`${env.BASE_URL}/medication/report/${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const periodLabel = period === "Weekly" ? "semanal" : "mensal";
      const fileName = `relatorio_${periodLabel}_${Date.now()}.pdf`;

      const file = new File(fileName);

      await file.create();
      await file.write(uint8Array);

      const fileUri = file.uri;

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Salvar Relatório',
          UTI: 'com.adobe.pdf'
        });

        Alert.alert("Sucesso", "Relatório gerado com sucesso!");
      } else {
        Alert.alert("Sucesso", `Relatório salvo em: ${fileUri}`);
      }
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      Alert.alert("Erro", "Houve um erro ao gerar o relatório!");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Background>
      <BackButton />

      <Text
        style={[
          styles.titleMain,
          {
            color: theme.tint,
            textShadowColor: 'black',
            textShadowOffset: { width: -1, height: 1 }
          }
        ]}
      >
        📊 Progresso
      </Text>

      <Text
        style={[
          styles.titleSubtitle,
          {
            textShadowColor: 'black',
            textShadowOffset: { width: -1, height: 1 }
          }
        ]}
      >
        Acompanhe seus tratamentos
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 120, alignItems: "center", paddingHorizontal: 16 }}>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
        ) : treatments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum tratamento em andamento
            </Text>
            <Text style={styles.emptySubtext}>
              Crie um tratamento para acompanhar seu progresso
            </Text>
          </View>
        ) : (
          <View style={styles.treatmentsContainer}>
            {treatments.map((treatment) => {
              const progress = calculateTreatmentProgress(treatment);
              const progressColor = getProgressColor(progress);

              return (
                <TouchableOpacity
                  key={treatment.treatmentId}
                  style={styles.treatmentCard}
                  onPress={() => router.push(`/detail-treatment?id=${treatment.treatmentId}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.treatmentHeader}>
                    <Text style={styles.treatmentName}>{treatment.name}</Text>
                    <View style={[styles.progressBadge, { backgroundColor: progressColor }]}>
                      <Text style={styles.progressText}>{progress}%</Text>
                    </View>
                  </View>

                  <View style={styles.treatmentDates}>
                    <Text style={styles.dateText}>
                      📅 {formatDate(treatment.startAt)} - {formatDate(treatment.endAt)}
                    </Text>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progress}%`,
                          backgroundColor: progressColor
                        }
                      ]}
                    />
                  </View>

                  {treatment.medications && treatment.medications.length > 0 && (
                    <View style={styles.medicationsSection}>
                      <Text style={styles.medicationsTitle}>
                        Medicamentos ({treatment.medications.length})
                      </Text>
                      {treatment.medications.map((med) => {
                        const medProgress = calculateProgress(med);
                        return (
                          <View key={med.medicationId} style={styles.medicationRow}>
                            <View style={styles.medicationInfo}>
                              <Text style={styles.medicationName}>💊 {med.name}</Text>
                              <Text style={styles.medicationDose}>{med.dose}</Text>
                            </View>
                            <View style={styles.medicationProgress}>
                              <Text style={styles.medicationProgressText}>
                                {med.takenQuantity}/{med.totalQuantity}
                              </Text>
                              <Text style={[styles.medicationPercentage, { color: getProgressColor(medProgress) }]}>
                                {medProgress}%
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <ButtonPrimary
          title={isGenerating ? "Gerando..." : "📄 Gerar Relatório PDF"}
          onPress={handleGenerateReport}
          disabled={isGenerating}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  titleMain: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 10,
  },

  titleSubtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },

  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },

  treatmentsContainer: {
    width: "100%",
    gap: 16,
    marginTop: 10,
  },

  treatmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  treatmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },

  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },

  progressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  treatmentDates: {
    marginBottom: 12,
  },

  dateText: {
    fontSize: 13,
    color: '#666',
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  medicationsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },

  medicationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },

  medicationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  medicationInfo: {
    flex: 1,
    marginRight: 12,
  },

  medicationName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  medicationDose: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  medicationProgress: {
    alignItems: 'flex-end',
  },

  medicationProgressText: {
    fontSize: 12,
    color: '#666',
  },

  medicationPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    width: "80%",
    alignSelf: "center",
  },
});