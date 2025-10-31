import { SeededRNG } from "./utils/rng";

// Base entity with a unique identifier
interface Entity {
  id: string;
}

export type PillEffectType =
  | 'INSTANT_QI_RECOVERY_PERCENT'
  | 'INSTANT_HEALTH_RECOVERY_PERCENT'
  | 'CULTIVATION_PROGRESS_BOOST'
  | 'FERTILITY_CHANCE_MODIFIER' // single use on next procreation attempt
  | 'BREAKTHROUGH_CHANCE_MODIFIER' // single use
  | 'REVIVE' // single use
  | 'STAT_MODIFIER' // temporary buff
  | 'LIFESPAN_MODIFIER' // permanent
  | 'BLOODLINE_AWAKENING_CHANCE' // single use on next procreation
  | 'REMOVE_DEBUFF'
  | 'SKILL_DAMAGE_MODIFIER' // temporary buff
  | 'CULTIVATION_SPEED_MODIFIER' // temporary buff
  | 'MENTAL_DEBUFF_IMMUNITY' // temporary buff
  | 'STEALTH_MODIFIER' // temporary buff
  | 'TEAM_SYNERGY_MODIFIER' // temporary buff
  | 'HP_DRAIN' // temporary debuff
  | 'UNLOCK_BLOODLINE_ABILITIES' // single use
  | 'TELEPORT' // single use
  | 'TIME_PERCEPTION' // temporary buff
  | 'BEAST_AFFINITY' // temporary buff
  | 'TRIBULATION_SHIELD'; // single use

export interface PillEffect {
  type: PillEffectType;
  value: number;
  duration?: number; // in years. 0 means single-use. undefined means instant.
  stat?: 'strength' | 'defense' | 'willpower' | 'agility' | 'focus' | 'endurance' | 'all';
  skillType?: 'fire' | 'lightning' | 'ice' | 'yin' | 'yang' | 'poison' | 'holy';
  debuffType?: 'qi_deviation' | 'corruption' | 'mental';
}

export interface Pill {
  id: string;
  name: string;
  tier: 'Mortal' | 'Earth' | 'Heaven' | 'Saint' | 'Immortal' | 'Divine';
  description: string;
  effects: PillEffect[];
}

export interface Buff extends PillEffect {
  sourcePillName: string;
  startYear: number;
  remainingDuration: number;
}

export interface Person extends Entity {
  name: string;
  age: number;
  birthYear: number;
  gender: 'Male' | 'Female';
  alive: boolean;
  
  // Cultivation
  realm: number;
  realmStage: number;
  realmProgress: number; 
  cultivation: number;
  strength: number;
  defense: number;
  agility: number;
  focus: number;
  endurance: number;
  willpower: number;
  karma: number;
  talent: number; // The one true source of talent
  yearsInRealm: number;
  failedBreakthroughs: number;
  qiDeviation: boolean;
  effectiveLifespan: number;
  
  // Derived from talent at birth
  cultivationSpeed: number;
  maxRealmPotential: number;
  talentGrade: string;
  luck: number;

  // Genetics
  bloodline: {
    id: string;
    tier: number;
    name: string;
  };
  physique: {
    id: string;
    name: string;
    tier: number;
  };

  // Dynasty
  generation: number;
  spouseIds: string[];
  parentIds: string[];
  childrenIds: string[];
  clanId: string;
  sectId: string;
  dynastyId: string;
  branchId?: string;

  // Roles
  isYoungHead: boolean;
  isElder: boolean;
  elderType?: 'Grand Elder' | 'Combat Elder' | 'Spirit Elder' | 'Alchemy Elder' | 'Formation Elder' | 'Law Elder';
  isPatriarch?: boolean;
  isLivingAncestor?: boolean;

  // Social & Relationships
  affection: { [partnerId: string]: number }; // Tracks affection towards other individuals
  charisma: number;
  loyalty: number;
  ambition: number;
  leadership: number;
  patriarchTrait?: 'Wise' | 'Tyrant' | 'Ascetic';

  // States
  isDualCultivatingWith?: string; // ID of the partner they are dual cultivating with
  blessedByAncestor?: boolean;
  buffs: Buff[];

  // Combat
  health: number;
  maxHealth: number;
  qi: number;
  maxQi: number;
  techniques: string[]; // IDs of known techniques
  equipment: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
    relic: string | null;
  };
}

export interface Enemy extends Omit<Person, 'id' | 'isYoungHead' | 'isElder' | 'affection' | 'spouseIds' | 'parentIds' | 'childrenIds' | 'equipment' | 'bloodline' | 'physique' | 'buffs' | 'branchId'> {
  id: string;
  isEnemy: true;
  bloodline: {
    id: string;
    tier: number;
    name: string;
  };
  physique: {
    id: string;
    name: string;
    tier: number;
  };
  buffs: Buff[];
  equipment: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
    relic: string | null;
  };
}

export interface Technique {
  id: string;
  name: string;
  description: string;
  powerMultiplier: number;
  qiCost: number;
  realmRequired: number;
  cooldown?: number;
}

export interface CombatState {
  combatants: Record<string, Person | Enemy>;
  playerRef: string;
  enemyRef: string;
  log: string[];
}

export interface TribulationState {
  personId: string;
  type: 'Lightning';
  waves: number;
  currentWave: number;
  baseSuccessChance: number;
}

export interface Ancestor {
  name: string;
  realm: number;
  generation: number;
  age: number;
  talent: number;
  soulTablet: boolean;
  ancestorType: 'Ascended' | 'Spiritual' | 'Retreating' | 'Ascended Spirit' | 'Mortal Spirit';
}

export interface FacilityInstance {
  level: number;
  wear: number; // 0-100, affects efficiency
  efficiency: number; // 0-100, derived from wear
}

export interface Facilities {
  meditationHall: FacilityInstance;
  herbGarden: FacilityInstance;
  ancestralHall: FacilityInstance;
  alchemyFurnace: FacilityInstance;
  forgePavilion: FacilityInstance;
  clanTemple: FacilityInstance;
}

export type ArtifactEffectType =
  | 'PASSIVE_STAT_MODIFIER'
  | 'SKILL_DAMAGE_MODIFIER'
  | 'CRAFTING_SUCCESS_MODIFIER'
  | 'CULTIVATION_SPEED_MODIFIER'
  | 'HEALING_EFFECTIVENESS_MODIFIER'
  | 'ACTIVE_ABILITY'
  | 'UNLOCKS_FEATURE'
  | 'TRIGGERS_EVENT'
  | 'CLAN_WIDE_MODIFIER'
  | 'CONDITIONAL_MODIFIER'
  | 'ONE_TIME_USE'
  | 'AURA_EFFECT'
  | 'RESOURCE_COST_ON_USE'
  | 'DEBUFF_ON_WIELDER';

export interface ArtifactEffect {
  type: ArtifactEffectType;
  description: string;
  value?: number;
  stat?: 'strength' | 'defense' | 'willpower' | 'agility' | 'focus' | 'endurance' | 'luck' | 'charisma' | 'all_damage' | 'soul_defense' | 'leadership';
  skillType?: 'fire' | 'water' | 'ice' | 'lightning' | 'dark' | 'holy' | 'all' | 'yin' | 'yang';
  modifierType?: 'percent' | 'flat';
  condition?: string;
  cooldown?: number; // in years or turns
  abilityId?: string;
  clanModifier?: 'qi_recovery' | 'meditation_speed';
  craftingType?: 'alchemy' | 'forging';
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  type: 'Weapon' | 'Armor' | 'Accessory' | 'Relic';
  tier: number;
  basePower: number;
  temperLevel: number;
  soulLink: number; // 0-100
  durability: number;
  maxDurability: number;
  boundTo: string | null; // personId
  effects?: ArtifactEffect[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  inputs: { id: 'herbs' | 'spiritOre' | 'beastCores' | 'spiritStones', qty: number }[];
  output: { type: 'pill' | 'artifact', item: Omit<Pill, 'id'> | Omit<Artifact, 'id'>, qty: number };
  facility: keyof Facilities;
  requiredLevel: number;
  successBase: number;
}

export interface ConstructionProject {
  facilityId: keyof Facilities;
  targetLevel: number;
  startYear: number;
  duration: number; // in years
  endYear: number;
}

export interface TechEffect {
  unlockFacilityLevel?: { facility: keyof Facilities, level: number };
  bonus?: Partial<Record<'constructionSpeed' | 'researchRate' | 'cultivationSpeed' | 'resourceGain' | 'breakthroughChance' | 'mutationChance', number>>;
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  branch: string;
  cost: number; // Research Points
  requires: string[];
  effect: TechEffect;
}

export type AllianceType = 'TradePact' | 'DefenseTreaty';

export interface Alliance {
    withClanId: string;
    type: AllianceType;
    level: number;
    startYear: number;
}


export interface Clan {
  id:string; // To link to the world structure
  name: string;
  reputation: number;
  spiritStones: number;
  herbs: number;
  spiritOre: number;
  beastCores: number;
  pills: Record<string, Pill>;
  artifacts: Record<string, Artifact>;
  disciples: number;
  territory: number;
  fateEnergy: number;
  ancestralFavor: number;
  diplomaticGrace: number;
  ancestralFaith: number;
  unlockedBlessings: string[];
  activeCurse: string | null;
  branchTributeLastYear: number;

  facilities: Facilities;
  constructionPoints: number;
  researchPoints: number;
  constructionQueue: ConstructionProject[];
  unlockedTechs: string[];
  alliances: Alliance[];
}

export interface TimeState {
  year: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  day: number;
}

export interface GameEvent {
  text: string;
  type: 'normal' | 'legendary' | 'success' | 'warning' | 'danger';
  time: string;
  id: number;
}

export interface RandomEventChoice {
  text: string;
  effect: (state: GameState) => GameState; // Effects are now pure functions
  cost?: number;
}

export interface RandomEvent {
  id: string;
  title: string;
  text: string;
  choices: RandomEventChoice[];
  followup?: string[];
}

export type EventTriggerCondition = 
    | { type: 'clan_faith', lessThan: number }
    | { type: 'clan_members_min', value: number }
    | { type: 'years_passed_min', value: number };

export interface EventTemplate {
    id: string;
    title: string;
    category: 'Personal' | 'Clan' | 'World' | 'Divine';
    baseChance: number;
    triggers: EventTriggerCondition[];
    getText: (s: GameState) => string;
    getChoices: (s: GameState) => RandomEventChoice[];
    followup?: string[];
}


// --- New Technical Architecture Types ---
export type ClanAffinity = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Lightning' | 'Ice' | 'Metal' | 'Wood' | 'Light' | 'Dark' | 'Yin' | 'Yang' | 'None';

export interface ClanInfo {
  id: string;
  name: string;
  sectId: string;
  relation: number;
  description?: string;
  affinity: ClanAffinity;
  alliances: Alliance[];
}

export interface Sect {
  id: string;
  name: string;
  dynastyId: string;
  clanIds: string[];
  description?: string;
}

export interface Dynasty {
  id: string;
  name: string;
  sectIds: string[];
  description?: string;
}

export interface ShopItem {
    type: 'pill' | 'artifact';
    itemId: string;
    item: Omit<Pill, 'id'> | Omit<Artifact, 'id'>;
    price: number;
}

export interface ShopState {
    pills: ShopItem[];
    artifacts: ShopItem[];
}

export interface Branch {
    id: string;
    name: string;
    leaderId: string;
    memberIds: string[];
    loyalty: number; // 0-100
}


export interface GameState {
    gameStarted: boolean;
    clan: Clan | null;
    patriarchId: string | null;
    entities: Record<string, Person>;
    ancestors: Ancestor[];
    time: TimeState;
    log: GameEvent[];
    eventQueue: string[]; // Stores IDs of events to be triggered
    activeRandomEvent: RandomEvent | null;
    activeCombat: CombatState | null;
    activeTribulation: TribulationState | null;
    activeShop: ShopState | null;
    branches: Record<string, Branch>;
    rng: SeededRNG;
    seed: string;
    difficulty: Difficulty;
    tutorial: {
        isActive: boolean;
        stepIndex: number;
    }
    activeNarrativePacks: string[];
    // World Structure
    dynasties: Record<string, Dynasty>;
    sects: Record<string, Sect>;
    clans: Record<string, ClanInfo>;
}

// --- Reducer Actions ---
export type GameAction =
  | { type: 'INITIALIZE_GAME'; payload: { name: string; difficulty: Difficulty; template: QuickstartTemplate; startTutorial: boolean; seed: string } }
  | { type: 'ADVANCE_TIME'; payload: { years: number } }
  | { type: 'CULTIVATE' }
  | { type: 'ATTEMPT_BREAKTHROUGH' }
  | { type: 'RECRUIT_DISCIPLES' }
  | { type: 'START_CONSTRUCTION'; payload: { facilityId: keyof Facilities } }
  | { type: 'START_RESEARCH'; payload: { techId: string } }
  | { type: 'APPOINT_YOUNG_HEAD'; payload: { personId: string } }
  | { type: 'APPOINT_ELDER'; payload: { personId: string } }
  | { type: 'FORCE_SUCCESSION' }
  | { type: 'HANDLE_EVENT_CHOICE'; payload: { choice: RandomEventChoice } }
  | { type: 'ADVANCE_TUTORIAL' }
  | { type: 'SKIP_TUTORIAL' }
  | { type: 'SET_RANDOM_EVENT', payload: RandomEvent | null }
  | { type: 'TOGGLE_DUAL_CULTIVATION', payload: { person1Id: string, person2Id: string } }
  | { type: 'PROPOSE_MARRIAGE', payload: { proposerId: string, targetId: string } }
  | { type: 'START_COMBAT', payload: { combatState: CombatState } }
  | { type: 'COMBAT_ACTION', payload: { techniqueId: string } }
  | { type: 'END_COMBAT', payload: { outcome: 'victory' | 'defeat' } }
  | { type: 'START_TRIBULATION', payload: { personId: string } }
  | { type: 'RESOLVE_TRIBULATION', payload: { successRate: number } }
  | { type: 'CRAFT_ITEM', payload: { recipeId: string } }
  | { type: 'USE_PILL', payload: { pillId: string, personId: string } }
  | { type: 'EQUIP_ARTIFACT', payload: { personId: string; artifactId: string } }
  | { type: 'UNEQUIP_ARTIFACT', payload: { personId: string; slot: keyof Person['equipment'] } }
  | { type: 'TEMPER_ARTIFACT', payload: { artifactId: string } }
  | { type: 'PERFORM_BLOODLINE_RITUAL', payload: { personId: string } }
  | { type: 'UNLOCK_BLESSING'; payload: { blessingId: string } }
  | { type: 'PROPOSE_ALLIANCE'; payload: { targetClanId: string; allianceType: AllianceType } }
  | { type: 'BREAK_ALLIANCE'; payload: { targetClanId: string } }
  | { type: 'PERFORM_OFFERING'; payload: { offeringType: 'spiritStones' | 'herbs' | 'artifact'; artifactId?: string } }
  | { type: 'CLOSE_SHOP' }
  | { type: 'PURCHASE_ITEM'; payload: { item: ShopItem } };


// --- Existing Supporting Types (mostly unchanged) ---

export interface ClanRank {
  rank: string;
  name: string;
  minRealm: number;
  maxRealm: number;
  powerRange: [number, number];
  influence: string;
  resources: string;
  color: string;
}

export interface Realm {
  name: string;
  color: string;
  lifespan: number;
  powerMultiplier: number;
  powerRange: [number, number];
  stage: 'Mortal' | 'Heavenly' | 'Immortal' | 'Divine';
  desc: string;
}

export interface TalentGrade {
    name: string;
    speed: number;
    maxRealm: number;
    color: string;
    tribulationDeath: number;
}

export interface Difficulty {
    name: 'Casual' | 'Normal' | 'Hard';
    resourceModifier: number;
    eventFrequency: number;
}

export interface QuickstartTemplate {
    name: 'Martial' | 'Scholar' | 'Merchant';
    description: string;
    bonuses: {
        spiritStones?: number;
        strength?: number;
        talent?: number;
        disciples?: number;
    };
}

export interface TutorialStep {
    id: number;
    text: string;
    targetId: string; // data-tutorial-id of the element to highlight
    position?: 'top' | 'bottom' | 'left' | 'right';
    actionTrigger?: GameAction['type'] | 'none'; // Action that completes the step
}

export interface AccessibilitySettings {
    largeText: boolean;
    highContrast: boolean;
    motionReduction: boolean;
}