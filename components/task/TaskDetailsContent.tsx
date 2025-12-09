import type { Offer } from "@/types/offers";
import type { Task } from "@/types/task";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OffersList } from "./OffersList";
import { TaskActions } from "./TaskActions";
import { TaskInfo } from "./TaskInfo";

interface TaskDetailsContentComputed {
  ageLabel: string;
  locationLine: string;
  acceptedOfferAmount: number;
}

interface TaskDetailsContentVisibility {
  showOffers: boolean;
  showBidSection: boolean;
  showAppliedSection: boolean;
  showWorkerSection: boolean;
  showAssignedWorkerSection: boolean;
  showPaySection: boolean;
  showCompletedBadge: boolean;
}

interface TaskDetailsContentPriceState {
  displayedPrice: number;
  priceInput: string;
  isEditingPrice: boolean;
}

interface TaskDetailsContentBidState {
  submittingBid: boolean;
  submitError: string | null;
  offerSuccess: boolean;
}

interface TaskDetailsContentActionState {
  assigningOffer: number | null;
  completingTask: boolean;
  payingTask: boolean;
}

interface TaskDetailsContentHandlers {
  onPriceInputChange: (value: string) => void;
  onSavePrice: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onSubmitBid: () => void;
  onAssignOffer: (offerId: number) => void;
  onCompleteTask: () => void;
  onPayTask: () => void;
  onUnassignTask: () => void;
  onChatWithWorker: (userId?: string) => void;
}

interface TaskDetailsContentProps {
  task: Task;
  offers: Offer[];
  offersLoading: boolean;
  acceptedOffer: Offer | null;
  acceptedOfferLoading: boolean;
  computed: TaskDetailsContentComputed;
  visibility: TaskDetailsContentVisibility;
  priceState: TaskDetailsContentPriceState;
  bidState: TaskDetailsContentBidState;
  actionState: TaskDetailsContentActionState;
  handlers: TaskDetailsContentHandlers;
}

export const TaskDetailsContent: React.FC<TaskDetailsContentProps> = ({
  task,
  offers,
  offersLoading,
  acceptedOffer,
  computed,
  visibility,
  priceState,
  bidState,
  actionState,
  handlers,
}) => {
  const insets = useSafeAreaInsets();
  const [showWorkerMenu, setShowWorkerMenu] = useState(false);

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
    >
      <TaskInfo
        task={task}
        ageLabel={computed.ageLabel}
        locationLine={computed.locationLine}
        displayedPrice={priceState.displayedPrice}
      />

      {visibility.showOffers && (
        <View style={styles.offersSection}>
          <Text style={styles.offersSectionTitle}>Offers</Text>
          <OffersList
            offers={offers}
            task={task}
            loading={offersLoading}
            assigningOfferId={actionState.assigningOffer}
            onAssignOffer={handlers.onAssignOffer}
            onChatWithWorker={handlers.onChatWithWorker}
          />
        </View>
      )}

      {visibility.showWorkerSection && (
        <View style={styles.assignedWorkerSection}>
          <View style={styles.workerHeaderRow}>
            <Text style={styles.assignedWorkerSectionTitle}>Serviceman</Text>
            <View>
              <TouchableOpacity onPress={() => setShowWorkerMenu(!showWorkerMenu)}>
                <MaterialIcons name="more-horiz" size={24} color="#012333" />
              </TouchableOpacity>
              {showWorkerMenu && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setShowWorkerMenu(false);
                      handlers.onUnassignTask();
                    }}
                  >
                    <Text style={styles.dropdownItemText}>Unassign</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.workerCard}
            onPress={() => handlers.onChatWithWorker(acceptedOffer?.user_id)}
          >
            <Image
              source={{
                uri: acceptedOffer?.profile?.avatar_url || "https://ui-avatars.com/api/?name=" + (acceptedOffer?.profile?.name || "User") + "&background=0D8ABC&color=fff"
              }}
              style={styles.workerAvatar}
            />
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>{acceptedOffer?.profile?.name ?? "Unknown User"}</Text>

              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>4.5</Text>
                <MaterialIcons name="star" size={18} color="#FFC107" style={styles.starIcon} />
              </View>

              <Text style={styles.completionRateText}>
                95% Completion Rate
              </Text>
            </View>
            <MaterialIcons name="chat-bubble-outline" size={24} color="#0D8ABC" />
          </TouchableOpacity>
        </View>
      )}

      <TaskActions
        acceptedOfferAmount={computed.acceptedOfferAmount}
        visibility={visibility}
        priceState={priceState}
        bidState={bidState}
        actionState={actionState}
        handlers={handlers}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  content: {
    padding: 24,
    gap: 0,
  },
  offersSection: {
    marginTop: 24,
    gap: 16,
  },
  offersSectionTitle: {
    color: "#012333",
    fontSize: 20,
    fontWeight: "700",
  },
  assignedWorkerSection: {
    marginTop: 24,
  },
  workerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  assignedWorkerSectionTitle: {
    color: "#012333",
    fontSize: 20,
    fontWeight: "700",
  },
  workerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  workerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: "#012333",
    borderWidth: 2,
    textAlign: "center",
    padding: 8
  },
  workerInfo: {
    flex: 1,
    gap: 4,
  },
  workerName: {
    color: "#012333",
    fontSize: 18,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: "#012333",
    fontSize: 16,
    fontWeight: "700",
  },
  starIcon: {
    marginTop: -2,
  },
  completionRateText: {
    color: "#6C7A89",
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownMenu: {
    position: "absolute",
    top: 24,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    minWidth: 120,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "500",
  },
});
