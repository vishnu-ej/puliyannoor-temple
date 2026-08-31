'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { MuralDivider } from './MuralDivider';
import { AnnualCalendarModal } from './AnnualCalendarModal';
import {
  Calendar,
  Sparkles,
  Flame,
  Crown,
  Moon,
  Sun,
  Timer,
  CheckCircle2,
  Bell,
} from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { festivals, countdownConfig } = useContent();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Live Festival Countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date from dynamic countdownConfig
    const targetTime = new Date(countdownConfig.targetDate).getTime() || new Date('2027-02-28T04:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [countdownConfig.targetDate]);

  const getEventIcon = (name: string) => {
    switch (name) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#E6BE65]" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-[#E6BE65]" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-[#E6BE65]" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-[#E6BE65]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#E6BE65]" />;
    }
  };

  return (
    <section id="events" className="py-16 md:py-24 bg-[#F3EBD7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#C99738]" />
            <span>{t('events_eyebrow')}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] mb-3">
            {t('events_title')}
          </h2>

          <p className="text-sm sm:text-base text-[#5A382A] font-light leading-relaxed">
            {t('events_subtitle')}
          </p>

          <MuralDivider variant="simple" className="my-2" />
        </div>

        {/* Live Festival Countdown Banner */}
        {countdownConfig.isActive && (
          <div className="max-w-3xl mx-auto mb-14 rounded-3xl bg-gradient-to-br from-[#610C1B] via-[#38050E] to-[#1A0409] text-[#FAF5E8] p-6 sm:p-8 shadow-xl border-2 border-[#C99738]/40 relative overflow-hidden text-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C99738]/20 border border-[#E6BE65]/40 text-xs font-semibold text-[#E6BE65] mb-3">
                <Timer className="w-3.5 h-3.5" />
                <span>{countdownConfig.eyebrow[language] || t('countdown_heading')}</span>
              </div>

              <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-[#FAF5E8] mb-2">
                {countdownConfig.title[language]}
              </h3>
              <p className="text-xs sm:text-sm text-[#E6BE65] font-semibold mb-6 font-cinzel">
                {countdownConfig.subtitle[language]}
              </p>

              {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
              <div className="bg-[#FAF5E8]/10 rounded-2xl p-2.5 sm:p-4 border border-[#E6BE65]/30">
                <span className="block font-cinzel text-xl sm:text-3xl font-extrabold text-[#E6BE65]">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#FAF5E8]/80 font-medium">
                  {t('countdown_days')}
                </span>
              </div>

              <div className="bg-[#FAF5E8]/10 rounded-2xl p-2.5 sm:p-4 border border-[#E6BE65]/30">
                <span className="block font-cinzel text-xl sm:text-3xl font-extrabold text-[#E6BE65]">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#FAF5E8]/80 font-medium">
                  {t('countdown_hours')}
                </span>
              </div>

              <div className="bg-[#FAF5E8]/10 rounded-2xl p-2.5 sm:p-4 border border-[#E6BE65]/30">
                <span className="block font-cinzel text-xl sm:text-3xl font-extrabold text-[#E6BE65]">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#FAF5E8]/80 font-medium">
                  {t('countdown_minutes')}
                </span>
              </div>

              <div className="bg-[#FAF5E8]/10 rounded-2xl p-2.5 sm:p-4 border border-[#E6BE65]/30">
                <span className="block font-cinzel text-xl sm:text-3xl font-extrabold text-[#E6BE65]">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#FAF5E8]/80 font-medium">
                  {t('countdown_seconds')}
                </span>
              </div>
            </div>

            {/* View Full Malayalam Annual Calendar Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C99738] via-[#E6BE65] to-[#C99738] text-[#38050E] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer border border-[#FAF5E8]/40 font-cinzel"
              >
                <Calendar className="w-4 h-4 text-[#38050E]" />
                <span>
                  {language === 'en'
                    ? 'View Official Annual Temple Calendar 1202 (2026–2027)'
                    : '1202 -ാമാണ്ടിലെ പ്രധാന വിശേഷ ദിവസങ്ങൾ കാണുക'}
                </span>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map((fest) => (
            <div
              key={fest.id}
              className={`rounded-2xl p-6 border transition-all card-hover-effect flex flex-col justify-between ${
                fest.isMajor
                  ? 'glass-panel border-[#C99738]/50 shadow-md bg-gradient-to-b from-[#FAF5E8] to-[#F3EBD7]'
                  : 'glass-card border-[#E4D5AE] shadow-sm'
              }`}
            >
              <div>
                {/* Month Badge & Icon */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#610C1B] flex items-center justify-center shadow-sm">
                    {getEventIcon(fest.iconName)}
                  </div>
                  <span className="text-[11px] font-bold text-[#610C1B] bg-[#610C1B]/10 border border-[#610C1B]/20 px-3 py-1 rounded-full">
                    {fest.malayalamMonth[language]}
                  </span>
                </div>

                {/* Festival Title */}
                <h3 className="font-cinzel font-bold text-lg md:text-xl text-[#38050E] mb-1">
                  {fest.title[language]}
                </h3>
                <div className="text-xs text-[#8C6219] font-semibold mb-3">
                  {fest.subtitle[language]}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#36241C] leading-relaxed mb-4 font-light">
                  {fest.description[language]}
                </p>
              </div>

              {/* Highlights Bullet List */}
              <div className="pt-3 border-t border-[#E4D5AE] space-y-1.5 text-xs text-[#5A382A]">
                {fest.highlights[language].map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1F4E34] flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annual Malayalam Calendar Modal for Devotees */}
      <AnnualCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        isAdmin={false}
      />
    </section>
  );
};
