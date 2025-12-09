import { Profile } from "./user";

export interface Offer {
    id: number;
    created_at: string;
    task_id: number;
    user_id: string;
    amount: number;
    is_assigned: boolean;
    profile: Profile | null;
}
