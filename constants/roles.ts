export type ElderEffect = 
    | { type: 'RESOURCE_YIELD'; resource: 'herbs' | 'spiritOre' | 'spiritStones' | 'beastCores'; bonus: number }
    | { type: 'POINT_YIELD'; resource: 'researchPoints' | 'constructionPoints'; bonus: number }
    | { type: 'CRAFTING_SUCCESS'; craftType: 'alchemy' | 'forging'; bonus: number }
    | { type: 'CLAN_DEFENSE'; bonus: number }
    | { type: 'CLAN_REPUTATION'; bonus: number };

export interface ElderRole {
    name: string;
    description: string;
    effects: ElderEffect[];
}

export const ELDER_ROLES: Record<string, ElderRole> = {
    'Combat Elder': {
        name: 'Combat Elder',
        description: 'Oversees martial training and war strategy.',
        effects: [
            { type: 'CLAN_DEFENSE', bonus: 0.1 } // Placeholder for now
        ]
    },
    'Spirit Elder': {
        name: 'Spirit Elder',
        description: 'Manages spirit beast contracts, Qi veins, and ancestral rites.',
        effects: [
            { type: 'RESOURCE_YIELD', resource: 'herbs', bonus: 0.15 }, // +15% herbs
            { type: 'RESOURCE_YIELD', resource: 'beastCores', bonus: 0.1 } // +10% beast cores
        ]
    },
    'Alchemy Elder': {
        name: 'Alchemy Elder',
        description: 'Expert in medicine and pill creation.',
        effects: [
            { type: 'CRAFTING_SUCCESS', craftType: 'alchemy', bonus: 0.1 } // Placeholder
        ]
    },
    'Formation Elder': {
        name: 'Formation Elder',
        description: 'Master of arrays and defensive barriers.',
        effects: [
            { type: 'CLAN_DEFENSE', bonus: 0.2 } // Placeholder
        ]
    },
    'Law Elder': {
        name: 'Law Elder',
        description: 'Handles internal justice, punishments, and discipline.',
        effects: [
            { type: 'CLAN_REPUTATION', bonus: 1 } // +1 flat reputation per year
        ]
    }
};
