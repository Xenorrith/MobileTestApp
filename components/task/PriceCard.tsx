import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PriceCardAction {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "edit" | "complete" | "pay";
}

interface PriceCardBadge {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

interface PriceCardProps {
  label: string;
  value: string;
  action?: PriceCardAction;
  badge?: PriceCardBadge;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  label,
  value,
  action,
  badge,
}) => {
  const renderAction = () => {
    if (!action) return null;

    const isEdit = action.variant === "edit";
    const isComplete = action.variant === "complete";
    const isPay = action.variant === "pay";

    const buttonStyle = [
      isEdit && styles.editPriceButton,
      isComplete && styles.completeButton,
      isPay && styles.payButton,
      action.disabled && (isComplete ? styles.completeButtonDisabled : styles.payButtonDisabled),
    ].filter(Boolean);

    const textStyle = [
      isEdit && styles.editPriceText,
      isComplete && styles.completeButtonText,
      isPay && styles.payButtonText,
    ].filter(Boolean);

    const iconColor = isEdit || isComplete ? "#50FFA1" : "#012333";

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={action.onPress}
        disabled={action.disabled}
        activeOpacity={0.9}
      >
        {action.icon && (
          <MaterialIcons name={action.icon} size={18} color={iconColor} />
        )}
        <Text style={textStyle}>
          {action.loading
            ? action.variant === "complete"
              ? "Completing..."
              : action.variant === "pay"
                ? "Paying..."
                : `${action.label}ing...`
            : action.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBadge = () => {
    if (!badge) return null;

    return (
      <View style={styles.completedBadge}>
        {badge.icon && (
          <MaterialIcons name={badge.icon} size={18} color="#012333" />
        )}
        <Text style={styles.completedBadgeText}>{badge.label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.priceCard}>
      <View style={styles.priceCardContent}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>{label}</Text>
          <Text style={styles.priceValue}>{value}</Text>
        </View>
        {action && renderAction()}
        {badge && renderBadge()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  priceCard: {
    backgroundColor: "#001C2A",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  priceCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    color: "#EFFFF7",
    fontSize: 16,
    fontWeight: "600",
  },
  priceValue: {
    color: "#50FFA1",
    fontSize: 34,
    fontWeight: "800",
  },
  editPriceButton: {
    borderColor: "#50FFA1",
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: "rgba(80,255,161,0.1)",
  },
  editPriceText: {
    color: "#50FFA1",
    fontWeight: "600",
  },
  completeButton: {
    borderColor: "#50FFA1",
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "transparent",
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: "#50FFA1",
    fontWeight: "700",
    fontSize: 16,
  },
  payButton: {
    backgroundColor: "#50FFA1",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: "#012333",
    fontWeight: "700",
    fontSize: 16,
  },
  completedBadge: {
    backgroundColor: "#50FFA1",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignSelf: "flex-start",
  },
  completedBadgeText: {
    color: "#012333",
    fontWeight: "700",
    fontSize: 14,
  },
});

