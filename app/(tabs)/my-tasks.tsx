import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { TaskCard } from "@/components/common/TaskCard";
import { useAuth } from "@/hooks/useAuth";
import { useMyTasks } from "@/hooks/useMyTasks";
import type { TaskStatus } from "@/types/task";

type TaskStatusFilter = TaskStatus | "All";

const statusOptions: TaskStatusFilter[] = [
  "All",
  "Open",
  "Assigned",
  "Completed",
  "Applied",
  "Canceled",
];

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { tasks, loading, error } = useMyTasks(
    user?.id ?? null,
    user?.profile?.role ?? null,
    statusFilter
  );

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!user) {
      return <EmptyState title="Please sign in to view your tasks" />;
    }
    if (!tasks.length) {
      return (
        <EmptyState
          title="No tasks found"
          message={
            statusFilter === "All"
              ? "You haven't created or applied to any tasks yet"
              : `No tasks with status "${statusFilter}" found.`
          }
        />
      );
    }

    return (
      <View style={styles.listContainer}>
        {tasks.map((task) => (
          <Link key={task.id} href={`/task/${task.id}`} asChild>
            <TaskCard
              task={task}
              onPress={() => { }}
              showLocation={false}
              showDates={false}
            />
          </Link>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={styles.pageTitle}>My Tasks</Text>
        </View>

        <View style={styles.filterSection}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterButtonText}>
              {statusFilter} Tasks
            </Text>
            <MaterialIcons
              name={dropdownOpen ? "expand-less" : "expand-more"}
              size={20}
              color="#50FFA1"
            />
          </TouchableOpacity>
        </View>

        {dropdownOpen && (
          <View style={styles.dropdown}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  statusFilter === option && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setStatusFilter(option);
                  setDropdownOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    statusFilter === option && styles.dropdownItemTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default MyTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F9",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#012333",
    borderBottomWidth: 1,
    borderBottomColor: "#081F2C",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIconsRow: {
    flexDirection: "row",
    columnGap: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#EFFFF7",
  },
  filterSection: {
    marginTop: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#001C2A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#081F2C",
  },
  filterButtonText: {
    color: "#EFFFF7",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemActive: {
    backgroundColor: "#E5F8EF",
  },
  dropdownItemText: {
    color: "#012333",
    fontSize: 16,
  },
  dropdownItemTextActive: {
    color: "#012333",
    fontWeight: "700",
  },
  listContainer: {
    gap: 12,
  },
});
