import { GameState, Person, Enemy, Technique, GameEvent, Artifact } from '../types';
import { SeededRNG } from '../utils/rng';
import { REALMS, TECHNIQUES } from '../constants';
import { PHYSIQUE_LIBRARY } from '../constants/bloodlines';

let nextId = 0;
const getUniqueId = () => `combat_${Date.now()}_${nextId++}`;

export function generateEnemy(player: Person, rng: SeededRNG): Enemy {
    const realmModifier = Math.max(0, player.realm - 1);
    const strength = player.strength * (0.8 + rng.next() * 0.4) + realmModifier * 5;
    const cultivation = player.cultivation * (0.8 + rng.next() * 0.4) + realmModifier * 10;
    const maxHealth = player.maxHealth * (0.7 + rng.next() * 0.5);
    const defense = player.defense * (0.8 + rng.next() * 0.4) + realmModifier * 3;
    const agility = player.agility * (0.8 + rng.next() * 0.4) + realmModifier * 2;
    const focus = player.focus * (0.8 + rng.next() * 0.4);
    const endurance = player.endurance * (0.8 + rng.next() * 0.4);

    const enemy: Enemy = {
        id: getUniqueId(),
        name: 'Demonic Beast',
        age: 999,
        birthYear: 0,
        gender: 'Male', // N/A
        alive: true,
        realm: player.realm,
        realmStage: player.realmStage,
        realmProgress: 0,
        cultivation,
        strength,
        defense,
        agility,
        focus,
        endurance,
        willpower: player.willpower * 0.8,
        karma: 0,
        talent: player.talent * 0.5,
        yearsInRealm: 0,
        failedBreakthroughs: 0,
        qiDeviation: false,
        effectiveLifespan: 999,
        cultivationSpeed: 0,
        maxRealmPotential: player.realm,
        talentGrade: 'Beast',
        bloodline: { id: 'demonic_blood', tier: 1, name: 'Demonic Blood' },
        physique: { id: 'iron_muscle_frame', name: PHYSIQUE_LIBRARY['iron_muscle_frame'].name, tier: PHYSIQUE_LIBRARY['iron_muscle_frame'].tier },
        luck: 50,
        generation: 0,
        clanId: 'beasts',
        sectId: 'wilderness',
        dynastyId: 'chaos',
        health: maxHealth,
        maxHealth: maxHealth,
        qi: 999,
        maxQi: 999,
        techniques: ['basic_strike', 'qi_blast'],
        isEnemy: true,
        charisma: 0,
        loyalty: 0,
        ambition: 100,
        leadership: 0,
        buffs: [],
        equipment: { weapon: null, armor: null, accessory: null, relic: null },
    };
    return enemy;
}

function calculateDamage(attacker: Person | Enemy, defender: Person | Enemy, technique: Technique, weapon: Artifact | null): number {
    let baseAttackPower = (attacker.cultivation + attacker.strength * 2);
    
    if (weapon) {
        const bondCoefficient = 0.5 + (weapon.soulLink / 200);
        const artifactPower = weapon.basePower * (1 + weapon.temperLevel * 0.1);
        baseAttackPower += artifactPower * bondCoefficient;
    }
    
    const totalAttackPower = baseAttackPower * technique.powerMultiplier;
    const defensePower = defender.cultivation + defender.strength;
    
    // Simplified damage formula
    const rawDamage = Math.max(1, totalAttackPower - defensePower);
    const randomFactor = 0.9 + Math.random() * 0.2; // +/- 10% variance
    
    return Math.floor(rawDamage * randomFactor);
}

export function processCombatTurn(state: GameState, payload: { techniqueId: string }): GameState {
    const { activeCombat, clan } = state;
    if (!activeCombat || !clan) return state;

    let { combatants, playerRef, enemyRef, log } = { ...activeCombat };
    combatants = { ...combatants };
    let player = { ...combatants[playerRef] } as Person;
    let enemy = { ...combatants[enemyRef] } as Enemy;
    let newArtifacts = { ...clan.artifacts };

    const technique = TECHNIQUES[payload.techniqueId];
    if (!technique || player.qi < technique.qiCost) {
        log = [...log, "Invalid action or not enough Qi!"];
        return { ...state, activeCombat: { ...activeCombat, log } };
    }
    
    // --- Player's Turn ---
    player.qi -= technique.qiCost;
    const playerWeaponId = player.equipment.weapon;
    const playerWeapon = playerWeaponId ? newArtifacts[playerWeaponId] : null;
    const damageToEnemy = calculateDamage(player, enemy, technique, playerWeapon);

    if (playerWeapon) {
        const durabilityLoss = damageToEnemy * 0.01;
        playerWeapon.durability = Math.max(0, playerWeapon.durability - durabilityLoss);
    }
    
    enemy.health = Math.max(0, enemy.health - damageToEnemy);
    log = [...log, `You used ${technique.name} and dealt ${damageToEnemy} damage!`];
    
    combatants[playerRef] = player;
    combatants[enemyRef] = enemy;

    // Check for player victory
    if (enemy.health <= 0) {
        log = [...log, `You have defeated the ${enemy.name}! ✨`];
        const newClan = {...clan, artifacts: newArtifacts};
        return { ...state, activeCombat: null, clan: newClan, log: addLog(state, log[log.length-1], 'success') };
    }

    // --- Enemy's Turn ---
    const enemyTechnique = state.rng.choice(enemy.techniques.map(id => TECHNIQUES[id]));
    const damageToPlayer = calculateDamage(enemy, player, enemyTechnique, null); // Enemies don't use artifacts for now
    player.health = Math.max(0, player.health - damageToPlayer);
    log = [...log, `${enemy.name} retaliates with ${enemyTechnique.name}, dealing ${damageToPlayer} damage!`];
    
    combatants[playerRef] = player;

    // Check for enemy victory
    if (player.health <= 0) {
        log = [...log, `You have been slain by the ${enemy.name}! 💀`];
        const deadPlayer = { ...player, alive: false };
        const newEntities = { ...state.entities, [player.id]: deadPlayer };
        const newClan = {...clan, artifacts: newArtifacts};
        return { ...state, activeCombat: null, clan: newClan, entities: newEntities, log: addLog(state, log[log.length-1], 'danger') };
    }

    const newClan = {...clan, artifacts: newArtifacts};
    return { ...state, clan: newClan, activeCombat: { ...activeCombat, combatants, log } };
}

function addLog(state: GameState, text: string, type: GameEvent['type'] = 'normal'): GameEvent[] {
    const newLog: GameEvent = {
        text,
        type,
        time: `Year ${state.time.year}, Spring`,
        id: state.rng.nextInt(100000, 999999)
    };
    return [newLog, ...state.log.slice(0, 49)];
}