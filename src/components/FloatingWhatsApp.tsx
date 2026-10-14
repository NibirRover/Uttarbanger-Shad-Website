import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  onClick: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-18 right-4 z-40 max-w-md mx-auto pointer-events-none w-full flex justify-end pr-2">
      <button
        onClick={onClick}
        className="pointer-events-auto flex items-center gap-2 bg-[#055C37] hover:bg-[#044c2d] text-white px-4 py-2.5 rounded-full shadow-lg shadow-emerald-900/25 transition-all hover:scale-105 active:scale-95 text-xs font-semibold tracking-wide border border-emerald-500/30"
        aria-label="Direct WhatsApp Help"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>Direct Help</span>
      </button>
    </div>
  );
};
