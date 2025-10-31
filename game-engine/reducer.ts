import { GameState, GameAction, Person, Clan, GameEvent, Ancestor, RandomEvent, Facilities, Artifact, Pill, Buff, AllianceType, ShopItem, Branch } from '../types';
import { initialState } from './initialState';
import { getTalentGrade, addLog } from '../utils/helpers';
import { SeededRNG } from '../utils/rng';
import { REALMS, CLAN_RANKS, TUTORIAL_STEPS, TRIBULATION_DEATH_CHANCES } from '../constants';
import { BLOODLINE_LIBRARY, PHYSIQUE_LIBRARY } from '../constants/bloodlines';
import { RECIPES } from '../constants/recipes';
import { FACILITIES_DATA } from '../constants/facilities';
import { TECH_TREE } from '../constants/tech-tree';
import { BLESSING_TREE, OFFERING_TYPES } from '../constants/ancestralHall';
import { NARRATIVE_PACKS } from '../constants/events';
import { ARTIFACT_LIBRARY } from '../constants/artifacts';
import { MALE_NAMES, FEMALE_NAMES, CLAN_SURNAMES } from '../constants/names';
import { advanceYear, resolveBreakthrough } from './coreLogic';
import { computeEffectiveLifeYears } from './cultivationLogic';
import { makeStructure, generateWorldPopulation } from './worldLogic';
import { processCombatTurn } from './combatLogic';
import { calculateCompatibility } from './socialLogic';
import { ELDER_ROLES } from '../constants/roles';

let nextId = 0;
const getUniqueId = () => `entity_${Date.now()}_${nextId++}`;

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      const { name, difficulty, template, startTutorial, seed } = action.payload;
      const rng = new SeededRNG(seed);

      // --- World Generation ---
      const world = makeStructure(rng);
      const playerClanInfo = rng.choice(Object.values(world.clans));
      const playerSect = world.sects[playerClanInfo.sectId];
      const playerDynasty = world.dynasties[playerSect.dynastyId];
      const worldPopulation = generateWorldPopulation(world.clans, playerClanInfo.id, world.sects, world.dynasties, rng);

      // --- Naming System ---
      const clanSurname = rng.choice(CLAN_SURNAMES);
      const patriarchFirstName = name;
      const patriarchFullName = `${patriarchFirstName} ${clanSurname}`;


      const startingTalent = rng.nextInt(30, 71) + (template.bonuses.talent || 0);
      const talentGrade = getTalentGrade(startingTalent);
      const startingAge = rng.nextInt(18, 39);
      const startingStrength = rng.nextInt(3, 12) + (template.bonuses.strength || 0);
      const startingWillpower = rng.nextInt(5, 16);
      
      const patriarchId = getUniqueId();
      let newPatriarch: Person = {
        id: patriarchId, name: patriarchFullName, age: startingAge, realm: 0, realmStage: 1, realmProgress: 0,
        cultivation: rng.nextInt(5, 16),
        strength: startingStrength,
        defense: rng.nextInt(2, 8),
        agility: rng.nextInt(2, 8),
        focus: rng.nextInt(2, 8),
        endurance: rng.nextInt(2, 8),
        willpower: startingWillpower,
        karma: rng.nextInt(40, 71),
        alive: true, talent: startingTalent,
        yearsInRealm: 0, failedBreakthroughs: 0, qiDeviation: false,
        effectiveLifespan: 0, // temp value
        cultivationSpeed: talentGrade.speed, maxRealmPotential: talentGrade.maxRealm,
        talentGrade: talentGrade.name, 
        bloodline: { id: 'mortal_blood', tier: 1, name: BLOODLINE_LIBRARY['mortal_blood'].name },
        physique: { id: 'normal_physique', name: PHYSIQUE_LIBRARY['normal_physique'].name, tier: 1 },
        luck: rng.nextInt(0, 101),
        generation: 1, gender: rng.choice(['Male', 'Female'] as const), birthYear: 1 - startingAge,
        parentIds: [], childrenIds: [], spouseIds: [],
        clanId: playerClanInfo.id, sectId: playerSect.id, dynastyId: playerDynasty.id,
        isYoungHead: false, isElder: false, isPatriarch: true,
        affection: {}, charisma: rng.nextInt(20, 81), loyalty: 50, ambition: 30,
        leadership: rng.nextInt(30, 61),
        patriarchTrait: rng.choice(['Wise', 'Tyrant', 'Ascetic'] as const),
        buffs: [],
        health: 0, maxHealth: 50 + startingStrength * 5,
        qi: 0, maxQi: 50 + startingWillpower * 2,
        techniques: ['basic_strike', 'qi_blast'],
        equipment: { weapon: null, armor: null, accessory: null, relic: null },
      };
      newPatriarch.health = newPatriarch.maxHealth;
      newPatriarch.qi = newPatriarch.maxQi;

      const spouseId = getUniqueId();
      const spouseGender = newPatriarch.gender === 'Male' ? 'Female' : 'Male';
      const spouseFirstName = rng.choice(spouseGender === 'Male' ? MALE_NAMES : FEMALE_NAMES);
      const spouseFullName = `${spouseFirstName} ${clanSurname}`;

      const spouseTalent = rng.nextInt(20, 61);
      const spouseTalentGrade = getTalentGrade(spouseTalent);
      const spouseAge = rng.nextInt(18, Math.max(19, startingAge));
      const spouseStrength = rng.nextInt(2, 8);
      const spouseWillpower = rng.nextInt(3, 10);
      let spouse: Person = {
        id: spouseId,
        name: spouseFullName,
        age: spouseAge,
        birthYear: 1 - spouseAge,
        gender: spouseGender,
        alive: true,
        realm: 0, realmStage: 1, realmProgress: 0, cultivation: 1, strength: spouseStrength, willpower: spouseWillpower, karma: 50,
        defense: rng.nextInt(1, 5),
        agility: rng.nextInt(1, 5),
        focus: rng.nextInt(1, 5),
        endurance: rng.nextInt(1, 5),
        talent: spouseTalent,
        yearsInRealm: 0, failedBreakthroughs: 0, qiDeviation: false,
        effectiveLifespan: 0, // temp value
        cultivationSpeed: spouseTalentGrade.speed,
        maxRealmPotential: spouseTalentGrade.maxRealm,
        talentGrade: spouseTalentGrade.name,
        bloodline: { id: 'mortal_blood', tier: 1, name: BLOODLINE_LIBRARY['mortal_blood'].name },
        physique: { id: 'normal_physique', name: PHYSIQUE_LIBRARY['normal_physique'].name, tier: 1 },
        luck: rng.nextInt(0, 101),
        generation: 1,
        parentIds: [], childrenIds: [], spouseIds: [patriarchId],
        clanId: playerClanInfo.id, sectId: playerSect.id, dynastyId: playerDynasty.id,
        isYoungHead: false, isElder: false,
        affection: {}, charisma: rng.nextInt(20, 81), loyalty: 50, ambition: 30,
        leadership: rng.nextInt(10, 31),
        buffs: [],
        health: 0, maxHealth: 50 + spouseStrength * 5,
        qi: 0, maxQi: 50 + spouseWillpower * 2,
        techniques: ['basic_strike'],
        equipment: { weapon: null, armor: null, accessory: null, relic: null },
      };
      spouse.health = spouse.maxHealth;
      spouse.qi = spouse.maxQi;
      newPatriarch.spouseIds = [spouseId];

      const startingAffection = rng.nextInt(40, 71);
      newPatriarch.affection[spouseId] = startingAffection;
      spouse.affection[patriarchId] = startingAffection;

      // Calculate effective lifespan after objects are created
      newPatriarch.effectiveLifespan = computeEffectiveLifeYears(newPatriarch);
      spouse.effectiveLifespan = computeEffectiveLifeYears(spouse);

      // Create starting artifact
      const starterShieldId = `ironclad_shield_${getUniqueId()}`;
      const starterShield: Artifact = {
        id: starterShieldId,
        ...ARTIFACT_LIBRARY.ironclad_shield,
        boundTo: patriarchId,
      };
      newPatriarch.equipment.armor = starterShieldId;


      const newClan: Clan = {
        id: playerClanInfo.id,
        name: `${clanSurname} Clan`,
        reputation: rng.nextInt(5, 26),
        spiritStones: rng.nextInt(50, 151) + (template.bonuses.spiritStones || 0),
        herbs: rng.nextInt(25, 76),
        spiritOre: rng.nextInt(10, 51),
        beastCores: rng.nextInt(0, 5),
        pills: {},
        artifacts: { [starterShieldId]: starterShield },
        disciples: rng.nextInt(3, 9) + (template.bonuses.disciples || 0),
        territory: 1,
        fateEnergy: rng.nextInt(75, 126),
        ancestralFavor: 0,
        diplomaticGrace: 200,
        ancestralFaith: 150,
        unlockedBlessings: [],
        activeCurse: null,
        branchTributeLastYear: 0,
        facilities: {
          meditationHall: { level: 1, wear: 0, efficiency: 100 },
          herbGarden: { level: 1, wear: 0, efficiency: 100 },
          ancestralHall: { level: 1, wear: 0, efficiency: 100 },
          alchemyFurnace: { level: 1, wear: 0, efficiency: 100 },
          forgePavilion: { level: 1, wear: 0, efficiency: 100 },
          clanTemple: { level: 1, wear: 0, efficiency: 100 },
        },
        constructionPoints: 50,
        researchPoints: 0,
        constructionQueue: [],
        unlockedTechs: [],
        alliances: [],
      };
      
      const newState: GameState = {
          ...initialState,
          gameStarted: true,
          clan: newClan,
          patriarchId,
          entities: { ...worldPopulation, [patriarchId]: newPatriarch, [spouseId]: spouse },
          rng,
          seed,
          difficulty,
          tutorial: { isActive: startTutorial, stepIndex: 0 },
          dynasties: world.dynasties,
          sects: world.sects,
          clans: world.clans,
      };

      let loggedState = { ...newState, log: addLog(newState, `The ${newClan.name} is founded! May your descendants reach immortality.`, 'legendary')};
      loggedState = { ...loggedState, log: addLog(loggedState, `Founding Patriarch ${patriarchFullName} has ${startingTalent} talent (${talentGrade.name} grade).`, 'success')};
      
      return loggedState;
    }

    case 'CULTIVATE': {
        if (!state.clan || !state.patriarchId) return state;
        const patriarch = state.entities[state.patriarchId];
        if (state.clan.spiritStones < 10) {
            return { ...state, log: addLog(state, "Not enough Spirit Stones to cultivate!", 'warning') };
        }
        
        const newPatriarch = { ...patriarch, cultivation: patriarch.cultivation + 5, realmProgress: patriarch.realmProgress + 10 };
        const newClan = { ...state.clan, spiritStones: state.clan.spiritStones - 10 };

        let newState = { ...state, clan: newClan, entities: { ...state.entities, [state.patriarchId]: newPatriarch }, log: addLog(state, "You enter closed-door cultivation. Your qi flows stronger.", 'success') };

        if (state.tutorial.isActive && TUTORIAL_STEPS[state.tutorial.stepIndex]?.actionTrigger === 'CULTIVATE') {
             newState = gameReducer(newState, { type: 'ADVANCE_TUTORIAL' });
        }
        return newState;
    }

    case 'ADVANCE_TIME': {
        let newState = state;
        for (let i = 0; i < action.payload.years; i++) {
            newState = advanceYear(newState);
        }
         if (state.tutorial.isActive && TUTORIAL_STEPS[state.tutorial.stepIndex]?.actionTrigger === 'ADVANCE_TIME') {
             newState = gameReducer(newState, { type: 'ADVANCE_TUTORIAL' });
        }
        return newState;
    }

    case 'ATTEMPT_BREAKTHROUGH': {
        if (!state.patriarchId) return state;
        const patriarch = state.entities[state.patriarchId];
        
        if (patriarch.realmProgress < 100) {
            return { ...state, log: addLog(state, "Not enough Realm Progress to attempt a breakthrough!", 'warning') };
        }

        // Check for tribulation only on Realm breakthroughs (stage 9)
        const isTribulation = patriarch.realmStage === 9 && TRIBULATION_DEATH_CHANCES.hasOwnProperty(patriarch.realm + 1);
        if (isTribulation) {
            return gameReducer(state, { type: 'START_TRIBULATION', payload: { personId: state.patriarchId } });
        }

        return resolveBreakthrough(state, state.patriarchId);
    }
    
    case 'START_TRIBULATION': {
        const { personId } = action.payload;
        const person = state.entities[personId];
        if (!person) return state;

        const tribulationState = {
            personId,
            type: 'Lightning' as const,
            waves: 5,
            currentWave: 1,
            baseSuccessChance: 50,
        };

        return {
            ...state,
            activeTribulation: tribulationState,
            log: addLog(state, `⚡️ ${person.name} is about to face a Heavenly Tribulation!`, 'legendary'),
        };
    }
    
    case 'RESOLVE_TRIBULATION': {
        if (!state.activeTribulation) return state;
        const { personId } = state.activeTribulation;
        const person = state.entities[personId];
        
        // This is a simplified chance calculation based on minigame performance
        const performanceBonus = (action.payload.successRate - 0.5) * 40; // a multiplier from -20 to +20
        const finalChance = state.activeTribulation.baseSuccessChance + performanceBonus;

        let newState = { ...state, activeTribulation: null }; // End tribulation first

        if (state.rng.next() * 100 < finalChance) {
            // Success! We can reuse the normal breakthrough logic for the stat updates
            newState = resolveBreakthrough(newState, personId, true); // Pass a flag to indicate tribulation success
            newState.log = addLog(newState, `${person.name} has triumphed over the heavens and ascended!`, 'legendary');
        } else {
            // Failure
            newState.log = addLog(newState, `The heavens are merciless. ${person.name} has been struck down by the tribulation!`, 'danger');
            const deadPerson = { ...person, alive: false };
            if (person.isPatriarch || person.isLivingAncestor) {
                const newAncestor: Ancestor = {
                    name: person.name, realm: person.realm, generation: person.generation,
                    age: Math.floor(person.age), talent: person.talent, soulTablet: true,
                    ancestorType: 'Spiritual'
                };
                 newState.ancestors = [...newState.ancestors, newAncestor];
            }
            newState.entities = { ...newState.entities, [personId]: deadPerson };
        }

        return newState;
    }
    
    case 'START_COMBAT': {
      return { ...state, activeCombat: action.payload.combatState };
    }

    case 'COMBAT_ACTION': {
      if (!state.activeCombat) return state;
      return processCombatTurn(state, action.payload);
    }

    case 'END_COMBAT': {
      if (!state.clan) return state;
      let newClan = { ...state.clan };
      let newLog = state.log;
      if (action.payload.outcome === 'victory') {
        newClan = { ...newClan, spiritStones: newClan.spiritStones + 50, herbs: newClan.herbs + 10, beastCores: newClan.beastCores + 1 };
        newLog = addLog(state, "The beast was slain! You collect its essence and a beast core.", 'success');
      }
      return { ...state, activeCombat: null, clan: newClan, log: newLog };
    }

    case 'CRAFT_ITEM': {
        if (!state.clan) return state;
        const { recipeId } = action.payload;
        const recipe = RECIPES.find(r => r.id === recipeId);

        if (!recipe) {
            return { ...state, log: addLog(state, "Unknown recipe.", 'warning') };
        }

        // Check facility level
        if (state.clan.facilities[recipe.facility].level < recipe.requiredLevel) {
            return { ...state, log: addLog(state, `Requires ${FACILITIES_DATA[recipe.facility].name} level ${recipe.requiredLevel}.`, 'warning') };
        }

        // Check ingredients
        for (const input of recipe.inputs) {
            const cost = input.qty;
            if (input.id === 'spiritStones' && state.clan.spiritStones < cost) {
                 return { ...state, log: addLog(state, `Not enough ${input.id}.`, 'warning') };
            }
            if (input.id === 'herbs' && state.clan.herbs < cost) {
                 return { ...state, log: addLog(state, `Not enough ${input.id}.`, 'warning') };
            }
             if (input.id === 'spiritOre' && state.clan.spiritOre < cost) {
                 return { ...state, log: addLog(state, `Not enough ${input.id}.`, 'warning') };
            }
             if (input.id === 'beastCores' && state.clan.beastCores < cost) {
                 return { ...state, log: addLog(state, `Not enough ${input.id}.`, 'warning') };
            }
        }
        
        let newClan = { ...state.clan };
        // Deduct ingredients
        for (const input of recipe.inputs) {
            (newClan[input.id] as number) -= input.qty;
        }

        // Calculate success
        const facilityBonus = newClan.facilities[recipe.facility].level * 2; // 2% bonus per level
        const successChance = recipe.successBase + facilityBonus;
        const roll = state.rng.next() * 100;

        if (roll <= successChance) {
            // Success
            const newItemId = `${recipe.id}_${getUniqueId()}`;
            if (recipe.output.type === 'pill') {
                const newPill: Pill = { id: newItemId, ...(recipe.output.item as Omit<Pill, 'id'>) };
                newClan.pills = { ...newClan.pills, [newItemId]: newPill };
            } else if (recipe.output.type === 'artifact') {
                 const newArtifact: Artifact = { id: newItemId, ...(recipe.output.item as Omit<Artifact, 'id'>) };
                 newClan.artifacts = { ...newClan.artifacts, [newItemId]: newArtifact };
            }
            return { ...state, clan: newClan, log: addLog(state, `Successfully crafted ${recipe.name}!`, 'success') };
        } else {
            // Failure
            return { ...state, clan: newClan, log: addLog(state, `Crafting ${recipe.name} failed! The materials were lost.`, 'danger') };
        }
    }

    case 'USE_PILL': {
        if (!state.clan || !state.patriarchId) return state;
        const { pillId, personId } = action.payload;
        const person = state.entities[personId];
        const pill = state.clan.pills[pillId];
        
        if (!person || !pill) return state;

        const { [pillId]: _, ...remainingPills } = state.clan.pills;
        let newClan = { ...state.clan, pills: remainingPills };
        let newPerson = { ...person, buffs: [...person.buffs] };
        let logMessage = `${person.name} consumed a ${pill.name}.`;

        pill.effects.forEach(effect => {
            if (effect.duration === undefined) { // Instant effect
                switch (effect.type) {
                    case 'INSTANT_HEALTH_RECOVERY_PERCENT':
                        newPerson.health = Math.min(newPerson.maxHealth, newPerson.health + newPerson.maxHealth * effect.value);
                        logMessage += ` Health recovered!`;
                        break;
                    case 'INSTANT_QI_RECOVERY_PERCENT':
                        newPerson.qi = Math.min(newPerson.maxQi, newPerson.qi + newPerson.maxQi * effect.value);
                        logMessage += ` Qi restored!`;
                        break;
                    case 'CULTIVATION_PROGRESS_BOOST':
                        newPerson.realmProgress += effect.value;
                        logMessage += ` Cultivation progress increased!`;
                        break;
                    case 'REMOVE_DEBUFF':
                        if (effect.debuffType === 'qi_deviation') newPerson.qiDeviation = false;
                        logMessage += ` Their mind feels clear.`;
                        break;
                }
            } else { // Duration-based effect -> add to buffs
                const newBuff: Buff = {
                    ...effect,
                    sourcePillName: pill.name,
                    startYear: state.time.year,
                    remainingDuration: effect.duration,
                };
                newPerson.buffs.push(newBuff);
                logMessage += ` They feel a new power flowing within them.`;
            }
        });
        
        const newEntities = { ...state.entities, [personId]: newPerson };
        return { ...state, clan: newClan, entities: newEntities, log: addLog(state, logMessage, 'success') };
    }

    case 'EQUIP_ARTIFACT': {
        if (!state.clan) return state;
        const { personId, artifactId } = action.payload;
        const person = state.entities[personId];
        const artifact = state.clan.artifacts[artifactId];

        if (!person || !artifact) return state;

        const slot = artifact.type.toLowerCase() as keyof Person['equipment'];
        if ((slot as string) === 'weapon/accessory') return state; // Not implemented yet

        let newPerson = { ...person };
        let newArtifacts = { ...state.clan.artifacts };

        // Unequip current item in slot if any
        const currentArtifactId = newPerson.equipment[slot];
        if (currentArtifactId) {
            newArtifacts[currentArtifactId] = { ...newArtifacts[currentArtifactId], boundTo: null };
        }

        // Equip new item
        newPerson.equipment[slot] = artifactId;
        newArtifacts[artifactId] = { ...artifact, boundTo: personId };
        
        const newEntities = { ...state.entities, [personId]: newPerson };
        const newClan = { ...state.clan, artifacts: newArtifacts };
        
        return { ...state, clan: newClan, entities: newEntities, log: addLog(state, `${person.name} equipped ${artifact.name}.`, 'normal') };
    }

    case 'UNEQUIP_ARTIFACT': {
        if (!state.clan) return state;
        const { personId, slot } = action.payload;
        const person = state.entities[personId];

        if (!person) return state;
        
        const artifactId = person.equipment[slot];
        if (!artifactId) return state;

        const artifact = state.clan.artifacts[artifactId];

        let newPerson = { ...person };
        newPerson.equipment[slot] = null;

        let newArtifacts = { ...state.clan.artifacts };
        newArtifacts[artifactId] = { ...artifact, boundTo: null };

        const newEntities = { ...state.entities, [personId]: newPerson };
        const newClan = { ...state.clan, artifacts: newArtifacts };

        return { ...state, clan: newClan, entities: newEntities, log: addLog(state, `${person.name} unequipped ${artifact.name}.`, 'normal') };
    }

    case 'TEMPER_ARTIFACT': {
        if (!state.clan) return state;
        const { artifactId } = action.payload;
        const artifact = state.clan.artifacts[artifactId];
        if (!artifact) return state;

        const cost = { spiritOre: 20 * (artifact.temperLevel + 1), beastCores: 1 * (artifact.temperLevel + 1) };
        if (state.clan.spiritOre < cost.spiritOre || state.clan.beastCores < cost.beastCores) {
            return { ...state, log: addLog(state, 'Not enough materials to temper.', 'warning') };
        }
        
        let newClan = { ...state.clan, spiritOre: state.clan.spiritOre - cost.spiritOre, beastCores: state.clan.beastCores - cost.beastCores };
        
        const forgeBonus = state.clan.facilities.forgePavilion.level * 2;
        const successChance = 50 - (artifact.tier * 5) + forgeBonus;
        
        if (state.rng.next() * 100 < successChance) {
            const newArtifact = { ...artifact, temperLevel: artifact.temperLevel + 1 };
            const newArtifacts = { ...newClan.artifacts, [artifactId]: newArtifact };
            newClan = { ...newClan, artifacts: newArtifacts };
            return { ...state, clan: newClan, log: addLog(state, `${artifact.name} was successfully tempered to level ${newArtifact.temperLevel}!`, 'success') };
        } else {
             return { ...state, clan: newClan, log: addLog(state, `Tempering ${artifact.name} failed! Materials were lost.`, 'danger') };
        }
    }

    case 'PERFORM_BLOODLINE_RITUAL': {
      if (!state.clan) return state;
      const { personId } = action.payload;
      const person = state.entities[personId];
      if (!person) return state;
      
      const cost = 100;
      if (state.clan.ancestralFavor < cost) {
        return { ...state, log: addLog(state, 'Not enough Ancestral Favor for the ritual.', 'warning')};
      }

      const newClan = { ...state.clan, ancestralFavor: state.clan.ancestralFavor - cost };
      const newEntities = { ...state.entities, [personId]: { ...person, blessedByAncestor: true } };

      return { ...state, clan: newClan, entities: newEntities, log: addLog(state, `The ancestors smile upon ${person.name}. Their next child will be blessed.`, 'legendary')};
    }

    case 'UNLOCK_BLESSING': {
      if (!state.clan) return state;
      const { blessingId } = action.payload;
      const blessing = BLESSING_TREE[blessingId];

      if (!blessing) return state;
      if (state.clan.unlockedBlessings.includes(blessingId)) return state;
      if (state.clan.ancestralFavor < blessing.cost) return { ...state, log: addLog(state, 'Not enough Ancestral Favor.', 'warning')};
      if (state.clan.ancestralFaith < blessing.faithRequired) return { ...state, log: addLog(state, 'Ancestral Faith is too low.', 'warning')};
      
      for (const req of blessing.requires) {
        if (!state.clan.unlockedBlessings.includes(req)) {
          return { ...state, log: addLog(state, `Requires prerequisite: ${BLESSING_TREE[req].name}`, 'warning') };
        }
      }

      const newClan: Clan = {
        ...state.clan,
        ancestralFavor: state.clan.ancestralFavor - blessing.cost,
        unlockedBlessings: [...state.clan.unlockedBlessings, blessingId],
      };

      return { ...state, clan: newClan, log: addLog(state, `The ancestors have bestowed the "${blessing.name}"!`, 'legendary')};
    }
    
    case 'PROPOSE_ALLIANCE': {
      if (!state.clan) return state;
      const { targetClanId, allianceType } = action.payload;
      const targetClan = state.clans[targetClanId];

      if (!targetClan) return state;
      if (state.clan.alliances.some(a => a.withClanId === targetClanId)) {
        return { ...state, log: addLog(state, `You already have an alliance with the ${targetClan.name}.`, 'warning')};
      }
      
      const cost = 50; // Diplomatic Grace
      if (state.clan.diplomaticGrace < cost) {
        return { ...state, log: addLog(state, 'Not enough Diplomatic Grace to propose an alliance.', 'warning')};
      }

      const minRelation = 20;
      if (targetClan.relation < minRelation) {
        return { ...state, log: addLog(state, `Your relation with the ${targetClan.name} is too low.`, 'warning')};
      }

      const newClan: Clan = { ...state.clan, diplomaticGrace: state.clan.diplomaticGrace - cost };
      const newClans = { ...state.clans };
      
      const newAlliance = { withClanId: targetClanId, type: allianceType, level: 1, startYear: state.time.year };
      
      newClan.alliances.push(newAlliance);
      newClans[targetClanId] = { ...targetClan, alliances: [...targetClan.alliances, { ...newAlliance, withClanId: state.clan.id }], relation: targetClan.relation + 20 };

      return { ...state, clan: newClan, clans: newClans, log: addLog(state, `You have formed a ${allianceType} with the ${targetClan.name}!`, 'success')};
    }
    
    case 'BREAK_ALLIANCE': {
      if (!state.clan) return state;
      const { targetClanId } = action.payload;
      const targetClan = state.clans[targetClanId];

      if (!targetClan) return state;

      const newClan: Clan = { ...state.clan, alliances: state.clan.alliances.filter(a => a.withClanId !== targetClanId) };
      const newClans = { ...state.clans };
      newClans[targetClanId] = { ...targetClan, alliances: targetClan.alliances.filter(a => a.withClanId !== state.clan!.id), relation: targetClan.relation - 50 };

      return { ...state, clan: newClan, clans: newClans, log: addLog(state, `You have broken your alliance with the ${targetClan.name}. Your reputation suffers.`, 'danger')};
    }

    case 'PERFORM_OFFERING': {
      if (!state.clan) return state;
      const { offeringType, artifactId } = action.payload;
      let newClan: Clan = { ...state.clan };
      let logMessage = '';

      switch (offeringType) {
        case 'spiritStones':
          const ssCost = OFFERING_TYPES.spiritStones.cost;
          if (newClan.spiritStones < ssCost) return { ...state, log: addLog(state, 'Not enough Spirit Stones.', 'warning')};
          newClan.spiritStones -= ssCost;
          newClan.ancestralFaith += OFFERING_TYPES.spiritStones.faithGain;
          logMessage = `You offer ${ssCost} Spirit Stones. The ancestors are pleased.`;
          break;
        case 'herbs':
          const herbCost = OFFERING_TYPES.herbs.cost;
          if (newClan.herbs < herbCost) return { ...state, log: addLog(state, 'Not enough Herbs.', 'warning')};
          newClan.herbs -= herbCost;
          newClan.ancestralFaith += OFFERING_TYPES.herbs.faithGain;
          logMessage = `You offer ${herbCost} rare herbs. The ancestors are pleased.`;
          break;
        case 'artifact':
          if (!artifactId) return state;
          const artifact = newClan.artifacts[artifactId];
          if (!artifact || artifact.boundTo) return { ...state, log: addLog(state, 'Cannot sacrifice an equipped artifact.', 'warning')};
          
          const { [artifactId]: _, ...remainingArtifacts } = newClan.artifacts;
          newClan.artifacts = remainingArtifacts;
          newClan.ancestralFaith += OFFERING_TYPES.artifact.faithGain;
          logMessage = `You sacrifice the ${artifact.name}. The ancestors are greatly pleased.`;
          break;
      }

      return { ...state, clan: newClan, log: addLog(state, logMessage, 'success') };
    }

    case 'TOGGLE_DUAL_CULTIVATION': {
      const { person1Id, person2Id } = action.payload;
      const p1 = state.entities[person1Id];
      const p2 = state.entities[person2Id];

      if (!p1 || !p2 || !state.clan) return state;

      const newEntities = { ...state.entities };
      let newClan = { ...state.clan };
      let logMessage = '';

      if (p1.isDualCultivatingWith === p2.id) {
        // Stop dual cultivation
        newEntities[person1Id] = { ...p1, isDualCultivatingWith: undefined };
        newEntities[person2Id] = { ...p2, isDualCultivatingWith: undefined };
        logMessage = `${p1.name} and ${p2.name} have emerged from their seclusion.`;
      } else {
        // Start dual cultivation
        const cost = 100;
        if (newClan.spiritStones < cost) {
          return { ...state, log: addLog(state, 'Not enough Spirit Stones to begin dual cultivation!', 'warning') };
        }
        newClan = { ...newClan, spiritStones: newClan.spiritStones - cost };
        newEntities[person1Id] = { ...p1, isDualCultivatingWith: p2.id };
        newEntities[person2Id] = { ...p2, isDualCultivatingWith: p1.id };
        logMessage = `${p1.name} and ${p2.name} have entered dual cultivation to deepen their bond and power. (Cost: ${cost} Spirit Stones)`;
      }

      return {
        ...state,
        clan: newClan,
        entities: newEntities,
        log: addLog(state, logMessage, 'success'),
      };
    }

    case 'PROPOSE_MARRIAGE': {
        if (!state.clan) return state;
        const { proposerId, targetId } = action.payload;
        const proposer = state.entities[proposerId];
        const target = state.entities[targetId];
        
        if (!proposer || !target) return { ...state, log: addLog(state, 'One of the individuals could not be found.', 'danger') };
        
        const dowry = { spiritStones: 100, diplomaticGrace: 50 };
        if (state.clan.spiritStones < dowry.spiritStones || state.clan.diplomaticGrace < dowry.diplomaticGrace) {
            return { ...state, log: addLog(state, 'Not enough resources for the dowry.', 'warning') };
        }
        
        const { compatibility } = calculateCompatibility(proposer, target);
        if (compatibility < 40) {
            return { ...state, log: addLog(state, `The union between ${proposer.name} and ${target.name} is inauspicious (Compatibility: ${compatibility}). The proposal failed.`, 'warning') };
        }
        
        let newClan = {
            ...state.clan,
            spiritStones: state.clan.spiritStones - dowry.spiritStones,
            diplomaticGrace: state.clan.diplomaticGrace - dowry.diplomaticGrace,
        };
        
        let newEntities = { ...state.entities };
        let newClansInfo = { ...state.clans };
        
        const originalTargetClanId = target.clanId;
        
        // Update persons
        const initialAffection = 25 + Math.floor(compatibility / 4);
        newEntities[proposerId] = { ...proposer, spouseIds: [...proposer.spouseIds, targetId], affection: {...proposer.affection, [targetId]: initialAffection }};
        
        // Target joins the proposer's clan
        newEntities[targetId] = {
            ...target,
            spouseIds: [...target.spouseIds, proposerId],
            affection: {...target.affection, [proposerId]: initialAffection },
            clanId: proposer.clanId,
            sectId: proposer.sectId,
            dynastyId: proposer.dynastyId,
        };
        
        // Update clan relations
        if (originalTargetClanId !== proposer.clanId) {
            const currentRelation = newClansInfo[originalTargetClanId].relation || 0;
            newClansInfo[originalTargetClanId] = { ...newClansInfo[originalTargetClanId], relation: Math.min(100, currentRelation + 40) };
        }
        
        const originalClanName = state.clans[originalTargetClanId]?.name || 'an unknown';
        const logText = `${target.name} from the ${originalClanName} Clan has married ${proposer.name}, joining the ${state.clan?.name}! Their compatibility is ${compatibility}. Relation with the ${originalClanName} has improved.`;

        return {
            ...state,
            clan: newClan,
            clans: newClansInfo,
            entities: newEntities,
            log: addLog(state, logText, 'success'),
        };
    }
    
    case 'RECRUIT_DISCIPLES': {
        if(!state.clan) return state;
        if (state.clan.spiritStones < 50) return {...state, log: addLog(state, "Not enough Spirit Stones!", 'warning')};
        const newClan = {...state.clan, spiritStones: state.clan.spiritStones - 50, disciples: state.clan.disciples + 3 };
        return {...state, clan: newClan, log: addLog(state, "Three new disciples join your clan!", 'success')};
    }

    case 'START_CONSTRUCTION': {
      if (!state.clan) return state;
      const { facilityId } = action.payload;
      const facility = state.clan.facilities[facilityId];
      const facilityData = FACILITIES_DATA[facilityId];

      if (facility.level >= facilityData.levels.length) {
        return { ...state, log: addLog(state, `This facility is already at max level.`, 'warning') };
      }
      if (state.clan.constructionQueue.some(p => p.facilityId === facilityId)) {
        return { ...state, log: addLog(state, `An upgrade for this facility is already in progress.`, 'warning') };
      }

      const nextLevelData = facilityData.levels[facility.level];
      const { cost, buildTime } = nextLevelData;

      // Check for tech requirement for levels > 1
      if (facility.level + 1 > 1 && !state.clan.unlockedTechs.includes('advancedArchitecture')) {
        return { ...state, log: addLog(state, 'Requires "Advanced Architecture" tech to upgrade past level 1.', 'warning') };
      }

      // Check resources
      if (state.clan.spiritStones < cost.spiritStones) return { ...state, log: addLog(state, "Not enough Spirit Stones.", 'warning') };
      if (state.clan.constructionPoints < cost.constructionPoints) return { ...state, log: addLog(state, "Not enough Construction Points.", 'warning') };
      if (cost.spiritOre && state.clan.spiritOre < cost.spiritOre) return { ...state, log: addLog(state, "Not enough Spirit Ore.", 'warning') };
      if (cost.herbs && state.clan.herbs < cost.herbs) return { ...state, log: addLog(state, "Not enough Herbs.", 'warning') };
      
      const newClan = { ...state.clan };
      // Deduct resources
      newClan.spiritStones -= cost.spiritStones;
      newClan.constructionPoints -= cost.constructionPoints;
      if (cost.spiritOre) newClan.spiritOre -= cost.spiritOre;
      if (cost.herbs) newClan.herbs -= cost.herbs;

      // Add to queue
      newClan.constructionQueue = [...newClan.constructionQueue, {
        facilityId,
        targetLevel: facility.level + 1,
        startYear: state.time.year,
        duration: buildTime,
        endYear: state.time.year + buildTime,
      }];

      return { ...state, clan: newClan, log: addLog(state, `Construction of ${facilityData.name} Lvl ${facility.level + 1} has begun. It will take ${buildTime} year(s).`, 'success')};
    }
    
    case 'START_RESEARCH': {
      if (!state.clan) return state;
      const { techId } = action.payload;
      const tech = TECH_TREE[techId];
      if (!tech) return { ...state, log: addLog(state, 'Unknown technology.', 'warning')};
      if (state.clan.unlockedTechs.includes(techId)) return { ...state, log: addLog(state, 'Technology already researched.', 'warning')};
      if (state.clan.researchPoints < tech.cost) return { ...state, log: addLog(state, 'Not enough Research Points.', 'warning')};
      
      for (const req of tech.requires) {
        if (!state.clan.unlockedTechs.includes(req)) {
          return { ...state, log: addLog(state, `Requires prerequisite tech: ${TECH_TREE[req].name}`, 'warning')};
        }
      }

      const newClan = { ...state.clan };
      newClan.researchPoints -= tech.cost;
      newClan.unlockedTechs = [...newClan.unlockedTechs, techId];

      return { ...state, clan: newClan, log: addLog(state, `Researched: ${tech.name}!`, 'legendary')};
    }
    
    case 'APPOINT_YOUNG_HEAD': {
        const { personId } = action.payload;
        if (!state.entities[personId]) return state;

        const newEntities = { ...state.entities };
        // Demote existing young head if any
        Object.values(newEntities).forEach(e => {
            if (e.isYoungHead) e.isYoungHead = false;
        });
        
        const newYoungHead = { ...newEntities[personId], isYoungHead: true, isElder: false };
        newEntities[personId] = newYoungHead;

        return { ...state, entities: newEntities, log: addLog(state, `${newYoungHead.name} is appointed as Young Head!`, 'legendary') };
    }
    
    case 'APPOINT_ELDER': {
        const { personId } = action.payload;
        if (!state.entities[personId] || !state.clan) return state;
        if (state.clan.spiritStones < 100) return {...state, log: addLog(state, "Not enough Spirit Stones to appoint an Elder!", 'warning')};
        
        const person = state.entities[personId];
        
        // Intelligently assign elder type based on highest stats
        let elderType: Person['elderType'] = 'Combat Elder'; // default
        const stats = {
            combat: person.strength + person.defense,
            spirit: person.willpower + person.focus,
            law: person.charisma + person.leadership,
            alchemy: person.talent + person.focus, // Simplified proxy
            formation: person.endurance + person.willpower,
        };

        const highestStat = Object.keys(stats).reduce((a, b) => (stats as any)[a] > (stats as any)[b] ? a : b);

        switch (highestStat) {
            case 'combat': elderType = 'Combat Elder'; break;
            case 'spirit': elderType = 'Spirit Elder'; break;
            case 'law': elderType = 'Law Elder'; break;
            case 'alchemy': elderType = 'Alchemy Elder'; break;
            case 'formation': elderType = 'Formation Elder'; break;
        }

        const newElder = { ...person, isElder: true, isYoungHead: false, elderType };
        const newEntities = { ...state.entities, [personId]: newElder };
        const newClan = {...state.clan, spiritStones: state.clan.spiritStones - 100};

        return {...state, clan: newClan, entities: newEntities, log: addLog(state, `${newElder.name} is appointed as ${ELDER_ROLES[elderType].name}.`, 'success') };
    }

    case 'FORCE_SUCCESSION': {
        if (!state.patriarchId || !state.clan) return state;
        const youngHead = Object.values(state.entities).find(e => e.isYoungHead) as Person | undefined;
        
        if (!youngHead) {
            return { ...state, log: addLog(state, "You must appoint a Young Head before passing on leadership.", 'warning')};
        }
        
        if (state.clan.reputation < 70) {
            return { ...state, log: addLog(state, "Clan stability is too low (Reputation < 70). The ancestors would not approve of this transition.", 'warning')};
        }

        const oldPatriarch = state.entities[state.patriarchId];
        
        const newPatriarch = { 
            ...youngHead, 
            isYoungHead: false, 
            isPatriarch: true,
            leadership: youngHead.leadership + 50,
            patriarchTrait: state.rng.choice(['Wise', 'Tyrant', 'Ascetic'] as const),
            charisma: youngHead.charisma + 50
        };
        const oldPatriarchUpdated = { 
            ...oldPatriarch, 
            isPatriarch: false,
            isLivingAncestor: true
        };

        const newEntities = { 
            ...state.entities, 
            [oldPatriarch.id]: oldPatriarchUpdated, 
            [newPatriarch.id]: newPatriarch 
        };
        
        return {
            ...state,
            patriarchId: newPatriarch.id,
            entities: newEntities,
            log: addLog(state, `${oldPatriarch.name} enters seclusion, becoming a Living Ancestor. ${newPatriarch.name} becomes the new Clan Head!`, 'legendary')
        };
    }
    
    case 'HANDLE_EVENT_CHOICE': {
      if(!state.clan || !state.activeRandomEvent) return state;
      const { choice } = action.payload;
      const event = state.activeRandomEvent;
      let newState = { ...state };
      
      if (choice.cost && state.clan.spiritStones < choice.cost) {
        newState.log = addLog(state, "Not enough Spirit Stones!", 'warning');
      } else {
        if (choice.cost) {
            const newClan = {...state.clan, spiritStones: state.clan.spiritStones - choice.cost};
            newState = {...newState, clan: newClan};
        }
        newState = choice.effect(newState);
      }
      
      // Queue followup events if they exist
      if (event.followup) {
        newState.eventQueue = [...newState.eventQueue, ...event.followup];
      }

      newState.activeRandomEvent = null;
      return newState;
    }

    case 'SET_RANDOM_EVENT': {
        return { ...state, activeRandomEvent: action.payload };
    }

    case 'CLOSE_SHOP': {
        return { ...state, activeShop: null };
    }

    case 'PURCHASE_ITEM': {
        if (!state.clan || !state.activeShop) return state;
        const { item } = action.payload;

        if (state.clan.spiritStones < item.price) {
            return { ...state, log: addLog(state, "Not enough Spirit Stones to purchase this item.", 'warning') };
        }

        let newClan = { ...state.clan, spiritStones: state.clan.spiritStones - item.price };
        let newShop = { ...state.activeShop };
        const newItemId = `${item.itemId}_${state.rng.nextInt(100000, 999999)}`;
        let logMessage = `Purchased ${item.item.name} for ${item.price} Spirit Stones.`;

        if (item.type === 'pill') {
            const newPill: Pill = { id: newItemId, ...(item.item as Omit<Pill, 'id'>) };
            newClan.pills = { ...newClan.pills, [newItemId]: newPill };
            newShop.pills = newShop.pills.filter(p => p.itemId !== item.itemId);
        } else { // artifact
            const newArtifact: Artifact = { id: newItemId, ...(item.item as Omit<Artifact, 'id'>) };
            newClan.artifacts = { ...newClan.artifacts, [newItemId]: newArtifact };
            newShop.artifacts = newShop.artifacts.filter(a => a.itemId !== item.itemId);
        }

        return { ...state, clan: newClan, activeShop: newShop, log: addLog(state, logMessage, 'success') };
    }

    case 'ADVANCE_TUTORIAL': {
        if (state.tutorial.stepIndex < TUTORIAL_STEPS.length - 1) {
            return { ...state, tutorial: { ...state.tutorial, stepIndex: state.tutorial.stepIndex + 1 }};
        }
        return { ...state, tutorial: { ...state.tutorial, isActive: false }};
    }

    case 'SKIP_TUTORIAL': {
        return { ...state, tutorial: { ...state.tutorial, isActive: false }};
    }

    default:
      return state;
  }
}