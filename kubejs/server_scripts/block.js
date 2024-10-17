BlockEvents.broken(event => {
    let block = event.block.id
    if (block == 'minecraft:ender_chest') {
        event.block.set('air')
        event.cancel()
    }
})