import React from "react";
import { PriceCard } from "./PriceCard";
import { SubmitBidSection } from "./SubmitBidSection";

interface VisibilityState {
  showBidSection: boolean;
  showAppliedSection: boolean;
  showAssignedWorkerSection: boolean;
  showPaySection: boolean;
  showCompletedBadge: boolean;
}

interface PriceState {
  displayedPrice: number;
  priceInput: string;
  isEditingPrice: boolean;
}

interface BidState {
  submittingBid: boolean;
  submitError: string | null;
  offerSuccess: boolean;
}

interface ActionState {
  completingTask: boolean;
  payingTask: boolean;
}

interface TaskActionHandlers {
  onPriceInputChange: (value: string) => void;
  onSavePrice: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onSubmitBid: () => void;
  onCompleteTask: () => void;
  onPayTask: () => void;
}

interface TaskActionsProps {
  acceptedOfferAmount: number;
  visibility: VisibilityState;
  priceState: PriceState;
  bidState: BidState;
  actionState: ActionState;
  handlers: TaskActionHandlers;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  acceptedOfferAmount,
  visibility,
  priceState,
  bidState,
  actionState,
  handlers,
}) => {
  return (
    <>
      {visibility.showAssignedWorkerSection && (
        <PriceCard
          label="Final Price"
          value={`$${Number(acceptedOfferAmount).toFixed(2)}`}
          action={{
            label: "Complete",
            icon: "check-circle",
            onPress: handlers.onCompleteTask,
            disabled: actionState.completingTask,
            loading: actionState.completingTask,
            variant: "complete",
          }}
        />
      )}

      {visibility.showPaySection && (
        <PriceCard
          label="Final Price"
          value={`$${Number(acceptedOfferAmount).toFixed(2)}`}
          action={{
            label: "Pay Now",
            icon: "payment",
            onPress: handlers.onPayTask,
            disabled: actionState.payingTask,
            loading: actionState.payingTask,
            variant: "pay",
          }}
        />
      )}

      {visibility.showCompletedBadge && (
        <PriceCard
          label="Final Price"
          value={`$${Number(acceptedOfferAmount).toFixed(2)}`}
          badge={{
            label: "Completed",
            icon: "check-circle",
          }}
        />
      )}

      {visibility.showAppliedSection && (
        <SubmitBidSection
          offerSuccess={true}
          isEditingPrice={false}
          displayedPrice={0}
          priceInput=""
          submitError={null}
          submittingBid={false}
          onPriceInputChange={() => { }}
          onSavePrice={() => { }}
          onCancelEdit={() => { }}
          onStartEdit={() => { }}
          onSubmitBid={() => { }}
        />
      )}

      {visibility.showBidSection && (
        <SubmitBidSection
          offerSuccess={bidState.offerSuccess}
          isEditingPrice={priceState.isEditingPrice}
          displayedPrice={priceState.displayedPrice}
          priceInput={priceState.priceInput}
          submitError={bidState.submitError}
          submittingBid={bidState.submittingBid}
          onPriceInputChange={handlers.onPriceInputChange}
          onSavePrice={handlers.onSavePrice}
          onCancelEdit={handlers.onCancelEdit}
          onStartEdit={handlers.onStartEdit}
          onSubmitBid={handlers.onSubmitBid}
        />
      )}
    </>
  );
};

