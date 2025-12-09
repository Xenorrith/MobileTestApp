import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TaskSectionProps {
  heading: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
  meta?: string;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  heading,
  icon,
  value,
  meta,
}) => {
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      <View style={styles.sectionRow}>
        <MaterialIcons name={icon} size={28} color="#012333" />
        <View style={styles.sectionTextBlock}>
          <Text style={styles.sectionValue}>{value}</Text>
          {meta && <Text style={styles.sectionMeta}>{meta}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionBlock: {
    marginTop: 24,
    gap: 8,
  },
  sectionHeading: {
    color: "#012333",
    fontWeight: "700",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTextBlock: {
    flexShrink: 1,
  },
  sectionValue: {
    color: "#012333",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionMeta: {
    color: "#6C7A89",
    fontSize: 12,
  },
});

