import { OfferingItem } from '../types';

export const OFFERINGS: OfferingItem[] = [
  {
    id: 'neyvilakku',
    name: {
      en: 'Neyvilakku (Ghee Lamp)',
      ml: 'നെയ്‌വിളക്ക്',
    },
    category: 'daily',
    price: 30,
    description: {
      en: 'Lighting of pure cow ghee lamps before Lord Mahadeva. A foundational and deeply cherished ritual for inner peace, illumination and removing negative planetary influences.',
      ml: 'മഹാദേവന് മുന്നിൽ ശുദ്ധമായ പശുവിൻ നെയ്യൊഴിച്ചു വിളക്ക് തെളിയിക്കൽ. മനഃശാന്തിക്കും ദുരിതശമനത്തിനും ഐശ്വര്യത്തിനും ഉത്തമം.',
    },
    significance: {
      en: 'Promotes peace of mind, family harmony, and dispels darkness from life.',
      ml: 'കുടുംബൈശ്വര്യം, മനഃശാന്തി, ഗ്രഹദോഷ നിവാരണം എന്നിവയ്ക്കായി.',
    },
    timing: {
      en: 'Morning & Evening Sessions',
      ml: 'രാവിലെയും വൈകുന്നേരവും',
    },
    popular: true,
    tag: {
      en: 'Most Popular',
      ml: 'ഏറ്റവും പ്രധാനം',
    },
  },
  {
    id: 'jalabhishekam',
    name: {
      en: 'Jalabhishekam & Dhara',
      ml: 'ജലാഭിഷേകം / ധാര',
    },
    category: 'daily',
    price: 60,
    description: {
      en: 'Continuous bathing of the holy Shivalinga with sanctified water and sacred herbal infusions while chanting Sri Rudram.',
      ml: 'ശ്രീരുദ്ര മന്ത്രജപത്തോടെ ശിവലിംഗത്തിൽ നടത്തുന്ന പവിത്രമായ ജലാഭിഷേകവും ധാരയും.',
    },
    significance: {
      en: 'Believed to cool anger, relieve illness, and bestow health, longevity and mental clarity.',
      ml: 'ആരോഗ്യം, ദീർഘായുസ്സ്, രോഗശാന്തി, മനോബലം എന്നിവയ്ക്കായി.',
    },
    timing: {
      en: 'Morning Usha Pooja',
      ml: 'ഉഷ പൂജാ സമയം',
    },
    popular: true,
    tag: {
      en: 'Shiva Preethi',
      ml: 'ശിവപ്രീതികരം',
    },
  },
  {
    id: 'koovala_mala',
    name: {
      en: 'Koovala Mala (Bilwa Leaf Garland)',
      ml: 'കൂവളമാല ചാർത്തൽ',
    },
    category: 'archana',
    price: 50,
    description: {
      en: 'Adorning the Shivalinga with fresh trifoliate Bilwa (Koovalam) leaves, representing the three eyes (Trinetra) of Mahadeva and the holy Trinity.',
      ml: 'ശിവന് ഏറ്റവും പ്രിയങ്കരമായ ത്രിദള കൂവള ഇലകൾ കൊണ്ട് മാല ചാർത്തൽ. ത്രിനേത്രപ്രീതികരം.',
    },
    significance: {
      en: 'Absolves past sins, purifies spiritual energy, and fulfills righteous desires.',
      ml: 'പാപമോചനം, ആഗ്രഹസാഫല്യം, സർവ്വാഭീഷ്ടസിദ്ധി എന്നിവയ്ക്കായി.',
    },
    timing: {
      en: 'Morning & Evening',
      ml: 'രാവിലെയും വൈകിട്ടും',
    },
    popular: true,
  },
  {
    id: 'ganapathi_homam',
    name: {
      en: 'Ganapathi Homam',
      ml: 'ഗണപതി ഹോമം',
    },
    category: 'homam',
    price: 150,
    description: {
      en: 'Sacred fire ritual performed before sunrise invoking Lord Ganesha to remove obstacles from new business, education, marriage, and travel.',
      ml: 'പുലർച്ചെ നടത്തുന്ന തന്ത്രിമുഖ്യ ഗണപതി ഹോമം. സർവ്വ വിഘ്നങ്ങളും നീക്കി വിജയവും അഭിവൃദ്ധിയും നൽകുന്നു.',
    },
    significance: {
      en: 'Destroys unseen hurdles, brings auspicious beginnings and prosperity in all endeavors.',
      ml: 'വിഘ്നനിവാരണം, തൊഴിൽ വിജയം, സർവ്വകാര്യ തടസ്സങ്ങൾ മാറാൻ.',
    },
    timing: {
      en: 'Dawn (Prior to Nirmalyam)',
      ml: 'പുലർച്ചെ',
    },
    popular: true,
    tag: {
      en: 'Obstacle Removal',
      ml: 'വിഘ്നനിവാരണം',
    },
  },
  {
    id: 'mrityunjaya_homam',
    name: {
      en: 'Maha Mrityunjaya Homam',
      ml: 'മഹാ മൃത്യുഞ്ജയ ഹോമം',
    },
    category: 'homam',
    price: 350,
    description: {
      en: 'Powerful Vedic fire oblation dedicated to Shiva as the conqueror of death, performed with the sacred Maha Mrityunjaya mantra for vitality and protection.',
      ml: 'മൃത്യുഞ്ജയ മന്ത്രജപത്തോടെ നടത്തുന്ന അതിശക്തമായ ഹോമം. രോഗപീഡകൾ ശമിപ്പിക്കാനും ആയുരാരോഗ്യത്തിനും.',
    },
    significance: {
      en: 'Protects from severe illnesses, accidents, and bestows revitalizing energy and longevity.',
      ml: 'രോഗശാന്തി, ദീർഘായുസ്സ്, അപകടങ്ങളിൽ നിന്നുള്ള രക്ഷ.',
    },
    timing: {
      en: 'Morning with advance booking',
      ml: 'മുൻകൂട്ടി ബുക്ക് ചെയ്ത് രാവിലെ',
    },
    popular: true,
    tag: {
      en: 'Health & Longevity',
      ml: 'ആയുരാരോഗ്യം',
    },
  },
  {
    id: 'karuka_homam',
    name: {
      en: 'Karuka Homam',
      ml: 'കറുക ഹോമം',
    },
    category: 'homam',
    price: 120,
    description: {
      en: 'Special homam performed with sacred Karuka (Bermuda grass) dipped in pure ghee for children’s well-being and intellect.',
      ml: 'ശുദ്ധമായ കറുകപ്പുല്ലും നെയ്യും അർപ്പിച്ച് നടത്തുന്ന വിശേഷാൽ ഹോമം. കുട്ടികളുടെ ഉന്നമനത്തിന്.',
    },
    significance: {
      en: 'Enhances memory, academic success, and cures chronic pediatric ailments.',
      ml: 'വിദ്യാഗുണം, കുട്ടികളുടെ ബാലാരിഷ്ടതകൾ മാറാൻ, ബുദ്ധിശക്തി.',
    },
    timing: {
      en: 'Morning',
      ml: 'രാവിലെ',
    },
  },
  {
    id: 'archana',
    name: {
      en: 'Sahasranama Archana',
      ml: 'സഹസ്രനാമാർച്ചന',
    },
    category: 'archana',
    price: 75,
    description: {
      en: 'Chanting the 1,008 sacred names of Lord Shiva while offering flowers and bilwa leaves in the name and birth star (Nakshatra) of the devotee.',
      ml: 'ഭക്തന്റെ പേരും നക്ഷത്രവും ചൊല്ലി 1008 ശിവനാമങ്ങൾ അർപ്പിച്ച് നടത്തുന്ന അർച്ചന.',
    },
    significance: {
      en: 'Personalized divine protection, family well-being and spiritual peace.',
      ml: 'നക്ഷത്രദോഷ നിവാരണം, കുടുംബ സുരക്ഷിതത്വം.',
    },
    timing: {
      en: 'All Darshan Sessions',
      ml: 'ദർശന സമയങ്ങളിൽ',
    },
  },
  {
    id: 'ashtothara_archana',
    name: {
      en: 'Ashtothara Satha Archana (108 Names)',
      ml: 'അഷ്ടോത്തരശതാർച്ചന',
    },
    category: 'archana',
    price: 40,
    description: {
      en: 'Offering bilwa leaves with the 108 auspicious names of Lord Mahadeva in the devotee’s name.',
      ml: '108 ശിവനാമങ്ങൾ ചൊല്ലി ഭക്തന്റെ പേരിൽ നടത്തുന്ന പുഷ്പാർച്ചന.',
    },
    significance: {
      en: 'Quick spiritual upliftment and relief from daily stress.',
      ml: 'സർവ്വാഭീഷ്ട സിദ്ധി, ദുരിതശമനം.',
    },
    timing: {
      en: 'All Darshan Sessions',
      ml: 'ദർശന സമയങ്ങളിൽ',
    },
  },
  {
    id: 'payasam',
    name: {
      en: 'Payasa Nivedyam (Kheer)',
      ml: 'പായസ നിവേദ്യം',
    },
    category: 'nivedyam',
    price: 80,
    description: {
      en: 'Traditional Kerala temple payasam prepared with raw rice, pure jaggery, cardamom and ghee, offered to Mahadeva and distributed as prasadam.',
      ml: 'ക്ഷേത്രത്തിൽ പരമ്പരാഗത രീതിയിൽ തയ്യാറാക്കുന്ന മധുര പായസ നിവേദ്യം.',
    },
    significance: {
      en: 'Attracts prosperity, joy, and satisfaction in home life.',
      ml: 'ദാമ്പത്യ ഐക്യം, സന്താനസൗഭാഗ്യം, ഗൃഹൈശ്വര്യം.',
    },
    timing: {
      en: 'Ucha Pooja (Midday)',
      ml: 'ഉച്ചപൂജയ്ക്ക്',
    },
  },
  {
    id: 'udayasthamana_pooja',
    name: {
      en: 'Udayasthamana Pooja',
      ml: 'ഉദയാസ്തമന പൂജ',
    },
    category: 'special',
    price: 3500,
    description: {
      en: 'The most sacred whole-day offering comprising 18 specialized poojas from sunrise to sunset, with special abhishekam, deeparadhana and feast.',
      ml: 'സൂര്യോദയം മുതൽ അസ്തമയം വരെ 18 പൂജകൾ അടങ്ങിയ മഹാ സമർപ്പണം. ക്ഷേത്രത്തിലെ ഏറ്റവും വലിയ വഴിപാട്.',
    },
    significance: {
      en: 'Considered equal to months of worship; brings immense blessings across generations.',
      ml: 'വംശവർദ്ധനവ്, ദീർഘകാല ദുരിത നിവാരണം, സർവ്വഐശ്വര്യം.',
    },
    timing: {
      en: 'Full Day (Advance Booking Required)',
      ml: 'പൂർണ്ണ ദിവസം (മുൻകൂട്ടി ബുക്ക് ചെയ്യണം)',
    },
    tag: {
      en: 'Grand Offering',
      ml: 'മഹാ വഴിപാട്',
    },
  },
  {
    id: 'nirmalya_darshanam',
    name: {
      en: 'Nirmalya Darshanam Special Archana',
      ml: 'നിർമ്മാല്യ ദർശന പുഷ്പാഞ്ജലി',
    },
    category: 'special',
    price: 100,
    description: {
      en: 'Special pushpanjali performed during the sacred first dawn opening at 4:30 AM before the previous day’s adornments are removed.',
      ml: 'പുലർച്ചെ 4:30ന് നിർമ്മാല്യ സമയത്ത് ഭക്തന്റെ പേരിൽ നടത്തുന്ന പ്രത്യേക പുഷ്പാഞ്ജലി.',
    },
    significance: {
      en: 'Extremely powerful for mental tranquility, success in competitive goals and health.',
      ml: 'മനോവിഷമങ്ങൾ അകലാൻ, വിദ്യാവിജയം, ശാന്തി.',
    },
    timing: {
      en: '4:30 AM Daily',
      ml: 'ദിവസേന രാവിലെ 4:30',
    },
  },
  {
    id: 'thirumadhuram',
    name: {
      en: 'Thirumadhuram Nivedyam',
      ml: 'തിരുമധുരം',
    },
    category: 'nivedyam',
    price: 35,
    description: {
      en: 'Sweet offering of banana, honey, sugar candy, and dry grapes, beloved by the deities.',
      ml: 'കദളിപ്പഴം, തേൻ, കൽക്കണ്ടം എന്നിവ ചേർത്ത പവിത്രമായ തിരുമധുര നിവേദ്യം.',
    },
    significance: {
      en: 'Sweetness in relationships, child health and speech harmony.',
      ml: 'സന്താനഗുണം, ഐശ്വര്യം.',
    },
    timing: {
      en: 'Morning & Evening',
      ml: 'രാവിലെയും വൈകിട്ടും',
    },
  },
];
