import React from "react";
import { Text, View, StyleSheet, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import styles from "@/utils/styles";

type Medicine = {
    name: string;
    time: string;
};

type Props = {
    medicines: Medicine[];
};

export default function InitialMedicineComponent({ medicines }: Props) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Medicine</Text>
            <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                {
                    medicines.map((med, idx) => (
                        <View
                            key={idx}
                            style={[
                                localStyles.row,
                                {
                                    borderBottomWidth: idx !== medicines.length - 1 ? 0.2 : 0,
                                    borderBottomColor: theme.text,
                                    paddingVertical: 3,
                                },
                            ]}
                        >

                            <Text style={{ color: theme.text, fontWeight: "500" }}>{med.name}</Text>
                            <Text style={{ color: theme.text, marginTop: 4 }}>{med.time}</Text>
                        </View>
                    ))
                }
            </View>

            <TouchableOpacity  onPress={(() => null)}>
                <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                    <Text style={{color:theme.text}}>+ Add med</Text>
                </View>
            </TouchableOpacity>


        </View>
    );
}

const localStyles = StyleSheet.create({
    button: {

    },
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    subTitle: { fontSize: 16, marginBottom: 8 },
});
