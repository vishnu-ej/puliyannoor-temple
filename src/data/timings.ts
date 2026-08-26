import { PoojaTiming } from '../types';

export const POOJA_TIMINGS: PoojaTiming[] = [
  {
    id: 'nirmalyam',
    name: {
      en: 'Nirmalyam & Morning Darshan',
      ml: 'നിർമ്മാല്യ ദർശനവും പ്രഭാത പൂജയും',
    },
    time: '4:00 AM',
    timeLabel: {
      en: '4:00 AM – 5:00 AM',
      ml: 'രാവിലെ 4:00 – 5:00',
    },
    period: 'morning',
    startMinutes: 240, // 4:00 AM
    endMinutes: 300,   // 5:00 AM
    description: {
      en: 'The sanctum doors open at 4:00 AM to reveal Mahadeva in the prior evening’s sacred floral decorations (Nirmalyam). Extremely auspicious for meditation and prayers.',
      ml: 'പുലർച്ചെ 4:00 മണിക്ക് നടതുറപ്പ്. തലേദിവസത്തെ പൂക്കളോടെ ഭഗവാനെ ദർശിക്കുന്ന നിർമ്മാല്യ ദർശനം. അതീവ പുണ്യകരവും മനസ്സമാധാനദായകവുമാണ്.',
    },
    isVerified: true,
  },
  {
    id: 'usha_pooja',
    name: {
      en: 'Usha Pooja & Abhishekam',
      ml: 'ഉഷ പൂജയും അഭിഷേകവും',
    },
    time: '5:30 AM',
    timeLabel: {
      en: '5:30 AM – 6:30 AM',
      ml: 'രാവിലെ 5:30 – 6:30',
    },
    period: 'morning',
    startMinutes: 330, // 5:30 AM
    endMinutes: 390,   // 6:30 AM
    description: {
      en: 'Dawn worship rituals, sacred Jalabhishekam / Dhara with holy Vedic chants, and morning naivedyam offering.',
      ml: 'പ്രഭാത പൂജ, മന്ത്രസഹിതമായ ജലാഭിഷേകം, ധാര എന്നിവയും നൈവേദ്യ സമർപ്പണവും.',
    },
    isVerified: true,
  },
  {
    id: 'pantheeradi',
    name: {
      en: 'Pantheeradi Pooja',
      ml: 'പന്തീരടി പൂജ',
    },
    time: '7:30 AM',
    timeLabel: {
      en: '7:30 AM – 8:30 AM',
      ml: 'രാവിലെ 7:30 – 8:30',
    },
    period: 'morning',
    startMinutes: 450, // 7:30 AM
    endMinutes: 510,   // 8:30 AM
    description: {
      en: 'Mid-morning traditional pooja conducted when the shadow measures 12 feet, adhering to ancient Vastu Agama rules.',
      ml: 'പരമ്പരാഗത തന്ത്രവിധിപ്രകാരം നടത്തുന്ന പന്തീരടി പൂജയും പ്രത്യേക അർച്ചനകളും.',
    },
    isVerified: true,
  },
  {
    id: 'ucha_pooja',
    name: {
      en: 'Ucha Pooja & Midday Darshan',
      ml: 'ഉച്ചപൂജയും ഉച്ച ദർശനവും',
    },
    time: '9:30 AM',
    timeLabel: {
      en: '9:30 AM – 10:00 AM',
      ml: 'രാവിലെ 9:30 – 10:00',
    },
    period: 'morning',
    startMinutes: 570, // 9:30 AM
    endMinutes: 600,   // 10:00 AM
    description: {
      en: 'Midday major pooja, concluding the morning darshan with Deeparadhana before the shrine closes at 10:00 AM for the afternoon recess.',
      ml: 'ഉച്ചപൂജ, മഹാദീപാരാധന. തുടർന്ന് രാവിലെ 10:00 മണിക്ക് ക്ഷേത്രനട അടയ്ക്കുന്നു.',
    },
    isVerified: true,
  },
  {
    id: 'evening_open',
    name: {
      en: 'Evening Darshan Opens',
      ml: 'വൈകുന്നേരത്തെ നടതുറക്കൽ',
    },
    time: '5:30 PM',
    timeLabel: {
      en: '5:30 PM – 6:15 PM',
      ml: 'വൈകിട്ട് 5:30 – 6:15',
    },
    period: 'evening',
    startMinutes: 1050, // 5:30 PM
    endMinutes: 1095,   // 6:15 PM
    description: {
      en: 'Sanctum re-opens at 5:30 PM for the evening session. Devotees light ghee lamps (Neyvilakku) in the Chuttambalam.',
      ml: 'വൈകുന്നേരം 5:30ന് ദർശനത്തിനായി നടതുറക്കുന്നു. ഭക്തർ ചുറ്റുവിളക്കുകളും നെയ്‌വിളക്കുകളും കൊളുത്തുന്നു.',
    },
    isVerified: true,
  },
  {
    id: 'deeparadhana',
    name: {
      en: 'Deeparadhana (Sandhya Pooja)',
      ml: 'സന്ധ്യാ ദീപാരാധന',
    },
    time: '6:15 PM',
    timeLabel: {
      en: '6:15 PM – 6:45 PM',
      ml: 'സന്ധ്യയ്ക്ക് 6:15 – 6:45',
    },
    period: 'evening',
    startMinutes: 1095, // 6:15 PM
    endMinutes: 1125,   // 6:45 PM
    description: {
      en: 'The grand evening lamp ritual accompanied by sacred conch blowing, bell chimes, and traditional temple hymns.',
      ml: 'ശംഖനാദവും മണിമുഴക്കവും ദീപാലങ്കാരങ്ങളുമായി ഭക്തിസാന്ദ്രമായ സന്ധ്യാ ദീപാരാധന.',
    },
    isVerified: true,
  },
  {
    id: 'athazha_pooja',
    name: {
      en: 'Athazha Pooja & Night Closing',
      ml: 'അത്താഴപൂജയും നടയടപ്പും',
    },
    time: '6:45 PM',
    timeLabel: {
      en: '6:45 PM – 7:00 PM',
      ml: 'രാത്രി 6:45 – 7:00',
    },
    period: 'evening',
    startMinutes: 1125, // 6:45 PM
    endMinutes: 1140,   // 7:00 PM
    description: {
      en: 'The night offering and final darshan before the temple sanctum is closed at 7:00 PM.',
      ml: 'ദിവസത്തെ അവസാന പൂജയും ദർശനവും. രാത്രി 7:00 മണിക്ക് നടയടയ്ക്കുന്നു.',
    },
    isVerified: true,
  },
];

export interface LiveTempleStatus {
  isOpen: boolean;
  statusText: {
    en: string;
    ml: string;
  };
  subText: {
    en: string;
    ml: string;
  };
  currentOrNextPoojaName: {
    en: string;
    ml: string;
  };
  badgeColor: 'emerald' | 'amber' | 'crimson';
}

export function calculateLiveTempleStatus(date = new Date()): LiveTempleStatus {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  // Morning Session: 4:00 AM (240) to 10:00 AM (600)
  if (currentMinutes >= 240 && currentMinutes < 600) {
    const activePooja = POOJA_TIMINGS.find(
      (p) => currentMinutes >= p.startMinutes && currentMinutes <= p.endMinutes
    );

    return {
      isOpen: true,
      statusText: {
        en: 'Temple is Open for Morning Darshan',
        ml: 'രാവിലത്തെ ദർശനത്തിനായി നട തുറന്നിരിക്കുന്നു',
      },
      subText: {
        en: activePooja
          ? `Current Ritual: ${activePooja.name.en}`
          : 'Morning session closes at 10:00 AM',
        ml: activePooja
          ? `നിലവിലെ ചടങ്ങ്: ${activePooja.name.ml}`
          : 'രാവിലത്തെ ദർശനം 10:00 മണിക്ക് അവസാനിക്കും',
      },
      currentOrNextPoojaName: activePooja
        ? activePooja.name
        : { en: 'Morning Darshan', ml: 'പ്രഭാത ദർശനം' },
      badgeColor: 'emerald',
    };
  }

  // Afternoon Break: 10:00 AM (600) to 5:30 PM (1050)
  if (currentMinutes >= 600 && currentMinutes < 1050) {
    const remainingMins = 1050 - currentMinutes;
    const hours = Math.floor(remainingMins / 60);
    const mins = remainingMins % 60;
    const timeRemainingStr = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

    return {
      isOpen: false,
      statusText: {
        en: 'Closed for Midday Recess',
        ml: 'ഉച്ചസമയത്ത് നട അടച്ചിരിക്കുന്നു',
      },
      subText: {
        en: `Opens for Evening Darshan at 5:30 PM (in ~${timeRemainingStr})`,
        ml: `വൈകുന്നേരം 5:30 മണിക്ക് നട തുറക്കും (~${timeRemainingStr} കഴിഞ്ഞ്)`,
      },
      currentOrNextPoojaName: {
        en: 'Evening Darshan (5:30 PM)',
        ml: 'സന്ധ്യാ ദർശനം (വൈകിട്ട് 5:30)',
      },
      badgeColor: 'amber',
    };
  }

  // Evening Session: 5:30 PM (1050) to 7:00 PM (1140)
  if (currentMinutes >= 1050 && currentMinutes < 1140) {
    const activePooja = POOJA_TIMINGS.find(
      (p) => currentMinutes >= p.startMinutes && currentMinutes <= p.endMinutes
    );

    return {
      isOpen: true,
      statusText: {
        en: 'Temple is Open for Evening Darshan',
        ml: 'വൈകുന്നേരത്തെ ദർശനത്തിനായി നട തുറന്നിരിക്കുന്നു',
      },
      subText: {
        en: activePooja
          ? `Current Ritual: ${activePooja.name.en}`
          : 'Evening session closes at 7:00 PM',
        ml: activePooja
          ? `നിലവിലെ ചടങ്ങ്: ${activePooja.name.ml}`
          : 'വൈകുന്നേരത്തെ ദർശനം രാത്രി 7:00 മണിക്ക് അവസാനിക്കും',
      },
      currentOrNextPoojaName: activePooja
        ? activePooja.name
        : { en: 'Evening Pooja', ml: 'സന്ധ്യാ പൂജ' },
      badgeColor: 'emerald',
    };
  }

  // Night / Pre-dawn: 7:00 PM (1140) to 4:00 AM (240)
  let remainingMinsToDawn = 0;
  if (currentMinutes >= 1140) {
    remainingMinsToDawn = 1440 - currentMinutes + 240;
  } else {
    remainingMinsToDawn = 240 - currentMinutes;
  }
  const hours = Math.floor(remainingMinsToDawn / 60);
  const mins = remainingMinsToDawn % 60;

  return {
    isOpen: false,
    statusText: {
      en: 'Temple is Closed for the Night',
      ml: 'രാത്രി നട അടച്ചിരിക്കുന്നു',
    },
    subText: {
      en: `Nirmalyam & Morning Darshan opens at 4:00 AM (in ~${hours} hr ${mins} min)`,
      ml: `നിർമ്മാല്യ ദർശനത്തിനായി പുലർച്ചെ 4:00ന് നട തുറക്കും (~${hours} മണിക്കൂർ ${mins} മിനിറ്റ്)`,
    },
    currentOrNextPoojaName: {
      en: 'Nirmalyam Darshan (4:00 AM)',
      ml: 'നിർമ്മാല്യ ദർശനം (പുലർച്ചെ 4:00)',
    },
    badgeColor: 'crimson',
  };
}
