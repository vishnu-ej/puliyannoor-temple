'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { OFFERINGS } from '../data/offerings';
import { OfferingItem, OfferingCategory } from '../types';
import { MuralDivider } from './MuralDivider';
import {
  Sparkles,
  Flame,
  Search,
  CheckCircle2,
  Tag,
  ArrowRight,
  Droplets,
  Flower2,
  Cookie,
  Crown,
  Sun,
  Building,
  Copy,
  Check,
  QrCode,
  HeartHandshake,
} from 'lucide-react';

interface OfferingsSectionProps {
  onSelectOffering: (offering: OfferingItem) => void;
}

export const OfferingsSection: React.FC<OfferingsSectionProps> = ({
  onSelectOffering,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<OfferingCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const categories: { id: OfferingCategory; labelKey: string }[] = [
    { id: 'all', labelKey: 'filter_all' },
    { id: 'pooja_homam', labelKey: 'filter_pooja_homam' },
    { id: 'abhishekam_dhara', labelKey: 'filter_abhishekam_dhara' },
    { id: 'archana_pushpanjali', labelKey: 'filter_archana_pushpanjali' },
    { id: 'nivedyam_payasam', labelKey: 'filter_nivedyam_payasam' },
    { id: 'vilakku_mala', labelKey: 'filter_vilakku_mala' },
    { id: 'special_sevas', labelKey: 'filter_special_sevas' },
  ];

  const filteredOfferings = OFFERINGS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSlNo = item.slNo.toString() === query || `#${item.slNo}` === query;
    const matchesName =
      item.name.en.toLowerCase().includes(query) ||
      item.name.ml.toLowerCase().includes(query);
    const matchesDesc =
      item.description.en.toLowerCase().includes(query) ||
      item.description.ml.toLowerCase().includes(query);
    const matchesBenefit =
      item.significance.en.toLowerCase().includes(query) ||
      item.significance.ml.toLowerCase().includes(query);

    return matchesCategory && (matchesSlNo || matchesName || matchesDesc || matchesBenefit);
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pooja_homam':
        return <Flame className="w-4 h-4 text-[#8C6219]" />;
      case 'abhishekam_dhara':
        return <Droplets className="w-4 h-4 text-[#1F4E34]" />;
      case 'archana_pushpanjali':
        return <Flower2 className="w-4 h-4 text-[#C99738]" />;
      case 'nivedyam_payasam':
        return <Cookie className="w-4 h-4 text-[#8C6219]" />;
      case 'vilakku_mala':
        return <Sun className="w-4 h-4 text-[#C99738]" />;
      case 'special_sevas':
        return <Crown className="w-4 h-4 text-[#610C1B]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#C99738]" />;
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <section id="offerings" className="py-12 md:py-20 bg-[#FAF5E8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
            <span>{t('offerings_eyebrow')}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] mb-3">
            {t('offerings_title')}
          </h2>

          <p className="text-xs sm:text-base text-[#5A382A] font-light leading-relaxed">
            {t('offerings_subtitle')}
          </p>

          <MuralDivider variant="simple" className="my-3" />
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4 mb-8 max-w-5xl mx-auto">
          {/* Search Box */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8C6219]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_offerings_placeholder')}
              className="w-full pl-10 pr-16 py-2.5 rounded-full border border-[#E4D5AE] bg-white text-sm text-[#2B150F] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C99738]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-xs font-semibold text-[#8C6219] hover:text-[#610C1B] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#610C1B] text-[#FAF5E8] shadow-md'
                    : 'bg-[#F3EBD7] text-[#5A382A] hover:bg-[#E4D5AE] border border-[#E4D5AE]'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>

          {/* Result Count Indicator */}
          <div className="text-center text-xs text-[#8C6219] font-medium">
            <span>
              {language === 'en'
                ? `Showing ${filteredOfferings.length} of ${OFFERINGS.length} offerings`
                : `${OFFERINGS.length} വഴിപാടുകളിൽ ${filteredOfferings.length} എണ്ണം കാണിക്കുന്നു`}
            </span>
          </div>
        </div>

        {/* Offerings Grid */}
        {filteredOfferings.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl max-w-md mx-auto">
            <p className="text-sm text-[#5A382A] mb-3">
              {language === 'en'
                ? 'No offerings found matching your search.'
                : 'തിരഞ്ഞ വഴിപാടുകൾ കണ്ടെത്താനായില്ല.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-[#610C1B] underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
            {filteredOfferings.map((offering) => (
              <div
                key={offering.id}
                className="glass-card rounded-2xl p-5 sm:p-6 border border-[#E4D5AE] shadow-sm card-hover-effect flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Sl No badge, Category Icon, Tag, and Price */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#38050E] text-[#E6BE65] font-cinzel font-bold text-xs flex items-center justify-center border border-[#C99738]/50 shadow-sm flex-shrink-0">
                        {offering.slNo}
                      </span>
                      <div className="p-1.5 rounded-lg bg-[#FAF5E8] border border-[#E4D5AE]">
                        {getCategoryIcon(offering.category)}
                      </div>
                      {offering.tag && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C99738]/20 text-[#8C6219] border border-[#C99738]/40 truncate max-w-[120px]">
                          {offering.tag[language]}
                        </span>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-cinzel font-extrabold text-lg md:text-xl text-[#610C1B]">
                        ₹{offering.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Offering Name */}
                  <h3 className="font-cinzel font-bold text-base md:text-lg text-[#38050E] mb-1">
                    {offering.name[language]}
                  </h3>
                  <div className="font-malayalam-sans text-xs text-[#8C6219] font-medium mb-3">
                    {offering.name[language === 'en' ? 'ml' : 'en']}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#36241C] leading-relaxed mb-4 font-light">
                    {offering.description[language]}
                  </p>
                </div>

                <div>
                  {/* Significance / Benefits Callout */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#F3EBD7]/80 border border-[#E4D5AE] mb-4 text-xs text-[#5A382A]">
                    <span className="font-bold text-[#8C6219] block mb-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#1F4E34]" />
                      {t('lbl_benefits')}:
                    </span>
                    <span>{offering.significance[language]}</span>
                  </div>

                  {/* Action Button: Inquire */}
                  <button
                    onClick={() => onSelectOffering(offering)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-[#FAF5E8] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
                  >
                    <span>{t('btn_inquire_offering')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E6BE65]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bank Details & Donations Box */}
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border-2 border-[#C99738] shadow-xl bg-gradient-to-br from-[#FAF5E8] via-[#F3EBD7] to-[#FAF5E8] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#C99738]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-8 relative z-10">
            {/* Left Side: Bank Details */}
            <div className="flex-1 space-y-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#610C1B] text-[#E6BE65] flex items-center justify-center shadow-md">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#38050E]">
                    {language === 'en' ? 'Temple Donations & Direct Bank Transfer' : 'ക്ഷേത്ര സംഭാവനകൾ & ബാങ്ക് വിവരങ്ങൾ'}
                  </h3>
                  <p className="text-xs text-[#8C6219] font-medium font-cinzel">
                    Puliyannoor Branch Managing Trustee & Treasurer
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-[#E4D5AE] shadow-inner space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-[#E4D5AE]/60 pb-2">
                  <span className="text-[#8C6219] font-bold">Bank:</span>
                  <span className="font-bold text-[#38050E]">CANARA BANK (കനറാ ബാങ്ക്)</span>
                </div>

                <div className="flex justify-between items-center border-b border-[#E4D5AE]/60 pb-2">
                  <span className="text-[#8C6219] font-bold">Account Name:</span>
                  <span className="font-bold text-[#38050E]">Puliyannoor Devaswom</span>
                </div>

                <div className="flex justify-between items-center border-b border-[#E4D5AE]/60 pb-2">
                  <span className="text-[#8C6219] font-bold">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm sm:text-base text-[#610C1B]">
                      5636101001111
                    </span>
                    <button
                      onClick={() => handleCopy('5636101001111', 'account')}
                      className="p-1 rounded text-[#8C6219] hover:text-[#610C1B] hover:bg-[#FAF5E8] transition-colors cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedField === 'account' ? (
                        <Check className="w-3.5 h-3.5 text-[#1F4E34]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8C6219] font-bold">IFSC Code:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm sm:text-base text-[#610C1B]">
                      CNRB0005636
                    </span>
                    <button
                      onClick={() => handleCopy('CNRB0005636', 'ifsc')}
                      className="p-1 rounded text-[#8C6219] hover:text-[#610C1B] hover:bg-[#FAF5E8] transition-colors cursor-pointer"
                      title="Copy IFSC Code"
                    >
                      {copiedField === 'ifsc' ? (
                        <Check className="w-3.5 h-3.5 text-[#1F4E34]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#5A382A] italic">
                {language === 'en'
                  ? '* Devotees transferring funds for major poojas or Annadanam are kindly requested to share the transaction screenshot to the Devaswom WhatsApp.'
                  : '* ബാങ്ക് വഴി വഴിപാടുകൾക്ക് തുക അയക്കുന്ന ഭക്തർ രസീത് ദേവസ്വം വാട്സാപ്പിൽ അയച്ചു നൽകണമെന്ന് അഭ്യർത്ഥിക്കുന്നു.'}
              </p>
            </div>

            {/* Right Side: QR Code Box Placeholder */}
            <div className="w-full md:w-56 bg-white/90 rounded-2xl p-4 border-2 border-dashed border-[#C99738] flex flex-col items-center justify-center text-center shadow-inner flex-shrink-0">
              <div className="w-32 h-32 rounded-xl bg-[#FAF5E8] border border-[#E4D5AE] flex flex-col items-center justify-center p-3 relative group">
                <QrCode className="w-16 h-16 text-[#610C1B] mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C6219]">
                  Scan & Pay
                </span>
                <span className="text-[8px] text-[#5A382A]">UPI / QR Code</span>
              </div>
              <span className="text-[11px] font-bold text-[#38050E] mt-3 font-cinzel">
                Devaswom UPI QR
              </span>
              <span className="text-[10px] text-[#8C6219]">
                {language === 'en' ? 'Direct UPI Payment' : 'നേരിട്ടുള്ള യുപിഐ പേയ്മെന്റ്'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
