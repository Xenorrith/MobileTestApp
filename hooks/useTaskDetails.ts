import { supabase } from "@/lib/supabaseClient";
import type { Task } from "@/types/task";
import { useQuery } from "./useQuery";

export function useTaskDetails(taskId?: number) {
  const {
    data: task,
    loading,
    error,
  } = useQuery<Task | null>({
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from("task")
        .select(
          `
          *,
          profile:author_id (
            name,
            role,
            avatar_url
          )
        `
        )
        .eq("id", taskId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return (data ?? null) as Task | null;
    },
    enabled: !!taskId,
    initialData: null,
  }, [taskId]);

  return {
    task,
    loading: !!taskId ? loading : false,
    error: !!taskId ? error : "Missing task id"
  };
}

