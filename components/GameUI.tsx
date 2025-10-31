import React, { useState } from 'react';
import EventModal from './EventModal';
import TutorialOverlay from './TutorialOverlay';
import DualCultivationModal from './DualCultivationModal';
import CombatModal from './CombatModal';
import TribulationModal from './TribulationModal';
import CraftingModal from './CraftingModal';
import ClanDevelopmentModal from './ClanDevelopmentModal';
import ArmoryModal from './ArmoryModal';
import AncestryModal from './BloodlineModal';
import DiplomacyModal from './DiplomacyModal';
import ShopModal from './ShopModal';
import InternalAffairsModal from './InternalAffairsModal';
import {
  Sparkles, Zap, Users, Mountain, Heart, Swords, BookOpen, Flame, TrendingUp,
  Crown, Star, FastForward, ChevronsRight, HeartHandshake, Hammer, Anvil, Building, Shield, Dna,
  Handshake, BrainCircuit, GitFork
} from 'lucide-react';
import { GameAction, GameState, Person, Realm, Ancestor } from '../types';
import { useCultivationGame } from '../hooks/useCultivationGame';
import { getTalentGrade, getGradeColorClass, formatPower, getBloodlineGradeColorClass, getPhysiqueTierColorClass } from '../utils/helpers';
import { TECHNIQUES } from '../constants';

type GameUIProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  selectors: ReturnType<typeof useCultivationGame>['selectors'];
  REALMS: Realm[];
}

const BreakthroughTooltip: React.FC<{ breakdown: ReturnType<typeof useCultivationGame>['selectors']['patriarchBreakthroughChance']['breakdown'] }> = ({ breakdown }) => {
    const isRealm = breakdown.type === 'Realm';
    
    return (
        <div className="absolute bottom-full mb-2 w-64 bg-slate-800 border border-purple-500 rounded-lg p-3 text-xs text-left shadow-lg z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <h4 className="font-bold text-yellow-400 mb-2">{breakdown.type} Breakthrough Chance</h4>
            {isRealm ? (
                <>
                    <div className="flex justify-between"><span className="text-purple-300">Base Chance (Realm):</span><span>{breakdown.base.toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Talent Bonus:</span><span className="text-green-400">+ {breakdown.talent.toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Karma Bonus:</span><span className={breakdown.karma >= 0 ? 'text-green-400' : 'text-red-400'}>{breakdown.karma >= 0 ? '+ ' : ''}{breakdown.karma.toFixed(2)}%</span></div>
                    <div className="flex justify-between border-t border-purple-700 mt-1 pt-1"><span className="text-purple-300">Realm Penalty:</span><span className="text-red-400">- {breakdown.penalty.toFixed(2)}%</span></div>
                </>
            ) : (
                <>
                    <div className="flex justify-between"><span className="text-purple-300">Base Chance:</span><span>{breakdown.base.toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Willpower Bonus:</span><span className="text-green-400">+ {breakdown.willpower.toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Failure Penalty:</span><span className="text-red-400">- {breakdown.penalty.toFixed(2)}%</span></div>
                </>
            )}
            <div className="flex justify-between font-bold mt-1"><span className="text-white">Final Chance:</span><span className="text-yellow-300">{breakdown.final.toFixed(2)}%</span></div>
            {isRealm && breakdown.isTribulation && (
                <div className="border-t border-red-500/50 pt-1 mt-2 text-center">
                    <p className="text-red-400 font-bold">⚡ TRIBULATION REALM ⚡</p>
                    <p className="text-xs text-purple-300 mt-1">Success depends on skill, not just chance.</p>
                </div>
            )}
        </div>
    );
};


const GameUI: React.FC<GameUIProps> = ({ state, dispatch, selectors, REALMS }) => {
  const [isDiplomacyModalOpen, setDiplomacyModalOpen] = useState(false);
  const [isDualCultivationModalOpen, setDualCultivationModalOpen] = useState(false);
  const [isCraftingModalOpen, setCraftingModalOpen] = useState(false);
  const [isClanDevelopmentModalOpen, setClanDevelopmentModalOpen] = useState(false);
  const [isArmoryModalOpen, setArmoryModalOpen] = useState(false);
  const [isAncestryModalOpen, setAncestryModalOpen] = useState(false);
  const [isInternalAffairsModalOpen, setInternalAffairsModalOpen] = useState(false);

  const { patriarch, youngHead, elders, clanMembers, currentRealm, currentClanRank, tutorialStep, patriarchBreakthroughChance, patriarchCombatPower, patriarchEffectiveStats } = selectors;
  const { clan, time, log: events, activeRandomEvent, activeCombat, activeTribulation, entities, activeShop, branches } = state;

    if (!patriarch || !clan || !currentRealm || !patriarchEffectiveStats) {
        return null; // Should not happen if called from App.tsx correctly
    }
    
    const realmColorMap: { [key: string]: string } = {
        gray: 'text-gray-400',
        blue: 'text-blue-400',
        cyan: 'text-cyan-400',
        yellow: 'text-yellow-400',
        purple: 'text-purple-400',
        pink: 'text-pink-400',
        indigo: 'text-indigo-400',
        violet: 'text-violet-400',
        fuchsia: 'text-fuchsia-400',
        rose: 'text-rose-400',
        amber: 'text-amber-400',
        emerald: 'text-emerald-400',
        sky: 'text-sky-400',
        teal: 'text-teal-400',
        gold: 'text-yellow-300',
        orange: 'text-orange-400',
        red: 'text-red-400',
        crimson: 'text-red-600',
        white: 'text-white',
        rainbow: 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400'
    };

    const realmColor = realmColorMap[currentRealm.color];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 text-white">
      {tutorialStep && <TutorialOverlay step={tutorialStep} onNext={() => dispatch({type: 'ADVANCE_TUTORIAL'})} onSkip={() => dispatch({type: 'SKIP_TUTORIAL'})} />}
      {isDiplomacyModalOpen && (
          <DiplomacyModal
            allMembers={Object.values(entities)}
            playerClan={clan}
            clans={state.clans}
            entities={entities}
            onClose={() => setDiplomacyModalOpen(false)}
            dispatch={dispatch}
          />
      )}
      {isDualCultivationModalOpen && (
          <DualCultivationModal
            entities={entities}
            onClose={() => setDualCultivationModalOpen(false)}
            dispatch={dispatch}
          />
      )}
      {isCraftingModalOpen && <CraftingModal clan={clan} patriarchId={state.patriarchId} dispatch={dispatch} onClose={() => setCraftingModalOpen(false)} />}
      {isClanDevelopmentModalOpen && <ClanDevelopmentModal clan={clan} time={time} dispatch={dispatch} onClose={() => setClanDevelopmentModalOpen(false)} />}
      {isArmoryModalOpen && <ArmoryModal clan={clan} patriarch={patriarch} dispatch={dispatch} onClose={() => setArmoryModalOpen(false)} />}
      {isAncestryModalOpen && <AncestryModal allMembers={Object.values(entities)} clan={clan} dispatch={dispatch} onClose={() => setAncestryModalOpen(false)} />}
      {isInternalAffairsModalOpen && <InternalAffairsModal branches={branches} entities={entities} onClose={() => setInternalAffairsModalOpen(false)} />}
      {activeCombat && <CombatModal combatState={activeCombat} allTechniques={TECHNIQUES} dispatch={dispatch} state={state} />}
      {activeTribulation && <TribulationModal tribulationState={activeTribulation} dispatch={dispatch} />}
      {activeShop && <ShopModal shopState={activeShop} clan={clan} dispatch={dispatch} />}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {activeRandomEvent && <EventModal event={activeRandomEvent} onChoice={(choice) => dispatch({type: 'HANDLE_EVENT_CHOICE', payload: {choice}})} />}

      <div className="relative z-10 container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div data-tutorial-id="clan-resources" className="bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
                {clan.name}
              </h1>
              {patriarch && <p className="text-purple-300">Generation {patriarch.generation}</p>}
              {currentClanRank && (
                <div className="mt-2 flex items-center gap-2">
                  <Crown className={`w-5 h-5 ${currentClanRank.color === 'rainbow' ? 'text-yellow-400' : `text-${currentClanRank.color}-400`}`} />
                  <span className={`font-bold ${currentClanRank.color === 'rainbow' ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400' : `text-${currentClanRank.color}-400`}`}>
                    {currentClanRank.rank} {currentClanRank.name}
                  </span>
                  <span className="text-purple-400 text-sm">• {currentClanRank.influence}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl text-yellow-400">Year {time.year}</p>
              <p className="text-purple-300">{time.season}, Day {time.day}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4 text-xs">
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Sparkles className="w-4 h-4 text-yellow-400" /><span className="text-purple-300">Spirit Stones</span></div><p className="text-lg font-bold">{Math.floor(clan.spiritStones)}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Mountain className="w-4 h-4 text-green-400" /><span className="text-purple-300">Herbs</span></div><p className="text-lg font-bold">{clan.herbs}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Anvil className="w-4 h-4 text-gray-400" /><span className="text-purple-300">Spirit Ore</span></div><p className="text-lg font-bold">{clan.spiritOre}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Zap className="w-4 h-4 text-red-400" /><span className="text-purple-300">Beast Cores</span></div><p className="text-lg font-bold">{clan.beastCores}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Flame className="w-4 h-4 text-orange-400" /><span className="text-purple-300">Fate Energy</span></div><p className="text-lg font-bold">{clan.fateEnergy}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Dna className="w-4 h-4 text-pink-400" /><span className="text-purple-300">Ancestral Favor</span></div><p className="text-lg font-bold">{clan.ancestralFavor}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Handshake className="w-4 h-4 text-green-300" /><span className="text-purple-300">Diplo. Grace</span></div><p className="text-lg font-bold">{clan.diplomaticGrace}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Users className="w-4 h-4 text-blue-400" /><span className="text-purple-300">Disciples</span></div><p className="text-lg font-bold">{clan.disciples}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Crown className="w-4 h-4 text-pink-400" /><span className="text-purple-300">Reputation</span></div><p className="text-lg font-bold">{Math.floor(clan.reputation)}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><Hammer className="w-4 h-4 text-orange-300" /><span className="text-purple-300">Construct. Pts</span></div><p className="text-lg font-bold">{Math.floor(clan.constructionPoints)}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><BookOpen className="w-4 h-4 text-cyan-300" /><span className="text-purple-300">Research Pts</span></div><p className="text-lg font-bold">{Math.floor(clan.researchPoints)}</p></div>
            <div className="bg-purple-950/50 rounded p-2"><div className="flex items-center gap-1 mb-1"><GitFork className="w-4 h-4 text-green-300" /><span className="text-purple-300">Branch Tribute</span></div><p className="text-lg font-bold">{Math.floor(clan.branchTributeLastYear)}</p></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Patriarch & Events */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Patriarch Info */}
            <div data-tutorial-id="patriarch-panel" className="bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                    <Star className={`w-6 h-6 ${realmColor}`} />
                    {patriarch.name}
                </h2>
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-purple-400">({currentRealm.stage} Stage)</span>
                    {patriarch.patriarchTrait && <span className="text-sm text-yellow-400 font-semibold px-2 py-0.5 bg-yellow-900/50 rounded-full border border-yellow-500/50">{patriarch.patriarchTrait}</span>}
                </div>


                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-purple-300 text-sm">Age: {Math.floor(patriarch.age)} / {patriarch.effectiveLifespan}
                                {patriarch.age > patriarch.effectiveLifespan * 0.75 && <span className="text-xs text-orange-400 ml-2">(Decaying)</span>}
                            </span>
                            <span className={`font-bold text-sm ${realmColor}`}>{currentRealm.name} (Stage {patriarch.realmStage})</span>
                        </div>
                        <div className="bg-purple-950/50 rounded-full h-2 w-full"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all" style={{width: `${(patriarch.age / patriarch.effectiveLifespan) * 100}%`}}></div></div>
                    </div>
                     <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-purple-300 text-sm">Health</span>
                            <span className="text-green-400 text-sm font-bold">{Math.floor(patriarch.health)} / {patriarch.maxHealth}</span>
                        </div>
                        <div className="bg-purple-950/50 rounded-full h-2 w-full"><div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all" style={{width: `${(patriarch.health / patriarch.maxHealth) * 100}%`}}></div></div>
                    </div>
                     <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-purple-300 text-sm">Qi</span>
                            <span className="text-cyan-400 text-sm font-bold">{Math.floor(patriarch.qi)} / {patriarch.maxQi}</span>
                        </div>
                        <div className="bg-purple-950/50 rounded-full h-2 w-full"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all" style={{width: `${(patriarch.qi / patriarch.maxQi) * 100}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-purple-300 text-sm">Realm Progress</span>
                            <span className="text-yellow-400 text-sm font-bold">{patriarch.realmProgress.toFixed(2)}%</span>
                        </div>
                        <div className="bg-purple-950/50 rounded-full h-2 w-full"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all" style={{width: `${Math.min(patriarch.realmProgress, 100)}%`}}></div></div>
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4 text-center">
                    <div><p className="text-sm text-purple-300">Cultivation</p><p className="text-lg font-bold text-blue-400">{Math.floor(patriarch.cultivation)}</p></div>
                    <div><p className="text-sm text-purple-300">Strength</p><p className="text-lg font-bold text-red-400">{Math.floor(patriarchEffectiveStats.strength)}</p></div>
                    <div><p className="text-sm text-purple-300">Willpower</p><p className="text-lg font-bold text-purple-400">{Math.floor(patriarchEffectiveStats.willpower)}</p></div>
                    <div><p className="text-sm text-purple-300">Defense</p><p className="text-lg font-bold text-gray-400">{Math.floor(patriarchEffectiveStats.defense)}</p></div>
                    <div><p className="text-sm text-purple-300">Agility</p><p className="text-lg font-bold text-green-400">{Math.floor(patriarchEffectiveStats.agility)}</p></div>
                    <div><p className="text-sm text-purple-300">Leadership</p><p className="text-lg font-bold text-yellow-300">{Math.floor(patriarch.leadership)}</p></div>
                </div>

                <div className="mt-4 p-3 bg-purple-950/30 rounded">
                    <div className="flex items-center gap-2"><Swords className="w-5 h-5 text-red-400" /><span className="text-purple-300">Combat Power:</span><span className="font-bold text-yellow-400">{formatPower(patriarchCombatPower)}</span></div>
                    <p className="text-xs text-purple-400 italic mt-2">{currentRealm.desc}</p>
                </div>
                
                <div className="mt-4 p-3 bg-purple-950/30 rounded">
                    <h4 className="text-purple-300 text-sm font-semibold mb-2">Active Effects</h4>
                    {patriarch.buffs.length > 0 ? (
                        <ul className="text-xs space-y-1">
                            {patriarch.buffs.map((buff, i) => (
                                <li key={i} className="text-green-300">
                                    {buff.sourcePillName}: {buff.remainingDuration > 0 ? `${buff.remainingDuration} years remaining` : 'Single Use / Permanent'}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-xs text-purple-400 italic">No active effects.</p>}
                </div>
                
                <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-pink-400" /><span className="text-purple-300">Karma:</span><span className={`font-bold ${patriarch.karma > 60 ? 'text-green-400' : patriarch.karma < 40 ? 'text-red-400' : 'text-yellow-400'}`}>{patriarch.karma}</span></div>
                    <div className="flex items-center gap-2"><Star className="w-5 h-5 text-cyan-400" /><span className="text-purple-300">Talent:</span><span className="font-bold text-cyan-400">{Math.floor(patriarch.talent)}</span></div>
                </div>

                <div data-tutorial-id="cultivate-button" className="grid grid-cols-2 gap-3 mt-6">
                    <button onClick={() => dispatch({type: 'CULTIVATE'})} className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"><Flame className="w-5 h-5" /> Cultivate (10)</button>
                    <div className="relative group flex justify-center">
                        <button onClick={() => dispatch({type: 'ATTEMPT_BREAKTHROUGH'})} disabled={patriarch.realmProgress < 100} className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                            <TrendingUp className="w-5 h-5" /> {patriarch.realmStage < 9 ? 'Advance Stage' : 'Breakthrough'} ({patriarchBreakthroughChance.chance.toFixed(1)}%)
                        </button>
                        <BreakthroughTooltip breakdown={patriarchBreakthroughChance.breakdown} />
                    </div>
                </div>
                {youngHead && <button onClick={() => dispatch({type: 'FORCE_SUCCESSION'})} className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"><Crown className="w-5 h-5" /> Pass Leadership to Young Head</button>}
            </div>

            {/* Actions Panel */}
             <div className="bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 text-yellow-400">Clan Management</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <button onClick={() => dispatch({type: 'RECRUIT_DISCIPLES'})} className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded transition-colors text-left text-sm">Recruit Disciples (50)</button>
                    <button onClick={() => setDiplomacyModalOpen(true)} className="w-full px-4 py-2 bg-pink-700 hover:bg-pink-600 rounded transition-colors text-left text-sm flex items-center gap-1"><HeartHandshake size={16} /> Diplomacy & Marriage</button>
                    <button onClick={() => setDualCultivationModalOpen(true)} className="w-full px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition-colors text-left text-sm flex items-center gap-1"><Heart size={16} /> Dual Cultivation</button>
                    <button onClick={() => setInternalAffairsModalOpen(true)} className="w-full px-4 py-2 bg-green-700 hover:bg-green-600 rounded transition-colors text-left text-sm flex items-center gap-1"><GitFork size={16} /> Internal Affairs</button>
                    <button onClick={() => setCraftingModalOpen(true)} className="w-full px-4 py-2 bg-orange-700 hover:bg-orange-600 rounded transition-colors text-left text-sm flex items-center gap-1"><Hammer size={16} /> Crafting</button>
                    <button onClick={() => setArmoryModalOpen(true)} className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-left text-sm flex items-center gap-1"><Shield size={16} /> Armory</button>
                    <button onClick={() => setClanDevelopmentModalOpen(true)} className="w-full px-4 py-2 bg-teal-700 hover:bg-teal-600 rounded transition-colors text-left text-sm flex items-center gap-1"><Building size={16} /> Clan Development</button>
                    <button onClick={() => setAncestryModalOpen(true)} className="w-full px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-600 rounded transition-colors text-left text-sm flex items-center gap-1"><Dna size={16} /> Ancestry & Legacy</button>
                </div>
            </div>

          </div>

          {/* Events Feed */}
          <div data-tutorial-id="chronicles-panel" className="bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-400" /> Chronicles</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {events.map(event => (
                <div key={event.id} className={`p-2 rounded text-sm ${
                    event.type === 'legendary' ? 'bg-yellow-900/30 border border-yellow-500/50' :
                    event.type === 'success' ? 'bg-green-900/30 border border-green-500/50' :
                    event.type === 'danger' ? 'bg-red-900/30 border border-red-500/50' :
                    event.type === 'warning' ? 'bg-orange-900/30 border border-orange-500/50' :
                    'bg-purple-900/30 border border-purple-500/50'
                }`}>
                  <p className="text-xs text-purple-400 mb-1">{event.time}</p>
                  <p className="text-purple-100">{event.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clan Details Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Descendants */}
            <div className="bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 text-cyan-400">Clan Members ({clanMembers.length + 1})</h3>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                    {clanMembers.length === 0 ? <p className="text-purple-400 text-xs">No other clan members yet. Arrange marriages to produce offspring...</p> : clanMembers.filter(member => !member.isLivingAncestor).map((member) => {
                        const talentGrade = getTalentGrade(member.talent);
                        const gradeColor = getGradeColorClass(talentGrade.color);
                        const spouses = member.spouseIds.map(id => state.entities[id]).filter(Boolean);
                        const bloodlineColor = getBloodlineGradeColorClass(member.bloodline.tier);
                        const physiqueColor = getPhysiqueTierColorClass(member.physique.tier);
                        const memberBranch = member.branchId ? branches[member.branchId] : null;
                        return (
                            <div key={member.id} className="p-2 bg-purple-900/20 rounded border border-purple-500/30">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-xs text-purple-200 font-semibold">{member.name} {member.isYoungHead ? '👑' : ''}{member.isElder ? '🎓' : ''}{member.isDualCultivatingWith ? '❤️' : ''}
                                     {memberBranch && <span className="ml-2 text-xs text-green-400 bg-green-900/50 px-1.5 py-0.5 rounded-full">{memberBranch.name}</span>}
                                    </p>
                                    <div>
                                    {!member.isYoungHead && member.age >= 18 && member.realm >= 0 && <button onClick={() => dispatch({type: 'APPOINT_YOUNG_HEAD', payload: {personId: member.id}})} className="px-2 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-xs">Heir</button>}
                                    {!member.isElder && member.age >= 25 && member.realm >= 1 && <button onClick={() => dispatch({type: 'APPOINT_ELDER', payload: {personId: member.id}})} className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs ml-1">Elder</button>}
                                    </div>
                                </div>
                                <p className={`text-xs font-semibold ${gradeColor}`}>{talentGrade.name} ({member.talent})</p>
                                <p className="text-xs text-purple-400"><span className={`font-semibold ${bloodlineColor}`}>{member.bloodline.name}</span> • Age: {Math.floor(member.age)}</p>
                                {spouses.length > 0 && <p className="text-xs text-pink-400">Spouse(s): {spouses.map(s => `${s.name} (❤️${Math.floor(member.affection[s.id] || 50)})`).join(', ')}</p>}
                                {member.age < 12 ? <p className="text-xs text-gray-400">
                                    🐣 Too young to cultivate
                                </p> : <>
                                    <p className="text-xs text-cyan-400">{REALMS[member.realm].name} (Stage {member.realmStage})</p>
                                    {member.qiDeviation && <p className="text-xs text-red-500">💥 Qi Deviation!</p>}
                                    {member.failedBreakthroughs > 0 && !member.qiDeviation && <p className="text-xs text-orange-400">⚠️ Failed: {member.failedBreakthroughs}/3</p>}
                                    {member.physique.tier > 1 && <p className={`text-xs ${physiqueColor}`}>✨ {member.physique.name}</p>}
                                    {member.age >= 12 && member.realmProgress > 0 && !member.qiDeviation && (
                                        <div className="mt-1">
                                            <div className="bg-purple-950/50 rounded-full h-1"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{width: `${Math.min(member.realmProgress, 100)}%`}}></div></div>
                                            <p className="text-xs text-purple-500 mt-0.5">{member.realmProgress.toFixed(2)}%</p>
                                        </div>
                                    )}
                                </>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Ancestors */}
            <div className="bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 text-pink-400">Ancestors ({state.ancestors.length})</h3>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                    {state.ancestors.length === 0 ? <p className="text-purple-400 text-xs">None yet. Build your legacy...</p> : state.ancestors.map((ancestor, idx) => (
                        <div key={idx} className="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                            <div className="flex justify-between items-start">
                                {/* Left Column */}
                                <div>
                                    <p className="text-purple-100 text-base leading-tight">{ancestor.name}</p>
                                    <p className="text-purple-400 text-sm mt-1">Gen {ancestor.generation}</p>
                                    {ancestor.soulTablet && (
                                        <div className="flex items-center gap-1 mt-2 text-pink-400 text-xs">
                                            <span>📜</span>
                                            <span>Soul Tablet</span>
                                        </div>
                                    )}
                                </div>
                                {/* Right Column */}
                                <div className="text-right">
                                    <p className="font-semibold text-yellow-400">{REALMS[ancestor.realm].name}</p>
                                    <p className={`text-sm mt-1 ${ancestor.ancestorType === 'Ascended' ? 'text-gold-400' : ancestor.ancestorType === 'Spiritual' ? 'text-cyan-400' : 'text-gray-400'}`}>{ancestor.ancestorType}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
             {/* Elders */}
            <div className="bg-black/30 backdrop-blur-sm border-2 border-blue-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 text-blue-400">Elders ({elders.length})</h3>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                    {elders.length === 0 ? <p className="text-purple-400 text-xs">No elders appointed.</p> : elders.map((elder) => (
                        <div key={elder.id} className="text-xs bg-blue-900/20 p-2 rounded border border-blue-500/30">
                           <div className="flex justify-between items-center">
                               <div>
                                   <span className="font-bold text-blue-300">{elder.name}</span>
                                   {elder.elderType && <span className="text-xs text-blue-400 ml-2">({elder.elderType})</span>}
                               </div>
                               <span className="text-xs text-purple-300">{REALMS[elder.realm].name} (Stage {elder.realmStage})</span>
                           </div>
                            <p className="text-xs text-purple-400">Age: {Math.floor(elder.age)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Time Control */}
        <div data-tutorial-id="time-control" className="mt-6 text-center space-x-4">
            <button onClick={() => dispatch({type: 'ADVANCE_TIME', payload: {years: 1}})} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"><FastForward className="w-5 h-5" /> Advance Time (1 Year)</button>
            <button onClick={() => dispatch({type: 'ADVANCE_TIME', payload: {years: 10}})} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"><ChevronsRight className="w-5 h-5" /> Advance Time (10 Years)</button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;