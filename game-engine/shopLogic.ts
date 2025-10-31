import { SeededRNG } from '../utils/rng';
import { ShopState, ShopItem, Pill, Artifact } from '../types';
import { PILL_LIBRARY } from '../constants/pills';
import { ARTIFACT_LIBRARY } from '../constants/artifacts';

// Tier-based pricing. Key is the tier string/number.
const PILL_TIER_PRICES: Record<string, number> = {
    'Mortal': 150, 'Earth': 400, 'Heaven': 900, 'Saint': 2500, 'Immortal': 6000, 'Divine': 15000,
};
const ARTIFACT_TIER_PRICES: Record<number, number> = {
    1: 200, 2: 500, 3: 1000, 4: 2000, 5: 4500, 6: 10000, 7: 25000,
};

export function calculateItemPrice(item: Omit<Pill, 'id'> | Omit<Artifact, 'id'>, type: 'pill' | 'artifact', rng: SeededRNG): number {
    let basePrice = 0;
    if (type === 'pill') {
        basePrice = PILL_TIER_PRICES[(item as Omit<Pill, 'id'>).tier] || 100;
        // Add complexity pricing based on effects later if needed
    } else {
        const artifact = item as Omit<Artifact, 'id'>;
        basePrice = ARTIFACT_TIER_PRICES[artifact.tier] || 200;
        basePrice += artifact.basePower * 0.5; // Add value for raw power
    }
    const randomFactor = 0.8 + rng.next() * 0.4; // +/- 20% variance
    return Math.floor(basePrice * randomFactor);
}

export function generateShopInventory(rng: SeededRNG): ShopState {
    const inventory: ShopState = { pills: [], artifacts: [] };
    const numItems = rng.nextInt(4, 9); // 4 to 8 items total

    const allPills = Object.entries(PILL_LIBRARY);
    const allArtifacts = Object.entries(ARTIFACT_LIBRARY);

    for (let i = 0; i < numItems; i++) {
        const itemTypeRoll = rng.next();
        if (itemTypeRoll < 0.5 && inventory.pills.length < 5) { // Add a pill
            const tierRoll = rng.next();
            let targetTier: Pill['tier'];
            if (tierRoll < 0.5) targetTier = 'Mortal';      // 50%
            else if (tierRoll < 0.8) targetTier = 'Earth'; // 30%
            else if (tierRoll < 0.95) targetTier = 'Heaven';// 15%
            else targetTier = 'Saint';                      // 5%

            const candidatePills = allPills.filter(([, p]) => p.tier === targetTier);
            if (candidatePills.length > 0) {
                const [itemId, itemData] = rng.choice(candidatePills);
                const shopItem: ShopItem = {
                    type: 'pill',
                    itemId,
                    item: itemData,
                    price: calculateItemPrice(itemData, 'pill', rng)
                };
                inventory.pills.push(shopItem);
            }
        } else if (inventory.artifacts.length < 5) { // Add an artifact
            const tierRoll = rng.next();
            let targetTier: number;
            if (tierRoll < 0.5) targetTier = 1;     // 50%
            else if (tierRoll < 0.75) targetTier = 3; // 25% (skip tier 2 for more distinct items)
            else if (tierRoll < 0.9) targetTier = 4; // 15%
            else if (tierRoll < 0.98) targetTier = 5; // 8%
            else targetTier = 6;                     // 2%

            const candidateArtifacts = allArtifacts.filter(([, a]) => a.tier === targetTier);
            if (candidateArtifacts.length > 0) {
                const [itemId, itemData] = rng.choice(candidateArtifacts);
                const shopItem: ShopItem = {
                    type: 'artifact',
                    itemId,
                    item: itemData,
                    price: calculateItemPrice(itemData, 'artifact', rng)
                };
                inventory.artifacts.push(shopItem);
            }
        }
    }
    return inventory;
}