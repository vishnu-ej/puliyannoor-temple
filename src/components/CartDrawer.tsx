'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  Calendar,
  User,
  Star,
  Home,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { language, t } = useLanguage();

  if (items.length === 0 && !isCartOpen) return null;

  const handleWhatsAppCartSend = () => {
    if (items.length === 0) return;

    let itemsListText = '';
    items.forEach((item, idx) => {
      const isKoottu = item.offering.id === 'koottu_namaskaram';
      itemsListText += `\n*${idx + 1}. #${item.offering.slNo} ${item.offering.name.en} / ${item.offering.name.ml}* (Qty: ${item.quantity} × ₹${item.offering.price.toLocaleString('en-IN')})
   - *Date:* ${item.date}`;

      if (isKoottu) {
        itemsListText += `\n   - *Family Name (കുടുംബപ്പേര്):* ${item.familyName || 'N/A'}
   - *Place (സ്ഥലം):* ${item.place || 'N/A'}`;
      } else {
        itemsListText += `\n   - *Devotee Name:* ${item.devoteeName || 'Devotee'}
   - *Birth Star (നക്ഷത്രം):* ${item.starNameEn ? `${item.starNameEn} (${item.starNameMl})` : 'Not Specified'}`;
      }

      if (item.notes) {
        itemsListText += `\n   - *Special Notes:* ${item.notes}`;
      }
      itemsListText += '\n';
    });

    const message = `*Puliyannoor Sree Mahadeva Temple - Vazhipadu Inquiry (Cart)*
--------------------------------------------
*Total Offerings:* ${totalCount} items
*Total Estimated Amount:* ₹${totalAmount.toLocaleString('en-IN')}
--------------------------------------------${itemsListText}--------------------------------------------
_Sent via Puliyannoor Temple Official Web Portal_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919447000000?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Cart Button (Corner Pill) */}
      {items.length > 0 && !isCartOpen && (
        <div className="fixed bottom-5 right-5 z-40 animate-bounce">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#610C1B] via-[#8B1428] to-[#610C1B] text-[#FAF5E8] shadow-2xl border-2 border-[#C99738] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-[#E6BE65]" />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#C99738] text-[#1A0409] font-bold text-[10px] flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold font-cinzel text-[#FAF5E8]">
                {language === 'en' ? 'Vazhipadu Cart' : 'വഴിപാട് കാർട്ട്'}
              </span>
              <span className="text-[11px] font-semibold text-[#E6BE65]">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Drawer Backdrop */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A0409]/70 backdrop-blur-sm animate-fadeIn flex justify-end">
          <div className="w-full max-w-md bg-[#FAF5E8] h-full shadow-2xl flex flex-col justify-between border-l border-[#E4D5AE] animate-slideLeft">
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-[#610C1B] via-[#38050E] to-[#610C1B] text-[#FAF5E8] p-4 sm:p-5 flex items-center justify-between border-b border-[#C99738]/40 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C99738]/20 border border-[#E6BE65]/40 flex items-center justify-center text-[#E6BE65]">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#FAF5E8]">
                    {language === 'en' ? 'Vazhipadu Cart' : 'വഴിപാട് കാർട്ട്'}
                  </h3>
                  <span className="text-xs text-[#E6BE65] font-medium">
                    {totalCount} {language === 'en' ? 'items selected' : 'വഴിപാടുകൾ'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full text-[#FAF5E8]/80 hover:text-[#FAF5E8] hover:bg-[#FAF5E8]/10 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-[#C99738]/40 mx-auto" />
                  <p className="text-sm text-[#5A382A] font-medium">
                    {language === 'en' ? 'Your cart is empty' : 'കാർട്ടിൽ വഴിപാടുകൾ ഇല്ല'}
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-bold text-[#610C1B] underline cursor-pointer"
                  >
                    {language === 'en' ? 'Browse Offerings' : 'വഴിപാടുകൾ തിരഞ്ഞെടുക്കുക'}
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const isKoottu = item.offering.id === 'koottu_namaskaram';
                  return (
                    <div
                      key={item.cartId}
                      className="glass-card rounded-2xl p-3.5 border border-[#E4D5AE] shadow-sm flex flex-col justify-between gap-2.5"
                    >
                      {/* Item Title & Price */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-[#FAF5E8] bg-[#38050E] px-1.5 py-0.5 rounded-full">
                              #{item.offering.slNo}
                            </span>
                            <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#38050E]">
                              {item.offering.name[language]}
                            </h4>
                          </div>
                          <span className="text-[11px] font-malayalam-sans text-[#8C6219] block">
                            {item.offering.name[language === 'en' ? 'ml' : 'en']}
                          </span>
                        </div>

                        <span className="font-cinzel font-extrabold text-sm text-[#610C1B]">
                          ₹{(item.offering.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Devotee Info Card */}
                      <div className="bg-[#F3EBD7]/80 rounded-xl p-2 text-[11px] text-[#5A382A] space-y-1 border border-[#E4D5AE]/60">
                        {isKoottu ? (
                          <>
                            <div className="flex items-center gap-1">
                              <Home className="w-3 h-3 text-[#8C6219]" />
                              <span>{language === 'en' ? 'Family:' : 'കുടുംബം:'} <strong>{item.familyName || 'N/A'}</strong></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#8C6219]" />
                              <span>{language === 'en' ? 'Place:' : 'സ്ഥലം:'} <strong>{item.place || 'N/A'}</strong></span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-[#8C6219]" />
                              <span>{language === 'en' ? 'Devotee:' : 'ഭക്തൻ:'} <strong>{item.devoteeName || 'Devotee'}</strong></span>
                            </div>
                            {item.starNameEn && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-[#8C6219]" />
                                <span>{language === 'en' ? 'Star:' : 'നക്ഷത്രം:'} {item.starNameEn} ({item.starNameMl})</span>
                              </div>
                            )}
                          </>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8C6219]" />
                          <span>{language === 'en' ? 'Date:' : 'തീയതി:'} {item.date}</span>
                        </div>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#E4D5AE]/60">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#E4D5AE] px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartId, -1)}
                            className="p-1 text-[#8C6219] hover:text-[#610C1B] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#2B150F] min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartId, 1)}
                            className="p-1 text-[#8C6219] hover:text-[#610C1B] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-xs text-[#610C1B] hover:text-[#8B1428] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Remove' : 'ഒഴിവാക്കുക'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer & Checkout / WhatsApp Actions */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-[#E4D5AE] shadow-lg space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6219] font-cinzel">
                    {language === 'en' ? 'Total Amount:' : 'ആകെ തുക:'}
                  </span>
                  <span className="font-cinzel font-extrabold text-xl text-[#610C1B]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleWhatsAppCartSend}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'en' ? 'Inquire via WhatsApp' : 'വാട്സാപ്പ് വഴി അന്വേഷിക്കുക'}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={clearCart}
                      className="text-[#8C6219] hover:text-[#610C1B] underline cursor-pointer"
                    >
                      {language === 'en' ? 'Clear All' : 'എല്ലാം ഒഴിവാക്കുക'}
                    </button>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-[#2B150F] hover:text-[#610C1B] font-semibold cursor-pointer"
                    >
                      {language === 'en' ? '+ Add More Offerings' : '+ കൂടുതൽ വഴിപാടുകൾ ചേർക്കുക'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
