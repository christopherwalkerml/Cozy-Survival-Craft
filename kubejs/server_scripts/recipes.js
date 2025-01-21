// priority: 0

var seed
var log = []

// Mod shortcuts
let MOD = (domain, id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let CR = (id, x) => MOD("create", id, x)
let CEI = (id, x) => MOD("create_enchantment_industry", id, x)
let MC = (id, x) => MOD("minecraft", id, x)
let KJ = (id, x) => MOD("kubejs", id, x)
let FD = (id, x) => MOD("farmersdelight", id, x)
let FED = (id, x) => MOD("expandeddelight", id, x)
let SE = (id, x) => MOD("seasonsextras", id, x)
let CF = (id, x) => MOD("createfood", id, x)
let CA = (id, x) => MOD("createaddition", id, x)
let TS = (id, x) => MOD("toms_storage", id, x)
let IA = (id, x) => MOD("immersive_aircraft", id, x)

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
	trickierDiamondTools(event)
	trickierNetherite(event)
	liquifyItems(event)
	harderMisc(event)
	andesiteMachine(event)
	brassMachine(event)
	harderFood(event)
	harderAdditions(event)
	harderToms(event)
	harderAircrafts(event)
	harderRails(event)
	harderEnchanting(event)
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
		event.recipes.create.deploying(transitional, [transitional, MC('shears')])
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

	let create_milled_dust = (item_type, item, amt) => {
		let item_dust = item_type + '_dust'
		if (!amt) {
			event.recipes.create.milling(KJ(item_dust), item)
		} else {
			event.recipes.create.milling([KJ(item_dust), Item.of(KJ(item_dust), amt).withChance(0.1)], item)
		}
	}

	// create all dust recipes
	create_milled_dust('iron', MC('iron_ingot'))
	create_milled_dust('iron', MC('raw_iron'), 1)
	create_milled_dust('iron', CR('crushed_raw_iron'))
	create_milled_dust('coal', MC('coal'))
	create_milled_dust('steel', KJ('steel_ingot'))
	create_milled_dust('gold', MC('gold_ingot'))
	create_milled_dust('gold', MC('raw_gold'), 1)
	create_milled_dust('gold', CR('crushed_raw_gold'))
	create_milled_dust('copper', MC('copper_ingot'))
	create_milled_dust('copper', MC('raw_copper'), 1)
	create_milled_dust('copper', CR('crushed_raw_copper'))
	create_milled_dust('zinc', CR('zinc_ingot'))
	create_milled_dust('zinc', CR('raw_zinc'), 1)
	create_milled_dust('zinc', CR('crushed_raw_zinc'))
	// charcoal should be able to be coal dust, but low chance and later progression
	event.recipes.create.crushing(Item.of(KJ('coal_dust')).withChance(0.2), MC('charcoal'))

	event.remove({ output: MC('black_dye'), input: MC('coal') })
	event.remove({ output: MC('black_dye'), input: MC('charcoal') })
	event.remove({ output: MC('wooden_hoe') })
	event.remove({ output: MC('stone_hoe') })

	// Make iron recipes require steel
	replace_iron_steel(MC('shears'))
	replace_iron_steel(MC('shield'))
	replace_iron_steel(MC('smithing_table'))
	replace_iron_steel(MC('stonecutter'))
	replace_iron_steel(MC('blast_furnace'))
	replace_iron_steel(MC('anvil'))
	replace_iron_steel(MC('flint_and_steel'))
	replace_iron_steel(CR('metal_bracket'))
	event.replaceInput(
		{ output: MC('bucket') },
		MC('iron_ingot'),
		KJ('steel_sheet')
 	)

	event.blasting(MC('iron_ingot'), KJ('iron_dust'))
	event.blasting(MC('gold_ingot'), KJ('gold_dust'))
	event.blasting(MC('copper_ingot'), KJ('copper_dust'))
	event.blasting(CR('zinc_ingot'), KJ('zinc_dust'))

	// Steel Process
	event.shapeless(KJ('steel_dust', 2), [KJ('iron_dust', 3), KJ('coal_dust', 1)])

	event.blasting(KJ('steel_compound'), KJ('steel_dust'))

	event.blasting(KJ('heated_steel_compound'), KJ('steel_compound'))
	event.recipes.create.mixing(KJ('heated_steel_compound'), KJ('steel_compound')).heated()

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
		'LAL',
		'HBH'
		], {
		I: MC('iron_ingot'),
		B: MC('iron_block'),
		A: CR('andesite_casing'),
		C: CR('cogwheel'),
		L: CR('large_cogwheel'),
		H: KJ('hard_bricks')
	})

	event.remove({ output: CR('mechanical_press') })
	event.shaped(CR('mechanical_press'), [
		'ICI',
		'IAI',
		'HBH'
		], {
		I: MC('iron_ingot'),
		B: MC('iron_block'),
		A: CR('andesite_casing'),
		C: CR('cogwheel'),
		H: KJ('hard_bricks')
	})

	event.remove({ output: CR('encased_fan') })
	event.shaped(CR('encased_fan'), [
		'ICI',
		'IAI',
		'HPH'
		], {
		I: MC('iron_ingot'),
		C: CR('cogwheel'),
		A: CR('andesite_casing'),
		P: CR('propeller'),
		H: KJ('hard_bricks')
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
		'TIT',
		' S ',
		' W '
		], {
		I: KJ('steel_ingot'),
		S: KJ('spool_silk'),
		W: MC('stick'),
		T: KJ('steel_sheet')
	})

	event.remove({ output: MC('iron_axe') })
	event.shaped(KJ('steel_axe'), [
		'TI ',
		'TS ',
		' W '
		], {
		I: KJ('steel_ingot'),
		S: KJ('spool_silk'),
		W: MC('stick'),
		T: KJ('steel_sheet')
	})

	event.remove({ output: MC('iron_shovel') })
	event.shaped(KJ('steel_shovel'), [
		' T ',
		' S ',
		' W '
		], {
		T: KJ('steel_sheet'),
		S: KJ('spool_silk'),
		W: MC('stick')
	})

	event.remove({ output: MC('iron_hoe') })
	event.shaped(KJ('steel_hoe'), [
		'TI ',
		' S ',
		' W '
		], {
		I: KJ('steel_ingot'),
		S: KJ('spool_silk'),
		W: MC('stick'),
		T: KJ('steel_sheet')
	})

	event.remove({ output: MC('iron_sword') })
	event.shaped(KJ('steel_sword'), [
		'  I',
		' I ',
		'W  '
		], {
		I: KJ('steel_sheet'),
		W: MC('stick')
	})

	event.recipes.create.compacting(
		[KJ('heated_steel_ingot')], 
		[KJ('steel_ingot'), Fluid.lava(getMb(500))]
	)
	event.recipes.create.mixing(KJ('heated_steel_ingot'), KJ('steel_ingot')).heated()

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
		P: KJ('steel_sheet'),
		C: CR('cogwheel'),
		S: MC('stick')
	})

	event.replaceInput({ output: MC('rail') }, MC('iron_ingot'), KJ('steel_nugget'))
	event.replaceInput({ output: MC('activator_rail') }, MC('iron_ingot'), KJ('steel_nugget'))
	event.replaceInput({ output: MC('detector_rail') }, MC('iron_ingot'), KJ('steel_nugget'))
	event.replaceInput({ output: MC('minecart') }, MC('iron_ingot'), KJ('steel_sheet'))
	event.replaceInput({ output: MC('powered_rail') }, MC('gold_ingot'), CR('golden_sheet'))
	event.replaceInput({ output: CR('controller_rail') }, MC('gold_ingot'), CR('golden_sheet'))
	event.replaceInput({ output: CR('metal_bracket') }, MC('iron_nugget'), KJ('steel_nugget'))
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
		event.recipes.create.cutting('4x minecraft:' + wood_type_no_log + '_planks', 'minecraft:stripped_' + wood_type).processingTime(100)
		// create slab, pressure plate and button recipes too
		event.recipes.create.cutting('2x minecraft:' + wood_type_no_log + '_slab', MC(wood_type_no_log + '_planks')).processingTime(100)
		event.recipes.create.cutting('4x minecraft:' + wood_type_no_log + '_pressure_plate', MC(wood_type_no_log + '_slab')).processingTime(100)
		event.recipes.create.cutting('8x minecraft:' + wood_type_no_log + '_button', MC(wood_type_no_log + '_pressure_plate')).processingTime(100)
	}

	let replace_wood_recipe = (wood_type) => {
		let wood_type_no_wood = wood_type.split('_')[0]
		wood_type_no_wood = wood_type_no_wood.replace('-', '_')
		wood_type = wood_type.replace('-', '_')

		event.remove({ input: 'minecraft:' + wood_type, output: 'minecraft:' + wood_type_no_wood + '_planks' })
		event.remove({ input: 'minecraft:stripped_' + wood_type, output: 'minecraft:' + wood_type_no_wood + '_planks' })
		event.shapeless('2x minecraft:' + wood_type_no_wood + '_planks', ['minecraft:' + wood_type])
		event.shapeless('2x minecraft:' + wood_type_no_wood + '_planks', ['minecraft:stripped_' + wood_type])
		event.recipes.create.cutting('4x minecraft:' + wood_type_no_wood + '_planks', 'minecraft:stripped_' + wood_type).processingTime(100)
	}

	log_types.forEach(wood => {
		replace_log_recipe(wood)
	})
	// wood is that all-sided bark stuff
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
	event.recipes.create.mixing(KJ('heated_copper_ingot'), MC('copper_ingot')).heated()

	let transitional = KJ('incomplete_copper_sheet')
	event.recipes.create.sequenced_assembly([
		CR('copper_sheet'),
	], KJ('heated_copper_ingot'), [
	    event.recipes.create.pressing(transitional, transitional)
	]).transitionalItem(transitional)
		.loops(16)
		.id(KJ('copper_sheet_pressing'))

	event.remove({ output: CR('copper_casing') })
	event.recipes.create.deploying(CR('copper_casing'), ['#c:stripped_logs', CR('copper_sheet')])
	event.recipes.create.deploying(CR('andesite_casing'), ['#c:stripped_logs', CR('andesite_alloy')])
}

function trickierDiamondTools(event) {
	let create_mythril_cast = (input, output, item_cast, cost) => {
		let tool = item_cast.split('_')[0]
		let diamond_item = input.replace('steel', 'diamond')
		event.remove({ output: diamond_item })

		event.recipes.create.filling(KJ(item_cast), [Fluid.of(KJ('liquid_stone')), input])
		event.recipes.create.compacting([KJ(item_cast), output], [Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost[tool])), KJ(item_cast)])
	}

	// liquid stone and dragon recipe
	event.recipes.create.mixing([Fluid.of(KJ('liquid_stone'), getMb(200))], ['#c:stone', Fluid.lava(getMb(100))]).heated()
	event.recipes.create.mixing([Fluid.of(KJ('liquid_stone'), getMb(200))], ['#c:cobblestone', Fluid.lava(getMb(100))]).heated()
	event.recipes.create.emptying([Fluid.of(KJ('liquid_dragon'), getMb(500)), 'minecraft:glass_bottle'], [MC('dragon_breath')])

	create_mythril_cast(KJ('steel_helmet'), KJ('cast_mythril_head_plate'), 'helmet_cast')
	create_mythril_cast(KJ('steel_chestplate'), KJ('cast_mythril_chest_plate'), 'chestplate_cast')
	create_mythril_cast(KJ('steel_leggings'), KJ('cast_mythril_leg_plate'), 'leggings_cast')
	create_mythril_cast(KJ('steel_boots'), KJ('cast_mythril_boot_plate'), 'boots_cast')
	let tool_casts = ['sword', 'pickaxe', 'axe', 'shovel', 'hoe']
	tool_casts.forEach(tool => {
		create_mythril_cast(KJ(`steel_${tool}`), KJ(`cast_mythril_${tool}_head`), `${tool}_cast`)
	})
	event.recipes.create.filling(KJ('tool_rod_cast'), [Fluid.of(KJ('liquid_stone')), MC('blaze_rod')])
	event.recipes.create.compacting([KJ('tool_rod_cast'), KJ('steel_rod')], [Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), KJ('tool_rod_cast')])
	event.recipes.create.filling(KJ('loop_cast'), [Fluid.of(KJ('liquid_stone')), KJ('steel_loop')])
	event.recipes.create.filling(KJ('ingot_cast'), [Fluid.of(KJ('liquid_stone')), KJ('steel_ingot')])
	event.recipes.create.filling(KJ('sheet_cast'), [Fluid.of(KJ('liquid_stone')), KJ('steel_sheet')])

	// Ingot cast recipes
	let pour_ingot_cast = (material) => {
		event.recipes.create.compacting([KJ(item_cast), material + '_ingot'], [Fluid.of(KJ('liquid_' + material), getMbFromIngots(1)), KJ('ingot_cast')])
	}
	event.recipes.create.compacting([KJ('ingot_cast'), KJ('mythril_ingot')], [Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1)), KJ('ingot_cast')])
	event.recipes.create.compacting([KJ('sheet_cast'), KJ('mythril_sheet')], [Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1)), KJ('sheet_cast')])
	event.recipes.create.compacting([KJ('ingot_cast'), KJ('steel_ingot')], [Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), KJ('ingot_cast')])
	event.recipes.create.compacting([KJ('sheet_cast'), KJ('steel_sheet')], [Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), KJ('sheet_cast')])
	event.recipes.create.compacting([KJ('ingot_cast'), KJ('terra_ingot')], [Fluid.of(KJ('liquid_terra'), getMbFromIngots(1)), KJ('ingot_cast')])
	event.recipes.create.compacting([KJ('sheet_cast'), KJ('terra_sheet')], [Fluid.of(KJ('liquid_terra'), getMbFromIngots(1)), KJ('sheet_cast')])
	event.recipes.create.compacting([KJ('ingot_cast'), MC('copper_ingot')], [Fluid.of(KJ('liquid_copper'), getMbFromIngots(1)), KJ('ingot_cast')])
	event.recipes.create.compacting([KJ('sheet_cast'), CR('copper_sheet')], [Fluid.of(KJ('liquid_copper'), getMbFromIngots(1)), KJ('sheet_cast')])
	event.recipes.create.compacting([KJ('ingot_cast'), CR('zinc_ingot')], [Fluid.of(KJ('liquid_zinc'), getMbFromIngots(1)), KJ('ingot_cast')])
	event.recipes.create.compacting([KJ('sheet_cast'), CR('zinc_sheet')], [Fluid.of(KJ('liquid_zinc'), getMbFromIngots(1)), KJ('sheet_cast')])
	event.recipes.create.compacting([KJ('ingot_cast'), CR('brass_ingot')], [Fluid.of(KJ('liquid_brass'), getMbFromIngots(1)), KJ('ingot_cast')])
	event.recipes.create.compacting([KJ('sheet_cast'), CR('brass_sheet')], [Fluid.of(KJ('liquid_brass'), getMbFromIngots(1)), KJ('sheet_cast')])

	// Block Recipes
	event.shapeless(KJ('steel_block'), KJ('steel_ingot', 9))
	event.shapeless(KJ('steel_ingot', 9), KJ('steel_block'))
	event.shapeless(KJ('mythril_block'), KJ('mythril_ingot', 9))
	event.shapeless(KJ('mythril_ingot', 9), KJ('mythril_block'))
	event.shapeless(KJ('terra_block'), KJ('terra_ingot', 9))
	event.shapeless(KJ('terra_ingot', 9), KJ('terra_block'))

	// Chain cast recipes
	event.recipes.create.pressing(Item.of(KJ('steel_loop')).withChance(0.1), KJ('steel_rod'))
	event.recipes.create.compacting([KJ('loop_cast'), KJ('mythril_loop')], [Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1/9)), KJ('loop_cast')])
	event.shapeless(KJ('mythril_chain'), [KJ('mythril_loop', 5)])

	// Flux blend and Blaze Cake
	event.recipes.create.mixing(KJ('ancient_flux'), [KJ('gold_dust'), KJ('copper_dust'), CR('powdered_obsidian'), KJ('lime_dust'), MC('redstone'), MC('gunpowder')])
	event.remove({ output: CR('blaze_cake_base') })
	event.recipes.create.compacting(CR('blaze_cake_base'), [Fluid.of('milk:still_milk', getMb(200)), '#c:sweet_dough', '#c:butter', CR('cinder_flour')])

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
		Fluid.of(KJ('liquid_dragon'), getMb(100))
	], [
		Fluid.of(KJ('liquid_mythril_blend'), getMb(500)),
		KJ('ancient_flux', 3)
	]).superheated()

	// Plates
	// Silk Cloth for polishing
	event.recipes.create.milling(KJ('lime_dust'), CR('limestone'))
	event.shapeless(KJ('silk_cloth'), [KJ('woven_silk'), KJ('lime_dust')])
	event.recipes.create.milling(KJ('sand_paper'), CR('sand_paper'))

	let tool_heads = ['mythril_sword_head', 'mythril_pickaxe_head', 'mythril_axe_head', 'mythril_shovel_head', 'mythril_hoe_head']
	tool_heads.forEach(head => {
		let transitional_a = KJ('partially_forged_' + head)
		event.recipes.create.sequenced_assembly([
			KJ(head),
		], KJ('cast_' + head), [
			event.recipes.create.pressing(transitional_a, transitional_a)
		]).transitionalItem(transitional_a)
			.loops(64)
			.id(KJ(head + '_forging'))
	})

	let armour_plates = ['mythril_head_plate', 'mythril_chest_plate', 'mythril_leg_plate', 'mythril_boot_plate']
	armour_plates.forEach(plate => {
		let transitional_a = KJ('partially_forged_' + plate)
		event.recipes.create.sequenced_assembly([
			KJ('forged_' + plate),
		], KJ('cast_' + plate), [
			event.recipes.create.pressing(transitional_a, transitional_a)
		]).transitionalItem(transitional_a)
			.loops(48)
			.id(KJ(plate + '_forging'))

		let transitional_b = KJ('partially_smoothed_' + plate)
		event.recipes.create.sequenced_assembly([
			KJ('smoothed_' + plate),
		], KJ('forged_' + plate), [
			event.recipes.create.deploying(transitional_b, [transitional_b, KJ('sand_paper')])
		]).transitionalItem(transitional_b)
			.loops(24)
			.id(KJ(plate + '_smoothing'))

		let transitional_c = KJ('partially_polished_' + plate)
		event.recipes.create.sequenced_assembly([
			KJ('polished_' + plate),
		], KJ('smoothed_' + plate), [
			event.recipes.create.deploying(transitional_c, [transitional_c, KJ('silk_cloth')])
		]).transitionalItem(transitional_c)
			.loops(24)
			.id(KJ(plate + '_polishing'))
	})

	// Cloth and Mythril Recipes
	// Cloth
	let weave_clothing = (item => {
		let transitional = KJ('partially_woven_' + item)
		event.recipes.create.sequenced_assembly([
			KJ(item),
		], KJ('stitched_' + item), [
			event.recipes.create.deploying(transitional, [transitional, MC('shears')])
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
}

function trickierNetherite(event) {
	// Ancient Debris
	event.remove({ output: MC('netherite_scrap') })
	event.remove({ output: MC('netherite_ingot') })
	event.recipes.create.mixing([
		KJ('debris_pile')
	], [
		Fluid.water(getMb(200)),
		MC('ancient_debris')
	]).heated()

	event.recipes.create.emptying([Fluid.water(getMb(200)), MC('netherite_scrap')], KJ('debris_pile'))

	let transitional = KJ('partially_sifted_debris')
	event.recipes.create.sequenced_assembly([
		Item.of(KJ('netherite_chunk')).withChance(10),
		Item.of(KJ('debris_scrap')).withChance(90)
	], MC('netherite_scrap'), [
		event.recipes.create.deploying(transitional, [transitional, '#c:brushes'])
	]).transitionalItem(transitional)
		.loops(8)
		.id(KJ('ancient_debris_sifting'))

	event.recipes.create.crushing(KJ('netherite_dust'), KJ('netherite_chunk'))
	event.recipes.create.crushing([
			Item.of(KJ('gold_dust')).withChance(0.5),
			Item.of(MC('quartz')).withChance(0.4),
			Item.of(MC('bone_meal')).withChance(0.2),
			Item.of(CR('cinder_flour')).withChance(0.2),
			Item.of(MC('blaze_powder')).withChance(0.2),
			Item.of(KJ('coal_dust')).withChance(0.15),
			Item.of(CR('powdered_obsidian')).withChance(0.1),
			Item.of(MC('ghast_tear')).withChance(0.05),
			Item.of(KJ('netherite_dust')).withChance(0.025)
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
		MC('echo_shard'),
		KJ('starlight_dust'),
		MC('amethyst_shard', 64)
	]).superheated()

	event.recipes.create.mixing([
		Fluid.of(KJ('liquid_terra'), getMb(800))
	], [
		Fluid.of(KJ('liquid_starlight'), getMb(1000)),
		Fluid.of(KJ('liquid_mythril'), getMb(100)),
		KJ('netherite_dust')
	])

	event.remove({ output: MC('netherite_block') })
	event.replaceInput(
		{ input: MC('netherite_ingot') }, // Arg 1: the filter
		MC('netherite_ingot'),            // Arg 2: the item to replace
		KJ('terra_ingot')         // Arg 3: the item to replace it with
 	)

	event.replaceInput(
		{ input: MC('netherite_upgrade_smithing_template') }, // Arg 1: the filter
		MC('netherite_upgrade_smithing_template'),            // Arg 2: the item to replace
		KJ('terra_smithing_template')         // Arg 3: the item to replace it with
 	)
	event.remove({ output: MC('netherite_upgrade_smithing_template') })

	event.shaped(Item.of(KJ('terra_smithing_template'), 2), [
		'ESE',
		'ETE',
		'MMM'
	], {
		S: KJ('terra_smithing_template'),
		T: KJ('terra_ingot'),
		E: KJ('steel_sheet'),
		M: KJ('mythril_ingot')
	})

	let terra_list = ['helmet', 'chestplate', 'leggings', 'boots', 'sword', 'pickaxe', 'axe', 'shovel', 'hoe']
	terra_list.forEach(item => {
		let trans_armour = KJ('partially_forged_terra_' + item)
		event.recipes.create.sequenced_assembly([
			KJ('terra_' + item),
		], KJ('mythril_' + item), [
			event.recipes.create.deploying(trans_armour, [trans_armour, KJ('terra_smithing_template')]),
			event.recipes.create.filling(trans_armour, [trans_armour, Fluid.of(KJ('liquid_terra'), getMbFromIngots(tool_cost[item]))]),
			event.recipes.create.pressing(trans_armour, trans_armour)
		]).transitionalItem(trans_armour)
			.loops(1)
			.id('kubejs:terra_forging_' + item)
	})
}

function liquifyItems(event) {
	// Turn ingots, plates, loops, and tool parts back into their base material
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1)), [KJ('mythril_ingot')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1)), [KJ('mythril_sheet')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(1/9)), [KJ('mythril_loop')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(5/9)), [KJ('mythril_chain')]).heated()
	let p_types = ['cast_', '']
	p_types.forEach(p_type => {
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['sword'])), [KJ(p_type + 'mythril_sword_head')]).heated()
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['pickaxe'])), [KJ(p_type + 'mythril_pickaxe_head')]).heated()
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['axe'])), [KJ(p_type + 'mythril_axe_head')]).heated()
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['shovel'])), [KJ(p_type + 'mythril_shovel_head')]).heated()
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['hoe'])), [KJ(p_type + 'mythril_hoe_head')]).heated()
	})
	p_types = ['cast', 'forged', 'smoothed', 'polished']
	p_types.forEach(p_type => {
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['helmet'])), [KJ(p_type + '_mythril_head_plate')]).heated()
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['chestplate'])), [KJ(p_type + '_mythril_chest_plate')]).heated()
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['leggings'])), [KJ(p_type + '_mythril_leg_plate')]).heated()
		event.recipes.create.mixing(Fluid.of(KJ('liquid_mythril'), getMbFromIngots(tool_cost['boots'])), [KJ(p_type + '_mythril_boot_plate')]).heated()
	})
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1/9)), [KJ('steel_nugget')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1/9)), [KJ('steel_loop')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('heated_steel_compound')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('heated_steel_ingot')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('steel_sheet')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('steel_dust')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(9)), [KJ('steel_block')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_steel'), getMbFromIngots(1)), [KJ('steel_rod')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_copper'), getMbFromIngots(1)), [MC('raw_copper')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_copper'), getMbFromIngots(1)), [KJ('copper_dust')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_copper'), getMbFromIngots(1)), [KJ('heated_copper_ingot')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_copper'), getMbFromIngots(1)), [CR('copper_sheet')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_copper'), getMbFromIngots(9)), [MC('copper_block')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_copper'), getMbFromIngots(9)), [MC('raw_copper_block')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_zinc'), getMbFromIngots(1)), [KJ('zinc_dust')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_zinc'), getMbFromIngots(1)), [CR('zinc_ingot')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_zinc'), getMbFromIngots(1)), [KJ('zinc_sheet')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_zinc'), getMbFromIngots(9)), [CR('zinc_block')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_brass'), getMbFromIngots(1)), [CR('brass_ingot')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_brass'), getMbFromIngots(1)), [CR('brass_sheet')]).heated()
	event.recipes.create.mixing(Fluid.of(KJ('liquid_brass'), getMbFromIngots(9)), [CR('brass_block')]).heated()
}

function harderMisc(event) {
	event.remove({ output: 'ftbquests:book' })
	event.shapeless('ftbquests:book', [MC('book'), MC('paper')])

	event.replaceInput({ output: CR('brass_hand') }, CR('brass_sheet'), CR('golden_sheet'))

	event.remove({ output: CR('water_wheel') })
	event.shaped(CR('water_wheel'), [
		'SSS',
		'SGS',
		'SSS'
		], {
		S: '#minecraft:wooden_slabs',
		G: CR('gearbox')
	})

	event.remove({ input: 'naturalist:cattail_fluff' })
	event.shapeless(MC('string'), '6x naturalist:cattail_fluff')

	event.remove(CR('clipboard'))

	event.replaceInput(
   		{ output: CR('crushing_wheel') }, // Arg 1: the filter
   		'#c:stone',            // Arg 2: the item to replace
   		KJ('andesite_machine')         // Arg 3: the item to replace it with
    )

	event.replaceInput(
		{ output: CR('cart_assembler') },
		MC('redstone'),
		KJ('andesite_machine')
	)

	event.remove({ output: CR('empty_blaze_burner') })
	event.shaped(CR('empty_blaze_burner'), [
		' S ',
		'SBS',
		' S '
		], {
		S: KJ('steel_sheet'),
		B: CR('basin')
	})

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

	event.remove({ output: CR('windmill_bearing') })
	event.shaped(CR('windmill_bearing'), [
		'SCS',
		'SAS',
		'HPH'
		], {
		S: '#c:stone',
		C: CR('cogwheel'),
		A: KJ('andesite_machine'),
		P: CR('propeller'),
		H: KJ('hard_bricks')
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
	event.replaceInput({ output: 'farmersdelight:diamond_knife'}, MC('diamond'), KJ('mythril_ingot') )

	// Change Extended Cogwheels Recipes to be a bit simpler
	event.remove({ output: 'extendedgears:half_shaft_cogwheel' })
	event.stonecutting('extendedgears:half_shaft_cogwheel', CR('cogwheel'))
	event.remove({ output: 'extendedgears:shaftless_cogwheel' })
	event.stonecutting('extendedgears:shaftless_cogwheel', CR('cogwheel'))
	event.remove({ output: 'extendedgears:large_half_shaft_cogwheel' })
	event.stonecutting('extendedgears:large_half_shaft_cogwheel', CR('large_cogwheel'))
	event.remove({ output: 'extendedgears:large_shaftless_cogwheel' })
	event.stonecutting('extendedgears:large_shaftless_cogwheel', CR('large_cogwheel'))

	event.remove({ output: MC('leather_helmet') })
	event.shaped(MC('leather_helmet'), [
		'LSL',
		'L L',
		'   '
	], {
		L: MC('leather'),
		S: KJ('spool_silk')
	})

	event.remove({ output: MC('leather_chestplate') })
	event.shaped(MC('leather_chestplate'), [
		'L L',
		'SLS',
		'LLL'
	], {
		L: MC('leather'),
		S: KJ('spool_silk')
	})

	event.remove({ output: MC('leather_leggings') })
	event.shaped(MC('leather_leggings'), [
		'SLS',
		'L L',
		'L L'
	], {
		L: MC('leather'),
		S: KJ('spool_silk')
	})

	event.remove({ output: MC('leather_boots') })
	event.shaped(MC('leather_boots'), [
		'   ',
		'L L',
		'LSL'
	], {
		L: MC('leather'),
		S: KJ('spool_silk')
	})

	event.remove({ output: MC('gravel'), type: 'create:crushing' })
	event.recipes.create.mixing(Item.of(MC('clay_ball')).withChance(0.5), [Fluid.water(), MC('sand'), MC('gravel')]).heated()
	event.shapeless(KJ('clay_blend', 3), [MC('clay_ball'), MC('kelp'), MC('gravel'), MC('sand')])
	event.smelting(KJ('hard_brick'), KJ('clay_blend'))
	event.shaped(KJ('hard_bricks'), [
		'BB ',
		'BB ',
		'   '
	], {
		B: KJ('hard_brick')
	})
	event.remove({ output: MC('gravel'), input: MC('cobblestone'), type: 'create:milling' })
	event.recipes.create.crushing(MC('gravel'), MC('cobblestone'))
	event.recipes.create.compacting(MC('dirt'), [MC('sand'), MC('clay_ball'), MC('gravel'), Fluid.water(getMb(200))])

	event.remove({ output: 'usefulbackpacks:backpack_small' })
	event.remove({ output: 'usefulbackpacks:backpack_medium' })
	event.remove({ output: 'usefulbackpacks:backpack_large' })
	event.remove({ output: 'usefulbackpacks:backpack_enderchest' })

	event.shaped('usefulbackpacks:backpack_small', [
		'LLL',
		'LSL',
		'LLL'
	], {
		L: MC('leather'),
		S: KJ('spool_silk')
	})

	event.shaped('usefulbackpacks:backpack_medium', [
		'LWL',
		'WCW',
		'LWL'
	], {
		L: MC('leather'),
		W: KJ('woven_silk'),
		C: MC('chest')
	})

	event.shaped('usefulbackpacks:backpack_large', [
		'LWL',
		'MCM',
		'LSL'
	], {
		L: MC('leather'),
		S: KJ('mythril_sheet'),
		W: KJ('woven_silk'),
		C: CR('item_vault'),
		M: KJ('mythril_chain')
	})

	event.shaped('usefulbackpacks:backpack_enderchest', [
		'LTL',
		'TET',
		'LTL'
	], {
		L: MC('leather'),
		E: MC('ender_eye'),
		T: KJ('terra_sheet')
	})

	event.remove({ output: MC('ender_chest') })
	event.shaped(MC('ender_chest'), [
		'OTO',
		'TET',
		'OTO'
	], {
		O: MC('obsidian'),
		T: KJ('terra_sheet'),
		E: MC('ender_eye')
	})

	event.remove({ output: MC('beacon') })
	event.shaped(MC('beacon'), [
		'GGG',
		'GPG',
		'TBT'
	], {
		G: MC('glass'),
		B: KJ('terra_block'),
		T: KJ('terra_sheet'),
		P: KJ('photo_crystal')
	})

	event.remove({ output: 'majruszsaccessories:miner_rune' })
	event.shapeless('majruszsaccessories:miner_rune', ['majruszsaccessories:lucky_rock', 'majruszsaccessories:miner_guide', 'majruszsaccessories:tool_scraps'])

	event.remove({ output: 'majruszsaccessories:adventurer_rune' })
	event.shapeless('majruszsaccessories:adventurer_rune', ['majruszsaccessories:adventurer_kit', 'majruszsaccessories:ancient_scarab', 'majruszsaccessories:swimmer_guide'])

	event.remove({ output: 'majruszsaccessories:angler_rune' })
	event.shapeless('majruszsaccessories:angler_rune', ['majruszsaccessories:angler_trophy', 'majruszsaccessories:metal_lure', 'majruszsaccessories:unbreakable_fishing_line'])

	event.remove({ output: 'majruszsaccessories:household_rune' })
	event.shapeless('majruszsaccessories:household_rune', ['majruszsaccessories:discount_voucher', 'majruszsaccessories:dream_catcher', 'majruszsaccessories:secret_ingredient'])

	event.remove({ output: 'majruszsaccessories:nature_rune' })
	event.shapeless('majruszsaccessories:nature_rune', ['majruszsaccessories:certificate_of_taming', 'majruszsaccessories:idol_of_fertility', 'majruszsaccessories:tamed_potato_beetle'])
}

function andesiteMachine(event) {
	event.recipes.create.deploying(CR('cogwheel'), [MC('stone'), MC('oak_button')])

	let transitional = KJ('incomplete_kinetic_mechanism')
	event.recipes.create.sequenced_assembly([
		KJ('kinetic_mechanism'),
	], MC('oak_pressure_plate'), [
		event.recipes.create.deploying(transitional, [transitional, CR('cogwheel')]),
		event.recipes.create.deploying(transitional, [transitional, KJ('steel_ingot')]),
		event.recipes.create.deploying(transitional, [transitional, '#c:axes'])
	]).transitionalItem(transitional)
		.loops(1)
		.id('kubejs:kinetic_mechanism')

	event.shapeless(KJ('kinetic_mechanism'), [
		'#c:axes',
		CR('cogwheel'),
		KJ('steel_ingot'),
		'#minecraft:wooden_pressure_plates'
	]).id('kubejs:kinetic_mechanism_crafting_manual_only').damageIngredient('#c:axes')

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
		'SWS',
		'WCW',
		'SWS'
	], {
		C: CR('andesite_casing'),
		S: KJ('kinetic_mechanism'),
		W: CR('cogwheel')
	})

	let create_machine = (machine, part) => {
		event.remove({ output: machine })
		event.shaped(machine, [
			'WCW',
			'WAW',
			'HFH'
		], {
			W: '#minecraft:planks',
			C: CR('cogwheel'),
			F: part,
			A: KJ('andesite_machine'),
			H: KJ('hard_bricks')
		})
	}

	create_machine(CR('mechanical_mixer'), CR('whisk'))
	create_machine(CR('mechanical_drill'), KJ('steel_pickaxe'))
	create_machine(CR('mechanical_saw'), CR('turntable'))
	create_machine(CR('gantry_carriage'), CR('cogwheel'))
	create_machine(CR('rope_pulley'), KJ('spool_silk'))
	create_machine(CR('mechanical_bearing'), MC('slime_block'))
	create_machine(CR('mechanical_harvester'), KJ('steel_hoe'))
	create_machine(CR('deployer'), CR('brass_hand'))
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
	andesite_machine(CR('portable_storage_interface'), 2)

	event.replaceInput({ output: CR('steam_engine') }, CR('andesite_alloy'), KJ('andesite_machine'))
	event.replaceInput({ output: CR('steam_engine') }, CR('golden_sheet'), CR('brass_sheet'))
	event.replaceInput({ output: CR('steam_engine') }, MC('copper_block'), CR('fluid_tank'))

	event.replaceInput({ output: CR('mechanical_piston')}, CR('andesite_casing'), KJ('andesite_machine'))
	event.replaceInput({ output: CR('controls')}, CR('precision_mechanism'), KJ('calculation_mechanism'))
	event.replaceInput({ output: CR('controls')}, MC('lever'), CR('analog_lever'))
}

function brassMachine(event) {
	// electron tube recipes
	event.recipes.create.pressing(KJ('zinc_sheet'), CR('zinc_ingot'))

	event.remove({ output: CR('brass_ingot'), type: 'create:mixing' })
	event.recipes.create.mixing(Fluid.of(KJ('liquid_brass'), getMbFromIngots(2)), [Fluid.of(KJ('liquid_copper'), getMbFromIngots(1)), Fluid.of(KJ('liquid_zinc'), getMbFromIngots(1))])

	event.remove({ output: CR('rose_quartz') })
	event.shapeless(CR('rose_quartz'), [MC('quartz_block'), MC('redstone'), MC('redstone'), MC('redstone'), MC('glowstone_dust')])

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
	event.recipes.create.deploying(Item.of(KJ('photo_crystal')).withChance(0.25), [KJ('washed_diamond'), '#c:brushes'])

	// calculation mechanism recipe
	let trans_mechanism = KJ('incomplete_calculation_mechanism')
	event.recipes.create.sequenced_assembly([
		KJ('calculation_mechanism'),
	], KJ('steel_sheet'), [
		event.recipes.create.deploying(trans_mechanism, [trans_mechanism, CR('electron_tube')]),
		event.recipes.create.deploying(trans_mechanism, [trans_mechanism, CR('electron_tube')]),
		event.recipes.create.deploying(trans_mechanism, [trans_mechanism, CR('cogwheel')]),
		event.recipes.create.deploying(trans_mechanism, [trans_mechanism, KJ('photo_crystal')])
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
		'WBS',
		'KCK'	
	], {
		C: KJ('calculation_mechanism'),
		K: KJ('kinetic_mechanism'),
		S: CR('cogwheel'),
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
	brass_machine(CR('elevator_pulley'), 1)
	brass_machine(CR('clockwork_bearing'), 2)
	brass_machine(CR('stockpile_switch'), 2)
	brass_machine(CR('content_observer'), 2)
	brass_machine(CR('rotation_speed_controller'), 2)
	brass_machine(CR('smart_chute'), 2)
	brass_machine(CR('smart_fluid_pipe'), 2)
	brass_machine(CR('mechanical_crafter'), 4)
	brass_machine(CR('railway_casing'), 1)

	event.remove({ output: 'create_jetpack:jetpack' })
	event.recipes.create.mechanical_crafting('create_jetpack:jetpack', [
		' BLB ',
		'BDTDB',
		'BXTMB',
		'BFTFB',
		'B B B'
	], {
		B: CR('brass_sheet'),
		L: KJ('mythril_loop'),
		D: KJ('calculation_mechanism'),
		T: CR('copper_backtank'),
		X: CR('fluid_tank'),
		F: CR('chute'),
		M: KJ('brass_machine')
	})
}

function harderFood(event) {
	event.remove({ output: CR('sweet_roll'), input: MC('bread') })
	event.remove({ output: MC('bread'), input: MC('wheat') })
	event.remove({ output: MC('bread'), input: FD('wheat_dough') })
	event.remove({ output: FD('wheat_dough') })
	event.remove({ output: MC('cookie'), input: MC('wheat') })
	event.remove({ output: MC('cake'), input: MC('milk_bucket') })
	event.remove({ output: FD('sweet_berry_cookie'), input: MC('wheat') })
	event.remove({ output: FD('honey_cookie'), input: MC('wheat') })
	event.remove({ output: FD('apple_pie'), input: MC('wheat') })
	event.remove({ output: FD('sweet_berry_cheesecake'), input: FD('pie_crust') })
	event.remove({ output: FD('chocolate_pie'), input: FD('pie_crust') })
	event.remove({ output: FD('pie_crust'), type: 'minecraft:crafting_shaped' })
	event.replaceInput({ input: FD('wheat_dough') }, FD('wheat_dough'), CR('dough'))
	event.replaceInput({ output: MC('cake') }, MC('wheat'), CR('wheat_flour'))
	event.replaceInput({ mod: 'farmersdelight' }, MC('wheat'), CR('wheat_flour'))
	event.replaceInput({ mod: 'createfood' }, MC('wheat'), CR('wheat_flour'))

	event.remove({ input: MC('water_bucket'), output: CF('raw_white_chips_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_white_chips_chocolate_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_toffee_chips_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_toffee_chips_chocolate_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_honey_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_sweet_berry_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_dark_chips_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_dark_chips_chocolate_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_chocolate_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_caramel_chips_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_caramel_chips_chocolate_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_butterscotch_chips_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('raw_butterscotch_chips_chocolate_cookie') })
	event.remove({ input: MC('water_bucket'), output: CF('breakfast_bar') })

	event.remove({ output: FED('sweet_roll') })
	event.remove({ output: FED('berry_sweet_roll') })
	event.remove({ output: FED('glow_berry_sweet_roll') })

	event.remove({ output: CR('dough') })
	event.shapeless(CR('dough'), [MC('water_bucket'), CR('wheat_flour')]).id('cr_dough_manual_only')
	event.recipes.create.mixing(CR('dough'), [Fluid.water(getMb(200)), CR('wheat_flour')])
	event.recipes.create.splashing(CR('dough'), CR('wheat_flour'))

	event.remove({ output: CF('sugar_dough') })
	event.shapeless(CF('sugar_dough', 3), [MC('water_bucket'), CR('wheat_flour'), MC('sugar')]).id('cf_sugar_dough_manual_only')
	event.shapeless(CF('sugar_dough', 3), ['#c:eggs', CR('wheat_flour'), MC('sugar')]).id('cf_sugar_dough_egg_manual_only')
	event.recipes.create.mixing(CF('sugar_dough', 3), [Fluid.water(getMb(200)), CR('wheat_flour'), MC('sugar')])

	event.remove({ output: CF('salt_dough') })
	event.shapeless(CF('salt_dough', 6), [MC('water_bucket'), CR('wheat_flour'), '#c:salt']).id('cf_salt_dough_manual_only')
	event.shapeless(CF('salt_dough', 6), ['#c:eggs', CR('wheat_flour'), '#c:salt']).id('cf_salt_dough_egg_manual_only')
	event.recipes.create.mixing(CF('salt_dough', 6), [Fluid.water(getMb(200)), CR('wheat_flour'), '#c:salt'])

	event.remove({ output: CF('pumpernickel_dough') })
	event.shapeless(CF('pumpernickel_dough', 3), [MC('water_bucket'), CR('wheat_flour'), CF('cocoa_powder'), CF('molasses_bottle')]).id('cf_pumpernickel_dough_manual_only')
	event.shapeless(CF('pumpernickel_dough', 3), ['#c:eggs', CR('wheat_flour'), CF('cocoa_powder'), CF('molasses_bottle')]).id('cf_pumpernickel_dough_egg_manual_only')
	event.recipes.create.mixing(CF('pumpernickel_dough', 3), [Fluid.water(getMb(200)), CR('wheat_flour'), CF('cocoa_powder'), CF('molasses_bottle')])

	event.remove({ output: CF('chocolate_sugar_dough') })
	event.shapeless(CF('chocolate_sugar_dough', 3), [MC('water_bucket'), CR('wheat_flour'), CF('cocoa_powder'), MC('sugar')]).id('cf_chocolate_sugar_dough_manual_only')
	event.shapeless(CF('chocolate_sugar_dough', 3), ['#c:eggs', CR('wheat_flour'), CF('cocoa_powder'), MC('sugar')]).id('cf_chocolate_sugar_dough_egg_manual_only')
	event.recipes.create.mixing(CF('chocolate_sugar_dough', 3), [Fluid.water(getMb(200)), CR('wheat_flour'), CF('cocoa_powder'), MC('sugar')])

	event.remove({ output: CF('butter_dough') })
	event.shapeless(CF('butter_dough', 3), [MC('water_bucket'), CR('wheat_flour'), CF('butter')]).id('cf_butter_dough_manual_only')
	event.shapeless(CF('butter_dough', 3), ['#c:eggs', CR('wheat_flour'), CF('cocoa_powder'), CF('butter')]).id('cf_butter_dough_egg_manual_only')
	event.recipes.create.mixing(CF('butter_dough', 3), [Fluid.water(getMb(200)), CR('wheat_flour'), MC('butter')])

	event.remove({ output: CF('raw_sweet_roll_base') })
	event.shapeless(CF('raw_sweet_roll_base'), [CF('sugar_dough'), MC('sugar'), FED('ground_cinnamon')])
	event.remove({ output: CR('sweet_roll') })
	event.recipes.create.filling(CR('sweet_roll'), [Fluid.of(CF('cream_frosting'), getMb(333)), CF('sweet_roll_base')])

	event.replaceInput({ output: FD('roast_chicken_block') }, MC('bread'), CF('bread_slice'))
	event.remove({ input: MC('bread'), mod: 'farmersdelight' })
	event.remove({ input: MC('bread'), mod: 'expandeddelight' })

	event.remove({ output: MC('pumpkin_pie') })
	event.recipes.create.mixing(MC('pumpkin_pie'), [FD('pie_crust'), MC('sugar'), MC('sugar'), CF('butter'), FD('pumpkin_slice'), FD('pumpkin_slice'), FD('pumpkin_slice'), FD('pumpkin_slice')])

	event.remove({ output: CF('caramel_glazed_apple'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('chocolate_glazed_apple'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('white_chocolate_glazed_apple'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('dark_chocolate_glazed_apple'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('honeyed_berries'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('caramel_glazed_berries'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('chocolate_glazed_berries'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('white_chocolate_glazed_berries'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: CF('dark_chocolate_glazed_berries'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: MC('mushroom_stew'), type: 'minecraft:crafting_shapeless' })
	event.remove({ output: MC('rabbit_stew'), type: 'minecraft:crafting_shapeless' })

	event.remove({ output: FED('butter') })
	event.recipes.create.mixing(Item.of(FED('salt_rock')).withChance(0.1), [MC('stone'), Fluid.water(getMbFromIngots(9))]).heated()
	event.recipes.create.mixing(FED('butter'), [FED('ground_salt'), Fluid.of('milk:still_milk', getMbFromIngots(2))])

	// console.log('blamblam')
	// event.forEachRecipe([{output: /.*hamburger.*/}], recipe => {
	// 	let r_id = recipe.getId().toString()
	// 	let r_ings = recipe.originalRecipeIngredients
	// 	console.log(r_id)
	// 	console.log(recipe.json)
	// 	console.log(recipe.json.result)
	// 	console.log(recipe.json.result.contains({'tag': ''}))
	// 	console.log(recipe.json.result.contains(MC('steak')))
		
	// 	if (r_id.includes("burger")) {
	// 		event.replaceInput({ id: r_id }, '#c:cooked_beef', CF('beef_patty'))
	// 		// event.replaceInput({ id: r_id }, MC('bread'), CF('beef_patty'))
	// 	}
	// })
}

function harderAdditions(event) {
	event.remove({ output: CA('cake_base_baked') })
	event.remove({ output: CA('cake_base') })
	event.remove({ output: CA('chocolate_cake') })
	event.remove({ output: CA('honey_cake') })
	event.remove({ output: CA('accumulator') })
	event.remove({ output: CA('barbed_wire') })
	event.remove({ output: CA('digital_adapter') })
	event.remove({ output: CA('electrum_amulet') })
	event.remove({ output: CA('electrum_ingot') })
	event.remove({ output: CA('electrum_wire') })
	event.remove({ output: CA('electrum_sheet') })
	event.remove({ output: CA('electrum_nugget') })
	event.remove({ output: CA('electrum_spool') })
	event.remove({ output: CA('electrum_rod') })
	event.remove({ output: CA('iron_rod') })

	// tuff creation + andesite, granite, diorite, etc..
	event.remove({ output: MC('diorite') })
	event.remove({ output: MC('andesite'), type: 'create:compacting' })
	event.shapeless(MC('diorite'), [MC('cobblestone'), MC('white_dye')])
	event.remove({ output: MC('red_sand'), type: 'create:crushing' })
	event.remove({ output: MC('red_sand'), type: 'create:milling' })
	event.recipes.create.crushing([Item.of(MC('red_sand')).withChance(0.25), Item.of(MC('cobblestone')).withChance(0.25)], MC('granite'))
	event.recipes.create.crushing(Item.of(MC('red_sand')), MC('terracotta'))
	event.remove({ output: MC('granite') })
	event.recipes.create.mixing(MC('granite', 2), [MC('cobblestone'), MC('red_sand'), Fluid.lava(getMbFromIngots(1))])
	event.shapeless(MC('gravel'), [MC('flint'), MC('flint'), MC('flint'), MC('flint'), MC('flint'), MC('flint'), MC('flint'), MC('flint'), MC('flint')])

	event.recipes.create.mixing(MC('tuff', 4), [MC('diorite', 2), MC('andesite', 2), MC('granite', 2), MC('amethyst_shard')])
	event.remove({ output: CR('cut_tuff_slab'), type: 'stonecutting' })
	event.recipes.create.cutting(CR('cut_tuff_slab'), MC('tuff'))
	event.remove({ output: CR('cut_tuff'), input: CR('cut_tuff_slab') })
	event.recipes.create.compacting([CR('cut_tuff')], [CR('cut_tuff_slab', 4)])
	event.recipes.create.crushing([
		Item.of(MC('amethyst_shard')).withChance(0.1),
		Item.of(MC('gravel')).withChance(0.1),
		Item.of(MC('cobblestone')).withChance(0.1),
		Item.of(MC('flint')).withChance(0.1), 
		Item.of(MC('gold_nugget')).withChance(0.05),
		Item.of(CR('copper_nugget')).withChance(0.075),
		Item.of(CR('zinc_nugget')).withChance(0.075),
		Item.of(MC('iron_nugget')).withChance(0.1)
	], CR('cut_tuff'))

	event.replaceInput({ input: CA('zinc_sheet') }, CA('zinc_sheet'), KJ('zinc_sheet'))
	event.replaceInput({ output: CA('rolling_mill') }, CR('andesite_casing'), KJ('andesite_machine'))
	event.replaceInput({ output: CA('rolling_mill') }, CR('iron_sheet'), KJ('steel_sheet'))
	event.replaceInput({ output: CA('tesla_coil') }, CR('brass_casing'), KJ('brass_machine'))
	event.replaceInput({ output: CA('electric_motor') }, CA('iron_rod'), KJ('brass_machine'))
	event.replaceInput({ output: CA('alternator') }, CA('iron_rod'), KJ('brass_machine'))
	event.replaceInput({ output: CA('accumulator') }, CR('brass_casing'), KJ('brass_machine'))
	event.replaceInput({ output: CA('portable_energy_interface') }, CR('brass_casing'), KJ('brass_machine'))
	event.replaceInput({ output: CA('portable_energy_interface') }, CR('chute'), CR('portable_storage_interface'))
	event.replaceInput({ output: CA('capacitor') }, MC('redstone_torch'), KJ('calculation_mechanism'))
}

function harderToms(event) {
	event.remove({ output: TS('ts.wireless_terminal') })
	event.remove({ output: TS('ts.adv_wireless_terminal') })

	event.replaceInput({ output: TS('ts.inventory_connector') }, MC('diamond'), KJ('photo_crystal'))
	event.replaceInput({ output: TS('ts.inventory_connector') }, MC('comparator'), CR('portable_storage_interface'))

	event.replaceInput({ output: TS('ts.inventory_cable_connector') }, MC('chest'), TS('ts.inventory_connector'))

	event.replaceInput({ output: TS('ts.storage_terminal') }, MC('glowstone'), KJ('brass_machine'))
	event.replaceInput({ output: TS('ts.storage_terminal') }, MC('glass'), KJ('photo_crystal'))
	event.replaceInput({ output: TS('ts.storage_terminal') }, MC('comparator'), CR('portable_storage_interface'))

	event.replaceInput({ output: TS('ts.crafting_terminal') }, MC('crafting_table'), KJ('brass_machine'))
	event.replaceInput({ output: TS('ts.crafting_terminal') }, MC('diamond'), KJ('photo_crystal'))

	event.remove({ output: TS('ts.inventory_cable')})
	event.shaped(TS('ts.inventory_cable'), [
		'SSS',
		'RCR',
		'SSS'
	], {
		S: CR('brass_sheet'),
		R: MC('redstone'),
		C: KJ('calculation_mechanism')
	})
}

function harderAircrafts(event) {
	event.replaceInput({ output: IA('sail') }, MC('string'), KJ('spool_silk'))
	event.replaceInput({ output: IA('propeller') }, MC('iron_ingot'), KJ('steel_sheet'))
	event.replaceInput({ output: IA('hull') }, MC('iron_ingot'), KJ('steel_sheet'))
	event.replaceInput({ output: IA('engine') }, MC('cobblestone'), KJ('kinetic_mechanism'))
}

function harderRails(event) {
	let rail_list = ['acacia', 'birch', 'crimson', 'dark_oak', 'jungle', 'oak', 'spruce', 'warped', 'blackstone', 'ender', 'phantom', 'mangrove', 'cherry', 'bamboo', 'stripped_bamboo', 'tieless']
	rail_list.forEach(material => {
		let track = 'railways:track_' + material + '_narrow'
		event.remove({ output: track, type: 'create:sequenced_assembly' })
		event.recipes.create.cutting(track, 'railways:track_' + material)
	})
	event.remove({ output: 'railways:track_create_andesite_narrow', type: 'create:sequenced_assembly' })
	event.recipes.create.cutting('railways:track_create_andesite_narrow', 'create:track')

	rail_list.forEach(material => {
		let track = 'railways:track_' + material + '_wide'
		event.remove({ output: track, type: 'create:sequenced_assembly' })
		event.recipes.create.pressing(track, 'railways:track_' + material)
	})
	event.remove({ output: 'railways:track_create_andesite_wide', type: 'create:sequenced_assembly' })
	event.recipes.create.pressing('railways:track_create_andesite_wide', 'create:track')

	event.replaceInput({ output: CR('schedule') }, CR('sturdy_sheet'), KJ('calculation_mechanism'))
}

function harderEnchanting(event) {
	event.remove({ output: CEI('disenchanter') })
	event.shaped(CEI('disenchanter'), [
		'CEC',
		'CDC',
		'CAC'
	], {
		C: MC('copper_ingot'),
		E: MC('enchanting_table'),
		D: CR('item_drain'),
		A: KJ('andesite_machine')
	})

	event.replaceInput({ output: CEI('printer') }, CR('copper_casing'), CR('spout'))
	event.replaceInput({ output: CEI('printer') }, MC('dried_kelp'), MC('enchanting_table'))
	event.replaceInput({ output: CEI('printer') }, CR('iron_sheet'), CR('mechanical_press'))

	event.recipes.create.filling(KJ('magic_book'), [Fluid.of(CEI('hyper_experience')), MC('book')])

	event.replaceInput({ output: CEI('enchanting_guide') }, MC('book'), KJ('magic_book'))
}
