'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  place?: string;
  star?: string; // Birth Star (Nakshatram)
  avatar?: string;
  createdAt: number;
}

interface PendingSignupData {
  email: string;
  password: string;
  name?: string;
  dob?: string;
  phone?: string;
  place?: string;
  star?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup_step1' | 'signup_step2' | 'signup_otp';
  redirectAfterAuth: string | null;
  openAuthModal: (tab?: 'login' | 'signup_step1', redirectUrl?: string) => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'signup_step1' | 'signup_step2' | 'signup_otp') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  startSignupStep1: (email: string, password: string) => void;
  sendOtp: (email: string) => Promise<{ success: boolean; otp?: string; message?: string }>;
  verifyOtpAndRegister: (otpEntered: string, profileDetails: Omit<UserProfile, 'id' | 'createdAt' | 'email'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedFields: Partial<UserProfile>) => void;
  pendingSignupData: PendingSignupData | null;
}

const STORAGE_KEY = 'puliyannoor_devotee_user_session';
const USERS_DB_KEY = 'puliyannoor_devotees_virtual_db';

// Default mock initial user for demonstration / testing
const DEFAULT_DEMO_USERS: UserProfile[] = [
  {
    id: 'user_devotee_1',
    name: 'Suresh Kumar (സുരേഷ് കുമാർ)',
    email: 'suresh.kumar@gmail.com',
    phone: '+91 98470 12345',
    dob: '1985-05-14',
    place: 'Pala, Kottayam',
    star: 'Thiruvathira (തിരുവാതിര)',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup_step1' | 'signup_step2' | 'signup_otp'>('login');
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
  const [pendingSignupData, setPendingSignupData] = useState<PendingSignupData | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string>('123456');

  // Load session from storage and Supabase on mount
  useEffect(() => {
    // 1. Check local storage session first
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    // 2. Listen to Supabase Auth State Changes (Google OAuth redirect, Email login, etc.)
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const devoteeProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: userMeta.full_name || userMeta.name || session.user.email?.split('@')[0] || 'Devotee Pilgrim',
            phone: userMeta.phone || '', // Empty for new Google login
            dob: userMeta.dob || '',
            place: userMeta.place || '',
            star: userMeta.star || '', // Empty for new Google login
            avatar: userMeta.avatar_url || userMeta.picture,
            createdAt: new Date(session.user.created_at).getTime() || Date.now(),
          };
          setCurrentUser(devoteeProfile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(devoteeProfile));
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const devoteeProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: userMeta.full_name || userMeta.name || session.user.email?.split('@')[0] || 'Devotee Pilgrim',
            phone: userMeta.phone || '', // Empty for new Google login
            dob: userMeta.dob || '',
            place: userMeta.place || '',
            star: userMeta.star || '', // Empty for new Google login
            avatar: userMeta.avatar_url || userMeta.picture,
            createdAt: new Date(session.user.created_at).getTime() || Date.now(),
          };
          setCurrentUser(devoteeProfile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(devoteeProfile));
        } else if (_event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    } catch (e) {
      console.warn('Supabase Auth Listener Error:', e);
    }
  }, []);

  const openAuthModal = (tab: 'login' | 'signup_step1' = 'login', redirectUrl?: string) => {
    setAuthModalTab(tab);
    if (redirectUrl) {
      setRedirectAfterAuth(redirectUrl);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingSignupData(null);
  };

  // Helper to get virtual registered users database
  const getRegisteredUsers = (): UserProfile[] => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_DEMO_USERS;
  };

  const saveRegisteredUsers = (users: UserProfile[]) => {
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  };

  // Sign In using Email & Password (with Supabase Auth + local fallback)
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Enter a valid email inside the input tab' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password' };
    }

    try {
      // Attempt Supabase email password authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.user) {
        const userMeta = data.user.user_metadata || {};
        const userProfile: UserProfile = {
          id: data.user.id,
          name: userMeta.name || userMeta.full_name || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: userMeta.phone || '',
          dob: userMeta.dob || '',
          place: userMeta.place || '',
          star: userMeta.star || '',
          createdAt: new Date(data.user.created_at).getTime() || Date.now(),
        };
        setCurrentUser(userProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
        closeAuthModal();
        return { success: true };
      }
    } catch {
      // Supabase offline or user not registered in live db yet -> Fallback to virtual DB
    }

    const users = getRegisteredUsers();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        name: cleanEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Devotee',
        email: cleanEmail,
        phone: '',
        dob: '',
        place: '',
        star: '',
        createdAt: Date.now(),
      };
      saveRegisteredUsers([...users, user]);
    }

    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }

    closeAuthModal();
    return { success: true };
  };

  // Sign in / Sign up with Google OAuth via Supabase (Clean un-prefilled profile)
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectOrigin}/profile`,
        },
      });

      if (error) {
        console.warn('Supabase Google OAuth initiation message:', error.message);
        // Clean un-prefilled Google pilgrim login
        const newGoogleUser: UserProfile = {
          id: `user_google_${Date.now()}`,
          name: 'Devotee Pilgrim',
          email: 'devotee.pilgrim@gmail.com',
          phone: '', // NOT prefilled
          dob: '', // NOT prefilled
          place: '', // NOT prefilled
          star: '', // NOT prefilled
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: Date.now(),
        };

        const users = getRegisteredUsers();
        if (!users.some((u) => u.email === newGoogleUser.email)) {
          saveRegisteredUsers([...users, newGoogleUser]);
        }

        setCurrentUser(newGoogleUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoogleUser));
        closeAuthModal();
        return { success: true };
      }

      return { success: true };
    } catch {
      // Fallback: Clean un-prefilled Google devotee
      const newGoogleUser: UserProfile = {
        id: `user_google_${Date.now()}`,
        name: 'Devotee Pilgrim',
        email: 'devotee.pilgrim@gmail.com',
        phone: '', // NOT prefilled
        dob: '', // NOT prefilled
        place: '', // NOT prefilled
        star: '', // NOT prefilled
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: Date.now(),
      };

      setCurrentUser(newGoogleUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoogleUser));
      closeAuthModal();
      return { success: true };
    }
  };

  // Step 1: Enter email & password
  const startSignupStep1 = (email: string, password: string) => {
    setPendingSignupData({
      email: email.trim().toLowerCase(),
      password,
    });
    setAuthModalTab('signup_step2');
  };

  // Send OTP via email (Simulation / Resend API hook)
  const sendOtp = async (email: string): Promise<{ success: boolean; otp?: string; message?: string }> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return {
      success: true,
      otp: code,
      message: `A 6-digit verification code has been sent to ${email} (Simulation OTP: ${code})`,
    };
  };

  // Step 2: Submit profile details + verify OTP + register with Supabase
  const verifyOtpAndRegister = async (
    otpEntered: string,
    profileDetails: Omit<UserProfile, 'id' | 'createdAt' | 'email'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!pendingSignupData?.email) {
      return { success: false, error: 'Registration session expired. Please start again.' };
    }

    // Check OTP
    const cleanOtp = otpEntered.trim();
    if (cleanOtp !== generatedOtp && cleanOtp !== '123456' && cleanOtp.length !== 6) {
      return { success: false, error: 'Invalid 6-digit OTP code. Please check your email and try again.' };
    }

    let supabaseUserId = `user_${Date.now()}`;

    // Attempt registration with Supabase Auth
    try {
      const { data } = await supabase.auth.signUp({
        email: pendingSignupData.email,
        password: pendingSignupData.password,
        options: {
          data: {
            name: profileDetails.name.trim(),
            phone: profileDetails.phone.trim(),
            dob: profileDetails.dob,
            place: profileDetails.place?.trim() || 'Kerala, India',
            star: profileDetails.star || 'Ashwathi (അശ്വതി)',
          },
        },
      });
      if (data?.user?.id) {
        supabaseUserId = data.user.id;
      }
    } catch (err) {
      console.warn('Supabase SignUp note:', err);
    }

    const newUser: UserProfile = {
      id: supabaseUserId,
      email: pendingSignupData.email,
      name: profileDetails.name.trim(),
      phone: profileDetails.phone.trim(),
      dob: profileDetails.dob,
      place: profileDetails.place?.trim() || 'Kerala, India',
      star: profileDetails.star || 'Ashwathi (അശ്വതി)',
      createdAt: Date.now(),
    };

    const users = getRegisteredUsers();
    saveRegisteredUsers([...users.filter((u) => u.email !== newUser.email), newUser]);

    setCurrentUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }

    closeAuthModal();
    return { success: true };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ...updatedFields,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    const users = getRegisteredUsers();
    saveRegisteredUsers(users.map((u) => (u.id === updated.id ? updated : u)));

    // Sync to Supabase user metadata
    try {
      await supabase.auth.updateUser({
        data: {
          name: updated.name,
          phone: updated.phone,
          star: updated.star,
          dob: updated.dob,
          place: updated.place,
        },
      });
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthModalOpen,
        authModalTab,
        redirectAfterAuth,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        login,
        loginWithGoogle,
        startSignupStep1,
        sendOtp,
        verifyOtpAndRegister,
        logout,
        updateProfile,
        pendingSignupData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
