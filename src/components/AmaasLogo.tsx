import React from 'react';
import logoImage from '../assets/images/weblogo_amaas.png';

interface AmaasLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const AmaasLogo: React.FC<AmaasLogoProps> = ({
  size = 'md',
  className = '',
  onClick,
}) => {
  // Height scalers preserving original aspect ratio
  const logoDimensions = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Exact AMAAS logo asset provided by the user */}
      <img
        src={logoImage}
        alt="AMAAS — Web Development Agency. We Build. You Grow."
        referrerPolicy="no-referrer"
        className={`${logoDimensions} w-auto object-contain transition-opacity duration-200 hover:opacity-95`}
      />
    </div>
  );
};
