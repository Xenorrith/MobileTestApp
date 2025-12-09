import type { TaskStatus } from "@/types/task";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TaskDetailsHeaderProps {
  taskStatus?: TaskStatus;
  onBack: () => void;
  isOwner?: boolean;
  isAssigned?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onUnassign?: () => void;
}

export const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({
  taskStatus,
  onBack,
  isOwner,
  isAssigned,
  onEdit,
  onDelete,
  onUnassign,
}) => {
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <View
      style={[
        styles.topSection,
        { paddingTop: insets.top + 12, paddingBottom: 16 },
      ]}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back" size={24} color="#EFFFF7" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Task Details</Text>
        <View style={styles.topBarActions}>
          <MaterialIcons name="notifications-none" size={22} color="#50FFA1" />
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MaterialIcons name="more-horiz" size={22} color="#50FFA1" />
          </TouchableOpacity>
        </View>
      </View>
      {taskStatus && (
        <View style={styles.statusCancelRow}>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{taskStatus}</Text>
          </View>
        </View>
      )}

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.menuContainer, { top: insets.top + 50 }]}>
              {isOwner && (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      onEdit?.();
                    }}
                  >
                    <Text style={styles.menuText}>Edit Task</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      onDelete?.();
                    }}
                  >
                    <Text style={[styles.menuText, { color: "#FF5050" }]}>Delete Task</Text>
                  </TouchableOpacity>
                </>
              )}
              {isAssigned && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    onUnassign?.();
                  }}
                >
                  <Text style={[styles.menuText, { color: "#FF5050" }]}>Cancel Task</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: "#012333",
    paddingHorizontal: 24,
    gap: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: {
    color: "#EFFFF7",
    fontSize: 20,
    fontWeight: "700",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusCancelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusPill: {
    backgroundColor: "#50FFA1",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusText: {
    color: "#012333",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  menuContainer: {
    position: "absolute",
    right: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#012333",
  },
});

