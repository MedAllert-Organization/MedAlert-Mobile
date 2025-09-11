import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StatusBar, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import { styles } from '../../utils/remedyStyles';
import MedItem from './medItem';

export default function RemediosScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [meds, setMeds] = useState([
        { id: '1', name: 'Omeprazol' }, // exemplo
    ]);

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    function handleAdd() {
        if (!query.trim()) return;
        setMeds(prev => [{ id: String(Date.now()), name: query.trim() }, ...prev]);
        setQuery('');
    }

    return (
        <LinearGradient
            colors={[
                "#61AEF0",
                colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2",
                colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2"
            ]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, padding: 15 }}>
                <StatusBar barStyle="dark-content" />

                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.topRow}>

                        <Text style={[styles.title, { color: theme.text }]}>Remédio</Text>

                        <TouchableOpacity style={styles.profileBtn}>
                            <Image
                               
                                style={styles.profileImg}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Campo de adicionar medicamento */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Adicionar medicamentos</Text>

                    <View style={styles.addRow}>
                        <TextInput
                            placeholder="Adicionar medicamento"
                            placeholderTextColor="#999"
                            value={query}
                            onChangeText={setQuery}
                            style={styles.input}
                            returnKeyType="done"
                            onSubmitEditing={handleAdd}
                        />

                        <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
                            <Text style={styles.plus}>＋</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Lista de medicamentos */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Seus medicamentos</Text>

                    <FlatList
                        data={meds}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => <MedItem name={item.name} />}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
