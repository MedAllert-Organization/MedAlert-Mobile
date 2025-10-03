import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type Medicine = {
    name: string;
    dosage: string;
    percentage: string;
};

type Props = {
    average: number;
    medicines: Medicine[];
};

const getSummaryMessage = (average: number) => {
    if (average < 40) return 'Continue se esforçando!';
    if (average < 70) return 'Você está no caminho certo!';
    return 'Excelente progresso!';
};

const getProgressColor = (percentage: number) => {
    if (percentage < 40) return '#7dd3fc';
    if (percentage < 70) return '#0ea5e9';
    return '#1e3a8a';
};

export default function ProgressSummary({ average, medicines }: Props) {
    const message = getSummaryMessage(average);

    const generatePDF = async () => {
        try {
            const currentDate = new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            const medicinesHTML = medicines
                .map(
                    (med) => {
                        const percentage = parseInt(med.percentage, 10);
                        const color = getProgressColor(percentage);
                        return `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${med.name}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #666;">${med.dosage}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">
                <span style="color: ${color}; font-weight: bold; font-size: 16px;">${percentage}%</span>
              </td>
            </tr>
          `;
                    }
                )
                .join('');

            const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Helvetica', 'Arial', sans-serif;
                padding: 40px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #61AEF0;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #1e3a8a;
                font-size: 32px;
                margin: 0 0 10px 0;
              }
              .header p {
                color: #666;
                font-size: 14px;
                margin: 5px 0;
              }
              .summary-box {
                background: linear-gradient(135deg, #61AEF0 0%, #1e3a8a 100%);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .summary-box h2 {
                margin: 0 0 15px 0;
                font-size: 24px;
              }
              .average {
                font-size: 64px;
                font-weight: bold;
                margin: 15px 0;
              }
              .message {
                font-size: 20px;
                font-style: italic;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              thead {
                background: #1e3a8a;
                color: white;
              }
              th {
                padding: 15px;
                text-align: left;
                font-weight: bold;
              }
              tbody tr:hover {
                background: #f5f5f5;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                color: #999;
                font-size: 12px;
                border-top: 1px solid #e0e0e0;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório de Progresso dos Medicamentos</h1>
              <p>Data de emissão: ${currentDate}</p>
            </div>
            
            <div class="summary-box">
              <h2>Resumo Geral</h2>
              <div class="average">${average.toFixed(0)}%</div>
              <div class="message">${message}</div>
            </div>
            
            <h2 style="color: #1e3a8a; margin-bottom: 20px;">Detalhamento por Medicamento</h2>
            <table>
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Dosagem</th>
                  <th style="text-align: center;">Progresso</th>
                </tr>
              </thead>
              <tbody>
                ${medicinesHTML}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Relatório gerado automaticamente pelo sistema de acompanhamento de medicamentos</p>
            </div>
          </body>
        </html>
      `;

            const { uri } = await Print.printToFileAsync({ html });

            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Compartilhar Relatório de Medicamentos',
                    UTI: 'com.adobe.pdf',
                });
            } else {
                Alert.alert('Sucesso', 'PDF gerado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            Alert.alert('Erro', 'Não foi possível gerar o relatório PDF.');
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={generatePDF}
            activeOpacity={0.7}
        >
            <Text style={styles.title}>Resumo do Progresso</Text>
            <Text style={styles.average}>{average.toFixed(0)}%</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.hint}>Gerar relatório</Text>
        </TouchableOpacity>
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
    hint: {
        fontSize: 12,
        color: '#0ea5e9',
        marginTop: 12,
        fontWeight: '600',
    },
});