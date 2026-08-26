import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Sparkles } from 'lucide-react';
import Button from './Button';

export default function StickyMobileCTA({ onOpenJourneyModal }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide sticky CTA on booking or auth pages to prevent duplication
  if (
    location.pathname.startsWith('/booking') ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-brand-black/95 border-t border-white/10 backdrop-blur-xl sm:hidden flex items-center gap-2 shadow-2xl">
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/booking')}
        icon={Calendar}
        className="flex-1 justify-center shadow-glow-red text-xs py-3"
      >
        BOOK NOW
      </Button>

      {onOpenJourneyModal && (
        <button
          onClick={onOpenJourneyModal}
          className="px-3 py-3 rounded-lg bg-carbon-850 border border-white/10 text-brand-red hover:text-white text-xs font-mono flex items-center justify-center"
          title="VIP Pre-Launch Access"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
