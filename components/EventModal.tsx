
import React from 'react';
import { RandomEvent, RandomEventChoice } from '../types';

interface EventModalProps {
  event: RandomEvent;
  onChoice: (choice: RandomEventChoice) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onChoice }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-yellow-500/50 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">{event.title}</h3>
        <p className="text-purple-200 mb-6 text-white">{event.text}</p>
        <div className="space-y-2">
          {event.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoice(choice)}
              className="w-full px-4 py-3 bg-purple-700 hover:bg-purple-600 rounded transition-colors text-left text-white"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventModal;