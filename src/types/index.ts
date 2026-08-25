export type Language = 'en' | 'ml';

export type OfferingCategory = 
  | 'all' 
  | 'pooja_homam' 
  | 'abhishekam_dhara' 
  | 'archana_pushpanjali' 
  | 'nivedyam_payasam' 
  | 'vilakku_mala' 
  | 'special_sevas';

export interface OfferingItem {
  slNo: number;
  id: string;
  name: {
    en: string;
    ml: string;
  };
  category: 'pooja_homam' | 'abhishekam_dhara' | 'archana_pushpanjali' | 'nivedyam_payasam' | 'vilakku_mala' | 'special_sevas';
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
