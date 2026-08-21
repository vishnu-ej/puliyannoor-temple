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

export const VisitSection: React.FC = () => {
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
    <section id="visit" className="py-16 md:py-24 bg-[#FAF5E8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
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

        {/* 2-Column Grid: Map & Route Guide / Dress Code */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map & Visual Navigation Box (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#C99738]/40 shadow-lg bg-[#F3EBD7] group">
              {/* Map Illustration SVG / Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3EBD7]">
                <svg
                  viewBox="0 0 500 380"
                  className="w-full h-full object-cover"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="500" height="380" fill="#F3EBD7" />

                  {/* Grid Lines representing local pathways */}
                  <g stroke="#E4D5AE" strokeWidth="1">
                    <line x1="0" y1="70" x2="500" y2="70" />
                    <line x1="0" y1="140" x2="500" y2="140" />
                    <line x1="0" y1="210" x2="500" y2="210" />
                    <line x1="0" y1="280" x2="500" y2="280" />
                    <line x1="0" y1="350" x2="500" y2="350" />
                    <line x1="80" y1="0" x2="80" y2="380" />
                    <line x1="160" y1="0" x2="160" y2="380" />
                    <line x1="240" y1="0" x2="240" y2="380" />
                    <line x1="320" y1="0" x2="320" y2="380" />
                    <line x1="400" y1="0" x2="400" y2="380" />
                  </g>

                  {/* River Meenachil curve */}
                  <path
                    d="M-20 80 Q140 120 220 70 Q300 20 420 80 Q480 120 520 90"
                    fill="none"
                    stroke="#52B788"
                    strokeWidth="8"
                    opacity="0.3"
                  />
                  <text x="30" y="85" fontFamily="sans-serif" fontSize="9" fill="#1F4E34" fontWeight="bold" opacity="0.6">
                    MEENACHIL RIVER
                  </text>

                  {/* Road from Pala route */}
                  <path
                    d="M0 320 Q120 280 200 290 Q280 300 320 220 Q350 150 260 140"
                    fill="none"
                    stroke="#C99738"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="2 10"
                  />
                  <text x="25" y="305" fontFamily="sans-serif" fontSize="11" fill="#8C6219" fontWeight="bold">
                    ROUTE FROM PALA TOWN (3.2 km) →
                  </text>

                  {/* Green Foliage groves */}
                  <g fill="#1F4E34" opacity="0.35">
                    <circle cx="80" cy="180" r="35" />
                    <circle cx="430" cy="300" r="45" />
                    <circle cx="430" cy="80" r="30" />
                    <circle cx="100" cy="40" r="25" />
                  </g>

                  {/* Temple Pin Marker */}
                  <g transform="translate(250, 150)">
                    <ellipse cx="0" cy="18" rx="22" ry="7" fill="#1A0409" opacity="0.25" />
                    <path
                      d="M0 -42 C20 -42 34 -26 34 -6 C34 20 0 46 0 46 C0 46 -34 20 -34 -6 C-34 -26 -20 -42 0 -42Z"
                      fill="#610C1B"
                      stroke="#C99738"
                      strokeWidth="2.5"
                    />
                    <circle cx="0" cy="-8" r="16" fill="#FAF5E8" />
                    <text x="0" y="-3" textAnchor="middle" fontFamily="serif" fontSize="14" fill="#610C1B" fontWeight="bold">
                      ॐ
                    </text>
                  </g>

                  {/* Temple Label */}
                  <rect x="130" y="205" width="240" height="42" rx="8" fill="#1A0409" opacity="0.92" />
                  <text x="250" y="222" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="13" fill="#FAF5E8" fontWeight="bold">
                    Puliyannoor Mahadeva
                  </text>
                  <text x="250" y="238" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill="#E6BE65" letterSpacing="1">
                    CHERUTHIL VALUTHU TEMPLE
                  </text>
                </svg>

                {/* Floating Map Action Overlay */}
                <div className="absolute inset-0 bg-[#1A0409]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href="https://maps.app.goo.gl/ZaRbzjtd9mCYbESP9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#610C1B] text-[#FAF5E8] text-xs font-bold flex items-center gap-2 shadow-xl border border-[#C99738]"
                  >
                    <ExternalLink className="w-4 h-4 text-[#E6BE65]" />
                    <span>{t('btn_open_google_maps')}</span>
                  </a>
                </div>
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3EBD7] hover:bg-[#E4D5AE] text-[#610C1B] text-xs font-bold border border-[#E4D5AE] transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#1F4E34]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('copied_text') : t('btn_copy_address')}</span>
                  </button>

                  <a
                    href="https://maps.app.goo.gl/ZaRbzjtd9mCYbESP9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#610C1B] hover:bg-[#8B1428] text-[#FAF5E8] text-xs font-bold shadow-sm transition-all"
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
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#610C1B] mt-2 flex-shrink-0" />
                  <span>{t('dress_code_men')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#610C1B] mt-2 flex-shrink-0" />
                  <span>{t('dress_code_women')}</span>
                </li>
                <li className="flex items-start gap-2 text-[#8C6219] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C99738] mt-2 flex-shrink-0" />
                  <span>{t('dress_code_note')}</span>
                </li>
              </ul>

              {/* Parking Info Banner */}
              <div className="p-3 rounded-xl bg-[#1F4E34]/10 border border-[#1F4E34]/20 text-xs text-[#1F4E34] font-medium flex items-center gap-2">
                <Car className="w-4 h-4 flex-shrink-0" />
                <span>Spacious vehicle parking space is available directly in front of the temple.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
