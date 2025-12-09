export type UserType = 'worker' | 'employeer';

export interface Profile {
    name: string | null;
    role: UserType | null;
    avatar_url: string | null;
}

export interface AuthUser {
    id: string;
    email: string | null;
    profile: Profile | null;
    createdAt: string | null;
}