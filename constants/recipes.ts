import { Recipe } from '../types';
import { PILL_LIBRARY } from './pills';
import { ARTIFACT_LIBRARY } from './artifacts';

export const RECIPES: Recipe[] = [
    // --- PILLS ---
    {
        id: 'qi_condensation_pellet',
        name: 'Qi Condensation Pellet',
        description: PILL_LIBRARY['qi_condensation_pellet'].description,
        inputs: [{ id: 'herbs', qty: 10 }],
        output: {
            type: 'pill',
            qty: 1,
            item: PILL_LIBRARY['qi_condensation_pellet'],
        },
        facility: 'alchemyFurnace',
        requiredLevel: 1,
        successBase: 80,
    },
    {
        id: 'meridian_cleansing_pill',
        name: 'Meridian Cleansing Pill',
        description: PILL_LIBRARY['meridian_cleansing_pill'].description,
        inputs: [{ id: 'herbs', qty: 25 }, { id: 'spiritStones', qty: 20 }],
        output: {
            type: 'pill',
            qty: 1,
            item: PILL_LIBRARY['meridian_cleansing_pill'],
        },
        facility: 'alchemyFurnace',
        requiredLevel: 1,
        successBase: 70,
    },
     {
        id: 'spirit_focus_pill',
        name: 'Spirit Focus Pill',
        description: PILL_LIBRARY['spirit_focus_pill'].description,
        inputs: [{ id: 'herbs', qty: 50 }, { id: 'beastCores', qty: 1 }],
        output: {
            type: 'pill',
            qty: 1,
            item: PILL_LIBRARY['spirit_focus_pill'],
        },
        facility: 'alchemyFurnace',
        requiredLevel: 2,
        successBase: 65,
    },
    {
        id: 'heavenly_fertility_pill',
        name: 'Heavenly Fertility Pill',
        description: PILL_LIBRARY['heavenly_fertility_pill'].description,
        inputs: [{ id: 'herbs', qty: 200 }, { id: 'beastCores', qty: 10 }, { id: 'spiritStones', qty: 500 }],
        output: {
            type: 'pill',
            qty: 1,
            item: PILL_LIBRARY['heavenly_fertility_pill'],
        },
        facility: 'alchemyFurnace',
        requiredLevel: 3,
        successBase: 40,
    },
    {
        id: 'golden_core_stabilizer',
        name: 'Golden Core Stabilizer',
        description: PILL_LIBRARY['golden_core_stabilizer'].description,
        inputs: [{ id: 'herbs', qty: 150 }, { id: 'spiritOre', qty: 50 }, { id: 'beastCores', qty: 5 }],
        output: {
            type: 'pill',
            qty: 1,
            item: PILL_LIBRARY['golden_core_stabilizer'],
        },
        facility: 'alchemyFurnace',
        requiredLevel: 3,
        successBase: 50,
    },
    // --- ARTIFACTS ---
    {
        id: 'ironclad_shield',
        name: 'Ironclad Shield',
        description: 'Standard-issue sect defense tool; dependable and easy to repair.',
        inputs: [
            { id: 'spiritOre', qty: 30 },
            { id: 'spiritStones', qty: 20 }
        ],
        output: {
            type: 'artifact',
            qty: 1,
            item: ARTIFACT_LIBRARY['ironclad_shield'],
        },
        facility: 'forgePavilion',
        requiredLevel: 1,
        successBase: 70,
    },
    {
        id: 'flameheart_saber',
        name: 'Flameheart Saber',
        description: 'Forged within the breath of a Fire Roc, this saber channels the user’s rage into blinding flame arcs.',
        inputs: [
            { id: 'spiritOre', qty: 150 },
            { id: 'beastCores', qty: 10 }
        ],
        output: {
            type: 'artifact',
            qty: 1,
            item: ARTIFACT_LIBRARY['flameheart_saber'],
        },
        facility: 'forgePavilion',
        requiredLevel: 2,
        successBase: 40,
    }
];