ig.module(
    'game.entities.enemy-laser-beam'
).requires(
    'game.entities.laser-beam'
).defines(function() {
    
    EntityEnemyLaserBeam = EntityLaserBeam.extend({
       
        size: {x: 2, y: 6},
        
        type: ig.Entity.TYPE.B,
        
        animSheet: new ig.AnimationSheet( 'media/laser-beam-red.png', 2, 6 ),
        
        damageMultiplier: 10,
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.maxVel.y = 150;
            this.vel.y = 150;
        },

        collidedWithPlayer: function( player ) {
            // Laser Blows Up
            ig.game.spawnEntity( EntityExplosion, this.pos.x - 8, this.pos.y );

            // Player Takes Damage
            player.damageExplosionSound.play();
            player.receiveDamage( this.damageMultiplier, this );

            // Cleanup
            this.kill();
        }

    })
    
});
