import { Offer } from "@/types/offers";
import type { Task } from "@/types/task";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { OfferCard } from "./OfferCard";

interface OffersListProps {
  offers: Offer[];
  task: Task;
  loading: boolean;
  assigningOfferId: number | null;
  onAssignOffer: (offerId: number) => void;
  onChatWithWorker: (userId: string) => void;
};

export const OffersList: React.FC<OffersListProps> = ({
  offers,
  task,
  loading,
  assigningOfferId,
  onAssignOffer,
  onChatWithWorker,
}) => {
  if (loading) {
    return (
      <ActivityIndicator color="#012333" style={styles.loading} />
    );
  }

  if (offers.length === 0) {
    return (
      <Text style={styles.noOffersText}>No offers yet</Text>
    );
  }

  return (
    <View style={styles.offersList}>
      {offers.map((offer) => {
        const workerName = offer.profile?.name || "Unknown";
        const isAssigned = task.offer_id === offer.id;
        const isAssigning = assigningOfferId === offer.id;

        return (
          <OfferCard
            key={offer.id}
            workerName={workerName}
            isAssigned={isAssigned}
            isAssigning={isAssigning}
            onAssign={() => onAssignOffer(offer.id)}
            onChat={() => onChatWithWorker(offer.user_id)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 20,
  },
  noOffersText: {
    color: "#6C7A89",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  offersList: {
    gap: 12,
  },
});

