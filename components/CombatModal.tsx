import React from 'react';
import { GameAction, CombatState, Technique, Person, Enemy, GameState } from '../types';
import { Swords } from 'lucide-react';

interface CombatModalProps {
  combatState: CombatState;
  allTechniques: Record<string, Technique>;
  dispatch: React.Dispatch<GameAction>;
  state: GameState;
}

const CombatantDisplay: React.FC<{ combatant: Person | Enemy }> = ({ combatant }) => {
    const realmColor = 'text-yellow-400';
    return (
        <div className="bg-purple-950/50 p-4 rounded-lg border border-purple-500/30">
            <h4 className="text-xl font-bold">{combatant.name}</h4>
            <p className={`text-sm ${realmColor}`}>Realm {combatant.realm}</p>
            <div className="mt-4 space-y-2">
                <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-green-300">Health</span><span>{Math.ceil(combatant.health)} / {combatant.maxHealth}</span></div>
                    <div className="bg-slate-800 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(combatant.health / combatant.maxHealth) * 100}%` }}></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-blue-300">Qi</span><span>{Math.ceil(combatant.qi)} / {combatant.maxQi}</span></div>
                    <div className="bg-slate-800 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(combatant.qi / combatant.maxQi) * 100}%` }}></div></div>
                </div>
            </div>
        </div>
    );
};


const CombatModal: React.FC<CombatModalProps> = ({ combatState, allTechniques, dispatch }) => {
  const { combatants, playerRef, enemyRef, log } = combatState;
  const player = combatants[playerRef] as Person;
  const enemy = combatants[enemyRef] as Enemy;
  
  const isCombatOver = player.health <= 0 || enemy.health <= 0;
  const playerWon = enemy.health <= 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-red-500/50 rounded-lg p-6 max-w-4xl w-full text-white">
        <h3 className="text-3xl font-bold text-red-400 mb-4 text-center flex items-center justify-center gap-2"><Swords /> Combat Engaged! <Swords /></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <CombatantDisplay combatant={player} />
            <CombatantDisplay combatant={enemy} />
        </div>
        
        <div className="bg-black/30 p-3 rounded-lg h-32 overflow-y-auto mb-4 border border-purple-800">
            {log.map((entry, index) => (
                <p key={index} className="text-sm text-purple-200 font-mono">&gt; {entry}</p>
            ))}
        </div>

        {isCombatOver ? (
            <div className="text-center">
                <h4 className={`text-2xl font-bold ${playerWon ? 'text-green-400' : 'text-red-500'}`}>
                    {playerWon ? 'Victory!' : 'Defeat!'}
                </h4>
                <button
                    onClick={() => dispatch({ type: 'END_COMBAT', payload: { outcome: playerWon ? 'victory' : 'defeat' } })}
                    className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-bold"
                >
                    Continue
                </button>
            </div>
        ) : (
             <div>
                <h4 className="text-lg font-bold mb-2 text-center text-yellow-300">Choose your action</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {player.techniques.map(techId => {
                        const technique = allTechniques[techId];
                        const canUse = player.qi >= technique.qiCost;
                        return (
                            <button
                                key={techId}
                                onClick={() => dispatch({ type: 'COMBAT_ACTION', payload: { techniqueId: techId } })}
                                disabled={!canUse}
                                className="p-3 bg-purple-800 hover:bg-purple-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                            >
                                <p className="font-bold">{technique.name}</p>
                                <p className="text-xs text-purple-300">Cost: {technique.qiCost} Qi</p>
                                <p className="text-xs text-purple-400 mt-1">{technique.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CombatModal;
