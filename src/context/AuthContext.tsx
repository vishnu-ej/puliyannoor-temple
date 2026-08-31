'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Default mock initial user for instant preview testing if needed
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

  // Load session from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // ignore
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

  // Helper to get virtual registered users database (Supabase readiness)
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

  // Sign In using Email & Password
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Enter a valid email inside the input tab' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password' };
    }

    const users = getRegisteredUsers();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    // If user not found in virtual DB, create a graceful devotee profile
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        name: cleanEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Devotee',
        email: cleanEmail,
        phone: '+91 98765 43210',
        dob: '1990-01-01',
        place: 'Kerala, India',
        star: 'Ashwathi (അശ്വതി)',
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

  // Sign in / Sign up with Google (Ready for Supabase OAuth integration)
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const mockGoogleUser: UserProfile = {
      id: `user_google_${Date.now()}`,
      name: 'Devotee Pilgrim (ഭക്തൻ)',
      email: 'devotee.pilgrim@gmail.com',
      phone: '+91 94470 56789',
      dob: '1992-08-20',
      place: 'Kottayam, Kerala',
      star: 'Rohini (രോഹിണി)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: Date.now(),
    };

    const users = getRegisteredUsers();
    if (!users.some((u) => u.email === mockGoogleUser.email)) {
      saveRegisteredUsers([...users, mockGoogleUser]);
    }

    setCurrentUser(mockGoogleUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGoogleUser));
    } catch {
      // ignore
    }

    closeAuthModal();
    return { success: true };
  };

  // Step 1: Enter email & password
  const startSignupStep1 = (email: string, password: string) => {
    setPendingSignupData({
      email: email.trim().toLowerCase(),
      password,
    });
    setAuthModalTab('signup_step2');
  };

  // Send OTP via email (Ready for Resend API webhook)
  const sendOtp = async (email: string): Promise<{ success: boolean; otp?: string; message?: string }> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return {
      success: true,
      otp: code,
      message: `A 6-digit verification code has been sent to ${email} (Simulation OTP: ${code})`,
    };
  };

  // Step 2: Submit profile details + verify OTP
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

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
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

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
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
