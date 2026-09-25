import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'drawer' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running inside standalone app, do not show install CTA
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 3000);
      }
    } else {
      setShowGuide(true);
    }
  };

  // Nav Variant (compact desktop button or pill)
  if (variant === 'nav') {
    return (
      <>
        <button
          onClick={handleClick}
          title="Install AMAAS as Desktop / Mobile App"
          aria-label="Install AMAAS App"
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 hover:border-[#38bdf8]/50 shadow-[0_0_12px_rgba(56,189,248,0.15)] ${className}`}
        >
          {justInstalled ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Installed</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </>
          )}
        </button>

        {showGuide && (
          <InstallGuideModal isIOS={isIOS} onClose={() => setShowGuide(false)} />
        )}
      </>
    );
  }

  // Drawer / Mobile Menu Variant (full-width button)
  if (variant === 'drawer') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] font-medium text-sm transition-all duration-200 hover:bg-[#38bdf8]/20 cursor-pointer ${className}`}
        >
          <div className="flex items-center space-x-2.5">
            <Download className="w-4 h-4 text-[#38bdf8]" />
            <span>Install AMAAS App</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#38bdf8]/20 text-[#7dd3fc]">
            PWA
          </span>
        </button>

        {showGuide && (
          <InstallGuideModal isIOS={isIOS} onClose={() => setShowGuide(false)} />
        )}
      </>
    );
  }

  return null;
};

// Help guide modal for iOS or when browser prompt isn't directly triggered
const InstallGuideModal: React.FC<{ isIOS: boolean; onClose: () => void }> = ({
  isIOS,
  onClose,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#081325] border border-white/[0.12] p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#bdc8d1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Install AMAAS</h3>
            <p className="text-xs text-[#bdc8d1]/75">Launch as a standalone application</p>
          </div>
        </div>

        {isIOS ? (
          <div className="space-y-3 text-sm text-[#bdc8d1]">
            <p>To install AMAAS on your iPhone or iPad:</p>
            <ol className="list-decimal list-inside space-y-2 pl-1 text-xs sm:text-sm text-[#dce3f0]">
              <li>
                Tap the <strong className="text-white">Share</strong> icon (square with arrow pointing up) in the Safari toolbar.
              </li>
              <li>
                Scroll down and tap <strong className="text-[#38bdf8]">Add to Home Screen</strong>.
              </li>
              <li>
                Tap <strong className="text-white">Add</strong> in the top-right corner to complete.
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-[#bdc8d1]">
            <p>To install AMAAS on Google Chrome or Edge:</p>
            <ol className="list-decimal list-inside space-y-2 pl-1 text-xs sm:text-sm text-[#dce3f0]">
              <li>
                Look for the <strong className="text-[#38bdf8]">Install</strong> icon in your browser address bar (top right).
              </li>
              <li>
                Or open browser menu (three dots <strong className="text-white">⋮</strong>) &rarr; select <strong className="text-white">Save and share</strong> &rarr; <strong className="text-[#38bdf8]">Install AMAAS</strong>.
              </li>
              <li>
                The app will launch in its own standalone desktop window.
              </li>
            </ol>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
