import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SuccessBannerProps {
  message: string;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ message }) => {
  return (
    <View style={styles.successBanner}>
      <Text style={styles.successText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  successBanner: {
    marginTop: 24,
    backgroundColor: "#33C863",
    borderRadius: 12,
    padding: 16,
  },
  successText: {
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 20,
  },
});

