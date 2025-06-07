import { invoke } from '@tauri-apps/api/core';
import type { GameState, PlayerAction, ActionResult } from '../types/game';

/**
 * Service for handling game operations via Tauri commands
 */
export class GameService {
  /**
   * Create a new game with two players
   */
  static async createGame(player1Name: string, player2Name: string): Promise<GameState> {
    try {
      return await invoke<GameState>('create_game', {
        player1Name,
        player2Name,
      });
    } catch (error) {
      console.error('Failed to create game:', error);
      throw new Error(`Failed to create game: ${error}`);
    }
  }

  /**
   * Get the current game state
   */
  static async getGameState(): Promise<GameState> {
    try {
      return await invoke('get_game_state');
    } catch (error) {
      console.error('Failed to get game state:', error);
      throw new Error(`Failed to get game state: ${error}`);
    }
  }

  /**
   * Process a player action
   */
  static async processAction(playerId: number, action: PlayerAction): Promise<ActionResult> {
    try {
      return await invoke('process_action', {
        playerId,
        action,
      });
    } catch (error) {
      console.error('Failed to process action:', error);
      throw new Error(`Failed to process action: ${error}`);
    }
  }

  /**
   * Check if the game is over and who won
   */
  static async checkGameOver(): Promise<number | null> {
    try {
      return await invoke('check_game_over');
    } catch (error) {
      console.error('Failed to check game over:', error);
      throw new Error(`Failed to check game over: ${error}`);
    }
  }

  /**
   * Get the game log
   */
  static async getGameLog(): Promise<string[]> {
    try {
      return await invoke('get_game_log');
    } catch (error) {
      console.error('Failed to get game log:', error);
      throw new Error(`Failed to get game log: ${error}`);
    }
  }

  /**
   * Reset the game
   */
  static async resetGame(): Promise<string> {
    try {
      return await invoke('reset_game');
    } catch (error) {
      console.error('Failed to reset game:', error);
      throw new Error(`Failed to reset game: ${error}`);
    }
  }
} 