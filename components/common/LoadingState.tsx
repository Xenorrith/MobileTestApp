import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const LoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#012333" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
});

