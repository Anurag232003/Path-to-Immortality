import { REALM_DIFFICULTY, BREAKTHROUGH_BASE_CHANCES, TRIBULATION_DEATH_CHANCES, REALMS } from '../constants';
import { BLOODLINE_TIERS } from '../constants/bloodlines';
import { clamp } from '../utils/helpers';
import { Person } from '../types';

interface ProgressGainParams {
    talent: number;
    techniquesBonus?: number;
    clanBlessing?: number;
    yearsInRealm: number;
    cultivationSpeed?: number;
    realmIndex: number;
    scalar?: number;
    yearsExponent?: number;
}

export function calculateProgressGain({
    talent,
    yearsInRealm,
    realmIndex,
}: Omit<ProgressGainParams, 'cultivationSpeed' | 'scalar' | 'yearsExponent' | 'techniquesBonus' | 'clanBlessing'>,
 totalSpeedBonus: number = 1
): number {
    const rd = REALM_DIFFICULTY[realmIndex];
    if (!rd) return 0;
    
    const yearsExponent = 0.8;
    const scalar = 20;

    const yearsFactor = Math.max(1, Math.pow(Math.max(1, yearsInRealm), yearsExponent));
    const numerator = talent * yearsFactor * totalSpeedBonus * scalar;
    const raw = numerator / rd;
    
    return Math.max(0, raw);
}


interface BreakthroughChanceParams {
    person: Person;
    clanBlessing?: number;
    techniqueBonus?: number;
}

function calculateRealmBreakthroughChance({
    person,
    clanBlessing = 0,
    techniqueBonus = 0,
}: BreakthroughChanceParams) {
    const { realm, talent, karma, effectiveLifespan, buffs } = person;
    const base = BREAKTHROUGH_BASE_CHANCES[realm] || 0.01;
    const talentEffectPerPoint = 0.15;
    const talentBonus = Math.min(30, (talent * talentEffectPerPoint)); 
    const karmaBonus = (karma - 50) * 0.1;
    const realmPenalty = realm * 0.5;

    const breakthroughBuffs = buffs.filter(b => b.type === 'BREAKTHROUGH_CHANCE_MODIFIER');
    const buffBonus = breakthroughBuffs.reduce((sum, b) => sum + b.value, 0);

    const raw = base + talentBonus + karmaBonus + clanBlessing + techniqueBonus + buffBonus - realmPenalty;
    const finalChance = clamp(raw, 0.1, 95);

    const isTribulation = TRIBULATION_DEATH_CHANCES.hasOwnProperty(realm + 1);
    const lifespanResist = isTribulation ? clamp((effectiveLifespan / 10000) * 0.0005, 0, 0.5) : 0;

    return {
        chance: finalChance,
        breakdown: {
            type: 'Realm' as const,
            base,
            talent: talentBonus,
            karma: karmaBonus,
            penalty: realmPenalty,
            final: finalChance,
            isTribulation,
            lifespanResist: lifespanResist * 100, // As a percentage for UI
        }
    };
}

function calculateStageBreakthroughChance({ person }: BreakthroughChanceParams) {
    const base = 98;
    const willpowerBonus = person.willpower / 20;
    const penalty = person.failedBreakthroughs * 5;

    const breakthroughBuffs = person.buffs.filter(b => b.type === 'BREAKTHROUGH_CHANCE_MODIFIER');
    const buffBonus = breakthroughBuffs.reduce((sum, b) => sum + b.value, 0);

    const finalChance = clamp(base + willpowerBonus - penalty + buffBonus, 20, 100);

    return {
        chance: finalChance,
        breakdown: {
            type: 'Stage' as const,
            base,
            willpower: willpowerBonus,
            penalty,
            final: finalChance,
        }
    };
}

export function calculateBreakthroughChance(params: BreakthroughChanceParams) {
    if (params.person.realmStage < 9) {
        return calculateStageBreakthroughChance(params);
    } else {
        return calculateRealmBreakthroughChance(params);
    }
}


export function computeEffectiveLifeYears(person: Person): number {
  const base = REALMS[person.realm].lifespan;
  const bloodline = BLOODLINE_TIERS[person.bloodline.tier];
  // Example multiplier: Mortal x1.0, Minor Spirit x1.1, etc.
  const lifespanMultiplier = 1 + ((bloodline?.cultivationBonus ?? 1.0) - 1.0) * 2;
  
  // Placeholders for future systems
  const ancestralBonus = 0;
  const techniquePct = 0;
  const artifactMultiplier = 1;
  const fateYears = 0;
  const ritualFlat = person.buffs.filter(b => b.type === 'LIFESPAN_MODIFIER').reduce((sum, b) => sum + b.value, 0);

  const fracSum = ancestralBonus + techniquePct;
  const multiplied = base * (1 + fracSum) * artifactMultiplier * lifespanMultiplier;
  const total = Math.floor(multiplied + fateYears + ritualFlat);
  
  const minAllowed = Math.max(Math.floor(base * 0.5), 1);
  return Math.max(minAllowed, total);
}