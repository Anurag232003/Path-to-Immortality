import { useReducer, useMemo } from 'react';
import { gameReducer } from '../game-engine/reducer';
import { initialState } from '../game-engine/initialState';
import { REALMS, CLAN_RANKS, TUTORIAL_STEPS, TRIBULATION_DEATH_CHANCES } from '../constants';
import { Person, Artifact } from '../types';
import { calculateBreakthroughChance } from '../game-engine/cultivationLogic';

export const useCultivationGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // --- MEMOIZED SELECTORS ---
  // These selectors derive complex data from the raw state,
  // providing an easy-to-use API for the UI and preventing unnecessary re-renders.

  const patriarch = useMemo((): Person | null => {
    if (!state.patriarchId || !state.entities[state.patriarchId]) return null;
    return state.entities[state.patriarchId];
  }, [state.patriarchId, state.entities]);

  const clanMembers = useMemo((): Person[] => {
    if (!patriarch) return [];

    const immediateFamilyIds = new Set([
      ...patriarch.spouseIds,
      ...patriarch.childrenIds,
    ]);
    
    const familyMembers = Object.values(state.entities).filter(
      (p): p is Person => p.alive && immediateFamilyIds.has(p.id)
    );

    return familyMembers.sort((a, b) => b.talent - a.talent);
  }, [patriarch, state.entities]);
  
  const youngHead = useMemo((): Person | null => {
      return clanMembers.find(p => p.isYoungHead) || null;
  }, [clanMembers]);

  const elders = useMemo(() => {
    return clanMembers.filter(p => p.isElder);
  }, [clanMembers]);

  const currentRealm = useMemo(() => patriarch ? REALMS[patriarch.realm] : null, [patriarch]);
  
  const getHighestRealm = useMemo(() => {
      if (!patriarch) return 0;
      return Math.max(
          patriarch.realm,
          ...state.ancestors.map(a => a.realm),
          ...elders.map(e => e.realm)
      );
  }, [patriarch, state.ancestors, elders]);

  const currentClanRank = useMemo(() => {
    const highestRealm = getHighestRealm;
    for (let i = CLAN_RANKS.length - 1; i >= 0; i--) {
        if (highestRealm >= CLAN_RANKS[i].minRealm) return CLAN_RANKS[i];
    }
    return CLAN_RANKS[0];
  }, [getHighestRealm]);

  const tutorialStep = useMemo(() => 
    state.tutorial.isActive ? TUTORIAL_STEPS[state.tutorial.stepIndex] : null, 
    [state.tutorial.isActive, state.tutorial.stepIndex]
  );

  const patriarchBreakthroughChance = useMemo(() => {
      if (!patriarch) {
          return { 
              chance: 0, 
              breakdown: { type: 'Realm' as const, base: 0, talent: 0, karma: 0, penalty: 0, final: 0, isTribulation: false, lifespanResist: 0 }
            };
      }
      return calculateBreakthroughChance({ person: patriarch });
  }, [patriarch]);

  const patriarchEquippedItems = useMemo((): Artifact[] => {
    if (!patriarch || !state.clan) return [];
    return Object.values(patriarch.equipment)
        .filter((id): id is string => !!id)
        .map(id => state.clan!.artifacts[id])
        .filter((item): item is Artifact => !!item);
  }, [patriarch, state.clan]);

  const patriarchEffectiveStats = useMemo(() => {
    if (!patriarch) return null;
    
    const stats = {
        strength: patriarch.strength,
        defense: patriarch.defense,
        willpower: patriarch.willpower,
        agility: patriarch.agility,
        focus: patriarch.focus,
        endurance: patriarch.endurance,
        luck: patriarch.luck,
    };
    
    patriarchEquippedItems.forEach(item => {
        item.effects?.forEach(effect => {
            if (effect.type === 'PASSIVE_STAT_MODIFIER' && effect.stat && effect.value) {
                if (effect.modifierType === 'flat') {
                    if (effect.stat in stats) {
                        (stats as any)[effect.stat] += effect.value;
                    }
                }
                // TODO: Handle percent modifiers
            }
        });
    });

    return stats;
  }, [patriarch, patriarchEquippedItems]);

  const patriarchCombatPower = useMemo(() => {
    if (!patriarch || !state.clan || !currentRealm || !patriarchEffectiveStats) return 0;
    
    let basePower = currentRealm.powerRange[0] + (patriarchEffectiveStats.strength * currentRealm.powerMultiplier) + (patriarch.cultivation * 100);
    
    patriarchEquippedItems.forEach(item => {
      // Add base power for weapons
      if (item.type === 'Weapon') {
        const bondCoefficient = 0.5 + (item.soulLink / 200);
        const artifactPower = item.basePower * (1 + item.temperLevel * 0.1);
        basePower += artifactPower * bondCoefficient;
      }
      // Apply passive damage modifiers from all equipment
      item.effects?.forEach(effect => {
          if (effect.type === 'PASSIVE_STAT_MODIFIER' && effect.stat === 'all_damage' && effect.modifierType === 'percent' && effect.value) {
              basePower *= (1 + effect.value);
          }
           if (effect.type === 'SKILL_DAMAGE_MODIFIER' && effect.modifierType === 'percent' && effect.value) {
              basePower *= (1 + effect.value);
          }
      });
    });

    return basePower;
  }, [patriarch, state.clan, currentRealm, patriarchEquippedItems, patriarchEffectiveStats]);


  const selectors = useMemo(() => ({
      patriarch,
      clanMembers: clanMembers.filter(p => !p.isYoungHead && !p.isElder),
      youngHead,
      elders,
      currentRealm,
      currentClanRank,
      tutorialStep,
      patriarchBreakthroughChance,
      patriarchCombatPower,
      patriarchEquippedItems,
      patriarchEffectiveStats,
  }), [patriarch, clanMembers, youngHead, elders, currentRealm, currentClanRank, tutorialStep, patriarchBreakthroughChance, patriarchCombatPower, patriarchEquippedItems, patriarchEffectiveStats]);

  return {
    state,
    dispatch,
    selectors,
    // Exposing constants for UI rendering
    REALMS,
    CLAN_RANKS,
  };
};