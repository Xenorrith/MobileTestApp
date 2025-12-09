import { assignOffer, completeTask, createOffer, payTask } from "@/lib/offer";
import { deleteTask, unassignTask } from "@/lib/task";
import { getTaskAge } from "@/utils/date";
import { getAcceptedOfferAmount, isAssignedWorker } from "@/utils/task";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { useTaskDetails } from "./useTaskDetails";
import { useTaskAcceptOffer, useTaskOffers } from "./useTaskOffers";

export function useTaskDetailsLogic(taskId: number | undefined) {
  const router = useRouter();
  const { user } = useAuth();
  const { task, loading, error } = useTaskDetails(taskId);
  const { offers, loading: offersLoading } = useTaskOffers(taskId);
  const { acceptedOffer, loading: acceptedOfferLoading } = useTaskAcceptOffer(taskId);

  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [assigningOffer, setAssigningOffer] = useState<number | null>(null);
  const [completingTask, setCompletingTask] = useState(false);
  const [payingTask, setPayingTask] = useState(false);

  // User role and permissions
  const isEmployer = user?.profile?.role === "employeer";
  const isMyTask = task && user && task.author_id === user.id;
  const isWorker = user?.profile?.role === "worker";
  const assignedWorker = useMemo(
    () => isAssignedWorker(task, user?.id, isWorker, offers),
    [task, user?.id, isWorker, offers]
  );

  const hasApplied = useMemo(() => {
    if (!user || !offers.length) return false;
    return offers.some(offer => offer.user_id === user.id);
  }, [user, offers]);

  // Visibility flags
  const visibility = useMemo(
    () => ({
      showOffers: !!(isEmployer && isMyTask && task?.status === "Open"),
      showBidSection: !!(
        isWorker && !!user && !assignedWorker && !hasApplied && task?.status === "Open"
      ),
      showAppliedSection: !!(
        isWorker && !!user && !assignedWorker && hasApplied && task?.status === "Open"
      ),
      showWorkerSection: !!(
        isEmployer && isMyTask && task?.status !== "Open"
      ),
      showAssignedWorkerSection: !!(
        assignedWorker && task?.status === "Assigned"
      ),
      showPaySection: !!(
        isEmployer && isMyTask && task?.status === "Applied"
      ),
      showCompletedBadge: task?.status === "Completed",
    }),
    [isEmployer, isMyTask, isWorker, user, assignedWorker, task, hasApplied]
  );

  // Computed values
  const computed = useMemo(
    () => ({
      ageLabel: getTaskAge(task?.created_at),
      locationLine: [task?.location, task?.address].filter(Boolean).join("\n"),
      displayedPrice:
        task?.status === "Assigned" || task?.status === "Completed"
          ? getAcceptedOfferAmount(task, offers)
          : finalPrice ?? task?.budget ?? 0,
      acceptedOfferAmount: getAcceptedOfferAmount(task, offers),
    }),
    [task, finalPrice, offers]
  );

  useEffect(() => {
    if (task) {
      setFinalPrice(task.budget);
      setPriceInput(String(task.budget));
    }
  }, [task?.id]);

  const refreshTask = () => {
    router.back();
    setTimeout(() => {
      router.push(`/task/${taskId}`);
    }, 100);
  };

  const handleSavePrice = () => {
    const parsed = Number(priceInput.replace(/[^\d.]/g, ""));
    if (!Number.isNaN(parsed)) {
      setFinalPrice(parsed);
    }
    setIsEditingPrice(false);
  };

  const handleSubmitBid = async () => {
    if (!user || !taskId) return;
    const amount = finalPrice ?? task?.budget ?? null;
    if (!amount || Number.isNaN(amount)) {
      setSubmitError("Enter a valid price before submitting.");
      return;
    }

    try {
      setSubmittingBid(true);
      setSubmitError(null);
      await createOffer({
        taskId,
        userId: user.id,
        amount: Math.round(amount),
      });
      setOfferSuccess(true);
      setIsEditingPrice(false);
    } catch (err: any) {
      setSubmitError(err?.message ?? "Failed to submit offer");
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleAssignOffer = async (offerId: number) => {
    if (!taskId) return;
    try {
      setAssigningOffer(offerId);
      await assignOffer(taskId, offerId);
      refreshTask();
    } catch (err: any) {
      console.error("Failed to assign offer", err);
    } finally {
      setAssigningOffer(null);
    }
  };

  const handleCompleteTask = async () => {
    if (!taskId) return;
    try {
      setCompletingTask(true);
      await completeTask(taskId);
      refreshTask();
    } catch (err: any) {
      console.error("Failed to complete task", err);
    } finally {
      setCompletingTask(false);
    }
  };

  const handlePayTask = async () => {
    if (!taskId) return;
    try {
      setPayingTask(true);
      await payTask(taskId);
      refreshTask();
    } catch (err: any) {
      console.error("Failed to pay task", err);
    } finally {
      setPayingTask(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId) return;
    try {
      await deleteTask(taskId);
      router.back();
    } catch (err: any) {
      console.error("Failed to delete task", err);
    }
  };

  const handleUnassignTask = async () => {
    if (!taskId) return;
    try {
      await unassignTask(taskId);
      refreshTask();
    } catch (err: any) {
      console.error("Failed to unassign task", err);
    }
  };

  return {
    // Data
    task,
    offers,
    loading,
    error,
    offersLoading,
    acceptedOffer,
    acceptedOfferLoading,
    // State
    priceState: {
      finalPrice,
      isEditingPrice,
      priceInput,
      displayedPrice: computed.displayedPrice,
    },
    bidState: {
      submittingBid,
      submitError,
      offerSuccess,
    },
    actionState: {
      assigningOffer,
      completingTask,
      payingTask,
    },
    // Computed
    computed,
    visibility,
    // Handlers
    handlers: {
      onPriceInputChange: setPriceInput,
      onSavePrice: handleSavePrice,
      onCancelEdit: () => setIsEditingPrice(false),
      onStartEdit: () => {
        setPriceInput(String(computed.displayedPrice));
        setIsEditingPrice(true);
      },
      onSubmitBid: handleSubmitBid,
      onAssignOffer: handleAssignOffer,
      onCompleteTask: handleCompleteTask,
      onPayTask: handlePayTask,
      onDeleteTask: handleDeleteTask,
      onUnassignTask: handleUnassignTask,
      onChatWithWorker: async (userId?: string) => {
        if (!user || !userId) return;
        try {
          const { getOrCreateConversation } = await import("@/lib/chat");
          const conversationId = await getOrCreateConversation(user.id, userId);
          router.push(`/chat/${conversationId}`);
        } catch (error) {
          console.error("Failed to start chat", error);
          alert("Failed to start chat. Please try again.");
        }
      },
    },
    isOwner: isEmployer && isMyTask,
    isAssigned: assignedWorker,
  };
}

