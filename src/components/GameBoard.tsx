import React, { useState, useEffect } from 'react';
import { CreatureCard } from './cards/CreatureCard';
import { FeignCard } from './cards/FeignCard';
import { HandCard } from './cards/HandCard';
import type { GameState, Card, PlayerAction } from '../types/game';
import { CardType, GamePhase, Color } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onAction: (playerId: number, action: PlayerAction) => Promise<void>;
  currentPlayerId: number; // Which player is viewing (1 or 2)
  onResetGame: () => Promise<void>; // Add reset game functionality
}

const getColorClasses = (color: Color): string => {
  const colorMap = {
    [Color.Verdant]: 'color-verdant',
    [Color.Cinder]: 'color-cinder',
    [Color.Azure]: 'color-azure',
    [Color.Ivory]: 'color-ivory',
    [Color.Umbral]: 'color-umbral',
    [Color.Violet]: 'color-violet',
  };
  return colorMap[color] || 'color-umbral';
};

/**
 * Main game board component displaying the full game state
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onAction,
  currentPlayerId,
  onResetGame,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const currentPlayer = currentPlayerId === 1 ? gameState.player1 : gameState.player2;
  const opponentPlayer = currentPlayerId === 1 ? gameState.player2 : gameState.player1;
  const isCurrentPlayerTurn = gameState.current_player === currentPlayerId;

  // Basic AI for Player 2
  useEffect(() => {
    const makeAIMove = async () => {
      if (gameState.current_player === 2 && gameState.phase === GamePhase.Placement) {
        // Wait a short delay to make the AI feel more natural
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const player2 = gameState.player2;
        
        // Find playable creatures
        const playableCreatures = player2.hand.filter(card => 
          card.card_type === CardType.Creature && card.mana_cost <= player2.mana
        );
        
                if (playableCreatures.length > 0) {
          try {
            const selectedCreature = playableCreatures[0]; // Play the first affordable creature
            await onAction(2, { PlayCreature: { card_id: selectedCreature.id } });
            console.log(`AI played ${selectedCreature.name}`);
            
            // After a short delay, end the phase
            setTimeout(async () => {
              await onAction(2, "EndPhase");
            }, 1000);
          } catch (error) {
            console.error('AI failed to play creature:', error);
            // If creature play fails, just end the phase
            setTimeout(async () => {
              await onAction(2, "EndPhase");
            }, 500);
          }
        } else {
          // No playable creatures, end phase
          setTimeout(async () => {
            await onAction(2, "EndPhase");
          }, 1000);
        }
      } else if (gameState.current_player === 2 && gameState.phase === GamePhase.Draw) {
        // Auto-draw for AI
        setTimeout(async () => {
          await onAction(2, "EndPhase");
        }, 800);
      } else if (gameState.current_player === 2 && gameState.phase === GamePhase.Attack) {
        // Auto-attack with any available creatures
        setTimeout(async () => {
          const player2 = gameState.player2;
          const availableCreatures = player2.board.creatures
            .map((creature, index) => ({ creature, index }))
            .filter(({ creature }) => creature !== null);
          
          if (availableCreatures.length > 0) {
            try {
              // Attack with the first creature
                             await onAction(2, { Attack: { creature_index: availableCreatures[0].index } });
              console.log(`AI attacked with creature at index ${availableCreatures[0].index}`);
            } catch (error) {
              console.error('AI failed to attack:', error);
            }
          }
          
          // End attack phase after attempting to attack
          setTimeout(async () => {
            await onAction(2, "EndPhase");
          }, 1000);
        }, 1200);
      } else if (gameState.current_player === 2 && gameState.phase === GamePhase.EndTurn) {
        // Auto-end turn for AI
        setTimeout(async () => {
          await onAction(2, "EndPhase");
        }, 500);
      }
    };
    
    makeAIMove();
  }, [gameState.current_player, gameState.phase, gameState.turn_number]);

  const handleCardSelect = (card: Card) => {
    if (!isCurrentPlayerTurn) return;
    setSelectedCard(selectedCard?.id === card.id ? null : card);
  };

  const handlePlayCreature = async () => {
    if (!selectedCard || selectedCard.card_type !== CardType.Creature) return;
    
    try {
      await onAction(currentPlayerId, { PlayCreature: { card_id: selectedCard.id } });
      setSelectedCard(null);
    } catch (error) {
      console.error('Failed to play creature:', error);
    }
  };

  const handlePlayFeign = async () => {
    if (!selectedCard || selectedCard.card_type !== CardType.Feign) return;
    
    try {
      await onAction(currentPlayerId, { PlayFeign: { card_id: selectedCard.id } });
      setSelectedCard(null);
    } catch (error) {
      console.error('Failed to play feign:', error);
    }
  };

  const handlePlayEffect = async () => {
    if (!selectedCard || selectedCard.card_type !== CardType.Effect) return;
    
    try {
      await onAction(currentPlayerId, { PlayEffect: { card_id: selectedCard.id } });
      setSelectedCard(null);
    } catch (error) {
      console.error('Failed to play effect:', error);
    }
  };

  const handleAttackWithCreature = async (creatureIndex: number) => {
    if (!isCurrentPlayerTurn || gameState.phase !== GamePhase.Attack) return;
    
    try {
      await onAction(currentPlayerId, { Attack: { creature_index: creatureIndex } });
    } catch (error) {
      console.error('Failed to attack:', error);
    }
  };

  const handleRevealFeign = async (feignIndex: number) => {
    if (!isCurrentPlayerTurn) return;
    
    try {
      await onAction(currentPlayerId, { RevealFeign: { feign_index: feignIndex } });
    } catch (error) {
      console.error('Failed to reveal feign:', error);
    }
  };

  const handleEndPhase = async () => {
    if (!isCurrentPlayerTurn) return;
    
    try {
      await onAction(currentPlayerId, "EndPhase");
    } catch (error) {
      console.error('Failed to end phase:', error);
    }
  };

  const handleDrawCard = async () => {
    if (!isCurrentPlayerTurn || gameState.phase !== GamePhase.Draw) return;
    
    try {
      await onAction(currentPlayerId, "EndPhase"); // Draw phase automatically draws card and advances
    } catch (error) {
      console.error('Failed to draw card:', error);
    }
  };

  // Testing helper - skip current player's turn
  const handleSkipTurn = async () => {
    try {
      // End phase multiple times to skip through all phases
      await onAction(gameState.current_player, "EndPhase");
      await onAction(gameState.current_player, "EndPhase");
      await onAction(gameState.current_player, "EndPhase");
      await onAction(gameState.current_player, "EndPhase");
    } catch (error) {
      console.error('Failed to skip turn:', error);
    }
  };

  const canPlayCard = (card: Card): boolean => {
    return isCurrentPlayerTurn && 
           gameState.phase === GamePhase.Placement && 
           card.mana_cost <= currentPlayer.mana;
  };

  const getPhaseColor = (): string => {
    switch (gameState.phase) {
      case GamePhase.Draw: return 'phase-draw';
      case GamePhase.Placement: return 'phase-placement';
      case GamePhase.Attack: return 'phase-attack';
      case GamePhase.EndTurn: return 'phase-endturn';
      default: return 'phase-draw';
    }
  };

  return (
    <div className="game-container">
      {/* Game Header */}
      <div className="game-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="game-title">Feign</h1>
            <div className={`phase-indicator ${getPhaseColor()}`}>
              Turn {gameState.turn_number} - {gameState.phase}
              {gameState.phase === GamePhase.Draw && isCurrentPlayerTurn && (
                <span className="draw-phase-hint"> (Click "Draw Card & Continue")</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="player-turn-text">
              <p className="current-player-name">
                {gameState.current_player === 1 ? gameState.player1.name : gameState.player2.name}'s Turn
              </p>
            </div>
            <div className="button-group">
              {gameState.phase === GamePhase.Draw && isCurrentPlayerTurn && (
                <button
                  onClick={handleDrawCard}
                  className="draw-card-btn"
                >
                  🎴 Draw Card & Continue
                </button>
              )}
              {gameState.phase !== GamePhase.Draw && (
                <button
                  onClick={handleEndPhase}
                  disabled={!isCurrentPlayerTurn}
                  className="end-phase-btn"
                >
                  ➡️ End Phase
                </button>
              )}
              <button
                onClick={handleSkipTurn}
                className="skip-turn-btn"
              >
                ⏭️ Skip Turn (Test)
              </button>
              <button
                onClick={onResetGame}
                className="reset-game-btn"
              >
                🔄 Reset Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Effect */}
      {gameState.global_effect && (
        <div className="global-effect">
          <h3 className="global-effect-title">🌟 Global Effect</h3>
          <p className="global-effect-name">{gameState.global_effect.card.name}</p>
          <p className="global-effect-description">{gameState.global_effect.card.description}</p>
          <p className="global-effect-duration">Duration: {gameState.global_effect.remaining_duration} turns</p>
        </div>
      )}

      {/* Main Game Area */}
      <div className="main-game-area">
        
        {/* Opponent's Area */}
        <div className="player-area opponent-area">
          <div className="player-info">
            <h2 className="player-name">{opponentPlayer.name}</h2>
            <div className="player-stats">
              <div className="stat-item">
                <div className="stat-badge life-badge">
                  {opponentPlayer.life}
                </div>
                <span>Life</span>
              </div>
              <div className="stat-item">
                <div className="stat-badge mana-badge">
                  {opponentPlayer.mana}
                </div>
                <span>Mana</span>
              </div>
              <div className="stat-item">
                <div className="stat-badge large hand-badge">
                  {opponentPlayer.hand.length}
                </div>
                <span>Hand</span>
              </div>
            </div>
          </div>
          
          {/* Opponent's Play Area */}
          <div className="play-area">
            {/* Feigns Row */}
            <div className="feigns-row">
              {opponentPlayer.board.feigns.map((feign, index) => (
                <div key={`opp-feign-${index}`} className="feign-card">
                  <FeignCard feign={feign} />
                </div>
              ))}
            </div>
            
            {/* Creatures Row */}
            <div className="creatures-row">
              {opponentPlayer.board.creatures.map((creature, index) => (
                <div key={`opp-creature-${index}`} className="creature-card">
                  <CreatureCard 
                    creature={creature} 
                    isOpponent={true}
                  />
                </div>
              ))}
              {opponentPlayer.board.creatures.length === 0 && (
                <div className="no-creatures">
                  No creatures in play
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Player's Area */}
        <div className="player-area current-player-area">
          <div className="player-info">
            <h2 className="player-name">{currentPlayer.name} (You)</h2>
            <div className="player-stats">
              <div className="stat-item">
                <div className="stat-badge life-badge">
                  {currentPlayer.life}
                </div>
                <span>Life</span>
              </div>
              <div className="stat-item">
                <div className="stat-badge mana-badge">
                  {currentPlayer.mana}
                </div>
                <span>Mana</span>
              </div>
            </div>
          </div>
          
          {/* Current Player's Play Area */}
          <div className={`play-area current-player-play-area ${selectedCard ? 'has-selected-card' : ''}`}>
            {/* Feigns Row */}
            <div className="feigns-row">
              {currentPlayer.board.feigns.map((feign, index) => (
                <div 
                  key={`curr-feign-${index}`} 
                  className="feign-card"
                  onClick={() => handleRevealFeign(index)}
                >
                  <FeignCard feign={feign} />
                </div>
              ))}
              {selectedCard?.card_type === CardType.Feign && (
                <div 
                  className="add-feign-slot"
                  onClick={handlePlayFeign}
                >
                  <div className="add-feign-icon">
                    <div className="add-feign-plus">+</div>
                    <div className="add-feign-text">Play Feign</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Creatures Row */}
            <div className="creatures-row">
              {currentPlayer.board.creatures.map((creature, index) => (
                <div key={`curr-creature-${index}`} className="creature-card">
                  <CreatureCard 
                    creature={creature} 
                    isClickable={gameState.phase === GamePhase.Attack && isCurrentPlayerTurn}
                    onClick={() => handleAttackWithCreature(index)}
                  />
                </div>
              ))}
              {currentPlayer.board.creatures.length === 0 && (
                <div className="no-creatures">
                  {selectedCard?.card_type === CardType.Creature ? (
                    <div className="play-area-instructions">
                      <button
                        onClick={handlePlayCreature}
                        className="play-creature-btn"
                      >
                        Play {selectedCard.name} here
                      </button>
                    </div>
                  ) : (
                    "No creatures in play"
                  )}
                </div>
              )}
              {selectedCard?.card_type === CardType.Creature && currentPlayer.board.creatures.length > 0 && (
                <div 
                  className="add-creature-slot"
                  onClick={handlePlayCreature}
                >
                  <div className="add-creature-icon">
                    <div className="add-creature-plus">+</div>
                    <div className="add-creature-text">Play Creature</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Game Area with Deck, Hand, and Discard */}
      <div className="bottom-game-area">
        {/* Draw Pile */}
        <div className="deck-pile-container">
          <div 
            className={`deck-pile ${gameState.phase === GamePhase.Draw && isCurrentPlayerTurn ? 'deck-clickable' : ''}`}
            onClick={gameState.phase === GamePhase.Draw && isCurrentPlayerTurn ? handleDrawCard : undefined}
          >
            <div className="deck-pile-cards">
              {Array.from({ length: Math.min(currentPlayer.deck.length, 8) }, (_, i) => (
                <div key={i} className="deck-card" style={{transform: `translateY(-${i * 2}px) translateX(-${i}px)`}} />
              ))}
            </div>
            <div className="deck-pile-label">
              <div className="deck-pile-count">{currentPlayer.deck.length}</div>
              <div className="deck-pile-text">Draw Pile</div>
              {gameState.phase === GamePhase.Draw && isCurrentPlayerTurn && (
                <div className="deck-pile-hint">Click to draw</div>
              )}
            </div>
          </div>
        </div>

        {/* Player Hand - Centered */}
        <div className="centered-hand">
          {selectedCard && (
            <div className="selected-card-info">
              <span className="selected-label">Selected:</span>
              <span className={`selected-card-name ${getColorClasses(selectedCard.color)}`}>
                {selectedCard.name}
              </span>
              {selectedCard.card_type === CardType.Effect && (
                <button
                  onClick={handlePlayEffect}
                  disabled={!canPlayCard(selectedCard)}
                  className="cast-effect-btn"
                >
                  Cast Effect
                </button>
              )}
            </div>
          )}
          <div className="hand-cards-centered">
            {currentPlayer.hand.map((card, index) => (
              <HandCard
                key={`hand-${card.id}-${index}`}
                card={card}
                isSelected={selectedCard?.id === card.id}
                isPlayable={canPlayCard(card)}
                onClick={() => handleCardSelect(card)}
              />
            ))}
            {currentPlayer.hand.length === 0 && (
              <div className="empty-hand">
                No cards in hand
              </div>
            )}
          </div>
        </div>

        {/* Discard Pile */}
        <div className="deck-pile-container">
          <div className="discard-pile">
            <div className="deck-pile-cards">
              <div className="discard-card" />
            </div>
            <div className="deck-pile-label">
              <div className="deck-pile-count">0</div>
              <div className="deck-pile-text">Discard Pile</div>
              <div className="deck-pile-hint">Click to discard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 