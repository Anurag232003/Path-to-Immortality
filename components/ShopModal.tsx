import React, { useState } from 'react';
import { Clan, GameAction, ShopState, ShopItem, Pill, Artifact } from '../types';
import { ShoppingCart, X, FlaskConical, Swords, Sparkles } from 'lucide-react';
import { ARTIFACT_Tiers } from '../constants/artifacts';

interface ShopModalProps {
  shopState: ShopState;
  clan: Clan;
  dispatch: React.Dispatch<GameAction>;
}

type Tab = 'pills' | 'artifacts';

const ShopModal: React.FC<ShopModalProps> = ({ shopState, clan, dispatch }) => {
  const [activeTab, setActiveTab] = useState<Tab>('pills');

  const handlePurchase = (item: ShopItem) => {
    dispatch({ type: 'PURCHASE_ITEM', payload: { item } });
  };
  
  const onClose = () => {
    dispatch({ type: 'CLOSE_SHOP' });
  };
  
  const pillTierColor: Record<string, string> = {
    'Mortal': 'text-gray-400',
    'Earth': 'text-green-400',
    'Heaven': 'text-yellow-400',
    'Saint': 'text-purple-400',
    'Immortal': 'text-amber-400',
    'Divine': 'text-red-400'
  };

  const renderItem = (item: ShopItem) => {
    const canAfford = clan.spiritStones >= item.price;
    const isPill = item.type === 'pill';
    const itemData = item.item as (Omit<Pill, 'id'> | Omit<Artifact, 'id'>);
    const tierColor = isPill ? pillTierColor[(itemData as Pill).tier] : ARTIFACT_Tiers[(itemData as Artifact).tier]?.color || 'text-gray-400';
    const tierName = isPill ? (itemData as Pill).tier : ARTIFACT_Tiers[(itemData as Artifact).tier]?.name;
    const description = isPill ? (itemData as Omit<Pill, 'id'>).description : (itemData as Omit<Artifact, 'id'>).description;

    return (
        <div key={item.itemId} className="p-4 bg-purple-950/50 rounded border border-purple-500/30 flex justify-between items-start">
            <div>
                <h5 className={`font-bold text-lg ${tierColor}`}>{itemData.name} <span className="text-xs text-purple-300">[{tierName}]</span></h5>
                <p className="text-xs text-purple-300 mt-1">{description}</p>
                 <p className="text-sm font-semibold text-yellow-400 mt-2 flex items-center gap-1">
                    <Sparkles size={14} /> {item.price}
                </p>
            </div>
            <button 
                onClick={() => handlePurchase(item)}
                disabled={!canAfford}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold text-sm ml-4 flex-shrink-0"
            >
                Buy
            </button>
        </div>
    );
  }

  const renderPills = () => (
    <div className="space-y-3">
        {shopState.pills.length > 0 ? shopState.pills.map(renderItem) : <p className="text-purple-400 text-center py-4">The merchant has no pills to offer today.</p>}
    </div>
  );

  const renderArtifacts = () => (
    <div className="space-y-3">
        {shopState.artifacts.length > 0 ? shopState.artifacts.map(renderItem) : <p className="text-purple-400 text-center py-4">The merchant has no artifacts to offer today.</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-yellow-500/50 rounded-lg p-6 max-w-4xl w-full text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><ShoppingCart /> Celestial Bazaar</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>
        
        <div className="p-3 bg-purple-950/50 rounded-lg mb-4 flex justify-between items-center">
            <p className="text-purple-200">The merchant eyes your coin pouch.</p>
            <p className="font-bold text-lg text-yellow-300 flex items-center gap-1"><Sparkles size={16} /> {Math.floor(clan.spiritStones)} Spirit Stones</p>
        </div>
        
        <div className="flex border-b border-purple-800 mb-4">
          <button onClick={() => setActiveTab('pills')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'pills' ? 'border-b-2 border-yellow-400 text-yellow-300' : 'text-purple-300'}`}><FlaskConical size={16}/> Pills ({shopState.pills.length})</button>
          <button onClick={() => setActiveTab('artifacts')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'artifacts' ? 'border-b-2 border-yellow-400 text-yellow-300' : 'text-purple-300'}`}><Swords size={16}/> Artifacts ({shopState.artifacts.length})</button>
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto pr-2">
            {activeTab === 'pills' && renderPills()}
            {activeTab === 'artifacts' && renderArtifacts()}
        </div>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded font-bold">Leave</button>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;