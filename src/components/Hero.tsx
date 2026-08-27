'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { LiveStatusBadge } from './LiveStatusBadge';
import {
  MapPin,
  Calendar,
  Sparkles,
  Navigation,
  Star,
  ShieldCheck,
  Flame,
  Clock,
  Car,
  Landmark,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-[#1A0409]">
      {/* Background Graphic & Sacred Gradient Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0409]/80 via-[#38050E]/85 to-[#1A0409] z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[300px] sm:h-[500px] bg-gradient-to-b from-[#C99738]/20 via-[#610C1B]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Temple Silhouette SVG */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="templeGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#E6BE65" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#C99738" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1A0409" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1000" height="700" fill="#1A0409" />
          <circle cx="500" cy="320" r="280" fill="url(#templeGlow)" />
          <path
            d="M500 80 L520 180 L620 220 L600 360 L750 420 L720 620 L280 620 L250 420 L400 360 L380 220 L480 180 Z"
            fill="none"
            stroke="#E6BE65"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14 text-center text-[#FAF5E8]">
        {/* Sacred Mantra & Location Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#38050E]/80 border border-[#C99738]/50 text-[11px] sm:text-xs md:text-sm font-semibold text-[#E6BE65] shadow-lg mb-5 backdrop-blur-md animate-flame max-w-full truncate">
          <Flame className="w-3.5 h-3.5 text-[#E6BE65] flex-shrink-0" />
          <span className="tracking-widest uppercase truncate">{t('om_namah_shivaya')}</span>
          <span className="text-[#C99738]/60">•</span>
          <span className="font-normal text-[#FAF5E8]/90 truncate hidden xs:inline">{t('hero_eyebrow')}</span>
        </div>

        {/* Main Temple Name */}
        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FAF5E8] mb-2 sm:mb-3 leading-tight drop-shadow-md">
          {t('hero_title')}
        </h1>

        {/* Malayalam Sacred Title */}
        <div className="font-malayalam-serif text-base sm:text-xl md:text-2xl text-[#E6BE65] font-semibold mb-3 sm:mb-4 tracking-wide drop-shadow">
          പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം
        </div>

        {/* Popular Epithet Banner */}
        <div className="inline-block px-3.5 py-1 rounded-lg bg-[#C99738]/20 border border-[#C99738]/40 text-xs sm:text-sm md:text-base font-cinzel font-semibold text-[#F9E7B3] mb-4 sm:mb-5">
          &ldquo;{t('temple_tagline_short')}&rdquo;
        </div>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-xs sm:text-sm md:text-base text-[#FAF5E8]/90 font-light leading-relaxed mb-6 sm:mb-8 px-2">
          {t('hero_subtitle')}
        </p>

        {/* Verified Ratings Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#FAF5E8]/10 border border-[#E6BE65]/40 backdrop-blur-md text-xs sm:text-sm text-[#FAF5E8] shadow-sm">
            <div className="flex text-[#E6BE65]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#E6BE65]" />
              ))}
            </div>
            <span className="font-bold text-[#E6BE65]">4.7</span>
            <span className="text-[#FAF5E8]/80 text-[11px] sm:text-xs">{t('lbl_google_rating')}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#FAF5E8]/10 border border-[#E6BE65]/40 backdrop-blur-md text-xs sm:text-sm text-[#FAF5E8] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C99738]" />
            <span className="font-bold text-[#E6BE65]">4.7</span>
            <span className="text-[#FAF5E8]/80 text-[11px] sm:text-xs">{t('lbl_justdial_rating')}</span>
          </div>
        </div>

        {/* Action Buttons (Balanced font sizes in Malayalam and English) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 mb-7 sm:mb-9 w-full max-w-md sm:max-w-none mx-auto">
          <Link
            href="/offerings"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-[#C99738] via-[#E6BE65] to-[#C99738] text-[#1A0409] font-bold shadow-lg active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span className={language === 'ml' ? 'text-xs font-semibold font-malayalam-sans' : 'text-xs sm:text-sm tracking-wide'}>
              {t('btn_book_vazhipadu')}
            </span>
          </Link>

          <Link
            href="/timings"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-[#FAF5E8] font-semibold border border-[#C99738]/50 shadow-md active:scale-95 transition-transform"
          >
            <Calendar className="w-4 h-4 text-[#E6BE65] flex-shrink-0" />
            <span className={language === 'ml' ? 'text-xs font-medium font-malayalam-sans' : 'text-xs sm:text-sm tracking-wide'}>
              {t('btn_plan_darshan')}
            </span>
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#FAF5E8]/10 hover:bg-[#FAF5E8]/20 text-[#FAF5E8] font-medium border border-[#FAF5E8]/30 backdrop-blur-md active:scale-95 transition-transform"
          >
            <Landmark className="w-4 h-4 text-[#C99738] flex-shrink-0" />
            <span className={language === 'ml' ? 'text-xs font-medium font-malayalam-sans' : 'text-xs sm:text-sm tracking-wide'}>
              {t('btn_explore_about')}
            </span>
          </Link>
        </div>

        {/* Live Status Card inside Hero */}
        <div className="max-w-2xl mx-auto mb-2">
          <LiveStatusBadge />
        </div>
      </div>

      {/* Information Quick Strip (Fully bounded text without truncation) */}
      <div className="relative z-10 w-full bg-[#1A0409]/95 border-t border-[#C99738]/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#C99738]/20 text-center py-2 sm:py-3">
          <div className="px-2 sm:px-4 py-2.5 flex flex-col justify-center">
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C99738] font-semibold mb-0.5">
              {t('info_deity')}
            </span>
            <span className={`block font-bold text-xs sm:text-sm text-[#FAF5E8] leading-snug break-words ${language === 'ml' ? 'font-malayalam-sans text-xs' : 'font-cinzel'}`}>
              {t('info_deity_val')}
            </span>
          </div>

          <div className="px-2 sm:px-4 py-2.5 flex flex-col justify-center">
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C99738] font-semibold mb-0.5">
              {t('info_opening')}
            </span>
            <span className={`block font-bold text-xs sm:text-sm text-[#FAF5E8] leading-snug break-words ${language === 'ml' ? 'font-malayalam-sans text-xs' : 'font-cinzel'}`}>
              {t('info_opening_val')}
            </span>
          </div>

          <div className="px-2 sm:px-4 py-2.5 border-t md:border-t-0 flex flex-col justify-center">
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C99738] font-semibold mb-0.5">
              {t('info_admin')}
            </span>
            <span className={`block font-bold text-xs sm:text-sm text-[#FAF5E8] leading-snug break-words ${language === 'ml' ? 'font-malayalam-sans text-xs' : 'font-cinzel'}`}>
              {t('info_admin_val')}
            </span>
          </div>

          <div className="px-2 sm:px-4 py-2.5 border-t md:border-t-0 flex flex-col justify-center">
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C99738] font-semibold mb-0.5">
              {t('info_parking')}
            </span>
            <span className={`block font-bold text-xs sm:text-sm text-[#FAF5E8] leading-snug break-words ${language === 'ml' ? 'font-malayalam-sans text-xs' : 'font-cinzel'}`}>
              {t('info_parking_val')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
