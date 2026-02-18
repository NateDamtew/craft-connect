import { useState } from 'react';
import { ArrowRight, Download, Share, Plus, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const { isInstallable, isIOS, promptInstall } = usePWAInstall();
  const [showIOSTip, setShowIOSTip] = useState(false);

  const handleInstall = () => {
    if (isIOS) {
      setShowIOSTip(true);
    } else {
      promptInstall();
    }
  };

  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden bg-craft-black animate-fade-in">

      {/* iOS install tooltip */}
      {showIOSTip && (
        <div className="absolute top-16 right-4 z-50 w-64 bg-craft-surface2 border border-craft-border rounded-2xl p-4 shadow-modal animate-slide-down">
          <button
            onClick={() => setShowIOSTip(false)}
            className="absolute top-3 right-3 text-craft-gray-400 hover:text-craft-white transition-colors"
          >
            <X size={14} />
          </button>
          <p className="text-xs font-semibold text-craft-white mb-3 pr-4">Add to Home Screen</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-craft-orange-muted border border-craft-orange/20 flex items-center justify-center shrink-0">
                <Share size={12} className="text-craft-orange" />
              </div>
              <p className="text-xs text-craft-gray-200">Tap the Share button in Safari</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-craft-orange-muted border border-craft-orange/20 flex items-center justify-center shrink-0">
                <Plus size={12} className="text-craft-orange" />
              </div>
              <p className="text-xs text-craft-gray-200">Tap "Add to Home Screen"</p>
            </div>
          </div>
          <p className="text-xs text-craft-gray-400 mt-3">No App Store required — works instantly.</p>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 safe-top pt-4">
        <div className="flex flex-col items-start leading-none">
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold tracking-tight text-craft-white">CRAFT</span>
            <span className="text-craft-orange text-lg font-bold">✦</span>
          </div>
          <span className="text-[9px] font-semibold tracking-[0.2em] text-craft-gray-400 uppercase -mt-0.5">CONNECT</span>
        </div>

        {isInstallable && (
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-craft-surface border border-craft-border text-xs font-semibold text-craft-gray-200 hover:border-craft-orange hover:text-craft-orange transition-all duration-200"
          >
            <Download size={12} />
            Add to Home Screen
          </button>
        )}
      </div>

      {/* Full-screen hero — SVG behind, text overlaid at bottom */}
      <div className="relative flex-1">
        {/* SVG fills the whole area */}
        <svg
          viewBox="0 0 390 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="390" height="520" fill="#0D0D0D" />

          <rect x="20" y="20" width="155" height="155" rx="16" fill="#1A1A1A" />
          <path d="M20 175 Q20 20 175 20 L175 175 Z" fill="#F26419" opacity="0.85" />

          <rect x="215" y="20" width="155" height="155" rx="16" fill="#161616" />
          <path d="M215 175 L370 175 Q370 20 215 20 Z" fill="#C94F0F" opacity="0.7" />

          <rect x="20" y="195" width="155" height="155" rx="16" fill="#1E1E1E" />
          <path d="M175 195 Q175 350 20 350 L20 195 Z" fill="#FF7A33" opacity="0.6" />

          <rect x="215" y="195" width="155" height="155" rx="16" fill="#161616" />
          <path d="M215 195 L370 195 L370 350 Q215 350 215 195 Z" fill="#F26419" opacity="0.5" />

          <rect x="117" y="370" width="156" height="130" rx="16" fill="#1A1A1A" />
          <path d="M117 370 Q117 500 195 500 Q273 500 273 370 Z" fill="#C94F0F" opacity="0.65" />

          <circle cx="195" cy="185" r="5" fill="#FF7A33" opacity="0.4" />
          <circle cx="20" cy="185" r="3" fill="#F26419" opacity="0.3" />
          <circle cx="370" cy="185" r="3" fill="#F26419" opacity="0.3" />
        </svg>

        {/* Gradient scrim so text is always readable */}
        <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-b from-transparent via-craft-black/80 to-craft-black" />

        {/* Text + CTA pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 safe-bottom">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-craft-white leading-[1.1] tracking-tight mb-4">
              Your creative<br />
              passport.<br />
              <span className="text-gradient-orange">Activated.</span>
            </h1>
            <p className="text-craft-gray-400 text-sm leading-relaxed max-w-xs">
              Connect with Africa's most ambitious creators and leave CRAFT Addis with real partnerships.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onNext}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-craft-orange hover:bg-craft-orange-light active:bg-craft-orange-dark transition-colors duration-200 group"
            >
              <span className="text-base font-bold text-white tracking-tight">Get Started</span>
              <ArrowRight size={20} className="text-white group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>

            {isInstallable && (
              <p className="text-center text-xs text-craft-gray-400">
                No App Store or Play Store needed — save it right from your browser.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
