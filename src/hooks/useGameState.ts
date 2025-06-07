import { useState, useCallback, useEffect } from 'react';
import { GameService } from '../services/gameService';
import type { GameState, PlayerAction, ActionResult } from '../types/game';

/**
 * Custom hook for managing game state
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new game
   */
  const createGame = useCallback(async (player1Name: string, player2Name: string) => {
    setLoading(true);
    setError(null);
    try {
      const newGameState = await GameService.createGame(player1Name, player2Name);
      setGameState(newGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh game state from backend
   */
  const refreshGameState = useCallback(async () => {
    if (!gameState) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedState = await GameService.getGameState();
      setGameState(updatedState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh game state');
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  /**
   * Process a player action
   */
  const processAction = useCallback(async (playerId: number, action: PlayerAction): Promise<ActionResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await GameService.processAction(playerId, action);
      
      // Update local state if action was successful and new state is provided
      if (result.success && result.new_state) {
        setGameState(result.new_state);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process action';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        new_state: null,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if game is over
   */
  const checkGameOver = useCallback(async (): Promise<number | null> => {
    try {
      return await GameService.checkGameOver();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check game over');
      return null;
    }
  }, []);

  /**
   * Reset the game
   */
  const resetGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await GameService.resetGame();
      setGameState(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset game');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get current player
   */
  const getCurrentPlayer = useCallback(() => {
    if (!gameState) return null;
    return gameState.current_player === 1 ? gameState.player1 : gameState.player2;
  }, [gameState]);

  /**
   * Get opponent player
   */
  const getOpponentPlayer = useCallback(() => {
    if (!gameState) return null;
    return gameState.current_player === 1 ? gameState.player2 : gameState.player1;
  }, [gameState]);

  /**
   * Check if it's a specific player's turn
   */
  const isPlayerTurn = useCallback((playerId: number) => {
    return gameState?.current_player === playerId;
  }, [gameState]);

  return {
    gameState,
    loading,
    error,
    createGame,
    refreshGameState,
    processAction,
    checkGameOver,
    resetGame,
    getCurrentPlayer,
    getOpponentPlayer,
    isPlayerTurn,
  };
}; 