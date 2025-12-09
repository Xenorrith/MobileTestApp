import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.subtitle}>{message}</Text>}
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#012333",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6C7A89",
    textAlign: "center",
  },
});

