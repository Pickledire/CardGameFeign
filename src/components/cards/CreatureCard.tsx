import React from 'react';
import type { Creature } from '../../types/game';
import { Color } from '../../types/game';

interface CreatureCardProps {
  creature: Creature;
  onClick?: () => void;
  isClickable?: boolean;
  isOpponent?: boolean;
  className?: string;
}

/**
 * Component for displaying a creature card on the battlefield
 */
export const CreatureCard: React.FC<CreatureCardProps> = ({
  creature,
  onClick,
  isClickable = false,
  isOpponent = false,
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

  const baseClasses = `
    card-base creature-card
    ${getColorClass(creature.card.color)}
    ${isClickable ? 'clickable' : ''}
    ${creature.is_tapped ? 'tapped' : ''}
    ${isOpponent ? 'opponent' : ''}
    ${className}
  `;

  return (
    <div
      className={baseClasses}
      onClick={isClickable ? onClick : undefined}
      title={creature.card.description}
    >
      {/* Mana Cost */}
      <div className="creature-mana-cost">
        {creature.card.mana_cost}
      </div>
      
      {/* Card Name */}
      <div className="creature-name">
        {creature.card.name}
      </div>
      
      {/* Card Type */}
      <div className="creature-type">
        Creature
      </div>
      
      {/* Stats */}
      <div className="creature-stats">
        <div className="creature-stats-text">
          {creature.current_attack}/{creature.current_defense}
        </div>
      </div>
      
      {/* Tapped indicator */}
      {creature.is_tapped && (
        <div className="creature-tapped-indicator">
          TAP
        </div>
      )}
      
      {/* Color gem */}
      <div className="creature-color-gem"></div>
    </div>
  );
}; 