import React from 'react';
import { Branch, Person } from '../types';
import { GitFork, X, User, Users, Heart } from 'lucide-react';

interface InternalAffairsModalProps {
  branches: Record<string, Branch>;
  entities: Record<string, Person>;
  onClose: () => void;
}

const InternalAffairsModal: React.FC<InternalAffairsModalProps> = ({ branches, entities, onClose }) => {
    const branchList = Object.values(branches);

    const getLoyaltyColor = (loyalty: number) => {
        if (loyalty > 70) return 'bg-green-500';
        if (loyalty > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-green-500/50 rounded-lg p-6 max-w-2xl w-full text-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-green-400 flex items-center gap-2"><GitFork /> Internal Affairs</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <p className="text-purple-200 mb-6">Oversee the clan's branch families. Monitor their loyalty and ensure they remain faithful to the main house. Low loyalty may lead to dissent and rebellion.</p>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {branchList.length === 0 ? (
                        <p className="text-purple-400 text-center py-8">The clan remains unified. No branch families have been established yet.</p>
                    ) : (
                        branchList.map(branch => {
                            const leader = entities[branch.leaderId];
                            const aliveMembers = branch.memberIds.filter(id => entities[id]?.alive).length;
                            return (
                                <div key={branch.id} className="p-4 bg-purple-950/50 rounded border border-purple-500/30">
                                    <h4 className="text-xl font-bold text-green-300">{branch.name}</h4>
                                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                        <p className="flex items-center gap-2"><User size={16} className="text-purple-400"/>Leader: <span className="font-semibold">{leader?.name || 'Unknown'}</span></p>
                                        <p className="flex items-center gap-2"><Users size={16} className="text-purple-400"/>Members: <span className="font-semibold">{aliveMembers}</span></p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-purple-300 flex items-center gap-1"><Heart size={14}/> Loyalty</span>
                                            <span className="text-sm font-bold">{branch.loyalty.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                                            <div className={`${getLoyaltyColor(branch.loyalty)} h-2.5 rounded-full`} style={{ width: `${branch.loyalty}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            )
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

export default InternalAffairsModal;