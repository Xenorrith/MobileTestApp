import { supabase } from '@/lib/supabaseClient';
import type { UserType } from '@/types/user';

export async function signUpWithEmail(options: {
  email: string;
  password: string;
  userType: UserType;
  name: string;
}) {
  const { email, password, userType, name } = options;

  const { data } = await supabase.auth.signUp({
    email,
    password,
  });

  const { error } = await supabase.from('profile').insert([
    { id: data?.user?.id, role: userType, name }
  ])

  if (error) throw error;
  return data;
}

export async function signInWithEmail(options: { email: string; password: string }) {
  const { email, password } = options;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
