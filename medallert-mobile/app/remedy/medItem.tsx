import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../utils/remedyStyles';

export default function MedItem({ name }: { name: string }) {
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.avatar} />
            <View style={styles.cardContent}>
                <Text style={styles.medName}>{name}</Text>
            </View>
            <Text style={styles.chev}>›</Text>
        </TouchableOpacity>
    );
}
