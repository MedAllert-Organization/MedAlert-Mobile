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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useFocusEffect } from "expo-router";

import Background from "@/components/Background";
import MedicineComponent from "@/components/medicine-component";
import Colors from "@/constants/Colors";
import { useAuth } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import env from "@/config/env";
import { Medication } from "../(medication)/create-medication";

export default function MedicationView() {
    const { logout, token } = useAuth();
    const colorScheme = useColorScheme();
    const theme = useMemo(() => Colors[colorScheme ?? "light"], [colorScheme]);

    const [medicines, setMedicines] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);

    const AddMedicationButton = () => (
        <TouchableOpacity onPress={() => router.push("/create-medication")}>
            <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text, textAlign: "center" }}>+ Add med</Text>
            </View>
        </TouchableOpacity>
    );

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchMedicines = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${env.BASE_URL}/medication/medication`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Erro ao buscar medicamentos: ${response.status}`);
                    }

                    const data = await response.json();
                    if (isActive) {
                        const meds = Array.isArray(data?.medications) ? data.medications : [];
                        setMedicines(meds);
                    }
                } catch (err) {
                    console.error("Erro ao buscar medicamentos:", err);
                    if (isActive) setMedicines([]);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchMedicines();
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
                        <Text style={[styles.title, { color: theme.text }]}>Medication</Text>
                    </View>

                    {medicines.length === 0 ? (
                        <>
                            <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                                <Text style={{ color: theme.text, textAlign: "center" }}>
                                    No medications were found
                                </Text>

                            </View>
                            <AddMedicationButton />
                        </>

                    ) : (
                        <>
                            <MedicineComponent medicines={medicines} title="All medications" />
                            <AddMedicationButton />
                        </>

                    )}


                </ScrollView>



            )}

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
});
