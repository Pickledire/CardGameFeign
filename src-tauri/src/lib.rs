// Core game modules
pub mod models;
pub mod core;
pub mod commands;

use commands::GameManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(GameManager::new())
        .invoke_handler(tauri::generate_handler![
            commands::create_game,
            commands::get_game_state,
            commands::process_action,
            commands::check_game_over,
            commands::get_game_log,
            commands::reset_game,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
