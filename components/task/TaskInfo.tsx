import type { Task } from "@/types/task";
import { formatDateTime } from "@/utils/date";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TaskSection } from "./TaskSection";

interface TaskInfoProps {
  task: Task;
  ageLabel: string;
  locationLine: string;
  displayedPrice: number;
}

export const TaskInfo: React.FC<TaskInfoProps> = ({ task, ageLabel, locationLine, displayedPrice }) => {
  const postedBy = task.profile?.name ?? "Unknown user";

  return (
    <>
      <Text style={styles.title}>{task.title}</Text>

      <TaskSection
        heading="Posted By"
        icon="person-outline"
        value={postedBy}
        meta={ageLabel}
      />

      <TaskSection heading="Location" icon="place" value={locationLine || "—"} />

      <TaskSection
        heading="Target Date"
        icon="schedule"
        value={formatDateTime(task.start_task)}
      />

      <TaskSection
        heading="Price"
        icon="euro-symbol"
        value={`$${displayedPrice}`}
      />

      <View style={styles.detailsWrapper}>
        <Text style={styles.sectionHeading}>Details</Text>
        <Text style={styles.detailsText}>{task.description}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#012333",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionHeading: {
    color: "#012333",
    fontWeight: "700",
  },
  detailsWrapper: {
    marginTop: 24,
    gap: 8,
  },
  detailsText: {
    color: "#4A5B6B",
    lineHeight: 20,
  },
});

