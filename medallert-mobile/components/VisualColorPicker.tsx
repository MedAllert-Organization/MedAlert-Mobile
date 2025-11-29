import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

export enum VisualColorEnum {
  DODGER_BLUE = "#1E90FF",
  DARK_ORANGE = "#FF8C00",
  LIME_GREEN = "#32CD32",
  APPLE_RED = "#FF3B30",
  GOLD = "#FFD700",
  BLUE_VIOLET = "#8A2BE2",
  DARK_TURQUOISE = "#00CED1",
  HOT_PINK = "#FF69B4",
}

const VISUAL_COLOR_TRANSLATIONS: Record<
  VisualColorEnum,
  { pt: string; textColor: string }
> = {
  [VisualColorEnum.DODGER_BLUE]: { pt: "Azul Dodger", textColor: "#FFFFFF" },
  [VisualColorEnum.DARK_ORANGE]: { pt: "Laranja Escuro", textColor: "#000000" },
  [VisualColorEnum.LIME_GREEN]: { pt: "Verde Limão", textColor: "#000000" },
  [VisualColorEnum.APPLE_RED]: { pt: "Vermelho Apple", textColor: "#FFFFFF" },
  [VisualColorEnum.GOLD]: { pt: "Ouro", textColor: "#000000" },
  [VisualColorEnum.BLUE_VIOLET]: { pt: "Azul Violeta", textColor: "#FFFFFF" },
  [VisualColorEnum.DARK_TURQUOISE]: {
    pt: "Turquesa Escuro",
    textColor: "#000000",
  },
  [VisualColorEnum.HOT_PINK]: { pt: "Rosa Quente", textColor: "#000000" },
};

interface VisualColorPickerProps {
  value: VisualColorEnum | null;
  onSelect: (value: VisualColorEnum) => void;
}

const VisualColorPicker: React.FC<VisualColorPickerProps> = ({
  value,
  onSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const items = Object.values(VisualColorEnum).map((color) => ({
    id: color,
    title: VISUAL_COLOR_TRANSLATIONS[color as VisualColorEnum].pt,
    value: color,
    bgColor: color,
    textColor: VISUAL_COLOR_TRANSLATIONS[color as VisualColorEnum].textColor,
  }));

  const selectedColor = value
    ? VISUAL_COLOR_TRANSLATIONS[value].pt
    : "Selecione a cor";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.buttonContent}>
          {value && (
            <View style={[styles.colorPreview, { backgroundColor: value }]} />
          )}
          <Text style={styles.buttonText}>{selectedColor}</Text>
        </View>
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
              <Text style={styles.title}>Cor Visual</Text>
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
                    onSelect(item.value as VisualColorEnum);
                    setIsVisible(false);
                  }}
                >
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: item.bgColor },
                    ]}
                  />
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  itemSelected: { backgroundColor: "#f5f5f5" },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  itemText: { fontSize: 16, color: "#333", flex: 1 },
  itemTextSelected: { fontWeight: "600", color: "#007AFF" },
});

export default VisualColorPicker;
