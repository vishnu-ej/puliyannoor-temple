import { OfferingItem } from '../types';

export const OFFERINGS: OfferingItem[] = [
  {
    slNo: 1,
    id: 'udayasthamana_pooja',
    name: {
      en: 'Udayasthamana Pooja',
      ml: 'ഉദയാസ്തമന പൂജ',
    },
    category: 'pooja_homam',
    price: 60000,
    description: {
      en: 'The grandest day-long series of 18 sacred poojas and abhishekams from dawn to dusk with special nivedyams and deeparadhana.',
      ml: 'സൂര്യോദയം മുതൽ അസ്തമയം വരെ 18 പൂജകൾ അടങ്ങിയ ക്ഷേത്രത്തിലെ ഏറ്റവും വലിയ മഹാ സമർപ്പണം.',
    },
    significance: {
      en: 'Brings profound generational blessings, removes major karmic obstacles, and bestows family prosperity.',
      ml: 'വംശവർദ്ധനവ്, സർവ്വകാര്യസിദ്ധി, കുടുംബൈശ്വര്യം, ദീർഘകാല ദുരിതശമനം.',
    },
    popular: true,
    tag: {
      en: 'Maha Vazhipadu',
      ml: 'മഹാ വഴിപാട്',
    },
  },
  {
    slNo: 2,
    id: 'oru_divasathe_pooja',
    name: {
      en: 'Oru Divasathe Pooja (Full Day Pooja)',
      ml: 'ഒരു ദിവസത്തെ പൂജ',
    },
    category: 'pooja_homam',
    price: 1500,
    description: {
      en: 'Sponsorship of all daily morning and evening poojas and nivedyams dedicated to Lord Mahadeva for a full day.',
      ml: 'ഒരു ദിവസത്തെ എല്ലാ പൂജകളും നിവേദ്യങ്ങളും ഭക്തന്റെ പേരിൽ ഭഗവാന് സമർപ്പിക്കുന്നു.',
    },
    significance: {
      en: 'Special protection and divine grace on birthdays, wedding anniversaries, or memorable occasions.',
      ml: 'ജന്മദിനം, വിവാഹവാർഷികം തുടങ്ങിയ വിശേഷ ദിവസങ്ങളിൽ കുടുംബ ഐശ്വര്യത്തിനായി.',
    },
    popular: true,
  },
  {
    slNo: 3,
    id: 'oru_nerathe_pooja',
    name: {
      en: 'Oru Nerathe Pooja (Single Session Pooja)',
      ml: 'ഒരു നേരത്തെ പൂജ',
    },
    category: 'pooja_homam',
    price: 750,
    description: {
      en: 'Sponsorship of one complete session (Morning or Evening) pooja and nivedyam.',
      ml: 'ഒരു നേരത്തെ (രാവിലെ അല്ലെങ്കിൽ വൈകിട്ട്) പൂജകളും നിവേദ്യങ്ങളും ഭക്തന്റെ പേരിൽ സമർപ്പിക്കുന്നു.',
    },
    significance: {
      en: 'Mental peace, quick obstacle clearance, and fulfillment of heartfelt prayers.',
      ml: 'മനഃശാന്തി, കാര്യവിജയം, ദൈവാധീനം വർദ്ധിക്കാൻ.',
    },
  },
  {
    slNo: 4,
    id: 'navagraha_pooja',
    name: {
      en: 'Navagraha Pooja',
      ml: 'നവഗ്രഹ പൂജ',
    },
    category: 'pooja_homam',
    price: 1500,
    description: {
      en: 'Special Vedic worship propitiating the nine planetary deities to neutralize astrological afflictions and planetary doshas.',
      ml: 'നവഗ്രഹ ദോഷങ്ങൾ അകറ്റാനും സർവ്വ ഗ്രഹപ്രീതിക്കുമായി നടത്തുന്ന താന്ത്രിക പൂജ.',
    },
    significance: {
      en: 'Mitigates planetary doshas (Sade Sati, Rahu/Ketu/Kuja dosham) and restores harmony.',
      ml: 'ഗ്രഹദോഷ നിവാരണം, ശനിദോഷ ശമനം, തൊഴിൽ തടസ്സങ്ങൾ മാറാൻ.',
    },
  },
  {
    slNo: 5,
    id: 'umamaheswara_pooja',
    name: {
      en: 'Umamaheswara Pooja',
      ml: 'ഉമാമഹേശ്വര പൂജ',
    },
    category: 'pooja_homam',
    price: 250,
    description: {
      en: 'Divine worship of Lord Shiva and Goddess Parvathi in the unified Umamaheswara form.',
      ml: 'ശിവ-പാർവ്വതിമാരെ ഒന്നിച്ച് സങ്കൽപ്പിച്ച് നടത്തുന്ന മംഗളകരമായ പൂജ.',
    },
    significance: {
      en: 'Blesses unmarried devotees with ideal life partners and ensures marital harmony and joy.',
      ml: 'വിവാഹ തടസ്സങ്ങൾ മാറാൻ, ദാമ്പത്യ സൗഖ്യം, ഐക്യം.',
    },
    popular: true,
    tag: {
      en: 'Marriage Blessing',
      ml: 'വിവാഹ സൗഭാഗ്യം',
    },
  },
  {
    slNo: 6,
    id: 'ganapathi_homam',
    name: {
      en: 'Ganapathi Homam',
      ml: 'ഗണപതി ഹോമം',
    },
    category: 'pooja_homam',
    price: 125,
    description: {
      en: 'Sacred dawn fire ritual invoking Lord Ganesha to dispel obstacles from education, business, and new ventures.',
      ml: 'പുലർച്ചെ നടത്തുന്ന തന്ത്രിമുഖ്യ ഗണപതി ഹോമം. സർവ്വ വിഘ്നങ്ങളും നീക്കി ശുഭാരംഭം നൽകുന്നു.',
    },
    significance: {
      en: 'Removes hurdles, brings success in business, exams, job interviews, and property matters.',
      ml: 'വിഘ്നനിവാരണം, കാര്യവിജയം, തൊഴിൽ അഭിവൃദ്ധി.',
    },
    popular: true,
    tag: {
      en: 'Obstacle Removal',
      ml: 'വിഘ്നനിവാരണം',
    },
  },
  {
    slNo: 7,
    id: 'ashtadravya_ganapathi_homam',
    name: {
      en: 'Ashtadravya Ganapathi Homam',
      ml: 'അഷ്ടദ്രവ്യ ഗണപതി ഹോമം',
    },
    category: 'pooja_homam',
    price: 700,
    description: {
      en: 'Elaborate Ganesha fire oblation using eight sacred ingredients (coconut, molasses, sesame, honey, sugarcane, roasted paddy, plantain, dry ginger).',
      ml: 'എട്ട് വിശേഷ ദ്രവ്യങ്ങൾ ഹോമിച്ച് നടത്തുന്ന അതിവിശേഷ ഗണപതി ഹോമം.',
    },
    significance: {
      en: 'Overcomes severe, deep-rooted obstacles, bestows wealth and great auspiciousness.',
      ml: 'വലിയ തടസ്സങ്ങൾ നീങ്ങാൻ, സാമ്പത്തിക അഭിവൃദ്ധി, സർവ്വൈശ്വര്യം.',
    },
    popular: true,
  },
  {
    slNo: 8,
    id: 'karuka_homam',
    name: {
      en: 'Karuka Homam',
      ml: 'കറുക ഹോമം',
    },
    category: 'pooja_homam',
    price: 250,
    description: {
      en: 'Sacred fire oblation with fresh Karuka grass dipped in pure cow ghee.',
      ml: 'ശുദ്ധമായ കറുകപ്പുല്ലും നെയ്യും അർപ്പിച്ച് നടത്തുന്ന വിശേഷാൽ ഹോമം.',
    },
    significance: {
      en: 'Bestows sharp intellect, academic excellence, and cures pediatric illnesses in children.',
      ml: 'വിദ്യാഗുണം, ബുദ്ധിവികാസം, കുട്ടികളുടെ ബാലാരിഷ്ടതകൾ മാറാൻ.',
    },
  },
  {
    slNo: 9,
    id: 'thila_homam',
    name: {
      en: 'Thila Homam',
      ml: 'തിലഹോമം',
    },
    category: 'pooja_homam',
    price: 175,
    description: {
      en: 'Vedic fire ritual performed with holy sesame seeds for ancestral peace and pitru dosha remediation.',
      ml: 'എള്ള് ഹോമിച്ച് നടത്തുന്ന പിതൃപ്രീതികരമായ ഹോമം.',
    },
    significance: {
      en: 'Relieves Pitru dosha, brings peace to departed souls and removes family discord.',
      ml: 'പിതൃദോഷ ശമനം, വംശശാന്തി, കുടുംബ സമാധാനം.',
    },
  },
  {
    slNo: 10,
    id: 'mrityunjaya_homam',
    name: {
      en: 'Maha Mrityunjaya Homam',
      ml: 'മൃത്യുഞ്ജയ ഹോമം',
    },
    category: 'pooja_homam',
    price: 1500,
    description: {
      en: 'Sacred Vedic fire ritual chanting the powerful Maha Mrityunjaya Mantra to conquer death and chronic diseases.',
      ml: 'മൃത്യുഞ്ജയ മന്ത്രജപത്തോടെ നടത്തുന്ന അതിശക്തമായ ഹോമം. ആയുരാരോഗ്യ ദായകം.',
    },
    significance: {
      en: 'Protection from untimely accidents, critical health crises, and bestows longevity and vitality.',
      ml: 'രോഗശാന്തി, ദീർഘായുസ്സ്, അപകടങ്ങളിൽ നിന്നുള്ള രക്ഷ.',
    },
    popular: true,
    tag: {
      en: 'Health & Longevity',
      ml: 'ആയുരാരോഗ്യം',
    },
  },
  {
    slNo: 11,
    id: 'rudrabhishekam',
    name: {
      en: 'Rudrabhishekam',
      ml: 'രുദ്രാഭിഷേകം',
    },
    category: 'abhishekam_dhara',
    price: 45,
    description: {
      en: 'Bathing the Shivalinga while chanting the sacred Sri Rudram hymns from the Yajurveda.',
      ml: 'ശ്രീരുദ്ര മന്ത്രജപത്തോടെ ശിവലിംഗത്തിൽ നടത്തുന്ന പവിത്രമായ അഭിഷേകം.',
    },
    significance: {
      en: 'Purifies the soul, washes away sins, and brings inner tranquility.',
      ml: 'പാപനാശനം, മനഃശാന്തി, ശിവപ്രീതി.',
    },
    popular: true,
  },
  {
    slNo: 12,
    id: 'shankhabhishekam',
    name: {
      en: 'Shankhabhishekam',
      ml: 'ശംഖാഭിഷേകം',
    },
    category: 'abhishekam_dhara',
    price: 400,
    description: {
      en: 'Bathing the deity with sanctified holy water poured through a sacred right-turning conch shell (Dakshinavarti Shankh).',
      ml: 'പവിത്രമായ ശംഖിൽ തീർത്ഥജലം നിറച്ച് ഭഗവാന് നടത്തുന്ന അഭിഷേകം.',
    },
    significance: {
      en: 'Imbues radiant positive energy, wisdom, and auspicious vibrations.',
      ml: 'ഭാഗ്യവർദ്ധനവ്, മനോശക്തി, സകല ഐശ്വര്യങ്ങൾ.',
    },
  },
  {
    slNo: 13,
    id: 'pushpabhishekam',
    name: {
      en: 'Pushpabhishekam',
      ml: 'പുഷ്പാഭിഷേകം',
    },
    category: 'abhishekam_dhara',
    price: 1250,
    description: {
      en: 'Spectacular shower of fragrant fresh flowers covering the sacred Shivalinga.',
      ml: 'വിവിധയിനം സുഗന്ധ പുഷ്പങ്ങൾ കൊണ്ട് ഭഗവാനെ മൂടുന്ന പുഷ്പാഭിഷേകം.',
    },
    significance: {
      en: 'Universal peace, joy, fulfillment of heartfelt desires, and supreme grace.',
      ml: 'മനസ്സന്തോഷം, ഐശ്വര്യം, സർവ്വകാര്യ വിജയം.',
    },
  },
  {
    slNo: 14,
    id: 'ashtabhishekam',
    name: {
      en: 'Ashtabhishekam',
      ml: 'അഷ്ടാഭിഷേകം',
    },
    category: 'abhishekam_dhara',
    price: 1250,
    description: {
      en: 'Holy bathing of the Shivalinga with 8 sacred Dravyas (ghee, milk, curd, honey, sugarcane juice, tender coconut water, sandalwood, panchamritham).',
      ml: 'നെയ്യ്, പാൽ, തൈര്, തേൻ, കരിമ്പ് നീര്, ഇളനീർ, ചന്ദനം, പഞ്ചാമൃതം എന്നീ എട്ട് ദ്രവ്യങ്ങളാൽ നടത്തുന്ന അഭിഷേകം.',
    },
    significance: {
      en: 'All-round physical health, prosperity, and divine spiritual awakening.',
      ml: 'ആരോഗ്യം, ഐശ്വര്യം, സർവ്വ ഗ്രഹദോഷ ശമനം.',
    },
    popular: true,
  },
  {
    slNo: 15,
    id: 'pushpanjali',
    name: {
      en: 'Pushpanjali (Floral Offering)',
      ml: 'പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 20,
    description: {
      en: 'Simple floral offering performed in the devotee’s name and birth star.',
      ml: 'ഭക്തന്റെ പേരും നക്ഷത്രവും ചൊല്ലി നടത്തുന്ന ലളിതമായ പുഷ്പാർച്ചന.',
    },
    significance: {
      en: 'Daily protection and divine blessings.',
      ml: 'നിത്യ സംരക്ഷണം, ദൈവാധീനം.',
    },
    popular: true,
  },
  {
    slNo: 16,
    id: 'mrityunjaya_pushpanjali',
    name: {
      en: 'Mrityunjaya Pushpanjali',
      ml: 'മൃത്യുഞ്ജയ പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Floral worship accompanied by the sacred Maha Mrityunjaya mantra.',
      ml: 'മൃത്യുഞ്ജയ മന്ത്രജപത്തോടെ നടത്തുന്ന പ്രത്യേക പുഷ്പാഞ്ജലി.',
    },
    significance: {
      en: 'Relief from illnesses, mental anxieties, and fear of accidents.',
      ml: 'രോഗശമനം, ഭയനിവാരണം, ആയുർവർദ്ധനവ്.',
    },
    popular: true,
  },
  {
    slNo: 17,
    id: 'bhagya_sooktha_pushpanjali',
    name: {
      en: 'Bhagya Sooktha Pushpanjali',
      ml: 'ഭാഗ്യസൂക്ത പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Pushpanjali chanting the Vedic Bhagya Sooktham invoking fortune and prosperity.',
      ml: 'ഭാഗ്യസൂക്ത മന്ത്രങ്ങൾ ചൊല്ലി ഭഗവാന് സമർപ്പിക്കുന്ന പുഷ്പാഞ്ജലി.',
    },
    significance: {
      en: 'Attracts good fortune, financial growth, and career breakthroughs.',
      ml: 'ഭാഗ്യവർദ്ധനവ്, ധനാഗമം, തൊഴിൽ വിജയം.',
    },
    popular: true,
  },
  {
    slNo: 18,
    id: 'vidya_sooktha_pushpanjali',
    name: {
      en: 'Vidya Sooktha Pushpanjali',
      ml: 'വിദ്യാസക്ത പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Special floral offering with Vidya Sooktham for academic excellence and memory.',
      ml: 'വിദ്യാസൂക്ത മന്ത്രജപത്തോടെ വിദ്യാർത്ഥികൾക്കായി നടത്തുന്ന പുഷ്പാഞ്ജലി.',
    },
    significance: {
      en: 'Enhances focus, grasping power, and success in examinations.',
      ml: 'വിദ്യാവിജയം, ഓർമ്മശക്തി, പരീക്ഷാവിജയം.',
    },
    popular: true,
  },
  {
    slNo: 19,
    id: 'swayamvara_pushpanjali',
    name: {
      en: 'Swayamvara Pushpanjali',
      ml: 'സ്വയംവര പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Sacred Pushpanjali for clearing hurdles in finding a suitable marriage partner.',
      ml: 'വിവാഹ തടസ്സങ്ങൾ നീങ്ങാൻ സ്വയംവര മന്ത്രം ചൊല്ലി നടത്തുന്ന പുഷ്പാഞ്ജലി.',
    },
    significance: {
      en: 'Accelerates marriage alliances and bestows a harmonious married life.',
      ml: 'വിവാഹ തടസ്സങ്ങൾ നീങ്ങാൻ, മാംഗല്യസിദ്ധി.',
    },
    popular: true,
  },
  {
    slNo: 20,
    id: 'aghora_manthra_pushpanjali',
    name: {
      en: 'Aghora Manthra Pushpanjali',
      ml: 'അഘോരമന്ത്ര പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Powerful floral offering with Aghora Rudra mantra for spiritual protection.',
      ml: 'ശിവന്റെ അഘോരമൂർത്തി ഭാവത്തിൽ അഘോരമന്ത്രം ചൊല്ലി നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Destroys negative evil eyes (drishti dosham), black magic, and fears.',
      ml: 'ശത്രുദോഷ ശമനം, ദൃഷ്ടിദോഷം മാറാൻ, ദുഷ്ടശക്തികളിൽ നിന്നുള്ള രക്ഷ.',
    },
  },
  {
    slNo: 21,
    id: 'thrayambaka_pushpanjali',
    name: {
      en: 'Thrayambaka Pushpanjali',
      ml: 'ത്രയംബക പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Floral offering dedicated to the Three-Eyed Lord Mahadeva (Trayambaka).',
      ml: 'ത്രിലോചനനായ മഹാദേവന് സമർപ്പിക്കുന്ന വിശേഷാൽ പുഷ്പാഞ്ജലി.',
    },
    significance: {
      en: 'Bestows health, freedom from addictions, and peaceful mindset.',
      ml: 'ആരോഗ്യം, ദുശ്ശീലങ്ങളിൽ നിന്നുള്ള മുക്തി, ശാന്തി.',
    },
  },
  {
    slNo: 22,
    id: 'purusha_sooktharchana',
    name: {
      en: 'Purusha Sooktharchana',
      ml: 'പുരുഷസൂക്താർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Archana chanting the cosmic Purusha Sooktham hymns.',
      ml: 'പുരുഷസൂക്ത മന്ത്രങ്ങൾ ചൊല്ലി ഭഗവാന് നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Brings progeny (Santhana Labham), honor, and spiritual strength.',
      ml: 'സന്താനസൗഭാഗ്യം, കീർത്തി, കാര്യവിജയം.',
    },
  },
  {
    slNo: 23,
    id: 'shiva_sahasranamarchana',
    name: {
      en: 'Shiva Sahasranamarchana (1,000 Names)',
      ml: 'ശിവസഹസ്രനാമാർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 125,
    description: {
      en: 'Chanting the 1,000 auspicious names of Shiva with sacred Bilwa leaves in the devotee’s star.',
      ml: '1000 ശിവനാമങ്ങൾ കൂവളയിലകളാൽ അർപ്പിച്ച് ഭക്തന്റെ പേരിൽ നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Clears all doshas, brings divine protection across life aspects.',
      ml: 'സർവ്വപാപനാശനം, സർവ്വൈശ്വര്യം, കുടുംബ സംരക്ഷണം.',
    },
    popular: true,
  },
  {
    slNo: 24,
    id: 'ashtotharanamarchana',
    name: {
      en: 'Ashtotharanamarchana (108 Names)',
      ml: 'അഷ്ടോത്തരനാമാർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Recitation of the 108 holy names of Mahadeva with floral offerings.',
      ml: '108 ശിവനാമങ്ങൾ ചൊല്ലി നടത്തുന്ന പുഷ്പാർച്ചന.',
    },
    significance: {
      en: 'Daily fulfillment of desires and inner calmness.',
      ml: 'കാര്യവിജയം, മനഃശാന്തി.',
    },
  },
  {
    slNo: 25,
    id: 'dhara',
    name: {
      en: 'Dhara (Continuous Holy Water Bath)',
      ml: 'ധാര',
    },
    category: 'abhishekam_dhara',
    price: 20,
    description: {
      en: 'Continuous stream of cold sanctified water poured over the Shivalinga.',
      ml: 'ശിവലിംഗത്തിന് മുകളിൽ തുടർച്ചയായി തീർത്ഥജലം ധാരയായി ഒഴിക്കുന്ന പവിത്ര ചടങ്ങ്.',
    },
    significance: {
      en: 'Relieves stress, headache, anxiety, and cools anger.',
      ml: 'മനസ്സിന്റെ ചൂടും പിരിമുറുക്കവും മാറാൻ, രോഗശാന്തി.',
    },
    popular: true,
  },
  {
    slNo: 26,
    id: 'ghrithadhara',
    name: {
      en: 'Ghrithadhara (Pure Ghee Dhara)',
      ml: 'ഘൃതധാര',
    },
    category: 'abhishekam_dhara',
    price: 1100,
    description: {
      en: 'Continuous stream of purified consecrated cow ghee poured over the Shivalinga.',
      ml: 'ശുദ്ധമായ പശുവിൻ നെയ്യ് കൊണ്ട് ശിവലിംഗത്തിൽ നടത്തുന്ന വിശേഷാൽ ധാര.',
    },
    significance: {
      en: 'Highly auspicious for mental diseases, chronic nervous ailments, and long life.',
      ml: 'തീരാവ്യാധികൾ ശമിക്കാൻ, ദീർഘായുസ്സ്, ബുദ്ധിശക്തി വർദ്ധിക്കാൻ.',
    },
    popular: true,
  },
  {
    slNo: 27,
    id: 'visheshaldhara',
    name: {
      en: 'Visheshaldhara (Special Dhara)',
      ml: 'വിശേഷാൽധാര',
    },
    category: 'abhishekam_dhara',
    price: 450,
    description: {
      en: 'Special extended herbal and water dhara performed during auspicious planetary timings.',
      ml: 'വിശേഷാൽ ദ്രവ്യങ്ങളും തീർത്ഥജലവും ചേർത്ത് നടത്തുന്ന വിശേഷാൽ ധാര.',
    },
    significance: {
      en: 'Brings immense relief from karmic burdens and physical ailments.',
      ml: 'ശരീരസൗഖ്യം, ശാന്തി, രോഗമുക്തി.',
    },
  },
  {
    slNo: 28,
    id: 'mala',
    name: {
      en: 'Mala (Floral Garland Offering)',
      ml: 'മാല',
    },
    category: 'vilakku_mala',
    price: 20,
    description: {
      en: 'Offering fresh flower or Bilwa garland to Lord Mahadeva.',
      ml: 'ഭഗവാന് സമർപ്പിക്കുന്ന തുളസി / കൂവള പുഷ്പമാല.',
    },
    significance: {
      en: 'Devotional surrender and divine grace.',
      ml: 'ഭക്തിവർദ്ധനവ്, ശിവപ്രീതി.',
    },
  },
  {
    slNo: 29,
    id: 'niramala',
    name: {
      en: 'Niramala (Complete Temple Garland Decoration)',
      ml: 'നിറമാല',
    },
    category: 'vilakku_mala',
    price: 200,
    description: {
      en: 'Decorating the entire sanctum doors and inner frame with colourful fragrant garlands.',
      ml: 'ശ്രീകോവിലിന്റെ വാതിലുകളും അങ്കണവും പൂർണ്ണമായി പുഷ്പമാലകളാൽ അലങ്കരിക്കൽ.',
    },
    significance: {
      en: 'Brings joy, visual splendor, and divine household peace.',
      ml: 'ഗൃഹൈശ്വര്യം, സന്തോഷം, സമൃദ്ധി.',
    },
    popular: true,
  },
  {
    slNo: 30,
    id: 'kalabham_charthu',
    name: {
      en: 'Kalabham Charthu (Sandalwood Paste Anointing)',
      ml: 'കളഭം ചാർത്ത്',
    },
    category: 'vilakku_mala',
    price: 1100,
    description: {
      en: 'Anointing the Shivalinga with pure fragrant Kalabham (consecrated sandalwood, saffron, camphor paste).',
      ml: 'ശുദ്ധമായ ചന്ദനവും കുങ്കുമപ്പൂവും പച്ചക്കർപ്പൂരവും ചേർത്ത് ഭഗവാന് നടത്തുന്ന കളഭാഭിഷേകം.',
    },
    significance: {
      en: 'Imbues radiant glow, cures skin diseases, and brings divine charisma and peace.',
      ml: 'മനഃശാന്തി, ശരീരസൗഖ്യം, സർവ്വഐശ്വര്യം.',
    },
    popular: true,
  },
  {
    slNo: 31,
    id: 'chathussatham',
    name: {
      en: 'Chathusshatham (Grand Nivedyam)',
      ml: 'ചതു:ശ്ശതം',
    },
    category: 'nivedyam_payasam',
    price: 23000,
    description: {
      en: 'Prestigious traditional Mahanaivedyam prepared with 100 measures of rice, jaggery, coconut, and ghee.',
      ml: 'നൂറു നാഴി അരിയും ശർക്കരയും ചേർത്ത് ക്ഷേത്രത്തിൽ തയ്യാറാക്കുന്ന മഹാ നിവേദ്യം.',
    },
    significance: {
      en: 'Supreme offering for monumental family prosperity, relief from long-standing ancestral vows.',
      ml: 'മഹാ അഭീഷ്ടസിദ്ധി, വംശവർദ്ധനവ്, സകല ഐശ്വര്യങ്ങൾ.',
    },
    tag: {
      en: 'Mahanaivedyam',
      ml: 'മഹാ നിവേദ്യം',
    },
  },
  {
    slNo: 32,
    id: 'aranazhi',
    name: {
      en: 'Aranazhi Payasam',
      ml: 'അറനാഴി',
    },
    category: 'nivedyam_payasam',
    price: 1500,
    description: {
      en: 'Special large quantity rich jaggery payasam prepared in traditional bronze Uruli.',
      ml: 'പരമ്പരാഗത ഓട്ടുരുളിയിൽ വിശേഷാൽ രീതിയിൽ തയ്യാറാക്കുന്ന അറനാഴി പായസം.',
    },
    significance: {
      en: 'Fulfills vows, celebrates auspicious occasions, and feeds devotees.',
      ml: 'ആഗ്രഹസാഫല്യം, കുടുംബ ഐക്യം, ശ്രേയസ്സ്.',
    },
  },
  {
    slNo: 33,
    id: 'kadumpayasam',
    name: {
      en: 'Kadumpayasam (Rich Jaggery Payasam)',
      ml: 'കടുംപായസം',
    },
    category: 'nivedyam_payasam',
    price: 160,
    description: {
      en: 'Thick, aromatic dark jaggery payasam enriched with ghee, dry ginger, and coconut pieces.',
      ml: 'കടും ശർക്കരയും നെയ്യും ചേർത്ത് കറുത്ത നിറത്തിൽ വറ്റിച്ചെടുക്കുന്ന കടുംപായസം.',
    },
    significance: {
      en: 'Ward off negative energies, protects from evil eyes, and satisfies deep prayers.',
      ml: 'ശത്രുദോഷ ശമനം, കാര്യസിദ്ധി, ബാധാദോഷ നിവാരണം.',
    },
    popular: true,
  },
  {
    slNo: 34,
    id: 'koottupayasam',
    name: {
      en: 'Koottupayasam',
      ml: 'കൂട്ടുപായസം',
    },
    category: 'nivedyam_payasam',
    price: 120,
    description: {
      en: 'Traditional mixed-grain sweet payasam offering.',
      ml: 'പലവിധ ധാന്യങ്ങളും ശർക്കരയും ചേർത്ത് തയ്യാറാക്കുന്ന കൂട്ടുപായസം.',
    },
    significance: {
      en: 'Unity in family, harmony among relatives, and joy.',
      ml: 'കുടുംബ ഐക്യം, ദാമ്പത്യ സൗഖ്യം.',
    },
  },
  {
    slNo: 35,
    id: 'pradosha_payasam',
    name: {
      en: 'Pradosha Payasam',
      ml: 'പ്രദോഷപായസം',
    },
    category: 'nivedyam_payasam',
    price: 20,
    description: {
      en: 'Special sweet payasam offered during the sacred twilight Pradosha pooja.',
      ml: 'പ്രദോഷ സന്ധ്യാ പൂജയ്ക്ക് ഭഗവാന് സമർപ്പിക്കുന്ന പവിത്രമായ പായസം.',
    },
    significance: {
      en: 'Destroys poverty, clears debts, and brings Shiva preethi.',
      ml: 'ദാരിദ്ര്യശമനം, കടബാധ്യതകൾ തീരാൻ, ശിവപ്രീതി.',
    },
    popular: true,
  },
  {
    slNo: 36,
    id: 'vellanivedyam',
    name: {
      en: 'Vella Nivedyam (Cooked White Rice)',
      ml: 'വെള്ളനിവേദ്യം',
    },
    category: 'nivedyam_payasam',
    price: 30,
    description: {
      en: 'Pure cooked rice offered during the daily morning and noon poojas.',
      ml: 'ശുദ്ധമായ ചോറ് ഭഗവാന് നിവേദിക്കുന്ന നിത്യ ചടങ്ങ്.',
    },
    significance: {
      en: 'Ensures abundance of food (Annadhan) and health in the household.',
      ml: 'അന്നവസ്ത്രാദി ഐശ്വര്യം, ദാരിദ്ര്യമുക്തി.',
    },
  },
  {
    slNo: 37,
    id: 'thidappalli_nivedyam',
    name: {
      en: 'Thidappalli Nivedyam',
      ml: 'തിടപ്പള്ളിനിവേദ്യം',
    },
    category: 'nivedyam_payasam',
    price: 175,
    description: {
      en: 'Special sanctified nivedyam cooked directly inside the temple kitchen (Thidappalli).',
      ml: 'ക്ഷേത്ര തിടപ്പള്ളിയിൽ മന്ത്രസഹിതം തയ്യാറാക്കുന്ന വിശേഷാൽ നിവേദ്യം.',
    },
    significance: {
      en: 'Special blessings for home kitchen prosperity and overall family wellness.',
      ml: 'ഗൃഹസമൃദ്ധി, രോഗശാന്തി, മംഗളം.',
    },
  },
  {
    slNo: 38,
    id: 'neyvilakku',
    name: {
      en: 'Neyvilakku (Ghee Lamp)',
      ml: 'നെയ് വിളക്ക്',
    },
    category: 'vilakku_mala',
    price: 35,
    description: {
      en: 'Lighting of pure cow ghee lamps before Lord Mahadeva.',
      ml: 'മഹാദേവന് മുന്നിൽ ശുദ്ധമായ പശുവിൻ നെയ്യൊഴിച്ചു വിളക്ക് തെളിയിക്കൽ.',
    },
    significance: {
      en: 'Promotes peace of mind, family harmony, and dispels darkness.',
      ml: 'കുടുംബൈശ്വര്യം, മനഃശാന്തി, ഗ്രഹദോഷ നിവാരണം.',
    },
    popular: true,
  },
  {
    slNo: 39,
    id: 'purakil_vilakku',
    name: {
      en: 'Purakil Vilakku (Rear Sanctum Lamp)',
      ml: 'പുറകിൽ വിളക്ക്',
    },
    category: 'vilakku_mala',
    price: 35,
    description: {
      en: 'Lighting the sacred oil lamp behind the Sreekovil dedicated to the divine presence of Goddess Parvathi.',
      ml: 'ശ്രീകോവിലിന്റെ പുറകിൽ ശ്രീപാർവ്വതി സങ്കൽപ്പത്തിൽ തെളിയിക്കുന്ന വിശേഷാൽ വിളക്ക്.',
    },
    significance: {
      en: 'Removes marriage obstacles, ensures happy matrimony and female well-being.',
      ml: 'മാംഗല്യഭാഗ്യം, ദാമ്പത്യ ഐക്യം, സ്ത്രീകളുടെ ക്ഷേമം.',
    },
    popular: true,
  },
  {
    slNo: 40,
    id: 'neeranjanam',
    name: {
      en: 'Neeranjanam (Sesame Lamp for Sastha & Shani)',
      ml: 'നീരാഞ്ജനം',
    },
    category: 'vilakku_mala',
    price: 20,
    description: {
      en: 'Lighting a coconut half filled with sesame oil and tied with black cloth for Lord Sastha and Saturn.',
      ml: 'മുറിച്ച നാളികേരത്തിൽ എള്ളും എണ്ണയും ഒഴിച്ച് ശനിദോഷ നിവാരണത്തിനായി തെളിയിക്കുന്ന വിളക്ക്.',
    },
    significance: {
      en: 'Relieves Saturn (Shani) afflictions, Sade Sati, and obstacles.',
      ml: 'ശനിദോഷ ശമനം, കണ്ടകശനി ദോഷങ്ങൾ മാറാൻ, മനഃക്ലേശ നിവാരണം.',
    },
    popular: true,
  },
  {
    slNo: 41,
    id: 'thrimadhuram',
    name: {
      en: 'Thrimadhuram Nivedyam',
      ml: 'തൃമധുരം',
    },
    category: 'nivedyam_payasam',
    price: 35,
    description: {
      en: 'Sweet delicacy offering of Kadali banana, pure honey, and rock sugar (Kalkandam).',
      ml: 'കദളിപ്പഴം, തേൻ, കൽക്കണ്ടം, നെയ്യ് എന്നിവ ചേർത്ത പവിത്രമായ തൃമധുര നിവേദ്യം.',
    },
    significance: {
      en: 'Brings sweet speech, pleasant relationships, and child prosperity.',
      ml: 'സന്താനഗുണം, വാക്സാമർത്ഥ്യം, ഐശ്വര്യം.',
    },
  },
  {
    slNo: 42,
    id: 'aayilyam_pooja',
    name: {
      en: 'Aayilyam Pooja (Serpent Deity Puja)',
      ml: 'ആയില്ല്യം',
    },
    category: 'pooja_homam',
    price: 45,
    description: {
      en: 'Special pooja conducted at the Nagaraja shrine on the monthly Aayilyam star.',
      ml: 'നാഗരാജാവിനും നാഗയക്ഷിക്കും മാസംതോറുമുള്ള ആയില്യം നാളിൽ നടത്തുന്ന പൂജ.',
    },
    significance: {
      en: 'Neutralizes Sarpa doshas, skin diseases, and brings progeny blessings.',
      ml: 'സർപ്പദോഷ ശമനം, ചർമ്മരോഗ നിവാരണം, സന്താനലബ്ധി.',
    },
    popular: true,
  },
  {
    slNo: 43,
    id: 'bhagavath_seva',
    name: {
      en: 'Bhagavath Seva',
      ml: 'ഭഗവത് സേവ',
    },
    category: 'pooja_homam',
    price: 275,
    description: {
      en: 'Elaborate evening tantric ritual with Padma design invoking Goddess Durga/Bhadrakali for family protection.',
      ml: 'സന്ധ്യാസമയത്ത് പത്മമിട്ട് ദേവീപ്രീതിക്കായി നടത്തുന്ന വിശേഷാൽ പൂജ.',
    },
    significance: {
      en: 'Dispels domestic sorrow, fear of black magic, and establishes supreme family protection.',
      ml: 'ശത്രുദോഷ ശമനം, ഐശ്വര്യം, ദുരിത നിവാരണം.',
    },
  },
  {
    slNo: 44,
    id: 'yakshippattu',
    name: {
      en: 'Yakshippattu',
      ml: 'യക്ഷിപ്പാട്ട്',
    },
    category: 'special_sevas',
    price: 2750,
    description: {
      en: 'Traditional Kerala ritual singing and worship propitiating Yakshi Amma shrine.',
      ml: 'യക്ഷിത്തറയിൽ വാദ്യമേളങ്ങളോടെ പാടി നടത്തുന്ന പാരമ്പര്യ അനുഷ്ഠാന പാട്ട്.',
    },
    significance: {
      en: 'Relieves mental disturbances, fear of spirits, and brings peaceful sleep.',
      ml: 'ബാധാദോഷ ശമനം, മാനസിക സ്വസ്ഥത, ഭയനിവാരണം.',
    },
  },
  {
    slNo: 45,
    id: 'vara_nivedyam',
    name: {
      en: 'Vara Nivedyam (for Yakshi Amma)',
      ml: 'വറനിവേദ്യം (യക്ഷിയ്ക്ക് )',
    },
    category: 'nivedyam_payasam',
    price: 35,
    description: {
      en: 'Fried flattened rice, coconut, and jaggery offering specially prepared for Yakshi shrine.',
      ml: 'അവിലും ശർക്കരയും തേങ്ങയും വറുത്ത് യക്ഷി അമ്മയ്ക്ക് സമർപ്പിക്കുന്ന നിവേദ്യം.',
    },
    significance: {
      en: 'Protects children and youth from unseen negative influences.',
      ml: 'യക്ഷിപ്രീതി, ബാലാരിഷ്ടതകൾ മാറാൻ.',
    },
  },
  {
    slNo: 46,
    id: 'deeparadhana_upadevathas',
    name: {
      en: 'Deeparadhana for Upadevathas',
      ml: 'ദീപാരാധന ഉപദേവന്മാർക്ക്',
    },
    category: 'vilakku_mala',
    price: 35,
    description: {
      en: 'Special evening camphor and brass lamp Deeparadhana performed at all sub-deity shrines.',
      ml: 'ഗണപതി, ശാസ്താവ്, നാഗങ്ങൾ, യക്ഷി തുടങ്ങിയ ഉപദേവതകൾക്കായി നടത്തുന്ന ദീപാരാധന.',
    },
    significance: {
      en: 'Harmonious grace of all guardian deities in the temple compound.',
      ml: 'സർവ്വദേവതാ പ്രീതി, കുടുംബ സുരക്ഷിതത്വം.',
    },
  },
  {
    slNo: 47,
    id: 'annaprashanam',
    name: {
      en: 'Annaprashanam (First Rice Feeding for Infants)',
      ml: 'അന്നപ്രാശനം',
    },
    category: 'special_sevas',
    price: 150,
    description: {
      en: 'Sacred first grain feeding ceremony for newborn babies in front of Lord Mahadeva.',
      ml: 'കുഞ്ഞുങ്ങൾക്ക് ആദ്യമായി ചോറൂണ് ഭഗവാന്റെ നടയിൽ വച്ച് നൽകുന്ന വിശുദ്ധ ചടങ്ങ്.',
    },
    significance: {
      en: 'Blesses the infant with lifelong health, nourishment, and sweet speech.',
      ml: 'കുട്ടിയുടെ ആയുരാരോഗ്യം, ഐശ്വര്യം, സംരക്ഷണം.',
    },
    popular: true,
  },
  {
    slNo: 48,
    id: 'vidyarambham',
    name: {
      en: 'Vidyarambham (Initiation into Learning)',
      ml: 'വിദ്യാരംഭം',
    },
    category: 'special_sevas',
    price: 100,
    description: {
      en: 'Ceremonial initiation of toddlers into letters and knowledge by writing "Hari Sri" on rice/sand.',
      ml: 'കുട്ടികളെ ആദ്യമായി അക്ഷരലോകത്തേക്ക് ആനയിക്കുന്ന ഹരിശ്രീ കുറിക്കൽ ചടങ്ങ്.',
    },
    significance: {
      en: 'Bestows blessings of Goddess Saraswathi and Mahadeva for lifelong wisdom and education.',
      ml: 'വിദ്യാഗുണം, വാക്സാമർത്ഥ്യം, വിജ്ഞാനം.',
    },
    popular: true,
  },
  {
    slNo: 49,
    id: 'vivaha_nadappanam',
    name: {
      en: 'Vivaha Nadappanam (Temple Wedding Fee)',
      ml: 'വിവാഹ നടപ്പണം',
    },
    category: 'special_sevas',
    price: 1250,
    description: {
      en: 'Conducting marriage solemnization in the holy presence of Lord Mahadeva.',
      ml: 'ക്ഷേത്രസന്നിധിയിൽ വച്ച് ഭക്തിനിർഭരമായി വിവാഹ ചടങ്ങ് നടത്തുന്നതിനുള്ള ഫീസ്.',
    },
    significance: {
      en: 'Binds the newlyweds with supreme divine grace for a joyful, lifelong married bond.',
      ml: 'ദാമ്പത്യ ഐക്യം, മംഗളകരമായ ജീവിതാരംഭം.',
    },
  },
  {
    slNo: 50,
    id: 'thulabharam_nadappanam',
    name: {
      en: 'Thulabharam Nadappanam (Weighing Scale Offering)',
      ml: 'തുലാഭാരം നടപ്പണം',
    },
    category: 'special_sevas',
    price: 150,
    description: {
      en: 'Weighing the devotee against an equivalent weight of banana, jaggery, sugar, or coins.',
      ml: 'ഭക്തന്റെ ഭാരത്തിന് തുല്യമായി കദളിപ്പഴം, ശർക്കര, പഞ്ചസാര തുടങ്ങിയ ദ്രവ്യങ്ങൾ തുലാഭാരം തൂക്കൽ.',
    },
    significance: {
      en: 'Fulfills sacred vows taken for curing serious illnesses and childbirth.',
      ml: 'ദീർഘകാല രോഗമുക്തി, വഴിപാട് പൂർത്തീകരണം.',
    },
    popular: true,
  },
  {
    slNo: 51,
    id: 'adima_nadappanam',
    name: {
      en: 'Adima Nadappanam (Child Surrender Seva)',
      ml: 'അടിമ നടപ്പണം',
    },
    category: 'special_sevas',
    price: 150,
    description: {
      en: 'Traditional seva ceremonially placing a child under the eternal protection of Lord Mahadeva.',
      ml: 'കുട്ടികളെ ഭഗവാന്റെ അടിമയായി സമർപ്പിച്ച് സംരക്ഷണം യാചിക്കുന്ന പവിത്ര ചടങ്ങ്.',
    },
    significance: {
      en: 'Guarantees lifetime safety from evil forces and health complications.',
      ml: 'കുട്ടികളുടെ സുരക്ഷ, ദീർഘായുസ്സ്, ദുരിതശമനം.',
    },
  },
  {
    slNo: 52,
    id: 'kavadi_nadappanam',
    name: {
      en: 'Kavadi Nadappanam',
      ml: 'കാവടി നടപ്പണം',
    },
    category: 'special_sevas',
    price: 50,
    description: {
      en: 'Registration and offerings for taking ritual Kavadi procession in temple.',
      ml: 'വ്രതാനുഷ്ഠാനത്തോടെ കാവടിയെടുത്ത് ഭഗവാന് സമർപ്പിക്കുന്നതിനുള്ള നടപ്പണം.',
    },
    significance: {
      en: 'Spiritual purification and physical vigor.',
      ml: 'ആഗ്രഹസിദ്ധി, പാപമോചനം.',
    },
  },
  {
    slNo: 53,
    id: 'bhajana_nadappanam',
    name: {
      en: 'Bhajana Nadappanam',
      ml: 'ഭജന നടപ്പണം',
    },
    category: 'special_sevas',
    price: 350,
    description: {
      en: 'Observing continuous devotional stay (Bhajanam) inside the temple grounds for a spiritual period.',
      ml: 'ക്ഷേത്രാങ്കണത്തിൽ താമസിച്ച് വ്രതമെടുത്ത് ഭജനം പാർക്കുന്നതിനുള്ള ഫീസ്.',
    },
    significance: {
      en: 'Deep meditation, curing incurable diseases, and spiritual transcendence.',
      ml: 'മാനസിക രോഗശാന്തി, ഏകാഗ്രത, ആത്മീയ ഉന്നതി.',
    },
  },
  {
    slNo: 54,
    id: 'chuttu_vilakku',
    name: {
      en: 'Chuttu Vilakku (Illuminating Entire Outer Perimeter)',
      ml: 'ചുറ്റു വിളക്ക്',
    },
    category: 'vilakku_mala',
    price: 5000,
    description: {
      en: 'Lighting thousands of brass oil lamps surrounding the entire Chuttambalam in the evening.',
      ml: 'ക്ഷേത്ര ചുറ്റമ്പലത്തിലെ നൂറുകണക്കിന് വിളക്കുകൾ പൂർണ്ണമായി എണ്ണയൊഴിച്ച് ദീപപ്രഭയിലാക്കുന്ന മഹാ വഴിപാട്.',
    },
    significance: {
      en: 'Brings immense radiance, destroys darkness from lineage, and spreads divine glow.',
      ml: 'വംശൈശ്വര്യം, സർവ്വ പാപവിമുക്തി, കുടുംബത്തിന് മഹാപ്രഭാവം.',
    },
    popular: true,
    tag: {
      en: 'Grand Illumination',
      ml: 'മഹാ ദീപക്കാഴ്ച',
    },
  },
  {
    slNo: 55,
    id: 'vahana_pooja_two_wheeler',
    name: {
      en: 'Vahana Pooja (Two Wheeler)',
      ml: 'വാഹന പൂജ (ഇരുചക്രം)',
    },
    category: 'special_sevas',
    price: 250,
    description: {
      en: 'Consecration and blessing ritual for two-wheelers (scooters, motorcycles) with holy water and lemon protection.',
      ml: 'പുതിയ ഇരുചക്ര വാഹനങ്ങൾക്കായി നടത്തുന്ന സംരക്ഷണ പൂജ.',
    },
    significance: {
      en: 'Protects from road accidents, mechanical breakdowns, and ensures safe journeys.',
      ml: 'യാത്രാസുരക്ഷ, അപകടങ്ങളിൽ നിന്നുള്ള രക്ഷ.',
    },
  },
  {
    slNo: 56,
    id: 'vahana_pooja_four_wheeler',
    name: {
      en: 'Vahana Pooja (Four Wheeler / Heavy Vehicle)',
      ml: 'വാഹന പൂജ',
    },
    category: 'special_sevas',
    price: 350,
    description: {
      en: 'Comprehensive blessing ceremony for four-wheelers, cars, buses, and commercial vehicles.',
      ml: 'കാറുകൾ, വലിയ വാഹനങ്ങൾ എന്നിവയ്ക്കായി നടത്തുന്ന ശാന്തി പൂജയും സംരക്ഷണ ചടങ്ങും.',
    },
    significance: {
      en: 'Safe travels, commercial profitability, and accident protection.',
      ml: 'അപകടരഹിത യാത്ര, വാഹന സംരക്ഷണം, തൊഴിൽ വിജയം.',
    },
    popular: true,
  },
  {
    slNo: 57,
    id: 'mala_pooja',
    name: {
      en: 'Mala Pooja (Pilgrimage Bead Garland Puja)',
      ml: 'മാല പൂജ',
    },
    category: 'vilakku_mala',
    price: 20,
    description: {
      en: 'Consecrating holy Rudraksha or Tulsi garland for pilgrimage fasts (Sabarimala/Palani).',
      ml: 'ശബരിമല തീർത്ഥാടകർക്ക് മാലയിടാനും വ്രതാരംഭത്തിനുമായി നടത്തുന്ന പൂജ.',
    },
    significance: {
      en: 'Auspicious start to sacred pilgrimage vow.',
      ml: 'തീർത്ഥാടന വ്രതശുദ്ധി.',
    },
  },
  {
    slNo: 58,
    id: 'charadu_japam',
    name: {
      en: 'Charadu Japam (Sanctified Protective Thread)',
      ml: 'ചരടു ജപം',
    },
    category: 'special_sevas',
    price: 20,
    description: {
      en: 'Consecrating sacred protective thread with powerful Shiva mantras to be worn on wrist or waist.',
      ml: 'മന്ത്രം ജപിച്ചു ഭഗവാന്റെ ചൈതന്യം നിറച്ച രക്ഷാചരട്.',
    },
    significance: {
      en: 'Shields from night terrors, evil eyes, and chronic fear.',
      ml: 'ബാധാദോഷ ശമനം, ഭയനിവാരണം, രോഗരക്ഷ.',
    },
  },
  {
    slNo: 59,
    id: 'kettunira',
    name: {
      en: 'Kettunira (Irumudi Kettu Preparation)',
      ml: 'കെട്ടുനിറ',
    },
    category: 'special_sevas',
    price: 30,
    description: {
      en: 'Sacred filling of the Irumudi kettu (ghee coconut) for Sabarimala pilgrimage devotees.',
      ml: 'ശബരിമല തീർത്ഥാടകരുടെ ഇരുമുടിക്കെട്ടു നിറയ്ക്കൽ ചടങ്ങ്.',
    },
    significance: {
      en: 'Auspicious journey and fulfillment of pilgrimage.',
      ml: 'തീർത്ഥാടന വിജയം, അയ്യപ്പാനുഗ്രഹം.',
    },
  },
  {
    slNo: 60,
    id: 'utsavabali_registration',
    name: {
      en: 'Utsavabali Registration',
      ml: 'ഉത്സവബലി രെജിസ്ട്രേഷൻ',
    },
    category: 'special_sevas',
    price: 3000,
    description: {
      en: 'Sponsorship registration during the sacred annual Utsavabali tantric rites.',
      ml: 'വാർഷിക ഉത്സവത്തോടനുബന്ധിച്ച് നടക്കുന്ന താന്ത്രിക ഉത്സവബലിയിൽ പങ്കാളിയാകൽ.',
    },
    significance: {
      en: 'Immense temple festival merit and ancestral blessings.',
      ml: 'ഉത്സവപുണ്യം, കുടുംബശാന്തി, മോക്ഷം.',
    },
  },
  {
    slNo: 61,
    id: 'chelavinum_vilakkinum',
    name: {
      en: 'Chelavinum Vilakkinum (Temple Upkeep & Lamp Fund)',
      ml: 'ചെലവിനും വിളക്കിനും',
    },
    category: 'vilakku_mala',
    price: 125,
    description: {
      en: 'Devotional contribution towards temple lamp oil, floral supplies, and daily maintenance.',
      ml: 'ക്ഷേത്ര നിത്യോപയോഗ ചെലവുകൾക്കും വിളക്കിനുമുള്ള ഭക്തജന സമർപ്പണം.',
    },
    significance: {
      en: 'Merit of sustaining ancient temple rituals.',
      ml: 'ക്ഷേത്ര സേവാപുണ്യം, ഗൃഹൈശ്വര്യം.',
    },
  },
  {
    slNo: 62,
    id: 'namaskaram',
    name: {
      en: 'Namaskaram (Priestly Feast & Blessing)',
      ml: 'നമസ്കാരം',
    },
    category: 'special_sevas',
    price: 50,
    description: {
      en: 'Offering feast to Namboothiri priests and receiving traditional Vedic blessings.',
      ml: 'ക്ഷേത്ര പൂജാരിമാർക്ക് അന്നദാനം നൽകി അനുഗ്രഹം വാങ്ങുന്ന ചടങ്ങ്.',
    },
    significance: {
      en: 'Pleased blessings of priests and peace in family.',
      ml: 'ഗുരുപ്രീതി, ശാന്തി, ആയുസ്സ്.',
    },
  },
  {
    slNo: 63,
    id: 'koottu_namaskaram',
    name: {
      en: 'Koottu Namaskaram',
      ml: 'കൂട്ടനമസ്കാരം',
    },
    category: 'special_sevas',
    price: 150,
    description: {
      en: 'Collective community priestly feast and prayers.',
      ml: 'സമൂഹമായി നടത്തുന്ന കൂട്ട നമസ്കാര സമർപ്പണം.',
    },
    significance: {
      en: 'Village prosperity, rain, and collective harmony.',
      ml: 'നാടിന്റെ ഐശ്വര്യം, കുടുംബ സൗഖ്യം.',
    },
  },
  {
    slNo: 64,
    id: 'thoolika_pooja',
    name: {
      en: 'Thoolika Pooja (Pen & Study Tool Puja)',
      ml: 'തൂലികപൂജ',
    },
    category: 'special_sevas',
    price: 20,
    description: {
      en: 'Blessing pens, books, and study instruments at the feet of Mahadeva before major examinations.',
      ml: 'പരീക്ഷകൾക്ക് മുൻപ് പേനയും പുസ്തകങ്ങളും ഭഗവാന്റെ നടയിൽ വച്ച് പൂജിക്കൽ.',
    },
    significance: {
      en: 'Removes exam fear, enhances writing clarity, and ensures competitive examination success.',
      ml: 'പരീക്ഷാവിജയം, ബുദ്ധിതെളിച്ചം, മത്സരപരീക്ഷകളിൽ ഉന്നത വിജയം.',
    },
  },
  {
    slNo: 65,
    id: 'samvada_sooktha_pushpanjali',
    name: {
      en: 'Samvada Sooktha Pushpanjali',
      ml: 'സംവാദസൂക്ത പുഷ്പാഞ്ജലി',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Pushpanjali chanting the Vedic Samvada Sooktham for dispute resolution, harmony, and mutual understanding.',
      ml: 'തർക്കങ്ങളും ഭിന്നതകളും പരിഹരിക്കാനും സൗഹൃദവും ധാരണയും വർദ്ധിക്കാനും നടത്തുന്ന പുഷ്പാഞ്ജലി.',
    },
    significance: {
      en: 'Resolves family, property, and partnership disputes peacefully.',
      ml: 'കുടുംബ-തൊഴിൽ തർക്കങ്ങൾ തീരാൻ, രമ്യത, ശാന്തി.',
    },
    popular: true,
  },
  {
    slNo: 66,
    id: 'utsavabali',
    name: {
      en: 'Utsavabali (Grand Tantric Festival Offering)',
      ml: 'ഉത്സവബലി',
    },
    category: 'special_sevas',
    price: 50000,
    description: {
      en: 'Grand solemn sponsorship of the supreme Utsavabali tantric rites performed during the annual temple festival.',
      ml: 'വാർഷിക ഉത്സവത്തിൽ തന്ത്രിമുഖ്യരുടെ കാർമ്മികത്വത്തിൽ നടക്കുന്ന പരമപവിത്രമായ ഉത്സവബലി സമർപ്പണം.',
    },
    significance: {
      en: 'Supreme generational merit, cosmic balance, and fulfillment of all family prayers.',
      ml: 'മഹാപുണ്യം, കുടുംബ ശാന്തി, സർവ്വൈശ്വര്യം, പിതൃമോക്ഷം.',
    },
    tag: {
      en: 'Festival Supreme',
      ml: 'ഉത്സവ സമർപ്പണം',
    },
  },
  {
    slNo: 67,
    id: 'pashupadha_manthrarchana',
    name: {
      en: 'Pashupadha Manthrarchana',
      ml: 'പാശുപദമന്ത്രാർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Archana chanting the supreme Pashupatastra mantra of Lord Shiva.',
      ml: 'ശിവന്റെ അതിശക്തമായ പാശുപതാസ്ത്ര മന്ത്രം ചൊല്ലി നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Overcomes severe litigations, rivals, black magic, and insurmountable crises.',
      ml: 'ശത്രുജയം, കോടതി വ്യവഹാരങ്ങളിൽ വിജയം, കഠിന ബാധകളിൽ നിന്നുള്ള മോചനം.',
    },
    popular: true,
  },
  {
    slNo: 68,
    id: 'munvilakku',
    name: {
      en: 'Munvilakku (Front Sanctum Lamp)',
      ml: 'മുൻവിളക്ക്',
    },
    category: 'vilakku_mala',
    price: 35,
    description: {
      en: 'Lighting the sacred oil lamp directly before the deity at the sanctum entrance.',
      ml: 'ശ്രീകോവിലിന് മുൻപിൽ ഭഗവാന്റെ നേരിട്ടുള്ള ദർശനത്തിനായി തെളിയിക്കുന്ന പവിത്ര വിളക്ക്.',
    },
    significance: {
      en: 'Attracts divine illumination, eliminates darkness, and brings clarity.',
      ml: 'ഐശ്വര്യം, മനോതെളിച്ചം, ജീവിതവിജയം.',
    },
  },
  {
    slNo: 69,
    id: 'auditorium_vadaka',
    name: {
      en: 'Auditorium Rent (Full Function)',
      ml: 'ഓഡിറ്റോറിയം വാടക',
    },
    category: 'special_sevas',
    price: 35000,
    description: {
      en: 'Full-day rental of the spacious temple auditorium and dining hall for weddings, cultural events, and receptions.',
      ml: 'വിവാഹം, സാംസ്കാരിക ചടങ്ങുകൾ, വിരുന്ന് എന്നിവയ്ക്കായി ക്ഷേത്ര ഓഡിറ്റോറിയം മുഴുവൻ ദിവസത്തേക്ക് വാടകയ്ക്ക്.',
    },
    significance: {
      en: 'Sanctified wedding and event venue blessed by the divine presence of Lord Mahadeva.',
      ml: 'വിവാഹ-സാംസ്കാരിക മംഗള ചടങ്ങുകൾ ഭക്തിസാന്ദ്രമായി നടത്താൻ.',
    },
    tag: {
      en: 'Event Hall',
      ml: 'കല്യാണമണ്ഡപം',
    },
  },
  {
    slNo: 70,
    id: 'dakshinamoorthy_namarchana',
    name: {
      en: 'Dakshinamoorthy Namarchana',
      ml: 'ദക്ഷിണാമൂർത്തിനാമാർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Archana chanting the names of Lord Shiva in the supreme teacher form (Sri Dakshinamoorthy).',
      ml: 'വിദ്യയുടെയും ജ്ഞാനത്തിന്റെയും മൂർത്തിയായ ദക്ഷിണാമൂർത്തിക്ക് സമർപ്പിക്കുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Supreme wisdom, spiritual enlightenment, and success in arts and higher education.',
      ml: 'വിദ്യാവിജയം, ജ്ഞാനം, ഉന്നതവിദ്യാഭ്യാസം, കലാപ്രാവീണ്യം.',
    },
    popular: true,
  },
  {
    slNo: 71,
    id: 'noorum_palum',
    name: {
      en: 'Noorum Palum (Milk & Turmeric to Nagas)',
      ml: 'നൂറും പാലും',
    },
    category: 'pooja_homam',
    price: 45,
    description: {
      en: 'Traditional offering of milk, rice powder, turmeric, and lime to the Serpent Deities.',
      ml: 'നൂറും പാലും മഞ്ഞൾപ്പൊടിയും ചേർത്ത് സർപ്പദേവതകൾക്ക് സമർപ്പിക്കുന്ന പവിത്ര നിവേദ്യം.',
    },
    significance: {
      en: 'Deep ancestral curse relief and health for generations.',
      ml: 'നാഗപ്രീതി, വംശവർദ്ധനവ്, ത്വഗ്രോഗ ശമനം.',
    },
  },
  {
    slNo: 72,
    id: 'kuda_nadappanam',
    name: {
      en: 'Kuda Nadappanam (Umbrella Offering)',
      ml: 'കുട നടപ്പണം',
    },
    category: 'special_sevas',
    price: 30,
    description: {
      en: 'Ceremonial offering of traditional temple umbrella to the deity.',
      ml: 'ക്ഷേത്രത്തിലേക്ക് ഭഗവാന്റെ സന്നിധിയിൽ കുട സമർപ്പിക്കുന്ന ചടങ്ങ്.',
    },
    significance: {
      en: 'Divine royal shelter and protection from life storms.',
      ml: 'ദൈവിക സംരക്ഷണം, ആപത്തുകളിൽ നിന്നുള്ള കാവൽ.',
    },
  },
  {
    slNo: 73,
    id: 'auditorium_booking',
    name: {
      en: 'Auditorium Advance Booking',
      ml: 'ഓഡിറ്റോറിയം ബുക്കിംഗ്',
    },
    category: 'special_sevas',
    price: 10000,
    description: {
      en: 'Advance token registration to reserve the temple marriage auditorium for a scheduled date.',
      ml: 'ക്ഷേത്ര ഓഡിറ്റോറിയം മുൻകൂട്ടി തീയതി നിശ്ചയിച്ചു ബുക്ക് ചെയ്യുന്നതിനുള്ള അഡ്വാൻസ് തുക.',
    },
    significance: {
      en: 'Guaranteed reservation for sacred temple weddings.',
      ml: 'വിവാഹ തീയതി മുൻകൂട്ടി ഉറപ്പാക്കൽ.',
    },
  },
  {
    slNo: 74,
    id: 'kadumpayasam_uri',
    name: {
      en: 'Kadumpayasam (Uri Measure)',
      ml: 'കടുംപായസം (ഉരി)',
    },
    category: 'nivedyam_payasam',
    price: 80,
    description: {
      en: 'Small traditional Uri measure portion of rich dark jaggery payasam.',
      ml: 'ഉരി അളവിൽ തയ്യാറാക്കുന്ന പവിത്രമായ കടുംപായസ നിവേദ്യം.',
    },
    significance: {
      en: 'Personal obstacle removal and quick fulfillment of vows.',
      ml: 'കാര്യവിജയം, കാര്യതടസ്സ നിവാരണം.',
    },
  },
  {
    slNo: 75,
    id: 'kadumpayasam_nazhiyuri',
    name: {
      en: 'Kadumpayasam (Nazhiyuri Measure)',
      ml: 'കടുംപായസം (നാഴിയുരി)',
    },
    category: 'nivedyam_payasam',
    price: 240,
    description: {
      en: 'Larger Nazhiyuri portion of thick jaggery payasam for family offering.',
      ml: 'നാഴിയുരി അളവിൽ തയ്യാറാക്കുന്ന വിശേഷാൽ കടുംപായസം.',
    },
    significance: {
      en: 'Family health, protection from evil eye, and peace.',
      ml: 'കുടുംബസംരക്ഷണം, ശത്രുദോഷ ശമനം.',
    },
  },
  {
    slNo: 76,
    id: 'koottupayasam_nazhiyuri',
    name: {
      en: 'Koottupayasam (Nazhiyuri Measure)',
      ml: 'കൂട്ടുപായസം (നാഴിയുരി)',
    },
    category: 'nivedyam_payasam',
    price: 180,
    description: {
      en: 'Nazhiyuri portion of sweet mixed-grain payasam.',
      ml: 'നാഴിയുരി അളവിൽ തയ്യാറാക്കുന്ന കൂട്ടുപായസ നിവേദ്യം.',
    },
    significance: {
      en: 'Harmony in domestic life and auspicious joy.',
      ml: 'ദാമ്പത്യ ഐക്യം, കുടുംബ സന്തോഷം.',
    },
  },
  {
    slNo: 77,
    id: 'nilavilakku_nadappanam',
    name: {
      en: 'Nilavilakku Nadappanam (Brass Lamp Offering)',
      ml: 'നിലവിളക്ക് നടപ്പണം',
    },
    category: 'vilakku_mala',
    price: 20,
    description: {
      en: 'Offering traditional Kerala standing brass lamps (Nilavilakku) to the temple.',
      ml: 'ക്ഷേത്രത്തിലേക്ക് നിലവിളക്ക് സമർപ്പിക്കുന്നതിനുള്ള നടപ്പണം.',
    },
    significance: {
      en: 'Dispels hereditary curses and lights the path of future generations.',
      ml: 'വംശൈശ്വര്യം, അന്ധകാര നിവാരണം, ലക്ഷ്മീപ്രീതി.',
    },
  },
  {
    slNo: 78,
    id: 'yogeeshwara_pooja',
    name: {
      en: 'Yogeeshwara Pooja',
      ml: 'യോഗീശ്വരപൂജ',
    },
    category: 'pooja_homam',
    price: 150,
    description: {
      en: 'Special pooja dedicated to Sri Yogeeshwaran / Guru Chaithanyam residing in the temple.',
      ml: 'ക്ഷേത്ര സങ്കേതത്തിലെ യോഗീശ്വര ചൈതന്യത്തിനും ഗുരുക്കന്മാർക്കുമായി സമർപ്പിക്കുന്ന പൂജ.',
    },
    significance: {
      en: 'Brings spiritual wisdom, mental clarity, and removal of unknown obstacles.',
      ml: 'ഗുരുപ്രീതി, ജ്ഞാനം, അദൃശ്യ തടസ്സങ്ങൾ നീങ്ങാൻ.',
    },
    popular: true,
  },
  {
    slNo: 79,
    id: 'samvada_sooktham',
    name: {
      en: 'Samvada Sooktham',
      ml: 'സംവാദസൂക്തം',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Vedic recitation of the Rigvedic Samvada Sooktham for peace and agreement.',
      ml: 'സമാധാനത്തിനും അഭിപ്രായഐക്യത്തിനുമായി സംവാദസൂക്ത മന്ത്രങ്ങൾ ചൊല്ലി നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Enhances communication, resolves disputes, and brings concord in partnership.',
      ml: 'വാക്സാമർത്ഥ്യം, തർക്കപരിഹാരം, കുടുംബ ഐക്യം.',
    },
  },
  {
    slNo: 80,
    id: 'aikya_manthrarchana',
    name: {
      en: 'Aikya Manthrarchana (Unity Hymn Archana)',
      ml: 'ഐക്യമന്ത്രാർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Archana chanting the Vedic Aikya Manthram for profound unity and mutual love.',
      ml: 'മനസ്സുകൾ തമ്മിൽ ഒന്നാകാനും ഐക്യമുണ്ടാകാനും വേദമന്ത്രങ്ങളാൽ നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Fosters unity between couples, family members, and business partners.',
      ml: 'കുടുംബൈക്യം, ഭാര്യാഭർതൃ സ്നേഹം, കൂട്ടായ്മയുടെ വിജയം.',
    },
    popular: true,
  },
  {
    slNo: 81,
    id: 'ksheeradhara',
    name: {
      en: 'Ksheeradhara (Continuous Holy Milk Dhara)',
      ml: 'ക്ഷീരധാര',
    },
    category: 'abhishekam_dhara',
    price: 60,
    description: {
      en: 'Continuous stream of pure cow milk poured over the sacred Shivalinga.',
      ml: 'ശുദ്ധമായ പശുവിൻ പാൽ തുടർച്ചയായി ശിവലിംഗത്തിൽ ധാരയായി ഒഴിക്കുന്ന അഭിഷേകം.',
    },
    significance: {
      en: 'Mental tranquility, emotional balance, child welfare, and spiritual joy.',
      ml: 'മനഃശാന്തി, സന്താനഗുണം, ശരീരസൗഖ്യം, ശിവപ്രീതി.',
    },
    popular: true,
  },
  {
    slNo: 82,
    id: 'ellu_payasam',
    name: {
      en: 'Ellu Payasam (Sesame Payasam)',
      ml: 'എള്ളുപായസം',
    },
    category: 'nivedyam_payasam',
    price: 140,
    description: {
      en: 'Delicious sweet payasam prepared with black sesame seeds, jaggery, and ghee.',
      ml: 'എള്ളും ശർക്കരയും നെയ്യും ചേർത്ത് തയ്യാറാക്കുന്ന ഔഷധഗുണമുള്ള വിശേഷാൽ പായസം.',
    },
    significance: {
      en: 'Wards off malefic Saturn (Shani) effects and cures physical debility.',
      ml: 'ശനിദോഷ ശമനം, ആയുർബലം, ദുരിതമുക്തി.',
    },
  },
  {
    slNo: 83,
    id: 'sukrutha_sooktham',
    name: {
      en: 'Sukrutha Sooktham',
      ml: 'സുകൃത സൂക്തം',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Archana chanting the Vedic Sukrutha Sooktham to augment merits and good karma.',
      ml: 'നന്മകളും പുണ്യങ്ങളും വർദ്ധിക്കാനായി സുകൃതസൂക്ത മന്ത്രജപത്തോടെ നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Destroys past bad karma, attracts auspicious opportunities and prosperity.',
      ml: 'പാപവിമുക്തി, ഭാഗ്യവർദ്ധനവ്, പുണ്യവർദ്ധനവ്.',
    },
    popular: true,
  },
  {
    slNo: 84,
    id: 'neelakantha_yantrakshari_archana',
    name: {
      en: 'Neelakantha Yantrakshari Archana',
      ml: 'നീലകണ്ഠയന്ത്രാക്ഷരി അർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Esoteric tantric archana chanting the sacred mystic letters of Lord Neelakantha.',
      ml: 'നീലകണ്ഠനായ പരമശിവന്റെ താന്ത്രിക യന്ത്രാക്ഷര മന്ത്രങ്ങൾ ജപിച്ചു നടത്തുന്ന വിശേഷാൽ അർച്ചന.',
    },
    significance: {
      en: 'Cures chronic ailments, neutralizes poison and toxicity, and gives spiritual shield.',
      ml: 'വിഷബാധ-രോഗ ശമനം, കഠിന ദുരിതങ്ങളിൽ നിന്നുള്ള മോചനം, ശിവകവചം.',
    },
  },
  {
    slNo: 85,
    id: 'panchakshari_manthrarchana',
    name: {
      en: 'Panchakshari Manthrarchana',
      ml: 'പഞ്ചാക്ഷരി മന്ത്രാർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Archana offering Bilwa leaves while chanting the supreme five-lettered Shiva mantra "Namah Shivaya".',
      ml: 'കൂവളയിലകളാൽ "നമഃ ശിവായ" പഞ്ചാക്ഷരീ മന്ത്രം ജപിച്ചു ഭഗവാന് സമർപ്പിക്കുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Complete spiritual liberation, mental purity, and supreme Shiva grace.',
      ml: 'ശിവസാന്നിധ്യം, സർവ്വപാപ ശമനം, ആത്മീയ ഉന്നതി.',
    },
    popular: true,
  },
  {
    slNo: 86,
    id: 'umamaheswararchana',
    name: {
      en: 'Umamaheswararchana',
      ml: 'ഉമാമഹേശ്വരാർച്ചന',
    },
    category: 'archana_pushpanjali',
    price: 45,
    description: {
      en: 'Archana chanting sacred mantras of Shiva and Parvathi together.',
      ml: 'ഉമാമഹേശ്വര മന്ത്രങ്ങളാൽ നടത്തുന്ന പവിത്ര പുഷ്പാർച്ചന.',
    },
    significance: {
      en: 'Quick marriage settlement, conjugal peace, and domestic happiness.',
      ml: 'വിവാഹ തടസ്സങ്ങൾ മാറാൻ, ദാമ്പത്യ ഐക്യം.',
    },
    popular: true,
  },
  {
    slNo: 87,
    id: 'aayiram_kudam_abhishekam',
    name: {
      en: 'Aayiram Kudam Abhishekam (1,000 Pots)',
      ml: 'ആയിരം കുടം അഭിഷേകം',
    },
    category: 'abhishekam_dhara',
    price: 12500,
    description: {
      en: 'Grand ceremonial bathing of Mahadeva with sanctified holy water poured from 1,000 brass pots with Vedic chanting.',
      ml: 'വേദമന്ത്രോച്ചാരണങ്ങളോടെ 1000 കുടം പുണ്യതീർത്ഥം ഭഗവാന് അഭിഷേകം ചെയ്യുന്ന മഹാ സമർപ്പണം.',
    },
    significance: {
      en: 'Immense spiritual purification, cooling of cosmic energies, and ancestral deliverance.',
      ml: 'മഹാപുണ്യം, കുടുംബശാന്തി, തീരാദുരിത നിവാരണം.',
    },
    tag: {
      en: 'Grand Abhishekam',
      ml: 'മഹാഭിഷേകം',
    },
  },
  {
    slNo: 88,
    id: 'palpayasam',
    name: {
      en: 'Palpayasam (Milk Kheer)',
      ml: 'പാൽപായസം',
    },
    category: 'nivedyam_payasam',
    price: 160,
    description: {
      en: 'Sweet and creamy milk payasam prepared with pure cow milk, rice, and sugar.',
      ml: 'ശുദ്ധമായ പശുവിൻ പാലും അരിയും ചേർത്ത് തയ്യാറാക്കുന്ന രുചികരമായ പാൽപായസം.',
    },
    significance: {
      en: 'Bestows good health, happiness in family, and contentment.',
      ml: 'സന്താനസൗഭാഗ്യം, മനഃശാന്തി, കുടുംബൈശ്വര്യം.',
    },
    popular: true,
  },
];
