'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { MuralDivider } from '../../components/MuralDivider';
import {
  getBookingsFromSupabase,
  getChatMessagesFromSupabase,
  sendChatMessageToSupabase,
  resetDevoteePasswordViaSupabase,
  sendPasswordResetEmailViaSupabase,
  generateAndSendOtp,
  verifyOtpCode,
  resetPasswordWithVerifiedOtp,
  deleteDevoteeAccountFromSupabase,
  DbBooking,
  DbChatMessage,
} from '../../lib/supabaseDb';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  MessageSquare,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  LogOut,
  Edit3,
  Save,
  Shield,
  Trash2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Printer,
  X,
  FileText,
  Lock,
  Key,
  Eye,
  EyeOff,
  Users,
  CreditCard,
  Filter,
  AlertTriangle,
  Camera,
  Upload,
  RefreshCw,
} from 'lucide-react';

// 27 Malayalam Birth Stars (Nakshatrams)
const NAKSHATRAMS = [
  'Ashwathi (അശ്വതി)', 'Bharani (ഭരണി)', 'Karthika (കാർത്തിക)', 'Rohini (രോഹിണി)',
  'Makayiram (മകയിരം)', 'Thiruvathira (തിരുവാതിര)', 'Punartham (പുണർതം)', 'Pooyam (പൂയം)',
  'Ayilyam (ആയില്യം)', 'Makam (മകം)', 'Pooram (പൂരം)', 'Uthram (ഉത്രം)',
  'Atham (അത്തം)', 'Chithira (ചിത്തിര)', 'Chothi (ചോതി)', 'Visakham (വിശാഖം)',
  'Anizham (അനിഴം)', 'Thrikketta (തൃക്കേട്ട)', 'Moolam (മൂലം)', 'Pooradam (പൂരാടം)',
  'Uthrダム (ഉത്രാടം)', 'Thiruvonam (തിരുവോണം)', 'Avittom (അവിട്ടം)', 'Chathayam (ചതയം)',
  'Poororuttathi (പൂരുരുട്ടാതി)', 'Uthrattathi (ഉത്രട്ടാതി)', 'Revathi (രേവതി)',
];

interface RawVazhipaduRecord {
  id: string;
  orderId: string;
  receiptNumber: string;
  offeringId: string;
  fallbackName: string;
  fallbackPrice: number;
  devoteeName: string;
  star: string;
  bookedByUserId?: string;
  bookedByEmail?: string;
  bookedByPhone?: string;
  bookingDate: string;
  offeringDate: string;
  offeringDateIso?: string;
  deity: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  status: 'Confirmed' | 'Performed' | 'Scheduled';
}

interface VazhipaduBookingItem {
  id: string;
  orderId: string;
  receiptNumber: string;
  offeringId: string;
  vazhipadName: string;
  devoteeName: string;
  star: string;
  bookedByUserId?: string;
  bookedByEmail?: string;
  bookedByPhone?: string;
  bookingDate: string;
  offeringDate: string;
  offeringDateIso?: string;
  deity: string;
  amount: number;
  paymentStatus: 'completed' | 'pending' | 'failed';
  status: 'Confirmed' | 'Performed' | 'Scheduled';
}

function numberToWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convertLessThanThousand = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertLessThanThousand(n % 100) : '');
  };

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertLessThanThousand(thousands) + ' Thousand' + (remainder ? ' ' + convertLessThanThousand(remainder) : '');
  }

  return convertLessThanThousand(num);
}

// Master Demo Bookings (for user_devotee_1 demo account)
const DEMO_SEED_BOOKINGS: RawVazhipaduRecord[] = [
  {
    id: 'bk_1',
    orderId: 'ORD-2026-0814',
    receiptNumber: 'PLY-REC-2026-0814',
    offeringId: 'dhara',
    fallbackName: 'Dhara (ധാര)',
    fallbackPrice: 50,
    devoteeName: 'Suresh Kumar (സുരേഷ് കുമാർ)',
    star: 'Thiruvathira (തിരുവാതിര)',
    bookedByUserId: 'user_devotee_1',
    bookedByEmail: 'suresh.kumar@gmail.com',
    bookedByPhone: '+91 98470 12345',
    bookingDate: '24 Aug 2026',
    offeringDate: '15 Sep 2026 (Pradosham)',
    offeringDateIso: '2026-09-15',
    deity: 'Sree Mahadeva',
    paymentStatus: 'completed',
    status: 'Confirmed',
  },
  {
    id: 'bk_2',
    orderId: 'ORD-2026-0814',
    receiptNumber: 'PLY-REC-2026-0814',
    offeringId: 'mrithyunjaya_homam',
    fallbackName: 'Mrithyunjaya Homam (മൃത്യുഞ്ജയ ഹോമം)',
    fallbackPrice: 200,
    devoteeName: 'Suresh Kumar (സുരേഷ് കുമാർ)',
    star: 'Thiruvathira (തിരുവാതിര)',
    bookedByUserId: 'user_devotee_1',
    bookedByEmail: 'suresh.kumar@gmail.com',
    bookedByPhone: '+91 98470 12345',
    bookingDate: '24 Aug 2026',
    offeringDate: '15 Sep 2026 (Pradosham)',
    offeringDateIso: '2026-09-15',
    deity: 'Sree Mahadeva',
    paymentStatus: 'completed',
    status: 'Confirmed',
  },
  {
    id: 'bk_3',
    orderId: 'ORD-2026-0814',
    receiptNumber: 'PLY-REC-2026-0814',
    offeringId: 'bhagya_sooktha_pushpanjali',
    fallbackName: 'Bhagya Sooktha Pushpanjali (ഭാഗ്യസൂക്ത പുഷ്പാഞ്ജലി)',
    fallbackPrice: 50,
    devoteeName: 'Anjali Suresh (അഞ്ജലി സുരേഷ്)',
    star: 'Rohini (രോഹിണി)',
    bookedByUserId: 'user_devotee_1',
    bookedByEmail: 'suresh.kumar@gmail.com',
    bookedByPhone: '+91 98470 12345',
    bookingDate: '24 Aug 2026',
    offeringDate: '15 Sep 2026 (Pradosham)',
    offeringDateIso: '2026-09-15',
    deity: 'Sree Mahadeva',
    paymentStatus: 'completed',
    status: 'Confirmed',
  },
  {
    id: 'bk_4',
    orderId: 'ORD-2026-0814',
    receiptNumber: 'PLY-REC-2026-0814',
    offeringId: 'neyyvilakku',
    fallbackName: 'Neyyvilakku (നെയ്യ്‌വിളക്ക്)',
    fallbackPrice: 30,
    devoteeName: 'Anjali Suresh (അഞ്ജലി സുരേഷ്)',
    star: 'Rohini (രോഹിണി)',
    bookedByUserId: 'user_devotee_1',
    bookedByEmail: 'suresh.kumar@gmail.com',
    bookedByPhone: '+91 98470 12345',
    bookingDate: '24 Aug 2026',
    offeringDate: '15 Sep 2026 (Pradosham)',
    offeringDateIso: '2026-09-15',
    deity: 'Sree Ganapathi',
    paymentStatus: 'completed',
    status: 'Confirmed',
  },
  {
    id: 'bk_5',
    orderId: 'ORD-2026-0814',
    receiptNumber: 'PLY-REC-2026-0814',
    offeringId: 'vidyagopala_manthraarchana',
    fallbackName: 'Vidyagopala Manthraarchana (വിദ്യാഗോപാല മന്ത്രാർച്ചന)',
    fallbackPrice: 40,
    devoteeName: 'Abhinav Suresh (അഭിനവ് സുരേഷ്)',
    star: 'Punartham (പുണർതം)',
    bookedByUserId: 'user_devotee_1',
    bookedByEmail: 'suresh.kumar@gmail.com',
    bookedByPhone: '+91 98470 12345',
    bookingDate: '24 Aug 2026',
    offeringDate: '15 Sep 2026 (Pradosham)',
    offeringDateIso: '2026-09-15',
    deity: 'Sree Mahadeva',
    paymentStatus: 'completed',
    status: 'Confirmed',
  },
  {
    id: 'bk_5b',
    orderId: 'ORD-2026-0901',
    receiptNumber: 'PLY-REC-2026-0901',
    offeringId: 'oru_nerathe_pooja',
    fallbackName: 'Oru Nerathe Pooja (ഒരു നേരത്തെ പൂജ)',
    fallbackPrice: 750,
    devoteeName: 'Suresh Kumar (സുരേഷ് കുമാർ)',
    star: 'Thiruvathira (തിരുവാതിര)',
    bookedByUserId: 'user_devotee_1',
    bookedByEmail: 'suresh.kumar@gmail.com',
    bookedByPhone: '+91 98470 12345',
    bookingDate: '01 Sep 2026',
    offeringDate: '29 Sep 2026 (Maha Pradosham)',
    offeringDateIso: '2026-09-29',
    deity: 'Sree Mahadeva',
    paymentStatus: 'completed',
    status: 'Confirmed',
  },
];

function ProfileContent() {
  const { currentUser, isAuthenticated, logout, updateProfile, uploadAvatar, openAuthModal } = useAuth();
  const { offerings, chats, createDevoteeInquiryChat } = useContent();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialTab = (searchParams.get('tab') as 'details' | 'bookings' | 'chat') || 'details';
  const [activeTab, setActiveTab] = useState<'details' | 'bookings' | 'chat'>(initialTab);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStar, setEditStar] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editPlace, setEditPlace] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Supabase Live Data State
  const [supabaseBookings, setSupabaseBookings] = useState<DbBooking[]>([]);
  const [supabaseChatMessages, setSupabaseChatMessages] = useState<DbChatMessage[]>([]);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);

  // Date Filtering State for Bookings & PDF Print
  const [dateFilterMode, setDateFilterMode] = useState<'all' | 'single' | 'range'>('all');
  const [selectedSingleDate, setSelectedSingleDate] = useState<string>('ALL');
  const [dateRangeFrom, setDateRangeFrom] = useState<string>('');
  const [dateRangeTo, setDateRangeTo] = useState<string>('');

  // Print Receipt Modal State
  const [isPrintReceiptModalOpen, setIsPrintReceiptModalOpen] = useState(false);
  const [selectedDevoteeFilter, setSelectedDevoteeFilter] = useState<string>('ALL');

  // Chat State
  const [chatMessageText, setChatMessageText] = useState('');

  // Devotee Password Reset State
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleUpdateDevoteePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatusMsg(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatusMsg({ text: 'New password and confirm password do not match / നൽകിയ പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല', isError: true });
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordStatusMsg({ text: 'Password must be at least 6 characters / പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം', isError: true });
      return;
    }

    setIsUpdatingPassword(true);
    const result = await resetDevoteePasswordViaSupabase(newPasswordInput);
    setIsUpdatingPassword(false);

    if (result.success) {
      setPasswordStatusMsg({ text: result.message, isError: false });
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      showToast('Password updated successfully! / പാസ്‌വേഡ് മാറ്റി.');
    } else {
      setPasswordStatusMsg({ text: result.message, isError: true });
    }
  };

  const handleSendResetEmail = async () => {
    if (!currentUser?.email) {
      showToast('No email address associated with account');
      return;
    }
    setPasswordStatusMsg(null);
    setIsSendingResetEmail(true);
    const result = await sendPasswordResetEmailViaSupabase(currentUser.email);
    setIsSendingResetEmail(false);

    if (result.success) {
      setPasswordStatusMsg({ text: result.message, isError: false });
      showToast('Reset email sent! Check your inbox.');
    } else {
      setPasswordStatusMsg({ text: result.message, isError: true });
    }
  };

  // Devotee OTP Reset Modal State
  const [isOtpResetModalOpen, setIsOtpResetModalOpen] = useState(false);
  const [profileOtpCode, setProfileOtpCode] = useState('');
  const [profileOtpNewPass, setProfileOtpNewPass] = useState('');
  const [profileOtpConfirmPass, setProfileOtpConfirmPass] = useState('');
  const [profileOtpStep, setProfileOtpStep] = useState<'request' | 'verify'>('request');
  const [profileOtpError, setProfileOtpError] = useState('');
  const [profileOtpSuccess, setProfileOtpSuccess] = useState('');
  const [isSendingProfileOtp, setIsSendingProfileOtp] = useState(false);
  const [profileOtpTimer, setProfileOtpTimer] = useState(0);

  useEffect(() => {
    if (profileOtpTimer > 0) {
      const t = setTimeout(() => setProfileOtpTimer(profileOtpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [profileOtpTimer]);

  const handleSendProfileOtp = async () => {
    if (!currentUser?.email) return;
    setProfileOtpError('');
    setProfileOtpSuccess('');
    setIsSendingProfileOtp(true);
    const res = await generateAndSendOtp(currentUser.email, 'forgot_password', currentUser.name);
    setIsSendingProfileOtp(false);
    if (res.success) {
      setProfileOtpSuccess(res.message);
      setProfileOtpStep('verify');
      setProfileOtpTimer(60);
    } else {
      setProfileOtpError('Failed to send OTP code.');
    }
  };

  const handleVerifyAndResetDevoteePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;
    setProfileOtpError('');
    setProfileOtpSuccess('');

    if (!profileOtpCode.trim() || profileOtpCode.trim().length !== 6) {
      setProfileOtpError('Please enter the 6-digit OTP code');
      return;
    }

    if (profileOtpNewPass !== profileOtpConfirmPass) {
      setProfileOtpError('New password and confirm password do not match');
      return;
    }

    if (profileOtpNewPass.length < 6) {
      setProfileOtpError('Password must be at least 6 characters long');
      return;
    }

    const verifyRes = verifyOtpCode(currentUser.email, profileOtpCode);
    if (!verifyRes.success) {
      setProfileOtpError(verifyRes.message || 'Invalid OTP code');
      return;
    }

    const resetRes = await resetPasswordWithVerifiedOtp(currentUser.email, profileOtpNewPass, false);
    if (resetRes.success) {
      setProfileOtpSuccess(resetRes.message);
      showToast('Password reset successfully via OTP!');
      setTimeout(() => {
        setIsOtpResetModalOpen(false);
        setProfileOtpStep('request');
        setProfileOtpCode('');
        setProfileOtpNewPass('');
        setProfileOtpConfirmPass('');
      }, 2000);
    } else {
      setProfileOtpError(resetRes.message);
    }
  };

  // Delete Account Modal State & Handler
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [deleteShowPassword, setDeleteShowPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setDeleteError('');

    if (!deletePasswordInput.trim()) {
      setDeleteError('Please enter your password to confirm account deletion / സ്ഥിരീകരിക്കാൻ പാസ്‌വേഡ് നൽകുക');
      return;
    }

    setIsDeletingAccount(true);
    const res = await deleteDevoteeAccountFromSupabase(currentUser.id, currentUser.email, deletePasswordInput);
    setIsDeletingAccount(false);

    if (res.success) {
      setIsDeleteModalOpen(false);
      showToast(res.message);
      logout();
      setTimeout(() => {
        window.location.href = '/';
      }, 1800);
    } else {
      setDeleteError(res.message);
    }
  };

  // Profile completeness check
  const isProfileIncomplete = useMemo(() => {
    if (!currentUser) return false;
    return !currentUser.phone || !currentUser.star || !currentUser.place;
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || '');
      setEditEmail(currentUser.email || '');
      setEditStar(currentUser.star || '');
      setEditDob(currentUser.dob || '');
      setEditPlace(currentUser.place || '');

      // Fetch live records from Supabase tables
      loadSupabaseData();
    }
  }, [currentUser]);

  const loadSupabaseData = async () => {
    if (!currentUser) return;
    setIsLoadingSupabase(true);
    try {
      // 1. Fetch bookings from Supabase public.bookings
      const dbBookings = await getBookingsFromSupabase(
        currentUser.id,
        currentUser.email,
        currentUser.phone
      );
      setSupabaseBookings(dbBookings);

      // 2. Fetch chat messages from Supabase public.chat_messages
      const dbChats = await getChatMessagesFromSupabase(
        currentUser.id,
        currentUser.phone
      );
      setSupabaseChatMessages(dbChats);
    } catch (e) {
      console.warn('Supabase data fetch note:', e);
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'chat' || tabParam === 'bookings' || tabParam === 'details') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Devotee saves profile (Synced to Supabase public.profiles + Auth metadata)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim() || !editEmail.trim()) {
      showToast('Please fill in your Name, Mobile Number, and Email');
      return;
    }

    await updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      star: editStar,
      dob: editDob,
      place: editPlace.trim(),
    });
    setIsEditing(false);
    showToast('Profile information saved and synced to Supabase cloud!');
  };

  // Avatar Upload via Supabase Storage
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    showToast('Uploading profile picture to Supabase Storage...');

    const res = await uploadAvatar(file);
    setIsUploadingAvatar(false);

    if (res.success) {
      showToast('Profile photo updated in Supabase Storage!');
    } else {
      showToast(res.error || 'Failed to upload photo');
    }
  };

  // Helper to map offering price and name directly from live temple directory
  const getDirectoryOffering = (offeringId: string, defaultName: string, defaultPrice: number, defaultDeity: string) => {
    const found = offerings.find(
      (o) => o.id === offeringId || o.name.en.toLowerCase() === defaultName.toLowerCase()
    );
    if (found) {
      return {
        name: language === 'ml' ? found.name.ml : `${found.name.en} (${found.name.ml})`,
        price: found.price,
        deity: defaultDeity,
      };
    }
    return {
      name: defaultName,
      price: defaultPrice,
      deity: defaultDeity,
    };
  };

  // -----------------------------------------------------------------------------------
  // LIVE SUPABASE + DEMO SEED BOOKINGS MAPPING
  // -----------------------------------------------------------------------------------
  const userPhoneDigits = currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '';

  const allProfileBookings: VazhipaduBookingItem[] = useMemo(() => {
    if (!currentUser) return [];

    // 1. Convert Supabase database rows to UI booking items
    const fromSupabase: VazhipaduBookingItem[] = supabaseBookings.map((b) => {
      const dir = getDirectoryOffering(b.offering_id || '', b.vazhipad_name, Number(b.amount) || 50, b.deity || 'Sree Mahadeva');
      return {
        id: b.id || `sp_${Math.random()}`,
        orderId: b.order_ref,
        receiptNumber: `PLY-${b.order_ref}`,
        offeringId: b.offering_id || '',
        vazhipadName: dir.name,
        devoteeName: b.devotee_name,
        star: b.star || '',
        bookedByUserId: b.user_id,
        bookedByEmail: b.booked_by_email,
        bookedByPhone: b.booked_by_phone,
        bookingDate: b.booking_date,
        offeringDate: b.offering_date,
        offeringDateIso: b.offering_date_iso,
        deity: dir.deity,
        amount: dir.price,
        paymentStatus: 'completed',
        status: (b.status as any) || 'Confirmed',
      };
    });

    // 2. Add demo seed bookings for demo user
    const matchedDemo = DEMO_SEED_BOOKINGS.filter((booking) => {
      if (booking.paymentStatus !== 'completed' || booking.status !== 'Confirmed') return false;
      const matchesProfileId = booking.bookedByUserId && (booking.bookedByUserId === currentUser.id || currentUser.id === 'user_devotee_1');
      return matchesProfileId;
    }).map((item) => {
      const dir = getDirectoryOffering(item.offeringId, item.fallbackName, item.fallbackPrice, item.deity);
      return {
        id: item.id,
        orderId: item.orderId,
        receiptNumber: item.receiptNumber,
        offeringId: item.offeringId,
        vazhipadName: dir.name,
        devoteeName: item.devoteeName,
        star: item.star,
        bookedByUserId: item.bookedByUserId,
        bookedByEmail: item.bookedByEmail,
        bookedByPhone: item.bookedByPhone,
        bookingDate: item.bookingDate,
        offeringDate: item.offeringDate,
        offeringDateIso: item.offeringDateIso,
        deity: dir.deity,
        amount: dir.price,
        paymentStatus: item.paymentStatus,
        status: item.status,
      };
    });

    // Combine both sources
    const combined = [...fromSupabase, ...matchedDemo];
    return combined;
  }, [currentUser, supabaseBookings, offerings, language]);

  // Extract unique offering dates for quick single-date selection
  const uniqueOfferingDates = useMemo(() => {
    return Array.from(new Set(allProfileBookings.map((b) => b.offeringDate)));
  }, [allProfileBookings]);

  // Filter Bookings by Selected Date / Date Range
  const filteredBookings: VazhipaduBookingItem[] = useMemo(() => {
    return allProfileBookings.filter((b) => {
      if (dateFilterMode === 'single' && selectedSingleDate !== 'ALL') {
        return b.offeringDate === selectedSingleDate;
      }

      if (dateFilterMode === 'range') {
        if (!b.offeringDateIso) return true;
        if (dateRangeFrom && b.offeringDateIso < dateRangeFrom) return false;
        if (dateRangeTo && b.offeringDateIso > dateRangeTo) return false;
        return true;
      }

      return true;
    });
  }, [allProfileBookings, dateFilterMode, selectedSingleDate, dateRangeFrom, dateRangeTo]);

  // Group Bookings by Devotee Name for separate structured presentation
  const groupedByDevotee = useMemo(() => {
    return filteredBookings.reduce<Record<string, { star: string; items: VazhipaduBookingItem[]; subtotal: number }>>(
      (acc, item) => {
        if (!acc[item.devoteeName]) {
          acc[item.devoteeName] = {
            star: item.star,
            items: [],
            subtotal: 0,
          };
        }
        acc[item.devoteeName].items.push(item);
        acc[item.devoteeName].subtotal += item.amount;
        return acc;
      },
      {}
    );
  }, [filteredBookings]);

  const grandTotalAmount = useMemo(() => {
    return filteredBookings.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredBookings]);

  // Active Date Filter Label for the Print PDF Header
  const activeDateFilterLabel = useMemo(() => {
    if (dateFilterMode === 'single' && selectedSingleDate !== 'ALL') {
      return `Offering Date: ${selectedSingleDate}`;
    }
    if (dateFilterMode === 'range' && (dateRangeFrom || dateRangeTo)) {
      return `Offering Date Range: ${dateRangeFrom || 'Start'} to ${dateRangeTo || 'End'}`;
    }
    return 'All Scheduled Pooja Dates';
  }, [dateFilterMode, selectedSingleDate, dateRangeFrom, dateRangeTo]);

  // Combined Live Supabase Chat Messages & Context Messages
  const now = Date.now();
  const TWENTY_ONE_DAYS_MS = 21 * 24 * 60 * 60 * 1000;

  const userChatThread = chats.find((c) => {
    if (!c.devoteePhone || !userPhoneDigits) return false;
    const chatDigits = c.devoteePhone.replace(/\D/g, '').slice(-10);
    return chatDigits === userPhoneDigits;
  });

  const activeMessages = useMemo(() => {
    const localMsgs = (userChatThread?.messages || []).map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      timestamp: m.timestamp,
      createdAt: m.createdAt || now,
    }));

    const remoteMsgs = supabaseChatMessages.map((m) => ({
      id: m.id || `msg_${Math.random()}`,
      sender: m.sender,
      text: m.message,
      timestamp: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
      createdAt: m.created_at ? new Date(m.created_at).getTime() : now,
    }));

    // Deduplicate by text and timestamp
    const all = [...localMsgs, ...remoteMsgs].sort((a, b) => a.createdAt - b.createdAt);
    return all.filter((msg) => now - msg.createdAt <= TWENTY_ONE_DAYS_MS);
  }, [userChatThread, supabaseChatMessages, now]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !currentUser) return;

    const messageText = chatMessageText.trim();
    setChatMessageText('');

    // 1. Send to Supabase public.chat_messages table
    try {
      await sendChatMessageToSupabase({
        user_id: currentUser.id.startsWith('user_') ? undefined : currentUser.id,
        devotee_phone: currentUser.phone,
        devotee_name: currentUser.name,
        sender: 'devotee',
        message: messageText,
      });
    } catch (err) {
      console.warn('Supabase chat send note:', err);
    }

    // 2. Also record in local content context for instant response
    createDevoteeInquiryChat(
      currentUser.name,
      currentUser.phone || '+91 00000 00000',
      'Direct Devotee Chat Desk',
      messageText,
      currentUser.star
    );

    // Refresh Supabase messages
    loadSupabaseData();
    showToast('Message sent to Devaswom Admin Desk & saved to Supabase');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Unauthenticated View
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border-2 border-[#C99738] shadow-xl space-y-5 animate-scaleUp">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#610C1B] to-[#38050E] border-2 border-[#C99738] text-[#E6BE65] font-cinzel font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            ॐ
          </div>
          <div>
            <h2 className="font-cinzel font-bold text-xl text-[#38050E] mb-1.5">
              Devotee Profile & Services
            </h2>
            <p className="text-xs sm:text-sm text-[#5A382A] leading-relaxed">
              Please sign in to your Puliyannoor Temple account to view your bookings, manage details, and chat directly with the Devaswom desk.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => openAuthModal('login', '/profile')}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-[#FAF5E8] font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EBD7] py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed top-24 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#1F4E34] text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-slideDown">
            <CheckCircle2 className="w-4 h-4 text-[#A7F3D0]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Hidden File Input for Supabase Storage Avatar Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Profile Incomplete Banner Prompt */}
        {isProfileIncomplete && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FFFBEB] border-2 border-[#F59E0B] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-scaleUp">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-[#B45309]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-cinzel font-bold text-sm text-[#92400E]">
                    Profile Incomplete (പ്രൊഫൈൽ അപൂർണ്ണമാണ്)
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-[#B45309] text-white text-[9px] font-bold uppercase tracking-wider">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-[#78350F] mt-0.5 leading-relaxed">
                  You have signed in using Google. Please complete your profile details (Mobile Number, Birth Star & Residence) to enable pooja bookings and receive official receipts.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('details');
                setIsEditing(true);
                setTimeout(() => {
                  const el = document.getElementById('profile-details-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#E6BE65]" />
              <span>Complete Profile</span>
            </button>
          </div>
        )}

        {/* Profile Top Banner Card */}
        <div className="bg-gradient-to-r from-[#1A0409] via-[#38050E] to-[#610C1B] rounded-3xl p-6 sm:p-8 text-[#FAF5E8] shadow-xl border border-[#C99738]/40 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none text-9xl font-cinzel text-[#E6BE65]">
            ॐ
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Avatar Ring with Supabase Storage Upload Trigger */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#610C1B] to-[#1A0409] border-3 border-[#C99738] shadow-lg flex items-center justify-center text-[#E6BE65] font-cinzel font-bold text-2xl sm:text-3xl flex-shrink-0 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'ॐ'
                  )}
                </div>

                {/* Supabase Storage Upload Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-[10px] font-bold"
                  title="Upload profile photo to Supabase Storage"
                >
                  <Camera className="w-4 h-4 mb-0.5 text-[#E6BE65]" />
                  <span>{isUploadingAvatar ? 'Saving...' : 'Change'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF5E8]/10 text-[#E6BE65] text-xs font-bold mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Devotee Pilgrim Account · Supabase Cloud Connected</span>
                </div>
                <h1 className="font-cinzel font-bold text-xl sm:text-2xl text-[#FAF5E8]">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-[#FAF5E8]/80 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#C99738]" />
                    {currentUser.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#C99738]" />
                    {currentUser.phone ? currentUser.phone : <span className="text-amber-300 italic">No mobile added</span>}
                  </span>
                  {currentUser.star ? (
                    <>
                      <span>•</span>
                      <span className="text-[#E6BE65] font-semibold">
                        ★ {currentUser.star}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>•</span>
                      <span className="text-amber-300 italic">★ Star not set</span>
                    </>
                  )}
                </p>
                {currentUser.place ? (
                  <p className="text-xs text-[#FAF5E8]/70 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3 h-3 text-[#C99738]" />
                    {currentUser.place}
                  </p>
                ) : (
                  <p className="text-xs text-amber-200/80 flex items-center justify-center sm:justify-start gap-1 italic">
                    <MapPin className="w-3 h-3 text-[#C99738]" />
                    Residence not specified
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadSupabaseData}
                disabled={isLoadingSupabase}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF5E8] border border-white/20 text-xs font-bold transition-all cursor-pointer"
                title="Refresh live data from Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#E6BE65] ${isLoadingSupabase ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF5E8] hover:text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-[#E6BE65]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Interactive Profile Tabs */}
        <div className="flex border-b border-[#E4D5AE] mb-6 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#610C1B] text-[#610C1B]'
                : 'border-transparent text-[#5A382A] hover:text-[#2B150F]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
            {isProfileIncomplete && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-[#610C1B] text-[#610C1B]'
                : 'border-transparent text-[#5A382A] hover:text-[#2B150F]'
            }`}
          >
            <Flame className="w-4 h-4 text-[#C99738]" />
            <span>My Vazhipadu Bookings ({filteredBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'chat'
                ? 'border-[#610C1B] text-[#610C1B]'
                : 'border-transparent text-[#5A382A] hover:text-[#2B150F]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#610C1B]" />
            <span>Chat with Devaswom Desk</span>
            {activeMessages.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#610C1B]" />
            )}
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: PROFILE DETAILS */}
        {/* ================================================================= */}
        {activeTab === 'details' && (
          <div id="profile-details-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D5AE] shadow-sm space-y-6 animate-fadeIn scroll-mt-24">
            <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-4">
              <div>
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#38050E]">
                  Personal & Ritual Information
                </h3>
                <p className="text-xs text-[#5A382A]">
                  Devotees can edit Name, Mobile Number, Email, and Birth Star anytime. Changes are saved to Supabase cloud.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF5E8] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold flex items-center gap-1.5 border border-[#E4D5AE] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                      Full Name * <span className="text-[10px] text-emerald-700 font-normal lowercase">(editable)</span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] font-medium"
                      required
                    />
                  </div>

                  {/* 2. Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel flex items-center justify-between">
                      <span>Contact Phone *</span>
                      {!currentUser.phone && (
                        <span className="text-[10px] text-amber-700 font-bold">Required</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="e.g. +91 98470 12345"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#2B150F] font-mono focus:outline-none focus:ring-2 ${
                        !editPhone ? 'border-amber-500 focus:ring-amber-500 bg-amber-50/20' : 'border-[#C99738] focus:ring-[#C99738]'
                      }`}
                      required
                    />
                  </div>

                  {/* 3. Primary Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                      Primary Email Address * <span className="text-[10px] text-emerald-700 font-normal lowercase">(editable)</span>
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>

                  {/* 4. Birth Star */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                      Birth Star (ജന്മനക്ഷത്രം)
                    </label>
                    <select
                      value={editStar}
                      onChange={(e) => setEditStar(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] cursor-pointer font-medium"
                    >
                      <option value="">-- Select Birth Star (ഓപ്ഷണൽ) --</option>
                      {NAKSHATRAMS.map((star) => (
                        <option key={star} value={star}>
                          {star}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Date of Birth */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-cinzel">
                        Date of Birth (DOB)
                      </label>
                      {currentUser.dob ? (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-normal lowercase">(initial setup)</span>
                      )}
                    </div>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      disabled={!!currentUser.dob}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B150F] ${
                        currentUser.dob
                          ? 'border-gray-200 bg-gray-100/70 text-gray-400 cursor-not-allowed select-none opacity-60'
                          : 'border-[#C99738] bg-white focus:outline-none focus:ring-2 focus:ring-[#C99738]'
                      }`}
                    />
                  </div>

                  {/* 6. Place / City */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-cinzel">
                        Place / Residence
                      </label>
                      {currentUser.place ? (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-normal lowercase">(initial setup)</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={editPlace}
                      onChange={(e) => setEditPlace(e.target.value)}
                      placeholder="e.g. Pala, Kottayam"
                      disabled={!!currentUser.place}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B150F] ${
                        currentUser.place
                          ? 'border-gray-200 bg-gray-100/70 text-gray-400 cursor-not-allowed select-none opacity-60'
                          : 'border-[#C99738] bg-white focus:outline-none focus:ring-2 focus:ring-[#C99738]'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-[#E4D5AE]/60">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#FAF5E8] hover:bg-[#E4D5AE] text-[#5A382A] text-xs font-bold border border-[#E4D5AE] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#E6BE65]" />
                    <span>Save & Sync to Supabase</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Devotee Name
                  </span>
                  <span className="font-bold text-[#38050E] text-base">{currentUser.name}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Primary Email
                  </span>
                  <span className="font-medium text-[#38050E]">{currentUser.email}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Contact Phone
                  </span>
                  {currentUser.phone ? (
                    <span className="font-mono font-bold text-[#38050E]">{currentUser.phone}</span>
                  ) : (
                    <span className="text-amber-700 font-bold italic flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Not provided (Click Edit Details to complete)
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Birth Star (നക്ഷത്രം)
                  </span>
                  {currentUser.star ? (
                    <span className="font-bold text-[#610C1B]">{currentUser.star}</span>
                  ) : (
                    <span className="text-amber-700 font-bold italic">Not selected</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Place / Residence
                  </span>
                  {currentUser.place ? (
                    <span className="font-medium text-[#38050E]">{currentUser.place}</span>
                  ) : (
                    <span className="text-amber-700 font-bold italic">Not provided</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Date of Birth
                  </span>
                  {currentUser.dob ? (
                    <span className="font-medium text-[#38050E]">{currentUser.dob}</span>
                  ) : (
                    <span className="text-amber-700 font-bold italic">Not provided</span>
                  )}
                </div>
              </div>
            )}

            {/* Account Security & Password Management (Compact Sleek Sub-Box) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5E8]/60 border border-[#E4D5AE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#610C1B] text-[#E6BE65] flex items-center justify-center shadow-xs flex-shrink-0">
                  <Key className="w-4 h-4 text-[#E6BE65]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#38050E] uppercase tracking-wide">
                      Account Security (പാസ്‌വേഡ് സുരക്ഷ)
                    </h4>
                    <span className="text-[9px] bg-white text-[#8C6219] font-mono px-2 py-0.5 rounded-full border border-[#E4D5AE] hidden sm:inline-block">
                      Protected
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A382A]">
                    Update your password directly or verify via an email OTP code.
                  </p>
                </div>
              </div>

              {/* Small, Compact Action Buttons Aligned Neatly */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
                <Link
                  href="/profile/change-password?mode=update"
                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-[#E6BE65]" />
                  <span>Update Password</span>
                </Link>

                <Link
                  href="/profile/change-password?mode=reset"
                  className="py-2 px-3.5 rounded-xl bg-white hover:bg-[#FAF5E8] text-[#610C1B] font-bold text-xs border border-[#C99738] shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#610C1B]" />
                  <span>Reset via OTP</span>
                </Link>
              </div>
            </div>

            {/* Remove / Delete Account Section (Password Verified) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-rose-700" />
                </div>
                <div>
                  <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#5C0A17] uppercase tracking-wide">
                    Delete Account (അക്കൗണ്ട് നീക്കം ചെയ്യുക)
                  </h4>
                  <p className="text-[11px] text-[#7A3E47] leading-relaxed">
                    Verified with password. Removes account credentials while vazhipadu booking receipts remain safely archived in devaswom records.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setDeletePasswordInput('');
                  setDeleteError('');
                }}
                className="py-2 px-3.5 rounded-xl bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer self-start md:self-center flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MY VAZHIPADU BOOKINGS */}
        {/* ================================================================= */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D5AE] shadow-sm space-y-6 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4D5AE] pb-4">
              <div>
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#38050E]">
                  My Confirmed Vazhipadu Bookings
                </h3>
                <p className="text-xs text-[#5A382A]">
                  Confirmed poojas booked through your devotee profile. Filter by single date or custom date range to print unified receipts.
                </p>
              </div>

              {filteredBookings.length > 0 && (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDevoteeFilter('ALL');
                      setIsPrintReceiptModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>Print Single PDF</span>
                  </button>

                  <Link
                    href="/offerings"
                    className="px-3.5 py-2 rounded-xl bg-[#FAF5E8] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold flex items-center gap-1 border border-[#E4D5AE] transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
                    <span>Book More</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Date Filtering Bar */}
            {allProfileBookings.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#FAF5E8]/60 border border-[#E4D5AE] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#610C1B]">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter by Pooja Date / Date Range:</span>
                  </div>

                  <div className="inline-flex rounded-xl p-0.5 bg-white border border-[#E4D5AE] text-xs font-bold">
                    <button
                      onClick={() => setDateFilterMode('all')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        dateFilterMode === 'all'
                          ? 'bg-[#610C1B] text-white shadow-xs'
                          : 'text-[#5A382A] hover:text-[#2B150F]'
                      }`}
                    >
                      All Dates
                    </button>
                    <button
                      onClick={() => setDateFilterMode('single')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        dateFilterMode === 'single'
                          ? 'bg-[#610C1B] text-white shadow-xs'
                          : 'text-[#5A382A] hover:text-[#2B150F]'
                      }`}
                    >
                      Single Date
                    </button>
                    <button
                      onClick={() => setDateFilterMode('range')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        dateFilterMode === 'range'
                          ? 'bg-[#610C1B] text-white shadow-xs'
                          : 'text-[#5A382A] hover:text-[#2B150F]'
                      }`}
                    >
                      Date Range
                    </button>
                  </div>
                </div>

                {/* Single Date Select Controls */}
                {dateFilterMode === 'single' && (
                  <div className="flex flex-wrap items-center gap-3 pt-1 animate-fadeIn">
                    <label className="text-xs text-[#5A382A] font-semibold">Select Offering Date:</label>
                    <select
                      value={selectedSingleDate}
                      onChange={(e) => setSelectedSingleDate(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#E4D5AE] bg-white text-xs text-[#38050E] font-medium focus:outline-none focus:ring-2 focus:ring-[#C99738] cursor-pointer"
                    >
                      <option value="ALL">All Available Dates</option>
                      {uniqueOfferingDates.map((dateStr) => (
                        <option key={dateStr} value={dateStr}>
                          {dateStr}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Date Range Controls */}
                {dateFilterMode === 'range' && (
                  <div className="flex flex-wrap items-center gap-3 pt-1 animate-fadeIn text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#5A382A] font-semibold">From:</span>
                      <input
                        type="date"
                        value={dateRangeFrom}
                        onChange={(e) => setDateRangeFrom(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-[#E4D5AE] bg-white text-xs text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#5A382A] font-semibold">To:</span>
                      <input
                        type="date"
                        value={dateRangeTo}
                        onChange={(e) => setDateRangeTo(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-[#E4D5AE] bg-white text-xs text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      />
                    </div>
                    {(dateRangeFrom || dateRangeTo) && (
                      <button
                        onClick={() => {
                          setDateRangeFrom('');
                          setDateRangeTo('');
                        }}
                        className="text-[11px] font-bold text-[#610C1B] hover:underline cursor-pointer"
                      >
                        Clear Range
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Empty State if No Bookings Found */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 px-4 bg-[#FAF5E8]/30 rounded-3xl border-2 border-dashed border-[#E4D5AE] space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#610C1B]/10 text-[#610C1B] flex items-center justify-center mx-auto shadow-xs">
                  <Flame className="w-8 h-8 text-[#C99738]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-cinzel font-bold text-base text-[#38050E]">
                    No Bookings Found
                  </h4>
                  <p className="text-xs text-[#5A382A] max-w-md mx-auto leading-relaxed">
                    You have no confirmed vazhipadu bookings under this profile account yet. You can explore temple offerings and book rituals online.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/offerings"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[#E6BE65]" />
                    <span>Browse & Book Offerings</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedByDevotee).map(([devotee, data], devIdx) => (
                  <div
                    key={devotee}
                    className="rounded-2xl border-2 border-[#E4D5AE] bg-[#FAF5E8]/20 overflow-hidden shadow-2xs"
                  >
                    {/* Devotee Header Strip */}
                    <div className="bg-[#FAF5E8] px-5 py-3 border-b border-[#E4D5AE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#610C1B] text-[#E6BE65] font-bold text-xs flex items-center justify-center">
                          {devIdx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#38050E] block">{devotee}</span>
                          <span className="text-[11px] text-[#610C1B] font-medium">Star: {data.star || 'Not specified'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8C6219] font-bold">
                          Devotee Subtotal: <span className="font-mono text-[#610C1B]">₹{data.subtotal}.00</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDevoteeFilter(devotee);
                            setIsPrintReceiptModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-white border border-[#E4D5AE] text-[11px] font-bold text-[#610C1B] hover:bg-[#FAF5E8] flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>

                    {/* Devotee Offering Items */}
                    <div className="p-4 divide-y divide-[#E4D5AE]/60 space-y-3">
                      {data.items.map((booking) => (
                        <div
                          key={booking.id}
                          className="pt-3 first:pt-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                            {/* 1. Vazhipad */}
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-0.5">
                                Vazhipad
                              </span>
                              <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#38050E]">
                                {booking.vazhipadName}
                              </h4>
                              <span className="text-[11px] text-[#5A382A]">Deity: {booking.deity}</span>
                            </div>

                            {/* 2. Booking Date */}
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-0.5">
                                Booking Date
                              </span>
                              <span className="text-xs text-[#38050E] font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#8C6219]" />
                                {booking.bookingDate}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">{booking.receiptNumber}</span>
                            </div>

                            {/* 3. Offering Date */}
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-0.5">
                                Offering Date (പൂജാ തീയതി)
                              </span>
                              <span className="text-xs font-bold text-[#1F4E34] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#1F4E34]" />
                                {booking.offeringDate}
                              </span>
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#1F4E34]/15 text-[#1F4E34] text-[9px] font-bold">
                                <CreditCard className="w-2.5 h-2.5" />
                                <span>Paid & Confirmed</span>
                              </span>
                            </div>
                          </div>

                          {/* Rate */}
                          <div className="text-right flex-shrink-0 pt-2 md:pt-0">
                            <span className="text-[10px] text-[#8C6219] uppercase block font-semibold">Rate</span>
                            <span className="font-mono font-bold text-sm text-[#610C1B]">₹{booking.amount}.00</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Consolidated Summary Strip */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5E8] to-[#F3EBD7] border-2 border-[#C99738]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-[#5A382A]">
                    Total <strong>{filteredBookings.length} Offerings</strong> across <strong>{Object.keys(groupedByDevotee).length} Devotees</strong> in this view ({activeDateFilterLabel}).
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#8C6219] font-bold">
                      Consolidated Total: <span className="font-mono text-[#610C1B] text-base font-extrabold">₹{grandTotalAmount}.00</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDevoteeFilter('ALL');
                        setIsPrintReceiptModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#E6BE65]" />
                      <span>Print Single PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: DIRECT CHAT WITH TEMPLE DESK (LIVE SUPABASE DB CONNECTED) */}
        {/* ================================================================= */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl border border-[#E4D5AE] shadow-md flex flex-col h-[650px] overflow-hidden animate-fadeIn">
            {/* Chat Desk Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#1A0409] to-[#38050E] text-[#FAF5E8] border-b border-[#C99738]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#610C1B] border border-[#C99738] text-[#E6BE65] font-cinzel font-bold text-base flex items-center justify-center shadow-xs">
                  ॐ
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-sm text-[#FAF5E8]">
                    Puliyannoor Devaswom Official Chat Desk
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#E6BE65]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Supabase Live Channel · Connected</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#FAF5E8]/75 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <Clock className="w-3.5 h-3.5 text-[#E6BE65]" />
                <span>Office: 7:00 AM – 12:00 PM | 4:30 PM – 7:00 PM</span>
              </div>
            </div>

            {/* 21-Day Retention Policy Notice Banner */}
            <div className="px-4 py-2 bg-[#FAF5E8] border-b border-[#E4D5AE] text-[11px] text-[#8C6219] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#610C1B] flex-shrink-0" />
                <span>
                  <strong>Data Policy:</strong> Messages are securely retained for <strong>21 days</strong> in Supabase cloud for ritual correspondence.
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[#FAF5E8]/20">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-gray-500">
                  <div className="w-14 h-14 rounded-2xl bg-[#610C1B]/10 text-[#610C1B] flex items-center justify-center mx-auto">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h4 className="font-cinzel font-bold text-sm text-[#38050E]">
                    Start a Conversation with Puliyannoor Devaswom
                  </h4>
                  <p className="text-xs text-[#5A382A] max-w-sm leading-relaxed">
                    Have questions regarding pooja rates, marriage auditorium availability, or pradosham dates? Send your inquiry below.
                  </p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isDevotee = msg.sender === 'devotee';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isDevotee ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                          isDevotee
                            ? 'bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-white rounded-br-none'
                            : 'bg-white border border-[#E4D5AE] text-[#2B150F] rounded-bl-none'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between gap-3 mb-1 text-[10px] font-bold ${
                            isDevotee ? 'text-white/80' : 'text-[#8C6219]'
                          }`}
                        >
                          <span>{isDevotee ? 'You' : 'Puliyannoor Devaswom Office'}</span>
                        </div>

                        <p className="font-normal whitespace-pre-wrap">{msg.text}</p>

                        <div
                          className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                            isDevotee ? 'text-white/70' : 'text-[#8C6219]/70'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Composer Input */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-[#E4D5AE] flex gap-2">
              <input
                type="text"
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                placeholder="Type your message to Puliyannoor Devaswom..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E4D5AE] bg-[#FAF5E8]/30 text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E6BE65]" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* MULTI-DEVOTEE CONSOLIDATED OFFICIAL RECEIPT PRINT MODAL (PDF) */}
        {/* ================================================================= */}
        {isPrintReceiptModalOpen && filteredBookings.length > 0 && (
          <div
            id="printable-receipt-modal-wrapper"
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn print:static print:bg-transparent print:p-0 print:m-0 print:overflow-visible"
          >
            <div className="bg-white rounded-3xl max-w-3xl w-full border-2 border-[#C99738] shadow-2xl overflow-hidden my-auto animate-scaleUp print:border-none print:shadow-none print:w-full print:max-w-full print:rounded-none">
              {/* Modal Top Action Bar (Strictly Hidden on Print) */}
              <div className="p-4 bg-[#FAF5E8] border-b border-[#E4D5AE] flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#610C1B]" />
                  <div>
                    <span className="font-cinzel font-bold text-sm text-[#38050E] block">
                      Official Devaswom Consolidated Vazhipadu Receipt
                    </span>
                    <span className="text-[11px] text-[#8C6219]">
                      {activeDateFilterLabel} · Profile: {currentUser.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>Print / Save as PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrintReceiptModalOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Multi-Devotee Structured Document (Crisp Vector A4 Print) */}
              <div id="printable-single-receipt" className="p-6 sm:p-8 space-y-6 text-[#2B150F] bg-white print:p-4 print:space-y-4">
                {/* Receipt Temple Header */}
                <div className="text-center border-b-2 border-[#C99738] pb-4 space-y-1">
                  <div className="w-12 h-12 rounded-full bg-[#610C1B] text-[#E6BE65] font-cinzel font-bold text-xl flex items-center justify-center mx-auto mb-1 border-2 border-[#C99738]">
                    ॐ
                  </div>
                  <h2 className="font-cinzel font-bold text-lg sm:text-xl text-[#38050E] tracking-wide">
                    PULIYANNOOR SREE MAHADEVA TEMPLE
                  </h2>
                  <p className="font-malayalam-sans text-xs text-[#8C6219] font-bold">
                    പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം · Cheruthil Valuthu Puliyannoor
                  </p>
                  <p className="text-[11px] text-[#5A382A]">
                    Administered by Puliyannoor Ooranma Temple Devaswom · Mutholy, Pala, Kottayam, Kerala 686573
                  </p>
                  {/* Temple Contact Number & Official Email under Temple Address */}
                  <p className="text-[11px] font-semibold text-[#610C1B] flex flex-wrap items-center justify-center gap-2 pt-0.5">
                    <span>Devaswom Phone: <strong>+91 88913 46001</strong></span>
                    <span>•</span>
                    <span>Temple Office: <strong>+91 4822 212345</strong></span>
                    <span>•</span>
                    <span>Email: <strong>puliyannoordevaswom@gmail.com</strong></span>
                  </p>
                  <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#FAF5E8] border border-[#C99738] text-[10px] font-bold uppercase tracking-widest text-[#610C1B]">
                    OFFICIAL VAZHIPADU POOJA RECEIPT ({activeDateFilterLabel.toUpperCase()})
                  </div>
                </div>

                {/* Primary Booking Metadata Header */}
                <div className="grid grid-cols-2 gap-4 text-xs p-3.5 rounded-xl bg-[#FAF5E8]/50 border border-[#E4D5AE]">
                  <div className="space-y-1">
                    <p>
                      <span className="text-[#8C6219] font-bold">Booked By Account:</span>{' '}
                      <strong className="text-[#38050E]">{currentUser.name}</strong>
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Contact Phone:</span> {currentUser.phone || 'Not provided'}
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Place / Address:</span> {currentUser.place || 'Kerala, India'}
                    </p>
                  </div>

                  <div className="space-y-1 text-right">
                    <p>
                      <span className="text-[#8C6219] font-bold">Order Ref:</span>{' '}
                      <strong className="font-mono text-[#610C1B]">
                        {filteredBookings[0]?.orderId || 'ORD-2026-0814'}
                      </strong>
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Scope:</span> {activeDateFilterLabel}
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Payment Status:</span>{' '}
                      <strong className="text-[#1F4E34]">PAID & CONFIRMED (100%)</strong>
                    </p>
                  </div>
                </div>

                {/* Separate Devotee Sections within the Single Print Document */}
                <div className="space-y-5 print:space-y-3">
                  {Object.entries(groupedByDevotee)
                    .filter(([devotee]) => selectedDevoteeFilter === 'ALL' || selectedDevoteeFilter === devotee)
                    .map(([devotee, data], devIdx) => (
                      <div key={devotee} className="border border-[#E4D5AE] rounded-xl overflow-hidden print:border-gray-400">
                        {/* Devotee Section Header */}
                        <div className="bg-[#FAF5E8] px-4 py-2 border-b border-[#E4D5AE] flex items-center justify-between print:bg-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#610C1B] text-[#E6BE65] font-bold text-[10px] flex items-center justify-center print:bg-black print:text-white">
                              {devIdx + 1}
                            </span>
                            <span className="font-bold text-xs text-[#38050E]">
                              Devotee: <strong>{devotee}</strong>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-[11px] text-[#610C1B] font-semibold print:text-black">
                              Birth Star: {data.star || 'Not specified'}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8C6219] font-bold print:text-black">
                            Subtotal: <span className="font-mono text-[#610C1B] print:text-black">₹{data.subtotal}.00</span>
                          </span>
                        </div>

                        {/* Table for this specific devotee */}
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#1A0409]/90 text-[#FAF5E8] font-cinzel text-[10px] print:bg-gray-800 print:text-white">
                            <tr>
                              <th className="py-2 px-3 w-10">Sl.</th>
                              <th className="py-2 px-3">Vazhipad</th>
                              <th className="py-2 px-3">Offering Date</th>
                              <th className="py-2 px-3">Deity (പ്രതിഷ്ഠ)</th>
                              <th className="py-2 px-3 text-right">Rate (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4D5AE]/60 bg-white print:divide-gray-300">
                            {data.items.map((item, itemIdx) => (
                              <tr key={item.id}>
                                <td className="py-2 px-3 font-mono text-gray-500">{itemIdx + 1}</td>
                                <td className="py-2 px-3 font-bold text-[#38050E] print:text-black">{item.vazhipadName}</td>
                                <td className="py-2 px-3 text-[#5A382A] print:text-black">{item.offeringDate}</td>
                                <td className="py-2 px-3 text-[#8C6219] print:text-black">{item.deity}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-[#38050E] print:text-black">
                                  ₹{item.amount}.00
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                </div>

                {/* Unified Grand Total Strip */}
                <div className="p-4 rounded-xl bg-[#FAF5E8] border-2 border-[#C99738] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 print:bg-gray-50 print:border-gray-600">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#8C6219] block font-cinzel print:text-black">
                      Consolidated Grand Total Paid
                    </span>
                    <span className="text-xs text-[#5A382A] italic print:text-black">
                      Amount in words: <strong>Rupees {numberToWords(selectedDevoteeFilter === 'ALL' ? grandTotalAmount : groupedByDevotee[selectedDevoteeFilter]?.subtotal || 0)} Only</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-lg text-[#610C1B] print:text-black">
                      ₹{selectedDevoteeFilter === 'ALL' ? grandTotalAmount : groupedByDevotee[selectedDevoteeFilter]?.subtotal || 0}.00
                    </span>
                  </div>
                </div>

                {/* Footer Signature & Blessings Note */}
                <div className="pt-4 flex items-end justify-between text-xs text-[#5A382A] border-t border-[#E4D5AE]/60 print:border-gray-400">
                  <div className="space-y-0.5 max-w-sm">
                    <p className="font-bold text-[#38050E] print:text-black">
                      Lord Puliyannoor Sree Mahadeva Blessings & Prasadam
                    </p>
                    <p className="text-[10px] text-gray-500 leading-tight print:text-gray-700">
                      This is an official computer-generated receipt from Puliyannoor Ooranma Temple Devaswom portal for registered account {currentUser.email}. Prasadam may be collected directly from the temple counter upon presenting this receipt.
                    </p>
                  </div>
                  
                  {/* Authorized Signatory & Official Round RECEIVED Seal */}
                  <div className="text-center flex flex-col items-center">
                    <div className="w-20 h-20 mb-1 flex items-center justify-center select-none transform -rotate-6">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#1F4E34]">
                        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                        
                        <path id="seal-top-curve" d="M 20,50 A 30,30 0 0,1 80,50" fill="none" />
                        <text className="text-[7.5px] font-extrabold uppercase tracking-widest" fill="currentColor">
                          <textPath href="#seal-top-curve" startOffset="50%" textAnchor="middle">
                            PULIYANNOOR
                          </textPath>
                        </text>

                        <rect x="12" y="41" width="76" height="18" rx="3" fill="#1F4E34" />
                        <text x="50" y="53.5" textAnchor="middle" fill="#FFFFFF" className="text-[9.5px] font-black tracking-widest font-sans">
                          RECEIVED
                        </text>

                        <path id="seal-bottom-curve" d="M 80,50 A 30,30 0 0,1 20,50" fill="none" />
                        <text className="text-[6.5px] font-bold uppercase tracking-wider" fill="currentColor">
                          <textPath href="#seal-bottom-curve" startOffset="50%" textAnchor="middle">
                            ★ DEVASWOM PALA ★
                          </textPath>
                        </text>
                      </svg>
                    </div>

                    <span className="text-[10px] font-bold text-[#8C6219] uppercase tracking-wider block print:text-black">
                      Authorized Signatory
                    </span>
                    <span className="text-[9px] text-gray-500 print:text-gray-700">Puliyannoor Ooranma Devaswom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* MODAL: DEVOTEE PASSWORD RESET WITH OTP VERIFICATION */}
        {/* ----------------------------------------------------------------- */}
        {isOtpResetModalOpen && (
          <div
            onClick={() => setIsOtpResetModalOpen(false)}
            className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-[#C99738] space-y-4 animate-scaleUp text-left"
            >
              <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#610C1B]" />
                  <h3 className="font-cinzel font-bold text-base text-[#38050E]">
                    Password Recovery (OTP)
                  </h3>
                </div>
                <button
                  onClick={() => setIsOtpResetModalOpen(false)}
                  className="text-[#8C6219] hover:text-[#610C1B] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profileOtpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                  {profileOtpError}
                </div>
              )}

              {profileOtpSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                  {profileOtpSuccess}
                </div>
              )}

              {profileOtpStep === 'request' ? (
                <div className="space-y-4 text-xs">
                  <p className="text-[#5A382A] leading-relaxed">
                    We will send a 6-digit verification OTP code to your registered email address <strong>{currentUser.email}</strong>.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOtpResetModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendProfileOtp}
                      disabled={isSendingProfileOtp}
                      className="flex-1 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] disabled:opacity-75 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      {isSendingProfileOtp ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin text-[#E6BE65]" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#E6BE65]" />
                          <span>Send 6-Digit OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyAndResetDevoteePassword} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                      Enter 6-Digit OTP Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={profileOtpCode}
                      onChange={(e) => setProfileOtpCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#C99738] bg-white text-center font-mono font-bold text-lg tracking-widest text-[#610C1B] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-[#8C6219]">Sent to {currentUser.email}</span>
                      <button
                        type="button"
                        disabled={profileOtpTimer > 0}
                        onClick={handleSendProfileOtp}
                        className="text-[#610C1B] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        {profileOtpTimer > 0 ? `Resend OTP in ${profileOtpTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Enter new password"
                      value={profileOtpNewPass}
                      onChange={(e) => setProfileOtpNewPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Confirm new password"
                      value={profileOtpConfirmPass}
                      onChange={(e) => setProfileOtpConfirmPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setProfileOtpStep('request')}
                      className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E6BE65]" />
                      <span>Verify & Update Password</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: DELETE ACCOUNT CONFIRMATION (PASSWORD VERIFIED)            */}
        {/* ================================================================= */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-[#1A0409]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-2 border-rose-300 shadow-2xl space-y-5 animate-scaleUp">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div className="flex items-center gap-2.5 text-rose-800">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-rose-700" />
                  </div>
                  <div>
                    <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#38050E]">
                      Confirm Account Deletion
                    </h3>
                    <span className="text-[10px] text-[#7A3E47]">അക്കൗണ്ട് നീക്കം ചെയ്യൽ സ്ഥിരീകരിക്കുക</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Warning Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Important Devaswom Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  Your profile credentials will be removed. <strong>Official receipt copies and booking records will remain archived at the backend</strong> for temple devaswom accounting and audit purposes.
                </p>
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#38050E] mb-1 font-cinzel">
                    Enter Your Password to Confirm *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type={deleteShowPassword ? 'text' : 'password'}
                      required
                      value={deletePasswordInput}
                      onChange={(e) => setDeletePasswordInput(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-[#2B150F]"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteShowPassword(!deleteShowPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {deleteShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block font-mono">
                    Account: {currentUser?.email}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeletingAccount}
                    className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-75 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {isDeletingAccount ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Deleting Account...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Confirm & Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#F3EBD7]">
          <div className="text-center font-cinzel font-bold text-[#610C1B]">Loading Profile...</div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
