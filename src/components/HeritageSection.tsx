'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MuralDivider } from './MuralDivider';
import { Landmark, Sparkles, Compass, Shield, Flame, Droplets } from 'lucide-react';

export const HeritageSection: React.FC = () => {
  const { language, t } = useLanguage();

  const features = [
    {
      id: 'vattasreekovil',
      title: {
        en: 'Vattasreekovil (Circular Sanctum)',
        ml: 'വൃത്തശ്രീകോവിൽ',
      },
      subtitle: {
        en: 'The Inner Sanctum Sanctorum',
        ml: 'ഗർഭഗൃഹ നിർമ്മിതി',
      },
      description: {
        en: 'Built in the classical circular Vastu style with granite plinth and conical copper-tiled roof, symbolizing the cosmic universe harboring Lord Mahadeva.',
        ml: 'തന്ത്രശാസ്ത്ര വിധിപ്രകാരം നിർമ്മിച്ച വൃത്തശ്രീകോവിൽ. പ്രപഞ്ചത്തിന്റെ കേന്ദ്രബിന്ദുവായി ശിവലിംഗ പ്രതിഷ്ഠ കുടികൊള്ളുന്നു.',
      },
      icon: <Landmark className="w-5 h-5 text-[#C99738]" />,
    },
    {
      id: 'namaskara_mandapam',
      title: {
        en: 'Namaskara Mandapam',
        ml: 'നമസ്കാര മണ്ഡപം',
      },
      subtitle: {
        en: 'Pavilion for Vedic Recitation',
        ml: 'തന്ത്രിമുഖ്യരുടെ പവിത്ര മണ്ഡപം',
      },
      description: {
        en: 'The raised pillared pavilion directly facing the sanctum where the Thanthri and Namboothiri priests conduct sacred homams, Sahasranama japa, and Kalasha poojas.',
        ml: 'ശ്രീകോവിലിന് നേരെ മുന്നിലുള്ള മണ്ഡപം. തന്ത്രിമാരും പൂജാരിമാരും ഹോമങ്ങളും മന്ത്രജപങ്ങളും നടത്തുന്നത് ഇവിടെയാണ്.',
      },
      icon: <Compass className="w-5 h-5 text-[#C99738]" />,
    },
    {
      id: 'chuttambalam',
      title: {
        en: 'Chuttambalam & Vilakkumadam',
        ml: 'ചുറ്റമ്പലവും വിളക്കുമാടവും',
      },
      subtitle: {
        en: 'Concentric Cloistered Courtyard',
        ml: 'ദീപാലങ്കാര ചുറ്റമ്പലം',
      },
      description: {
        en: 'The cloistered perimeter structure surrounding the central sanctum, lined with hundreds of small brass oil lamps that illuminate brilliantly during Deeparadhana.',
        ml: 'ശ്രീകോവിലിന് ചുറ്റുമുള്ള പ്രദക്ഷിണ വഴി. സന്ധ്യാസമയത്ത് നൂറുകണക്കിന് വിളക്കുകൾ തെളിയുമ്പോൾ ഭക്തിസാന്ദ്രമായ അന്തരീക്ഷം രൂപപ്പെടുന്നു.',
      },
      icon: <Flame className="w-5 h-5 text-[#C99738]" />,
    },
    {
      id: 'balikkalpura',
      title: {
        en: 'Valiya Balikkallu & Balikkalpura',
        ml: 'വലിയ ബലിക്കല്ല് & ബലിക്കൽപ്പുര',
      },
      subtitle: {
        en: 'The Guardian Energy Altar',
        ml: 'ദ്വാരപാലക സങ്കേതം',
      },
      description: {
        en: 'The monumental stone altar at the temple entrance where food offerings (Bali) are dedicated to guardian deities and universal cosmic energies.',
        ml: 'ക്ഷേത്ര പ്രവേശന കവാടത്തിലെ പ്രധാന ബലിപീഠം. അഷ്ടദിക്പാലകർക്കുള്ള ഹവിസ്സ് അർപ്പിക്കുന്നത് ഇവിടെയാണ്.',
      },
      icon: <Shield className="w-5 h-5 text-[#C99738]" />,
    },
  ];

  return (
    <section id="heritage" className="py-16 md:py-24 bg-[#FAF5E8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610C1B]/10 border border-[#610C1B]/20 text-xs font-bold text-[#610C1B] uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5 text-[#C99738]" />
            <span>{t('heritage_eyebrow')}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#38050E] mb-3">
            {t('heritage_title')}
          </h2>

          <p className="text-sm sm:text-base text-[#5A382A] font-light leading-relaxed">
            {t('heritage_subtitle')}
          </p>

          <MuralDivider variant="simple" className="my-2" />
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="glass-card rounded-2xl p-6 sm:p-7 border border-[#E4D5AE] shadow-sm card-hover-effect flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#610C1B] flex items-center justify-center flex-shrink-0 shadow-md">
                {feature.icon}
              </div>

              <div>
                <div className="text-xs text-[#8C6219] font-bold uppercase tracking-wider font-cinzel mb-0.5">
                  {feature.subtitle[language]}
                </div>
                <h3 className="font-cinzel font-bold text-base md:text-lg text-[#38050E] mb-2">
                  {feature.title[language]}
                </h3>
                <p className="text-xs sm:text-sm text-[#36241C] leading-relaxed font-light">
                  {feature.description[language]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
