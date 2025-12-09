import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { PriceCard } from "./PriceCard";
import { PriceEditor } from "./PriceEditor";
import { SuccessBanner } from "./SuccessBanner";

interface SubmitBidSectionProps {
  offerSuccess: boolean;
  isEditingPrice: boolean;
  displayedPrice: number;
  priceInput: string;
  submitError: string | null;
  submittingBid: boolean;
  onPriceInputChange: (value: string) => void;
  onSavePrice: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onSubmitBid: () => void;
}

export const SubmitBidSection: React.FC<SubmitBidSectionProps> = ({
  offerSuccess,
  isEditingPrice,
  displayedPrice,
  priceInput,
  submitError,
  submittingBid,
  onPriceInputChange,
  onSavePrice,
  onCancelEdit,
  onStartEdit,
  onSubmitBid,
}) => {
  if (offerSuccess) {
    return (
      <SuccessBanner message="✅ Your bid has been submitted! The employer will review your application." />
    );
  }

  return (
    <>
      {isEditingPrice ? (
        <PriceEditor
          value={priceInput}
          onChange={onPriceInputChange}
          onSave={onSavePrice}
          onCancel={onCancelEdit}
        />
      ) : (
        <PriceCard
          label="Final Price"
          value={`$${Number(displayedPrice).toFixed(2)}`}
          action={{
            label: "Edit Price",
            icon: "edit",
            onPress: onStartEdit,
            variant: "edit",
          }}
        />
      )}

      {submitError && <Text style={styles.submitError}>{submitError}</Text>}
      <TouchableOpacity
        style={[styles.submitButton, submittingBid && styles.submitButtonDisabled]}
        activeOpacity={0.9}
        onPress={onSubmitBid}
        disabled={submittingBid}
      >
        <Text style={styles.submitButtonText}>
          {submittingBid ? "Submitting..." : "Submit Bid"}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    marginTop: 12,
    backgroundColor: "#50FFA1",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#50FFA1",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  submitButtonText: {
    color: "#012333",
    fontWeight: "700",
    fontSize: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitError: {
    color: "#FF4C4C",
    marginTop: 16,
    fontSize: 14,
  },
});

