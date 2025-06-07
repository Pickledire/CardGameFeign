import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameLog } from './components/GameLog';
import { useGameState } from './hooks/useGameState';
import type { PlayerAction } from './types/game';

function App() {
  const {
    gameState,
    loading,
    error,
    createGame,
    processAction,
    checkGameOver,
    resetGame,
  } = useGameState();

  const [gameLog, setGameLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<number | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

  // Update game log when game state changes
  useEffect(() => {
    if (gameState) {
      setGameLog(gameState.game_log);
    }
  }, [gameState]);

  // Check for game over
  useEffect(() => {
    const checkWinner = async () => {
      if (gameState) {
        try {
          const gameWinner = await checkGameOver();
          setWinner(gameWinner);
        } catch (err) {
          console.error('Failed to check game over:', err);
        }
      }
    };
    checkWinner();
  }, [gameState, checkGameOver]);

  const handleCreateGame = async () => {
    try {
      await createGame(player1Name, player2Name);
      setShowSetup(false);
      setWinner(null);
    } catch (err) {
      console.error('Failed to create game:', err);
      alert('Failed to create game. Please make sure the Tauri backend is running.');
    }
  };

  const handleAction = async (playerId: number, action: PlayerAction) => {
    try {
      const result = await processAction(playerId, action);
      if (!result.success) {
        // Show error message to user
        console.error('Action failed:', result.message);
        alert(result.message);
      }
    } catch (err) {
      console.error('Failed to process action:', err);
      alert('Failed to process action. Please check the connection to the game backend.');
    }
  };

  const handleResetGame = async () => {
    try {
      await resetGame();
      setShowSetup(true);
      setWinner(null);
      setGameLog([]);
    } catch (err) {
      console.error('Failed to reset game:', err);
      alert('Failed to reset game. Please try refreshing the application.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <div className="text-xl font-semibold">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleResetGame}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Reset Game
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Refresh Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSetup || !gameState) {
    return (
      <div className="setup-container">
        <div className="setup-card">
          <h1 className="setup-title">Feign Card Game</h1>
          <p className="setup-subtitle">
            A strategic card game of creatures, feigns, and bluffing
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="form-group">
              <label className="form-label">
                Player 1 Name
              </label>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="form-input"
                placeholder="Enter player 1 name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Player 2 Name
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="form-input"
                placeholder="Enter player 2 name"
              />
            </div>
            
            <button
              onClick={handleCreateGame}
              disabled={!player1Name.trim() || !player2Name.trim()}
              className="start-game-btn"
            >
              Start Game
            </button>
          </div>
          
          <div className="mt-6 text-sm text-slate-300">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Each turn has 4 phases: Draw, Placement, Attack, End Turn</li>
              <li>Play creatures to the front row, feigns to the back row</li>
              <li>Attack with creatures during the attack phase</li>
              <li>Feigns can be revealed for special effects</li>
              <li>Reduce opponent's life to 0 to win</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (winner) {
    const winnerName = winner === 1 ? gameState.player1.name : gameState.player2.name;
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Game Over!</h1>
          <p className="text-xl mb-6">{winnerName} wins!</p>
          <div className="space-y-2">
            <button
              onClick={handleResetGame}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      {/* Full Width Game Area */}
      <div className="h-full overflow-auto">
        <GameBoard
          gameState={gameState}
          onAction={handleAction}
          currentPlayerId={1} // For now, always show from Player 1's perspective
          onResetGame={handleResetGame}
        />
      </div>
    </div>
  );
}

export default App;
