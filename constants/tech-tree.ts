import { TechNode } from '../types';

export const TECH_TREE: Record<string, TechNode> = {
  // Construction Branch
  reinforcedFoundations: {
    id: 'reinforcedFoundations',
    name: 'Reinforced Foundations',
    description: 'Improve building techniques to construct facilities faster.',
    branch: 'Construction & Infrastructure',
    cost: 10,
    requires: [],
    effect: { bonus: { constructionSpeed: 0.2 } } // 20% faster, not yet implemented
  },
  advancedArchitecture: {
    id: 'advancedArchitecture',
    name: 'Advanced Architecture',
    description: 'Unlocks the ability to build and upgrade facilities to Level 2.',
    branch: 'Construction & Infrastructure',
    cost: 25,
    requires: ['reinforcedFoundations'],
    effect: { } // Effect is checked implicitly in reducer/UI
  },

  // Cultivation Branch
  qiGatheringFormations: {
    id: 'qiGatheringFormations',
    name: 'Qi Gathering Formations',
    description: 'Basic arrays that passively increase cultivation speed for all members.',
    branch: 'Cultivation & Dao Studies',
    cost: 20,
    requires: [],
    effect: { bonus: { cultivationSpeed: 0.1 } } // +10%
  },

  // Crafting Branch
  basicAlchemy: {
    id: 'basicAlchemy',
    name: 'Basic Alchemy Theory',
    description: 'Fundamental knowledge required for more complex pill recipes.',
    branch: 'Crafting & Refinement',
    cost: 15,
    requires: [],
    effect: { }
  }
};