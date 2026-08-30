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
    if (!currentOffering) return;
    let devoteeInfo = '';
    if (isKoottuNamaskaram) {
      devoteeInfo = `*Family Name:* ${familyName.trim() || 'Not specified'}\n*Place:* ${place.trim() || 'Not specified'}`;
    } else {
      const starName = selectedStar
        ? `${selectedStar.nameEn} (${selectedStar.nameMl})`
        : 'Not specified';
      devoteeInfo = `*Devotee Name:* ${devoteeName.trim() || 'Not specified'}\n*Birth Star (നക്ഷത്രം):* ${starName}`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0409]/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#C99738] shadow-2xl relative max-h-[92vh] overflow-y-auto bg-[#FAF5E8] animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#8C6219] hover:bg-[#610C1B] hover:text-[#FAF5E8] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
            <span>{language === 'en' ? 'Offering Inquiry' : 'വഴിപാട് അന്വേഷണം'}</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#38050E]">
            {currentOffering?.name[language]}
          </h2>
          <div className="font-malayalam-sans text-xs text-[#8C6219] font-semibold mt-0.5">
            {currentOffering?.name[language === 'en' ? 'ml' : 'en']}
          </div>
        </div>

        {/* Selected Offering Info Box */}
        <div className="rounded-2xl p-4 bg-gradient-to-r from-[#610C1B] to-[#38050E] text-[#FAF5E8] mb-6 shadow-md border border-[#C99738]/40">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#E6BE65] font-semibold block">
                {language === 'en' ? 'Offering Rate' : 'വഴിപാട് നിരക്ക്'}
              </span>
              <span className="font-cinzel text-xl sm:text-2xl font-extrabold text-[#FAF5E8]">
                ₹{currentOffering?.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 bg-[#FAF5E8]/15 px-3 py-1.5 rounded-xl border border-[#FAF5E8]/30">
              <span className="text-xs text-[#FAF5E8]/80 font-medium">Qty:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 rounded-md bg-[#FAF5E8]/20 text-[#FAF5E8] font-bold text-xs flex items-center justify-center hover:bg-[#FAF5E8]/40 cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm text-[#E6BE65] min-w-[16px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 rounded-md bg-[#FAF5E8]/20 text-[#FAF5E8] font-bold text-xs flex items-center justify-center hover:bg-[#FAF5E8]/40 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleAddToCart} className="space-y-4">
          {/* Select Offering Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
              {language === 'en' ? 'Select Offering' : 'വഴിപാട് തിരഞ്ഞെടുക്കുക'}
            </label>
            <select
              value={selectedOfferingId}
              onChange={(e) => setSelectedOfferingId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
            >
              {offerings.map((off) => (
                <option key={off.id} value={off.id}>
                  #{off.slNo} - {off.name.ml} / {off.name.en} (₹{off.price.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Fields: Koottu Namaskaram vs Regular Offering */}
          {isKoottuNamaskaram ? (
            <div className="p-3.5 rounded-2xl bg-[#C99738]/15 border border-[#C99738]/40 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#610C1B] font-cinzel">
                <Home className="w-4 h-4 text-[#C99738]" />
                <span>Koottu Namaskaram Details / കൂട്ടനമസ്കാരം വിവരങ്ങൾ</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('lbl_family_name')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vadakkedathu (വടക്കേടത്ത് ഇല്ലം/കുടുംബം)"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('lbl_place')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Puliyannoor, Pala"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('form_name')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Devotee Full Name"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  {t('form_star')}
                </label>
                <div className="relative">
                  <Star className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
                  <select
                    value={starId}
                    onChange={(e) => setStarId(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  >
                    <option value="">{t('form_select_star')}</option>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
              {t('form_date')} *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#8C6219] absolute left-3 top-3" />
              <input
                type="date"
                required
                value={offeringDate}
                onChange={(e) => setOfferingDate(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
              />
            </div>
          </div>

          {/* Phone Number with Country Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
              {t('form_phone')}
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-36 px-2 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs font-mono font-bold text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
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
              <input
                type="tel"
                placeholder={countryCode === '+91' ? '10-digit mobile number' : 'Contact number'}
                maxLength={countryCode === '+91' ? 10 : 15}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] font-mono"
              />
            </div>
            {phone && countryCode === '+91' && phone.length !== 10 && (
              <p className="text-[11px] text-amber-700 mt-1">
                ⚠️ Indian mobile number must be exactly 10 digits ({phone.length}/10 entered)
              </p>
            )}
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
              {t('lbl_special_prayer')}
            </label>
            <textarea
              rows={2}
              placeholder="e.g. For birthday / wedding anniversary / health..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] resize-none"
            />
          </div>

          {/* Primary Action Button: Add to Cart */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-[#FAF5E8] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-[#E6BE65]" />
            <span>{t('btn_add_to_cart')}</span>
          </button>

          {/* Secondary Action: Direct WhatsApp Inquire */}
          <button
            type="button"
            onClick={handleDirectWhatsAppSend}
            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1F4E34] font-bold text-xs flex items-center justify-center gap-2 border border-[#25D366]/40 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#25D366]" />
            <span>{t('btn_inquire_whatsapp')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
