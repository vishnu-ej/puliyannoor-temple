'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { MuralDivider } from './MuralDivider';
import {
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  Mail,
  ShieldCheck,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { contactInfo } = useContent();
  const { isAuthenticated, openAuthModal } = useAuth();
  const router = useRouter();

  const handleChatClick = () => {
    if (isAuthenticated) {
      router.push('/profile?tab=chat');
    } else {
      openAuthModal('login', '/profile?tab=chat');
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#F3EBD7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-widest mb-3">
            <Phone className="w-3.5 h-3.5 text-[#C99738]" />
            <span>{t('contact_eyebrow')}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] mb-3">
            {t('contact_title')}
          </h2>

          <p className="text-sm sm:text-base text-[#5A382A] font-light leading-relaxed">
            {t('contact_subtitle')}
          </p>

          <MuralDivider variant="simple" className="my-2" />
        </div>

        {/* 4 Contact Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 max-w-6xl mx-auto">
          {/* Phone Card */}
          <div className="glass-card rounded-2xl p-5 border border-[#E4D5AE] text-center shadow-sm card-hover-effect flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#610C1B] text-[#E6BE65] flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-sm text-[#38050E] mb-1">
                {t('contact_phone_title')}
              </h3>
              <p className="text-xs text-[#5A382A] mb-3">
                {t('contact_phone_desc')}
              </p>
            </div>
            <a
              href={`tel:${contactInfo.phone}`}
              className="font-cinzel font-bold text-xs sm:text-sm text-[#610C1B] hover:text-[#8B1428] underline underline-offset-4"
            >
              {contactInfo.phoneDisplay}
            </a>
          </div>

          {/* Email Card */}
          <div className="glass-card rounded-2xl p-5 border border-[#E4D5AE] text-center shadow-sm card-hover-effect flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#C99738] text-[#1A0409] flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-sm text-[#38050E] mb-1">
                Official Email
              </h3>
              <p className="text-xs text-[#5A382A] mb-3">
                Devaswom correspondence
              </p>
            </div>
            <a
              href={`mailto:${contactInfo.email}`}
              className="font-semibold text-xs text-[#610C1B] hover:text-[#8B1428] underline underline-offset-4 break-all"
            >
              {contactInfo.email}
            </a>
          </div>

          {/* WhatsApp Support Card */}
          <div className="glass-card rounded-2xl p-5 border border-[#E4D5AE] text-center shadow-sm card-hover-effect flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-sm text-[#38050E] mb-1">
                {t('contact_whatsapp_title')}
              </h3>
              <p className="text-xs text-[#5A382A] mb-3">
                {t('contact_whatsapp_desc')}
              </p>
            </div>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}?text=Om%20Namah%20Shivaya%20-%20Pooja%20Inquiry`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-sm hover:brightness-105 cursor-pointer mx-auto"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Office Hours Card */}
          <div className="glass-card rounded-2xl p-5 border border-[#E4D5AE] text-center shadow-sm card-hover-effect flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#38050E] text-[#E6BE65] flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-sm text-[#38050E] mb-3">
                {t('contact_hours_title')}
              </h3>
              <div className="space-y-1 text-xs">
                <p className="text-[#5A382A] font-medium leading-tight">
                  {contactInfo.officeHoursMorning}
                </p>
                <p className="text-[#8C6219] font-semibold leading-tight">
                  {contactInfo.officeHoursEvening}
                </p>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-[#8C6219]/80 font-medium">
              Daily Temple Office
            </div>
          </div>
        </div>

        {/* "Get in Touch & Live Chat" Compact Container */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C99738] shadow-xl text-center space-y-4 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#610C1B] to-[#38050E] border border-[#C99738] text-[#E6BE65] font-cinzel font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            ॐ
          </div>

          <div className="space-y-1.5">
            <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#38050E]">
              Get in Touch with Puliyannoor Devaswom
            </h3>
            <p className="text-xs sm:text-sm text-[#5A382A] leading-relaxed max-w-md mx-auto">
              Have queries about special vazhipadu poojas, auditorium bookings, or temple customs? Chat directly with the Devaswom desk from your devotee profile.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleChatClick}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#E6BE65]" />
              <span>Chat with Devaswom</span>
              <ArrowRight className="w-4 h-4 text-[#E6BE65]" />
            </button>
          </div>

          <div className="pt-3 border-t border-[#E4D5AE] flex items-center justify-center gap-2 text-[11px] text-[#8C6219]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F4E34]" />
            <span>Direct 1-on-1 official communication channel with the Temple Administration Desk.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
