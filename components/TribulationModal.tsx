import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameAction, TribulationState } from '../types';
import { Zap } from 'lucide-react';

interface TribulationModalProps {
  tribulationState: TribulationState;
  dispatch: React.Dispatch<GameAction>;
}

const TribulationModal: React.FC<TribulationModalProps> = ({ tribulationState, dispatch }) => {
  const { waves } = tribulationState;
  const [currentWave, setCurrentWave] = useState(tribulationState.currentWave);
  const [indicatorPos, setIndicatorPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const [successCount, setSuccessCount] = useState(0);
  const [feedback, setFeedback] = useState<'hit' | 'miss' | null>(null);
  const [isWaveActive, setIsWaveActive] = useState(true);

  const requestRef = useRef<number | null>(null);
  const speed = 2 + (currentWave * 0.5); // Speed increases with each wave

  const targetZone = { start: 45, end: 55 };

  const animate = useCallback(() => {
    setIndicatorPos(prevPos => {
      let newPos = prevPos + direction * speed;
      if (newPos >= 100 || newPos <= 0) {
        setDirection(d => -d);
        newPos = Math.max(0, Math.min(100, newPos));
      }
      return newPos;
    });
    requestRef.current = requestAnimationFrame(animate);
  }, [direction, speed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
    };
  }, [animate]);
  
  const handleStrike = useCallback(() => {
    if (!isWaveActive) return;

    setIsWaveActive(false);
    const isSuccess = indicatorPos >= targetZone.start && indicatorPos <= targetZone.end;
    
    if (isSuccess) {
      setSuccessCount(s => s + 1);
      setFeedback('hit');
    } else {
      setFeedback('miss');
    }
    
    setTimeout(() => {
        setFeedback(null);
        if (currentWave >= waves) {
            // End of tribulation
            dispatch({ type: 'RESOLVE_TRIBULATION', payload: { successRate: (successCount + (isSuccess ? 1 : 0)) / waves } });
        } else {
            // Advance to the next wave
            setCurrentWave(w => w + 1);
            setIsWaveActive(true);
            setIndicatorPos(0);
            setDirection(1);
        }
    }, 800);

  }, [isWaveActive, indicatorPos, targetZone, currentWave, waves, successCount, dispatch]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleStrike();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStrike]);
  
  const getFeedbackClass = () => {
      if (feedback === 'hit') return 'border-green-400 shadow-green-400/50';
      if (feedback === 'miss') return 'border-red-500 shadow-red-500/50';
      return 'border-yellow-500/50';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={handleStrike}>
      <div className={`bg-gradient-to-br from-slate-900 to-indigo-950 border-2 rounded-lg p-8 max-w-2xl w-full text-white shadow-2xl transition-all duration-300 ${getFeedbackClass()}`}>
        <h3 className="text-4xl font-bold text-yellow-400 mb-4 text-center flex items-center justify-center gap-3 animate-pulse">
            <Zap size={36}/> Heavenly Tribulation <Zap size={36}/>
        </h3>
        <p className="text-purple-300 text-center mb-8">The heavens test your worth! Strike when the lightning essence is concentrated!</p>
        
        <p className="text-center text-lg font-bold mb-4">Wave {currentWave} of {waves}</p>
        
        <div className="w-full bg-slate-800 rounded-full h-8 border-2 border-purple-700 relative overflow-hidden">
            {/* Target Zone */}
            <div className="absolute top-0 h-full bg-green-500/30" style={{ left: `${targetZone.start}%`, width: `${targetZone.end - targetZone.start}%` }}></div>
            
            {/* Indicator */}
            <div className="absolute top-0 h-full bg-cyan-400 w-2 rounded-full shadow-lg shadow-cyan-400/50" style={{ left: `${indicatorPos}%` }}></div>
        </div>

        <p className="text-center text-purple-200 mt-6 animate-ping">Press [SPACE] or Click to Strike!</p>
        
        <div className="mt-8 text-center">
            <p className="text-xl font-semibold">Successes: <span className="text-green-400">{successCount} / {waves}</span></p>
        </div>
      </div>
    </div>
  );
};

export default TribulationModal;