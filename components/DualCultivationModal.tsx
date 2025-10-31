import React, { useMemo } from 'react';
import { Person, GameAction } from '../types';
import { Heart } from 'lucide-react';

interface DualCultivationModalProps {
  entities: Record<string, Person>;
  onClose: () => void;
  dispatch: React.Dispatch<GameAction>;
}

const DualCultivationModal: React.FC<DualCultivationModalProps> = ({ entities, onClose, dispatch }) => {

  const marriedCouples = useMemo(() => {
    const couples: { p1: Person; p2: Person }[] = [];
    const processed = new Set<string>();
    for (const person of Object.values(entities)) {
      if (person.alive && person.spouseIds.length > 0) {
        const spouse = entities[person.spouseIds[0]];
        if (spouse && spouse.alive) {
          const coupleKey = [person.id, spouse.id].sort().join('-');
          if (!processed.has(coupleKey)) {
            couples.push({ p1: person, p2: spouse });
            processed.add(coupleKey);
          }
        }
      }
    }
    return couples;
  }, [entities]);

  const handleToggle = (p1Id: string, p2Id: string) => {
    dispatch({ type: 'TOGGLE_DUAL_CULTIVATION', payload: { person1Id: p1Id, person2Id: p2Id } });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-red-500/50 rounded-lg p-6 max-w-lg w-full text-white">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-red-400 flex items-center gap-2"><Heart /> Dual Cultivation</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <p className="text-purple-200 mb-6">Instruct married couples to enter seclusion for dual cultivation. This will boost their cultivation speed and affection, and greatly increase the chance of producing heirs. Starting costs 100 Spirit Stones.</p>
        
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {marriedCouples.length === 0 ? (
                <p className="text-purple-400 text-center py-4">No married couples in the clan.</p>
            ) : (
                marriedCouples.map(({ p1, p2 }) => {
                    const isCultivating = p1.isDualCultivatingWith === p2.id;
                    return (
                        <div key={p1.id + p2.id} className="flex items-center justify-between p-3 bg-purple-950/50 rounded">
                            <div>
                                <p className="font-semibold">{p1.name} & {p2.name}</p>
                                <p className={`text-sm ${isCultivating ? 'text-green-400' : 'text-purple-400'}`}>
                                    Status: {isCultivating ? 'In Seclusion' : 'Normal'}
                                </p>
                            </div>
                            <button
                                onClick={() => handleToggle(p1.id, p2.id)}
                                className={`px-4 py-2 rounded font-bold text-sm ${
                                    isCultivating
                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {isCultivating ? 'Stop' : 'Start'}
                            </button>
                        </div>
                    );
                })
            )}
        </div>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded font-bold">Close</button>
        </div>
      </div>
    </div>
  );
};

export default DualCultivationModal;