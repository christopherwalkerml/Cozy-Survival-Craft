REIEvents.hide('item', event => {
	event.hide('kubejs:incomplete_steel_ingot')
	event.hide('kubejs:incomplete_steel_sheet')
	event.hide('kubejs:incomplete_woven_silk')
	event.hide('kubejs:incomplete_copper_sheet')
	event.hide('kubejs:partially_crushed_diamond')
	event.hide('minecraft:wooden_hoe')
	event.hide('minecraft:stone_hoe')
	event.hide('minecraft:diamond_hoe')
	event.hide('minecraft:netherite_ingot')
	event.hide('minecraft:netherite_block')
	event.hide('minecraft:netherite_hoe')
	event.hide('minecraft:netherite_axe')
	event.hide('minecraft:netherite_shovel')
	event.hide('minecraft:netherite_pickaxe')
	event.hide('minecraft:netherite_sword')
	event.hide('minecraft:netherite_chestplate')
	event.hide('minecraft:netherite_leggings')
	event.hide('minecraft:netherite_helmet')
	event.hide('minecraft:netherite_boots')
	event.hide('minecraft:diamond_axe')
	event.hide('minecraft:diamond_shovel')
	event.hide('minecraft:diamond_pickaxe')
	event.hide('minecraft:diamond_sword')
	event.hide('minecraft:diamond_chestplate')
	event.hide('minecraft:diamond_leggings')
	event.hide('minecraft:diamond_helmet')
	event.hide('minecraft:diamond_boots')
	event.hide('minecraft:iron_chestplate')
	event.hide('minecraft:iron_leggings')
	event.hide('minecraft:iron_helmet')
	event.hide('minecraft:iron_boots')
	event.hide('minecraft:iron_pickaxe')
	event.hide('minecraft:iron_axe')
	event.hide('minecraft:iron_shovel')
	event.hide('minecraft:iron_sword')
	event.hide('minecraft:iron_hoe')

	let plate_progress = ['partially_forged', 'partially_smoothed', 'partially_polished']
	let armour_type = ['mythril_head_plate', 'mythril_chest_plate', 'mythril_leg_plate', 'mythril_boot_plate']
	plate_progress.forEach(progress => {
		armour_type.forEach(armour => {
			event.hide('kubejs:' + progress + '_' + armour)
		})
	})

	event.hide('kubejs:partially_forged_mythril_sword_head')
	event.hide('kubejs:partially_forged_mythril_pickaxe_head')
	event.hide('kubejs:partially_forged_mythril_axe_head')
	event.hide('kubejs:partially_forged_mythril_shovel_head')
	event.hide('kubejs:partially_forged_mythril_hoe_head')
	
	event.hide('create_questing:blueprint')
	event.hide('dragonlib:dragon')

	event.hide('farmersdelight:wheat_dough')
	event.hide('expandeddelight:wheat_dough')

	event.hide('kubejs:partially_woven_cloth_helmet')
	event.hide('kubejs:partially_woven_cloth_chestplate')
	event.hide('kubejs:partially_woven_cloth_leggings')
	event.hide('kubejs:partially_woven_cloth_boots')
})
