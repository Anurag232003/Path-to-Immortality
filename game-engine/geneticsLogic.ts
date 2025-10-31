import { Person, Clan } from '../types';
import { SeededRNG } from '../utils/rng';
import { getTalentGrade, clamp } from '../utils/helpers';
import { computeEffectiveLifeYears } from './cultivationLogic';
import { BLOODLINE_LIBRARY, PHYSIQUE_LIBRARY } from '../constants/bloodlines';
import { MALE_NAMES, FEMALE_NAMES, GENERATIONAL_TITLES } from '../constants/names';

const getUniqueId = () => `entity_${Date.now()}_${Math.random()}`;

export function generateChild(parentA: Person, parentB: Person, clan: Clan, clanYear: number, rng: SeededRNG, compatibilityScore: number, mutationBonus: number = 0, hasLivingAncestor: boolean = false): Person {
    const isBlessed = parentA.blessedByAncestor || parentB.blessedByAncestor || hasLivingAncestor;
    
    // 1. Determine Talent
    const base = parentA.talent * 0.45 + parentB.talent * 0.45;
    const noise = rng.nextNormal() * 5; 
    const compatibilityBonus = (compatibilityScore - 50) / 10; // -5 to +5 bonus
    let talent = Math.floor(clamp(base + noise + compatibilityBonus, 1, 100));
    if (isBlessed) talent = Math.floor(clamp(talent * 1.2 + 10, 1, 100)); // Blessing bonus

    // 2. Determine Bloodline
    const strongerParent = parentA.bloodline.tier >= parentB.bloodline.tier ? parentA : parentB;
    const weakerParent = parentA.bloodline.tier < parentB.bloodline.tier ? parentA : parentB;
    
    const compatibilityRollModifier = (compatibilityScore - 50) / 200; // -0.25 to +0.25
    const blessedMutationBonus = isBlessed ? 0.15 : 0; // 15% extra mutation chance if blessed
    const baseMutationChance = 0.1;
    const roll = rng.next() - compatibilityRollModifier - mutationBonus - blessedMutationBonus;

    let childBloodline: { id: string; tier: number; name: string; };

    if (roll > baseMutationChance) { // Inheritance
        if (rng.next() < 0.6) { // 60% chance for stronger parent's bloodline
            childBloodline = { ...strongerParent.bloodline };
        } else { // 40% for weaker
            childBloodline = { ...weakerParent.bloodline };
        }
    } else { // Mutation
        const maxTier = Math.min(strongerParent.bloodline.tier + (isBlessed ? 2 : 1), 7);
        const possibleMutations = Object.values(BLOODLINE_LIBRARY).filter(b => 
            b.tier <= maxTier && b.tier >= weakerParent.bloodline.tier && b.id !== 'mortal_blood'
        );
        
        if (possibleMutations.length > 0) {
            const mutation = rng.choice(possibleMutations);
            childBloodline = { id: mutation.id, tier: mutation.tier, name: mutation.name };
        } else {
            // fallback to stronger parent if no valid mutation found
            childBloodline = { ...strongerParent.bloodline };
        }
    }
    
    // 3. Determine Physique
    const strongerPhysiqueParent = parentA.physique.tier >= parentB.physique.tier ? parentA : parentB;
    const blessedPhysiqueMutationBonus = isBlessed ? 0.25 : 0; // 25% extra mutation chance if blessed
    const physiqueMutationChance = 0.2;
    const physiqueRoll = rng.next() - mutationBonus - blessedPhysiqueMutationBonus;

    let childPhysique: { id: string; name: string; tier: number };

    if (physiqueRoll > physiqueMutationChance) { // Inheritance
        if (rng.next() < 0.6) { // 60% chance for stronger parent's physique
            childPhysique = { ...strongerPhysiqueParent.physique };
        } else { // 40% for weaker
            childPhysique = { ...parentB.physique };
        }
    } else { // Mutation
        const maxTier = Math.min(strongerPhysiqueParent.physique.tier + (isBlessed ? 2 : 1), 7);
        const possibleMutations = Object.values(PHYSIQUE_LIBRARY).filter(p =>
            p.tier <= maxTier && p.tier > 1 // a mutation is never to a normal physique
        );
        if (possibleMutations.length > 0) {
            const mutation = rng.choice(possibleMutations);
            childPhysique = { id: mutation.id, tier: mutation.tier, name: mutation.name };
        } else {
            childPhysique = { ...strongerPhysiqueParent.physique };
        }
    }
    
    // Final Person Object
    const talentGrade = getTalentGrade(talent);
    const gender = rng.choice(['Male', 'Female'] as const);

    // --- Naming Logic ---
    const firstName = rng.choice(gender === 'Male' ? MALE_NAMES : FEMALE_NAMES);
    const surname = clan.name.replace(' Clan', '');
    const generation = Math.max(parentA.generation, parentB.generation) + 1;
    const title = GENERATIONAL_TITLES[Math.min(generation - 1, GENERATIONAL_TITLES.length - 1)] || '';
    const fullName = `${firstName} ${surname}${title ? ` ${title}` : ''}`;


    const childId = getUniqueId();
    const strength = Math.floor((parentA.strength + parentB.strength) / 2 + rng.nextNormal() * 2);
    const willpower = Math.floor((parentA.willpower + parentB.willpower) / 2 + rng.nextNormal() * 2);
    const defense = Math.floor((parentA.defense + parentB.defense) / 2 + rng.nextNormal() * 2);
    const agility = Math.floor((parentA.agility + parentB.agility) / 2 + rng.nextNormal() * 2);
    const focus = Math.floor((parentA.focus + parentB.focus) / 2 + rng.nextNormal() * 2);
    const endurance = Math.floor((parentA.endurance + parentB.endurance) / 2 + rng.nextNormal() * 2);
    const leadership = Math.floor(clamp((parentA.leadership + parentB.leadership) / 2 + rng.nextNormal() * 2, 5, 50));

    let child: Person = {
        id: childId,
        name: fullName,
        age: 0,
        birthYear: clanYear,
        gender,
        alive: true,
        realm: 0,
        realmStage: 1,
        realmProgress: 0,
        cultivation: 1,
        strength,
        willpower,
        defense,
        agility,
        focus,
        endurance,
        karma: 50,
        talent,
        yearsInRealm: 0,
        failedBreakthroughs: 0,
        qiDeviation: false,
        effectiveLifespan: 0, // temp value
        cultivationSpeed: talentGrade.speed,
        maxRealmPotential: talentGrade.maxRealm,
        talentGrade: talentGrade.name,
        bloodline: childBloodline,
        physique: childPhysique,
        luck: rng.nextInt(0, 101),
        generation: generation,
        parentIds: [parentA.id, parentB.id],
        childrenIds: [],
        spouseIds: [],
        clanId: parentA.clanId,
        sectId: parentA.sectId,
        dynastyId: parentA.dynastyId,
        isYoungHead: false,
        isElder: false,
        affection: {},
        charisma: rng.nextInt(20, 81),
        loyalty: 50,
        ambition: 30,
        leadership,
        buffs: [],
        maxHealth: 50 + strength * 5,
        health: 0,
        maxQi: 50 + willpower * 2,
        qi: 0,
        techniques: ['basic_strike'],
        equipment: { weapon: null, armor: null, accessory: null, relic: null },
    };
    child.health = child.maxHealth;
    child.qi = child.maxQi;
    child.effectiveLifespan = computeEffectiveLifeYears(child);
    return child;
}