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

export interface DbAdminUser {
  id: string;
  username: string;
  password_hash?: string;
  password?: string;
  name: string;
  email: string;
  role: 'super_admin' | 'staff_admin';
  is_active: boolean;
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
// 4. TEMPLE ADMIN AUTHENTICATION & CREDENTIALS (DATABASE DRIVEN)
// -----------------------------------------------------------------------------------
const ADMIN_STORE_KEY = 'puliyannoor_db_admin_users';

// Default initial database seed record
const DEFAULT_SEED_ADMINS: DbAdminUser[] = [
  {
    id: 'admin_root_1',
    username: 'PDTemple',
    password_hash: 'test1209',
    name: 'Puliyannoor Devaswom Super Admin',
    email: 'puliyannoordevaswom@gmail.com',
    role: 'super_admin',
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
  },
];

/**
 * Verifies admin login credentials dynamically against Supabase `public.admin_users` table
 */
export async function verifyAdminCredentialsFromSupabase(
  username: string,
  passwordAttempt: string
): Promise<{ success: boolean; admin?: DbAdminUser; error?: string }> {
  const cleanUsername = username.trim();
  const cleanPassword = passwordAttempt.trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, error: 'Please enter both username and password' };
  }

  try {
    // 1. Check live Supabase public.admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('username', cleanUsername)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      const match =
        data.password_hash === cleanPassword ||
        data.password === cleanPassword ||
        data.password_hash === btoa(cleanPassword);

      if (match) {
        return {
          success: true,
          admin: {
            id: data.id,
            username: data.username,
            name: data.name || data.full_name || 'Devaswom Admin',
            email: data.email || 'puliyannoordevaswom@gmail.com',
            role: data.role || 'super_admin',
            is_active: true,
            created_at: data.created_at,
          },
        };
      } else {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
    }
  } catch (err) {
    console.warn('Supabase admin verify note:', err);
  }

  // 2. Check virtual/local admin database store (with auto-sync to Supabase)
  try {
    let localAdmins = DEFAULT_SEED_ADMINS;
    const stored = localStorage.getItem(ADMIN_STORE_KEY);
    if (stored) {
      localAdmins = JSON.parse(stored);
    }

    const matchedAdmin = localAdmins.find(
      (a) => a.username.toLowerCase() === cleanUsername.toLowerCase() && a.is_active
    );

    if (matchedAdmin) {
      if (matchedAdmin.password_hash === cleanPassword || matchedAdmin.password === cleanPassword) {
        // Attempt to lazily sync this admin into Supabase public.admin_users
        syncAdminUserToSupabase(matchedAdmin);

        return {
          success: true,
          admin: matchedAdmin,
        };
      }
    }
  } catch (e) {
    console.warn('Local admin fallback check:', e);
  }

  return { success: false, error: 'Admin username not found in database' };
}

export async function getAdminUsersFromSupabase(): Promise<DbAdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, name, email, role, is_active, created_at')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as DbAdminUser[];
    }
  } catch (err) {
    console.warn('Supabase getAdminUsers note:', err);
  }

  // Fallback to local admin database store
  try {
    const stored = localStorage.getItem(ADMIN_STORE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return DEFAULT_SEED_ADMINS;
}

export async function syncAdminUserToSupabase(adminUser: DbAdminUser): Promise<boolean> {
  try {
    const payload = {
      id: adminUser.id,
      username: adminUser.username,
      password_hash: adminUser.password_hash || adminUser.password,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      is_active: adminUser.is_active ?? true,
      created_at: adminUser.created_at || new Date().toISOString(),
    };

    const { error } = await supabase.from('admin_users').upsert(payload);
    if (error) {
      console.warn('Supabase syncAdminUser note:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase syncAdminUser exception:', e);
    return false;
  }
}

export async function deleteAdminUserFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) {
      console.warn('Supabase deleteAdminUser note:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase deleteAdminUser exception:', e);
    return false;
  }
}

// -----------------------------------------------------------------------------------
// 5. ADMIN PORTAL CONTENT SYNCHRONIZATION (Offerings, Festivals, Settings)
// -----------------------------------------------------------------------------------
export async function syncOfferingToSupabase(offering: any): Promise<boolean> {
  try {
    const payload = {
      id: offering.id,
      sl_no: offering.slNo,
      name_en: offering.name?.en || '',
      name_ml: offering.name?.ml || '',
      price: offering.price,
      category: offering.category,
      description_en: offering.description?.en || '',
      description_ml: offering.description?.ml || '',
      significance_en: offering.significance?.en || '',
      significance_ml: offering.significance?.ml || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('offerings').upsert(payload);
    if (error) {
      console.warn('Supabase syncOffering note:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase syncOffering exception:', e);
    return false;
  }
}

export async function deleteOfferingFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('offerings').delete().eq('id', id);
    if (error) {
      console.warn('Supabase deleteOffering note:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase deleteOffering exception:', e);
    return false;
  }
}

export async function syncFestivalToSupabase(festival: any): Promise<boolean> {
  try {
    const payload = {
      id: festival.id,
      name_en: festival.name?.en || '',
      name_ml: festival.name?.ml || '',
      date_en: festival.date?.en || '',
      date_ml: festival.date?.ml || '',
      malayalam_month_en: festival.malayalamMonth?.en || '',
      malayalam_month_ml: festival.malayalamMonth?.ml || '',
      description_en: festival.description?.en || '',
      description_ml: festival.description?.ml || '',
      highlight: festival.highlight || false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('festivals').upsert(payload);
    if (error) {
      console.warn('Supabase syncFestival note:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase syncFestival exception:', e);
    return false;
  }
}

export async function deleteFestivalFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('festivals').delete().eq('id', id);
    if (error) {
      console.warn('Supabase deleteFestival note:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase deleteFestival exception:', e);
    return false;
  }
}

export async function syncTempleSettingsToSupabase(key: string, value: any): Promise<boolean> {
  try {
    const payload = {
      key,
      data: value,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('temple_settings').upsert(payload);
    if (error) {
      console.warn('Supabase syncTempleSettings note:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase syncTempleSettings exception:', e);
    return false;
  }
}

export async function getTempleSettingsFromSupabase<T>(key: string): Promise<T | null> {
  try {
    const { data, error } = await supabase.from('temple_settings').select('data').eq('key', key).single();
    if (error || !data) return null;
    return data.data as T;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------------
// 6. SUPABASE STORAGE (Avatars, Receipts, Uploads)
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
