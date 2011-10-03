ig.module(
    'game.entities.weak-tracker-laser-beam'
).requires(
    'game.entities.laser-beam'
).defines(function() {
    
    EntityWeakTrackerLaserBeam = EntityLaserBeam.extend({
        
        size: {x:2, y:6},
        
        type: ig.Entity.TYPE.B,
        
        animSheet: new ig.AnimationSheet( 'media/pink-bullets.png', 2, 6 ),
        
        damageMultiplier: 15,
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.vel.y = 200;
        },

        collidedWithPlayer: function( player ) {
            // Laser Blows Up
            ig.game.spawnEntity( EntityExplosion, this.pos.x - 8, this.pos.y );

            // Player Takes Damage
            player.damageExplosionSound.play();
            player.receiveDamage( Math.ceil( Math.random() * this.damageMultiplier), this );

            // Cleanup
            this.kill();
        }
        

    })
    
});
