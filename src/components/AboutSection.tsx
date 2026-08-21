'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MuralDivider } from './MuralDivider';
import {
  History,
  Landmark,
  Sparkles,
  Quote,
  Shield,
  MapPin,
  Check,
  Building2,
  Users,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language, t } = useLanguage();

  const facts = [
    { label: t('fact_deity'), value: t('info_deity_val'), highlight: true },
    { label: t('fact_sub_deities'), value: t('fact_sub_deities_val') },
    { label: t('fact_administration'), value: t('info_admin_val'), highlight: true },
    { label: t('fact_panchayath'), value: t('fact_panchayath_val') },
    { label: t('fact_nearest_town'), value: t('fact_nearest_town_val') },
    { label: t('fact_district'), value: t('fact_district_val') },
    { label: t('fact_pincode'), value: '686573' },
    { label: 'Google Rating', value: '4.7 ★ (Verified)' },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-[#FAF5E8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-widest mb-3">
            <History className="w-3.5 h-3.5 text-[#C99738]" />
            <span>{t('about_eyebrow')}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] mb-4">
            {t('about_title')}
          </h2>

          <p className="text-base md:text-lg text-[#5A382A] font-light leading-relaxed">
            {t('about_lead')}
          </p>

          <MuralDivider variant="simple" className="my-2" />
        </div>

        {/* 2-Column Grid: Historical Narrative & Fact Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Narrative Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4D5AE]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#610C1B] flex items-center justify-center text-[#E6BE65] shadow-sm">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="font-cinzel text-lg md:text-xl font-bold text-[#38050E]">
                  {language === 'en' ? 'Centuries of Sacred Divinity' : 'നൂറ്റാണ്ടുകളുടെ തപസ്സും ചൈതന്യവും'}
                </h3>
              </div>

              <p className="text-[#36241C] text-sm md:text-base leading-relaxed mb-4">
                {t('about_p1')}
              </p>

              <p className="text-[#36241C] text-sm md:text-base leading-relaxed">
                {t('about_p2')}
              </p>
            </div>

            {/* Sacred Quote Card */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-r from-[#610C1B] to-[#38050E] text-[#FAF5E8] shadow-md overflow-hidden">
              <Quote className="absolute right-4 bottom-2 w-20 h-20 text-[#C99738]/15 pointer-events-none" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#C99738]/20 flex-shrink-0 flex items-center justify-center mt-1 border border-[#E6BE65]/40">
                  <Sparkles className="w-4 h-4 text-[#E6BE65]" />
                </div>
                <div>
                  <p className="font-playfair text-base md:text-lg italic text-[#F9E7B3] leading-relaxed mb-2">
                    {t('about_quote')}
                  </p>
                  <span className="text-xs uppercase tracking-wider text-[#FAF5E8]/70 font-cinzel font-semibold">
                    — Devotee Reflection · Puliyannoor
                  </span>
                </div>
              </div>
            </div>

            {/* Oorayma Devaswom Highlight Card */}
            <div className="rounded-2xl p-5 bg-[#FAF5E8] border border-[#C99738]/40 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C99738]/20 flex-shrink-0 flex items-center justify-center text-[#8C6219]">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs md:text-sm text-[#5A382A]">
                <strong className="text-[#38050E] block font-cinzel">
                  {t('info_admin_val')}
                </strong>
                {language === 'en'
                  ? 'Administered by traditional Namboothiri families dedicated to preserving ancient Thantric customs.'
                  : 'പാരമ്പര്യ നമ്പൂതിരി ഇല്ലങ്ങളാൽ ഭരിക്കപ്പെടുന്ന ഊരായ്മ ദേവസ്വം.'}
              </div>
            </div>
          </div>

          {/* Fact Sheet Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-lg border-2 border-[#C99738]/30 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#E4D5AE] pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-[#C99738]" />
                  <h3 className="font-cinzel text-lg font-bold text-[#38050E]">
                    {t('factsheet_title')}
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#1F4E34] bg-[#1F4E34]/10 px-2.5 py-1 rounded-full border border-[#1F4E34]/20">
                  Verified
                </span>
              </div>

              <dl className="divide-y divide-[#E4D5AE]/60 text-xs sm:text-sm">
                {facts.map((fact, index) => (
                  <div
                    key={index}
                    className="py-3 flex items-start justify-between gap-3 hover:bg-[#FAF5E8]/60 px-1.5 rounded-lg transition-colors"
                  >
                    <dt className="text-[#8C6219] font-semibold tracking-wide uppercase text-[11px] sm:text-xs">
                      {fact.label}
                    </dt>
                    <dd
                      className={`text-right font-medium ${
                        fact.highlight
                          ? 'text-[#610C1B] font-bold font-cinzel'
                          : 'text-[#2B150F]'
                      }`}
                    >
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Location Mini Callout */}
              <div className="mt-6 pt-4 border-t border-[#E4D5AE] flex items-center justify-between text-xs text-[#5A382A]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#610C1B]" />
                  <span>PM34+XQ6, Puliyannoor</span>
                </span>
                <a
                  href="https://maps.app.goo.gl/ZaRbzjtd9mCYbESP9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#610C1B] hover:text-[#8B1428] underline underline-offset-2"
                >
                  View on Map →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
