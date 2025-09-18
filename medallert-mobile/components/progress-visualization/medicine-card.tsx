import React from "react";
import { View , StyleSheet, Text} from "react-native";
import ProgressCircle from "./progress-circle"; 

type Medicine = {
    name: string;
    percentage: string;
    dosage: string
};

type Props = {
    medicines: Medicine[];
};

export default function InitialMedicineComponent({ medicines }: Props) {
  return (
    <View>
      {medicines.map((medicine, index) => {
        const percentageNumber = parseInt(medicine.percentage, 10);

        return (
          <View key={index} style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.dosage}>{medicine.dosage}</Text>
            </View>
            <ProgressCircle percentage={percentageNumber} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    card:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    infoContainer: {
        flex: 1,
        marginRight: 16,
    },
    medicineName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    dosage: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    }
});