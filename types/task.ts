import type { Offer } from "@/types/offers";
import type { Profile } from "@/types/user";

export interface Task {
    id: number;
    created_at: string;
    author_id: string;
    title: string;
    description: string;
    budget: number;
    location: string;
    address: string | null;
    category: number;
    start_task: string | null;
    end_task: string | null;
    status: TaskStatus;
    offer_id: number | null;
    is_payed: boolean;
    offers_count?: number;
    offers?: Offer[];
    profile?: Profile | null;
}

export type TaskStatus = "Assigned" | "Canceled" | "Open" | "Completed" | "Applied";