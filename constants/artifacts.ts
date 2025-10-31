import { Artifact, ArtifactEffect } from '../types';

export interface ArtifactTier {
  name: string;
  color: string;
}

export const ARTIFACT_Tiers: Record<number, ArtifactTier> = {
  1: { name: 'Mortal', color: 'text-gray-400' },
  2: { name: 'Spiritual', color: 'text-cyan-400' },
  3: { name: 'Earth', color: 'text-green-400' },
  4: { name: 'Heaven', color: 'text-yellow-400' },
  5: { name: 'Saint', color: 'text-purple-400' },
  6: { name: 'Immortal', color: 'text-amber-400' },
  7: { name: 'Divine', color: 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400' },
};

// A library of all available artifacts in the game.
// The key is a unique ID, and the value is the artifact's base data.
export const ARTIFACT_LIBRARY: Record<string, Omit<Artifact, 'id'>> = {
  // Tier 1: Mortal
  'ironclad_shield': { name: 'Ironclad Shield', description: 'Standard-issue sect defense tool; dependable and easy to repair.', type: 'Armor', tier: 1, basePower: 50, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  // Tier 3: Earth
  'stonewall_armor': { name: 'Stonewall Armor', description: 'Armor crafted from mountain rock, offering immense physical protection.', type: 'Armor', tier: 3, basePower: 150, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'spirit_beacon_pendant': { name: 'Spirit Beacon Pendant', description: 'A pendant that hums with spiritual energy, calming the mind and attracting Qi.', type: 'Accessory', tier: 3, basePower: 120, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'spirit_lantern': { name: 'Spirit Lantern', description: 'A lantern whose light reveals hidden spiritual traces and wards off minor demons.', type: 'Accessory', tier: 3, basePower: 100, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'cloudstep_boots': { name: 'Cloudstep Boots', description: 'Enchanted boots that make the wearer feel as light as a cloud, enhancing their agility.', type: 'Armor', tier: 3, basePower: 130, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'ironblood_pauldrons': { name: 'Ironblood Pauldrons', description: 'Heavy pauldrons tempered with beast blood, granting the wearer formidable resilience.', type: 'Armor', tier: 3, basePower: 160, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'sandveil_bracers': { name: 'Sandveil Bracers', description: 'Bracers woven with enchanted sand, obscuring the wearer\'s movements in a shimmering haze.', type: 'Armor', tier: 3, basePower: 140, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  // Tier 4: Heaven
  'flameheart_saber': { name: 'Flameheart Saber', description: 'Forged within the breath of a Fire Roc, this saber channels the user’s rage into blinding flame arcs.', type: 'Weapon', tier: 4, basePower: 300, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'shadowstep_boots': { name: 'Shadowstep Boots', description: 'These boots muffle sound and allow the wearer to blend into the shadows, perfect for stealth.', type: 'Armor', tier: 4, basePower: 280, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'galeweave_robe': { name: 'Galeweave Robe', description: 'A robe woven from wind spirits, offering protection while being incredibly light.', type: 'Armor', tier: 4, basePower: 270, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'obsidian_edge_katana': { name: 'Obsidian Edge Katana', description: 'A katana forged from volcanic glass, impossibly sharp and imbued with dark energy.', type: 'Weapon', tier: 4, basePower: 320, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'shadowflare_chakram': { name: 'Shadowflare Chakram', description: 'A chakram that pulses with shadow and fire, returning to its wielder after every throw.', type: 'Weapon', tier: 4, basePower: 290, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'sandstorm_greaves': { name: 'Sandstorm Greaves', description: 'Greaves that can summon miniature sandstorms, hindering foes and protecting the wearer.', type: 'Armor', tier: 4, basePower: 260, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'demonfang_gauntlets': { name: 'Demonfang Gauntlets', description: 'Gauntlets crafted from demon fangs, increasing the wearer\'s crushing power.', type: 'Armor', tier: 4, basePower: 310, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'serpents_tongue_dagger': { name: 'Serpent’s Tongue Dagger', description: 'A venomous dagger that strikes with the speed of a serpent.', type: 'Weapon', tier: 4, basePower: 280, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'jade_serpent_belt': { name: 'Jade Serpent Belt', description: 'A belt carved from a single piece of spirit jade, said to contain the soul of a serpent.', type: 'Accessory', tier: 4, basePower: 250, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'soulbinder_chain': { name: 'Soulbinder Chain', description: 'A chain that can lash out and temporarily bind the souls of its targets.', type: 'Weapon', tier: 4, basePower: 290, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'soulflare_ring': { name: 'Soulflare Ring', description: 'A ring that amplifies the wearer\'s spiritual energy into a brilliant, protective flare.', type: 'Accessory', tier: 4, basePower: 270, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'spirit_binding_bell': { name: 'Spirit Binding Bell', description: 'A relic used to pacify and capture restless spirits.', type: 'Relic', tier: 4, basePower: 400, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'spirit_capture', description: '+50% Spirit capture chance.' },
      { type: 'AURA_EFFECT', description: 'Reduces aggression of nearby ghosts.' },
  ]},
  // Tier 5: Saint
  'whisperwind_dagger': { name: 'Whisperwind Dagger', description: 'A dagger that moves as silently as the wind, making it a perfect tool for assassins.', type: 'Weapon', tier: 5, basePower: 600, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'frostbite_blade': { name: 'Frostbite Blade', description: 'A blade that radiates chilling cold, capable of freezing a foe\'s wounds on contact.', type: 'Weapon', tier: 5, basePower: 620, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'verdant_bloom_ring': { name: 'Verdant Bloom Ring', description: 'A ring that pulses with life energy, accelerating natural healing.', type: 'Accessory', tier: 5, basePower: 550, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'mirror_veil': { name: 'Mirror Veil', description: 'A veil that reflects light and gazes, making it difficult to discern the wearer\'s true form.', type: 'Accessory', tier: 5, basePower: 580, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'emberheart_amulet': { name: 'Emberheart Amulet', description: 'An amulet containing a perpetually burning ember, warding off cold and fear.', type: 'Accessory', tier: 5, basePower: 560, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'celestial_compass': { name: 'Celestial Compass', description: 'A compass that points not to the north, but towards sources of great spiritual power.', type: 'Accessory', tier: 5, basePower: 500, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'spiritflow_robes': { name: 'Spiritflow Robes', description: 'Robes that align with the flow of Qi, enhancing the wearer\'s meditative state.', type: 'Armor', tier: 5, basePower: 590, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'thunderlash_whip': { name: 'Thunderlash Whip', description: 'A whip that cracks with the sound of thunder and strikes with the force of lightning.', type: 'Weapon', tier: 5, basePower: 610, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'moonpetal_circlet': { name: 'Moonpetal Circlet', description: 'A circlet adorned with petals that glow under the moonlight, calming the spirit.', type: 'Accessory', tier: 5, basePower: 570, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'mirage_pendant': { name: 'Mirage Pendant', description: 'A pendant that creates illusory duplicates of the wearer when they are in danger.', type: 'Accessory', tier: 5, basePower: 540, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'dreamcatcher_charm': { name: 'Dreamcatcher Charm', description: 'A charm that protects the wearer from mental attacks and nightmares.', type: 'Accessory', tier: 5, basePower: 520, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'frostveil_hood': { name: 'Frostveil Hood', description: 'A hood that shrouds the wearer in a chilling mist, obscuring them from sight.', type: 'Armor', tier: 5, basePower: 590, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'heavenly_gate_key': { name: 'Heavenly Gate Key', description: 'An ancient key rumored to unlock gateways to forgotten realms and celestial planes.', type: 'Relic', tier: 5, basePower: 700, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'UNLOCKS_FEATURE', description: 'Unlocks ancient ruins for exploration.' },
      { type: 'DEBUFF_ON_WIELDER', description: 'Increases tribulation difficulty by 10%.' },
  ]},
  'lunar_tear_crystal': { name: 'Lunar Tear Crystal', description: 'A crystal formed from a tear of the moon goddess, resonating with powerful Yin energy.', type: 'Relic', tier: 5, basePower: 720, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'SKILL_DAMAGE_MODIFIER', skillType: 'yin', value: 0.25, modifierType: 'percent', description: '+25% Yin Qi technique power.' },
      { type: 'CONDITIONAL_MODIFIER', condition: 'under_sunlight', description: 'Weakens under sunlight.' },
  ]},
  'spirit_nexus_stone': { name: 'Spirit Nexus Stone', description: 'A stone that acts as a focal point for spiritual energy, benefiting all allies nearby.', type: 'Relic', tier: 5, basePower: 650, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CLAN_WIDE_MODIFIER', clanModifier: 'qi_recovery', value: 0.1, description: '+10% Qi recovery for the entire sect.' },
  ]},
  'soul_requiem_flute': { name: 'Soul Requiem Flute', description: 'A flute whose melody can soothe tormented souls and command the spirits of the dead.', type: 'Relic', tier: 5, basePower: 680, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'charisma', value: 20, modifierType: 'flat', description: '+20 Charisma.' },
  ]},
  'spiritbound_lantern': { name: 'Spiritbound Lantern', description: 'A lantern that contains a willing spirit, providing light and guidance in the darkest of places.', type: 'Relic', tier: 5, basePower: 660, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'AURA_EFFECT', description: 'Grants immunity to fear-based effects.' },
  ]},
  'celestial_weighing_scales': { name: 'Celestial Weighing Scales', description: 'A relic that reveals the karmic balance of any soul, exposing good and evil.', type: 'Relic', tier: 5, basePower: 690, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'UNLOCKS_FEATURE', description: 'Reveals the Karma value of other cultivators.' },
  ]},
  'mirror_of_reflections': { name: 'Mirror of Reflections', description: 'A mirror that does not show one\'s appearance, but their potential and deepest thoughts.', type: 'Relic', tier: 5, basePower: 710, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CULTIVATION_SPEED_MODIFIER', value: 0.1, description: '+10% Wisdom XP gain.' },
  ]},
  'spirit_grove_seed': { name: 'Spirit Grove Seed', description: 'A seed that, when planted, can grow into a small spirit grove, a haven for cultivation.', type: 'Relic', tier: 5, basePower: 730, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CLAN_WIDE_MODIFIER', clanModifier: 'meditation_speed', value: 0.05, description: '+5% Meditation efficiency for all clan members.' },
  ]},
  'wind_song_harp': { name: 'Wind Song Harp', description: 'A harp whose music can manipulate the winds and charm even the fiercest of beasts.', type: 'Relic', tier: 5, basePower: 750, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'charisma', value: 15, modifierType: 'flat', description: '+15 Charisma.' },
  ]},
  'blood_orchid_bloom': { name: 'Blood Orchid Bloom', description: 'A beautiful but dangerous flower that thrives on life essence, granting power at a cost.', type: 'Relic', tier: 5, basePower: 780, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'strength', value: 20, modifierType: 'flat', description: '+20% HP steal.' },
  ]},
  // Tier 6: Immortal
  'thunderseal_gauntlets': { name: 'Thunderseal Gauntlets', description: 'Gauntlets that can catch and redirect lightning, turning a tribulation into an opportunity.', type: 'Armor', tier: 6, basePower: 1250, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'ashen_phoenix_robe': { name: 'Ashen Phoenix Robe', description: 'A robe woven from the ashes of a reborn phoenix, offering incredible protection against fire.', type: 'Armor', tier: 6, basePower: 1200, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'leviathan_scale_armor': { name: 'Leviathan Scale Armor', description: 'Armor crafted from the scales of a mighty sea beast, nearly impenetrable.', type: 'Armor', tier: 6, basePower: 1300, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'bloodwoven_cloak': { name: 'Bloodwoven Cloak', description: 'A cloak woven with enchanted blood threads, which can mend itself when damaged.', type: 'Armor', tier: 6, basePower: 1220, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'skyfrost_halberd': { name: 'Skyfrost Halberd', description: 'A halberd with a blade of permanent ice, capable of freezing the very air around it.', type: 'Weapon', tier: 6, basePower: 1280, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'obsidian_core_ring': { name: 'Obsidian Core Ring', description: 'A ring with a heart of pure obsidian, grounding the wearer and protecting against mental intrusion.', type: 'Accessory', tier: 6, basePower: 1100, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'emberveil_cloak': { name: 'Emberveil Cloak', description: 'A cloak that smolders with harmless embers, creating a veil of heat that distorts the wearer\'s form.', type: 'Armor', tier: 6, basePower: 1230, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'spiritforged_hammer': { name: 'Spiritforged Hammer', description: 'A hammer used by ancient smiths to forge legendary weapons, it can shape both metal and spirit.', type: 'Weapon', tier: 6, basePower: 1150, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'dragonhide_armor': { name: 'Dragonhide Armor', description: 'Armor made from the nigh-invulnerable hide of a dragon, a treasure of immense value.', type: 'Armor', tier: 6, basePower: 1350, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'emberlight_ring': { name: 'Emberlight Ring', description: 'A ring that emits a warm, comforting light, bolstering courage and dispelling illusions.', type: 'Accessory', tier: 6, basePower: 1180, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'soulforge_anvil': { name: 'Soulforge Anvil', description: 'An anvil used in the forging of soul-bound artifacts, essential for any master smith.', type: 'Relic', tier: 6, basePower: 1500, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CRAFTING_SUCCESS_MODIFIER', craftingType: 'forging', value: 1, description: '+100% Artifact crafting success.' },
  ]},
  'mirror_of_true_souls': { name: 'Mirror of True Souls', description: 'A mirror that reveals the true nature of a person\'s soul, bypassing all disguises.', type: 'Relic', tier: 6, basePower: 1400, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'soul_defense', value: 50, modifierType: 'percent', description: '+50% Soul Defense.' },
  ]},
  'heart_of_the_mountain': { name: 'Heart of the Mountain', description: 'A stone that contains the very essence of a mountain, granting immense resilience.', type: 'Relic', tier: 6, basePower: 1600, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'defense', value: 80, modifierType: 'percent', description: '+80% Defense.' },
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'agility', value: -50, modifierType: 'percent', description: '-50% Agility.' },
  ]},
  'eye_of_the_abyss': { name: 'Eye of the Abyss', description: 'A terrifying relic that offers glimpses into the void, granting power at the cost of sanity.', type: 'Relic', tier: 6, basePower: 1450, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'DEBUFF_ON_WIELDER', description: 'Causes constant sanity erosion.' },
  ]},
  'dream_lotus_petal': { name: 'Dream Lotus Petal', description: 'A petal from a celestial lotus that enhances meditation and allows for lucid dreaming.', type: 'Relic', tier: 6, basePower: 1350, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CULTIVATION_SPEED_MODIFIER', value: 0.15, description: '+15% Meditation XP gain.' },
  ]},
  'chrono_core_orb': { name: 'Chrono Core Orb', description: 'An orb that manipulates the flow of time in a small area, accelerating the user\'s actions.', type: 'Relic', tier: 6, basePower: 1550, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'cooldown_reduction', description: 'Reduces skill cooldowns by 30%.' },
  ]},
  'blackstar_core': { name: 'Blackstar Core', description: 'The collapsed core of a dead star, radiating immense gravitational and dark energy.', type: 'Relic', tier: 6, basePower: 1650, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'SKILL_DAMAGE_MODIFIER', skillType: 'dark', value: 0.5, modifierType: 'percent', description: '+50% Dark damage.' },
  ]},
  'flame_serpent_idol': { name: 'Flame Serpent Idol', description: 'An idol that can summon the spirit of a flame serpent to fight alongside its master.', type: 'Relic', tier: 6, basePower: 1700, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'summon_fire_serpent', description: 'Summons a fire serpent spirit to aid in combat.' },
  ]},
  'frostlight_scepter': { name: 'Frostlight Scepter', description: 'A scepter that commands the power of glacial ice and winter storms.', type: 'Relic', tier: 6, basePower: 1750, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'SKILL_DAMAGE_MODIFIER', skillType: 'ice', value: 0.3, modifierType: 'percent', description: '+30% Ice skill power.' },
  ]},
  'astral_echo_stone': { name: 'Astral Echo Stone', description: 'A stone that resonates with the cosmos, allowing the user to unleash bursts of astral energy.', type: 'Relic', tier: 6, basePower: 1800, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'astral_burst', description: 'Unlocks the "Astral Burst" ability.' },
  ]},
  'tear_of_the_demon_king': { name: 'Tear of the Demon King', description: 'A crystallized tear shed by a demon king, containing immense destructive power.', type: 'Relic', tier: 6, basePower: 1850, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'strength', value: 40, modifierType: 'percent', description: '+40% Attack.' },
  ]},
  'soul_compass': { name: 'Soul Compass', description: 'A compass that points towards concentrations of soul energy, useful for finding spirits or powerful individuals.', type: 'Relic', tier: 6, basePower: 1900, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'UNLOCKS_FEATURE', description: 'Detects soul-bound items and spirit fragments.' },
  ]},
  'spiritforge_core': { name: 'Spiritforge Core', description: 'The heart of a spirit forge, used to fuse artifacts and enhance their spiritual power.', type: 'Relic', tier: 6, basePower: 1950, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CRAFTING_SUCCESS_MODIFIER', craftingType: 'forging', value: 0.4, description: '+40% Artifact fusion success rate.' },
  ]},
  // Tier 7: Divine
  'celestial_halo_circlet': { name: 'Celestial Halo Circlet', description: 'A circlet that shines with holy light, protecting the wearer from demonic corruption.', type: 'Accessory', tier: 7, basePower: 2500, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'crimson_moon_blade': { name: 'Crimson Moon Blade', description: 'A blade that thirsts for blood, growing stronger with every life it takes under the crimson moon.', type: 'Weapon', tier: 7, basePower: 2600, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'starforge_blade': { name: 'Starforge Blade', description: 'A sword forged from a fallen star, burning with celestial fire.', type: 'Weapon', tier: 7, basePower: 2800, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'skybreaker_spear': { name: 'Skybreaker Spear', description: 'A spear said to be sharp enough to pierce the heavens themselves.', type: 'Weapon', tier: 7, basePower: 2700, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'voidcaller_blade': { name: 'Voidcaller Blade', description: 'A blade that whispers with voices from the void, capable of cutting through space itself.', type: 'Weapon', tier: 7, basePower: 2750, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'lotus_mirror_shield': { name: 'Lotus Mirror Shield', description: 'A shield that can reflect not only physical attacks but also malevolent spiritual energy.', type: 'Armor', tier: 7, basePower: 2550, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'spectral_edge_blade': { name: 'Spectral Edge Blade', description: 'A blade that is partially ethereal, allowing it to bypass physical armor and strike the soul directly.', type: 'Weapon', tier: 7, basePower: 2900, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'warbreaker_axe': { name: 'Warbreaker Axe', description: 'A colossal axe that can shatter formations and break the morale of an entire army with a single swing.', type: 'Weapon', tier: 7, basePower: 3000, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'celestial_echo_blade': { name: 'Celestial Echo Blade', description: 'A sword that rings with a celestial chorus, its song strengthening allies and weakening foes.', type: 'Weapon', tier: 7, basePower: 2650, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'voidcore_gauntlets': { name: 'Voidcore Gauntlets', description: 'Gauntlets that seem to contain a miniature void, capable of absorbing and redirecting energy.', type: 'Armor', tier: 7, basePower: 2850, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null },
  'heavenly_dao_compass': { name: 'Heavenly Dao Compass', description: 'A divine instrument that helps its user comprehend the mysteries of the Dao and predict fate.', type: 'Relic', tier: 7, basePower: 3000, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'luck', value: 10, modifierType: 'flat', description: '+10 Luck.' },
      { type: 'UNLOCKS_FEATURE', description: 'Reveals future realm events 1 cycle ahead.' },
  ]},
  'eternal_flame_core': { name: 'Eternal Flame Core', description: 'The heart of an undying celestial flame, granting absolute mastery over the fire element.', type: 'Relic', tier: 7, basePower: 3200, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'SKILL_DAMAGE_MODIFIER', skillType: 'fire', value: 1, modifierType: 'percent', description: '+100% Fire skill power.' },
  ]},
  'river_of_time_vial': { name: 'River of Time Vial', description: 'A vial containing water from the River of Time, allowing for brief manipulation of time.', type: 'Relic', tier: 7, basePower: 3100, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'freeze_time', cooldown: 100, description: 'Freezes time for 3 seconds (cooldown: 1 century).' },
  ]},
  'blood_of_primordial_beast': { name: 'Blood of the Primordial Beast', description: 'A one-time use consumable that can trigger a massive evolution in a cultivator\'s body and spirit.', type: 'Relic', tier: 7, basePower: 5000, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ONE_TIME_USE', description: 'Instantly boosts cultivation to the next tier (50% mutation risk).' },
  ]},
  'scroll_of_infinite_paths': { name: 'Scroll of Infinite Paths', description: 'A scroll containing endless combat techniques and cultivation methods, revealing a new one each time it is read.', type: 'Relic', tier: 7, basePower: 3300, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'learn_random_skill', description: 'Grants a random powerful skill on each reading.' },
  ]},
  'celestial_music_bell': { name: 'Celestial Music Bell', description: 'A bell whose chimes can purify vast areas of corruption and heal spiritual wounds.', type: 'Relic', tier: 7, basePower: 3400, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'AURA_EFFECT', description: 'Removes corruption from all allies in a wide area.' },
  ]},
  'sea_emperors_trident': { name: 'Sea Emperor’s Trident', description: 'The legendary trident of the sea emperor, granting absolute command over the oceans and their creatures.', type: 'Relic', tier: 7, basePower: 3500, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'SKILL_DAMAGE_MODIFIER', skillType: 'water', value: 1, modifierType: 'percent', description: '+100% Water attack power.' },
  ]},
  'phoenix_heart_furnace': { name: 'Phoenix Heart Furnace', description: 'A divine furnace for alchemy, said to contain the regenerative heart of a phoenix.', type: 'Relic', tier: 7, basePower: 3600, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CRAFTING_SUCCESS_MODIFIER', craftingType: 'alchemy', value: 2, description: '+200% Alchemy success.' },
  ]},
  'dragon_emperors_crown': { name: 'Dragon Emperor’s Crown', description: 'A crown that bestows upon its wearer the authority and might of the ancient dragon emperors.', type: 'Relic', tier: 7, basePower: 3700, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'leadership', value: 100, modifierType: 'flat', description: '+100 Leadership.' },
  ]},
  'heavenpiercer_spear': { name: 'Heavenpiercer Spear', description: 'A spear of divine origin, said to be capable of shattering the barriers between realms.', type: 'Relic', tier: 7, basePower: 3800, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'all_damage', value: 1.5, modifierType: 'percent', description: '+150% to all damage.' },
  ]},
  'voidwalker_mantle': { name: 'Voidwalker Mantle', description: 'A mantle woven from shadows and void energy, allowing the wearer to step through dimensions.', type: 'Relic', tier: 7, basePower: 3900, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'short_teleport', description: 'Grants a short-range teleport ability.' },
  ]},
  'eternal_bloom_lily': { name: 'Eternal Bloom Lily', description: 'A divine lily that never wilts, its consumption grants a massive boost to one\'s lifespan and vitality.', type: 'Relic', tier: 7, basePower: 4000, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ONE_TIME_USE', description: 'Consume to gain 1000 years of lifespan and restore vitality.' },
  ]},
  'tome_of_forgotten_names': { name: 'Tome of Forgotten Names', description: 'A tome containing the true names of ancient entities, knowledge that is both powerful and dangerous.', type: 'Relic', tier: 7, basePower: 4100, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CULTIVATION_SPEED_MODIFIER', value: 0.2, description: '+20% Knowledge XP gain.' },
  ]},
  'heavens_tear_crystal': { name: 'Heaven’s Tear Crystal', description: 'A crystal formed from the tears of the heavens, a potent catalyst for healing and purification.', type: 'Relic', tier: 7, basePower: 4200, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ONE_TIME_USE', description: 'Consume to double healing effectiveness and cleanse all debuffs.' },
  ]},
  'sunfire_aegis': { name: 'Sunfire Aegis', description: 'A shield that radiates with the power of the sun, providing ultimate protection against darkness and holy attacks.', type: 'Relic', tier: 7, basePower: 4300, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'SKILL_DAMAGE_MODIFIER', skillType: 'holy', value: 1, modifierType: 'percent', description: '+100% Light resistance.' },
  ]},
  'ocean_heart_pearl': { name: 'Ocean Heart Pearl', description: 'A pearl containing the essence of the ocean, granting mastery over water and calming turbulent emotions.', type: 'Relic', tier: 7, basePower: 4400, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'SKILL_DAMAGE_MODIFIER', skillType: 'water', value: 0.7, modifierType: 'percent', description: '+70% Water mastery.' },
  ]},
  'divine_feather_of_the_roc': { name: 'Divine Feather of the Roc', description: 'A feather from a divine Roc, granting its holder incredible speed and the ability to ride the winds.', type: 'Relic', tier: 7, basePower: 4500, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'agility', value: 200, modifierType: 'percent', description: '+200% Flight speed.' },
  ]},
  'book_of_ascending_realms': { name: 'Book of Ascending Realms', description: 'A cultivation manual that details the paths to ascension, greatly accelerating progress for those who can comprehend it.', type: 'Relic', tier: 7, basePower: 4600, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CULTIVATION_SPEED_MODIFIER', value: 0.25, description: '+25% Cultivation XP gain.' },
  ]},
  'crystal_heart_of_eternity': { name: 'Crystal Heart of Eternity', description: 'A dangerous relic that grants immortality at a terrible price: to unequip it means instant death.', type: 'Relic', tier: 7, basePower: 4700, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'DEBUFF_ON_WIELDER', description: 'Grants infinite lifespan while equipped; causes instant death if unequipped.' },
  ]},
  'void_prism': { name: 'Void Prism', description: 'A prism that refracts reality, bending attacks and providing a formidable defense.', type: 'Relic', tier: 7, basePower: 4800, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'defense', value: 60, modifierType: 'percent', description: '+60% Defense.' },
  ]},
  'golden_lotus_lamp': { name: 'Golden Lotus Lamp', description: 'A lamp that houses a sacred golden lotus flame, a bane to all evil and darkness.', type: 'Relic', tier: 7, basePower: 4900, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'AURA_EFFECT', description: 'Creates a 100m holy aura that purges darkness entities.' },
  ]},
  'crown_of_the_void_emperor': { name: 'Crown of the Void Emperor', description: 'The crown of an ancient emperor who ruled the void, granting immense authority and power.', type: 'Relic', tier: 7, basePower: 5000, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', stat: 'leadership', value: 100, modifierType: 'flat', description: '+100 Command.' },
  ]},
  'heavenly_clockwork_sphere': { name: 'Heavenly Clockwork Sphere', description: 'A complex celestial device that can predict the movements of stars and the coming of heavenly tribulations.', type: 'Relic', tier: 7, basePower: 5100, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'UNLOCKS_FEATURE', description: 'Increases predictability of heavenly tribulations.' },
  ]},
  'orb_of_thousand_truths': { name: 'Orb of the Thousand Truths', description: 'An orb that allows its user to see through all illusions and perceive the true nature of reality.', type: 'Relic', tier: 7, basePower: 5200, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'ACTIVE_ABILITY', abilityId: 'reveal_truths', description: 'Reveals all hidden Karma, motives, and illusions.' },
  ]},
  'blade_of_seasons': { name: 'Blade of Seasons', description: 'A blade whose elemental properties change with the passing of the seasons, making it incredibly versatile.', type: 'Relic', tier: 7, basePower: 5300, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'CONDITIONAL_MODIFIER', condition: 'season', description: 'Shifts element and damage type with each season.' },
  ]},
  'mantle_of_infinite_shadows': { name: 'Mantle of Infinite Shadows', description: 'A mantle that grants the wearer ultimate stealth, making them undetectable even to gods.', type: 'Relic', tier: 7, basePower: 5400, temperLevel: 0, soulLink: 0, durability: 100, maxDurability: 100, boundTo: null, effects: [
      { type: 'PASSIVE_STAT_MODIFIER', description: '+100% Stealth, rendering user invisible to gods.' },
  ]},
};