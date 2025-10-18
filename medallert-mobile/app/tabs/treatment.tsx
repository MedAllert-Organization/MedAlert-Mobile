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
import { Treatment } from "../(medication)/create-treatment";
import TreatmentComponent from "@/components/treatment-component";

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
                        <Text style={[styles.title, { color: theme.text }]}>Tratamento</Text>
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
                            <TreatmentComponent treatments={treatments} title="All treatments" />
                            <AddTreatmentButton />
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
