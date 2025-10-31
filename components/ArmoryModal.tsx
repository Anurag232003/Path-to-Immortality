import React from 'react';
import { Clan, Person, Artifact, GameAction } from '../types';
import { Shield, Swords, Sparkles, Gem, X, Star, Zap, Droplets, Link, Wrench } from 'lucide-react';
import { ARTIFACT_Tiers } from '../constants/artifacts';

interface ArmoryModalProps {
  clan: Clan;
  patriarch: Person;
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

const ArmoryModal: React.FC<ArmoryModalProps> = ({ clan, patriarch, dispatch, onClose }) => {
  const artifacts = Object.values(clan.artifacts);
  const inventory = artifacts.filter(a => a.boundTo !== patriarch.id);

  const handleEquip = (artifactId: string) => {
    dispatch({ type: 'EQUIP_ARTIFACT', payload: { personId: patriarch.id, artifactId } });
  };
  
  const handleUnequip = (slot: keyof Person['equipment']) => {
    dispatch({ type: 'UNEQUIP_ARTIFACT', payload: { personId: patriarch.id, slot } });
  };

  const handleTemper = (artifactId: string) => {
    dispatch({ type: 'TEMPER_ARTIFACT', payload: { artifactId } });
  };

  const EquipmentSlot: React.FC<{ slotName: keyof Person['equipment']; icon: React.ReactNode }> = ({ slotName, icon }) => {
    const artifactId = patriarch.equipment[slotName];
    const artifact = artifactId ? clan.artifacts[artifactId] : null;

    return (
      <div className="bg-purple-950/50 p-3 rounded-lg border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h5 className="font-bold capitalize">{slotName}</h5>
        </div>
        {artifact ? (
          <div>
            <p className={`font-semibold ${ARTIFACT_Tiers[artifact.tier]?.color}`}>{artifact.name} [{ARTIFACT_Tiers[artifact.tier]?.name}]</p>
            <p className="text-xs text-purple-300">Power: {artifact.basePower} (+{artifact.temperLevel * 10}%)</p>
            <p className="text-xs text-purple-300">Temper: +{artifact.temperLevel}</p>
            {artifact.effects && artifact.effects.length > 0 && (
              <div className="mt-2 pt-2 border-t border-purple-800/50">
                <h6 className="text-xs font-bold text-yellow-300">Effects:</h6>
                <ul className="list-disc list-inside text-xs text-purple-300 space-y-1">
                  {artifact.effects.map((effect, index) => (
                    <li key={index}>{effect.description}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleUnequip(slotName)} className="w-full px-2 py-1 bg-gray-600 hover:bg-gray-500 text-xs rounded">Unequip</button>
              <button onClick={() => handleTemper(artifact.id)} className="w-full px-2 py-1 bg-orange-600 hover:bg-orange-500 text-xs rounded">Temper</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-purple-400 italic">Empty</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-gray-500/50 rounded-lg p-6 max-w-5xl w-full text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-300 flex items-center gap-2"><Shield /> Armory</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patriarch Equipment */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-xl font-bold text-yellow-400">{patriarch.name}'s Equipment</h4>
            <EquipmentSlot slotName="weapon" icon={<Swords className="text-red-400" />} />
            <EquipmentSlot slotName="armor" icon={<Shield className="text-blue-400" />} />
            <EquipmentSlot slotName="accessory" icon={<Gem className="text-green-400" />} />
            <EquipmentSlot slotName="relic" icon={<Sparkles className="text-yellow-300" />} />
          </div>

          {/* Inventory */}
          <div className="md:col-span-2">
            <h4 className="text-xl font-bold text-cyan-400 mb-4">Clan Inventory</h4>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {inventory.length > 0 ? inventory.map(artifact => {
                const isEquippable = !artifact.boundTo;
                return (
                  <div key={artifact.id} className="p-3 bg-purple-950/50 rounded border border-purple-500/30 flex flex-col items-start">
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className={`font-semibold ${ARTIFACT_Tiers[artifact.tier]?.color}`}>{artifact.name} <span className="text-xs text-purple-400">({ARTIFACT_Tiers[artifact.tier]?.name})</span></p>
                        <div className="flex gap-4 text-xs mt-1 text-purple-300">
                            <span><Zap size={12} className="inline-block mr-1" />Pwr: {artifact.basePower}</span>
                            <span><Wrench size={12} className="inline-block mr-1" />Tpr: +{artifact.temperLevel}</span>
                            <span><Link size={12} className="inline-block mr-1" />Lnk: {artifact.soulLink.toFixed(1)}</span>
                            <span><Droplets size={12} className="inline-block mr-1" />Dur: {artifact.durability.toFixed(0)}</span>
                        </div>
                      </div>
                      {isEquippable ? (
                        <button onClick={() => handleEquip(artifact.id)} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-sm rounded">Equip</button>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Equipped by other</span>
                      )}
                    </div>
                     {artifact.effects && artifact.effects.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-purple-800/50 w-full">
                        <ul className="list-disc list-inside text-xs text-purple-300 space-y-1">
                          {artifact.effects.map((effect, index) => (
                            <li key={index}>{effect.description}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }) : <p className="text-purple-400 text-center py-8">No artifacts in inventory.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmoryModal;