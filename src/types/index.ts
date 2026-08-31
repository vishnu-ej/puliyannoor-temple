export type Language = 'en' | 'ml';

export type OfferingItemCategory =
  | 'pooja_homam'
  | 'abhishekam_dhara'
  | 'archana_pushpanjali'
  | 'nivedyam_payasam'
  | 'vilakku_mala'
  | 'special_sevas';

export type OfferingCategory = 'all' | OfferingItemCategory;

export interface OfferingItem {
  slNo: number;
  id: string;
  name: {
    en: string;
    ml: string;
  };
  category: OfferingItemCategory;
  price: number;
  description: {
    en: string;
    ml: string;
  };
  significance: {
    en: string;
    ml: string;
  };
  timing?: {
    en: string;
    ml: string;
  };
  popular?: boolean;
  tag?: {
    en: string;
    ml: string;
  };
}

export interface CartItem {
  cartId: string;
  offering: OfferingItem;
  devoteeName?: string;
  starNameEn?: string;
  starNameMl?: string;
  familyName?: string;
  place?: string;
  date: string;
  notes?: string;
  quantity: number;
}

export interface PoojaTiming {
  id: string;
  name: {
    en: string;
    ml: string;
  };
  time: string;
  timeLabel: {
    en: string;
    ml: string;
  };
  period: 'morning' | 'evening';
  startMinutes: number;
  endMinutes: number;
  description: {
    en: string;
    ml: string;
  };
  isVerified?: boolean;
}

export interface FestivalEvent {
  id: string;
  title: {
    en: string;
    ml: string;
  };
  subtitle: {
    en: string;
    ml: string;
  };
  malayalamMonth: {
    en: string;
    ml: string;
  };
  description: {
    en: string;
    ml: string;
  };
  highlights: {
    en: string[];
    ml: string[];
  };
  iconName: string;
  isMajor?: boolean;
  upcomingDateStr?: string;
}

export interface ArchitectureFeature {
  id: string;
  title: {
    en: string;
    ml: string;
  };
  shortTitle: {
    en: string;
    ml: string;
  };
  description: {
    en: string;
    ml: string;
  };
  historicalNote: {
    en: string;
    ml: string;
  };
}

export interface Nakshatra {
  id: number;
  nameEn: string;
  nameMl: string;
}

export interface VisheshaDivasam {
  id: string;
  malayalamMonthDate: string; // e.g. "1202 ചിങ്ങം 1" or "10"
  englishMonthDate: string;   // e.g. "2026 ആഗസ്റ്റ് 17" or "26"
  dayOfWeek: string;          // e.g. "തിങ്കൾ", "ബുധൻ"
  vishesham: string;          // e.g. "ആണ്ടുപിറപ്പ്", "തിരുവോണം, നിറപുത്തരി"
}

export interface PradoshamDate {
  id: string;
  malayalamMonthDate: string; // e.g. "1202 ചിങ്ങം 9" or "23"
  englishMonthDate: string;   // e.g. "2026 ആഗസ്റ്റ് 25" or "സെപ്റ്റംബർ 8"
  dayOfWeek: string;          // e.g. "ചൊവ്വ", "വ്യാഴം"
}

export interface SamkramamDate {
  id: string;
  malayalamMonth: string;      // e.g. "1202 ചിങ്ങം", "കന്നി"
  occurringMonthDate: string;  // e.g. "2026 ചിങ്ങം", "കന്നി"
  dayOfWeek: string;           // e.g. "1 തിങ്കൾ", "1 വ്യാഴം", "31 ശനി"
}

export interface AnnualCalendarData {
  malayalamYear: string;        // e.g. "1202 -ാമാണ്ട്"
  gregorianYear: string;        // e.g. "(2026 – 2027)"
  title: string;                // e.g. "പ്രധാന വിശേഷ ദിവസങ്ങൾ"
  templeName: string;           // e.g. "പുളിയന്നൂർ ശ്രീമഹാദേവ ക്ഷേത്രം"
  templeAddress: string;        // e.g. "പുളിയന്നൂർ പി. ഒ. പാലാ 686 573, കോട്ടയം ജില്ല"
  templePhones: string;         // e.g. "8891346001, 9605752642"
  visheshaDivasangal: VisheshaDivasam[];
  pradosham: PradoshamDate[];
  samkramam: SamkramamDate[];
  poojaTimings: {
    morning: string;
    evening: string;
  };
  bankInfo: {
    bankName: string;
    branch: string;
    accountHolder: string;
    accountNo: string;
    ifsc: string;
  };
  ulsavamBox: {
    title: string;              // "തിരുവുത്സവം"
    gregorianDates: string;     // "2027 ഫെബ്രുവരി 28 ഞായർ മുതൽ മാർച്ച് 7 ഞായർ വരെ"
    malayalamDates: string;     // "(1202 കുംഭം 16 മുതൽ 23 വരെ)"
    footerNote: string;         // "* പുളിയന്നൂർ ദേവസ്വം പ്രസിദ്ധീകരണം"
  };
}
