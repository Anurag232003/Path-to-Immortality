import { Dynasty, Sect, ClanInfo, Person } from '../types';
import { SeededRNG } from '../utils/rng';
import { getTalentGrade } from '../utils/helpers';
import { computeEffectiveLifeYears } from './cultivationLogic';
import { BLOODLINE_LIBRARY, PHYSIQUE_LIBRARY } from '../constants/bloodlines';
import { DYNASTY_DEFINITIONS, SECT_DEFINITIONS, CLAN_DEFINITIONS } from '../constants/world-definitions';
import { MALE_NAMES, FEMALE_NAMES, CLAN_SURNAMES } from '../constants/names';

let nextId = 0;
const getUniqueId = () => `entity_${Date.now()}_${nextId++}`;


export function makeStructure(rng: SeededRNG): {
  dynasties: Record<string, Dynasty>;
  sects: Record<string, Sect>;
  clans: Record<string, ClanInfo>;
} {
  const dynasties: Record<string, Dynasty> = {};
  const sects: Record<string, Sect> = {};
  const clans: Record<string, ClanInfo> = {};

  const shuffledDynasties = [...DYNASTY_DEFINITIONS].sort(() => rng.next() - 0.5);

  for (let d = 0; d < 25; d++) {
    const dynDef = shuffledDynasties[d];
    const dynId = `dyn_${d}`;
    dynasties[dynId] = { id: dynId, name: dynDef.name, description: dynDef.description, sectIds: [] };
    
    for (let s = 0; s < 3; s++) {
      const sectDef = rng.choice(SECT_DEFINITIONS);
      const sectId = `sect_${d * 3 + s}`;
      sects[sectId] = { id: sectId, name: sectDef.name, description: sectDef.description, dynastyId: dynId, clanIds: [] };
      dynasties[dynId].sectIds.push(sectId);
    }
  }

  const sectIds = Object.keys(sects);
  // Use a copy of surnames to ensure uniqueness for NPC clans
  const availableSurnames = [...CLAN_SURNAMES].sort(() => rng.next() - 0.5);

  for (let i = 0; i < 75; i++) {
    const sect = sects[sectIds[i]];
    const clanSurname = availableSurnames.pop() || `Clan${i}`;
    const clanDef = rng.choice(CLAN_DEFINITIONS); // For description and affinity
    const clanId = `clan_${Object.keys(clans).length}`;
    clans[clanId] = { id: clanId, name: `${clanSurname} Clan`, description: clanDef.description, sectId: sect.id, relation: rng.nextInt(-10, 40), affinity: clanDef.affinity || 'None', alliances: [] };
    sect.clanIds.push(clanId);
  }

  for (let r = 0; r < 25; r++) {
    const sect = sects[sectIds[r]];
    const clanSurname = availableSurnames.pop() || `ExtraClan${r}`;
    const clanDef = rng.choice(CLAN_DEFINITIONS);
    const clanId = `clan_${Object.keys(clans).length}`;
    clans[clanId] = { id: clanId, name: `${clanSurname} Clan`, description: clanDef.description, sectId: sect.id, relation: rng.nextInt(-10, 40), affinity: clanDef.affinity || 'None', alliances: [] };
    sect.clanIds.push(clanId);
  }

  return { dynasties, sects, clans };
}

export function generateWorldPopulation(
    worldClans: Record<string, ClanInfo>,
    playerClanId: string,
    worldSects: Record<string, Sect>,
    worldDynasties: Record<string, Dynasty>,
    rng: SeededRNG
): Record<string, Person> {
    const population: Record<string, Person> = {};

    for (const clanId in worldClans) {
        if (clanId === playerClanId) continue;

        const clanInfo = worldClans[clanId];
        const sectInfo = worldSects[clanInfo.sectId];
        const numMembers = rng.nextInt(1, 4); // 1-3 members per NPC clan
        const clanSurname = clanInfo.name.replace(' Clan', '');

        for(let i = 0; i < numMembers; i++) {
            const id = getUniqueId();
            const gender = rng.choice(['Male', 'Female'] as const);
            const firstName = rng.choice(gender === 'Male' ? MALE_NAMES : FEMALE_NAMES);
            const name = `${firstName} ${clanSurname}`;
            const talent = rng.nextInt(10, 70);
            const talentGrade = getTalentGrade(talent);
            const age = rng.nextInt(16, 60);
            const strength = rng.nextInt(2, 8);
            const willpower = rng.nextInt(3, 10);
            const isPatriarch = i === 0; // First generated member is the patriarch

            let person: Person = {
                id, name, age, gender, talent,
                clanId: clanInfo.id,
                sectId: sectInfo.id,
                dynastyId: sectInfo.dynastyId,
                birthYear: 1 - age,
                alive: true,
                realm: 0, realmStage: 1, realmProgress: 0, cultivation: 1, strength, willpower, karma: 50,
                defense: rng.nextInt(1, 5),
                agility: rng.nextInt(1, 5),
                focus: rng.nextInt(1, 5),
                endurance: rng.nextInt(1, 5),
                yearsInRealm: 0, failedBreakthroughs: 0, qiDeviation: false,
                effectiveLifespan: 0, // temp
                cultivationSpeed: talentGrade.speed, maxRealmPotential: talentGrade.maxRealm,
                talentGrade: talentGrade.name, 
                bloodline: { id: 'mortal_blood', tier: 1, name: BLOODLINE_LIBRARY['mortal_blood'].name },
                physique: { id: 'normal_physique', name: PHYSIQUE_LIBRARY['normal_physique'].name, tier: 1 },
                luck: rng.nextInt(0, 101),
                generation: 1, parentIds: [], childrenIds: [], spouseIds: [],
                isYoungHead: false, isElder: false, isPatriarch,
                affection: {}, charisma: rng.nextInt(20, 81), loyalty: 50, ambition: 30,
                leadership: rng.nextInt(10, 41),
                buffs: [],
                maxHealth: 50 + strength * 5, health: 0,
                maxQi: 50 + willpower * 2, qi: 0,
                techniques: ['basic_strike'],
                equipment: { weapon: null, armor: null, accessory: null, relic: null },
            };
            person.health = person.maxHealth;
            person.qi = person.maxQi;
            person.effectiveLifespan = computeEffectiveLifeYears(person);
            population[id] = person;
        }
    }
    return population;
}