export interface BloodlineTier {
    name: string;
    description: string;
    cultivationBonus: number; // as a multiplier, e.g., 1.05 for +5%
    mutationChance: number;
    color: string;
}

export const BLOODLINE_TIERS: Record<number, BloodlineTier> = {
    1: { name: 'Mortal Blood', description: 'No special inheritance.', cultivationBonus: 1.0, mutationChance: 0.005, color: 'text-gray-400' },
    2: { name: 'Minor Spirit Bloodline', description: 'Contains a faint trace of spiritual energy.', cultivationBonus: 1.05, mutationChance: 0.01, color: 'text-blue-400' },
    3: { name: 'Noble Bloodline', description: 'A recognizable lineage with some potential.', cultivationBonus: 1.10, mutationChance: 0.02, color: 'text-cyan-400' },
    4: { name: 'Ancient Bloodline', description: 'Descended from a long line of powerful cultivators.', cultivationBonus: 1.15, mutationChance: 0.04, color: 'text-purple-400' },
    5: { name: 'Saint Bloodline', description: 'Carries the blood of a saintly ancestor.', cultivationBonus: 1.25, mutationChance: 0.08, color: 'text-pink-400' },
    6: { name: 'Immortal Bloodline', description: 'A fragment of divine or celestial essence flows within.', cultivationBonus: 1.40, mutationChance: 0.15, color: 'text-yellow-400' },
    7: { name: 'Mythic Bloodline', description: 'A pre-creation bloodline, transcendent and rare.', cultivationBonus: 1.60, mutationChance: 0.25, color: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500' },
};

export interface BloodlineDefinition {
    id: string;
    name: string;
    tier: number;
    description: string;
}

export const BLOODLINE_LIBRARY: Record<string, BloodlineDefinition> = {
    mortal_blood: { id: 'mortal_blood', name: 'Mortal Blood', tier: 1, description: 'The standard bloodline of ordinary mortals, with no special characteristics.' },
    // Tier 2 (Mortal+)
    iron_bone_blood: { id: 'iron_bone_blood', name: 'Iron Bone Blood', tier: 2, description: 'Simple miner ancestry that strengthens bones and muscles. Core Effects: +10% physical defense; -5% agility.' },
    ember_bat_blood: { id: 'ember_bat_blood', name: 'Ember Bat Blood', tier: 2, description: 'Cave dwellers who learned to store heat in wings. Core Effects: Brief gliding; small fire resistance; Qi drains fast in daylight.' },
    // Tier 3 (Earth/Noble)
    verdant_lotus_blood: { id: 'verdant_lotus_blood', name: 'Verdant Lotus Blood', tier: 3, description: 'Pure regenerative essence that cleanses impurities from Qi channels. Core Effects: +25% recovery speed; immune to basic poisons; attracts spirit beasts.' },
    spirit_tree_bloodline: { id: 'spirit_tree_bloodline', name: 'Spirit Tree Bloodline', tier: 3, description: 'Roots with nature itself; better Qi meditation near forests. Core Effects: +Meditation efficiency; vulnerable to fire.' },
    frozen_fang_line: { id: 'frozen_fang_line', name: 'Frozen Fang Line', tier: 3, description: 'Bred in eternal frost; cold resistance unmatched. Core Effects: +Defense in cold zones; movement penalty in heat.' },
    ash_raven_blood: { id: 'ash_raven_blood', name: 'Ash Raven Blood', tier: 3, description: 'Feeds on death energy; stabilizes soul after near-death. Core Effects: +Revive chance 5%; -Karma over time.' },
    stone_ape_line: { id: 'stone_ape_line', name: 'Stone Ape Line', tier: 3, description: 'Sturdy and loyal ancestry from mountain apes. Core Effects: +HP, +carry weight; -Dexterity.' },
    shadow_crow_ancestry: { id: 'shadow_crow_ancestry', name: 'Shadow Crow Ancestry', tier: 3, description: 'Descendants of night messengers; perfect for infiltration missions. Core Effects: +Stealth in low light; sunlight drains stamina faster.' },
    // Tier 4 (Heaven/Ancient)
    storm_roc_heritage: { id: 'storm_roc_heritage', name: 'Storm Roc Heritage', tier: 4, description: 'Aerial predators that mastered thunder currents. Core Effects: +20% move speed; partial lightning resistance; -10% health in confined spaces.' },
    white_fox_veins: { id: 'white_fox_veins', name: 'White Fox Veins', tier: 4, description: 'Illusion-casting heritage valued by spy sects. Core Effects: +Charm, +mental attack power; high emotion may cause Qi deviation.' },
    thunder_hammer_veins: { id: 'thunder_hammer_veins', name: 'Thunder Hammer Veins', tier: 4, description: 'Born from smith-warriors who forged thunder weapons. Core Effects: +Critical chance; tribulation damage ×1.2.' },
    obsidian_snake_veins: { id: 'obsidian_snake_veins', name: 'Obsidian Snake Veins', tier: 4, description: 'Toxic blood neutralizes most venoms. Core Effects: Immune to poison; periodic venom aura damages nearby enemies; empathy -5%.' },
    mist_panther_lineage: { id: 'mist_panther_lineage', name: 'Mist Panther Lineage', tier: 4, description: 'Masters of ambush; bodies blur in mist. Core Effects: +Evasion in fog; weak in strong wind.' },
    ghost_lantern_lineage: { id: 'ghost_lantern_lineage', name: 'Ghost Lantern Lineage', tier: 4, description: 'Wielders see wandering souls. Core Effects: +Soul perception; +Ghost damage; mental fatigue in sunlight.' },
    // Tier 5 (Saint)
    golden_tiger_fang_lineage: { id: 'golden_tiger_fang_lineage', name: 'Golden Tiger Fang Lineage', tier: 5, description: 'Forges courage and raw strength; users emit an intimidating aura in combat. Core Effects: +15% physical attack; chance to roar-stun enemies; loses subtlety in diplomacy.' },
    jade_tortoise_lineage: { id: 'jade_tortoise_lineage', name: 'Jade Tortoise Lineage', tier: 5, description: 'Symbol of endurance; shells of Qi form when HP is low. Core Effects: +30% defense; -15% speed.' },
    celestial_crane_lineage: { id: 'celestial_crane_lineage', name: 'Celestial Crane Lineage', tier: 5, description: 'Symbol of purity and balance; aids Karma gain. Core Effects: +Charm, +Karma on good deeds; fragile constitution.' },
    sapphire_whale_veins: { id: 'sapphire_whale_veins', name: 'Sapphire Whale Veins', tier: 5, description: 'Projects low-frequency Qi pulses. Core Effects: +Sonar detection; +AoE damage in water.' },
    // Tier 6 (Immortal)
    azure_serpent_lineage: { id: 'azure_serpent_lineage', name: 'Azure Serpent Lineage', tier: 6, description: 'Inherited from river spirits; smooth Qi flow and regenerative power in humid environments. Core Effects: +30% healing in rain; immune to drowning; slower Qi absorption in dry climates.' },
    radiant_lion_blood: { id: 'radiant_lion_blood', name: 'Radiant Lion Blood', tier: 6, description: 'Instills leadership; nearby allies gain morale. Core Effects: +Team buff radius; cannot hide presence.' },
    flame_wyrm_blood: { id: 'flame_wyrm_blood', name: 'Flame Wyrm Blood', tier: 6, description: 'Intense internal flame; boosts attack but shortens lifespan. Core Effects: +25% fire skill damage; lifespan -5%.' },
    // Tier 7 (Divine/Mythic)
    crimson_dragon_veins: { id: 'crimson_dragon_veins', name: 'Crimson Dragon Veins', tier: 7, description: 'Descendants of the ancient flame dragons that ruled the sky. Core Effects: +40% fire cultivation rate; revive once per century; takes extra damage from water attacks.' },
    void_serpent_bloodline: { id: 'void_serpent_bloodline', name: 'Void Serpent Bloodline', tier: 7, description: 'Able to fold small distances by instinct. Core Effects: Short-range teleport; heavy mental strain after repeated use.' },
    abyssal_leviathan_blood: { id: 'abyssal_leviathan_blood', name: 'Abyssal Leviathan Blood', tier: 7, description: 'Sea-born giants whose pulse shakes tides. Core Effects: Breathe underwater; +HP pool; occasional berserk under full moon.' },
    crimson_lotus_core: { id: 'crimson_lotus_core', name: 'Crimson Lotus Core', tier: 7, description: 'Holy fire that burns corruption. Core Effects: +30% healing; ignites corrupted Qi; attracts tribulation bolts.' },
};


// --- New Detailed Physique Library ---

export interface PhysiqueDefinition {
    id: string;
    name: string;
    tier: number; // 1: Normal, 2: Mortal, 3: Earth, 4: Heaven, 5: Saint, 6: Immortal, 7: Divine
    description: string;
}

export const PHYSIQUE_LIBRARY: Record<string, PhysiqueDefinition> = {
    normal_physique: { id: 'normal_physique', name: 'Normal Physique', tier: 1, description: 'A standard body with no special cultivation bonuses.' },
    // Mortal (Tier 2)
    iron_muscle_frame: { id: 'iron_muscle_frame', name: 'Iron Muscle Frame', tier: 2, description: 'Hardened through labor and mortal combat. Perfect for martial cultivators focused on close-range techniques. Core Effects: +15% defense; -5% agility.' },
    // Earth (Tier 3)
    shadow_vein_body: { id: 'shadow_vein_body', name: 'Shadow Vein Body', tier: 3, description: 'Born in shadow sects that specialize in concealment. The user’s Qi signature becomes almost undetectable. Core Effects: +Stealth, -Perception by enemies; takes +20% holy damage.' },
    stoneheart_physique: { id: 'stoneheart_physique', name: 'Stoneheart Physique', tier: 3, description: 'Qi stabilizes around the heart, making it nearly indestructible. Core Effects: +Vitality; immune to instant death; emotions dull slowly.' },
    // Heaven (Tier 4)
    storm_qi_body: { id: 'storm_qi_body', name: 'Storm Qi Body', tier: 4, description: 'Developed in cultivators struck by divine lightning during breakthroughs. Their bodies store residual thunder Qi, enhancing reflexes and speed. Core Effects: +25% movement and attack speed; +Lightning resistance; slightly higher Qi deviation risk under storms.' },
    frost_jade_constitution: { id: 'frost_jade_constitution', name: 'Frost Jade Constitution', tier: 4, description: 'Cold Qi circulates through crystalline veins, preventing decay and aging. Core Effects: +Longevity; +Ice technique power; weak to Fire.' },
    obsidian_bone_frame: { id: 'obsidian_bone_frame', name: 'Obsidian Bone Frame', tier: 4, description: 'Bones forged by ancient blacksmith ancestors; dense but heavy. Core Effects: +Armor ×1.5; -Movement speed -10%.' },
    mistflow_body: { id: 'mistflow_body', name: 'Mistflow Body', tier: 4, description: 'Qi circulates fluidly; difficult to pin down or restrain. Core Effects: +Escape chance; +Qi control; -Defense.' },
    lunar_yin_body: { id: 'lunar_yin_body', name: 'Lunar Yin Body', tier: 4, description: 'Natural collector of moonlight Qi, optimal for Yin arts. Core Effects: +Yin cultivation; health declines under prolonged sunlight.' },
    solar_yang_body: { id: 'solar_yang_body', name: 'Solar Yang Body', tier: 4, description: 'Perfect counterpart to Lunar Yin; ideal for dual cultivation balance. Core Effects: +Yang technique efficiency; vulnerable to dark spells.' },
    windstep_body: { id: 'windstep_body', name: 'Windstep Body', tier: 4, description: 'Bones are light and hollow, optimized for aerial combat. Core Effects: +Jump & dodge distance; -Physical defense.' },
    // Saint (Tier 5)
    pure_spirit_vessel: { id: 'pure_spirit_vessel', name: 'Pure Spirit Vessel', tier: 5, description: 'A flawless Qi conduit formed from perfectly balanced meridians. It allows corruption-free energy flow. Core Effects: +20% cultivation speed; immune to demonic corruption; -10% physical strength.' },
    verdant_root_body: { id: 'verdant_root_body', name: 'Verdant Root Body', tier: 5, description: 'Roots of spiritual plants intertwine with bones, making wounds close instantly. Core Effects: +HP regen ×2; vulnerable to Fire and acid.' },
    mirage_skin_form: { id: 'mirage_skin_form', name: 'Mirage Skin Form', tier: 5, description: 'Light bends subtly around skin, creating afterimages. Core Effects: +Evasion 20%; drains Qi while active.' },
    celestial_pulse_physique: { id: 'celestial_pulse_physique', name: 'Celestial Pulse Physique', tier: 5, description: 'Heartbeat resonates with surrounding spiritual flow, improving meditation. Core Effects: +Cultivation speed; doubles spirit detection range.' },
    spiritforge_body: { id: 'spiritforge_body', name: 'Spiritforge Body', tier: 5, description: 'Each cell refines Qi like a miniature furnace; born artisans. Core Effects: +Artifact crafting success +20%; consumes 10% more Qi while forging.' },
    crystal_vein_frame: { id: 'crystal_vein_frame', name: 'Crystal Vein Frame', tier: 5, description: 'Crystalline blood pathways improve conductivity. Core Effects: +Qi output; vulnerability to sonic damage.' },
    // Immortal (Tier 6)
    solar_heart_physique: { id: 'solar_heart_physique', name: 'Solar Heart Physique', tier: 6, description: 'Heart contains a miniature solar core that radiates constant warmth and Qi. Core Effects: +Energy regen; +Aura range; overheats in deserts.' },
    ethereal_soul_body: { id: 'ethereal_soul_body', name: 'Ethereal Soul Body', tier: 6, description: 'Half-tangible form that partially phases into spirit realm during pain. Core Effects: +Soul defense; -Physical stability (takes knockback easier).' },
    titan_frame: { id: 'titan_frame', name: 'Titan Frame', tier: 6, description: 'Gigantic bone and muscle density grants monstrous might. Core Effects: +Attack 35%; -Dexterity 10%.' },
    oceanic_flow_form: { id: 'oceanic_flow_form', name: 'Oceanic Flow Form', tier: 6, description: 'Fluidic internal Qi network ensures unmatched adaptability. Core Effects: +Reaction speed; +Resistance to flow disruptions; -Defense.' },
    shadowflame_physique: { id: 'shadowflame_physique', name: 'Shadowflame Physique', tier: 6, description: 'Rare fusion of contradictory energies forming unstable equilibrium. Core Effects: +Attack speed; random 2% self-burn chance.' },
    // Divine (Tier 7)
    abyssal_core_physique: { id: 'abyssal_core_physique', name: 'Abyssal Core Physique', tier: 7, description: 'Houses an internal void that absorbs external energy and emotion. Core Effects: +Mana pool; absorbs damage as Qi; emotional suppression lowers morale gain.' },
    phoenix_rebirth_body: { id: 'phoenix_rebirth_body', name: 'Phoenix Rebirth Body', tier: 7, description: 'Body ignites on fatal wounds and reforms after full combustion. Core Effects: One resurrection per decade; -50% HP for 3 days after revival.' },
    demonbane_physique: { id: 'demonbane_physique', name: 'Demonbane Physique', tier: 7, description: 'Body radiates sacred Qi harmful to demonic beings. Core Effects: +Damage vs. Demons +50%; -Stealth impossible.' },
    spirit_harmony_form: { id: 'spirit_harmony_form', name: 'Spirit Harmony Form', tier: 7, description: 'A physique rumored to be perfection itself; maintains constant internal equilibrium. Core Effects: Negates most internal injuries; +Qi stability; -Emotion intensity.' },
};