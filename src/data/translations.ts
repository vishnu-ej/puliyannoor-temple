export interface TranslationMap {
  [key: string]: {
    en: string;
    ml: string;
  };
}

export const TRANSLATIONS: TranslationMap = {
  // Brand & General
  temple_name: {
    en: 'Puliyannoor Sree Mahadeva Temple',
    ml: 'പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം',
  },
  temple_tagline_short: {
    en: 'Cheruthil Valuthu Puliyannoor',
    ml: 'ചെറുതിൽ വലുത് പുലിയന്നൂർ',
  },
  deity_title: {
    en: 'Lord Mahadeva (Shiva)',
    ml: 'ശ്രീ പരമശിവൻ',
  },
  panchayath_location: {
    en: 'Puliyannoor, Mutholy, Pala, Kottayam',
    ml: 'പുലിയന്നൂർ, മുത്തോലി, പാലാ, കോട്ടയം',
  },

  // Nav Items (Compact and elegant so Malayalam never stretches the header)
  nav_home: { en: 'Home', ml: 'ഹോം' },
  nav_about: { en: 'About', ml: 'ക്ഷേത്രം' },
  nav_timings: { en: 'Darshan Timings', ml: 'ദർശന സമയം' },
  nav_offerings: { en: 'Vazhipadu', ml: 'വഴിപാടുകൾ' },
  nav_events: { en: 'Festivals', ml: 'ഉത്സവങ്ങൾ' },
  nav_visit: { en: 'Plan Visit', ml: 'സന്ദർശനം' },
  nav_contact: { en: 'Contact', ml: 'ബന്ധപ്പെടുക' },
  btn_book_vazhipadu: { en: 'Book Offering', ml: 'വഴിപാട് ബുക്കിംഗ്' },

  // Hero Section
  hero_eyebrow: {
    en: 'Ancient Shiva Kshetram · Kottayam District, Kerala',
    ml: 'നൂറ്റാണ്ടുകളുടെ പവിത്രത · കോട്ടയം ജില്ല, കേരളം',
  },
  hero_title: {
    en: 'Puliyannoor Sree Mahadeva Temple',
    ml: 'പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം',
  },
  hero_subtitle: {
    en: 'Known far and wide as "Cheruthil Valuthu Puliyannoor" — an ancient abode of Lord Shiva in Mutholy, lovingly nurtured by the Namboothiri families of the Puliyannoor Oorayma Temple Devaswom.',
    ml: '“ചെറുതിൽ വലുത് പുലിയന്നൂർ” എന്ന പവിത്ര നാമത്തിൽ അറിയപ്പെടുന്ന മഹാദേവ ക്ഷേത്രം. പുലിയന്നൂർ ഊരായ്മ ക്ഷേത്ര ദേവസ്വത്തിലെ പാരമ്പര്യ നമ്പൂതിരി ഇല്ലങ്ങൾ ഭക്തിപൂർവ്വം കാത്തുസൂക്ഷിക്കുന്ന പുണ്യഭൂമി.',
  },
  btn_get_directions: { en: 'Get Directions', ml: 'റൂട്ട് മാപ്പ്' },
  btn_plan_darshan: { en: 'Darshan Timings', ml: 'ദർശന സമയം' },
  btn_explore_about: { en: 'About Temple & Heritage', ml: 'ചരിത്രവും പൈതൃകവും' },
  lbl_google_rating: { en: '4.7 / 5 (Google Reviews)', ml: '4.7 / 5 (ഗൂഗിൾ റിവ്യൂസ്)' },
  lbl_justdial_rating: { en: '4.7 / 5 (Justdial · 299+ Votes)', ml: '4.7 / 5 (ജസ്റ്റ്ഡയൽ റേറ്റിംഗ്)' },
  om_namah_shivaya: { en: 'Om Namah Shivaya', ml: 'ഓം നമഃ ശിവായ' },

  // Info Strip
  info_deity: { en: 'Pradhana Prathishta', ml: 'പ്രധാന പ്രതിഷ്ഠ' },
  info_deity_val: { en: 'Lord Mahadeva (Shiva)', ml: 'മഹാദേവൻ (ശിവൻ)' },
  info_opening: { en: 'Morning Nirmalyam', ml: 'നടതുറപ്പ് സമയം' },
  info_opening_val: { en: '4:30 AM Daily', ml: 'പുലർച്ചെ 4:30' },
  info_admin: { en: 'Temple Administration', ml: 'ഭരണനിർവഹണം' },
  info_admin_val: { en: 'Puliyannoor Oorayma Devaswom', ml: 'പുലിയന്നൂർ ഊരായ്മ ദേവസ്വം' },
  info_parking: { en: 'Vehicle Parking', ml: 'പാർക്കിംഗ്' },
  info_parking_val: { en: 'Free Space in Front of Temple', ml: 'ക്ഷേത്രമുറ്റത്ത് സൗജന്യം' },

  // About & Heritage Section
  about_eyebrow: { en: 'History & Sacred Lineage', ml: 'ചരിത്രവും പൈതൃകവും' },
  about_title: { en: 'The Legacy of Cheruthil Valuthu Puliyannoor', ml: 'ചെറുതിൽ വലുത് പുലിയന്നൂരിന്റെ മാഹാത്മ്യം' },
  about_lead: {
    en: 'Nestled in the serene hamlet of Puliyannoor in Mutholy panchayath, just minutes from Pala town, this sacred Shiva shrine has radiated spiritual solace for generations.',
    ml: 'പാലായ്ക്ക് സമീപം മുത്തോലി പഞ്ചായത്തിലെ ശാന്തസുന്ദരമായ പുലിയന്നൂർ ഗ്രാമത്തിൽ സ്ഥിതി ചെയ്യുന്ന ഈ ക്ഷേത്രം നൂറ്റാണ്ടുകളായി ഭക്തർക്ക് അഭയവും ശാന്തിയും നൽകുന്നു.',
  },
  about_p1: {
    en: 'The temple earned its timeless popular title, "Cheruthil Valuthu Puliyannoor" (Greatest Among the Small), in recognition of its immense spiritual vibrancy and traditional sanctity despite its intimate village setting. Devotees often describe entering the temple compound as a transformative experience filled with profound positive vibration.',
    ml: 'ക്ഷേത്രത്തിന്റെ നിർമ്മിതി ഗ്രാമീണ തനിമയിലാണെങ്കിലും, ഭഗവാന്റെ ചൈതന്യവും ആചാരശുദ്ധിയും പരിഗണിച്ച് പഴമക്കാർ നൽകിയ നാമമാണ് "ചെറുതിൽ വലുത് പുലിയന്നൂർ". ക്ഷേത്രാങ്കണത്തിൽ പ്രവേശിക്കുമ്പോൾ തന്നെ അനുഭവപ്പെടുന്ന ശാന്തതയും പോസിറ്റീവ് എനർജിയും സന്ദർശകർ എടുത്തുപറയാറുണ്ട്.',
  },
  about_p2: {
    en: 'The rituals, tantric ceremonies, and temple management are faithfully upheld by the Puliyannoor Oorayma Temple Devaswom, managed by traditional Namboothiri Illams (families). This community-trustee governance model preserves centuries-old Vedic chanting, festival traditions, and strict observance of daily pooja schedules.',
    ml: 'പാരമ്പര്യ നമ്പൂതിരി കുടുംബങ്ങൾ ഉൾപ്പെടുന്ന പുലിയന്നൂർ ഊരായ്മ ക്ഷേത്ര ദേവസ്വമാണ് ക്ഷേത്രത്തിന്റെ നിത്യപൂജകളും തന്ത്രവിധികളും ഉത്സവങ്ങളും ഒരു വീഴ്ചയും കൂടാതെ കാത്തുസൂക്ഷിക്കുന്നത്. തലമുറകളായി പകർന്നുപോരുന്ന ഈ ആചാരനിഷ്ഠ ക്ഷേത്രത്തിന്റെ പവിത്രത കാത്തുസൂക്ഷിക്കുന്നു.',
  },
  about_quote: {
    en: '"A peaceful spiritual oasis where the clamor of the world recedes into the sacred resonance of temple bells and Chandanam fragrance."',
    ml: '"ലോകത്തിന്റെ തിരക്കുകളിൽ നിന്ന് ഒഴിഞ്ഞുമാറി മണിനാദത്തിലും ചന്ദനസുഗന്ധത്തിലും മനസ്സ് ഏകാഗ്രമാകുന്ന പുണ്യസങ്കേതം."',
  },
  factsheet_title: { en: 'At a Glance', ml: 'ഒറ്റനോട്ടത്തിൽ' },
  fact_deity: { en: 'Main Deity', ml: 'പ്രധാന ദേവൻ' },
  fact_sub_deities: { en: 'Upadevathas', ml: 'ഉപദേവതകൾ' },
  fact_sub_deities_val: { en: 'Ganapathi, Sastha, Nagaraja, Yakshi', ml: 'ഗണപതി, ശാസ്താവ്, നാഗരാജാവ്, യക്ഷി' },
  fact_administration: { en: 'Management', ml: 'ഭരണസമിതി' },
  fact_panchayath: { en: 'Local Body', ml: 'പഞ്ചായത്ത്' },
  fact_panchayath_val: { en: 'Mutholy Grama Panchayath', ml: 'മുത്തോലി ഗ്രാമപഞ്ചായത്ത്' },
  fact_nearest_town: { en: 'Nearest Town', ml: 'സമീപ പട്ടണം' },
  fact_nearest_town_val: { en: 'Pala (3.2 km)', ml: 'പാലാ (3.2 കി.മീ)' },
  fact_district: { en: 'District & State', ml: 'ജില്ല & സംസ്ഥാനം' },
  fact_district_val: { en: 'Kottayam, Kerala, India', ml: 'കോട്ടയം, കേരളം' },
  fact_pincode: { en: 'Postal Code', ml: 'പിൻകോഡ്' },

  // Timings Section
  timings_eyebrow: { en: 'Sacred Schedule', ml: 'പൂജാ സമയക്രമം' },
  timings_title: { en: 'Daily Darshan & Pooja Hours', ml: 'ദർശനവും നിത്യപൂജാ സമയങ്ങളും' },
  timings_subtitle: {
    en: 'The temple observes the traditional two-session darshan schedule customary to Kerala Shiva temples. The morning opening is at 4:30 AM.',
    ml: 'കേരളത്തിലെ ശിവക്ഷേത്രങ്ങളിലെ പാരമ്പര്യമനുസരിച്ച് ദിവസേന രണ്ടു സമയങ്ങളിലാണ് ദർശനം ക്രമീകരിച്ചിരിക്കുന്നത്.',
  },
  morning_session_title: { en: 'Morning Darshan Session', ml: 'പ്രഭാത ദർശന സമയം' },
  evening_session_title: { en: 'Evening Darshan Session', ml: 'സന്ധ്യാ ദർശന സമയം' },
  session_morning_hours: { en: '4:30 AM – 10:00 AM', ml: 'രാവിലെ 4:30 – 10:00' },
  session_evening_hours: { en: '5:00 PM – 8:00 PM', ml: 'വൈകിട്ട് 5:00 – രാത്രി 8:00' },
  timings_disclaimer: {
    en: 'Note: Pooja timings may slightly vary during special festival days like Maha Shivaratri, Thiruvathira, Pradosham, and Solar/Lunar Eclipse. Please contact the Devaswom office for specific queries.',
    ml: 'ശ്രദ്ധിക്കുക: മഹാശിവരാത്രി, തിരുവാതിര, പ്രദോഷം, ഗ്രഹണം തുടങ്ങിയ വിശേഷ ദിവസങ്ങളിൽ പൂജാസമയങ്ങളിൽ മാറ്റമുണ്ടാകാം. കൂടുതൽ വിവരങ്ങൾക്ക് ദേവസ്വം ഓഫീസുമായി ബന്ധപ്പെടുക.',
  },
  lbl_verified_badge: { en: 'Confirmed Time', ml: 'സ്ഥിരീകരിച്ച സമയം' },

  // Offerings / Vazhipadu Section
  offerings_eyebrow: { en: 'Vazhipadu & Sevas', ml: 'വിശേഷാൽ വഴിപാടുകൾ' },
  offerings_title: { en: 'Sacred Offerings to Lord Mahadeva', ml: 'മഹാദേവന് സമർപ്പിക്കാവുന്ന വഴിപാടുകൾ' },
  offerings_subtitle: {
    en: 'Choose from traditional poojas and homams to invoke the divine grace of Mahadeva for health, prosperity, education, and peace.',
    ml: 'ആയുരാരോഗ്യത്തിനും കുടുംബൈശ്വര്യത്തിനും വിഘ്നനിവാരണത്തിനുമായി ഭഗവാന് സമർപ്പിക്കാവുന്ന വിവിധ പൂജകളും ഹോമങ്ങളും.',
  },
  filter_all: { en: 'All Offerings (88)', ml: 'എല്ലാ വഴിപാടുകളും (88)' },
  filter_pooja_homam: { en: 'Poojas & Homams', ml: 'പൂജകളും ഹോമങ്ങളും' },
  filter_abhishekam_dhara: { en: 'Abhishekam & Dhara', ml: 'അഭിഷേകവും ധാരയും' },
  filter_archana_pushpanjali: { en: 'Archana & Pushpanjali', ml: 'അർച്ചന & പുഷ്പാഞ്ജലി' },
  filter_nivedyam_payasam: { en: 'Nivedyam & Payasam', ml: 'നിവേദ്യവും പായസങ്ങളും' },
  filter_vilakku_mala: { en: 'Vilakku & Mala', ml: 'വിളക്കും മാലയും' },
  filter_special_sevas: { en: 'Special Sevas & Samskaras', ml: 'വിശേഷാൽ ചടങ്ങുകൾ' },
  search_offerings_placeholder: { en: 'Search 88 offerings by name or benefit (e.g. Dhara, Homam, വിവാഹം)...', ml: '88 വഴിപാടുകളിൽ തിരയുക (ഉദാ: ധാര, ഹോമം, പായസം)...' },
  btn_inquire_offering: { en: 'Book / Inquire', ml: 'ബുക്ക് ചെയ്യുക' },
  lbl_rate: { en: 'Offering Amount', ml: 'നിരക്ക്' },
  lbl_benefits: { en: 'Spiritual Benefit', ml: 'ഫലപ്രാപ്തി' },

  // Booking Modal
  modal_title: { en: 'Vazhipadu Booking & Inquiry', ml: 'വഴിപാട് ബുക്കിംഗ് ഫോം' },
  modal_subtitle: {
    en: 'Submit details to book your pooja or generate an official WhatsApp inquiry with the Devaswom office.',
    ml: 'വിവരങ്ങൾ നൽകി വഴിപാട് ബുക്ക് ചെയ്യുക അല്ലെങ്കിൽ ദേവസ്വം ഓഫീസിലേക്ക് നേരിട്ട് സന്ദേശം അയക്കുക.',
  },
  modal_devotee_name: { en: 'Devotee Full Name', ml: 'ഭക്തന്റെ പേര്' },
  modal_devotee_name_placeholder: { en: 'e.g., Ananthanarayanan', ml: 'ഉദാ: അനന്തനാരായണൻ' },
  modal_star: { en: 'Birth Star (Nakshatra)', ml: 'ജന്മ നക്ഷത്രം' },
  modal_select_star: { en: 'Select your birth star', ml: 'നക്ഷത്രം തിരഞ്ഞെടുക്കുക' },
  modal_date: { en: 'Preferred Date of Offering', ml: 'വഴിപാട് നടത്തേണ്ട തീയതി' },
  modal_gotram: { en: 'Gotram / Family Name (Optional)', ml: 'ഗോത്രം / കുടുംബപ്പേര് (ഐച്ഛികം)' },
  modal_phone: { en: 'Contact Phone / WhatsApp Number', ml: 'ഫോൺ / വാട്സാപ്പ് നമ്പർ' },
  modal_phone_placeholder: { en: '+91 XXXXX XXXXX', ml: '+91 XXXXX XXXXX' },
  modal_selected_offering: { en: 'Selected Offering', ml: 'തിരഞ്ഞെടുത്ത വഴിപാട്' },
  modal_special_notes: { en: 'Special Prayer Intentions / Notes', ml: 'പ്രത്യേക പ്രാർത്ഥനാ വിഷയം' },
  modal_btn_whatsapp: { en: 'Send via WhatsApp', ml: 'വാട്സാപ്പ് വഴി അയക്കുക' },
  modal_btn_submit: { en: 'Submit Booking', ml: 'ബുക്കിംഗ് സമർപ്പിക്കുക' },
  modal_close: { en: 'Close', ml: 'അടയ്ക്കുക' },
  modal_success_title: { en: 'Inquiry Prepared Successfully!', ml: 'ബുക്കിംഗ് വിവരം തയ്യാറാക്കി!' },
  modal_success_desc: {
    en: 'Your offering details have been saved. You can directly connect with the temple office to confirm the booking.',
    ml: 'നിങ്ങളുടെ വഴിപാട് വിവരങ്ങൾ രേഖപ്പെടുത്തി. ബുക്കിംഗ് സ്ഥിരീകരിക്കാൻ ദേവസ്വം ഓഫീസുമായി ബന്ധപ്പെടാം.',
  },

  // Events & Festivals
  events_eyebrow: { en: 'Festival Calendar', ml: 'ഉത്സവ കലണ്ടർ' },
  events_title: { en: 'Celebrations & Holy Observances', ml: 'ക്ഷേത്രോത്സവങ്ങളും പുണ്യദിനങ്ങളും' },
  events_subtitle: {
    en: 'Experience the grandeur of traditional Kerala temple festivals, soul-stirring Melam, and sacred Vedic homams celebrated throughout the Malayalam year.',
    ml: 'മേളപ്പെരുക്കവും താന്ത്രിക ചടങ്ങുകളും കൊണ്ട് ഭക്തിസാന്ദ്രമാകുന്ന പുലിയന്നൂരിലെ ഉത്സവദിനങ്ങൾ.',
  },
  countdown_heading: { en: 'Next Major Festival: Maha Shivaratri', ml: 'അടുത്ത പ്രധാന ഉത്സവം: മഹാശിവരാത്രി' },
  countdown_days: { en: 'Days', ml: 'ദിവസങ്ങൾ' },
  countdown_hours: { en: 'Hours', ml: 'മണിക്കൂർ' },
  countdown_minutes: { en: 'Minutes', ml: 'മിനിറ്റ്' },
  countdown_seconds: { en: 'Seconds', ml: 'സെക്കൻഡ്' },

  // Heritage & Architecture
  heritage_eyebrow: { en: 'Sacred Vastu & Architecture', ml: 'ക്ഷേത്ര വാസ്തുശിൽപ കല' },
  heritage_title: { en: 'Traditional Kerala Temple Architecture', ml: 'കേരളീയ വാസ്തുവിദ്യയുടെ പവിത്രത' },
  heritage_subtitle: {
    en: 'Built in accordance with classical Thantra Samuchayam principles, the temple features the sacred concentric enclosures radiating cosmic peace.',
    ml: 'തന്ത്രസമുച്ചയ വിധിപ്രകാരം നിർമ്മിതമായ ക്ഷേത്ര സമുച്ചയം ഭക്തരിൽ ദൈവിക ചൈതന്യം ഉണർത്തുന്നു.',
  },

  // Visit Us / Location Section
  visit_eyebrow: { en: 'Pilgrim Guide', ml: 'യാത്രാ സഹായി' },
  visit_title: { en: 'How to Reach & Visitor Guidelines', ml: 'എത്തിച്ചേരാനുള്ള വഴിയും നിർദ്ദേശങ്ങളും' },
  visit_subtitle: {
    en: 'Conveniently situated in Puliyannoor near Pala on the Main Eastern Corridor of Kottayam district.',
    ml: 'കോട്ടയം ജില്ലയിൽ പാലായ്ക്ക് സമീപം പ്രധാന പാതയോരത്ത് എളുപ്പത്തിൽ എത്തിച്ചേരാവുന്ന സ്ഥലം.',
  },
  lbl_address: { en: 'Temple Address', ml: 'വിലാസം' },
  lbl_landmark: { en: 'Prominent Landmark', ml: 'പ്രധാന അടയാളം' },
  landmark_desc: {
    en: 'Located in Mutholy Panchayath, along the quiet Puliyannoor temple road just off the Pala–Ponkunnam / Kottayam connecting route.',
    ml: 'മുത്തോലി പഞ്ചായത്തിൽ പുലിയന്നൂർ ക്ഷേത്ര റോഡിൽ സ്ഥിതി ചെയ്യുന്നു.',
  },
  distance_pala: { en: 'From Pala Town', ml: 'പാലാ പട്ടണത്തിൽ നിന്ന്' },
  distance_kottayam: { en: 'From Kottayam Rly Station', ml: 'കോട്ടയം റെയിൽവേ സ്റ്റേഷനിൽ നിന്ന്' },
  distance_airport: { en: 'From Cochin Airport (COK)', ml: 'നെടുമ്പാശ്ശേരി വിമാനത്താവളത്തിൽ നിന്ന്' },
  distance_ernakulam: { en: 'From Ernakulam / Kochi', ml: 'എറണാകുളത്ത് നിന്ന്' },
  dress_code_title: { en: 'Traditional Temple Dress Code', ml: 'ക്ഷേത്ര ദർശന വസ്ത്രധാരണം' },
  dress_code_men: {
    en: 'Men: Traditional Mundu (Dhoti) / Kerala Set. Upper body bare or covered with Angavastram.',
    ml: 'പുരുഷന്മാർ: മുണ്ട് / ദോത്തി. മേൽവസ്ത്രം ഒഴിവാക്കുകയോ തോർത്ത് ധരിക്കുകയോ ചെയ്യുക.',
  },
  dress_code_women: {
    en: 'Women: Saree, Kerala Set Mundu, Half-saree (Dhavani), or decent Salwar Kameez.',
    ml: 'സ്ത്രീകൾ: സാരി, സെറ്റ് മുണ്ട്, ദാവണി അല്ലെങ്കിൽ മാന്യമായ ചുരിദാർ.',
  },
  dress_code_note: {
    en: 'Please leave footwear at the dedicated shoe counter outside the Nadapanthal.',
    ml: 'നടപ്പന്തലിന് പുറത്തുള്ള കൗണ്ടറിൽ പാദരക്ഷകൾ സൂക്ഷിക്കുക.',
  },
  btn_open_google_maps: { en: 'Open in Google Maps', ml: 'ഗൂഗിൾ മാപ്പിൽ കാണുക' },
  btn_copy_address: { en: 'Copy Address', ml: 'വിലാസം പകർത്തു' },
  copied_text: { en: 'Copied!', ml: 'പകർത്തി!' },

  // Contact Us Section
  contact_eyebrow: { en: 'Get in Touch', ml: 'ബന്ധപ്പെടുക' },
  contact_title: { en: 'Devaswom Office & Inquiries', ml: 'ദേവസ്വം ഓഫീസും അന്വേഷണങ്ങളും' },
  contact_subtitle: {
    en: 'For advance pooja bookings, festival sponsorships, marriage hall enquiries, or donation receipts, please reach out to the office.',
    ml: 'പൂജകൾ മുൻകൂട്ടി ബുക്ക് ചെയ്യാനും മറ്റ് വിവരങ്ങൾക്കും ദേവസ്വം ഓഫീസുമായി ബന്ധപ്പെടാം.',
  },
  contact_phone_title: { en: 'Office Phone', ml: 'ഓഫീസ് ഫോൺ' },
  contact_phone_desc: { en: 'Direct line for devotees & inquiries', ml: 'ഭക്തർക്ക് വിളിക്കാനുള്ള നമ്പർ' },
  contact_whatsapp_title: { en: 'WhatsApp Support', ml: 'വാട്സാപ്പ് സഹായം' },
  contact_whatsapp_desc: { en: 'Instant pooja & booking assistance', ml: 'തത്സമയ വിവരങ്ങൾക്ക്' },
  contact_hours_title: { en: 'Office Hours', ml: 'ഓഫീസ് സമയം' },
  contact_hours_desc: { en: '5:00 AM – 10:00 AM & 5:00 PM – 8:00 PM', ml: 'രാവിലെ 5:00 – 10:00 & വൈകിട്ട് 5:00 – 8:00' },
  form_name: { en: 'Your Name', ml: 'താങ്കളുടെ പേര്' },
  form_email: { en: 'Email Address (Optional)', ml: 'ഇമെയിൽ (ഐച്ഛികം)' },
  form_phone: { en: 'Phone Number', ml: 'ഫോൺ നമ്പർ' },
  form_subject: { en: 'Subject / Nature of Inquiry', ml: 'വിഷയം' },
  form_message: { en: 'Message', ml: 'സന്ദേശം' },
  form_btn_send: { en: 'Send Message to Devaswom', ml: 'സന്ദേശം അയക്കുക' },
  form_success: { en: 'Message dispatched successfully! We will connect with you soon.', ml: 'സന്ദേശം വിജയകരമായി അയച്ചു!' },

  // Audio / Chants
  audio_title: { en: 'Sacred Ambience', ml: 'മന്ത്രധ്വനി' },
  audio_play: { en: 'Play Temple Bells & Chant', ml: 'മന്ത്രധ്വനി കേൾക്കുക' },
  audio_pause: { en: 'Mute Temple Audio', ml: 'ശബ്ദം നിർത്തുക' },

  // Footer
  footer_desc: {
    en: 'Puliyannoor Sree Mahadeva Temple (Cheruthil Valuthu Puliyannoor) is an ancient Hindu Shiva shrine in Mutholy Panchayath near Pala, Kottayam District, Kerala, lovingly administered across generations by the Puliyannoor Oorayma Temple Devaswom.',
    ml: 'കോട്ടയം ജില്ലയിലെ പാലായ്ക്ക് സമീപം മുത്തോലി പഞ്ചായത്തിൽ സ്ഥിതി ചെയ്യുന്ന പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം (ചെറുതിൽ വലുത് പുലിയന്നൂർ). പുലിയന്നൂർ ഊരായ്മ ക്ഷേത്ര ദേവസ്വം പവിത്രമായി പരിപാലിക്കുന്നു.',
  },
  footer_quick_links: { en: 'Quick Links', ml: 'പ്രധാന ലിങ്കുകൾ' },
  footer_temple_info: { en: 'Key Information', ml: 'പ്രധാന വിവരങ്ങൾ' },
  footer_location_title: { en: 'Sacred Location', ml: 'ക്ഷേത്ര സങ്കേതം' },
  footer_disclaimer: {
    en: 'All timings and offerings are compiled based on traditional temple customs. Ritual timings may vary on festival dates.',
    ml: 'ക്ഷേത്രാചാരങ്ങൾക്കനുസരിച്ച് വിവരങ്ങൾ നൽകിയിരിക്കുന്നു. വിശേഷ ദിവസങ്ങളിൽ സമയക്രമത്തിൽ മാറ്റമുണ്ടാകാം.',
  },
  footer_rights: { en: 'All Rights Reserved · Puliyannoor Oorayma Temple Devaswom', ml: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം · പുലിയന്നൂർ ഊരായ്മ ക്ഷേത്ര ദേവസ്വം' },
};
