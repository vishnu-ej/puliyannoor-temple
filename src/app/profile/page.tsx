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
} from 'lucide-react';

function ProfileContent() {
  const { currentUser, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const { chats, createDevoteeInquiryChat } = useContent();
  const { language } = useLanguage();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get('tab') as 'details' | 'bookings' | 'chat') || 'details';
  const [activeTab, setActiveTab] = useState<'details' | 'bookings' | 'chat'>(initialTab);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editPlace, setEditPlace] = useState('');
  const [editStar, setEditStar] = useState('Ashwathi (അശ്വതി)');
  const [toastMsg, setToastMsg] = useState('');

  // Chat State
  const [chatMessageText, setChatMessageText] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditDob(currentUser.dob || '');
      setEditPlace(currentUser.place || '');
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      dob: editDob || undefined,
      place: editPlace.trim(),
      star: editStar,
    });
    setIsEditing(false);
    showToast('Profile information updated successfully!');
  };

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
        {/* TAB 1: PROFILE DETAILS */}
        {/* ================================================================= */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D5AE] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-4">
              <div>
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#38050E]">
                  Personal & Ritual Information
                </h3>
                <p className="text-xs text-[#5A382A]">
                  Details used for pooja sankalpam, receipt generation, and communication.
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
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                      Contact Phone *
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                      Date of Birth (DOB)
                    </label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                      Place / City
                    </label>
                    <input
                      type="text"
                      value={editPlace}
                      onChange={(e) => setEditPlace(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                      Birth Star (ജന്മനക്ഷത്രം - Nakshatram)
                    </label>
                    <select
                      value={editStar}
                      onChange={(e) => setEditStar(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] cursor-pointer"
                    >
                      {NAKSHATRAMS.map((star) => (
                        <option key={star} value={star}>
                          {star}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
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
        {/* TAB 2: MY VAZHIPADU BOOKINGS */}
        {/* ================================================================= */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D5AE] shadow-sm space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E4D5AE] pb-4">
              <div>
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#38050E]">
                  Pooja & Vazhipadu Bookings
                </h3>
                <p className="text-xs text-[#5A382A]">
                  Track your booked vazhipadu rituals, darshan dates, and receipts.
                </p>
              </div>
              <Link
                href="/offerings"
                className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E6BE65]" />
                <span>Book New Offering</span>
              </Link>
            </div>

            {/* Demo / Sample Offering Receipt Card */}
            <div className="p-5 rounded-2xl bg-[#FAF5E8]/40 border border-[#E4D5AE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1F4E34]/15 text-[#1F4E34] text-[10px] font-bold">
                    ✓ Confirmed by Devaswom
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">Ref: PLY-VZ-2026-0814</span>
                </div>
                <h4 className="font-cinzel font-bold text-sm text-[#38050E]">
                  Dhara (ധാര) & Mrithyunjaya Homam
                </h4>
                <p className="text-xs text-[#5A382A]">
                  Deity: Sree Mahadeva · Star: {currentUser.star || 'Ashwathi'} · Date: Coming Pradosham
                </p>
              </div>

              <div className="flex items-center gap-3 sm:text-right w-full sm:w-auto justify-between sm:justify-end">
                <div>
                  <span className="text-[10px] text-[#8C6219] uppercase block font-semibold">Total Paid</span>
                  <span className="font-mono font-bold text-sm text-[#610C1B]">₹350.00</span>
                </div>
                <button
                  onClick={() => showToast('Receipt downloaded for PLY-VZ-2026-0814')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E4D5AE] text-xs font-bold text-[#5A382A] hover:bg-[#FAF5E8] transition-colors cursor-pointer"
                >
                  Download Receipt
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF5E8]/20 border border-dashed border-[#C99738]/40 text-center text-xs text-[#8C6219]">
              💡 Need custom temple poojas or auditorium booking? Switch to the <strong>Chat tab</strong> to converse directly with the Devaswom office.
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
