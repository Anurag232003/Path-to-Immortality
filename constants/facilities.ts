import { Facilities } from '../types';

export interface FacilityLevelData {
  cost: {
    spiritStones: number;
    constructionPoints: number;
    spiritOre?: number;
    herbs?: number;
  };
  buildTime: number; // in years
  upkeep: number;
  effectDescription: string;
}

export type FacilityData = {
  name: string;
  description: string;
  levels: FacilityLevelData[];
};

export const FACILITIES_DATA: Record<keyof Facilities, FacilityData> = {
  meditationHall: {
    name: 'Meditation Hall',
    description: 'Increases cultivation efficiency for all clan members.',
    levels: [
      { cost: { spiritStones: 0, constructionPoints: 0 }, buildTime: 0, upkeep: 5, effectDescription: "+5% cultivation speed." },
      { cost: { spiritStones: 200, constructionPoints: 50 }, buildTime: 1, upkeep: 10, effectDescription: "+10% cultivation speed." },
      { cost: { spiritStones: 500, constructionPoints: 120 }, buildTime: 2, upkeep: 25, effectDescription: "+18% cultivation speed." },
    ]
  },
  herbGarden: {
    name: 'Herb Garden',
    description: 'Generates Spirit Herbs each year.',
    levels: [
      { cost: { spiritStones: 0, constructionPoints: 0 }, buildTime: 0, upkeep: 5, effectDescription: "+5 Herbs/year." },
      { cost: { spiritStones: 150, constructionPoints: 40 }, buildTime: 1, upkeep: 10, effectDescription: "+12 Herbs/year." },
      { cost: { spiritStones: 400, constructionPoints: 100 }, buildTime: 2, upkeep: 20, effectDescription: "+25 Herbs/year." },
    ]
  },
  ancestralHall: {
    name: 'Ancestral Hall',
    description: 'Generates Research Points (RP) from studying ancient texts.',
    levels: [
      { cost: { spiritStones: 0, constructionPoints: 0 }, buildTime: 0, upkeep: 10, effectDescription: "+2 RP/year." },
      { cost: { spiritStones: 300, constructionPoints: 80 }, buildTime: 2, upkeep: 20, effectDescription: "+5 RP/year." },
      { cost: { spiritStones: 800, constructionPoints: 200 }, buildTime: 3, upkeep: 40, effectDescription: "+12 RP/year." },
    ]
  },
  alchemyFurnace: {
    name: 'Alchemy Furnace',
    description: 'Allows for the crafting of pills. Higher levels unlock better recipes and increase success rates.',
    levels: [
      { cost: { spiritStones: 0, constructionPoints: 0 }, buildTime: 0, upkeep: 8, effectDescription: "Basic pill crafting." },
      { cost: { spiritStones: 250, constructionPoints: 60, spiritOre: 20 }, buildTime: 1, upkeep: 15, effectDescription: "Improved pill crafting." },
      { cost: { spiritStones: 600, constructionPoints: 150, spiritOre: 50 }, buildTime: 2, upkeep: 30, effectDescription: "Advanced pill crafting." },
    ]
  },
  forgePavilion: {
    name: 'Forge Pavilion',
    description: 'Allows for the crafting of artifacts. Higher levels unlock better recipes and increase success rates.',
    levels: [
      { cost: { spiritStones: 0, constructionPoints: 0 }, buildTime: 0, upkeep: 8, effectDescription: "Basic artifact forging." },
      { cost: { spiritStones: 250, constructionPoints: 60, spiritOre: 50 }, buildTime: 1, upkeep: 15, effectDescription: "Improved artifact forging." },
      { cost: { spiritStones: 600, constructionPoints: 150, spiritOre: 120 }, buildTime: 2, upkeep: 30, effectDescription: "Advanced artifact forging." },
    ]
  },
  clanTemple: {
    name: 'Clan Temple',
    description: 'Generates Construction Points (CP) and increases clan reputation.',
    levels: [
      { cost: { spiritStones: 0, constructionPoints: 0 }, buildTime: 0, upkeep: 10, effectDescription: "+5 CP/year. +1 Reputation/year." },
      { cost: { spiritStones: 400, constructionPoints: 100 }, buildTime: 2, upkeep: 20, effectDescription: "+12 CP/year. +3 Reputation/year." },
      { cost: { spiritStones: 1000, constructionPoints: 250 }, buildTime: 3, upkeep: 50, effectDescription: "+25 CP/year. +7 Reputation/year." },
    ]
  }
};