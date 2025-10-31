import React, { useState, useMemo } from 'react';
import { Clan, GameAction, Person, Artifact } from '../types';
import { getBloodlineGradeColorClass, getPhysiqueTierColorClass } from '../utils/helpers';
import { Dna, ShieldCheck, X, Heart, Gem, BarChart, Zap, Gift, UserCheck } from 'lucide-react';
import { BLESSING_TREE, OFFERING_TYPES, CURSES } from '../constants/ancestralHall';
import { REALMS } from '../constants';


interface AncestryModalProps {
  allMembers: Person[];
  clan: Clan;
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

type Tab = 'lineage' | 'blessings' | 'offerings';

const AncestryModal: React.FC<AncestryModalProps> = ({ allMembers, clan, dispatch, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('lineage');
  const [selectedArtifact, setSelectedArtifact] = useState('');

  const clanMembers = useMemo(() => {
    return allMembers.filter(m => m.clanId === clan.id && !m.isLivingAncestor).sort((a,b) => b.talent - a.talent);
  }, [allMembers, clan.id]);
  
  const livingAncestors = useMemo(() => {
      return allMembers.filter(m => m.isLivingAncestor && m.alive);
  }, [allMembers]);

  const handleBlessingRitual = (personId: string) => {
    dispatch({ type: 'PERFORM_BLOODLINE_RITUAL', payload: { personId } });
  };
  
  const eligibleForBlessing = useMemo(() => {
      return clanMembers.filter(p => p.alive && p.gender === 'Female' && p.age >= 16 && p.age <= 45 && p.spouseIds.length > 0 && !p.blessedByAncestor);
  }, [clanMembers]);
  
  const unequippedArtifacts = useMemo(() => {
      return Object.values(clan.artifacts).filter(a => !a.boundTo);
  }, [clan.artifacts]);

  const handleOffering = (type: 'spiritStones' | 'herbs' | 'artifact') => {
      if (type === 'artifact' && !selectedArtifact) return;
      dispatch({ type: 'PERFORM_OFFERING', payload: { offeringType: type, artifactId: selectedArtifact } });
  };
  
  const handleUnlockBlessing = (blessingId: string) => {
      dispatch({ type: 'UNLOCK_BLESSING', payload: { blessingId } });
  }

  const renderLineage = () => (
    <>
        <h4 className="text-xl font-bold text-cyan-400 mb-3">Living Members</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {clanMembers.map(member => {
                const bloodlineColor = getBloodlineGradeColorClass(member.bloodline.tier);
                const physiqueColor = getPhysiqueTierColorClass(member.physique.tier);
                return (
                     <div key={member.id} className="p-3 bg-purple-950/50 rounded border border-purple-500/30">
                        <p className="font-semibold text-lg">{member.name}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                                <p className="text-purple-300">Bloodline:</p>
                                <p className={`font-bold ${bloodlineColor}`}>{member.bloodline.name} (Tier {member.bloodline.tier})</p>
                            </div>
                            <div>
                                <p className="text-purple-300">Physique:</p>
                                <p className={`font-bold ${physiqueColor}`}>{member.physique.name} (Tier {member.physique.tier})</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        <h4 className="text-xl font-bold text-yellow-400 mt-6 mb-3 flex items-center gap-2"><UserCheck /> Living Ancestors ({livingAncestors.length})</h4>
         <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {livingAncestors.length > 0 ? livingAncestors.map(ancestor => {
                 const currentRealm = REALMS[ancestor.realm];
                return (
                    <div key={ancestor.id} className="p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-lg text-yellow-300">{ancestor.name}</p>
                            <span className="text-sm text-purple-300">{currentRealm.name}</span>
                        </div>
                        <p className="text-xs text-purple-300">Age: {Math.floor(ancestor.age)} / {ancestor.effectiveLifespan}</p>
                        <p className="text-xs text-yellow-400 mt-2">Guides the clan from seclusion, providing passive bonuses to cultivation, research, and reputation.</p>
                    </div>
                );
            }) : <p className="text-purple-400">No living ancestors are currently guiding the clan.</p>}
        </div>
    </>
  );

  const renderBlessings = () => (
    <div>
      <div className="p-3 bg-purple-950/50 rounded-lg mb-4 text-center">
        <p className="font-bold text-lg">Ancestral Favor: <span className="text-pink-400">{clan.ancestralFavor}</span> • Ancestral Faith: <span className="text-cyan-400">{clan.ancestralFaith}</span></p>
         {clan.activeCurse && <p className="text-red-400 font-bold mt-2">ACTIVE CURSE: {CURSES[clan.activeCurse as keyof typeof CURSES].name}</p>}
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(BLESSING_TREE).map(([id, blessing]) => {
          const isUnlocked = clan.unlockedBlessings.includes(id);
          const canAfford = clan.ancestralFavor >= blessing.cost;
          const faithMet = clan.ancestralFaith >= blessing.faithRequired;
          const prereqsMet = blessing.requires.every(req => clan.unlockedBlessings.includes(req));
          const canUnlock = !isUnlocked && canAfford && faithMet && prereqsMet;

          return (
            <div key={id} className={`p-4 rounded border flex flex-col justify-between ${isUnlocked ? 'bg-green-900/30 border-green-500/50' : canUnlock ? 'border-yellow-500/50' : 'bg-gray-800/50 border-gray-700'}`}>
              <div>
                <h5 className={`font-bold text-lg ${isUnlocked ? 'text-green-300' : canUnlock ? 'text-yellow-300' : 'text-gray-400'}`}>{blessing.name}</h5>
                <p className="text-xs text-purple-400">{blessing.branch} Branch</p>
                <p className="text-sm text-purple-200 my-2">{blessing.description}</p>
                {blessing.requires.length > 0 && <p className="text-xs text-purple-400">Requires: {blessing.requires.map(r => BLESSING_TREE[r]?.name).join(', ')}</p>}
              </div>
              <button onClick={() => handleUnlockBlessing(id)} disabled={!canUnlock} className="mt-3 w-full px-3 py-2 rounded text-sm disabled:cursor-not-allowed font-bold
                ${isUnlocked ? 'bg-green-600' : canUnlock ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 opacity-50'}
              ">
                {isUnlocked ? 'Unlocked' : `Unlock (${blessing.cost} Favor)`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderOfferings = () => (
    <div>
      <h4 className="text-xl font-bold text-yellow-400 mb-2">Offerings & Rituals</h4>
      <p className="text-purple-300 mb-4">Honor the ancestors to increase your clan's Ancestral Faith. High faith is required to unlock powerful blessings and prevents curses from befalling your clan.</p>
       <div className="p-3 bg-purple-950/50 rounded-lg mb-4 text-center">
        <p className="font-bold text-lg">Ancestral Faith: <span className="text-cyan-400">{clan.ancestralFaith}</span></p>
      </div>

      <div className="space-y-4">
        {/* Resource Offerings */}
        <div className="p-4 bg-slate-800/50 rounded">
          <h5 className="font-semibold text-lg text-cyan-300 mb-2">Resource Offerings</h5>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p>Offer 100 Spirit Stones (+10 Faith)</p>
              <button onClick={() => handleOffering('spiritStones')} disabled={clan.spiritStones < 100} className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-sm rounded disabled:opacity-50">Offer</button>
            </div>
             <div className="flex justify-between items-center">
              <p>Offer 200 Herbs (+20 Faith)</p>
              <button onClick={() => handleOffering('herbs')} disabled={clan.herbs < 200} className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-sm rounded disabled:opacity-50">Offer</button>
            </div>
          </div>
        </div>
        
        {/* Artifact Offering */}
        <div className="p-4 bg-slate-800/50 rounded">
           <h5 className="font-semibold text-lg text-cyan-300 mb-2">Sacrifice Artifact (+50 Faith)</h5>
           <div className="flex gap-2">
            <select value={selectedArtifact} onChange={e => setSelectedArtifact(e.target.value)} className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/50 rounded focus:outline-none focus:border-pink-400">
              <option value="">Select an artifact...</option>
              {unequippedArtifacts.map(a => <option key={a.id} value={a.id}>{a.name} (T{a.tier})</option>)}
            </select>
            <button onClick={() => handleOffering('artifact')} disabled={!selectedArtifact} className="px-3 py-1 bg-orange-700 hover:bg-orange-600 text-sm rounded disabled:opacity-50">Sacrifice</button>
           </div>
        </div>

        {/* Bloodline Ritual */}
         <div className="p-4 bg-slate-800/50 rounded">
            <h5 className="font-semibold text-lg text-pink-400 mb-2">Bloodline Blessing Ritual</h5>
            <p className="text-sm text-purple-300 mb-3">Spend 100 Ancestral Favor to bless an expecting mother, greatly improving her next child's potential.</p>
            {eligibleForBlessing.length === 0 ? (
                <p className="text-purple-400 text-center py-2">No members eligible for blessing.</p>
            ) : eligibleForBlessing.map(person => (
                <div key={person.id} className="flex items-center justify-between p-2 bg-purple-950/50 rounded mt-2">
                    <p>{person.name}</p>
                    <button onClick={() => handleBlessingRitual(person.id)} disabled={clan.ancestralFavor < 100} className="px-4 py-2 rounded font-bold text-sm bg-pink-600 hover:bg-pink-700 disabled:opacity-50">
                        Bless (100 Favor)
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-fuchsia-500/50 rounded-lg p-6 max-w-4xl w-full text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-fuchsia-400 flex items-center gap-2"><Dna /> Ancestry & Legacy</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>
        
        <div className="flex border-b border-purple-800 mb-4">
          <button onClick={() => setActiveTab('lineage')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'lineage' ? 'border-b-2 border-fuchsia-400 text-fuchsia-300' : 'text-purple-300'}`}><Dna size={16}/> Lineage</button>
          <button onClick={() => setActiveTab('blessings')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'blessings' ? 'border-b-2 border-fuchsia-400 text-fuchsia-300' : 'text-purple-300'}`}><Gift size={16}/> Blessings</button>
          <button onClick={() => setActiveTab('offerings')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'offerings' ? 'border-b-2 border-fuchsia-400 text-fuchsia-300' : 'text-purple-300'}`}><ShieldCheck size={16}/> Offerings & Rituals</button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2">
            {activeTab === 'lineage' && renderLineage()}
            {activeTab === 'blessings' && renderBlessings()}
            {activeTab === 'offerings' && renderOfferings()}
        </div>

      </div>
    </div>
  );
};

export default AncestryModal;