import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  average: number;
};

const getSummaryMessage = (average: number) => {
  if (average < 40) return 'Continue se esforçando!';
  if (average < 70) return 'Você está no caminho certo!';
  return 'Excelente progresso!';
};

export default function ProgressSummary({ average }: Props) {
  const message = getSummaryMessage(average);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Resumo do Progresso</Text>
      <Text style={styles.average}>{average.toFixed(0)}%</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  average: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});