use crate::core::GameEngine;
use crate::models::*;
use std::sync::Mutex;
use tauri::State;

/// Global game state managed by Tauri
pub struct GameManager {
    pub engine: Mutex<Option<GameEngine>>,
}

impl GameManager {
    pub fn new() -> Self {
        GameManager {
            engine: Mutex::new(None),
        }
    }
}

/// Create a new game
#[tauri::command]
pub fn create_game(
    player1_name: String,
    player2_name: String,
    game_manager: State<GameManager>,
) -> Result<GameState, String> {
    let engine = GameEngine::new(player1_name, player2_name);
    let state = engine.state.clone();
    
    let mut manager = game_manager.engine.lock().map_err(|e| e.to_string())?;
    *manager = Some(engine);
    
    Ok(state)
}

/// Get the current game state
#[tauri::command]
pub fn get_game_state(game_manager: State<GameManager>) -> Result<GameState, String> {
    let manager = game_manager.engine.lock().map_err(|e| e.to_string())?;
    
    match &*manager {
        Some(engine) => Ok(engine.state.clone()),
        None => Err("No active game".to_string()),
    }
}

/// Process a player action
#[tauri::command]
pub fn process_action(
    player_id: u32,
    action: PlayerAction,
    game_manager: State<GameManager>,
) -> Result<ActionResult, String> {
    let mut manager = game_manager.engine.lock().map_err(|e| e.to_string())?;
    
    match &mut *manager {
        Some(engine) => Ok(engine.process_action(player_id, action)),
        None => Err("No active game".to_string()),
    }
}

/// Check if the game is over and who won
#[tauri::command]
pub fn check_game_over(game_manager: State<GameManager>) -> Result<Option<u32>, String> {
    let manager = game_manager.engine.lock().map_err(|e| e.to_string())?;
    
    match &*manager {
        Some(engine) => Ok(engine.is_game_over()),
        None => Err("No active game".to_string()),
    }
}

/// Get the game log
#[tauri::command]
pub fn get_game_log(game_manager: State<GameManager>) -> Result<Vec<String>, String> {
    let manager = game_manager.engine.lock().map_err(|e| e.to_string())?;
    
    match &*manager {
        Some(engine) => Ok(engine.state.game_log.clone()),
        None => Err("No active game".to_string()),
    }
}

/// Reset the game
#[tauri::command]
pub fn reset_game(game_manager: State<GameManager>) -> Result<String, String> {
    let mut manager = game_manager.engine.lock().map_err(|e| e.to_string())?;
    *manager = None;
    Ok("Game reset".to_string())
} 