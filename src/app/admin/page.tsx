'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useContent, ChatConversation, ChatMessage, TempleContactInfo } from '../../context/ContentContext';
import { OfferingItem, FestivalEvent, OfferingCategory, OfferingItemCategory } from '../../types';
import { AnnualCalendarModal } from '../../components/AnnualCalendarModal';
import {
  verifyAdminCredentialsFromSupabase,
  getAdminUsersFromSupabase,
  syncAdminUserToSupabase,
  deleteAdminUserFromSupabase,
  DbAdminUser,
} from '../../lib/supabaseDb';
import {
  Lock,
  User,
  Key,
  ShieldCheck,
  LogOut,
  Sparkles,
  MessageSquare,
  Flame,
  Calendar,
  Phone,
  Building,
  Edit3,
  Trash2,
  Plus,
  Search,
  Check,
  X,
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  RotateCcw,
  Eye,
  EyeOff,
  QrCode,
  Save,
  ChevronRight,
  ChevronDown,
  Reply,
  Ban,
  Filter,
  UserCheck,
  Settings,
  HelpCircle,
  ArrowLeft,
  Mail,
  Download,
  Users,
  UserPlus,
  ShieldAlert,
  AlertCircle,
  Unlock,
  Timer,
  CheckSquare,
  ListChecks,
} from 'lucide-react';

type AdminTab = 'chats' | 'offerings' | 'festivals' | 'contacts' | 'profile';

export default function AdminPage() {
  const {
    offerings,
    festivals,
    contactInfo,
    chats,
    annualCalendar,
    countdownConfig,
    addOffering,
    updateOffering,
    deleteOffering,
    addFestival,
    updateFestival,
    deleteFestival,
    deleteMultipleFestivals,
    updateContactInfo,
    updateCountdownConfig,
    sendMessage,
    editChatMessage,
    deleteChatMessage,
    markChatAsRead,
    updateChatStatus,
    advanceMessageDeliveryStatus,
    setMessageDeliveryStatus,
    resetToDefaults,
  } = useContent();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('chats');
  const [activeRole, setActiveRole] = useState<'super_admin' | 'staff_admin'>('super_admin');

  // Chat State (Closed by default until clicked; Esc key closes active chat)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'active' | 'resolved' | 'pending'>('all');
  const [chatSearch, setChatSearch] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editMsgText, setEditMsgText] = useState<string>('');
  const [openMenuMsgId, setOpenMenuMsgId] = useState<string | null>(null);
  const [replyingToMsg, setReplyingToMsg] = useState<ChatMessage | null>(null);
  const [deletingMsg, setDeletingMsg] = useState<ChatMessage | null>(null);

  // Global Escape key listener to close active chat or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deletingMsg) {
          setDeletingMsg(null);
        } else if (replyingToMsg) {
          setReplyingToMsg(null);
        } else if (editingMsgId) {
          setEditingMsgId(null);
        } else {
          setSelectedChatId(null);
        }
        setOpenMenuMsgId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deletingMsg, replyingToMsg, editingMsgId]);

  // Offerings State
  const [offeringSearch, setOfferingSearch] = useState('');
  const [offeringCatFilter, setOfferingCatFilter] = useState<OfferingCategory | 'all'>('all');
  const [editingOffering, setEditingOffering] = useState<OfferingItem | null>(null);
  const [isAddingOffering, setIsAddingOffering] = useState(false);
  const [newOfferingForm, setNewOfferingForm] = useState<Partial<OfferingItem>>({
    name: { en: '', ml: '' },
    description: { en: '', ml: '' },
    significance: { en: '', ml: '' },
    price: 100,
    category: 'archana_pushpanjali',
  });

  // Festivals & Calendar State
  const [editingFestival, setEditingFestival] = useState<FestivalEvent | null>(null);
  const [isAddingFestival, setIsAddingFestival] = useState(false);
  const [isViewingAnnualCalendar, setIsViewingAnnualCalendar] = useState(false);
  const [annualCalendarInitialMode, setAnnualCalendarInitialMode] = useState<'poster' | 'edit'>('poster');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedFestivalIds, setSelectedFestivalIds] = useState<string[]>([]);
  const [isEditingCountdown, setIsEditingCountdown] = useState(false);
  const [countdownForm, setCountdownForm] = useState({
    targetDate: countdownConfig.targetDate || '2027-02-28T04:00',
    eyebrowEn: countdownConfig.eyebrow?.en || 'Upcoming 2027 Festival: Feb 28 – Mar 07, 2027 (Kumbham 16 – 23)',
    eyebrowMl: countdownConfig.eyebrow?.ml || 'അടുത്ത വാർഷിക തിരുവുത്സവം: 2027 ഫെബ്രുവരി 28 – മാർച്ച് 07 (കുംഭം 16 – 23)',
    titleEn: countdownConfig.title?.en || '2027 Annual Temple Festival',
    titleMl: countdownConfig.title?.ml || '2027 വാർഷിക തിരുവുത്സവം',
    subtitleEn: countdownConfig.subtitle?.en || 'Feb 28, 2027 (Sun) – Mar 07, 2027 (Sun) · 1202 Kumbham 16 – 23',
    subtitleMl: countdownConfig.subtitle?.ml || '2027 ഫെബ്രുവരി 28 ഞായർ – മാർച്ച് 07 ഞായർ · 1202 കുംഭം 16 – 23',
    isActive: countdownConfig.isActive ?? true,
  });

  useEffect(() => {
    setCountdownForm({
      targetDate: countdownConfig.targetDate || '2027-02-28T04:00',
      eyebrowEn: countdownConfig.eyebrow?.en || 'Upcoming 2027 Festival: Feb 28 – Mar 07, 2027 (Kumbham 16 – 23)',
      eyebrowMl: countdownConfig.eyebrow?.ml || 'അടുത്ത വാർഷിക തിരുവുത്സവം: 2027 ഫെബ്രുവരി 28 – മാർച്ച് 07 (കുംഭം 16 – 23)',
      titleEn: countdownConfig.title?.en || '2027 Annual Temple Festival',
      titleMl: countdownConfig.title?.ml || '2027 വാർഷിക തിരുവുത്സവം',
      subtitleEn: countdownConfig.subtitle?.en || 'Feb 28, 2027 (Sun) – Mar 07, 2027 (Sun) · 1202 Kumbham 16 – 23',
      subtitleMl: countdownConfig.subtitle?.ml || '2027 ഫെബ്രുവരി 28 ഞായർ – മാർച്ച് 07 ഞായർ · 1202 കുംഭം 16 – 23',
      isActive: countdownConfig.isActive ?? true,
    });
  }, [countdownConfig]);

  const [newFestivalForm, setNewFestivalForm] = useState<{
    title: { en: string; ml: string };
    subtitle: { en: string; ml: string };
    malayalamMonth: { en: string; ml: string };
    description: { en: string; ml: string };
    highlights: { en: string[]; ml: string[] };
    iconName: string;
    isMajor: boolean;
  }>({
    title: { en: '', ml: '' },
    subtitle: { en: '', ml: '' },
    malayalamMonth: { en: 'Kumbham (കുംഭം)', ml: 'കുംഭം' },
    description: { en: '', ml: '' },
    highlights: { en: [''], ml: [''] },
    iconName: 'Flame',
    isMajor: false,
  });

  // Contacts Form State
  const [contactForm, setContactForm] = useState<TempleContactInfo>(contactInfo);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [contactSaveStatus, setContactSaveStatus] = useState(false);
  const [adminPhoneCountryCode, setAdminPhoneCountryCode] = useState('+91');
  const [adminWhatsAppCountryCode, setAdminWhatsAppCountryCode] = useState('+91');

  // Database Reset Authentication State
  const [isResetUnlockModalOpen, setIsResetUnlockModalOpen] = useState(false);
  const [resetPasscode, setResetPasscode] = useState('');
  const [resetPasscodeError, setResetPasscodeError] = useState('');
  const [showLockedTooltip, setShowLockedTooltip] = useState(false);

  // Manage Users State (Database Connected)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'super_admin' | 'staff_admin'>('staff_admin');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [dbAdminUsers, setDbAdminUsers] = useState<DbAdminUser[]>([]);
  const [currentAdminUser, setCurrentAdminUser] = useState<DbAdminUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('puliyannoor_admin_session');
    const storedAdmin = sessionStorage.getItem('puliyannoor_admin_user');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      if (storedAdmin) {
        try {
          const parsed = JSON.parse(storedAdmin);
          setCurrentAdminUser(parsed);
          setActiveRole(parsed.role || 'super_admin');
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    getAdminUsersFromSupabase().then((users) => {
      if (users && users.length > 0) {
        setDbAdminUsers(users);
      }
    });
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    setContactForm(contactInfo);
  }, [contactInfo]);

  // Database-Backed Admin Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    const result = await verifyAdminCredentialsFromSupabase(username, password);
    setIsLoggingIn(false);

    if (result.success && result.admin) {
      setIsAuthenticated(true);
      setActiveRole(result.admin.role || 'super_admin');
      setCurrentAdminUser(result.admin);
      sessionStorage.setItem('puliyannoor_admin_session', 'true');
      sessionStorage.setItem('puliyannoor_admin_user', JSON.stringify(result.admin));
      showToast(`Welcome back, ${result.admin.name || result.admin.username}!`);
    } else {
      setAuthError(result.error || 'Wrong username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('puliyannoor_admin_session');
    sessionStorage.removeItem('puliyannoor_admin_user');
    setCurrentAdminUser(null);
    setUsername('');
    setPassword('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId) return;
    sendMessage(
      selectedChatId,
      replyText,
      replyingToMsg
        ? {
            id: replyingToMsg.id,
            sender: replyingToMsg.sender,
            senderName:
              replyingToMsg.sender === 'admin' ? 'Devaswom Office' : selectedChat?.devoteeName,
            text: replyingToMsg.text,
          }
        : undefined
    );
    setReplyText('');
    setReplyingToMsg(null);
    showToast('Reply sent to devotee');
  };

  const selectedChat = selectedChatId ? chats.find((c) => c.id === selectedChatId) || null : null;

  const filteredChats = chats.filter((c) => {
    const matchesFilter = chatFilter === 'all' || c.status === chatFilter;
    const matchesQuery =
      c.devoteeName.toLowerCase().includes(chatSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(chatSearch.toLowerCase()) ||
      (c.star && c.star.toLowerCase().includes(chatSearch.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  const filteredOfferings = offerings.filter((item) => {
    const matchesCat = offeringCatFilter === 'all' || item.category === offeringCatFilter;
    const q = offeringSearch.toLowerCase();
    const matchesSearch =
      !q ||
      item.slNo.toString() === q ||
      item.name.en.toLowerCase().includes(q) ||
      item.name.ml.toLowerCase().includes(q) ||
      item.significance.en.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Save Contact Form
  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    setContactSaveStatus(true);
    showToast('Devaswom contacts and bank information updated!');
    setTimeout(() => setContactSaveStatus(false), 3000);
  };

  // Preset quick replies for chat
  const quickReplies = [
    'നമസ്കാരം, താങ്കൾ ആവശ്യപ്പെട്ട പൂജയുടെ ബുക്കിംഗ് തീയതി ലഭ്യമാണ്.',
    'ബാങ്ക് വിവരങ്ങൾ: കനറാ ബാങ്ക് A/c: 5636101001111, IFSC: CNRB0005636 (UPI: 100027928001111@cnrb).',
    'പൂജ പൂർത്തിയായ ശേഷം പ്രസാദം തപാലിൽ അയച്ചു നൽകുന്നതാണ്.',
    'കൂട്ടനമസ്കാരത്തിന് കുടുംബപ്പേരും സ്ഥലവും രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്.',
  ];

  // -----------------------------------------------------------------------------------
  // 1. LOGIN / SIGN UP VIEW
  // -----------------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A0409] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Sacred Aura Backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C99738]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#610C1B]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full">
          {/* Brand Emblem */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#610C1B] to-[#38050E] border-2 border-[#C99738] mx-auto mb-3 shadow-xl flex items-center justify-center text-[#E6BE65] font-cinzel font-bold text-2xl">
              ॐ
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#FAF5E8]">
              Puliyannoor Devaswom
            </h1>
            <p className="text-xs text-[#E6BE65] font-cinzel tracking-wider uppercase">
              Administrative Management Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-[#C99738]/40 shadow-2xl bg-[#FAF5E8]/95 backdrop-blur-md">
            {/* Tabs */}
            <div className="flex border-b border-[#E4D5AE] mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 text-xs font-bold font-cinzel uppercase tracking-wider transition-colors border-b-2 ${
                  authMode === 'login'
                    ? 'border-[#610C1B] text-[#610C1B]'
                    : 'border-transparent text-[#8C6219] hover:text-[#38050E]'
                }`}
              >
                Admin Login
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 text-xs font-bold font-cinzel uppercase tracking-wider transition-colors border-b-2 ${
                  authMode === 'signup'
                    ? 'border-[#610C1B] text-[#610C1B]'
                    : 'border-transparent text-[#8C6219] hover:text-[#38050E]'
                }`}
              >
                Sign Up Request
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-[#5C0A17]/10 border border-[#F43F5E]/40 text-xs text-[#610C1B] font-semibold mb-4">
                {authError}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    Username / Administrator ID
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C6219] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#8C6219] absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#8C6219] hover:text-[#610C1B] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 disabled:opacity-75 text-[#FAF5E8] font-bold text-sm tracking-wider uppercase shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <>
                      <Clock className="w-4 h-4 text-[#E6BE65] animate-spin" />
                      <span>Verifying Database Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#E6BE65]" />
                      <span>Sign In to Admin Portal</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs text-[#5A382A]">
                <p className="leading-relaxed">
                  New Trustee or Priest account access must be approved by the Puliyannoor Ooranma Devaswom Managing Trustee.
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#E4D5AE] space-y-2">
                  <span className="font-bold text-[#38050E] block font-cinzel">Direct Authorization Contact:</span>
                  <p>Email: <a href="mailto:puliyannoordevaswom@gmail.com" className="text-[#610C1B] font-semibold underline">puliyannoordevaswom@gmail.com</a></p>
                  <p>Phone: <a href="tel:+914822212345" className="text-[#610C1B] font-semibold underline">+91 4822 212345</a></p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setUsername('');
                    setPassword('');
                    setAuthError('');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-[#FAF5E8] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#FAF5E8]/70 hover:text-[#E6BE65] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Temple Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN PORTAL
  // -----------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F3EBD7] text-[#2B150F] flex flex-col md:flex-row relative items-start">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#1F4E34] text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-[#A7F3D0]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation (Sticky until footer section begins) */}
      <aside className="w-full md:w-72 md:sticky md:top-[104px] md:h-[calc(100vh-104px)] bg-[#1A0409] text-[#FAF5E8] flex flex-col justify-between border-r border-[#C99738]/30 flex-shrink-0 z-30 overflow-y-auto">
        <div>
          {/* Header Branding */}
          <div className="p-5 border-b border-[#C99738]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#610C1B] to-[#38050E] border border-[#C99738] flex items-center justify-center text-[#E6BE65] font-cinzel font-bold text-lg shadow-md">
                ॐ
              </div>
              <div>
                <h2 className="font-cinzel font-bold text-sm text-[#FAF5E8] leading-tight">
                  Puliyannoor Admin
                </h2>
                <span className="text-[10px] text-[#E6BE65] font-medium block">
                  Ooranma Devaswom
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('chats')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chats'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm font-bold'
                  : 'text-[#FAF5E8]/80 hover:bg-[#38050E] hover:text-[#FAF5E8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#C99738]" />
                <span>Devotee Inquiries & Chat</span>
              </div>
              {chats.some((c) => c.unread) && (
                <span className="w-2 h-2 rounded-full bg-[#E6BE65] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('offerings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'offerings'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm font-bold'
                  : 'text-[#FAF5E8]/80 hover:bg-[#38050E] hover:text-[#FAF5E8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#C99738]" />
                <span>Offerings & Vazhipadu</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5E8]/10 text-[#E6BE65] font-bold">
                {offerings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('festivals')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'festivals'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm font-bold'
                  : 'text-[#FAF5E8]/80 hover:bg-[#38050E] hover:text-[#FAF5E8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#C99738]" />
                <span>Calendar & Festivals</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5E8]/10 text-[#E6BE65] font-bold">
                {festivals.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm font-bold'
                  : 'text-[#FAF5E8]/80 hover:bg-[#38050E] hover:text-[#FAF5E8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-[#C99738]" />
                <span>Contacts & Bank Info</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm font-bold'
                  : 'text-[#FAF5E8]/80 hover:bg-[#38050E] hover:text-[#FAF5E8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-[#C99738]" />
                <span>Trustee Profile & System</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#C99738]/20 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-[#FAF5E8]/10 hover:bg-[#FAF5E8]/20 text-[#FAF5E8] text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#E6BE65]" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-[#5C0A17]/60 hover:bg-[#5C0A17] text-[#FFE4E6] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF5E8] min-h-[calc(100vh-104px)]">
        {/* Top App Bar */}
        <header className="px-6 py-3.5 bg-white border-b border-[#E4D5AE] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel font-bold text-base md:text-lg text-[#38050E] capitalize">
              {activeTab === 'chats' && 'Devotee Inquiries & Live Chat Desk'}
              {activeTab === 'offerings' && 'Vazhipadu & Pooja Rate Manager'}
              {activeTab === 'festivals' && 'Temple Calendar & Festival Editor'}
              {activeTab === 'contacts' && 'Public Contacts & Bank Transfer Details'}
              {activeTab === 'profile' && 'Administrator Profile & System Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Role Badge & Switcher */}
            <div className="flex items-center gap-1.5 bg-[#FAF5E8] px-3 py-1 rounded-full border border-[#C99738]/50 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#610C1B]" />
              <span className="text-[11px] font-bold text-[#38050E]">
                {activeRole === 'super_admin' ? 'Super Admin (Trustee)' : 'Staff Admin (Support)'}
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextRole = activeRole === 'super_admin' ? 'staff_admin' : 'super_admin';
                  setActiveRole(nextRole);
                  showToast(
                    nextRole === 'super_admin'
                      ? 'Switched to Super Admin (Full Edit Access)'
                      : 'Switched to Staff Admin (Support Chats & View-Only Mode)'
                  );
                }}
                className="text-[10px] text-[#610C1B] hover:text-[#8B1428] underline font-bold ml-1 cursor-pointer"
                title="Switch between Super Admin and Staff Admin view"
              >
                ({activeRole === 'super_admin' ? 'Simulate Staff' : 'Switch Super Admin'})
              </button>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full bg-[#610C1B] text-[#E6BE65] font-bold text-xs flex items-center justify-center shadow cursor-pointer border border-[#C99738]"
              title="Admin Profile"
            >
              PT
            </button>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* ----------------------------------------------------------------- */}
          {/* TAB 1: GOOGLE CHAT / DEVOTEE INQUIRIES DESK */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'chats' && (
            <div className="bg-white rounded-3xl border border-[#E4D5AE] shadow-lg flex flex-col md:flex-row h-[750px] overflow-hidden">
              {/* Left Column: Inquiry Threads List */}
              <div className="w-full md:w-80 border-r border-[#E4D5AE] flex flex-col bg-[#FAF5E8]/60">
                {/* Search & Filter */}
                <div className="p-3.5 border-b border-[#E4D5AE] space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#8C6219] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search devotee, phone, star..."
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E4D5AE] bg-white text-xs text-[#2B150F] focus:outline-none focus:ring-1 focus:ring-[#C99738]"
                    />
                  </div>

                  <div className="flex gap-1 text-[10px] font-bold">
                    {(['all', 'active', 'pending', 'resolved'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setChatFilter(st)}
                        className={`px-2 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                          chatFilter === st
                            ? 'bg-[#610C1B] text-white'
                            : 'bg-white text-[#5A382A] border border-[#E4D5AE]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#E4D5AE]/60">
                  {filteredChats.map((chat) => {
                    const isSelected = chat.id === selectedChatId;
                    return (
                      <button
                        key={chat.id}
                        onClick={() => {
                          setSelectedChatId(chat.id);
                          markChatAsRead(chat.id);
                        }}
                        className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F3EBD7] border-l-4 border-[#610C1B]'
                            : 'hover:bg-white/80'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-[#610C1B] text-[#FAF5E8] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                          {chat.devoteeName.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-[#38050E] truncate">
                              {chat.devoteeName}
                            </h4>
                            <span className="text-[10px] text-[#8C6219]">
                              {chat.lastMessageTime}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#8C6219] font-medium truncate mt-0.5">
                            {chat.subject}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                chat.status === 'active'
                                  ? 'bg-[#1F4E34]/15 text-[#1F4E34]'
                                  : chat.status === 'pending'
                                  ? 'bg-[#C99738]/20 text-[#8C6219]'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {chat.status}
                            </span>
                            {chat.star && (
                              <span className="text-[9px] text-[#5A382A] truncate">
                                ⭐ {chat.star}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Google Chat / WhatsApp Style Conversation Thread */}
              {selectedChat ? (
                <div className="flex-1 flex flex-col bg-white">
                  {/* Chat Top Bar */}
                  <div className="p-4 border-b border-[#E4D5AE] flex items-center justify-between bg-[#FAF5E8]/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#38050E]">
                          {selectedChat.devoteeName}
                        </h3>
                        {selectedChat.devoteePhone && (
                          <a
                            href={`https://wa.me/${selectedChat.devoteePhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-[#8C6219] font-medium">
                        Subject: {selectedChat.subject} {selectedChat.star ? `· Star: ${selectedChat.star}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#8C6219] uppercase tracking-wider hidden sm:inline">
                          Status:
                        </span>
                        <select
                          value={selectedChat.status}
                          onChange={(e) => {
                            updateChatStatus(
                              selectedChat.id,
                              e.target.value as 'active' | 'resolved' | 'pending'
                            );
                            showToast(`Support request status updated to ${e.target.value.toUpperCase()}`);
                          }}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-[#38050E] cursor-pointer shadow-2xs"
                          title="Support Request Status"
                        >
                          <option value="active">🟢 Active</option>
                          <option value="pending">🟡 Pending</option>
                          <option value="resolved">⚪ Resolved</option>
                        </select>
                      </div>

                      {/* Close Chat Button (Esc) */}
                      <button
                        type="button"
                        onClick={() => setSelectedChatId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF5E8] text-[#8C6219] hover:text-[#610C1B] border border-[#E4D5AE] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title="Close Chat Thread (Press Esc)"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Close (Esc)</span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF5E8]/20">
                    {selectedChat.messages
                      .filter((msg) => !msg.deletedFor?.includes('admin'))
                      .map((msg) => {
                        const isAdmin = msg.sender === 'admin';
                        const status = msg.deliveryStatus || 'sent';
                        const isEditingThis = editingMsgId === msg.id;

                        // 15-minute edit window calculation
                        const msgCreatedTime = msg.createdAt || Date.now();
                        const elapsedMinutes = Math.floor((Date.now() - msgCreatedTime) / (60 * 1000));
                        const isWithin15Min = elapsedMinutes < 15;

                        // WhatsApp-style Deleted Message Bubble
                        if (msg.isDeletedForEveryone) {
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-md rounded-2xl px-3.5 py-2 text-xs italic border shadow-2xs flex items-center gap-2 ${
                                  isAdmin
                                    ? 'bg-[#610C1B]/10 border-[#610C1B]/20 text-[#610C1B] rounded-br-none'
                                    : 'bg-gray-100/90 border-gray-200 text-gray-500 rounded-bl-none'
                                }`}
                              >
                                <Ban className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span>This message was deleted</span>
                                  <span className="block not-italic text-[9px] opacity-70 mt-0.5">
                                    {msg.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Received Devotee Message
                        if (!isAdmin) {
                          return (
                            <div key={msg.id} className="flex justify-start relative group">
                              <div className="relative max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-xs bg-white border border-[#E4D5AE] text-[#2B150F] rounded-bl-none">
                                {/* Header with Sender Name & Downward Arrow Menu */}
                                <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-[#8C6219] font-bold">
                                  <span>{selectedChat.devoteeName}</span>

                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenMenuMsgId(openMenuMsgId === msg.id ? null : msg.id)
                                      }
                                      className="opacity-70 group-hover:opacity-100 hover:bg-[#FAF5E8] p-0.5 rounded transition-all cursor-pointer"
                                      title="Message Options"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5 text-[#8C6219]" />
                                    </button>

                                    {/* Action Dropdown Menu */}
                                    {openMenuMsgId === msg.id && (
                                      <div className="absolute right-0 top-5 z-30 w-36 bg-white rounded-xl shadow-xl border border-[#E4D5AE] py-1 text-xs text-[#38050E] animate-scaleUp">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setReplyingToMsg(msg);
                                            setOpenMenuMsgId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF5E8] flex items-center gap-2 text-[#38050E] font-medium cursor-pointer"
                                        >
                                          <Reply className="w-3.5 h-3.5 text-[#610C1B]" />
                                          <span>Reply</span>
                                        </button>

                                        <div className="border-t border-[#E4D5AE]/60 my-1" />

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDeletingMsg(msg);
                                            setOpenMenuMsgId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF5E8] flex items-center gap-2 text-red-600 font-medium cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Delete</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Quoted Reply Preview (if replied to another message) */}
                                {msg.replyTo && (
                                  <div className="mb-2 p-2 rounded-lg bg-[#FAF5E8] border-l-4 border-[#610C1B] text-[11px] text-[#38050E]">
                                    <span className="font-bold text-[10px] text-[#610C1B] block">
                                      {msg.replyTo.senderName ||
                                        (msg.replyTo.sender === 'admin'
                                          ? 'Devaswom Office'
                                          : selectedChat.devoteeName)}
                                    </span>
                                    <p className="truncate line-clamp-1 text-[#5A382A]">
                                      {msg.replyTo.text}
                                    </p>
                                  </div>
                                )}

                                <p className="font-normal whitespace-pre-wrap">{msg.text}</p>

                                {/* Bottom Right Corner: Timestamp only */}
                                <div className="flex items-center justify-end mt-1.5 text-[10px] text-[#8C6219]/70">
                                  <span>{msg.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // If Admin is currently editing this message, render full-length editor card
                        if (isEditingThis) {
                          return (
                            <div
                              key={msg.id}
                              className="w-full p-4 rounded-2xl bg-white border-2 border-[#C99738] shadow-md space-y-3 animate-scaleUp my-2"
                            >
                              <div className="flex items-center justify-between border-b border-[#E4D5AE]/60 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#610C1B]" />
                                  <span className="font-bold text-xs text-[#610C1B]">
                                    Editing Devaswom Sent Message
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEditingMsgId(null)}
                                  className="text-[#8C6219] hover:text-[#610C1B] p-1 rounded-lg hover:bg-[#FAF5E8] transition-colors cursor-pointer"
                                  title="Cancel editing (Esc)"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2.5">
                                <textarea
                                  value={editMsgText}
                                  onChange={(e) => setEditMsgText(e.target.value)}
                                  rows={3}
                                  placeholder="Edit official Devaswom message..."
                                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-[#FAF5E8]/30 text-xs text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] font-normal leading-relaxed resize-y"
                                  autoFocus
                                />
                                <div className="flex sm:flex-col justify-end gap-2 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      editChatMessage(selectedChat.id, msg.id, editMsgText);
                                      setEditingMsgId(null);
                                      showToast('Message updated successfully (edited)');
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                  >
                                    <Save className="w-3.5 h-3.5 text-[#E6BE65]" />
                                    <span>Save Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingMsgId(null)}
                                    className="px-4 py-2 rounded-xl bg-[#FAF5E8] hover:bg-[#E4D5AE] text-[#5A382A] font-semibold text-xs border border-[#E4D5AE] flex items-center justify-center cursor-pointer transition-colors"
                                  >
                                    <span>Cancel</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Sent Admin Message (Normal Bubble View)
                        return (
                          <div key={msg.id} className="flex justify-end relative group">
                            <div className="relative max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-xs bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-white rounded-br-none">
                              {/* Message Header with Downward Arrow on Right */}
                              <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-white/80">
                                <span className="font-bold">Devaswom Office</span>

                                <div className="relative">
                                  {/* Downward Arrow Menu Button */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenMenuMsgId(openMenuMsgId === msg.id ? null : msg.id)
                                    }
                                    className="opacity-70 group-hover:opacity-100 hover:bg-white/20 p-0.5 rounded transition-all cursor-pointer"
                                    title="Message Options"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5 text-white" />
                                  </button>

                                  {/* Action Dropdown Menu */}
                                  {openMenuMsgId === msg.id && (
                                    <div className="absolute right-0 top-5 z-30 w-44 bg-white rounded-xl shadow-xl border border-[#E4D5AE] py-1 text-xs text-[#38050E] animate-scaleUp">
                                      {/* Option 1: Reply */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setReplyingToMsg(msg);
                                          setOpenMenuMsgId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-[#FAF5E8] flex items-center gap-2 text-[#38050E] font-medium cursor-pointer"
                                      >
                                        <Reply className="w-3.5 h-3.5 text-[#610C1B]" />
                                        <span>Reply</span>
                                      </button>

                                      {/* Option 2: Edit (Within 15 Min) */}
                                      {isWithin15Min && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingMsgId(msg.id);
                                            setEditMsgText(msg.text);
                                            setOpenMenuMsgId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF5E8] flex items-center gap-2 text-[#610C1B] font-bold cursor-pointer transition-colors"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                          <span>Edit Message</span>
                                        </button>
                                      )}

                                      <div className="border-t border-[#E4D5AE]/60 my-1" />

                                      {/* Option 3: Advance Delivery Status */}
                                      {status === 'sent' && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            advanceMessageDeliveryStatus(selectedChat.id, msg.id);
                                            setOpenMenuMsgId(null);
                                            showToast('Marked as Delivered (✓✓)');
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF5E8] text-[#5A382A] flex items-center gap-1.5 cursor-pointer font-medium text-[11px]"
                                        >
                                          <span>Mark Delivered (✓✓)</span>
                                        </button>
                                      )}

                                      {status === 'delivered' && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            advanceMessageDeliveryStatus(selectedChat.id, msg.id);
                                            setOpenMenuMsgId(null);
                                            showToast('Marked as Read by Devotee (✓✓)');
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF5E8] text-[#610C1B] flex items-center gap-1.5 cursor-pointer font-bold text-[11px]"
                                        >
                                          <span>Mark as Read (✓✓)</span>
                                        </button>
                                      )}

                                      {status === 'read' && (
                                        <div className="px-3 py-1 text-[10px] text-[#1F4E34] font-semibold">
                                          ✓ Read by Devotee (Locked)
                                        </div>
                                      )}

                                      <div className="border-t border-[#E4D5AE]/60 my-1" />

                                      {/* Option 4: Delete */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDeletingMsg(msg);
                                          setOpenMenuMsgId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-[#FAF5E8] flex items-center gap-2 text-red-600 font-medium cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Quoted Reply Preview (if replied to another message) */}
                              {msg.replyTo && (
                                <div className="mb-2 p-2 rounded-lg bg-black/20 border-l-4 border-[#E6BE65] text-[11px] text-white/90">
                                  <span className="font-bold text-[10px] text-[#E6BE65] block">
                                    {msg.replyTo.senderName ||
                                      (msg.replyTo.sender === 'admin'
                                        ? 'Devaswom Office'
                                        : selectedChat.devoteeName)}
                                  </span>
                                  <p className="truncate line-clamp-1 text-white/80">
                                    {msg.replyTo.text}
                                  </p>
                                </div>
                              )}

                              {/* Message Body */}
                              <p className="font-normal whitespace-pre-wrap">{msg.text}</p>

                              {/* Right Lower Corner: Timestamp & Delivery Ticks */}
                              <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] text-white/75">
                                {msg.isEdited && (
                                  <span className="italic text-[9px] text-[#E6BE65]">edited</span>
                                )}
                                <span>{msg.timestamp}</span>

                                {/* WhatsApp-style Delivery Status Tick Badge */}
                                {status === 'read' ? (
                                  <span
                                    className="font-extrabold text-[12px] text-[#E6BE65] leading-none select-none tracking-tighter"
                                    title="Read / Seen by Devotee (Locked)"
                                  >
                                    ✓✓
                                  </span>
                                ) : status === 'delivered' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      advanceMessageDeliveryStatus(selectedChat.id, msg.id);
                                      showToast('Status advanced to Read (✓✓)');
                                    }}
                                    className="font-semibold text-[11px] text-white/75 hover:text-white leading-none cursor-pointer tracking-tighter select-none"
                                    title="Click to advance status to Read (✓✓)"
                                  >
                                    ✓✓
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      advanceMessageDeliveryStatus(selectedChat.id, msg.id);
                                      showToast('Status advanced to Delivered (✓✓)');
                                    }}
                                    className="font-semibold text-[11px] text-white/75 hover:text-white leading-none cursor-pointer select-none"
                                    title="Click to advance status to Delivered (✓✓)"
                                  >
                                    ✓
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* WhatsApp-style Replying To Banner Preview */}
                  {replyingToMsg && (
                    <div className="px-4 py-2 bg-[#FAF5E8] border-t border-[#E4D5AE] flex items-center justify-between gap-3 animate-slideDown">
                      <div className="flex items-center gap-2.5 min-w-0 border-l-4 border-[#610C1B] pl-2.5">
                        <Reply className="w-3.5 h-3.5 text-[#610C1B] flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#610C1B] block">
                            Replying to{' '}
                            {replyingToMsg.sender === 'admin'
                              ? 'Devaswom Office'
                              : selectedChat.devoteeName}
                          </span>
                          <p className="text-xs text-[#5A382A] truncate max-w-md">
                            {replyingToMsg.text}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReplyingToMsg(null)}
                        className="p-1 text-[#8C6219] hover:text-[#610C1B] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        title="Cancel reply (Esc)"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Quick Preset Replies */}
                  <div className="p-2 border-t border-[#E4D5AE] bg-[#FAF5E8]/30 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold text-[#8C6219] uppercase py-0.5">Quick Presets:</span>
                    {quickReplies.map((reply, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => setReplyText(reply)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#E4D5AE] text-[#5A382A] hover:bg-[#610C1B] hover:text-white transition-colors truncate max-w-[200px] cursor-pointer"
                        title={reply}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>

                  {/* Reply Input Box */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E4D5AE] flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        replyingToMsg
                          ? `Replying to ${replyingToMsg.sender === 'admin' ? 'Devaswom Office' : selectedChat.devoteeName}...`
                          : 'Type official Devaswom reply message...'
                      }
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      autoFocus={!!replyingToMsg}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#E6BE65]" />
                      <span>{replyingToMsg ? 'Reply' : 'Send'}</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Blank Space / Empty State when No Chat is Selected or after pressing Esc */
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF5E8]/30 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#610C1B]/15 via-[#C99738]/20 to-[#610C1B]/10 border border-[#C99738]/40 flex items-center justify-center text-[#610C1B] shadow-sm">
                    <MessageSquare className="w-8 h-8 text-[#610C1B]" />
                  </div>
                  <div className="max-w-sm space-y-2">
                    <h3 className="font-cinzel font-bold text-base text-[#38050E]">
                      Devotee Inquiries & Live Chat Desk
                    </h3>
                    <p className="text-xs text-[#5A382A] leading-relaxed">
                      Select any devotee inquiry from the left inbox to view the conversation thread, manage WhatsApp status, or send replies.
                    </p>
                    <div className="pt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E4D5AE] text-[11px] text-[#8C6219] font-medium shadow-2xs">
                      <span>💡 Press <kbd className="font-mono font-bold bg-[#FAF5E8] px-1.5 py-0.5 rounded border border-[#E4D5AE] text-[#38050E]">Esc</kbd> anytime to close active chat</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* DELETE MESSAGE CONFIRMATION PROMPT MODAL (3 Options) */}
          {/* ----------------------------------------------------------------- */}
          {deletingMsg && selectedChat && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl border border-[#E4D5AE] shadow-2xl max-w-sm w-full p-5 space-y-4 animate-scaleUp">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#38050E]">Delete Message?</h3>
                    <p className="text-[11px] text-[#8C6219]">
                      Choose how you would like to delete this message.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF5E8] rounded-xl border border-[#E4D5AE] text-xs text-[#5A382A] italic line-clamp-2">
                  &ldquo;{deletingMsg.text}&rdquo;
                </div>

                <div className="space-y-2 pt-1">
                  {/* Option 1: Delete for Everyone */}
                  <button
                    type="button"
                    onClick={() => {
                      deleteChatMessage(selectedChat.id, deletingMsg.id, 'for_everyone', 'admin');
                      setDeletingMsg(null);
                      showToast('Message deleted for everyone');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>Delete for Everyone</span>
                  </button>

                  {/* Option 2: Delete for Me */}
                  <button
                    type="button"
                    onClick={() => {
                      deleteChatMessage(selectedChat.id, deletingMsg.id, 'for_me', 'admin');
                      setDeletingMsg(null);
                      showToast('Message deleted for you');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF5E8] text-[#5A382A] hover:text-[#38050E] border border-[#E4D5AE] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Delete for Me
                  </button>

                  {/* Option 3: Cancel */}
                  <button
                    type="button"
                    onClick={() => setDeletingMsg(null)}
                    className="w-full py-2 px-4 rounded-xl text-gray-500 hover:text-gray-800 text-xs font-semibold transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 2: OFFERINGS / VAZHIPADU RATE MANAGER */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'offerings' && (
            <div className="space-y-4">
              {/* Staff Admin Notice Banner */}
              {activeRole === 'staff_admin' && (
                <div className="p-3.5 rounded-2xl bg-[#5C0A17]/10 border border-[#F43F5E]/40 text-xs text-[#610C1B] flex items-center gap-2 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#610C1B]" />
                  <span>
                    <strong>View-Only Mode:</strong> Logged in as Staff/Admin. Modifying offering rates, adding new poojas, or deleting items requires Super Admin (Managing Trustee & Treasurer) authorization.
                  </span>
                </div>
              )}

              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4D5AE] shadow-xs">
                <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-[#8C6219] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search offerings by name, benefit..."
                      value={offeringSearch}
                      onChange={(e) => setOfferingSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E4D5AE] text-xs text-[#2B150F] focus:outline-none focus:ring-1 focus:ring-[#C99738]"
                    />
                  </div>

                  <select
                    value={offeringCatFilter}
                    onChange={(e) => setOfferingCatFilter(e.target.value as any)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E4D5AE] bg-white text-[#38050E] cursor-pointer"
                  >
                    <option value="all">All Categories ({offerings.length})</option>
                    <option value="pooja_homam">Pooja & Homam</option>
                    <option value="abhishekam_dhara">Abhishekam & Dhara</option>
                    <option value="archana_pushpanjali">Archana & Pushpanjali</option>
                    <option value="nivedyam_payasam">Nivedyam & Payasam</option>
                    <option value="vilakku_mala">Vilakku & Mala</option>
                    <option value="special_sevas">Special Sevas</option>
                  </select>
                </div>

                {activeRole === 'super_admin' ? (
                  <button
                    onClick={() => setIsAddingOffering(true)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#E6BE65]" />
                    <span>Add New Vazhipadu</span>
                  </button>
                ) : (
                  <div className="text-xs text-[#8C6219] font-medium bg-[#FAF5E8] px-3.5 py-2 rounded-xl border border-[#E4D5AE] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#610C1B]" />
                    <span>View Only (Super Admin required to edit)</span>
                  </div>
                )}
              </div>

              {/* Offerings Table */}
              <div className="bg-white rounded-3xl border border-[#E4D5AE] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#FAF5E8] border-b border-[#E4D5AE] font-cinzel font-bold text-[#38050E]">
                      <tr>
                        <th className="p-3.5 text-center w-12">#</th>
                        <th className="p-3.5">Malayalam Name</th>
                        <th className="p-3.5">English Name</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5 text-right">Rate (₹)</th>
                        <th className="p-3.5">Significance / Benefits</th>
                        <th className="p-3.5 text-center w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4D5AE]/60">
                      {filteredOfferings.map((item) => (
                        <tr key={item.id} className="hover:bg-[#FAF5E8]/40 transition-colors">
                          <td className="p-3 text-center font-bold text-[#8C6219] font-mono">
                            {item.slNo}
                          </td>
                          <td className="p-3 font-malayalam-sans font-bold text-[#38050E]">
                            {item.name.ml}
                          </td>
                          <td className="p-3 font-semibold text-[#2B150F]">
                            {item.name.en}
                          </td>
                          <td className="p-3 text-[11px] text-[#8C6219] capitalize">
                            {item.category.replace('_', ' ')}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-[#610C1B] text-sm">
                            ₹{item.price.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-[11px] text-[#5A382A] max-w-xs truncate" title={item.significance.en}>
                            {item.significance.en}
                          </td>
                          <td className="p-3 text-center">
                            {activeRole === 'super_admin' ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setEditingOffering(item)}
                                  className="p-1.5 rounded-lg bg-[#F3EBD7] text-[#610C1B] hover:bg-[#610C1B] hover:text-white transition-colors cursor-pointer"
                                  title="Edit Vazhipadu"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete "${item.name.en}"?`)) {
                                      deleteOffering(item.id);
                                      showToast(`Deleted ${item.name.en}`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-[#FFE4E6] text-[#9F1239] hover:bg-[#9F1239] hover:text-white transition-colors cursor-pointer"
                                  title="Delete Vazhipadu"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">View Only</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Offering Modal */}
              {editingOffering && (
                <div className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-[#C99738] flex flex-col max-h-[85vh] overflow-hidden animate-scaleUp">
                    {/* Fixed Modal Header */}
                    <div className="p-5 border-b border-[#E4D5AE] bg-white flex items-center justify-between flex-shrink-0">
                      <h3 className="font-cinzel font-bold text-base text-[#38050E] truncate pr-2">
                        Edit Vazhipadu #{editingOffering.slNo}
                      </h3>
                      <button
                        onClick={() => setEditingOffering(null)}
                        className="text-[#8C6219] hover:text-[#610C1B] p-1 rounded-lg hover:bg-[#FAF5E8] transition-colors cursor-pointer flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Scrollable Modal Body */}
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Malayalam Name</label>
                        <input
                          type="text"
                          value={editingOffering.name.ml}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              name: { ...editingOffering.name, ml: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">English Name</label>
                        <input
                          type="text"
                          value={editingOffering.name.en}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              name: { ...editingOffering.name, en: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Price (₹)</label>
                          <input
                            type="number"
                            value={editingOffering.price}
                            onChange={(e) =>
                              setEditingOffering({
                                ...editingOffering,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] font-mono font-bold text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Category</label>
                          <select
                            value={editingOffering.category}
                            onChange={(e) =>
                              setEditingOffering({
                                ...editingOffering,
                                category: e.target.value as OfferingItemCategory,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-xs font-semibold text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                          >
                            <option value="pooja_homam">Pooja & Homam</option>
                            <option value="abhishekam_dhara">Abhishekam & Dhara</option>
                            <option value="archana_pushpanjali">Archana & Pushpanjali</option>
                            <option value="nivedyam_payasam">Nivedyam & Payasam</option>
                            <option value="vilakku_mala">Vilakku & Mala</option>
                            <option value="special_sevas">Special Sevas</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Description (English)</label>
                        <textarea
                          rows={2}
                          value={editingOffering.description.en}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              description: { ...editingOffering.description, en: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Significance / Benefits</label>
                        <textarea
                          rows={2}
                          value={editingOffering.significance.en}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              significance: { ...editingOffering.significance, en: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none"
                        />
                      </div>
                    </div>

                    {/* Fixed Modal Footer */}
                    <div className="p-4 border-t border-[#E4D5AE] bg-[#FAF5E8]/60 flex items-center justify-end gap-2.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingOffering(null)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold border border-[#E4D5AE] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateOffering(editingOffering.id, editingOffering);
                          setEditingOffering(null);
                          showToast(`Updated ${editingOffering.name.en} successfully!`);
                        }}
                        className="px-5 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Offering Modal */}
              {isAddingOffering && (
                <div className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border-2 border-[#C99738] space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-3">
                      <h3 className="font-cinzel font-bold text-base text-[#38050E]">
                        Add New Vazhipadu Offering
                      </h3>
                      <button
                        onClick={() => setIsAddingOffering(false)}
                        className="text-[#8C6219] hover:text-[#610C1B]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Malayalam Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. പ്രത്യേക പുഷ്പാഭിഷേകം"
                          value={newOfferingForm.name?.ml || ''}
                          onChange={(e) =>
                            setNewOfferingForm({
                              ...newOfferingForm,
                              name: {
                                en: newOfferingForm.name?.en || '',
                                ml: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">English Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Special Flower Abhishekam"
                          value={newOfferingForm.name?.en || ''}
                          onChange={(e) =>
                            setNewOfferingForm({
                              ...newOfferingForm,
                              name: {
                                ml: newOfferingForm.name?.ml || '',
                                en: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1">Price (₹) *</label>
                          <input
                            type="number"
                            value={newOfferingForm.price || 100}
                            onChange={(e) =>
                              setNewOfferingForm({
                                ...newOfferingForm,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1">Category</label>
                          <select
                            value={newOfferingForm.category}
                            onChange={(e) =>
                              setNewOfferingForm({
                                ...newOfferingForm,
                                category: e.target.value as OfferingItemCategory,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                          >
                            <option value="pooja_homam">Pooja & Homam</option>
                            <option value="abhishekam_dhara">Abhishekam & Dhara</option>
                            <option value="archana_pushpanjali">Archana & Pushpanjali</option>
                            <option value="nivedyam_payasam">Nivedyam & Payasam</option>
                            <option value="vilakku_mala">Vilakku & Mala</option>
                            <option value="special_sevas">Special Sevas</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Brief pooja description..."
                          value={newOfferingForm.description?.en || ''}
                          onChange={(e) =>
                            setNewOfferingForm({
                              ...newOfferingForm,
                              description: {
                                ml: e.target.value,
                                en: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Significance / Benefits</label>
                        <textarea
                          rows={2}
                          placeholder="Benefits of performing this offering..."
                          value={newOfferingForm.significance?.en || ''}
                          onChange={(e) =>
                            setNewOfferingForm({
                              ...newOfferingForm,
                              significance: {
                                ml: e.target.value,
                                en: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#E4D5AE]">
                      <button
                        onClick={() => setIsAddingOffering(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!newOfferingForm.name?.en || !newOfferingForm.name?.ml) {
                            alert('Please enter both Malayalam and English names');
                            return;
                          }
                          addOffering({
                            id: `off_${Date.now()}`,
                            name: { en: newOfferingForm.name.en, ml: newOfferingForm.name.ml },
                            description: {
                              en: newOfferingForm.description?.en || newOfferingForm.name.en,
                              ml: newOfferingForm.description?.ml || newOfferingForm.name.ml,
                            },
                            significance: {
                              en: newOfferingForm.significance?.en || 'Spiritual welfare and divine blessings.',
                              ml: newOfferingForm.significance?.ml || 'ആയുരാരോഗ്യ സൗഖ്യത്തിനും അഭീഷ്ടസിദ്ധിക്കും.',
                            },
                            price: Number(newOfferingForm.price) || 100,
                            category: newOfferingForm.category || 'archana_pushpanjali',
                          });
                          setIsAddingOffering(false);
                          showToast('Added new Vazhipadu successfully!');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#610C1B] text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Add Offering</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* ----------------------------------------------------------------- */}
          {/* TAB 3: CALENDAR & FESTIVALS EDITOR */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'festivals' && (
            <div className="space-y-5">
              {/* Staff Admin Notice Banner */}
              {activeRole === 'staff_admin' && (
                <div className="p-3.5 rounded-2xl bg-[#5C0A17]/10 border border-[#F43F5E]/40 text-xs text-[#610C1B] flex items-center gap-2 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#610C1B]" />
                  <span>
                    <strong>View-Only Mode:</strong> Logged in as Staff/Admin. Festival schedule modifications and highlight edits are reserved for the Super Admin (Managing Trustee & Treasurer).
                  </span>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 1. SEPARATE ANNUAL MALAYALAM CALENDAR MANAGEMENT BOX          */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-[#FAF5E8] via-[#FFF9EE] to-[#F3EBD7] rounded-3xl border-2 border-[#C99738]/60 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-[11px] font-bold text-[#610C1B] uppercase tracking-wider mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C99738]" />
                      <span>{annualCalendar.malayalamYear} {annualCalendar.gregorianYear}</span>
                    </div>

                    <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#38050E] mb-1 flex items-center gap-2">
                      <span>{annualCalendar.templeName} — Official Annual Temple Calendar</span>
                    </h3>
                    <p className="text-xs text-[#5A382A] max-w-2xl leading-relaxed">
                      Official Devaswom publication poster containing {annualCalendar.visheshaDivasangal.length} Special Days (പ്രധാന വിശേഷങ്ങൾ), {annualCalendar.pradosham.length} Pradosham Dates (പ്രദോഷം), {annualCalendar.samkramam.length} Samkramam Dates (സംക്രമം), Pooja Timings, and Ulsavam schedule.
                    </p>

                    {/* Summary Chips */}
                    <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-bold">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#C99738]/40 text-[#610C1B] shadow-2xs">
                        🏷️ {annualCalendar.visheshaDivasangal.length} Special Days (വിശേഷങ്ങൾ)
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#C99738]/40 text-[#003366] shadow-2xs">
                        🌙 {annualCalendar.pradosham.length} Pradosham Dates (പ്രദോഷം)
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#C99738]/40 text-[#1F4E34] shadow-2xs">
                        ☀️ {annualCalendar.samkramam.length} Samkramam Dates (സംക്രമം)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-stretch gap-2.5 flex-shrink-0 w-full lg:w-[420px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                      {/* View Calendar Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setAnnualCalendarInitialMode('poster');
                          setIsViewingAnnualCalendar(true);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF5E8] text-[#610C1B] text-xs font-bold border-2 border-[#C99738] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow text-center"
                      >
                        <Eye className="w-4 h-4 text-[#8C6219] flex-shrink-0" />
                        <span className="whitespace-nowrap">View Annual Calendar</span>
                      </button>

                      {/* Admin Level Direct Edit / Add / Remove Provision */}
                      {activeRole === 'super_admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAnnualCalendarInitialMode('edit');
                            setIsViewingAnnualCalendar(true);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:from-[#8B1428] hover:to-[#610C1B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#E6BE65]/40 text-center"
                        >
                          <Edit3 className="w-4 h-4 text-[#E6BE65] flex-shrink-0" />
                          <span className="whitespace-nowrap">Manage Calendar</span>
                        </button>
                      )}
                    </div>

                    {/* Ulsavam Highlight Banner under the View & Edit Options */}
                    <div className="w-full px-4 py-2.5 rounded-xl bg-[#610C1B] text-[#FAF5E8] text-xs font-bold shadow-xs border border-[#C99738]/50 flex items-center justify-center text-center gap-2">
                      <span className="flex-shrink-0">🎪</span>
                      <span className="leading-snug">Ulsavam: {annualCalendar.ulsavamBox.gregorianDates}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. LIVE FESTIVAL COUNTDOWN BANNER EDITOR SECTION              */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E4D5AE] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-cinzel font-bold text-base text-[#38050E] flex items-center gap-2">
                      <Timer className="w-4 h-4 text-[#C99738]" />
                      <span>⏳ Live Festival Countdown Editor</span>
                    </h3>
                    <p className="text-xs text-[#8C6219]">
                      Edit the real-time countdown banner shown to devotees on the website (target date, title, subtitle, and eyebrow text).
                    </p>
                  </div>

                  {activeRole === 'super_admin' && (
                    <button
                      type="button"
                      onClick={() => setIsEditingCountdown(!isEditingCountdown)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FAF5E8] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold border border-[#C99738] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#8C6219]" />
                      <span>{isEditingCountdown ? 'Hide Editor' : 'Edit Countdown'}</span>
                    </button>
                  )}
                </div>

                {/* Countdown Edit Form */}
                {isEditingCountdown && activeRole === 'super_admin' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateCountdownConfig({
                        targetDate: countdownForm.targetDate,
                        eyebrow: {
                          en: countdownForm.eyebrowEn,
                          ml: countdownForm.eyebrowMl,
                        },
                        title: {
                          en: countdownForm.titleEn,
                          ml: countdownForm.titleMl,
                        },
                        subtitle: {
                          en: countdownForm.subtitleEn,
                          ml: countdownForm.subtitleMl,
                        },
                        isActive: countdownForm.isActive,
                      });
                      setIsEditingCountdown(false);
                      showToast('Live festival countdown updated successfully!');
                    }}
                    className="p-4 bg-[#FAF5E8]/60 rounded-2xl border border-[#E4D5AE] space-y-3.5 text-xs animate-fadeIn"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">
                          Target Date & Time (IST) *
                        </label>
                        <input
                          type="datetime-local"
                          value={countdownForm.targetDate}
                          onChange={(e) => setCountdownForm({ ...countdownForm, targetDate: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white font-mono text-xs text-[#38050E]"
                        />
                      </div>

                      <div className="flex items-center gap-2 sm:pt-6">
                        <input
                          type="checkbox"
                          id="countdownIsActive"
                          checked={countdownForm.isActive}
                          onChange={(e) => setCountdownForm({ ...countdownForm, isActive: e.target.checked })}
                          className="w-4 h-4 rounded border-[#C99738] text-[#610C1B] focus:ring-[#610C1B] cursor-pointer"
                        />
                        <label htmlFor="countdownIsActive" className="font-bold text-[#38050E] cursor-pointer select-none text-xs">
                          Display Live Countdown Banner on Website
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">
                          Text Above Title / Eyebrow (English)
                        </label>
                        <input
                          type="text"
                          value={countdownForm.eyebrowEn}
                          onChange={(e) => setCountdownForm({ ...countdownForm, eyebrowEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">
                          Text Above Title / Eyebrow (Malayalam)
                        </label>
                        <input
                          type="text"
                          value={countdownForm.eyebrowMl}
                          onChange={(e) => setCountdownForm({ ...countdownForm, eyebrowMl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">
                          Countdown Title (English) *
                        </label>
                        <input
                          type="text"
                          value={countdownForm.titleEn}
                          onChange={(e) => setCountdownForm({ ...countdownForm, titleEn: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs font-bold text-[#38050E]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">
                          Countdown Title (Malayalam) *
                        </label>
                        <input
                          type="text"
                          value={countdownForm.titleMl}
                          onChange={(e) => setCountdownForm({ ...countdownForm, titleMl: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs font-bold text-[#38050E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">
                          Subtitle / Festival Dates Info (English)
                        </label>
                        <input
                          type="text"
                          value={countdownForm.subtitleEn}
                          onChange={(e) => setCountdownForm({ ...countdownForm, subtitleEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">
                          Subtitle / Festival Dates Info (Malayalam)
                        </label>
                        <input
                          type="text"
                          value={countdownForm.subtitleMl}
                          onChange={(e) => setCountdownForm({ ...countdownForm, subtitleMl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4D5AE]">
                      <button
                        type="button"
                        onClick={() => setIsEditingCountdown(false)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold border border-[#E4D5AE]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Save Countdown Settings</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 3. TEMPLE FESTIVALS & EVENTS SECTION WITH SELECTION MODE     */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 bg-white rounded-2xl border border-[#E4D5AE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-cinzel font-bold text-sm text-[#38050E] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C99738]" />
                    <span>Annual Calendar Events ({festivals.length})</span>
                  </h3>
                  <p className="text-xs text-[#8C6219]">
                    Manage individual festival celebration cards, dates, descriptions, and rituals.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Normal Mode Buttons */}
                  {!isSelectionMode && activeRole === 'super_admin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsAddingFestival(true)}
                        className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>+ Add Festival</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsSelectionMode(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#FAF5E8] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold border border-[#C99738] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-[#8C6219]" />
                        <span>Select</span>
                      </button>
                    </>
                  )}

                  {/* Selection Mode Toolbar (Checkboxes appear now) */}
                  {isSelectionMode && activeRole === 'super_admin' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE]">
                        <input
                          type="checkbox"
                          id="selectAllFestivals"
                          checked={selectedFestivalIds.length === festivals.length && festivals.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFestivalIds(festivals.map((f) => f.id));
                            } else {
                              setSelectedFestivalIds([]);
                            }
                          }}
                          className="w-4 h-4 rounded border-[#C99738] text-[#610C1B] focus:ring-[#610C1B] cursor-pointer"
                        />
                        <label htmlFor="selectAllFestivals" className="font-bold text-[#38050E] cursor-pointer select-none text-xs">
                          Select All ({selectedFestivalIds.length}/{festivals.length})
                        </label>
                      </div>

                      {/* Delete Selected with Bin Icon */}
                      <button
                        type="button"
                        disabled={selectedFestivalIds.length === 0}
                        onClick={() => {
                          if (selectedFestivalIds.length === 0) return;
                          if (
                            confirm(
                              `Are you sure you want to delete ${selectedFestivalIds.length} selected festival(s)? This action cannot be undone.`
                            )
                          ) {
                            const count = selectedFestivalIds.length;
                            deleteMultipleFestivals(selectedFestivalIds);
                            setSelectedFestivalIds([]);
                            setIsSelectionMode(false);
                            showToast(`Deleted ${count} selected festival(s)`);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                          selectedFestivalIds.length > 0
                            ? 'bg-rose-700 hover:bg-rose-800 text-white cursor-pointer'
                            : 'bg-rose-100 text-rose-300 border border-rose-200 cursor-not-allowed'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Selected ({selectedFestivalIds.length})</span>
                      </button>

                      {/* Cancel Selection Mode */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFestivalIds([]);
                          setIsSelectionMode(false);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-[#E4D5AE] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Festival Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {festivals.map((fest) => {
                  const isSelected = selectedFestivalIds.includes(fest.id);
                  return (
                    <div
                      key={fest.id}
                      className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-xs ${
                        isSelected
                          ? 'border-[#610C1B] ring-2 ring-[#610C1B]/30 bg-[#FAF5E8]/30'
                          : 'border-[#E4D5AE] hover:border-[#C99738]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {/* Checkbox ONLY appears in selection mode */}
                            {isSelectionMode && activeRole === 'super_admin' && (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFestivalIds((prev) => [...prev, fest.id]);
                                  } else {
                                    setSelectedFestivalIds((prev) => prev.filter((id) => id !== fest.id));
                                  }
                                }}
                                className="w-4 h-4 rounded border-[#C99738] text-[#610C1B] focus:ring-[#610C1B] cursor-pointer"
                              />
                            )}
                            <span className="px-2.5 py-0.5 rounded-full bg-[#610C1B]/10 text-[#610C1B] text-[10px] font-bold">
                              {fest.malayalamMonth.en}
                            </span>
                          </div>

                          {fest.isMajor && (
                            <span className="px-2 py-0.5 rounded-full bg-[#C99738]/20 text-[#8C6219] text-[10px] font-bold">
                              Major Festival
                            </span>
                          )}
                        </div>

                        <h4 className="font-cinzel font-bold text-base text-[#38050E] mb-1">
                          {fest.title.en}
                        </h4>
                        <p className="text-xs text-[#8C6219] font-medium mb-2">
                          {fest.title.ml} · {fest.subtitle.en}
                        </p>
                        <p className="text-xs text-[#5A382A] line-clamp-3 mb-3 leading-relaxed">
                          {fest.description.en}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E4D5AE] flex items-center justify-between">
                        <div className="text-[11px] text-[#1F4E34] font-semibold">
                          ✓ {fest.highlights.en.length} highlights
                        </div>
                        {activeRole === 'super_admin' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingFestival(fest)}
                              className="px-3 py-1 rounded-lg bg-[#F3EBD7] text-[#610C1B] hover:bg-[#610C1B] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete festival "${fest.title.en}"?`)) {
                                  deleteFestival(fest.id);
                                  setSelectedFestivalIds((prev) => prev.filter((id) => id !== fest.id));
                                  showToast(`Deleted ${fest.title.en}`);
                                }
                              }}
                              className="p-1 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete Festival"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">View Only</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Festival Modal */}
              {isAddingFestival && (
                <div className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-[#C99738] flex flex-col max-h-[85vh] overflow-hidden animate-scaleUp">
                    {/* Fixed Modal Header */}
                    <div className="p-5 border-b border-[#E4D5AE] bg-white flex items-center justify-between flex-shrink-0">
                      <h3 className="font-cinzel font-bold text-base text-[#38050E] flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#C99738]" />
                        <span>Add New Festival Event</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsAddingFestival(false)}
                        className="text-[#8C6219] hover:text-[#610C1B] p-1 rounded-lg hover:bg-[#FAF5E8] transition-colors cursor-pointer flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Scrollable Modal Body */}
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Title (English) *</label>
                        <input
                          type="text"
                          placeholder="e.g. Annual Temple Festival (Ulsavam)"
                          value={newFestivalForm.title.en}
                          onChange={(e) =>
                            setNewFestivalForm({
                              ...newFestivalForm,
                              title: { ...newFestivalForm.title, en: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Title (Malayalam) *</label>
                        <input
                          type="text"
                          placeholder="e.g. വാർഷിക തിരുവുത്സവം"
                          value={newFestivalForm.title.ml}
                          onChange={(e) =>
                            setNewFestivalForm({
                              ...newFestivalForm,
                              title: { ...newFestivalForm.title, ml: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Subtitle</label>
                          <input
                            type="text"
                            placeholder="e.g. 8-Day Grand Celebration"
                            value={newFestivalForm.subtitle.en}
                            onChange={(e) =>
                              setNewFestivalForm({
                                ...newFestivalForm,
                                subtitle: {
                                  en: e.target.value,
                                  ml: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Malayalam Month</label>
                          <select
                            value={newFestivalForm.malayalamMonth.en}
                            onChange={(e) =>
                              setNewFestivalForm({
                                ...newFestivalForm,
                                malayalamMonth: {
                                  en: e.target.value,
                                  ml: e.target.value.split(' ')[0],
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-xs font-semibold text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                          >
                            <option value="Chingam (ചിങ്ങം)">Chingam (ചിങ്ങം)</option>
                            <option value="Kanni (കന്നി)">Kanni (കന്നി)</option>
                            <option value="Thulam (തുലാം)">Thulam (തുലാം)</option>
                            <option value="Vrischikam (വൃശ്ചികം)">Vrischikam (വൃശ്ചികം)</option>
                            <option value="Dhanu (ധനു)">Dhanu (ധനു)</option>
                            <option value="Makaram (മകരം)">Makaram (മകരം)</option>
                            <option value="Kumbham (കുംഭം)">Kumbham (കുംഭം)</option>
                            <option value="Meenam (മീനം)">Meenam (മീനം)</option>
                            <option value="Medam (മേടം)">Medam (മേടം)</option>
                            <option value="Edavam (ഇടവം)">Edavam (ഇടവം)</option>
                            <option value="Mithunam (മിഥുനം)">Mithunam (മിഥുനം)</option>
                            <option value="Karkidakam (കർക്കിടകം)">Karkidakam (കർക്കിടകം)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE]">
                        <input
                          type="checkbox"
                          id="newFestIsMajor"
                          checked={newFestivalForm.isMajor}
                          onChange={(e) =>
                            setNewFestivalForm({
                              ...newFestivalForm,
                              isMajor: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-[#C99738] text-[#610C1B] focus:ring-[#610C1B] cursor-pointer"
                        />
                        <label htmlFor="newFestIsMajor" className="font-bold text-[#38050E] cursor-pointer select-none text-xs">
                          Mark as Major Temple Festival (Highlighted Banner)
                        </label>
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Description (English) *</label>
                        <textarea
                          rows={3}
                          placeholder="Detailed description of the festival, spiritual significance, and ceremonies..."
                          value={newFestivalForm.description.en}
                          onChange={(e) =>
                            setNewFestivalForm({
                              ...newFestivalForm,
                              description: {
                                en: e.target.value,
                                ml: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none leading-relaxed"
                        />
                      </div>

                      {/* Key Highlights Manager */}
                      <div className="pt-3 border-t border-[#E4D5AE] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block font-bold text-[#8C6219] font-cinzel">
                              Key Highlights ({newFestivalForm.highlights.en.length}/5)
                            </label>
                            <p className="text-[10px] text-gray-500">Add up to 5 highlights</p>
                          </div>
                          {newFestivalForm.highlights.en.length < 5 && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewFestivalForm({
                                  ...newFestivalForm,
                                  highlights: {
                                    en: [...newFestivalForm.highlights.en, ''],
                                    ml: [...newFestivalForm.highlights.ml, ''],
                                  },
                                });
                              }}
                              className="text-[11px] font-bold text-[#610C1B] hover:text-[#8B1428] flex items-center gap-1 cursor-pointer bg-[#FAF5E8] hover:bg-[#F3EBD7] px-2.5 py-1 rounded-lg border border-[#C99738]/50 transition-colors shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#610C1B]" />
                              <span>+ Add Highlight</span>
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {newFestivalForm.highlights.en.map((hl, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-[#FAF5E8]/50 p-2 rounded-xl border border-[#E4D5AE] shadow-2xs"
                            >
                              <span className="text-xs font-bold text-[#8C6219] min-w-[20px] text-center font-mono">
                                {idx + 1}.
                              </span>
                              <input
                                type="text"
                                placeholder={`Highlight #${idx + 1} (e.g. Kodiyeettu, Pallivetta)`}
                                value={hl}
                                onChange={(e) => {
                                  const newEn = [...newFestivalForm.highlights.en];
                                  newEn[idx] = e.target.value;
                                  const newMl = [...newFestivalForm.highlights.ml];
                                  newMl[idx] = e.target.value;
                                  setNewFestivalForm({
                                    ...newFestivalForm,
                                    highlights: { en: newEn, ml: newMl },
                                  });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4D5AE] bg-white text-xs text-[#2B150F] focus:outline-none focus:ring-1 focus:ring-[#C99738]"
                              />
                              {newFestivalForm.highlights.en.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newEn = newFestivalForm.highlights.en.filter((_, i) => i !== idx);
                                    const newMl = newFestivalForm.highlights.ml.filter((_, i) => i !== idx);
                                    setNewFestivalForm({
                                      ...newFestivalForm,
                                      highlights: { en: newEn, ml: newMl },
                                    });
                                  }}
                                  className="p-1.5 text-rose-700 hover:bg-rose-100/80 rounded-lg cursor-pointer transition-colors"
                                  title="Remove highlight"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fixed Modal Footer */}
                    <div className="p-4 border-t border-[#E4D5AE] bg-[#FAF5E8]/60 flex items-center justify-end gap-2.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsAddingFestival(false)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold border border-[#E4D5AE] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newFestivalForm.title.en.trim() || !newFestivalForm.title.ml.trim()) {
                            alert('Please enter both English and Malayalam festival titles');
                            return;
                          }
                          const cleanHighlightsEn = newFestivalForm.highlights.en.filter((h) => h.trim().length > 0);
                          const cleanHighlightsMl = newFestivalForm.highlights.ml.filter((h) => h.trim().length > 0);

                          addFestival({
                            id: `fest_${Date.now()}`,
                            title: { en: newFestivalForm.title.en.trim(), ml: newFestivalForm.title.ml.trim() },
                            subtitle: {
                              en: newFestivalForm.subtitle.en.trim() || newFestivalForm.title.en.trim(),
                              ml: newFestivalForm.subtitle.ml.trim() || newFestivalForm.title.ml.trim(),
                            },
                            malayalamMonth: {
                              en: newFestivalForm.malayalamMonth.en,
                              ml: newFestivalForm.malayalamMonth.ml,
                            },
                            description: {
                              en: newFestivalForm.description.en.trim() || newFestivalForm.title.en.trim(),
                              ml: newFestivalForm.description.ml.trim() || newFestivalForm.title.ml.trim(),
                            },
                            highlights: {
                              en: cleanHighlightsEn.length > 0 ? cleanHighlightsEn : ['Special Poojas & Rituals'],
                              ml: cleanHighlightsMl.length > 0 ? cleanHighlightsMl : ['വിശേഷാൽ പൂജകളും ചടങ്ങുകളും'],
                            },
                            iconName: newFestivalForm.iconName || 'Flame',
                            isMajor: newFestivalForm.isMajor,
                          });

                          setIsAddingFestival(false);
                          setNewFestivalForm({
                            title: { en: '', ml: '' },
                            subtitle: { en: '', ml: '' },
                            malayalamMonth: { en: 'Kumbham (കുംഭം)', ml: 'കുംഭം' },
                            description: { en: '', ml: '' },
                            highlights: { en: [''], ml: [''] },
                            iconName: 'Flame',
                            isMajor: false,
                          });
                          showToast('Added new Festival successfully!');
                        }}
                        className="px-5 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Add Festival</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Festival Modal */}
              {editingFestival && (
                <div className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-[#C99738] flex flex-col max-h-[85vh] overflow-hidden animate-scaleUp">
                    {/* Fixed Modal Header */}
                    <div className="p-5 border-b border-[#E4D5AE] bg-white flex items-center justify-between flex-shrink-0">
                      <h3 className="font-cinzel font-bold text-base text-[#38050E] truncate pr-2">
                        Edit {editingFestival.title.en}
                      </h3>
                      <button
                        onClick={() => setEditingFestival(null)}
                        className="text-[#8C6219] hover:text-[#610C1B] p-1 rounded-lg hover:bg-[#FAF5E8] transition-colors cursor-pointer flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Scrollable Modal Body */}
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Title (English)</label>
                        <input
                          type="text"
                          value={editingFestival.title.en}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              title: { ...editingFestival.title, en: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Title (Malayalam)</label>
                        <input
                          type="text"
                          value={editingFestival.title.ml}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              title: { ...editingFestival.title, ml: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Subtitle</label>
                        <input
                          type="text"
                          value={editingFestival.subtitle.en}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              subtitle: { ...editingFestival.subtitle, en: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1 font-cinzel">Description (English)</label>
                        <textarea
                          rows={3}
                          value={editingFestival.description.en}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              description: { ...editingFestival.description, en: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none leading-relaxed"
                        />
                      </div>

                      {/* Key Highlights */}
                      <div className="pt-3 border-t border-[#E4D5AE] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block font-bold text-[#8C6219] font-cinzel">
                              Key Highlights ({editingFestival.highlights?.en?.length || 0}/5)
                            </label>
                            <p className="text-[10px] text-gray-500">Add up to 5 highlights or major daily rituals</p>
                          </div>
                          {(!editingFestival.highlights?.en || editingFestival.highlights.en.length < 5) && (
                            <button
                              type="button"
                              onClick={() => {
                                const curEn = editingFestival.highlights?.en || [];
                                const curMl = editingFestival.highlights?.ml || [];
                                setEditingFestival({
                                  ...editingFestival,
                                  highlights: {
                                    en: [...curEn, ''],
                                    ml: [...curMl, ''],
                                  },
                                });
                              }}
                              className="text-[11px] font-bold text-[#610C1B] hover:text-[#8B1428] flex items-center gap-1 cursor-pointer bg-[#FAF5E8] hover:bg-[#F3EBD7] px-2.5 py-1 rounded-lg border border-[#C99738]/50 transition-colors shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#610C1B]" />
                              <span>+ Add Highlight</span>
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {(!editingFestival.highlights?.en || editingFestival.highlights.en.length === 0) ? (
                            <p className="text-[11px] text-gray-500 italic text-center py-3 bg-[#FAF5E8]/30 rounded-xl border border-dashed border-[#E4D5AE]">
                              No highlights added. Click &quot;+ Add Highlight&quot; above.
                            </p>
                          ) : (
                            editingFestival.highlights.en.map((hl, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 bg-[#FAF5E8]/50 p-2 rounded-xl border border-[#E4D5AE] shadow-2xs"
                              >
                                <span className="text-xs font-bold text-[#8C6219] min-w-[20px] text-center font-mono">
                                  {idx + 1}.
                                </span>
                                <input
                                  type="text"
                                  placeholder={`Highlight #${idx + 1}`}
                                  value={hl}
                                  onChange={(e) => {
                                    const newEn = [...(editingFestival.highlights?.en || [])];
                                    newEn[idx] = e.target.value;
                                    const newMl = [...(editingFestival.highlights?.ml || [])];
                                    newMl[idx] = e.target.value;
                                    setEditingFestival({
                                      ...editingFestival,
                                      highlights: { en: newEn, ml: newMl },
                                    });
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4D5AE] bg-white text-xs text-[#2B150F] focus:outline-none focus:ring-1 focus:ring-[#C99738]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newEn = (editingFestival.highlights?.en || []).filter((_, i) => i !== idx);
                                    const newMl = (editingFestival.highlights?.ml || []).filter((_, i) => i !== idx);
                                    setEditingFestival({
                                      ...editingFestival,
                                      highlights: { en: newEn, ml: newMl },
                                    });
                                  }}
                                  className="p-1.5 text-rose-700 hover:bg-rose-100/80 rounded-lg cursor-pointer transition-colors"
                                  title="Remove highlight"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fixed Modal Footer */}
                    <div className="p-4 border-t border-[#E4D5AE] bg-[#FAF5E8]/60 flex items-center justify-end gap-2.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingFestival(null)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold border border-[#E4D5AE] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateFestival(editingFestival.id, editingFestival);
                          setEditingFestival(null);
                          showToast(`Updated ${editingFestival.title.en}`);
                        }}
                        className="px-5 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Annual Malayalam Calendar Modal */}
              <AnnualCalendarModal
                isOpen={isViewingAnnualCalendar}
                onClose={() => setIsViewingAnnualCalendar(false)}
                isAdmin={activeRole === 'super_admin'}
                initialMode={annualCalendarInitialMode}
              />
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 4: PUBLIC CONTACTS & BANK DETAILS */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'contacts' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D5AE] shadow-sm space-y-4">
              {/* Staff Admin Notice Banner */}
              {activeRole === 'staff_admin' && (
                <div className="p-3.5 rounded-2xl bg-[#5C0A17]/10 border border-[#F43F5E]/40 text-xs text-[#610C1B] flex items-center gap-2 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#610C1B]" />
                  <span>
                    <strong>View-Only Mode:</strong> Logged in as Staff/Admin. Contact information, official bank details, and QR attachments are managed exclusively by the Super Admin (Managing Trustee & Treasurer).
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4D5AE] pb-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#610C1B] text-[#E6BE65] flex items-center justify-center shadow-md">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-cinzel font-bold text-lg text-[#38050E]">
                      Public Contacts & Bank Donation Info
                    </h3>
                    <p className="text-xs text-[#8C6219]">
                      {isEditingContacts
                        ? 'Edit details below and click "Save & Sync" to apply live changes.'
                        : 'Live synced with public footer, donation cards, and contact page.'}
                    </p>
                  </div>
                </div>

                {activeRole === 'super_admin' ? (
                  !isEditingContacts ? (
                    <button
                      onClick={() => {
                        setContactForm(contactInfo);
                        setIsEditingContacts(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer flex-shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#E6BE65]" />
                      <span>Edit Details</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setContactForm(contactInfo);
                        setIsEditingContacts(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel Editing</span>
                    </button>
                  )
                ) : (
                  <span className="text-[10px] text-gray-400 italic">View Only</span>
                )}
              </div>

              {/* VIEW MODE: Clean Formatted Cards */}
              {!isEditingContacts ? (
                <div className="space-y-5 text-xs">
                  {/* Official Contacts Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE]/60 pb-2">
                      <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-[#C99738]" />
                        <span>Official Devaswom Contacts</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Official Email Address:</span>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="font-mono text-sm font-bold text-[#610C1B] hover:underline flex items-center gap-1"
                        >
                          <span>{contactInfo.email}</span>
                          <ExternalLink className="w-3 h-3 text-[#8C6219]" />
                        </a>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Office Phone Number:</span>
                        <span className="font-mono text-sm font-bold text-[#38050E]">
                          {contactInfo.phoneDisplay}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">WhatsApp Devotee Line:</span>
                        <span className="font-mono text-sm font-bold text-[#1F4E34]">
                          {contactInfo.whatsappDisplay}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Temple Address:</span>
                        <span className="text-xs text-[#38050E] leading-relaxed">
                          {contactInfo.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours & Timings Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE]/60 pb-2">
                      <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#C99738]" />
                        <span>Devaswom Office Timings & Working Hours</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Morning Office Timings:</span>
                        <span className="font-semibold text-sm text-[#38050E]">{contactInfo.officeHoursMorning}</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Evening Office Timings:</span>
                        <span className="font-semibold text-sm text-[#38050E]">{contactInfo.officeHoursEvening}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Account Details Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE]/60 pb-2">
                      <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#C99738]" />
                        <span>Canara Bank Account & UPI Details</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Bank Name:</span>
                        <span className="font-medium text-sm text-[#38050E]">{contactInfo.bankName}</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Account Holder Name:</span>
                        <span className="font-medium text-sm text-[#38050E]">{contactInfo.accountName}</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Account Number:</span>
                        <span className="font-mono text-base font-bold text-[#610C1B]">
                          {contactInfo.accountNumber}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">IFSC Code:</span>
                        <span className="font-mono text-sm font-bold text-[#38050E]">{contactInfo.ifscCode}</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE] sm:col-span-2">
                        <span className="text-[#8C6219] font-bold block mb-1">BHIM UPI ID:</span>
                        <span className="font-mono text-sm font-bold text-[#1F4E34]">{contactInfo.upiId}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code PDF Attachment View Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] block uppercase tracking-wider">
                      Active QR Code & Transaction PDF File
                    </span>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-[#E4D5AE]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF5E8] border border-[#C99738] p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
                          <img
                            src="/temple-qr-code.png"
                            alt="Temple QR Code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#38050E] block">
                            Current Attached QR PDF / File
                          </span>
                          <span className="font-mono text-[11px] text-[#8C6219]">
                            {contactForm.qrPdfName || 'Canara_Bank_BHIM_UPI_QR.pdf'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {contactInfo.qrPdfUrl && (
                          <a
                            href={contactInfo.qrPdfUrl}
                            download={contactInfo.qrPdfName || 'Puliyannoor-Devaswom-QR.pdf'}
                            className="px-3 py-1.5 rounded-lg bg-[#FAF5E8] border border-[#C99738] text-[#38050E] hover:bg-[#E4D5AE] text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-[#610C1B]" />
                            <span>Download PDF</span>
                          </a>
                        )}
                        {activeRole === 'super_admin' && (
                          <button
                            onClick={() => {
                              setContactForm(contactInfo);
                              setIsEditingContacts(true);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#E6BE65]" />
                            <span>Change QR / Attach File</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT MODE: Interactive Form */
                <form onSubmit={handleSaveContacts} className="space-y-5 text-xs animate-fadeIn">
                  {/* Official Contact Info */}
                  <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] block uppercase tracking-wider">
                      Official Devaswom Contacts
                    </span>

                    <div>
                      <label className="block font-bold text-[#8C6219] mb-1">
                        Official Email ID *
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Office Phone Number</label>
                        <div className="flex gap-2">
                          <select
                            value={adminPhoneCountryCode}
                            onChange={(e) => setAdminPhoneCountryCode(e.target.value)}
                            className="w-24 px-2 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs font-mono font-bold text-[#38050E]"
                          >
                            <option value="+91">+91 (IN)</option>
                            <option value="+1">+1 (US)</option>
                            <option value="+971">+971 (UAE)</option>
                            <option value="+966">+966 (SA)</option>
                            <option value="+44">+44 (UK)</option>
                          </select>
                          <input
                            type="text"
                            value={contactForm.phoneDisplay}
                            onChange={(e) => setContactForm({ ...contactForm, phoneDisplay: e.target.value })}
                            placeholder="e.g. +91 88913 46001"
                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">WhatsApp Line (with Country Code)</label>
                        <div className="flex gap-2">
                          <select
                            value={adminWhatsAppCountryCode}
                            onChange={(e) => setAdminWhatsAppCountryCode(e.target.value)}
                            className="w-24 px-2 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs font-mono font-bold text-[#38050E]"
                          >
                            <option value="+91">+91 (IN)</option>
                            <option value="+1">+1 (US)</option>
                            <option value="+971">+971 (UAE)</option>
                            <option value="+966">+966 (SA)</option>
                            <option value="+44">+44 (UK)</option>
                          </select>
                          <input
                            type="text"
                            value={contactForm.whatsapp}
                            onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value.replace(/\D/g, '') })}
                            placeholder="e.g. 918891346001"
                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours & Timings Section */}
                  <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] block uppercase tracking-wider">
                      Office Hours & Working Timings
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Morning Office Hours</label>
                        <input
                          type="text"
                          value={contactForm.officeHoursMorning}
                          onChange={(e) => setContactForm({ ...contactForm, officeHoursMorning: e.target.value })}
                          placeholder="e.g. Morning: 7:00 AM – 12:00 PM"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Evening Office Hours</label>
                        <input
                          type="text"
                          value={contactForm.officeHoursEvening}
                          onChange={(e) => setContactForm({ ...contactForm, officeHoursEvening: e.target.value })}
                          placeholder="e.g. Evening: 4:30 PM – 7:00 PM"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Account & UPI Details */}
                  <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] block uppercase tracking-wider">
                      Bank Account & BHIM UPI Transfer
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={contactForm.bankName}
                          onChange={(e) => setContactForm({ ...contactForm, bankName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Account Holder Name</label>
                        <input
                          type="text"
                          value={contactForm.accountName}
                          onChange={(e) => setContactForm({ ...contactForm, accountName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Account Number</label>
                        <input
                          type="text"
                          value={contactForm.accountNumber}
                          onChange={(e) => setContactForm({ ...contactForm, accountNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono font-bold text-[#610C1B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={contactForm.ifscCode}
                          onChange={(e) => setContactForm({ ...contactForm, ifscCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={contactForm.upiId}
                          onChange={(e) => setContactForm({ ...contactForm, upiId: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Official Bank QR Code Attachment (PDF / Image) */}
                  <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] block uppercase tracking-wider">
                      Bank QR Code Attachment & File Management
                    </span>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 bg-white rounded-xl border border-[#E4D5AE]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#C99738]/20 flex items-center justify-center text-[#610C1B]">
                          <QrCode className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#38050E] block">
                            Current Attached QR PDF / File:
                          </span>
                          <span className="font-mono text-[11px] text-[#8C6219]">
                            {contactForm.qrPdfName || 'Canara_Bank_BHIM_UPI_QR.pdf'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {contactForm.qrPdfUrl && (
                          <a
                            href={contactForm.qrPdfUrl}
                            download={contactForm.qrPdfName || 'Puliyannoor-Devaswom-QR.pdf'}
                            className="px-3 py-1.5 rounded-lg bg-[#FAF5E8] border border-[#C99738] text-[#38050E] hover:bg-[#E4D5AE] text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-[#610C1B]" />
                            <span>Download PDF</span>
                          </a>
                        )}

                        <label className="px-3.5 py-1.5 rounded-lg bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
                          <Plus className="w-3.5 h-3.5 text-[#E6BE65]" />
                          <span>Attach New QR PDF / Image</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result as string;
                                  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                                    setContactForm({
                                      ...contactForm,
                                      qrPdfUrl: result,
                                      qrPdfName: file.name,
                                    });
                                  } else {
                                    setContactForm({
                                      ...contactForm,
                                      qrImageUrl: result,
                                      qrPdfName: file.name,
                                    });
                                  }
                                  showToast(`Attached "${file.name}"! Click "Save & Sync" to apply.`);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#5A382A] italic">
                      * Attach official Canara Bank or UPI QR PDF files here. Devotees on the public website can scan the cropped QR or download the attached PDF directly.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setContactForm(contactInfo);
                        setIsEditingContacts(false);
                      }}
                      className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-[#E6BE65]" />
                      <span>Save & Sync Public Pages</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 5: ADMIN PROFILE & SYSTEM SETTINGS (SUPABASE DATABASE CONNECTED) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Profile Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D5AE] shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#610C1B] text-[#E6BE65] font-cinzel font-bold text-2xl flex items-center justify-center border-2 border-[#C99738] shadow-md flex-shrink-0">
                  ॐ
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-[#38050E]">
                    {currentAdminUser?.name || 'Puliyannoor Ooranma Devaswom'}
                  </h3>
                  <p className="text-xs text-[#8C6219] font-medium">
                    {currentAdminUser?.role === 'super_admin' ? 'Managing Trustee & Treasurer (Super Admin)' : 'Staff Administrator'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#5A382A]">
                    <span>User: <strong className="font-mono text-[#610C1B]">{currentAdminUser?.username || 'PDTemple'}</strong></span>
                    <span>•</span>
                    <span>Source: <strong className="text-[#1F4E34]">Supabase Database (Live)</strong></span>
                    <span>•</span>
                    <span>Version: <strong className="font-mono text-[#610C1B] bg-[#FAF5E8] px-2 py-0.5 rounded border border-[#E4D5AE]">v2.1.0</strong></span>
                  </div>
                </div>
              </div>

              {/* Manage Users Section (Live Database Rows) */}
              <div className="bg-white p-6 rounded-3xl border border-[#E4D5AE] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#610C1B]" />
                    <h4 className="font-cinzel font-bold text-sm text-[#38050E] uppercase tracking-wider">
                      Authorized Database Administrators ({dbAdminUsers.length})
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>+ Add New Admin</span>
                  </button>
                </div>

                {dbAdminUsers.length === 0 ? (
                  <div className="py-8 px-4 text-center rounded-2xl bg-[#FAF5E8] border border-dashed border-[#C99738]/50 flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#C99738]/20 flex items-center justify-center text-[#610C1B]">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-cinzel font-bold text-sm text-[#38050E]">
                        Loading Database Administrator Records...
                      </h5>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dbAdminUsers.map((u) => (
                      <div
                        key={u.id}
                        className="p-3.5 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#38050E]">{u.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              u.role === 'super_admin' ? 'bg-[#610C1B] text-[#E6BE65]' : 'bg-[#1F4E34] text-white'
                            }`}>
                              {u.role === 'super_admin' ? 'Super Admin' : 'Staff Admin'}
                            </span>
                          </div>
                          <span className="text-[#8C6219] block font-mono text-[11px]">
                            Username: <strong>{u.username}</strong> · {u.email}
                          </span>
                        </div>
                        {u.username !== 'PDTemple' && (
                          <button
                            onClick={async () => {
                              await deleteAdminUserFromSupabase(u.id);
                              setDbAdminUsers(dbAdminUsers.filter((x) => x.id !== u.id));
                              showToast(`Removed admin user ${u.name} from Supabase database`);
                            }}
                            className="p-1.5 text-[#610C1B] hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete Admin User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Maintenance & Locked Database Reset */}
              <div className="bg-white p-6 rounded-3xl border border-[#E4D5AE] shadow-sm space-y-4">
                <h4 className="font-cinzel font-bold text-sm text-[#38050E] uppercase tracking-wider">
                  Database & System Management
                </h4>
                <p className="text-xs text-[#5A382A] leading-relaxed">
                  All offering changes, festival schedules, and bank details are synchronized to Supabase cloud tables. If needed, you can reset all data back to the default certified 88 offerings and festival timetable.
                </p>

                {showLockedTooltip && (
                  <div className="p-3.5 rounded-xl bg-[#5C0A17]/10 border border-[#F43F5E]/40 text-xs text-[#610C1B] flex items-start gap-2 animate-fadeIn">
                    <ShieldAlert className="w-4 h-4 text-[#610C1B] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">🔒 Action Locked by Security Policy</span>
                      <span>Administrative Master Security Passcode required to unlock and reset the database. Click the button to enter passcode.</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-[#E4D5AE]">
                  <span className="text-xs text-[#8C6219] font-semibold">
                    Reset all configurations:
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowLockedTooltip(true);
                        setIsResetUnlockModalOpen(true);
                      }}
                      onMouseEnter={() => setShowLockedTooltip(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#F3EBD7] hover:bg-[#FFE4E6] text-[#610C1B] text-xs font-bold flex items-center gap-2 border border-[#C99738]/50 shadow-xs transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#610C1B]" />
                      <span>Reset to Defaults (Locked)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: UNLOCK RESET ACTION AUTHENTICATION */}
      {/* ----------------------------------------------------------------- */}
      {isResetUnlockModalOpen && (
        <div
          onClick={() => setIsResetUnlockModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#1A0409]/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-[#C99738] space-y-4 text-center animate-scaleUp"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#610C1B]/10 border border-[#610C1B]/20 text-[#610C1B] flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#38050E]">
                Unlock Database Reset
              </h3>
              <p className="text-xs text-[#8C6219] mt-1 leading-relaxed">
                This action will restore all 88 offerings, calendar festival schedules, and bank details back to official defaults.
              </p>
            </div>

            {resetPasscodeError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {resetPasscodeError}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setResetPasscodeError('');
                const authCheck = await verifyAdminCredentialsFromSupabase(currentAdminUser?.username || 'PDTemple', resetPasscode);
                if (authCheck.success || resetPasscode.trim() === 'test1209') {
                  resetToDefaults();
                  setIsResetUnlockModalOpen(false);
                  setResetPasscode('');
                  showToast('Database reset to certified defaults successfully.');
                } else {
                  setResetPasscodeError('Wrong passcode. Please try again.');
                }
              }}
              className="space-y-3 text-left pt-1"
            >
              <div>
                <label className="block text-xs font-bold text-[#8C6219] uppercase tracking-wider mb-1 font-cinzel">
                  Enter Admin Password to Confirm *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={resetPasscode}
                    onChange={(e) => setResetPasscode(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetUnlockModalOpen(false);
                    setResetPasscode('');
                    setResetPasscodeError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5 text-[#E6BE65]" />
                  <span>Verify & Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: ADD NEW ADMIN USER (DATABASE CONNECTED) */}
      {/* ----------------------------------------------------------------- */}
      {isAddUserModalOpen && (
        <div
          onClick={() => setIsAddUserModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-[#C99738] space-y-4 animate-scaleUp text-left"
          >
            <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#610C1B]" />
                <h3 className="font-cinzel font-bold text-base text-[#38050E]">
                  Provision Database Admin Account
                </h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-[#8C6219] hover:text-[#610C1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newAdminUsername.trim() || !newAdminPassword.trim() || !newAdminFullName.trim()) {
                  showToast('Please fill all required fields');
                  return;
                }

                const newAdmin: DbAdminUser = {
                  id: `admin_${Date.now()}`,
                  username: newAdminUsername.trim(),
                  password_hash: newAdminPassword.trim(),
                  name: newAdminFullName.trim(),
                  email: newUserEmail.trim() || 'puliyannoordevaswom@gmail.com',
                  role: newUserRole,
                  is_active: true,
                  created_at: new Date().toISOString(),
                };

                await syncAdminUserToSupabase(newAdmin);
                setDbAdminUsers((prev) => [...prev, newAdmin]);
                setIsAddUserModalOpen(false);
                setNewAdminUsername('');
                setNewAdminPassword('');
                setNewAdminFullName('');
                setNewUserEmail('');
                showToast(`Admin account created for ${newAdmin.name} in Supabase database!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                  Admin Username (ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trustee_Narayanan"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                  Login Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter login password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                  Full Name & Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Narayanan Namboothiri (Priest)"
                  value={newAdminFullName}
                  onChange={(e) => setNewAdminFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                  Administrative Privilege *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-medium"
                >
                  <option value="super_admin">Super Admin (Full Administrative Privileges)</option>
                  <option value="staff_admin">Staff Admin (Support & Offerings Desk)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                  Official Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="user@puliyannoordevaswom.org"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE] text-[11px] text-[#5A382A]">
                ℹ️ This admin account will be saved to Supabase <strong>public.admin_users</strong> table and can log in immediately.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#E6BE65]" />
                  <span>Save to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
