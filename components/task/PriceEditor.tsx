import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface PriceEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const PriceEditor: React.FC<PriceEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <View style={styles.priceEditor}>
      <Text style={styles.modalTitle}>Your Bid Price</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputPrefix}>$</Text>
        <TextInput
          style={styles.modalInput}
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
          autoFocus
        />
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.modalSaveButton}
          onPress={onSave}
          activeOpacity={0.9}
        >
          <Text style={styles.modalSaveText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalCancelButton}
          onPress={onCancel}
          activeOpacity={0.9}
        >
          <Text style={styles.modalCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  priceEditor: {
    backgroundColor: "#001C2A",
    borderRadius: 18,
    padding: 20,
    gap: 16,
    marginTop: 24,
  },
  modalTitle: {
    color: "#EFFFF7",
    fontSize: 18,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    columnGap: 8,
  },
  inputPrefix: {
    color: "#012333",
    fontSize: 18,
    fontWeight: "600",
  },
  modalInput: {
    flex: 1,
    fontSize: 18,
    color: "#012333",
  },
  modalActions: {
    flexDirection: "row",
    columnGap: 12,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#50FFA1",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalSaveText: {
    color: "#012333",
    fontWeight: "700",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#EFFFF7",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#012333",
    fontWeight: "700",
  },
});

