import { TechEffect } from "../types";

export interface Blessing {
  name: string;
  description: string;
  branch: 'Prosperity' | 'Cultivation' | 'Bloodline' | 'War';
  cost: number; // Ancestral Favor
  faithRequired: number;
  requires: string[];
  effect: TechEffect;
}

export const BLESSING_TREE: Record<string, Blessing> = {
  // Prosperity Branch
  prosperity1: {
    name: 'Blessing of Prosperity',
    description: 'The ancestors guide the clan towards wealth, increasing Spirit Stone income.',
    branch: 'Prosperity',
    cost: 100,
    faithRequired: 150,
    requires: [],
    effect: { bonus: { resourceGain: 0.1 } } // +10% Spirit Stone gain
  },
  // Cultivation Branch
  cultivation1: {
    name: 'Blessing of Qi Flow',
    description: 'Ancestral spirits harmonize the surrounding Qi, making cultivation easier.',
    branch: 'Cultivation',
    cost: 150,
    faithRequired: 200,
    requires: [],
    effect: { bonus: { cultivationSpeed: 0.05 } } // +5%
  },
  cultivation2: {
    name: 'Blessing of Serenity',
    description: 'A calm spirit aids in overcoming bottlenecks, increasing breakthrough chance.',
    branch: 'Cultivation',
    cost: 300,
    faithRequired: 400,
    requires: ['cultivation1'],
    effect: { bonus: { breakthroughChance: 0.05 } } // +5% absolute chance
  },
  // Bloodline Branch
  bloodline1: {
    name: 'Blessing of Growth',
    description: 'The ancestral bloodline stirs, increasing the chance of awakening powerful traits in newborns.',
    branch: 'Bloodline',
    cost: 250,
    faithRequired: 300,
    requires: [],
    effect: { bonus: { mutationChance: 0.02 } } // +2%
  },
};

export const OFFERING_TYPES = {
    spiritStones: { name: 'Spirit Stone Offering', cost: 100, faithGain: 10 },
    herbs: { name: 'Herbal Offering', cost: 200, faithGain: 20 },
    artifact: { name: 'Artifact Sacrifice', faithGain: 50 }, // cost is 1 artifact
};

export const CURSES = {
    SILENCE: { 
        name: 'Curse of Silence', 
        description: 'The ancestors have fallen silent. The clan feels a spiritual disconnect.', 
        triggerFaith: 100, 
        effect: { bonus: { cultivationSpeed: -0.1 } } // -10% cultivation speed
    }
};