ig.module(
    'game.entities.enemy-rocket'
).requires(
    'game.entities.laser-beam'
).defines(function() {
    
    EntityEnemyRocket = EntityLaserBeam.extend({
       
        size: {x: 2, y: 6},
        
        type: ig.Entity.TYPE.B,
        
        animSheet: new ig.AnimationSheet( 'media/enemy-rocket.png', 2, 6 ),
        
        damageMultiplier: 50,
        
        init: function( x, y, settings ) {
            this.addAnim('idle', 0.01, [0,1,2]);
            this.parent( x, y, settings );
            this.maxVel.y = 150;
            this.vel.y = 10;
            this.accel.y = 40;
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
