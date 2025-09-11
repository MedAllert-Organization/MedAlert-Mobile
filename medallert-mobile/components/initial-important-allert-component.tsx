import { useState } from "react";
import { useColorScheme, ScrollView, Text, View, Switch, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";


export default function InitialImportantComponent() {
    const [outOfUsualTimeZone, setOutOfUsualTimeZone] = useState(true);

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];


    return (
        <View>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Important</Text>

                <View style={[styles.card, { backgroundColor: theme.background }]}>
                    <View style={styles.toggleRow}>
                        <Switch
                            value={outOfUsualTimeZone}
                            onValueChange={(value) => setOutOfUsualTimeZone(value)}
                        />
                        <Text style={[styles.toggleText, { color: theme.text }]}>
                            You seem to be away from your usual time zone. Would you like to temporarily change your current time zone?
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    title: { fontSize: 28, fontWeight: "bold" },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#aaa" },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
    subTitle: { fontSize: 16, marginBottom: 8 },
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
    row: { flexDirection: "row", alignItems: "flex-start" },
    toggleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 }, // gap adiciona espaço entre switch e texto
    toggleText: { flex: 1, fontSize: 14, lineHeight: 20 },
    addButton: {
        marginTop: 8,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
    },
    bottomTabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        borderTopWidth: 1,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    background: {
        flex: 1,
        paddingHorizontal: 16,
    },
});
