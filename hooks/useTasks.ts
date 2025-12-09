import { fetchTasks } from '@/lib/task';
import type { Task } from '@/types/task';
import { useQuery } from './useQuery';

export function useTasks(
  searchQuery?: string,
  categoryIds?: number[],
  sortOption: "date" | "price" | "title" = "date"
) {
  const {
    data: tasks,
    loading,
    error,
  } = useQuery<Task[]>({
    queryFn: () => fetchTasks(searchQuery, categoryIds, sortOption),
    initialData: [],
  }, [searchQuery, categoryIds, sortOption]);

  return { tasks: tasks ?? [], loading, error };
}
