import { supabase } from './supabaseClient';

export interface DbProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  star?: string;
  dob?: string;
  place?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbBooking {
  id?: string;
  order_ref: string;
  user_id?: string;
  booked_by_email?: string;
  booked_by_phone?: string;
  devotee_name: string;
  star?: string;
  vazhipad_name: string;
  offering_id?: string;
  deity?: string;
  amount: number;
  offering_date: string;
  offering_date_iso?: string;
  booking_date: string;
  payment_status?: string;
  status?: string;
  created_at?: string;
}

export interface DbChatMessage {
  id?: string;
  user_id?: string;
  devotee_phone?: string;
  devotee_name?: string;
  sender: 'devotee' | 'admin';
  message: string;
  created_at?: string;
}

// -----------------------------------------------------------------------------------
// 1. PROFILES DATABASE OPERATIONS
// -----------------------------------------------------------------------------------
export async function getProfileFromSupabase(userId: string): Promise<DbProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Supabase getProfile note:', error.message);
      return null;
    }
    return data as DbProfile;
  } catch (err) {
    console.warn('Supabase getProfile exception:', err);
    return null;
  }
}

export async function upsertProfileInSupabase(profile: Partial<DbProfile> & { id: string }): Promise<DbProfile | null> {
  try {
    const payload = {
      ...profile,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.warn('Supabase upsertProfile note:', error.message);
      return null;
    }
    return data as DbProfile;
  } catch (err) {
    console.warn('Supabase upsertProfile exception:', err);
    return null;
  }
}

// -----------------------------------------------------------------------------------
// 2. BOOKINGS DATABASE OPERATIONS
// -----------------------------------------------------------------------------------
export async function getBookingsFromSupabase(
  userId?: string,
  userEmail?: string,
  userPhone?: string
): Promise<DbBooking[]> {
  try {
    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

    // Filter by user ID if available
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (userEmail) {
      query = query.eq('booked_by_email', userEmail);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getBookings note:', error.message);
      return [];
    }
    return (data || []) as DbBooking[];
  } catch (err) {
    console.warn('Supabase getBookings exception:', err);
    return [];
  }
}

export async function createBookingInSupabase(booking: DbBooking): Promise<DbBooking | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();

    if (error) {
      console.warn('Supabase createBooking note:', error.message);
      return null;
    }
    return data as DbBooking;
  } catch (err) {
    console.warn('Supabase createBooking exception:', err);
    return null;
  }
}

// -----------------------------------------------------------------------------------
// 3. CHAT DESK MESSAGES OPERATIONS
// -----------------------------------------------------------------------------------
export async function getChatMessagesFromSupabase(userId?: string, devoteePhone?: string): Promise<DbChatMessage[]> {
  try {
    let query = supabase.from('chat_messages').select('*').order('created_at', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (devoteePhone) {
      query = query.eq('devotee_phone', devoteePhone);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getChatMessages note:', error.message);
      return [];
    }
    return (data || []) as DbChatMessage[];
  } catch (err) {
    console.warn('Supabase getChatMessages exception:', err);
    return [];
  }
}

export async function sendChatMessageToSupabase(chatMsg: DbChatMessage): Promise<DbChatMessage | null> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([chatMsg])
      .select()
      .single();

    if (error) {
      console.warn('Supabase sendChatMessage note:', error.message);
      return null;
    }
    return data as DbChatMessage;
  } catch (err) {
    console.warn('Supabase sendChatMessage exception:', err);
    return null;
  }
}

// -----------------------------------------------------------------------------------
// 4. SUPABASE STORAGE (Avatars, Receipts, Uploads)
// -----------------------------------------------------------------------------------
export const STORAGE_BUCKET_MEDIA = 'temple-media';

/**
 * Uploads a file to Supabase Storage and returns its public URL
 */
export async function uploadFileToSupabaseStorage(
  file: File | Blob,
  path: string,
  bucket: string = STORAGE_BUCKET_MEDIA
): Promise<{ publicUrl?: string; error?: string }> {
  try {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      cacheControl: '3600',
    });

    if (uploadError) {
      console.warn('Supabase Storage upload note:', uploadError.message);
      return { error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { publicUrl: data.publicUrl };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return { error: msg };
  }
}
