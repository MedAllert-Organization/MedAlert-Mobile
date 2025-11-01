import { Text, View, useColorScheme, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from "react-native";
import Colors from "../../constants/Colors";
import Background from "@/components/Background";
import { BackButton } from "@/components/BackButton";
import ButtonPrimary from "@/components/ButtonPrimary";
import { useCallback, useEffect, useState } from "react";
import { getToken } from "@/providers/auth-provider";
import env from "@/config/env";
import { useLocalSearchParams } from "expo-router";

type Annotation = {
    annotationId: string;
    medicationId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export default function MedicationNotesDetail() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { medicationId, medicationName } = useLocalSearchParams();

    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const getAnnotations = useCallback(async (): Promise<void> => {
        try {
            const token = await getToken();
            const res = await fetch(
                `${env.BASE_URL}/medication/annotation/medication/${medicationId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Erro ao buscar anotações");

            const data = await res.json();
            setAnnotations(data || []);
        } catch (e) {
            Alert.alert("Erro", "Houve um erro ao buscar as anotações");
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }, [medicationId]);

    useEffect(() => {
        getAnnotations();
    }, [getAnnotations]);

    const handleCreateNote = async () => {
        if (!newNoteContent.trim()) {
            Alert.alert("Atenção", "Digite o conteúdo da anotação");
            return;
        }

        try {
            setIsSaving(true);
            const token = await getToken();
            const res = await fetch(`${env.BASE_URL}/medication/annotation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    medicationId: medicationId,
                    content: newNoteContent,
                }),
            });

            if (!res.ok) throw new Error("Erro ao criar anotação");

            setNewNoteContent("");
            await getAnnotations();
            Alert.alert("Sucesso", "Anotação criada com sucesso!");
        } catch (e) {
            Alert.alert("Erro", "Houve um erro ao criar a anotação");
            console.log(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateNote = async (id: string) => {
        if (!editContent.trim()) {
            Alert.alert("Atenção", "Digite o conteúdo da anotação");
            return;
        }

        try {
            setIsSaving(true);
            const token = await getToken();
            const res = await fetch(`${env.BASE_URL}/medication/annotation`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    content: editContent,
                }),
            });

            if (!res.ok) throw new Error("Erro ao atualizar anotação");

            setEditingId(null);
            setEditContent("");
            await getAnnotations();
            Alert.alert("Sucesso", "Anotação atualizada com sucesso!");
        } catch (e) {
            Alert.alert("Erro", "Houve um erro ao atualizar a anotação");
            console.log(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteNote = async (id: string) => {
        Alert.alert(
            "Confirmar exclusão",
            "Deseja realmente excluir esta anotação?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await getToken();
                            const res = await fetch(
                                `${env.BASE_URL}/medication/annotation/${id}`,
                                {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );

                            if (!res.ok) throw new Error("Erro ao deletar anotação");

                            await getAnnotations();
                            Alert.alert("Sucesso", "Anotação excluída com sucesso!");
                        } catch (e) {
                            Alert.alert("Erro", "Houve um erro ao excluir a anotação");
                            console.log(e);
                        }
                    },
                },
            ]
        );
    };

    const startEditing = (annotation: Annotation) => {
        setEditingId(annotation.annotationId);
        setEditContent(annotation.content);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditContent("");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Background>
            <View>
                <BackButton />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}>
                <Text
                    style={[
                        styles.titleMain,
                        {
                            color: theme.tint,
                            textShadowColor: 'black',
                            textShadowOffset: { width: -1, height: 1 }
                        }
                    ]}
                >
                    📝 Anotações
                </Text>

                <Text
                    style={[
                        styles.titleSubtitle,
                        {
                            textShadowColor: 'black',
                            textShadowOffset: { width: -1, height: 1 }
                        }
                    ]}
                >
                    {medicationName}
                </Text>

                <View style={styles.addNoteContainer}>
                    <Text style={styles.sectionTitle}>Nova Anotação</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Digite sua anotação aqui..."
                        placeholderTextColor="#999"
                        value={newNoteContent}
                        onChangeText={setNewNoteContent}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                    <ButtonPrimary
                        title={isSaving ? "Salvando..." : "💾 Adicionar Anotação"}
                        onPress={handleCreateNote}
                        disabled={isSaving}
                    />
                </View>

                <View style={styles.notesListContainer}>
                    <Text style={styles.sectionTitle}>Anotações ({annotations.length})</Text>

                    {isLoading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : annotations.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Nenhuma anotação ainda.
                            </Text>
                        </View>
                    ) : (
                        annotations.map((annotation) => (
                            <View key={annotation.annotationId} style={styles.noteCard}>
                                {editingId === annotation.annotationId ? (
                                    <View style={styles.editContainer}>
                                        <TextInput
                                            style={styles.textInput}
                                            value={editContent}
                                            onChangeText={setEditContent}
                                            multiline
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                        />
                                        <View style={styles.editButtons}>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.saveButton]}
                                                onPress={() => handleUpdateNote(annotation.annotationId)}
                                                disabled={isSaving}
                                            >
                                                <Text style={styles.actionButtonText}>
                                                    {isSaving ? "Salvando..." : "💾 Salvar"}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.cancelButton]}
                                                onPress={cancelEditing}
                                            >
                                                <Text style={styles.actionButtonText}>❌ Cancelar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <>
                                        <Text style={styles.noteContent}>{annotation.content}</Text>
                                        <Text style={styles.noteDate}>
                                            {formatDate(annotation.createdAt)}
                                            {annotation.updatedAt !== annotation.createdAt && " (editado)"}
                                        </Text>
                                        <View style={styles.noteActions}>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.editButton]}
                                                onPress={() => startEditing(annotation)}
                                            >
                                                <Text style={styles.actionButtonText}>✏️ Editar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.deleteButton]}
                                                onPress={() => handleDeleteNote(annotation.annotationId)}
                                            >
                                                <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    titleMain: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },

    titleSubtitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },

    addNoteContainer: {
        width: "90%",
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    notesListContainer: {
        width: "90%",
        gap: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },

    textInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#333',
        minHeight: 100,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    loadingText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: 20,
        padding: 20,
    },

    emptyText: {
        color: '#2196F3',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },

    emptySubtext: {
        color: '#2196F3',
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
    },

    noteCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    noteContent: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },

    noteDate: {
        fontSize: 12,
        color: '#888',
        marginBottom: 12,
    },

    noteActions: {
        flexDirection: 'row',
        gap: 8,
    },

    editContainer: {
        gap: 12,
    },

    editButtons: {
        flexDirection: 'row',
        gap: 8,
    },

    actionButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    editButton: {
        backgroundColor: '#2196F3',
    },

    deleteButton: {
        backgroundColor: '#f44336',
    },

    saveButton: {
        backgroundColor: '#4CAF50',
    },

    cancelButton: {
        backgroundColor: '#757575',
    },

    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});