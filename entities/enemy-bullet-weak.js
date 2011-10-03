ig.module(
    'game.entities.enemy-bullet-weak'
).requires(
    'game.entities.laser-beam'
).defines(function() {
    
    EntityEnemyBulletWeak = EntityLaserBeam.extend({
        
        size: {x:2, y:2},
        
        type: ig.Entity.TYPE.B,
        
        animSheet: new ig.AnimationSheet( 'media/blue-bullet.png', 2, 2 ),
        
        damageMultiplier: 20,
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.vel.y = 180;
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
