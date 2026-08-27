'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
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
  Home,
  MapPin,
  Send,
  ShoppingCart,
  Plus,
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
  const { addToCart } = useCart();
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(
    initialOffering?.id || OFFERINGS[0].id
  );
  const [devoteeName, setDevoteeName] = useState('');
  const [starId, setStarId] = useState<string>('');
  const [familyName, setFamilyName] = useState('');
  const [place, setPlace] = useState('');
  const [offeringDate, setOfferingDate] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (initialOffering) {
      setSelectedOfferingId(initialOffering.id);
    }
  }, [initialOffering]);

  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setOfferingDate(tomorrow.toISOString().split('T')[0]);
      setQuantity(1);
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
  const isKoottuNamaskaram = currentOffering.id === 'koottu_namaskaram';

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (isKoottuNamaskaram) {
      if (!familyName.trim() || !place.trim()) {
        alert(
          language === 'en'
            ? 'Please enter Family Name and Place for Koottu Namaskaram'
            : 'കൂട്ടനമസ്കാരത്തിനായി കുടുംബപ്പേരും സ്ഥലവും നൽകുക'
        );
        return;
      }
    } else {
      if (!devoteeName.trim()) {
        alert(language === 'en' ? 'Please enter devotee name' : 'ഭക്തന്റെ പേര് നൽകുക');
        return;
      }
    }

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#C99738', '#610C1B', '#E6BE65'],
      });
    } catch (err) {}

    addToCart({
      offering: currentOffering,
      devoteeName: isKoottuNamaskaram ? undefined : devoteeName,
      starNameEn: isKoottuNamaskaram ? undefined : selectedStar?.nameEn,
      starNameMl: isKoottuNamaskaram ? undefined : selectedStar?.nameMl,
      familyName: isKoottuNamaskaram ? familyName : undefined,
      place: isKoottuNamaskaram ? place : undefined,
      date: offeringDate,
      notes: notes || undefined,
      quantity,
    });

    onClose();
  };

  const handleDirectWhatsAppSend = () => {
    let devoteeInfo = '';
    if (isKoottuNamaskaram) {
      devoteeInfo = `*Family Name (കുടുംബപ്പേര്):* ${familyName || 'N/A'}\n*Place (സ്ഥലം):* ${place || 'N/A'}`;
    } else {
      const starText = selectedStar
        ? `${selectedStar.nameEn} (${selectedStar.nameMl})`
        : 'Not Specified';
      devoteeInfo = `*Devotee Name:* ${devoteeName || 'Devotee'}\n*Birth Star (നക്ഷത്രം):* ${starText}`;
    }

    const message = `*Puliyannoor Sree Mahadeva Temple - Vazhipadu Inquiry*
--------------------------------------------
*Offering (വഴിപാട്):* #${currentOffering.slNo} ${currentOffering.name.en} / ${currentOffering.name.ml} (₹${currentOffering.price.toLocaleString('en-IN')})
*Quantity:* ${quantity}
${devoteeInfo}
*Preferred Date:* ${offeringDate}
*Contact Phone:* ${phone || 'N/A'}
*Special Notes:* ${notes || 'Om Namah Shivaya'}
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
        <div className="bg-gradient-to-r from-[#610C1B] via-[#38050E] to-[#610C1B] text-[#FAF5E8] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#C99738]/40 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#C99738]/20 border border-[#E6BE65]/40 flex items-center justify-center text-[#E6BE65]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-sm sm:text-base md:text-lg text-[#FAF5E8]">
                {language === 'en' ? 'Vazhipadu Inquiry' : 'വഴിപാട് വിവരങ്ങൾ'}
              </h3>
              <p className="text-[10px] sm:text-xs text-[#E6BE65] font-malayalam-sans">
                പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#FAF5E8]/80 hover:text-[#FAF5E8] hover:bg-[#FAF5E8]/10 active:scale-95 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <form onSubmit={handleAddToCart} className="space-y-3.5 text-left">
            {/* Offering Selector Dropdown */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                {language === 'en' ? 'Selected Offering' : 'തിരഞ്ഞെടുത്ത വഴിപാട്'} * ({OFFERINGS.length} Available)
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

            {/* Special Branch: Koottu Namaskaram vs Individual Offerings */}
            {isKoottuNamaskaram ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F3EBD7]/70 p-3 rounded-2xl border border-[#E4D5AE]">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {language === 'en' ? 'Family Name' : 'കുടുംബപ്പേര്'} *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                    <input
                      type="text"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      placeholder={language === 'en' ? 'e.g., Vadakkedathu Family' : 'ഉദാ: വടക്കേടത്ത് കുടുംബം'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {language === 'en' ? 'Place / Desham' : 'സ്ഥലം / ദേശം'} *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder={language === 'en' ? 'e.g., Mutholy, Pala' : 'ഉദാ: മുത്തോലി, പാലാ'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {language === 'en' ? 'Devotee Full Name' : 'ഭക്തന്റെ പേര്'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                    <input
                      type="text"
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      placeholder={language === 'en' ? 'Devotee Name' : 'ഭക്തന്റെ പേര്'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    {language === 'en' ? 'Birth Star (Nakshatra)' : 'ജന്മ നക്ഷത്രം'}
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3 w-4 h-4 text-[#8C6219]" />
                    <select
                      value={starId}
                      onChange={(e) => setStarId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    >
                      <option value="">{language === 'en' ? 'Select Star' : 'നക്ഷത്രം തിരഞ്ഞെടുക്കുക'}</option>
                      {NAKSHATRAS.map((star) => (
                        <option key={star.id} value={star.id.toString()}>
                          {star.nameEn} ({star.nameMl})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Date of Offering & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {language === 'en' ? 'Preferred Date' : 'വഴിപാട് തീയതി'} *
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
                  {language === 'en' ? 'Quantity / എണ്ണം' : 'എണ്ണം'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                />
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                {language === 'en' ? 'Special Prayer Intentions / Notes' : 'പ്രത്യേക പ്രാർത്ഥനാ വിഷയം (ഐച്ഛികം)'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'en' ? 'Special prayer intentions...' : 'പ്രാർത്ഥനാ വിഷയങ്ങൾ...'}
                className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none"
              />
            </div>

            {/* Total Estimated Calculation */}
            <div className="p-3 rounded-xl bg-[#FAF5E8] border border-[#C99738]/40 flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6219]">
                {language === 'en' ? 'Subtotal Amount:' : 'ആകെ തുക:'}
              </span>
              <span className="font-cinzel font-extrabold text-base sm:text-lg text-[#610C1B]">
                ₹{(currentOffering.price * quantity).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Action Buttons: Add to Cart & Direct WhatsApp */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-[#FAF5E8] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#E6BE65]" />
                <span>{language === 'en' ? 'Add to Cart' : 'കാർട്ടിലേക്ക് ചേർക്കുക'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsAppSend}
                className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
                title="Direct WhatsApp Inquiry"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'en' ? 'Inquire via WhatsApp' : 'വാട്സാപ്പ് വഴി'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
