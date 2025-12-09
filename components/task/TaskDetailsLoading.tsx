import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TaskDetailsLoading: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.center, { paddingTop: insets.top + 40 }]}>
      <ActivityIndicator color="#50FFA1" />
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
});

