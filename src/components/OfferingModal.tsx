'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { OfferingItem } from '../types';
import { OFFERINGS } from '../data/offerings';
import { NAKSHATRAS } from '../data/nakshatras';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  Calendar,
  User,
  Star,
  Phone,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface OfferingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffering?: OfferingItem | null;
}

export const OfferingModal: React.FC<OfferingModalProps> = ({
  isOpen,
  onClose,
  initialOffering,
}) => {
  const { language, t } = useLanguage();
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(
    initialOffering?.id || OFFERINGS[0].id
  );
  const [devoteeName, setDevoteeName] = useState('');
  const [starId, setStarId] = useState<string>('');
  const [offeringDate, setOfferingDate] = useState('');
  const [gotram, setGotram] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialOffering) {
      setSelectedOfferingId(initialOffering.id);
    }
  }, [initialOffering]);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setOfferingDate(tomorrow.toISOString().split('T')[0]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOffering = OFFERINGS.find((o) => o.id === selectedOfferingId) || OFFERINGS[0];
  const selectedStar = NAKSHATRAS.find((n) => n.id.toString() === starId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim()) {
      alert(language === 'en' ? 'Please enter devotee name' : 'ഭക്തന്റെ പേര് നൽകുക');
      return;
    }

    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#C99738', '#610C1B', '#E6BE65', '#1F4E34'],
      });
    } catch (err) {}

    setIsSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const starText = selectedStar
      ? `${selectedStar.nameEn} (${selectedStar.nameMl})`
      : 'Not Specified';
    
    const message = `*Puliyannoor Sree Mahadeva Temple - Vazhipadu Booking Inquiry*
--------------------------------------------
*Devotee Name:* ${devoteeName || 'Devotee'}
*Offering (വഴിപാട്):* #${currentOffering.slNo} ${currentOffering.name.en} / ${currentOffering.name.ml} (₹${currentOffering.price.toLocaleString('en-IN')})
*Birth Star (നക്ഷത്രം):* ${starText}
*Preferred Date:* ${offeringDate}
*Gotram / Family:* ${gotram || 'N/A'}
*Contact Number:* ${phone || 'N/A'}
*Special Prayer Notes:* ${notes || 'Om Namah Shivaya'}
--------------------------------------------
_Sent via Puliyannoor Temple Official Web Portal_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919447000000?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1A0409]/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF5E8] border-2 border-[#C99738] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#610C1B] via-[#38050E] to-[#610C1B] text-[#FAF5E8] px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#C99738]/40 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#C99738]/20 border border-[#E6BE65]/40 flex items-center justify-center text-[#E6BE65]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-sm sm:text-base md:text-lg text-[#FAF5E8]">
                {t('modal_title')}
              </h3>
              <p className="text-[10px] sm:text-xs text-[#E6BE65] font-malayalam-sans">
                പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#FAF5E8]/80 hover:text-[#FAF5E8] hover:bg-[#FAF5E8]/10 active:scale-95 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label={t('modal_close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            /* Submission Confirmation State */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#1F4E34]/15 border-2 border-[#1F4E34] text-[#1F4E34] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#38050E] mb-1">
                  {t('modal_success_title')}
                </h4>
                <p className="text-xs sm:text-sm text-[#5A382A] max-w-sm mx-auto">
                  {t('modal_success_desc')}
                </p>
              </div>

              {/* Summary Card */}
              <div className="glass-card rounded-2xl p-4 text-left text-xs space-y-2 border border-[#E4D5AE]">
                <div className="flex justify-between">
                  <span className="text-[#8C6219] font-bold">Devotee:</span>
                  <span className="font-semibold text-[#2B150F]">{devoteeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C6219] font-bold">Vazhipadu:</span>
                  <span className="font-semibold text-[#610C1B]">
                    #{currentOffering.slNo} {currentOffering.name[language]} (₹{currentOffering.price.toLocaleString('en-IN')})
                  </span>
                </div>
                {selectedStar && (
                  <div className="flex justify-between">
                    <span className="text-[#8C6219] font-bold">Nakshatra:</span>
                    <span>{selectedStar.nameEn} ({selectedStar.nameMl})</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#8C6219] font-bold">Date:</span>
                  <span>{offeringDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={handleWhatsAppSend}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('modal_btn_whatsapp')}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FAF5E8] border border-[#C99738] text-[#610C1B] font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer"
                >
                  {t('modal_close')}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              {/* Offering Selector Dropdown (All 73 offerings) */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('modal_selected_offering')} * ({OFFERINGS.length} Available)
                </label>
                <select
                  value={selectedOfferingId}
                  onChange={(e) => setSelectedOfferingId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-[#2B150F] text-sm focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  required
                >
                  {OFFERINGS.map((offering) => (
                    <option key={offering.id} value={offering.id}>
                      #{offering.slNo} {offering.name[language]} — ₹{offering.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] sm:text-[11px] text-[#5A382A] mt-1 italic line-clamp-1">
                  {currentOffering.significance[language]}
                </p>
              </div>

              {/* Devotee Name & Birth Star */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {t('modal_devotee_name')} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                    <input
                      type="text"
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      placeholder={t('modal_devotee_name_placeholder')}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {t('modal_star')}
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                    <select
                      value={starId}
                      onChange={(e) => setStarId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    >
                      <option value="">{t('modal_select_star')}</option>
                      {NAKSHATRAS.map((star) => (
                        <option key={star.id} value={star.id.toString()}>
                          {star.nameEn} ({star.nameMl})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date of Offering & Gotram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {t('modal_date')} *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                    <input
                      type="date"
                      value={offeringDate}
                      onChange={(e) => setOfferingDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {t('modal_gotram')}
                  </label>
                  <input
                    type="text"
                    value={gotram}
                    onChange={(e) => setGotram(e.target.value)}
                    placeholder="Gotram / Family"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('modal_phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('modal_special_notes')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special intentions..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-[#FAF5E8] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#E6BE65]" />
                  <span>{t('modal_btn_submit')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
                  title="Direct WhatsApp Inquiry"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
