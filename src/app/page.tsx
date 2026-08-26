'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Hero } from '../components/Hero';
import { OfferingModal } from '../components/OfferingModal';
import { OFFERINGS } from '../data/offerings';
import { POOJA_TIMINGS } from '../data/timings';
import { OfferingItem } from '../types';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Landmark,
  Calendar,
  Navigation,
  CheckCircle2,
  Flame,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  Timer,
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<OfferingItem | null>(null);

  // Popular offerings for the home showcase
  const featuredOfferings = OFFERINGS.filter((o) => o.popular).slice(0, 3);

  const handleBookOffering = (offering: OfferingItem) => {
    setSelectedOffering(offering);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Divine Hero Banner */}
      <Hero />

      {/* 1. Welcome & "Cheruthil Valuthu Puliyannoor" Overview */}
      <section className="py-14 md:py-20 bg-[#FAF5E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-widest">
                <Landmark className="w-3.5 h-3.5 text-[#C99738]" />
                <span>{t('about_eyebrow')}</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] leading-tight">
                {t('about_title')}
              </h2>

              <p className="text-sm md:text-base text-[#5A382A] font-light leading-relaxed">
                {t('about_p1')}
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-[#FAF5E8] text-xs sm:text-sm font-bold tracking-wide shadow-sm transition-all"
                >
                  <span>{language === 'en' ? 'Read Temple History & Vastu' : 'ക്ഷേത്ര ചരിത്രവും വാസ്തുവും വായിക്കുക'}</span>
                  <ArrowRight className="w-4 h-4 text-[#E6BE65]" />
                </Link>
              </div>
            </div>

            {/* Quote / Fact Callout Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-7 bg-gradient-to-br from-[#38050E] via-[#610C1B] to-[#1A0409] text-[#FAF5E8] shadow-xl border-2 border-[#C99738]/40 relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#C99738]/20 border border-[#E6BE65]/40 flex items-center justify-center text-[#E6BE65] mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="font-playfair text-base sm:text-lg italic text-[#F9E7B3] leading-relaxed mb-4">
                  {t('about_quote')}
                </p>
                <div className="pt-3 border-t border-[#FAF5E8]/20 flex items-center justify-between text-xs text-[#FAF5E8]/80">
                  <span className="font-cinzel font-semibold">Oorayma Devaswom</span>
                  <span className="text-[#E6BE65]">Mutholy, Pala</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Darshan Timings Preview */}
      <section className="py-14 md:py-18 bg-[#F3EBD7] border-y border-[#E4D5AE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C99738]/20 border border-[#C99738]/40 text-xs font-bold text-[#8C6219] uppercase tracking-widest mb-2">
                <Clock className="w-3.5 h-3.5 text-[#610C1B]" />
                <span>{t('timings_eyebrow')}</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#38050E]">
                {t('timings_title')}
              </h2>
            </div>

            <Link
              href="/timings"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#610C1B] hover:text-[#8B1428] underline underline-offset-4"
            >
              <span>{language === 'en' ? 'View Full Daily Schedule' : 'പൂർണ്ണ പൂജാ സമയക്രമം കാണുക'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Timings Quick Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {POOJA_TIMINGS.slice(0, 4).map((timing) => (
              <div
                key={timing.id}
                className="glass-card rounded-2xl p-5 border border-[#E4D5AE] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6219]">
                      {timing.timeLabel[language]}
                    </span>
                    {timing.isVerified && (
                      <span className="text-[10px] text-[#1F4E34] font-bold bg-[#1F4E34]/10 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#38050E] mb-1">
                    {timing.name[language]}
                  </h3>
                </div>
                <div className="pt-3 border-t border-[#E4D5AE] text-right">
                  <span className="font-cinzel font-bold text-sm text-[#610C1B]">
                    {timing.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Vazhipadu Offerings */}
      <section className="py-14 md:py-20 bg-[#FAF5E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
                <span>{t('offerings_eyebrow')}</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#38050E]">
                {t('offerings_title')}
              </h2>
            </div>

            <Link
              href="/offerings"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#610C1B] hover:text-[#8B1428] underline underline-offset-4"
            >
              <span>{language === 'en' ? 'Explore All Offerings (88)' : 'എല്ലാ വഴിപാടുകളും കാണുക (88)'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredOfferings.map((offering) => (
              <div
                key={offering.id}
                className="glass-card rounded-2xl p-6 border border-[#E4D5AE] shadow-sm flex flex-col justify-between card-hover-effect"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C99738]/20 text-[#8C6219] border border-[#C99738]/40">
                      {offering.tag ? offering.tag[language] : 'Pradhana Vazhipadu'}
                    </span>
                    <span className="font-cinzel font-bold text-lg text-[#610C1B]">
                      ₹{offering.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="font-cinzel font-bold text-base md:text-lg text-[#38050E] mb-1">
                    {offering.name[language]}
                  </h3>
                  <div className="font-malayalam-sans text-xs text-[#8C6219] font-medium mb-3">
                    {offering.name[language === 'en' ? 'ml' : 'en']}
                  </div>

                  <p className="text-xs sm:text-sm text-[#36241C] leading-relaxed mb-4 font-light">
                    {offering.description[language]}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E4D5AE]">
                  <button
                    onClick={() => handleBookOffering(offering)}
                    className="w-full py-2 px-4 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-[#FAF5E8] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{t('btn_inquire_offering')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E6BE65]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Upcoming Festival & Visitor Callout Strip */}
      <section className="py-12 bg-gradient-to-r from-[#38050E] via-[#610C1B] to-[#1A0409] text-[#FAF5E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E6BE65] uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#E6BE65]" />
              <span>{t('countdown_heading')}</span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#FAF5E8]">
              {language === 'en' ? 'Plan Your Visit for the Grand Utsavam' : 'ക്ഷേത്രോത്സവങ്ങളിൽ പങ്കെടുക്കാൻ സന്ദർശനം ആസൂത്രണം ചെയ്യുക'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-xl bg-[#C99738] hover:bg-[#E6BE65] text-[#1A0409] font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all"
            >
              {t('events_eyebrow')}
            </Link>
            <Link
              href="/visit"
              className="px-5 py-2.5 rounded-xl bg-[#FAF5E8]/10 hover:bg-[#FAF5E8]/20 border border-[#FAF5E8]/30 text-[#FAF5E8] font-semibold text-xs sm:text-sm transition-all"
            >
              {t('visit_eyebrow')}
            </Link>
          </div>
        </div>
      </section>

      {/* Vazhipadu Booking Modal */}
      <OfferingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialOffering={selectedOffering}
      />
    </div>
  );
}
