import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OfferCardProps {
  workerName: string;
  isAssigned: boolean;
  isAssigning: boolean;
  onAssign: () => void;
  onChat: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  workerName,
  isAssigned,
  isAssigning,
  onAssign,
  onChat,
}) => {
  return (
    <View style={styles.offerCard}>
      <View style={styles.offerAvatar}>
        <MaterialIcons name="account-circle" size={40} color="#012333" />
      </View>
      <View style={styles.offerInfo}>
        <Text style={styles.offerName}>{workerName}</Text>
        <View style={styles.offerRating}>
          <Text style={styles.offerRatingText}>4.5</Text>
          <MaterialIcons name="star" size={16} color="#FFD700" />
        </View>
        <Text style={styles.offerCompletionRate}>85% Completion Rate</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={onChat}
          activeOpacity={0.8}
        >
          <MaterialIcons name="chat-bubble-outline" size={24} color="#0D8ABC" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.assignButton,
            isAssigned && styles.assignButtonAssigned,
          ]}
          onPress={onAssign}
          disabled={isAssigned || isAssigning}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.assignButtonText,
              isAssigned && styles.assignButtonTextAssigned,
            ]}
          >
            {isAssigned
              ? "Assigned"
              : isAssigning
                ? "Assigning..."
                : "Assign"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  offerCard: {
    backgroundColor: "#E5F8EF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  offerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#012333",
    alignItems: "center",
    justifyContent: "center",
  },
  offerInfo: {
    flex: 1,
    gap: 4,
  },
  offerName: {
    color: "#012333",
    fontSize: 16,
    fontWeight: "600",
  },
  offerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  offerRatingText: {
    color: "#012333",
    fontSize: 14,
    fontWeight: "600",
  },
  offerCompletionRate: {
    color: "#6C7A89",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatButton: {
    padding: 8,
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
  },
  assignButton: {
    backgroundColor: "#012333",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: "center",
  },
  assignButtonAssigned: {
    backgroundColor: "#50FFA1",
  },
  assignButtonText: {
    color: "#50FFA1",
    fontWeight: "600",
    fontSize: 14,
  },
  assignButtonTextAssigned: {
    color: "#012333",
  },
});

