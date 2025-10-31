import { Person } from '../types';
import { HARMONY_WEIGHTS } from '../constants';
import { clamp } from '../utils/helpers';

// Maps bloodline grades to a numeric value for compatibility calculation
const BLOODLINE_COMPATIBILITY_MAP: { [key: number]: number } = {
    7: 100, // Mythic
    6: 80, // Immortal
    5: 60, // Saint
    4: 40, // Ancient
    3: 30, // Noble
    2: 20, // Minor Spirit
    1: 10, // Mortal
};

export function calculateCompatibility(personA: Person, personB: Person) {
    // 1. Talent Compatibility (0-100)
    const talentDiff = Math.abs(personA.talent - personB.talent);
    const talentScore = Math.max(0, 100 - talentDiff * 2); // Closer is better

    // 2. Bloodline Compatibility (0-100)
    const bloodlineA = BLOODLINE_COMPATIBILITY_MAP[personA.bloodline.tier] || 0;
    const bloodlineB = BLOODLINE_COMPATIBILITY_MAP[personB.bloodline.tier] || 0;
    const bloodlineDiff = Math.abs(bloodlineA - bloodlineB);
    const bloodlineScore = Math.max(0, 100 - bloodlineDiff);

    // 3. Karma/Personality Compatibility (0-100)
    const karmaDiff = Math.abs(personA.karma - personB.karma);
    const karmaScore = Math.max(0, 100 - karmaDiff * 2); // Similar karma is better

    // 4. Age Compatibility (0-100)
    const ageDiff = Math.abs(personA.age - personB.age);
    const agePenalty = Math.max(0, ageDiff - 10) * 2; // Penalty for age gaps > 10 years
    const ageScore = Math.max(0, 100 - agePenalty);

    const weightedTalent = talentScore * HARMONY_WEIGHTS.TALENT;
    const weightedBloodline = bloodlineScore * HARMONY_WEIGHTS.BLOODLINE;
    const weightedKarma = karmaScore * HARMONY_WEIGHTS.KARMA;
    const weightedAge = ageScore * HARMONY_WEIGHTS.AGE_DIFFERENCE;

    const totalCompatibility = clamp(
        weightedTalent + weightedBloodline + weightedKarma + weightedAge,
        0, 100
    );

    return {
        compatibility: Math.floor(totalCompatibility),
        breakdown: {
            talent: weightedTalent,
            bloodline: weightedBloodline,
            karma: weightedKarma,
            age: weightedAge,
        }
    };
}