import { fetchCategories } from "@/lib/category";
import type { Category } from "@/types/category";
import { useQuery } from "./useQuery";

export function useCategories() {
  const {
    data: categories,
    loading,
    error,
  } = useQuery<Category[]>({
    queryFn: fetchCategories,
    initialData: [],
  });

  return { categories: categories ?? [], loading, error };
}

