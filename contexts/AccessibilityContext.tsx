import React, { createContext, useState, useMemo, useEffect } from 'react';
import { AccessibilitySettings } from '../types';

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType>({
    settings: {
        largeText: false,
        highContrast: false,
        motionReduction: false,
    },
    updateSetting: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AccessibilitySettings>({
        largeText: false,
        highContrast: false,
        motionReduction: false,
    });

    useEffect(() => {
        document.body.classList.toggle('large-text', settings.largeText);
        document.body.classList.toggle('high-contrast', settings.highContrast);
    }, [settings]);

    const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const value = useMemo(() => ({ settings, updateSetting }), [settings]);

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};