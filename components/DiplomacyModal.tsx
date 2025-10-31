import React, { useState, useMemo, useEffect } from 'react';
import { Person, Clan, ClanInfo, GameAction, AllianceType, ClanAffinity } from '../types';
import { calculateCompatibility } from '../game-engine/socialLogic';
import { isCloseKin } from '../game-engine/kinshipLogic';
import { Handshake, HeartHandshake, X, Package, Shield, FileText } from 'lucide-react';

interface DiplomacyModalProps {
  allMembers: Person[];
  playerClan: Clan;
  clans: Record<string, ClanInfo>;
  entities: Record<string, Person>;
  onClose: () => void;
  dispatch: React.Dispatch<GameAction>;
}

type Tab = 'relations' | 'marriage' | 'alliances';

const opposingAffinities: Partial<Record<ClanAffinity, ClanAffinity>> = {
  Fire: 'Water',
  Water: 'Fire',
  Light: 'Dark',
  Dark: 'Light',
  Yin: 'Yang',
  Yang: 'Yin',
  Wood: 'Metal',
  Metal: 'Wood',
  Lightning: 'Earth',
  Earth: 'Lightning',
};

const DiplomacyModal: React.FC<DiplomacyModalProps> = ({ allMembers, playerClan, clans, entities, onClose, dispatch }) => {
  const [activeTab, setActiveTab] = useState<Tab>('relations');
  
  // Marriage State
  const [proposerId, setProposerId] = useState('');
  const [targetClanId, setTargetClanId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [compatibility, setCompatibility] = useState<{ compatibility: number; breakdown: any } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const proposer = entities[proposerId];
  const target = entities[targetId];

  useEffect(() => {
    setValidationError(null);
    if (proposer && target) {
      const proposerClan = clans[proposer.clanId];
      const targetClan = clans[target.clanId];

      if (isCloseKin(proposer, target, entities)) {
        setValidationError("Cannot marry: they are too closely related.");
      } else if (proposer.gender === target.gender) {
        setValidationError("Marriage must be between a male and a female.");
      } else if (proposerClan && targetClan && opposingAffinities[proposerClan.affinity] === targetClan.affinity) {
        setValidationError("Warning: A Forbidden Union of opposing elements! Such a marriage may lead to unforeseen consequences.");
      }
      setCompatibility(calculateCompatibility(proposer, target));
    } else {
      setCompatibility(null);
    }
  }, [proposerId, targetId, entities, clans]);
  
  const eligibleProposers = useMemo(() => {
    return allMembers.filter(m => m.clanId === playerClan.id && m.age >= 16 && m.alive && m.spouseIds.length === 0);
  }, [allMembers, playerClan.id]);
  
  const eligibleTargets = useMemo(() => {
      if (!proposer || !targetClanId) return [];
      return allMembers.filter(m => 
          m.clanId === targetClanId &&
          m.age >= 16 &&
          m.alive &&
          m.spouseIds.length === 0 &&
          m.gender !== proposer.gender &&
          !isCloseKin(proposer, m, entities)
      );
  }, [proposer, targetClanId, allMembers, entities]);

  const handlePropose = () => {
    if (proposerId && targetId && !validationError) {
      dispatch({ type: 'PROPOSE_MARRIAGE', payload: { proposerId, targetId } });
      onClose();
    }
  };
  
  const handleProposeAlliance = (targetClanId: string, allianceType: AllianceType) => {
    dispatch({ type: 'PROPOSE_ALLIANCE', payload: { targetClanId, allianceType } });
  }

  const handleBreakAlliance = (targetClanId: string) => {
    dispatch({ type: 'BREAK_ALLIANCE', payload: { targetClanId } });
  }

  const dowry = { spiritStones: 100, diplomaticGrace: 50 };
  const canAffordDowry = playerClan.spiritStones >= dowry.spiritStones && playerClan.diplomaticGrace >= dowry.diplomaticGrace;

  const renderRelations = () => (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      {Object.values(clans)
        .filter(c => c.id !== playerClan.id)
        .sort((a,b) => b.relation - a.relation)
        .map(clanInfo => {
        const patriarch = Object.values(entities).find(p => p.clanId === clanInfo.id && p.isPatriarch);
        const relationColor = clanInfo.relation > 30 ? 'text-green-400' : clanInfo.relation < -30 ? 'text-red-400' : 'text-yellow-400';
        return (
          <div key={clanInfo.id} className="p-3 bg-purple-950/50 rounded border border-purple-500/30 flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{clanInfo.name}</p>
              <p className="text-xs text-purple-300">Patriarch: {patriarch?.name || 'Unknown'}</p>
              {clanInfo.description && <p className="text-xs text-purple-400 mt-1 italic">{clanInfo.description}</p>}
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">Relation</p>
              <p className={`font-bold text-xl ${relationColor}`}>{Math.floor(clanInfo.relation)}</p>
            </div>
          </div>
        )
      })}
    </div>
  );

  const renderAlliances = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
        <div>
            <h4 className="text-xl font-bold text-cyan-400 mb-3">Current Alliances</h4>
            <div className="space-y-3">
                {playerClan.alliances.length === 0 ? <p className="text-purple-400">No active alliances.</p> :
                 playerClan.alliances.map(alliance => (
                     <div key={alliance.withClanId} className="p-3 bg-purple-950/50 rounded flex justify-between items-center">
                         <div>
                             <p className="font-bold">{clans[alliance.withClanId].name}</p>
                             <p className="text-sm text-cyan-300">{alliance.type === 'TradePact' ? 'Trade Pact' : 'Defense Treaty'}</p>
                         </div>
                         <button onClick={() => handleBreakAlliance(alliance.withClanId)} className="px-3 py-1 bg-red-700 hover:bg-red-600 text-xs rounded">Break</button>
                     </div>
                 ))
                }
            </div>
        </div>
        <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-3">Propose Alliance</h4>
            <div className="space-y-2">
                {Object.values(clans)
                 .filter(c => c.id !== playerClan.id && !playerClan.alliances.some(a => a.withClanId === c.id))
                 .map(clanInfo => {
                    const canPropose = clanInfo.relation >= 20 && playerClan.diplomaticGrace >= 50;
                    return (
                        <div key={clanInfo.id} className="p-3 bg-slate-800/50 rounded flex justify-between items-center">
                            <div>
                                <p className="font-bold">{clanInfo.name}</p>
                                <p className="text-sm text-purple-300">Relation: {Math.floor(clanInfo.relation)}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleProposeAlliance(clanInfo.id, 'TradePact')} disabled={!canPropose} className="px-3 py-1 bg-green-700 hover:bg-green-600 text-xs rounded disabled:opacity-50 flex items-center gap-1"><Package size={14}/> Trade</button>
                                <button onClick={() => handleProposeAlliance(clanInfo.id, 'DefenseTreaty')} disabled={!canPropose} className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-xs rounded disabled:opacity-50 flex items-center gap-1"><Shield size={14}/> Defense</button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <p className="text-xs text-purple-400 mt-3">Alliances require at least 20 Relation and cost 50 Diplomatic Grace to propose.</p>
        </div>
    </div>
  );

  const renderMarriage = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-1">Your Clan Member (Proposer)</label>
        <select value={proposerId} onChange={e => { setProposerId(e.target.value); setTargetId(''); }} className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/50 rounded focus:outline-none focus:border-pink-400">
          <option value="">Select a member</option>
          {eligibleProposers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.gender}, Age: {Math.floor(p.age)})</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-300 mb-1">Target Clan</label>
        <select value={targetClanId} onChange={e => { setTargetClanId(e.target.value); setTargetId(''); }} disabled={!proposerId} className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/50 rounded focus:outline-none focus:border-pink-400 disabled:opacity-50">
          <option value="">Select a clan</option>
          {Object.values(clans).filter(c => c.id !== playerClan.id).map(c => <option key={c.id} value={c.id}>{c.name} (Relation: {Math.floor(c.relation)})</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-300 mb-1">Potential Spouse</label>
        <select value={targetId} onChange={e => setTargetId(e.target.value)} disabled={!targetClanId} className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/50 rounded focus:outline-none focus:border-pink-400 disabled:opacity-50">
          <option value="">Select a partner ({eligibleTargets.length} options)</option>
          {eligibleTargets.map(p => <option key={p.id} value={p.id}>{p.name} (Talent: {p.talent}, Age: {Math.floor(p.age)})</option>)}
        </select>
      </div>

      {validationError && <p className={`mt-4 text-sm text-center p-2 rounded ${validationError.startsWith('Warning') ? 'text-yellow-300 bg-yellow-900/30' : 'text-red-400 bg-red-900/30'}`}>{validationError}</p>}
      
      {compatibility && !validationError.startsWith("Cannot") && (
        <div className="mt-4 p-3 bg-purple-950/50 rounded border border-purple-500/30">
          <h4 className="text-lg font-bold text-yellow-400">Compatibility: {compatibility.compatibility}/100</h4>
          <p className="text-xs mt-1 text-purple-300">Unions with compatibility below 40 are considered inauspicious and will fail.</p>
        </div>
      )}

       <div className="mt-4 p-3 bg-black/30 rounded border border-purple-500/30">
        <h4 className="text-lg font-bold text-cyan-400">Dowry & Costs</h4>
        <p className={`text-sm ${playerClan.spiritStones >= dowry.spiritStones ? 'text-purple-300' : 'text-red-400'}`}>- {dowry.spiritStones} Spirit Stones (Have: {playerClan.spiritStones})</p>
        <p className={`text-sm ${playerClan.diplomaticGrace >= dowry.diplomaticGrace ? 'text-purple-300' : 'text-red-400'}`}>- {dowry.diplomaticGrace} Diplomatic Grace (Have: {playerClan.diplomaticGrace})</p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handlePropose}
          disabled={!proposerId || !targetId || validationError?.startsWith("Cannot") || !canAffordDowry || (compatibility?.compatibility ?? 0) < 40}
          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold"
        >
          Propose Marriage
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-pink-500/50 rounded-lg p-6 max-w-4xl w-full text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-pink-400 flex items-center gap-2"><HeartHandshake /> Diplomacy</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        <div className="flex border-b border-purple-800 mb-4">
          <button onClick={() => setActiveTab('relations')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'relations' ? 'border-b-2 border-pink-400 text-pink-300' : 'text-purple-300'}`}><Handshake size={16}/> Clan Relations</button>
          <button onClick={() => setActiveTab('alliances')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'alliances' ? 'border-b-2 border-pink-400 text-pink-300' : 'text-purple-300'}`}><FileText size={16}/> Alliances</button>
          <button onClick={() => setActiveTab('marriage')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'marriage' ? 'border-b-2 border-pink-400 text-pink-300' : 'text-purple-300'}`}><HeartHandshake size={16}/> Marriage</button>
        </div>
        
        {activeTab === 'relations' && renderRelations()}
        {activeTab === 'alliances' && renderAlliances()}
        {activeTab === 'marriage' && renderMarriage()}
      </div>
    </div>
  );
};

export default DiplomacyModal;