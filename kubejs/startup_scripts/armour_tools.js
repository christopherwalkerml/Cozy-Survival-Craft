ItemEvents.toolTierRegistry(event => {
	event.add('steel', tier => {
		tier.uses = 512
		tier.speed = 6.0
		tier.attackDamageBonus = 2.0
		tier.level = 2
		tier.speed = 6
		tier.repairIngredient = 'kubejs:steel_ingot'
		tier.enchantmentValue = 12
	})

	event.add('mythril', tier => {
		tier.uses = 4096
		tier.speed = 6.0
		tier.attackDamageBonus = 3.0
		tier.level = 3
		tier.speed = 8
		tier.enchantmentValue = 16
	})
})

ItemEvents.armorTierRegistry(event => {
	event.add('steel', tier => {
		tier.durabilityMultiplier = 64 // Each slot will be multiplied with [13, 15, 16, 11]
		tier.slotProtections = [2, 5, 6, 2] // Slot indicies are [FEET, LEGS, BODY, HEAD]
		tier.enchantmentValue = 20
		tier.equipSound = 'minecraft:item.armor.equip_iron'
		tier.toughness = 2.0 // diamond has 2.0, netherite 3.0
		tier.repairIngredient = 'kubejs:steel_ingot'
		tier.knockbackResistance = 0.0
	})

	event.add('mythril', tier => {
		tier.durabilityMultiplier = 128 // Each slot will be multiplied with [13, 15, 16, 11]
		tier.slotProtections = [3, 6, 8, 3] // Slot indicies are [FEET, LEGS, BODY, HEAD]
		tier.enchantmentValue = 20
		tier.equipSound = 'minecraft:item.armor.equip_diamond'
		tier.toughness = 2.0 // diamond has 2.0, netherite 3.0
		tier.knockbackResistance = 0.0
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
