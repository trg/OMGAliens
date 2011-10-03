ig.module(
    'game.entities.powerup'
).requires(
    'impact.entity'
).defines(function() {
    
    EntityPowerup = ig.Entity.extend({
        
        type: ig.Entity.TYPE.B,

        collides: ig.Entity.COLLIDES.PASSIVE

    })

});
