import { fetchMyTasks } from '@/lib/task';
import type { Task } from '@/types/task';
import type { UserType } from '@/types/user';
import { useQuery } from './useQuery';

export function useMyTasks(
  userId: string | null,
  userType: UserType,
  statusFilter: string = "all",
  searchQuery?: string,
  sortOption: "date" | "price" | "title" = "date"
) {
  const {
    data: tasks,
    loading,
    error,
  } = useQuery<Task[]>({
    queryFn: () => fetchMyTasks(userId!, userType!, statusFilter, searchQuery, sortOption),
    enabled: !!userId && !!userType,
    initialData: [],
  }, [userId, userType, statusFilter, searchQuery, sortOption]);

  return { tasks: tasks ?? [], loading, error };
}

