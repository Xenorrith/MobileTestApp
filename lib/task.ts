import { supabase } from '@/lib/supabaseClient';
import type { Task } from '@/types/task';

export async function fetchTasks(
  searchQuery?: string,
  categoryIds?: number[],
  sortOption: "date" | "price" | "title" = "date"
): Promise<Task[]> {
  let query = supabase.from('task').select('*').eq('status', 'Open');

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  if (categoryIds && categoryIds.length > 0) {
    query = query.in('category', categoryIds);
  }

  switch (sortOption) {
    case "price":
      query = query.order('budget', { ascending: false });
      break;
    case "title":
      query = query.order('title', { ascending: true });
      break;
    case "date":
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as Task[];
}

export async function createTask(options: {
  authorId: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  category: number;
  address?: string | null;
  startTask?: string | null;
  endTask?: string | null;
}): Promise<Task> {
  const { data, error } = await supabase
    .from('task')
    .insert({
      author_id: options.authorId,
      title: options.title,
      description: options.description,
      budget: options.budget,
      location: options.location,
      category: options.category,
      address: options.address ?? null,
      start_task: options.startTask ?? null,
      end_task: options.endTask ?? null,
      status: 'Open',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Task;
}

export async function fetchMyTasks(
  userId: string,
  userType: string | null,
  statusFilter: string = "All",
  searchQuery?: string,
  sortOption: "date" | "price" | "title" = "date"
): Promise<Task[]> {
  if (userType === 'employeer') {
    let query = supabase
      .from('task')
      .select('*, offers:offers!task_id(count)')
      .eq('author_id', userId);

    if (statusFilter !== "All") {
      query = query.eq('status', statusFilter);
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    switch (sortOption) {
      case "price":
        query = query.order('budget', { ascending: false });
        break;
      case "title":
        query = query.order('title', { ascending: true });
        break;
      case "date":
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []) as Task[];
  }
  let query = supabase
    .from('offers')
    .select("*, task_id(*)")
    .eq('user_id', userId)
    .eq('is_assigned', true);

  if (statusFilter !== "All") {
    query = query.eq('task_id.status', statusFilter);
  }

  if (searchQuery) {
    query = query.ilike('task_id.title', `%${searchQuery}%`);
  }

  switch (sortOption) {
    case "price":
      query = query.order('task_id.budget', { ascending: false });
      break;
    case "title":
      query = query.order('task_id.title', { ascending: true });
      break;
    case "date":
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data.map((offer) => offer.task_id) ?? []) as Task[];
}

export async function updateTask(taskId: number, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('task')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Task;
}

export async function deleteTask(taskId: number) {
  const { error } = await supabase
    .from('task')
    .delete()
    .eq('id', taskId);

  if (error) {
    throw error;
  }
}

export async function unassignTask(taskId: number) {
  const { data } = await supabase
    .from('task')
    .update({ status: 'Open' })
    .eq('id', taskId)
    .select()
    .single();

  const { error } = await supabase
    .from('offers')
    .update({ is_assigned: false })
    .eq('task_id', taskId);

  if (error) {
    throw error;
  }

  return data as Task;
}
