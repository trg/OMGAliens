ig.module(
    'game.entities.enemy'
).requires(
    'impact.entity',
    'impact.sound',
 
    'game.entities.explosion'
).defines(function() {
    
    EntityEnemy = ig.Entity.extend({
        
        size: {x:8, y:8},
        
        health: 100,
        
        damageTakenPerShot: 100,

        explosionSound: soundManager.createSound({
            id: 'enemyExplosionSound',
            url: '/arcade/omgaliens/media/audio/explosion1.mp3',
            volume: 100
        }), // new ig.Sound( 'media/audio/explosion1.ogg' ),
        
        checkAgainst: ig.Entity.TYPE.A,
        
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        animSheet: new ig.AnimationSheet( 'media/pink-enemy.png', 8, 8 ),
        
        init: function( x, y, settings ) {
            
            this.parent( x, y, settings );
            
            this.addAnim( 'idle', 0.07, [0,1,2,3]);
            
            this.vel.x = Math.random() * 50 + 50;
            
            if( Math.random() < 0.5) 
                this.vel.x = -1 * this.vel.x;

            this.vel.y = 100;            
        },
        
        update: function() {
            
            this.pos.x = this.pos.x % 248;
            
            if ( this.pos.x <= -80) {
                this.pos.x = 248;
            }
            
            this.parent();
        },
        
        kill: function() {
            ig.game.score++;
            ig.game.spawnEntity( EntityExplosion, this.pos.x, this.pos.y );
            ig.game.enemyKilled();
            this.playExplosionSound();
            this.parent();
        },

        // Enemy Is Destroyed!
        check: function( other ) {
            this.receiveDamage( this.damageTakenPerShot, other );
            other.kill(); // destroy the laser
            this.parent();
        },

        playExplosionSound: function() {
            this.explosionSound.play();
        }
        
    })
    
});
