import { Pill } from '../types';

export const PILL_LIBRARY: Record<string, Omit<Pill, 'id'>> = {
  // Mortal
  'qi_condensation_pellet': {
    name: 'Qi Condensation Pellet',
    tier: 'Mortal',
    description: 'Basic pill used by beginner cultivators to stabilize their dantian. Affordable and safe.',
    effects: [{ type: 'CULTIVATION_PROGRESS_BOOST', value: 5 }],
  },
  'meridian_cleansing_pill': {
    name: 'Meridian Cleansing Pill',
    tier: 'Mortal',
    description: 'Flushes out impurities clogging Qi pathways.',
    effects: [{ type: 'CULTIVATION_SPEED_MODIFIER', value: 0.1, duration: 1 }],
  },
  'golden_breath_pellet': {
    name: 'Golden Breath Pellet',
    tier: 'Mortal',
    description: 'Standard training supplement that extends meditation sessions.',
    effects: [{ type: 'CULTIVATION_SPEED_MODIFIER', value: 0.05, duration: 1 }],
  },
  // Earth
  'spirit_renewal_elixir': {
    name: 'Spirit Renewal Elixir',
    tier: 'Earth',
    description: 'Concentrated essence distilled from spirit dew and lotus petals.',
    effects: [{ type: 'INSTANT_QI_RECOVERY_PERCENT', value: 0.4 }],
  },
  'bone_tempering_draught': {
    name: 'Bone Tempering Draught',
    tier: 'Earth',
    description: 'Strengthens skeletal structure using metal essence.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'defense', value: 0.1, duration: 5 }],
  },
  'spirit_focus_pill': {
    name: 'Spirit Focus Pill',
    tier: 'Earth',
    description: 'Commonly used by alchemists to prevent distraction.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'focus', value: 0.3, duration: 1 }],
  },
  'ironblood_pill': {
    name: 'Ironblood Pill',
    tier: 'Earth',
    description: 'Infuses metallic Qi into bloodstream.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'strength', value: 0.15, duration: 1 }],
  },
  'beast_tamer_pellet': {
    name: 'Beast Tamer Pellet',
    tier: 'Earth',
    description: 'Infused with beast essence, improving empathy with spirit beasts.',
    effects: [{ type: 'BEAST_AFFINITY', value: 0.5, duration: 1 }],
  },
  'bone_restoration_pill': {
    name: 'Bone Restoration Pill',
    tier: 'Earth',
    description: 'Heals fractures instantly and strengthens regenerated bone.',
    effects: [{ type: 'INSTANT_HEALTH_RECOVERY_PERCENT', value: 0.25 }, { type: 'STAT_MODIFIER', stat: 'defense', value: 0.1, duration: 1 }],
  },
  'iron_qi_pill': {
    name: 'Iron Qi Pill',
    tier: 'Earth',
    description: 'Infused with metallic essence mined from Qi ore veins.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'endurance', value: 0.25, duration: 3 }],
  },
  // Heaven
  'flameheart_pill': {
    name: 'Flameheart Pill',
    tier: 'Heaven',
    description: 'Forged using phoenix ash; bolsters fire techniques.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'fire', value: 0.25, duration: 1 }],
  },
  'thunderstrike_essence': {
    name: 'Thunderstrike Essence',
    tier: 'Heaven',
    description: 'Pill contains refined lightning Qi from storm tribulations.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'lightning', value: 0.5, duration: 1 }],
  },
  'demonic_purge_pill': {
    name: 'Demonic Purge Pill',
    tier: 'Heaven',
    description: 'Counteracts demonic Qi invasions and curses.',
    effects: [{ type: 'REMOVE_DEBUFF', debuffType: 'corruption', value: 1 }],
  },
  'essence_amplifier_pill': {
    name: 'Essence Amplifier Pill',
    tier: 'Heaven',
    description: 'Compresses raw Qi into explosive form.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'all', value: 0.25, duration: 1 }],
  },
  'windstep_essence': {
    name: 'Windstep Essence',
    tier: 'Heaven',
    description: 'Made from condensed sky lotus pollen; boosts lightness skill.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'agility', value: 0.25, duration: 1 }],
  },
   'starfire_essence_pill': {
    name: 'Starfire Essence Pill',
    tier: 'Heaven',
    description: 'Condensed from fallen meteor fragments. Users radiate cosmic heat temporarily.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'fire', value: 0.3, duration: 1 }],
  },
  'shadowmind_capsule': {
    name: 'Shadowmind Capsule',
    tier: 'Heaven',
    description: 'Developed by assassins to conceal killing intent.',
    effects: [{ type: 'STEALTH_MODIFIER', value: 0.5, duration: 1 }],
  },
   'soul_expansion_pill': {
    name: 'Soul Expansion Pill',
    tier: 'Heaven',
    description: 'Increases soul vessel size to hold more Qi.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'willpower', value: 0.25, duration: 10 }],
  },
   'frostbite_pearl': {
    name: 'Frostbite Pearl',
    tier: 'Heaven',
    description: 'Condensed cold Qi crystallized from glacial beasts.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'ice', value: 0.2, duration: 1 }],
  },
  'astral_vision_pill': {
    name: 'Astral Vision Pill',
    tier: 'Heaven',
    description: 'Infuses eyes with star essence, improving spirit detection.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'focus', value: 1, duration: 1 }],
  },
  'mirage_bloom_pill': {
    name: 'Mirage Bloom Pill',
    tier: 'Heaven',
    description: 'Creates faint afterimages around user.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'agility', value: 0.15, duration: 1 }],
  },
  // Saint
  'heavenly_fertility_pill': {
    name: 'Heavenly Fertility Pill',
    tier: 'Saint',
    description: 'A rare elixir said to harmonize Yin-Yang within partners, ensuring strong heirs.',
    effects: [{ type: 'FERTILITY_CHANCE_MODIFIER', value: 0.5, duration: 1 }],
  },
  'moonlight_serenity_pill': {
    name: 'Moonlight Serenity Pill',
    tier: 'Saint',
    description: 'Used by spiritual sects to calm restless souls.',
    effects: [{ type: 'REMOVE_DEBUFF', debuffType: 'mental', value: 1 }],
  },
  'golden_core_stabilizer': {
    name: 'Golden Core Stabilizer',
    tier: 'Saint',
    description: 'Balances Qi during breakthrough to next realm.',
    effects: [{ type: 'BREAKTHROUGH_CHANCE_MODIFIER', value: 10, duration: 0 }],
  },
  'shadow_veil_extract': {
    name: 'Shadow Veil Extract',
    tier: 'Saint',
    description: 'Liquefied from ghost mist; conceals user’s Qi signature.',
    effects: [{ type: 'STEALTH_MODIFIER', value: 2, duration: 1 }],
  },
  'spirit_nourishing_pill': {
    name: 'Spirit Nourishing Pill',
    tier: 'Saint',
    description: 'Nurtures soul energy over long sessions.',
    effects: [{ type: 'CULTIVATION_SPEED_MODIFIER', value: 0.15, duration: 5 }],
  },
  'mistveil_draught': {
    name: 'Mistveil Draught',
    tier: 'Saint',
    description: 'Vaporizes within the user’s body, turning them semi-transparent.',
    effects: [{ type: 'STEALTH_MODIFIER', value: 1, duration: 1 }],
  },
  'spirit_mirror_pill': {
    name: 'Spirit Mirror Pill',
    tier: 'Saint',
    description: 'Forms a Qi mirror that reflects minor spiritual attacks.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'defense', value: 0.2, duration: 1 }],
  },
  'mystic_fog_elixir': {
    name: 'Mystic Fog Elixir',
    tier: 'Saint',
    description: 'Used by illusionists to cover escape or hide bases.',
    effects: [], // This is a world effect, not a personal buff
  },
   'blood_flame_essence': {
    name: 'Blood Flame Essence',
    tier: 'Saint',
    description: 'Dangerous fusion of blood and flame essence.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'fire', value: 0.2, duration: 1 }, { type: 'HP_DRAIN', value: 0.05, duration: 1 }],
  },
  'soul_binding_pill': {
    name: 'Soul Binding Pill',
    tier: 'Saint',
    description: 'Binds two entities’ life essence temporarily.',
    effects: [], // This is a social/world effect
  },
  'black_serpent_venom_pill': {
    name: 'Black Serpent Venom Pill',
    tier: 'Saint',
    description: 'Used by assassins from the Shadow Marsh Sect.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'poison', value: 0.3, duration: 1 }],
  },
  // Immortal
  'ocean_soul_bead': {
    name: 'Ocean Soul Bead',
    tier: 'Immortal',
    description: 'Condensed from deep-sea cores; strengthens fluid Qi.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'defense', value: 0.2, duration: 5 }],
  },
  'blood_rebirth_pellet': {
    name: 'Blood Rebirth Pellet',
    tier: 'Immortal',
    description: 'Synthesized from blood of high-tier beasts; regenerates lost vitality.',
    effects: [{ type: 'INSTANT_HEALTH_RECOVERY_PERCENT', value: 1 }],
  },
  'phoenix_flame_pellet': {
    name: 'Phoenix Flame Pellet',
    tier: 'Immortal',
    description: 'Pill infused with the ash of immortal phoenix feathers.',
    effects: [{ type: 'REVIVE', value: 0.01, duration: 0 }],
  },
  'dragon_bone_pill': {
    name: 'Dragon Bone Pill',
    tier: 'Immortal',
    description: 'Ground dragon marrow grants unyielding resilience.',
    effects: [{ type: 'STAT_MODIFIER', stat: 'strength', value: 0.2, duration: 5 }, { type: 'STAT_MODIFIER', stat: 'defense', value: 0.2, duration: 5 }],
  },
  'soul_rebirth_pellet': {
    name: 'Soul Rebirth Pellet',
    tier: 'Immortal',
    description: 'Restores fragmented souls.',
    effects: [{ type: 'REVIVE', value: 0.5, duration: 0 }],
  },
  'heavenly_tribulation_shield_pill': {
    name: 'Heavenly Tribulation Shield Pill',
    tier: 'Immortal',
    description: 'Created from sky metal dust and divine lotus oil. Used during tribulations.',
    effects: [{ type: 'TRIBULATION_SHIELD', value: 0.4, duration: 0 }, { type: 'BREAKTHROUGH_CHANCE_MODIFIER', value: 10, duration: 0 }],
  },
  'flame_lotus_extract': {
    name: 'Flame Lotus Extract',
    tier: 'Immortal',
    description: 'Fusion of opposing principles—flame and restoration.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'fire', value: 0.1, duration: 10 }, { type: 'INSTANT_HEALTH_RECOVERY_PERCENT', value: 0.3 }],
  },
  'soul_resonance_pill': {
    name: 'Soul Resonance Pill',
    tier: 'Immortal',
    description: 'Allows multiple cultivators to synchronize Qi flow for joint cultivation.',
    effects: [{ type: 'TEAM_SYNERGY_MODIFIER', value: 0.25, duration: 1 }],
  },
  'temporal_flux_pill': {
    name: 'Temporal Flux Pill',
    tier: 'Immortal',
    description: 'Bends temporal flow inside user’s meridians.',
    effects: [{ type: 'TIME_PERCEPTION', value: 0.3, duration: 1 }],
  },
  'spirit_weaver_elixir': {
    name: 'Spirit Weaver Elixir',
    tier: 'Immortal',
    description: 'Stabilizes Qi threads for advanced artifact weaving.',
    effects: [], // This would affect crafting success, not a personal buff
  },
  // Divine
  'voidstep_elixir': {
    name: 'Voidstep Elixir',
    tier: 'Divine',
    description: 'Highly volatile pill enabling short-term spatial distortion.',
    effects: [{ type: 'TELEPORT', value: 1, duration: 1 }],
  },
  'celestial_harmony_elixir': {
    name: 'Celestial Harmony Elixir',
    tier: 'Divine',
    description: 'Used by saint-level couples to merge Yin and Yang Qi flawlessly.',
    effects: [], // Affects dual cultivation, social
  },
  'crimson_lotus_pill': {
    name: 'Crimson Lotus Pill',
    tier: 'Divine',
    description: 'Used by saint healers to purge corruption completely.',
    effects: [{ type: 'INSTANT_HEALTH_RECOVERY_PERCENT', value: 0.5 }, { type: 'REMOVE_DEBUFF', debuffType: 'corruption', value: 1 }],
  },
  'eternal_serenity_elixir': {
    name: 'Eternal Serenity Elixir',
    tier: 'Divine',
    description: 'Drunk only by immortal sages; halts aging for centuries.',
    effects: [{ type: 'LIFESPAN_MODIFIER', value: 500 }],
  },
  'crimson_thunder_pill': {
    name: 'Crimson Thunder Pill',
    tier: 'Divine',
    description: 'A pill that channels divine storms within the body.',
    effects: [{ type: 'SKILL_DAMAGE_MODIFIER', skillType: 'lightning', value: 0.5, duration: 1 }, { type: 'HP_DRAIN', value: 0.1, duration: 1 }],
  },
  'bloodline_awakening_pill': {
    name: 'Bloodline Awakening Pill',
    tier: 'Divine',
    description: 'Catalyst that awakens dormant ancestral blood.',
    effects: [{ type: 'UNLOCK_BLOODLINE_ABILITIES', value: 1, duration: 0 }, { type: 'BLOODLINE_AWAKENING_CHANCE', value: 20, duration: 0 }],
  },
  'nine_petal_spirit_pill': {
    name: 'Nine Petal Spirit Pill',
    tier: 'Divine',
    description: 'Nine-lotus pill grown from divine garden; rare beyond measure.',
    effects: [{ type: 'BREAKTHROUGH_CHANCE_MODIFIER', value: 20, duration: 0 }, { type: 'LIFESPAN_MODIFIER', value: 100 }],
  },
  'radiant_lotus_elixir': {
    name: 'Radiant Lotus Elixir',
    tier: 'Divine',
    description: 'Synthesized from pure holy Qi collected from heavenly realms.',
    effects: [{ type: 'INSTANT_HEALTH_RECOVERY_PERCENT', value: 0.5 }, { type: 'REMOVE_DEBUFF', debuffType: 'corruption', value: 1 }],
  },
};
