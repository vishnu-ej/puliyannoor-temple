'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { MuralDivider } from './MuralDivider';
import { LiveStatusBadge } from './LiveStatusBadge';
import { AudioPlayer } from './AudioPlayer';
import { Menu, X, Sparkles, ChevronRight, PhoneCall, User, LogOut, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated, openAuthModal, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [adminData, setAdminData] = useState<{ username?: string; name?: string; role?: string } | null>(null);

  useEffect(() => {
    const updateAdminStatus = () => {
      const isAuth = sessionStorage.getItem('puliyannoor_admin_session') === 'true';
      const user = sessionStorage.getItem('puliyannoor_admin_user');
      setIsAdminSession(isAuth);
      if (user) {
        try {
          setAdminData(JSON.parse(user));
        } catch {}
      }
    };
    updateAdminStatus();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { href: '/', labelKey: 'nav_home' },
    { href: '/about', labelKey: 'nav_about' },
    { href: '/timings', labelKey: 'nav_timings' },
    { href: '/offerings', labelKey: 'nav_offerings' },
    { href: '/events', labelKey: 'nav_events' },
    { href: '/visit', labelKey: 'nav_visit' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-lg bg-[#FAF5E8] transition-all duration-200">
      {/* Top Micro-Bar */}
      <div className="bg-[#1A0409] text-[#FAF5E8] text-xs py-1 px-3 sm:px-4 border-b border-[#C99738]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <LiveStatusBadge compact />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <AudioPlayer />
            <a
              href="tel:+918891346001"
              className="hidden lg:inline-flex items-center gap-1.5 text-[#FAF5E8]/85 hover:text-[#E6BE65] transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#C99738]" />
              <span className="text-[11px] font-medium">Devaswom Office</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FAF5E8] py-1.5 sm:py-2 shadow-md border-b border-[#E4D5AE]'
            : 'bg-[#FAF5E8] py-2 sm:py-2.5 border-b border-[#E4D5AE]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 flex items-center justify-between gap-2">
          {/* LEFT: Brand Emblem & Temple Name */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group select-none flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#610C1B] to-[#1A0409] p-0.5 shadow-md flex items-center justify-center border-2 border-[#C99738] group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-[#38050E] flex items-center justify-center text-[#E6BE65] font-cinzel font-bold text-sm sm:text-base">
                  ॐ
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5 items-center justify-center rounded-full bg-[#C99738] text-[8px] sm:text-[9px] text-[#1A0409] font-bold">
                ✓
              </span>
            </div>

            <div className="flex flex-col overflow-hidden">
              <span className="font-cinzel font-bold text-xs sm:text-base md:text-lg text-[#38050E] leading-tight tracking-wide group-hover:text-[#610C1B] transition-colors truncate">
                Puliyannoor Mahadeva
              </span>
              <span className="font-malayalam-sans text-[10px] sm:text-xs text-[#8C6219] font-medium leading-tight truncate">
                പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം
              </span>
            </div>
          </Link>

          {/* RIGHT: Navigation Links + Language Toggle + Profile Icon Button */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 flex-1 pl-1">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 whitespace-nowrap">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-lg transition-all ${
                      language === 'ml'
                        ? 'text-[11px] xl:text-xs px-1.5 xl:px-2 py-1 font-malayalam-sans'
                        : 'text-xs xl:text-sm px-2 xl:px-2.5 py-1.5 font-medium'
                    } ${
                      active
                        ? 'text-[#610C1B] font-bold bg-[#610C1B]/10 shadow-xs'
                        : 'text-[#2B150F] hover:text-[#610C1B] hover:bg-[#F3EBD7]'
                    }`}
                  >
                    {t(item.labelKey)}
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#610C1B] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher Pill */}
            <div className="inline-flex rounded-full p-0.5 bg-[#F3EBD7] border border-[#E4D5AE] text-[11px] font-bold flex-shrink-0">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#610C1B] text-[#FAF5E8] shadow-xs'
                    : 'text-[#5A382A] hover:text-[#2B150F]'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ml')}
                className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'ml'
                    ? 'bg-[#610C1B] text-[#FAF5E8] shadow-xs'
                    : 'text-[#5A382A] hover:text-[#2B150F]'
                }`}
                aria-label="Switch to Malayalam"
              >
                മല
              </button>
            </div>

            {/* Profile / Admin Button (Desktop) */}
            {pathname.startsWith('/admin') && isAdminSession ? (
              <Link
                href="/admin?tab=profile"
                onClick={() => {
                  if (pathname.startsWith('/admin')) {
                    window.dispatchEvent(new CustomEvent('admin-switch-tab', { detail: 'profile' }));
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-br from-[#610C1B] to-[#38050E] border-2 border-[#C99738] text-[#E6BE65] font-cinzel font-bold text-xs shadow-md hover:scale-105 transition-transform flex-shrink-0 cursor-pointer"
                title={`Puliyannoor Devaswom Admin: ${adminData?.name || 'Managing Trustee'} - Click to view Trustee Profile & System`}
              >
                <div className="w-4 h-4 rounded-full bg-[#C99738]/30 flex items-center justify-center text-[9px] font-bold text-[#E6BE65]">
                  PT
                </div>
                <span className="hidden sm:inline text-[11px] font-bold">Admin ({adminData?.username || 'PDTemple'})</span>
              </Link>
            ) : isAuthenticated && currentUser ? (
              <Link
                href="/profile"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#610C1B] to-[#38050E] border-2 border-[#C99738] text-[#E6BE65] font-cinzel font-bold text-xs flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0 cursor-pointer"
                title={`Devotee Profile: ${currentUser.name}`}
              >
                <span>
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'ॐ'}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-[#FAF5E8] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
                title="Devotee Sign In"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-[#E6BE65]" />
                </div>
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#610C1B] hover:bg-[#F3EBD7] active:scale-95 transition-all cursor-pointer flex-shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] sm:top-[94px] bg-[#1A0409]/60 backdrop-blur-sm z-40 animate-fadeIn">
          <div className="bg-[#FAF5E8] border-b border-[#C99738]/40 shadow-2xl p-4 sm:p-6 max-h-[calc(100vh-94px)] overflow-y-auto animate-slideDown">
            <div className="space-y-1">
              {/* Profile Link in Mobile Menu */}
              {pathname.startsWith('/admin') && isAdminSession ? (
                <Link
                  href="/admin?tab=profile"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (pathname.startsWith('/admin')) {
                      window.dispatchEvent(new CustomEvent('admin-switch-tab', { detail: 'profile' }));
                    }
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#610C1B]/10 border border-[#610C1B]/20 mb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#610C1B] text-[#E6BE65] font-cinzel font-bold text-xs flex items-center justify-center border border-[#C99738]">
                      PT
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#38050E] block">
                        Admin Portal ({adminData?.username || 'PDTemple'})
                      </span>
                      <span className="text-[10px] text-[#8C6219]">Trustee Profile & System Settings</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#610C1B]" />
                </Link>
              ) : isAuthenticated && currentUser ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#610C1B]/10 border border-[#610C1B]/20 mb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#610C1B] text-[#E6BE65] font-cinzel font-bold text-xs flex items-center justify-center border border-[#C99738]">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'ॐ'}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#38050E] block">{currentUser.name}</span>
                      <span className="text-[10px] text-[#8C6219]">View Profile & Temple Chat</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#610C1B]" />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-white text-xs font-bold flex items-center justify-center gap-2 mb-3 shadow-sm cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#E6BE65]" />
                  <span>Devotee Sign In / Register</span>
                </button>
              )}

              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      language === 'ml' ? 'text-xs font-malayalam-sans' : 'text-sm font-medium'
                    } ${
                      active
                        ? 'bg-[#610C1B] text-[#FAF5E8] font-bold shadow-sm'
                        : 'text-[#2B150F] hover:bg-[#F3EBD7]'
                    }`}
                  >
                    <span>{t(item.labelKey)}</span>
                    <ChevronRight
                      className={`w-4 h-4 ${
                        active ? 'text-[#E6BE65]' : 'text-[#8C6219]/60'
                      }`}
                    />
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-[#E4D5AE] flex flex-col gap-2.5">
                <Link
                  href="/offerings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-[#FAF5E8] font-bold text-center flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-[#E6BE65]" />
                  <span className={language === 'ml' ? 'text-xs font-malayalam-sans' : 'text-sm'}>
                    {t('btn_book_vazhipadu')}
                  </span>
                </Link>

                <div className="flex items-center justify-center gap-3 text-xs text-[#8C6219] pt-1">
                  <span>Mutholy, Pala, Kottayam</span>
                  <span>•</span>
                  <span>Ooranma Devaswom</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
