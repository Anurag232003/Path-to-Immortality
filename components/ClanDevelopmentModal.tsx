import React, { useState } from 'react';
import { Clan, Facilities, GameAction, TimeState } from '../types';
import { FACILITIES_DATA } from '../constants/facilities';
import { TECH_TREE } from '../constants/tech-tree';
import { Building, Wrench, FlaskConical, X, GraduationCap } from 'lucide-react';

interface ClanDevelopmentModalProps {
  clan: Clan;
  time: TimeState;
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

type Tab = 'facilities' | 'construction' | 'research';

const ClanDevelopmentModal: React.FC<ClanDevelopmentModalProps> = ({ clan, time, dispatch, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('facilities');

  const handleUpgrade = (facilityId: keyof Facilities) => {
    dispatch({ type: 'START_CONSTRUCTION', payload: { facilityId } });
  };
  
  const handleResearch = (techId: string) => {
      dispatch({type: 'START_RESEARCH', payload: { techId }});
  }

  const renderFacilities = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(clan.facilities).map(([id, facility]) => {
        const facilityId = id as keyof Facilities;
        const data = FACILITIES_DATA[facilityId];
        const nextLevel = facility.level; // next level index is current level
        const nextLevelData = data.levels[nextLevel];
        const isMaxLevel = !nextLevelData;
        const isConstructing = clan.constructionQueue.some(p => p.facilityId === facilityId);

        let canUpgrade = !isMaxLevel && !isConstructing;
        if (nextLevelData) {
            if (clan.spiritStones < nextLevelData.cost.spiritStones) canUpgrade = false;
            if (clan.constructionPoints < nextLevelData.cost.constructionPoints) canUpgrade = false;
            if (nextLevelData.cost.spiritOre && clan.spiritOre < nextLevelData.cost.spiritOre) canUpgrade = false;
            if (facility.level + 1 > 1 && !clan.unlockedTechs.includes('advancedArchitecture')) canUpgrade = false;
        }

        return (
          <div key={id} className="p-4 bg-purple-950/50 rounded border border-purple-500/30 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-lg text-teal-300">{data.name}</h5>
              <p className="text-sm text-purple-200">Level: {facility.level}</p>
              <p className="text-xs text-purple-400">Efficiency: {facility.efficiency}% (Wear: {facility.wear}%)</p>
              <p className="text-xs text-purple-300 mt-2">{data.levels[facility.level-1].effectDescription}</p>
            </div>
            <div className="mt-4">
              {isConstructing ? (
                 <button disabled className="w-full px-3 py-2 bg-gray-600 rounded text-sm text-center">In Progress</button>
              ) : isMaxLevel ? (
                <button disabled className="w-full px-3 py-2 bg-yellow-800 rounded text-sm text-center">Max Level</button>
              ) : (
                <div className="group relative">
                    <button onClick={() => handleUpgrade(facilityId)} disabled={!canUpgrade} className="w-full px-3 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm text-center">
                        Upgrade to Lvl {facility.level + 1}
                    </button>
                    <div className="absolute bottom-full mb-2 w-full bg-slate-800 p-2 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                        <p>Cost: {nextLevelData.cost.spiritStones} SS, {nextLevelData.cost.constructionPoints} CP</p>
                        {nextLevelData.cost.spiritOre && <p>{nextLevelData.cost.spiritOre} Ore</p>}
                        <p>Time: {nextLevelData.buildTime} year(s)</p>
                        {facility.level + 1 > 1 && !clan.unlockedTechs.includes('advancedArchitecture') && <p className="text-red-400">Req: Advanced Architecture</p>}
                    </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderConstructionQueue = () => (
    <div>
        {clan.constructionQueue.length === 0 ? (
            <p className="text-purple-400 text-center py-8">No construction projects are currently active.</p>
        ) : (
            <div className="space-y-3">
                {clan.constructionQueue.map((p, idx) => (
                    <div key={idx} className="p-3 bg-purple-950/50 rounded">
                        <p className="font-semibold text-teal-300">{FACILITIES_DATA[p.facilityId].name} (to Lvl {p.targetLevel})</p>
                        <p className="text-sm text-purple-300">Years remaining: {p.endYear - time.year}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
  
  const renderResearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(TECH_TREE).map(tech => {
            const isUnlocked = clan.unlockedTechs.includes(tech.id);
            const canAfford = clan.researchPoints >= tech.cost;
            const prereqsMet = tech.requires.every(req => clan.unlockedTechs.includes(req));
            const canResearch = !isUnlocked && canAfford && prereqsMet;
            return (
                <div key={tech.id} className={`p-4 rounded border ${isUnlocked ? 'bg-green-900/30 border-green-500/50' : 'bg-purple-950/50 border-purple-500/30'}`}>
                    <h5 className="font-bold text-lg text-cyan-300">{tech.name}</h5>
                    <p className="text-xs text-purple-400">{tech.branch}</p>
                    <p className="text-sm text-purple-200 my-2">{tech.description}</p>
                    <p className="text-sm font-semibold">Cost: {tech.cost} RP</p>
                    {tech.requires.length > 0 && <p className="text-xs text-purple-400">Requires: {tech.requires.map(r => TECH_TREE[r]?.name).join(', ')}</p>}
                    <button onClick={() => handleResearch(tech.id)} disabled={!canResearch} className="mt-3 w-full px-3 py-2 bg-cyan-700 hover:bg-cyan-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {isUnlocked ? 'Researched' : 'Research'}
                    </button>
                </div>
            )
        })}
    </div>
  )


  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-teal-500/50 rounded-lg p-6 max-w-6xl w-full text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-teal-400 flex items-center gap-2"><Building /> Clan Development</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>
        
        <div className="flex border-b border-purple-800 mb-4">
          <button onClick={() => setActiveTab('facilities')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'facilities' ? 'border-b-2 border-teal-400 text-teal-300' : 'text-purple-300'}`}><FlaskConical size={16}/> Facilities</button>
          <button onClick={() => setActiveTab('construction')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'construction' ? 'border-b-2 border-teal-400 text-teal-300' : 'text-purple-300'}`}><Wrench size={16}/> Construction ({clan.constructionQueue.length})</button>
          <button onClick={() => setActiveTab('research')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'research' ? 'border-b-2 border-teal-400 text-teal-300' : 'text-purple-300'}`}><GraduationCap size={16}/> Research</button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2">
            {activeTab === 'facilities' && renderFacilities()}
            {activeTab === 'construction' && renderConstructionQueue()}
            {activeTab === 'research' && renderResearch()}
        </div>

      </div>
    </div>
  );
};

export default ClanDevelopmentModal;