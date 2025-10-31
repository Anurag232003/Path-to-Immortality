import React, { useEffect, useState, useLayoutEffect } from 'react';
import { TutorialStep } from '../types';

interface TutorialOverlayProps {
    step: TutorialStep;
    onNext: () => void;
    onSkip: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onNext, onSkip }) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useLayoutEffect(() => {
        const targetElement = document.querySelector(`[data-tutorial-id='${step.targetId}']`);
        if (targetElement) {
            setTargetRect(targetElement.getBoundingClientRect());
        }
    }, [step.targetId]);
    
    if (!targetRect) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" style={{
                clipPath: `path('${`
                    M-1,-1 V${window.innerHeight + 1} H${window.innerWidth + 1} V-1 Z
                    M${targetRect.x},${targetRect.y} H${targetRect.x + targetRect.width} V${targetRect.y + targetRect.height} H${targetRect.x} Z
                `}')`
            }}></div>
            
            {/* Highlight Box */}
            <div
                className="fixed border-2 border-yellow-400 rounded-lg shadow-lg pointer-events-none"
                style={{
                    left: targetRect.left,
                    top: targetRect.top,
                    width: targetRect.width,
                    height: targetRect.height,
                    transition: 'all 0.3s ease-in-out',
                }}
            />

            {/* Tooltip */}
            <div
                className={`fixed p-4 bg-slate-800 rounded-lg border border-yellow-500 max-w-sm text-white shadow-2xl transition-all duration-300`}
                style={{
                    top: step.position === 'top' ? targetRect.top - 10 : targetRect.bottom + 10,
                    left: targetRect.left + targetRect.width / 2,
                    transform: `translateX(-50%) ${step.position === 'top' ? 'translateY(-100%)' : ''}`,
                }}
            >
                <p className="mb-4">{step.text}</p>
                <div className="flex justify-between items-center">
                    <button onClick={onSkip} className="text-xs text-purple-300 hover:text-white">Skip Tutorial</button>
                    {step.actionTrigger === 'none' && (
                        <button onClick={onNext} className="px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded font-bold">
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;