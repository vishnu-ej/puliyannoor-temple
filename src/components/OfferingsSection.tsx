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
  Shield,
  Layers,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

                  {/* Action Button */}
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
      </div>
    </section>
  );
};
