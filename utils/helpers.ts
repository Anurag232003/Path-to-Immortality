import { TalentGrade, Person, GameState, GameEvent } from "../types";

export const getTalentGrade = (talent: number): TalentGrade => {
    if (talent >= 100) return { name: 'Divine Bloodline', speed: 6, maxRealm: 19, color: 'rainbow', tribulationDeath: 1 };
    if (talent >= 91) return { name: 'Peerless', speed: 4, maxRealm: 14, color: 'gold', tribulationDeath: 5 };
    if (talent >= 81) return { name: "Heaven's Chosen", speed: 2.5, maxRealm: 10, color: 'yellow', tribulationDeath: 10 };
    if (talent >= 61) return { name: 'Genius', speed: 1.5, maxRealm: 7, color: 'purple', tribulationDeath: 25 };
    if (talent >= 41) return { name: 'Gifted', speed: 1, maxRealm: 4, color: 'cyan', tribulationDeath: 40 };
    if (talent >= 21) return { name: 'Common', speed: 0.6, maxRealm: 3, color: 'blue', tribulationDeath: 60 };
    return { name: 'Poor', speed: 0.3, maxRealm: 2, color: 'gray', tribulationDeath: 80 };
};

export const getBloodlineGradeColorClass = (bloodlineTier: number): string => {
    const colorMap: { [key: number]: string } = {
        7: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500', // Mythic
        6: 'text-yellow-400', // Immortal
        5: 'text-pink-400', // Saint
        4: 'text-purple-400', // Ancient
        3: 'text-cyan-400', // Noble
        2: 'text-blue-400', // Minor Spirit
        1: 'text-gray-400', // Mortal
    };
    return colorMap[bloodlineTier] || 'text-gray-400';
};

export const getPhysiqueTierColorClass = (tier: number): string => {
    const colorMap: { [key: number]: string } = {
        7: 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400', // Divine
        6: 'text-amber-400', // Immortal
        5: 'text-purple-400', // Saint
        4: 'text-yellow-400', // Heaven
        3: 'text-green-400', // Earth
        2: 'text-gray-400', // Mortal
        1: 'text-gray-400', // Normal
    };
    return colorMap[tier] || 'text-gray-400';
};


export const getGradeColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
        rainbow: 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400',
        gold: 'text-yellow-300',
        yellow: 'text-yellow-400',
        purple: 'text-purple-400',
        cyan: 'text-cyan-400',
        blue: 'text-blue-400',
        gray: 'text-gray-400'
    };
    return colorMap[color] || 'text-gray-400';
}

export const formatPower = (power: number): string => {
    if (power >= 1000000000000) return `${(power / 1000000000000).toFixed(1)}T`;
    if (power >= 1000000000) return `${(power / 1000000000).toFixed(1)}B`;
    if (power >= 1000000) return `${(power / 1000000).toFixed(1)}M`;
    if (power >= 1000) return `${(power / 1000).toFixed(1)}K`;
    return Math.floor(power).toString();
};

export const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

export const addLog = (state: GameState, text: string, type: GameEvent['type'] = 'normal'): GameEvent[] => {
    const newLog: GameEvent = {
        text,
        type,
        time: `Year ${state.time.year}, ${state.time.season}`,
        id: state.rng.nextInt(100000, 999999)
    };
    return [newLog, ...state.log.slice(0, 49)];
};