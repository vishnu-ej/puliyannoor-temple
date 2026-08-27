'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateLiveTempleStatus, LiveTempleStatus } from '../data/timings';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Moon, Sparkles, ChevronRight } from 'lucide-react';

interface LiveStatusBadgeProps {
  compact?: boolean;
  className?: string;
  showDetail?: boolean;
}

export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({
  compact = false,
  className = '',
  showDetail = true,
}) => {
  const { language } = useLanguage();
  const [status, setStatus] = useState<LiveTempleStatus | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStatus(calculateLiveTempleStatus());

    const interval = setInterval(() => {
      setStatus(calculateLiveTempleStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // SSR-safe fallback to prevent hydration mismatch
  if (!mounted || !status) {
    if (compact) {
      return (
        <Link
          href="/timings"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#38050E] text-[#F9E7B3] border border-[#C99738]/50 hover:brightness-110 cursor-pointer ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#C99738] animate-pulse" />
          <span className={language === 'ml' ? 'text-[11px] font-malayalam-sans' : 'text-xs'}>
            {language === 'en' ? 'Checking Darshan Hours...' : 'ദർശന സമയം പരിശോധിക്കുന്നു...'}
          </span>
        </Link>
      );
    }
    return (
      <div className={`glass-panel rounded-2xl p-3.5 sm:p-4 border border-[#C99738]/30 shadow-md ${className}`}>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#C99738] animate-spin" />
          <span className="text-xs sm:text-sm font-cinzel text-[#1A0409]">
            {language === 'en' ? 'Calculating Darshan Status...' : 'ദർശന സമയം പരിശോധിക്കുന്നു...'}
          </span>
        </div>
      </div>
    );
  }

  const { isOpen, statusText, subText, badgeColor } = status;

  if (compact) {
    return (
      <Link
        href="/timings"
        className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full font-bold transition-all shadow-md hover:scale-[1.03] cursor-pointer ${
          isOpen
            ? 'bg-[#1F4E34] hover:bg-[#2D6A4F] text-[#E8F5E9] border border-[#4CAF50]/60 shadow-[#1F4E34]/30'
            : badgeColor === 'amber'
            ? 'bg-[#613D00] hover:bg-[#7D5200] text-[#FFF8E1] border border-[#FFD54F]/70 shadow-[#613D00]/30'
            : 'bg-[#5C0A17] hover:bg-[#780E20] text-[#FFE4E6] border border-[#F43F5E]/60 shadow-[#5C0A17]/30'
        } ${className}`}
        title={language === 'en' ? 'Click to view Pooja Timings' : 'പൂജാ സമയക്രമം കാണുക'}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOpen
                ? 'bg-[#4CAF50]'
                : badgeColor === 'amber'
                ? 'bg-[#FFD54F]'
                : 'bg-[#F43F5E]'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isOpen
                ? 'bg-[#4CAF50]'
                : badgeColor === 'amber'
                ? 'bg-[#FFD54F]'
                : 'bg-[#F43F5E]'
            }`}
          />
        </span>
        <span className={`font-semibold tracking-wide ${language === 'ml' ? 'text-[11px] font-malayalam-sans' : 'text-xs'}`}>
          {statusText[language]}
        </span>
      </Link>
    );
  }

  return (
    <div
      className={`glass-panel rounded-2xl p-3.5 sm:p-4 md:p-4.5 border transition-all shadow-md ${
        isOpen
          ? 'border-[#1F4E34]/50 bg-gradient-to-r from-[#1F4E34]/10 via-[#FAF5E8] to-transparent'
          : badgeColor === 'amber'
          ? 'border-[#C99738]/50 bg-gradient-to-r from-[#C99738]/15 via-[#FAF5E8] to-transparent'
          : 'border-[#610C1B]/40 bg-gradient-to-r from-[#610C1B]/10 via-[#FAF5E8] to-transparent'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
              isOpen
                ? 'bg-[#1F4E34] text-[#FAF5E8]'
                : badgeColor === 'amber'
                ? 'bg-[#C99738] text-[#1A0409]'
                : 'bg-[#610C1B] text-[#FAF5E8]'
            }`}
          >
            {isOpen ? (
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-flame" />
            ) : badgeColor === 'amber' ? (
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isOpen
                    ? 'bg-[#1F4E34] animate-pulse'
                    : badgeColor === 'amber'
                    ? 'bg-[#C99738]'
                    : 'bg-[#610C1B]'
                }`}
              />
              <h4 className={`font-bold text-[#1A0409] ${
                language === 'ml'
                  ? 'text-xs sm:text-sm font-malayalam-sans leading-snug'
                  : 'text-xs sm:text-sm md:text-base font-cinzel'
              }`}>
                {statusText[language]}
              </h4>
            </div>
            {showDetail && (
              <p className={`text-[#5A382A] mt-0.5 font-medium ${
                language === 'ml' ? 'text-[11px] sm:text-xs font-malayalam-sans' : 'text-xs sm:text-sm'
              }`}>
                {subText[language]}
              </p>
            )}
          </div>
        </div>

        {/* Clickable Button Linking to /timings */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link
            href="/timings"
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#8C6219] hover:text-[#FAF5E8] bg-[#FAF5E8] hover:bg-[#610C1B] border border-[#E4D5AE] hover:border-[#610C1B] px-3 py-1 sm:py-1.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <span className={language === 'ml' ? 'text-[10.5px] font-malayalam-sans font-semibold' : 'text-[10px] sm:text-[11px]'}>
              {language === 'en' ? 'Pooja Timetable' : 'പൂജാ സമയക്രമം'}
            </span>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8C6219] group-hover:text-[#E6BE65] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
