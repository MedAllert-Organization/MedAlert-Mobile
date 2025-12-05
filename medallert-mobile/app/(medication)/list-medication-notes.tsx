import { Text, View, useColorScheme, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import Background from "@/components/Background";
import { BackButton } from "@/components/BackButton";
import { useCallback, useEffect, useState } from "react";
import { getToken } from "@/providers/auth-provider";
import env from "@/config/env";
import { router } from "expo-router";
import { Medication } from "./detail-medication-treatment";

type AnnotationsCount = {
    [medicationId: string]: number;
};

export default function MedicationNotesList() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const [medications, setMedications] = useState<Medication[]>([]);
    const [annotationsCount, setAnnotationsCount] = useState<AnnotationsCount>({});
    const [isLoading, setIsLoading] = useState(true);

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

            const response = await res.json();
            setMedications(response.medications || []);

            const counts: AnnotationsCount = {};
            for (const med of response.medications || []) {
                const annotationsRes = await fetch(
                    `${env.BASE_URL}/medication/annotation/medication/${med.medicationId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (annotationsRes.ok) {
                    const annotations = await annotationsRes.json();
                    counts[med.medicationId] = annotations.length || 0;
                }
            }
            setAnnotationsCount(counts);
        } catch (e) {
            Alert.alert("Erro", "Houve um erro ao buscar os medicamentos");
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getMedications();
    }, [getMedications]);

    const handleMedicationPress = (medication: Medication) => {
        router.push({
            pathname: "/detail-medication-notes",
            params: {
                medicationId: medication.medicationId,
                medicationName: medication.name,
            },
        });
    };

    return (
        <Background>
            <View>
                <BackButton />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}>
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
                    📝 Anotações
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
                    Selecione um medicamento para ver suas anotações
                </Text>

                <View style={styles.medicationsContainer}>
                    {isLoading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : medications.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Nenhum medicamento cadastrado ainda.
                            </Text>
                            <Text style={styles.emptySubtext}>
                                Cadastre medicamentos primeiro para adicionar anotações.
                            </Text>
                        </View>
                    ) : (
                        medications.map((medication) => (
                            <TouchableOpacity
                                key={medication.medicationId}
                                style={styles.medicationCard}
                                onPress={() => handleMedicationPress(medication)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.medicationInfo}>
                                    <Text style={styles.medicationName}>{medication.name}</Text>
                                    <Text style={styles.medicationDose}>{medication.dose}</Text>
                                    {medication.description && (
                                        <Text style={styles.medicationDescription} numberOfLines={2}>
                                            {medication.description}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.annotationBadge}>
                                    <Text style={styles.annotationCount}>
                                        {annotationsCount[medication.medicationId] || 0}
                                    </Text>
                                    <Text style={styles.annotationLabel}>
                                        {annotationsCount[medication.medicationId] === 1 ? 'nota' : 'notas'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    titleMain: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },

    titleSubtitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },

    medicationsContainer: {
        width: "90%",
        gap: 12,
    },

    loadingText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
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

    medicationCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    medicationInfo: {
        flex: 1,
        marginRight: 12,
    },

    medicationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },

    medicationDose: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },

    medicationDescription: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },

    annotationBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        minWidth: 60,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    annotationCount: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },

    annotationLabel: {
        color: 'white',
        fontSize: 10,
        marginTop: 2,
    },
});