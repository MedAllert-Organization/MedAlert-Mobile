import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

enum VisualPatternEnum {
  SOLID = "SOLID",
  STRIPED = "STRIPED",
  HALF = "HALF",
  RING = "RING",
  DOTS = "DOTS",
  BAND = "BAND",
  GRADIENT = "GRADIENT",
}

const VISUAL_PATTERN_TRANSLATIONS: Record<VisualPatternEnum, string> = {
  [VisualPatternEnum.SOLID]: "Sólido",
  [VisualPatternEnum.STRIPED]: "Listrado",
  [VisualPatternEnum.HALF]: "Metade",
  [VisualPatternEnum.RING]: "Anel",
  [VisualPatternEnum.DOTS]: "Pontos",
  [VisualPatternEnum.BAND]: "Faixa",
  [VisualPatternEnum.GRADIENT]: "Gradiente",
};

interface VisualPatternPickerProps {
  value: VisualPatternEnum | null;
  onSelect: (value: VisualPatternEnum) => void;
}

const VisualPatternPicker: React.FC<VisualPatternPickerProps> = ({
  value,
  onSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const items = Object.values(VisualPatternEnum).map((pattern) => ({
    id: pattern,
    title: VISUAL_PATTERN_TRANSLATIONS[pattern],
    value: pattern,
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.buttonText}>
          {value ? VISUAL_PATTERN_TRANSLATIONS[value] : "Selecione o padrão"}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Padrão Visual</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    value === item.value && styles.itemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setIsVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      value === item.value && styles.itemTextSelected,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  buttonText: { fontSize: 16, color: "#333" },
  arrow: { fontSize: 12, color: "#999" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  close: { fontSize: 24, color: "#999" },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemSelected: { backgroundColor: "#f5f5f5" },
  itemText: { fontSize: 16, color: "#333" },
  itemTextSelected: { fontWeight: "600", color: "#007AFF" },
});

export default VisualPatternPicker;
