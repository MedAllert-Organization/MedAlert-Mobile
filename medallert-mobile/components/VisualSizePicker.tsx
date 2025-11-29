import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

enum VisualSizeEnum {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

const VISUAL_SIZE_TRANSLATIONS: Record<VisualSizeEnum, string> = {
  [VisualSizeEnum.SMALL]: "Pequeno",
  [VisualSizeEnum.MEDIUM]: "Médio",
  [VisualSizeEnum.LARGE]: "Grande",
};

interface VisualSizePickerProps {
  value: VisualSizeEnum | null;
  onSelect: (value: VisualSizeEnum) => void;
}

const VisualSizePicker: React.FC<VisualSizePickerProps> = ({
  value,
  onSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const items = Object.values(VisualSizeEnum).map((size) => ({
    id: size,
    title: VISUAL_SIZE_TRANSLATIONS[size],
    value: size,
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.buttonText}>
          {value ? VISUAL_SIZE_TRANSLATIONS[value] : "Selecione o tamanho"}
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
              <Text style={styles.title}>Tamanho Visual</Text>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  close: { fontSize: 24, color: "#999" },
  item: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemSelected: { backgroundColor: "#f5f5f5" },
  itemText: { fontSize: 16, color: "#333" },
  itemTextSelected: { fontWeight: "600", color: "#007AFF" },
});

export default VisualSizePicker;
