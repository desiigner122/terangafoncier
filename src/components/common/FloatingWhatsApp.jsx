import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Floating WhatsApp button (left side)
 * Props:
 *  - phone (string): WhatsApp phone in international format without '+' (e.g. '221775934241')
 *  - text (string): optional prefilled message
 */
const FloatingWhatsApp = ({
  phone = '221775934241',
  text = "Bonjour, je suis intéressé par Teranga Foncier."
}) => {
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed left-4 bottom-20 z-50 group"
    >
      <div className="flex items-center gap-3 flex-row-reverse">
        {/* Badge text (shown on hover on desktop) */}
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-green-700 text-sm font-medium px-3 py-2 rounded-md shadow-lg border border-green-100">
          Écrivez-nous sur WhatsApp
        </div>

        {/* Round button */}
        <div
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl flex items-center justify-center border-2 border-white"
          title="WhatsApp"
        >
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
        </div>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
