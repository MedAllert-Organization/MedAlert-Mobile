import React, { useState } from "react";
import { useColorScheme, ScrollView, Text, View, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import InitialMedicineComponent from "@/components/initial-medicine-component";
import Colors from "@/constants/Colors";
import InitialImportantComponent from "@/components/initial-important-allert-component";
import styles from "@/utils/styles";

export default function Initial() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];


    const medicines = [
        { name: "Omeprasol", time: "09:35" },
        { name: "Paracetamol", time: "13:22" },
        { name: "Dipirona", time: "13:22" },
        { name: "Complexo B", time: "19:22" },
    ];

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={["#61AEF0", colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2", colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2"]}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1, padding: 15 }}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>Summary</Text>
                        <View style={styles.avatar} />
                    </View>

                    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                        <InitialImportantComponent/>
                        
                        <InitialMedicineComponent medicines={medicines} />
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const localStyles = StyleSheet.create({
  
});
