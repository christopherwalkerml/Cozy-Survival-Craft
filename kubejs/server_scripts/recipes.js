// priority: 0

var seed
var log = []

// Mod shortcuts
let MOD = (domain, id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let CR = (id, x) => MOD("create", id, x)
let MC = (id, x) => MOD("minecraft", id, x)
let KJ = (id, x) => MOD("kubejs", id, x)
let FD = (id, x) => MOD("farmersdelight", id, x)
let SE = (id, x) => MOD("seasonsextras", id, x)

let log_types = ['oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark-oak_log', 'cherry_log', 'crimson_stem', 'warped_stem']
let wood_types = ['oak_wood', 'spruce_wood', 'birch_wood', 'jungle_wood', 'acacia_wood', 'dark-oak_wood', 'cherry_wood', 'crimson_hyphae', 'warped_hyphae']

let tool_cost = {
	'sword': 2,
	'pickaxe': 3,
	'axe': 3,
	'shovel': 1,
	'hoe': 2,
	'helmet': 5,
	'chestplate': 8,
	'leggings': 7,
	'boots': 4
}

let getMbFromIngots = (ingots) => 9000*ingots
let getMb = (Mb) => (81000/1000)*Mb

ServerEvents.recipes(event => {
	log.push('Registering Recipes')
	trickierWindmills(event)
	trickierIronTools(event)
	harderWoodworking(event)
	harderCopper(event)
	trickerDiamondTools(event)
	trickierNetherite(event)
	liquifyItems(event)
	harderMisc(event)
	andesiteMachine(event)
	brassMachine(event)
	log.push('Recipes Updated')
})

function trickierWindmills(event) {
	event.remove({ output: 'create:sail_frame' })
	event.remove({ output: 'create:white_sail' })
	event.shapeless('create:sail_frame', ['create:white_sail'])

	event.shaped('1x kubejs:spool_silk', [
		'SST',
		'STS',
		'TSS'
	], {
		S: MC('string'),
		T: MC('stick')
	})

	event.shapeless(KJ('unwoven_silk', 1), [KJ('spool_silk', 3)])

	let transitional = KJ('incomplete_woven_silk')
	event.recipes.create.sequenced_assembly([
		KJ('woven_silk'),
	], KJ('unwoven_silk'), [
		event.recipes.create.deploying(transitional, [transitional, MC('shears')]).keepHeldItem()
	]).transitionalItem(transitional)
		.loops(8)
		.id(KJ('woven_silk_assembly'))

	event.shaped(CR('white_sail', 1), [
		'TTT',
		'TWT',
		'TTT'
	], {
		W: KJ('woven_silk'),
		T: MC('stick')
	})
}

function trickierIronTools(event) {
	let replace_iron_steel = (item) => {
    	event.replaceInput(
	   		{ output: item }, // Arg 1: the filter
	   		MC('iron_ingot'),            // Arg 2: the item to replace
	   		KJ('steel_ingot')         // Arg 3: the item to replace it with
	    )
	}

	let create_milled_dust = (item_type, item, amt, crushed_recipe) => {
		event.recipes.create.milling(amt ? amt : '1' + 'x kubejs:' + item_type + '_dust', item)
	}

	create_milled_dust('iron', MC('iron_ingot'))
	create_milled_dust('iron', MC('raw_iron'))
	create_milled_dust('iron', CR('crushed_raw_iron'))
	create_milled_dust('iron', MC('iron_ore'), 2)
	create_milled_dust('coal', MC('coal'))
	create_milled_dust('steel', KJ('steel_ingot'))
	create_milled_dust('gold', MC('gold_ingot'))
	create_milled_dust('gold', MC('raw_gold'))
	create_milled_dust('gold', CR('crushed_raw_gold'))
	create_milled_dust('copper', MC('copper_ingot'))
	create_milled_dust('copper', MC('raw_copper'))
	create_milled_dust('copper', CR('crushed_raw_copper'))

	event.remove({ output: MC('wooden_hoe') })
	event.remove({ output: MC('stone_hoe') })

	replace_iron_steel(MC('shears'))
	replace_iron_steel(MC('shield'))
	replace_iron_steel(MC('smithing_table'))
	replace_iron_steel(MC('stonecutter'))
	replace_iron_steel(MC('blast_furnace'))
	replace_iron_steel(MC('anvil'))
	replace_iron_steel(MC('flint_and_steel'))

	event.shapeless(KJ('steel_dust'), [KJ('iron_dust', 3), KJ('coal_dust', 1)])

	event.blasting(KJ('steel_compound', 2), KJ('steel_dust'))

	event.recipes.create.compacting([KJ('heated_steel_compound')], [KJ('steel_compound'), Fluid.lava(getMb(200))])

	let transitional_ingot = KJ('incomplete_steel_ingot')
	event.recipes.create.sequenced_assembly([
		KJ('steel_ingot'),
	], KJ('heated_steel_compound'), [
	    event.recipes.create.pressing(transitional_ingot, transitional_ingot)
	]).transitionalItem(transitional_ingot)
		.loops(16)
		.id(KJ('steel_ingot_pressing'))

	event.shapeless(KJ('steel_nugget', 9), [KJ('steel_ingot')])

	// make the requisite machines harder to craft, but not require steel
	event.remove({ output: CR('millstone') })
	event.shaped(CR('millstone'), [
		'ICI',
		'IAI',
		'BSB'
		], {
		I: MC('iron_ingot'),
		B: MC('iron_block'),
		A: CR('andesite_casing'),
		C: CR('cogwheel'),
		S: '#c:stone'
	})

	event.remove({ output: CR('mechanical_press') })
	event.shaped(CR('mechanical_press'), [
		'ICI',
		'IAI',
		'IBI'
		], {
		I: MC('iron_ingot'),
		B: MC('iron_block'),
		A: CR('andesite_casing'),
		C: CR('cogwheel')
	})

	event.remove({ output: CR('encased_fan') })
	event.shaped(CR('encased_fan'), [
		'ICI',
		'IAP',
		'IBI'
		], {
		I: MC('iron_ingot'),
		B: MC('iron_block'),
		A: CR('andesite_casing'),
		C: CR('cogwheel'),
		P: CR('propeller')
	})

	event.remove({ output: MC('iron_chestplate') })
	event.shaped(KJ('steel_chestplate'), [
		'I I',
		'PPP',
		'IWI'
		], {
		I: KJ('steel_ingot'),
		P: KJ('steel_sheet'),
		W: KJ('woven_silk')
	})

	event.remove({ output: MC('iron_helmet') })
	event.shaped(KJ('steel_helmet'), [
		'IPI',
		'IWI',
		'   '
		], {
		I: KJ('steel_ingot'),
		P: KJ('steel_sheet'),
		W: KJ('woven_silk')
	})

	event.remove({ output: MC('iron_leggings') })
	event.shaped(KJ('steel_leggings'), [
		'III',
		'PWP',
		'I I'
		], {
		I: KJ('steel_ingot'),
		P: KJ('steel_sheet'),
		W: KJ('woven_silk')
	})

	event.remove({ output: MC('iron_boots') })
	event.shaped(KJ('steel_boots'), [
		'PWP',
		'I I',
		'   '
		], {
		I: KJ('steel_ingot'),
		P: KJ('steel_sheet'),
		W: KJ('woven_silk')
	})

	event.remove({ output: MC('iron_pickaxe') })
	event.shaped(KJ('steel_pickaxe'), [
		'III',
		' S ',
		' W '
		], {
		I: KJ('steel_ingot'),
		S: KJ('spool_silk'),
		W: MC('stick')
	})

	event.remove({ output: MC('iron_axe') })
	event.shaped(KJ('steel_axe'), [
		'II ',
		'IS ',
		' W '
		], {
		I: KJ('steel_ingot'),
		S: KJ('spool_silk'),
		W: MC('stick')
	})

	event.remove({ output: MC('iron_shovel') })
	event.shaped(KJ('steel_shovel'), [
		' I ',
		' S ',
		' W '
		], {
		I: KJ('steel_ingot'),
		S: KJ('spool_silk'),
		W: MC('stick')
	})

	event.remove({ output: MC('iron_hoe') })
	event.shaped(KJ('steel_hoe'), [
		'II ',
		' S ',
		' W '
		], {
		I: KJ('steel_ingot'),
		S: KJ('spool_silk'),
		W: MC('stick')
	})

	event.remove({ output: MC('iron_sword') })
	event.shaped(KJ('steel_sword'), [
		'  I',
		' I ',
		'W  '
		], {
		I: KJ('steel_ingot'),
		W: MC('stick')
	})

	event.recipes.create.compacting(
		[KJ('heated_steel_ingot')], 
		[KJ('steel_ingot'), MC('redstone'), MC('redstone'), MC('redstone'), MC('redstone'), Fluid.lava(getMb(500))]
	)

	let transitional_sheet = KJ('incomplete_steel_sheet')
	event.recipes.create.sequenced_assembly([
		KJ('steel_sheet'),
	], KJ('heated_steel_ingot'), [
	    event.recipes.create.pressing(transitional_sheet, transitional_sheet)
	]).transitionalItem(transitional_sheet)
		.loops(16)
		.id(KJ('steel_sheet_pressing'))

	event.remove({ output: CR('wrench') })
	event.shaped(CR('wrench'), [
		'PP ',
		'PC ',
		' S '
	], {
		P: KJ('steel_plate'),
		C: CR('cogwheel'),
		S: MC('stick')
	})

	// TODO add QOL recipes that can be 'unlocked' later to speed up steel casting.
	  // iron tool casts at least?
}

function harderWoodworking(event) {
	let replace_log_recipe = (wood_type) => {
		let wood_type_no_log = wood_type.split('_')[0]
		wood_type_no_log = wood_type_no_log.replace('-', '_')
		wood_type = wood_type.replace('-', '_')

		event.remove({ input: 'minecraft:' + wood_type, output: 'minecraft:' + wood_type_no_log + '_planks' })
		event.remove({ input: 'minecraft:stripped_' + wood_type, output: 'minecraft:' + wood_type_no_log + '_planks' })
		event.shapeless('2x minecraft:' + wood_type_no_log + '_planks', ['minecraft:' + wood_type])
		event.shapeless('2x minecraft:' + wood_type_no_log + '_planks', ['minecraft:stripped_' + wood_type])
		event.recipes.create.cutting('4x minecraft:' + wood_type_no_log + '_planks', 'minecraft:' + wood_type).processingTime(100)
		event.recipes.create.cutting('4x minecraft:' + wood_type_no_log + '_planks', 'minecraft:stripped_' + wood_type).processingTime(100)
	}

	let replace_wood_recipe = (wood_type) => {
		let wood_type_no_wood = wood_type.split('_')[0]
		wood_type_no_wood = wood_type_no_wood.replace('-', '_')
		wood_type = wood_type.replace('-', '_')

		event.remove({ input: 'minecraft:' + wood_type, output: 'minecraft:' + wood_type_no_wood + '_planks' })
		event.remove({ input: 'minecraft:stripped_' + wood_type, output: 'minecraft:' + wood_type_no_wood + '_planks' })
		event.shapeless('2x minecraft:' + wood_type_no_wood + '_planks', ['minecraft:' + wood_type])
		event.shapeless('2x minecraft:' + wood_type_no_wood + '_planks', ['minecraft:stripped_' + wood_type])
		event.recipes.create.cutting('4x minecraft:' + wood_type_no_wood + '_planks', 'minecraft:' + wood_type).processingTime(100)
		event.recipes.create.cutting('4x minecraft:' + wood_type_no_wood + '_planks', 'minecraft:stripped_' + wood_type).processingTime(100)
	}

	log_types.forEach(wood => {
		replace_log_recipe(wood)
	})
	wood_types.forEach(wood => {
		replace_wood_recipe(wood)
	})

	event.remove({ output: CR('cogwheel') })
	event.shaped(CR('cogwheel'), [
		'BBB',
		'BSB',
		'BBB'
		], {
		B: '#minecraft:wooden_buttons',
		S: CR('shaft')
	})
}

function harderCopper(event) {
	event.remove({ output: CR('copper_sheet') })

	event.recipes.create.compacting([KJ('heated_copper_ingot')], [MC('copper_ingot'), Fluid.lava(getMb(100))])

	let transitional = KJ('incomplete_copper_sheet')
	event.recipes.create.sequenced_assembly([
		CR('copper_sheet'),
	], KJ('heated_copper_ingot'), [
	    event.recipes.create.pressing(transitional, transitional)
	]).transitionalItem(transitional)
		.loops(16)
		.id(KJ('copper_sheet_pressing'))

	event.remove({ output: CR('copper_casing') })
	event.recipes.create.deploying(CR('copper_casing'), ['#minecraft:stripped_logs', CR('copper_sheet')])
}

function trickerDiamondTools(event) {
	let create_mythril_cast = (input, output, item_cast, cost) => {
		let tool = item_cast.split('_')[0]
		let diamond_item = input.replace('steel', 'diamond')
		event.remove({ output: diamond_item })

		event.recipes.create.filling(KJ(item_cast), [Fluid.of(KJ('liquid_stone')), input])
		event.recipes.create.compacting([KJ(item_cast), output], [Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost[tool])), KJ(item_cast)])
	}

	// liquid stone and dragon recipe
	event.recipes.create.mixing([Fluid.of(KJ('liquid_stone'), getMb(200))], ['#c:stone', Fluid.lava(getMb(100))]).heated()
	event.recipes.create.emptying([Fluid.of(KJ('liquid_dragon'), getMb(500)), 'minecraft:glass_bottle'], [MC('dragon_breath')])

	create_mythril_cast(KJ('steel_helmet'), KJ('cast_mythril_head_plate'), 'helmet_cast')
	create_mythril_cast(KJ('steel_chestplate'), KJ('cast_mythril_chest_plate'), 'chestplate_cast')
	create_mythril_cast(KJ('steel_leggings'), KJ('cast_mythril_leg_plate'), 'leggings_cast')
	create_mythril_cast(KJ('steel_boots'), KJ('cast_mythril_boot_plate'), 'boots_cast')
	let tool_casts = ['sword', 'pickaxe', 'axe', 'shovel', 'hoe']
	tool_casts.forEach(tool => {
		create_mythril_cast(KJ(`steel_${tool}`), KJ(`mythril_${tool}_head`), `${tool}_cast`)
	})
	event.recipes.create.filling(KJ('tool_rod_cast'), [Fluid.of(KJ('liquid_stone')), MC('blaze_rod')])
	event.recipes.create.compacting([KJ('tool_rod_cast'), KJ('steel_rod')], [Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), KJ('tool_rod_cast')])
	event.recipes.create.filling(KJ('loop_cast'), [Fluid.of(KJ('liquid_stone')), KJ('steel_loop')])
	event.recipes.create.filling(KJ('ingot_cast'), [Fluid.of(KJ('liquid_stone')), KJ('steel_ingot')])

	// Ingot cast recipes
	let pour_ingot_cast = (material) => {
		event.recipes.create.compacting([KJ(item_cast), material + '_ingot'], [Fluid.of(KJ('liquid_' + material), getMbFromIngots(1)), KJ('ingot_cast')])
	}
	event.recipes.create.compacting([KJ('ingot_cast'), KJ('mythril_ingot')], [Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1)), KJ('ingot_cast')])
	event.recipes.create.compacting([KJ('ingot_cast'), KJ('steel_ingot')], [Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), KJ('ingot_cast')])

	// Chain cast recipes
	event.recipes.create.pressing(Item.of(KJ('steel_loop')).withChance(0.1), KJ('steel_rod'))
	event.recipes.create.compacting([KJ('loop_cast'), KJ('mythril_loop')], [Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1/9)), KJ('loop_cast')])
	event.shapeless(KJ('mythril_chain'), [KJ('mythril_loop', 5)])

	// Flux blend
	event.recipes.create.mixing(KJ('ancient_flux'), [KJ('gold_dust'), KJ('copper_dust'), CR('powdered_obsidian'), CR('limestone')])

	// Liquid mythril recipe
	// diamond steel
	event.recipes.create.mixing([
		Fluid.of(KJ('liquid_diamond_steel'), getMb(800))
	], [
		MC('diamond', 4),
		KJ('steel_dust', 4)
	]).heated()

	event.recipes.create.mixing([
		Fluid.of(KJ('liquid_diamond_steel'), getMb(800))
	], [
		MC('diamond', 4),
		KJ('steel_ingot', 4)
	]).heated()

	// mythril blend
	event.recipes.create.mixing([
		Fluid.of(KJ('liquid_mythril_blend'), getMb(1000))
	], [
		Fluid.of(KJ('liquid_diamond_steel'), getMb(800)),
		Fluid.of(KJ('liquid_dragon'), getMb(250))
	]).heated()

	// mythril
	event.recipes.create.mixing([
		Fluid.of(KJ('liquid_mythril'), getMb(800)),
		Fluid.of(KJ('liquid_dragon'), getMb(200))
	], [
		Fluid.of(KJ('liquid_mythril_blend'), getMb(500)),
		KJ('ancient_flux', 3)
	]).superheated()

	// Plates
	// Silk Cloth for polishing
	event.recipes.create.milling(KJ('lime_dust'), CR('limestone'))
	event.shapeless(KJ('silk_cloth'), [KJ('woven_silk'), KJ('lime_dust')])

	let armour_plates = ['Mythril_Head_Plate', 'Mythril_Chest_Plate', 'Mythril_Leg_Plate', 'Mythril_Boot_Plate']
	armour_plates.forEach(plate => {
		var plate_lowercase = plate.toLowerCase()

		let transitional_a = KJ('partially_forged_' + plate_lowercase)
		event.recipes.create.sequenced_assembly([
			KJ('forged_' + plate_lowercase),
		], KJ('cast_' + plate_lowercase), [
			event.recipes.create.pressing(transitional_a, transitional_a)
		]).transitionalItem(transitional_a)
			.loops(48)
			.id(KJ(plate_lowercase + '_forging'))

		let transitional_b = KJ('partially_smoothed_' + plate_lowercase)
		event.recipes.create.sequenced_assembly([
			KJ('smoothed_' + plate_lowercase),
		], KJ('forged_' + plate_lowercase), [
			event.recipes.create.deploying(transitional_b, [transitional_b, '#create:sandpaper'])
		]).transitionalItem(transitional_b)
			.loops(24)
			.id(KJ(plate_lowercase + '_smoothing'))

		let transitional_c = KJ('partially_polished_' + plate_lowercase)
		event.recipes.create.sequenced_assembly([
			KJ('polished_' + plate_lowercase),
		], KJ('smoothed_' + plate_lowercase), [
			event.recipes.create.deploying(transitional_c, [transitional_c, KJ('silk_cloth')])
		]).transitionalItem(transitional_c)
			.loops(24)
			.id(KJ(plate_lowercase + '_polishing'))
	})

	// Cloth and Mythril Recipes
	// Cloth
	let weave_clothing = (item => {
		let transitional = KJ('partially_woven_' + item)
		event.recipes.create.sequenced_assembly([
			KJ(item),
		], KJ('stitched_' + item), [
			event.recipes.create.deploying(transitional, [transitional, MC('shears')]).keepHeldItem()
		]).transitionalItem(transitional)
			.loops(32)
			.id(KJ(item + '_weaving'))
	})
	weave_clothing('cloth_helmet')
	weave_clothing('cloth_chestplate')
	weave_clothing('cloth_leggings')
	weave_clothing('cloth_boots')

	event.shaped(KJ('stitched_cloth_helmet'), [
		'SSS',
		'S S',
		'   '
	], {
		S: KJ('woven_silk')
	})
	event.shaped(KJ('stitched_cloth_chestplate'), [
		'S S',
		'SSS',
		'SSS'
	], {
		S: KJ('woven_silk')
	})
	event.shaped(KJ('stitched_cloth_leggings'), [
		'SSS',
		'S S',
		'S S'
	], {
		S: KJ('woven_silk')
	})
	event.shaped(KJ('stitched_cloth_boots'), [
		'S S',
		'S S',
		'   '
	], {
		S: KJ('woven_silk')
	})
	
	// Mythril
	let armour_list = [
		['mythril_helmet', 'head'], 
		['mythril_chestplate', 'chest'], 
		['mythril_leggings', 'leg'], 
		['mythril_boots', 'boot']]
	armour_list.forEach(armour => {
		let piece = armour[0]
		let part = armour[1]
		let material = piece.split('_')[0]
		let plate = piece.split('_')[1]
		event.shaped(KJ(piece), [
			'CMC',
			'CSC',
			'CMC'
		], {
			M: KJ(`polished_${material}_${part}_plate`),
			S: KJ(`cloth_${plate}`),
			C: KJ(`${material}_chain`)
		})
	})
	let tool_list = ['mythril_sword', 'mythril_pickaxe', 'mythril_axe', 'mythril_shovel', 'mythril_hoe']
	tool_list.forEach(tool => {
		event.shaped(KJ(tool), [
			'  M',
			' S ',
			'W  '
		], {
			M: KJ(`${tool}_head`),
			S: KJ('spool_silk'),
			W: MC('stick')
		})
	})

	event.shapeless(KJ('mythril_block'), KJ('mythril_ingot', 9))
}

function trickierNetherite(event) {
	// Ancient Debris
	event.remove({ output: MC('netherite_scrap') })
	event.remove({ output: MC('netherite_ingot'), input: MC('gold_ingot') })
	event.recipes.create.mixing([
		KJ('debris_pile', 5)
	], [
		Fluid.water(getMb(200)),
		MC('ancient_debris')
	]).heated()

	event.recipes.create.emptying([Fluid.water(getMb(200)), MC('netherite_scrap')], KJ('debris_pile'))

	let transitional = KJ('partially_sifted_debris')
	event.recipes.create.sequenced_assembly([
		Item.of(KJ('netherite_chunk')).withChance(20),
		Item.of(KJ('debris_scrap')).withChance(80)
	], MC('netherite_scrap'), [
		event.recipes.create.deploying(transitional, [transitional, MC('brush')]).keepHeldItem()
	]).transitionalItem(transitional)
		.loops(8)
		.id(KJ('ancient_debris_sifting'))

	event.recipes.create.crushing(KJ('netherite_dust'), KJ('netherite_chunk'))
	event.recipes.create.crushing([
			Item.of(KJ('gold_dust')).withChance(0.5),
			Item.of(MC('quartz')).withChance(0.4),
			Item.of(MC('bone_meal')).withChance(0.2),
			Item.of(MC('netherrack')).withChance(0.2),
			Item.of(MC('blaze_powder')).withChance(0.2),
			Item.of(KJ('coal_dust')).withChance(0.15),
			Item.of(CR('powdered_obsidian')).withChance(0.1),
			Item.of(MC('ghast_tear')).withChance(0.05),
			Item.of(KJ('netherite_dust')).withChance(0.05)
		],
		KJ('debris_scrap')
	)

	// Starlight
	event.recipes.create.crushing([
		KJ('starlight_dust', 4), 
		Item.of(KJ('starlight_dust')).withChance(0.5), 
		Item.of(KJ('starlight_dust')).withChance(0.25),
		CR('experience_nugget', 16)
	], MC('nether_star')).processingTime(1000)

	event.recipes.create.mixing([
		Fluid.of(KJ('liquid_starlight'), getMb(1000))
	], [
		Fluid.of(KJ('liquid_dragon'), getMb(1000)),
		KJ('starlight_dust')
	]).superheated()
}

function liquifyItems(event) {	
	// Turn ingots, plates, loops, and tool parts back into their base material
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1)), [KJ('mythril_ingot')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1/9)), [KJ('mythril_loop')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['sword'])), [KJ('mythril_sword_head')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['pickaxe'])), [KJ('mythril_pickaxe_head')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['axe'])), [KJ('mythril_axe_head')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['shovel'])), [KJ('mythril_shovel_head')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['hoe'])), [KJ('mythril_hoe_head')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['helmet'])), [KJ('cast_mythril_head_plate')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['chestplate'])), [KJ('cast_mythril_chest_plate')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['leggings'])), [KJ('cast_mythril_leg_plate')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['boots'])), [KJ('cast_mythril_boot_plate')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1/9)), [KJ('steel_nugget')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1/9)), [KJ('steel_loop')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('steel_ingot')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('steel_sheet')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('steel_dust')]).heated()
}

function harderMisc(event) {
	event.remove({ output: CR('water_wheel') })
	event.shaped(CR('water_wheel'), [
		'SSS',
		'SGS',
		'SSS'
		], {
		S: '#minecraft:wooden_slabs',
		G: CR('gearbox')
	})

	event.remove(CR('clipboard'))

	event.replaceInput(
   		{ output: CR('crushing_wheel') }, // Arg 1: the filter
   		'#c:stone',            // Arg 2: the item to replace
   		KJ('andesite_machine')         // Arg 3: the item to replace it with
    )

	event.remove({ output: CR('empty_blaze_burner') })
	event.shaped(CR('empty_blaze_burner'), [
		' S ',
		'SOS',
		' S '
		], {
		S: KJ('steel_sheet'),
		O: MC('crying_obsidian')
	})
    event.replaceInput(
    	{ output: CR('empty_blaze_burner') },
    	CR('iron_sheet'),
    	KJ('steel_sheet')
	)
    event.replaceInput(
    	{ output: CR('item_vault') },
    	CR('iron_sheet'),
    	KJ('steel_sheet')
	)

	event.remove({ output: SE('heater') })
	event.shaped(SE('heater'), [
		'PSP',
		'SFS',
		'PAP'
	], {
		P: KJ('steel_sheet'),
		S: '#minecraft:stone_crafting_materials',
		F: MC('furnace'),
		A: KJ('andesite_machine')
	})

	event.remove({ output: SE('chiller') })
	event.shaped(SE('chiller'), [
		'PIP',
		'SFS',
		'PAP'
	], {
		P: KJ('steel_sheet'),
		I: MC('packed_ice'),
		S: '#minecraft:stone_crafting_materials',
		F: MC('furnace'),
		A: KJ('andesite_machine')
	})

	event.remove({ output: SE('crop_season_tester') })
	event.shaped(SE('crop_season_tester'), [
		'I I',
		' G ',
		' S '
	], {
		I: MC('iron_ingot'),
		G: MC('gold_ingot'),
		S: MC('stick')
	})

	let transitional = CR('incomplete_track')
	// change regular tracks to use steel nuggets
	event.remove({ output: CR('track') })
	event.recipes.create.sequenced_assembly([
		CR('track'),
	], '#create:sleepers', [
		event.recipes.create.deploying(transitional, [transitional, KJ('steel_nugget')]),
		event.recipes.create.deploying(transitional, [transitional, KJ('steel_nugget')]),
		event.recipes.create.pressing(transitional, transitional)
	]).transitionalItem(transitional)
		.loops(1)
		.id('kubejs:steel_tracks')
	
	event.remove({ output: MC('enchanting_table') })
	event.shaped(MC('enchanting_table'), [
		'SBS',
		'DOD',
		'OOO'
	], {
		S: KJ('woven_silk'),
		B: MC('book'),
		O: MC('obsidian'),
		D: MC('diamond')
	})

	event.replaceInput({ output: 'betterarcheology:iron_brush'}, MC('iron_ingot'), KJ('steel_ingot') )
	event.replaceInput({ output: 'betterarcheology:diamond_brush'}, MC('diamond'), KJ('mythril_ingot') )

	// Change Extended Cogwheels Recipes to be a bit simpler
	event.remove({ output: 'extendedgears:half_shaft_cogwheel' })
	event.stonecutting('extendedgears:half_shaft_cogwheel', CR('cogwheel'))
	event.remove({ output: 'extendedgears:shaftless_cogwheel' })
	event.stonecutting('extendedgears:shaftless_cogwheel', CR('cogwheel'))
	event.remove({ output: 'extendedgears:large_half_shaft_cogwheel' })
	event.stonecutting('extendedgears:large_half_shaft_cogwheel', CR('large_cogwheel'))
	event.remove({ output: 'extendedgears:large_shaftless_cogwheel' })
	event.stonecutting('extendedgears:large_shaftless_cogwheel', CR('large_cogwheel'))
}

function andesiteMachine(event) {
	let transitional = KJ('incomplete_kinetic_mechanism')
	event.recipes.create.sequenced_assembly([
		KJ('kinetic_mechanism'),
	], CR('cogwheel'), [
		event.recipes.create.deploying(transitional, [transitional, '#c:stripped_logs']),
		event.recipes.create.deploying(transitional, [transitional, CR('andesite_alloy')]),
		event.recipes.create.deploying(transitional, [transitional, KJ('steel_ingot')]),
		event.recipes.create.deploying(transitional, [transitional, '#minecraft:axes']).keepHeldItem()
	]).transitionalItem(transitional)
		.loops(1)
		.id('kubejs:kinetic_mechanism')

	event.shapeless(KJ('kinetic_mechanism'), [
		'#minecraft:axes',
		CR('cogwheel'),
		CR('andesite_alloy'),
		KJ('steel_ingot'),
		'#minecraft:logs'
	]).id('kubejs:kinetic_mechanism_manual_only')
	.damageIngredient('#minecraft:axes')

	// Andesite
	event.remove({ output: CR('andesite_casing') })
	event.shaped(CR('andesite_casing'), [
		'AAA',
		'ALA',
		'AAA'
	], {
		A: CR('andesite_alloy'),
		L: '#c:stripped_logs'
	})

	event.shaped(KJ('andesite_machine'), [
		'SSS',
		'SCS',
		'SSS'
	], {
		C: CR('andesite_casing'),
		S: KJ('kinetic_mechanism')
	})

	let create_machine = (machine, part) => {
		event.remove({ output: machine })
		event.shaped(machine, [
			'WGW',
			'WAF',
			'WWW'
		], {
			W: '#minecraft:planks',
			G: CR('gearbox'),
			F: part,
			A: KJ('andesite_machine')
		})
	}

	create_machine(CR('mechanical_mixer'), CR('whisk'))
	create_machine(CR('mechanical_drill'), MC('iron_pickaxe'))
	create_machine(CR('mechanical_saw'), CR('turntable'))
	create_machine(CR('gantry_carriage'), CR('cogwheel'))
	create_machine(CR('rope_pulley'), KJ('spool_silk'))
	create_machine(CR('mechanical_bearing'), MC('slime_block'))
	create_machine(CR('portable_storage_interface'), MC('chest'))
	create_machine(CR('mechanical_harvester'), MC('propeller'))
	create_machine(CR('deployer'), MC('brass_hand'))
	create_machine(CR('mechanical_plough'), CR('belt_connector'))
	create_machine(CR('mechanical_roller'), CR('crushing_wheel'))
	create_machine('sliceanddice:slicer', FD('iron_knife'))

	let andesite_machine = (id, amount, other_ingredient) => {
		event.remove({ output: id })
		if (other_ingredient) {
			event.smithing(Item.of(id, amount), 'kubejs:andesite_machine', other_ingredient)
			event.recipes.createMechanicalCrafting(Item.of(id, amount), "AB", { A: 'kubejs:andesite_machine', B: other_ingredient })
		}
		else
			event.stonecutting(Item.of(id, amount), 'kubejs:andesite_machine')
	}

	andesite_machine(CR('andesite_funnel'), 4)
	andesite_machine(CR('andesite_tunnel'), 4)
}

function brassMachine(event) {
	// electron tube recipes
	event.recipes.create.pressing(KJ('zinc_sheet'), CR('zinc_ingot'))

	event.remove({ output: CR('electron_tube') })
	event.recipes.create.mixing(KJ('electron_tube_casing'), [MC('glass'), CR('polished_rose_quartz'), KJ('zinc_sheet')])

	event.recipes.create.mixing(Fluid.of(KJ('liquid_redstone'),(getMb(20))), [MC('redstone')]).heated()

	let transitional = KJ('incomplete_electron_tube')
	event.recipes.create.sequenced_assembly([
		CR('electron_tube'),
	], KJ('electron_tube_casing'), [
		event.recipes.create.filling(transitional, [transitional, Fluid.of(KJ('liquid_redstone'),(getMb(50)))]),
		event.recipes.create.pressing(transitional, transitional),
		event.recipes.create.deploying(transitional, [transitional, MC('gold_nugget')])
	]).transitionalItem(transitional)
		.loops(1)
		.id('kubejs:complex_electron_tube')

	// photovoltaic fragment recipe
	let trans_diamond = KJ('partially_crushed_diamond')
	event.recipes.create.sequenced_assembly([
		KJ('crushed_diamond'),
	], MC('diamond'), [
	    event.recipes.create.pressing(trans_diamond, trans_diamond)
	]).transitionalItem(trans_diamond)
		.loops(24)
		.id(KJ('diamond_crushing'))

	event.recipes.create.mixing(Item.of(KJ('diamond_pile')), [Fluid.water(getMb(100)), KJ('crushed_diamond')])
	event.recipes.create.emptying([Fluid.water(getMb(100)), KJ('washed_diamond')], KJ('diamond_pile'))
	event.recipes.create.deploying(Item.of(KJ('diamond_shard')).withChance(0.25), [KJ('washed_diamond'), MC('brush')]).keepHeldItem()

	// calculation mechanism recipe
	let trans_mechanism = KJ('incomplete_calculation_mechanism')
	event.recipes.create.sequenced_assembly([
		KJ('calculation_mechanism'),
	], KJ('kinetic_mechanism'), [
		event.recipes.create.deploying(trans_mechanism, [trans_mechanism, CR('electron_tube')]),
		event.recipes.create.deploying(trans_mechanism, [trans_mechanism, CR('electron_tube')]),
		event.recipes.create.pressing(trans_mechanism, trans_mechanism),
		event.recipes.create.deploying(trans_mechanism, [trans_mechanism, KJ('diamond_shard')])
	]).transitionalItem(trans_mechanism)
		.loops(1)
		.id('kubejs:calculation_mechanism_assembly')

	event.remove({ output: CR('brass_casing') })
	event.shaped(CR('brass_casing'), [
		'BSB',
		'SLS',
		'BSB'	
	], {
		B: CR('brass_ingot'),
		S: CR('brass_sheet'),
		L: '#c:stripped_logs'
	})

	event.shaped(KJ('brass_machine'), [
		'KCK',
		'WBA',
		'KCK'	
	], {
		C: KJ('calculation_mechanism'),
		K: KJ('kinetic_mechanism'),
		A: KJ('andesite_machine'),
		B: CR('brass_casing'),
		W: CR('large_cogwheel')
	})

	let brass_machine = (id, amount, other_ingredient) => {
		event.remove({ output: id })
		if (other_ingredient) {
			event.smithing(Item.of(id, amount), KJ('brass_machine'), other_ingredient)
			event.recipes.createMechanicalCrafting(Item.of(id, amount), "AB", { A: 'kubejs:brass_machine', B: other_ingredient })
		}
		else
			event.stonecutting(Item.of(id, amount), KJ('brass_machine'))
	}

	brass_machine(CR('brass_funnel'), 4)
	brass_machine(CR('brass_tunnel'), 4)
	brass_machine(CR('redstone_link'), 2)
	brass_machine(CR('display_link'), 2)
	brass_machine(CR('sequenced_gearshift'), 2)
	brass_machine(CR('mechanical_arm'), 2)
	brass_machine(CR('elevator_pulley'), 2)
	brass_machine(CR('clockwork_bearing'), 2)
	brass_machine(CR('stockpile_switch'), 2)
	brass_machine(CR('content_observer'), 2)
	brass_machine(CR('rotation_speed_controller'), 2)
	brass_machine(CR('smart_chute'), 2)
	brass_machine(CR('smart_fluid_pipe'), 2)
	brass_machine(CR('mechanical_crafter'), 4)
	brass_machine(CR('railway_casing'), 4)
}
