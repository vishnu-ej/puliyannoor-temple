'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { POOJA_TIMINGS } from '../data/timings';
import { MuralDivider } from './MuralDivider';
import {
  Clock,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Info,
} from 'lucide-react';

export const TimingsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'all' | 'morning' | 'evening'>('all');

  const filteredTimings = POOJA_TIMINGS.filter((p) => {
    if (selectedTab === 'all') return true;
    return p.period === selectedTab;
  });

  return (
    <section id="timings" className="py-16 md:py-24 bg-[#F3EBD7] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C99738]/20 border border-[#C99738]/40 text-xs font-bold text-[#8C6219] uppercase tracking-widest mb-3">
            <Clock className="w-3.5 h-3.5 text-[#610C1B]" />
            <span>{t('timings_eyebrow')}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] mb-3">
            {t('timings_title')}
          </h2>

          <p className="text-sm sm:text-base text-[#5A382A] font-light leading-relaxed">
            {t('timings_subtitle')}
          </p>

          <MuralDivider variant="simple" className="my-2" />
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-[#FAF5E8] border border-[#E4D5AE] p-1 shadow-sm">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm'
                  : 'text-[#5A382A] hover:text-[#610C1B]'
              }`}
            >
              {language === 'en' ? 'Full Day Schedule' : 'പൂർണ്ണ സമയക്രമം'}
            </button>
            <button
              onClick={() => setSelectedTab('morning')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedTab === 'morning'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm'
                  : 'text-[#5A382A] hover:text-[#610C1B]'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-[#C99738]" />
              <span>{t('morning_session_title')}</span>
            </button>
            <button
              onClick={() => setSelectedTab('evening')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedTab === 'evening'
                  ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm'
                  : 'text-[#5A382A] hover:text-[#610C1B]'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-[#C99738]" />
              <span>{t('evening_session_title')}</span>
            </button>
          </div>
        </div>

        {/* Timings Table / Card List */}
        <div className="glass-card rounded-2xl border-2 border-[#C99738]/30 shadow-lg overflow-hidden mb-8">
          {/* Table Header Row */}
          <div className="bg-[#610C1B] text-[#FAF5E8] px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 font-cinzel font-bold text-sm sm:text-base tracking-wide">
              <CalendarDays className="w-4 h-4 text-[#E6BE65]" />
              <span>Daily Pooja Rituals & Darshan</span>
            </div>
            <span className="text-xs text-[#E6BE65] font-medium hidden sm:inline-block">
              Morning: 4:30 AM – 10:00 AM | Evening: 5:00 PM – 8:00 PM
            </span>
          </div>

          <div className="divide-y divide-[#E4D5AE]">
            {filteredTimings.map((timing, index) => (
              <div
                key={timing.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF5E8] transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      timing.period === 'morning'
                        ? 'bg-[#C99738]/20 text-[#8C6219]'
                        : 'bg-[#610C1B]/15 text-[#610C1B]'
                    }`}
                  >
                    {timing.period === 'morning' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-cinzel font-bold text-sm sm:text-base text-[#38050E]">
                        {timing.name[language]}
                      </h4>
                      {timing.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#1F4E34] bg-[#1F4E34]/10 border border-[#1F4E34]/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('lbl_verified_badge')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#5A382A] mt-1 font-light leading-relaxed max-w-xl">
                      {timing.description[language]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 pl-12 sm:pl-0">
                  <span className="font-cinzel font-bold text-sm sm:text-base text-[#610C1B]">
                    {timing.time}
                  </span>
                  <span className="text-[11px] text-[#8C6219] font-medium">
                    {timing.timeLabel[language]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Midday Closure & Pradosham Highlight Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#8C6219] flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-[#5A382A]">
              <strong className="text-[#38050E] block font-cinzel mb-0.5">
                Midday Temple Closure (10:00 AM – 5:00 PM)
              </strong>
              {language === 'en'
                ? 'The sanctum remains closed after Ucha Pooja and re-opens at 5:00 PM for the evening Deeparadhana session.'
                : 'ഉച്ചപൂജയ്ക്ക് ശേഷം നടയടച്ച് വൈകുന്നേരം 5:00 മണിക്ക് വീണ്ടും ദർശനത്തിനായി തുറക്കുന്നു.'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#610C1B] flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-[#5A382A]">
              <strong className="text-[#38050E] block font-cinzel mb-0.5">
                Pradosham & Special Days
              </strong>
              {language === 'en'
                ? 'On Pradosham days (twice a month), special evening Abhishekam begins at 4:30 PM with extended darshan.'
                : 'പ്രദോഷ ദിനങ്ങളിൽ വൈകിട്ട് 4:30 മുതൽ പ്രത്യേക അഭിഷേകവും ദീപാരാധനയും ഉണ്ടായിരിക്കും.'}
            </div>
          </div>
        </div>

        {/* Disclaimer note */}
        <p className="text-xs text-center text-[#8C6219] italic max-w-2xl mx-auto">
          {t('timings_disclaimer')}
        </p>
      </div>
    </section>
  );
};
