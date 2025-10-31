import React from 'react';
import { Clan, GameAction, Recipe } from '../types';
import { RECIPES } from '../constants/recipes';
import { Hammer, FlaskConical, X, Swords } from 'lucide-react';

interface CraftingModalProps {
  clan: Clan;
  patriarchId: string | null;
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

const CraftingModal: React.FC<CraftingModalProps> = ({ clan, patriarchId, dispatch, onClose }) => {
  const handleCraft = (recipeId: string) => {
    dispatch({ type: 'CRAFT_ITEM', payload: { recipeId } });
  };

  const handleUsePill = (pillId: string) => {
    if (patriarchId) {
        dispatch({ type: 'USE_PILL', payload: { pillId, personId: patriarchId } });
    }
  };

  const artifacts = Object.values(clan.artifacts);
  const pills = Object.values(clan.pills);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border-2 border-orange-500/50 rounded-lg p-6 max-w-4xl w-full text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-orange-400 flex items-center gap-2"><Hammer /> Crafting & Inventory</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crafting Recipes */}
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-3">Recipes</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {RECIPES.map((recipe: Recipe) => {
                const canAfford = recipe.inputs.every(input => {
                    if (input.id === 'spiritStones') return clan.spiritStones >= input.qty;
                    if (input.id === 'herbs') return clan.herbs >= input.qty;
                    if (input.id === 'spiritOre') return clan.spiritOre >= input.qty;
                    if (input.id === 'beastCores') return clan.beastCores >= input.qty;
                    return false;
                });
                const facilitySufficient = clan.facilities[recipe.facility].level >= recipe.requiredLevel;
                const canCraft = canAfford && facilitySufficient;
                
                return (
                  <div key={recipe.id} className="p-4 bg-purple-950/50 rounded border border-purple-500/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-lg text-orange-300">{recipe.name}</h5>
                        <p className="text-xs text-purple-300 mt-1">{recipe.description}</p>
                      </div>
                      <button 
                        onClick={() => handleCraft(recipe.id)}
                        disabled={!canCraft}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold text-sm"
                      >
                        Craft
                      </button>
                    </div>
                    <div className="mt-3 border-t border-purple-800 pt-3">
                      <p className={`text-xs ${facilitySufficient ? 'text-green-400' : 'text-red-400'}`}>
                        Requires {recipe.facility} Lv.{recipe.requiredLevel} (Current: Lv.{clan.facilities[recipe.facility].level})
                      </p>
                      <ul className="text-xs mt-1">
                        {recipe.inputs.map(input => (
                          <li key={input.id} className={`${(clan[input.id] as number) >= input.qty ? 'text-purple-300' : 'text-red-400'}`}>
                            - {input.id}: {input.qty} (Have: {clan[input.id]})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Inventory */}
          <div>
            <h4 className="text-xl font-bold text-cyan-400 mb-3">Inventory</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div>
                    <h5 className="font-semibold text-green-400 flex items-center gap-2 mb-2"><FlaskConical size={16}/> Pills</h5>
                    <div className="space-y-2">
                        {pills.length > 0 ? pills.map((pill) => (
                           <div key={pill.id} className="p-2 bg-green-900/20 rounded">
                               <div className="flex justify-between items-center">
                                    <span className="font-semibold">{pill.name} [{pill.tier}]</span>
                                    <button onClick={() => handleUsePill(pill.id)} className="px-3 py-1 bg-green-700 hover:bg-green-600 text-xs rounded">Use on Patriarch</button>
                               </div>
                               <p className="text-xs text-purple-300 mt-1">{pill.description}</p>
                           </div>
                        )) : <p className="text-xs text-purple-400">No pills crafted.</p>}
                    </div>
                </div>
                 <div>
                    <h5 className="font-semibold text-gray-400 flex items-center gap-2 mb-2"><Swords size={16}/> Artifacts</h5>
                    <div className="space-y-2">
                        {artifacts.length > 0 ? artifacts.map((artifact) => (
                           <div key={artifact.id} className="flex justify-between items-center p-2 bg-gray-800/20 rounded">
                               <div>
                                <span className="font-semibold">{artifact.name}</span>
                                <p className="text-xs text-gray-400">Tier {artifact.tier} {artifact.type}</p>
                               </div>
                               <span className="text-sm text-yellow-400">Power: {artifact.basePower}</span>
                           </div>
                        )) : <p className="text-xs text-purple-400">No artifacts forged.</p>}
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded font-bold">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CraftingModal;