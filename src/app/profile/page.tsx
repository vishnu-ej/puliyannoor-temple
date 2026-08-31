'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
} from 'lucide-react';

interface VazhipaduBookingItem {
  id: string;
  receiptNumber: string;
  vazhipadName: string;
  devoteeName: string;
  star: string;
  bookingDate: string;
  offeringDate: string;
  deity: string;
  amount: number;
  status: 'Confirmed' | 'Performed' | 'Scheduled';
}

function ProfileContent() {
  const { currentUser, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const { chats, createDevoteeInquiryChat } = useContent();
  const { language } = useLanguage();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get('tab') as 'details' | 'bookings' | 'chat') || 'details';
  const [activeTab, setActiveTab] = useState<'details' | 'bookings' | 'chat'>(initialTab);

  // Edit Profile State (Only Name, Mob, and Email are editable)
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Print Receipt Modal State
  const [isPrintReceiptModalOpen, setIsPrintReceiptModalOpen] = useState(false);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<VazhipaduBookingItem | null>(null);

  // Chat State
  const [chatMessageText, setChatMessageText] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditEmail(currentUser.email);
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

  // Only Name, Mob, and Email can be edited by devotee
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
    });
    setIsEditing(false);
    showToast('Name, Phone & Email updated successfully!');
  };

  // Sample Devotee Bookings List with separate Vazhipad, Devotee Name & Star, Booking Date, Offering Date
  const devoteeBookings: VazhipaduBookingItem[] = [
    {
      id: 'bk_1',
      receiptNumber: 'PLY-REC-2026-0814',
      vazhipadName: 'Dhara (ധാര)',
      devoteeName: currentUser?.name || 'Suresh Kumar',
      star: currentUser?.star || 'Thiruvathira (തിരുവാതിര)',
      bookingDate: '24 Aug 2026',
      offeringDate: '15 Sep 2026 (Pradosham)',
      deity: 'Sree Mahadeva',
      amount: 150,
      status: 'Confirmed',
    },
    {
      id: 'bk_2',
      receiptNumber: 'PLY-REC-2026-0815',
      vazhipadName: 'Mrithyunjaya Homam (മൃത്യുഞ്ജയ ഹോമം)',
      devoteeName: currentUser?.name || 'Suresh Kumar',
      star: currentUser?.star || 'Thiruvathira (തിരുവാതിര)',
      bookingDate: '24 Aug 2026',
      offeringDate: '15 Sep 2026 (Pradosham)',
      deity: 'Sree Mahadeva',
      amount: 200,
      status: 'Confirmed',
    },
    {
      id: 'bk_3',
      receiptNumber: 'PLY-REC-2026-0816',
      vazhipadName: 'Neyyvilakku & Ganapathi Homam',
      devoteeName: currentUser?.name || 'Suresh Kumar',
      star: currentUser?.star || 'Thiruvathira (തിരുവാതിര)',
      bookingDate: '24 Aug 2026',
      offeringDate: '15 Sep 2026 (Pradosham)',
      deity: 'Sree Ganapathi',
      amount: 100,
      status: 'Confirmed',
    },
  ];

  const grandTotalAmount = devoteeBookings.reduce((sum, item) => sum + item.amount, 0);

  // Find devotee's active conversation thread from ContentContext
  // Normalized match with 21-day auto expiry filter
  const userPhoneDigits = currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '';
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
            <span>My Vazhipadu Bookings</span>
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
        {/* TAB 1: PROFILE DETAILS (Only Name, Mob, and Email are Editable) */}
        {/* ================================================================= */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D5AE] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-4">
              <div>
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#38050E]">
                  Personal & Ritual Information
                </h3>
                <p className="text-xs text-[#5A382A]">
                  Devotees can update Name, Mobile Number, and Email. Ritual Star, DOB, and Place are locked for temple records.
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
                  <div className="sm:col-span-2">
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

                  {/* 4. Date of Birth (FADED OUT & NON-EDITABLE) */}
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

                  {/* 5. Place / City (FADED OUT & NON-EDITABLE) */}
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

                  {/* 6. Birth Star (FADED OUT & NON-EDITABLE) */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-cinzel">
                        Birth Star (ജന്മനക്ഷത്രം - Nakshatram)
                      </label>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked Ritual Star
                      </span>
                    </div>
                    <input
                      type="text"
                      value={currentUser.star || 'Ashwathi (അശ്വതി)'}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100/70 text-sm text-gray-400 cursor-not-allowed select-none opacity-50 font-medium"
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
        {/* TAB 2: MY VAZHIPADU BOOKINGS & UNIFIED RECEIPT PRINT */}
        {/* ================================================================= */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D5AE] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4D5AE] pb-4">
              <div>
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#38050E]">
                  Pooja & Vazhipadu Bookings
                </h3>
                <p className="text-xs text-[#5A382A]">
                  Consolidated ritual bookings showing Vazhipad, Devotee Name & Star, Booking Date, and Offering Date.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBookingForReceipt(null);
                    setIsPrintReceiptModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#E6BE65]" />
                  <span>Print Single Receipt</span>
                </button>

                <Link
                  href="/offerings"
                  className="px-3.5 py-2 rounded-xl bg-[#FAF5E8] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold flex items-center gap-1 border border-[#E4D5AE] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
                  <span>Book More</span>
                </Link>
              </div>
            </div>

            {/* Itemized Bookings List with separate fields */}
            <div className="space-y-4">
              {devoteeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 rounded-2xl bg-[#FAF5E8]/30 border border-[#E4D5AE] hover:border-[#C99738] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Booking Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    {/* 1. Vazhipad */}
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-0.5">
                        Vazhipad (Offering)
                      </span>
                      <h4 className="font-cinzel font-bold text-sm text-[#38050E]">
                        {booking.vazhipadName}
                      </h4>
                      <span className="text-[11px] text-[#5A382A]">Deity: {booking.deity}</span>
                    </div>

                    {/* 2. Devotee Name & Star */}
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-0.5">
                        Devotee & Birth Star
                      </span>
                      <span className="font-bold text-xs text-[#38050E] block">{booking.devoteeName}</span>
                      <span className="text-[11px] text-[#610C1B] font-semibold">{booking.star}</span>
                    </div>

                    {/* 3. Booking Date */}
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

                    {/* 4. Offering Date */}
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#8C6219] mb-0.5">
                        Offering Date (പൂജാ തീയതി)
                      </span>
                      <span className="text-xs font-bold text-[#1F4E34] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#1F4E34]" />
                        {booking.offeringDate}
                      </span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#1F4E34]/15 text-[#1F4E34] text-[9px] font-bold">
                        ✓ {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Rate & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#E4D5AE]/60 flex-shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#8C6219] uppercase block font-semibold">Amount</span>
                      <span className="font-mono font-bold text-sm text-[#610C1B]">₹{booking.amount}.00</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingForReceipt(booking);
                        setIsPrintReceiptModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E4D5AE] hover:bg-[#FAF5E8] text-xs font-bold text-[#610C1B] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Consolidated Summary Strip */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5E8] to-[#F3EBD7] border border-[#E4D5AE] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#5A382A]">
                Total <strong>{devoteeBookings.length} Vazhipadu Offerings</strong> scheduled for <strong>{currentUser.name}</strong>.
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#8C6219] font-bold">
                  Consolidated Total: <span className="font-mono text-[#610C1B] text-sm font-extrabold">₹{grandTotalAmount}.00</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBookingForReceipt(null);
                    setIsPrintReceiptModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#E6BE65]" />
                  <span>Print Single Receipt</span>
                </button>
              </div>
            </div>
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
        {/* SINGLE CONSOLIDATED OFFICIAL RECEIPT PRINT MODAL */}
        {/* ================================================================= */}
        {isPrintReceiptModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#C99738] shadow-2xl overflow-hidden my-auto animate-scaleUp">
              {/* Modal Action Bar (Hidden on Print) */}
              <div className="p-4 bg-[#FAF5E8] border-b border-[#E4D5AE] flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#610C1B]" />
                  <span className="font-cinzel font-bold text-sm text-[#38050E]">
                    Official Devaswom Vazhipadu Receipt
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>Print (Ctrl+P)</span>
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

              {/* Printable Receipt Layout */}
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
                    OFFICIAL VAZHIPADU POOJA RECEIPT
                  </div>
                </div>

                {/* Devotee & Receipt Metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs p-3.5 rounded-xl bg-[#FAF5E8]/50 border border-[#E4D5AE]">
                  <div className="space-y-1">
                    <p>
                      <span className="text-[#8C6219] font-bold">Devotee Name:</span>{' '}
                      <strong className="text-[#38050E]">{currentUser.name}</strong>
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Birth Star (നക്ഷത്രം):</span>{' '}
                      <strong>{currentUser.star || 'Ashwathi'}</strong>
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Phone:</span> {currentUser.phone}
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Place:</span> {currentUser.place || 'Pala, Kottayam'}
                    </p>
                  </div>

                  <div className="space-y-1 text-right">
                    <p>
                      <span className="text-[#8C6219] font-bold">Receipt No:</span>{' '}
                      <strong className="font-mono text-[#610C1B]">
                        {selectedBookingForReceipt ? selectedBookingForReceipt.receiptNumber : 'PLY-REC-2026-UNIFIED'}
                      </strong>
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Booking Date:</span> 24 Aug 2026
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Payment Mode:</span> UPI / Bank Transfer (Verified)
                    </p>
                    <p>
                      <span className="text-[#8C6219] font-bold">Devaswom Seal:</span> OORANMA TRUST CERTIFIED
                    </p>
                  </div>
                </div>

                {/* Single Itemized Table for this Devotee */}
                <div className="border border-[#E4D5AE] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#1A0409] text-[#FAF5E8] font-cinzel text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Sl.</th>
                        <th className="py-2.5 px-3">Vazhipadu Name (വഴിപാട്)</th>
                        <th className="py-2.5 px-3">Offering Date (പൂജാ തീയതി)</th>
                        <th className="py-2.5 px-3">Deity (പ്രതിഷ്ഠ)</th>
                        <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4D5AE]">
                      {selectedBookingForReceipt ? (
                        <tr>
                          <td className="py-2.5 px-3 font-mono">1</td>
                          <td className="py-2.5 px-3 font-bold text-[#38050E]">{selectedBookingForReceipt.vazhipadName}</td>
                          <td className="py-2.5 px-3">{selectedBookingForReceipt.offeringDate}</td>
                          <td className="py-2.5 px-3">{selectedBookingForReceipt.deity}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">₹{selectedBookingForReceipt.amount}.00</td>
                        </tr>
                      ) : (
                        devoteeBookings.map((b, idx) => (
                          <tr key={b.id}>
                            <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-[#38050E]">{b.vazhipadName}</td>
                            <td className="py-2.5 px-3">{b.offeringDate}</td>
                            <td className="py-2.5 px-3">{b.deity}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">₹{b.amount}.00</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-[#FAF5E8] font-bold border-t-2 border-[#C99738]">
                      <tr>
                        <td colSpan={4} className="py-2.5 px-3 text-right text-xs uppercase font-cinzel text-[#8C6219]">
                          Grand Total Amount Paid:
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-sm text-[#610C1B]">
                          ₹{selectedBookingForReceipt ? selectedBookingForReceipt.amount : grandTotalAmount}.00
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer Signature & Blessings Note */}
                <div className="pt-4 flex items-end justify-between text-xs text-[#5A382A] border-t border-[#E4D5AE]/60">
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#38050E]">
                      Lord Puliyannoor Mahadeva Blessings & Prasadam
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Prasadam may be collected directly from the temple counter upon presenting this receipt.
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
