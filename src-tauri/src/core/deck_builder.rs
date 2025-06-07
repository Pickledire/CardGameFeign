use crate::models::*;

/// Create a mock deck with sample cards for testing
pub fn create_mock_deck() -> Vec<Card> {
    let mut deck = Vec::new();
    let mut card_id = 1;

    // Verdant (Green) Creatures - Nature theme
    deck.push(Card {
        id: card_id,
        name: "Forest Wolf".to_string(),
        card_type: CardType::Creature,
        color: Color::Verdant,
        mana_cost: 2,
        description: "A swift predator of the deep woods".to_string(),
        attack: Some(3),
        defense: Some(2),
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Ancient Treant".to_string(),
        card_type: CardType::Creature,
        color: Color::Verdant,
        mana_cost: 5,
        description: "Guardian of the ancient forest".to_string(),
        attack: Some(4),
        defense: Some(6),
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Vine Sprite".to_string(),
        card_type: CardType::Creature,
        color: Color::Verdant,
        mana_cost: 1,
        description: "Small but nimble forest spirit".to_string(),
        attack: Some(1),
        defense: Some(1),
        duration: None,
    });
    card_id += 1;

    // Cinder (Red) Creatures - Aggression theme
    deck.push(Card {
        id: card_id,
        name: "Fire Imp".to_string(),
        card_type: CardType::Creature,
        color: Color::Cinder,
        mana_cost: 1,
        description: "Mischievous creature of flame".to_string(),
        attack: Some(2),
        defense: Some(1),
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Flame Dragon".to_string(),
        card_type: CardType::Creature,
        color: Color::Cinder,
        mana_cost: 6,
        description: "Mighty dragon wreathed in fire".to_string(),
        attack: Some(7),
        defense: Some(5),
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Ember Warrior".to_string(),
        card_type: CardType::Creature,
        color: Color::Cinder,
        mana_cost: 3,
        description: "Warrior forged in the heart of a volcano".to_string(),
        attack: Some(4),
        defense: Some(2),
        duration: None,
    });
    card_id += 1;

    // Azure (Blue) Creatures - Control theme
    deck.push(Card {
        id: card_id,
        name: "Frost Elemental".to_string(),
        card_type: CardType::Creature,
        color: Color::Azure,
        mana_cost: 3,
        description: "Elemental born from winter's breath".to_string(),
        attack: Some(2),
        defense: Some(4),
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Storm Caller".to_string(),
        card_type: CardType::Creature,
        color: Color::Azure,
        mana_cost: 4,
        description: "Mage who commands the tempest".to_string(),
        attack: Some(3),
        defense: Some(3),
        duration: None,
    });
    card_id += 1;

    // Ivory (White) Creatures - Protection theme
    deck.push(Card {
        id: card_id,
        name: "Guardian Angel".to_string(),
        card_type: CardType::Creature,
        color: Color::Ivory,
        mana_cost: 4,
        description: "Divine protector of the innocent".to_string(),
        attack: Some(2),
        defense: Some(5),
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Holy Knight".to_string(),
        card_type: CardType::Creature,
        color: Color::Ivory,
        mana_cost: 3,
        description: "Righteous warrior blessed by light".to_string(),
        attack: Some(3),
        defense: Some(3),
        duration: None,
    });
    card_id += 1;

    // Umbral (Black) Creatures - Sacrifice theme
    deck.push(Card {
        id: card_id,
        name: "Shadow Wraith".to_string(),
        card_type: CardType::Creature,
        color: Color::Umbral,
        mana_cost: 2,
        description: "Vengeful spirit from the void".to_string(),
        attack: Some(3),
        defense: Some(1),
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Bone Golem".to_string(),
        card_type: CardType::Creature,
        color: Color::Umbral,
        mana_cost: 4,
        description: "Construct animated by dark magic".to_string(),
        attack: Some(4),
        defense: Some(4),
        duration: None,
    });
    card_id += 1;

    // Violet (Purple) Creatures - Effect synergy
    deck.push(Card {
        id: card_id,
        name: "Mystic Scholar".to_string(),
        card_type: CardType::Creature,
        color: Color::Violet,
        mana_cost: 2,
        description: "Student of arcane mysteries".to_string(),
        attack: Some(1),
        defense: Some(3),
        duration: None,
    });
    card_id += 1;

    // Feign Cards
    deck.push(Card {
        id: card_id,
        name: "Shield Trap".to_string(),
        card_type: CardType::Feign,
        color: Color::Ivory,
        mana_cost: 1,
        description: "Reduces incoming damage when revealed".to_string(),
        attack: None,
        defense: None,
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Counter Strike".to_string(),
        card_type: CardType::Feign,
        color: Color::Cinder,
        mana_cost: 2,
        description: "Deals damage to attacker when revealed".to_string(),
        attack: None,
        defense: None,
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Mana Boost".to_string(),
        card_type: CardType::Feign,
        color: Color::Verdant,
        mana_cost: 1,
        description: "Grants extra mana when revealed".to_string(),
        attack: None,
        defense: None,
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Illusion".to_string(),
        card_type: CardType::Feign,
        color: Color::Azure,
        mana_cost: 2,
        description: "Creates a temporary creature when revealed".to_string(),
        attack: None,
        defense: None,
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Soul Drain".to_string(),
        card_type: CardType::Feign,
        color: Color::Umbral,
        mana_cost: 2,
        description: "Weakens enemy creatures when revealed".to_string(),
        attack: None,
        defense: None,
        duration: None,
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Arcane Resonance".to_string(),
        card_type: CardType::Feign,
        color: Color::Violet,
        mana_cost: 1,
        description: "Gains power from global effects".to_string(),
        attack: None,
        defense: None,
        duration: None,
    });
    card_id += 1;

    // Effect Cards
    deck.push(Card {
        id: card_id,
        name: "Blessing of Growth".to_string(),
        card_type: CardType::Effect,
        color: Color::Verdant,
        mana_cost: 3,
        description: "All creatures gain +1/+1".to_string(),
        attack: None,
        defense: None,
        duration: Some(3),
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Inferno".to_string(),
        card_type: CardType::Effect,
        color: Color::Cinder,
        mana_cost: 4,
        description: "All creatures take 1 damage each turn".to_string(),
        attack: None,
        defense: None,
        duration: Some(2),
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Frozen Time".to_string(),
        card_type: CardType::Effect,
        color: Color::Azure,
        mana_cost: 5,
        description: "Players draw an extra card each turn".to_string(),
        attack: None,
        defense: None,
        duration: Some(4),
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Divine Protection".to_string(),
        card_type: CardType::Effect,
        color: Color::Ivory,
        mana_cost: 3,
        description: "All damage is reduced by 1".to_string(),
        attack: None,
        defense: None,
        duration: Some(3),
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Curse of Weakness".to_string(),
        card_type: CardType::Effect,
        color: Color::Umbral,
        mana_cost: 2,
        description: "All creatures have -1 attack".to_string(),
        attack: None,
        defense: None,
        duration: Some(2),
    });
    card_id += 1;

    deck.push(Card {
        id: card_id,
        name: "Arcane Amplification".to_string(),
        card_type: CardType::Effect,
        color: Color::Violet,
        mana_cost: 4,
        description: "Violet creatures gain +2/+2".to_string(),
        attack: None,
        defense: None,
        duration: Some(3),
    });

    // Shuffle the deck
    use rand::seq::SliceRandom;
    use rand::thread_rng;
    deck.shuffle(&mut thread_rng());

    deck
} 