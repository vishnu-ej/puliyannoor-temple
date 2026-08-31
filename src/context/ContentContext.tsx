'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  OfferingItem,
  FestivalEvent,
  AnnualCalendarData,
  VisheshaDivasam,
  PradoshamDate,
  SamkramamDate,
  FestivalCountdownConfig,
} from '../types';
import { OFFERINGS as DEFAULT_OFFERINGS } from '../data/offerings';
import { FESTIVALS as DEFAULT_FESTIVALS } from '../data/festivals';
import { DEFAULT_ANNUAL_CALENDAR } from '../data/annualCalendar';

export const DEFAULT_COUNTDOWN_CONFIG: FestivalCountdownConfig = {
  targetDate: '2027-02-28T20:00',
  eyebrow: {
    en: 'Upcoming 2027 Festival: Feb 28 – Mar 07, 2027 (Kumbham 16 – 23)',
    ml: 'അടുത്ത വാർഷിക തിരുവുത്സവം: 2027 ഫെബ്രുവരി 28 – മാർച്ച് 07 (കുംഭം 16 – 23)',
  },
  title: {
    en: '2027 Annual Temple Festival',
    ml: '2027 വാർഷിക തിരുവുത്സവം',
  },
  subtitle: {
    en: 'Feb 28, 2027 (Sun) – Mar 07, 2027 (Sun) · 1202 Kumbham 16 – 23',
    ml: '2027 ഫെബ്രുവരി 28 ഞായർ – മാർച്ച് 07 ഞായർ · 1202 കുംഭം 16 – 23',
  },
  isActive: true,
};

export interface ChatMessage {
  id: string;
  sender: 'devotee' | 'admin';
  text: string;
  timestamp: string;
  createdAt?: number;
  isEdited?: boolean;
  deliveryStatus?: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
  id: string;
  devoteeName: string;
  devoteePhone?: string;
  star?: string;
  subject: string;
  unread: boolean;
  status: 'active' | 'resolved' | 'pending';
  lastMessageTime: string;
  messages: ChatMessage[];
}

export interface TempleContactInfo {
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  address: string;
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  qrImageUrl: string;
  qrPdfUrl?: string;
  qrPdfName?: string;
  managingTrustee: string;
  officeHoursMorning: string;
  officeHoursEvening: string;
}

const DEFAULT_CONTACT_INFO: TempleContactInfo = {
  email: 'puliyannoordevaswom@gmail.com',
  phone: '+918891346001',
  phoneDisplay: '+91 88913 46001',
  whatsapp: '918891346001',
  whatsappDisplay: '+91 88913 46001',
  address: 'PM34+XQ6, Puliyannoor, Mutholy, Pala, Kottayam District, Kerala 686573, India',
  bankName: 'CANARA BANK (കനറാ ബാങ്ക്)',
  bankBranch: 'Puliyannoor Branch',
  accountName: 'Puliyannoor Devaswom',
  accountNumber: '5636101001111',
  ifscCode: 'CNRB0005636',
  upiId: '100027928001111@cnrb',
  qrImageUrl: '/temple-qr-code.png',
  qrPdfUrl: '/temple-qr.pdf',
  qrPdfName: 'Canara_Bank_BHIM_UPI_QR.pdf',
  managingTrustee: 'Managing Trustee & Treasurer, Puliyannoor Devaswom',
  officeHoursMorning: 'Morning: 7:00 AM – 12:00 PM',
  officeHoursEvening: 'Evening: 4:30 PM – 7:00 PM',
};

const DEFAULT_CHATS: ChatConversation[] = [
  {
    id: 'chat_1',
    devoteeName: 'Anoop Menon (അനൂപ് മേനോൻ)',
    devoteePhone: '+91 98471 23456',
    star: 'Thiruvathira (തിരുവാതിര)',
    subject: 'Udayasthamana Pooja Booking Date Inquiry',
    unread: true,
    status: 'active',
    lastMessageTime: '10:45 AM',
    messages: [
      {
        id: 'm1_1',
        sender: 'devotee',
        text: 'നമസ്കാരം, 2027 ജനുവരി മാസത്തിൽ ഉദയാസ്തമന പൂജയ്ക്ക് ഒഴിവുള്ള തീയതികൾ അറിയാൻ ആഗ്രഹിക്കുന്നു.',
        timestamp: '10:30 AM',
      },
      {
        id: 'm1_2',
        sender: 'admin',
        text: 'നമസ്കാരം അനൂപ്. 2027 ജനുവരി 14 (മകര സംക്രാന്തി), ജനുവരി 21 തീയതികളിൽ ഉദയാസ്തമന പൂജ ബുക്കിംഗ് ലഭ്യമാണ്.',
        timestamp: '10:38 AM',
      },
      {
        id: 'm1_3',
        sender: 'devotee',
        text: 'നന്ദി സ്വാമി. ജനുവരി 21 തീയതി കുടുംബാംഗങ്ങളുമായി ആലോചിച്ച് അഡ്വാൻസ് അടയ്ക്കാൻ ബാങ്ക് വിവരങ്ങൾ ഇവിടെ നോക്കി ചെയ്യാം.',
        timestamp: '10:45 AM',
      },
    ],
  },
  {
    id: 'chat_2',
    devoteeName: 'Sreedevi Namboothiri (ശ്രീദേവി)',
    devoteePhone: '+91 94462 89012',
    star: 'Rohini (രോഹിണി)',
    subject: 'Koottu Namaskaram for Vadakkedathu Family',
    unread: false,
    status: 'resolved',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'm2_1',
        sender: 'devotee',
        text: 'ഞങ്ങളുടെ വടക്കേടത്ത് കുടുംബത്തിന്റെ പേരിലുള്ള കൂട്ടനമസ്കാരം ചിങ്ങം 1-ന് നടത്താൻ ആഗ്രഹിക്കുന്നു. കുടുംബപ്പേരും സ്ഥലവും രേഖപ്പെടുത്തിയിട്ടുണ്ട്.',
        timestamp: 'Yesterday 04:15 PM',
      },
      {
        id: 'm2_2',
        sender: 'admin',
        text: 'നമസ്കാരം ശ്രീദേവി. ചിങ്ങം 1-ലെ കൂട്ടനമസ്കാരം ലിസ്റ്റിൽ ചേർത്തു. പ്രസാദം പൂജയ്ക്ക് ശേഷം ക്ഷേത്രത്തിൽ നിന്ന് നേരിട്ട് വാങ്ങാവുന്നതാണ്.',
        timestamp: 'Yesterday 04:40 PM',
      },
    ],
  },
  {
    id: 'chat_3',
    devoteeName: 'K. Radhakrishnan (കെ. രാധാകൃഷ്ണൻ)',
    devoteePhone: '+91 97455 67890',
    star: 'Revathi (രേവതി)',
    subject: 'Temple Auditorium Booking for Marriage',
    unread: true,
    status: 'active',
    lastMessageTime: '08:20 AM',
    messages: [
      {
        id: 'm3_1',
        sender: 'devotee',
        text: '2027 ഏപ്രിൽ 18 ഞായറാഴ്ച ക്ഷേത്ര ഓഡിറ്റോറിയം വിവാഹ ആവശ്യത്തിനായി ലഭ്യമാണോ? അഡ്വാൻസ് ടോക്കൺ തുക എത്രയാണ്?',
        timestamp: '08:10 AM',
      },
      {
        id: 'm3_2',
        sender: 'admin',
        text: 'നമസ്കാരം രാധാകൃഷ്ണൻ. ഏപ്രിൽ 18 തീയതി ഓഡിറ്റോറിയം ലഭ്യമാണ്. ₹10,000 അഡ്വാൻസ് അടച്ചു ബുക്കിംഗ് ഉറപ്പാക്കാം.',
        timestamp: '08:20 AM',
      },
    ],
  },
  {
    id: 'chat_4',
    devoteeName: 'Unnikrishnan P. (ഉണ്ണികൃഷ്ണൻ പി.)',
    devoteePhone: '+91 94950 11223',
    star: 'Aswathi (അശ്വതി)',
    subject: 'Thila Homam for Ancestral Peace',
    unread: false,
    status: 'pending',
    lastMessageTime: 'Aug 28',
    messages: [
      {
        id: 'm4_1',
        sender: 'devotee',
        text: 'ശനിയാഴ്ച ദിവസങ്ങളിൽ തിലഹോമം നടത്തുന്നതിന് മുൻകൂട്ടി രജിസ്റ്റർ ചെയ്യേണ്ടതുണ്ടോ?',
        timestamp: 'Aug 28 06:00 PM',
      },
      {
        id: 'm4_2',
        sender: 'admin',
        text: 'ശനിയാഴ്ച പുലർച്ചെ 5:30-നാണ് തിലഹോമം. തലേദിവസം വൈകിട്ട് 6:30-ന് മുൻപായി പേരും നക്ഷത്രവും ദേവസ്വം ഓഫീസിൽ നൽകുന്നത് ഉത്തമമാണ്.',
        timestamp: 'Aug 28 06:25 PM',
      },
    ],
  },
];

interface ContentContextType {
  offerings: OfferingItem[];
  festivals: FestivalEvent[];
  contactInfo: TempleContactInfo;
  chats: ChatConversation[];
  annualCalendar: AnnualCalendarData;
  countdownConfig: FestivalCountdownConfig;
  addOffering: (offering: Omit<OfferingItem, 'slNo'> & { slNo?: number }) => void;
  updateOffering: (id: string, updatedFields: Partial<OfferingItem>) => void;
  deleteOffering: (id: string) => void;
  addFestival: (festival: FestivalEvent) => void;
  updateFestival: (id: string, updatedFields: Partial<FestivalEvent>) => void;
  deleteFestival: (id: string) => void;
  deleteMultipleFestivals: (ids: string[]) => void;
  updateContactInfo: (updatedFields: Partial<TempleContactInfo>) => void;
  updateAnnualCalendar: (updatedFields: Partial<AnnualCalendarData>) => void;
  updateCountdownConfig: (updatedFields: Partial<FestivalCountdownConfig>) => void;
  addVisheshaDivasam: (item: Omit<VisheshaDivasam, 'id'>) => void;
  updateVisheshaDivasam: (id: string, updatedFields: Partial<VisheshaDivasam>) => void;
  deleteVisheshaDivasam: (id: string) => void;
  addPradoshamDate: (item: Omit<PradoshamDate, 'id'>) => void;
  updatePradoshamDate: (id: string, updatedFields: Partial<PradoshamDate>) => void;
  deletePradoshamDate: (id: string) => void;
  addSamkramamDate: (item: Omit<SamkramamDate, 'id'>) => void;
  updateSamkramamDate: (id: string, updatedFields: Partial<SamkramamDate>) => void;
  deleteSamkramamDate: (id: string) => void;
  updateUlsavamBox: (ulsavamData: Partial<AnnualCalendarData['ulsavamBox']>) => void;
  resetAnnualCalendar: () => void;
  sendMessage: (conversationId: string, text: string) => void;
  editChatMessage: (conversationId: string, messageId: string, newText: string) => void;
  createDevoteeInquiryChat: (devoteeName: string, phone: string, subject: string, messageText: string, star?: string) => void;
  markChatAsRead: (conversationId: string) => void;
  updateChatStatus: (conversationId: string, status: 'active' | 'resolved' | 'pending') => void;
  advanceMessageDeliveryStatus: (conversationId: string, messageId: string) => 'sent' | 'delivered' | 'read';
  setMessageDeliveryStatus: (conversationId: string, messageId: string, status: 'sent' | 'delivered' | 'read') => void;
  resetToDefaults: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offerings, setOfferings] = useState<OfferingItem[]>(DEFAULT_OFFERINGS);
  const [festivals, setFestivals] = useState<FestivalEvent[]>(DEFAULT_FESTIVALS);
  const [contactInfo, setContactInfo] = useState<TempleContactInfo>(DEFAULT_CONTACT_INFO);
  const [chats, setChats] = useState<ChatConversation[]>(DEFAULT_CHATS);
  const [annualCalendar, setAnnualCalendar] = useState<AnnualCalendarData>(DEFAULT_ANNUAL_CALENDAR);
  const [countdownConfig, setCountdownConfig] = useState<FestivalCountdownConfig>(DEFAULT_COUNTDOWN_CONFIG);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedOfferings = localStorage.getItem('puliyannoor_offerings');
      if (savedOfferings) {
        const sanitized = savedOfferings.replaceAll('പുളിയ', 'പുലിയ');
        setOfferings(JSON.parse(sanitized));
      }

      const savedFestivals = localStorage.getItem('puliyannoor_festivals');
      if (savedFestivals) {
        const sanitized = savedFestivals.replaceAll('പുളിയ', 'പുലിയ');
        setFestivals(JSON.parse(sanitized));
      }

      const savedContact = localStorage.getItem('puliyannoor_contact');
      if (savedContact) {
        const sanitized = savedContact.replaceAll('പുളിയ', 'പുലിയ');
        const parsed = JSON.parse(sanitized);
        if (
          !parsed.phone ||
          parsed.phone.includes('4822') ||
          parsed.phone === '+914822212345' ||
          parsed.phone === '+91 4822 212345'
        ) {
          parsed.phone = '+918891346001';
          parsed.phoneDisplay = '+91 88913 46001';
        }
        if (
          !parsed.whatsapp ||
          parsed.whatsapp.includes('9447') ||
          parsed.whatsapp === '919447000000' ||
          parsed.whatsapp === '+91 94470 00000'
        ) {
          parsed.whatsapp = '918891346001';
          parsed.whatsappDisplay = '+91 88913 46001';
        }
        if (
          !parsed.officeHoursMorning ||
          parsed.officeHoursMorning.includes('4:00 AM') ||
          parsed.officeHoursMorning.includes('10:00 AM')
        ) {
          parsed.officeHoursMorning = 'Morning: 7:00 AM – 12:00 PM';
        }
        if (
          !parsed.officeHoursEvening ||
          parsed.officeHoursEvening.includes('5:30 PM')
        ) {
          parsed.officeHoursEvening = 'Evening: 4:30 PM – 7:00 PM';
        }
        setContactInfo(parsed);
      } else {
        setContactInfo(DEFAULT_CONTACT_INFO);
      }

      const savedChats = localStorage.getItem('puliyannoor_chats');
      if (savedChats) {
        const sanitized = savedChats.replaceAll('പുളിയ', 'പുലിയ');
        setChats(JSON.parse(sanitized));
      }

      const savedCalendar = localStorage.getItem('puliyannoor_annual_calendar');
      if (savedCalendar) {
        const sanitized = savedCalendar.replaceAll('പുളിയ', 'പുലിയ');
        const parsed = JSON.parse(sanitized);
        if (parsed.templePhones && parsed.templePhones.includes('9605752642')) {
          parsed.templePhones = '8891346001';
        }
        if (parsed.visheshaDivasangal && parsed.visheshaDivasangal.length > 0) {
          parsed.visheshaDivasangal.forEach((vd: any) => {
            if (vd.id === 'vd_1' && (vd.dayOfWeek === 'ത' || vd.dayOfWeek === 'തി')) {
              vd.dayOfWeek = 'തിങ്കൾ';
            }
          });
        }
        setAnnualCalendar(parsed);
      } else {
        setAnnualCalendar(DEFAULT_ANNUAL_CALENDAR);
      }

      const savedCountdown = localStorage.getItem('puliyannoor_festival_countdown');
      if (savedCountdown) {
        const parsed = JSON.parse(savedCountdown);
        // If targetDate is 4 AM or not 8 PM, migrate to 8:00 PM (20:00)
        if (
          !parsed.targetDate ||
          parsed.targetDate.includes('04:00') ||
          parsed.targetDate === '2027-02-28T04:00'
        ) {
          parsed.targetDate = '2027-02-28T20:00';
        }
        if (
          !parsed.eyebrow?.en ||
          parsed.eyebrow.en === 'Next Major Festival Countdown' ||
          parsed.eyebrow.en === 'Next Major Temple Festival'
        ) {
          parsed.eyebrow = DEFAULT_COUNTDOWN_CONFIG.eyebrow;
        }
        if (!parsed.title?.en) {
          parsed.title = DEFAULT_COUNTDOWN_CONFIG.title;
        }
        if (!parsed.subtitle?.en) {
          parsed.subtitle = DEFAULT_COUNTDOWN_CONFIG.subtitle;
        }
        setCountdownConfig(parsed);
      } else {
        setCountdownConfig(DEFAULT_COUNTDOWN_CONFIG);
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('puliyannoor_offerings', JSON.stringify(offerings));
    } catch (e) {}
  }, [offerings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('puliyannoor_festivals', JSON.stringify(festivals));
    } catch (e) {}
  }, [festivals, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('puliyannoor_contact', JSON.stringify(contactInfo));
    } catch (e) {}
  }, [contactInfo, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('puliyannoor_chats', JSON.stringify(chats));
    } catch (e) {}
  }, [chats, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('puliyannoor_annual_calendar', JSON.stringify(annualCalendar));
    } catch (e) {}
  }, [annualCalendar, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('puliyannoor_festival_countdown', JSON.stringify(countdownConfig));
    } catch (e) {}
  }, [countdownConfig, isInitialized]);

  // Offering actions
  const addOffering = (newOff: Omit<OfferingItem, 'slNo'> & { slNo?: number }) => {
    const nextSlNo = newOff.slNo || offerings.length + 1;
    const item: OfferingItem = {
      ...newOff,
      slNo: nextSlNo,
      id: newOff.id || `offering_${Date.now()}`,
    };
    setOfferings((prev) => [...prev, item]);
  };

  const updateOffering = (id: string, updatedFields: Partial<OfferingItem>) => {
    setOfferings((prev) =>
      prev.map((off) => (off.id === id ? { ...off, ...updatedFields } : off))
    );
  };

  const deleteOffering = (id: string) => {
    setOfferings((prev) => {
      const filtered = prev.filter((off) => off.id !== id);
      // Renumber sequentially
      return filtered.map((item, idx) => ({ ...item, slNo: idx + 1 }));
    });
  };

  // Festival actions
  const addFestival = (newFest: FestivalEvent) => {
    setFestivals((prev) => [...prev, newFest]);
  };

  const updateFestival = (id: string, updatedFields: Partial<FestivalEvent>) => {
    setFestivals((prev) =>
      prev.map((fest) => (fest.id === id ? { ...fest, ...updatedFields } : fest))
    );
  };

  const deleteFestival = (id: string) => {
    setFestivals((prev) => prev.filter((fest) => fest.id !== id));
  };

  const deleteMultipleFestivals = (ids: string[]) => {
    setFestivals((prev) => prev.filter((fest) => !ids.includes(fest.id)));
  };

  // Contact actions
  const updateContactInfo = (updatedFields: Partial<TempleContactInfo>) => {
    setContactInfo((prev) => ({ ...prev, ...updatedFields }));
  };

  // Annual Calendar actions
  const updateAnnualCalendar = (updatedFields: Partial<AnnualCalendarData>) => {
    setAnnualCalendar((prev) => ({ ...prev, ...updatedFields }));
  };

  const addVisheshaDivasam = (item: Omit<VisheshaDivasam, 'id'>) => {
    const newItem: VisheshaDivasam = {
      ...item,
      id: `vd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setAnnualCalendar((prev) => ({
      ...prev,
      visheshaDivasangal: [...prev.visheshaDivasangal, newItem],
    }));
  };

  const updateVisheshaDivasam = (id: string, updatedFields: Partial<VisheshaDivasam>) => {
    setAnnualCalendar((prev) => ({
      ...prev,
      visheshaDivasangal: prev.visheshaDivasangal.map((row) =>
        row.id === id ? { ...row, ...updatedFields } : row
      ),
    }));
  };

  const deleteVisheshaDivasam = (id: string) => {
    setAnnualCalendar((prev) => ({
      ...prev,
      visheshaDivasangal: prev.visheshaDivasangal.filter((row) => row.id !== id),
    }));
  };

  const addPradoshamDate = (item: Omit<PradoshamDate, 'id'>) => {
    const newItem: PradoshamDate = {
      ...item,
      id: `pd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setAnnualCalendar((prev) => ({
      ...prev,
      pradosham: [...prev.pradosham, newItem],
    }));
  };

  const updatePradoshamDate = (id: string, updatedFields: Partial<PradoshamDate>) => {
    setAnnualCalendar((prev) => ({
      ...prev,
      pradosham: prev.pradosham.map((row) =>
        row.id === id ? { ...row, ...updatedFields } : row
      ),
    }));
  };

  const deletePradoshamDate = (id: string) => {
    setAnnualCalendar((prev) => ({
      ...prev,
      pradosham: prev.pradosham.filter((row) => row.id !== id),
    }));
  };

  const addSamkramamDate = (item: Omit<SamkramamDate, 'id'>) => {
    const newItem: SamkramamDate = {
      ...item,
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setAnnualCalendar((prev) => ({
      ...prev,
      samkramam: [...prev.samkramam, newItem],
    }));
  };

  const updateSamkramamDate = (id: string, updatedFields: Partial<SamkramamDate>) => {
    setAnnualCalendar((prev) => ({
      ...prev,
      samkramam: prev.samkramam.map((row) =>
        row.id === id ? { ...row, ...updatedFields } : row
      ),
    }));
  };

  const deleteSamkramamDate = (id: string) => {
    setAnnualCalendar((prev) => ({
      ...prev,
      samkramam: prev.samkramam.filter((row) => row.id !== id),
    }));
  };

  const updateUlsavamBox = (ulsavamData: Partial<AnnualCalendarData['ulsavamBox']>) => {
    setAnnualCalendar((prev) => ({
      ...prev,
      ulsavamBox: { ...prev.ulsavamBox, ...ulsavamData },
    }));
  };

  const resetAnnualCalendar = () => {
    setAnnualCalendar(DEFAULT_ANNUAL_CALENDAR);
    try {
      localStorage.setItem('puliyannoor_annual_calendar', JSON.stringify(DEFAULT_ANNUAL_CALENDAR));
    } catch (e) {}
  };

  const updateCountdownConfig = (updatedFields: Partial<FestivalCountdownConfig>) => {
    setCountdownConfig((prev) => ({
      ...prev,
      ...updatedFields,
      eyebrow: {
        ...prev.eyebrow,
        ...(updatedFields.eyebrow || {}),
      },
      title: {
        ...prev.title,
        ...(updatedFields.title || {}),
      },
      subtitle: {
        ...prev.subtitle,
        ...(updatedFields.subtitle || {}),
      },
    }));
  };

  // Chat actions
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'admin',
      text: text.trim(),
      timestamp: timeStr,
      createdAt: Date.now(),
      deliveryStatus: 'sent',
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === conversationId) {
          return {
            ...chat,
            lastMessageTime: timeStr,
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );
  };

  const editChatMessage = (conversationId: string, messageId: string, newText: string) => {
    if (!newText.trim()) return;
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === conversationId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  text: newText.trim(),
                  isEdited: true,
                };
              }
              return msg;
            }),
          };
        }
        return chat;
      })
    );
  };

  const createDevoteeInquiryChat = (
    devoteeName: string,
    phone: string,
    subject: string,
    messageText: string,
    star?: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newChat: ChatConversation = {
      id: `chat_${Date.now()}`,
      devoteeName,
      devoteePhone: phone,
      star,
      subject: subject || 'Devotee Inquiry',
      unread: true,
      status: 'active',
      lastMessageTime: timeStr,
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'devotee',
          text: messageText,
          timestamp: timeStr,
          createdAt: Date.now(),
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);
  };

  const markChatAsRead = (conversationId: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === conversationId ? { ...chat, unread: false } : chat))
    );
  };

  const updateChatStatus = (conversationId: string, status: 'active' | 'resolved' | 'pending') => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === conversationId ? { ...chat, status } : chat))
    );
  };

  const advanceMessageDeliveryStatus = (
    conversationId: string,
    messageId: string
  ): 'sent' | 'delivered' | 'read' => {
    let resultingStatus: 'sent' | 'delivered' | 'read' = 'read';
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === conversationId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) => {
              if (msg.id === messageId) {
                const cur = msg.deliveryStatus || 'sent';
                // Unidirectional flow: sent -> delivered -> read (Locked once read)
                if (cur === 'sent') {
                  resultingStatus = 'delivered';
                } else if (cur === 'delivered') {
                  resultingStatus = 'read';
                } else {
                  resultingStatus = 'read';
                }
                return { ...msg, deliveryStatus: resultingStatus };
              }
              return msg;
            }),
          };
        }
        return chat;
      })
    );
    return resultingStatus;
  };

  const setMessageDeliveryStatus = (
    conversationId: string,
    messageId: string,
    status: 'sent' | 'delivered' | 'read'
  ) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === conversationId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === messageId ? { ...msg, deliveryStatus: status } : msg
            ),
          };
        }
        return chat;
      })
    );
  };

  const resetToDefaults = () => {
    setOfferings(DEFAULT_OFFERINGS);
    setFestivals(DEFAULT_FESTIVALS);
    setContactInfo(DEFAULT_CONTACT_INFO);
    setChats(DEFAULT_CHATS);
    setAnnualCalendar(DEFAULT_ANNUAL_CALENDAR);
    setCountdownConfig(DEFAULT_COUNTDOWN_CONFIG);
    try {
      localStorage.removeItem('puliyannoor_offerings');
      localStorage.removeItem('puliyannoor_festivals');
      localStorage.removeItem('puliyannoor_contact');
      localStorage.removeItem('puliyannoor_chats');
      localStorage.removeItem('puliyannoor_annual_calendar');
      localStorage.removeItem('puliyannoor_festival_countdown');
    } catch (e) {}
  };

  return (
    <ContentContext.Provider
      value={{
        offerings,
        festivals,
        contactInfo,
        chats,
        annualCalendar,
        countdownConfig,
        addOffering,
        updateOffering,
        deleteOffering,
        addFestival,
        updateFestival,
        deleteFestival,
        deleteMultipleFestivals,
        updateContactInfo,
        updateAnnualCalendar,
        updateCountdownConfig,
        addVisheshaDivasam,
        updateVisheshaDivasam,
        deleteVisheshaDivasam,
        addPradoshamDate,
        updatePradoshamDate,
        deletePradoshamDate,
        addSamkramamDate,
        updateSamkramamDate,
        deleteSamkramamDate,
        updateUlsavamBox,
        resetAnnualCalendar,
        sendMessage,
        editChatMessage,
        createDevoteeInquiryChat,
        markChatAsRead,
        updateChatStatus,
        advanceMessageDeliveryStatus,
        setMessageDeliveryStatus,
        resetToDefaults,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
