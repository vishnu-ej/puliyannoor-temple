import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';

export const viewport: Viewport = {
  themeColor: '#1A0409',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: 'Puliyannoor Sree Mahadeva Temple | പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം',
  description:
    'Official website of Puliyannoor Sree Mahadeva Temple (Cheruthil Valuthu Puliyannoor) in Mutholy, Pala, Kottayam, Kerala. Check live darshan pooja timings, book vazhipadu offerings, and explore festival schedules.',
  keywords: [
    'Puliyannoor Sree Mahadeva Temple',
    'Puliyannoor Temple Pala',
    'Cheruthil Valuthu Puliyannoor',
    'പുലിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം',
    'Mutholy Shiva Temple',
    'Kottayam Shiva Temples',
    'Puliyannoor Ooranma Devaswom',
    'Pooja Timings',
    'Vazhipadu Booking',
    'Maha Shivaratri',
  ],
  authors: [{ name: 'Puliyannoor Ooranma Temple Devaswom' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Puliyannoor Sree Mahadeva Temple · Cheruthil Valuthu Puliyannoor',
    description:
      'Ancient Shiva shrine in Mutholy near Pala, Kottayam, Kerala. Administered by the Puliyannoor Ooranma Temple Devaswom.',
    type: 'website',
    locale: 'en_IN',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" id="htmlRoot" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[#FAF5E8] text-[#2B150F] selection:bg-[#C99738]/30 selection:text-[#610C1B]">
        <LanguageProvider>
          <CartProvider>
            {/* Fixed Top Header */}
            <Header />

            {/* Page Content Container */}
            <div className="flex-1 w-full pt-[90px] sm:pt-[100px] md:pt-[104px] flex flex-col">
              {children}
            </div>

            {/* Floating Cart Drawer & Action Bar */}
            <CartDrawer />

            {/* Persistent Footer */}
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
