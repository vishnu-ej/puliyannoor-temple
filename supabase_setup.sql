-- =====================================================================================
-- PULIYANNOOR SREE MAHADEVA TEMPLE - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bcnoxycqqycoagfcvtou/sql
-- =====================================================================================

-- 1. ADMIN USERS TABLE (Super Admin & Staff Logins)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY DEFAULT ('adm_' || gen_random_uuid()),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff_admin' CHECK (role IN ('super_admin', 'staff_admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated select/insert for admin authentication & management
CREATE POLICY "Allow public read of active admin_users" ON public.admin_users
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public update of admin_users" ON public.admin_users
  FOR UPDATE USING (true);

CREATE POLICY "Allow public insert of admin_users" ON public.admin_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete of admin_users" ON public.admin_users
  FOR DELETE USING (true);

-- Seed Initial Super Admin (PDTemple / test1209)
INSERT INTO public.admin_users (id, username, password_hash, name, email, role, is_active)
VALUES (
  'admin_root_1',
  'PDTemple',
  'test1209',
  'Puliyannoor Devaswom Super Admin',
  'puliyannoordevaswom@gmail.com',
  'super_admin',
  true
)
ON CONFLICT (username) DO UPDATE
SET password_hash = 'test1209',
    role = 'super_admin',
    is_active = true,
    email = 'puliyannoordevaswom@gmail.com';


-- 2. DEVOTEE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  country_code TEXT DEFAULT '+91',
  has_whatsapp BOOLEAN DEFAULT true,
  star TEXT,
  dob TEXT,
  place TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles access policy" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);


-- 3. BOOKINGS TABLE (Vazhipadu & Ritual Bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT ('BK_' || gen_random_uuid()),
  order_ref TEXT NOT NULL,
  user_id TEXT,
  booked_by_email TEXT,
  booked_by_phone TEXT,
  devotee_name TEXT NOT NULL,
  star TEXT,
  vazhipad_name TEXT NOT NULL,
  offering_id TEXT,
  deity TEXT DEFAULT 'Lord Shiva (Mahadeva)',
  amount NUMERIC NOT NULL DEFAULT 0,
  offering_date TEXT NOT NULL,
  offering_date_iso TEXT,
  booking_date TEXT NOT NULL DEFAULT (TO_CHAR(NOW(), 'YYYY-MM-DD')),
  payment_status TEXT DEFAULT 'Completed',
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings access policy" ON public.bookings
  FOR ALL USING (true) WITH CHECK (true);

-- Seed Sample Bookings
INSERT INTO public.bookings (id, order_ref, devotee_name, star, vazhipad_name, amount, offering_date, status)
VALUES
  ('BK-001', 'ORD-2026-0812', 'Anand Kumar', 'Thiruvathira (Ardra)', 'Pushpanjali, Dhara & Purakilvilakku', 115, 'Next Pradosham', 'Confirmed'),
  ('BK-002', 'ORD-2026-0813', 'Radhika Menoki', 'Rohini', 'Mrityunjaya Homam', 250, 'Sunday Morning', 'Pending'),
  ('BK-003', 'ORD-2026-0814', 'Unnikrishnan Namboothiri', 'Makayiram', 'Chathussatham Nivedyam', 450, '1st of Next Month', 'Confirmed')
ON CONFLICT (id) DO NOTHING;


-- 4. CHAT MESSAGES TABLE (Live Devotee & Office Chat Desk)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg_' || gen_random_uuid()),
  user_id TEXT,
  devotee_phone TEXT,
  devotee_name TEXT,
  sender TEXT NOT NULL CHECK (sender IN ('devotee', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat messages policy" ON public.chat_messages
  FOR ALL USING (true) WITH CHECK (true);


-- 5. OFFERINGS TABLE (Catalog & Pricing)
CREATE TABLE IF NOT EXISTS public.offerings (
  id TEXT PRIMARY KEY,
  sl_no INTEGER,
  name_en TEXT NOT NULL,
  name_ml TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description_en TEXT,
  description_ml TEXT,
  significance_en TEXT,
  significance_ml TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.offerings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offerings access policy" ON public.offerings
  FOR ALL USING (true) WITH CHECK (true);

-- Seed core offerings
INSERT INTO public.offerings (id, sl_no, name_en, name_ml, price, category)
VALUES
  ('off_pushpanjali', 1, 'Pushpanjali', 'പുഷ്പാഞ്ജലി', 30, 'archana_pushpanjali'),
  ('off_dhara', 2, 'Jala Dhara', 'ജലധാര', 50, 'abhishekam_dhara'),
  ('off_purakilvilakku', 3, 'Purakilvilakku', 'പുറകിൽവിളക്ക്', 35, 'vilakku_lighting'),
  ('off_mrityunjaya', 4, 'Mrityunjaya Homam', 'മൃത്യുഞ്ജയ ഹോമം', 250, 'homam_havan'),
  ('off_chathussatham', 5, 'Chathussatham Nivedyam', 'ചതുശ്ശതം നിവേദ്യം', 450, 'nivedyam_payasam')
ON CONFLICT (id) DO NOTHING;


-- 6. FESTIVALS TABLE (Events & Malayalam Calendar)
CREATE TABLE IF NOT EXISTS public.festivals (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ml TEXT NOT NULL,
  date_en TEXT,
  date_ml TEXT,
  malayalam_month_en TEXT,
  malayalam_month_ml TEXT,
  description_en TEXT,
  description_ml TEXT,
  highlight BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.festivals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Festivals access policy" ON public.festivals
  FOR ALL USING (true) WITH CHECK (true);


-- 7. TEMPLE SETTINGS TABLE (Timings, announcements & general configuration)
CREATE TABLE IF NOT EXISTS public.temple_settings (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.temple_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Temple settings access policy" ON public.temple_settings
  FOR ALL USING (true) WITH CHECK (true);
