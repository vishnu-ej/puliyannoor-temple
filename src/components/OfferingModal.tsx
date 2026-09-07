'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useContent } from '../context/ContentContext';
import { OfferingItem } from '../types';
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
  Phone,
  MessageSquare,
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
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { offerings, contactInfo } = useContent();

  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(
    initialOffering?.id || (offerings[0] ? offerings[0].id : 'udayasthamana_pooja')
  );
  const [devoteeName, setDevoteeName] = useState('');
  const [starId, setStarId] = useState<string>('');
  const [familyName, setFamilyName] = useState('');
  const [place, setPlace] = useState('');
  const [offeringDate, setOfferingDate] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (initialOffering) {
      setSelectedOfferingId(initialOffering.id);
    } else if (offerings[0]) {
      setSelectedOfferingId(offerings[0].id);
    }
  }, [initialOffering, offerings]);

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

  const currentOffering = offerings.find((o) => o.id === selectedOfferingId) || offerings[0];
  const selectedStar = NAKSHATRAS.find((n) => n.id.toString() === starId);
  const isKoottuNamaskaram = currentOffering?.id === 'koottu_namaskaram';

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOffering) return;

    if (isKoottuNamaskaram) {
      if (!familyName.trim() || !place.trim()) {
        alert(
          language === 'en'
            ? 'Please enter Family / Illam Name and Place for Koottu Namaskaram'
            : 'കൂട്ടനമസ്കാരത്തിനായി കുടുംബപ്പേരും സ്ഥലവും നൽകുക'
        );
        return;
      }
    } else {
      if (!devoteeName.trim()) {
        alert(
          language === 'en'
            ? 'Please enter Devotee Name'
            : 'ഭക്തന്റെ പേര് രേഖപ്പെടുത്തുക'
        );
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
    if (!currentOffering) return;
    let devoteeInfo = '';
    if (isKoottuNamaskaram) {
      devoteeInfo = `*Family Name (കുടുംബപ്പേര്):* ${familyName.trim() || 'Not specified'}\n*Place (സ്ഥലം):* ${place.trim() || 'Not specified'}`;
    } else {
      const starName = selectedStar
        ? `${selectedStar.nameEn} (${selectedStar.nameMl})`
        : 'Not specified';
      devoteeInfo = `*Devotee Name (ഭക്തന്റെ പേര്):* ${devoteeName.trim() || 'Not specified'}\n*Birth Star (നക്ഷത്രം):* ${starName}`;
    }

    const message = `*Puliyannoor Sree Mahadeva Temple - Vazhipadu Inquiry*
--------------------------------------------
*Offering:* ${currentOffering.name.en} (${currentOffering.name.ml})
*Rate:* ₹${currentOffering.price.toLocaleString('en-IN')}
*Quantity:* ${quantity} (Total: ₹${(currentOffering.price * quantity).toLocaleString('en-IN')})
*Preferred Date:* ${offeringDate}
--------------------------------------------
${devoteeInfo}
${phone.trim() ? `*Contact Phone:* ${countryCode} ${phone.trim()}\n` : ''}${notes.trim() ? `*Special Prayer/Notes:* ${notes.trim()}\n` : ''}--------------------------------------------
_Inquiry submitted via official temple web portal_`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${contactInfo.whatsapp}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1A0409]/80 backdrop-blur-sm animate-fadeIn">
      {/* Outer Modal Container with overflow-hidden to keep scrollbar strictly inside rounded boundaries */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-[#C99738] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        {/* Fixed Header */}
        <div className="shrink-0 bg-gradient-to-r from-[#1A0409] via-[#38050E] to-[#610C1B] text-[#FAF5E8] px-5 sm:px-6 py-4 border-b border-[#C99738]/40 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C99738]/20 border border-[#C99738]/50 flex items-center justify-center text-[#E6BE65] shadow-inner">
              <Sparkles className="w-5 h-5 text-[#E6BE65]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#E6BE65]/90">
                <span>ॐ ശ്രീ പുളിയന്നൂർ മഹാദേവ ക്ഷേത്രം ॐ</span>
              </div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#FFFDF9] leading-snug">
                {language === 'en' ? 'Offering Booking & Inquiry' : 'വഴിപാട് ബുക്കിംഗും അന്വേഷണവും'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#E6BE65] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body - Scrollbar is safely contained inside the rounded container */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4 overscroll-contain [scrollbar-width:thin] [scrollbar-color:#C99738_#FFFDF9]">
          {/* Selected Offering Details Banner */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#38050E] to-[#610C1B] text-[#FAF5E8] shadow-md border border-[#C99738]/50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#E6BE65] font-semibold block mb-0.5">
                  {language === 'en' ? 'Selected Vazhipadu' : 'തിരഞ്ഞെടുത്ത വഴിപാട്'}
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white truncate">
                  {currentOffering?.name[language]}
                </h3>
                <p className="font-malayalam-sans text-xs text-[#E6BE65] mt-0.5">
                  {currentOffering?.name[language === 'en' ? 'ml' : 'en']}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-[#FAF5E8]/70 block mb-0.5">
                  {language === 'en' ? 'Total Rate' : 'ആകെ നിരക്ക്'}
                </span>
                <div className="font-cinzel text-xl sm:text-2xl font-black text-[#E6BE65]">
                  ₹{(currentOffering ? currentOffering.price * quantity : 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#FAF5E8]/90 font-medium">
                {language === 'en' ? 'Quantity (എണ്ണം):' : 'വഴിപാടുകളുടെ എണ്ണം:'}
              </span>
              <div className="flex items-center gap-2 bg-black/30 px-2.5 py-1 rounded-xl border border-[#C99738]/40">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 rounded bg-white/15 hover:bg-white/30 text-[#FAF5E8] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-mono font-bold text-sm text-[#E6BE65] min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 rounded bg-white/15 hover:bg-white/30 text-[#FAF5E8] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleAddToCart} className="space-y-4">
            {/* Choose Offering Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1.5 font-cinzel">
                {language === 'en' ? 'Choose Offering (വഴിപാട്)' : 'വഴിപാട് തിരഞ്ഞെടുക്കുക'}
              </label>
              <select
                value={selectedOfferingId}
                onChange={(e) => setSelectedOfferingId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] focus:border-[#610C1B] font-medium shadow-sm transition-all"
              >
                {offerings.map((off) => (
                  <option key={off.id} value={off.id}>
                    #{off.slNo} - {off.name.ml} / {off.name.en} (₹{off.price.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Conditional Details: Koottu Namaskaram vs Regular Offering */}
            {isKoottuNamaskaram ? (
              <div className="p-4 rounded-2xl bg-[#C99738]/10 border border-[#C99738]/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#610C1B] font-cinzel">
                  <Home className="w-4 h-4 text-[#C99738]" />
                  <span>
                    {language === 'en'
                      ? 'Koottu Namaskaram Family Details'
                      : 'കൂട്ടനമസ്കാരം കുടുംബ വിവരങ്ങൾ'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8C6219] mb-1">
                    {language === 'en'
                      ? 'Family / Illam Name *'
                      : 'കുടുംബപ്പേര് / ഇല്ലപ്പേര് *'}
                  </label>
                  <div className="relative">
                    <Home className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={
                        language === 'en'
                          ? 'e.g. Vadakkedathu Mana / Family Name'
                          : 'ഉദാ: വടക്കേടത്ത് ഇല്ലം / കുടുംബപ്പേര്'
                      }
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-sm text-[#2B150F] placeholder:text-stone-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#C99738] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8C6219] mb-1">
                    {language === 'en'
                      ? 'Place / Residence *'
                      : 'സ്ഥലം / വിലാസം *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={
                        language === 'en'
                          ? 'e.g. Puliyannoor, Pala'
                          : 'ഉദാ: പുളിയന്നൂർ, പാലാ'
                      }
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-sm text-[#2B150F] placeholder:text-stone-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#C99738] shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Devotee Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1.5 font-cinzel">
                    {language === 'en'
                      ? 'Devotee Full Name * (ഭക്തന്റെ പേര്)'
                      : 'ഭക്തന്റെ പേര് * (Devotee Full Name)'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={
                        language === 'en'
                          ? 'e.g. Suresh Kumar / സുരേഷ് കുമാർ'
                          : 'ഉദാ: സുരേഷ് കുമാർ / Suresh Kumar'
                      }
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-sm text-[#2B150F] placeholder:text-stone-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#C99738] shadow-sm"
                    />
                  </div>
                </div>

                {/* Birth Star Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1.5 font-cinzel">
                    {language === 'en'
                      ? 'Birth Star (ജന്മനക്ഷത്രം)'
                      : 'ജന്മനക്ഷത്രം (Birth Star)'}
                  </label>
                  <div className="relative">
                    <Star className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={starId}
                      onChange={(e) => setStarId(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] shadow-sm font-medium"
                    >
                      <option value="">
                        {language === 'en'
                          ? '-- Select Birth Star (നക്ഷത്രം തിരഞ്ഞെടുക്കുക) --'
                          : '-- നക്ഷത്രം തിരഞ്ഞെടുക്കുക (Select Birth Star) --'}
                      </option>
                      {NAKSHATRAS.map((nak) => (
                        <option key={nak.id} value={nak.id}>
                          {nak.id}. {nak.nameMl} ({nak.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1.5 font-cinzel">
                {language === 'en'
                  ? 'Preferred Date of Offering * (വഴിപാട് തീയതി)'
                  : 'വഴിപാട് നടത്തേണ്ട തീയതി * (Preferred Date)'}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={offeringDate}
                  onChange={(e) => setOfferingDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] shadow-sm"
                />
              </div>
            </div>

            {/* Contact Phone with Country Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1.5 font-cinzel">
                {language === 'en'
                  ? 'Contact Phone / WhatsApp (ഫോൺ നമ്പർ)'
                  : 'ഫോൺ / വാട്സാപ്പ് നമ്പർ (Contact Phone)'}
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-36 px-2 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-xs font-mono font-bold text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738] shadow-sm"
                >
                  <option value="+91">+91 (India 🇮🇳)</option>
                  <option value="+1">+1 (USA/Canada 🇺🇸)</option>
                  <option value="+971">+971 (UAE 🇦🇪)</option>
                  <option value="+966">+966 (Saudi 🇸🇦)</option>
                  <option value="+968">+968 (Oman 🇴🇲)</option>
                  <option value="+974">+974 (Qatar 🇶🇦)</option>
                  <option value="+973">+973 (Bahrain 🇧🇭)</option>
                  <option value="+965">+965 (Kuwait 🇰🇼)</option>
                  <option value="+44">+44 (UK 🇬🇧)</option>
                  <option value="+65">+65 (Singapore 🇸🇬)</option>
                  <option value="+60">+60 (Malaysia 🇲🇾)</option>
                  <option value="+61">+61 (Australia 🇦🇺)</option>
                  <option value="+49">+49 (Germany 🇩🇪)</option>
                  <option value="+33">+33 (France 🇫🇷)</option>
                  <option value="+41">+41 (Switzerland 🇨🇭)</option>
                  <option value="+64">+64 (New Zealand 🇳🇿)</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder={
                      countryCode === '+91'
                        ? '10-digit mobile number (e.g. 98470 12345)'
                        : 'Contact number'
                    }
                    maxLength={countryCode === '+91' ? 10 : 15}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-sm text-[#2B150F] placeholder:text-stone-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#C99738] font-mono shadow-sm"
                  />
                </div>
              </div>
              {phone && countryCode === '+91' && phone.length !== 10 && (
                <p className="text-[11px] text-amber-700 mt-1 font-medium">
                  ⚠️ Indian mobile number must be exactly 10 digits ({phone.length}/10 entered)
                </p>
              )}
            </div>

            {/* Special Prayer / Sankalpam */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1.5 font-cinzel">
                {language === 'en'
                  ? 'Special Prayer / Sankalpam (പ്രാർത്ഥന / സങ്കൽപ്പം)'
                  : 'പ്രാർത്ഥന / സങ്കൽപ്പം (Special Prayer)'}
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                <textarea
                  rows={2}
                  placeholder={
                    language === 'en'
                      ? 'e.g. For good health, family prosperity, birthday, wedding anniversary...'
                      : 'ഉദാ: ദീർഘായുസ്സ്, കുടുംബൈശ്വര്യം, പിറന്നാൾ, വിവാഹ വാർഷികം...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C99738]/50 bg-white text-sm text-[#2B150F] placeholder:text-stone-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none shadow-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              {/* Primary Action Button: Add to Cart */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#610C1B] via-[#8B1428] to-[#610C1B] hover:brightness-110 text-white font-cinzel font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-[#610C1B]/30 border border-[#E6BE65]/40 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#E6BE65]" />
                <span>
                  {language === 'en'
                    ? 'Book Offering (Add to Cart)'
                    : 'വഴിപാട് ബുക്ക് ചെയ്യുക (കാർട്ടിലേക്ക് ചേർക്കുക)'}
                </span>
              </button>

              {/* Secondary Action: Direct WhatsApp Inquire */}
              <button
                type="button"
                onClick={handleDirectWhatsAppSend}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>
                  {language === 'en'
                    ? 'Inquire via WhatsApp'
                    : 'വാട്സാപ്പ് വഴി ചോദിക്കുക (WhatsApp Inquire)'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

