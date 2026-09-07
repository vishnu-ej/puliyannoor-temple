'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MuralDivider } from './MuralDivider';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Car,
  Train,
  Plane,
  Shirt,
  ShieldAlert,
  Info,
  ExternalLink,
} from 'lucide-react';

export const VisitSection: React.FC<{ hideHeader?: boolean }> = ({ hideHeader = false }) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const fullAddress = 'PM34+XQ6, Puliyannoor, Mutholy, Pala, Kottayam District, Kerala 686573, India';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const distances = [
    {
      hub: t('distance_pala'),
      distance: '3.2 km (~8 mins)',
      icon: <Car className="w-4 h-4 text-[#610C1B]" />,
    },
    {
      hub: t('distance_kottayam'),
      distance: '28 km (~45 mins)',
      icon: <Train className="w-4 h-4 text-[#8C6219]" />,
    },
    {
      hub: t('distance_ernakulam'),
      distance: '65 km (~1 hr 40 mins)',
      icon: <Car className="w-4 h-4 text-[#610C1B]" />,
    },
    {
      hub: t('distance_airport'),
      distance: '75 km (~2 hrs)',
      icon: <Plane className="w-4 h-4 text-[#8C6219]" />,
    },
  ];

  return (
    <section id="visit" className={`py-16 md:py-24 bg-[#FAF5E8] relative ${hideHeader ? 'pt-8 md:pt-12' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F4E34]/10 border border-[#1F4E34]/20 text-xs font-bold text-[#1F4E34] uppercase tracking-widest mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#C99738]" />
              <span>{t('visit_eyebrow')}</span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] mb-3">
              {t('visit_title')}
            </h2>

            <p className="text-sm sm:text-base text-[#5A382A] font-light leading-relaxed">
              {t('visit_subtitle')}
            </p>

            <MuralDivider variant="simple" className="my-2" />
          </div>
        )}

        {/* 2-Column Grid: Map & Route Guide / Dress Code */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map & Visual Navigation Box (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#C99738]/40 shadow-lg bg-[#F3EBD7] group">
              {/* Google Maps Embed Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3EBD7]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.720075687327!2d76.6569033!3d9.704915199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07cd94c221134b%3A0xebf436f6a36abe2b!2sPuliyannoor%20Mahadeva%20Temple!5e0!3m2!1sen!2sin!4v1788793360180!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Puliyannoor Mahadeva Temple Google Map"
                />
              </div>

              {/* Address Strip below Map */}
              <div className="p-5 bg-[#FAF5E8] border-t border-[#E4D5AE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-[#8C6219] uppercase tracking-wider block font-cinzel">
                    {t('lbl_address')}
                  </span>
                  <p className="text-xs sm:text-sm text-[#2B150F] font-medium mt-0.5">
                    {fullAddress}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3EBD7] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold border border-[#E4D5AE] transition-all cursor-pointer text-center"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#1F4E34]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('copied_text') : t('btn_copy_address')}</span>
                  </button>

                  <a
                    href="https://maps.app.goo.gl/9MKkuSQNDhMj3gts8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3EBD7] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold border border-[#E4D5AE] transition-all text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#C99738]" />
                    <span>{t('btn_open_google_maps')}</span>
                  </a>

                  <a
                    href="https://maps.app.goo.gl/9MKkuSQNDhMj3gts8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#610C1B] hover:bg-[#8B1428] text-[#FAF5E8] text-xs font-bold shadow-sm transition-all text-center"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Distance Table & Dress Code Guidelines (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Distances Matrix */}
            <div className="glass-card rounded-2xl p-6 border border-[#E4D5AE] shadow-sm">
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#38050E] mb-4 flex items-center gap-2 border-b border-[#E4D5AE] pb-3">
                <Navigation className="w-4 h-4 text-[#C99738]" />
                <span>Distance from Major Hubs</span>
              </h3>

              <div className="divide-y divide-[#E4D5AE]/60 text-xs sm:text-sm">
                {distances.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#FAF5E8] border border-[#E4D5AE]">
                        {item.icon}
                      </div>
                      <span className="font-medium text-[#2B150F]">{item.hub}</span>
                    </div>
                    <span className="font-cinzel font-bold text-[#610C1B]">
                      {item.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditional Dress Code & Etiquette Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#FAF5E8] to-[#F3EBD7] border-2 border-[#C99738]/40 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <Shirt className="w-5 h-5 text-[#610C1B]" />
                <h3 className="font-cinzel font-bold text-base text-[#38050E]">
                  {t('dress_code_title')}
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#36241C] mb-4 font-light">
                <li className="flex items-start gap-2 font-medium text-[#38050E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#610C1B] mt-2 flex-shrink-0" />
                  <span>{t('dress_code_men')}</span>
                </li>
                <li className="flex items-start gap-2 text-[#8C6219] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C99738] mt-2 flex-shrink-0" />
                  <span>{t('dress_code_note')}</span>
                </li>
              </ul>

              {/* Parking Info Banner */}
              <div className="p-3 rounded-xl bg-[#1F4E34]/10 border border-[#1F4E34]/20 text-xs text-[#1F4E34] font-medium flex items-center gap-2">
                <Car className="w-4 h-4 flex-shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Vehicle Parking: Available in the temple premise'
                    : 'വാഹന പാർക്കിംഗ് സൗകര്യം ക്ഷേത്ര വളപ്പിൽ ലഭ്യമാണ്'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
