import React from 'react';
import type { FeignCard as FeignCardType } from '../../types/game';
import { Color } from '../../types/game';

interface FeignCardProps {
  feign: FeignCardType;
  onClick?: () => void;
  isClickable?: boolean;
  className?: string;
}

/**
 * Component for displaying a feign card (face-down or revealed)
 */
export const FeignCard: React.FC<FeignCardProps> = ({
  feign,
  onClick,
  isClickable = false,
  className = '',
}) => {
  const getColorClass = (color: Color): string => {
    switch (color) {
      case Color.Verdant: return 'border-green-500 bg-green-50';
      case Color.Cinder: return 'border-red-500 bg-red-50';
      case Color.Azure: return 'border-blue-500 bg-blue-50';
      case Color.Ivory: return 'border-gray-300 bg-gray-50';
      case Color.Umbral: return 'border-purple-900 bg-purple-50';
      case Color.Violet: return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const baseClasses = `
    border-2 rounded-lg p-3 min-h-[100px] w-full max-w-[150px]
    ${feign.is_revealed ? getColorClass(feign.card.color) : 'border-gray-600 bg-gray-800'}
    ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
    ${className}
  `;

  if (!feign.is_revealed) {
    // Face-down feign card
    return (
      <div
        className={baseClasses}
        onClick={isClickable ? onClick : undefined}
        title="Face-down feign card"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg font-bold">
            ?
          </div>
        </div>
        <div className="text-xs text-gray-300 text-center mt-2">
          Feign
        </div>
      </div>
    );
  }

  // Revealed feign card
  return (
    <div
      className={baseClasses}
      onClick={isClickable ? onClick : undefined}
      title={feign.card.description}
    >
      {/* Card Header */}
      <div className="text-xs font-semibold mb-1 truncate">
        {feign.card.name}
      </div>
      
      {/* Mana Cost */}
      <div className="text-xs text-gray-600 mb-2">
        Cost: {feign.card.mana_cost}
      </div>
      
      {/* Description */}
      <div className="text-xs text-gray-700 mb-2 line-clamp-2">
        {feign.card.description}
      </div>
      
      {/* Color indicator */}
      <div className="text-xs text-gray-500 mt-auto capitalize">
        {feign.card.color}
      </div>
      
      {/* Revealed indicator */}
      <div className="text-xs text-green-600 font-semibold">
        REVEALED
      </div>
    </div>
  );
}; 