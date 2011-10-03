ig.module(
    'game.entities.gun-powerup'
).requires(
    'game.entities.powerup',
    'impact.sound'
).defines(function() {
    
    EntityGunPowerup = EntityPowerup.extend({

        size: {x:8, y:8},

        animSheet: new ig.AnimationSheet( 'media/gun-powerup.png', 8, 8 ),

        powerUpSound: soundManager.createSound({
            id: 'powerupSound',
            url: '/arcade/omgaliens/media/audio/shield_powerup.mp3',
            volume: 100
        }),// new ig.Sound( 'media/audio/shield_powerup.ogg' ),

        type: ig.Entity.TYPE.B,

        init: function( x, y, settings ) {
            this.parent(x, y, settings);
            
            this.vel.x = 0;
            this.vel.y = 50;

            this.addAnim( 'idle', 0.5, [0,1]);

        },

        collidedWithPlayer: function( player ) {

            // Play Sound
            this.powerUpSound.play();

            // Level Up Gun
            player.gunLevel++; 
            
            // Cleanup
            this.kill();
        }

    })

});
