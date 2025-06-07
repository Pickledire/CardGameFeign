use crate::models::*;

/// Result of a combat resolution
pub struct CombatResult {
    pub summary: String,
    pub log_entries: Vec<String>,
}

/// Handles combat resolution between creatures
pub struct CombatResolver;

impl CombatResolver {
    /// Resolve combat for an attacking creature in a specific column
    pub fn resolve_combat(state: &mut GameState, attacking_player: u32, column: usize) -> CombatResult {
        let mut log_entries = Vec::new();
        
        // Get references to both players
        let (attacker, defender) = if attacking_player == 1 {
            (&mut state.player1, &mut state.player2)
        } else {
            (&mut state.player2, &mut state.player1)
        };

        // Check if there's an attacking creature
        let attacking_creature = match &attacker.board.creatures[column] {
            Some(creature) => creature.clone(),
            None => {
                return CombatResult {
                    summary: "No creature to attack with".to_string(),
                    log_entries: vec!["No creature found in attacking column".to_string()],
                };
            }
        };

        log_entries.push(format!("{} attacks with {} (ATK: {})", 
            attacker.name, attacking_creature.card.name, attacking_creature.current_attack));

        // Check if there's a defending creature in the same column
        let defending_creature = defender.board.creatures[column].clone();

        match defending_creature {
            Some(mut defending_creature) => {
                // Creature vs Creature combat
                log_entries.push(format!("{} defends with {} (DEF: {})", 
                    defender.name, defending_creature.card.name, defending_creature.current_defense));

                let attacker_damage = attacking_creature.current_attack;
                let defender_damage = defending_creature.current_attack;

                // Apply damage
                if attacker_damage >= defending_creature.current_defense {
                    // Defending creature dies
                    defender.board.creatures[column] = None;
                    log_entries.push(format!("{} is destroyed!", defending_creature.card.name));

                    // Calculate excess damage to player
                    let excess_damage = attacker_damage - defending_creature.current_defense;
                    if excess_damage > 0 {
                        defender.life = defender.life.saturating_sub(excess_damage);
                        log_entries.push(format!("{} takes {} excess damage (Life: {})", 
                            defender.name, excess_damage, defender.life));
                    }
                } else {
                    // Defending creature survives with reduced defense
                    defending_creature.current_defense -= attacker_damage;
                    defender.board.creatures[column] = Some(defending_creature.clone());
                    log_entries.push(format!("{} survives with {} defense remaining", 
                        defending_creature.card.name, defending_creature.current_defense));
                }

                // Check if attacking creature takes damage back
                if defender_damage >= attacking_creature.current_defense {
                    // Attacking creature dies
                    attacker.board.creatures[column] = None;
                    log_entries.push(format!("{} is destroyed in combat!", attacking_creature.card.name));
                } else if defender_damage > 0 {
                    // Attacking creature survives with reduced defense
                    let mut surviving_attacker = attacking_creature.clone();
                    surviving_attacker.current_defense -= defender_damage;
                    attacker.board.creatures[column] = Some(surviving_attacker.clone());
                    log_entries.push(format!("{} survives with {} defense remaining", 
                        surviving_attacker.card.name, surviving_attacker.current_defense));
                }

                CombatResult {
                    summary: "Combat resolved".to_string(),
                    log_entries,
                }
            }
            None => {
                // Direct attack to player
                let damage = attacking_creature.current_attack;
                defender.life = defender.life.saturating_sub(damage);
                log_entries.push(format!("{} deals {} damage directly to {} (Life: {})", 
                    attacking_creature.card.name, damage, defender.name, defender.life));

                CombatResult {
                    summary: format!("Direct attack for {} damage", damage),
                    log_entries,
                }
            }
        }
    }

    /// Apply feign effects during combat (placeholder for future expansion)
    pub fn apply_feign_effects(state: &mut GameState, player_id: u32, column: usize) -> Vec<String> {
        let mut log_entries = Vec::new();
        
        let player = if player_id == 1 {
            &mut state.player1
        } else {
            &mut state.player2
        };

        if let Some(ref mut feign) = player.board.feigns[column] {
            if !feign.is_revealed {
                // For now, just reveal the feign - specific effects would be implemented here
                feign.is_revealed = true;
                log_entries.push(format!("Feign {} is revealed!", feign.card.name));
                
                // Placeholder for specific feign effects
                match feign.card.name.as_str() {
                    "Shield Trap" => {
                        log_entries.push("Shield Trap activates - damage reduced!".to_string());
                        // TODO: Implement specific effect
                    }
                    "Counter Strike" => {
                        log_entries.push("Counter Strike activates - attacker takes damage!".to_string());
                        // TODO: Implement specific effect
                    }
                    _ => {
                        log_entries.push(format!("{} effect activates", feign.card.name));
                    }
                }
            }
        }

        log_entries
    }
} 