import { ClanRank, Realm, Difficulty, QuickstartTemplate, TutorialStep, Technique, Recipe } from './types';

export const CLAN_RANKS: ClanRank[] = [
  // Low-Tier Clans (Mortal World)
  { rank: '9th-Class', name: 'Clan', minRealm: 0, maxRealm: 1, powerRange: [1, 100], influence: 'Small village', resources: 'Basic', color: 'gray' },
  { rank: '8th-Class', name: 'Clan', minRealm: 2, maxRealm: 2, powerRange: [100, 5000], influence: 'Town', resources: 'Minor spirit field', color: 'green' },
  { rank: '7th-Class', name: 'Clan', minRealm: 3, maxRealm: 3, powerRange: [5000, 50000], influence: 'Local region', resources: 'Spirit mine', color: 'blue' },
  // Mid-Tier Clans (Rising Cultivation)
  { rank: '6th-Class', name: 'Family', minRealm: 4, maxRealm: 4, powerRange: [50000, 100000], influence: 'Small city', resources: 'Clan formations', color: 'cyan' },
  { rank: '5th-Class', name: 'Family', minRealm: 5, maxRealm: 5, powerRange: [100000, 500000], influence: 'Province', resources: 'Ancestral spirits', color: 'purple' },
  { rank: '4th-Class', name: 'Family', minRealm: 6, maxRealm: 7, powerRange: [500000, 2000000], influence: 'Multiple cities', resources: 'Spirit beasts', color: 'pink' },
  // High-Tier Clans (Immortal Lineage)
  { rank: '3rd-Class', name: 'Sect', minRealm: 8, maxRealm: 9, powerRange: [2000000, 100000000], influence: 'Entire nation', resources: 'Immortal ancestor', color: 'yellow' },
  { rank: '2nd-Class', name: 'Dynasty', minRealm: 10, maxRealm: 12, powerRange: [100000000, 2000000000], influence: 'Multiple nations', resources: 'Divine protection', color: 'amber' },
  { rank: '1st-Class', name: 'Empire', minRealm: 13, maxRealm: 14, powerRange: [2000000000, 100000000000], influence: 'Entire continent', resources: 'Sacred grounds', color: 'gold' },
  // Supreme Bloodline Clans
  { rank: 'Heaven-Tier', name: 'Sanctuary', minRealm: 15, maxRealm: 16, powerRange: [100000000000, 2000000000000], influence: 'Multiple dimensions', resources: 'Time control', color: 'orange' },
  { rank: 'Saint-Tier', name: 'Holy Land', minRealm: 17, maxRealm: 18, powerRange: [2000000000000, 100000000000000], influence: 'Multiple worlds', resources: 'Creation laws', color: 'red' },
  { rank: 'Origin-Tier', name: 'Primordial', minRealm: 19, maxRealm: 19, powerRange: [100000000000000, 999999999999999], influence: 'Multi-universal', resources: 'Dao Origin Pools', color: 'rainbow' }
];

export const REALMS: Realm[] = [
  // Mortal & Foundation Stages
  { name: 'Mortal Body', color: 'gray', lifespan: 70, powerMultiplier: 1, powerRange: [1, 10], stage: 'Mortal', desc: 'Ordinary human. Basic physical combat only.' },
  { name: 'Qi Refining', color: 'blue', lifespan: 150, powerMultiplier: 10, powerRange: [10, 100], stage: 'Mortal', desc: 'Can use Qi for enhanced strength & basic elemental attacks.' },
  { name: 'Foundation Establishment', color: 'cyan', lifespan: 300, powerMultiplier: 50, powerRange: [100, 5000], stage: 'Mortal', desc: 'Internal Qi stabilized; can use minor spells & body reinforcement.' },
  { name: 'Core Formation', color: 'yellow', lifespan: 500, powerMultiplier: 100, powerRange: [5000, 50000], stage: 'Mortal', desc: 'Forms Golden Core; medium-scale elemental mastery.' },
  { name: 'Nascent Soul', color: 'purple', lifespan: 800, powerMultiplier: 200, powerRange: [50000, 100000], stage: 'Mortal', desc: 'Spirit projection, flight, and soul attacks begin.' },
  // Heavenly Ascension Stages
  { name: 'Soul Transformation', color: 'pink', lifespan: 1200, powerMultiplier: 500, powerRange: [100000, 500000], stage: 'Heavenly', desc: 'Soul becomes semi-independent; divine sense forms.' },
  { name: 'Void Refinement', color: 'indigo', lifespan: 2000, powerMultiplier: 1000, powerRange: [500000, 2000000], stage: 'Heavenly', desc: 'Can travel through voids; partial spatial control.' },
  { name: 'Spirit Severing', color: 'violet', lifespan: 3000, powerMultiplier: 2500, powerRange: [2000000, 8000000], stage: 'Heavenly', desc: 'Detaches mortal emotions and worldly ties.' },
  { name: 'Dao Comprehension', color: 'fuchsia', lifespan: 5000, powerMultiplier: 5000, powerRange: [8000000, 30000000], stage: 'Heavenly', desc: 'Understands Dao laws; can manifest domains.' },
  { name: 'Ascension Realm', color: 'rose', lifespan: 10000, powerMultiplier: 10000, powerRange: [30000000, 100000000], stage: 'Heavenly', desc: 'Breaks mortal limits; prepares for ascension.' },
  // Immortal Realms
  { name: 'Lower Immortal', color: 'amber', lifespan: 50000, powerMultiplier: 25000, powerRange: [100000000, 500000000], stage: 'Immortal', desc: 'True immortal body; commands natural elements.' },
  { name: 'Earth Immortal', color: 'emerald', lifespan: 100000, powerMultiplier: 50000, powerRange: [500000000, 2000000000], stage: 'Immortal', desc: 'Bound to earth laws; controls land and nature.' },
  { name: 'Heaven Immortal', color: 'sky', lifespan: 200000, powerMultiplier: 100000, powerRange: [2000000000, 8000000000], stage: 'Immortal', desc: 'Merges with heaven; celestial laws obey.' },
  { name: 'Mystic Immortal', color: 'teal', lifespan: 500000, powerMultiplier: 250000, powerRange: [8000000000, 30000000000], stage: 'Immortal', desc: 'Manifests worlds within soul; dimensional mastery.' },
  { name: 'Golden Immortal', color: 'gold', lifespan: 1000000, powerMultiplier: 500000, powerRange: [30000000000, 100000000000], stage: 'Immortal', desc: 'Pure essence; body cannot decay; full Dao control.' },
  // Supreme Realms of Divinity
  { name: 'Great Luo Immortal', color: 'orange', lifespan: 10000000, powerMultiplier: 1000000, powerRange: [100000000000, 500000000000], stage: 'Divine', desc: 'Transcends life and death; exists across time.' },
  { name: 'Quasi-Saint', color: 'red', lifespan: 100000000, powerMultiplier: 5000000, powerRange: [500000000000, 2000000000000], stage: 'Divine', desc: 'Master of multiple Daos; part of cosmic order.' },
  { name: 'Saint', color: 'crimson', lifespan: 1000000000, powerMultiplier: 10000000, powerRange: [2000000000000, 10000000000000], stage: 'Divine', desc: 'Embodies the Dao; heaven and earth obey.' },
  { name: 'Dao Ancestor', color: 'white', lifespan: 9999999999, powerMultiplier: 50000000, powerRange: [10000000000000, 100000000000000], stage: 'Divine', desc: 'Creator-level; defines laws of existence.' },
  { name: 'Origin Sovereign', color: 'rainbow', lifespan: 99999999999, powerMultiplier: 999999999, powerRange: [100000000000000, 999999999999999], stage: 'Divine', desc: 'Source of all Dao; omnipresent consciousness.' }
];

export const DIFFICULTY_PRESETS: Difficulty[] = [
    { name: 'Casual', resourceModifier: 1.5, eventFrequency: 0.2 },
    { name: 'Normal', resourceModifier: 1.0, eventFrequency: 0.4 },
    { name: 'Hard', resourceModifier: 0.7, eventFrequency: 0.6 },
];

export const QUICKSTART_TEMPLATES: QuickstartTemplate[] = [
    { name: 'Martial', description: 'Start with higher strength and more disciples.', bonuses: { strength: 5, disciples: 2 } },
    { name: 'Scholar', description: 'Begin with a higher talent for cultivation.', bonuses: { talent: 10 } },
    { name: 'Merchant', description: 'Found your clan with additional spirit stones.', bonuses: { spiritStones: 100 } },
];

export const TUTORIAL_STEPS: TutorialStep[] = [
    { id: 1, text: 'This is the Patriarch Panel. It shows your current status, including your age, realm, and cultivation progress. Your goal is to guide them to immortality.', targetId: 'patriarch-panel', position: 'right', actionTrigger: 'none' },
    { id: 2, text: 'This is the Chronicles Panel. Important events in your clan\'s history will be recorded here.', targetId: 'chronicles-panel', position: 'left', actionTrigger: 'none' },
    { id: 3, text: 'These are your Clan Resources. Spirit Stones are vital for most actions. Let\'s try to get more powerful.', targetId: 'clan-resources', position: 'bottom', actionTrigger: 'none' },
    { id: 4, text: 'Click "Cultivate" to spend Spirit Stones and increase your Realm Progress. This is the first step to a breakthrough.', targetId: 'cultivate-button', position: 'top', actionTrigger: 'CULTIVATE' },
    { id: 5, text: 'Excellent! Your Qi flows stronger. Time is the ultimate resource. Click "Advance Time" to see how your clan and patriarch grow over a year.', targetId: 'time-control', position: 'top', actionTrigger: 'ADVANCE_TIME' },
    { id: 6, text: 'You have passed a year. Every year, your clan will generate resources and your members will age and cultivate. This concludes the tutorial. Good luck on your path to immortality!', targetId: 'time-control', position: 'top', actionTrigger: 'none' },
];


// --- New Cultivation System Constants ---

export const REALM_DIFFICULTY = [
  50, 100, 300, 800, 2000, 5000, 12000, 30000, 70000, 150000,
  200000, 250000, 350000, 500000, 700000, 1000000, 1500000, 2000000, 3000000, 5000000
];

export const BREAKTHROUGH_BASE_CHANCES = [
    80, 60, 40, 30, 20, 10, 5, 2, 1, 0.8, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.03, 0.02, 0.01
];

export const TRIBULATION_DEATH_CHANCES: { [key: number]: number } = {
    4: 25, // Nascent Soul
    9: 30, // Ascension Realm
    10: 35, // Lower Immortal
    14: 40, // Golden Immortal
    15: 45, // Great Luo Immortal
    16: 50, // Quasi-Saint
    17: 55, // Saint
    18: 60, // Dao Ancestor
};

export const BLOODLINE_LIFE_BONUS: { [key: string]: number } = {
    'Primordial': 0.20,
    'Divine': 0.12,
    'Legendary': 0.08,
    'Rare': 0.04,
    'Normal': 0.00,
};

// --- New Social System Constants ---
export const HARMONY_WEIGHTS = {
    TALENT: 0.3,
    BLOODLINE: 0.3,
    KARMA: 0.2,
    AGE_DIFFERENCE: 0.2,
};

export const DUAL_CULTIVATION_PROGRESS_BONUS = 5;

// --- New Combat System Constants ---
export const TECHNIQUES: Record<string, Technique> = {
    'basic_strike': {
        id: 'basic_strike',
        name: 'Basic Strike',
        description: 'A simple physical attack that costs no Qi.',
        powerMultiplier: 1.0,
        qiCost: 0,
        realmRequired: 0,
    },
    'qi_blast': {
        id: 'qi_blast',
        name: 'Qi Blast',
        description: 'A focused blast of Qi that deals significant damage.',
        powerMultiplier: 1.8,
        qiCost: 15,
        realmRequired: 1,
    }
};

// --- New Crafting System Constants ---
// This has been moved to constants/recipes.ts
// export const RECIPES: Recipe[] = [];