import { GameState } from "../types";
import { SeededRNG } from "../utils/rng";
import { DIFFICULTY_PRESETS } from "../constants";

export const initialState: GameState = {
    gameStarted: false,
    clan: null,
    patriarchId: null,
    entities: {},
    ancestors: [],
    time: { year: 1, season: 'Spring', day: 1 },
    log: [],
    eventQueue: [],
    activeRandomEvent: null,
    activeCombat: null,
    activeTribulation: null,
    activeShop: null,
    branches: {},
    rng: new SeededRNG('initial'),
    seed: 'initial',
    difficulty: DIFFICULTY_PRESETS[1], // Default to Normal
    tutorial: {
        isActive: false,
        stepIndex: 0,
    },
    activeNarrativePacks: ['CORE'],
    dynasties: {},
    sects: {},
    clans: {},
};