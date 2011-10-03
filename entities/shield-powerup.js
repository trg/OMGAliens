ig.module(
    'game.entities.shield-powerup'
).requires(
    'game.entities.powerup',
    'impact.sound'
).defines(function() {
    
    EntityShieldPowerup = EntityPowerup.extend({

        size: {x:8, y:8},

        animSheet: new ig.AnimationSheet( 'media/shield-powerup.png', 8, 8 ),

        powerUpSound: soundManager.createSound({
            id: 'shieldPowerupSound',
            url: '/arcade/omgaliens/media/audio/shield_powerup.mp3',
            volume: 100
        }),

        type: ig.Entity.TYPE.B,

        init: function( x, y, settings ) {
            this.parent(x, y, settings);
            
            this.vel.x = 0;
            this.vel.y = 50;

            this.addAnim( 'idle', 0.5, [0,1]);

        },

        collidedWithPlayer: function( player ) {

            //debugger; 

            // Play Sound
            this.powerUpSound.play();

            // Heal Player
            player.health = Math.min( 100, player.health + 33);

            // Cleanup
            this.kill();
        }

    })

});
