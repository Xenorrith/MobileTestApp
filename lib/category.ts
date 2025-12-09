import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/types/category";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("category").select("*").order("category", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Category[];
}

