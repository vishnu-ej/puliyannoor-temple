'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { MuralDivider } from '../../components/MuralDivider';
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
  Users,
  CreditCard,
  Filter,
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
  devoteeName: string; // Devotee for this particular pooja (can be self, spouse, child, etc.)
  star: string;
  bookedByUserId?: string; // User profile account ID who made the booking
  bookedByEmail?: string;
  bookedByPhone?: string;
  bookingDate: string;
  offeringDate: string;
  offeringDateIso?: string; // YYYY-MM-DD for date range filtering
  deity: string;
  paymentStatus: 'completed' | 'pending' | 'failed'; // Strictly 'completed' only
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

// Master Bookings Database in Virtual Store (Profile-mapped)
const ALL_TEMPLE_BOOKINGS: RawVazhipaduRecord[] = [
  // User Profile 1 (Suresh Kumar - id: user_devotee_1 / suresh.kumar@gmail.com / +91 98470 12345)
  // Devotee 1: Self
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
  // Devotee 2: Spouse (Different devotee name, booked under Suresh's profile)
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
  // Devotee 3: Child (Different devotee name, booked under Suresh's profile)
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
  // Another date booking under Suresh's profile for monthly pradosham
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

  // User Profile 2 (Google Pilgrim - Phone: +91 94470 56789)
  {
    id: 'bk_6',
    orderId: 'ORD-2026-0820',
    receiptNumber: 'PLY-REC-2026-0820',
    offeringId: 'oru_divasathe_pooja',
    fallbackName: 'Oru Divasathe Pooja (ഒരു ദിവസത്തെ പൂജ)',
    fallbackPrice: 1500,
    devoteeName: 'Devotee Pilgrim (ഭക്തൻ)',
    star: 'Rohini (രോഹിണി)',
    bookedByEmail: 'devotee.pilgrim@gmail.com',
    bookedByPhone: '+91 94470 56789',
    bookingDate: '26 Aug 2026',
    offeringDate: '18 Sep 2026',
    offeringDateIso: '2026-09-18',
    deity: 'Sree Mahadeva',
    paymentStatus: 'completed',
    status: 'Confirmed',
  },

  // Unpaid record (Should NOT show as payment is pending)
  {
    id: 'bk_7',
    orderId: 'ORD-2026-0899',
    receiptNumber: 'PLY-REC-2026-PENDING',
    offeringId: 'udayasthamana_pooja',
    fallbackName: 'Udayasthamana Pooja',
    fallbackPrice: 60000,
    devoteeName: 'Unpaid Inquirer',
    star: 'Aswathi',
    bookedByUserId: 'user_devotee_1',
    bookedByEmail: 'suresh.kumar@gmail.com',
    bookingDate: '28 Aug 2026',
    offeringDate: '10 Jan 2027',
    offeringDateIso: '2027-01-10',
    deity: 'Sree Mahadeva',
    paymentStatus: 'pending',
    status: 'Scheduled',
  },
];

function ProfileContent() {
  const { currentUser, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const { offerings, chats, createDevoteeInquiryChat } = useContent();
  const { language } = useLanguage();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get('tab') as 'details' | 'bookings' | 'chat') || 'details';
  const [activeTab, setActiveTab] = useState<'details' | 'bookings' | 'chat'>(initialTab);

  // Edit Profile State (Name, Mob, Email, and Birth Star are editable)
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStar, setEditStar] = useState('Ashwathi (അശ്വതി)');
  const [toastMsg, setToastMsg] = useState('');

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

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditEmail(currentUser.email);
      setEditStar(currentUser.star || 'Ashwathi (അശ്വതി)');
    }
  }, [currentUser]);

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

  // Devotee can edit: Name, Mobile, Email, and Birth Star (DOB & Place remain locked)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim() || !editEmail.trim()) {
      showToast('Please fill in Name, Phone, and Email');
      return;
    }

    updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      star: editStar,
    });
    setIsEditing(false);
    showToast('Profile information updated successfully!');
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
  // PROFILE MAPPING: Show bookings paid & booked under this devotee profile account
  // -----------------------------------------------------------------------------------
  const userPhoneDigits = currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '';

  const allProfileBookings: VazhipaduBookingItem[] = useMemo(() => {
    if (!currentUser) return [];

    const matchedRaw = ALL_TEMPLE_BOOKINGS.filter((booking) => {
      // Must be payment completed
      if (booking.paymentStatus !== 'completed' || booking.status !== 'Confirmed') {
        return false;
      }

      // Profile Mapping: Check if booked using this user profile (by profile ID, email, or phone)
      const matchesProfileId = booking.bookedByUserId && (booking.bookedByUserId === currentUser.id || currentUser.id === 'user_devotee_1');
      const matchesEmail = booking.bookedByEmail && booking.bookedByEmail.toLowerCase() === currentUser.email.toLowerCase();
      const bookingPhoneDigits = (booking.bookedByPhone || '').replace(/\D/g, '').slice(-10);
      const matchesPhone = userPhoneDigits && bookingPhoneDigits === userPhoneDigits;

      return matchesProfileId || matchesEmail || matchesPhone;
    });

    return matchedRaw.map((item) => {
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
  }, [currentUser, offerings, language]);

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

  // Find devotee's active conversation thread from ContentContext
  const now = Date.now();
  const TWENTY_ONE_DAYS_MS = 21 * 24 * 60 * 60 * 1000;

  const userChatThread = chats.find((c) => {
    if (!c.devoteePhone || !userPhoneDigits) return false;
    const chatDigits = c.devoteePhone.replace(/\D/g, '').slice(-10);
    return chatDigits === userPhoneDigits;
  });

  // Filter messages older than 21 days
  const activeMessages = (userChatThread?.messages || []).filter((msg) => {
    const msgTime = msg.createdAt || now;
    return now - msgTime <= TWENTY_ONE_DAYS_MS;
  });

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !currentUser) return;

    createDevoteeInquiryChat(
      currentUser.name,
      currentUser.phone,
      'Direct Devotee Chat Desk',
      chatMessageText.trim(),
      currentUser.star
    );

    setChatMessageText('');
    showToast('Message sent to Devaswom Admin Desk');
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

        {/* Profile Top Banner Card */}
        <div className="bg-gradient-to-r from-[#1A0409] via-[#38050E] to-[#610C1B] rounded-3xl p-6 sm:p-8 text-[#FAF5E8] shadow-xl border border-[#C99738]/40 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none text-9xl font-cinzel text-[#E6BE65]">
            ॐ
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Avatar Ring */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#610C1B] to-[#1A0409] border-3 border-[#C99738] shadow-lg flex items-center justify-center text-[#E6BE65] font-cinzel font-bold text-2xl sm:text-3xl flex-shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'ॐ'}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF5E8]/10 text-[#E6BE65] text-xs font-bold mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Devotee Pilgrim Account</span>
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
                    {currentUser.phone}
                  </span>
                  {currentUser.star && (
                    <>
                      <span>•</span>
                      <span className="text-[#E6BE65] font-semibold">
                        ★ {currentUser.star}
                      </span>
                    </>
                  )}
                </p>
                {currentUser.place && (
                  <p className="text-xs text-[#FAF5E8]/70 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3 h-3 text-[#C99738]" />
                    {currentUser.place}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF5E8] hover:text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 text-[#E6BE65]" />
              <span>Sign Out</span>
            </button>
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
            {userChatThread?.unread && (
              <span className="w-2 h-2 rounded-full bg-[#610C1B] animate-pulse" />
            )}
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: PROFILE DETAILS (Name, Mob, Email, and Star are Editable) */}
        {/* ================================================================= */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D5AE] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-4">
              <div>
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#38050E]">
                  Personal & Ritual Information
                </h3>
                <p className="text-xs text-[#5A382A]">
                  Devotees can edit Name, Mobile Number, Email, and Birth Star. DOB and Place are locked for temple records.
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
                  {/* 1. Full Name (EDITABLE) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                      Full Name * <span className="text-[10px] text-emerald-700 font-normal lowercase">(editable)</span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] font-medium"
                      required
                    />
                  </div>

                  {/* 2. Contact Phone (EDITABLE) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                      Contact Phone * <span className="text-[10px] text-emerald-700 font-normal lowercase">(editable)</span>
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] font-mono focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>

                  {/* 3. Primary Email (EDITABLE) */}
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

                  {/* 4. Birth Star (EDITABLE) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                      Birth Star (ജന്മനക്ഷത്രം) * <span className="text-[10px] text-emerald-700 font-normal lowercase">(editable)</span>
                    </label>
                    <select
                      value={editStar}
                      onChange={(e) => setEditStar(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] cursor-pointer font-medium"
                    >
                      {NAKSHATRAMS.map((star) => (
                        <option key={star} value={star}>
                          {star}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Date of Birth (FADED OUT & NON-EDITABLE) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-cinzel">
                        Date of Birth (DOB)
                      </label>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Non-editable
                      </span>
                    </div>
                    <input
                      type="text"
                      value={currentUser.dob || 'Not provided'}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100/70 text-sm text-gray-400 cursor-not-allowed select-none opacity-50"
                    />
                  </div>

                  {/* 6. Place / City (FADED OUT & NON-EDITABLE) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-cinzel">
                        Place / City
                      </label>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Non-editable
                      </span>
                    </div>
                    <input
                      type="text"
                      value={currentUser.place || 'Kerala, India'}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100/70 text-sm text-gray-400 cursor-not-allowed select-none opacity-50"
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
                    <span>Save Changes</span>
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
                  <span className="font-mono font-bold text-[#38050E]">{currentUser.phone}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Birth Star (നക്ഷത്രം)
                  </span>
                  <span className="font-bold text-[#610C1B]">{currentUser.star || 'Not specified'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Place / Residence
                  </span>
                  <span className="font-medium text-[#38050E]">{currentUser.place || 'Kerala, India'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                  <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-1">
                    Date of Birth
                  </span>
                  <span className="font-medium text-[#38050E]">{currentUser.dob || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MY VAZHIPADU BOOKINGS (PROFILE MAPPED + SINGLE/RANGE DATE PDF) */}
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

            {/* Date Filtering Bar (Single Date or Date Range Selection) */}
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

            {/* Empty State if No Bookings Found */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 px-4 bg-[#FAF5E8]/30 rounded-3xl border-2 border-dashed border-[#E4D5AE] space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#610C1B]/10 text-[#610C1B] flex items-center justify-center mx-auto shadow-xs">
                  <Flame className="w-8 h-8 text-[#C99738]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-cinzel font-bold text-base text-[#38050E]">
                    No Bookings Found for Selected Date Criteria
                  </h4>
                  <p className="text-xs text-[#5A382A] max-w-md mx-auto leading-relaxed">
                    No confirmed vazhipadu offerings match your current date selection. You can reset date filters or explore new offerings.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setDateFilterMode('all');
                      setSelectedSingleDate('ALL');
                      setDateRangeFrom('');
                      setDateRangeTo('');
                    }}
                    className="px-4 py-2 rounded-xl bg-white border border-[#E4D5AE] text-xs font-bold text-[#5A382A] hover:bg-[#FAF5E8] cursor-pointer"
                  >
                    Reset Date Filters
                  </button>
                  <Link
                    href="/offerings"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[#E6BE65]" />
                    <span>Browse Offerings</span>
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
                          <span className="text-[11px] text-[#610C1B] font-medium">Star: {data.star}</span>
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
        {/* TAB 3: DIRECT CHAT WITH TEMPLE DESK (1-on-1 Connected to Admin) */}
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
                    <span>Live Temple Administrative Channel</span>
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
                  <strong>Data Policy:</strong> Messages are securely retained for <strong>21 days</strong> for ritual correspondence and then automatically cleared.
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
                        {/* Sender Label */}
                        <div
                          className={`flex items-center justify-between gap-3 mb-1 text-[10px] font-bold ${
                            isDevotee ? 'text-white/80' : 'text-[#8C6219]'
                          }`}
                        >
                          <span>{isDevotee ? 'You' : 'Puliyannoor Devaswom Office'}</span>
                        </div>

                        {/* Quoted Reply Preview */}
                        {msg.replyTo && (
                          <div
                            className={`mb-2 p-2 rounded-lg text-[11px] ${
                              isDevotee
                                ? 'bg-black/20 border-l-4 border-[#E6BE65] text-white/90'
                                : 'bg-[#FAF5E8] border-l-4 border-[#610C1B] text-[#38050E]'
                            }`}
                          >
                            <span className="font-bold text-[10px] block opacity-90">
                              {msg.replyTo.senderName || (msg.replyTo.sender === 'admin' ? 'Devaswom Office' : 'You')}
                            </span>
                            <p className="truncate line-clamp-1">{msg.replyTo.text}</p>
                          </div>
                        )}

                        <p className="font-normal whitespace-pre-wrap">{msg.text}</p>

                        {/* Timestamp */}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                            isDevotee ? 'text-white/70' : 'text-[#8C6219]/70'
                          }`}
                        >
                          {msg.isEdited && <span className="italic text-[9px] mr-1">edited</span>}
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
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-3xl w-full border-2 border-[#C99738] shadow-2xl overflow-hidden my-auto animate-scaleUp">
              {/* Modal Top Action Bar (Hidden on Print) */}
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

              {/* Printable Multi-Devotee Structured Document */}
              <div id="printable-single-receipt" className="p-6 sm:p-8 space-y-6 text-[#2B150F] bg-white">
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
                      <span className="text-[#8C6219] font-bold">Contact Phone:</span> {currentUser.phone}
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Place / Address:</span> {currentUser.place || 'Pala, Kottayam'}
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
                    <p>
                      <span className="text-[#8C6219] font-bold">Devaswom Seal:</span> OORANMA TRUST CERTIFIED
                    </p>
                  </div>
                </div>

                {/* Separate Devotee Sections within the Single Print Document */}
                <div className="space-y-5">
                  {Object.entries(groupedByDevotee)
                    .filter(([devotee]) => selectedDevoteeFilter === 'ALL' || selectedDevoteeFilter === devotee)
                    .map(([devotee, data], devIdx) => (
                      <div key={devotee} className="border border-[#E4D5AE] rounded-xl overflow-hidden">
                        {/* Devotee Section Header */}
                        <div className="bg-[#FAF5E8] px-4 py-2 border-b border-[#E4D5AE] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#610C1B] text-[#E6BE65] font-bold text-[10px] flex items-center justify-center">
                              {devIdx + 1}
                            </span>
                            <span className="font-bold text-xs text-[#38050E]">
                              Devotee: <strong>{devotee}</strong>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-[11px] text-[#610C1B] font-semibold">
                              Birth Star: {data.star}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8C6219] font-bold">
                            Subtotal: <span className="font-mono text-[#610C1B]">₹{data.subtotal}.00</span>
                          </span>
                        </div>

                        {/* Table for this specific devotee */}
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#1A0409]/90 text-[#FAF5E8] font-cinzel text-[10px]">
                            <tr>
                              <th className="py-2 px-3 w-10">Sl.</th>
                              <th className="py-2 px-3">Vazhipad</th>
                              <th className="py-2 px-3">Offering Date</th>
                              <th className="py-2 px-3">Deity (പ്രതിഷ്ഠ)</th>
                              <th className="py-2 px-3 text-right">Rate (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4D5AE]/60 bg-white">
                            {data.items.map((item, itemIdx) => (
                              <tr key={item.id}>
                                <td className="py-2 px-3 font-mono text-gray-500">{itemIdx + 1}</td>
                                <td className="py-2 px-3 font-bold text-[#38050E]">{item.vazhipadName}</td>
                                <td className="py-2 px-3 text-[#5A382A]">{item.offeringDate}</td>
                                <td className="py-2 px-3 text-[#8C6219]">{item.deity}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-[#38050E]">
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
                <div className="p-4 rounded-xl bg-[#FAF5E8] border-2 border-[#C99738] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#8C6219] block font-cinzel">
                      Consolidated Grand Total Paid
                    </span>
                    <span className="text-xs text-[#5A382A] italic">
                      Amount in words: <strong>Rupees {numberToWords(selectedDevoteeFilter === 'ALL' ? grandTotalAmount : groupedByDevotee[selectedDevoteeFilter]?.subtotal || 0)} Only</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-lg text-[#610C1B]">
                      ₹{selectedDevoteeFilter === 'ALL' ? grandTotalAmount : groupedByDevotee[selectedDevoteeFilter]?.subtotal || 0}.00
                    </span>
                  </div>
                </div>

                {/* Footer Signature & Blessings Note */}
                <div className="pt-4 flex items-end justify-between text-xs text-[#5A382A] border-t border-[#E4D5AE]/60">
                  <div className="space-y-0.5 max-w-sm">
                    <p className="font-bold text-[#38050E]">
                      Lord Puliyannoor Sree Mahadeva Blessings & Prasadam
                    </p>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      This is an official computer-generated receipt from Puliyannoor Ooranma Temple Devaswom portal for registered account {currentUser.email}. Prasadam may be collected directly from the temple counter upon presenting this receipt.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-28 h-8 border-b border-gray-400 mx-auto mb-1 flex items-end justify-center text-[10px] text-gray-400 italic">
                      [Devaswom Seal]
                    </div>
                    <span className="text-[10px] font-bold text-[#8C6219] uppercase tracking-wider block">
                      Authorized Signatory
                    </span>
                    <span className="text-[9px] text-gray-500">Puliyannoor Ooranma Devaswom</span>
                  </div>
                </div>
              </div>
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
