ig.module(
    'game.entities.player-ship'
).requires(
    'impact.entity',
    'impact.sound',

    'game.entities.enemy-laser-beam'
).defines(function() {
    
    EntityPlayerShip = ig.Entity.extend({
        
        size: {x:16, y:16},
        
        health: 100,

        canTakeDamage: false,

        gunLevel: 1, // the higher the gunlevel, the better the gun

        shootingSound: soundManager.createSound({
            id: 'playerShootingSound',
            url: '/arcade/omgaliens/media/audio/visco_space_drum_3.mp3',
            volume: 30
        }),

        damageExplosionSound: soundManager.createSound({
            id: 'damageExplosionSound',
            url: '/arcade/omgaliens/media/audio/explosion3.mp3',
            volume: 50
        }),

        deathExplosionSound: soundManager.createSound({
            id: 'deathExplosionSound',
            url: '/arcade/omgaliens/media/audio/explosion2.mp3',
            volume: 100
        }),
        
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        checkAgainst: ig.Entity.TYPE.B,
        
        animSheet: new ig.AnimationSheet( 'media/ship.png', 16, 16 ),
        
        init: function( x, y, settings ) {
            
            this.addAnim( 'idle', 0.5, [0,1]);
            this.addAnim( 'blinking', 0.25, [0,2]);
            
            this.parent( x, y, settings );
            
            // Used for when player has fire button pressed
            this.repeatingShotTimer = new ig.Timer(0.25);
            
            this.maxVel.x = 200;

            this.damageExplosionSound.volume = 0.5;
            
        },
        
        update: function() {
            
            // move left / right
            if ( ig.input.state('left') ) {
                this.vel.x = -100;
            } else if ( ig.input.state('right') ) {
                this.vel.x = 100;
            } else {
                this.vel.x = 0;
            }
            
            // move up down
            if ( this.pos.y > 260 && ig.input.state('up') ) {
                this.vel.y = -50;
            } else if ( this.pos.y < 320 - this.size.y&& ig.input.state('down') ) {
                this.vel.y = 50;
            } else {
                this.vel.y = 0;
            }
            
            // Fire!
            if( ig.input.pressed( 'fire' ) || (ig.input.state( 'fire' ) && this.repeatingShotTimer.delta() > 0) ) {
                this.fireShot();
                this.repeatingShotTimer.reset();
            }
            
            // wrap around x
            this.pos.x = this.pos.x % 248;
            if ( this.pos.x <= -80) {
                this.pos.x = 248;
            }
            
            // move the player ship into view upon spawning
            if( this.pos.y > (320 - this.size.y + 1) ) { // +1 is to prevent boucing
                this.pos.y -= 1;
            } else if (this.canTakeDamage == false) {
                this.canTakeDamage = true;
            }
            
            this.parent();
        },
        
        check: function( other ) {
            if( this.canTakeDamage )
                other.collidedWithPlayer( this );
        },
        
        // Player Killed
        kill: function() {
            ig.game.spawnEntity( EntityExplosion, this.pos.x, this.pos.y );
            
            ig.game.lives--;
            
            if ( ig.game.lives == 0 ) {
                ig.game.gameIsOver();
            } else {
                // respawn
                ig.game.requestRespawn();
            }
            
            this.deathExplosionSound.play();

            this.parent();
        },
        
        fireShot: function() {
            if (this.gunLevel == 1) { // single shot
                ig.game.spawnEntity( EntityPlayerLaserBeam, this.pos.x + this.size.x/2-1, this.pos.y );
            } else if (this.gunLevel == 2) { // double shot
                ig.game.spawnEntity( EntityPlayerLaserBeam, this.pos.x + 2 , this.pos.y );
                ig.game.spawnEntity( EntityPlayerLaserBeam, this.pos.x + this.size.x - 4, this.pos.y );
            } else if (this.gunLevel >= 3) { // tripple shot
                ig.game.spawnEntity( EntityPlayerLaserBeam, this.pos.x + 2 , this.pos.y );
                ig.game.spawnEntity( EntityPlayerLaserBeam, this.pos.x + this.size.x/2-1, this.pos.y - 3 );
                ig.game.spawnEntity( EntityPlayerLaserBeam, this.pos.x + this.size.x - 4, this.pos.y );
            }

            this.shootingSound.play();
        }
        
    })
    
});
