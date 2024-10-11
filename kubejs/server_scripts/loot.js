LootJS.modifiers((event) => {
	event.addLootTypeModifier(LootType.CHEST, LootType.FISHING, LootType.GIFT, LootType.UNKNOWN)
		.replaceLoot(ItemFilter.CHEST_ARMOR, 'leather_chestplate')
		.replaceLoot(ItemFilter.LEGS_ARMOR, 'leather_leggings')
		.replaceLoot(ItemFilter.HEAD_ARMOR, 'leather_helmet')
		.replaceLoot(ItemFilter.FEET_ARMOR, 'leather_boots')
		.replaceLoot(ItemFilter.SWORD, 'stone_sword')
		.replaceLoot(ItemFilter.SHOVEL, 'stone_shovel')
		.replaceLoot(ItemFilter.AXE, 'stone_axe')
		.removeLoot(ItemFilter.HOE)
		.replaceLoot(ItemFilter.PICKAXE, 'stone_pickaxe')
		.replaceLoot('gold_nugget', 'iron_nugget')
		.replaceLoot('diamond', 'emerald')
})


//summon zombie ~ ~1 ~ {HandItems:[{Count:1,id:diamond_sword}],ArmorItems:[{Count:1,id:diamond_boots},{Count:1,id:diamond_leggings},{Count:1,id:diamond_chestplate},{Count:1,id:pumpkin}]}