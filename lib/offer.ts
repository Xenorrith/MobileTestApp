import { supabase } from "@/lib/supabaseClient";
import type { Offer } from "@/types/offers";

export async function createOffer(options: { taskId: number; userId: string; amount: number }) {
  const { taskId, userId, amount } = options;

  const { data, error } = await supabase
    .from("offers")
    .insert({ task_id: taskId, user_id: userId, amount })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Offer;
}

export async function assignOffer(taskId: number, offerId: number) {
  const { data } = await supabase
    .from('task')
    .update({ status: 'Assigned' })
    .eq('id', taskId)
    .select()
    .single();

  const { error } = await supabase
    .from('offers')
    .update({ is_assigned: true })
    .eq('id', offerId);

  if (error) {
    throw error;
  }

  return data;
}

export async function completeTask(taskId: number) {
  const { data, error } = await supabase
    .from('task')
    .update({ status: 'Applied' })
    .eq('id', taskId)
    .select('*')
    .single()

  if (error) {
    throw error;
  }

  return data;
}

export async function payTask(taskId: number) {
  const { data, error } = await supabase
    .from('task')
    .update({ status: 'Completed', is_payed: true })
    .eq('id', taskId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}




