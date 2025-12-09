import type { Offer } from "@/types/offers";
import type { Task } from "@/types/task";

export const getAcceptedOfferAmount = (
  task: Task | null,
  offers: Offer[]
): number => {
  if (!task || !offers.length) return task?.budget ?? 0;
  const acceptedOffer = offers.find((o) => o.is_assigned);
  return acceptedOffer?.amount ?? task.budget ?? 0;
};

export const isAssignedWorker = (
  task: Task | null,
  userId: string | undefined,
  isWorker: boolean,
  offers: Offer[]
): boolean => {
  if (!task || !userId || !isWorker) return false;
  // Check if there is an assigned offer for this task belonging to the user
  return offers.some(
    (offer) =>
      offer.task_id === task.id && offer.is_assigned && offer.user_id === userId
  );
};

