ig.module(
    'game.entities.enemy-rainbow-bullet'
).requires(
    'game.entities.laser-beam'
).defines(function() {
    
    EntityEnemyRainbowBullet = EntityLaserBeam.extend({
       
        size: {x: 2, y: 2},
        
        type: ig.Entity.TYPE.B,
        
        animSheet: new ig.AnimationSheet( 'media/rainbow-bullet.png', 2, 2 ),
        
        damageMultiplier: 30,

        init: function( x, y, settings ) {

            this.addAnim( 'idle', 0.1, [0,1,2,3,4,5,6] );

            this.parent( x, y, settings );

            this.maxVel.y = 150;

            this.vel.y = 50 + Math.random() * 100;


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
