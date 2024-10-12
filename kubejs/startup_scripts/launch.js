// priority: 0

// Mod shortcuts
let MOD = (domain, id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let CR = (id, x) => MOD("create", id, x)
let MC = (id, x) => MOD("minecraft", id, x)
let KJ = (id, x) => MOD("kubejs", id, x)
let FD = (id, x) => MOD("farmersdelight", id, x)
let SE = (id, x) => MOD("seasonsextras", id, x)

StartupEvents.registry('item', event => {
	let mechanism = (name, rarity) => {
		let id = name.toLowerCase()
		event.create(id + '_mechanism').texture("kubejs:item/" + id + "_mechanism").displayName(name + ' Mechanism').rarity(rarity ? rarity : 'common')
		event.create('incomplete_' + id + '_mechanism', 'create:sequenced_assembly').texture("kubejs:item/incomplete_" + id + "_mechanism").displayName('Incomplete ' + name + ' Mechanism')
	}

	mechanism('Kinetic')
	mechanism('Calculation', 'uncommon')

	event.create('iron_dust').texture("kubejs:item/iron_dust").displayName('Iron Dust')
	event.create('coal_dust').texture("kubejs:item/coal_dust").displayName('Coal Dust')
	event.create('gold_dust').texture("kubejs:item/gold_dust").displayName('Gold Dust')
	event.create('copper_dust').texture("kubejs:item/copper_dust").displayName('Copper Dust')
	event.create('steel_dust').texture("kubejs:item/steel_blend").displayName('Iron-Carbon Blend').tooltip('§fA blended mix of coal and iron.').tooltip('§7Part of steel production.')
	event.create('steel_compound').texture("kubejs:item/steel_compound").displayName('Iron-Carbon Compound').tooltip('§7Mixed coal and iron, but not mixed enough to be steel.').tooltip('§7Part of steel production.')
	event.create('heated_steel_compound').texture("kubejs:item/heated_steel_compound").displayName('Heated Steel Compound').tooltip('§c§oHot to the touch!').tooltip('§7Part of steel production.')
	event.create('incomplete_steel_ingot', 'create:sequenced_assembly').texture("kubejs:item/heated_steel_compound").displayName('Incomplete Steel Ingot').tooltip('§fKeep Hammering!').tooltip('§7Part of steel production.')
	event.create('steel_ingot').texture("kubejs:item/steel_ingot").displayName('Steel Ingot').rarity('uncommon')
	event.create('steel_nugget').texture("kubejs:item/steel_nugget").displayName('Steel Nugget')
	event.create('heated_steel_ingot').texture("kubejs:item/heated_steel_ingot").displayName('Heated Steel Ingot').tooltip('§c§oHot to the touch!').tooltip('§7Part of steel production.')
	event.create('incomplete_steel_sheet', 'create:sequenced_assembly').texture("kubejs:item/heated_steel_ingot").displayName('Incomplete Steel Sheet').tooltip('§fKeep Hammering!').tooltip('§7Part of steel production.')
	event.create('steel_sheet').texture("kubejs:item/steel_sheet").displayName('Steel Sheet')
	event.create('spool_silk').texture("kubejs:item/spool_string").displayName('Spool of Silk')
	event.create('woven_silk').texture("kubejs:item/woven_silk").displayName('Woven Silk')
	event.create('silk_cloth').texture("kubejs:item/woven_silk").displayName('Silk Cloth').maxDamage(512)
	event.create('unwoven_silk').texture("kubejs:item/unwoven_silk").displayName('Unwoven Silk')
	event.create('incomplete_woven_silk', 'create:sequenced_assembly').texture("kubejs:item/unwoven_silk").displayName('Partially Woven Silk')
	event.create('zinc_sheet').texture("kubejs:item/zinc_sheet").displayName('Zinc Sheet')
	event.create('electron_tube_casing').texture("kubejs:item/incomplete_electron_tube").displayName('Electron Tube Casing')
	event.create('incomplete_electron_tube', 'create:sequenced_assembly').texture("kubejs:item/incomplete_electron_tube").displayName('Incomplete Electron Tube')
	event.create('heated_copper_ingot').texture("kubejs:item/heated_copper_ingot").displayName('Heated Copper Ingot')
	event.create('incomplete_copper_sheet', 'create:sequenced_assembly').texture("kubejs:item/heated_copper_ingot").displayName('Incomplete Copper Sheet')
	event.create('partially_crushed_diamond', 'create:sequenced_assembly').texture("kubejs:item/crushed_diamond").displayName('Partially Crushed Diamond').tooltip('§7Keep crushing..')
	event.create('crushed_diamond').texture("kubejs:item/crushed_diamond").displayName('Crushed Diamond').tooltip('§7Sift through it. You might get something good.')
	event.create('washed_diamond').texture("kubejs:item/washed_diamond_pile").displayName('Washed Diamond Pile').tooltip('§7Wash away the dust...')
	event.create('diamond_pile').texture("kubejs:item/crushed_diamond_pile").displayName('Crushed Diamond Pile').tooltip('§7...and check for shinies!')
	event.create('diamond_shard').texture("kubejs:item/diamond_shard").displayName('Photovoltaic Crystal').tooltip('§fA diamond crystal perfect for refracting light.').rarity('uncommon')
	event.create('steel_rod').texture("kubejs:item/tool_part/steel_rod").displayName('Steel Tool Rod')
	event.create('steel_loop').texture("kubejs:item/tool_part/steel_loop").displayName('Steel Loop')
	event.create('mythril_loop').texture("kubejs:item/tool_part/mythril_loop").displayName('Mythril Loop')
	event.create('mythril_chain').texture("kubejs:item/mythril_chain").displayName('Mythril Chain')
	event.create('mythril_sheet').texture("kubejs:item/mythril_sheet").displayName('Mythril Sheet')
	event.create('mythril_ingot').texture("kubejs:item/mythril_ingot").displayName('Mythril Ingot').rarity('rare')
	event.create('ancient_flux').texture("kubejs:item/ancient_flux").displayName('Ancient Flux Blend').tooltip('§7Used for forging very hard metals')
	event.create('lime_dust').texture("kubejs:item/lime_dust").displayName('Lime Dust')
	event.create('starlight_dust').texture("kubejs:item/starlight_dust").displayName('Starlight Dust')
	event.create('debris_pile').texture("kubejs:item/debris_pile").displayName('Ancient Debris Pile')
	event.create('partially_sifted_debris').texture("minecraft:item/netherite_scrap").displayName('Partially Sifted Debris')
	event.create('debris_scrap').texture("kubejs:item/debris_scrap").displayName('Ancient Scrap')
	event.create('netherite_chunk').texture("kubejs:item/netherite_chunk").displayName('Netherite Chunk')
	event.create('netherite_dust').texture("kubejs:item/netherite_dust").displayName('Netherite Dust')
	event.create('terra_ingot').texture("kubejs:item/terra_ingot").displayName('Terrasteel Ingot').tooltip("§7Once cast, it melds and re-shapes to hold it's form.").tooltip("§7It's durability is unmatched.").rarity('epic')
	event.create('terra_sheet').texture("kubejs:item/terra_sheet").displayName('Terrasteel Sheet')
	event.create('terra_smithing_template').texture("kubejs:item/terra_upgrade_smithing_template").displayName('Terrasteel Forging Template')

	// Tools
	let steel_tool_list = ['Steel_Helmet', 'Steel_Chestplate', 'Steel_Leggings', 'Steel_Boots', 'Steel_Sword', 'Steel_Pickaxe', 'Steel_Axe', 'Steel_Shovel', 'Steel_Hoe']
	let mythril_tool_list = ['Mythril_Helmet', 'Mythril_Chestplate', 'Mythril_Leggings', 'Mythril_Boots', 'Mythril_Sword', 'Mythril_Pickaxe', 'Mythril_Axe', 'Mythril_Shovel', 'Mythril_Hoe']
	let terra_tool_list = ['Terra_Helmet', 'Terra_Chestplate', 'Terra_Leggings', 'Terra_Boots', 'Terra_Sword', 'Terra_Pickaxe', 'Terra_Axe', 'Terra_Shovel', 'Terra_Hoe']
	steel_tool_list.forEach(tool => {
		let tool_lowercase = tool.toLowerCase()
		let tool_type = tool_lowercase.split('_')[1]
		let steel_tool = tool_lowercase.replace('steel', 'iron')
		event.create(tool_lowercase, tool_type)
			.texture("minecraft:item/" + steel_tool)
			.displayName(tool.replace('_', ' '))
			.rarity('uncommon')
			.tier('steel')
	})
	mythril_tool_list.forEach(tool => {
		let tool_lowercase = tool.toLowerCase()
		let tool_type = tool_lowercase.split('_')[1]
		event.create(tool_lowercase, tool_type)
			.texture("kubejs:item/tool_part/" + tool_lowercase)
			.displayName(tool.replace('_', ' '))
			.rarity('rare')
			.tier('mythril')
	})
	terra_tool_list.forEach(tool => {
		let tool_lowercase = tool.toLowerCase()
		let tool_type = tool_lowercase.split('_')[1]
		event.create('partially_forged_' + tool_lowercase, 'create:sequenced_assembly').texture('kubejs:item/tool_part/' + tool_lowercase)
		event.create(tool_lowercase, tool_type)
			.texture('kubejs:item/tool_part/' + tool_lowercase)
			.displayName(tool.replace('_', 'steel '))
			.rarity('epic')
			.tier('terra')
			.tooltip("§8It feels as though it has a mind of it's own.")
			.tooltip("§8It's magical.")
			.tooltip("§8")
	})

	// Casts
	let cast_list = ['Helmet', 'Chestplate', 'Leggings', 'Boots', 'Sword', 'Pickaxe', 'Axe', 'Shovel', 'Ingot', 'Tool_Rod', 'Loop', 'Hoe', 'Sheet']
	cast_list.forEach(cast => {
		let cast_lowercase = cast.toLowerCase()
		event.create(cast_lowercase + '_cast').texture("kubejs:item/cast/" + cast_lowercase).displayName('Stone ' + cast.replace('_', ' ') + ' ' + 'Cast')
	})

	// Armour Progress MUST STAY IN THIS ORDER for partial textures to grab the previous stage texture.
	  // or remake this logic and add a nested list for partial recipes to also hold their texture
	let armour_progress = ['Cast', 'Partially_Forged', 'Forged', 'Partially_Smoothed', 'Smoothed', 'Partially_Polished']
	armour_progress.forEach(progress => {
		var p_lower = progress.toLowerCase()
		var is_partial = p_lower.toString().includes('partial')
		if (is_partial) {
			let previous_progress = armour_progress.indexOf(progress) - 1
			let partial_texture = armour_progress[previous_progress].toLowerCase()
			event.create(p_lower + '_mythril_head_plate', 'create:sequenced_assembly').texture("kubejs:item/tool_part/" + partial_texture + '_mythril_head_plate').displayName(progress + ' ' + 'Mythril Head Plate')
			event.create(p_lower + '_mythril_chest_plate', 'create:sequenced_assembly').texture("kubejs:item/tool_part/" + partial_texture + '_mythril_chest_plate').displayName(progress + ' ' + 'Mythril Chest Plate')
			event.create(p_lower + '_mythril_leg_plate', 'create:sequenced_assembly').texture("kubejs:item/tool_part/" + partial_texture + '_mythril_leg_plate').displayName(progress + ' ' + 'Mythril Leg Plate')
			event.create(p_lower + '_mythril_boot_plate', 'create:sequenced_assembly').texture("kubejs:item/tool_part/" + partial_texture + '_mythril_boot_plate').displayName(progress + ' ' + 'Mythril Boot Plate')	
		} else {
			event.create(p_lower + '_mythril_head_plate').texture("kubejs:item/tool_part/" + p_lower + '_mythril_head_plate').displayName(progress + ' ' + 'Mythril Head Plate')
			event.create(p_lower + '_mythril_chest_plate').texture("kubejs:item/tool_part/" + p_lower + '_mythril_chest_plate').displayName(progress + ' ' + 'Mythril Chest Plate')
			event.create(p_lower + '_mythril_leg_plate').texture("kubejs:item/tool_part/" + p_lower + '_mythril_leg_plate').displayName(progress + ' ' + 'Mythril Leg Plate')
			event.create(p_lower + '_mythril_boot_plate').texture("kubejs:item/tool_part/" + p_lower + '_mythril_boot_plate').displayName(progress + ' ' + 'Mythril Boot Plate')
		}
	})

	event.create('polished_mythril_head_plate').texture("kubejs:item/tool_part/mythril_helmet").displayName('Polished Mythril Head Plate')
	event.create('polished_mythril_chest_plate').texture("kubejs:item/tool_part/mythril_chestplate").displayName('Polished Mythril Chest Plate')
	event.create('polished_mythril_leg_plate').texture("kubejs:item/tool_part/mythril_leggings").displayName('Polished Mythril Leg Plate')
	event.create('polished_mythril_boot_plate').texture("kubejs:item/tool_part/mythril_boots").displayName('Polished Mythril Boot Plate')
	event.create('mythril_sword_head').texture("kubejs:item/tool_part/mythril_sword_blade").displayName('Mythril Sword Blade')
	event.create('mythril_pickaxe_head').texture("kubejs:item/tool_part/mythril_pickaxe_head").displayName('Mythril Pickaxe Head')
	event.create('mythril_axe_head').texture("kubejs:item/tool_part/mythril_axe_head").displayName('Mythril Axe Head')
	event.create('mythril_shovel_head').texture("kubejs:item/tool_part/mythril_shovel_head").displayName('Mythril Shovel Head')
	event.create('mythril_hoe_head').texture("kubejs:item/tool_part/mythril_hoe_head").displayName('Mythril Hoe Head')

	event.create('stitched_cloth_helmet').texture("kubejs:item/tool_part/stitched_cloth_helmet").displayName('Stitched Cloth Helmet Padding')
	event.create('stitched_cloth_chestplate').texture("kubejs:item/tool_part/stitched_cloth_chestplate").displayName('Stitched Cloth Undershirt')
	event.create('stitched_cloth_leggings').texture("kubejs:item/tool_part/stitched_cloth_leggings").displayName('Stitched Cloth Leg Padding')
	event.create('stitched_cloth_boots').texture("kubejs:item/tool_part/stitched_cloth_boots").displayName('Stitched Cloth Boot Padding')
	event.create('partially_woven_cloth_helmet', 'create:sequenced_assembly').texture("kubejs:item/tool_part/stitched_cloth_helmet").displayName('Partially Woven Cloth Helmet Padding')
	event.create('partially_woven_cloth_chestplate', 'create:sequenced_assembly').texture("kubejs:item/tool_part/stitched_cloth_chestplate").displayName('Partially Woven Cloth Undershirt')
	event.create('partially_woven_cloth_leggings', 'create:sequenced_assembly').texture("kubejs:item/tool_part/stitched_cloth_leggings").displayName('Partially Woven Cloth Leg Padding')
	event.create('partially_woven_cloth_boots', 'create:sequenced_assembly').texture("kubejs:item/tool_part/stitched_cloth_boots").displayName('Partially Woven Cloth Boot Padding')
	event.create('cloth_helmet').texture("kubejs:item/tool_part/cloth_helmet").displayName('Woven Cloth Helmet Padding')
	event.create('cloth_chestplate').texture("kubejs:item/tool_part/cloth_chestplate").displayName('Woven Cloth Undershirt')
	event.create('cloth_leggings').texture("kubejs:item/tool_part/cloth_leggings").displayName('Woven Cloth Leg Padding')
	event.create('cloth_boots').texture("kubejs:item/tool_part/cloth_boots").displayName('Woven Cloth Boot Padding')
})

StartupEvents.registry('block', event => {
	event.create('steel_block')
		.hardness(8.0)
		.resistance(8.0)
		.tagBlock('minecraft:mineable/pickaxe')
		.tagBlock('minecraft:needs_stone_tool')
		.tagBlock('minecraft:beacon_base_blocks')
		.soundType(SoundType.METAL)
		.requiresTool(true)
		.textureAll('kubejs:block/steel_block')

	event.create('mythril_block')
		.hardness(8.0)
		.resistance(8.0)
		.tagBlock('minecraft:mineable/pickaxe')
		.tagBlock('minecraft:needs_iron_tool')
		.tagBlock('minecraft:beacon_base_blocks')
		.soundType(SoundType.METAL)
		.requiresTool(true)
		.textureAll('kubejs:block/mythril_block')

	event.create('terra_block')
		.hardness(10.0)
		.resistance(10.0)
		.tagBlock('minecraft:mineable/pickaxe')
		.tagBlock('minecraft:needs_diamond_tool')
		.tagBlock('minecraft:beacon_base_blocks')
		.soundType(SoundType.AMETHYST)
		.requiresTool(true)
		.textureAll('kubejs:block/terra_block')
		.displayName('Terrasteel Block')

	let machine = (name, layer, sound) => {
		let id = name.toLowerCase()
		event.create(id + '_machine')
			.model('kubejs:block/' + id + '_machine')
			.tagBlock('minecraft:mineable/pickaxe')
			.tagBlock('minecraft:needs_stone_tool')
			.hardness(3.0)
			.displayName(name + ' Machine')
			.notSolid()
			.renderType(layer)
			.soundType(sound)
	}

	machine('Andesite', "solid", SoundType.BASALT)
	machine('Brass', "translucent", SoundType.AMETHYST_CLUSTER)
})

StartupEvents.registry('fluid', event => {
	event.create('liquid_redstone')
		.displayName('Liquid Redstone')
		.flowingTexture('kubejs:block/fluids/liquid_redstone_flow')
		.stillTexture('kubejs:block/fluids/liquid_redstone')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_redstone_bucket"
            }
        })
	event.create('liquid_dragon')
		.displayName("Liquid Dragonfire")
		.flowingTexture('kubejs:block/fluids/liquid_dragon_flow')
		.stillTexture('kubejs:block/fluids/liquid_dragon')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_dragon_bucket"
            }
        })
	event.create('liquid_mythril')
		.displayName("Molten Mythril")
		.flowingTexture('kubejs:block/fluids/liquid_mythril_flow')
		.stillTexture('kubejs:block/fluids/liquid_mythril')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_mythril_bucket"
            }
        })
	event.create('liquid_mythril_blend')
		.displayName("Molten Mythril Blend")
		.flowingTexture('kubejs:block/fluids/liquid_mythril_blend_flow')
		.stillTexture('kubejs:block/fluids/liquid_mythril_blend')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_mythril_blend_bucket"
            }
        })
	event.create('liquid_stone')
		.displayName("Molten Stone")
		.flowingTexture('kubejs:block/fluids/liquid_stone_flow')
		.stillTexture('kubejs:block/fluids/liquid_stone')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_stone_bucket"
            }
        })
	event.create('liquid_steel')
		.displayName("Molten Steel")
		.flowingTexture('kubejs:block/fluids/liquid_steel_flow')
		.stillTexture('kubejs:block/fluids/liquid_steel')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_steel_bucket"
            }
        })
	event.create('liquid_diamond_steel')
		.displayName("Molten Diamond-Steel")
		.flowingTexture('kubejs:block/fluids/diamond_steel_flow')
		.stillTexture('kubejs:block/fluids/diamond_steel')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/diamond_steel_bucket"
            }
        })
	event.create('liquid_starlight')
		.displayName("Molten Starlight")
		.flowingTexture('kubejs:block/fluids/liquid_star_flow')
		.stillTexture('kubejs:block/fluids/liquid_star')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_star_bucket"
            }
        })
	event.create('liquid_terra')
		.displayName("Molten Terra")
		.flowingTexture('kubejs:block/fluids/liquid_terra_flow')
		.stillTexture('kubejs:block/fluids/liquid_terra')
		.bucketItem.modelJson({
            "parent": "minecraft:item/generated",
            "textures": {
                "layer0": "kubejs:item/bucket/liquid_terra_bucket"
            }
        })
})
