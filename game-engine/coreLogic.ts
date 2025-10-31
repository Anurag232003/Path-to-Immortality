import { GameState, Person, Ancestor, GameEvent, RandomEvent, Facilities, Artifact, EventTemplate, Buff, Clan } from '../types';
import { REALMS, TRIBULATION_DEATH_CHANCES, DUAL_CULTIVATION_PROGRESS_BONUS } from '../constants';
import { FACILITIES_DATA } from '../constants/facilities';
import { BLESSING_TREE, CURSES } from '../constants/ancestralHall';
import { NARRATIVE_PACKS } from '../constants/events';
import { ELDER_ROLES } from '../constants/roles';
import { getTalentGrade, clamp, addLog as addLogHelper } from '../utils/helpers';
import { calculateProgressGain, calculateBreakthroughChance, computeEffectiveLifeYears } from './cultivationLogic';
import { calculateCompatibility } from './socialLogic';
import { generateEnemy } from './combatLogic';
import { generateChild } from './geneticsLogic';

let nextId = 0;
const getUniqueId = () => `entity_${Date.now()}_${nextId++}`;

function checkTriggers(template: EventTemplate, state: GameState): boolean {
    if (!state.clan) return false;
    for (const trigger of template.triggers) {
        switch (trigger.type) {
            case 'clan_faith':
                if (state.clan.ancestralFaith >= trigger.lessThan) return false;
                break;
            case 'clan_members_min':
                 if (Object.values(state.entities).filter(e => e.alive && e.clanId === state.clan?.id).length < trigger.value) return false;
                 break;
            case 'years_passed_min':
                if (state.time.year < trigger.value) return false;
                break;
        }
    }
    return true;
}

function processEvents(state: GameState): GameState {
    if (state.activeRandomEvent) {
        return state;
    }

    let allEvents: EventTemplate[] = [];
    state.activeNarrativePacks.forEach(packName => {
        if (NARRATIVE_PACKS[packName]) {
            allEvents = allEvents.concat(NARRATIVE_PACKS[packName].events);
        }
    });
    
    if (state.eventQueue.length > 0) {
        const nextEventId = state.eventQueue[0];
        const eventTemplate = allEvents.find(e => e.id === nextEventId);
        if (eventTemplate) {
            const newEvent: RandomEvent = {
                id: eventTemplate.id,
                title: eventTemplate.title,
                text: eventTemplate.getText(state),
                choices: eventTemplate.getChoices(state),
                followup: eventTemplate.followup
            };
            return {
                ...state,
                activeRandomEvent: newEvent,
                eventQueue: state.eventQueue.slice(1)
            };
        }
    }

    const candidateEvents = allEvents
        .filter(template => checkTriggers(template, state))
        .map(template => ({ template, text: template.getText(state) }))
        .filter(({ text }) => text !== "INVALID_EVENT");
    
    if (candidateEvents.length > 0) {
        const totalWeight = candidateEvents.reduce((sum, { template }) => sum + template.baseChance, 0);
        let roll = state.rng.next() * totalWeight;
        
        for (const { template, text } of candidateEvents) {
            roll -= template.baseChance;
            if (roll <= 0) {
                 const newEvent: RandomEvent = {
                    id: template.id,
                    title: template.title,
                    text: text,
                    choices: template.getChoices(state),
                    followup: template.followup,
                };
                return { ...state, activeRandomEvent: newEvent };
            }
        }
    }

    return state;
}


export function resolveBreakthrough(initialState: GameState, personId: string, fromTribulation: boolean = false): GameState {
    let state = { ...initialState };
    let person = state.entities[personId];

    if (!person) return state;

    if (fromTribulation) {
        // Tribulation success is handled here, failure is handled in the reducer
        const newRealm = person.realm + 1;
        let updatedPerson = {
            ...person,
            realm: newRealm, realmStage: 1, realmProgress: 0, yearsInRealm: 0, failedBreakthroughs: 0,
            cultivation: person.cultivation + 20, strength: person.strength + 10, willpower: person.willpower + 10,
        };
        updatedPerson.effectiveLifespan = computeEffectiveLifeYears(updatedPerson);
        state.entities = { ...state.entities, [personId]: updatedPerson };
        return state;
    }

    const { chance } = calculateBreakthroughChance({ person });
    const roll = state.rng.next() * 100;

    // Handle stage vs realm breakthrough
    if (person.realmStage < 9) {
        // --- Stage Breakthrough ---
        if (roll <= chance) {
            // Success
            const newStage = person.realmStage + 1;
            if (person.id === state.patriarchId) {
                state.log = addLogHelper(state, `${person.name} has broken through to Stage ${newStage}!`, 'success');
            }
            let updatedPerson = {
                ...person,
                realmStage: newStage,
                realmProgress: 0,
                failedBreakthroughs: 0,
                cultivation: person.cultivation + 2,
                strength: person.strength + 1,
                willpower: person.willpower + 1,
            };
            updatedPerson.maxHealth = 50 + updatedPerson.strength * 5;
            updatedPerson.maxQi = 50 + updatedPerson.willpower * 2;

            state.entities = { ...state.entities, [personId]: updatedPerson };
        } else {
            // Failure
            const failedCount = person.failedBreakthroughs + 1;
            let updatedPerson = { ...person, realmProgress: 80, failedBreakthroughs: failedCount };
            if (person.id === state.patriarchId) {
                state.log = addLogHelper(state, `${person.name}'s stage breakthrough failed.`, 'warning');
            }
            state.entities = { ...state.entities, [personId]: updatedPerson };
        }
    } else {
        // --- Realm Breakthrough ---
        if (person.realm >= REALMS.length - 1) return state;

        if (roll <= chance) {
            // Success
            const newRealm = person.realm + 1;
            state.log = addLogHelper(state, `Breakthrough Success! ${person.name} ascends to ${REALMS[newRealm].name} realm!`, 'legendary');
            let updatedPerson = {
                ...person,
                realm: newRealm,
                realmStage: 1,
                realmProgress: 0,
                yearsInRealm: 0,
                failedBreakthroughs: 0,
                cultivation: person.cultivation + 20,
                strength: person.strength + 10,
                willpower: person.willpower + 10,
            };
            updatedPerson.effectiveLifespan = computeEffectiveLifeYears(updatedPerson);
            updatedPerson.maxHealth = 50 + updatedPerson.strength * 5;
            updatedPerson.maxQi = 50 + updatedPerson.willpower * 2;
            state.entities = { ...state.entities, [personId]: updatedPerson };
        } else {
            // Failure
            const failedCount = person.failedBreakthroughs + 1;
            const regression = 20 + failedCount * 10;
            let updatedPerson = { ...person, realmProgress: Math.max(0, 100 - regression), failedBreakthroughs: failedCount };

            if (failedCount >= 3) {
                state.log = addLogHelper(state, `💥 ${person.name} enters Qi Deviation after 3 failed breakthroughs! Their cultivation is sealed.`, 'danger');
                updatedPerson = { ...updatedPerson, qiDeviation: true, realmProgress: 0, yearsInRealm: 0 };
            } else {
                const message = `Breakthrough failed! Qi backlash injures ${person.name}.`;
                state.log = addLogHelper(state, `${message} (${failedCount}/3)`, 'danger');
            }
            state.entities = { ...state.entities, [personId]: updatedPerson };
        }
    }
    
    // Consume single-use breakthrough pills after attempt
    person = state.entities[personId]; // Re-fetch person
    const updatedPersonWithBuffs = {
        ...person,
        buffs: person.buffs.filter(b => b.type !== 'BREAKTHROUGH_CHANCE_MODIFIER'),
    };
    state.entities = { ...state.entities, [personId]: updatedPersonWithBuffs };


    return state;
}

export function advanceYear(initialState: GameState): GameState {
    let state = { ...initialState };

    state = { ...state, time: { ...state.time, year: state.time.year + 1 } };
    if (!state.clan) return state;

    let newEntities = { ...state.entities };
    let newAncestors = [...state.ancestors];
    let newClan = { ...state.clan };
    let newBranches = { ...state.branches };
    const newChildren: Person[] = [];

    // --- 1. Process Construction Queue ---
    const completedProjects = newClan.constructionQueue.filter(p => state.time.year >= p.endYear);
    newClan.constructionQueue = newClan.constructionQueue.filter(p => state.time.year < p.endYear);

    for (const project of completedProjects) {
        newClan.facilities[project.facilityId].level = project.targetLevel;
        state.log = addLogHelper(state, `${FACILITIES_DATA[project.facilityId].name} has been upgraded to Level ${project.targetLevel}!`, 'success');
    }
    
    // --- 2. Upkeep and Maintenance ---
    let totalUpkeep = 0;
    for (const key in newClan.facilities) {
      const facilityId = key as keyof Facilities;
      const facility = newClan.facilities[facilityId];
      totalUpkeep += FACILITIES_DATA[facilityId].levels[facility.level -1].upkeep;
    }
    
    if (newClan.spiritStones < totalUpkeep) {
        state.log = addLogHelper(state, `Clan lacks Spirit Stones for upkeep! Facility efficiency is declining.`, 'warning');
        for (const key in newClan.facilities) {
            const facility = newClan.facilities[key as keyof Facilities];
            facility.wear = Math.min(100, facility.wear + 2);
        }
    } else {
        newClan.spiritStones -= totalUpkeep;
         for (const key in newClan.facilities) {
            const facility = newClan.facilities[key as keyof Facilities];
            facility.wear = Math.max(0, facility.wear - 1);
        }
    }

    // Recalculate efficiency for all facilities
    for (const key in newClan.facilities) {
        const facility = newClan.facilities[key as keyof Facilities];
        facility.efficiency = 100 - facility.wear;
    }

    // --- Ancestral Faith Decay & Curses ---
    newClan.ancestralFaith = Math.max(0, newClan.ancestralFaith - 2);
    const curseTrigger = CURSES.SILENCE.triggerFaith;
    if (newClan.ancestralFaith < curseTrigger && !newClan.activeCurse) {
        newClan.activeCurse = 'SILENCE';
        state.log = addLogHelper(state, `The Ancestral Hall grows cold as faith wanes. A curse has fallen upon the clan!`, 'danger');
    } else if (newClan.ancestralFaith >= curseTrigger && newClan.activeCurse) {
        newClan.activeCurse = null;
        state.log = addLogHelper(state, `By honoring the ancestors, the curse on the clan has been lifted!`, 'success');
    }


    // --- Relation Decay ---
    let newClansInfo = { ...state.clans };
    for (const clanId in newClansInfo) {
        if (clanId !== newClan.id) {
            const isAllied = newClan.alliances.some(a => a.withClanId === clanId);
            const decayRate = isAllied ? 0.1 : 0.5; // Alliances decay slower
            const currentRelation = newClansInfo[clanId].relation;
            newClansInfo[clanId] = { ...newClansInfo[clanId], relation: Math.max(-100, currentRelation - decayRate) };
        }
    }
    

    // --- Gather Bonuses from Blessings & Curses ---
    let bonuses = { cultivationSpeed: 0, resourceGain: 0, mutationChance: 0, breakthroughChance: 0 };
    if (newClan.activeCurse) {
        const curse = CURSES[newClan.activeCurse as keyof typeof CURSES];
        if (curse.effect.bonus?.cultivationSpeed) bonuses.cultivationSpeed += curse.effect.bonus.cultivationSpeed;
    }
    for (const blessingId of newClan.unlockedBlessings) {
        const blessing = BLESSING_TREE[blessingId];
        if (blessing.effect.bonus?.cultivationSpeed) bonuses.cultivationSpeed += blessing.effect.bonus.cultivationSpeed;
        if (blessing.effect.bonus?.resourceGain) bonuses.resourceGain += blessing.effect.bonus.resourceGain;
        if (blessing.effect.bonus?.mutationChance) bonuses.mutationChance += blessing.effect.bonus.mutationChance;
        if (blessing.effect.bonus?.breakthroughChance) bonuses.breakthroughChance += blessing.effect.bonus.breakthroughChance;
    }


    // --- 3. Aging, Death, Procreation, and Cultivation ---
    const processedCouples = new Set<string>();
    let updatedArtifacts = { ...newClan.artifacts };
    const livingAncestor = Object.values(newEntities).find(p => p.isLivingAncestor && p.alive);

    if (livingAncestor) {
        newClan.researchPoints += 5; // Ancestral Research
        newClan.reputation += 2; // Diplomatic Respect
    }

    const patriarch = state.patriarchId ? newEntities[state.patriarchId] : null;
    if (patriarch && patriarch.patriarchTrait === 'Wise') {
        newClan.researchPoints += 5;
    }


    for (const entityId in newEntities) {
        const person = newEntities[entityId];
        if (!person.alive) continue;

        let updatedPerson = { ...person };
        const newAge = person.age + 1;

        // --- Death by old age ---
        if (newAge >= person.effectiveLifespan) {
            updatedPerson.alive = false;
            state.log = addLogHelper(state, `${person.name} has passed away from old age.`, 'danger');
            newClan.ancestralFavor += Math.floor(person.realm * 20 + person.talent);
            
            let ancestorType: Ancestor['ancestorType'] = person.realm >= 10 ? 'Ascended' : person.realm >= 5 ? 'Spiritual' : 'Retreating';
            
            // Special handling for Living Ancestor death (Ascension)
            if (person.isLivingAncestor) {
                state.log = addLogHelper(state, `The Living Ancestor, ${person.name}, has ascended, their spirit joining the ancestors. Their final act bestows a great blessing upon the clan!`, 'legendary');
                ancestorType = 'Ascended Spirit';

                // Grant a free random blessing
                const availableBlessings = Object.keys(BLESSING_TREE).filter(id => !newClan.unlockedBlessings.includes(id));
                if (availableBlessings.length > 0) {
                    const chosenBlessingId = state.rng.choice(availableBlessings);
                    const chosenBlessing = BLESSING_TREE[chosenBlessingId];
                    newClan.unlockedBlessings.push(chosenBlessingId);
                    state.log = addLogHelper(state, `The clan has received the "${chosenBlessing.name}" blessing!`, 'success');
                }
            } else if (person.isPatriarch) {
                const youngHead = Object.values(state.entities).find(e => e.isYoungHead && e.alive);
                if (!youngHead) {
                    state.log = addLogHelper(state, `The Patriarch has fallen without an heir! The clan descends into chaos.`, 'danger');
                    state.eventQueue.push('E_SUCCESSION_CRISIS');
                }
            }

            if(person.isPatriarch || person.isLivingAncestor) {
                const newAncestor: Ancestor = {
                    name: person.name, realm: person.realm, generation: person.generation,
                    age: Math.floor(person.age), talent: person.talent, soulTablet: true,
                    ancestorType,
                };
                newAncestors.push(newAncestor);
            }

            newEntities[entityId] = updatedPerson;

            if (entityId === state.patriarchId) {
                state.patriarchId = null;
            }
            continue;
        }
        
        updatedPerson = { ...updatedPerson, age: newAge, yearsInRealm: person.yearsInRealm + 1 };
        
        // --- Health & Qi Regeneration ---
        updatedPerson.health = Math.min(updatedPerson.maxHealth, updatedPerson.health + Math.floor(updatedPerson.maxHealth * 0.1));
        updatedPerson.qi = Math.min(updatedPerson.maxQi, updatedPerson.qi + Math.floor(updatedPerson.maxQi * 0.2));


        // --- Elder Decay ---
        if (newAge > person.effectiveLifespan * 0.75 && !person.qiDeviation) {
            const decayRate = 0.01;
            const ageFactor = (newAge - person.effectiveLifespan * 0.75) / person.effectiveLifespan;
            const totalDecayMultiplier = decayRate * (1 + ageFactor);
            updatedPerson.cultivation = Math.max(0, updatedPerson.cultivation * (1 - totalDecayMultiplier));
            updatedPerson.strength = Math.max(1, updatedPerson.strength * (1 - totalDecayMultiplier));
            if (person.age <= person.effectiveLifespan * 0.75) {
                state.log = addLogHelper(state, `${person.name} has entered their twilight years. Their body begins to decay.`, 'warning');
            }
        }

        // --- Artifact Soul Link Growth ---
        Object.values(person.equipment).forEach(artifactId => {
            if (artifactId && updatedArtifacts[artifactId]) {
                const artifact = updatedArtifacts[artifactId];
                if (artifact.soulLink < 100) {
                    updatedArtifacts[artifactId] = { ...artifact, soulLink: Math.min(100, artifact.soulLink + 0.5) };
                }
            }
        });
        
        // --- Process Buffs ---
        const activeBuffs: Buff[] = [];
        updatedPerson.buffs.forEach(buff => {
            buff.remainingDuration -= 1;
            if (buff.remainingDuration > 0) {
                activeBuffs.push(buff);
            } else if (buff.duration > 0) { // Exclude single-use buffs from expiration message
                state.log = addLogHelper(state, `The effect of ${buff.sourcePillName} on ${person.name} has worn off.`, 'normal');
            }
        });
        updatedPerson.buffs = activeBuffs;
        
        // --- Relationships, Procreation & Dual Cultivation ---
        if (person.spouseIds.length > 0) {
            const spouseId = person.spouseIds[0];
            const spouse = newEntities[spouseId];
            const coupleKey = [person.id, spouseId].sort().join('-');

            if (spouse && spouse.alive && !processedCouples.has(coupleKey)) {
                const { compatibility } = calculateCompatibility(person, spouse);
                let affectionGain = compatibility / 20; // Base gain from compatibility
                let procreationChance = 0.2; // Base chance

                // Dual Cultivation Bonuses
                if (person.isDualCultivatingWith === spouseId) {
                    affectionGain *= 3; // Greatly increases affection
                    updatedPerson.realmProgress += DUAL_CULTIVATION_PROGRESS_BONUS;
                    newEntities[spouseId].realmProgress += DUAL_CULTIVATION_PROGRESS_BONUS;
                    procreationChance *= 3; // Greatly increases fertility
                }

                // Update Affection
                const currentAffection = person.affection[spouseId] || 0;
                const newAffection = clamp(currentAffection + affectionGain, 0, 100);
                updatedPerson.affection[spouseId] = newAffection;
                newEntities[spouseId].affection[person.id] = newAffection;

                // Procreation Check
                if (person.gender === 'Female' && person.age >= 16 && person.age <= 45) {
                    const affectionFactor = (newAffection - 50) / 100; //-0.5 to +0.5
                    
                    const fertilityBuff = updatedPerson.buffs.find(b => b.type === 'FERTILITY_CHANCE_MODIFIER');
                    const fertilityBonus = fertilityBuff ? fertilityBuff.value : 0;
                    
                    let finalChance = procreationChance * (1 + affectionFactor) * (1 + fertilityBonus);

                    if (person.isDualCultivatingWith === spouseId) {
                        finalChance = Math.max(0.6, finalChance);
                    }

                    if (state.rng.next() < finalChance) {
                        const child = generateChild(person, spouse, newClan, state.time.year, state.rng, compatibility, bonuses.mutationChance, !!livingAncestor);
                        newChildren.push(child);
                        state.log = addLogHelper(state, `${person.name} and ${spouse.name} have given birth to a child, ${child.name}!`, 'success');
                        
                        // Consume fertility buff
                        if (fertilityBuff) {
                            updatedPerson.buffs = updatedPerson.buffs.filter(b => b.type !== 'FERTILITY_CHANCE_MODIFIER');
                        }

                        // Check for bloodline mutation
                        if (child.bloodline.id !== person.bloodline.id && child.bloodline.id !== spouse.bloodline.id) {
                            state.log = addLogHelper(state, `A miracle! ${child.name} has awakened the ${child.bloodline.name} bloodline!`, 'legendary');
                        }

                        // Reset blessing after birth
                        if (updatedPerson.blessedByAncestor) {
                            updatedPerson.blessedByAncestor = false;
                            state.log = addLogHelper(state, `The ancestral blessing on ${person.name} has been fulfilled.`, 'normal');
                        }
                    }
                }
                processedCouples.add(coupleKey);
            }
        }

        // --- Cultivation Progress ---
        const talentGrade = getTalentGrade(person.talent);

        if (person.age >= 12 && person.realm < talentGrade.maxRealm && !person.qiDeviation) {
            const meditationBonus = state.clan.facilities.meditationHall.level * 0.05; // 5% per level
            const bloodlineBonus = (person.bloodline.tier - 1) * 0.05; // 5% bonus per tier above Mortal
            const ancestorBonus = livingAncestor ? 0.10 : 0; // 10% bonus for Living Ancestor
            const patriarchAsceticBonus = patriarch?.patriarchTrait === 'Ascetic' && person.isPatriarch ? 0.15 : 0;
            const totalSpeedBonus = 1 + meditationBonus + bloodlineBonus + bonuses.cultivationSpeed + ancestorBonus + patriarchAsceticBonus;

            const progressGain = calculateProgressGain({
                talent: person.talent, yearsInRealm: person.yearsInRealm, realmIndex: person.realm,
            }, totalSpeedBonus) * (state.clan.facilities.meditationHall.efficiency / 100);

            let newProgress = updatedPerson.realmProgress + progressGain;

            // Handle automatic breakthroughs for non-patriarchs
            if (newProgress >= 100 && person.id !== state.patriarchId) {
                 let stateAfterBreakthrough = { ...state, entities: newEntities, ancestors: newAncestors, clan: newClan, branches: newBranches, clans: newClansInfo };
                 stateAfterBreakthrough = resolveBreakthrough(stateAfterBreakthrough, person.id);
                 newEntities = stateAfterBreakthrough.entities;
                 newAncestors = stateAfterBreakthrough.ancestors;
                 state.log = stateAfterBreakthrough.log;
                 updatedPerson = newEntities[person.id]; // Re-fetch person data after breakthrough
            } else {
                 updatedPerson.realmProgress = newProgress;
            }
        } else if (person.qiDeviation) {
             if (state.rng.next() < 0.1) {
                state.log = addLogHelper(state, `${person.name} overcomes Qi Deviation!`, 'success');
                updatedPerson.qiDeviation = false;
                updatedPerson.failedBreakthroughs = 0;
            }
        }
        
        newEntities[entityId] = updatedPerson;
    }

    newClan.artifacts = updatedArtifacts;
    
    let stateAfterCultivation = { ...state, entities: newEntities, ancestors: newAncestors, clan: newClan, branches: newBranches, clans: newClansInfo };

    // Add newborn children to the clan
    newChildren.forEach(child => {
        stateAfterCultivation.entities[child.id] = child;
        if (stateAfterCultivation.entities[child.parentIds[0]]) stateAfterCultivation.entities[child.parentIds[0]].childrenIds.push(child.id);
        if (stateAfterCultivation.entities[child.parentIds[1]]) stateAfterCultivation.entities[child.parentIds[1]].childrenIds.push(child.id);
    });
    
    state = stateAfterCultivation;

    // --- Branch Management ---
    let totalTribute = 0;
    for (const branchId in newBranches) {
        const branch = newBranches[branchId];
        // Loyalty Decay
        const newLoyalty = Math.max(0, branch.loyalty - 0.5);
        // Tribute Calculation
        const tributePerMember = 5;
        const aliveMembersCount = branch.memberIds.filter(id => state.entities[id]?.alive).length;
        const tribute = aliveMembersCount * tributePerMember;
        totalTribute += tribute;
        newBranches[branchId] = { ...branch, loyalty: newLoyalty };
    }
    newClan.spiritStones += totalTribute;
    newClan.branchTributeLastYear = totalTribute;
    if (totalTribute > 0) {
        state.log = addLogHelper(state, `Received ${totalTribute} Spirit Stones as tribute from branch families.`, 'normal');
    }
    
    state = { ...state, clan: newClan, branches: newBranches };


    // --- 4. Handle Patriarch Death & Succession ---
    if (state.patriarchId === null) {
        const livingMembers = Object.values(state.entities).filter(e => e.alive && e.clanId === state.clan.id) as Person[];
        const youngHead = livingMembers.find(d => d.isYoungHead);
        const bestSuccessor = youngHead || livingMembers.sort((a, b) => b.talent - a.talent)[0];

        if (bestSuccessor) {
            state.patriarchId = bestSuccessor.id;
            state.entities[bestSuccessor.id] = { ...bestSuccessor, isYoungHead: false, isPatriarch: true };
            state.log = addLogHelper(state, `${bestSuccessor.name} has inherited the clan leadership!`, 'legendary');
        } else {
             state.log = addLogHelper(state, `The ${state.clan.name} has fallen! No successor available.`, 'danger');
             state.gameStarted = false; // Game over
             return state;
        }
    }
    
    // --- 5. Resource & Point Generation ---
    let elderBonuses = { herbs: 1.0, beastCores: 1.0, reputation: 0 };
    const elders = Object.values(state.entities).filter(p => p.isElder && p.alive);
    for (const elder of elders) {
        if (!elder.elderType) continue;
        const role = ELDER_ROLES[elder.elderType.replace('Grand ', '')];
        if (role) {
            role.effects.forEach(effect => {
                if (effect.type === 'RESOURCE_YIELD') {
                    (elderBonuses as any)[effect.resource] += effect.bonus;
                } else if (effect.type === 'CLAN_REPUTATION') {
                    elderBonuses.reputation += effect.bonus;
                }
            });
        }
    }

    const herbGarden = state.clan.facilities.herbGarden;
    const ancestralHall = state.clan.facilities.ancestralHall;
    const clanTemple = state.clan.facilities.clanTemple;
    
    const tradePacts = newClan.alliances.filter(a => a.type === 'TradePact').length;
    const tradePactBonus = tradePacts * 20;

    newClan.spiritStones += (5 + state.clan.territory * 2 + tradePactBonus) * state.difficulty.resourceModifier * (1 + bonuses.resourceGain);
    newClan.herbs += ((5 + herbGarden.level * 7) * elderBonuses.herbs) * (herbGarden.efficiency / 100) * state.difficulty.resourceModifier;
    newClan.spiritOre += (1 + state.clan.territory) * state.difficulty.resourceModifier;
    newClan.beastCores += (1 * elderBonuses.beastCores);
    newClan.researchPoints += (2 + ancestralHall.level * 3) * (ancestralHall.efficiency / 100);
    newClan.constructionPoints += (5 + clanTemple.level * 7) * (clanTemple.efficiency / 100);
    newClan.reputation += (1 + clanTemple.level * 2 + elderBonuses.reputation) * (clanTemple.efficiency / 100);
    newClan.diplomaticGrace += (1 + clanTemple.level);
    
    state = { ...state, clan: newClan };

    // --- 6. Random Events ---
    state = processEvents(state);


    return state;
}