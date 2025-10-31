import { EventTemplate, GameState, Branch } from '../types';
import { generateShopInventory } from '../game-engine/shopLogic';
import { clamp, addLog } from '../utils/helpers';

const CORE_EVENTS: EventTemplate[] = [
    {
        id: 'E_RESOURCE_BOOM',
        title: 'Resource Boom',
        category: 'Clan',
        baseChance: 0.05,
        triggers: [
            { type: 'years_passed_min', value: 5 }
        ],
        getText: (s: GameState) => `While expanding clan territory, disciples have discovered a small, hidden spirit stone mine! It seems it can be harvested for a quick influx of resources.`,
        getChoices: (s: GameState) => [
            {
                text: "Excellent! Harvest it immediately.",
                effect: (gs: GameState) => {
                    if (!gs.clan) return gs;
                    const gain = gs.rng.nextInt(200, 501);
                    const clan = { ...gs.clan, spiritStones: gs.clan.spiritStones + gain };
                    const log = addLog(gs, `Harvested a hidden mine, gaining ${gain} Spirit Stones.`, 'success');
                    return { ...gs, clan, log };
                }
            }
        ]
    },
    {
        id: 'E_CORRUPT_ELDER_START',
        title: 'Whispers in the Halls',
        category: 'Clan',
        baseChance: 0.03,
        triggers: [
             { type: 'clan_members_min', value: 5 },
             { type: 'years_passed_min', value: 10 }
        ],
        getText: (s: GameState) => {
             const elders = Object.values(s.entities).filter(e => e.alive && e.isElder);
             if (elders.length === 0) return "Error: No elders to be corrupt.";
             const targetElder = s.rng.choice(elders);
             // Store the target in a temporary way for the choices to access, this is a simplification
             (s as any).temp_event_target = targetElder;
             return `Disciples have been whispering about Elder ${targetElder.name}. They claim the Elder has been skimming resources from the clan's treasury for personal use.`;
        },
        getChoices: (s: GameState) => [
            {
                text: "Investigate these claims personally.",
                effect: (gs: GameState) => {
                     // This could lead to a follow-up event
                    return { ...gs, eventQueue: [...gs.eventQueue, 'E_CORRUPT_ELDER_CONFRONT'] };
                }
            },
            {
                text: "Dismiss the rumors to maintain stability.",
                effect: (gs: GameState) => {
                    if (!gs.clan) return gs;
                    const clan = {...gs.clan, ancestralFaith: gs.clan.ancestralFaith - 20 };
                    const log = addLog(gs, "You dismiss the rumors about the elder to maintain stability, upsetting the ancestors.", 'warning');
                    return { ...gs, clan, log };
                }
            }
        ],
        followup: ['E_CORRUPT_ELDER_CONFRONT'] // Example of direct followup
    },
    {
        id: 'E_CORRUPT_ELDER_CONFRONT',
        title: "An Elder's Greed",
        category: 'Clan',
        baseChance: 0, // Only triggered by followup
        triggers: [],
        getText: (s: GameState) => `Your investigation confirms the rumors. You confront the Elder, who confesses to their greed. What is your judgment?`,
        getChoices: (s: GameState) => [
             {
                text: "Strip their title and imprison them.",
                effect: (gs: GameState) => {
                    // Logic to find and punish the elder would go here
                    return gs;
                }
            },
             {
                text: "Forgive them, but demand repayment.",
                 effect: (gs: GameState) => {
                    if (!gs.clan) return gs;
                    const clan = {...gs.clan, spiritStones: gs.clan.spiritStones + 150, reputation: gs.clan.reputation + 10 };
                    const log = addLog(gs, "The corrupt elder repays their debt.", 'normal');
                    return { ...gs, clan, log };
                }
            }
        ]
    },
    {
        id: 'E_WANDERING_MERCHANT',
        title: 'A Mysterious Merchant Arrives',
        category: 'Clan',
        baseChance: 0.1, // 10% chance per year
        triggers: [
            { type: 'years_passed_min', value: 3 }
        ],
        getText: (s: GameState) => `A cloaked merchant, known only as the purveyor of the Celestial Bazaar, has arrived at your clan's gate. They carry a bag that seems to hold countless treasures and offer to show you their wares... for a price.`,
        getChoices: (s: GameState) => [
            {
                text: "Browse their wares.",
                effect: (gs: GameState) => {
                    // This effect closes the event modal and opens the shop modal by setting activeShop
                    return {
                        ...gs,
                        activeShop: generateShopInventory(gs.rng),
                    };
                }
            },
            {
                text: "Decline their offer.",
                effect: (gs: GameState) => {
                    if (!gs.clan) return gs;
                    // Small reputation loss for being inhospitable
                    const clan = {...gs.clan, reputation: Math.max(0, gs.clan.reputation - 1) };
                    return { ...gs, clan };
                }
            }
        ]
    },
    {
        id: 'E_SUCCESSION_CRISIS',
        title: 'A Leaderless Clan',
        category: 'Clan',
        baseChance: 0, // Triggered only
        triggers: [],
        getText: (s: GameState) => `The Patriarch has fallen without a designated heir! The clan is in turmoil, and the Elders are scrambling to maintain order. Your reputation has plummeted.`,
        getChoices: (s: GameState) => [
            {
                text: "Acknowledge the chaos and move forward.",
                effect: (gs: GameState) => {
                    // The default succession logic in coreLogic will handle appointing the best successor.
                    // This choice is for narrative flavor.
                    return { ...gs, log: addLog(gs, 'The clan must endure. The strongest will lead.') };
                }
            }
        ]
    },
    {
        id: 'E_BRANCH_FORMATION',
        title: 'A Clan Divided',
        category: 'Clan',
        baseChance: 0.1,
        triggers: [
            { type: 'clan_members_min', value: 10 },
            { type: 'years_passed_min', value: 20 }
        ],
        getText: (s: GameState) => {
            if (Object.keys(s.branches).length > 0) return "INVALID_EVENT";
            return `Your clan has grown prosperous and numerous. The main household has become crowded, and some suggest it is time to establish a branch family to manage outlying territories and expand your influence.`;
        },
        getChoices: (s: GameState) => {
            if (!s.clan) return [];
            
            const candidates = Object.values(s.entities)
                .filter(p => 
                    p.alive && 
                    p.clanId === s.clan?.id &&
                    !p.isPatriarch && 
                    !p.isYoungHead && 
                    !p.isElder && 
                    p.age >= 21 &&
                    p.spouseIds.length > 0 &&
                    !p.branchId
                )
                .sort((a, b) => (b.leadership + b.talent) - (a.leadership + a.talent));
            
            if (candidates.length === 0) {
                return [{
                    text: "There are no suitable candidates to lead a branch yet.",
                    effect: (gs) => gs // Do nothing
                }];
            }
    
            const bestCandidate = candidates[0];
            
            return [
                {
                    text: `Appoint ${bestCandidate.name} to lead the new branch.`,
                    effect: (gs: GameState) => {
                        const leader = gs.entities[bestCandidate.id];
                        if (!leader || !gs.clan) return gs;

                        const newBranchId = `branch_${gs.rng.nextInt(1000, 9999)}`;
                        const branchName = `${leader.name} Branch`;

                        const familyIds = new Set([leader.id, ...leader.spouseIds, ...leader.childrenIds]);
                        const memberIds = Array.from(familyIds).filter(id => gs.entities[id]?.alive);

                        const newBranch: Branch = {
                            id: newBranchId,
                            name: branchName,
                            leaderId: leader.id,
                            memberIds,
                            loyalty: 80, // Start with good loyalty
                        };

                        const newEntities = { ...gs.entities };
                        memberIds.forEach(id => {
                            newEntities[id] = { ...newEntities[id], branchId: newBranchId };
                        });

                        const newBranches = { ...gs.branches, [newBranchId]: newBranch };
                        
                        const newLog = addLog(gs, `${branchName} has been established, led by ${leader.name}.`, 'success');

                        return { ...gs, entities: newEntities, branches: newBranches, log: newLog };
                    }
                },
                {
                    text: "The clan must remain unified for now.",
                    effect: (gs: GameState) => {
                        if (!gs.clan) return gs;
                        const clan = { ...gs.clan, reputation: gs.clan.reputation - 2 };
                        const log = addLog(gs, "You decide against forming a branch family for now, prioritizing unity.", 'normal');
                        return { ...gs, clan, log };
                    }
                }
            ];
        },
    },
    {
        id: 'E_BRANCH_DISPUTE',
        title: "A Branch's Grievance",
        category: 'Clan',
        baseChance: 0.15,
        triggers: [
            { type: 'clan_members_min', value: 10 } // Indirectly implies branches might exist
        ],
        getText: (s: GameState) => {
            if (!s.clan || Object.keys(s.branches).length === 0) return "INVALID_EVENT";
            
            const lowLoyaltyBranches = Object.values(s.branches).filter(b => b.loyalty < 50);
            if (s.rng.next() > 0.3 && lowLoyaltyBranches.length === 0) return "INVALID_EVENT"; // Less likely if loyalty is high

            const complainingBranch = s.rng.choice(lowLoyaltyBranches.length > 0 ? lowLoyaltyBranches : Object.values(s.branches));
    
            (s as any).temp_event_target = complainingBranch;
    
            return `A delegation from the ${complainingBranch.name} has arrived. They claim their tribute is too high and they are not receiving adequate support from the main house. Their loyalty wavers.`;
        },
        getChoices: (s: GameState) => {
            const branch = (s as any).temp_event_target as Branch | undefined;
            if (!branch) return [{ text: "Dismiss them.", effect: gs => gs }];
    
            return [
                {
                    text: "Grant them 100 Spirit Stones as a sign of goodwill.",
                    cost: 100,
                    effect: (gs: GameState) => {
                        const newLoyalty = clamp(branch.loyalty + 20, 0, 100);
                        const newBranches = { ...gs.branches, [branch.id]: { ...branch, loyalty: newLoyalty } };
                        const log = addLog(gs, `You appease the ${branch.name} with resources. Their loyalty increases.`, 'success');
                        return { ...gs, branches: newBranches, log };
                    }
                },
                {
                    text: "Remind them of their duty to the clan.",
                    effect: (gs: GameState) => {
                        const newLoyalty = clamp(branch.loyalty - 10, 0, 100);
                        const newBranches = { ...gs.branches, [branch.id]: { ...branch, loyalty: newLoyalty } };
                        const log = addLog(gs, `You admonish the ${branch.name}. Their loyalty falters.`, 'warning');
                        return { ...gs, branches: newBranches, log };
                    }
                },
                {
                    text: "Make an example of them for their insolence.",
                     effect: (gs: GameState) => {
                        if (!gs.clan) return gs;
                        const newLoyalty = clamp(branch.loyalty - 25, 0, 100);
                        const newBranches = { ...gs.branches, [branch.id]: { ...branch, loyalty: newLoyalty } };
                        const clan = { ...gs.clan, reputation: gs.clan.reputation + 5 };
                        const log = addLog(gs, `You punish the ${branch.name} for their dissent, crushing their morale but displaying strength.`, 'danger');
                        return { ...gs, clan, branches: newBranches, log };
                    }
                }
            ];
        }
    }
];


export const NARRATIVE_PACKS: Record<string, {name: string, events: EventTemplate[]}> = {
    'CORE': {
        name: 'Core Gameplay Events',
        events: CORE_EVENTS,
    }
};