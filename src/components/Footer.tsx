'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { MuralDivider } from './MuralDivider';
import { MapPin, Phone, ShieldCheck, Heart, Sparkles, Navigation, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { contactInfo } = useContent();
  const currentYear = new Date().getFullYear();

  const links = [
    { href: '/', labelKey: 'nav_home' },
    { href: '/about', labelKey: 'nav_about' },
    { href: '/timings', labelKey: 'nav_timings' },
    { href: '/offerings', labelKey: 'nav_offerings' },
    { href: '/events', labelKey: 'nav_events' },
    { href: '/visit', labelKey: 'nav_visit' },
    { href: '/contact', labelKey: 'nav_contact' },
  ];

  return (
    <footer className="bg-[#1A0409] text-[#FAF5E8] border-t border-[#C99738]/40 mt-auto">
      {/* Top Gold Mural Divider Strip */}
      <MuralDivider variant="dark" />

      {/* Main 4-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Col 1: Brand & Devaswom Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#610C1B] to-[#38050E] border-2 border-[#C99738] flex items-center justify-center text-[#E6BE65] font-cinzel font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                ॐ
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-base md:text-lg text-[#FAF5E8] leading-tight">
                  Puliyannoor Mahadeva
                </h3>
                <span className="font-malayalam-sans text-xs text-[#E6BE65]">
                  പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം
                </span>
              </div>
            </Link>

            <p className="text-xs md:text-sm text-[#FAF5E8]/80 leading-relaxed font-light">
              {t('footer_desc')}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5E8]/10 border border-[#C99738]/40 text-xs text-[#E6BE65]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ooranma Devaswom Administration</span>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#E6BE65] mb-3">
              {t('footer_quick_links')}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#FAF5E8]/75 hover:text-[#E6BE65] transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Temple Facts (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#E6BE65] mb-3">
              {t('footer_temple_info')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF5E8]/85">
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-[#C99738] font-bold">
                  {t('info_deity')}
                </span>
                <span>{t('info_deity_val')}</span>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-[#C99738] font-bold">
                  {t('info_opening')}
                </span>
                <span>{t('info_opening_val')}</span>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-[#C99738] font-bold">
                  {t('info_parking')}
                </span>
                <span>{t('info_parking_val')}</span>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-[#C99738] font-bold">
                  Ratings & Reviews
                </span>
                <span>4.7 ★ on Google & Justdial</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#E6BE65] mb-3">
              {t('footer_location_title')}
            </h4>
            <address className="not-italic text-xs text-[#FAF5E8]/85 leading-relaxed">
              PM34+XQ6, Puliyannoor, Mutholy,<br />
              Pala, Kottayam District,<br />
              Kerala 686573, India
            </address>

            <div className="pt-1 flex flex-col gap-1.5 text-xs text-[#FAF5E8]/90">
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#E6BE65] hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C99738]" />
                <span className="truncate">{contactInfo.email}</span>
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#FAF5E8]/80 hover:text-[#E6BE65] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C99738]" />
                <span>{contactInfo.phoneDisplay}</span>
              </a>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/ZaRbzjtd9mCYbESP9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E6BE65] hover:text-[#FAF5E8] underline underline-offset-4"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t('btn_open_google_maps')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-[#FAF5E8]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FAF5E8]/60 text-center md:text-left">
          <p>{t('footer_disclaimer')}</p>
          <p>© {currentYear} {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
};
