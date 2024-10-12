ServerEvents.tags('item', event => {
    // Get the forge:cobblestone tag collection and add Diamond Ore to it
    event.add('c:helmets', KJ('steel_helmet'))
    event.add('c:armors', KJ('steel_helmet'))
    event.add('c:helmets', KJ('mythril_helmet'))
    event.add('c:armors', KJ('mythril_helmet'))
    event.add('minecraft:trimmable_armor', KJ('mythril_helmet'))

    event.add('c:chestplates', KJ('steel_chestplate'))
    event.add('c:armors', KJ('steel_chestplate'))
    event.add('c:chestplates', KJ('mythril_chestplate'))
    event.add('c:armors', KJ('mythril_chestplate'))
    event.add('minecraft:trimmable_armor', KJ('mythril_chestplate'))

    event.add('c:leggings', KJ('steel_leggings'))
    event.add('c:armors', KJ('steel_leggings'))
    event.add('c:leggings', KJ('mythril_leggings'))
    event.add('c:armors', KJ('mythril_leggings'))
    event.add('minecraft:trimmable_armor', KJ('mythril_leggings'))

    event.add('c:boots', KJ('steel_boots'))
    event.add('c:armors', KJ('steel_boots'))
    event.add('c:boots', KJ('mythril_boots'))
    event.add('c:armors', KJ('mythril_boots'))
    event.add('minecraft:trimmable_armor', KJ('mythril_boots'))

    event.add('c:hoes', KJ('steel_hoe'))
    event.add('c:tools', KJ('steel_hoe'))
    event.add('c:hoes', KJ('mythril_hoe'))
    event.add('c:tools', KJ('mythril_hoe'))

    event.add('c:pickaxes', KJ('steel_pickaxe'))
    event.add('c:tools', KJ('steel_pickaxe'))
    event.add('c:pickaxes', KJ('mythril_pickaxe'))
    event.add('c:tools', KJ('mythril_pickaxe'))

    event.add('c:axes', KJ('steel_axe'))
    event.add('c:tools', KJ('steel_axe'))
    event.add('c:axes', KJ('mythril_axe'))
    event.add('c:tools', KJ('mythril_axe'))

    event.add('c:shovels', KJ('steel_shovel'))
    event.add('c:tools', KJ('steel_shovel'))
    event.add('c:shovels', KJ('mythril_shovel'))
    event.add('c:tools', KJ('mythril_shovel'))

    event.add('c:swords', KJ('steel_sword'))
    event.add('c:tools', KJ('steel_sword'))
    event.add('c:swords', KJ('mythril_sword'))
    event.add('c:tools', KJ('mythril_sword'))
  
    event.add('kubejs:ingot/steel', 'kubejs:steel_ingot')
    event.add('kubejs:sheet/steel', 'kubejs:steel_sheet')
    event.add('kubejs:ingot/mythril', 'kubejs:mythril_ingot')
    event.add('kubejs:sheet/mythril', 'kubejs:mythril_sheet')
    event.add('kubejs:ingot/terra', 'kubejs:terra_ingot')
    event.add('kubejs:sheet/terra', 'kubejs:terra_sheet')

    event.add('minecraft:beacon_payment_items', 'kubejs:steel_ingot')
    event.add('minecraft:beacon_payment_items', 'kubejs:mythril_ingot')
    event.add('minecraft:beacon_payment_items', 'kubejs:terra_ingot')
})