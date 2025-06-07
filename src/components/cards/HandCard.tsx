import React from 'react';
import type { Card } from '../../types/game';
import { Color, CardType } from '../../types/game';

interface HandCardProps {
  card: Card;
  onClick?: () => void;
  isClickable?: boolean;
  isPlayable?: boolean;
  isSelected?: boolean;
  className?: string;
}

/**
 * Component for displaying a card in the player's hand
 */
export const HandCard: React.FC<HandCardProps> = ({
  card,
  onClick,
  isClickable = false,
  isPlayable = true,
  isSelected = false,
  className = '',
}) => {
  const getColorClass = (color: Color): string => {
    switch (color) {
      case Color.Verdant: return 'color-verdant';
      case Color.Cinder: return 'color-cinder';
      case Color.Azure: return 'color-azure';
      case Color.Ivory: return 'color-ivory';
      case Color.Umbral: return 'color-umbral';
      case Color.Violet: return 'color-violet';
      default: return 'color-umbral';
    }
  };

  const getCardTypeIcon = (cardType: CardType): string => {
    switch (cardType) {
      case CardType.Creature: return '🐉';
      case CardType.Feign: return '🎭';
      case CardType.Effect: return '🌐';
      default: return '❓';
    }
  };

  const baseClasses = `
    card-base hand-card
    ${getColorClass(card.color)}
    ${isClickable && isPlayable ? 'clickable' : ''}
    ${!isPlayable ? 'unplayable' : ''}
    ${isSelected ? 'selected' : ''}
    ${className}
  `;

  return (
    <div
      className={baseClasses}
      onClick={isClickable && isPlayable ? onClick : undefined}
      title={card.description}
    >
      {/* Mana Cost */}
      <div className="hand-card-mana-cost">
        {card.mana_cost}
      </div>
      
      {/* Card Type Icon */}
      <div className="hand-card-icon">
        {getCardTypeIcon(card.card_type)}
      </div>
      
      {/* Card Name */}
      <div className="hand-card-name">
        {card.name}
      </div>
      
      {/* Card Type */}
      <div className="hand-card-type">
        {card.card_type}
      </div>
      
      {/* Stats for creatures */}
      {card.card_type === CardType.Creature && card.attack !== null && card.defense !== null && (
        <div className="hand-card-stats">
          <div className="hand-card-stats-text">
            {card.attack}/{card.defense}
          </div>
        </div>
      )}
      
      {/* Duration for effects */}
      {card.card_type === CardType.Effect && card.duration !== null && (
        <div className="hand-card-duration">
          <div className="hand-card-duration-text">
            {card.duration} turns
          </div>
        </div>
      )}
      
      {/* Color gem */}
      <div className="hand-card-color-gem"></div>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="hand-card-selected-indicator">
          SELECTED
        </div>
      )}
    </div>
  );
}; 