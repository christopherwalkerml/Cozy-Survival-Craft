ItemEvents.toolTierRegistry(event => {
	event.add('steel', tier => {
		tier.uses = 512
		tier.attackDamageBonus = 2.0
		tier.level = 2
		tier.speed = 6
		tier.repairIngredient = '#kubejs:ingot/steel'
		tier.enchantmentValue = 12
	})

	event.add('mythril', tier => {
		tier.uses = 4096
		tier.attackDamageBonus = 3.0
		tier.level = 3
		tier.speed = 8
		tier.repairIngredient = '#kubejs:ingot/mythril'
		tier.enchantmentValue = 16
	})

	event.add('terra', tier => {
		tier.uses = 8192
		tier.attackDamageBonus = 4.0
		tier.level = 4
		tier.speed = 10
		tier.repairIngredient = '#kubejs:ingot/terra'
		tier.enchantmentValue = 20
	})
})

ItemEvents.armorTierRegistry(event => {
	event.add('steel', tier => {
		tier.durabilityMultiplier = 64 // Each slot will be multiplied with [13, 15, 16, 11]
		tier.slotProtections = [2, 5, 6, 2] // Slot indicies are [FEET, LEGS, BODY, HEAD]
		tier.enchantmentValue = 12
		tier.equipSound = 'minecraft:item.armor.equip_iron'
		tier.toughness = 1 // diamond has 2.0, netherite 3.0
		tier.repairIngredient = '#kubejs:sheet/steel'
		tier.knockbackResistance = 0
	})

	event.add('mythril', tier => {
		tier.durabilityMultiplier = 128 // Each slot will be multiplied with [13, 15, 16, 11]
		tier.slotProtections = [3, 6, 8, 3] // Slot indicies are [FEET, LEGS, BODY, HEAD]
		tier.enchantmentValue = 16
		tier.equipSound = 'minecraft:item.armor.equip_diamond'
		tier.repairIngredient = '#kubejs:sheet/mythril'
		tier.toughness = 3.0 // diamond has 2.0, netherite 3.0
		tier.knockbackResistance = 0.1
	})

	event.add('terra', tier => {
		tier.durabilityMultiplier = 256 // Each slot will be multiplied with [13, 15, 16, 11]
		tier.slotProtections = [4, 8, 10, 6] // Slot indicies are [FEET, LEGS, BODY, HEAD]
		tier.enchantmentValue = 20
		tier.equipSound = 'minecraft:block.amethyst_block.resonate'
		tier.repairIngredient = '#kubejs:sheet/terra'
		tier.toughness = 4.0 // diamond has 2.0, netherite 3.0
		tier.knockbackResistance = 0.2
	})
})

ItemEvents.modification(event => {
	let nullify_armour = (item, i_tier) => {
	  	event.modify(item, i => {
	    	i.armorProtection = 0
	    })
	}

	let nullify_tool = (item, i_tier) => {
		event.modify(item, i => {
		  	i.digSpeed = 1
	  	})
  	}

	let nullify_weapon = (item, i_tier) => {
		event.modify(item, i => {
		  	i.attackDamage = 1
	  	})
  	}

	// if somehow the player gets these... make them useless

	nullify_armour(MC('diamond_chestplate'))
	nullify_armour(MC('diamond_helmet'))
	nullify_armour(MC('diamond_leggings'))
	nullify_armour(MC('diamond_boots'))
	nullify_armour(MC('iron_chestplate'))
	nullify_armour(MC('iron_helmet'))
	nullify_armour(MC('iron_leggings'))
	nullify_armour(MC('iron_boots'))

	nullify_tool(MC('diamond_pickaxe'))
	nullify_tool(MC('diamond_axe'))
	nullify_tool(MC('diamond_shovel'))
	nullify_tool(MC('iron_pickaxe'))
	nullify_tool(MC('iron_axe'))
	nullify_tool(MC('iron_shovel'))

	nullify_weapon(MC('diamond_sword'))
	nullify_weapon(MC('iron_sword'))

	event.modify('create:sand_paper', i => {
		i.maxDamage = 64
	})
	event.modify('create:red_sand_paper', i => {
		i.maxDamage = 64
	})
})
