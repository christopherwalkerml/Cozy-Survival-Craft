EntityEvents.death(event => {
	let index = 0
	event.entity.getAllSlots().forEach(item => {
		let item_str = item.toString()
		if (item_str.contains('iron') || 
				item_str.contains('diamond') ||
				item_str.contains('chainmail')) {
			event.entity.setItemSlot(index, 'minecraft:air')
		}
		index++
	})
})

// these guys should never drop iron+ weapon or tools
