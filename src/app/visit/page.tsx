'use client';

import React from 'react';
import { VisitSection } from '../../components/VisitSection';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin } from 'lucide-react';

export default function VisitPage() {
  const { language, t } = useLanguage();

  return (
    <div className="w-full flex flex-col">
      {/* Page Hero Header */}
      <div className="bg-[#1A0409] text-[#FAF5E8] py-12 md:py-16 text-center border-b border-[#C99738]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0409]/90 via-[#38050E]/80 to-[#1A0409] z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F4E34]/30 border border-[#1F4E34] text-xs font-semibold text-[#52B788] mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('visit_eyebrow')}</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FAF5E8] mb-3">
            {t('visit_title')}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#FAF5E8]/85 max-w-2xl mx-auto font-light">
            {t('visit_subtitle')}
          </p>
        </div>
      </div>

      {/* Visit Section */}
      <VisitSection />
    </div>
  );
}
