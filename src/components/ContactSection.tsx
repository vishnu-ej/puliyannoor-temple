'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MuralDivider } from './MuralDivider';
import {
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  Mail,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert(language === 'en' ? 'Please fill in required fields' : 'പേരും ഫോൺ നമ്പറും നൽകുക');
      return;
    }
    setIsSent(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setIsSent(false);
    }, 4000);
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

        {/* 3 Contact Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {/* Phone Card */}
          <div className="glass-card rounded-2xl p-6 border border-[#E4D5AE] text-center shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-[#610C1B] text-[#E6BE65] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-base text-[#38050E] mb-1">
              {t('contact_phone_title')}
            </h3>
            <p className="text-xs text-[#5A382A] mb-3">
              {t('contact_phone_desc')}
            </p>
            <a
              href="tel:+914822212345"
              className="font-cinzel font-bold text-sm text-[#610C1B] hover:text-[#8B1428] underline underline-offset-4"
            >
              +91 4822 212345
            </a>
          </div>

          {/* WhatsApp Support Card */}
          <div className="glass-card rounded-2xl p-6 border border-[#E4D5AE] text-center shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-base text-[#38050E] mb-1">
              {t('contact_whatsapp_title')}
            </h3>
            <p className="text-xs text-[#5A382A] mb-3">
              {t('contact_whatsapp_desc')}
            </p>
            <a
              href="https://wa.me/919447000000?text=Om%20Namah%20Shivaya%20-%20Pooja%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-sm hover:brightness-105"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Office Hours Card */}
          <div className="glass-card rounded-2xl p-6 border border-[#E4D5AE] text-center shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-[#C99738] text-[#1A0409] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-base text-[#38050E] mb-1">
              {t('contact_hours_title')}
            </h3>
            <p className="text-xs text-[#5A382A] mb-1">
              {t('contact_hours_desc')}
            </p>
            <span className="text-[11px] text-[#8C6219] font-semibold">
              Daily during Darshan hours
            </span>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 border-2 border-[#C99738]/30 shadow-lg">
          <div className="flex items-center gap-2 mb-6 border-b border-[#E4D5AE] pb-4">
            <Mail className="w-5 h-5 text-[#610C1B]" />
            <h3 className="font-cinzel font-bold text-lg text-[#38050E]">
              Send an Inquiry Message
            </h3>
          </div>

          {isSent ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#1F4E34] mx-auto animate-bounce" />
              <h4 className="font-cinzel font-bold text-lg text-[#38050E]">
                {t('form_success')}
              </h4>
              <p className="text-xs text-[#5A382A]">
                The Devaswom office has received your prayer message.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {t('form_name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {t('form_phone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('form_subject')}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Udayasthamana Pooja booking date enquiry"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('form_message')} *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-[#FAF5E8] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E6BE65]" />
                <span>{t('form_btn_send')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
