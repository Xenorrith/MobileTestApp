import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  showStatus?: boolean;
  showLocation?: boolean;
  showDates?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  showStatus = true,
  showLocation = true,
  showDates = true,
}) => {
  return (
    <TouchableOpacity style={styles.taskCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.taskCardHeaderRow}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.taskBudget}>${task.budget}</Text>
      </View>

      {showLocation && (
        <Text numberOfLines={2} style={styles.taskDescription}>
          {task.description}
        </Text>
      )}

      {showLocation && (
        <View style={styles.taskMetaRow}>
          <Text style={styles.taskMetaText}>{task.location}</Text>
          {task.address && <Text style={styles.taskMetaText}> · {task.address}</Text>}
        </View>
      )}

      {showDates && (
        <View style={styles.taskMetaRow}>
          <Text style={styles.taskMetaText}>Start: {task.start_task ?? "—"}</Text>
          <Text style={styles.taskMetaText}>End: {task.end_task ?? "—"}</Text>
        </View>
      )}

      <View style={styles.taskFooterRow}>
        <Text
          style={[
            styles.taskStatus,
            task.status === "Canceled" && styles.taskStatusCanceled,
          ]}
        >
          {task.status}
        </Text>
        <View style={styles.taskIconWrapper}>
          <MaterialIcons name="account-circle" size={20} color="#012333" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taskCardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#012333",
    flexShrink: 1,
    marginRight: 8,
  },
  taskBudget: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D9158",
  },
  taskDescription: {
    fontSize: 14,
    color: "#4A5B6B",
    marginBottom: 6,
  },
  taskMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  taskMetaText: {
    fontSize: 12,
    color: "#6C7A89",
  },
  taskFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#012333",
  },
  taskStatusCanceled: {
    color: "#FF4C4C",
  },
  taskIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5F8EF",
    alignItems: "center",
    justifyContent: "center",
  },
});

