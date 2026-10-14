import React from 'react';
import { X } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-black/40 rounded-3xl overflow-hidden flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
          aria-label="Close image preview"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full max-h-[80vh] object-contain rounded-2xl"
        />

        <div className="w-full p-4 text-center text-white/90 font-medium text-sm">
          {title}
        </div>
      </div>
    </div>
  );
};
