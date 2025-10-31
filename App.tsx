import React from 'react';
import { useCultivationGame } from './hooks/useCultivationGame';
import StartScreen from './components/StartScreen';
import GameUI from './components/GameUI';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

const App: React.FC = () => {
  const { state, dispatch, selectors, REALMS } = useCultivationGame();

  if (!state.gameStarted || !selectors.patriarch || !state.clan) {
    return <StartScreen dispatch={dispatch} />;
  }

  return <GameUI state={state} dispatch={dispatch} selectors={selectors} REALMS={REALMS} />;
};

const AppWrapper: React.FC = () => (
  <AccessibilityProvider>
    <App />
  </AccessibilityProvider>
);

export default AppWrapper;