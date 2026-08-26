import { FestivalEvent } from '../types';

export const FESTIVALS: FestivalEvent[] = [
  {
    id: 'annual_utsavam_2027',
    title: {
      en: '2027 Annual Temple Festival (തിരുവുത്സവം)',
      ml: '2027 വാർഷിക തിരുവുത്സവം',
    },
    subtitle: {
      en: 'Feb 28, 2027 (Sunday) – Mar 07, 2027 (Sunday)',
      ml: '2027 ഫെബ്രുവരി 28 ഞായർ – മാർച്ച് 07 ഞായർ',
    },
    malayalamMonth: {
      en: '1202 Kumbham 16 – Kumbham 23',
      ml: '1202 കുംഭം 16 – കുംഭം 23',
    },
    description: {
      en: 'The 8-day grand annual festival of Puliyannoor Sree Mahadeva Temple celebrated with divine grandeur, Kodiyettu by the Oorayma Thanthri, Panchavadyam, Chenda Melam, Pallivetta, and sacred Aarattu procession.',
      ml: 'പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രത്തിലെ 8 ദിവസം നീണ്ടുനിൽക്കുന്ന വാർഷിക തിരുവുത്സവം. തന്ത്രിമുഖ്യന്റെ കാർമ്മികത്വത്തിൽ കൊടിയേറ്റോടെ ആരംഭിച്ച് പഞ്ചവാദ്യം, ചെണ്ടമേളം, പള്ളിവേട്ട, ആറാട്ട് എന്നിവയോടെ ഭക്തിസാന്ദ്രമായി ആഘോഷിക്കുന്നു.',
    },
    highlights: {
      en: [
        'Feb 28, 2027 (Kumbham 16, Sun): Sacred Flag Hoisting (Kodiyettu)',
        'Daily Utsava Poojas, Sreebhoothabali & Melam by renowned maestros',
        'Mar 06, 2027 (Kumbham 22, Sat): Royal Pallivetta & Utsavabali',
        'Mar 07, 2027 (Kumbham 23, Sun): Holy Aarattu Bath & Kodi-irakku',
      ],
      ml: [
        '2027 ഫെബ്രുവരി 28 (കുംഭം 16, ഞായർ): തന്ത്രിമുഖ്യ കാർമ്മികത്വത്തിൽ കൊടിയേറ്റ്',
        'ദിവസേനയുള്ള ഉത്സവ പൂജകൾ, ശ്രീഭൂതബലി, പഞ്ചവാദ്യം, പാണ്ടിമേളം',
        '2027 മാർച്ച് 06 (കുംഭം 22, ശനി): ഭക്തിസാന്ദ്രമായ പള്ളിവേട്ടയും ഉത്സവബലിയും',
        '2027 മാർച്ച് 07 (കുംഭം 23, ഞായർ): മഹാ ആറാട്ട് മഹോത്സവം, കൊടിയിറക്ക്',
      ],
    },
    iconName: 'Crown',
    isMajor: true,
    upcomingDateStr: '2027-02-28T04:00:00+05:30',
  },
  {
    id: 'maha_shivaratri',
    title: {
      en: 'Maha Shivaratri',
      ml: 'മഹാശിവരാത്രി',
    },
    subtitle: {
      en: 'The Great Auspicious Night of Lord Shiva',
      ml: 'പരമശിവന്റെ പവിത്രമായ മഹാരാത്രി',
    },
    malayalamMonth: {
      en: 'Kumbham (Feb – Mar)',
      ml: 'കുംഭം (ഫെബ്രുവരി – മാർച്ച്)',
    },
    description: {
      en: 'The foremost festival celebrated with night-long vigil (Vrata), continuous Abhishekam on the Shivalinga, Rudra Japa recitation, devotional cultural programs, and special Deeparadhana at midnight.',
      ml: 'ക്ഷേത്രത്തിലെ പ്രധാന ആഘോഷം. രാത്രി മുഴുവൻ നീളുന്ന ശിവരാത്രി വ്രതം, യാമപൂജകൾ, നിരന്തര അഭിഷേകങ്ങൾ, ലക്ഷാർച്ചന, അർദ്ധരാത്രി ദീപാരാധന എന്നിവയോടെ ഭക്തിസാന്ദ്രമായി ആചരിക്കുന്നു.',
    },
    highlights: {
      en: [
        'Night-long Yaama Poojas & Dhara every 3 hours',
        'Special Maha Abhishekam with 108 herbs & holy liquids',
        'Grand midnight Deeparadhana with temple bells',
        'Prasada distribution for all fasting devotees',
      ],
      ml: [
        'രാത്രി മുഴുവൻ ഓരോ 3 മണിക്കൂറിലും വിശേഷാൽ യാമപൂജകളും ധാരയും',
        '108 ദ്രവ്യങ്ങൾ കൊണ്ടുള്ള മഹാഭിഷേകം',
        'മഹാ അർദ്ധരാത്രി ദീപാരാധന',
        'വ്രതാനുഷ്ഠാനത്തിൽ പങ്കെടുക്കുന്ന ഭക്തർക്ക് വിശേഷാൽ പ്രസാദ വിതരണം',
      ],
    },
    iconName: 'Flame',
    isMajor: true,
  },
  {
    id: 'thiruvathira',
    title: {
      en: 'Thiruvathira (Ardra Darshanam)',
      ml: 'തിരുവാതിര മഹോത്സവം',
    },
    subtitle: {
      en: 'Birthday of Lord Shiva & Celebrations for Parvathi',
      ml: 'ശിവഭഗവാന്റെ തിരുനക്ഷത്ര ആഘോഷം',
    },
    malayalamMonth: {
      en: 'Dhanu (Dec – Jan)',
      ml: 'ധനു (ഡിസംബർ – ജനുവരി)',
    },
    description: {
      en: 'Observed during the auspicious Thiruvathira star in the cold month of Dhanu. Women observe fasting for marital happiness and longevity of husbands, singing traditional hymns and dancing Thiruvathirakali.',
      ml: 'ധനുമാസത്തിലെ തിരുവാതിര നാളിൽ നാടൊട്ടുക്കുള്ള ഭക്തർ ആഘോഷിക്കുന്നു. മംഗല്യസൗഭാഗ്യത്തിനും ദീർഘമാംഗല്യത്തിനുമായി സ്ത്രീകൾ വ്രതമെടുത്ത് തിരുവാതിരക്കളിയും പ്രത്യേക പൂജകളും നടത്തുന്നു.',
    },
    highlights: {
      en: [
        'Dawn Thiruvathira darshan & special Bilwa Archana',
        'Traditional Thiruvathirapuzhukku nivedyam',
        'Devotional dance & group chanting in temple ground',
      ],
      ml: [
        'പ്രഭാത തിരുവാതിര ദർശനവും കൂവളാർച്ചനയും',
        'വിശേഷാൽ തിരുവാതിരപ്പുഴുക്ക് നിവേദ്യം',
        'ക്ഷേത്രാങ്കണത്തിൽ തിരുവാതിരക്കളി അവതരണം',
      ],
    },
    iconName: 'Sparkles',
    isMajor: true,
  },
  {
    id: 'pradosham',
    title: {
      en: 'Pradosha Pooja (Bi-Monthly)',
      ml: 'പ്രദോഷ പൂജയും ദീപാരാധനയും',
    },
    subtitle: {
      en: 'Auspicious Twilight Worship for Shiva & Nandi',
      ml: 'മാസത്തിൽ രണ്ടുതവണയുള്ള സന്ധ്യാ പ്രദോഷ പൂജ',
    },
    malayalamMonth: {
      en: 'Occurs 2x Every Month (Trayodashi)',
      ml: 'എല്ലാ മാസവും രണ്ട് തവണ (ത്രയോദശി നാളുകളിൽ)',
    },
    description: {
      en: 'The most sacred evening twilight time when Lord Shiva performs the cosmic Ananda Tandava on Mount Kailash. Worshipping during Pradosham washes away severe karmic burdens and brings peace.',
      ml: 'ത്രയോദശി തിഥിയിലെ സന്ധ്യാസമയത്ത് ഭഗവാൻ ആനന്ദനടനം ആടുന്ന സമയം. സർവ്വ പാപങ്ങളിൽ നിന്നും മോചനം നേടാനും ദാരിദ്ര്യശമനത്തിനും പ്രദോഷ വ്രതം ഉത്തമം.',
    },
    highlights: {
      en: [
        'Evening Abhishekam to Shivalinga and Sri Nandi Deva',
        'Special Bilwa archana & deepam lighting throughout Chuttambalam',
        'Rudra Trisati chanting and slow pradakshina circumambulation',
      ],
      ml: [
        'ശിവലിംഗത്തിനും നന്ദികേശനും സന്ധ്യാ അഭിഷേകം',
        'ചുറ്റുവിളക്കുകൾ തെളിയിക്കലും കൂവളാർച്ചനയും',
        'രുദ്ര ത്രിശതി ജപവും പ്രത്യേക പ്രദക്ഷിണങ്ങളും',
      ],
    },
    iconName: 'Moon',
    isMajor: false,
  },
  {
    id: 'mandala_kalam',
    title: {
      en: 'Mandala Pooja & Vrischika Masam',
      ml: 'മണ്ഡലകാല പൂജകൾ (വൃശ്ചിക മാസം)',
    },
    subtitle: {
      en: '41-Day Sacred Pilgrimage Season',
      ml: '41 ദിവസത്തെ മണ്ഡലകാല മഹോത്സവം',
    },
    malayalamMonth: {
      en: 'Vrischikam – Dhanu (Nov – Dec)',
      ml: 'വൃശ്ചികം – ധനു (നവംബർ – ഡിസംബർ)',
    },
    description: {
      en: 'The holy 41-day Mandala season observed with continuous special poojas, Namasankeerthanam, and evening deeparadhana hosting numerous Ayyappa devotees visiting on their pilgrimage route.',
      ml: '41 ദിവസം നീണ്ടുനിൽക്കുന്ന മണ്ഡലകാലത്ത് വിശേഷാൽ നെയ്‌വിളക്ക്, നാമസങ്കീർത്തനം, തീർത്ഥാടകർക്ക് വിശ്രമ സൗകര്യങ്ങൾ എന്നിവ ഒരുക്കുന്നു.',
    },
    highlights: {
      en: [
        'Daily evening Deeparadhana with special oil lamps',
        'Facilities and warm hospitality for visiting pilgrims',
        'Special Sarpa & Ganapathi poojas during Vrischikam',
      ],
      ml: [
        'ദിവസേനയുള്ള സന്ധ്യാ ദീപാലങ്കാരം',
        'ശബരിമല തീർത്ഥാടകർക്കുള്ള ദർശന സൗകര്യങ്ങൾ',
        'വിശേഷാൽ ഗണപതി ഹോമങ്ങളും പുഷ്പാഭിഷേകവും',
      ],
    },
    iconName: 'Sun',
    isMajor: false,
  },
  {
    id: 'vishu_sankranti',
    title: {
      en: 'Vishu Kani & Sankranti Darshan',
      ml: 'വിഷുക്കണി ദർശനവും സംക്രാന്തിയും',
    },
    subtitle: {
      en: 'Malayalam New Year & 1st of Every Month',
      ml: 'മലയാള പുതുവർഷ ദർശനവും മാസപ്പിറവി പൂജകളും',
    },
    malayalamMonth: {
      en: 'Medam 1st & Every Sankranti',
      ml: 'മേടം 1 & എല്ലാ മാസപ്പിറവിയിലും',
    },
    description: {
      en: 'Devotees gather at early dawn (4:00 AM) on Vishu morning to view the auspicious Vishu Kani arranged before Mahadeva with golden Kani Konna flowers, fruits, and brass lamps, followed by Vishu Kaineettam.',
      ml: 'മേടമാസം ഒന്നാം തീയതി പുലർച്ചെ ഭഗവാന് മുന്നിൽ കണിക്കൊന്നയും നെല്ലും ഫലങ്ങളും ഒരുക്കിയുള്ള വിഷുക്കണി ദർശനം. എല്ലാ മാസപ്പിറവിയിലും പ്രത്യേക പൂജകൾ.',
    },
    highlights: {
      en: [
        'Traditional Vishu Kani viewing at early dawn',
        'Special Prasada distribution and Kaineettam',
        'First-of-the-month (Sankranti) special abhishekams',
      ],
      ml: [
        'പുലർച്ചെയുള്ള വിഷുക്കണി ദർശനം',
        'വിശേഷാൽ പ്രസാദ വിതരണം',
        'മാസപ്പിറവി പ്രത്യേക പൂജകളും അഭിഷേകവും',
      ],
    },
    iconName: 'Sparkles',
    isMajor: false,
  },
];
