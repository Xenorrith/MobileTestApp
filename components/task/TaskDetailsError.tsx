import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TaskDetailsErrorProps {
  message: string;
  onGoBack: () => void;
}

export const TaskDetailsError: React.FC<TaskDetailsErrorProps> = ({
  message,
  onGoBack,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.center, { paddingTop: insets.top + 40 }]}>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.secondaryButton} onPress={onGoBack}>
        <Text style={styles.secondaryButtonText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    gap: 16,
  },
  errorText: {
    color: "#FF7A7A",
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButton: {
    borderColor: "#50FFA1",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#50FFA1",
    fontWeight: "600",
  },
});

