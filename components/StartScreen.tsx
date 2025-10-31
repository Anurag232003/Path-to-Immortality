import React, { useState, useContext } from 'react';
import { Sparkles, Cog } from 'lucide-react';
import { DIFFICULTY_PRESETS, QUICKSTART_TEMPLATES } from '../constants';
import { Difficulty, QuickstartTemplate, GameAction } from '../types';
import { AccessibilityContext } from '../contexts/AccessibilityContext';

interface StartScreenProps {
  dispatch: React.Dispatch<GameAction>;
}

const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { settings, updateSetting } = useContext(AccessibilityContext);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-slate-800 p-6 rounded-lg border border-purple-500 w-full max-w-sm">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Accessibility Settings</h3>
                <div className="space-y-4">
                    <label className="flex items-center justify-between text-white">
                        <span>Large Text</span>
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600" checked={settings.largeText} onChange={(e) => updateSetting('largeText', e.target.checked)} />
                    </label>
                    <label className="flex items-center justify-between text-white">
                        <span>High Contrast</span>
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600" checked={settings.highContrast} onChange={(e) => updateSetting('highContrast', e.target.checked)} />
                    </label>
                </div>
                <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold">Close</button>
            </div>
        </div>
    );
};


const StartScreen: React.FC<StartScreenProps> = ({ dispatch }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTY_PRESETS[1]);
  const [template, setTemplate] = useState<QuickstartTemplate>(QUICKSTART_TEMPLATES[0]);
  const [startTutorial, setStartTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);


  const handleStart = () => {
    if (name.trim()) {
      const seed = Math.random().toString(36).substring(2);
      dispatch({ 
          type: 'INITIALIZE_GAME', 
          payload: { name: name.trim(), difficulty, template, startTutorial, seed }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4 text-white">
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <div className="max-w-2xl w-full bg-black/40 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-8 text-center relative">
        <button onClick={() => setShowSettings(true)} className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors">
            <Cog size={24} />
        </button>
        <div className="mb-6 relative">
          <Sparkles className="w-20 h-20 mx-auto text-yellow-400 animate-pulse" />
          <div className="absolute inset-0 blur-xl bg-yellow-400/20 rounded-full" />
        </div>
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 mb-4">
          Path to Immortality
        </h1>
        <p className="text-purple-200 mb-8 text-lg">
          Build a cultivation clan. Guide generations. Achieve immortal ascension.
        </p>

        {/* Game Setup */}
        <div className="space-y-6 text-left">
            {/* Patriarch Name */}
            <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Patriarch Name</label>
                <input
                    type="text"
                    placeholder="Enter Patriarch Name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleStart() }}
                    className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/50 rounded text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                />
            </div>

            {/* Difficulty */}
            <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Difficulty</label>
                <div className="flex justify-center space-x-2">
                    {DIFFICULTY_PRESETS.map(d => (
                        <button key={d.name} onClick={() => setDifficulty(d)} className={`w-full py-2 rounded transition-colors ${difficulty.name === d.name ? 'bg-purple-600 font-bold' : 'bg-purple-950/50 hover:bg-purple-800/50'}`}>
                            {d.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quickstart Template */}
            <div>
                 <label className="block text-sm font-bold text-purple-300 mb-2">Founder Archetype</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                     {QUICKSTART_TEMPLATES.map(t => (
                        <button key={t.name} onClick={() => setTemplate(t)} className={`p-3 rounded transition-colors text-center ${template.name === t.name ? 'bg-purple-600 ring-2 ring-yellow-400' : 'bg-purple-950/50 hover:bg-purple-800/50'}`}>
                            <h4 className="font-bold">{t.name}</h4>
                            <p className="text-xs text-purple-300">{t.description}</p>
                        </button>
                    ))}
                </div>
            </div>
             {/* Tutorial Checkbox */}
            <div className="flex items-center justify-center">
                <input type="checkbox" id="tutorial" checked={startTutorial} onChange={e => setStartTutorial(e.target.checked)} className="h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"/>
                <label htmlFor="tutorial" className="ml-2 text-sm text-purple-200">Start with Guided Tutorial</label>
            </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="mt-8 w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Begin Journey
        </button>
      </div>
    </div>
  );
};

export default StartScreen;