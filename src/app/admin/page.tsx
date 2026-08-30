'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useContent, ChatConversation, TempleContactInfo } from '../../context/ContentContext';
import { OfferingItem, FestivalEvent, OfferingCategory, OfferingItemCategory } from '../../types';
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
} from 'lucide-react';

type AdminTab = 'chats' | 'offerings' | 'festivals' | 'contacts' | 'profile';

export default function AdminPage() {
  const {
    offerings,
    festivals,
    contactInfo,
    chats,
    addOffering,
    updateOffering,
    deleteOffering,
    addFestival,
    updateFestival,
    deleteFestival,
    updateContactInfo,
    sendMessage,
    markChatAsRead,
    updateChatStatus,
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

  // Chat State
  const [selectedChatId, setSelectedChatId] = useState<string>(chats[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'active' | 'resolved' | 'pending'>('all');
  const [chatSearch, setChatSearch] = useState('');

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

  // Festivals State
  const [editingFestival, setEditingFestival] = useState<FestivalEvent | null>(null);
  const [isAddingFestival, setIsAddingFestival] = useState(false);

  // Contacts Form State
  const [contactForm, setContactForm] = useState<TempleContactInfo>(contactInfo);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [contactSaveStatus, setContactSaveStatus] = useState(false);

  // Database Reset Authentication State
  const [isResetUnlockModalOpen, setIsResetUnlockModalOpen] = useState(false);
  const [resetPasscode, setResetPasscode] = useState('');
  const [resetPasscodeError, setResetPasscodeError] = useState('');
  const [showLockedTooltip, setShowLockedTooltip] = useState(false);

  // Manage Users State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Melsanthi / Chief Priest');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [customAdminUsers, setCustomAdminUsers] = useState<
    { id: string; name: string; role: string; email: string; dateAdded: string }[]
  >([]);

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('puliyannoor_admin_session');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setContactForm(contactInfo);
  }, [contactInfo]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Dummy credentials requested: PDTemple & test1209
    if (username.trim() === 'PDTemple' && password.trim() === 'test1209') {
      setIsAuthenticated(true);
      sessionStorage.setItem('puliyannoor_admin_session', 'true');
      showToast('Welcome to Puliyannoor Devaswom Admin Panel');
    } else {
      setAuthError('Wrong username/password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('puliyannoor_admin_session');
    setUsername('');
    setPassword('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId) return;
    sendMessage(selectedChatId, replyText);
    setReplyText('');
    showToast('Reply sent to devotee');
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId) || chats[0];

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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-[#FAF5E8] font-bold text-sm tracking-wider uppercase shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#E6BE65]" />
                  <span>Sign In to Admin Portal</span>
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
                  onClick={() => setAuthMode('login')}
                  className="w-full py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-[#FAF5E8] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
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
    <div className="min-h-screen bg-[#F3EBD7] text-[#2B150F] flex flex-col md:flex-row">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#1F4E34] text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-[#A7F3D0]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-[#1A0409] text-[#FAF5E8] flex flex-col justify-between border-r border-[#C99738]/30 flex-shrink-0">
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
      <main className="flex-1 flex flex-col overflow-hidden bg-[#FAF5E8]">
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

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F4E34]/10 text-[#1F4E34] text-xs font-bold border border-[#1F4E34]/30">
              <span className="w-2 h-2 rounded-full bg-[#1F4E34] animate-pulse" />
              <span>Live Synced with Public Site</span>
            </span>

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

              {/* Right Column: Google Chat Style Conversation Thread */}
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

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedChat.status}
                        onChange={(e) =>
                          updateChatStatus(
                            selectedChat.id,
                            e.target.value as 'active' | 'resolved' | 'pending'
                          )
                        }
                        className="text-xs font-bold px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-[#38050E] cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF5E8]/20">
                    {selectedChat.messages.map((msg) => {
                      const isAdmin = msg.sender === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                              isAdmin
                                ? 'bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-white rounded-br-none'
                                : 'bg-white border border-[#E4D5AE] text-[#2B150F] rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-80">
                              <span className="font-bold">
                                {isAdmin ? 'Devaswom Office' : selectedChat.devoteeName}
                              </span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <p className="font-normal whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

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
                      placeholder="Type official Devaswom reply message..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#E4D5AE] bg-white text-xs text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#E6BE65]" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#8C6219]">
                  Select an inquiry thread from the left list.
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 2: OFFERINGS / VAZHIPADU RATE MANAGER */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'offerings' && (
            <div className="space-y-4">
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

                <button
                  onClick={() => setIsAddingOffering(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#E6BE65]" />
                  <span>Add New Vazhipadu</span>
                </button>
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
                  <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border-2 border-[#C99738] space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-3">
                      <h3 className="font-cinzel font-bold text-base text-[#38050E]">
                        Edit Vazhipadu #{editingOffering.slNo}
                      </h3>
                      <button
                        onClick={() => setEditingOffering(null)}
                        className="text-[#8C6219] hover:text-[#610C1B]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Malayalam Name</label>
                        <input
                          type="text"
                          value={editingOffering.name.ml}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              name: { ...editingOffering.name, ml: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">English Name</label>
                        <input
                          type="text"
                          value={editingOffering.name.en}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              name: { ...editingOffering.name, en: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1">Price (₹)</label>
                          <input
                            type="number"
                            value={editingOffering.price}
                            onChange={(e) =>
                              setEditingOffering({
                                ...editingOffering,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C6219] mb-1">Category</label>
                          <select
                            value={editingOffering.category}
                            onChange={(e) =>
                              setEditingOffering({
                                ...editingOffering,
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
                        <label className="block font-bold text-[#8C6219] mb-1">Description (English)</label>
                        <textarea
                          rows={2}
                          value={editingOffering.description.en}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              description: { ...editingOffering.description, en: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Significance / Benefits</label>
                        <textarea
                          rows={2}
                          value={editingOffering.significance.en}
                          onChange={(e) =>
                            setEditingOffering({
                              ...editingOffering,
                              significance: { ...editingOffering.significance, en: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#E4D5AE]">
                      <button
                        onClick={() => setEditingOffering(null)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateOffering(editingOffering.id, editingOffering);
                          setEditingOffering(null);
                          showToast(`Updated ${editingOffering.name.en} successfully!`);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#610C1B] text-white text-xs font-bold flex items-center gap-1.5"
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
          {/* TAB 3: CALENDAR & FESTIVALS EDITOR */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'festivals' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-[#E4D5AE] shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-sm text-[#38050E]">
                    Annual Calendar Events ({festivals.length})
                  </h3>
                  <p className="text-xs text-[#8C6219]">
                    Manage 2027 festival dates, countdowns, and rituals.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {festivals.map((fest) => (
                  <div
                    key={fest.id}
                    className="p-5 rounded-2xl bg-white border border-[#E4D5AE] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#610C1B]/10 text-[#610C1B] text-[10px] font-bold">
                          {fest.malayalamMonth.en}
                        </span>
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
                      <p className="text-xs text-[#5A382A] line-clamp-3 mb-3">
                        {fest.description.en}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E4D5AE] flex items-center justify-between">
                      <div className="text-[11px] text-[#1F4E34] font-semibold">
                        ✓ {fest.highlights.en.length} highlights
                      </div>
                      <button
                        onClick={() => setEditingFestival(fest)}
                        className="px-3 py-1 rounded-lg bg-[#F3EBD7] text-[#610C1B] hover:bg-[#610C1B] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Event</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Festival Modal */}
              {editingFestival && (
                <div className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border-2 border-[#C99738] space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-3">
                      <h3 className="font-cinzel font-bold text-base text-[#38050E]">
                        Edit {editingFestival.title.en}
                      </h3>
                      <button
                        onClick={() => setEditingFestival(null)}
                        className="text-[#8C6219] hover:text-[#610C1B]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Title (English)</label>
                        <input
                          type="text"
                          value={editingFestival.title.en}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              title: { ...editingFestival.title, en: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Title (Malayalam)</label>
                        <input
                          type="text"
                          value={editingFestival.title.ml}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              title: { ...editingFestival.title, ml: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Date & Month Note</label>
                        <input
                          type="text"
                          value={editingFestival.subtitle.en}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              subtitle: { ...editingFestival.subtitle, en: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Description (English)</label>
                        <textarea
                          rows={3}
                          value={editingFestival.description.en}
                          onChange={(e) =>
                            setEditingFestival({
                              ...editingFestival,
                              description: { ...editingFestival.description, en: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#E4D5AE]">
                      <button
                        onClick={() => setEditingFestival(null)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateFestival(editingFestival.id, editingFestival);
                          setEditingFestival(null);
                          showToast(`Updated ${editingFestival.title.en}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#610C1B] text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 4: PUBLIC CONTACTS & BANK DETAILS */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'contacts' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D5AE] shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4D5AE] pb-4 mb-6">
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

                {!isEditingContacts ? (
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

                  {/* Bank Account Details Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE]/60 pb-2">
                      <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#C99738]" />
                        <span>Bank Account & BHIM UPI Transfer Details</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Bank Name & Branch:</span>
                        <span className="text-sm font-bold text-[#38050E]">
                          {contactInfo.bankName} · {contactInfo.bankBranch}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Account Holder Name:</span>
                        <span className="text-sm font-bold text-[#38050E]">
                          {contactInfo.accountName}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">Account Number:</span>
                        <span className="font-mono text-base font-extrabold text-[#610C1B]">
                          {contactInfo.accountNumber}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE]">
                        <span className="text-[#8C6219] font-bold block mb-1">IFSC Code:</span>
                        <span className="font-mono text-base font-bold text-[#38050E]">
                          {contactInfo.ifscCode}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E4D5AE] sm:col-span-2">
                        <span className="text-[#8C6219] font-bold block mb-1">Official UPI ID (VPA):</span>
                        <span className="font-mono text-sm font-bold text-[#1A0409]">
                          {contactInfo.upiId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code & PDF File Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF5E8] border border-[#E4D5AE] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E4D5AE]/60 pb-2">
                      <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#C99738]" />
                        <span>Official Bank QR Code & Attachment</span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E4D5AE]">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-xl bg-white border border-[#E4D5AE] p-1 flex items-center justify-center shadow-xs">
                          <img
                            src={contactInfo.qrImageUrl || '/temple-qr-code.png'}
                            alt="QR Code Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#38050E] block">
                            Active QR Code Asset & PDF
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
                        <input
                          type="text"
                          value={contactForm.phoneDisplay}
                          onChange={(e) => setContactForm({ ...contactForm, phoneDisplay: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">WhatsApp Number (with country code)</label>
                        <input
                          type="text"
                          value={contactForm.whatsapp}
                          onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm font-mono"
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
          {/* TAB 5: ADMIN PROFILE & SYSTEM SETTINGS */}
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
                    Puliyannoor Ooranma Devaswom
                  </h3>
                  <p className="text-xs text-[#8C6219] font-medium">
                    Managing Trustee & Treasurer Administrator Account
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#5A382A]">
                    <span>User: <strong className="font-mono text-[#610C1B]">PDTemple</strong></span>
                    <span>•</span>
                    <span>Status: <strong className="text-[#1F4E34]">Authenticated (Session Active)</strong></span>
                  </div>
                </div>
              </div>

              {/* Manage Users Section (Empty State) */}
              <div className="bg-white p-6 rounded-3xl border border-[#E4D5AE] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#610C1B]" />
                    <h4 className="font-cinzel font-bold text-sm text-[#38050E] uppercase tracking-wider">
                      Manage Authorized Administrative Users
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>+ Add New Admin User</span>
                  </button>
                </div>

                {customAdminUsers.length === 0 ? (
                  <div className="py-8 px-4 text-center rounded-2xl bg-[#FAF5E8] border border-dashed border-[#C99738]/50 flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#C99738]/20 flex items-center justify-center text-[#610C1B]">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-cinzel font-bold text-sm text-[#38050E]">
                        No Additional Administrative Users Added Yet
                      </h5>
                      <p className="text-xs text-[#8C6219] max-w-md mx-auto mt-1 leading-relaxed">
                        Currently, only the primary Managing Trustee & Treasurer account (<strong>PDTemple</strong>) has active administrative privileges.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddUserModalOpen(true)}
                      className="text-xs font-bold text-[#610C1B] hover:text-[#8B1428] underline underline-offset-2 cursor-pointer"
                    >
                      Click here to invite a priest or committee clerk
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {customAdminUsers.map((u) => (
                      <div
                        key={u.id}
                        className="p-3.5 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#38050E] block">{u.name}</span>
                          <span className="text-[#8C6219]">{u.role} · {u.email}</span>
                        </div>
                        <button
                          onClick={() => {
                            setCustomAdminUsers(customAdminUsers.filter((x) => x.id !== u.id));
                            showToast(`Removed user ${u.name}`);
                          }}
                          className="p-1 text-[#610C1B] hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                  All offering changes, festival schedules, and bank details are synchronized to the local state storage. If needed, you can reset all data back to the default certified 88 offerings and festival timetable.
                </p>

                {/* Locked Tooltip Notice Banner */}
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
              onSubmit={(e) => {
                e.preventDefault();
                setResetPasscodeError('');
                if (resetPasscode.trim() === 'test1209' || resetPasscode.trim() === 'PDTemple') {
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
                  Enter Master Security Passcode *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Enter security passcode"
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
      {/* MODAL: ADD NEW ADMIN USER */}
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
                  Provision Admin Account
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
              onSubmit={(e) => {
                e.preventDefault();
                if (!newUserName.trim()) return;
                const newUser = {
                  id: `user_${Date.now()}`,
                  name: newUserName.trim(),
                  role: newUserRole,
                  email: newUserEmail.trim() || 'Not provided',
                  dateAdded: new Date().toLocaleDateString('en-IN'),
                };
                setCustomAdminUsers([...customAdminUsers, newUser]);
                setIsAddUserModalOpen(false);
                setNewUserName('');
                setNewUserEmail('');
                showToast(`Administrative account created for ${newUser.name}!`);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                  User Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Narayanan Namboothiri"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8C6219] mb-1 font-cinzel uppercase">
                  Administrative Role *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm"
                >
                  <option value="Melsanthi / Chief Priest">Melsanthi / Chief Priest (മേൽശാന്തി)</option>
                  <option value="Devaswom Office Clerk">Devaswom Office Clerk (ഓഫീസ് ക്ലർക്ക്)</option>
                  <option value="Trustee Board Member">Trustee Board Member (ട്രസ്റ്റി അംഗം)</option>
                  <option value="Auditor / Accountant">Auditor / Accountant (കണക്കപ്പിള്ള)</option>
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
                ℹ️ This provisions local administrative role permissions. Ready for cloud auth synchronization.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#E6BE65]" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
