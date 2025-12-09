import { supabase } from '@/lib/supabaseClient';
import type { Offer } from '@/types/offers';
import { useQuery } from './useQuery';

export function useTaskOffers(taskId: number | undefined) {
  const {
    data: offers,
    loading,
    error,
  } = useQuery<Offer[]>({
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('offers')
        .select(`
          *,
          profile:user_id (
            name,
            role,
            avatar_url
          )
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      return (data ?? []) as Offer[];
    },
    enabled: !!taskId,
    initialData: [],
  }, [taskId]);

  return { offers: offers ?? [], loading, error };
}

interface UseTaskAcceptOfferResult {
  acceptedOffer: Offer | null;
  loading: boolean;
  error: string | null;
}

export function useTaskAcceptOffer(taskId: number | undefined): UseTaskAcceptOfferResult {
  const {
    data: acceptedOffer,
    loading,
    error,
  } = useQuery<Offer | null>({
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('offers')
        .select(`
          *,
          profile:user_id (
            name,
            role,
            avatar_url
          )
        `)
        .eq('task_id', taskId)
        .eq('is_assigned', true)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return (data as Offer) || null;
    },
    enabled: !!taskId,
    initialData: null,
  }, [taskId]);

  return { acceptedOffer, loading, error };
}
